interface ClinicalNotesState {
    note: string | undefined;
    // history_of_present_illness: string | undefined;
    // past_medical_history: string | undefined;
    allergies: string | undefined;
    medications: string | undefined;
    // vitals: string | undefined;
    // assessment: string | undefined;
    // patient_plan: string | undefined;
    last_modified?: string | undefined;
    last_modified_by_provider_id?: string | undefined;
    provider?: ProviderName | undefined;
}

interface ProviderName {
    first_name: string;
    last_name: string;
}

interface ClinicalNotesEditingState {
    note_editing_status: boolean;
    // history_of_present_illness_editing_status: boolean;
    // past_medical_history_editing_status: boolean;
    allergies_editing_status: boolean;
    medications_editing_status: boolean;
    // vitals_editing_status: boolean;
    // assessment_editing_status: boolean;
    // patient_plan_editing_status: boolean;
}

interface ClinicalNoteUpdateObject {
    history_of_present_illness?: string | undefined;
    past_medical_history?: string | undefined;
    allergies?: string | undefined;
    medications?: string | undefined;
    vitals?: string | undefined;
    assessment?: string | undefined;
    patient_plan?: string | undefined;

    last_modified_at: any;
    last_modified_by_provider_id: string | undefined;
}

interface PatientData {
    data: {
        first_name: string;
        last_name: string;
        date_of_birth: string;
        sex_at_birth: string;
        address_line1: string;
        address_line2: string;
        city: string;
        state: string;
        zip: number;
        license_photo_url: string;
        selfie_photo_url: string;
        dose_spot_id;
        subscriptions: {
            product_href: string;
            variant_text: string;
        }[];
    } | null;
    error: PostgrestError | null;
}

// Define the type for your data
type PatientOverviewOrderData = {
    orderId: string;
    timeSinceRequested: string;
    prescription: string;
};
