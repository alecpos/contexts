'use server';
import {
    incrementSinceLastCheckup,
    updateRenewalCount,
    updateSubscriptionLastUsedJSON,
} from '@/app/utils/database/controller/prescription_subscriptions/prescription_subscriptions';
import { SaveJsonUsedToFailureTable } from '../../../utils/database/controller/pharmacy-order-failures/pharmacy-order-failures';
import { insertPharmacyOrderAudit } from '../../../utils/database/controller/pharmacy_order_audit/pharmacy_order_audit';
import { getEmpowerTokenAsync } from './token';
import { createSupabaseServiceClient } from '@/app/utils/clients/supabaseServerClient';
import createNewRenewalOrder, {
    updateRenewalOrderFromRenewalOrderId,
} from '@/app/utils/database/controller/renewal_orders/renewal_orders';
import { OrderType, ScriptSource } from '@/app/types/orders/order-types';
import { Status } from '@/app/types/global/global-enumerators';
import { RenewalOrder } from '@/app/types/renewal-orders/renewal-orders-types';
import { PrescriptionSubscription } from '@/app/components/patient-portal/subscriptions/types/subscription-types';

// Extra safety to check addressLine2 is null if empty string
function updateAddressLine2(jsonData: any) {
    let modified = false;
    for (const rx of jsonData.newRxs) {
        if (rx.patient.address.addressLine2 === '') {
            rx.patient.address.addressLine2 = null;
            modified = true;
        }
    }
    return { jsonContent: jsonData, modified };
}

/**
 * @author Nathan Cho
 * This function is currently deprecated and does not have usage.
 * ██████╗░░█████╗░  ███╗░░██╗░█████╗░████████╗  ██╗░░░██╗░██████╗███████╗
 * ██╔══██╗██╔══██╗  ████╗░██║██╔══██╗╚══██╔══╝  ██║░░░██║██╔════╝██╔════╝
 * ██║░░██║██║░░██║  ██╔██╗██║██║░░██║░░░██║░░░  ██║░░░██║╚█████╗░█████╗░░
 * ██║░░██║██║░░██║  ██║╚████║██║░░██║░░░██║░░░  ██║░░░██║░╚═══██╗██╔══╝░░
 * ██████╔╝╚█████╔╝  ██║░╚███║╚█████╔╝░░░██║░░░  ╚██████╔╝██████╔╝███████╗
 * ╚═════╝░░╚════╝░  ╚═╝░░╚══╝░╚════╝░░░░╚═╝░░░  ░╚═════╝░╚═════╝░╚══════╝
 * 🄳🄴🄿🅁🄴🄲🄰🅃🄴🄳
 */
export async function sendEmpowerRequestV2(
    jsonPayload: any,
    orderId: string,
    providerId: string,
    orderType: OrderType,
    orderData: any
): Promise<{ result: string; reason: string | null }> {
    // const accessToken = await getEmpowerTokenAsync();
    // const url = process.env.EMPOWER_API_URL_RX!;

    // const { jsonContent, modified } = updateAddressLine2(jsonPayload);

    // const response = await fetch(url, {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         Token: accessToken.token,
    //     },
    //     body: JSON.stringify(jsonContent),
    // });

    // if (response.status !== 200) {
    //     const responseContent = await response.text();
    //     if (orderType === OrderType.Order) {
    //         SaveJsonUsedToFailureTable(
    //             jsonContent,
    //             orderId,
    //             providerId,
    //             'Error occurred in sending script.',
    //             responseContent,
    //             'Empower'
    //         );
    //     } else if (orderType === OrderType.RenewalOrder) {
    //         SaveJsonUsedToFailureTable(
    //             jsonContent,
    //             orderData.renewal_order_id,
    //             providerId,
    //             'Error occurred in sending script.',
    //             responseContent,
    //             'Empower'
    //         );
    //     }
    //     console.error(
    //         'Failed to send empower order',
    //         orderId,
    //         providerId,
    //         orderData
    //     );

    //     return { result: 'failure', reason: 'empower-script-error' };
    // }

    // const model = await response.json();

    // if (orderType === OrderType.Order) {
    //     await updateSubscriptionLastUsedJSON(orderId, 'empower', jsonContent);

    //     await insertPharmacyOrderAudit(
    //         jsonContent,
    //         'Empower',
    //         orderId,
    //         providerId,
    //         model
    //     );
    // } else if (orderType === OrderType.RenewalOrder) {
    //     await updateSubscriptionLastUsedJSON(
    //         orderData.original_order_id,
    //         'empower',
    //         jsonContent
    //     );

    //     await insertPharmacyOrderAudit(
    //         jsonContent,
    //         'Empower',
    //         orderData.renewal_order_id,
    //         providerId,
    //         model
    //     );

    //     if (modified) {
    //         console.log(
    //             'Modified address line 2 for renewal order - updating prescription_json',
    //             orderData.renewal_order_id
    //         );
    //         await updateRenewalOrderFromRenewalOrderId(
    //             orderData.renewal_order_id,
    //             { prescription_json: JSON.stringify(jsonContent) }
    //         );
    //     }
    // }

    // return { result: 'success', reason: null };

    return { result: Status.Error, reason: null };
}

export async function onlySendScriptToEmpower(
    jsonContent: any
): Promise<{ result: string; reason: string | null; json: any }> {
    // console.log(await JSON.parse(jsonContent));
    const accessToken = await getEmpowerTokenAsync();
    const url = process.env.EMPOWER_API_URL_RX!;

    console.log('testing console logs');

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Token: accessToken.token,
        },
        body: jsonContent.toString(),
    });

    if (response.status !== 200) {
        // const responseContent = await response.text();
        const responseJson = await response.text();

        console.log(responseJson);

        return {
            result: 'failure',
            reason: 'empower-script-error',
            json: responseJson,
        };
    }

    const model = await response.json();

    console.log('cons log', model);

    await updateSubscriptionLastUsedJSON(
        jsonContent.clientOrderId,
        'empower',
        jsonContent
    );

    return { result: 'success', reason: null, json: null };
}

/**
 *
 * ██████╗░░█████╗░  ███╗░░██╗░█████╗░████████╗  ██╗░░░██╗░██████╗███████╗
 * ██╔══██╗██╔══██╗  ████╗░██║██╔══██╗╚══██╔══╝  ██║░░░██║██╔════╝██╔════╝
 * ██║░░██║██║░░██║  ██╔██╗██║██║░░██║░░░██║░░░  ██║░░░██║╚█████╗░█████╗░░
 * ██║░░██║██║░░██║  ██║╚████║██║░░██║░░░██║░░░  ██║░░░██║░╚═══██╗██╔══╝░░
 * ██████╔╝╚█████╔╝  ██║░╚███║╚█████╔╝░░░██║░░░  ╚██████╔╝██████╔╝███████╗
 * ╚═════╝░░╚════╝░  ╚═╝░░╚══╝░╚════╝░░░░╚═╝░░░  ░╚═════╝░╚═════╝░╚══════╝
 * 🄳🄴🄿🅁🄴🄲🄰🅃🄴🄳
 * Function is deprecated.
 * @author Nathan Cho
 * Comments:
 */
export async function sendRenewalOrderToEmpower(
    subscription_data: PrescriptionSubscription,
    renewalOrder: RenewalOrder
) {
    //Establish suffix to append to order # to generate new order ID
    const suffix_number = subscription_data.renewal_count + 1;

    //service client bypasses RLS
    const supabase = createSupabaseServiceClient();

    //obtain last used script from subscription record
    const last_used_script: EmpowerPrescriptionOrder =
        subscription_data.last_used_script;

    //fetch information regarding the original order
    const { data: order_data, error } = await supabase
        .from('orders')
        .select(
            'customer_uid, subscription_type, product_href, assigned_pharmacy, address_line1, address_line2, state, city, zip'
        )
        .eq('id', subscription_data.order_id)
        .single();

    if (error) {
        console.log('empower stripe webhook customer and got error: ', error);
        return;
    }

    //obtain most recent customer shipping information
    const { data: customer_shipping_data, error: shipping_error } =
        await supabase
            .from('profiles')
            .select('address_line1, address_line2, state, city, zip')
            .eq('id', order_data.customer_uid)
            .single();

    //catch error
    if (shipping_error) {
        console.log(
            'empower stripe webhook customer and got error: ',
            shipping_error
        );
        return;
    }

    //debugging temporarily while we need to stabilize this
    console.log(
        'empower stripe webhook customer data: ',
        customer_shipping_data,
        'last used script: ',
        last_used_script
    ); //TODO delete this

    //prepare to format the last used script to the new information
    const new_script: EmpowerPrescriptionOrder = last_used_script;

    //create new address element
    const newAddress: EmpowerAddress = {
        addressLine1: order_data.address_line1,
        ...(order_data.address_line2
            ? { addressLine2: order_data.address_line2 }
            : {}),
        city: order_data.city,
        stateProvince: order_data.state,
        postalCode: order_data.zip,
        countryCode: 'US',
    };

    //get new date for the script to be written
    const today = new Date();
    const newWrittenDate = `${today.getFullYear()}-${String(
        today.getMonth() + 1
    ).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    //append new address and new written date to every rx item
    new_script.newRxs.forEach((rx) => {
        rx.patient.address = newAddress;

        rx.medication.writtenDate = newWrittenDate;
    });

    //append the new order ID format with suffix number
    new_script.clientOrderId = subscription_data.order_id + '-' + suffix_number;

    //debugging
    //TODO delete later
    console.log('empower new script: ', JSON.stringify(new_script));

    //get the empower token
    const accessToken = await getEmpowerTokenAsync();
    const url = process.env.EMPOWER_API_URL_RX!;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Token: accessToken.token,
        },
        body: JSON.stringify(new_script),
    });

    //wait for the success status that script was sent.
    //Checking if this event did not succeed
    if (response.status !== 200) {
        const responseContent = await response.text();
        SaveJsonUsedToFailureTable(
            new_script,
            renewalOrder.renewal_order_id,
            renewalOrder.assigned_provider,
            'Error occurred in sending script.',
            responseContent,
            'Empower',
            ScriptSource.AutomaticInvoicePaid
        );

        //failure due to request
        return { result: 'failure', reason: 'empower-script-error-non-200' };
    }

    try {
        //read the response json
        const model = await response.json();

        //audit the order sent being sent successfully
        insertPharmacyOrderAudit(
            new_script,
            'Empower',
            renewalOrder.renewal_order_id,
            renewalOrder.assigned_provider,
            ScriptSource.AutomaticInvoicePaid,
            model
        );

        //reset the newest last-used-json
        updateSubscriptionLastUsedJSON(
            String(renewalOrder.original_order_id),
            'empower',
            new_script
        );

        //check for a failed order, but sucessfull communication
        if (!model) {
            console.log('Empower renewal failure - no result.');
            const responseContent = await response.text();
            SaveJsonUsedToFailureTable(
                new_script,
                renewalOrder.renewal_order_id,
                renewalOrder.assigned_provider,
                'Error occured in reading response.json for empower',
                responseContent,
                'Empower',
                ScriptSource.AutomaticInvoicePaid
            );
            return { result: 'failure', reason: 'empower-error-reading-body' };
        }

        //Create and capture the renewal order and populate it into the renewal table.
        await createNewRenewalOrder(
            `${subscription_data.order_id}-${suffix_number}`,
            order_data,
            subscription_data,
            new_script,
            null,
            {
                city: order_data.city,
                zip: order_data.zip,
                state: order_data.state,
                address_line1: order_data.address_line1,
                address_line2: order_data.address_line2 ?? '',
            }
        );

        await incrementSinceLastCheckup(subscription_data.id);

        //increase the renewal count in the subscription
        await updateRenewalCount(String(subscription_data.id), suffix_number);
        return { result: 'success', reason: null };
    } catch (error: any) {
        SaveJsonUsedToFailureTable(
            new_script,
            subscription_data.order_id + '-' + suffix_number,
            subscription_data.provider_id,
            'Empower: Error in POST Method while sending renewal order.',
            await response.text(),
            'empower',
            ScriptSource.AutomaticInvoicePaid
        );
        return { result: 'failure', reason: 'empower-try-catch-error' };
    }
}
