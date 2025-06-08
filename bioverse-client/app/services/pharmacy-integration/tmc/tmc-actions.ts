'use server';
import {
    createSupabaseServerComponentClient,
    createSupabaseServiceClient,
} from '@/app/utils/clients/supabaseServerClient';
import { updateExistingOrderStatusAndExternalMetadataUsingId } from '@/app/utils/database/controller/orders/orders-api';
import { SaveJsonUsedToFailureTable } from '@/app/utils/database/controller/pharmacy-order-failures/pharmacy-order-failures';
import { insertPharmacyOrderAudit } from '../../../utils/database/controller/pharmacy_order_audit/pharmacy_order_audit';
import {
    updateLastRenewalDate,
    updateRenewalCount,
    updateSubscriptionLastUsedJSON,
} from '@/app/utils/database/controller/prescription_subscriptions/prescription_subscriptions';
import createNewRenewalOrder from '@/app/utils/database/controller/renewal_orders/renewal_orders';
import { PrescriptionSubscription } from '@/app/components/patient-portal/subscriptions/types/subscription-types';
import { RenewalOrder } from '@/app/types/renewal-orders/renewal-orders-types';
import { ScriptSource } from '@/app/types/orders/order-types';

/**
 * @author Nathan Cho
 * @param jsonData - TMC json Data - preformatted
 * @param orderId - orderId to manipulate on
 */
export async function sendOrderToTailormadeHealthEMR(
    jsonData: string,
    orderId: string,
    providerId: string,
    customerId: string,
) {
    // Define the URL and headers for the request
    const url = `${process.env.TMC_URL!}/ReceiveOrder`;
    const headers = new Headers({
        'Content-Type': 'application/x-www-form-urlencoded',
    });

    // Convert the JSON data to a URL-encoded string
    const encodedData = new URLSearchParams({
        AuthorizationKey: process.env.TMC_KEY!,
        Values: jsonData,
    }).toString();

    // Send the POST request with the encoded data
    const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: encodedData,
    });

    // Check if the request was successful
    if (!response.ok) {
        console.log(
            'Error in TMC-Actions, method: SaveTMCJsonUsedToFailureTable, POST Request returned response:',
            response,
        );
        SaveJsonUsedToFailureTable(
            jsonData,
            orderId,
            providerId,
            'TMC: Error in POST Method while sending order.',
            response,
            'tmc',
            ScriptSource.Manual,
        );
    }

    // Parse the response as JSON
    const result = await response.json();

    insertPharmacyOrderAudit(
        jsonData,
        'TMC',
        orderId,
        providerId,
        ScriptSource.Manual,
        result,
    );

    if (
        result.request_status === 'success' &&
        result.order_status === 'Order Received'
    ) {
        //If it is successful we update the order to a finalized state.
        const { error } =
            await updateExistingOrderStatusAndExternalMetadataUsingId(
                Number(orderId),
                'Approved-CardDown-Finalized',
                { tmc_order_id: result.order_id },
            );
    } else {
        SaveJsonUsedToFailureTable(
            jsonData,
            orderId,
            providerId,
            'TMC: Error in POST Method while sending order.',
            await response.json(),
            'tmc',
            ScriptSource.Manual,
        );
    }
    return;
}

/**
 *
 * Jun 25, 2024: This function has been deprecated. It is not in official use.
 * Please refer to the API route for sending TMC scripts.
 *
 *
 * @author Nathan Cho
 * @param jsonData - TMC json Data - preformatted
 * @param orderId - orderId to manipulate on
 */
export async function sendOrderToTailormadeHealthEMRV2(
    jsonData: TMCPrescriptionForm,
    orderId: string,
    providerId: string,
    customerId: string,
): Promise<{ result: 'success' | 'failure'; reason: string | null }> {
    // Define the URL and headers for the request
    const url = `${process.env.TMC_URL!}/ReceiveOrder`;
    const headers = new Headers({
        'Content-Type': 'application/x-www-form-urlencoded',
    });

    // Convert the JSON data to a URL-encoded string
    const encodedData = new URLSearchParams({
        AuthorizationKey: process.env.TMC_KEY!,
        Values: JSON.stringify(jsonData),
    }).toString();

    // Send the POST request with the encoded data
    const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: encodedData,
    });

    // Check if the request was successful
    if (!response.ok) {
        console.log(
            'Error in TMC-Actions, method: SaveTMCJsonUsedToFailureTable, POST Request returned response:',
            response,
        );
        SaveJsonUsedToFailureTable(
            jsonData,
            orderId,
            providerId,
            'TMC: Error in POST Method while sending order.',
            response,
            'tmc',
            ScriptSource.Manual,
        );
        return { result: 'failure', reason: 'tmc-post-error' };
    }

    console.log('tmc reponse for debug: ', response);

    try {
        // Parse the response as JSON
        const result = await response.json();

        insertPharmacyOrderAudit(
            JSON.stringify(jsonData),
            'TMC',
            orderId,
            providerId,
            ScriptSource.Manual,
            result,
        );
        updateSubscriptionLastUsedJSON(orderId, 'tmc', jsonData);

        if (!result) {
            console.log('??? there was no result');
            return { result: 'success', reason: 'tmc-body-error' };
        }

        if (
            result.request_status === 'success' &&
            result.order_status === 'Order Received'
        ) {
            //If it is successful we update the order to a finalized state.
            const { error } =
                await updateExistingOrderStatusAndExternalMetadataUsingId(
                    Number(orderId),
                    'Approved-CardDown-Finalized',
                    { tmc_order_id: result.order_id },
                );
            return { result: 'success', reason: 'tmc-post-error' };
        } else {
            SaveJsonUsedToFailureTable(
                jsonData,
                orderId,
                providerId,
                'TMC: Error in POST Method while sending order.',
                await response.json(),
                'tmc',
                ScriptSource.Manual,
            );
            return { result: 'failure', reason: 'tmc-script-error' };
        }
    } catch (error: any) {
        SaveJsonUsedToFailureTable(
            jsonData,
            orderId,
            providerId,
            'TMC: Error in reading body response.',
            response,
            'tmc',
            ScriptSource.Manual,
        );

        console.log(error);

        return {
            result: 'failure',
            reason: 'error message given: ' + error.message,
        };
    }
}

export async function sendRenewalOrderToTMC(
    subscription_data: PrescriptionSubscription,
    renewalOrder: RenewalOrder,
) {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    if (subscription_data.last_renewal_time > twentyFourHoursAgo) {
        console.log(
            'Cannot process renewal for subscription ' +
                subscription_data.id +
                ': Last renewal was less than 24 hours ago',
        );
        return;
    }

    //Establish suffix to append to order # to generate new order ID
    const suffix_number = subscription_data.renewal_count + 1;

    //service client bypasses RLS
    const supabase = createSupabaseServiceClient();

    //obtain last used script from subscription record
    const last_used_script: TMCPrescriptionForm =
        subscription_data.last_used_script;

    //fetch information regarding the original order
    const { data: order_data, error } = await supabase
        .from('orders')
        .select(
            'customer_uid, subscription_type, product_href, assigned_pharmacy, address_line1, address_line2, state, zip, city',
        )
        .eq('id', subscription_data.order_id)
        .single();

    if (error) {
        console.log(
            'testing tmc stripe webhook customer and got error: ',
            error,
        );
        return;
    }

    const { data: customer_shipping_data, error: shipping_error } =
        await supabase
            .from('profiles')
            .select('address_line1, address_line2, state, city, zip')
            .eq('id', order_data.customer_uid)
            .single();
    if (shipping_error) {
        console.log(
            'testing tmc stripe webhook customer and got error: ',
            shipping_error,
        );
        return;
    }

    console.log(
        'testing tmc stripe webhook customer data: ',
        customer_shipping_data,
        'last used script: ',
        last_used_script,
    ); //TODO delete this

    const newShippingAddress: TMCShippingAddress = {
        shipping_city: order_data.city,
        shipping_postal_code: order_data.zip,
        shipping_state: order_data.state,
        shipping_street: order_data.address_line1,
        shipping_address_line2: order_data.address_line2 ?? '',
        shipping_country: 'United States',
    };

    const new_script: TMCPrescriptionForm = {
        prescriptions: last_used_script.prescriptions.map((prescription) => ({
            ...prescription,
            shipping_address: newShippingAddress,
            physician_npi: '1780019117',
        })),
    };

    const url = `${process.env.TMC_URL!}/ReceiveOrder`;
    const headers = new Headers({
        'Content-Type': 'application/x-www-form-urlencoded',
    });

    // Convert the JSON data to a URL-encoded string
    const encodedData = new URLSearchParams({
        AuthorizationKey: process.env.TMC_KEY!,
        Values: JSON.stringify(new_script),
    }).toString();
    // Send the POST request with the encoded data
    const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: encodedData,
    });

    // Check if the request was successful
    if (!response.ok) {
        console.log(
            'Error in TMC-Actions, method: SaveTMCJsonUsedToFailureTable, POST Request returned response:',
            response,
        );
        SaveJsonUsedToFailureTable(
            new_script,
            renewalOrder.renewal_order_id,
            renewalOrder.assigned_provider,
            'TMC: Error in POST Method while sending renewal order.',
            response,
            'tmc',
            ScriptSource.AutomaticInvoicePaid,
        );
        console.error('TMC: Error in POST Method while sending renewal order.');
        return;
    }

    try {
        // Parse the response as JSON
        const result = await response.json();

        insertPharmacyOrderAudit(
            JSON.stringify(new_script),
            'TMC',
            renewalOrder.renewal_order_id,
            renewalOrder.assigned_provider,
            ScriptSource.AutomaticInvoicePaid,
            result,
        );
        updateSubscriptionLastUsedJSON(
            String(renewalOrder.original_order_id),
            'tmc',
            new_script,
        );

        if (!result) {
            console.log('TMC renewal failure - no result.');
            return;
        }

        if (
            result.request_status === 'success' &&
            result.order_status === 'Order Received'
        ) {
            //Commented since this only applies to normal orders.
            // const { error } =
            //     await updateExistingOrderStatusAndExternalMetadataUsingId(
            //         Number(orderId),
            //         'Approved-CardDown-Finalized',
            //         { tmc_order_id: result.order_id }
            //     );

            await updateLastRenewalDate(String(subscription_data.id));

            await createNewRenewalOrder(
                `${subscription_data.order_id}-${suffix_number}`,
                order_data,
                subscription_data,
                new_script,
                { tmc_order_id: result.order_id },
                {
                    city: order_data.city,
                    zip: order_data.zip,
                    state: order_data.state,
                    address_line1: order_data.address_line1,
                    address_line2: order_data.address_line2 ?? '',
                },
            );

            await updateRenewalCount(
                String(subscription_data.id),
                suffix_number,
            );
            return;
        } else {
            SaveJsonUsedToFailureTable(
                new_script,
                renewalOrder.renewal_order_id,
                renewalOrder.assigned_provider,
                'TMC: Error in POST Method while sending renewal order.',
                response,
                'tmc',
                ScriptSource.AutomaticInvoicePaid,
            );
            console.error(
                'TMC: Error in POST Method while sending renewal order.',
            );
            return;
        }
    } catch (error: any) {
        SaveJsonUsedToFailureTable(
            new_script,
            renewalOrder.renewal_order_id,
            renewalOrder.assigned_provider,
            'TMC: Error in POST Method while sending renewal order.',
            response,
            'tmc',
            ScriptSource.AutomaticInvoicePaid,
        );
        console.error('TMC: Error in POST Method while sending renewal order.');
        return;
    }
}

/**
 * @param orderId Order Id internal.
 */
export async function getTMCOrderInformation(orderId: string) {
    const supabase = createSupabaseServerComponentClient();

    const { data: tmcOrderMetadata, error: orderCheckError } = await supabase
        .from('orders')
        .select('external_tracking_metadata')
        .eq('id', orderId)
        .maybeSingle();

    if (orderCheckError || !tmcOrderMetadata) {
        console.log(
            'TMC Order status update error. Method: getTMCOrderInformation. Error if present: ',
            orderCheckError,
        );
        return {
            order_status: null,
            shipping_information: null,
            shipping_status: null,
            error: orderCheckError ?? null,
        };
    }

    const tmcOrderId =
        tmcOrderMetadata && tmcOrderMetadata.external_tracking_metadata
            ? tmcOrderMetadata.external_tracking_metadata.tmc_order_id ?? ''
            : '';

    // if (tmcOrderId === '') {
    //     return {
    //         order_status: null,
    //         shipping_information: null,
    //         shipping_status: null,
    //         error: orderCheckError ?? null,
    //     };
    // }

    const url = `${process.env.TMC_URL!}/RetrieveOrderStatus`;
    const headers = new Headers({
        'Content-Type': 'application/x-www-form-urlencoded',
    });

    // Convert the JSON data to a URL-encoded string
    const encodedData = new URLSearchParams({
        AuthorizationKey: process.env.TMC_KEY!,
        OrderId: tmcOrderId,
    }).toString();

    // Send the POST request with the encoded data
    const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: encodedData,
    });

    const result = await response.json();

    return {
        order_status: result.order_status,
        shipping_information: result.shipments,
        shipping_status: result.shipping_status,
        error: null,
    };
}

export async function getTMCOrderInfoDev(tmcOrderId: string) {
    const url = `${process.env.TMC_URL!}/RetrieveOrderStatus`;
    const headers = new Headers({
        'Content-Type': 'application/x-www-form-urlencoded',
    });

    // Convert the JSON data to a URL-encoded string
    const encodedData = new URLSearchParams({
        AuthorizationKey: process.env.TMC_KEY!,
        OrderId: tmcOrderId,
    }).toString();

    // Send the POST request with the encoded data
    const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: encodedData,
    });

    const result = await response.json();

    return JSON.stringify(response);
}

export async function onlySendTMCScriptToTMC(jsonData: TMCPrescriptionForm) {
    // Define the URL and headers for the request
    const url = `${process.env.TMC_URL!}/ReceiveOrder`;
    const headers = new Headers({
        'Content-Type': 'application/x-www-form-urlencoded',
    });

    // Convert the JSON data to a URL-encoded string
    const encodedData = new URLSearchParams({
        AuthorizationKey: process.env.TMC_KEY!,
        Values: JSON.stringify(jsonData),
    }).toString();

    // Send the POST request with the encoded data
    const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: encodedData,
    });

    // Check if the request was successful
    if (!response.ok) {
        return { result: 'failure', reason: 'tmc-post-error' };
    }
    console.log('tmc reponse for debug: ', response);

    try {
        // Parse the response as JSON
        const result = await response.json();
        console.log('tmc response json', result);

        if (!result) {
            console.log('??? there was no result');
            return { result: 'success', reason: 'tmc-body-error' };
        }

        if (
            result.request_status === 'success' &&
            result.order_status === 'Order Received'
        ) {
            return { result: 'success', reason: null };
        } else {
            return { result: 'failure', reason: 'tmc-script-error' };
        }
    } catch (error: any) {
        return {
            result: 'failure',
            reason: 'error message given: ' + error.message,
        };
    }
}
