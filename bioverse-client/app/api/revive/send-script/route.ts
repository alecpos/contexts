import { getReviveToken } from '@/app/services/pharmacy-integration/revive/revive-token-api';
import { autoUpdateStripeSubscriptionRenewalDate } from '@/app/services/stripe/subscriptions';
import { Status } from '@/app/types/global/global-enumerators';
import { OrderType } from '@/app/types/orders/order-types';
import { PHARMACY } from '@/app/types/pharmacy-integrations/pharmacy-types';
import { RenewalOrderStatus } from '@/app/types/renewal-orders/renewal-orders-types';
import { updateRenewalOrderMetadata } from '@/app/utils/actions/provider/update-renewal-order-metadata';
import { OrderDataAuditActions } from '@/app/utils/database/controller/order_data_audit/order_audit_descriptions';
import {
    createOrderDataAudit,
    hasOrderPharmacyScriptBeenSent,
} from '@/app/utils/database/controller/order_data_audit/order_data_audit_api';
import {
    updateOrderExternalMetadata,
    updateExistingOrderStatusUsingId,
    updateOrderMetadata,
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
    updateRenewalOrderMetadataSafely,
} from '@/app/utils/database/controller/renewal_orders/renewal_orders';
import { checkIfOrderIsSplitShipmentVariant, createSplitShipmentGLP1Record } from '@/app/utils/functions/split-shipment-glp1/split-shipment-glp1-controller';
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
        console.log("Missing revivejsonPayload for order", orderId)
        return NextResponse.json(
            { error: 'Missing jsonPayload' },
            { status: 400 }
        );
    }

    const hasSent = await hasOrderPharmacyScriptBeenSent(
        orderId,
        renewalOrderId
    );

    const { isSplitShipmentVariant, shipmentNumber } = 
        await checkIfOrderIsSplitShipmentVariant(
            variantIndex,
            renewalOrderId ?? orderId
        );

    if (hasSent && !overrideAudit && !isSplitShipmentVariant) {
        await createOrderDataAudit(
            orderId,
            renewalOrderId,
            `Order ${
                renewalOrderId ?? orderId
            } attempted to send a dupliacte prescription to Revive.`,
            OrderDataAuditActions.DuplicateScriptBlocked,
            {
                source: source,
                pharmacy: PHARMACY.REVIVE,
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

    const revive_token = await getReviveToken();

    const medicationOrderId = body_json.medication_order_identifier;

    const REVIVE_PRESCRIPTION_BASE_URL =
        process.env.REVIVE_PRESCRIPTION_BASE_URL!;

    console.log("medicationOrderID for order: ", orderId, medicationOrderId)

    try {
        const response = await fetch(
            `${REVIVE_PRESCRIPTION_BASE_URL}/${medicationOrderId}/submit`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'x-pmk-authentication-token': revive_token,
                },
                body: JSON.stringify(body_json),
            }
        );

        if (response.status === 200) {
            const revive_response = await response.json();

            if (orderType === OrderType.Order) {
                await updateSubscriptionLastUsedJSON(
                    orderId,
                    PHARMACY.REVIVE,
                    body_json
                );

                //make sure that if this is the second shipment, we don't overwrite the existing external_tracking_metadata
                if (isSplitShipmentVariant && shipmentNumber === 'second') {
                        await updateOrderExternalMetadata(orderId, {
                            revive_result_payload_second_shipment: revive_response,
                            revive_medication_order_id_second_shipment:
                                body_json.medication_order_identifier,
                        });
                        await updateOrderMetadata(
                            {
                                revive_medication_order_id_second_shipment:
                                    body_json.medication_order_identifier,
                            },
                            orderId
                        );
                } else {
                        await updateOrderExternalMetadata(orderId, {
                            revive_result_payload: revive_response,
                            revive_medication_order_id:
                                body_json.medication_order_identifier,
                        });
                        await updateOrderMetadata(
                            {
                                revive_medication_order_id:
                                    body_json.medication_order_identifier,
                            },
                            orderId
                        );
                }

                await insertPharmacyOrderAudit(
                    body_json,
                    'revive',
                    orderId,
                    providerId,
                    source,
                    revive_response
                );



                //make sure that if this is the second shipment, we create a unique orderDataAudit for the second shipment
                if (isSplitShipmentVariant && shipmentNumber === 'second') { 
                    await createOrderDataAudit(
                        orderId,
                        undefined,
                        `Revive Script for the second shipment of Order: ${orderId} has been sent.`,
                        OrderDataAuditActions.SecondSplitShipmentScriptSent, //<-- special action for second split shipment
                        {
                            source: source,
                            revive_response: revive_response,
                            pharmacy: 'revive',
                            variantIndex: variantIndex,
                            revive_medication_order_id:
                                body_json.medication_order_identifier,
                        },
                        { script_json: body_json }
                    );
                } else {
                    await createOrderDataAudit(
                        orderId,
                        undefined,
                        `Revive Script for Order: ${orderId} has been sent.`,
                        !overrideAudit
                            ? OrderDataAuditActions.PrescriptionSent
                            : OrderDataAuditActions.ResendPrescription,
                        {
                            source: source,
                            revive_response: revive_response,
                            pharmacy: 'revive',
                            variantIndex: variantIndex,
                            revive_medication_order_id:
                                body_json.medication_order_identifier,
                        },
                        { script_json: body_json }
                    );

                    const { error } = await updateExistingOrderStatusUsingId(
                        Number(orderId),
                        'Approved-CardDown-Finalized'
                    );

                    await createFirstTimeRenewalOrder(orderId); // make the first-renewal order if the shipment is not split or if the shipment is the first shipment
                } 
            


                if (isSplitShipmentVariant && shipmentNumber !== 'second') {
                    //1. create the split shipment record with timestamps (the cron will execute the script the first time it sees that the timestamp is in the past)
                    //2. update the metadata with the split shipment record id
                    try {
                        const splitShipmentRecordId = await createSplitShipmentGLP1Record( //CREATE THE SPLIT SHIPMENT RECORD to handle the second shipment later
                            orderId,
                            body_json
                        );
    
                        await updateOrderMetadata(
                            {
                                splitShipmentRecordId: splitShipmentRecordId,
                            },
                            orderId
                        );
                    } catch (error) {
                        console.log(
                            'Revive SPLIT SHIPMENT TRY-CATCH ERROR C1: ',
                            error
                        );
                    }
                }

                
            } else if (orderType === OrderType.RenewalOrder) {

                //need to add splitshipment record creation to this block!
                 
                await updateSubscriptionLastUsedJSON(
                    orderId,
                    'revive',
                    body_json
                );

                await updateRenewalOrderExternalTrackingMetadata(
                    renewalOrderId,
                    {
                        revive_result_payload: revive_response,
                        revive_medication_order_id:
                            body_json.medication_order_identifier,
                    }
                );

                await updateRenewalOrderMetadataSafely(
                    {
                        revive_medication_order_id:
                            body_json.medication_order_identifier,
                    },
                    renewalOrderId
                );

                await insertPharmacyOrderAudit(
                    body_json,
                    'revive',
                    renewalOrderId,
                    providerId,
                    source,
                    revive_response
                );


                //make sure that if this is the second shipment, we create a unique orderDataAudit for the second shipment
                if (isSplitShipmentVariant && shipmentNumber === 'second') {
                    await createOrderDataAudit(
                        orderId,
                        renewalOrderId,
                        `Revive Script for the second shipment of Order: ${orderId} has been sent.`,
                        OrderDataAuditActions.SecondSplitShipmentScriptSent, //<-- special action for second split shipment
                        {
                            source: source,
                            revive_response: revive_response,
                            pharmacy: PHARMACY.REVIVE,
                            variantIndex: variantIndex,
                        },
                        { script_json: body_json }
                    );
                } else {
                    await createOrderDataAudit(
                        orderId,
                        renewalOrderId,
                        `Revive Script for Order: ${orderId} has been sent.`,
                        OrderDataAuditActions.PrescriptionSent,
                        {
                            source: source,
                            revive_response: revive_response,
                            pharmacy: PHARMACY.REVIVE,
                            variantIndex: variantIndex,
                        },
                        { script_json: body_json }
                    );

                    await createUpcomingRenewalOrderWithRenewalOrderId( //make the upcoming renewal order if the shipment is not split or if the shipment is the first shipment
                        renewalOrderId
                    );
                }

                if (isSplitShipmentVariant && shipmentNumber !== 'second') {
                    //1. create the split shipment record with timestamps (the cron will execute the script the first time it sees that the timestamp is in the past)
                    //2. update the metadata with the split shipment record id
                    try {
                        const splitShipmentRecordId = await createSplitShipmentGLP1Record( //CREATE THE SPLIT SHIPMENT RECORD to handle the second shipment later
                            renewalOrderId,
                            body_json
                        );

                        await updateRenewalOrderMetadataSafely(
                            {
                                splitShipmentRecordId: splitShipmentRecordId,
                            },
                            renewalOrderId
                        );
                    } catch (error) {
                        console.log(
                            'Revive SPLIT SHIPMENT TRY-CATCH ERROR C3: ',
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
                    PHARMACY.REVIVE,
                    source
                );
            } else if (orderType === OrderType.RenewalOrder) {
                SaveJsonUsedToFailureTable(
                    body_json,
                    renewalOrderId,
                    providerId,
                    'Error occurred in sending script.',
                    responseContent,
                    PHARMACY.REVIVE,
                    source
                );
            }

            return Response.json(
                {
                    result: Status.Failure,
                    reason: 'revive-script-error',
                },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error('Error validating medication order:', error);
        return NextResponse.json(
            { error: 'Failed to validate medication order' },
            { status: 500 }
        );
    }
}
