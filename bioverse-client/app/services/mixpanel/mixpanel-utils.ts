'use server';

import { createSupabaseServiceClient } from '@/app/utils/clients/supabaseServerClient';
import { getURL } from '@/app/utils/functions/utils';
import axios from 'axios';

export const sendMixpanelRequest = async (payload: any) => {
    return;
    try {
        const url = await getURL();
        const response = await fetch(`${url}/api/mixpanel`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });
    } catch (error) {
        console.error('Error sending Mixpanel API request');
        console.log(error);
    }
};

export async function auditFailedMixpanelEvent(user_id: string, payload: any) {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('mixpanel_failed_events')
        .insert({ user_id, payload });

    if (error) {
        console.error('Error auditing failed mixpanel event', user_id, payload);
        return;
    }

    return;
}

export async function verifyFailedMixpanelEvent(id: number) {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('mixpanel_failed_events')
        .update({ verified: true })
        .eq('id', id);

    if (error) {
        console.error('Error verifying mixpanel event', id);
    }
    return;
}

export async function retryVerifyMixpanelEvent(id: number, payload: any) {
    try {
        const response = await fetch(
            'https://api.mixpanel.com/track?verbose=1',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify([payload]),
            },
        );

        const res = await response.json();

        if (res.status === 1) {
            await verifyFailedMixpanelEvent(id);
            return;
        } else {
            const user_id = payload.properties.distinct_id;
            if (user_id) {
                console.error('Could not reverify mixpanel event', res.error, {
                    ...payload,
                });
            }
        }
    } catch (error) {
        console.error('Error sending Mixpanel API request', error, {
            payload,
        });
    }
    return;
}

export async function verifyMixpanelEvent(payload: any) {
    payload.properties.token = process.env.MIXPANEL_PROD_PROJECT_TOKEN;

    try {
        const response = await fetch(
            'https://api.mixpanel.com/track?verbose=1',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify([payload]),
            },
        );

        const res = await response.json();

        if (res.status === 1) {
            return;
        } else {
            const user_id = payload.properties.distinct_id;
            if (user_id) {
                console.error('Error sending Mixpanel API request', res.error, {
                    ...payload,
                });
                await auditFailedMixpanelEvent(user_id, payload);
            }
        }
    } catch (error) {
        console.error('Error sending Mixpanel API request', error, {
            payload,
        });
    }
}

export async function trackMixpanelEvent(event_name: string, payload: any) {
    // payload.properties.token = process.env.MIXPANEL_PROD_PROJECT_TOKEN;
    return;
    try {
        console.log('MIXPANEL PAYLOAD', payload);
        const response = await fetch(
            'https://api.mixpanel.com/track?verbose=1',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify([payload]),
            },
        );

        const res = await response.json();

        if (res.status === 1) {
            return;
        } else {
            const user_id = payload.properties.distinct_id;
            if (user_id) {
                console.error('Error sending Mixpanel API request', res.error, {
                    event_name,
                    ...payload,
                });
                await auditFailedMixpanelEvent(user_id, payload);
            }
        }
    } catch (error) {
        console.error('Error sending Mixpanel API request', error, {
            event_name,
            ...payload,
        });
        const user_id = payload.properties.distinct_id;
        if (user_id) {
            await auditFailedMixpanelEvent(user_id, payload);
        }
    }
}

// creates the identity
export async function createMixpanelIdentity(payload: any) {
    payload.properties.token = process.env.MIXPANEL_PROD_PROJECT_TOKEN;

    try {
        const response = await fetch(
            `https://api.mixpanel.com/track#create-identity`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: new URLSearchParams({ data: JSON.stringify(payload) }),
            },
        );
    } catch (error) {
        console.error('Error creating Mixpanel Identity API request', error, {
            ...payload,
        });
    }
}

export async function createAlias(payload: any) {
    payload.properties.token = process.env.MIXPANEL_PROD_PROJECT_TOKEN;

    try {
        const response = await fetch(
            `https://api.mixpanel.com/track#identity-create-alias`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: new URLSearchParams({ data: JSON.stringify(payload) }),
            },
        );
    } catch (error) {
        console.error('Error creating Mixpanel Identity API request', error, {
            ...payload,
        });
    }
}

// Payload:{$token: 'YOUR_PROJECT_TOKEN',$distinct_id: '13793',$set: {key:value} }
export async function identitySet(payload: any) {
    payload.$token = process.env.MIXPANEL_PROD_PROJECT_TOKEN;

    try {
        const response = await fetch(
            'https://api.mixpanel.com/engage#profile-set',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify([payload]),
            },
        );
    } catch (error) {
        console.error('Error sending Mixpanel API request', error, {
            ...payload,
        });
    }
}
