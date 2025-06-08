import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

export async function POST(req: NextRequest) {
    const data = await req.json();

    const customer = await stripe.customers.retrieve(data.customerId);

    return NextResponse.json(customer);
}
