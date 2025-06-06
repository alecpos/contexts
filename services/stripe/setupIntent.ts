import axios from 'axios';

/**
 * Create a SetupIntent for an existing Stripe customer.
 *
 * This utility sends a POST request to the Next.js API route
 * `/api/stripe/setup-intent` with the `stripeCustomerId` in the body.
 * The API route should handle creating the SetupIntent using your
 * Stripe secret key and return the resulting object.
 *
 * @param customerId - The ID of the Stripe customer
 * @returns The created SetupIntent object returned by the server
 */
export const createSetupIntentServerCustomer = async (customerId: string) => {
    const res = await axios.post('/api/stripe/setup-intent', {
        stripeCustomerId: customerId,
    });
    return res.data;
};
