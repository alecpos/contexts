'use server';

import {
    updateLastRenewalDate,
    updateRenewalCount,
    updateSubscriptionLastUsedJSON,
} from '@/app/utils/database/controller/prescription_subscriptions/prescription_subscriptions';
import { getPatientAllergyAndMedicationData } from '../../../utils/database/controller/clinical_notes/clinical-notes';
import { SaveJsonUsedToFailureTable } from '../../../utils/database/controller/pharmacy-order-failures/pharmacy-order-failures';
import { insertPharmacyOrderAudit } from '../../../utils/database/controller/pharmacy_order_audit/pharmacy_order_audit';
import { getCustomerDemographicInformationById } from '../../../utils/database/controller/profiles/profiles';
import { createSupabaseServiceClient } from '@/app/utils/clients/supabaseServerClient';
import createNewRenewalOrder from '@/app/utils/database/controller/renewal_orders/renewal_orders';
import { RenewalOrder } from '@/app/types/renewal-orders/renewal-orders-types';
import { saveScriptForFutureUse } from '@/app/utils/database/controller/prescription_script_audit/prescription_script_audit';
import { retrieveAllergyAndMedicationData } from '@/app/utils/database/controller/clinical_notes/clinical_notes_v2';
import { PrescriptionSubscription } from '@/app/components/patient-portal/subscriptions/types/subscription-types';
import { ScriptSource } from '@/app/types/orders/order-types';

export async function createAndSendCurexaOrder(
    prescriptionData: DoseSpotPrescriptionItemObject,
    order: {
        id: string;
        assigned_provider: string;
        customer_uid: string;
        address_line1: string;
        address_line2: string;
        state: string;
        zip: string;
        city: string;
        subscription_type: string;
    }
) {
    // Encode the username and password for Basic Auth
    const credentials = btoa(
        `${process.env.CUREXA_USERNAME!}:${process.env.CUREXA_PASSWORD!}`
    );

    // Set up the headers for the request
    const headers = new Headers({
        'Content-Type': 'application/json',
        Authorization: `Basic ${credentials}`,
    });

    const { data: patientData, error: demographicDataFetchError } =
        await getCustomerDemographicInformationById(order.customer_uid);

    if (demographicDataFetchError || patientData === null) {
        console.log('send-request failure.', demographicDataFetchError);
        SaveJsonUsedToFailureTable(
            null,
            order.id,
            order.assigned_provider,
            'Curexa error in fetching patient data.',
            demographicDataFetchError,
            'Curexa',
            ScriptSource.AutomaticInvoicePaid
        );
        return;
    }

    /**
     * At the moment this logic will only account for Dr. E and Meylin
     */
    //TODO: FIX LATER: Provider logic - if we add more providers this needs to be fixed.
    const provider_uuid = order.assigned_provider;

    const order_address_constructed: ShippingInformation = {
        address_line1: order.address_line1,
        address_line2: order.address_line2,
        city: order.city,
        state: order.state,
        zip: order.zip,
    };

    const curexaPayloadData = await convertDoseSpotPrescriptionToCurexaPayload(
        prescriptionData,
        patientData,
        order.id,
        order_address_constructed,
        order.subscription_type
    );

    await saveScriptForFutureUse(
        curexaPayloadData,
        order.id,
        'curexa',
        ScriptSource.CurexaActions
    );

    // Convert the prescriptionData object to JSON
    const payload = JSON.stringify(curexaPayloadData);

    // Make the POST request to the Curexa API
    const response = await fetch(process.env.CUREXA_ORDER_URL!, {
        method: 'POST',
        headers: headers,
        body: payload,
    });

    // Check if the request was successful
    if (!response.ok) {
        SaveJsonUsedToFailureTable(
            payload,
            order.id,
            order.assigned_provider,
            'Curexa: Error in POST Method while sending order.',
            response,
            'Curexa',
            ScriptSource.AutomaticInvoicePaid
        );

        throw new Error(`Curexa API HTTP error! status: ${response.status}`);
    }

    // Parse the response as JSON
    const data = await response.json();

    await updateSubscriptionLastUsedJSON(order.id, 'curexa', curexaPayloadData);

    await insertPharmacyOrderAudit(
        JSON.stringify(payload),
        'Curexa',
        order.id,
        order.assigned_provider,
        ScriptSource.AutomaticInvoicePaid,
        data
    );

    // Return the parsed data
    return data;
}

export async function sendRenewalCurexaOrder(
    subscription_data: PrescriptionSubscription,
    renewalOrder: RenewalOrder
) {
    //Establish suffix to append to order # to generate new order ID
    const suffix_number = subscription_data.renewal_count + 1;

    //service client bypasses RLS
    const supabase = createSupabaseServiceClient();

    //obtain last used script from subscription record
    const last_used_script: CurexaOrder = subscription_data.last_used_script;

    //fetch information regarding the original order
    const { data: order_data, error } = await supabase
        .from('orders')
        .select(
            'customer_uid, subscription_type, product_href, assigned_pharmacy, address_line1, address_line2, state, zip, city'
        )
        .eq('id', subscription_data.order_id)
        .single();

    if (error) {
        console.log('Curexa stripe webhook customer and got error: ', error);
        return;
    }

    //obtain most recent customer shipping information. Keeping this in for precaution
    const { data: customer_shipping_data, error: shipping_error } =
        await supabase
            .from('profiles')
            .select('address_line1, address_line2, state, city, zip')
            .eq('id', order_data.customer_uid)
            .single();

    //catch error
    if (shipping_error || !customer_shipping_data) {
        console.log(
            'Curexa stripe webhook customer and got error: ',
            shipping_error
        );
        return;
    }

    const { data: allergyAndMedData, error: allergyMedicationError } =
        await getPatientAllergyAndMedicationData(order_data.customer_uid);

    if (allergyMedicationError) {
        console.log(
            'Curexa stripe webhook customer allergy and medication error: ',
            allergyMedicationError
        );
        return;
    }

    //debugging temporarily while we need to stabilize this
    console.log(
        'curexa stripe webhook customer data: ',
        customer_shipping_data,
        'last used script: ',
        last_used_script
    ); //TODO delete this

    // Prepare to format the last used script to the new information
    const new_script: CurexaOrder = {
        ...last_used_script,
        order_id: subscription_data.order_id + '-' + suffix_number, // Modify the order_id field
        address_to_street1:
            order_data.address_line1 || customer_shipping_data!.address_line1,
        address_to_street2: order_data.address_line2
            ? order_data.address_line2
            : customer_shipping_data.address_line2
            ? customer_shipping_data!.address_line2 ?? ''
            : '',
        address_to_city: order_data.city || customer_shipping_data!.city,
        address_to_state: order_data.state || customer_shipping_data!.state,
        address_to_zip: order_data.zip || customer_shipping_data!.zip,
        patient_known_allergies: allergyAndMedData
            ? allergyAndMedData.allergies
            : 'none',
        patient_other_medications: allergyAndMedData
            ? allergyAndMedData.medications
            : 'none',
    };

    //TODO update allergy and medication information here as appropriate.
    // Add the is_refill field to each item in the rx_items array
    if (new_script.rx_items) {
        new_script.rx_items = new_script.rx_items.map((item) => ({
            ...item,
            is_refill: 'true', // Add the is_refill field
        }));
    }

    //TODO delete later, was used for debugging curexa script renewal
    console.log('new curexa script created: ', new_script);

    // Convert the prescriptionData object to JSON
    const payload = JSON.stringify(new_script);

    // Encode the username and password for Basic Auth
    const credentials = btoa(
        `${process.env.CUREXA_USERNAME!}:${process.env.CUREXA_PASSWORD!}`
    );

    // Set up the headers for the request
    const headers = new Headers({
        'Content-Type': 'application/json',
        Authorization: `Basic ${credentials}`,
    });

    // Make the POST request to the Curexa API
    const response = await fetch(process.env.CUREXA_ORDER_URL!, {
        method: 'POST',
        headers: headers,
        body: payload,
    });

    // Check if the request was successful
    if (!response.ok) {
        SaveJsonUsedToFailureTable(
            payload,
            renewalOrder.renewal_order_id,
            renewalOrder.assigned_provider,
            'Curexa: Error in POST Method while sending order.',
            response,
            'Curexa',
            ScriptSource.AutomaticInvoicePaid
        );

        throw new Error(`Curexa API HTTP error! status: ${response.status}`);
    }

    try {
        // Parse the response as JSON
        const data = await response.json();

        insertPharmacyOrderAudit(
            new_script,
            'Curexa',
            renewalOrder.renewal_order_id,
            renewalOrder.assigned_provider,
            ScriptSource.AutomaticInvoicePaid,
            data
        );

        updateSubscriptionLastUsedJSON(
            String(subscription_data.id),
            'curexa',
            new_script
        );

        //check for a failed order, but sucessfull communication
        if (!data || data.status !== 'success') {
            console.log('Curexa renewal failure - no result.');
            SaveJsonUsedToFailureTable(
                new_script,
                renewalOrder.renewal_order_id,
                renewalOrder.assigned_provider,
                'Error occured in reading response.json for Curexa',
                JSON.stringify(response),
                'Curexa',
                ScriptSource.AutomaticInvoicePaid
            );
            return { result: 'failure', reason: 'Curexa-error-reading-body' };
        }

        //Create and capture the renewal order and populate it into the renewal table.
        await createNewRenewalOrder(
            `${subscription_data.order_id}-${suffix_number}`,
            order_data,
            subscription_data,
            new_script,
            null,
            {
                city: order_data.city || customer_shipping_data!.city,
                zip: order_data.zip || customer_shipping_data!.zip,
                state: order_data.state || customer_shipping_data!.state,
                address_line1:
                    order_data.address_line1 ||
                    customer_shipping_data!.address_line1,
                address_line2: order_data.address_line2
                    ? order_data.address_line2
                    : customer_shipping_data.address_line1
                    ? customer_shipping_data!.address_line2 ?? ''
                    : '',
            }
        );

        //increase the renewal count in the subscription
        await updateRenewalCount(String(subscription_data.id), suffix_number);
        await updateLastRenewalDate(String(subscription_data.id));
    } catch (error: any) {
        SaveJsonUsedToFailureTable(
            new_script,
            subscription_data.order_id + '-' + suffix_number,
            subscription_data.provider_id,
            'Curexa: Error in POST Method while sending renewal order.',
            response,
            'curexa',
            ScriptSource.AutomaticInvoicePaid
        );
        return { result: 'failure', reason: 'curexa-try-catch-error' };
    }
}

const getNumMonths = (subscription_type: string) => {
    switch (subscription_type) {
        case 'bimonthly':
            return 2;
        case 'quarterly':
            return 3;
        case 'pentamonthly':
            return 5;
        case 'one-time':
        case 'monthly':

        default:
            return 1;
    }
};

async function convertDoseSpotPrescriptionToCurexaPayload(
    prescriptionData: DoseSpotPrescriptionItemObject,
    patientData: PatientData,
    orderId: string,
    orderAddress: ShippingInformation,
    subscription_type: string
) {
    const convertDOB = (dob: string) => {
        return dob.replace(/-/g, '');
    };

    const { allergy, medication } = await retrieveAllergyAndMedicationData(
        patientData.id
    );

    const months = getNumMonths(subscription_type);

    let order: CurexaOrder = {
        order_id: orderId,
        patient_id: patientData.email,
        patient_first_name: patientData.first_name,
        patient_last_name: patientData.last_name,
        patient_dob: convertDOB(patientData.date_of_birth),
        carrier: 'USPS',
        patient_gender: patientData.sex_at_birth.toLowerCase(),
        address_to_name: patientData.first_name + ' ' + patientData.last_name,
        address_to_street1:
            orderAddress.address_line1 ?? patientData.address_line1,
        address_to_street2:
            orderAddress.address_line2 ?? patientData.address_line2 ?? '',
        address_to_city: orderAddress.city ?? patientData.city,
        address_to_state: orderAddress.state ?? patientData.state,
        address_to_zip: orderAddress.zip ?? patientData.zip,
        address_to_country: 'US',
        address_to_phone: patientData.phone_number,
        patient_known_allergies: allergy ?? 'NKDA',
        patient_other_medications:
            medication === 'Issue with Patient Answer - Please Ask Patient'
                ? 'No medications'
                : medication ?? 'No medications',
        rx_items: [
            {
                medication_name: prescriptionData.DisplayName, // Required
                quantity_dispensed: Number(prescriptionData.Quantity), // Required
                days_supply: prescriptionData.DaysSupply, // Required
                prescribing_doctor: 'Dr. Bobby Desai',
                medication_sig: prescriptionData.Directions, // Required
                non_child_resistant_acknowledgment: 'true', // Required
            },
        ],
    };

    return order;
}

interface PatientData {
    id: any;
    first_name: any;
    last_name: any;
    date_of_birth: any;
    sex_at_birth: any;
    address_line1: any;
    address_line2: any;
    city: any;
    state: any;
    zip: any;
    phone_number: any;
    email: any;
}

export async function cancelCurexaOrder(orderId: string) {
    // Encode the username and password for Basic Auth
    const credentials = btoa(
        `${process.env.CUREXA_USERNAME!}:${process.env.CUREXA_PASSWORD!}`
    );

    // Set up the headers for the request
    const headers = new Headers({
        'Content-Type': 'application/json',
        Authorization: `Basic ${credentials}`,
    });

    const payload = JSON.stringify({ order_id: orderId });

    const response = await fetch(process.env.CUREXA_CUREXA_CANCEL_ORDER_URL!, {
        method: 'POST',
        headers: headers,
        body: payload,
    });
}

export async function sendManualCurexaScript(payload: any) {
    // Encode the username and password for Basic Auth
    const credentials = btoa(
        `${process.env.CUREXA_USERNAME!}:${process.env.CUREXA_PASSWORD!}`
    );

    // Set up the headers for the request
    const headers = new Headers({
        'Content-Type': 'application/json',
        Authorization: `Basic ${credentials}`,
    });

    const payloadstring = JSON.stringify(payload);

    // Make the POST request to the Curexa API
    const response = await fetch(process.env.CUREXA_ORDER_URL!, {
        method: 'POST',
        headers: headers,
        body: payloadstring,
    });

    // Check if the request was successful
    if (!response.ok) {
        console.log(
            'there was an issue in your manual script.',
            response.text()
        );

        throw new Error(`Curexa API HTTP error! status: ${response.status}`);
    }

    // Parse the response as JSON
    const data = await response.json();

    console.log('response', data);

    insertPharmacyOrderAudit(
        JSON.stringify(payload),
        'Curexa',
        'manual',
        '24138d35-e26f-4113-bcd9-7f275c4f9a47',
        ScriptSource.AutomaticInvoicePaid,
        data
    );

    // Return the parsed data
    return data;
}
