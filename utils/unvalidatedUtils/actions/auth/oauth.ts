'use client';

import { createSupabaseBrowserClient } from '../../clients/supabaseBrowserClient';

function removeUrlParam(url: string, paramToRemove: string) {
    const parsedUrl = new URL(url, window.location.origin);
    const params = parsedUrl.searchParams;

    // Remove the specified parameter
    params.delete(paramToRemove);

    // Return the cleaned-up URL
    return `${parsedUrl.pathname}?${params.toString()}`;
}

export async function googleOAuthSignIn(
    currentUrl: string,
    anonId: string,
    productHref: string,
    ad_id: string,
    ad_type: 'google' | 'meta' | 'none',
    lead_event_id: string,
) {
    const supabase = await createSupabaseBrowserClient();

    const getURL = () => {
        let url =
            process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
            process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
            'http://localhost:3000/';

        // Make sure to include https:// when not localhost.
        url = url.includes('http') ? url : `https://${url}`;
        // Make sure to including trailing /.
        url = url.charAt(url.length - 1) === '/' ? url : `${url}/`;
        return url;
    };

    let ad_string = '';

    if (ad_type === 'google') {
        ad_string = `&gclid=${ad_id}`;
    } else if (ad_type === 'meta') {
        ad_string = `&fbclid=${ad_id}`;
    }

    const updatedUrl = removeUrlParam(currentUrl, 'verifyEmail');

    const encodedURL = encodeURIComponent(updatedUrl);

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            //redirectTo: `https://app.gobioverse.com/api/callback?next=/${currentUrl}`,
            redirectTo: `${getURL()}auth/callback?next=${encodedURL}&anonId=${window.rudderanalytics.getAnonymousId()}&productHref=${productHref}${ad_string}&leadEventId=${lead_event_id}`,
            queryParams: {
                access_type: 'offline',
                prompt: 'consent',
            },
        },
    });
}

export async function facebookOAuthSignIn(
    currentUrl: string,
    anonId: string,
    productHref: string,
    ad_id: string,
    ad_type: 'google' | 'meta' | 'none',
    lead_event_id: string,
) {
    const supabase = await createSupabaseBrowserClient();

    const getURL = () => {
        let url =
            process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
            process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
            'http://localhost:3000/';

        // Make sure to include https:// when not localhost.
        url = url.includes('http') ? url : `https://${url}`;
        // Make sure to including trailing /.
        url = url.charAt(url.length - 1) === '/' ? url : `${url}/`;
        return url;
    };

    let ad_string = '';

    if (ad_type === 'google') {
        ad_string = `&gclid=${ad_id}`;
    } else if (ad_type === 'meta') {
        ad_string = `&fbclid=${ad_id}`;
    }

    const updatedUrl = removeUrlParam(currentUrl, 'verifyEmail');

    const encodedURL = encodeURIComponent(updatedUrl);

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
            //redirectTo: `https://app.gobioverse.com/api/callback?next=/${currentUrl}`,
            redirectTo: `${getURL()}auth/callback?next=${encodedURL}&anonId=${window.rudderanalytics.getAnonymousId()}&productHref=${productHref}${ad_string}&leadEventId=${lead_event_id}`,
        },
    });
}

export async function appleOauthSignIn(
    currentUrl: string,
    anonId: string,
    productHref: string,
    ad_id: string,
    ad_type: 'google' | 'meta' | 'none',
    lead_event_id: string,
) {
    const supabase = await createSupabaseBrowserClient();

    const getURL = () => {
        let url =
            process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
            process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
            'http://localhost:3000/';

        // Make sure to include https:// when not localhost.
        url = url.includes('http') ? url : `https://${url}`;
        // Make sure to including trailing /.
        url = url.charAt(url.length - 1) === '/' ? url : `${url}/`;
        return url;
    };

    let ad_string = '';

    if (ad_type === 'google') {
        ad_string = `&gclid=${ad_id}`;
    } else if (ad_type === 'meta') {
        ad_string = `&fbclid=${ad_id}`;
    }

    const updatedUrl = removeUrlParam(currentUrl, 'verifyEmail');

    const encodedURL = encodeURIComponent(updatedUrl);

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
            //redirectTo: `https://app.gobioverse.com/api/callback?next=/${currentUrl}`,
            redirectTo: `${getURL()}auth/callback?next=${encodedURL}&anonId=${window.rudderanalytics.getAnonymousId()}&productHref=${productHref}${ad_string}&leadEventId=${lead_event_id}`,
        },
    });

    if (error) {
        console.log('error in oauth apple: ', error);
    }
}
