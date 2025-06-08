'use server';

import { OrderType } from '@/app/types/orders/order-types';
import {
    createSupabaseServerComponentClient,
    createSupabaseServiceClient,
} from '@/app/utils/clients/supabaseServerClient';
import { forwardOrderToEngineering } from '../patient-status-tags/patient-status-tags-api';
import ActionItemFactory from '@/app/components/patient-portal/action-items/utils/ActionItemFactory';
import { extractRenewalOrderId } from '@/app/utils/functions/client-utils';

export async function insertPharmacyOrderAudit(
    json_payload: any,
    pharmacy: string,
    order_number: string,
    provider_id: string | null,
    source: string,
    response?: any,
) {
    const supabase = createSupabaseServerComponentClient();

    let parsedPayload: any = json_payload;
    if (typeof json_payload === 'string') {
        parsedPayload = JSON.parse(json_payload);
    } else {
        parsedPayload = json_payload;
    }

    const { error } = await supabase.from('pharmacy_order_audit').insert({
        json_payload: json_payload,
        pharmacy: pharmacy,
        order_number: order_number,
        provider_id: provider_id,
        response: response ?? null,
        source,
    });

    if (error) {
        console.error(
            'Controller Error: Tablename: pharmacy_order_audit, method: insertPharmacyOrderAudit, error: ',
            error.message,
        );
    }
}

export async function hasSentOrderRecentlyHallandale(
    order_id: string,
    orderType: OrderType,
) {
    const supabase = createSupabaseServiceClient();

    if (orderType === OrderType.Order) {
        return false;
    }

    if (orderType === OrderType.RenewalOrder) {
        const extracted = extractRenewalOrderId(order_id);

        const originalOrderId = extracted[0];
        const renewalNumber = extracted[1];

        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 1);

        const { data, error } = await supabase
            .from('pharmacy_order_audit')
            .select('*')
            .in('order_number', [
                order_id,
                renewalNumber === 1
                    ? originalOrderId
                    : `${originalOrderId}-${renewalNumber - 1}`,
            ])
            .gte('created_at', threeDaysAgo.toISOString());

        if (error) {
            console.error(
                'Error checking if order sent recently - hallandale',
                order_id,
            );
            await forwardOrderToEngineering(
                order_id,
                null,
                'Failed to check if order sent recently to hallandale',
            );
            return true;
        }

        if (data?.length === 0) {
            return false;
        }
        return true;
    }
}
