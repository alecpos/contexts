'use server';

import { createSupabaseServiceClient } from '@/app/utils/clients/supabaseServerClient';
import { ClinicalNoteType } from './clinical_notes_enums';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { WEIGHT_LOSS_PRODUCT_HREF } from '@/app/components/intake-v2/constants/constants';
import { parseISO } from 'date-fns';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import { TEMPLATIZED_PRODUCT_LIST } from '@/app/utils/constants/clinical-note-template-product-map';
import { Status } from '@/app/types/global/global-enumerators';
import { updateCurrentProfileHeight } from '../profiles/profiles';
import { PRODUCT_TEMPLATE_LATEST_VERSION_MAP } from '@/app/utils/constants/clinical-note-template-latest-versions';

export async function getAllClinicalNotesForPatient(
    patient_id: string
): Promise<{ data: ClinicalNotesV2Supabase[] | null; error: any }> {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('clinical_notes_v2')
        .select(
            `
            *,
            creating_provider:profiles!created_by (first_name, last_name),
            editing_provider:profiles!last_modified_by (first_name, last_name)
        `
        )
        .eq('patient_id', patient_id)
        .eq('type', 'note')
        .order('created_at', { ascending: false });

    if (error) {
        return { data: null, error: error };
    }

    return { data: data, error: error };
}

export async function getClinicalNoteById(
    note_id: string
): Promise<{ data: ClinicalNotesV2Supabase[] | null; error: any }> {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('clinical_notes_v2')
        .select('*')
        .eq('id', note_id);

    if (error) {
        return { data: null, error: error };
    }

    return { data: data, error: error };
}

export async function postNewClinicalNote(
    patient_id: string,
    author_user_id: string,
    type: ClinicalNoteType,
    note: string,
    product_href?: string
): Promise<{ data: ClinicalNotesV2Supabase[] | null; error: any }> {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('clinical_notes_v2')
        .insert({
            patient_id: patient_id,
            created_by: author_user_id,
            type: type,
            note: note,
            ...(product_href ? { product_href: product_href } : {}),
        })
        .select();

    if (error) {
        return { data: null, error: error };
    }
    console.log('clinical note v2 data: ', data);
    return { data: data, error: error };
}

export async function updateClinicalNote(
    clinical_note_id: number,
    new_note: string,
    editor_user_id: string,
    previous_note?: string,
    last_modified_at?: string,
    created_at?: string
): Promise<{ data: ClinicalNotesV2Supabase[] | null; error: any }> {
    const supabase = createSupabaseServiceClient();

    let note_history_array;

    if (previous_note) {
        const { data: previous_history } = await supabase
            .from('clinical_notes_v2')
            .select('note_history')
            .eq('id', clinical_note_id)
            .limit(1)
            .maybeSingle();

        if (previous_history?.note_history) {
            note_history_array = [
                ...previous_history.note_history,
                {
                    editor: editor_user_id,
                    date: last_modified_at ?? new Date(),
                    note: previous_note,
                },
            ];
        } else {
            note_history_array = [
                {
                    editor: editor_user_id,
                    date: created_at,
                    note: previous_note,
                },
            ];
        }
    }

    const { data, error } = await supabase
        .from('clinical_notes_v2')
        .update({
            note: new_note,
            last_modified_by: editor_user_id,
            last_modified_at: new Date(),
            ...(previous_note ? { note_history: note_history_array } : {}),
        })
        .eq('id', clinical_note_id)
        .select();

    if (error) {
        return { data: null, error: error };
    }

    return { data: data, error: error };
}

export async function updateClinicalNoteTemplateData(
    clinical_note_id: number,
    new_metadata: any,
    editor_user_id: string
) {
    const supabase = createSupabaseServiceClient();

    const { data: old_metadata, error: old_metadata_error } = await supabase
        .from('clinical_notes_v2')
        .select('metadata')
        .eq('id', clinical_note_id)
        .limit(1)
        .single();

    const { data, error } = await supabase
        .from('clinical_notes_v2')
        .update({
            metadata: new_metadata,
            last_modified_by: editor_user_id,
            last_modified_at: new Date(),
            note_history: old_metadata?.metadata,
        })
        .eq('id', clinical_note_id)
        .select();

    if (error) {
        return { data: null, error: error };
    }

    return { data: data, error: error };
}

export async function retrieveAllergyAndMedicationData(patient_id: string) {
    const supabase = createSupabaseServiceClient();

    let allergy_string;
    let medication_string;

    const { data: allergy_data, error: allery_error } = await supabase
        .from('clinical_notes_v2')
        .select(`note`)
        .eq('patient_id', patient_id)
        .eq('data_type', 'allergy')
        .eq('type', 'patient_data')
        .limit(1)
        .maybeSingle();

    const { data: medication_data, error: medication_error } = await supabase
        .from('clinical_notes_v2')
        .select(`note`)
        .eq('patient_id', patient_id)
        .eq('data_type', 'medication')
        .eq('type', 'patient_data')
        .limit(1)
        .maybeSingle();

    allergy_string = allergy_data?.note ?? undefined;
    medication_string = medication_data?.note ?? undefined;

    return { allergy: allergy_string, medication: medication_string };
}

export async function addOrRetreivePatientAllergyAndMedicationData(
    patient_id: string
) {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('clinical_notes_v2')
        .select(
            `
            id,
            created_at,
            patient_id,
            created_by,
            admin_edit_access,
            type,
            note,
            product_href,
            last_modified_at,
            last_modified_by,
            data_type,
            note_history,
            creating_provider:profiles!created_by (first_name, last_name),
            editing_provider:profiles!last_modified_by (first_name, last_name)
        `
        )
        .eq('patient_id', patient_id)
        .neq('data_type', 'bmi')
        .neq('data_type', 'template')
        .eq('type', 'patient_data')
        .order('data_type', { ascending: true });

    if (error) {
        console.log(error);
        return [];
    }

    const current_user_id = (await readUserSession()).data.session?.user.id;

    if (data.length > 0) {
        return data;
    } else {
        //check question answer data for pt for allergy / medications : allergyQID-168 , medicationQID-8

        const { allergy_string, medication_string } =
            await getQuestionAnswersForAllergyMedication(patient_id);

        const { data, error } = await supabase
            .from('clinical_notes_v2')
            .insert([
                {
                    patient_id: patient_id,
                    created_by:
                        current_user_id ??
                        '24138d35-e26f-4113-bcd9-7f275c4f9a47', //TODO remove maylin as the default here
                    type: 'patient_data',
                    note: allergy_string,
                    data_type: 'allergy',
                },
                {
                    patient_id: patient_id,
                    created_by:
                        current_user_id ??
                        '24138d35-e26f-4113-bcd9-7f275c4f9a47', //TODO remove maylin as the default here
                    type: 'patient_data',
                    note: medication_string,
                    data_type: 'medication',
                },
            ]).select(`
                *,
                creating_provider:profiles!created_by (first_name, last_name),
                editing_provider:profiles!last_modified_by (first_name, last_name)
            `);

        if (error) {
            console.log('clinical note allergy medication push', error);
        }

        return data;
    }
}

async function getQuestionAnswersForAllergyMedication(patient_id: string) {
    const supabase = createSupabaseServiceClient();

    const { data: medication_answers, error: medication_answers_error } =
        await supabase
            .from('questionnaire_answers')
            .select('question_id, answer')
            .eq('user_id', patient_id)
            .in('question_id', [8, 803, 804, 805, 1156, 895]); //look at all questions that are related to medications
    if (medication_answers_error) {
        console.error('Error fetching answers:', medication_answers_error);
    } else {
        console.log('Medication answers:', medication_answers);
        console.log('user_id: ', patient_id);
    }

    let medication_converted_text; //this is what will render in the provider intake dashboard

    if (
        medication_answers &&
        medication_answers.length !== 0 &&
        Array.isArray(medication_answers)
    ) {
        // filter out any 'No' answers
        const filtered_medication_answers = medication_answers.filter(
            (item) =>
                item.answer?.answer !== 'No' &&
                item.answer?.answer !== 'No, none of these' &&
                item.answer?.answer !==
                    `No, I’ve already provided all relevant information!` &&
                item.answer?.answer !==
                    `, No, I’ve already provided all relevant information!` //fix the question code to remove this condition
        );

        if (filtered_medication_answers.length === 0) {
            //if medication_answers existed but all were filtered out in the last step, then they said no to everything
            medication_converted_text = 'None';
        } else {
            // process the remaining answers
            const processedAnswers = filtered_medication_answers.map((item) => {
                if (
                    item.answer?.formData &&
                    Array.isArray(item.answer.formData) &&
                    item.answer.formData.length >= 1
                ) {
                    //first filter out any values of formData that are either just 'yes', null, or
                    const formDataArray = item.answer.formData.filter(
                        (item: string) => item !== 'Yes' && item !== null
                    );
                    if (formDataArray.length === 0) {
                        return null;
                    }
                    const formDataString = formDataArray.join(', ');
                    const formatedFormDataString = formDataString?.replace(
                        /\n/g,
                        ', '
                    ); //turn the array into a string

                    return (
                        formatedFormDataString ||
                        'Issue with Patient Answer - Please Ask Patient'
                    );
                }
                return 'Issue with Patient Answer - Please Ask Patient';
            });
            // Combine all processed answers into a single text
            medication_converted_text = processedAnswers
                .filter((answer) => answer !== null)
                .join(', ');
        }
    } else {
        medication_converted_text = 'No answers found - Please Ask Patient';
    }

    const { data: allergy_answer } = await supabase
        .from('questionnaire_answers')
        .select('answer')
        .eq('user_id', patient_id)
        .eq('question_id', 168)
        .maybeSingle();

    let allergy_converted_text = 'NKDA';

    if (
        allergy_answer &&
        allergy_answer.answer.formData &&
        allergy_answer.answer.answer !== 'None'
    ) {
        allergy_converted_text = allergy_answer?.answer.formData.join(', ');
    }

    return {
        allergy_string: allergy_converted_text,
        medication_string: medication_converted_text,
    };
}

export async function addOrRetrievePatientBMIData(
    patient_id: string,
    product_href: string
) {
    if (
        !WEIGHT_LOSS_PRODUCT_HREF.includes(product_href) &&
        product_href != PRODUCT_HREF.NAD_INJECTION
    ) {
        return null;
    }
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('clinical_notes_v2')
        .select(
            `
            id,
            created_at,
            patient_id,
            created_by,
            admin_edit_access,
            type,
            note,
            product_href,
            last_modified_at,
            last_modified_by,
            data_type,
            metadata,
            creating_provider:profiles!created_by (first_name, last_name),
            editing_provider:profiles!last_modified_by (first_name, last_name)
        `
        )
        .eq('patient_id', patient_id)
        .eq('type', 'patient_data')
        .eq('data_type', 'bmi')
        .order('created_at', { ascending: false });

    if (error) {
        console.error(
            'Patient BMI Clinical Note Data Retreival Error: ',
            error,
            'patient_id: ',
            patient_id
        );
        return null;
    }

    const current_user_id = (await readUserSession()).data.session?.user.id;

    if (data.length > 0) {
        if (data && data.length > 0) {
            // Parse the created_at timestamps and group entries by day
            // Assuming `data` is an array of objects that match the ClinicalNoteEntry interface
            const groupedByDay: Record<string, any[]> = data.reduce(
                (acc, entry) => {
                    const date = parseISO(entry.created_at);
                    const dayKey = `${date.getFullYear()}-${
                        date.getMonth() + 1
                    }-${date.getDate()}`;

                    if (!acc[dayKey]) {
                        acc[dayKey] = [];
                    }
                    acc[dayKey].push(entry);

                    return acc;
                },
                {} as Record<string, any[]>
            ); // Type assertion here

            // For each day, find the latest entry
            const latestEntries = Object.values(groupedByDay).map(
                (entries: any) => {
                    return entries.sort(
                        (a: any, b: any) =>
                            new Date(b.created_at).getTime() -
                            new Date(a.created_at).getTime()
                    )[0];
                }
            );

            return latestEntries;
        } else {
            // Handle the case where there is no data
            return [];
        }
    } else {
        //check question answer data for pt for allergy / medications : allergyQID-168 , medicationQID-8

        const bmi_answer = await getQuestionAnswersForBMI(patient_id);

        const { data, error } = await supabase
            .from('clinical_notes_v2')
            .insert([
                {
                    patient_id: patient_id,
                    created_by:
                        current_user_id ??
                        '24138d35-e26f-4113-bcd9-7f275c4f9a47', //TODO remove maylin as the default here
                    type: 'patient_data',
                    note: `Height: ${bmi_answer?.height_feet} ft ${
                        bmi_answer?.height_inches
                    }, Weight: ${
                        bmi_answer.weight_lbs
                    }, BMI: ${bmi_answer.bmi.toFixed(2)}`,
                    data_type: 'bmi',
                    metadata: {
                        height_feet: bmi_answer.height_feet,
                        height_inches: bmi_answer.height_inches,
                        weight_lbs: bmi_answer.weight_lbs,
                        bmi: bmi_answer.bmi,
                    },
                },
            ]).select(`
                *,
                creating_provider:profiles!created_by (first_name, last_name),
                editing_provider:profiles!last_modified_by (first_name, last_name)
            `);

        if (error) {
            console.log(
                'clinical note BMI issue: ',
                error,
                'patient ID: ',
                patient_id
            );
            return null;
        }

        if (data && data.length > 0) {
            // Parse the created_at timestamps and group entries by day
            // Assuming `data` is an array of objects that match the ClinicalNoteEntry interface
            const groupedByDay: Record<string, any[]> = data.reduce(
                (acc, entry) => {
                    const date = parseISO(entry.created_at);
                    const dayKey = `${date.getFullYear()}-${
                        date.getMonth() + 1
                    }-${date.getDate()}`;

                    if (!acc[dayKey]) {
                        acc[dayKey] = [];
                    }
                    acc[dayKey].push(entry);

                    return acc;
                },
                {} as Record<string, any[]>
            ); // Type assertion here

            // For each day, find the latest entry
            const latestEntries = Object.values(groupedByDay).map(
                (entries: any) => {
                    return entries.sort(
                        (a: any, b: any) =>
                            new Date(b.created_at).getTime() -
                            new Date(a.created_at).getTime()
                    )[0];
                }
            );

            return latestEntries;
        } else {
            // Handle the case where there is no data
            return [];
        }
    }
}

export async function getHeightForPatient(patient_id: string) {
    const supabase = createSupabaseServiceClient();

    const { data: height_data } = await supabase
        .from('clinical_notes_v2')
        .select('answer')
        .eq('user_id', patient_id)
        .eq('question_id', 166)
        .order('created_at', { ascending: false });
}

export async function getQuestionAnswersForBMI(patient_id: string): Promise<{
    height_feet: number;
    height_inches: number;
    weight_lbs: number;
    bmi: number;
}> {
    const supabase = createSupabaseServiceClient();

    const { data: bmi_question_answer_arr } = await supabase
        .from('questionnaire_answers')
        .select('answer')
        .eq('user_id', patient_id)
        .eq('question_id', 166)
        .order('created_at', { ascending: false });

    if (!bmi_question_answer_arr) {
        return {
            height_feet: 0,
            height_inches: 0,
            weight_lbs: 0,
            bmi: 999,
        };
    }

    const bmi_question_answer = bmi_question_answer_arr[0];

    let bmi_question_answer_converted = {
        height_feet: 0,
        height_inches: 0,
        weight_lbs: 0,
        bmi: 999,
    };

    if (bmi_question_answer) {
        bmi_question_answer_converted = {
            height_feet: bmi_question_answer.answer.formData[0],
            height_inches: bmi_question_answer.answer.formData[1],
            weight_lbs: bmi_question_answer.answer.formData[2],
            bmi: calculateBMI(
                bmi_question_answer.answer.formData[2],
                bmi_question_answer.answer.formData[0],
                bmi_question_answer.answer.formData[1]
            ),
        };
    }

    return bmi_question_answer_converted;
}

export async function getQuestionAnswersForGoalBMI(
    patient_id: string
): Promise<{
    height_feet: number;
    height_inches: number;
    weight_lbs: number;
    bmi: number;
}> {
    const supabase = createSupabaseServiceClient();

    const { data: goal_weight } = await supabase
        .from('questionnaire_answers')
        .select('answer')
        .eq('user_id', patient_id)
        .eq('question_id', 2303)
        .order('created_at', { ascending: false });

    if (!goal_weight) {
        return {
            height_feet: 0,
            height_inches: 0,
            weight_lbs: 0,
            bmi: 999,
        };
    }

    const { data } = await supabase
        .from('questionnaire_answers')
        .select('answer')
        .eq('user_id', patient_id)
        .eq('question_id', 166)
        .order('created_at', { ascending: false });

    if (!data) {
        return {
            height_feet: 0,
            height_inches: 0,
            weight_lbs: 0,
            bmi: 999,
        };
    }

    const bmi_question_answer = goal_weight[0].answer.formData[0];

    const height = data[0].answer.formData[0];
    const inches = data[0].answer.formData[1];

    let bmi_question_answer_converted = {
        height_feet: 0,
        height_inches: 0,
        weight_lbs: 0,
        bmi: 999,
    };

    if (bmi_question_answer) {
        bmi_question_answer_converted = {
            height_feet: height,
            height_inches: inches,
            weight_lbs: bmi_question_answer,
            bmi: calculateBMI(bmi_question_answer, height, inches),
        };
    }

    return bmi_question_answer_converted;
}

function calculateBMI(
    weight: number,
    heightFeet: number,
    heightInches: number
): number {
    if (weight === 0 || heightFeet === 0 || heightInches === 0) {
        return 0;
    }

    const weightKg = weight * 0.453592;

    const footHeightInInches = heightFeet * 12;

    const totalHeightInches: number =
        Number(footHeightInInches) + Number(heightInches);

    // console.log('totalHeightInches ', totalHeightInches);

    const heightMeters = totalHeightInches * 0.0254;

    // console.log('heightMeters ', heightMeters);

    const bmi = weightKg / heightMeters ** 2;

    // console.log('bmi ', bmi);

    return bmi;
}

export async function getClinicalNoteTemplateDataForOrderId(
    order_id: string | number
) {
    const supabase = createSupabaseServiceClient();

    const { data: templatized_note, error } = await supabase
        .from('clinical_notes_v2')
        .select('*')
        .eq('data_type', 'template')
        .eq('order_id', order_id)
        .is('renewal_order_id', null)
        .limit(1)
        .maybeSingle();

    return templatized_note;
}

/**
 * Clinical Notes V3 Implementation of Templatized Clinical Notes
 */

/**
 *
 * @param orderId Pass orderId at all times
 * @param renewal_order_id pass in renewal_order_id if searching for a renewal order's
 * @returns
 */
export async function findClinicalNoteTemplateRecordByOrderId(
    orderId: string | number,
    renewal_order_id?: string
): Promise<Partial<ClinicalNoteRecordWithPatientProviderData> | null> {
    const supabase = createSupabaseServiceClient();

    let result;

    if (renewal_order_id) {
        const { data, error } = await supabase
            .from('clinical_notes_v2')
            .select(
                `*, 
            creating_provider:profiles!created_by (first_name, last_name), 
            editing_provider:profiles!last_modified_by (first_name, last_name)`
            )
            .eq('renewal_order_id', renewal_order_id)
            .limit(1)
            .maybeSingle();

        if (error) {
            console.log(
                'findClinicalNoteTemplateRecordByOrderId error - renewal order ID: ',
                renewal_order_id,
                'error message: ',
                error.message
            );
        }

        result = data;
    } else {
        const { data, error } = await supabase
            .from('clinical_notes_v2')
            .select(
                `*, 
            creating_provider:profiles!created_by (first_name, last_name), 
            editing_provider:profiles!last_modified_by (first_name, last_name)`
            )
            .eq('order_id', orderId)
            .is('renewal_order_id', null)
            .limit(1)
            .maybeSingle();

        if (error) {
            console.log(
                'findClinicalNoteTemplateRecordByOrderId error - order ID: ',
                orderId,
                'error message: ',
                error.message
            );
        }

        result = data;
    }

    if (!result) {
        return null;
    }

    return result as ClinicalNoteRecordWithPatientProviderData;
}

export async function findAllClinicalNoteTemplatesForOrderId(
    orderId: string | number,
    product_href: PRODUCT_HREF
) {
    if (!TEMPLATIZED_PRODUCT_LIST.includes(product_href)) {
        return null;
    }

    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('clinical_notes_v2')
        .select(
            `*, 
            creating_provider:profiles!created_by (first_name, last_name),
            editing_provider:profiles!last_modified_by (first_name, last_name)`
        )
        .eq('order_id', orderId)
        .eq('data_type', 'template')
        .order('created_at', { ascending: false });

    if (error) {
        console.log(
            'findAllClinicalNoteTemplatesForOrderId error - order ID: ',
            orderId,
            'error message: ',
            error.message
        );
    }

    return data as ClinicalNoteRecordWithPatientProviderData[];
}

export async function findAllOtherClinicalNoteTemplatesForPatient(
    product_href: PRODUCT_HREF,
    patient_id: string
) {
    if (!TEMPLATIZED_PRODUCT_LIST.includes(product_href)) {
        return null;
    }

    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('clinical_notes_v2')
        .select(
            `*, 
            creating_provider:profiles!created_by (first_name, last_name),
            editing_provider:profiles!last_modified_by (first_name, last_name)`
        )
        .eq('patient_id', patient_id)
        .eq('data_type', 'template')
        .order('created_at', { ascending: false });

    if (error) {
        console.log(
            'findAllOtherClinicalNoteTemplatesForPatient ',
            'error message: ',
            error.message
        );
    }

    return data as ClinicalNoteRecordWithPatientProviderData[];
}

/**
 * Creates a templatized clinical note with blank/default values.
 */
export async function createTemplatizedClinicalNote(
    order_id: string | number,
    product_href: string,
    patient_id: string,
    values: any[],
    created_by_id: string,
    renewal_order_id?: string
) {
    const supabase = createSupabaseServiceClient();

    const orderType = !renewal_order_id ? 'intake' : 'renewal';
    const latestVersion =
        PRODUCT_TEMPLATE_LATEST_VERSION_MAP[product_href][orderType];

    const { data, error } = await supabase
        .from('clinical_notes_v2')
        .insert({
            patient_id: patient_id,
            created_by: created_by_id,
            type: 'patient_data',
            product_href: product_href,
            data_type: 'template',
            metadata: values,
            order_id: order_id,
            template_version: latestVersion,
            ...(renewal_order_id ? { renewal_order_id: renewal_order_id } : {}),
        })
        .select(
            `*, 
            creating_provider:
                profiles!created_by 
                    (first_name, last_name), 
            editing_provider:
                profiles!last_modified_by 
                    (first_name, last_name)`
        )
        .single();

    if (error) {
        console.error('createTemplatizedClinicalNote error: ', error.message);
        return null;
    }

    return data as ClinicalNoteRecordWithPatientProviderData;
}

/**
 * Provider manual creation of BMI note:
 */
export async function createManualBMINote(
    patient_id: string,
    authoring_provider_id: string,
    height_feet: number,
    height_inches: number,
    bmi: number,
    weight: number
) {
    const supabase = createSupabaseServiceClient();

    const bmiRecordObject = {
        patient_id: patient_id,
        created_by: authoring_provider_id,
        admin_edit_access: false,
        type: 'patient_data',
        data_type: 'bmi',
        note: `Height: ${height_feet} ft ${height_inches}, Weight: ${weight.toFixed(
            2
        )}, BMI: ${bmi}`,
        metadata: {
            bmi: bmi,
            weight_lbs: weight,
            height_feet: height_feet,
            height_inches: height_inches,
        },
    };

    const { error } = await supabase
        .from('clinical_notes_v2')
        .insert(bmiRecordObject);

    if (error) {
        console.error('bmi creation issue', error);
        return Status.Error;
    }

    return Status.Success;
}

/**
 * Function to create new clinical note
 */
export async function createNewCheckUpClinicalBmiNote(
    patient_id: string,
    question_answer: Answer
) {
    const supabase = createSupabaseServiceClient();

    const reported_weight = parseFloat(
        question_answer.answer ?? question_answer.formData[0]
    );

    const { data: latestBmiRecord, error } = await supabase
        .from('clinical_notes_v2')
        .select('id, created_at, note, metadata')
        .eq('patient_id', patient_id)
        .eq('data_type', 'bmi')
        .order('created_at', { ascending: true })
        .limit(1)
        .maybeSingle();

    if (!latestBmiRecord || error) {
        console.error('No BMI record found for patient: ', patient_id);
        return;
    }

    await updateCurrentProfileHeight(
        latestBmiRecord.metadata.height_inches +
            latestBmiRecord.metadata.height_feet * 12,
        patient_id
    );

    const bmi = calculateBMI(
        reported_weight,
        latestBmiRecord.metadata.height_feet,
        latestBmiRecord.metadata.height_inches
    );

    //Checking if the latest Bmi record was made within 24 hours.
    //If so we will update the bmi record and if not we will create a new record.
    if (
        latestBmiRecord &&
        new Date(latestBmiRecord.created_at).getTime() >
            new Date().getTime() - 24 * 60 * 60 * 1000
    ) {
        //Update the bmi record

        const { error: updateError } = await supabase
            .from('clinical_notes_v2')
            .update({
                note: `Height: ${latestBmiRecord.metadata.height_feet} ft ${
                    latestBmiRecord.metadata.height_inches
                }, Weight: ${reported_weight.toFixed(2)}, BMI: ${bmi.toFixed(
                    2
                )}`,
                metadata: {
                    bmi: bmi,
                    weight_lbs: reported_weight,
                    height_feet: latestBmiRecord.metadata.height_feet,
                    height_inches: latestBmiRecord.metadata.height_inches,
                },
            })
            .eq('id', latestBmiRecord.id);

        if (updateError) {
            console.error('updateError', updateError);
        }
    } else {
        //Create a new bmi record

        const { error: createError } = await supabase
            .from('clinical_notes_v2')
            .insert({
                patient_id: patient_id,
                created_by: null,
                admin_edit_access: false,
                type: 'patient_data',
                data_type: 'bmi',
                note: `Height: ${latestBmiRecord.metadata.height_feet} ft ${
                    latestBmiRecord.metadata.height_inches
                }, Weight: ${reported_weight.toFixed(2)}, BMI: ${bmi.toFixed(
                    2
                )}`,
                metadata: {
                    bmi: bmi,
                    weight_lbs: reported_weight,
                    height_feet: latestBmiRecord.metadata.height_feet,
                    height_inches: latestBmiRecord.metadata.height_inches,
                },
            });

        if (createError) {
            console.error('createError', createError);
        }
    }
}
