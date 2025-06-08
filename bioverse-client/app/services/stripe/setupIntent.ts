'use server';
import Stripe from 'stripe';

export async function createSetupIntentServer() {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

    const setupIntent = await stripe.setupIntents.create({
        payment_method_types: ['card'],
    });

    return JSON.stringify(setupIntent);
}

export async function createSetupIntentServerCustomer(
    stripeCustomerId: string
) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

    const setupIntent = await stripe.setupIntents.create({
        customer: stripeCustomerId,
        payment_method_types: ['card'],
    });

    return setupIntent;
}

export async function updateSetupIntentWithSetupIntentId(
    setupIntentId: string,
    customerId: string
) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

    console.log(
        'SetupIntent.ts | updateSetupIntentWithSetupIntentId. Updating with setupIntent ID: ' +
            setupIntentId +
            ' and customer ID: ' +
            customerId
    );

    const setupIntent = await stripe.setupIntents.update(setupIntentId, {
        customer: customerId,
    });
}
