'use server';

import { processAutomaticHallandaleScript } from '@/app/services/pharmacy-integration/hallandale/hallandale-script-api';
import { ScriptSource } from '@/app/types/orders/order-types';
import { getPatientInformationById } from '@/app/utils/actions/provider/patient-overview';
import { fetchOrderData } from '@/app/utils/database/controller/orders/orders-api';
import { updateAnnualGLP1SecondShipmentSent } from '@/app/utils/functions/annual-glp1/annual-glp1-controller';
import { ANNUAL_GLP1_VARIANT_MAP } from '@/app/utils/functions/annual-glp1/annual-glp1-mappings';
import { generateHallandaleScript } from '@/app/utils/functions/prescription-scripts/hallandale-approval-script-generator';
import { NextRequest, NextResponse } from 'next/server';

/**
 * We will assumed the CRON job will only send orders that need to be resent within the scheduled time.
 */
export async function POST(req: NextRequest) {
    const authHeader = req.headers.get('Authorization');
    const apiKey = `Bearer ${process.env.SUPABASE_CRON_API_KEY}`;
    //I'm using the payment failure api key on purpose not to create a new env variable - Nathan

    if (authHeader !== apiKey) {
        console.error('EXITING ANNUAL 6 MONTH SUPPLY CHECK');
        return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    //Take the information from the payload
    // anticipating 1 record to check w/ orderId, renewalOrderId, or SubscriptionId
    const body = await req.json();
    const recordData = body.record_data as AnnualOrderTracking;
    console.log('ANNUAL SECOND SHIPMENT TEST CODE GIGA: ', body);

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
    const new_variant_index =
        ANNUAL_GLP1_VARIANT_MAP[orderDataObject.product_href][
            orderDataObject.variant_index
        ].secondShipmentVariant;

    //check the order_data_audit to check whether there is a second_script_released event and if there is handle & flag

    // generate the script here without PVC
    const hallandaleScript = generateHallandaleScript(
        patientDataObject,
        orderDataObject,
        {
            address_line1: patientData?.address_line1,
            address_line2: patientData?.address_line2,
            city: patientData?.city,
            state: patientData?.state,
            zip: patientData?.zip,
        },
        type,
        new_variant_index
    );

    console.log('ANNUAL SECOND SHIPMENT TEST CODE SCRIPTO: ');

    // send an event to the hallandale script sending now to send the script

    const body_json: HallandaleScriptJSON = {
        message: {
            id: orderDataObject.original_order_id ?? orderDataObject.id,
            sentTime: new Date().toISOString(),
        },
        order: hallandaleScript!.script,
    };

    console.log(
        'TESTING ANNUAL ORDERS CHECK CODE 1: about to send the script: new variant: ',
        new_variant_index,
        'TYPE: !!!! : ',
        type
    );

    await processAutomaticHallandaleScript(
        body_json,
        orderDataObject.original_order_id ?? orderDataObject.id,
        orderDataObject.assigned_provider,
        orderDataObject.order_status,
        type,
        ScriptSource.AnnualGLP1SecondShipment,
        recordData.subscription_id,
        orderDataObject.renewal_order_id,
        new_variant_index
    );

    // once that succeeds, we will handle this by updating the database to consider this handled and resolved.
    await updateAnnualGLP1SecondShipmentSent(recordData.id, body_json);

    console.log(
        'TESTING ANNUAL ORDERS CHECK CODE X: updating second shipment set.',
        new_variant_index
    );

    return NextResponse.json({ message: 'Success' }, { status: 200 });
}
