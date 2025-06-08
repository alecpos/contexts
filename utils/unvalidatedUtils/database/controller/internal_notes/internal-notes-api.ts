'use server';

import { Status } from '@/app/types/global/global-enumerators';
import { createSupabaseServiceClient } from '@/app/utils/clients/supabaseServerClient';

export async function createNewInternalNote(
    written_by_id: string,
    note: string,
    order_id: string | number,
    patient_id: string
) {
    const supabase = createSupabaseServiceClient();

    const { error } = await supabase.from('internal_notes').insert({
        written_by: written_by_id,
        note: note,
        order_id: order_id,
        patient_id: patient_id,
    });

    if (error) {
        console.error(
            'createNewInternalNote - error. Details: patient ID: ',
            patient_id,
            ' order ID: ',
            order_id,
            ' written by ID: ',
            written_by_id,
            ' error message: ',
            error.message
        );
        return Status.Error;
    }

    return Status.Success;
}

export async function getInternalNotesForPatientId(patient_id: string) {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('internal_notes')
        .select('*, employee:employees!written_by(display_name)')
        .eq('patient_id', patient_id);

    if (error) {
        console.error(
            'getInternalNotesForPatientId, patient ID: ',
            patient_id,
            ' error message: ',
            error
        );
        return null;
    }

    return data;
}
