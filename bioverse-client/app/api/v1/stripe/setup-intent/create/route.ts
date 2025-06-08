// app/stripe-setup-intent.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

export async function POST(req: NextRequest) {
    try {
        const setupIntent = await stripe.setupIntents.create({
            payment_method_types: ['card'],
        });
        return NextResponse.json(setupIntent);
    } catch (error) {
        return NextResponse.json({ error });
    }
}
