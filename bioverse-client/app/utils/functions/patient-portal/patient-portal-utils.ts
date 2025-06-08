import {
    OrderStatus,
    OrderType,
    ShippingStatus,
} from '@/app/types/orders/order-types';
import { getPriceForProduct } from '../../database/controller/orders/orders-api';
import { RenewalOrderStatus } from '@/app/types/renewal-orders/renewal-orders-types';
import { getPriceForRenewalOrder } from '../../database/controller/renewal_orders/renewal_orders';

export type OrderNew = {
    id: number;
    created_at: string;
    customer_uid: string;
    variant_index: number;
    variant_text: string;
    discount_id: string | string[] | null;
    subscription_type: string;
    price: number;
    order_status: string;
    product_href: string;
    assigned_pharmacy: string | null;
    shipping_status: string | null;
    tracking_number: string | null;
    product: {
        name: string;
        image_ref: any[];
    };
    shipping: {
        address_line1: string;
        address_line2: string;
        city: string;
        state: string;
        zip: string;
    };
};

export type SubscriptionListItem = {
    id: number;
    variant_text: string | null;
    subscription_type: string;
    next_refill_date: Date | null;
    status: string;
    name: string;
    image_ref: string[];
    product_href: string;
};

export type SubscriptionStatusCategories = {
    active: SubscriptionListItem[];
    paused: SubscriptionListItem[];
    canceled: SubscriptionListItem[];
    unknown: SubscriptionListItem[];
    'scheduled-cancel': SubscriptionListItem[];
};

export type OrderItem = {
    id: number;
    created_at: string;
    customer_uuid: string;
    subscription_type: string;
    product_href: string;
    shipping_status: string;
    tracking_number: string;
    address_line1: string;
    address_line2: string;
    city: string;
    state: string;
    zip: string;
    image_ref: string[];
    name: string;
    variant_index: number;
    // rest are optional
    assigned_pharmacy?: string;
    order_status?: string;
    order_type: string; // Renewal or Regular
    price?: number | string;
    provider_review_after?: Date;
    checkup_action_item_id?: number;
    renewal_order_id?: string;
    pharmacy_display_name?: string;
    dosage_selection_completed?: boolean;
};

export function categorizeSubscriptions(
    subscriptions: SubscriptionListItem[],
): SubscriptionStatusCategories {
    return subscriptions.reduce(
        (acc: SubscriptionStatusCategories, subscription) => {
            if (subscription.status === 'active') {
                acc['active'] = acc['active'] || [];
                acc['active'].push(subscription);
            } else if (subscription.status === 'paused') {
                acc['paused'] = acc['paused'] || [];
                acc['paused'].push(subscription);
            } else if (subscription.status === 'canceled') {
                acc['canceled'] = acc['canceled'] || [];
                acc['canceled'].push(subscription);
            } else if (subscription.status === 'scheduled-cancel') {
                acc['scheduled-cancel'] = acc['scheduled-cancel'] || [];
                acc['scheduled-cancel'].push(subscription);
            } else {
                acc['unknown'] = acc['unknown'] || [];
                acc['unknown'].push(subscription);
            }
            return acc;
        },
        {
            active: [],
            paused: [],
            canceled: [],
            unknown: [],
            'scheduled-cancel': [],
        },
    );
}

export function getAllProductHrefs(
    categories: SubscriptionStatusCategories,
): string[] {
    const allHrefs: string[] = [];

    // Iterate over each category (active, paused, canceled)
    Object.values(categories).forEach((category: SubscriptionListItem[]) => {
        // Iterate over each item in the category
        category.forEach((item: SubscriptionListItem) => {
            // Push the product_href to the allHrefs array
            allHrefs.push(item.product_href);
        });
    });

    // Use Set to keep only unique hrefs and convert it back to an array
    const uniqueHrefs: string[] = Array.from(new Set(allHrefs));

    return uniqueHrefs;
}

export type OrderStatusCategories = {
    delivered: OrderItem[];
    shipped: OrderItem[];
    canceled: OrderItem[];
    review: OrderItem[];
    'payment-failed': OrderItem[];
    'pharmacy-processing': OrderItem[];
    processing: OrderItem[];
};

// Provider Review in progress
// shipped
// order cancelled / request not approved
// delivered

export function categorizeOrders(orders: OrderItem[]): OrderStatusCategories {
    return orders.reduce(
        (acc: OrderStatusCategories, order) => {
            if (order.shipping_status === ShippingStatus.Delivered) {
                acc['delivered'] = acc['delivered'] || [];
                acc['delivered'].push(order);
            } else if (order.shipping_status === ShippingStatus.Shipped) {
                acc['shipped'] = acc['shipped'] || [];
                acc['shipped'].push(order);
            } else if (
                order.order_status !== RenewalOrderStatus.PharmacyProcessing &&
                order.dosage_selection_completed
            ) {
                acc['processing'] = acc['processing'] || [];
                acc['processing'].push(order);
            } else if (
                order.order_status === OrderStatus.UnapprovedCardDown ||
                order.order_status ===
                    RenewalOrderStatus.CheckupComplete_Unprescribed_Paid ||
                // order.order_status ===
                //     RenewalOrderStatus.CheckupComplete_Unprescribed_Unpaid ||
                order.order_status ===
                    RenewalOrderStatus.CheckupIncomplete_Unprescribed_Paid ||
                order.order_status ===
                    RenewalOrderStatus.CheckupIncomplete_Unprescribed_Paid_1 ||
                order.order_status ===
                    RenewalOrderStatus.CheckupIncomplete_Unprescribed_Paid_2 ||
                order.order_status ===
                    RenewalOrderStatus.CheckupWaived_Unprescribed_Paid
            ) {
                acc['review'] = acc['review'] || [];
                acc['review'].push(order);
            } else if (
                order.order_status === OrderStatus.Canceled ||
                order.order_status === OrderStatus.AdministrativeCancel ||
                order.order_status === OrderStatus.DeniedCardDown ||
                order.order_status === RenewalOrderStatus.Denied_Paid ||
                order.order_status === RenewalOrderStatus.Denied_Unpaid
            ) {
                acc['canceled'] = acc['canceled'] || [];
                acc['canceled'].push(order);
            } else if (
                order.order_status === OrderStatus.ApprovedCardDown ||
                order.order_status === OrderStatus.PaymentCompleted ||
                order.order_status === OrderStatus.ApprovedCardDownFinalized ||
                order.order_status === RenewalOrderStatus.PharmacyProcessing ||
                order.order_status ===
                    RenewalOrderStatus.CheckupComplete_Prescribed_Paid
            ) {
                acc['pharmacy-processing'] = acc['pharmacy-processing'] || [];
                acc['pharmacy-processing'].push(order);
            } else if (order.order_status === OrderStatus.PaymentDeclined) {
                acc['payment-failed'] = acc['payment-failed'] || [];
                acc['payment-failed'].push(order);
            } else if (
                order.order_status === RenewalOrderStatus.Unknown ||
                order.order_status ===
                    RenewalOrderStatus.Scheduled_Admin_Cancel ||
                order.order_status === RenewalOrderStatus.Scheduled_Cancel ||
                order.order_status === RenewalOrderStatus.Incomplete
            ) {
                // do nothing
            } else {
                // acc['review'] = acc['review'] || [];
                // acc['review'].push(order);
            }
            return acc;
        },
        {
            delivered: [],
            'pharmacy-processing': [],
            review: [],
            shipped: [],
            canceled: [],
            'payment-failed': [],
            processing: [],
        },
    );
}

export async function mergeOrders(
    orders: OrderItem[],
    renewalOrders: OrderItem[],
): Promise<OrderItem[]> {
    // Step 1: Concatenate the arrays
    const combinedOrders: OrderItem[] = [...orders, ...renewalOrders];

    // Step 2: Add the order_type field to each item
    await Promise.all(
        combinedOrders.map(async (order) => {
            if (orders.includes(order)) {
                order.order_type = OrderType.Order;
            } else if (renewalOrders.includes(order)) {
                order.order_type = OrderType.RenewalOrder;
            }
            var price;
            if (order.order_type === OrderType.RenewalOrder) {
                price = await getPriceForRenewalOrder(order.renewal_order_id!);
            } else {
                price = (await getPriceForProduct(order.id)) || 0;
            }

            order.price = price;
        }),
    );

    // Step 3: Sort the combined array by the created_at field
    combinedOrders.sort(
        (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );

    return combinedOrders;
}

export function formatSubscriptionType(subscriptionType: string) {
    switch (subscriptionType) {
        case 'monthly':
            return 'Monthly';
        case 'quarterly':
            return 'Quarterly';
        case 'one_time':
            return 'One-Time';
        default:
            return 'N/A';
    }
}
