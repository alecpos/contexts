interface AnnualOrderTracking {
    id: number;
    created_at: string; // ISO 8601 timestamp
    patient_id: string; // UUID format
    product_href: string;
    variant_index: number;
    scheduled_next_renewal_date?: string; // ISO 8601 timestamp
    scheduled_second_supply_date?: string; // ISO 8601 timestamp
    check_ins_completed?: number;
    base_order_id: number;
    renewal_order_id?: string;
    subscription_id: string;
    metadata?: {
        [key: string]: any; // Flexible JSON object
    };
    prescription_json_1?: {
        medication_name?: string;
        dosage_instructions?: string;
        refills_remaining?: number;
        [key: string]: any; // Additional prescription fields
    };
    prescription_json_2?: {
        [key: string]: any; // Flexible JSON object
    };
    second_script_sent_time?: string; // ISO 8601 timestamp
    status?: string; // Assuming these are the possible values
}
