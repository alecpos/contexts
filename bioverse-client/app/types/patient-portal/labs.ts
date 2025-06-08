// TODO: Define a set list of possible lab work types
export type LabWorkType = string;

export interface LabWorkFile {
    id?: number;
    created_at?: Date;
    file?: File;
    filename: string;
    lab_work_document_id: number;
}

export interface LabWorkDocument {
    id?: number;
    created_at?: Date;
    lab_work_files?: LabWorkFile[];
    lab_work_type: LabWorkType;
    document_name: string;
    patient_id: string;
}
