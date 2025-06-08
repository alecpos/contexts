import {
    Environment,
    RenewalOrderStatus,
    RenewalOrderSource,
} from '../enums/enumerated_types';

export interface DatabaseRenewalOrder {
    id: number;
    created_at: string;
    original_order_id: number | null;
    customer_uuid: string | null;
    prescription_json: Record<string, any> | null;
    assigned_pharmacy: string | null;
    external_tracking_metadata: Record<string, any> | null;
    tracking_number: string | null;
    shipping_status: string | null;
    subscription_type: string | null;
    product_href: string | null;
    easypost_tracking_id: string | null;
    address_line1: string | null;
    address_line2: string | null;
    city: string | null;
    state: string | null;
    zip: string | null;
    subscription_id: number | null;
    renewal_order_id: string;
    checkup_action_item_id: number | null;
    provider_review_after: string | null;
    order_status: RenewalOrderStatus;
    submission_time: string | null;
    environment: Environment | null;
    approval_denial_timestamp: string | null;
    price: string | null;
    assigned_provider: string | null;
    final_review_starts: string | null;
    variant_index: number | null;
    price_id: string | null;
    dosage_suggestion_variant_indexes: number[] | null;
    assigned_provider_timestamp: string | null;
    note_history: Record<string, any> | null;
    autoshipped: boolean | null;
    dosage_selection_completed: boolean;
    metadata: Record<string, any> | null;
    invoice_id: string | null;
    source: RenewalOrderSource | null;
    check_ins: Record<string, any> | null;
}
