interface ClinicalNoteRecord {
    id: number;
    created_at: string;
    patient_id: string;
    created_by: string;
    admin_edit_access: boolean;
    type: string;
    note: string;
    product_href: string;
    last_modified_at: string;
    last_modified_by: string;
    data_type: string;
    metadata: any;
    order_id: number;
    renewal_order_id: string;
}

interface ClinicalNoteRecordWithPatientProviderData {
    id: number;
    created_at: string;
    patient_id: string;
    created_by: string;
    admin_edit_access: boolean;
    type: string;
    note: string;
    product_href: string;
    last_modified_at: string;
    last_modified_by: string;
    data_type: string;
    metadata: any;
    order_id: number;
    renewal_order_id: string;
    creating_provider: {
        first_name: string;
        last_name: string;
    };
    editing_provider: {
        first_name: string;
        last_name: string;
    };
}
