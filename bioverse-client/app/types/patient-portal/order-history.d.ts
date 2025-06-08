type OrderItemStatus =
    | 'Approved'
    | 'Pending Approval'
    | 'Unable to Approve'
    | 'Active'
    | 'Canceled'
    | 'Paused';

interface PatientPortalOrder {
    id: string;
    created_at: string;
    customer_uid: string;
    variant_index: number;
    variant_text: string;
    subscription_type: string;
    price: number;
    order_status: string;
    product_href: string;
    product: PatientPortalProduct;
    shipping: ShippingInformation;
    assigned_pharmacy: string | null;
    shipping_status: string | null;
    tracking_number: string | null;
    discount_id: string[] | null;
}

interface PatientPortalProduct {
    name: string;
    image_ref: string[];
}
