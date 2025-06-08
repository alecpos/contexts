import { SubscriptionStatus } from '@/app/types/enums/master-enums';
import { SubscriptionStatusFlags } from '@/app/utils/database/controller/prescription_subscriptions/prescription_subscription_enums';

export interface PrescriptionSubscription {
    id: number;
    created_at: Date;
    subscription_type: string;
    renewal_count: number;
    patient_id: string;
    provider_id: string;
    last_updated: Date;
    next_refill_date: Date;
    variant_text: string;
    order_id: number;
    product_href: string;
    stripe_subscription_id: string;
    last_used_script: any;
    refills_remaining: number;
    action_items: any;
    assigned_pharmacy: string;
    status: string;
    since_last_checkup: number;
    last_checkup: Date;
    recent_variants: number[];
    price_id: string;
    last_renewal_time: Date;
    status_flags: SubscriptionStatusFlags[];
}

export interface SubscriptionDetails {
    name: string;
    href: string;
    variant: string;
    image_ref: string[];
    address_line1: string;
    address_line2: string;
    state: string;
    city: string;
    zip: string;
    stripe_subscription_id: string;
    subscription_type: string;
    image_ref_transparent: string[];
    order_id: number;
    renewal_count: number;
    created_at: string;
    status: SubscriptionStatus;
    recent_variants: number[];
}

// type SubscriptionStatus  = 'active' | 'paused' | 'canceled' | 'scheduled-cancel'

export interface SubscriptionPriceDetail {
    cadence: string;
    product_price: string;
    discount_price: {
        discount_type: string;
        discount_amount: number;
    };
    stripe_price_id: string;
    blue_display_text: string;
    gray_display_text: string;
    stripe_product_id: string;
    quarterly_display_price: string;
    subcription_includes_bullets: string[];
}

export interface SubscriptionDetailsResponse {
    status: 'success' | 'failure';
    data: SubscriptionDetails;
}
