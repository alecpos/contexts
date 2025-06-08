'use server';

import { OrderType, ScriptSource } from '@/app/types/orders/order-types';
import { RenewalOrderStatus } from '@/app/types/renewal-orders/renewal-orders-types';
import { updateOrderPharmacyScript } from '@/app/utils/database/controller/orders/orders-api';
import { chargeCustomerV2 } from '../../stripe/charge-customer';
import { Status } from '@/app/types/global/global-enumerators';
import { forwardOrderToEngineering } from '@/app/utils/database/controller/patient-status-tags/patient-status-tags-api';
import {
    updateRenewalOrderByRenewalOrderId,
    updateRenewalOrderFromRenewalOrderId,
} from '@/app/utils/database/controller/renewal_orders/renewal_orders';
import { getOrderStatusDetails } from '@/app/utils/functions/renewal-orders/renewal-orders';
import { getURL } from '@/app/utils/functions/utils';

export async function sendReviveScript(
    script: ReviveScriptJSON,
    orderId: string, // renewal order's ID, not renewal_order_id
    providerId: string,
    order_status: string,
    order_type: OrderType,
    subscriptionId?: string,
    renewalOrderId?: string,
    variant_index?: number
) {
    console.log('Revive Script Props:', {
        script,
        orderId,
        providerId,
        order_status,
        order_type,
        subscriptionId,
        renewalOrderId,
        variant_index,
    });

    // const apiUrl = await getURL();
    // const res = await fetch(`${apiUrl}/api/revive/send-script`, {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         Authorization: `Bearer ${process.env.BV_API_KEY}`,
    //     },
    //     body: JSON.stringify({
    //         body_json: script,
    //         orderId: orderId,
    //         providerId: providerId,
    //         orderType: order_type,
    //         renewalOrderId: renewalOrderId ?? undefined,
    //         subscriptionId: subscriptionId ?? undefined,
    //         variantIndex: variant_index ?? undefined,
    //         source: ScriptSource.ConfirmPrescriptionDialog,
    //     }),
    // });

    // try {
    //     const data = await res.json();
    //     return {
    //         result: Status.Success,
    //         reason: undefined,
    //     };
    // } catch (error) {
    //     console.error('Error parsing Revive response:', error);
    //     return {
    //         result: Status.Failure,
    //         reason: 'Failed to parse response',
    //     };
    // }

    if (order_type === OrderType.Order) {
        await updateOrderPharmacyScript(script, orderId);
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
        if (order_type === OrderType.RenewalOrder) {
            const details = getOrderStatusDetails(order_status);
            if (!details.isPaid) {
                await updateRenewalOrderFromRenewalOrderId(renewalOrderId!, {
                    prescription_json: script,
                });
                await forwardOrderToEngineering(
                    renewalOrderId!,
                    null,
                    'Attempted to send Revive renewal order with issue'
                );
                return { result: Status.Success, reason: undefined };
            }
        }

        const apiUrl = await getURL();
        const res = await fetch(`${apiUrl}/api/revive/send-script`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.BV_API_KEY}`,
            },
            body: JSON.stringify({
                body_json: script,
                orderId: orderId,
                providerId: providerId,
                orderType: order_type,
                renewalOrderId: renewalOrderId ?? undefined,
                subscriptionId: subscriptionId ?? undefined,
                variantIndex: variant_index ?? undefined,
                source: ScriptSource.ConfirmPrescriptionDialog,
            }),
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => null);
            console.error('Revive script send failed:', errorData);
            return {
                result: Status.Failure,
                reason:
                    errorData?.message || `HTTP error! status: ${res.status}`,
            };
        }

        try {
            const data = await res.json();
            return {
                result: Status.Success,
                reason: undefined,
            };
        } catch (error) {
            console.error('Error parsing Revive response:', error);
            return {
                result: Status.Failure,
                reason: 'Failed to parse response',
            };
        }
    } else {
        /**
         * Payment Failure Loop will handle things
         */
        return { result: Status.Success, reason: 'Payment-Failure' };
    }
}

export async function processAutomaticReviveScript(
    script: ReviveScriptJSON,
    orderId: string, // renewal order's ID, not renewal_order_id
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
        const res = await fetch(`${apiUrl}/api/revive/send-script`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.BV_API_KEY}`,
            },
            body: JSON.stringify({
                body_json: script,
                orderId: orderId,
                providerId: providerId,
                orderType: order_type,
                renewalOrderId: renewalOrderId ?? undefined,
                subscriptionId: subscriptionId ?? undefined,
                variantIndex: variant_index ?? undefined,
                source: source,
                overrideAudit: resend ?? false,
            }),
        });

        if (res.status === 200) {
            await updateRenewalOrderByRenewalOrderId(renewalOrderId!, {
                order_status: RenewalOrderStatus.PharmacyProcessing,
                variant_index: variant_index || -1,
            });

            return Status.Success;
        }
    } catch (error) {
        console.error(
            'There was an error automatically sending boothwyn script',
            error
        );
        return Status.Failure;
    }
    return Status.Failure;
}
