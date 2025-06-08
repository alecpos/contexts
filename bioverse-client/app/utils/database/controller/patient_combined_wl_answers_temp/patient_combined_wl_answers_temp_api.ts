'use server';

import { createSupabaseServiceClient } from '@/app/utils/clients/supabaseServerClient';

export async function insertNewWlAnswer(patient_id: string, wl_answers: any) {
    const supabase = createSupabaseServiceClient();

    const { error } = await supabase
        .from('patient_combined_wl_answers_temp')
        .upsert([{ patient_id: patient_id, answers: wl_answers }], {
            onConflict: 'patient_id',
        });

    if (error) {
        console.error('WL ANSWER RECORDING ERROR', error);
    }
}
