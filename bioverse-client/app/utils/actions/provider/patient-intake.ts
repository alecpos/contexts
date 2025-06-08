'use server';

import {
    createSupabaseServerComponentClient,
    createSupabaseServiceClient,
} from '../../clients/supabaseServerClient';

export async function getGeneralPatientIntakeData(patientId: string) {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('id', patientId)
        .single();
    if (error) return { error: error, data: null };

    return { data: data, error: null };
}

export const getGeneralPatientIntakeDataOld = async (patientId: string) => {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('id', patientId)
        .single();
    if (error) return { error: error.message, data: null };

    return { data };
};

export async function updatePatientDoseSpotPatientId(
    userId: string,
    doseSpotId: string
) {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('profiles')
        .update({
            dose_spot_id: doseSpotId,
            personal_data_recently_changed: false,
        })
        .eq('id', userId)
        .select();

    if (error) {
        console.log(
            'Error updating doseSpot ID for patient ',
            error.message,
            ` ID attempted: ${doseSpotId}`
        );
        return { data: null, error: error };
    }
    return { data: data, error: error };
}

/**
 * @author Nathan Cho
 * Purpose: update patient personal data recently changed column to false indicating updates do not need to happen to provider.
 * Used in DoseSpotUpdatePatientButton
 */
export async function updatePatientUpdateStatus(userId: string) {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('profiles')
        .update({ personal_data_recently_changed: false })
        .eq('id', userId);

    if (error) {
        console.log('Error updating doseSpot ID for patient ', error.message);
        return { data: null, error: error };
    }

    return { data: data, error: error };
}
