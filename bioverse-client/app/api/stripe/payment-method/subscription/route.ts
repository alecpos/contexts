'use server';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();

        const stripeSubscriptionId = data.stripeSubscriptionId;
        const stripeCustomerId = data.stripeCustomerId;

        const paymentMethods = await stripe.paymentMethods.list({
            customer: stripeCustomerId,
            type: 'card',
        });
        if (!paymentMethods.data || paymentMethods.data.length === 0) {
            return NextResponse.json({ success: false });
        }
        const newPaymentMethod = paymentMethods.data[0];

        const pmId = newPaymentMethod.id;

        // Attach payment method to subscription
        const updatedSubscription = await stripe.subscriptions.update(
            stripeSubscriptionId,
            { default_payment_method: pmId },
        );

        return NextResponse.json({
            success: true,
            digits: newPaymentMethod?.card?.last4,
        });
    } catch (error) {
        console.error("Failed to update subscription's payment method", error);
        return NextResponse.json({ success: false });
    }
}
