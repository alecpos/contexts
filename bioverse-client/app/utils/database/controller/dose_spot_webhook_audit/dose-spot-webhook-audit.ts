'use server';

import { createSupabaseServerComponentClient } from '@/app/utils/clients/supabaseServerClient';
import { Session } from '@supabase/supabase-js';

export async function insertDoseSpotWebhookAudit(
    json_payload: any,
    status_update_data: any,
    prescription_data: any
) {
    const supabase = createSupabaseServerComponentClient();

    const { error } = await supabase.from('dose_spot_webhook_audit').insert({
        json_payload: json_payload,
        status_update_data: status_update_data,
        prescription_data: prescription_data,
    });

    if (error) {
        return { error: error };
    }

    return { error: null };
}
