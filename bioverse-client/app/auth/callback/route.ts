'use server';
import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/app/utils/clients/supabaseServerClient';
import { ACCOUNT_CREATED } from '@/app/services/customerio/event_names';
import { addCustomerSupportToPatientOnSignup } from '@/app/utils/database/controller/patient_providers/patient-providers';
import { LEAD_STARTED } from '@/app/services/mixpanel/mixpanel-constants';
import {
    identifyUser,
    triggerEvent,
} from '@/app/services/customerio/customerioApiFactory';
import { checkMixpanelEventFired } from '@/app/utils/database/controller/mixpanel/mixpanel';
import { aliasRudderstackEvent } from '@/app/utils/functions/rudderstack/rudderstack-utils';
import { insertNewProfileAdsTracking } from '@/app/(testing_and_development)/olivier-dev/utils';

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');

    // if "next" is in param, use it as the redirect URL
    const next = searchParams.get('next') ?? '/';
    const anonId = searchParams.get('anonId') ?? '';
    const productHref = searchParams.get('productHref') ?? '';
    const fbclid = searchParams.get('fbclid') ?? '';
    const gclid = searchParams.get('gclid') ?? '';
    const leadEventId = searchParams.get('leadEventId') ?? '';

    if (code) {
        const supabase = createSupabaseServerClient();

        const { error } = await supabase.auth.exchangeCodeForSession(code);

        const session = await supabase.auth.getSession();

        const id = session.data.session?.user.id;
        const email = session.data.session?.user.email;

        const createdAt = new Date(
            session.data.session?.user?.created_at || '',
        );
        const lastSignInAt = new Date(
            session.data.session?.user?.last_sign_in_at || '',
        );

        const isNewUser =
            lastSignInAt.getTime() - createdAt.getTime() <= 2 * 60 * 1000; // 5 minutes in milliseconds

        if (id) {
            if (isNewUser) {
                addCustomerSupportToPatientOnSignup(id);
                await identifyUser(id, {
                    created_at: createdAt,
                    email,
                    anonymousId: anonId,
                });
                await triggerEvent(id, ACCOUNT_CREATED, {
                    context: {
                        event_id: leadEventId,
                    },
                });

                if (gclid) {
                    await insertNewProfileAdsTracking(id, gclid, 'google');
                }

                if (fbclid) {
                    await insertNewProfileAdsTracking(id, fbclid, 'meta');
                }
            }
        }
        const newUserParam = isNewUser
            ? next.includes('intake')
                ? '&nu=23b'
                : '?nu=23b'
            : '';
        const decoded = decodeURIComponent(next);
        console.log(decoded);
        if (!error) {
            // return NextResponse.redirect(`${origin}${next}`);

            if (!next || next === 'undefined') {
                return NextResponse.redirect(
                    `${origin}${isNewUser ? newUserParam : ''}`,
                );
            }

            return NextResponse.redirect(
                `${origin}${decoded}${isNewUser ? newUserParam : ''}`,
            );
        }
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
