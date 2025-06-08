interface PatientWeightAuditSBR {
    id?: number;
    created_at?: Date;
    patient_id?: string;
    weight?: number;
    source?: string;
}

interface PatientWeightAuditCreate {
    id?: number;
    created_at?: Date;
    patient_id: string;
    weight: number;
    source: string;
}
