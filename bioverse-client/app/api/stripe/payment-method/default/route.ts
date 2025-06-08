'use server';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

/**
 * @description Updates a customer's default payment method
 * @description Also updates all the customer's active subscriptions' PM to this
 * @param req
 * @returns last 4 digits of new PM and success
 */

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();

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

        // update default PM for customer
        const updatedCustomer = await stripe.customers.update(
            stripeCustomerId,
            {
                invoice_settings: {
                    default_payment_method: pmId,
                },
            },
        );

        // Update all subscription's PM to this one
        const subscriptions = await stripe.subscriptions.list({
            customer: stripeCustomerId,
        });

        const updatePromises = subscriptions.data.map((subscription) => {
            return stripe.subscriptions.update(subscription.id, {
                default_payment_method: pmId,
            });
        });

        await Promise.all(updatePromises);

        return NextResponse.json({
            success: true,
            digits: newPaymentMethod?.card?.last4,
        });
    } catch (error) {
        console.error("Failed to update subscription's payment method", error);
        return NextResponse.json({ success: false });
    }
}
