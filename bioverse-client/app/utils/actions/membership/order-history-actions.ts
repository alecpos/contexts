'use server';
import { createSupabaseBrowserClient } from '../../clients/supabaseBrowserClient';
import {
    createSupabaseServerComponentClient,
    createSupabaseServiceClient,
} from '../../clients/supabaseServerClient';
import { SubscriptionListItem } from '../../functions/patient-portal/patient-portal-utils';

export const getPatientSinglePurchaseOrderHistory = async (
    patientId: string,
) => {
    const supabase = createSupabaseServerComponentClient();

    const { data, error } = await supabase
        .from('orders')
        .select(
            `
        id, created_at, customer_uid, variant_index, variant_text, discount_id, subscription_type, price, order_status, product_href, assigned_pharmacy, shipping_status, tracking_number,
        product:products!product_href (
            name,
            image_ref
        ),
        shipping:profiles!customer_uid (
            address_line1,
            address_line2,
            city,
            state,
            zip
        )
        `,
        )
        .neq('order_status', 'Incomplete')
        .eq('customer_uid', patientId)
        .eq('subscription_type', 'one_time');

    if (error) return { error: error.message, data: null };

    return { data };
};

// TODO: Deprecate
export const getPatientSubscriptionOrderHistory = async (patientId: string) => {
    const supabase = createSupabaseServerComponentClient();

    const { data, error } = await supabase
        .from('orders')
        .select(
            `
        id, created_at, customer_uid,variant_index, variant_text, discount_id, subscription_type, price, order_status, product_href, assigned_pharmacy, shipping_status, tracking_number,
        product:products!product_href (
            name,
            image_ref
        ),
        shipping:profiles!customer_uid (
            address_line1,
            address_line2,
            city,
            state,
            zip
        )
        `,
        )
        .neq('order_status', 'Incomplete')
        .eq('customer_uid', patientId);

    if (error) return { error: error.message, data: null };

    return { data };
};

export const getSubscriptionHistory = async (
    patientId: string,
): Promise<SubscriptionListItem[]> => {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase.rpc('get_subscription_list', {
        user_id_: patientId,
    });

    if (error) {
        console.error("Error retreiving user's subscription history", error);
        return [];
    }
    return data;
};

export const cancelSubscription = async (orderId: string) => {
    const supabase = createSupabaseServerComponentClient();

    const { data: priorStatus, error: priorStatusError } = await supabase
        .from('orders')
        .select('order_status')
        .eq('id', orderId)
        .single();

    if (priorStatusError) {
        console.log(priorStatusError.message);
        return { data: null, error: priorStatusError.message };
    }

    const { data, error } = await supabase
        .from('orders')
        .update({
            order_status: 'Canceled',
            status_prior_to_cancellation: priorStatus.order_status,
        })
        .eq('id', orderId)
        .select();

    return { data };
};

export const resumeSubscription = async (orderId: string) => {
    const supabase = createSupabaseServerComponentClient();

    const { data: priorStatus, error: priorStatusError } = await supabase
        .from('orders')
        .select('status_prior_to_cancellation')
        .eq('id', orderId)
        .single();

    if (priorStatusError) {
        console.log(priorStatusError.message);
        return { data: null, error: priorStatusError.message };
    }

    const { data, error } = await supabase
        .from('orders')
        .update({
            order_status: priorStatus.status_prior_to_cancellation,
        })
        .eq('id', orderId)
        .select();

    return { data };
};
