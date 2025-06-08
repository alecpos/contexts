'use server';
import { createSupabaseServerComponentClient } from '@/app/utils/clients/supabaseServerClient';

export async function updateShippingStatusAudit(json: any, pharmacy: string) {
    const supabase = createSupabaseServerComponentClient();

    const { error } = await supabase
        .from('shipping_status_audit')
        .insert({ request_json: json, pharmacy: pharmacy });

    if (error) {
        console.log(
            'Shipping Status Audit TS Controller Error. Details: ',
            error,
        );
    }
}
