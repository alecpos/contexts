'use server';
import { createSupabaseServiceClient } from '@/app/utils/clients/supabaseServerClient';

export async function auditRenewalOrder(
    renewal_order_id: string,
    error_json: any,
    error_message: string
) {
    const supabase = createSupabaseServiceClient();

    const { error } = await supabase.from('renewal_order_audit').insert({
        renewal_order_id,
        error_json,
        error_message,
        environment: process.env.NEXT_PUBLIC_ENVIRONMENT,
    });

    if (error) {
        console.error(
            'Error in Database Controller, filenam: renewal_order_audit.ts, method: auditRenewalOrder, error details: ',
            error
        );
    }
}
