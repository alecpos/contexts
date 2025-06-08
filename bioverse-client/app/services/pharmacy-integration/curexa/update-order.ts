import {
    updateOrderShippingStatusAndExternalMetadata,
    updateOrderTrackingNumber,
} from '../../../utils/database/controller/orders/orders-api';
import { auditShippingTrackingFailed } from '@/app/utils/database/controller/shipping_tracking_failed_audit/shipping-tracking-failed-audit';
import { USPS_CODE, EASYPOST_PHARMACIES } from '../../easypost/constants';
import { createTracker } from '../../easypost/easypost-tracker';
import { isRenewalOrder } from '@/app/utils/database/controller/renewal_orders/renewal_orders';

export async function updateCurexaOrderWithOrderData(
    jsonData: CurexaStatusPayload
) {
    try {
        const orderId = jsonData.order_id;
        const isRenewal = await isRenewalOrder(
            orderId,
            EASYPOST_PHARMACIES.CUREXA
        );

        const trackingNumber = jsonData.tracking_number;
        const status = jsonData.status;

        if (status == 'out_for_delivery') {
            // Code to execute when the last word of EventDescription is 'InTransit'
            const { data, error } =
                await updateOrderShippingStatusAndExternalMetadata(
                    Number(orderId),
                    'InTransit',
                    jsonData
                );

            if (error) {
                return { result: 'failure' };
            }

            if (trackingNumber) {
                updateOrderTrackingNumber(orderId, trackingNumber, isRenewal);
                createTracker(
                    orderId,
                    trackingNumber,
                    USPS_CODE,
                    EASYPOST_PHARMACIES.CUREXA
                );
            } else {
                auditShippingTrackingFailed(
                    Number(orderId),
                    status,
                    jsonData,
                    EASYPOST_PHARMACIES.CUREXA
                );
            }

            return { result: 'success' };
        } else if (status == 'completed') {
            // Code to execute when the last word of EventDescription is 'Delivered'
            const { data, error } =
                await updateOrderShippingStatusAndExternalMetadata(
                    orderId,
                    'Delivered',
                    jsonData,
                    isRenewal
                );
            if (trackingNumber) {
                updateOrderTrackingNumber(orderId, trackingNumber, isRenewal);
            }

            if (error) {
                return { result: 'failure' };
            }
            return { result: 'success' };
        } else if (status == 'error') {
            // Code to execute when the last word of EventDescription is 'error'
            const { data, error } =
                await updateOrderShippingStatusAndExternalMetadata(
                    orderId,
                    'ErrorInDelivery',
                    jsonData,
                    isRenewal
                );
            if (trackingNumber) {
                updateOrderTrackingNumber(orderId, trackingNumber, isRenewal);
            }

            if (error) {
                return { result: 'failure' };
            }
            return { result: 'success' };
        } else if (status == 'in_progress') {
            const { data, error } =
                await updateOrderShippingStatusAndExternalMetadata(
                    orderId,
                    'InProgress',
                    jsonData,
                    isRenewal
                );

            if (error) {
                return { result: 'failure' };
            }

            return { result: 'success' };
        } else if (status == 'cancelled') {
            const { data, error } =
                await updateOrderShippingStatusAndExternalMetadata(
                    orderId,
                    'Cancelled',
                    jsonData,
                    isRenewal
                );

            if (error) {
                return { result: 'failure' };
            }

            return { result: 'success' };
        }
    } catch (error: any) {
        console.log(
            'update-order.ts Error in try-catch for updating Curexa order.',
            error
        );
        return { result: 'failure' };
    }

    return { result: 'failure' };
}

interface CurexaStatusPayload {
    order_id: string;
    status: string | null;
    status_details: string | null;
    tracking_number: string | null;
}
