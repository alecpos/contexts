'use server';
import { auditCustomerioFailure } from '@/app/utils/database/controller/customerio_audit/audit_customerio';
import axios from 'axios';
import {
    ID_VERIFICATION_COMPLETE,
    ID_VERIFICATION_FOLLOWUP_COMPLETE,
    ORDER_RECEIVED,
    PAYMENT_FAILED,
    PAYMENT_SUCCESS,
    REQUIRES_ID_VERIFICATION,
    TREATMENT_CONFIRMED,
    WL_CHECKIN_COMPLETE,
    WL_PAID,
} from './event_names';
import { createSupabaseServiceClient } from '@/app/utils/clients/supabaseServerClient';
import { OrderType } from '@/app/types/orders/order-types';
import { isEmpty } from 'lodash';
import { updateUserOrderStatusTags } from '@/app/utils/database/controller/patient-status-tags/patient-status-tags-api';
import { StatusTag } from '@/app/types/status-tags/status-types';
import {
    identifyRudderstackEvent,
    trackRudderstackEvent,
} from '@/app/utils/functions/rudderstack/rudderstack-utils';
import { RudderstackEvent } from '@/app/types/services/rudderstack/rudderstack-types';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import { sendEventDataToBMG } from '../bmg/bmg_functions';
import { getBaseOrderById } from '@/app/utils/database/controller/orders/orders-api';

const axiosClient = axios.create({
    baseURL: 'https://track.customer.io/api/v2',
    headers: {
        Authorization: `Basic ${Buffer.from(
            `${process.env.CUSTOMERIO_SITE_ID}:${process.env.CUSTOMERIO_API_KEY}`
        ).toString('base64')}`,
        'Content-Type': 'application/json',
    },
});

/**
 * Call when updating user attributes.
 * @param user_id
 * @param attributes
 */
export async function identifyUser(
    user_id: string,
    attributes: Record<string, unknown> = {}
) {
    console.log('Identify customerio event', user_id, attributes);
    try {
        const response = await axiosClient.post('/entity', {
            type: 'person',
            identifiers: { id: user_id },
            action: 'identify',
            attributes,
        });
        await identifyRudderstackEvent(user_id, attributes);
    } catch (error) {
        console.error(
            'Failed to identify customerio user',
            error,
            user_id,
            attributes
        );
        await auditCustomerioFailure(
            user_id,
            'identify',
            attributes,
            JSON.stringify(error)
        );
    }
}

const productHrefMap: { [key: string]: string } = {
    [PRODUCT_HREF.X_CHEWS]: 'x-chews-melts',
    [PRODUCT_HREF.X_MELTS]: 'x-chews-melts',
};

export async function triggerLeadCommsEvent(
    user_id: string,
    product_href: string,
    properties: string
) {
    const propertiesObject = JSON.parse(properties);

    const mappedProductHref = productHrefMap[product_href] || product_href;

    await triggerEvent(user_id, `${mappedProductHref}-lead`, propertiesObject);
    await trackRudderstackEvent(
        user_id,
        RudderstackEvent.LEAD,
        propertiesObject
    );
}

export async function triggerOrderConfirmCommsEvent(
    user_id: string,
    product_href: string
) {
    const mappedProductHref = productHrefMap[product_href] || product_href;

    await triggerEvent(user_id, `${mappedProductHref}-order-confirm`);
}

/**
 * This is to fire the events.
 * @param user_id database uuid
 * @param name name of event
 * @param attributes attributes that are read. { key: value } would be accessed via {{event.key}} to show ${value}
 */
export async function triggerEvent(
    user_id: string,
    name: string,
    attributes: Record<string, unknown> = {}
) {
    // console.log('Recording customerio event', user_id, name, attributes);

    if (name === PAYMENT_SUCCESS) {
        await identifyUser(user_id, { in_payment_failure: false });
    }

    try {
        const requestPayload = {
            type: 'person',
            action: 'event',
            name,
            attributes,
            identifiers: { id: user_id },
        };

        const response = await axiosClient.post('/entity', requestPayload);
        await trackRudderstackEvent(
            user_id,
            name as RudderstackEvent,
            attributes
        );

        //BMG (radio marketing integration)
        if (name === ORDER_RECEIVED) {
            const orderData = await getBaseOrderById(
                Number(attributes?.order_id)
            );
            if (orderData?.metadata?.utm_source === 'bmg') {
                await sendEventDataToBMG(
                    orderData.id, // orderId: number,
                    orderData.state as string, // state: string,
                    name, // event: string,
                    (
                        attributes?.value ||
                        attributes?.estimated_total ||
                        ''
                    ).toString(), // value: string,
                    new Date().toISOString(), // sent_at: string,
                    'USD', // currency: string,
                    'bmg', // utm_source: string,
                    orderData.product_href as string, // content_name: string,
                    orderData.product_href as string, // care_selection: string,
                    orderData.metadata?.utm_campaign || '', // utm_campaign: string,
                    orderData.metadata?.utm_medium || '', // utm_medium: string,
                    orderData.metadata?.utm_content || '', // utm_content: string,
                    orderData.metadata?.utm_term || '', // utm_term: string,
                    user_id
                );
            }
        }

        return { status: response.status, data: response.data };
    } catch (error: any) {
        console.error('Failed to send customerio event', {
            error: error instanceof Error ? error.message : 'Unknown error',
            errorDetails: error,
            userId: user_id,
            eventName: name,
            attributes,
            requestPayload: {
                type: 'person',
                action: 'event',
                name,
                attributes,
                identifiers: { id: user_id },
            },
            responseData: error.response?.data,
        });
        await auditCustomerioFailure(
            user_id,
            name,
            attributes,
            JSON.stringify(error)
        );
    }
    return { status: 400, data: {} };
}

const batchAxiosClient = axios.create({
    baseURL: 'https://track.customer.io/api/v2',
    headers: {
        Authorization: `Basic ${Buffer.from(
            `${process.env.CUSTOMERIO_SITE_ID}:${process.env.CUSTOMERIO_API_KEY}`
        ).toString('base64')}`,
        'Content-Type': 'application/json',
    },
});

export async function batchTriggerEvent(data: any) {
    console.log(data);
    const response = await batchAxiosClient.post('/batch', data);

    console.log(response);
}

// To be called when user uploads new photo
export async function shouldSendIDVerification(user_id: string) {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('profiles')
        .select('license_photo_url, selfie_photo_url')
        .eq('id', user_id)
        .single();

    if (error) {
        console.error('Error retrieving id urls', user_id);
        return null;
    }

    if (!data) {
        return null;
    }

    if (data.license_photo_url && data.selfie_photo_url) {
        // exits user from campaign
        await canExitUserFromIDVerificationCampaign(user_id, false);
        return 'Can Exit User Confirmed';
    }

    await hasAlreadyStartedIDVerificationCampaign(user_id);
}

// Called when license and selfie photo are both not uploaded
async function hasAlreadyStartedIDVerificationCampaign(user_id: string) {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('customerio_id_verification')
        .select('*')
        .eq('patient_id', user_id)
        .maybeSingle();

    if (error) {
        console.error(
            'Error in hasAlreadyStartedIDVerificationCampaign',
            user_id
        );
        return;
    }

    if (isEmpty(data) || !data) {
        // Trigger event for user
        const resp = await triggerEvent(user_id, REQUIRES_ID_VERIFICATION, {});

        if (resp.status === 200) {
            await supabase
                .from('customerio_id_verification')
                .insert({ patient_id: user_id });
        }
    } else {
        console.log('not sending event');
    }
}

// To be called after
export async function canExitUserFromIDVerificationCampaign(
    user_id: string,
    override: boolean = false
) {
    const supabase = createSupabaseServiceClient();

    const triggerIDVerificationComplete = async () => {
        await triggerEvent(user_id, ID_VERIFICATION_COMPLETE, {});
        await triggerEvent(user_id, ID_VERIFICATION_FOLLOWUP_COMPLETE, {});
    };

    await triggerIDVerificationComplete();
    await updateUserOrderStatusTags(
        user_id,
        [StatusTag.IDVerificationCustomerIOFollowUp, StatusTag.IDDocs],
        StatusTag.Coordinator,
        'ID and Selfie have been submitted'
    );
}

const JOURNEY_EXIT_NAMES = [
    WL_PAID,
    PAYMENT_SUCCESS,
    WL_CHECKIN_COMPLETE,
    TREATMENT_CONFIRMED,
];

// TODO: Make it so that you only remove the customer from the product specific campagins (ie. a semaglutide payment failed campaign)
export async function removeCustomerFromAllJourneys(customer_id: string) {
    const journeyExitEvents = JOURNEY_EXIT_NAMES.map(
        (event_name: string, index: number) => {
            return {
                type: 'person',
                action: 'event',
                identifiers: { id: customer_id },
                attributes: {
                    exitJourney: true,
                },
                name: event_name,
            };
        }
    );

    await batchTriggerEvent({ batch: journeyExitEvents });
}

export async function fixPhoneNumber() {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('profiles')
        .select('id, phone_number')
        .not('phone_number', 'is', null)
        .gte('created_at', '2024-03-29');

    if (error) {
        console.error('Error fetching data:', error);
        return;
    }

    const events = data?.map((user) => {
        return {
            type: 'person',
            action: 'identify',
            identifiers: { id: user.id },
            attributes: { phone_number: formatE164(user.phone_number) },
        };
    });

    const partitionedEvents = partitionArray(events, 1000);

    for (const batch of partitionedEvents) {
        await batchTriggerEvent({ batch });
    }
}

function partitionArray(array: any, size: number) {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
    }
    return result;
}

export async function sendPaymentSuccess() {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase.rpc('get_ids');

    if (!data) {
        console.error('error data');
        return;
    }
    const res = data.map((user: any, index: number) => {
        return {
            type: 'person',
            action: 'event',
            identifiers: { id: user.id },
            attributes: {},
            name: PAYMENT_SUCCESS,
        };
    });

    await batchTriggerEvent({ batch: res });
    console.log('success');
}

export async function sendPaymentFailToListofEmails() {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase.rpc('get_ids');
    console.log(data);

    if (!data) {
        console.error('error data');
        return;
    }

    const promiseArray = data.map(async (user: any, index: number) => {
        const { data: newdata, error } = await supabase
            .from('renewal_orders')
            .select('*')
            .eq('customer_uuid', user.id)
            .order('id', { ascending: false })
            .limit(1)
            .maybeSingle();

        if (!newdata || !newdata.renewal_order_id || !user.id) {
            return null;
        }
        return {
            type: 'person',
            action: 'event',
            identifiers: { id: user.id },
            attributes: {
                order_id: newdata.renewal_order_id,
                order_type: OrderType.RenewalOrder,
            },
            name: PAYMENT_FAILED,
        };
    });

    // Wait for all promises in the array to resolve
    const res = await Promise.all(promiseArray);

    // Filter out null values since some might have been returned due to missing data
    const filteredRes = res.filter((item) => item !== null);

    await batchTriggerEvent({ batch: filteredRes });
    console.log('success');
}

export async function sendPaymentFailureToTrackers() {
    const supabase = createSupabaseServiceClient();

    try {
        const { data, error } = await supabase
            .from('payment_failure_tracker')
            .select('order_id, patient_id')
            .eq('status', 'retrying');

        if (error) throw error; // Throw the error to handle it outside or log it

        if (!data) {
            console.error('No data found');
            return;
        }

        const promiseArray = data.map((item: any, index: number) => {
            return {
                type: 'person',
                action: 'event',
                identifiers: { id: item.patient_id },
                attributes: {
                    order_id: item.order_id,
                    order_type: OrderType.Order,
                },
                name: PAYMENT_FAILED,
            };
        });

        await batchTriggerEvent({ batch: promiseArray });
    } catch (err) {
        console.error('An error occurred:', err);
    }
}

export async function resendTirzepatideCampaign() {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('orders')
        .select('order_status, created_at, id, customer_uid')
        .eq('order_status', 'Incomplete')
        .eq('product_href', 'tirzepatide')
        .gte('created_at', '2024-06-06');

    if (!data) {
        return;
    }

    const promiseArray = data.map((item: any, index: number) => {
        return {
            type: 'person',
            action: 'event',
            identifiers: { id: item.customer_uid },
            attributes: { is_bundle: true },
            name: 'tirzepatide-lead',
        };
    });
    await batchTriggerEvent({ batch: promiseArray });
    console.log('success');
}

function formatE164(phoneNumber: string) {
    // Define the country code, in this case for the United States
    const countryCode = '+1';

    // Remove all non-numeric characters from the phone number
    const cleanedNumber = phoneNumber.replace(/\D/g, '');

    // Concatenate the country code with the cleaned number
    const e164Number = countryCode + cleanedNumber;

    return e164Number;
}
