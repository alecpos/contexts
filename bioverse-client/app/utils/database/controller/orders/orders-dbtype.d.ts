interface OrdersSBR {
    //This is the orders table interface. Please update if adding a column.
    id?: string;
    created_at?: string;
    customer_uid?: string;
    variant_index?: number;
    variant_text?: string;
    subscription_type?: string;
    price?: number;
    stripe_metadata?: any;
    order_status?: string;
    product_href?: string;
    rx_questionnaire_answers?: any;
    status_prior_to_cancellation?: string;
    assigned_provider?: string;
    price_id?: string;
    discount_id?: string[];
    last_updated?: string;
    external_tracking_metadata?: any;
    assigned_pharmacy?: string;
    shipping_status?: string;
    tracking_number?: string;
    environment?: string;
    easypost_tracking_id?: string;
    address_line1?: string;
    address_line2?: string;
    city?: string;
    state?: string;
    zip?: string;
    subscription_id?: string;
    approval_denial_timestamp?: string;
    pharmacy_script?: any;
    submission_time?: string;
    question_set_version?: number;
    source?: string;
}

interface CustomPrescriptionOrder {
    order_id: string; // Either renewal order id, or base order id
    product_href: string;
    created_at: string;
    assigned_provider: string;
}
