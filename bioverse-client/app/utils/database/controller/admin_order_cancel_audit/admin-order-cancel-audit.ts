'use server';

import { createSupabaseServerComponentClient } from '@/app/utils/clients/supabaseServerClient';
import { Session } from '@supabase/supabase-js';

export async function insertAuditIntoAdministrativeCancelTable(
    orderId: string,
    reason: string
) {
    const supabase = createSupabaseServerComponentClient();

    const uuid = (await supabase.auth.getSession()).data.session?.user.id;

    const { error } = await supabase
        .from('admin_order_cancel_audit')
        .insert({ order_id: orderId, reason: reason, admin_uuid: uuid });

    if (error) {
        return { error: error };
    }

    return { error: null };
}
