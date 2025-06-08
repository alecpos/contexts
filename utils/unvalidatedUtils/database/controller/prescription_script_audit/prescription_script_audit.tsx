'use server';

import { createSupabaseServiceClient } from '@/app/utils/clients/supabaseServerClient';

export async function saveScriptForFutureUse(
    json_script: any,
    order_id: string,
    pharmacy: string,
    source: string
) {
    const supabase = createSupabaseServiceClient();

    let parsedScript;
    try {
        parsedScript = JSON.parse(json_script);
    } catch (e) {
        // If parsing fails, it means json_script is already a JSON object
        parsedScript = json_script;
    }

    const { error } = await supabase.from('prescription_script_audit').insert({
        order_id: order_id,
        erx_script: parsedScript,
        pharmacy: pharmacy,
        source,
    });
}

export async function getScriptUsingOrderID(order_id: string) {
    const supabase = createSupabaseServiceClient();

    const { data: script_data, error } = await supabase
        .from('prescription_script_audit')
        .select('order_id, erx_script, pharmacy')
        .eq('order_id', order_id)
        .single();

    if (error) {
        return null;
    }

    return script_data;
}
