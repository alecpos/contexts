'use server';

import { Status } from '@/app/types/global/global-enumerators';
import { ScriptSource } from '@/app/types/orders/order-types';
import {
    doesOrderExistWithEasypostTrackingId,
    updateOrderShippingStatusAndExternalMetadata,
    updateOrderTrackingNumber,
} from '@/app/utils/database/controller/orders/orders-api';
import { SaveJsonUsedToFailureTable } from '@/app/utils/database/controller/pharmacy-order-failures/pharmacy-order-failures';
import { EASYPOST_PHARMACIES, FEDEX_CODE } from '../../easypost/constants';
import { createTracker } from '../../easypost/easypost-tracker';
import { auditShippingTrackingFailed } from '@/app/utils/database/controller/shipping_tracking_failed_audit/shipping-tracking-failed-audit';
import { getReviveOrderFromIdentifier } from './revive-order-api';
import { PHARMACY } from '@/app/types/pharmacy-integrations/pharmacy-types';

export async function updateReviveOrderWithOrderData(
    jsonData: ReviveOrderStatusPayload
) {
    const trackingNumber = jsonData.event_data.tracking_id;
    const { orderId, isRenewal } = await getReviveOrderFromIdentifier(
        jsonData.electronic_prescription_message_id
    );

    if (!orderId) {
        return { result: Status.Failure };
    }

    if (orderId) {
        console.log('Revive Update Order With Tracker Found Order ID', orderId);
    }

    try {
        const { error } = await updateOrderShippingStatusAndExternalMetadata(
            orderId,
            'deprecated',
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
                PHARMACY.REVIVE,
                ScriptSource.OrderUpdate
            );
        }

        if (trackingNumber) {
            const alreadyTracking = await doesOrderExistWithEasypostTrackingId(
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
                    FEDEX_CODE,
                    EASYPOST_PHARMACIES.REVIVE
                );
            }
        }
    } catch (error: any) {
        auditShippingTrackingFailed(
            orderId,
            EASYPOST_PHARMACIES.REVIVE,
            jsonData,
            FEDEX_CODE
        );
        return { result: Status.Failure };
    }

    return { result: Status.Success };
}
