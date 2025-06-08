import { BaseJobSchedulerHandler } from '../BaseJobSchedulerHandler';
import { RenewalValidationMetadata } from '@/app/types/job-scheduler/job-scheduler-types';
import { getLatestRenewalOrderForSubscription } from '@/app/utils/database/controller/renewal_orders/renewal_orders';
import {
    RenewalOrder,
    SubscriptionCadency,
} from '@/app/types/renewal-orders/renewal-orders-types';
import { createOrderDataAudit } from '@/app/utils/database/controller/order_data_audit/order_data_audit_api';
import {
    OrderDataAuditActions,
    OrderDataAuditDescription,
} from '@/app/utils/database/controller/order_data_audit/order_audit_descriptions';
import { addOrRemoveStatusFlags } from '@/app/utils/database/controller/prescription_subscriptions/prescription_subscriptions';
import { SubscriptionStatusFlags } from '@/app/utils/database/controller/prescription_subscriptions/prescription_subscription_enums';
import { updateStripeProduct } from '@/app/(administration)/admin/stripe-api/stripe-api-actions';
import { PrescriptionSubscription } from '@/app/components/patient-portal/subscriptions/types/subscription-types';
import { USStates } from '@/app/types/enums/master-enums';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import { DosageChangeController } from '@/app/utils/classes/DosingChangeController/DosageChangeController';
import { getDosageEquivalenceCodeFromVariantIndex } from '@/app/utils/classes/DosingChangeController/DosageChangeEquivalenceMap';
import { getUserState } from '@/app/utils/database/controller/profiles/profiles';
import { convertBundleVariantToSingleVariant } from '../../pharmacy-helpers/bundle-variant-index-mapping';
import { getPriceDataRecordWithVariant } from '@/app/utils/database/controller/product_variants/product_variants';
import { getPrescriptionSubscription } from '@/app/utils/actions/subscriptions/subscription-actions';

/**
 * RenewalValidationJobHandler
 *
 * This job handler is responsible for validating renewal orders before they are processed.
 * It performs various checks to ensure the renewal order is valid and ready for processing.
 *
 * Key Responsibilities:
 * 1. Obtain renewal orders 7 day prior to the subscription cycle renewing.
 * 2. Check if the renewal is scheduled to update from the legacy system & prevent that if it was impacted
 * 3. Check if the user has completed any check-ins, if not- place an NCI hold on the subscription related to the renewal.
 * 4. Check if the user has completed the dosage selection form, and if not convert the subscription to prepare to become monthly
 *    and set the autoship flag to be true such that the next renewal order becomes a monthyl autoship.
 *
 *  The invoice.upcoming event being delivered to us creates this job for GLP-1 renewals.
 */
export class RenewalValidationJobHandler extends BaseJobSchedulerHandler {
    /**
     * main function
     */
    protected async processJob(): Promise<void> {
        const metadata = this.jobScheduler
            .metadata as RenewalValidationMetadata;
        const subscriptionId = metadata.subscription_id;

        const renewalOrder = await getLatestRenewalOrderForSubscription(
            subscriptionId
        );

        if (!renewalOrder) {
            throw new Error('Renewal order not found');
        }

        const { isValid, flag } = await this.validateRenewalOrder(renewalOrder);

        if (!isValid) {
            if (flag === SubscriptionStatusFlags.NO_CHECK_IN_HOLD) {
                await addOrRemoveStatusFlags(
                    subscriptionId,
                    'add',
                    SubscriptionStatusFlags.NO_CHECK_IN_HOLD
                );
                await addOrRemoveStatusFlags(
                    subscriptionId,
                    'add',
                    SubscriptionStatusFlags.CONVERTED_MONTHLY
                );
            } else {
                await addOrRemoveStatusFlags(subscriptionId, 'add', flag!);
            }

            if (renewalOrder.subscription_type === 'monthly') {
                return;
            } else {
                const subscription = await getPrescriptionSubscription(
                    subscriptionId
                );

                if (!subscription) {
                    throw new Error(
                        'Could not convert renewal-subscription to monthly: Subscription not found'
                    );
                }

                await this.updateQuarterlySubscriptionToMonthly(
                    subscription,
                    renewalOrder
                );
            }
        }

        /**
         * create an audit of the result for the validation.
         */
        await createOrderDataAudit(
            renewalOrder.original_order_id,
            renewalOrder.renewal_order_id,
            `Renewal validation has ${isValid ? 'passed' : 'failed'} ${
                flag && `with flag ${flag}`
            }`,
            OrderDataAuditActions.RenewalValidation,
            {
                isValid: isValid.toString(),
                flag: flag ?? null,
                check_ins: renewalOrder.check_ins,
                dosage_selection_completed:
                    renewalOrder.dosage_selection_completed,
                subscription_id: subscriptionId,
            },
            {}
        );
    }

    /**
     * getNextRetryTime
     *
     * Determines when the job should be retried if it fails.
     * @returns Date - The next time to retry the job
     */
    protected getNextRetryTime(): Date {
        // Retry after 2 hours
        return new Date(Date.now() + 2 * 60 * 60 * 1000);
    }

    /**
     * validateRenewalOrder
     *
     * Helper method to validate the renewal order's status and conditions.
     *
     * @param renewalOrder - The renewal order to validate
     * @returns Promise<boolean> - True if validation passes, false otherwise
     */
    private async validateRenewalOrder(
        renewalOrder: RenewalOrder
    ): Promise<{ isValid: boolean; flag: SubscriptionStatusFlags | null }> {
        /**
         * Steps:
         * 1. Check whether the renewal order's check-ins column has values associated
         * 2. If there are no values associated we will go through with a no-check-in-hold & invoke the to-monthly conversion.
         * 3. If there are check-ins present, we will check for dosage selection completion.
         * 4. If no dosage selection is completed, then we will invoke the to-monthly conversion & add the status_flag.
         * 5. If dosage selection has been completed, we don't need to do anything since dosage selection itself updates the order.
         */

        let hasCheckIns = false;
        let hasDosageSelection = false;

        if (renewalOrder.check_ins) {
            hasCheckIns = Object.keys(renewalOrder.check_ins).length > 0; //this should also make sure the most recent checkin is within 3 months (for biannual/annual patients)
        }

        if (renewalOrder.dosage_selection_completed) {
            hasDosageSelection = renewalOrder.dosage_selection_completed;
        }

        //if there was a problem with updating the checkins colum in the RO upon checkin, then this will incorreclty return NO_CHECK_IN_HOLD
        //so we should add another check that if there are no checkins, we first check manually before we place them in NCI hold. 
        //we know there are certain patients for whom their checkin
        if (!hasCheckIns) {
            return {
                isValid: false,
                flag: SubscriptionStatusFlags.NO_CHECK_IN_HOLD,
            };
        }

        if (!hasDosageSelection) {
            return {
                isValid: false,
                flag: SubscriptionStatusFlags.CONVERTED_MONTHLY,
            };
        }

        return { isValid: true, flag: null };
    }

    private async updateQuarterlySubscriptionToMonthly(
        subscription: PrescriptionSubscription,
        renewalOrder: RenewalOrder
    ) {
        const currentProductVariant = await getPriceDataRecordWithVariant(
            renewalOrder.product_href,
            renewalOrder.variant_index
        );

        let currentVariantIndex = currentProductVariant?.variant_index;
        let currentCadnecy =
            currentProductVariant?.cadence as SubscriptionCadency;

        if (!currentProductVariant) {
            throw new Error(
                'Could not convert renewal-subscription to monthly: Current product variant not found'
            );
        }

        /**
         * Converting the quarterly subscriptions only.
         */
        const equivalenceCode = getDosageEquivalenceCodeFromVariantIndex(
            renewalOrder.product_href as PRODUCT_HREF,
            Number(currentVariantIndex)
        );

        let newVariantIndex = null;

        /**
         * The Dosage Equivalence control logic should technically always find a variant.
         *
         * However if it does not then there is a chance it is a deprecated variant, so we will keep the old function:
         * convertBundleVariantToSingleVariant to do that job.
         *
         * In the future, we may want to change the else clause to a catch all safety net instead.
         */
        if (equivalenceCode) {
            const dosageChangeController = new DosageChangeController(
                subscription.product_href as PRODUCT_HREF,
                equivalenceCode
            );

            const patientState = await getUserState(subscription.patient_id);

            newVariantIndex =
                dosageChangeController.getMonthlyVariantFromEquivalenceWithPVC(
                    patientState.state as USStates
                );
        } else {
            newVariantIndex = convertBundleVariantToSingleVariant(
                subscription.product_href,
                Number(currentVariantIndex)
            );
        }

        await createOrderDataAudit(
            renewalOrder.original_order_id,
            renewalOrder.renewal_order_id,
            OrderDataAuditDescription.BundleConversion,
            OrderDataAuditActions.BundleConversion,
            {
                subscription_id: subscription.id,
                currentVariantIndex: currentVariantIndex,
                currentCadnecy: currentCadnecy,
                newVariantIndex: newVariantIndex,
                renewalOrder: renewalOrder,
            },
            {
                subscription_id: subscription.id,
                newVariantIndex: newVariantIndex,
                hasPaid: false,
            }
        );

        await updateStripeProduct(subscription.id, newVariantIndex, false);
    }
}
