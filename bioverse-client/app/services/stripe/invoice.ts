'use server';

import Stripe from 'stripe';

export async function getCustomerInvoices(
    stripe_customer_id: string,
    search_status?: 'draft' | 'open' | 'paid' | 'uncollectible' | 'void'
) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

    try {
        const invoices = await stripe.invoices.list({
            customer: stripe_customer_id,
            limit: 100,
            ...(search_status ? { status: search_status! } : {}),
        });

        return invoices;
    } catch (error: any) {
        console.log('Stripe invoices API ran into an issue. Details: ', error);
        return null;
    }
}
