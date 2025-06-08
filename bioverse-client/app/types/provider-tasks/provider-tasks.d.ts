interface ProviderTaskSupabaseRecord {
    id: number;
    created_at: string;
    original_created_at: string;
    order_id: number;
    renewal_order_id?: string;
    completion_status: boolean;
    assigned_provider: string;
    type: string;
    environment: string;
    reported_failure: boolean;
}

interface StatusTagObject {
    created_at: string;
    id: number;
    metadata: any;
    note: string;
    order_id: string;
    patient_id: string;
    status_tag: string;
    renewal_order_id?: string;
}

interface TaskOrderObject {
    customer_uid: string;
    first_name?: string;
    last_name?: string;
    state: string;
    name: string;
    order_id: number;
    created_at: string;
    variant_text?: string;
    order_status: string;
    license_photo_url: string | null;
    selfie_phoot_url: string | null;
    status_tag: string;
    vial_dosages?: string;
    variant?: string;
    subscription_type: string;
}

interface TaskRenewalObject {
    id: string;
    first_name?: string;
    last_name?: string;
    state: string;
    product_name: string;
    renewal_order_id: string;
    original_order_id: number;
    submission_time?: string;
    variant_text?: string;
    order_status: string;
    license_photo_url: string | null;
    selfie_photo_url: string | null;
    status_tag: string;
    vial_dosages?: string;
    variant?: string;
    subscription_type: string;
}
