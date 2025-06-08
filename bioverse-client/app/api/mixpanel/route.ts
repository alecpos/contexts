'use server';
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createSupabaseServerClient } from '@/app/utils/clients/supabaseServerClient';
import mixpanel from '@/app/services/mixpanel/mixpanel';
import {
    ACCOUNT_CREATED,
    ORDER_RECEIVED,
} from '@/app/services/customerio/event_names';
import {
    BROWSER_BACK_PRESSED,
    CHECKOUT_REACHED,
    ID_VERIFICATION_REACHED,
    INTAKE_COMPLETED,
    LEAD_STARTED,
    PRODUCT_OVERVIEW_REACHED,
    PROFILE_INTAKE_COMPLETED,
    QUESTIONNAIRE_QUESTION_SUBMISSION,
    QUESTION_BACK_PRESSED,
    SIGNUP_VIEWED,
} from '@/app/services/mixpanel/mixpanel-constants';

// To fire mixpanel events
export async function POST(request: NextRequest) {
    const params = await request.json();
    const { event_name, user_id, payload } = params;

    const baseTrackingPayload = {
        distinct_id: user_id,
        ...(process.env.environment !== 'prod' && {
            environment: process.env.NEXT_PUBLIC_ENVIRONMENT,
        }),
    };

    try {
        switch (event_name) {
            case ACCOUNT_CREATED:
                mixpanel.people.set(user_id, {
                    $email: payload.email,
                    $created: payload.created_at,
                });
                mixpanel.track(event_name, baseTrackingPayload);
                break;
            case LEAD_STARTED:
                mixpanel.people.set(user_id, {
                    $email: payload.email,
                    $created: payload.created_at,
                });
                mixpanel.track(event_name, {
                    ...baseTrackingPayload,
                    $user_id: user_id,
                    $device_id: payload.device_id,
                });
                console.log('LEAD', {
                    ...baseTrackingPayload,
                    $user_id: user_id,
                    $device_id: payload.device_id,
                });
                break;
            case QUESTIONNAIRE_QUESTION_SUBMISSION:
                mixpanel.track(event_name, {
                    ...baseTrackingPayload,
                    ...payload,
                });
                break;
            case ID_VERIFICATION_REACHED:
                mixpanel.track(event_name, {
                    ...baseTrackingPayload,
                    ...payload,
                });
                break;
            case CHECKOUT_REACHED:
                mixpanel.track(event_name, {
                    ...baseTrackingPayload,
                    ...payload,
                });
                break;
            case ORDER_RECEIVED:
                mixpanel.track(event_name, {
                    ...baseTrackingPayload,
                    ...payload,
                });
                break;
            case QUESTION_BACK_PRESSED:
                mixpanel.track(event_name, {
                    ...baseTrackingPayload,
                    ...payload,
                });
                break;
            case BROWSER_BACK_PRESSED:
                break;
            case SIGNUP_VIEWED:
                const resp = await mixpanel.track(event_name, {
                    distinct_id: `$device:${user_id}`,
                    $device_id: user_id,
                });
                console.log('SIGNUP VIEWED');
                console.log(resp);
                break;
            case PROFILE_INTAKE_COMPLETED:
                const { first_name, last_name, city, state, sex } = payload;
                mixpanel.people.set(user_id, {
                    $first_name: first_name,
                    $last_name: last_name,
                    city,
                    state,
                    sex,
                });
                mixpanel.track(event_name, {
                    ...baseTrackingPayload,
                    product_name: payload.product_name,
                });
                break;
            case PRODUCT_OVERVIEW_REACHED:
                mixpanel.track(event_name, {
                    ...baseTrackingPayload,
                    ...payload,
                });
                break;
            case INTAKE_COMPLETED:
                mixpanel.track(event_name, {
                    ...baseTrackingPayload,
                    ...payload,
                });
                break;
            default:
                console.error(
                    'Unknown Mixpanel Event Passed',
                    event_name,
                    payload
                );
        }
        const responseData = { success: true, message: 'Operation completed' };

        // Return a NextResponse with JSON data
        return NextResponse.json(responseData);
    } catch (error) {
        console.error(
            'Failed to send mixpanel event for user and event:',
            user_id,
            event_name
        );
    }

    return NextResponse.json({
        success: false,
        message: 'Operation completed',
    });
}
