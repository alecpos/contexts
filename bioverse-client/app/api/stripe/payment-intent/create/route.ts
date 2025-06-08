import {
    getAllOrderDataById,
    updateExistingOrderStatus,
} from '@/app/utils/actions/intake/order-control';
import { forwardOrderToEngineering } from '@/app/utils/database/controller/patient-status-tags/patient-status-tags-api';
import { createNewPaymentFailure } from '@/app/utils/database/controller/payment_failures/payment-failures';
import { getPriceDataRecordWithVariant } from '@/app/utils/database/controller/product_variants/product_variants';
import { NextRequest } from 'next/server';
import Stripe from 'stripe';

/**
 * @author Nathan Cho
 * Creates a subscription in stripe after immediately charging the customer.
 * Customer subscriptions are not created until they are paid for to avoid unnecesary churn numbers.
 */
export async function POST(req: NextRequest) {
    const authHeader = req.headers.get('authorization');

    if (!authHeader) {
        return Response.json(
            { message: 'Authorization header missing' },
            { status: 401 }
        );
    }

    // Verify the token is in the Bearer format
    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
        return Response.json(
            { message: 'Invalid Authorization Format' },
            { status: 401 }
        );
    }

    const key = process.env.BV_API_KEY;

    if (token !== key) {
        return Response.json({ message: 'Forbidden' }, { status: 403 });
    }

    try {
        const { orderId } = await req.json();

        const { data: orderData, error: orderDataError } =
            await getAllOrderDataById(orderId);

        if (orderDataError) {
            console.log(
                'Stripe Error, Type: Paymentintent, method: createPaymentIntent, Cause: Order Data Retrieval Issue, Error: ',
                orderDataError
            );
            return Response.json({
                result: 'failure',
                reason: 'order data issue',
            });
        }

        if (orderData.order_status == 'Payment-Completed') {
            console.log(
                'Stripe Error, Type: Paymentintent, method: createPaymentIntent, Cause: Record states payment was already made, Error: ',
                'No specific code-origin error'
            );
            createNewPaymentFailure(
                orderId,
                orderData.customer_uid,
                null,
                'Database records state payment was already made. [Payment Intent]'
            );
            return Response.json({
                result: 'failure',
                reason: 'payment already made.',
            });
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
            orderData.variant_index
        );

        if (!priceData || !priceData.stripe_price_ids) {
            await forwardOrderToEngineering(
                orderData.id,
                orderData.customer_uid,
                'Couldnt find priceData for payment intent create'
            );
            throw new Error('Couldnt find price data for new payment intent');
        }

        try {
            await stripe.invoiceItems.create({
                customer: orderData.customer.stripe_customer_id,
                currency: 'usd',
                description:
                    'Purchase of ' +
                    orderData.product.name +
                    ' ' +
                    orderData.variant_text,
                invoice: invoice.id,
                price: priceData.stripe_price_ids[
                    process.env.NEXT_PUBLIC_ENVIRONMENT as 'prod' | 'dev'
                ],
            });
        } catch (error: any) {
            console.log(
                'Stripe Error, Type: Paymentintent, method: createPaymentIntent, Cause: Issue creating Invoice Item, Error: ',
                error
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
                            process.env.NEXT_PUBLIC_ENVIRONMENT as
                                | 'prod'
                                | 'dev'
                        ], //will be added back later when price ID is logged in supabase.
                    },
                },
                'Issue with creating the invoice. Recorded data used to attempt invoice item generation. [Payment Intent]'
            );
            return Response.json({
                result: 'failure',
                reason: 'invoice creation.',
            });
        }

        const paidInvoice = await stripe.invoices.pay(invoice.id);
        console.log('paid invoice', paidInvoice);

        if (paidInvoice.status === 'paid') {
            updateExistingOrderStatus(orderId, 'Payment-Completed');

            return Response.json({
                result: 'success',
                reason: null,
            });
        } else {
            //Payment intent failed or whatever... handle it here.
            console.log(
                'Stripe Error, Type: Paymentintent, method: createPaymentIntent, Cause: Issue in invoice payment, Invoice status: ',
                paidInvoice.status
            );

            createNewPaymentFailure(
                orderId,
                orderData.customer_uid,
                {
                    invoice: paidInvoice,
                },
                'Issue with paying the invoice. Invoice data was recorded. [Payment Intent]'
            );
            return Response.json({
                result: 'failure',
                reason: 'invoice payment',
            });
        }
    } catch (error: any) {
        return Response.json({
            result: 'failure',
            reason: error.message,
        });
    }
}
