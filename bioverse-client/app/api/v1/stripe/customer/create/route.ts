import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

export async function POST(req: NextRequest) {
    const data = await req.json();

    const customer = await stripe.customers.create({
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: {
            city: data.address.city,
            country: data.address.country,
            line1: data.address.line1,
            line2: data.address.line2,
            postal_code: data.address.postal_code,
            state: data.address.state,
        },
    });

    return NextResponse.json(customer);
}
