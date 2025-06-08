'use server';

import { RenewalOrderStatus } from '@/app/types/renewal-orders/renewal-orders-types';
import { updateOrderPharmacyScript } from '@/app/utils/database/controller/orders/orders-api';
import { chargeCustomerV2 } from '../../stripe/charge-customer';
import { OrderType, ScriptSource } from '@/app/types/orders/order-types';
import { Status } from '@/app/types/global/global-enumerators';
import { getURL } from '@/app/utils/functions/utils';
import { convertHallandaleOrderToBase64 } from '@/app/components/provider-portal/intake-view/v2/components/tab-column/prescribe/prescribe-windows/hallandale/utils/hallandale-base64-pdf';
import { getPatientAllergyData } from '@/app/utils/database/controller/clinical_notes/clinical-notes';
import { updateRenewalOrderFromRenewalOrderId } from '@/app/utils/database/controller/renewal_orders/renewal_orders';
import { generateHallandaleScript } from '@/app/utils/functions/prescription-scripts/hallandale-approval-script-generator';
import { forwardOrderToEngineering } from '@/app/utils/database/controller/patient-status-tags/patient-status-tags-api';
import { getOrderStatusDetails } from '@/app/utils/functions/renewal-orders/renewal-orders';

export async function sendHallendaleScript(
    body_json: HallandaleScriptJSON,
    orderId: string, // renewal order's ID, not renewal_order_id
    providerId: string,
    order_status: string,
    order_type: OrderType,
    subscriptionId?: string,
    renewalOrderId?: string,
    variant_index?: number
) {
    if (order_type === OrderType.Order) {
        await updateOrderPharmacyScript(body_json, orderId);
    }

    const chargeStatus: {
        result: string;
        reason: string | null;
        actually_paid?: boolean;
    } =
        order_status === 'Payment-Completed' ||
        order_status === 'Approved-CardDown-Finalized' ||
        order_status === RenewalOrderStatus.CheckupComplete_Unprescribed_Paid ||
        order_status === RenewalOrderStatus.CheckupComplete_Unprescribed_Unpaid
            ? { result: 'success', reason: null }
            : await chargeCustomerV2(orderId, providerId, order_type);

    if (chargeStatus.result === 'success') {
        if (process.env.NEXT_PUBLIC_ENVIRONMENT === 'prod') {
            body_json.order.practice.id = 1196822;
        }

        if (order_type === OrderType.RenewalOrder) {
            const details = getOrderStatusDetails(order_status);
            if (!details.isPaid) {
                await updateRenewalOrderFromRenewalOrderId(renewalOrderId!, {
                    prescription_json: body_json,
                });
                await forwardOrderToEngineering(
                    renewalOrderId!,
                    null,
                    'Attempted to send hallandale renewal order'
                );
                return { result: Status.Success, reason: undefined };
            }
        }

        const apiUrl = await getURL();
        const res = await fetch(`${apiUrl}/api/hallandale/send-script`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.BV_API_KEY}`,
            },
            body: JSON.stringify({
                body_json: body_json,
                orderId: orderId,
                providerId: providerId,
                orderType: order_type,
                renewalOrderId: renewalOrderId ?? undefined,
                subscriptionId: subscriptionId ?? undefined,
                variantIndex: variant_index ?? undefined,
                source: ScriptSource.Manual,
            }),
        });

        return { result: Status.Success, reason: undefined };
    } else {
        /**
         * Payment Failure Loop will handle things
         */
        return { result: Status.Success, reason: 'Payment-Failure' };
    }
}

export async function processAutomaticHallandaleScript(
    body_json: HallandaleScriptJSON,
    orderId: string,
    providerId: string,
    order_status: string,
    order_type: OrderType,
    source: ScriptSource,
    subscriptionId?: string,
    renewalOrderId?: string,
    variant_index?: number,
    resend?: boolean
) {
    try {
        const apiUrl = await getURL();
        const res = await fetch(`${apiUrl}/api/hallandale/send-script`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.BV_API_KEY}`,
            },
            body: JSON.stringify({
                body_json: body_json,
                orderId: orderId,
                providerId: providerId,
                orderType: order_type,
                source,
                renewalOrderId: renewalOrderId ?? undefined,
                subscriptionId: subscriptionId ?? undefined,
                variantIndex: variant_index ?? undefined,
                overrideAudit: resend ?? false,
            }),
        });

        if (res.status === 200) {
            return Status.Success;
        }
    } catch (error) {
        console.error(
            'There was an error automatically sending hallandale script',
            error
        );
        return Status.Failure;
    }
    return Status.Failure;
}

export async function generateAndReturnHallandaleScript(
    renewalOrder: DBOrderData,
    patientData: DBPatientData,
    variant_index: number
) {
    const user_id = renewalOrder.customer_uuid;

    if (!user_id) {
        throw new Error('Could not find user_id for order');
    }

    const { data: allergyData, error: allergyError } =
        await getPatientAllergyData(user_id, 'asd');

    try {
        if (patientData && renewalOrder && allergyData) {
            const addressData: AddressInterface = {
                address_line1: renewalOrder.address_line1,
                address_line2: renewalOrder.address_line2,
                city: renewalOrder.city,
                state: renewalOrder.state,
                zip: renewalOrder.zip,
            };

            const scriptMetadata = generateHallandaleScript(
                patientData,
                renewalOrder,
                addressData,
                OrderType.RenewalOrder,
                variant_index
            );
            if (scriptMetadata) {
                const base64pdf = convertHallandaleOrderToBase64(
                    scriptMetadata.script,
                    allergyData && allergyData.length > 0
                        ? allergyData[0].allergies
                        : 'nkda'
                );

                const orderWithPdf: HallandaleOrderObject = {
                    ...scriptMetadata.script,
                    document: { pdfBase64: base64pdf },
                };

                const body_json: HallandaleScriptJSON = {
                    message: {
                        id: renewalOrder.id,
                        sentTime: new Date().toISOString(),
                    },
                    order: orderWithPdf,
                };

                return body_json;
            }
        }
        return null;
    } catch (error) {
        console.error(
            'Failed to load script for hallandale order',
            renewalOrder.renewal_order_id,
            error
        );
        await forwardOrderToEngineering(
            renewalOrder.renewal_order_id || renewalOrder.subscription_id,
            null,
            'Failed to load script for hallandale order (could be sub id if renewal order id not found ^)'
        );
    }
    return null;
}
