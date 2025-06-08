import { triggerEvent } from '@/app/services/customerio/customerioApiFactory';
import {
    FIRST_TIME_DOSAGE_SELECTION_COMPLETE,
    ORDER_CONFIRMED,
} from '@/app/services/customerio/event_names';
import { fetchCardDigitsForSubscription } from '@/app/services/stripe/subscriptions';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import {
    getAllOrderDataById,
    updateExistingOrderStatus,
} from '@/app/utils/actions/intake/order-control';
import { forwardOrderToEngineering } from '@/app/utils/database/controller/patient-status-tags/patient-status-tags-api';
import { createPaymentFailureAudit } from '@/app/utils/database/controller/payment_failure_audit/payment_failure_audit-api';
import { createNewPaymentFailure } from '@/app/utils/database/controller/payment_failures/payment-failures';
import {
    createSubscriptionWithOrderData,
    shouldApplyDiscountToFirstTimeOrder,
} from '@/app/utils/database/controller/prescription_subscriptions/prescription_subscriptions';
import { getPriceDataRecordWithVariant } from '@/app/utils/database/controller/product_variants/product_variants';
import { getCurrentDate } from '@/app/utils/functions/utils';
import { isEmpty } from 'lodash';
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
        const { orderId, providerId } = await req.json();

        /**
         * Creating subscriptions in stripe consists of these parts:
         *
         * 1. Identifying and parsing order/patient information.
         * 2. Creating subscription object and invoking stripe API
         * 3. If order says to, apply coupon to the subscription with a one time duration
         * 4. Pull the invoice and charge it immediately. Then check the status of the invoice.
         * 5. Invoice paid => Progress and proceed.
         * 6. Invoice unpaid => Mark it as having failed once in the metadata and update order status.
         */

        //retreive order data
        const { data: orderData, error: orderDataError } =
            await getAllOrderDataById(orderId);

        if (orderDataError) {
            console.log(
                'Stripe Error: Subscriptions Create API, Cause: Order Data Retrieval Issue, Error: ',
                orderDataError
            );

            return Response.json({
                result: 'failure',
                reason: 'supabase-error',
            });
        }

        //check if order is considered paid already (just in case)
        if (orderData.order_status == 'Payment-Completed') {
            console.log(
                'Stripe Error: Subscription Create API, Cause: Record states payment was already made, Error: ',
                'No specific code-origin error'
            );
            await createNewPaymentFailure(
                orderId,
                orderData.customer_uid,
                null,
                'Database records state payment was already made. [Subscription Create API]'
            );
            return Response.json({ result: 'failure', reason: 'already-paid' });
        }

        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

        const subscriptionList = await stripe.subscriptions.list({
            customer: orderData.customer.stripe_customer_id,
        });

        // Check each subscription's metadata.order_id
        for (const subscription of subscriptionList.data) {
            if (subscription.metadata.order_id === orderData.id) {
                return Response.json({
                    status: 400,
                    result: 'failure',
                    reason: 'Stripe Subscription Create API: subscription-already-exists',
                });
            }

            //Checking if there is a duplicate product href subscription that is currently active.
            if (
                subscription.metadata.product_href === orderData.product_href &&
                subscription.status === 'active'
            ) {
                return Response.json({
                    status: 400,
                    result: 'failure',
                    reason: 'Stripe Subscription Create API: subscription already exists for product',
                });
            }
        }

        /**
         * discount codes:
         * 6JYNXzZ2 semaglutide
         * 0OY1wzJJ tirzepatide
         * elonzlFx metformin
         */

        let glp1Discount = undefined;
        const shouldApplyDiscount = await shouldApplyDiscountToFirstTimeOrder(
            orderData.customer_uid,
            orderData.product_href
        );

        if (shouldApplyDiscount) {
            if (orderData.product_href === PRODUCT_HREF.SEMAGLUTIDE) {
                if (
                    //update mappings for new variant indices 
                    [2, 3, 4, 13, 14, 22, 23, 24, 32, 45, 46, 47, 55].includes(
                        orderData.variant_index
                    )
                ) {
                    glp1Discount = '6JYNXzZ2';
                }
            } else if (orderData.product_href === PRODUCT_HREF.TIRZEPATIDE) {
                if ([3, 4, 14, 30, 31, 42, 43, 47, 48].includes(orderData.variant_index)) {
                    glp1Discount = '0OY1wzJJ';
                }
            } else if (orderData.product_href === PRODUCT_HREF.METFORMIN) {
                glp1Discount === 'elonzlFx';
            }
        }

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
            const subscription = await stripe.subscriptions.create({
                customer: orderData.customer.stripe_customer_id,
                items: [
                    {
                        price: priceData?.stripe_price_ids[
                            process.env.NEXT_PUBLIC_ENVIRONMENT as
                                | 'dev'
                                | 'prod'
                        ],
                        quantity: 1,
                    },
                ],
                payment_behavior: 'error_if_incomplete',
                ...(glp1Discount
                    ? { discounts: [{ coupon: glp1Discount }] }
                    : !isEmpty(orderData.discount) && shouldApplyDiscount
                    ? { discounts: [{ coupon: orderData.discount[0] }] }
                    : {}),
                currency: 'usd',
                ...(orderData.order_status === 'Payment-Declined'
                    ? {}
                    : {
                          default_payment_method:
                              orderData.stripe_metadata.paymentMethodId,
                      }),
                description: orderData.product.name + ' subscription',
                metadata: {
                    order_id: orderData.id,
                    product_href: orderData.product_href,
                    cadence: orderData.subscription_type,
                },
            });

            let totalPrice: any = subscription.items.data[0].plan.amount;

            const latestInvoiceId = subscription.latest_invoice;

            if (latestInvoiceId) {
                const invoice = await stripe.invoices.retrieve(
                    latestInvoiceId.toString()
                );

                totalPrice = invoice.total;
            }

            // TODO KEVIN send the order strenght of the tretinoin in this order confirmation email

            // might have to change the content of the email
            if (totalPrice) {
                const decimalPrice = (totalPrice / 100).toFixed(2);
                const last4 = await fetchCardDigitsForSubscription(
                    subscription.id
                );

                await triggerEvent(orderData.customer_uid, ORDER_CONFIRMED, {
                    date: await getCurrentDate(),
                    id: orderId,
                    paid: decimalPrice,
                    last4,
                });
            }

            const invoice = await stripe.invoices.retrieve(
                String(subscription.latest_invoice)
            );

            await updateExistingOrderStatus(orderId, 'Payment-Completed');

            const orderDataForSubscription: Order = {
                orderId: orderData.id,
                customer_uid: orderData.customer_uid,
                product_href: orderData.product_href,
                variant_text: orderData.variant_text,
                subscription_type: orderData.subscription_type,
                price_id:
                    priceData.stripe_price_ids[
                        process.env.NEXT_PUBLIC_ENVIRONMENT as 'dev' | 'prod'
                    ],
                variant_index: orderData.variant_index,
            };

            //Add this subscription to supabase using given values.
            await createSubscriptionWithOrderData(
                orderDataForSubscription,
                providerId,
                subscription.id
            );

            /**
             * if a subscription is made we ensure the patient is taken out of this campaign.
             */
            await triggerEvent(
                orderData.customer_uid,
                FIRST_TIME_DOSAGE_SELECTION_COMPLETE,
                {}
            );

            return Response.json({
                result: 'success',
                reason: null,
                actually_paid: true,
            });
        } catch (error: any) {
            await updateExistingOrderStatus(orderId, 'Payment-Declined');

            console.log(
                'This is the error. ',
                error,
                'only message: ',
                error.message
            );

            //TODO put the script that creates payment failure audit here.
            await createPaymentFailureAudit(
                orderData.customer_uid,
                orderData.id,
                orderData.product_href,
                orderData.stripe_metadata.paymentMethodId,
                error.message
            );

            return Response.json({
                result: 'failure',
                reason: 'payment-failed',
            });
        }
    } catch (error: any) {
        return Response.json({
            result: 'failure',
            reason: error.message,
        });
    }
}
