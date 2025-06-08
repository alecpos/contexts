import { createSupabaseServerComponentClient } from '../../../utils/clients/supabaseServerClient';
import {
    updateOrderShippingStatusAndExternalMetadata,
    updateOrderTrackingNumber,
} from '../../../utils/database/controller/orders/orders-api';
import { EASYPOST_PHARMACIES, USPS_CODE } from '../../easypost/constants';
import { auditShippingTrackingFailed } from '@/app/utils/database/controller/shipping_tracking_failed_audit/shipping-tracking-failed-audit';
import { createTracker } from '../../easypost/easypost-tracker';
import { isRenewalOrder } from '@/app/utils/database/controller/renewal_orders/renewal_orders';

export async function updateGGMOrderWithOrderData(jsonData: any) {
    try {
        const shipping_details: ShipDetailObject[] = jsonData.Value.ShipDetail;

        console.log(
            'GGM update-order ship detail status update. Verification. JSON-data',
            jsonData
        );
        console.log(
            'GGM update-order ship detail status update. Verification. shipping_details',
            shipping_details
        );

        //Check for the last shipping detail array item and separate them to only look at the last word.
        const lastShippingDetail =
            shipping_details[shipping_details.length - 1];
        const lastWordOfEventDescription =
            lastShippingDetail.EventDescription.split(' ').pop();

        const trackingNumber = jsonData.TrackingNumber;

        const orderId = jsonData.AffiliateOrderNumber.split('-')[1];

        const isRenewal = await isRenewalOrder(
            orderId,
            EASYPOST_PHARMACIES.GOGO_MEDS
        );

        if (lastWordOfEventDescription === 'InTransit') {
            // Code to execute when the last word of EventDescription is 'InTransit'
            updateOrderShippingStatusAndExternalMetadata(
                orderId,
                'InTransit',
                shipping_details,
                isRenewal
            );
            if (trackingNumber) {
                updateOrderTrackingNumber(orderId, trackingNumber, isRenewal);
                createTracker(
                    orderId,
                    trackingNumber,
                    USPS_CODE,
                    EASYPOST_PHARMACIES.GOGO_MEDS
                );
            } else {
                auditShippingTrackingFailed(
                    Number(orderId),
                    '',
                    jsonData,
                    EASYPOST_PHARMACIES.GOGO_MEDS
                );
            }

            console.log(
                'GGM update-order extraction completed successfully',
                lastShippingDetail
            );
        } else if (lastWordOfEventDescription === 'Delivered') {
            // Code to execute when the last word of EventDescription is 'Delivered'
            updateOrderShippingStatusAndExternalMetadata(
                orderId,
                'Delivered',
                shipping_details,
                isRenewal
            );
            if (trackingNumber) {
                updateOrderTrackingNumber(orderId, trackingNumber, isRenewal);
            }
            console.log(
                'GGM update-order extraction completed successfully',
                lastShippingDetail
            );
        }
    } catch (error: any) {
        console.log(
            'update-order.ts Error in try-catch for updating GGM order.',
            error
        );
        return { result: 'failure' };
    }

    return { result: 'success' };
}

interface ShipDetailObject {
    EventDate: string;
    EventDescription: string;
    EventLocation: string;
}
