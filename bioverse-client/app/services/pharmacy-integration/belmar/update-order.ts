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
import { isRenewalOrder } from '@/app/utils/database/controller/renewal_orders/renewal_orders';
import { ScriptSource } from '@/app/types/orders/order-types';

export async function updateBelmarOrderWithOrderData(
    jsonData: BelmarStatusPayload
) {
    try {
        //Code to search and replace 'R' character for 'retry' scripts.
        const orderId = jsonData.referenceId.replace(/R/g, '');
        const trackingNumber = jsonData.trackingNumber;

        const isRenewal = await isRenewalOrder(
            orderId,
            EASYPOST_PHARMACIES.BELMAR
        );

        if (trackingNumber != null) {
            const { error } =
                await updateOrderShippingStatusAndExternalMetadata(
                    orderId,
                    'Processing',
                    jsonData,
                    isRenewal
                );
            if (error) {
                SaveJsonUsedToFailureTable(
                    jsonData,
                    orderId,
                    '',
                    'shippment order status update error',
                    null,
                    EASYPOST_PHARMACIES.BELMAR,
                    ScriptSource.OrderUpdate
                );
            }
            updateOrderTrackingNumber(orderId, trackingNumber, isRenewal);

            try {
                const alreadyTracking = await doesOrderExistWithTrackingNumber(
                    trackingNumber,
                    orderId,
                    isRenewal
                );

                if (!alreadyTracking) {
                    await updateOrderTrackingNumber(
                        orderId,
                        trackingNumber,
                        isRenewal
                    );
                    // Start tracking with easypost
                    await createTracker(
                        orderId,
                        trackingNumber,
                        UPS_CODE,
                        EASYPOST_PHARMACIES.BELMAR
                    );
                }
            } catch (error: any) {
                auditShippingTrackingFailed(
                    orderId,
                    EASYPOST_PHARMACIES.BELMAR,
                    jsonData,
                    EASYPOST_PHARMACIES.BELMAR
                );
            }
        }
    } catch (error: any) {
        console.log(
            'update-order.ts Error in try-catch for updating Belmar order.',
            error
        );
        return { result: 'failure' };
    }

    return { result: 'success' };
}
