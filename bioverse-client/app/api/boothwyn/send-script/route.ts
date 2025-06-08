import { autoUpdateStripeSubscriptionRenewalDate } from '@/app/services/stripe/subscriptions';
import { Status } from '@/app/types/global/global-enumerators';
import { OrderType } from '@/app/types/orders/order-types';
import { RenewalOrderStatus } from '@/app/types/renewal-orders/renewal-orders-types';
import { OrderDataAuditActions } from '@/app/utils/database/controller/order_data_audit/order_audit_descriptions';
import {
    hasOrderPharmacyScriptBeenSent,
    createOrderDataAudit,
} from '@/app/utils/database/controller/order_data_audit/order_data_audit_api';
import {
    updateOrderExternalMetadata,
    updateExistingOrderStatusUsingId,
} from '@/app/utils/database/controller/orders/orders-api';
import { SaveJsonUsedToFailureTable } from '@/app/utils/database/controller/pharmacy-order-failures/pharmacy-order-failures';
import { insertPharmacyOrderAudit } from '@/app/utils/database/controller/pharmacy_order_audit/pharmacy_order_audit';
import {
    updateSubscriptionLastUsedJSON,
    incrementSinceLastCheckup,
    updateRecentVariants,
} from '@/app/utils/database/controller/prescription_subscriptions/prescription_subscriptions';
import {
    createFirstTimeRenewalOrder,
    updateRenewalOrderExternalTrackingMetadata,
    createUpcomingRenewalOrderWithRenewalOrderId,
    updateRenewalOrder,
} from '@/app/utils/database/controller/renewal_orders/renewal_orders';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const authHeader = req.headers.get('authorization');

    if (!authHeader) {
        return Response.json(
            { message: 'Authorization header missing' },
            { status: 401 }
        );
    }

    // Verify the token is in the Bearer format
    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
        return Response.json(
            { message: 'Invalid Authorization Format' },
            { status: 401 }
        );
    }

    const key = process.env.BV_API_KEY;

    if (token !== key) {
        return Response.json({ message: 'Forbidden' }, { status: 403 });
    }

    try {
        const {
            body_json,
            orderId,
            providerId,
            orderType,
            renewalOrderId,
            subscriptionId,
            variantIndex,
            source,
            overrideAudit,
        } = await req.json();

        // Make sure jsonPayload is valid before sending
        if (!body_json) {
            return NextResponse.json(
                { error: 'Missing jsonPayload' },
                { status: 400 }
            );
        }

        const hasSent = await hasOrderPharmacyScriptBeenSent(
            orderId,
            renewalOrderId
        );

        if (hasSent && !overrideAudit) {
            await createOrderDataAudit(
                orderId,
                renewalOrderId,
                `Order ${
                    renewalOrderId ?? orderId
                } attempted to send a dupliacte prescription to Boothwyn.`,
                OrderDataAuditActions.DuplicateScriptBlocked,
                {
                    source: source,
                    pharmacy: 'Boothwyn',
                    variantIndex: variantIndex,
                },
                { script_json: body_json.script_json }
            );

            return Response.json(
                {
                    result: Status.Failure,
                    reason: 'script-already-sent-safeguard',
                },
                { status: 409 } //409 = conflict with resource
            );
        }

        const url = process.env.BOOTHWYN_API_URL!;
        const function_key = process.env.BOOTHWYN_API_X_FUNCTIONS_KEY!;

        //renewal orders come in as the left-hand, and intakes come in as the right-hand.
        //Not my best solution, but the fastest one. - Nathan
        const scriptToSend =
            (body_json.script_json as BoothwynScriptJSON) ||
            (body_json as BoothwynScriptJSON);

        if (!scriptToSend) {
            throw new Error('Invalid script data');
        }
        scriptToSend.orderType = 1;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-functions-key': function_key,
            },
            body: JSON.stringify([scriptToSend]),
        });

        if (response.status === 200) {
            const boothwyn_response = response.json();

            if (orderType === OrderType.Order) {
                await updateSubscriptionLastUsedJSON(
                    orderId,
                    'boothwyn',
                    body_json
                );

                await updateOrderExternalMetadata(orderId, {
                    boothwyn_result_payload: boothwyn_response,
                });

                await insertPharmacyOrderAudit(
                    body_json,
                    'boothwyn',
                    orderId,
                    providerId,
                    source,
                    boothwyn_response
                );

                await createOrderDataAudit(
                    orderId,
                    undefined,
                    `Boothwyn Script for Order: ${orderId} has been sent.`,
                    !overrideAudit
                        ? OrderDataAuditActions.PrescriptionSent
                        : OrderDataAuditActions.ResendPrescription,
                    {
                        source: source,
                        boothwyn_response: boothwyn_response,
                        pharmacy: 'boothwyn',
                        variantIndex: variantIndex,
                    },
                    { script_json: body_json }
                );

                const { error } = await updateExistingOrderStatusUsingId(
                    Number(orderId),
                    'Approved-CardDown-Finalized'
                );

                await createFirstTimeRenewalOrder(orderId);

                // console.log(
                //     'HallandaleRouteTimingTest : Check Level 6 - updateExistingOrderStatusUsingId passed, checking error: ',
                //     error
                // );
            } else if (orderType === OrderType.RenewalOrder) {
                await updateSubscriptionLastUsedJSON(
                    orderId,
                    'boothwyn',
                    body_json
                );

                await updateRenewalOrderExternalTrackingMetadata(
                    renewalOrderId,
                    {
                        boothwyn_result_payload: boothwyn_response,
                    }
                );

                await insertPharmacyOrderAudit(
                    body_json,
                    'boothwyn',
                    renewalOrderId,
                    providerId,
                    source,
                    boothwyn_response
                );

                await createOrderDataAudit(
                    orderId,
                    renewalOrderId,
                    `Boothwyn Script for Order: ${orderId} has been sent.`,
                    !overrideAudit
                        ? OrderDataAuditActions.PrescriptionSent
                        : OrderDataAuditActions.ResendPrescription,
                    {
                        source: source,
                        boothwyn_response: boothwyn_response,
                        pharmacy: 'Boothwyn',
                        variantIndex: variantIndex,
                    },
                    { script_json: body_json }
                );

                await createUpcomingRenewalOrderWithRenewalOrderId(
                    renewalOrderId
                );
            }

            if (orderType === OrderType.RenewalOrder) {
                if (subscriptionId) {
                    await autoUpdateStripeSubscriptionRenewalDate(
                        orderId,
                        subscriptionId
                    );
                }

                await updateRenewalOrder(Number(orderId), {
                    order_status: RenewalOrderStatus.PharmacyProcessing,
                    ...(variantIndex && { variant_index: variantIndex }),
                });

                if (subscriptionId) {
                    await incrementSinceLastCheckup(subscriptionId);
                    if (variantIndex) {
                        await updateRecentVariants(
                            subscriptionId,
                            variantIndex
                        );
                    }
                }
            }

            return NextResponse.json({ status: 200 });
        } else {
            const responseContent = await response.text();
            console.log('content of respnse text', responseContent);
            if (orderType === OrderType.Order) {
                SaveJsonUsedToFailureTable(
                    body_json,
                    orderId,
                    providerId,
                    'Error occurred in sending script.',
                    responseContent,
                    'boothwyn',
                    source
                );
            } else if (orderType === OrderType.RenewalOrder) {
                SaveJsonUsedToFailureTable(
                    body_json,
                    renewalOrderId,
                    providerId,
                    'Error occurred in sending script.',
                    responseContent,
                    'boothwyn',
                    source
                );
            }

            return Response.json(
                {
                    result: Status.Failure,
                    reason: 'boothwyn-script-error',
                },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error('Error in Boothwyn send-script:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
