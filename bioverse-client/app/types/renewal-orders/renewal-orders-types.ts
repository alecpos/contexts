export enum RenewalOrderStatus {
    Incomplete = 'Incomplete',
    Unknown = 'Unknown',
    Canceled = 'Canceled',
    CheckupIncomplete_ProviderUnapproved_Unpaid = 'CheckupIncomplete-ProviderUnapproved-Unpaid',
    CheckupIncomplete_ProviderUnapproved_Paid = 'CheckupIncomplete-ProviderUnapproved-Paid',
    CheckupComplete_ProviderUnapproved_Unpaid = 'CheckupComplete-ProviderUnapproved-Unpaid',
    CheckupComplete_ProviderApproved_Unpaid = 'CheckupComplete-ProviderApproved-Unpaid',
    PharmacyProcessing = 'PharmacyProcessing',
    CheckupComplete_ProviderUnapproved_Paid = 'CheckupComplete-ProviderUnapproved-Paid',
    CheckupComplete_ProviderApproved_Paid = 'CheckupComplete-ProviderApproved-Paid',
    CheckupComplete_ProviderApproved_Unpaid_1 = 'CheckupComplete-ProviderApproved-Unpaid-1',
    CheckupComplete_ProviderApproved_Unpaid_2 = 'CheckupComplete-ProviderApproved-Unpaid-2',
    CheckupComplete_ProviderUnapproved_Unpaid_1 = 'CheckupComplete-ProviderUnapproved-Unpaid-1',
    CheckupComplete_ProviderUnapproved_Unpaid_2 = 'CheckupComplete-ProviderUnapproved-Unpaid-2',
    CheckupIncomplete_ProviderUnapproved_Unpaid_1 = 'CheckupIncomplete-ProviderUnapproved-Unpaid-1',
    CheckupWaived_ProviderUnapproved_Paid = 'CheckupWaived-ProviderUnapproved-Paid',
    CheckupWaived_ProviderUnapproved_Unpaid = 'CheckupWaived-ProviderUnapproved-Unpaid',
    CheckupIncomplete_ProviderUnapproved_Paid_1 = 'CheckupIncomplete-ProviderUnapproved-Paid-1',
    CheckupComplete_ProviderApproved_Prescribed_Unpaid = 'CheckupComplete-ProviderApproved-Prescribed-Unpaid',
    CheckupComplete_ProviderApproved_Prescribed_Unpaid_1 = 'CheckupComplete-ProviderApproved-Prescribed-Unpaid-1',
    CheckupComplete_ProviderApproved_Prescribed_Unpaid_2 = 'CheckupComplete-ProviderApproved-Prescribed-Unpaid-2',
    CheckupComplete_ProviderApproved_Unprescribed_Unpaid = 'CheckupComplete-ProviderApproved-Unprescribed-Unpaid',
    CheckupComplete_ProviderApproved_Unprescribed_Unpaid_1 = 'CheckupComplete-ProviderApproved-Unprescribed-Unpaid-1',
    CheckupComplete_ProviderApproved_Unprescribed_Paid = 'CheckupComplete-ProviderApproved-Unprescribed-Paid',
    CheckupComplete_ProviderApproved_Prescribed_Paid = 'CheckupComplete-ProviderApproved-Prescribed-Paid',
    CheckupIncomplete_ProviderUnapproved_Paid_2 = 'CheckupIncomplete-ProviderUnapproved-Paid-2',
    CheckupComplete_ProviderApproved_Unprescribed_Unpaid_2 = 'CheckupComplete-ProviderApproved-Unprescribed-Unpaid-2',
    Denied_Unpaid = 'Denied-Unpaid',
    Denied_Paid = 'Denied-Paid',
    Administrative_Canceled = 'Administrative-Canceled',
    Scheduled_Cancel = 'Scheduled-Cancel',
    Scheduled_Admin_Cancel = 'Scheduled-Admin-Cancel',
    CheckupComplete_Unprescribed_Unpaid = 'CheckupComplete-Unprescribed-Unpaid',
    CheckupComplete_Unprescribed_Paid = 'CheckupComplete-Unprescribed-Paid',
    CheckupComplete_Prescribed_Unpaid = 'CheckupComplete-Prescribed-Unpaid',
    CheckupComplete_Prescribed_Unpaid_1 = 'CheckupComplete-Prescribed-Unpaid-1',
    CheckupComplete_Prescribed_Unpaid_2 = 'CheckupComplete-Prescribed-Unpaid-2',
    CheckupComplete_Unprescribed_Unpaid_1 = 'CheckupComplete-Unprescribed-Unpaid-1',
    CheckupComplete_Unprescribed_Unpaid_2 = 'CheckupComplete-Unprescribed-Unpaid-2',
    CheckupIncomplete_Unprescribed_Paid = 'CheckupIncomplete-Unprescribed-Paid',
    CheckupIncomplete_Unprescribed_Paid_1 = 'CheckupIncomplete-Unprescribed-Paid-1',
    CheckupIncomplete_Unprescribed_Paid_2 = 'CheckupIncomplete-Unprescribed-Paid-2',
    CheckupIncomplete_Unprescribed_Unpaid = 'CheckupIncomplete-Unprescribed-Unpaid',
    CheckupIncomplete_Unprescribed_Unpaid_1 = 'CheckupIncomplete-Unprescribed-Unpaid-1',
    CheckupWaived_Unprescribed_Unpaid = 'CheckupWaived-Unprescribed-Unpaid',
    CheckupWaived_Unprescribed_Paid = 'CheckupWaived-Unprescribed-Paid',
    CheckupComplete_Prescribed_Paid = 'CheckupComplete-Prescribed-Paid',
    Voided = 'Voided',
}

export interface RenewalOrder {
    id: number;
    created_at: string;
    original_order_id: number;
    customer_uuid: string;
    prescription_json: any;
    assigned_pharmacy: string;
    external_tracking_metadata: any;
    tracking_number: string;
    shipping_status: string;
    subscription_type: SubscriptionCadency;
    product_href: string;
    easypost_tracking_id: string;
    address_line1: string;
    address_line2: string;
    city: string;
    state: string;
    zip: string;
    subscription_id: number;
    renewal_order_id: string;
    checkup_action_item_id: number;
    provider_review_after: Date;
    order_status: RenewalOrderStatus;
    submission_time: Date | string;
    environment: string;
    assigned_provider: string;
    price?: string;
    final_review_starts: Date;
    variant_index: number;
    price_id: string;
    dosage_suggestion_variant_indexes: number[];
    dosage_selection_completed: boolean;
    autoshipped: boolean;
    invoice_id: string;
    source: string;
    check_ins: CheckIns;
}

export interface CheckIns {
    [key: number]: Date;
}

export enum SubscriptionCadency {
    OneTime = 'one_time',
    Monthly = 'monthly',
    Bimonthly = 'bimonthly',
    Quarterly = 'quarterly',
    Pentamonthly = 'pentamonthly',
    Biannually = 'biannually',
    Annually = 'annually',
}

export interface RenewalOrderProviderOverview {
    id: string;
    first_name: string;
    last_name: string;
    state: string;
    name: string;
    renewal_order_id: string;
    submission_time: string;
    variant_text: string;
    order_status: string;
    license_photo_url: string;
    selfie_photo_url: string;
    status_tag?: string;
    status_tags?: string[];
    vial_dosages: string | null;
    variant: string;
    subscription_type: string;
    status_tag_id: number;
}

export interface RenewalOrderCoordinatorOverview {
    id: string;
    first_name: string;
    last_name: string;
    state: string;
    name: string;
    renewal_order_id: string;
    submission_time: string;
    variant_text: string;
    order_status: string;
    license_photo_url: string;
    selfie_photo_url: string;
    status_tag?: string;
    status_tags?: string[];
}

export interface RenewalOrderTabs {
    ro_id: number;
    renewal_order_id: string;
    external_tracking_metadata: any;
    order_status: RenewalOrderStatus;
    autoshipped: boolean;
    approval_denial_timestamp: string;
    assigned_pharmacy: string;
    dosage_selection_completed: boolean;
    shipping_status: string;
    tracking_number: string;
    product_href: string;
    created_at: string;
    subscription_type: string;
    submission_time: string;
    customer_id: string;
    address_line1: string;
    address_line2: string;
    state: string;
    city: string;
    zip: string;
    question_set_version: number;
    product_name: string;
    provider_name: string;
    provider_id: string;
    last_used_script: any;
    prescription_json: any;
    stripe_subscription_id: string;
    subscription_id: number;
    subscription_status: string;
    variant_text: string;
    variant_index: number;
    original_order_id: number;
    assigned_provider: string;
    payment_failure_status: string | null;
}

export interface SubmissionTimes {
    [orderId: string]: {
        submission_time: string | null;
        // other properties if applicable
    };
}

export type Months = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
