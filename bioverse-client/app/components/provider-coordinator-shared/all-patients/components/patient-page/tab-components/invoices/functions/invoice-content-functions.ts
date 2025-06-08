// import { PaymentIntent } from '@stripe/stripe-js';

import { Stripe } from 'stripe';

export function convertPaymentIntentToInvoiceTableItem(
    list: Stripe.PaymentIntent[]
) {
    let converted_list: InvoiceTableItem[] = [];

    list.forEach((payment_intent) => {
        const mapped_payment_intent =
            mapPaymentIntentToInvoiceTableItem(payment_intent);

        converted_list.push(mapped_payment_intent);
    });
    return converted_list;
}

function mapPaymentIntentToInvoiceTableItem(
    paymentIntent: Stripe.PaymentIntent
): InvoiceTableItem {
    const productName =
        paymentIntent.description?.split(' ')[0] || 'No Product Specified';

    return {
        id: paymentIntent.id,
        description: paymentIntent.description || 'No Description',
        status: paymentIntent.status,
        amountDue: paymentIntent.amount,
        amountRefunded: 0, //placeholder
        created: new Date(paymentIntent.created * 1000).toLocaleString(
            'en-US',
            {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
            }
        ),
        productName: productName,
        chargeType:
            paymentIntent.invoice && typeof paymentIntent.invoice !== 'string'
                ? parseChargeType(paymentIntent.invoice.billing_reason)
                : 'Unknown',
        refund: null, // Placeholder for refund, you'll need to adjust this based on your logic
        payment_intent_data: paymentIntent,
    };
}

function parseChargeType(billing_reason: string | null) {
    switch (billing_reason) {
        case 'subscription_create':
            return 'Medication First Month Charge';

        case 'subscription_cycle':
            return 'Medication Renewal Charge';

        default:
            return 'Other';
    }
}
