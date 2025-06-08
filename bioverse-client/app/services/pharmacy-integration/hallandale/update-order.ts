'use server';
import {
    doesOrderExistWithEasypostTrackingId,
    getOrderIdUsingHallandaleOrderId,
    updateOrderShippingStatusAndExternalMetadata,
    updateOrderTrackingNumber,
} from '../../../utils/database/controller/orders/orders-api';
import { SaveJsonUsedToFailureTable } from '../../../utils/database/controller/pharmacy-order-failures/pharmacy-order-failures';
import { createTracker } from '../../easypost/easypost-tracker';
import { FEDEX_CODE, EASYPOST_PHARMACIES } from '../../easypost/constants';
import { auditShippingTrackingFailed } from '@/app/utils/database/controller/shipping_tracking_failed_audit/shipping-tracking-failed-audit';
import { isRenewalOrder } from '@/app/utils/database/controller/renewal_orders/renewal_orders';
import { ScriptSource } from '@/app/types/orders/order-types';

export async function updateHallandaleOrderWithOrderData(
    jsonData: HallandaleStatusPayload[]
) {
    try {
        //Code to search and replace 'R' character for 'retry' scripts.
        if (jsonData.length !== 1) {
            console.error('Json data has length longer than 1');
            return { result: 'failure' };
        }

        const jsonObject = jsonData[0];

        // console.log('JSON OBJECt', jsonObject);

        const hallandaleOrderId = jsonObject.orderId;
        const trackingNumber = jsonObject.trackingNumber;

        const order_id = await getOrderIdUsingHallandaleOrderId(
            hallandaleOrderId
        );

        if (!order_id) {
            console.error(
                'Could not find order for hallandale order update',
                jsonData
            );
            return { result: 'failure ' };
        }

        console.log('order ID found for hallandale Rx match: ', order_id);
        console.log('the tracking #: ', trackingNumber);

        const isRenewal = await isRenewalOrder(
            order_id,
            EASYPOST_PHARMACIES.HALLANDALE
        );

        if (trackingNumber) {
            const { error } =
                await updateOrderShippingStatusAndExternalMetadata(
                    order_id,
                    'Processing',
                    jsonObject,
                    isRenewal
                );
            if (error) {
                SaveJsonUsedToFailureTable(
                    jsonData,
                    order_id,
                    '',
                    'shippment order status update error',
                    null,
                    EASYPOST_PHARMACIES.HALLANDALE,
                    ScriptSource.OrderUpdate
                );
                throw error;
            }
            await updateOrderTrackingNumber(
                order_id,
                trackingNumber,
                isRenewal
            );

            try {
                const alreadyTracking =
                    await doesOrderExistWithEasypostTrackingId(
                        trackingNumber,
                        order_id,
                        isRenewal
                    );

                // console.log('are we already tracking ?? ', alreadyTracking);

                if (!alreadyTracking) {
                    await updateOrderTrackingNumber(
                        order_id,
                        trackingNumber,
                        isRenewal
                    );
                    // Start tracking with easypost
                    await createTracker(
                        order_id,
                        trackingNumber,
                        FEDEX_CODE,
                        EASYPOST_PHARMACIES.HALLANDALE
                    );
                }
            } catch (error: any) {
                auditShippingTrackingFailed(
                    order_id,
                    EASYPOST_PHARMACIES.HALLANDALE,
                    jsonData,
                    EASYPOST_PHARMACIES.HALLANDALE
                );
                throw error;
            }
        }
    } catch (error: any) {
        console.log(
            'update-order.ts Error in try-catch for updating Hallandale order.',
            error
        );
        return { result: 'failure' };
    }

    return { result: 'success' };
}
