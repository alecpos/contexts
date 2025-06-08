'use server';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { getCustomerStripeId } from '@/app/utils/database/controller/profiles/profiles';
import Stripe from 'stripe';

export async function createCustomerWithData(data: any) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

    try {
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

        return JSON.stringify(customer);
    } catch (error) {
        const user_id = (await readUserSession()).data.session?.user.id;

        console.error(
            'createCustomerWithData -  data used: ',
            data,
            ' userID: ',
            user_id
        );

        return '';
    }
}

export async function retrieveCustomerWithId(customerId: string) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

    const customer = await stripe.customers.retrieve(customerId);

    return JSON.stringify(customer);
}

export async function listCustomerPaymentMethods(customerId: string) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

    const paymentMethods = await stripe.customers.listPaymentMethods(
        customerId,
        { limit: 10 }
    );

    return JSON.stringify(paymentMethods);
}

// Attempts to fetch the default PM on the customer object, then will take the PM on the most recent subscription they've purchased

export async function fetchDefaultCardForCustomer(user_id: string) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

    const { data: stripeCustomerData, error } = await getCustomerStripeId(
        user_id
    );

    const stripe_customer_id = stripeCustomerData?.stripe_customer_id;

    if (!stripe_customer_id) {
        return { stripeCustomerId: '', last4: '' };
    }

    const customer = await stripe.customers.retrieve(stripe_customer_id);
    if (customer.deleted === true) {
        return { stripeCustomerId: stripe_customer_id, last4: '' };
    }

    let customerDefaultPM;
    if (customer.invoice_settings.default_payment_method) {
        customerDefaultPM = customer.invoice_settings.default_payment_method;
    } else {
        // Fetch from subscriptions
        const subscriptions = await stripe.subscriptions.list({
            customer: stripe_customer_id,
        });

        for (const subscription of subscriptions.data) {
            const paymentMethod = subscription.default_payment_method;

            if (paymentMethod) {
                customerDefaultPM = paymentMethod;
                break;
            }
        }
    }

    if (!customerDefaultPM || !customerDefaultPM.toString()) {
        return {
            stripeCustomerId: stripe_customer_id,
            last4: '',
        };
    }

    // Fetch Default PM
    const defaultPM = await stripe.paymentMethods.retrieve(
        customerDefaultPM?.toString() || ''
    );

    if (defaultPM?.card?.last4) {
        return {
            stripeCustomerId: stripe_customer_id,
            last4: defaultPM.card?.last4,
            defaultPaymentMethodId: defaultPM.id,
        };
    }

    return {
        stripeCustomerId: stripe_customer_id,
        last4: '',
        defaultPaymentMethodId: defaultPM.id,
    };
}

export async function updateDefaultPaymentMethodForCustomer(
    stripe_customer_id: string,
    payment_method_id: string
) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

    try {
        stripe.customers.update(stripe_customer_id, {
            invoice_settings: {
                default_payment_method: payment_method_id,
            },
        });
    } catch (error: any) {
        console.log('default payment method issue: ', error);
    }

    return;
}
