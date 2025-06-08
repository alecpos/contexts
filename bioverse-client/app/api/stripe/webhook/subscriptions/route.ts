import { createSupabaseServiceClient } from '@/app/utils/clients/supabaseServerClient';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const endpointSecret = process.env.STRIPE_SUBSCRIPTIONS_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
    const sig = req.headers.get('stripe-signature');

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            await req.text(),
            sig!,
            endpointSecret,
        );
    } catch (err: any) {
        console.error(err);
        return new NextResponse(`Webhook Error: ${err.message}`, {
            status: 400,
        });
    }

    const supabase = createSupabaseServiceClient();

    try {
        switch (event.type) {
            case 'customer.subscription.deleted':
                // const customerSubscriptionDeleted = event.data.object;
                // // Then define and call a function to handle the event customer.subscription.deleted

                // const { data, error } = await supabase
                //     .from('prescription_subscriptions')
                //     .update({ status: 'canceled' })
                //     .eq(
                //         'stripe_subscription_id',
                //         customerSubscriptionDeleted.id
                //     );

                // Return a 200 response to acknowledge receipt of the event
                return new NextResponse(null, { status: 200 });
            // ... handle other event types
            default:
                console.log(`Unhandled event type ${event.type}`);
                // Return a 200 response to acknowledge receipt of the event
                return new NextResponse(null, { status: 200 });
        }
    } catch (err: any) {
        console.error(err);
        return new NextResponse(`Webhook Error: ${err.message}`, {
            status: 400,
        });
    }
}
