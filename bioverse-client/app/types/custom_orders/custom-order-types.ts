import { PRODUCT_HREF } from '../global/product-enumerator';

export enum CustomOrderStatus {
    PharmacyProcessing = 'PharmacyProcessing',
    Shipped = 'Shipped',
    Delivered = 'Delivered',
}

export interface CustomOrder {
    id: number;
    created_at: string;
    custom_order_id: string;
    reference_order_id: string;
    prescription_json: any;
    order_status: CustomOrderStatus;
    tracking_number: string;
    easypost_tracking_id: string;
    sender_id: string;
    product_href: PRODUCT_HREF;
    patient_id: string;
}
