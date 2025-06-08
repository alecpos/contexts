'use server';

import {
    createSupabaseServerComponentClient,
    createSupabaseServiceClient,
} from '../../clients/supabaseServerClient';

export async function getPatientInformationById(patientId: string) {
    const supabase = createSupabaseServiceClient();

    const { data: patientData, error: patientDataFetchError } = await supabase
        .from('profiles')
        .select(
            `
            id,
            email,
            first_name,
            last_name,
            created_at,
            date_of_birth,
            sex_at_birth,
            address_line1,
            address_line2,
            city,
            state,
            zip,
            phone_number,
            created_at,
            dose_spot_id,
            license_photo_url,
            selfie_photo_url,
            personal_data_recently_changed,
            subscriptions:prescription_subscriptions!patient_id (
                product_href,
                variant_text
            )
        `
        )
        .eq('id', patientId)
        .single();

    if (patientDataFetchError) {
        console.log('Patient Overview TS: ', patientDataFetchError.message);
        return { data: null, error: patientDataFetchError };
    }

    return { data: patientData, error: null };
}
