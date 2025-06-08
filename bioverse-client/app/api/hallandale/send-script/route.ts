import { autoUpdateStripeSubscriptionRenewalDate } from '@/app/services/stripe/subscriptions';
import { Status } from '@/app/types/global/global-enumerators';
import { OrderType } from '@/app/types/orders/order-types';
import { RenewalOrderStatus } from '@/app/types/renewal-orders/renewal-orders-types';
import { StatusTagNotes } from '@/app/types/status-tags/status-types';
import { OrderDataAuditActions } from '@/app/utils/database/controller/order_data_audit/order_audit_descriptions';
import {
    createOrderDataAudit,
    hasOrderPharmacyScriptBeenSent,
} from '@/app/utils/database/controller/order_data_audit/order_data_audit_api';
import {
    updateExistingOrderStatusUsingId,
    updateOrderExternalMetadata,
    updateOrderMetadata,
} from '@/app/utils/database/controller/orders/orders-api';
import { forwardOrderToEngineering } from '@/app/utils/database/controller/patient-status-tags/patient-status-tags-api';
import { SaveJsonUsedToFailureTable } from '@/app/utils/database/controller/pharmacy-order-failures/pharmacy-order-failures';
import { insertPharmacyOrderAudit } from '@/app/utils/database/controller/pharmacy_order_audit/pharmacy_order_audit';
import {
    incrementSinceLastCheckup,
    updateRecentVariants,
    updateSubscriptionLastUsedJSON,
} from '@/app/utils/database/controller/prescription_subscriptions/prescription_subscriptions';
import {
    createFirstTimeRenewalOrder,
    createUpcomingRenewalOrderWithRenewalOrderId,
    updateRenewalOrder,
    updateRenewalOrderExternalTrackingMetadata,
    updateRenewalOrderMetadataSafely,
} from '@/app/utils/database/controller/renewal_orders/renewal_orders';
import {
    checkIfOrderIsAnnualVariant,
    createAnnualGLP1Record,
} from '@/app/utils/functions/annual-glp1/annual-glp1-controller';
import { NextRequest } from 'next/server';

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

    const hasSent = await hasOrderPharmacyScriptBeenSent(
        orderId,
        renewalOrderId
    );

    const { isAnnualOrderScript, shipmentNumber } =
        await checkIfOrderIsAnnualVariant(
            variantIndex,
            renewalOrderId ?? orderId
        );

    if (hasSent && !overrideAudit && !isAnnualOrderScript) {
        await createOrderDataAudit(
            orderId,
            renewalOrderId,
            `Order ${
                renewalOrderId ?? orderId
            } attempted to send a dupliacte prescription to Hallandale.`,
            OrderDataAuditActions.DuplicateScriptBlocked,
            {
                source: source,
                pharmacy: 'Hallandale',
                variantIndex: variantIndex,
            },
            { script_json: body_json }
        );

        return Response.json(
            {
                result: Status.Failure,
                reason: 'script-already-sent-safeguard',
            },
            { status: 409 } //409 = conflict with resource
        );
    }

    try {
        const url = process.env.HALLANDALE_API_URL!;
        const username = process.env.HALLANDALE_API_USERNAME!;
        const password = process.env.HALLANDALE_API_PASSWORD!;
        const headers = new Headers({
            'Content-Type': 'application/json',
            Authorization: 'Basic ' + btoa(`${username}:${password}`),
            'X-Vendor-ID': process.env.HALLANDALE_X_VENDOR_ID!,
            'X-Location-ID': process.env.HALLANDALE_X_LOCATION_ID!,
            'X-API-Network-ID': process.env.HALLANDALE_X_API_NETWORK_ID!,
        });

        if (OrderType.Order) {
            body_json.order.general.referenceId = orderId;
        } else {
            body_json.order.general.reference_id = renewalOrderId;
        }

        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body_json),
        });

        if (response.status !== 200) {
            const responseContent = await response.text();
            console.log('content of respnse text', responseContent);
            if (orderType === OrderType.Order) {
                SaveJsonUsedToFailureTable(
                    body_json,
                    orderId,
                    providerId,
                    'Error occurred in sending script.',
                    responseContent,
                    'Hallandale',
                    source
                );
            } else if (orderType === OrderType.RenewalOrder) {
                SaveJsonUsedToFailureTable(
                    body_json,
                    renewalOrderId,
                    providerId,
                    'Error occurred in sending script.',
                    responseContent,
                    'Hallandale',
                    source
                );
            }

            return Response.json(
                {
                    result: Status.Failure,
                    reason: 'hallandale-script-error',
                },
                { status: 400 }
            );
        }

        const hallandale_response = await response.json();

        if (orderType === OrderType.Order) {
            await updateSubscriptionLastUsedJSON(
                orderId,
                'hallandale',
                body_json
            );

            //make sure that if this is the second shipment, we don't overwrite the existing external_tracking_metadata
            if (isAnnualOrderScript && shipmentNumber === 'second') {
                await updateOrderExternalMetadata(orderId, {
                    hallandaleOrderIdSecondShipment:
                        hallandale_response.data.orderId,
                });

                console.log(
                    'TESTING ANNUAL ORDERS CHECK CODE 3: Triggered as second shipment number'
                );
            } else {
                console.log(
                    'TESTING ANNUAL ORDERS CHECK CODE 2: Post script send - checks: isAnnualOrderSCript: ',
                    isAnnualOrderScript,
                    ' also shipmentNumber: ',
                    shipmentNumber
                );

                await updateOrderExternalMetadata(orderId, {
                    hallandaleOrderId: hallandale_response.data.orderId,
                });
            }

            await insertPharmacyOrderAudit(
                body_json,
                'Hallandale',
                orderId,
                providerId,
                source,
                hallandale_response
            );

            if (isAnnualOrderScript && shipmentNumber === 'second') {
                await createOrderDataAudit(
                    orderId,
                    undefined,
                    `Hallandale Script for the second set of annual medication for Order: ${orderId} has been sent.`,
                    OrderDataAuditActions.SecondAnnualShipmentSent,
                    {
                        source: source,
                        hallandale_response: hallandale_response,
                        pharmacy: 'hallandale',
                        variantIndex: variantIndex,
                    },
                    { script_json: body_json }
                );
            } else {
                await createOrderDataAudit(
                    orderId,
                    undefined,
                    `Hallandale Script for Order: ${orderId} has been sent.`,
                    !overrideAudit
                        ? OrderDataAuditActions.PrescriptionSent
                        : OrderDataAuditActions.ResendPrescription,
                    {
                        source: source,
                        hallandale_response: hallandale_response,
                        pharmacy: 'Hallandale',
                        variantIndex: variantIndex,
                    },
                    { script_json: body_json }
                );

                const { error } = await updateExistingOrderStatusUsingId(
                    Number(orderId),
                    'Approved-CardDown-Finalized'
                );

                console.log(
                    'TESTING ANNUAL ORDERS CHECK CODE 6: created orderData Audit for a first send'
                );
            }

            if (isAnnualOrderScript && shipmentNumber !== 'second') {
                await createFirstTimeRenewalOrder(orderId);

                console.log(
                    'TESTING ANNUAL ORDERS CHECK CODE 7: renewal order made for first time send'
                );

                try {
                    const annualRecordId = await createAnnualGLP1Record(
                        orderId,
                        body_json
                    );

                    await updateOrderMetadata(
                        {
                            annualRecordId: annualRecordId,
                        },
                        orderId
                    );
                } catch (error) {
                    console.log(
                        'HALLANDALE ANNUAL SHIPMENT TRY-CATCH ERROR C1: ',
                        error
                    );
                }
            }
        } else if (orderType === OrderType.RenewalOrder) {
            await updateSubscriptionLastUsedJSON(
                orderId,
                'hallandale',
                body_json
            );

            await updateRenewalOrderExternalTrackingMetadata(renewalOrderId, {
                hallandaleOrderId: hallandale_response.data.orderId,
            });

            await insertPharmacyOrderAudit(
                body_json,
                'Hallandale',
                renewalOrderId,
                providerId,
                source,
                hallandale_response
            );

            if (isAnnualOrderScript && shipmentNumber === 'second') {
                await createOrderDataAudit(
                    orderId,
                    renewalOrderId,
                    `Hallandale Script for the second set of annual medication for Order: ${orderId} has been sent.`,
                    OrderDataAuditActions.SecondAnnualShipmentSent,
                    {
                        source: source,
                        hallandale_response: hallandale_response,
                        pharmacy: 'Hallandale',
                        variantIndex: variantIndex,
                    },
                    { script_json: body_json }
                );
            } else {
                await createOrderDataAudit(
                    orderId,
                    renewalOrderId,
                    `Hallandale Script for Order: ${orderId} has been sent.`,
                    OrderDataAuditActions.PrescriptionSent,
                    {
                        source: source,
                        hallandale_response: hallandale_response,
                        pharmacy: 'Hallandale',
                        variantIndex: variantIndex,
                    },
                    { script_json: body_json }
                );
            }

            if (isAnnualOrderScript && shipmentNumber !== 'second') {
                await createUpcomingRenewalOrderWithRenewalOrderId(
                    renewalOrderId
                );

                try {
                    const annualRecordId = await createAnnualGLP1Record(
                        renewalOrderId,
                        body_json
                    );

                    await updateRenewalOrderMetadataSafely(
                        {
                            annualRecordId: annualRecordId,
                        },
                        renewalOrderId
                    );
                } catch (error) {
                    console.log(
                        'HALLANDALE ANNUAL SHIPMENT TRY-CATCH ERROR C1: ',
                        error
                    );
                }
            }
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
                    await updateRecentVariants(subscriptionId, variantIndex);
                }
            }
        }

        return Response.json(
            { result: Status.Success, reason: null },
            { status: 200 }
        );
    } catch (error: any) {
        console.error(error);
        await SaveJsonUsedToFailureTable(
            body_json,
            renewalOrderId,
            providerId,
            'Error occurred in sending script: ' + error.message,
            null,
            'Hallandale',
            source
        );

        await forwardOrderToEngineering(
            orderType === OrderType.Order ? orderId : renewalOrderId,
            null,
            StatusTagNotes.SendScriptError
        );

        return Response.json(
            { result: Status.Failure, reason: error.message },
            { status: 400 }
        );
    }
}
