export enum VERIFY_ORDER_DATA_CODES {
    SUCCESS,
    NO_ORDER,
    NOT_ELIGIBLE,
}

export interface ServerSideOrderData {
    id: number;
    customer_uid: string;
    order_status: string;
    product_href: string;
    assigned_provider: string;
    metadata: any;
}

export interface ServerSideProfileData {
    first_name: string;
    last_name: string;
    stripe_customer_id: string;
    address_line1: string;
    address_line2: string;
    city: string;
    state: string;
    zip: string;
}

export interface ServerSideStripeData {
    customerDefaultPaymentMethodId: string;
    couponId: string;
    priceId: string;
}
