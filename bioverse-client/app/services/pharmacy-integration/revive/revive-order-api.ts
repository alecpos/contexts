'use server';

import { createSupabaseServiceClient } from '@/app/utils/clients/supabaseServerClient';

export async function getReviveOrderFromIdentifier(
    revive_medication_order_id: string
): Promise<{ orderId: string; isRenewal: boolean }> {
    const supabase = createSupabaseServiceClient();

    const { data: firstTimeOrderData, error: firstTimeOrderError } =
        await supabase
            .from('orders')
            .select('id')
            .eq(
                'external_tracking_metadata->revive_medication_order_id',
                revive_medication_order_id
            )
            .limit(1)
            .maybeSingle();

    if (firstTimeOrderData) {
        return { orderId: firstTimeOrderData.id, isRenewal: false };
    }

    const { data: renewalOrderData, error: renewalOrderError } = await supabase
        .from('renewal_orders')
        .select('original_order_id')
        .eq(
            'external_tracking_metadata->revive_medication_order_id',
            revive_medication_order_id
        )
        .limit(1)
        .maybeSingle();

    if (renewalOrderData) {
        return {
            orderId: renewalOrderData.original_order_id,
            isRenewal: true,
        };
    }

    if (firstTimeOrderError || renewalOrderError) {
        throw new Error('Error fetching order data', {
            cause: firstTimeOrderError || renewalOrderError,
        });
    }

    throw new Error('No order not found');
}
