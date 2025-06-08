'use server';
import {
    addEasyPostTrackingIDToOrder,
    updateOrderShippingStatus,
} from '@/app/utils/database/controller/orders/orders-api';
import { CREATE_TRACKER_BASE_URL } from './constants';
import { auditShippingTrackingFailed } from '@/app/utils/database/controller/shipping_tracking_failed_audit/shipping-tracking-failed-audit';
import {
    PRESCRIPTION_RENEWAL_SHIPPED,
    PRESCRIPTION_SHIPPED,
} from '../customerio/event_names';
import { ShippingStatus } from '@/app/types/orders/order-types';
import { getProductName } from '@/app/utils/database/controller/products/products';
import { Status } from '@/app/types/global/global-enumerators';
import { triggerEvent } from '../customerio/customerioApiFactory';
import { updateRenewalOrder } from '@/app/utils/database/controller/renewal_orders/renewal_orders';
import {
    getCustomOrder,
    updateCustomOrder,
} from '@/app/utils/database/controller/custom_orders/custom_orders_api';
import { CustomOrderStatus } from '@/app/types/custom_orders/custom-order-types';

type ResponseBody = {
    id: string;
};

export async function fetchWithRetry(
    url: string,
    options: any,
    retries = 3,
    backoff = 300
) {
    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            console.error(response);
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json(); // Assuming you want to parse the response as JSON
    } catch (error) {
        if (retries > 0) {
            console.log(`Retry ${retries}`);
            // Wait for the backoff time before retrying
            await new Promise((resolve) => setTimeout(resolve, backoff));
            // Retry the request
            return fetchWithRetry(url, options, retries - 1, backoff * 2);
        } else {
            // If retries are exhausted, throw the error
            throw error;
        }
    }
}

export async function createTracker(
    order_id: string,
    trackingNumber: string,
    carrier: string,
    pharmacy: string
) {
    const payload = {
        tracker: {
            tracking_code: trackingNumber,
            carrier,
        },
    };

    try {
        const data = await fetchWithRetry(CREATE_TRACKER_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Basic ${Buffer.from(
                    `${process.env.EASYPOST_API_KEY}:`
                ).toString('base64')}`,
            },
            body: JSON.stringify(payload),
        });

        const { data: orderData, success } = await addEasyPostTrackingIDToOrder(
            String(order_id),
            data.id,
            pharmacy
        );

        if (success === Status.Success) {
            const user_id = orderData.customer_uid
                ? orderData.customer_uid
                : orderData.customer_uuid;
            console.log(
                'Created tracker successfully for order',
                user_id,
                order_id,
                trackingNumber,
                orderData
            );

            const productNameData = await getProductName(
                orderData.product_href
            );

            if (!productNameData.name) {
                throw new Error('Could not get product name for order');
            }

            if (orderData.renewal_order_id) {
                await triggerEvent(user_id, PRESCRIPTION_RENEWAL_SHIPPED, {
                    order_id: order_id,
                    tracking_number: trackingNumber,
                    tracking_url: data.public_url,
                    product_name: productNameData.name,
                });
                await updateRenewalOrder(orderData.id, {
                    shipping_status: ShippingStatus.Shipped,
                });
            } else {
                await triggerEvent(user_id, PRESCRIPTION_SHIPPED, {
                    order_id: order_id,
                    tracking_number: trackingNumber,
                    tracking_url: data.public_url,
                    product_name: productNameData.name,
                });
                await updateOrderShippingStatus(
                    orderData.id,
                    ShippingStatus.Shipped
                );
            }
        } else {
            throw new Error('Adding easypost tracking to order failed');
        }
    } catch (error) {
        console.error(`Failed to create tracker for order #${order_id}`, error);
        auditShippingTrackingFailed(
            order_id,
            'tracking_failed',
            JSON.stringify({ trackingNumber, error }),
            carrier
        );
        return;
    }
}

export async function createTrackerForCustomOrders(
    custom_order_id: string,
    trackingNumber: string,
    carrier: string,
    pharmacy: string
) {
    const payload = {
        tracker: {
            tracking_code: trackingNumber,
            carrier,
        },
    };

    try {
        const data = await fetchWithRetry(CREATE_TRACKER_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Basic ${Buffer.from(
                    `${process.env.EASYPOST_API_KEY}:`
                ).toString('base64')}`,
            },
            body: JSON.stringify(payload),
        });

        await updateCustomOrder(custom_order_id, {
            easypost_tracking_id: data.id,
            order_status: CustomOrderStatus.Shipped,
        });

        const customOrder = await getCustomOrder(custom_order_id);

        const productNameData = await getProductName(customOrder.product_href);

        if (!productNameData.name) {
            throw new Error('Could not get product name for order');
        }

        if (customOrder.custom_order_id) {
            await triggerEvent(
                customOrder.patient_id,
                PRESCRIPTION_RENEWAL_SHIPPED,
                {
                    order_id: customOrder.custom_order_id,
                    tracking_number: trackingNumber,
                    tracking_url: data.public_url,
                    product_name: productNameData.name,
                }
            );
        }
    } catch (error) {
        console.error(
            `Failed to create tracker for order #${custom_order_id}`,
            error
        );
        auditShippingTrackingFailed(
            custom_order_id,
            'tracking_failed',
            JSON.stringify({ trackingNumber, error }),
            carrier
        );
        return;
    }
}
