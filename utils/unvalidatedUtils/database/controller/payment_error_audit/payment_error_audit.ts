'use server';

import { createSupabaseServiceClient } from '@/app/utils/clients/supabaseServerClient';

export async function postPaymentError(patient_id: string, error_details: any) {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase.from('payment_error_audit').insert({
        error_details: error_details,
        patient_id: patient_id,
    });
}
