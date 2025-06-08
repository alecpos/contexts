'use server';

import { Status } from '@/app/types/global/global-enumerators';
import { createSupabaseServiceClient } from '@/app/utils/clients/supabaseServerClient';
import { isEmpty } from 'lodash';

export async function getReviveIdByPatientId(
    patientId: string
): Promise<string | undefined> {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('revive_pharmacy_patient_data')
        .select(`*`)
        .eq('patient_id', patientId)
        .limit(1)
        .maybeSingle();

    if (error || isEmpty(data)) {
        return undefined;
    }

    return data.revive_patient_id;
}

export async function createRevivePatientSupabaseEntry(
    patientId: string,
    revivePatientId: string
) {
    const supabase = createSupabaseServiceClient();

    const { error } = await supabase
        .from('revive_pharmacy_patient_data')
        .insert({
            patient_id: patientId,
            revive_patient_id: revivePatientId,
        });

    if (error) {
        console.error(
            'createRevivePatientSupabaseEntry error in creating revive patient registry. error details: ',
            error
        );
        return Status.Error;
    }

    return Status.Success;
}
