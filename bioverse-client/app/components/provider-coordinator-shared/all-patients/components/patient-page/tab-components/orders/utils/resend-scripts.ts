'use server';

import { Status } from '@/app/types/global/global-enumerators';
import { OrderType, ScriptSource } from '@/app/types/orders/order-types';
import { updateOrderPharmacyScript } from '@/app/utils/database/controller/orders/orders-api';
import { getURL } from '@/app/utils/functions/utils';

export async function resendEmpowerScript(
    script_stringified: string,
    order_id: string,
    provider_id: string,
    order_type: OrderType,
    override_audit: boolean,
    renewal_order_id?: string,
    subscription_id?: number
): Promise<{
    result: Status;
    message: string;
}> {
    const script_as_json = JSON.parse(script_stringified);

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
                jsonPayload: script_as_json,
                orderId: order_id,
                providerId: provider_id,
                orderType: order_type,
                renewal_order_id: renewal_order_id || undefined,
                subscriptionId: subscription_id || undefined,
                source: ScriptSource.ResendScript,
                overrideAudit: override_audit,
            }),
        }
    );

    const data = await empower_script_result.json();

    return { result: data.result, message: data.reason };
}

export async function resendTMCScript(script_stringified: string): Promise<{
    result: Status;
    message: string;
}> {
    return { result: Status.Error, message: '' };
}

export async function resendHallandaleScript(
    script_stringified: string,
    order_id: string,
    provider_id: string,
    order_type: OrderType,
    override_audit: boolean,
    renewal_order_id?: string,
    subscription_id?: number,
    variant_index?: number
) {
    const script_as_json: HallandaleScriptJSON = JSON.parse(script_stringified);

    await updateOrderPharmacyScript(script_as_json, order_id);

    console.log('debug scripting: ', script_as_json);

    script_as_json.order.practice.id = 1196822;

    const apiUrl = await getURL();

    const response = await fetch(`${apiUrl}/api/hallandale/send-script`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.BV_API_KEY}`,
        },
        body: JSON.stringify({
            body_json: script_as_json,
            orderId: order_id,
            providerId: provider_id,
            orderType: order_type,
            renewalOrderId: renewal_order_id || undefined,
            subscriptionId: subscription_id || undefined,
            variantIndex: variant_index || undefined,
            source: ScriptSource.ResendScript,
            overrideAudit: override_audit,
        }),
    });

    const result_json = await response.json();
    if (response.status === 200) {
        return { result: Status.Success, message: '' };
    } else {
        return {
            result: Status.Failure,
            message: result_json.reason ?? 'reason-unclarified',
        };
    }
}

export async function resendBoothwynScript(
    script_stringified: string,
    order_id: string,
    provider_id: string,
    order_type: OrderType,
    override_audit: boolean,
    renewal_order_id?: string,
    subscription_id?: number,
    variant_index?: number
) {
    const script_as_json: BoothwynScriptJSON = JSON.parse(script_stringified);

    const apiUrl = await getURL();
    const res = await fetch(`${apiUrl}/api/boothwyn/send-script`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.BV_API_KEY}`,
        },
        body: JSON.stringify({
            body_json: script_as_json,
            orderId: order_id,
            providerId: provider_id,
            orderType: order_type,
            renewalOrderId: renewal_order_id ?? undefined,
            subscriptionId: subscription_id ?? undefined,
            variantIndex: variant_index ?? undefined,
            source: ScriptSource.ResendScript,
            overrideAudit: override_audit,
        }),
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        console.error('Boothwyn script send failed:', errorData);
        return {
            result: Status.Failure,
            reason: errorData?.reason || `HTTP error! status: ${res.status}`,
        };
    }

    try {
        const data = await res.json();
        return {
            result: Status.Success,
            reason: undefined,
        };
    } catch (error) {
        console.error('Error parsing Boothwyn response:', error);
        return {
            result: Status.Failure,
            reason: 'Failed to parse response',
        };
    }
}

export async function resendReviveScript(
    script_stringified: string,
    order_id: string,
    provider_id: string,
    order_type: OrderType,
    override_audit: boolean,
    renewal_order_id?: string,
    subscription_id?: number,
    variant_index?: number
) {
    const script_as_json: ReviveScriptJSON = JSON.parse(script_stringified);

    const apiUrl = await getURL();
    const res = await fetch(`${apiUrl}/api/revive/send-script`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.BV_API_KEY}`,
        },
        body: JSON.stringify({
            body_json: script_as_json,
            orderId: order_id,
            providerId: provider_id,
            orderType: order_type,
            renewalOrderId: renewal_order_id ?? undefined,
            subscriptionId: subscription_id ?? undefined,
            variantIndex: variant_index ?? undefined,
            source: ScriptSource.ResendScript,
            overrideAudit: override_audit,
        }),
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        console.error('Revive script send failed:', errorData);
        return {
            result: Status.Failure,
            reason: errorData?.reason || `HTTP error! status: ${res.status}`,
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
}
