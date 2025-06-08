'use server';

import { Status } from '@/app/types/global/global-enumerators';
import { getUserProfile } from '@/app/utils/database/controller/profiles/profiles';


export const sendEventDataToBMG = async (
    orderId: number,
    state: string,
    event: string,
    value: string,
    sent_at: string,
    currency: string,
    utm_source: string,
    content_name: string,
    care_selection: string,
    utm_campaign: string,
    utm_medium: string,
    utm_content: string,
    utm_term: string,
    user_id?: string
) => {


    let area_code = "";
    if (user_id) {
        const userProfile = await getUserProfile(user_id);
        if (userProfile) {
            const phone_number = userProfile.phone_number;
            if (phone_number) {
                area_code = phone_number.substring(1, 4);
            }
        }
    }

    const event_data = {
        order_id: orderId,
        state: state,
        event: event,
        value: value,
        sent_at: sent_at,
        currency: currency,
        utm_source: utm_source,
        content_name: content_name,
        care_selection: care_selection, 
        utm_campaign: utm_campaign,
        utm_medium: utm_medium,
        utm_content: utm_content,
        utm_term: utm_term,
        area_code: area_code
    };

    // console.log('Sending BMG Event');
    // console.log('orderId:', orderId);
    // console.log('state:', state);
    // console.log('event:', event);
    // console.log('value:', value);
    // console.log('sent_at:', sent_at);
    // console.log('currency:', currency);
    // console.log('utm_source:', utm_source);
    // console.log('content_name:', content_name);
    // console.log('care_selection:', care_selection);
    // console.log('utm_campaign:', utm_campaign);
    // console.log('utm_medium:', utm_medium);
    // console.log('utm_content:', utm_content);
    // console.log('utm_term:', utm_term);
    // console.log('user_id:', user_id);
    // console.log('AAAND area_code:', area_code);

    if (process.env.NEXT_PUBLIC_ENVIRONMENT === 'dev') {
        console.error('BMG conversion tracking is disabled in dev environment');
        return Status.Failure;
    }

    const response = await fetch('https://impact.2nd.co/api/record', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.BMG_API_KEY}`,
        },
        body: JSON.stringify(event_data),
    });

    console.log('Response from sendEventDataToBMG:', response);

    if (!response.ok) {
        console.error('Failed to send event data to BMG', response);
        return Status.Error;
    }

    return Status.Success;
};