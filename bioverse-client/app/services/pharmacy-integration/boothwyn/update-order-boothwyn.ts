'use server';

import { Status } from '@/app/types/global/global-enumerators';
import { ScriptSource } from '@/app/types/orders/order-types';
import {
    doesOrderExistWithEasypostTrackingId,
    updateOrderShippingStatusAndExternalMetadata,
    updateOrderTrackingNumber,
} from '@/app/utils/database/controller/orders/orders-api';
import { SaveJsonUsedToFailureTable } from '@/app/utils/database/controller/pharmacy-order-failures/pharmacy-order-failures';
import { UPS_CODE, EASYPOST_PHARMACIES } from '../../easypost/constants';
import { isRenewalOrder } from '@/app/utils/database/controller/renewal_orders/renewal_orders';
import { createTracker } from '../../easypost/easypost-tracker';
import { auditShippingTrackingFailed } from '@/app/utils/database/controller/shipping_tracking_failed_audit/shipping-tracking-failed-audit';

export async function updateBoothwynOrderWithOrderData(
    jsonData: BoothwynOrderStatusPayload
) {
    const orderId = jsonData.caseId
        .replace('BIOVERSE-', '') // Remove 'BIOVERSE-' prefix
        .split('R')[0]; // Remove everything after and including 'R'
    const trackingNumber = jsonData.trackingNumber;
    const rxStatus = jsonData.rxStatus;

    const isRenewal = await isRenewalOrder(
        orderId,
        EASYPOST_PHARMACIES.BOOTHWYN
    );

    try {
        if (rxStatus === 'Shipped') {
            const { error } =
                await updateOrderShippingStatusAndExternalMetadata(
                    orderId,
                    'InTransit',
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
                    'Boothwyn',
                    ScriptSource.OrderUpdate
                );
            }
            if (trackingNumber) {
                const alreadyTracking =
                    await doesOrderExistWithEasypostTrackingId(
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
                        EASYPOST_PHARMACIES.BOOTHWYN
                    );
                }
            }
        }
    } catch (error: any) {
        auditShippingTrackingFailed(
            orderId,
            EASYPOST_PHARMACIES.BOOTHWYN,
            jsonData,
            UPS_CODE
        );
        return { result: Status.Failure };
    }

    return { result: Status.Success };
}
