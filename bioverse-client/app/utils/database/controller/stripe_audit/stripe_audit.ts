'use server';

import { createSupabaseServiceClient } from '@/app/utils/clients/supabaseServerClient';

export async function getRefundAuditForPaymentIntent(
    payment_intent_id: string,
) {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('stripe_audit')
        .select(`*, profile:profiles!user_id (first_name, last_name)`)
        .eq('event_type', 'refund')
        .eq('enacted_object_id', payment_intent_id)
        .order('created_at', { ascending: false });

    if (error) {
        return { refunds: null, error: error };
    }

    return { refunds: data, error: null };
}

export async function auditStripe(
    event_type: string,
    request_data: any,
    response_data: any,
    user_id: string,
    enacted_object_id: string,
    metadata: any,
) {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('stripe_audit')
        .insert({
            event_type,
            request_data,
            response_data,
            user_id,
            enacted_object_id,
            metadata,
        });
}
