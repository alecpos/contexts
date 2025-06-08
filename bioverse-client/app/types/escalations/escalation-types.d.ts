interface EscalationDataObject {
    order_id: string;
    patient_id: string;
    type: string;
    note: string;
    metadata: any;
    escalated_by: string;
    assigned_pharmacy: string;
}

interface PatientEscalationData {
    id: number;
    created_at: string;
    order_id: string;
    patient_id: string;
    status: string;
    type: string;
    note: string;
    last_updated_at: string;
    metadata: any;
    escalated_by: string;
    environment: string;
    assigned_pharmacy: string;
    patient: {
        first_name: string;
        last_name: string;
    };
    escalator: {
        display_name: string;
    };
}
