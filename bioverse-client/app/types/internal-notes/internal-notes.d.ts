interface AllPatientsInternalNoteData {
    id?: string | number;
    created_at?: Date;
    status_tag?: string;
    note?: string;
    full_name?: string;
    first_name?: string;
    last_name?: string;
    order_id?: string;
    last_modified_by?: string;
    employee?: {
        display_name: string;
    };
}
