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
    dose_spot_id: string;
    subscriptions: any[];
}

interface DBOrderData {
    created_at: string;
    customer_uid: string;
    variant_index: number;
    variant_text: string;
    subscription_type: string;
    assigned_dosage: string | null;
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
    renewal_order_id?: string;
    original_order_id?: number;
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
        status: string;
        stripe_subscription_id: string;
    };
    order: {
        assigned_provider: string;
        address_line1: string;
        address_line2: string;
        state: string;
        zip: string;
        city: string;
        question_set_version: number;
        variant_text: string;
    };
    source?: string;
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
    metadata?: any;
    creating_provider?: any; //when joining profile table of provider
    editing_provider?: any;
    product?: any; //when joining product table using product_href
    patient?: any; //when joining profile table of patient
    data_type: string;
    order_id?: string | number;
    renewal_order_id?: string;
    note_history?: any[];
    template_version?: number;
}
