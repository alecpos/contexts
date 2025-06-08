interface QuestionAnswerObject {
    answer: AnswerObject;
    question: any;
    question_id: number;
}

interface AnswerObject {
    answer: string;
    formData: string[];
    question: string;
}

interface DBEscalationData {
    requires_provider: boolean;
    requires_lead: boolean;
    requires_coordinator: boolean;
}

interface DBPatientData {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    address_line1: string;
    address_line2: string;
    city: string;
    state: string;
    zip: string;
    date_of_birth: string;
    created_at: string;
    sex_at_birth: string;
    phone_number: string;
    personal_data_recently_changed: boolean;
    license_photo_url: string;
    selfie_photo_url: string;
    dose_spot_id?: string;
    subscriptions: any[];
}

interface DBOrderData {
    created_at: string;
    customer_uid: string;
    variant_index: number;
    variant_text: string;
    subscription_type: string;
    price: number;
    stripe_metadata: {
        clientSecret: string;
        setupIntentId: string;
        paymentMethodId: string;
    };
    order_status: string;
    product_href: string;
    rx_questionnaire_answers: any;
    id: any;
    status_prior_to_cancellation: string;
    assigned_provider: string;
    price_id: string;
    discount_id: string[];
    last_updated: string;
    external_tracking_metadata: any;
    assigned_pharmacy: string;
    shipping_status: string;
    tracking_number: string;
    environment: string;
    easypost_tracking_id: string;
    address_line1: string;
    address_line2: string;
    city: string;
    state: string;
    zip: string;
    subscription_id: string;
    approval_denial_timestamp: string;
    pharmacy_script: any;
    submission_time: string;
    question_set_version: number;
    renewal_order_id?: string | undefined;
    customer_uuid?: string;
    metadata: any;
    patient: {
        first_name: string;
        last_name: string;
        health_history_response?: any;
    };
    product: {
        name: string;
    };
    provider: {
        name: string;
    };
    subscription: {
        stripe_subscription_id: string;
        status: string;
    };
    order?: any;
}

interface ClinicalNotesV2Supabase {
    id?: number;
    created_at?: string;
    patient_id?: string;
    created_by?: string;
    admin_edit_access?: boolean;
    last_modified_at?: string;
    last_modified_by?: string;
    type?: string;
    note?: string;
    product_href?: string;
    creating_provider?: any; //when joining profile table of provider
    editing_provider?: any;
    product?: any; //when joining product table using product_href
    patient?: any; //when joining profile table of patient
}
