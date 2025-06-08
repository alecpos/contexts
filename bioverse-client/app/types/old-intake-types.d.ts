/**
 * @author rgorai
 * @description navigation details for features of the provider portal
 * @param label the user-friendly label of the feature
 * @param path the app path to the feature
 */
interface ProviderNavItem {
    label: string;
    path: string;
}

interface PatientOrderProviderDetails {
    id: string;
    patientId: string;
    patientName: string;
    requestSubmissionTime?: string;
    deliveryState: string;
    prescription: string;
    approvalStatus: string;
    statusTag?: string;
    productName: string;
    vial_dosages?: string;
    subscriptionType: string;
    variant: string;
    status_tag_id: number;
}

interface PatientOrderCoordinatorDetails {
    id: string;
    patientId: string;
    patientName: string;
    requestSubmissionTime: string;
    deliveryState: string;
    prescription: string;
    approvalStatus: string;
    licensePhotoUrl: string;
    selfiePhotoUrl: string;
    statusTag?: string;
    statusTags?: string[];
}

interface PatientOrderEngineerDetails {
    tag_id: number;
    order_id?: string;
    status_tag_text?: string;
    note?: string;
    created_at?: string;
    metadata?: any;
    patient_id?: string;
    last_modified_by?: string;
    last_modified_by_first_name?: string;
    last_modified_by_last_name?: string;
}

interface PatientOrderAdminDetails {
    id: string;
    pharmacy_id: string | null;
    providerName: string;
    patientId: string;
    state: string;
    patient_first_name: string;
    patient_last_name: string;
    date_of_birth: string;
    product_name: string;
    pharmacy: string;
    shipping_status: string;
    // deliveryState: string;
    // prescription: string;
    amount_paid: number;
    order_status: string;
    // vial_dosages: string | null;
    processing_time?: number | null;
    // subscriptionType: string;
    variant: string;
    tracking_number: string;
    updated: string;
    prescribed_time: string;
    created_at: string;
    is_escalated: boolean;
}

/**
 * @author rgorai
 * @description the data needed to create a prescription request for a provider
 */
type PatientRequestCreationDetails = Pick<
    PatientOrderProviderDetails,
    | 'providerId'
    | 'patientId'
    | 'patientName'
    | 'requestSubmissionTime'
    | 'deliveryState'
    | 'prescription'
>;

interface IntakeData {
    question: string;
    answer: string;
}
/**
 * @author rgorai
 * @description a patient's complete clinical intake data, shown to the provider
 * @param patientName the patient's name
 * @param prescription the prescription for this order (med name, dosage, frequency)
 * @param generalIntake general intake data
 * @param rxIntake medication-specific intake data
 */
interface IntakeDataDisplay {
    patientName: string;
    prescription: string;
    generalIntake: IntakeData[];
    rxIntake: IntakeData[];
}
