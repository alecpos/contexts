'use server';

import { metadata } from '@/app/(content)/page';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { createSupabaseServiceClient } from '@/app/utils/clients/supabaseServerClient';
import Stripe from 'stripe';

export async function getPaymentIntentRefunds(payment_intent_id: string) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

    const refunds = await stripe.refunds.list({
        limit: 100,
        payment_intent: payment_intent_id,
    });

    return refunds.data;
}

/**
 *
 * @param payment_intent_id Stripe Payment Intent Id
 * @param reason A string representing the reason for the refund
 * @param amount Provide amount in a unit of cents
 */
export async function createRefundForPaymentIntent(
    payment_intent_id: string,
    amount: number,
    reason: string
) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

    const supabase = createSupabaseServiceClient();

    const user_id = (await readUserSession()).data.session?.user.id;

    const { data, error } = await supabase
        .from('stripe_audit')
        .insert({
            event_type: 'refund',
            user_id: user_id,
            enacted_object_id: payment_intent_id,
            request_data: {
                amount: amount,
                payment_intent: payment_intent_id,
            },
            metadata: {
                reason: reason,
            },
        })
        .select();

    if (error) {
        return { status: 'failure', error: error };
    }

    try {
        const newRefund = await stripe.refunds.create({
            amount: amount,
            payment_intent: payment_intent_id,
        });

        const { error: error_update } = await supabase
            .from('stripe_audit')
            .update({ response_data: newRefund })
            .eq('event_id', data[0].event_id);

        if (error_update) {
            return { status: 'failure', error: error };
        }

        return { status: 'success', error: null };
    } catch (error: any) {
        return { status: 'failure', error: error };
    }
}