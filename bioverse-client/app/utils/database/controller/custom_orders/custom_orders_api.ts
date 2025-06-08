'use server';

import {
    CustomOrder,
    CustomOrderStatus,
} from '@/app/types/custom_orders/custom-order-types';
import { createSupabaseServiceClient } from '@/app/utils/clients/supabaseServerClient';
import { isRenewalOrder } from '../renewal_orders/renewal_orders';
import { OrderType } from '@/app/types/orders/order-types';

export async function insertNewCustomOrder(
    custom_order_id: string,
    reference_order_id: string,
    prescription_json: any,
    sender_id: string,
    product_href: string,
    patient_id: string,
) {
    const supabase = createSupabaseServiceClient();

    await supabase.from('custom_orders').insert({
        custom_order_id,
        reference_order_id,
        prescription_json,
        order_status: CustomOrderStatus.PharmacyProcessing,
        sender_id,
        product_href,
        patient_id,
    });
}

export async function generateCustomOrderIdForReferenceOrder(
    reference_order_id: string,
) {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('custom_orders')
        .select('*')
        .eq('reference_order_id', reference_order_id)
        .order('created_at', { ascending: false });

    if (error) {
        console.error(`generateCustomOrderId Error ${error}`);
        throw new Error(error.message);
    }

    if (!data) {
        return generateCustomOrderId(reference_order_id, 0);
    }

    return generateCustomOrderId(reference_order_id, data.length);
}

async function generateCustomOrderId(
    reference_order_id: string,
    renewal_count: number,
): Promise<string> {
    return 'custom_' + reference_order_id + 'R'.repeat(renewal_count);
}

export async function isCustomOrder(order_id: string) {
    return order_id.includes('custom');
}

export async function getOrderType(order_id: string, pharmacy: string) {
    if (await isRenewalOrder(order_id, pharmacy)) {
        return OrderType.RenewalOrder;
    } else if (await isCustomOrder(order_id)) {
        return OrderType.CustomOrder;
    } else {
        return OrderType.Order;
    }
}

export async function shouldCreateEasypostTrackerForCustomOrder(
    custom_order_id: string,
) {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('custom_orders')
        .select('*')
        .eq('custom_order_id', custom_order_id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

    if (error) {
        console.error('error shouldCreateEasypostTrackerForCustomOrder', error);
        return true;
    }

    if (!data || !data.easypost_tracking_id) {
        return true;
    }
    return false;
}

export async function updateCustomOrder(custom_order_id: string, payload: any) {
    const supabase = createSupabaseServiceClient();

    await supabase
        .from('custom_orders')
        .update(payload)
        .eq('custom_order_id', custom_order_id);
}

export async function getCustomOrder(
    custom_order_id: string,
): Promise<CustomOrder> {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('custom_orders')
        .select('*')
        .eq('custom_order_id', custom_order_id)
        .limit(1)
        .single();

    if (error) {
        console.error('getCustomOrderError', custom_order_id);
        throw new Error(error.message);
    }

    return data as CustomOrder;
}
