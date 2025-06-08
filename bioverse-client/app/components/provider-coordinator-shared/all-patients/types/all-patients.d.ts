interface APProfile {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    state: string;
    sex_at_birth: string;
    date_of_birth: string;
    phone_number: string;
    intake_completion_time: string | null;
    created_at: string;
}

interface APFilterItem {
    column_name: string;
    value: string;
}
