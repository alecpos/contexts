'use server';

import { createSupabaseServiceClient } from '@/app/utils/clients/supabaseServerClient';

export async function addSubscriptionStatusAudit(
    actor: string,
    new_status: string,
    order_id?: string,
    subscription_id?: string
) {
    const supabase = createSupabaseServiceClient();

    const { error } = await supabase.from('subscription_status_audit').insert({
        new_status: new_status,
        actor: actor,
        ...(order_id ? { order_id: order_id } : {}),
        ...(subscription_id ? { subscription_id: subscription_id } : {}),
    });
}
