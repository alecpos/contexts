'use server';

import { createSupabaseServerComponentClient } from '@/app/utils/clients/supabaseServerClient';

export async function addProviderToPatientRelationship(
    patientId: string,
    providerId: string,
) {
    const supabase = await createSupabaseServerComponentClient();

    const { data: current, error: currentError } = await supabase
        .from('patient_providers')
        .select('provider_ids')
        .eq('patient_id', patientId)
        .maybeSingle();

    if (currentError) {
        console.log(
            'Controller Error. tablename: patient_providers, method: addProviderToPatientRelationship, error: ',
            currentError,
        );
        return;
    }

    if (!current) {
        const { error: insertError } = await supabase
            .from('patient_providers')
            .insert({
                patient_id: patientId,
                provider_ids: [
                    'e756658d-785d-46d5-85ab-22bf11256a59',
                    providerId,
                ],
            });
        if (insertError) {
            console.log(
                'Controller Error. tablename: patient_providers, method: addProviderToPatientRelationship, error: ',
                insertError,
            );
        }
        return;
    }

    if (!current.provider_ids.includes(providerId)) {
        const updatedProviderIds = [...current.provider_ids, providerId];
        const { error: updateError } = await supabase
            .from('patient_providers')
            .update({ provider_ids: updatedProviderIds })
            .eq('patient_id', patientId);

        if (updateError) {
            console.log(
                'Controller Error. tablename: patient_providers, method: addProviderToPatientRelationship, error: ',
                updateError,
            );
        }
    }
}

export async function addCustomerSupportToPatientOnSignup(patient_id: string) {
    if (!patient_id) {
        console.error('Failed to add CS to patient_providers');
        return;
    }

    const supabase = await createSupabaseServerComponentClient();

    const { data, error } = await supabase.from('patient_providers').insert([
        {
            patient_id,
            provider_ids: [process.env.NEXT_PUBLIC_CUSTOMER_SUPPORT_USER_ID],
        },
    ]);

    if (error) {
        console.error('Failed to add CS to patient_providers');
        console.error(error, error.message);
    }
    return;
}
