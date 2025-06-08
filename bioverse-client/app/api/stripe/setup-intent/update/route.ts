// app/stripe-setup-intent.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

export async function POST(req: NextRequest) {
    const data = await req.json();

    try {
        const setupIntent = await stripe.setupIntents.update(
            data.setupIntentId,
            {
                customer: data.customer_id,
            }
        );

        return NextResponse.json(setupIntent);
    } catch (error) {
        return NextResponse.json({ error });
    }
}
