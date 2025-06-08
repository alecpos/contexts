'use server';
import Stripe from 'stripe';
import {
    getAllOrderDataById,
    updateExistingOrderStatus,
} from '../../utils/actions/intake/order-control';
import { createNewPaymentFailure } from '../../utils/database/controller/payment_failures/payment-failures';
import { forwardOrderToEngineering } from '@/app/utils/database/controller/patient-status-tags/patient-status-tags-api';
import { getPriceDataRecordWithVariant } from '@/app/utils/database/controller/product_variants/product_variants';

export async function createPaymentIntent(orderId: number) {
    const { data: orderData, error: orderDataError } =
        await getAllOrderDataById(orderId);

    if (orderDataError) {
        console.log(
            'Stripe Error, Type: Paymentintent, method: createPaymentIntent, Cause: Order Data Retrieval Issue, Error: ',
            orderDataError,
        );
        return 'failure';
    }

    if (orderData.order_status == 'Payment-Completed') {
        console.log(
            'Stripe Error, Type: Paymentintent, method: createPaymentIntent, Cause: Record states payment was already made, Error: ',
            'No specific code-origin error',
        );
        createNewPaymentFailure(
            orderId,
            orderData.customer_uid,
            null,
            'Database records state payment was already made. [Payment Intent]',
        );
        return 'failure';
    }

    /**
     * Below line of code is not necessary since the provider is bound on approval.
     */
    // if (orderData.assigned_provider === null) {
    //     setOrderProvider(orderId, providerId);
    // }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

    const invoice = await stripe.invoices.create({
        customer: orderData.customer.stripe_customer_id,
        default_payment_method: orderData.stripe_metadata.paymentMethodId,
        auto_advance: true,
        description:
            'Purchase of ' +
            orderData.product.name +
            ' ' +
            orderData.variant_text,
        metadata: {
            orderId: orderData.id,
        },
    });

    const priceData = await getPriceDataRecordWithVariant(
        orderData.product_href,
        orderData.variant_index,
    );

    if (!priceData || !priceData.stripe_price_ids) {
        await forwardOrderToEngineering(
            orderData.id,
            orderData.customer_uid,
            'Couldnt find priceData for payment intent create',
        );
        throw new Error('Couldnt find price data for new payment intent');
    }

    const priceObtained = await stripe.prices.retrieve(orderData.price_id);

    try {
        const invoiceItem = await stripe.invoiceItems.create({
            customer: orderData.customer.stripe_customer_id,
            // amount: priceObtained.unit_amount!,
            currency: 'usd',
            description:
                'Purchase of ' +
                orderData.product.name +
                ' ' +
                orderData.variant_text,
            invoice: invoice.id,
            price: priceData.stripe_price_ids[
                process.env.NEXT_PUBLIC_ENVIRONMENT as 'dev' | 'prod'
            ], //will be added back later when price ID is logged in supabase.
        });
    } catch (error: any) {
        console.log(
            'Stripe Error, Type: Paymentintent, method: createPaymentIntent, Cause: Issue creating Invoice Item, Error: ',
            error,
        );

        createNewPaymentFailure(
            orderId,
            orderData.customer_uid,
            {
                invoice_item_data_used: {
                    customer: orderData.customer.stripe_customer_id,
                    // amount: priceObtained.unit_amount!,
                    currency: 'usd',
                    description:
                        'Purchase of ' +
                        orderData.product.name +
                        ' ' +
                        orderData.variant_text,
                    invoice: invoice.id,
                    price: priceData.stripe_price_ids[
                        process.env.NEXT_PUBLIC_ENVIRONMENT as 'dev' | 'prod'
                    ], //will be added back later when price ID is logged in supabase.
                },
            },
            'Issue with creating the invoice. Recorded data used to attempt invoice item generation. [Payment Intent]',
        );
        return 'failure';
    }

    const paidInvoice = await stripe.invoices.pay(invoice.id);
    console.log('paid invoice', paidInvoice);

    if (paidInvoice.status === 'paid') {
        console.log('did it');

        updateExistingOrderStatus(orderId, 'Payment-Completed');

        return 'success';
    } else {
        //Payment intent failed or whatever... handle it here.
        console.log(
            'Stripe Error, Type: Paymentintent, method: createPaymentIntent, Cause: Issue in invoice payment, Invoice status: ',
            paidInvoice.status,
        );

        createNewPaymentFailure(
            orderId,
            orderData.customer_uid,
            {
                invoice: paidInvoice,
            },
            'Issue with paying the invoice. Invoice data was recorded. [Payment Intent]',
        );
        return 'failure';
    }
}

export async function getCustomerPaymentIntents(stripe_customer_id: string) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

    try {
        const invoices = await stripe.paymentIntents.list({
            customer: stripe_customer_id,
            limit: 100,
            expand: ['data.invoice'],
        });

        return invoices.data;
    } catch (error: any) {
        console.log('Stripe invoices API ran into an issue. Details: ', error);
        return null;
    }
}
