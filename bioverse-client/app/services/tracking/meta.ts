'use client';
import sha256 from 'crypto-js/sha256';
import { sendConvertEvent } from '../../utils/functions/meta-events';
import axios from 'axios';
import { mapProductToCode } from './constants';
import { trackGTMMetaLeadEvent } from './google';

declare global {
    interface Window {
        fbq?: any;
    }
}

async function getUserIpAddress() {
    try {
        const res = await axios.get('https://api.ipify.org/?format=json');
        const ip = res.data.ip;
        return ip;
    } catch (error) {
        console.log('ip address failure');
        console.log(error);
    }
}

function getBasePathURL() {
    var path = window.location.pathname;
    var parts = path.split('/');
    parts.pop(); // Remove the last part of the path
    var basePath = parts.join('/');
    return window.location.origin + basePath;
}

export const createConversionPayload = async (
    event_type: string,
    event_id: string,
    payload: any,
    values: any,
) => {
    const userIp = await getUserIpAddress();
    if (!userIp) {
        console.error('Error getting user IP');
        return;
    }
    return {
        event_name: event_type,
        event_id: event_id,
        event_time: Math.floor(Date.now() / 1000),
        action_source: 'website',
        event_source_url: getBasePathURL(),
        user_data: {
            ...(values.firstName && {
                fn: [sha256(values.firstName).toString()],
            }),
            ...(values.lastName && {
                ln: [sha256(values.lastName).toString()],
            }),
            ...(values.email && { em: [sha256(values.email).toString()] }),
            ...(values.phone_number && {
                ph: [sha256(values.phone_number).toString()],
            }),
            ...(values.country && {
                country: sha256(values.country).toString(),
            }),
            ...(values.fbp && { fbp: values.fbp }),
            ...(values.fbc && { fbc: values.fbc }),
            ...(values.zp && { zip: sha256(values.zip).toString() }),
            ...(values.city && { ct: sha256(values.city).toString() }),
            ...(values.state && { st: sha256(values.state).toString() }),
            client_user_agent: navigator.userAgent,
            client_ip_address: userIp,
        },
    };
};

/* Purchase Event */

// Purchase Master Function

export const trackMetaPurchase = async (payload: any, values: any = {}) => {
    trackMetaGlobalPurchaseConversion(payload, values);
    trackMetaProductPurchaseConversion(payload, values);
};

export const trackMetaGlobalPurchaseConversion = async (
    payload: any,
    values: any = {},
) => {
    const event_id = crypto.randomUUID();
    const event_name = 'Purchase';

    trackPixelPurchase(event_id, event_name, payload);

    const conversionPayload = await createConversionPayload(
        event_name,
        event_id,
        payload,
        values,
    );
    sendConvertEvent(event_name, event_id, payload, values, conversionPayload);
};

export const trackMetaProductPurchaseConversion = async (
    payload: any,
    values: any = {},
) => {
    const event_id = crypto.randomUUID();
    const mappedName = mapProductToCode(payload.product_href);
    const event_name = `${mappedName}_${payload.subscriptionType}`;

    trackPixelPurchase(event_id, event_name, payload);

    const conversionPayload = await createConversionPayload(
        event_name,
        event_id,
        payload,
        values,
    );
    sendConvertEvent(event_name, event_id, payload, values, conversionPayload);
};

// Meta Pixel Purchase Event
const trackPixelPurchase = async (
    event_id: string,
    event_name: string,
    payload: any,
) => {
    if (window.fbq) {
        window.fbq('trackCustom', event_name, payload, { eventID: event_id });
    }
};

/* Lead Event */

export const trackMetaLead = async (payload: any, values: any = {}) => {
    const event_id = crypto.randomUUID();

    // trackPixelLead(event_id, payload);
    trackGTMMetaLeadEvent(event_id, values);

    const conversionPayload = await createConversionPayload(
        'Lead',
        event_id,
        payload,
        values,
    );

    sendConvertEvent('Lead', event_id, payload, values, conversionPayload);
};

const trackPixelLead = async (event_id: string, payload: any) => {
    if (window.fbq) {
        window.fbq('track', 'Lead', payload, {
            eventID: event_id,
            event_source_url: getBasePathURL(),
        });
    }
};
