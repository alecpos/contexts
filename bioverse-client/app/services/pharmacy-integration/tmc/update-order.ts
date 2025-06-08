'use server';

import { UPS_CODE, EASYPOST_PHARMACIES } from '../../easypost/constants';
import { createTracker } from '../../easypost/easypost-tracker';
import { getTMCOrderInformation } from './tmc-actions';

export async function assignEasyPostTrackingToTMCOrder(order_json: any) {
    if (!order_json.external_tracking_metadata) {
        console.log(order_json, 'did not have external metadata');
        return;
    }

    const shipping_data = await getTMCOrderInformation(order_json.id);
    console.log(order_json.id, shipping_data.shipping_information);

    if (!shipping_data.shipping_information) {
        console.log('no shipping information');
        return;
    }

    const tracking_no = Array.isArray(shipping_data.shipping_information)
        ? shipping_data.shipping_information[0].tracking_no
        : shipping_data.shipping_information.tracking_no;

    // console.log('number: ', tracking_no, 'url');

    if (!tracking_no) {
        console.log('order has not been shipped yet ' + order_json.id);
        return;
    }

    // console.log('wouldve created tracker');
    await createTracker(
        order_json.id as string,
        tracking_no,
        UPS_CODE,
        EASYPOST_PHARMACIES.TMC
    );

    return;
}
