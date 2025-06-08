'use server';
import {
    doesOrderExistWithTrackingNumber,
    updateOrderShippingStatusAndExternalMetadata,
    updateOrderTrackingNumber,
} from '../../../utils/database/controller/orders/orders-api';
import { SaveJsonUsedToFailureTable } from '../../../utils/database/controller/pharmacy-order-failures/pharmacy-order-failures';
import { createTracker } from '../../easypost/easypost-tracker';
import { UPS_CODE, EASYPOST_PHARMACIES } from '../../easypost/constants';
import { auditShippingTrackingFailed } from '@/app/utils/database/controller/shipping_tracking_failed_audit/shipping-tracking-failed-audit';
import { OrderType, ScriptSource } from '@/app/types/orders/order-types';
import {
    getOrderType,
    shouldCreateEasypostTrackerForCustomOrder,
    updateCustomOrder,
} from '@/app/utils/database/controller/custom_orders/custom_orders_api';

export async function updateEmpowerOrderWithOrderData(
    jsonData: EmpowerStatusPayload
) {
    try {
        const orderId = jsonData.clientOrderId.replace(/R/g, '');
        const trackingNumber = jsonData.shipmentLines
            ? jsonData.shipmentLines[0]?.shipmentTrackingNumber
            : null;
        const status = jsonData.orderStatus;

        const orderType = await getOrderType(
            orderId,
            EASYPOST_PHARMACIES.EMPOWER
        );

        if (status == 'Received') {
            // Code to execute when the last word of EventDescription is 'InTransit'
            if (
                orderType === OrderType.RenewalOrder ||
                orderType === OrderType.Order
            ) {
                const { error } =
                    await updateOrderShippingStatusAndExternalMetadata(
                        orderId,
                        'Processing',
                        jsonData,
                        orderType === OrderType.RenewalOrder
                    );
                if (error) {
                    SaveJsonUsedToFailureTable(
                        jsonData,
                        orderId,
                        '',
                        'shippment order status update error',
                        null,
                        'Empower',
                        ScriptSource.OrderUpdate
                    );
                }
                if (trackingNumber) {
                    updateOrderTrackingNumber(
                        orderId,
                        trackingNumber,
                        orderType === OrderType.RenewalOrder
                    );
                }
            } else if (orderType === OrderType.CustomOrder) {
            }
        } else if (status == 'Processing') {
            // Code to execute when the last word of EventDescription is 'Delivered'
            if (
                orderType === OrderType.Order ||
                orderType === OrderType.RenewalOrder
            ) {
                const { error } =
                    await updateOrderShippingStatusAndExternalMetadata(
                        orderId,
                        'Processing',
                        jsonData,
                        orderType === OrderType.RenewalOrder
                    );

                if (error) {
                    SaveJsonUsedToFailureTable(
                        jsonData,
                        orderId,
                        '',
                        'shippment order status update error',
                        null,
                        'Empower',
                        ScriptSource.OrderUpdate
                    );
                }

                if (trackingNumber) {
                    updateOrderTrackingNumber(
                        orderId,
                        trackingNumber,
                        orderType === OrderType.RenewalOrder
                    );
                }
            }
        } else if (status == 'Complete') {
            //Complete in the context of empower is when the tracking number is added.
            // Code to execute when the last word of EventDescription is 'error'
            if (orderType === OrderType.RenewalOrder || OrderType.Order) {
                const { error } =
                    await updateOrderShippingStatusAndExternalMetadata(
                        orderId,
                        'InTransit',
                        jsonData,
                        orderType === OrderType.RenewalOrder
                    );

                if (error) {
                    await SaveJsonUsedToFailureTable(
                        jsonData,
                        orderId,
                        '',
                        'shippment order status update error',
                        null,
                        'Empower',
                        ScriptSource.OrderUpdate
                    );
                }
            }

            if (orderType === OrderType.CustomOrder) {
                if (trackingNumber) {
                    const shouldTrack =
                        await shouldCreateEasypostTrackerForCustomOrder(
                            orderId
                        );

                    if (shouldTrack) {
                        await updateCustomOrder(jsonData.clientOrderId, {
                            tracking_number: trackingNumber,
                        });

                        await createTracker(
                            jsonData.clientOrderId,
                            trackingNumber,
                            UPS_CODE,
                            EASYPOST_PHARMACIES.EMPOWER
                        );
                    }
                }
            } else {
                if (trackingNumber) {
                    const alreadyTracking =
                        await doesOrderExistWithTrackingNumber(
                            trackingNumber,
                            orderId,
                            orderType === OrderType.RenewalOrder
                        );

                    if (!alreadyTracking) {
                        await updateOrderTrackingNumber(
                            orderId,
                            trackingNumber,
                            orderType === OrderType.RenewalOrder
                        );
                        // Start tracking with easypost
                        await createTracker(
                            orderId,
                            trackingNumber,
                            UPS_CODE,
                            EASYPOST_PHARMACIES.EMPOWER
                        );
                    }
                } else {
                    auditShippingTrackingFailed(
                        orderId,
                        status,
                        jsonData,
                        EASYPOST_PHARMACIES.EMPOWER
                    );
                }
            }
        }
    } catch (error: any) {
        console.log(
            'update-order.ts Error in try-catch for updating Empower order.',
            error
        );
        return { result: 'failure' };
    }

    return { result: 'success' };
}
