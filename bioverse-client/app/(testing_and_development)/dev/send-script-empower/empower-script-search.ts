'use server';

import { createSupabaseServiceClient } from '@/app/utils/clients/supabaseServerClient';

export async function empowerManualSearch(order_number: string) {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('prescription_script_audit')
        .select('*')
        .eq('order_id', order_number);

    return data;
}
