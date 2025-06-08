import { getAllOrderDataById } from '@/app/utils/actions/intake/order-control';
import { getScriptUsingOrderID } from '@/app/utils/database/controller/prescription_script_audit/prescription_script_audit';
import {
    createSubscriptionWithOrderData,
    getSubscriptionWithStripeSubscriptionId,
} from '@/app/utils/database/controller/prescription_subscriptions/prescription_subscriptions';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(
    'sk_test_51OMEMoDyFtOu3ZuT8AuKzVgN5vAGBJdTbem76706WHjiRgusuUgk0kwF65IKxnl5if5VTD2p5ynuGzg4aISdosTA00QmgO5Jjv',
);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET_DEV!;

export async function POST(req: NextRequest) {
    const sig = req.headers.get('stripe-signature');

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            await req.text(),
            sig!,
            endpointSecret,
        );
    } catch (err: any) {
        console.error(err);
        return new NextResponse(`Webhook Error: ${err.message}`, {
            status: 400,
        });
    }

    // Handle the event
    switch (event.type) {
        case 'invoice.paid':
            const invoicePaid = event.data.object;

            console.log('invoice paid event data: ', invoicePaid); //TODO delete this

            console.log('Billing reason: ', invoicePaid.billing_reason);

            switch (invoicePaid.billing_reason) {
                case 'subscription_cycle':
                    const subscriptionId = invoicePaid.subscription;
                    console.log(
                        'subscription cycle Subscription ID: ',
                        subscriptionId,
                    ); //TODO delete this

                    const { subscription } =
                        await getSubscriptionWithStripeSubscriptionId(
                            subscriptionId as string,
                        );

                    // await handlePharmacyRenewal(subscription);
                    break;

                case 'subscription_create':
                    if (invoicePaid.metadata) {
                        //TODO write code here to work with the subscription creates that have failures associated.
                        if (invoicePaid.metadata.is_failed_payment === 'true') {
                            const subscriptionId = invoicePaid.subscription;
                            //write code to sent a script and create a new prescription
                            console.log(
                                'creating a script for a failed payment.',
                            );

                            //failed payments do not have a subscription.
                            // const {
                            //     subscription: failed_payment_subscription,
                            // } = await getPaymentFailedSubscriptionWithID(
                            //     subscriptionId as string
                            // );

                            const subscription =
                                await stripe.subscriptions.retrieve(
                                    String(subscriptionId),
                                );

                            let failed_order_id;

                            if (subscription.metadata) {
                                failed_order_id =
                                    subscription.metadata.order_id;
                            } else {
                                const subscription_schedule =
                                    await stripe.subscriptionSchedules.retrieve(
                                        subscription.schedule as string,
                                    );

                                failed_order_id =
                                    subscription_schedule!.metadata?.orderId;
                            }

                            if (!failed_order_id) {
                                break;
                            }

                            //Obtain the previously used script using the failed order's ID
                            const script_data = await getScriptUsingOrderID(
                                failed_order_id,
                            );

                            //Get the order data information using the failed order's ID
                            const { data: orderData, error: orderDataError } =
                                await getAllOrderDataById(failed_order_id);

                            //construct order data object for subscription creation method
                            const orderDataForSubscription: Order = {
                                orderId: orderData.id,
                                customer_uid: orderData.customer_uid,
                                product_href: orderData.product_href,
                                variant_text: orderData.variant_text,
                                subscription_type: orderData.subscription_type,
                                price_id: orderData.price_id,
                            };

                            //Stop function if there is no script data to be found.
                            if (!script_data) {
                                console.log(
                                    `Stripe webhook: Script for ${orderData.id} did not exist.`,
                                );
                                break;
                            }

                            /**
                             * Decision to make subscriptions here was revoked since we need the object of the subscription in order to display it in the portal.
                             */
                            /**
                             * Double note: Engineer building this Failure Loop (Nathan) had to double take because the previous above comment was a miscommunication.
                             */
                            const { error } =
                                await createSubscriptionWithOrderData(
                                    orderDataForSubscription,
                                    orderData.assigned_provider,
                                    subscriptionId as string,
                                );

                            if (error) {
                                console.log(
                                    'subscription creation error! Did not make suscription for ' +
                                        orderData.id,
                                );
                                break;
                            }

                            return new NextResponse(null, { status: 204 });
                        }
                    }

                default:
                    break;
            }

            // Then define and call a function to handle the invoice.paid event
            break;

        case 'invoice.upcoming':
            const invoiceUpcoming = event.data.object;

            console.log('invoice upcoming event data: ', invoiceUpcoming);
            // Then define and call a function to handle the event invoice.upcoming
            break;

        case 'invoice.payment_failed':
            const invoiceFailed = event.data.object;
            console.log(
                'invoice payment failed for invoice id: ' + invoiceFailed.id,
            );

            stripe.invoices.update(invoiceFailed.id, {
                metadata: { is_failed_payment: 'true' },
            });

            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    return new NextResponse(null, { status: 200 });
}
