import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SK as string, {
    apiVersion: '2022-11-15',
});

export async function createSetupIntentServerCustomer(customerId: string) {
    return stripe.setupIntents.create({
        usage: 'off_session',
        customer: customerId,
    });
}
