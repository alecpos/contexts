interface PatientStatusTagsSBR {
    id?: number;
    created_at?: Date;
    status_tag?: string;
    user_id?: string;
    note?: string;
    first_name?: string;
    last_name?: string;
    order_id?: string;
    last_modified_by?: string;
    status_tags?: string[];
}

interface PatientStatusTagsWithNotesSBR {
    id?: number;
    created_at?: Date;
    status_tag?: string;
    user_id?: string;
    note?: string;
    first_name?: string;
    last_name?: string;
    order_id?: string;
    last_modified_by?: string;
    status_tags?: string[];
    author?: {
        first_name?: string;
        last_name?: string;
    };
}
