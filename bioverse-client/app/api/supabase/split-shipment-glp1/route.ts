'use server';

import { processAutomaticHallandaleScript } from '@/app/services/pharmacy-integration/hallandale/hallandale-script-api';
import { ScriptSource } from '@/app/types/orders/order-types';
import { getPatientInformationById } from '@/app/utils/actions/provider/patient-overview';
import { fetchOrderData } from '@/app/utils/database/controller/orders/orders-api';
import { updateSplitShipmentGLP1SecondShipmentSent } from '@/app/utils/functions/split-shipment-glp1/split-shipment-glp1-controller';
import { SPLIT_SHIPMENT_GLP1_VARIANT_MAP } from '@/app/utils/functions/split-shipment-glp1/split-shipment-variant-mappings';
import { generateReviveScript } from '@/app/utils/functions/prescription-scripts/revive-script-generator';
import { NextRequest, NextResponse } from 'next/server';
import { sendReviveScript } from '@/app/services/pharmacy-integration/revive/revive-send-script-api';
import { OrderType } from '@/app/types/orders/order-types';
import { Status } from '@/app/types/global/global-enumerators';
import { forwardOrderToEngineering } from '@/app/utils/database/controller/patient-status-tags/patient-status-tags-api';
import { PRESCRIPTION_APPROVED } from '@/app/services/customerio/event_names';
import { triggerEvent } from '@/app/services/customerio/customerioApiFactory';

/**
 * We will assumed the CRON job will only send orders that need to be resent within the scheduled time.
 */
export async function POST(req: NextRequest) {
    const authHeader = req.headers.get('Authorization');
    const apiKey = `Bearer ${process.env.SUPABASE_CRON_API_KEY}`;
    //I'm using the payment failure api key on purpose not to create a new env variable - Nathan

    if (authHeader !== apiKey) {
        console.error('EXITING SPLIT SHIPMENT GLP1 SECOND SHIPMENT CHECK');
        return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    //Take the information from the payload
    // anticipating 1 record to check w/ orderId, renewalOrderId, or SubscriptionId
    const body = await req.json();
    const recordData = body.record_data as SplitShipmentTracking;
    console.log('SPLIT SHIPMENT TEST CODE GIGA: ', body);

    //check if there is a renewal order id first and if it is not present consider it an order.
    const { data, type } = await fetchOrderData(
        recordData.renewal_order_id ??
            String(recordData.renewal_order_id ?? recordData.base_order_id)
    );

    const orderDataObject: DBOrderData = data as DBOrderData;

    const { data: patientData, error: patientDataError } =
        await getPatientInformationById(
            orderDataObject.customer_uuid ?? orderDataObject.customer_uid
        );

    const patientDataObject: DBPatientData = patientData as DBPatientData;

    //check the variant index & product href and put it through a map created to make sense of the
    // 'next variant' that exists to follow through the next script being sent.
    let new_variant_index = -1;
    try {
        new_variant_index =
            SPLIT_SHIPMENT_GLP1_VARIANT_MAP[orderDataObject.product_href][
                orderDataObject.variant_index
            ].secondShipmentVariant;
    } catch (error) {
        console.error('Error: Could not get new variant index');
        await forwardOrderToEngineering(
            String(recordData.renewal_order_id ?? recordData.base_order_id),
            orderDataObject.customer_uid,
            'Failed to get new variant index for second split shipment GLP1'
        );
        return NextResponse.json({ message: 'Error: Could not get new variant index' }, { status: 500 });
    }

    //check the order_data_audit to check whether there is a second_script_released event and if there is handle & flag

    // generate the script here without PVC
    const reviveScript = await generateReviveScript(
        orderDataObject.customer_uuid ?? orderDataObject.customer_uid,
        recordData.renewal_order_id ?? String(recordData.renewal_order_id ?? recordData.base_order_id),
        {
            product_href: orderDataObject.product_href,
            variant_index: new_variant_index,
        },
    );

    console.log('SPLIT SHIPMENT TEST CODE SCRIPTO: ');


    console.log(
        'TESTING SPLIT SHIPMENT ORDERS CHECK CODE 1: about to send the script: new variant: ',
        new_variant_index,
        'TYPE: !!!! : ',
        type
    );

    if (!reviveScript.script_json) {
        console.error('Error: Could not generate revive script');
        await forwardOrderToEngineering(
            String(recordData.renewal_order_id ?? recordData.base_order_id),
            orderDataObject.customer_uid,
            'Failed to generate revive script for second split shipment GLP1'
        );

        return NextResponse.json({ message: 'Error: Could not generate revive script' }, { status: 500 });
    }

    const result = await sendReviveScript(
        reviveScript.script_json,
        recordData.renewal_order_id ?? String(recordData.renewal_order_id ?? recordData.base_order_id),
        orderDataObject.assigned_provider,
        orderDataObject.order_status,
        orderDataObject?.renewal_order_id ? OrderType.RenewalOrder : OrderType.Order,
        orderDataObject.subscription_id ?? undefined,
        orderDataObject?.renewal_order_id ?? undefined,
        new_variant_index
    );

    if (result.result !== Status.Success) {
        console.error('Error: Could not send revive script');
        await forwardOrderToEngineering(
            String(recordData.renewal_order_id ?? recordData.base_order_id),
            orderDataObject.customer_uid,
            'Failed to send revive script for second split shipment GLP1'
        );

        return NextResponse.json({ message: 'Error: Could not send revive script' }, { status: 500 });
    }
    // once that succeeds, we will handle this by updating the database to consider this handled and resolved.
    await updateSplitShipmentGLP1SecondShipmentSent(recordData.id, reviveScript.script_json);

    //trigger the event for the patient
    try {
        await triggerEvent(patientDataObject.id, PRESCRIPTION_APPROVED, {
            order_id: recordData.renewal_order_id ?? String(recordData.renewal_order_id ?? recordData.base_order_id),
            product_name: orderDataObject.product_href,
        });
    } catch (error) {
        console.error('Error: Could not trigger PRESCRIPTION_APPROVED event for second split shipment GLP1');
        await forwardOrderToEngineering(
            String(recordData.renewal_order_id ?? recordData.base_order_id),
            orderDataObject.customer_uid,
            'Failed to trigger PRESCRIPTION_APPROVED event for second split shipment GLP1'
        );
    }

    console.log(
        'TESTING SPLIT SHIPMENT ORDERS CHECK CODE X: updating second shipment set.',
        new_variant_index
    );

    return NextResponse.json({ message: 'Success' }, { status: 200 });
}
