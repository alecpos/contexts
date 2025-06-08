'use server';

import { createSupabaseServiceClient } from '../../../clients/supabaseServerClient';
import { readUserSession } from '../../../actions/auth/session-reader';

/**
 * @author Nathan Cho
 * @param fieldsToUpdate - JSON of the fields in the clinical notes to update.
 * @param patient_id - uuid of patient
 * @returns The data post-update.
 */
export async function updateClinicalNotes(
    fieldsToUpdate: ClinicalNoteUpdateObject,
    patient_id: string,
    product_href: string
) {
    const supabase = createSupabaseServiceClient();

    const { data: updatedClinicalNoteData, error: updateError } = await supabase
        .from('clinical_notes')
        .update({ ...fieldsToUpdate })
        .eq('patient_id', patient_id)
        .eq('product_href', product_href)
        .select();

    if (updateError) {
        console.log(
            'Controller Error, tablename: clinical-notes, method-name: updateClinicalNotes, error: ',
            updateError
        );
        return { data: null, error: updateError };
    }

    return { data: updatedClinicalNoteData, error: null };
}

/**
 * @author Nathan Cho
 * @param patientId - uuid of patient
 * @returns - clinical note record for patient.
 */
export async function fetchClinicalNotesWithPatientId(
    patientId: string,
    product_href: string
): Promise<any> {
    const supabase = createSupabaseServiceClient();

    const { data: clinicalNoteData, error: fetchError } = await supabase
        .from('clinical_notes')
        .select(
            `
        note,
        allergies,
        medications,
        last_modified_at,
        last_modified_by_provider_id,
        provider:profiles!last_modified_by_provider_id (
            first_name,
            last_name
        )
        `
        )
        .eq('patient_id', patientId)
        .eq('product_href', product_href)
        .maybeSingle();

    if (fetchError) {
        console.log(
            'Controller Error, tablename: clinical-notes method-name: fetchClinicalNotesWithPatientId, error: ',
            fetchError
        );
        return { data: null, error: fetchError.message };
    }

    if (!clinicalNoteData) {
        //If the clinical note does not exist, then try to create a new row
        const { data, error } = await createNewClinicalNoteEntry(
            patientId,
            product_href
        );

        if (error) {
            return { data: null, error: error };
        }

        return { data: data![0], error: null };
    } else {
        return { data: clinicalNoteData, error: null };
    }
}

async function createNewClinicalNoteEntry(
    patientId: string,
    product_href: string
) {
    const supabase = createSupabaseServiceClient();

    const providerSession = await readUserSession();

    if (!providerSession.data.session) {
        return {
            data: null,
            error: 'the provider is not logged in. Refresh Page if this is an error.',
        };
    }

    //check if the patient exists in profiles and has completed a flow:
    const { data: patientData, error: patientDataFetchError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', patientId);

    if (patientDataFetchError) {
        console.log(
            'Controller Error, tablename: clinical-notes method-name: createNewClinicalNoteEntry, error: ',
            patientDataFetchError
        );
        return { data: null, error: patientDataFetchError };
    }

    //check question answer data for pt for allergy / medications : allergyQID-168 , medicationQID-8

    const { data: medication_answer } = await supabase
        .from('questionnaire_answers')
        .select('answer')
        .eq('user_id', patientId)
        .eq('question_id', 8)
        .maybeSingle();

    let medication_converted_text;

    if (medication_answer) {
        if (medication_answer.answer.answer === 'No') {
            medication_converted_text = 'None';
        } else {
            medication_converted_text =
                medication_answer.answer.formData[1].replace(/\n/g, ', ');
        }
    }

    const { data: allergy_answer } = await supabase
        .from('questionnaire_answers')
        .select('answer')
        .eq('user_id', patientId)
        .eq('question_id', 168)
        .maybeSingle();

    let allergy_converted_text = 'NKDA';

    if (
        allergy_answer &&
        allergy_answer.answer.formData &&
        allergy_answer.answer.answer !== 'None'
    )
        allergy_converted_text = allergy_answer?.answer.formData.join(', ');

    if (patientData.length !== 0) {
        const { data: createdData, error: dataCreateError } = await supabase
            .from('clinical_notes')
            .upsert({
                patient_id: patientId,
                history_of_present_illness: '',
                past_medical_history: '',
                allergies: allergy_converted_text,
                medications: medication_converted_text,
                vitals: '',
                assessment: '',
                patient_plan: '',
                note: '',
                last_modified_at: new Date(),
                last_modified_by_provider_id:
                    providerSession.data.session.user.id,
                product_href: product_href,
            })
            .select();

        if (dataCreateError) {
            console.log(
                'Controller Error, tablename: clinical-notes method-name: createNewClinicalNoteEntry, error: ',
                dataCreateError
            );
            return { data: null, error: dataCreateError };
        }

        return { data: createdData, error: null };
    } else {
        return {
            data: null,
            error: 'The user has not finished a flow or user does not exist.',
        };
    }
}

export async function getPatientAllergyData(
    patient_id: string,
    product_href: string
) {
    const supabase = createSupabaseServiceClient();

    const { data: clinicalNoteData, error: fetchError } = await supabase
        .from('clinical_notes')
        .select('allergies')
        .eq('patient_id', patient_id);

    if (fetchError) {
        console.log(
            'Controller Error, tablename: clinical-notes method-name: getPatientAllergyData, error: ',
            fetchError
        );
        return { data: null, error: fetchError.message };
    }

    return { data: clinicalNoteData, error: null };
}

export async function getPatientMedicationData(
    patient_id: string,
    product_href: string
) {
    const supabase = createSupabaseServiceClient();

    const { data: clinicalNoteData, error: fetchError } = await supabase
        .from('clinical_notes')
        .select('medications')
        .eq('patient_id', patient_id)
        .maybeSingle();

    if (fetchError) {
        console.log(
            'Controller Error, tablename: clinical-notes method-name: getPatientMedicationData, error: ',
            fetchError
        );
        return { data: null, error: fetchError.message };
    }

    return { data: clinicalNoteData, error: null };
}

export async function getPatientAllergyAndMedicationData(patient_id: string) {
    const supabase = createSupabaseServiceClient();

    const { data: clinicalNoteData, error: fetchError } = await supabase
        .from('clinical_notes')
        .select('allergies, medications')
        .eq('patient_id', patient_id)
        .limit(1)
        .maybeSingle();

    if (fetchError) {
        console.log(
            'Controller Error, tablename: clinical-notes method-name: getPatientAllergyAndMedicationData, error: ',
            fetchError
        );
        return { data: null, error: fetchError.message };
    }

    return { data: clinicalNoteData, error: null };
}

export async function getAllPatientClinicalNoteData(patient_id: string) {
    const supabase = createSupabaseServiceClient();

    const { data: clinicalNotes, error } = await supabase
        .from('clinical_notes')
        .select(
            `*, 
            product:products!product_href(name),
            provider:profiles!last_modified_by_provider_id(first_name, last_name)`
        )
        .eq('patient_id', patient_id);

    if (error) {
        console.log(
            'Controller Error, tablename: clinical-notes method-name: getAllPatientClinicalNoteData, error: ',
            error
        );
        return { data: null, error: error.message };
    }

    return { data: clinicalNotes, error: null };
}
