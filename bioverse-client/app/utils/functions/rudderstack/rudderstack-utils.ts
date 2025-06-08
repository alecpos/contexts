'use server';

import {
    ACCOUNT_CREATED,
    ORDER_RECEIVED,
} from '@/app/services/customerio/event_names';
import { PROFILE_INTAKE_COMPLETED } from '@/app/services/mixpanel/mixpanel-constants';
import {
    ProductLeads,
    ProductOrderConfirm,
    RudderstackEvent,
    RudderstackEventType,
} from '@/app/types/services/rudderstack/rudderstack-types';
import { getURL } from '@/app/utils/functions/utils';

export async function sendRudderstackEvent(
    eventType: RudderstackEventType,
    payload: any
) {
    const apiUrl = await getURL();
    // console.log('sending rudderstack event...', eventType, payload);
    const res = await fetch(`${apiUrl}/api/rudderstack`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.SUPABASE_JOBS_API_KEY}`,
        },
        body: JSON.stringify({ eventType, payload }),
    });
    return res.status;
}

export async function trackRudderstackEvent(
    userId: string,
    eventType: RudderstackEvent,
    properties: any = {}
) {
    const payload = {
        userId,
        event: eventType,
        anonymousId: properties.anonymousId,
        properties:
            typeof properties === 'string'
                ? await JSON.parse(properties)
                : properties,
    };

    const res = await sendRudderstackEvent(RudderstackEventType.Track, payload);

    switch (eventType) {
        case ORDER_RECEIVED:
            await sendRudderstackEvent(RudderstackEventType.Track, {
                ...payload,
                event: 'ncon-bioverse',
            });
            break;
        case ACCOUNT_CREATED:
            await sendRudderstackEvent(RudderstackEventType.Track, {
                ...payload,
                event: 'nsig-bioverse',
            });
            break;
        case PROFILE_INTAKE_COMPLETED:
            await sendRudderstackEvent(RudderstackEventType.Track, {
                ...payload,
                event: 'nsig-bioverse',
            });
            await sendRudderstackEvent(RudderstackEventType.Track, {
                ...payload,
                event: ACCOUNT_CREATED,
            });
            break;
    }
    return res;
}

export async function identifyRudderstackEvent(userId: string, traits: any) {
    const payload = {
        userId,
        anonymousId: traits.anonymousId,
        traits: typeof traits === 'string' ? await JSON.parse(traits) : traits,
    };

    const res = await sendRudderstackEvent(
        RudderstackEventType.Identify,
        payload
    );
    console.log('identify?', res);
    return res;
}

export async function aliasRudderstackEvent(
    newUserId: string,
    anonymousId: string
) {
    const payload = {
        userId: newUserId,
        previousId: anonymousId,
    };

    const res = await sendRudderstackEvent(RudderstackEventType.Alias, payload);
    return res;
}
