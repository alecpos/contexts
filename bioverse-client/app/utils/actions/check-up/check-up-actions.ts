'use server';

import { createSupabaseServiceClient } from '../../clients/supabaseServerClient';
import { isNaN, isUndefined } from 'lodash';
import { ActionItemType } from '@/app/types/action-items/action-items-types';
import {
    RenewalOrder,
    RenewalOrderStatus,
    SubscriptionCadency,
} from '@/app/types/renewal-orders/renewal-orders-types';
import {
    FIRST_TIME_DOSAGE_SELECTION_COMPLETE,
    MESSAGE_REPLIED,
    NEW_BUG,
    NON_WL_CHECKIN_COMPLETE,
    WL_CHECKIN_COMPLETE,
} from '@/app/services/customerio/event_names';
import { triggerEvent } from '@/app/services/customerio/customerioApiFactory';
import {
    createUserStatusTagWAction,
    forwardOrderToEngineering,
} from '../../database/controller/patient-status-tags/patient-status-tags-api';
import {
    getSubscriptionById,
    handleCheckUpSubscriptionExtension,
} from '../../database/controller/prescription_subscriptions/prescription_subscriptions';
import {
    addCheckInCompletionToRenewalOrder,
    createFirstTimeRenewalOrder,
    createUpcomingRenewalOrder,
    getLatestRenewalOrderForSubscription,
    getMonthsIntoRenewalOrderSubscription,
} from '../../database/controller/renewal_orders/renewal_orders';
import {
    StatusTag,
    StatusTagAction,
    StatusTagNotes,
} from '@/app/types/status-tags/status-types';
import { getOrderStatusDetails } from '../../functions/renewal-orders/renewal-orders';
import { INVALID_RENEWAL_ORDER_STATSUES_FOR_CHECKUP_COMPLETE } from './check-up-constants';
import { isGLP1Product } from '../../functions/pricing';
import { logPatientAction } from '../../database/controller/patient_action_history/patient-action-history';
import { PatientActionTask } from '../../database/controller/patient_action_history/patient-action-history-types';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import { addOrRemoveStatusFlags } from '@/app/utils/database/controller/prescription_subscriptions/prescription_subscriptions';
import { SubscriptionStatusFlags } from '../../database/controller/prescription_subscriptions/prescription_subscription_enums';
import { PrescriptionSubscription } from '@/app/components/patient-portal/subscriptions/types/subscription-types';
import { Status } from '@/app/types/global/global-enumerators';
import { updateActionItem } from '../../database/controller/action-items/action-items-actions';

const getNextOrderStatusMonthly = async (
    renewalOrder: RenewalOrder,
    user_id: string,
    order_status: RenewalOrderStatus
): Promise<RenewalOrderStatus> => {
    switch (order_status) {
        case RenewalOrderStatus.Incomplete:
        case RenewalOrderStatus.CheckupIncomplete_Unprescribed_Unpaid:
        case RenewalOrderStatus.CheckupIncomplete_Unprescribed_Unpaid_1:
        case RenewalOrderStatus.CheckupWaived_Unprescribed_Unpaid:
        case RenewalOrderStatus.CheckupComplete_Unprescribed_Unpaid:
        case RenewalOrderStatus.CheckupComplete_Prescribed_Unpaid:
            return RenewalOrderStatus.CheckupComplete_Unprescribed_Unpaid;
        case RenewalOrderStatus.CheckupIncomplete_Unprescribed_Paid:
        case RenewalOrderStatus.CheckupIncomplete_Unprescribed_Paid_1:
        case RenewalOrderStatus.CheckupIncomplete_Unprescribed_Paid_2:
        case RenewalOrderStatus.CheckupComplete_Unprescribed_Paid:
            return RenewalOrderStatus.CheckupComplete_Unprescribed_Paid;
        case RenewalOrderStatus.CheckupComplete_Prescribed_Paid:
        case RenewalOrderStatus.PharmacyProcessing:
        case RenewalOrderStatus.Scheduled_Cancel:
        case RenewalOrderStatus.Scheduled_Admin_Cancel:
            return order_status;
        default:
            auditCheckupForm(
                user_id,
                'Could not get next order status',
                JSON.stringify({ order_status, user_id })
            );
            console.error(
                'Could not get next order status',
                user_id,
                order_status
            );
            await forwardOrderToEngineering(
                renewalOrder.renewal_order_id,
                renewalOrder.customer_uuid,
                'Could not get next order status ' + order_status
            );
            return order_status;
    }
};

export const getNextOrderStatusQuarterly = async (
    renewalOrder: RenewalOrder
): Promise<RenewalOrderStatus> => {
    const order_status = renewalOrder.order_status;
    const user_id = renewalOrder.customer_uuid;

    if (
        INVALID_RENEWAL_ORDER_STATSUES_FOR_CHECKUP_COMPLETE.includes(
            order_status
        )
    ) {
        await auditCheckupForm(
            user_id,
            'Could not get next order status',
            JSON.stringify({ order_status, user_id })
        );
        console.error('Could not get next order status', user_id, order_status);
        await forwardOrderToEngineering(
            renewalOrder.renewal_order_id,
            renewalOrder.customer_uuid,
            'Could not get next order status ' + order_status
        );
        return order_status;
    }

    const orderDetails = getOrderStatusDetails(order_status);
    if (orderDetails.isFailedPayment) {
        const num = order_status.split('-').at(-1);

        if (isUndefined(num)) {
            await forwardOrderToEngineering(
                renewalOrder.renewal_order_id,
                renewalOrder.customer_uuid,
                'function: getNextOrderStatusQuarterly. num was undefined'
            );
            return order_status;
        }

        if (isNaN(num)) {
            await forwardOrderToEngineering(
                renewalOrder.renewal_order_id,
                renewalOrder.customer_uuid,
                'function: getNextOrderStatusQuarterly. num was undefined'
            );
            return order_status;
        }

        return `CheckupComplete-Unprescribed-Unpaid-${num}` as RenewalOrderStatus;
    }

    if (!orderDetails.isCheckupComplete) {
        if (orderDetails.isPaid) {
            return RenewalOrderStatus.CheckupComplete_Unprescribed_Paid;
        }
        return RenewalOrderStatus.CheckupComplete_Unprescribed_Unpaid;
    }

    if (orderDetails.isPaid) {
        return RenewalOrderStatus.CheckupComplete_Unprescribed_Paid;
    }
    return RenewalOrderStatus.CheckupComplete_Unprescribed_Unpaid;
};

export const handleCheckupCompletionV2 = async (
    userId: string,
    prodcut_href: PRODUCT_HREF,
    subscription_id: number,
    last_action_item: ActionItemType
) => {
    let renewalOrderId: string | undefined;

    try {
        const supabase = createSupabaseServiceClient();

        await logPatientAction(
            userId,
            PatientActionTask.CHECKIN_FORM_SUBMITTED,
            {
                product: prodcut_href,
                action_item_id: last_action_item.id,
            }
        );

        // Update since_last_checkup
        const { error: prescriptionError } = await supabase
            .from('prescription_subscriptions')
            .update({
                since_last_checkup: 0,
            })
            .eq('id', subscription_id);

        //not throwing an error after this becuase I don't actually think it's necessary to update - Nathan
        if (prescriptionError) {
            console.error(
                'Error updating prescription last_checkup',
                subscription_id,
                prescriptionError
            );
        }

        //get the subscription data
        const subscriptionData: PrescriptionSubscription =
            await getSubscriptionById(subscription_id);

        //remove NCI Flag from subscription if-present.
        await addOrRemoveStatusFlags(
            subscription_id,
            'remove',
            SubscriptionStatusFlags.NO_CHECK_IN_HOLD
        );

        //if the patient was in the NCI_Charged state, then put them into the pending dosage selection state
        if (
            subscriptionData?.status_flags?.includes(
                SubscriptionStatusFlags.NO_CHECK_IN_HOLD_CHARGED
            )
        ) {
            const { error: prescriptionError2 } = await supabase
                .from('prescription_subscriptions')
                .update({
                    status_flags: [
                        SubscriptionStatusFlags.NO_CHECK_IN_HOLD_PENDING_DS,
                    ], //just replace the entire array
                })
                .eq('id', subscription_id);
            if (prescriptionError2) {
                console.error(
                    'Error updating prescription last_checkup 69420',
                    subscription_id,
                    prescriptionError2
                );
            }
        }

        //get the latest renewal order for the subscription.
        let renewalOrderData = await getLatestRenewalOrderForSubscription(
            subscription_id
        );
        renewalOrderId = renewalOrderData?.renewal_order_id;

        //Extends the subscription renewal date by 5 days if necessary.
        await handleCheckUpSubscriptionExtension(subscriptionData);

        //create a renewal order if one is not present.
        if (!renewalOrderData) {
            renewalOrderData = await createFirstTimeRenewalOrder(
                subscriptionData.order_id.toString(),
                false
            );
            renewalOrderId = renewalOrderData?.renewal_order_id;
        }

        //if renewal order is PharmacyProcessing == prescription sent   <-- TODO - delete this as we are moving away from order status dependent renewal logic
        //we create a new renewal order for safe-keeping
        if (
            renewalOrderData?.order_status ===
            RenewalOrderStatus.PharmacyProcessing
            // ? checking here, bc if it does not exist, the next check will throw an error
        ) {
            renewalOrderData = await createUpcomingRenewalOrder(
                renewalOrderData
            );
            renewalOrderId = renewalOrderData?.renewal_order_id;
        }

        if (!renewalOrderData) {
            throw new Error(
                'Check up Error: Could not create upcoming renewal order',
                {
                    cause: {
                        subscription_id,
                        userId,
                    },
                }
            );
        }

        //add check in completion record to renewal order.
        await addCheckInCompletionToRenewalOrder(
            last_action_item.id,
            new Date().toISOString(),
            renewalOrderData.renewal_order_id
        );

        //mark the action item as completed
        await updateActionItem(last_action_item.id, {
            active: false,
            last_updated_at: new Date(),
            submission_time: new Date().toISOString(),
        });

        const nextOrderStatus =
            renewalOrderData.subscription_type === SubscriptionCadency.Monthly
                ? await getNextOrderStatusMonthly(
                      renewalOrderData,
                      renewalOrderData.customer_uuid,
                      renewalOrderData.order_status
                  )
                : await getNextOrderStatusQuarterly(renewalOrderData);

        const { statusTag: nextStatusTag, statusTagNotes } =
            await getNextStatusTag(renewalOrderData);

        //update the renewal order status
        await supabase
            .from('renewal_orders')
            .update({
                order_status: nextOrderStatus,
                assigned_provider: null,
                assigned_provider_timestamp: null,
            })
            .eq('renewal_order_id', renewalOrderData.renewal_order_id);

        //create the status tag - TODO - make sure the status tag is Urgent IF the renewal date gets pushed because of the 48 hour checkin window
        await createUserStatusTagWAction(
            nextStatusTag,
            renewalOrderData.renewal_order_id,
            StatusTagAction.INSERT,
            userId,
            statusTagNotes,
            'ffabc905-5508-4d54-98fb-1e2ef2b9e99a',
            [nextStatusTag]
        );

        //fire the correct customer io event
        const event = isGLP1Product(renewalOrderData.product_href)
            ? WL_CHECKIN_COMPLETE
            : NON_WL_CHECKIN_COMPLETE;
        await triggerEvent(userId, event, {
            exitJourney: false,
        });

        /**
         * This code below triggers an event to customer io to exit the pt out of the first time dosage selection campaign.
         * This is here because we had patients going through check ups when they were subscribed because the com's never removed them.
         */
        await triggerEvent(userId, FIRST_TIME_DOSAGE_SELECTION_COMPLETE, {});

        /**
         * @Nathan_note - I am confused as to why we are triggering a message_replied. If you understand why later, please populate this comment and remove note.
         * Triggering an event here to notify the customer that their check-in has been completed.
         */
        await triggerEvent(userId, MESSAGE_REPLIED, {});

        return Status.Success;
    } catch (error: any) {
        console.error('Error completing checkup', error);

        auditCheckupForm(
            userId,
            'Error completing checkup',
            JSON.stringify(error),
            undefined,
            {
                renewalOrderId,
                userId,
                subscriptionId: subscription_id,
                productHref: prodcut_href,
                lastActionItemId: last_action_item.id,
            }
        );

        //cannot send to eng queue without a renewal order Id, but it will audit failure otherwise.
        if (renewalOrderId) {
            await forwardOrderToEngineering(
                renewalOrderId,
                userId,
                'Error completing checkup: ' + error.message
            );
        }

        return Status.Error;
    }
};

// export async function getLastDosageSelectionSent(
//     user_id: string,
//     product_href: PRODUCT_HREF
// ): Promise<ActionItemType | null> {
//     const supabase = createSupabaseServiceClient();

//     const { data, error } = await supabase
//         .from('action_items')
//         .select('*')
//         .eq('product_href', product_href)
//         .eq('patient_id', user_id)
//         .eq('action_type', 'dosage_selection')
//         .order('created_at', { ascending: false })
//         .limit(1)
//         .maybeSingle();

//     if (error) {
//         console.error(
//             'Error getting last check in form',
//             user_id,
//             product_href
//         );
//         return null;
//     }

//     return data;
// }

export async function isWithinLastThreeMonths(timestamp: string) {
    // Parse the timestamp string into a Date object
    const date = new Date(timestamp);

    // Get the current date
    const now = new Date();

    // Calculate the date three months ago
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(now.getMonth() - 3);

    // Check if the date is within the last three months
    return date >= threeMonthsAgo && date <= now;
}

export async function getLastCheckInFormSubmission(
    user_id: string,
    product_href: PRODUCT_HREF
): Promise<ActionItemType | null> {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('action_items')
        .select('*')
        .eq('product_href', product_href)
        .eq('patient_id', user_id)
        .eq('action_type', 'check_up')
        .not('submission_time', 'is', null)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

    if (error) {
        console.error(
            'Error getting last check in form',
            user_id,
            product_href
        );
        return null;
    }

    return data;
}

export default async function auditCheckupForm(
    patient_id: string,
    error_message?: string,
    error_json?: any,
    form_type?: string,
    metadata?: any
) {
    const supabase = createSupabaseServiceClient();

    await supabase
        .from('audit_checkup')
        .insert({ patient_id, error_message, error_json, form_type, metadata });
}

export async function getNextStatusTag(
    renewalOrder: RenewalOrder
): Promise<{ statusTag: StatusTag; statusTagNotes: StatusTagNotes }> {
    const final_review_started = renewalOrder.final_review_starts
        ? new Date() >= new Date(renewalOrder.final_review_starts)
        : false;
    const subscription_cadency = renewalOrder.subscription_type;

    if (subscription_cadency === SubscriptionCadency.Monthly) {
        if (isGLP1Product(renewalOrder.product_href)) {
            return {
                statusTag: StatusTag.FinalReview,
                statusTagNotes: StatusTagNotes.FinalReview,
            };
        }
        return {
            statusTag: StatusTag.Review,
            statusTagNotes: StatusTagNotes.RenewalReview,
        };
    }

    if (subscription_cadency === SubscriptionCadency.Quarterly) {
        if (isGLP1Product(renewalOrder.product_href)) {
            if (final_review_started) {
                return {
                    statusTag: StatusTag.FinalReview,
                    statusTagNotes: StatusTagNotes.FinalReview,
                };
            }
            return {
                statusTag: StatusTag.ReviewNoPrescribe,
                statusTagNotes: StatusTagNotes.ReviewNoPrescribe,
            };
        } else {
            return {
                statusTag: StatusTag.Review,
                statusTagNotes: StatusTagNotes.RenewalReview,
            };
        }
    } else if (subscription_cadency === SubscriptionCadency.Biannually) {
        if (isGLP1Product(renewalOrder.product_href)) {
            const month = await getMonthsIntoRenewalOrderSubscription(
                renewalOrder.renewal_order_id
            );

            if (month === 6) {
                return {
                    statusTag: StatusTag.FinalReview,
                    statusTagNotes: StatusTagNotes.FinalReview,
                };
            } else {
                return {
                    statusTag: StatusTag.ReviewNoPrescribe,
                    statusTagNotes: StatusTagNotes.ReviewNoPrescribe,
                };
            }
        } else {
            return {
                statusTag: StatusTag.Review,
                statusTagNotes: StatusTagNotes.RenewalReview,
            };
        }
    } else if (subscription_cadency === SubscriptionCadency.Annually) {
        if (isGLP1Product(renewalOrder.product_href)) {
            const month = await getMonthsIntoRenewalOrderSubscription(
                renewalOrder.renewal_order_id
            );

            if (month === 12) {
                return {
                    statusTag: StatusTag.FinalReview,
                    statusTagNotes: StatusTagNotes.FinalReview,
                };
            } else {
                return {
                    statusTag: StatusTag.ReviewNoPrescribe,
                    statusTagNotes: StatusTagNotes.ReviewNoPrescribe,
                };
            }
        } else {
            return {
                statusTag: StatusTag.Review,
                statusTagNotes: StatusTagNotes.RenewalReview,
            };
        }
    }

    console.error(
        'Edge case not expected for getting next status tag',
        renewalOrder
    );
    await triggerEvent(renewalOrder.customer_uuid, NEW_BUG, {
        order_id: renewalOrder.renewal_order_id,
    });
    return { statusTag: StatusTag.None, statusTagNotes: StatusTagNotes.None };
}
