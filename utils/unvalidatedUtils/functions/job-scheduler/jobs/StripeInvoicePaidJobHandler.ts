import { StripeInvoicePaidMetadata } from '@/app/types/job-scheduler/job-scheduler-types';
import {
    BaseJobSchedulerHandler,
    DONT_RETRY_ERROR_MESSAGE,
} from '../BaseJobSchedulerHandler';
import {
    createUpcomingRenewalOrderWithRenewalOrderId,
    getLatestRenewalOrderForSubscription,
    getRenewalOrder,
    updateRenewalOrder,
    updateRenewalOrderStatus,
} from '@/app/utils/database/controller/renewal_orders/renewal_orders';
import {
    getPrescriptionSubscription,
    updatePrescriptionSubscription,
} from '@/app/utils/actions/subscriptions/subscription-actions';
import {
    RenewalOrder,
    RenewalOrderStatus,
    SubscriptionCadency,
} from '@/app/types/renewal-orders/renewal-orders-types';
import {
    createUserStatusTagWAction,
    forwardOrderToEngineering,
    updateStatusTagToResolved,
} from '@/app/utils/database/controller/patient-status-tags/patient-status-tags-api';
import {
    EngineeringQueueNotes,
    StatusTag,
    StatusTagAction,
    StatusTagNotes,
} from '@/app/types/status-tags/status-types';
import { ShippingStatus } from '@/app/types/orders/order-types';
import { PrescriptionSubscription } from '@/app/components/patient-portal/subscriptions/types/subscription-types';
import { getOrderStatusDetails } from '../../renewal-orders/renewal-orders';
import {
    getLastInvoiceBeforeRenewal,
    getStripeInvoice,
    updateStripeProduct,
} from '@/app/(administration)/admin/stripe-api/stripe-api-actions';
import {
    getVariantIndexByPriceIdV2,
    getSingleProductVariantCadence,
} from '@/app/utils/database/controller/products/products';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import { getPriceDataRecordWithVariant } from '@/app/utils/database/controller/product_variants/product_variants';
import { getPatientInformationById } from '@/app/utils/actions/provider/patient-overview';
import { getEligiblePharmacy } from '@/app/components/provider-portal/intake-view/v2/components/containers/utils/approval-pharmacy-scripts/approval-pharmacy-product-map';
import {
    createNewAutoRenewalJob,
    createNewSendPrescriptionJob,
} from '@/app/utils/database/controller/job-scheduler/job-scheduler-actions';
import {
    convertBundleVariantToSingleVariant,
    shouldConvertBundleSubscriptionToMonthly,
} from '../../pharmacy-helpers/bundle-variant-index-mapping';
import { AUTO_STATUS_CHANGER_UUID } from '@/app/services/pharmacy-integration/provider-static-information';
import { triggerEvent } from '@/app/services/customerio/customerioApiFactory';
import {
    NON_WL_CHECKIN_INCOMPLETE,
    WL_CHECKIN_INCOMPLETE,
} from '@/app/services/customerio/event_names';
import { isWeightlossProduct } from '../../pricing';
import { sendRenewalCurexaOrder } from '@/app/services/pharmacy-integration/curexa/curexa-actions';
import { sendRenewalOrderToEmpower } from '@/app/services/pharmacy-integration/empower/send-script';
import { sendGGMRenewalRequest } from '@/app/services/pharmacy-integration/gogomeds/ggm-actions';
import { sendRenewalOrderToTMC } from '@/app/services/pharmacy-integration/tmc/tmc-actions';
import {
    getLastestActionItemForProduct,
    updateActionItem,
} from '@/app/utils/database/controller/action-items/action-items-actions';
import {
    getMonthlyGlp1Dosage,
    GLP1_MONTHLY_VARIANTS_BY_PRODUCT_AND_DOSAGE,
} from '@/app/components/provider-portal/intake-view/v2/components/intake-response-column/adjust-dosing-dialog/dosing-mappings';
import {
    getLastCheckInFormSubmission,
    isWithinLastThreeMonths,
} from '@/app/utils/actions/check-up/check-up-actions';
import {
    createOrderDataAudit,
    getLatestDosageSelectionForRenewalOrder,
} from '@/app/utils/database/controller/order_data_audit/order_data_audit_api';
import {
    OrderDataAuditActions,
    OrderDataAuditDescription,
} from '@/app/utils/database/controller/order_data_audit/order_audit_descriptions';
import { Status } from '@/app/types/global/global-enumerators';
import { WEIGHT_LOSS_PRODUCT_HREF } from '@/app/components/intake-v2/constants/constants';
import { DosageChangeController } from '@/app/utils/classes/DosingChangeController/DosageChangeController';
import { getDosageEquivalenceCodeFromVariantIndex } from '@/app/utils/classes/DosingChangeController/DosageChangeEquivalenceMap';
import { getUserState } from '@/app/utils/database/controller/profiles/profiles';
import { USStates } from '@/app/types/enums/master-enums';
import { addOrRemoveStatusFlags } from '@/app/utils/database/controller/prescription_subscriptions/prescription_subscriptions';
import { SubscriptionStatusFlags } from '@/app/utils/database/controller/prescription_subscriptions/prescription_subscription_enums';


//TODO to enable the NO_CHECK_IN_HOLD_PENDING_DS -> dosage selection completed flow 
//1. Enable hasPaid works in updateStripeProduct - maybe just let it go to eng queue for now until we are sure the other stuff is working....
//2. Synchronize how the NCI flag is being added to the subscription in the RenewalValidationJobHandler and how NCI status is determined in the updateOrderStatusAfterPaidAndSendScript function
//   both should be based on looking at the checkins-column and if null, then the patient_action_history. 
//   - The problem is that the RenewalValidationJobHandler looks at the check_ins column of the renwewal order to determine whether the patient should be put in NCI hold
//   - whereas the updateOrderStatusAfterPaidAndSendScript function looks at the order status to determine whether the patient should be in NCI hold
//   - ideally both should just look at patient_action_history to find whether the most recent checkin-submitted event was within the last 3 months
//      but what about the 7 day delay between the two? maybe the invoicePaidjob should look 3 months+7 days in the past for a checkin-submitted event?
//   Because I know there are patients who are mistakenly inside NCI-hold, if we base the NCI status on the patient_action_history, this would make it such 
//   that NCI hold/converted-monthly are really for display only, whereas the other flags actually do stuff.

//   Should be good to push the changes now and rely on the old system to make sure stuff is working correctly.

/**
 * StripeInvoicePaidJobHandler
 *
 * The processJob function is executed via supabase cron
 * It will eventually send the prescription to the pharmacy for the renewal, updating data along the way
 *
 *  The most common order of methods that get called in this class is:
 *  handleWeightlossRenewal -> denoteRenewalOrderAsAutoShippedIfApplicable -> checkIsMatchingOrder -> updateOrderStatusAfterPaidAndSendScript
 *
 */
export class StripeInvoicePaidJobHandler extends BaseJobSchedulerHandler {
    protected async processJob(): Promise<void> {
        const metadata = this.jobScheduler
            .metadata as StripeInvoicePaidMetadata;

        let renewalOrder = await getRenewalOrder(metadata.order_id);

        if (!renewalOrder) {
            throw new Error(
                `Could not find renewal order for StripeInvoicePaidJob ${metadata.order_id}`
            );
        }

        const subscription = await getPrescriptionSubscription(
            renewalOrder.subscription_id
        );

        if (!subscription) {
            throw new Error(
                `Could not find subscription for send prescription job ${metadata.order_id}`
            );
        }

        if (isWeightlossProduct(renewalOrder.product_href)) {
            await this.handleWeightlossRenewal(
                renewalOrder,
                subscription,
                metadata
            );
        } else {
            // Handle non weightloss products
            await this.handleNonWeightlossRenewal(renewalOrder, subscription);
        }
    }

    /**
     *
     * handleWeightlossRenewal
     *
     * Called when an InvoicePaid event job is processed
     * updateStripeProduct should run correctly prior to this because it will update the stripe subscription upon refill dosage-selection...
     * ...then, once their stripe subscription renewal comes up, stripe should charge them the new price for the new variant they selected
     * @param baseRenewalOrder
     * @param subscription
     * @param metadata
     */
    private async handleWeightlossRenewal(
        baseRenewalOrder: RenewalOrder,
        subscription: PrescriptionSubscription,
        metadata: StripeInvoicePaidMetadata
    ) {
        let renewalOrder: RenewalOrder | null = baseRenewalOrder;

        // const passesSafeguard = await this.check48HourSafeGuard(renewalOrder); - can we delete this?
        // if (!passesSafeguard) {
        //     // throw new Error(DONT_RETRY_ERROR_MESSAGE);
        // }

        // 1. Correct the renewal order if is out of place
        if (
            [
                RenewalOrderStatus.PharmacyProcessing,
                RenewalOrderStatus.Unknown,
            ].includes(renewalOrder.order_status) ||
            [ShippingStatus.Shipped, ShippingStatus.Delivered].includes(
                renewalOrder.shipping_status as ShippingStatus
            )
        ) {
            renewalOrder = await this.correctOutofPlaceRenewalOrder(
                renewalOrder
            );

            if (
                !renewalOrder ||
                renewalOrder.order_status ===
                    RenewalOrderStatus.PharmacyProcessing
            ) {
                await forwardOrderToEngineering(
                    renewalOrder?.renewal_order_id ||
                        String(subscription.order_id),
                    renewalOrder?.customer_uuid,
                    EngineeringQueueNotes.InvalidLatestRenewalOrderState
                );
                throw new Error(DONT_RETRY_ERROR_MESSAGE);
            }
        }

        // 2. Get the price id of the product being paid for from the invoice
        const currentInvoice = await getStripeInvoice(metadata.invoice_id);
        const totalLines = currentInvoice.lines.data.length;
        const currentPriceId =
            currentInvoice.lines.data[totalLines - 1].price?.id;
        if (!currentPriceId) {
            await forwardOrderToEngineering(
                renewalOrder.renewal_order_id,
                renewalOrder.customer_uuid,
                EngineeringQueueNotes.CurrentPriceIdNotFound
            );
            throw new Error(DONT_RETRY_ERROR_MESSAGE);
        }

        // 3. Check if this order should be considered as 'autoshipped' and whether the autoshipped macro should be sent
        let shouldSkipMatchingCheck: boolean = false;
        try {
            if (WEIGHT_LOSS_PRODUCT_HREF.includes(renewalOrder.product_href)) {
                const { renewalOrder: mutatedRenewalOrder, skipMatchingCheck } =
                    await this.denoteRenewalOrderAsAutoShippedIfApplicable(
                        renewalOrder,
                        currentPriceId,
                        metadata.stripe_subscription_id,
                        metadata.invoice_id
                    );
                renewalOrder = mutatedRenewalOrder;
                shouldSkipMatchingCheck = skipMatchingCheck;
            }
        } catch (error: any) {
            await forwardOrderToEngineering(
                renewalOrder.renewal_order_id,
                renewalOrder.customer_uuid,
                'Quarterly to Monthly Autoship check error: ' + error.message
            );
            throw new Error(DONT_RETRY_ERROR_MESSAGE);
        }

        /**
         * Make sure that the variant index that corresponds to the price ID in the invoice matches the variant index of the renewal order
         */
        const productVariantBasedOnPriceId = await getVariantIndexByPriceIdV2(
            renewalOrder.product_href as PRODUCT_HREF, //retrieved using the order id in the job's metadata
            currentPriceId //retrieved from the invoice
        );

        const variantIndexBasedOnPriceId =
            productVariantBasedOnPriceId.variant_index;
        const cadenceBasedOnPriceId = productVariantBasedOnPriceId.cadence;

        try {
            if (!shouldSkipMatchingCheck) {
                const resp = await this.checkIsMatchingOrder(
                    Number(variantIndexBasedOnPriceId),
                    cadenceBasedOnPriceId as SubscriptionCadency,
                    renewalOrder
                );

                if (resp.shouldExit) {
                    return;
                }
                renewalOrder = resp.renewalOrder;
            }
        } catch (error: any) {
            await forwardOrderToEngineering(
                renewalOrder.renewal_order_id,
                renewalOrder.customer_uuid,
                'checkIsMatchingOrder issue caught. Did updateStripeProduct fail after dosage selection?: ' +
                    error.message
            );
            throw new Error(DONT_RETRY_ERROR_MESSAGE);
        }
        // 6. Handle updating order status appropriately
        try {
            await this.updateOrderStatusAfterPaidAndSendScript(
                renewalOrder,
                subscription,
                metadata.invoice_id,
                currentPriceId
            );
        } catch (error: any) {
            await forwardOrderToEngineering(
                renewalOrder.renewal_order_id,
                renewalOrder.customer_uuid,
                'update order status after paid issue caught: ' + error.message
            );
            throw new Error(DONT_RETRY_ERROR_MESSAGE);
        }

        const latestActionItem = await getLastestActionItemForProduct(
            renewalOrder.customer_uuid,
            renewalOrder.product_href
        );

        if (latestActionItem?.active === true) {
            await updateActionItem(latestActionItem?.id, {
                active: false,
            });
        }
    }

    // To determine if the product that the patient paid for is the 'equivalent' to what we expect them to receive.
    // By 'equivalent', I mean paying for a 0.5mg semaglutide empower product should 'match' for our 0.5 semaglutide hallandale variant index

    // stripeVariantIndex: variantIndex from stripe price id they paid for

    private async confirmOrderWithDosageSelection(
        renewalOrder: RenewalOrder
    ): Promise<{ renewalOrder: RenewalOrder; shouldExit: boolean }> {
        const dosageSelectionAudit =
            await getLatestDosageSelectionForRenewalOrder(
                renewalOrder.renewal_order_id
            );

        if (!dosageSelectionAudit) {
            throw new Error(EngineeringQueueNotes.InvalidMatch);
        }

        const dosageSelectionVariantIndex =
            dosageSelectionAudit.metadata['selectedVariantIndex'];

        if (!dosageSelectionVariantIndex) {
            throw new Error(
                'Could not find selectedVariantIndex in match check'
            );
        }

        const status = await updateStripeProduct(
            renewalOrder.subscription_id,
            dosageSelectionVariantIndex,
            true
        );

        if (status === Status.Success) {
            const newPharmacy = getEligiblePharmacy(
                renewalOrder.product_href,
                dosageSelectionVariantIndex
            );

            //verify the cadence based on the variant index and product href
            const newCadence = await getSingleProductVariantCadence(
                renewalOrder.product_href,
                dosageSelectionVariantIndex,
                'prod'
            );

            if (!newPharmacy || !newCadence) {
                throw new Error('Could not get newPharmacy or newCadence');
            }

            renewalOrder = {
                ...renewalOrder,
                assigned_pharmacy: newPharmacy,
                subscription_type: newCadence as SubscriptionCadency,
                variant_index: dosageSelectionVariantIndex,
            };

            await updateRenewalOrder(renewalOrder.id, {
                variant_index: dosageSelectionVariantIndex,
                subscription_type: newCadence as SubscriptionCadency,
                assigned_pharmacy: newPharmacy,
            });
            return { renewalOrder, shouldExit: true };
        } else {
            throw new Error(
                'Failed to updateStripeProduct for checkIsMatchingOrder'
            );
        }
    }

    /**
     * checkIsMatchingOrder
     * For multi-month offers, just makes sure the stripeVariantIndex equals the renewal order's variant index
     * For monthly offers
     * @param stripeVariantIndex
     * @param stripeCadency
     * @param renewalOrder
     * @returns
     */
    private async checkIsMatchingOrder(
        stripeVariantIndex: number,
        stripeCadency: SubscriptionCadency,
        renewalOrder: RenewalOrder
    ): Promise<{ renewalOrder: RenewalOrder; shouldExit: boolean }> {
        // TODO: Add support for biannual
        const product_href = renewalOrder.product_href as
            | PRODUCT_HREF.SEMAGLUTIDE
            | PRODUCT_HREF.TIRZEPATIDE;
        if (stripeCadency === SubscriptionCadency.Monthly) {
            const dosage = getMonthlyGlp1Dosage(
                product_href,
                stripeVariantIndex
            );
            if (!dosage) {
                throw new Error(
                    `Could not find dosage for matching ${product_href} ${stripeVariantIndex}`
                );
            }

            const variantIndexesWithForDosage =
                GLP1_MONTHLY_VARIANTS_BY_PRODUCT_AND_DOSAGE[product_href][
                    dosage as keyof (typeof GLP1_MONTHLY_VARIANTS_BY_PRODUCT_AND_DOSAGE)[typeof product_href]
                ] as number[];

            if (
                variantIndexesWithForDosage.includes(renewalOrder.variant_index)
            ) {
                return { renewalOrder, shouldExit: false };
            } else {
                throw new Error(
                    `Variant Mismatch. Stripe Cadency: ${stripeCadency}. Stripe Variant Index: ${stripeVariantIndex}. Renewal Order Variant Index: ${renewalOrder.variant_index}.`
                );
                // return await this.confirmOrderWithDosageSelection(renewalOrder);
            }
        } else if (
            stripeCadency === SubscriptionCadency.Quarterly ||
            stripeCadency === SubscriptionCadency.Biannually ||
            stripeCadency === SubscriptionCadency.Annually
        ) {
            if (stripeVariantIndex !== renewalOrder.variant_index) {
                throw new Error(
                    `Variant Mismatch. Stripe Cadency: ${stripeCadency}. Stripe Variant Index: ${stripeVariantIndex}. Renewal Order Variant Index: ${renewalOrder.variant_index}.`
                );
                // return await this.confirmOrderWithDosageSelection(renewalOrder);
            } else {
                return { renewalOrder, shouldExit: false };
            }
        } else {
            throw new Error(
                `Unknown Cadency for isMatchingOrder ${stripeCadency} ${stripeVariantIndex}`
            );
        }
    }

    private async handleNonWeightlossRenewal(
        renewalOrder: RenewalOrder,
        subscription: PrescriptionSubscription
    ) {
        if (!usedAllRefills(subscription)) {
            await this.handlePharmacyRenewal(subscription, renewalOrder);
        } else {
            await triggerEvent(
                subscription.patient_id,
                NON_WL_CHECKIN_INCOMPLETE
            );

            await updateRenewalOrderStatus(
                renewalOrder.id,
                RenewalOrderStatus.CheckupIncomplete_Unprescribed_Paid
            );
        }
    }

    protected getNextRetryTime(): Date {
        // Custom retry interval for SendPrescriptionJob (e.g., 3 hours)
        return new Date(Date.now() + 1 * 60 * 60 * 1000);
    }

    private async check48HourSafeGuard(
        renewalOrder: RenewalOrder
    ): Promise<boolean> {
        const createdAt = new Date(renewalOrder.created_at);
        const now = new Date();
        const hoursSinceCreation =
            (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
        if (hoursSinceCreation <= 48 && renewalOrder.source != 'manual') {
            await forwardOrderToEngineering(
                renewalOrder.renewal_order_id,
                renewalOrder.customer_uuid,
                EngineeringQueueNotes.SafeGuardMessage
            );
            return false;
        }
        return true;
    }

    // Create new renewal order if for some reason it wasn't already created for the patient
    private async correctOutofPlaceRenewalOrder(
        renewalOrder: RenewalOrder
    ): Promise<RenewalOrder | null> {
        await createUpcomingRenewalOrderWithRenewalOrderId(
            renewalOrder.renewal_order_id
        );

        const newRenewalOrder = await getLatestRenewalOrderForSubscription(
            renewalOrder.subscription_id
        );

        return newRenewalOrder;
    }

    private async handlePharmacyRenewal(
        subscription: PrescriptionSubscription,
        renewalOrder: RenewalOrder
    ) {
        switch (subscription.assigned_pharmacy) {
            case 'curexa':
                await sendRenewalCurexaOrder(subscription, renewalOrder);
                break;
            case 'ggm':
                await sendGGMRenewalRequest(subscription, renewalOrder);
                break;
            case 'tmc':
                await sendRenewalOrderToTMC(subscription, renewalOrder);
                break;
            case 'empower':
                await sendRenewalOrderToEmpower(subscription, renewalOrder);
                break;
            default:
                break;
        }
    }

    // Detect if this is an autoshipped quarterly -> monthly order, and if so, process accordingly
    private async denoteRenewalOrderAsAutoShippedIfApplicable(
        renewalOrder: RenewalOrder,
        currentPriceId: string, //the price id of the product being paid for in the InvoicePaid event
        stripe_subscription_id: string,
        currentInvoiceId: string
    ): Promise<{ renewalOrder: RenewalOrder; skipMatchingCheck: boolean }> {
        let mutatedRenewalOrder = renewalOrder;

        const orderStatusDetails = getOrderStatusDetails( //<-- should deprecate this!
            mutatedRenewalOrder.order_status
        );

        //find the price id of the invoice PRIOR to this invoice being handled in the StripeInvoicePaidJobHandler
        const lastPriceIdPaidFor = await getLastInvoiceBeforeRenewal(
            stripe_subscription_id,
            currentInvoiceId
        );
        if (!lastPriceIdPaidFor || !currentPriceId) {
            throw new Error(
                EngineeringQueueNotes.LastPriceIdNotFound +
                    ' for stripe subscription id ' +
                    stripe_subscription_id +
                    ' on invoice id ' +
                    currentInvoiceId
            );
        }

        /*
        * 
        *  Using stripe data, we'll find info about the offer the patient just paid for and info about the offer they paid for in their previous invoice.
        *  We'll then compare the two offers to determine...
        * 
        */
        //find the variant index of the price that was paid for in the current invoice that triggered this job
        const currentVariantIndex = await getVariantIndexByPriceIdV2(
            mutatedRenewalOrder.product_href as PRODUCT_HREF,
            currentPriceId
        );
        //find the variant index of the price that was paid for in the last invoice PRIOR to this invoice being handled in the StripeInvoicePaidJobHandler
        const lastVariantIndexPaidFor = await getVariantIndexByPriceIdV2(
            mutatedRenewalOrder.product_href as PRODUCT_HREF,
            lastPriceIdPaidFor
        );
        //get the 'product_variants' table record associated with the last variant index that was paid for PRIOR to this invoice being handled in the StripeInvoicePaidJobHandler
        const lastPriceDataPaidFor = await getPriceDataRecordWithVariant(
            mutatedRenewalOrder.product_href,
            lastVariantIndexPaidFor.variant_index
        );
        //get the 'product_variants' table record associated with the current variant index that is being paid for
        const currentPriceData = await getPriceDataRecordWithVariant(
            mutatedRenewalOrder.product_href,
            currentVariantIndex.variant_index
        );
        if (!currentPriceData) {
            throw new Error(
                'currentPriceData not found inside denoteRenewalOrderAsAutoShippedIfApplicable for ' +
                    mutatedRenewalOrder.product_href +
                    ' on variant index ' +
                    currentVariantIndex.variant_index
            );
        }
        if (!lastPriceDataPaidFor) {
            throw new Error(
                'lastPriceDataPaidFor not found inside denoteRenewalOrderAsAutoShippedIfApplicable for ' +
                    mutatedRenewalOrder.product_href +
                    ' on variant index ' +
                    lastVariantIndexPaidFor.variant_index
            );
        }

        // We consider an order to be 'autoshipped' if:
        // 1. Second last invoice is multi-month and the current invoice is monthly
        // 2. They have completed a check-in form within the last 3 months
        // 3. They did not complete dosage selection form
        if (
            lastPriceDataPaidFor.cadence === SubscriptionCadency.Quarterly ||
            lastPriceDataPaidFor.cadence === SubscriptionCadency.Biannually ||
            lastPriceDataPaidFor.cadence === SubscriptionCadency.Annually
        ) {
            if (!orderStatusDetails.isCheckupComplete) {
                //the idea here is that if the order status indicates that the patient has not completed a checkin, then don't modify the renewal order being paid for + ?skip the matching check?
                return {
                    renewalOrder: mutatedRenewalOrder,
                    skipMatchingCheck: true,
                };
            } else if ( //the idea behind this extra check for biannual/annual patients is that in those cases isCheckupComplete could be true, but the patient still may not have completed a checkin within the last 3 months
                lastPriceDataPaidFor.cadence ===
                    SubscriptionCadency.Biannually ||
                lastPriceDataPaidFor.cadence === SubscriptionCadency.Annually
            ) {
                const lastCheckin = await getLastCheckInFormSubmission(
                    renewalOrder.customer_uuid,
                    renewalOrder.product_href as PRODUCT_HREF
                );
                if (lastCheckin) {
                    if (
                        !(await isWithinLastThreeMonths(
                            lastCheckin?.submission_time
                        ))
                    ) {
                        //if the patient has not completed a checkin within the last 3 months, then don't modify the renewal order being paid for + ?skip the matching check?
                        return {
                            renewalOrder: mutatedRenewalOrder,
                            skipMatchingCheck: true,
                        };
                    }
                }
            }

            //if we haven't returned yet by now, that means the patient has completed a checkin within the last 3 months
            if (
                currentPriceData.cadence === SubscriptionCadency.Monthly &&
                !renewalOrder.dosage_selection_completed //so if they haven't done dosage selection, this becomes an AUTOSHIP situation
            ) {
                //If this is an autoship situation, then we update their renewal order/prescription_subscription and return the updated renewal order
                const { data: patientData, error: patientDataError } =
                    await getPatientInformationById(
                        mutatedRenewalOrder.customer_uuid
                    );
                if (patientDataError || !patientData) {
                    throw new Error(
                        EngineeringQueueNotes.PatientDataNotFound +
                            ' for customer uuid ' +
                            mutatedRenewalOrder.customer_uuid
                    );
                }

                const pharmacy = getEligiblePharmacy(
                    mutatedRenewalOrder.product_href,
                    Number(currentVariantIndex.variant_index)
                );

                await createNewAutoRenewalJob(
                    mutatedRenewalOrder.customer_uuid //the only purpose of this job right now (may 6 2025) is to send the autoship macro 
                );

                await updateRenewalOrder(mutatedRenewalOrder.id, {
                    variant_index: Number(currentVariantIndex.variant_index),
                    subscription_type: SubscriptionCadency.Monthly,
                    assigned_pharmacy: pharmacy,
                    order_status:
                        RenewalOrderStatus.CheckupComplete_Prescribed_Unpaid,
                    prescription_json: null,
                    autoshipped: true, //update the renewal order that is being paid for to be 'autoshipped' - NOT the next renewal order that gets created after the script is sent
                });

                await updatePrescriptionSubscription(
                    mutatedRenewalOrder.subscription_id,
                    {
                        variant_text: currentPriceData.variant,
                        subscription_type: SubscriptionCadency.Monthly,
                        price_id: currentPriceId,
                        assigned_pharmacy: pharmacy,
                    }
                );

                mutatedRenewalOrder = {
                    ...renewalOrder,
                    variant_index: Number(currentVariantIndex.variant_index),
                    subscription_type: SubscriptionCadency.Monthly,
                    assigned_pharmacy: pharmacy!,
                    order_status:
                        RenewalOrderStatus.CheckupComplete_Prescribed_Unpaid,
                    prescription_json: null,
                };
            }
        } // end of 'if lastPriceDataPaidFor.cadence is quarterly/biannual/annually' - so if it's monthly to monthly, don't just return the renewal order as is

        return { renewalOrder: mutatedRenewalOrder, skipMatchingCheck: false };
    }

    private async updateQuarterlySubscriptionToMonthly(
        subscription: PrescriptionSubscription,
        currentPriceId: string,
        renewalOrder: RenewalOrder
    ) {
        const currentProductVariant = await getVariantIndexByPriceIdV2(
            subscription.product_href as PRODUCT_HREF,
            currentPriceId
        );

        const shouldConvert = shouldConvertBundleSubscriptionToMonthly(
            subscription.product_href as PRODUCT_HREF,
            Number(currentProductVariant.variant_index)
        );

        if (!shouldConvert) {
            return;
        }

        const currentCadnecy =
            currentProductVariant.cadence as SubscriptionCadency;

        if (
            currentCadnecy === SubscriptionCadency.Quarterly ||
            currentCadnecy === SubscriptionCadency.Biannually ||
            currentCadnecy === SubscriptionCadency.Annually
        ) {
            const equivalenceCode = getDosageEquivalenceCodeFromVariantIndex(
                subscription.product_href as PRODUCT_HREF,
                Number(currentProductVariant.variant_index)
            );

            let newVariantIndex = null;

            if (equivalenceCode) {
                const dosageChangeController = new DosageChangeController(
                    subscription.product_href as PRODUCT_HREF,
                    equivalenceCode
                );

                const patientState = await getUserState(
                    subscription.patient_id
                );

                newVariantIndex =
                    dosageChangeController.getMonthlyVariantFromEquivalenceWithPVC(
                        patientState.state as USStates
                    );
            } else {
                newVariantIndex = convertBundleVariantToSingleVariant(
                    subscription.product_href,
                    Number(currentProductVariant.variant_index)
                );
            }

            await createOrderDataAudit(
                renewalOrder.original_order_id,
                renewalOrder.renewal_order_id,
                OrderDataAuditDescription.BundleConversion,
                OrderDataAuditActions.BundleConversion,
                {
                    subscription_id: subscription.id,
                    currentVariantIndex: currentProductVariant.variant_index,
                    currentCadnecy: currentCadnecy,
                    newVariantIndex: newVariantIndex,
                    currentPriceId: currentPriceId,
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


    /*
    *
    * updateOrderStatusAfterPaidAndSendScript
    *
    * This method updates the order status and generates and/or sends a script to pharmacy IF the check-in conditions are met. 
    * This function uses order statuses to determine whether that checkin condition is met, which is not ideal. 
    * TODO: It would be best to check the check-ins column of the RO and the patient_action_history table to determine the checkin conditions.
    *
    *
    */
    private async updateOrderStatusAfterPaidAndSendScript(
        renewalOrder: RenewalOrder,
        subscription: PrescriptionSubscription,
        invoiceId: string,
        currentPriceId: string
    ) {
        /** 
        * If they haven't completed any check-ins within the length of their subscription OR
        * if they haven't completed a checkin within the last 3 months, then we go from
        * NO_CHECK_IN_HOLD to NO_CHECK_IN_HOLD_CHARGED and we trigger the WL_CHECKIN_INCOMPLETE event. No script is sent!
        */
        const lastestCheckIn = renewalOrder?.check_ins && Object.keys(renewalOrder?.check_ins ?? {}).length > 0
            ? renewalOrder.check_ins[Object.keys(renewalOrder?.check_ins).length - 1]
            : undefined;
        if (
            !renewalOrder?.check_ins || Object.keys(renewalOrder?.check_ins ?? {}).length === 0 || 
            (lastestCheckIn && lastestCheckIn < new Date(Date.now() - (3 * 30 * 24 * 60 * 60 * 1000)))
        ) {
            if (!subscription?.status_flags?.includes(SubscriptionStatusFlags.NO_CHECK_IN_HOLD)) {
                await forwardOrderToEngineering(
                    String(subscription.order_id),
                    subscription.patient_id,
                    'Someone with no check-ins did not have an NCI flag.'
                );
            }
            await addOrRemoveStatusFlags(
                subscription.id,
                'remove',
                SubscriptionStatusFlags.NO_CHECK_IN_HOLD
            ); //should really just make a new function for this double call
            await addOrRemoveStatusFlags(
                subscription.id,
                'add',
                SubscriptionStatusFlags.NO_CHECK_IN_HOLD_CHARGED
            );
            await triggerEvent(
                renewalOrder.customer_uuid,
                WL_CHECKIN_INCOMPLETE,
                {
                    checkin_url: `https://app.gobioverse.com/check-up/${subscription.product_href}`,
                    order_id: renewalOrder.renewal_order_id,
                }
            );
            return; //return without sending a script
        }

        switch (renewalOrder.order_status) {
            case RenewalOrderStatus.Scheduled_Admin_Cancel:
            case RenewalOrderStatus.Scheduled_Cancel:
                throw new Error('Canceled order paid');
                // Monthly patients who failed payment but eligible for refill w/o check-in
                // Just send last used script
                break;
            case RenewalOrderStatus.CheckupWaived_Unprescribed_Unpaid:
                if (
                    renewalOrder.subscription_type ===
                        SubscriptionCadency.Quarterly ||
                    renewalOrder.subscription_type ===
                        SubscriptionCadency.Biannually ||
                    renewalOrder.subscription_type ===
                        SubscriptionCadency.Annually
                ) {
                    throw new Error(
                        'Attempted to sent automatic script for quarterly - blocked'
                    );
                }

                console.log("SENDING LAST USED SCRIPT 1")
                await this.sendLastUsedScript(
                    renewalOrder,
                    subscription,
                    invoiceId
                );
                break;
            // Gets set to this order status WHEN:
            // 1. They complete dosage selection form
            // 2. Provider 'prescribes' via the approve-script-dialog and they were unpaid at the time
            case RenewalOrderStatus.CheckupComplete_Prescribed_Unpaid:
            case RenewalOrderStatus.CheckupComplete_Prescribed_Unpaid_1:
            case RenewalOrderStatus.CheckupComplete_Prescribed_Unpaid_2:
                console.log("SENDING SCRIPT FOR CURRENT RENEWAL ORDER 1")
                //this is the most common one to be run
                await this.sendScriptForCurrentRenewalOrder(
                    renewalOrder,
                    invoiceId
                );
                break;
            // Unprescribed: Can mean 2 things
            // 1. They have not been reviewed by a provider yet (ie. they just completed a check-in and pending review)
            // 1a. It's a quarterly subscription, they have been reviewed by a provider, but only in months 1-2.
            // We need to consider
            // 1. Have they completed the dosage selection form?
            // 1a. If dosage selection form IS completed:
            //   order_status converts CheckupComplete-Prescribed-Unpaid
            // Completing a check-in form ALWAYS converts the order_status to: CheckupComplete_Unprescribed_XXXX
            // Post completing check-in form, order_status is updated and statusTag set to 'Review'

            case RenewalOrderStatus.CheckupComplete_Unprescribed_Unpaid:
            case RenewalOrderStatus.CheckupComplete_Unprescribed_Unpaid_1:
            case RenewalOrderStatus.CheckupComplete_Unprescribed_Unpaid_2:
                // Only hits this case if they complete a check-in form AFTER completing dosage selection
                if (renewalOrder.dosage_selection_completed) {
                    console.log("SENDING SCRIPT FOR CURRENT RENEWAL ORDER 2")
                    await this.sendScriptForCurrentRenewalOrder(
                        renewalOrder,
                        invoiceId
                    );
                    // Tag ProviderMessage as this means they completed dosage selection
                    // form and then completed a check-in before their subscription renewed, so the provider still needs to review their check in form
                    await createUserStatusTagWAction(
                        StatusTag.ProviderMessage,
                        renewalOrder.renewal_order_id,
                        StatusTagAction.REPLACE,
                        renewalOrder.customer_uuid,
                        StatusTagNotes.ProviderMessage,
                        AUTO_STATUS_CHANGER_UUID,
                        [StatusTag.ProviderMessage]
                    );
                } else {
                    // Dosage selection form is not completed
                    // Possible cases:
                    // 1. Patient never completed dosage selection form
                    // 1a. Quarterly: Send autoship monthly vial
                    // 1b. Monthly: Send last month's script
                    // 2. Quarterly patient who only a completed a month 1 check-in
                    // 3. Provider hasn't gotten to reviewing the patient's check-in
                    if (
                        renewalOrder.subscription_type ===
                        SubscriptionCadency.Monthly
                    ) {
                        console.log("SENDING LAST USED SCRIPT 3")
                        await this.sendLastUsedScript(
                            renewalOrder,
                            subscription,
                            invoiceId
                        );
                    } else if (
                        renewalOrder.subscription_type ===
                            SubscriptionCadency.Quarterly ||
                        renewalOrder.subscription_type ===
                            SubscriptionCadency.Biannually ||
                        renewalOrder.subscription_type ===
                            SubscriptionCadency.Annually
                    ) {
                        throw new Error(
                            EngineeringQueueNotes.QuarterlySubscriptionUnprescribed
                        );
                    }
                }
                break;
            case RenewalOrderStatus.CheckupIncomplete_Unprescribed_Unpaid: //THESE STATUSES THEORETICALLY SHOULD MEAN THAT THEY PATIENT NEVER COMPLETED A CHECKIN
            case RenewalOrderStatus.CheckupIncomplete_Unprescribed_Unpaid_1:
            case RenewalOrderStatus.Incomplete:
                /**
                 * Code execution when user has not completed a check-in form (no script gets sent!)
                 * NO SCRIPT GETS SENT HERE
                 * This is where a NO_CHECK_IN_HOLD status flag should be turned into a NO_CHECK_IN_HOLD_CHARGED status flag
                 */
                // if (subscription.status_flags.includes(SubscriptionStatusFlags.NO_CHECK_IN_HOLD)) {
                    await addOrRemoveStatusFlags(
                        subscription.id,
                        'remove',
                        SubscriptionStatusFlags.NO_CHECK_IN_HOLD
                    ); //should really just make a new function for this double call
                    await addOrRemoveStatusFlags(
                        subscription.id,
                        'add',
                        SubscriptionStatusFlags.NO_CHECK_IN_HOLD_CHARGED
                    );
                // }

                if (
                    renewalOrder.subscription_type ===
                    SubscriptionCadency.Monthly
                ) {
                    /**
                     * If the last check in date is greater than 3 months ago, we update order status and trigger the WL_CHECKIN_INCOMPLETE event.
                     */
                    if (subscription.since_last_checkup >= 3) {
                        await updateRenewalOrder(renewalOrder.id, {
                            order_status:
                                RenewalOrderStatus.CheckupIncomplete_Unprescribed_Paid,
                            invoice_id: invoiceId,
                        });
                        await triggerEvent(
                            renewalOrder.customer_uuid,
                            WL_CHECKIN_INCOMPLETE,
                            {
                                checkin_url: `https://app.gobioverse.com/check-up/${subscription.product_href}`,
                                order_id: renewalOrder.renewal_order_id,
                            }
                        );
                    } else {
                        /**
                         * If the last check in date is less than 3 months ago:
                         */

                        //Find the last price id paid for
                        const lastPriceIdPaidFor =
                            await getLastInvoiceBeforeRenewal(
                                subscription.stripe_subscription_id,
                                invoiceId
                            );

                        if (!lastPriceIdPaidFor) {
                            throw new Error(
                                `${EngineeringQueueNotes.LastPriceIdNotFound} - incomplete`
                            );
                        }

                        //Get the variant index of the last price id paid for
                        const productVariant = await getVariantIndexByPriceIdV2(
                            renewalOrder.product_href as PRODUCT_HREF,
                            lastPriceIdPaidFor
                        );

                        const variantIndex = productVariant.variant_index;
                        const lastCadency = productVariant.cadence;

                        if (
                            lastCadency === SubscriptionCadency.Quarterly ||
                            lastCadency === SubscriptionCadency.Biannually ||
                            lastCadency === SubscriptionCadency.Annually
                        ) {
                            /**
                             * If the last cadency is a multi-month subscription, we trigger the WL_CHECKIN_INCOMPLETE event.
                             */
                            await triggerEvent(
                                renewalOrder.customer_uuid,
                                WL_CHECKIN_INCOMPLETE,
                                {
                                    checkin_url: `https://app.gobioverse.com/check-up/${subscription.product_href}`,
                                    order_id: renewalOrder.renewal_order_id,
                                }
                            );

                            const currentProductVar =
                                await getVariantIndexByPriceIdV2(
                                    subscription.product_href as PRODUCT_HREF,
                                    currentPriceId
                                );

                            const assigned_pharmacy = getEligiblePharmacy(
                                renewalOrder.product_href,
                                Number(currentProductVar.variant_index)
                            );

                            /**
                             * Preform updates to the renewal order status, invoice id, variant index, subscription type, and assigned pharmacy
                             */
                            await updateRenewalOrder(renewalOrder.id, {
                                order_status:
                                    RenewalOrderStatus.CheckupIncomplete_Unprescribed_Paid,
                                invoice_id: invoiceId,
                                variant_index: Number(
                                    currentProductVar.variant_index
                                ),
                                subscription_type: SubscriptionCadency.Monthly,
                                assigned_pharmacy,
                            });
                        }

                        console.log("SENDING LAST USED SCRIPT 4")
                        await this.sendLastUsedScript(
                            renewalOrder,
                            subscription,
                            invoiceId
                        );
                    }
                    //end of if (renewalOrder.subscription_type === SubscriptionCadency.Monthly)
                } else if (
                    renewalOrder.subscription_type ===
                    SubscriptionCadency.Quarterly
                ) {
                    // For quarterly subscriptions, they have to have completed a check-in before receiving another dose
                    // Any quarterly subscription here should be downgraded to the monthly here (Can assume they've already paid for the stripe monthly price, now need to do it internally)
                    if (renewalOrder.dosage_selection_completed) {
                        throw new Error(
                            'Error: User completed dosage selection form but not a check-in form?'
                        );
                    }

                    const currentProductVar = await getVariantIndexByPriceIdV2(
                        subscription.product_href as PRODUCT_HREF,
                        currentPriceId
                    );

                    const shouldConvert =
                        shouldConvertBundleSubscriptionToMonthly(
                            subscription.product_href as PRODUCT_HREF,
                            Number(currentProductVar.variant_index)
                        );

                    const currentCadnecy =
                        currentProductVar.cadence as SubscriptionCadency;

                    if (
                        shouldConvert &&
                        currentCadnecy !== SubscriptionCadency.Monthly
                    ) {
                        throw new Error(
                            EngineeringQueueNotes.QuarterlyIncompleteCadencyMismatch
                        );
                    } else if (
                        !shouldConvert &&
                        currentCadnecy !== SubscriptionCadency.Quarterly
                    ) {
                        throw new Error(
                            'User should have been billed for quarterly product - stripeinvoicepaid'
                        );
                    }

                    if (shouldConvert) {
                        const assigned_pharmacy = getEligiblePharmacy(
                            renewalOrder.product_href,
                            Number(currentProductVar.variant_index)
                        );
                        const currentPriceData =
                            await getPriceDataRecordWithVariant(
                                renewalOrder.product_href as PRODUCT_HREF,
                                Number(currentProductVar.variant_index)
                            );

                        await updateRenewalOrder(renewalOrder.id, {
                            order_status:
                                RenewalOrderStatus.CheckupIncomplete_Unprescribed_Paid,
                            invoice_id: invoiceId,
                            variant_index: Number(
                                currentProductVar.variant_index
                            ),
                            subscription_type: SubscriptionCadency.Monthly,
                            assigned_pharmacy,
                        });

                        await updatePrescriptionSubscription(
                            renewalOrder.subscription_id,
                            {
                                subscription_type: SubscriptionCadency.Monthly,
                                price_id: currentPriceId,
                                assigned_pharmacy,
                                variant_text: currentPriceData?.variant,
                            }
                        );
                    } else {
                        await updateRenewalOrder(renewalOrder.id, {
                            order_status:
                                RenewalOrderStatus.CheckupIncomplete_Unprescribed_Paid,
                            invoice_id: invoiceId,
                        });
                    }

                    await triggerEvent(
                        renewalOrder.customer_uuid,
                        WL_CHECKIN_INCOMPLETE,
                        {
                            checkin_url: `https://app.gobioverse.com/check-up/${subscription.product_href}`,
                            order_id: renewalOrder.renewal_order_id,
                        }
                    );
                    //end of if (renewalOrder.subscription_type === SubscriptionCadency.Quarterly)
                } else if (
                    renewalOrder.subscription_type ===
                    SubscriptionCadency.Biannually
                ) {
                    // For quarterly subscriptions, they have to have completed a check-in before receiving another dose
                    // Any quarterly subscription here should be downgraded to the monthly here (Can assume they've already paid for the stripe monthly price, now need to do it internally)
                    if (renewalOrder.dosage_selection_completed) {
                        throw new Error(
                            'Error: User completed dosage selection form but not a check-in form?'
                        );
                    }

                    const currentProductVar = await getVariantIndexByPriceIdV2(
                        subscription.product_href as PRODUCT_HREF,
                        currentPriceId
                    );

                    const shouldConvert =
                        shouldConvertBundleSubscriptionToMonthly(
                            subscription.product_href as PRODUCT_HREF,
                            Number(currentProductVar.variant_index)
                        );

                    const currentCadnecy =
                        currentProductVar.cadence as SubscriptionCadency;

                    if (
                        shouldConvert &&
                        currentCadnecy !== SubscriptionCadency.Monthly
                    ) {
                        throw new Error(
                            EngineeringQueueNotes.QuarterlyIncompleteCadencyMismatch
                        );
                    } else if (
                        !shouldConvert &&
                        currentCadnecy !== SubscriptionCadency.Biannually
                    ) {
                        throw new Error(
                            'User should have been billed for quarterly product - stripeinvoicepaid'
                        );
                    }

                    if (shouldConvert) {
                        const assigned_pharmacy = getEligiblePharmacy(
                            renewalOrder.product_href,
                            Number(currentProductVar.variant_index)
                        );
                        const currentPriceData =
                            await getPriceDataRecordWithVariant(
                                renewalOrder.product_href as PRODUCT_HREF,
                                Number(currentProductVar.variant_index)
                            );

                        await updateRenewalOrder(renewalOrder.id, {
                            order_status:
                                RenewalOrderStatus.CheckupIncomplete_Unprescribed_Paid,
                            invoice_id: invoiceId,
                            variant_index: Number(
                                currentProductVar.variant_index
                            ),
                            subscription_type: SubscriptionCadency.Monthly,
                            assigned_pharmacy,
                        });

                        await updatePrescriptionSubscription(
                            renewalOrder.subscription_id,
                            {
                                subscription_type: SubscriptionCadency.Monthly,
                                price_id: currentPriceId,
                                assigned_pharmacy,
                                variant_text: currentPriceData?.variant,
                            }
                        );
                    } else {
                        await updateRenewalOrder(renewalOrder.id, {
                            order_status:
                                RenewalOrderStatus.CheckupIncomplete_Unprescribed_Paid,
                            invoice_id: invoiceId,
                        });
                    }

                    await triggerEvent(
                        renewalOrder.customer_uuid,
                        WL_CHECKIN_INCOMPLETE,
                        {
                            checkin_url: `https://app.gobioverse.com/check-up/${subscription.product_href}`,
                            order_id: renewalOrder.renewal_order_id,
                        }
                    );
                    //end of if (renewalOrder.subscription_type === SubscriptionCadency.Biannually)
                } else if (
                    renewalOrder.subscription_type ===
                    SubscriptionCadency.Annually
                ) {
                    // For quarterly subscriptions, they have to have completed a check-in before receiving another dose
                    // Any quarterly subscription here should be downgraded to the monthly here (Can assume they've already paid for the stripe monthly price, now need to do it internally)
                    if (renewalOrder.dosage_selection_completed) {
                        throw new Error(
                            'Error: User completed dosage selection form but not a check-in form?'
                        );
                    }

                    const currentProductVar = await getVariantIndexByPriceIdV2(
                        subscription.product_href as PRODUCT_HREF,
                        currentPriceId
                    );

                    const shouldConvert =
                        shouldConvertBundleSubscriptionToMonthly(
                            subscription.product_href as PRODUCT_HREF,
                            Number(currentProductVar.variant_index)
                        );

                    const currentCadnecy =
                        currentProductVar.cadence as SubscriptionCadency;
                    if (
                        shouldConvert &&
                        currentCadnecy !== SubscriptionCadency.Monthly
                    ) {
                        throw new Error(
                            EngineeringQueueNotes.QuarterlyIncompleteCadencyMismatch
                        );
                    } else if (
                        !shouldConvert &&
                        currentCadnecy !== SubscriptionCadency.Annually
                    ) {
                        throw new Error(
                            'User should have been billed for quarterly product - stripeinvoicepaid'
                        );
                    }

                    if (shouldConvert) {
                        const assigned_pharmacy = getEligiblePharmacy(
                            renewalOrder.product_href,
                            Number(currentProductVar.variant_index)
                        );
                        const currentPriceData =
                            await getPriceDataRecordWithVariant(
                                renewalOrder.product_href as PRODUCT_HREF,
                                Number(currentProductVar.variant_index)
                            );

                        await updateRenewalOrder(renewalOrder.id, {
                            order_status:
                                RenewalOrderStatus.CheckupIncomplete_Unprescribed_Paid,
                            invoice_id: invoiceId,
                            variant_index: Number(
                                currentProductVar.variant_index
                            ),
                            subscription_type: SubscriptionCadency.Monthly,
                            assigned_pharmacy,
                        });

                        await updatePrescriptionSubscription(
                            renewalOrder.subscription_id,
                            {
                                subscription_type: SubscriptionCadency.Monthly,
                                price_id: currentPriceId,
                                assigned_pharmacy,
                                variant_text: currentPriceData?.variant,
                            }
                        );
                    } else {
                        await updateRenewalOrder(renewalOrder.id, {
                            order_status:
                                RenewalOrderStatus.CheckupIncomplete_Unprescribed_Paid,
                            invoice_id: invoiceId,
                        });
                    }

                    await triggerEvent(
                        renewalOrder.customer_uuid,
                        WL_CHECKIN_INCOMPLETE,
                        {
                            checkin_url: `https://app.gobioverse.com/check-up/${subscription.product_href}`,
                            order_id: renewalOrder.renewal_order_id,
                        }
                    );
                    //end of if (renewalOrder.subscription_type === SubscriptionCadency.Annually)
                }

                break;
            default:
                throw new Error(
                    `Unknown case updating renewal order status ${renewalOrder.order_status}`
                );
        }
    }

    private async sendLastUsedScript(
        renewalOrder: RenewalOrder,
        subscription: PrescriptionSubscription,
        invoice_id: string
    ) {
        await createNewAutoRenewalJob(renewalOrder.customer_uuid);

        await createNewSendPrescriptionJob(renewalOrder.renewal_order_id);

        await updatePrescriptionSubscription(subscription.id, {
            since_last_checkup: subscription.since_last_checkup + 1,
        });

        await updateRenewalOrder(renewalOrder.id, {
            order_status: RenewalOrderStatus.CheckupComplete_Prescribed_Paid,
            invoice_id,
        });

        await updateStatusTagToResolved(
            renewalOrder.renewal_order_id,
            renewalOrder.customer_uuid,
            StatusTagNotes.AutomaticResolved
        );
    }

    private async sendScriptForCurrentRenewalOrder(
        renewalOrder: RenewalOrder,
        invoice_id: string
    ) {
        await createNewSendPrescriptionJob(renewalOrder.renewal_order_id);

        await updateRenewalOrder(renewalOrder.id, {
            order_status: RenewalOrderStatus.CheckupComplete_Prescribed_Paid,
            invoice_id,
        });

        await updateStatusTagToResolved(
            renewalOrder.renewal_order_id,
            renewalOrder.customer_uuid,
            StatusTagNotes.AutomaticResolved
        );
    }
}

type MaxRefillsMapping = {
    [href in PRODUCT_HREF]?: {
        [cadency in SubscriptionCadency]?: { max_refills: number };
    };
};

export function usedAllRefills(subscription: PrescriptionSubscription) {
    const href = subscription.product_href as PRODUCT_HREF;
    const type = subscription.subscription_type as SubscriptionCadency;
    const mapping = MAX_REFILLS_MAPPING[href];
    const maxRefills = mapping ? mapping[type] : null;

    // If the lookup fails throw an error
    if (!maxRefills) {
        const msg = `Max refills lookup failed for ${subscription.product_href} -> ${subscription.subscription_type}`;
        console.error(msg);
        throw Error(msg);
    }

    return subscription.since_last_checkup >= maxRefills.max_refills;
}

const MAX_REFILLS_MAPPING: MaxRefillsMapping = {
    semaglutide: {
        monthly: {
            max_refills: 3,
        },
        quarterly: {
            max_refills: 0,
        },
        biannually: {
            max_refills: 0,
        },
        annually: {
            max_refills: 0,
        },
    },
    tirzepatide: {
        monthly: {
            max_refills: 3,
        },
        quarterly: {
            max_refills: 0,
        },
        biannually: {
            max_refills: 0,
        },
        annually: {
            max_refills: 0,
        },
    },
    'nad-injection': {
        one_time: {
            max_refills: 0,
        },
        monthly: {
            max_refills: 5,
        },
    },
    'nad-nasal-spray': {
        one_time: {
            max_refills: 0,
        },
        monthly: {
            max_refills: 5,
        },
    },
    'nad-patches': {
        one_time: {
            max_refills: 0,
        },
        quarterly: {
            max_refills: 1,
        },
    },
    wegovy: {
        monthly: {
            max_refills: 0,
        },
    },
    mounjaro: {
        monthly: {
            max_refills: 0,
        },
    },
    ozempic: {
        monthly: {
            max_refills: 0,
        },
    },
    'cgm-sensor': {
        one_time: {
            max_refills: 0,
        },
        monthly: {
            max_refills: 2,
        },
    },
    metformin: {
        quarterly: {
            max_refills: 1,
        },
    },
    // "Metformin (ER) pill": {
    //     quarterly: {
    //         max_refills: 1,
    //     }
    // },
    acarbose: {
        quarterly: {
            max_refills: 0,
        },
    },
    telmisartan: {
        quarterly: {
            max_refills: 0,
        },
    },
    atorvastatin: {
        monthly: {
            max_refills: 2,
        },
        quarterly: {
            max_refills: 1,
        },
    },
    'b12-injection': {
        monthly: {
            max_refills: 5,
        },
        quarterly: {
            max_refills: 1,
        },
    },
    'glutathione-injection': {
        one_time: {
            max_refills: 0,
        },
        monthly: {
            max_refills: 5,
        },
    },
    'finasterine-and-minoxidil-spray': {
        monthly: {
            max_refills: 5,
        },
    },
    zofran: {
        one_time: {
            max_refills: 0,
        },
    },
    'tadalafil-as-needed': {
        monthly: {
            max_refills: 5,
        },
        quarterly: {
            max_refills: 1,
        },
    },
    'tadalafil-daily': {
        monthly: {
            max_refills: 5,
        },
        quarterly: {
            max_refills: 1,
        },
    },
    'nad-face-cream': {
        one_time: {
            max_refills: 0,
        },
        monthly: {
            max_refills: 0,
        },
        quarterly: {
            max_refills: 1,
        },
    },
    tretinoin: {
        one_time: {
            max_refills: 0,
        },
        monthly: {
            max_refills: 0,
        },
        quarterly: {
            max_refills: 1,
        },
    },
    // "Ondansetron	1": {
    //     monthly: {}
    // },
    'wl-capsule': {
        monthly: {
            max_refills: 0,
        },
        quarterly: {
            max_refills: 0,
        },
    },
};
