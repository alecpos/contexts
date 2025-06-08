'use server';

import {
    attemptPaymentForInvoice,
    cancelStripeSubscriptionOnly,
} from '@/app/(administration)/admin/stripe-api/stripe-api-actions';
import { triggerEvent } from '@/app/services/customerio/customerioApiFactory';
import { PAYMENT_SUCCESS } from '@/app/services/customerio/event_names';
import { createAndSendCurexaOrder } from '@/app/services/pharmacy-integration/curexa/curexa-actions';
import { sendGGMRequest } from '@/app/services/pharmacy-integration/gogomeds/ggm-actions';
import { chargeCustomerV2 } from '@/app/services/stripe/charge-customer';
import { OrderType, ScriptSource } from '@/app/types/orders/order-types';
import { RenewalOrder } from '@/app/types/renewal-orders/renewal-orders-types';
import {
    updateExistingOrderStatusUsingIdAfterPaymentFailure,
    updateOrderShippingStatusAndExternalMetadata,
} from '@/app/utils/database/controller/orders/orders-api';
import {
    getPaymentFailureTrackerForOrder,
    getPaymentFailureTrackerForRenewalOrder,
    updateTrackerStatus,
    updateTrackerStatusById,
} from '@/app/utils/database/controller/payment_failure_tracker/payment_failure_tracker-api';
import { PaymentFailureStatus } from '@/app/utils/database/controller/payment_failure_tracker/payment_failure_tracker_enums';
import { getURL } from '@/app/utils/functions/utils';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const authHeader = req.headers.get('Authorization');
    const apiKey = `Bearer ${process.env.SUPABASE_PAYMENT_FAILURE_API_KEY}`;

    if (authHeader !== apiKey) {
        console.error('EXITING PAYMENT FAILURE LOOP');
        return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    // Your logic here
    try {
        const body = await req.json();
        console.log('RECEIVED PAYMENT FAILURE REQUEST', body);
        const { orderType } = body;

        if (orderType === OrderType.RenewalOrder) {
            console.log('IS RENEWAL ORDER', body);
            // const renewal_order_id = body.renewal_order_id;
            // const renewalOrder = await getRenewalOrder(renewal_order_id);
            const renewalOrder: RenewalOrder = body.orderData;

            if (!renewalOrder) {
                console.error('leaving');
                return new NextResponse(
                    JSON.stringify({
                        message: 'Tracker Not Found',
                    }),
                    {
                        status: 404,
                        headers: { 'Content-Type': 'application/json' },
                    }
                );
            }
            // const renewalOrder: RenewalOrder = body.orderData;

            const payment_failure_tracker =
                await getPaymentFailureTrackerForRenewalOrder(
                    renewalOrder.renewal_order_id
                );

            if (!payment_failure_tracker) {
                return new NextResponse(
                    JSON.stringify({
                        message: 'Tracker Ntot Found',
                    }),
                    {
                        status: 404,
                        headers: { 'Content-Type': 'application/json' },
                    }
                );
            }

            if (payment_failure_tracker.created_at) {
                const createdAtDate = new Date(
                    payment_failure_tracker.created_at
                );
                const currentDate = new Date();
                const sixtyDaysAgo = new Date(
                    currentDate.setDate(currentDate.getDate() - 60)
                );

                if (createdAtDate < sixtyDaysAgo) {
                    await updateTrackerStatusById(
                        payment_failure_tracker.id,
                        PaymentFailureStatus.Expired
                    );

                    await cancelStripeSubscriptionOnly(
                        renewalOrder.subscription_id
                    );
                    // The created_at date is more than 15 days in the past
                    return new NextResponse(
                        JSON.stringify({
                            message:
                                'Successfully expired the tracker for this order.',
                        }),
                        {
                            status: 200,
                            headers: { 'Content-Type': 'application/json' },
                        }
                    );
                }
            }

            attemptPaymentForInvoice(
                payment_failure_tracker.id,
                renewalOrder,
                payment_failure_tracker.invoice_id!
            );

            return new NextResponse(
                JSON.stringify({ message: 'Data received successfully.' }),
                {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' },
                }
            );

            // Attempt to pay invoice
        } else if (orderType === OrderType.Order) {
            const orderData: OrdersSBR = body.orderData;

            const payment_failure_tracker =
                await getPaymentFailureTrackerForOrder(orderData.id!);

            if (!payment_failure_tracker) {
                return new NextResponse(
                    JSON.stringify({
                        message: 'Tracker Not Found',
                    }),
                    {
                        status: 404,
                        headers: { 'Content-Type': 'application/json' },
                    }
                );
            }

            if (payment_failure_tracker.created_at) {
                const createdAtDate = new Date(
                    payment_failure_tracker.created_at
                );
                const currentDate = new Date();
                const thirtyDaysAgo = new Date(
                    currentDate.setDate(currentDate.getDate() - 30)
                );

                if (createdAtDate < thirtyDaysAgo) {
                    await updateTrackerStatus(orderData.id!, 'expired');
                    // The created_at date is more than 15 days in the past
                    return new NextResponse(
                        JSON.stringify({
                            message:
                                'Successfully expired the tracker for this order.',
                        }),
                        {
                            status: 200,
                            headers: { 'Content-Type': 'application/json' },
                        }
                    );
                }
            }

            //check if order is a payment declined status, if not return 400.
            if (
                orderData.order_status !== 'Payment-Declined' &&
                orderData.order_status !== 'Payment-Completed'
            ) {
                console.warn(
                    `Payment-Failure-API - order ${orderData.id} was not a declined payment.`
                );
                return new NextResponse(
                    JSON.stringify({
                        message:
                            'Bad Request, order status is invalid for this operation.',
                    }),
                    {
                        status: 400,
                        headers: { 'Content-Type': 'application/json' },
                    }
                );
            }

            //invoke subcsriptions.ts chargeCustomerV2
            console.info(
                'Payment Failure Will Charge for order: ',
                orderData.id
            );
            let chargeResultJson;

            if (orderData.order_status === 'Payment-Completed') {
                chargeResultJson = { result: 'success' };
            } else {
                chargeResultJson = await chargeCustomerV2(
                    orderData.id!,
                    orderData.assigned_provider ??
                        '24138d35-e26f-4113-bcd9-7f275c4f9a47',
                    OrderType.Order
                );
            }

            console.log('Payment Failure charge Result: ', chargeResultJson);

            if (chargeResultJson.result === 'success') {
                await triggerEvent(
                    orderData?.customer_uid!,
                    PAYMENT_SUCCESS,
                    {}
                );

                /**
                 * Empower Section
                 */
                if (orderData.assigned_pharmacy === 'empower') {
                    const apiUrl = await getURL();

                    const empower_script_result = await fetch(
                        `${apiUrl}/api/empower/send-script`,
                        {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${process.env.BV_API_KEY}`,
                            },
                            body: JSON.stringify({
                                jsonPayload: orderData.pharmacy_script,
                                orderId: orderData.id!,
                                providerId:
                                    orderData.assigned_provider ??
                                    '24138d35-e26f-4113-bcd9-7f275c4f9a47',
                                orderType: OrderType.Order,
                                subscriptiond: null, //subscription Id is irrelevant and impossible here since it is always just 1st time order.
                                source: ScriptSource.Order_PaymentFailure,
                            }),
                        }
                    );

                    const res = await empower_script_result.json();

                    if (res.result == 'success') {
                        await updateTrackerStatus(orderData.id!, 'resolved');

                        return new NextResponse(
                            JSON.stringify({
                                message: `Payment Failure Resolved, Subscription Created for order ID: ${orderData.id!}`,
                            }),
                            {
                                status: 200,
                                headers: { 'Content-Type': 'application/json' },
                            }
                        );
                    } else {
                        return new NextResponse(
                            JSON.stringify({ message: 'Bad Request' }),
                            {
                                status: 400,
                                headers: { 'Content-Type': 'application/json' },
                            }
                        );
                    }
                }

                /**
                 * Hallandale Section
                 */
                if (orderData.assigned_pharmacy === 'hallandale') {
                    const apiUrl = await getURL();

                    const hallandale_script_result = await fetch(
                        `${apiUrl}/api/hallandale/send-script`,
                        {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${process.env.BV_API_KEY}`,
                            },
                            body: JSON.stringify({
                                body_json: orderData.pharmacy_script,
                                orderId: orderData.id!,
                                providerId:
                                    orderData.assigned_provider ??
                                    '24138d35-e26f-4113-bcd9-7f275c4f9a47',
                                orderType: OrderType.Order,
                                source: ScriptSource.Order_PaymentFailure,
                            }),
                        }
                    );

                    const res = await hallandale_script_result.json();

                    if (res.result == 'success') {
                        await updateTrackerStatus(orderData.id!, 'resolved');

                        return new NextResponse(
                            JSON.stringify({
                                message: `Payment Failure Resolved, Subscription Created for order ID: ${orderData.id!}`,
                            }),
                            {
                                status: 200,
                                headers: { 'Content-Type': 'application/json' },
                            }
                        );
                    } else {
                        return new NextResponse(
                            JSON.stringify({ message: 'Bad Request' }),
                            {
                                status: 400,
                                headers: { 'Content-Type': 'application/json' },
                            }
                        );
                    }
                }

                /**
                 * Boothwyn Section
                 */
                if (orderData.assigned_pharmacy === 'boothwyn') {
                    const apiUrl = await getURL();

                    const boothwyn_script_result = await fetch(
                        `${apiUrl}/api/boothwyn/send-script`,
                        {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${process.env.BV_API_KEY}`,
                            },
                            body: JSON.stringify({
                                body_json: orderData.pharmacy_script,
                                orderId: orderData.id!,
                                providerId:
                                    orderData.assigned_provider ??
                                    '24138d35-e26f-4113-bcd9-7f275c4f9a47',
                                orderType: OrderType.Order,
                                source: ScriptSource.Order_PaymentFailure,
                            }),
                        }
                    );

                    const res = await boothwyn_script_result.json();

                    if (res.result == 'success') {
                        await updateTrackerStatus(orderData.id!, 'resolved');

                        return new NextResponse(
                            JSON.stringify({
                                message: `Payment Failure Resolved, Subscription Created for order ID: ${orderData.id!}`,
                            }),
                            {
                                status: 200,
                                headers: { 'Content-Type': 'application/json' },
                            }
                        );
                    } else {
                        return new NextResponse(
                            JSON.stringify({ message: 'Bad Request' }),
                            {
                                status: 400,
                                headers: { 'Content-Type': 'application/json' },
                            }
                        );
                    }
                }

                /**
                 * Revive Section
                 */
                if (orderData.assigned_pharmacy === 'revive') {
                    const apiUrl = await getURL();

                    const revive_script_result = await fetch(
                        `${apiUrl}/api/revive/send-script`,
                        {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${process.env.BV_API_KEY}`,
                            },
                            body: JSON.stringify({
                                body_json: orderData.pharmacy_script,
                                orderId: orderData.id!,
                                providerId:
                                    orderData.assigned_provider ??
                                    '24138d35-e26f-4113-bcd9-7f275c4f9a47',
                                orderType: OrderType.Order,
                                renewalOrderId: undefined,
                                subscriptionId: undefined,
                                variantIndex: undefined,
                                source: ScriptSource.Order_PaymentFailure,
                            }),
                        }
                    );

                    const res = await revive_script_result.json();

                    if (res.result == 'success') {
                        await updateTrackerStatus(orderData.id!, 'resolved');

                        return new NextResponse(
                            JSON.stringify({
                                message: `Payment Failure Resolved, Subscription Created for order ID: ${orderData.id!}`,
                            }),
                            {
                                status: 200,
                                headers: { 'Content-Type': 'application/json' },
                            }
                        );
                    } else {
                        return new NextResponse(
                            JSON.stringify({ message: 'Bad Request' }),
                            {
                                status: 400,
                                headers: { 'Content-Type': 'application/json' },
                            }
                        );
                    }
                }

                /**
                 * TMC Section
                 */
                if (orderData.assigned_pharmacy === 'tmc') {
                    const apiUrl = await getURL();

                    const tmc_script_result = await fetch(
                        `${apiUrl}/api/tmc/send-script`,
                        {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${process.env.BV_API_KEY}`,
                            },
                            body: JSON.stringify({
                                jsonData: orderData.pharmacy_script,
                                orderId: orderData.id!,
                                providerId:
                                    orderData.assigned_provider ??
                                    '24138d35-e26f-4113-bcd9-7f275c4f9a47',
                            }),
                        }
                    );

                    const resp = await tmc_script_result.json();

                    if (resp.result === 'success') {
                        await updateTrackerStatus(orderData.id!, 'resolved');

                        return new NextResponse(
                            JSON.stringify({
                                message: `Payment Failure Resolved, Subscription Created for order ID: ${orderData.id!}`,
                            }),
                            {
                                status: 200,
                                headers: { 'Content-Type': 'application/json' },
                            }
                        );
                    } else {
                        return new NextResponse(
                            JSON.stringify({ message: 'Bad Request' }),
                            {
                                status: 400,
                                headers: { 'Content-Type': 'application/json' },
                            }
                        );
                    }
                }

                /**
                 * Curexa Section
                 */
                if (orderData.assigned_pharmacy === 'curexa') {
                    const response = await createAndSendCurexaOrder(
                        orderData.pharmacy_script,
                        {
                            id: orderData.id!,
                            assigned_provider:
                                orderData.assigned_provider ??
                                '24138d35-e26f-4113-bcd9-7f275c4f9a47',
                            customer_uid: orderData.customer_uid!,
                            address_line1: orderData.address_line1 ?? '',
                            address_line2: orderData.address_line2 ?? '',
                            state: orderData.state ?? '',
                            zip: orderData.zip ?? '',
                            city: orderData.city ?? '',
                            subscription_type:
                                orderData.subscription_type ?? '',
                        }
                    );

                    if (response.status == 'success') {
                        await updateExistingOrderStatusUsingIdAfterPaymentFailure(
                            Number(orderData.id!),
                            'Approved-CardDown-Finalized'
                        );
                        await updateTrackerStatus(orderData.id!, 'resolved');

                        updateOrderShippingStatusAndExternalMetadata(
                            orderData.id!,
                            'In Processing',
                            { curexa_result: response }
                        );
                        return new NextResponse(
                            JSON.stringify({
                                message: `Payment Failure Resolved, Subscription Created for order ID: ${orderData.id!}`,
                            }),
                            {
                                status: 200,
                                headers: { 'Content-Type': 'application/json' },
                            }
                        );
                    } else {
                        return new NextResponse(
                            JSON.stringify({ message: 'Bad Request' }),
                            {
                                status: 400,
                                headers: { 'Content-Type': 'application/json' },
                            }
                        );
                    }
                }

                /**
                 * GGM Section
                 */
                if (orderData.assigned_pharmacy === 'ggm') {
                    const response = await sendGGMRequest(
                        orderData.pharmacy_script,
                        {
                            id: orderData.id!,
                            assigned_provider:
                                orderData.assigned_provider ??
                                '24138d35-e26f-4113-bcd9-7f275c4f9a47',
                            customer_uid: orderData.customer_uid!,
                        },
                        {
                            address_line1: orderData.address_line1 ?? '',
                            address_line2: orderData.address_line2 ?? '',
                            state: orderData.state ?? '',
                            zip: orderData.zip ?? '',
                            city: orderData.city ?? '',
                        }
                    );

                    if (response) {
                        await updateTrackerStatus(orderData.id!, 'resolved');

                        await updateExistingOrderStatusUsingIdAfterPaymentFailure(
                            Number(orderData.id!),
                            'Approved-CardDown-Finalized'
                        );
                        await updateOrderShippingStatusAndExternalMetadata(
                            orderData.id!,
                            'In Processing',
                            { ggm: response }
                        );

                        return new NextResponse(
                            JSON.stringify({
                                message: `Payment Failure Resolved, Subscription Created for order ID: ${orderData.id!}`,
                            }),
                            {
                                status: 200,
                                headers: { 'Content-Type': 'application/json' },
                            }
                        );
                    } else {
                        return new NextResponse(
                            JSON.stringify({ message: 'Bad Request' }),
                            {
                                status: 400,
                                headers: { 'Content-Type': 'application/json' },
                            }
                        );
                    }
                }
            } else {
                /**
                 * If charge is not successful, we can move on since a payment failure audit is created.
                 */
                return new NextResponse(
                    JSON.stringify({
                        message: `Payment did not succeed in retry. Added back to retry queue.`,
                    }),
                    {
                        status: 200,
                        headers: { 'Content-Type': 'application/json' },
                    }
                );
            }

            return new NextResponse(
                JSON.stringify({ message: 'Data received successfully. No ' }),
                {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        }
    } catch (error: any) {
        console.error('api/supabase/payment-failure | error: ', error);
        return new NextResponse(
            JSON.stringify({
                message: `There was an error in processing: ${error.message}`,
            }),
            {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }
}
