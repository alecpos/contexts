'use server';
import {
    cancelStripeSubscriptionImmediately,
    cancelSubscriptionStripeAndDatabase,
    refundLastPaidInvoiceForSubscription,
    refundPatientForSubscription,
    safeCancelSubscription,
} from '@/app/(administration)/admin/stripe-api/stripe-api-actions';
import { triggerEvent } from '@/app/services/customerio/customerioApiFactory';
import { NEW_BUG, OLIVIER_ID } from '@/app/services/customerio/event_names';
import { pausePaymentCollectionForSubscription } from '@/app/services/stripe/subscriptions';
import { OrderStatus } from '@/app/types/orders/order-types';
import { RenewalOrderStatus } from '@/app/types/renewal-orders/renewal-orders-types';
import {
    StatusTag,
    StatusTagAction,
} from '@/app/types/status-tags/status-types';
import {
    createActionItemForProduct,
    doesUserHaveActiveActionItemForProduct,
} from '@/app/utils/database/controller/action-items/action-items-actions';
import {
    getPrescriptionSubscription,
    getSubscriptionDetails,
} from '@/app/utils/actions/subscriptions/subscription-actions';
import {
    getOrderById,
    updateOrder,
} from '@/app/utils/database/controller/orders/orders-api';
import {
    createUserStatusTagWAction,
    forwardOrderToEngineering,
} from '@/app/utils/database/controller/patient-status-tags/patient-status-tags-api';
import { logPatientAction } from '@/app/utils/database/controller/patient_action_history/patient-action-history';
import { PatientActionTask } from '@/app/utils/database/controller/patient_action_history/patient-action-history-types';
import {
    getRenewalOrder,
    isRenewalOrder,
    updateRenewalOrderStatus,
} from '@/app/utils/database/controller/renewal_orders/renewal_orders';
import { getOrderStatusDetails } from '@/app/utils/functions/renewal-orders/renewal-orders';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    const webhookData = await request.json();

    const eventName = webhookData.event_name;

    const isRenewal = await isRenewalOrder(webhookData.order_id, 'none');

    // First-time Orders Webhook Handling

    if (isRenewal === false) {
        const { data, error } = await getOrderById(webhookData.order_id);
        console.log('Received customerio webhook order', webhookData, data);

        if (!data) {
            console.error('Could not find order', webhookData.order_id);
            await triggerEvent(OLIVIER_ID, NEW_BUG);

            await forwardOrderToEngineering(
                webhookData.order_id,
                null,
                'forward to Engineering: could not find order for: ' +
                    webhookData.order_id
            );
            return;
        }

        if (eventName === 'new-action-item') {
            // Create new action items for customer if they don't have any that exists (we don't want it to stack)

            const actionItemExists =
                await doesUserHaveActiveActionItemForProduct(
                    data.customer_uid,
                    data.product_href
                );
            if (!actionItemExists) {
                await createActionItemForProduct(
                    data.customer_uid,
                    data.product_href,
                    data.subscription_id
                );
                await logPatientAction(
                    data.customer_uid,
                    PatientActionTask.CHECKIN_FORM_SENT,
                    { product_href: data.product_href }
                );
            }
        } else if (eventName === 'wl-message-unread-completed') {
            await createUserStatusTagWAction(
                StatusTag.CancelOrderOrSubscription,
                webhookData.order_id,
                StatusTagAction.INSERT,
                data.customer_uid,
                'Customer.io Campaign Completed',
                'ffabc905-5508-4d54-98fb-1e2ef2b9e99a',
                [StatusTag.CancelOrderOrSubscription]
            );
        } else {
            console.error('Unrecognized event', webhookData.event_name);
        }
        return new NextResponse(null, { status: 200 });
    }

    const renewalOrder = await getRenewalOrder(webhookData.order_id);

    if (!renewalOrder) {
        return;
    }

    console.log('Sending customerio webhook comms', webhookData, renewalOrder);

    switch (eventName) {
        case 'failed-checkin-1':
            if (!renewalOrder.id) {
                console.error(
                    'Unable to get renewal order id customerio',
                    webhookData
                );
                return new NextResponse(null, { status: 200 });
            }
            if (
                renewalOrder.order_status ===
                RenewalOrderStatus.CheckupIncomplete_Unprescribed_Paid
            ) {
                await updateRenewalOrderStatus(
                    renewalOrder.id,
                    RenewalOrderStatus.CheckupIncomplete_Unprescribed_Paid_1
                );
            } else {
                console.error(
                    'Customerio Webhook - unknown status',
                    renewalOrder,
                    eventName,
                    renewalOrder.customer_uuid
                );
            }
            break;
        case 'failed-checkin-2':
            // If a user doesn't complete a checkin and therefore a script is not sent inside updateOrderStatusAfterPaid,
            // Then updateOrderStatusAfterPaid will trigger the 'wl-checkin-incomplete' event which starts the:
            // "Transactional: Complete Your Check-in (Already Paid) (1/2)"
            // and the
            // "Transactional: Complete Your Check-in (Already Paid) (2/2)"
            // customer.io campaigns, and if both campaigns FINISH (the user never completes a checkin),
            // then this webhook is triggered with event_name = 'failed-checkin-2'
            // https://fly.customer.io/workspaces/153100/journeys/campaigns/65/overview/workflow/actions
            try {
                const subscription = await getPrescriptionSubscription(
                    renewalOrder.subscription_id
                );

                if (subscription) {
                    await cancelStripeSubscriptionImmediately(
                        subscription.stripe_subscription_id
                    );

                    await refundLastPaidInvoiceForSubscription(
                        subscription.stripe_subscription_id
                    );
                }
            } catch (error: any) {
                await forwardOrderToEngineering(
                    renewalOrder.renewal_order_id,
                    renewalOrder.customer_uuid,
                    `Errorin failed check in 2 webhook ${error}`
                );
            }

            break;
        case 'wl-unpaid-1':
            if (!renewalOrder.id) {
                console.error(
                    'Unable to get renewal order id customerio',
                    webhookData
                );
                return new NextResponse(null, { status: 200 });
            }
            if (
                renewalOrder.order_status ===
                RenewalOrderStatus.CheckupComplete_Prescribed_Unpaid_1
            ) {
                await updateRenewalOrderStatus(
                    renewalOrder.id,
                    RenewalOrderStatus.CheckupComplete_Prescribed_Unpaid_2
                );
            } else if (
                renewalOrder.order_status ===
                RenewalOrderStatus.CheckupComplete_Unprescribed_Unpaid_1
            ) {
                await updateRenewalOrderStatus(
                    renewalOrder.id,
                    RenewalOrderStatus.CheckupComplete_Unprescribed_Unpaid_2
                );
            } else {
                console.error(
                    'Customerio Webhook - unknown status',
                    renewalOrder,
                    eventName,
                    renewalOrder.customer_uuid
                );
            }
            break;
        case 'wl-not-checked-in':
        case 'failed-payment-1':
        case 'wl-unpaid-2':
            const isRenewal = await isRenewalOrder(webhookData.order_id, 'N/A');

            if (isRenewal) {
                const renewalOrderStatus = getOrderStatusDetails(
                    renewalOrder.order_status
                );

                if (renewalOrderStatus.isPaid) {
                    await refundPatientForSubscription(
                        renewalOrder.customer_uuid,
                        renewalOrder.subscription_id
                    );
                }
                if (!renewalOrder.id) {
                    console.error(
                        'Unable to get renewal order id customerio',
                        webhookData
                    );
                    return new NextResponse(null, { status: 200 });
                }
                await updateRenewalOrderStatus(
                    renewalOrder.id,
                    RenewalOrderStatus.Canceled
                );
                if (renewalOrder.subscription_id) {
                    const subscription = await getSubscriptionDetails(
                        renewalOrder.subscription_id
                    );
                    await cancelSubscriptionStripeAndDatabase(
                        renewalOrder.subscription_id,
                        subscription.data.stripe_subscription_id
                    );
                }
            } else {
                await updateOrder(webhookData.order_id, {
                    order_status: OrderStatus.Canceled,
                });
            }
            break;
        default:
            console.error(
                'Unknown customerio event type',
                webhookData,
                renewalOrder
            );
    }

    return new NextResponse(null, { status: 200 });
}
