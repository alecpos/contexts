interface APProfileData {
    id: any;
    first_name: any;
    last_name: any;
    date_of_birth: any;
    sex_at_birth: any;
    address_line1: any;
    address_line2: any;
    city: any;
    state: any;
    zip: any;
    phone_number: any;
    stripe_customer_id: any;
    intake_completed: any;
    text_opt_in: any;
    email: any;
    selfie_photo_url: any;
    license_photo_url: any;
}

interface OrderTabOrder {
    id: any;
    external_tracking_metadata: any;
    order_status: any;
    approval_denial_timestamp: any;
    assigned_pharmacy: any;
    shipping_status: any;
    tracking_number: any;
    product_href: any;
    discount_id: any;
    variant_index: number;
    variant_text?: any;
    assigned_provider: any;
    created_at: any;
    product: any;
    subscription_type: any;
    provider: any;
    subscription: any;
    submission_time: any;
    customer_uid: string;
    address_line1: string;
    address_line2: string;
    state: string;
    city: string;
    zip: string;
    question_set_version: number;
    pharmacy_script: any;
    payment_failure: {
        status: string;
        created_at: string;
    }[];
}

interface InfoTabInformation {
    first_name: string;
    last_name: string;
    date_of_birth: string;
    phone_number: string;
    email: string;
}

interface InvoiceTableItem {
    id: string;
    description: string;
    status: string;
    amountDue: number;
    amountRefunded: number;
    created: string;
    productName: string;
    chargeType: string;
    refund: any;
    payment_intent_data?: any;
}

interface SubscriptionTableItem {
    id: string;
    product_href: string;
    order_id: any;
    created_at: string;
    assigned_pharmacy: string;
    status: string;
    subscription_type: string;
    provider_id: string;
    stripe_subscription_id: string;
    product: any;
    order: any;
    patient_id: string;
    status_flags: string[] | null;
}

interface IntakeTableItem {
    id: string;
    created_at: string;
    submission_time: string;
    order_status: string;
    product_href: string;
    customer_uid: string;
    question_set_version: number;
}

interface ClinicalNoteOrderObject {
    id: string;
    product: any;
    customer_uid: any;
}

interface InternalNoteRecord {
    id: string;
    product: any;
    patient_id: string;
    last_modified: string;
    note: any;
    allergies: any;
    medications: any;
    provider: any;
    product_href: string;
}

interface ClincialNoteRecord {
    id: string;
    product: any;
    patient_id: string;
    last_modified: string;
    note: any;
    allergies: any;
    medications: any;
    provider: any;
    product_href: string;
}
