import { SubscriptionCadency } from '../renewal-orders/renewal-orders-types';
import { Environment } from '../product-prices/product-prices-types';

export enum ShippingStatus {
    Shipped = 'Shipped',
    Delivered = 'Delivered',
}

export enum OrderStatus {
    UnapprovedCardDown = 'Unapproved-CardDown',
    ApprovedCardDown = 'Approved-CardDown',
    PaymentCompleted = 'Payment-Completed',
    AdministrativeCancel = 'Administrative-Cancel',
    DeniedCardDown = 'Denied-CardDown',
    Canceled = 'Canceled',
    PaymentDeclined = 'Payment-Declined',
    ApprovedCardDownFinalized = 'Approved-CardDown-Finalized',
    Incomplete = 'Incomplete',
    Voided = 'Voided',
}

export enum ManualOrderAction {
    NewBaseOrder = 'NewBaseOrder',
    NewBaseOrderVoidOrder = 'NewBaseOrderVoidOrder',
    OverwriteBaseOrder = 'OverwriteBaseOrder',
    NewFirstTimeRenewalOrder = 'NewFirstTimeRenewalOrder',
    NewRenewalOrder = 'NewRenewalOrder',
    Error = 'Error',
    ReactivateSubscription = 'ReactivateSubscription',
}

export enum PaymentAction {
    Refund = 'Refund',
    Credit = 'Credit',
    FullyPaid = 'FullyPaid',
    FullyUnpaid = 'FullyUnpaid',
}

export interface ShippoTrackerIDResponse {
    id: string | null;
    order_id: number | null;
    success?: boolean;
}

export interface EasyPostTrackerIDResponse {
    id: string | null;
    order_id?: number | string | null;
    success?: boolean;
    type: OrderType;
    subscription_type: SubscriptionCadency;
    product_href?: string;
}

export enum OrderType {
    Order = 'Order',
    RenewalOrder = 'RenewalOrder',
    Invalid = 'Invalid',
    CustomOrder = 'CustomOrder',
}

export interface OrderData {
    type: OrderType;
    data: any;
}

export enum ScriptSource {
    Order_PaymentFailure = 'first-time-order-payment-failure-flow',
    ResendScript = 'resend-script',
    Provider = 'provider',
    Manual = 'manual',
    Engineer = 'engineer',
    AutomaticInvoicePaid = 'automatic-invoice-paid',
    OrderUpdate = 'order-update',
    ApproveScriptDialog = 'approve-script-dialog',
    ConfirmPrescriptionDialog = 'confirm-prescription-dialog',
    EmpowerWindowV2 = 'empower-window-v2',
    TMCWindow = 'tmc-window',
    CurexaActions = 'curexa-actions',
    JobScheduler = 'job-scheduler',
    AnnualGLP1SecondShipment = 'annual-second-shipment',
}

export interface BaseOrder {
    created_at: string;
    customer_uid: string;
    variant_index: number;
    variant_text: string;
    subscription_type: string;
    price: number;
    stripe_metadata: any;
    order_status: string;
    product_href: string;
    id: number;
    status_prior_to_cancellation: string;
    assigned_provider: string;
    price_id: string;
    discount_id: string;
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
    subscription_id: number;
    question_set_version: number;
    metadata: any;
    questionnaire_session_id: number;
}

export interface OrderCoordinatorOverview {
    id: string;
    customer_id: string;
    first_name: string;
    last_name: string;
    state: string;
    name: string;
    renewal_order_id: string;
    created_at: string;
    variant_text: string;
    order_status: string;
    license_photo_url: string;
    selfie_photo_url: string;
    status_tag?: string;
    status_tags?: string[];
}

export interface BaseOrderInterface {
    created_at: string; // ISO 8601 timestamp with time zone
    customer_uid: string; // UUID
    variant_index: number; // smallint
    variant_text: string; // text
    subscription_type: SubscriptionCadency; // enum: public.subscription_cadency
    price: number | null; // real
    stripe_metadata: Record<string, any> | null; // jsonb
    order_status: OrderStatus; // enum: public.order_status
    product_href: string; // text
    rx_questionnaire_answers: Record<string, any> | null; // jsonb
    id: number; // bigint
    status_prior_to_cancellation: OrderStatus | null; // enum: public.order_status
    assigned_provider: string; // UUID
    current_step: number; // smallint
    price_id: string | null; // text
    discount_id: string[] | null; // array of text
    last_updated: string | null; // ISO 8601 timestamp with time zone
    external_tracking_metadata: Record<string, any> | null; // jsonb
    assigned_pharmacy: string | null; // text
    shipping_status: string | null; // text
    tracking_number: string | null; // text
    environment: Environment | null; // enum: public.environment
    easypost_tracking_id: string | null; // text
    address_line1: string; // text
    address_line2: string; // text
    city: string; // text
    state: string; // text
    zip: string; // text
    subscription_id: number | null; // bigint
    approval_denial_timestamp: string | null; // ISO 8601 timestamp with time zone
    pharmacy_script: Record<string, any> | null; // jsonb
    submission_time: string | null; // ISO 8601 timestamp with time zone
    question_set_version: number; // smallint
    source: string; // enum: public.order_source
    metadata: Record<string, any>; // jsonb
    pharmacy_display_name: string | null; // text
    assigned_dosage: string | null; // text
    assigned_provider_timestamp: string | null; // ISO 8601 timestamp with time zone
}
