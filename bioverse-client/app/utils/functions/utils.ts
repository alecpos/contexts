'use server';

import { batchTriggerEvent } from '@/app/services/customerio/customerioApiFactory';
import { createSupabaseServiceClient } from '../clients/supabaseServerClient';

export const getURL = async () => {
    let url =
        process?.env?.NEXT_PUBLIC_SITE_URL ??
        process?.env?.NEXT_PUBLIC_VERCEL_URL ??
        'http://localhost:3000';
    url = url.includes('http') ? url : `https://${url}`;
    // Remove trailing slashes using replace
    url = url.replace(/\/+$/, '');
    return url;
};

export async function getCurrentDate() {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric', // "numeric" or "2-digit"
        month: 'long', // "numeric", "2-digit", "long", "short", or "narrow"
        day: 'numeric', // "numeric" or "2-digit"
    };
    const formattedDate = date.toLocaleDateString('en-US', options);
    return formattedDate;
}

export async function doStuff() {
    const supabase = createSupabaseServiceClient();

    const date = new Date('2024-04-01');
    const { data, error } = await supabase
        .from('profiles')
        .select('id, email')
        .gte('created_at', '2024-04-01');

    const batched = data?.map((item: any) => ({
        type: 'person',
        identifiers: { id: item.id },
        action: 'identify',
        attributes: {
            email: item.email,
        },
    }));

    await batchTriggerEvent({ batch: batched });

    // await identifyUser(data?.id, { email: data?.email });
    console.log('success');
}

export async function runScript() {
    console.log(await getCurrentDate());
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('threads')
        .select('id')
        .is('patient_id', 'null');

    console.log(data?.length);
}

// export async function resumePaymentFailedCampaign() {
//     const supabase = createSupabaseServiceClient();

//     const {data, error } = await supabase.from('payment_failure_tracker').select('patient_id').eq('status', 'retrying');

//     const batched = data?.map((item: any) => ({
//         type: 'person',
//         action: 'event',
//         'payment-success',
//         attributes,
//         identifiers: { id: user_id },
//     }))

// }
