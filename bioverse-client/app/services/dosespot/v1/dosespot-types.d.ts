// Define TypeScript interfaces for function parameters
interface DoseSpotPatientDetails {
    firstName: string;
    lastName: string;
    email: string;
    DOB: string;
    gender: string;
    address: string;
    addressLine2?: string;
    city: string;
    state: string;
    zip: string;
    phone: string;
    phoneType: string;
    active: string;
}

// Define the interface for the response you expect to receive
interface TokenResponse {
    access_token: string;
    // Add other fields from the response as needed
}

// Handle PrescriptionResult event type
interface DoseSpotStatusPrescriptionData {
    patient_id: string;
    clinic_id: string;
    clinician_id: string;
    agent_id: string | null;
    prescription_id: string;
    related_rx_request_queue_item_id: string | null;
    prescription_status: string;
    status_date_time: string;
    status_details: string;
    // Add any additional fields as needed
}

interface DoseSpotPrescriptionItemObject {
    PrescriptionId: number;
    WrittenDate: string;
    Directions: string;
    Quantity: string;
    DispenseUnitId: number;
    DispenseUnitDescription: string;
    Refills: string;
    DaysSupply: number;
    PharmacyId: number;
    PharmacyNotes: string;
    NoSubstitutions: boolean;
    EffectiveDate: string;
    LastFillDate: string | null;
    PrescriberId: number;
    PrescriberAgentId: number | null;
    RxReferenceNumber: string | null;
    Status: number;
    Formulary: boolean;
    EligibilityId: number;
    Type: number;
    NonDoseSpotPrescriptionId: number | null;
    ErrorIgnored: boolean;
    SupplyId: number | null;
    CompoundId: number | null;
    FreeTextType: string | null;
    ClinicId: number;
    SupervisorId: number | null;
    IsUrgent: boolean;
    IsRxRenewal: boolean;
    RxRenewalNote: string | null;
    FirstPrescriptionDiagnosis: string | null;
    SecondPrescriptionDiagnosis: string | null;
    PatientMedicationId: number;
    MedicationStatus: number;
    Comment: string | null;
    DateInactive: string | null;
    Encounter: string | null;
    DoseForm: string;
    Route: string;
    Strength: string;
    GenericProductName: string;
    GenericDrugName: string;
    LexiGenProductId: number;
    LexiDrugSynId: number;
    LexiSynonymTypeId: number;
    LexiGenDrugId: string;
    RxCUI: string;
    OTC: boolean;
    NDC: string;
    Schedule: string;
    DisplayName: string;
    MonographPath: string;
    DrugClassification: string;
    StateSchedules: string | null;
    Brand: boolean;
    CompoundIngredients: string | null;
}
