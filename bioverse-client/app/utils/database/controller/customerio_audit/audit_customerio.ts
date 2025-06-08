import { createSupabaseServiceClient } from '@/app/utils/clients/supabaseServerClient';

export async function auditCustomerioFailure(
    user_id: string,
    event_name: string,
    payload: any,
    error: any,
) {
    const supabase = createSupabaseServiceClient();

    await supabase
        .from('audit_customerio')
        .insert({ user_id, event: event_name, payload, error });
}
