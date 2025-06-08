'use server';
import Stripe from 'stripe';
import {
    getStripeSubscriptionIdFromSubscription,
    getSubscriptionWithStripeSubscriptionId,
} from '@/app/utils/database/controller/prescription_subscriptions/prescription_subscriptions';
import { auditRenewalOrder } from '@/app/utils/database/controller/renewal_order_audit/renewal_order_audit';
import {
    changeRefillDate,
    getStripeSubscription,
    updateRenewalOrderQuarterlyProductToMonthlyVial,
} from '@/app/(administration)/admin/stripe-api/stripe-api-actions';
// import { getOrderForProduct } from '@/app/utils/database/controller/orders/orders-api';

import { createSupabaseServiceClient } from '@/app/utils/clients/supabaseServerClient';
import { getPrescriptionSubscription } from '@/app/utils/actions/subscriptions/subscription-actions';
import { SubscriptionCadency } from '@/app/types/renewal-orders/renewal-orders-types';
import { Status } from '@/app/types/global/global-enumerators';
import { getLatestRenewalOrderForSubscription } from '@/app/utils/database/controller/renewal_orders/renewal_orders';

// import { auditStripe } from '@/app/utils/database/controller/stripe_audit/stripe_audit';
import { Message } from '../../types/provider-portal/messages/message-types';
import {
    createNewCommsJob,
    createNewSpecificCommsJob,
    getCommJobForSubscription,
} from '@/app/utils/database/controller/job-scheduler/job-scheduler-actions';
import { forwardOrderToEngineering } from '@/app/utils/database/controller/patient-status-tags/patient-status-tags-api';
import { AUTO_STATUS_CHANGER_UUID } from '../pharmacy-integration/provider-static-information';
import { JobSchedulerFactory } from '@/app/utils/functions/job-scheduler/JobSchedulerFactory';
import { BaseCommJobHandler } from '@/app/utils/functions/job-scheduler/jobs/BaseCommJobHandler';
import { MonthlyCheckInComms } from '@/app/utils/classes/CommsScheduler/MonthlyCheckInComms';
import { JobSchedulerTypes } from '@/app/types/job-scheduler/job-scheduler-types';
import {
    ANNUALLY_COMMS_FINAL_STEP_ID,
    BIANNUALLY_COMMS_FINAL_STEP_ID,
    MONTHLY_COMMS_FINAL_STEP_ID,
    QUARTERLY_COMMS_FINAL_STEP_ID,
} from '@/app/utils/classes/CommsScheduler/CommsSchedule';
import { convertEpochToDate } from '@/app/utils/functions/dates';

export async function retrieveStripeSubscription(subcsription_id: string) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

    const stripeSubscription = await stripe.subscriptions.retrieve(
        subcsription_id
    );

    return JSON.stringify(stripeSubscription);
}

export async function fetchCardDigitsForSubscription(
    stripeSubscriptionId: string
) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

    if (!stripeSubscriptionId) {
        return '0000';
    }
    const subscription = await stripe.subscriptions.retrieve(
        stripeSubscriptionId
    );

    const paymentMethod = subscription.default_payment_method;

    if (paymentMethod) {
        const digits = await getCardDigitsFromPaymentMethod(
            paymentMethod.toString()
        );
        return digits;
    } else {
        const invoiceId = subscription.latest_invoice;
        if (!invoiceId) {
            console.error(
                'Could not retrieve latest invoice for subscription',
                subscription
            );
            return '0000';
        }
        const invoice = await stripe.invoices.retrieve(invoiceId?.toString());

        if (!invoice.payment_intent) {
            console.error(
                'Could not retrieve payment intent for subscription',
                subscription
            );
            return '0000';
        }
        const paymentIntent = await stripe.paymentIntents.retrieve(
            invoice.payment_intent?.toString()
        );

        const paymentMethodId = paymentIntent.payment_method;

        if (paymentMethodId) {
            const digits = await getCardDigitsFromPaymentMethod(
                paymentMethodId?.toString()
            );
            return digits;
        } else {
            console.error(
                'Could not retrieve card digits for subscription',
                subscription,
                paymentIntent
            );
            return '0000';
        }
    }
}

export async function getCardDigitsFromPaymentMethod(paymentMethodId: string) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});
    const paymentMethodLookup = await stripe.paymentMethods.retrieve(
        paymentMethodId
    );

    const last4 = paymentMethodLookup.card?.last4;

    return last4;
}

export async function pausePaymentCollectionForSubscription(
    subscription_id: string | number
) {
    try {
        const stripe_subscription_id =
            await getStripeSubscriptionIdFromSubscription(subscription_id);

        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

        if (!stripe_subscription_id) {
            throw new Error(
                'No Stripe Subscription ID found from subscription ID: ' +
                    subscription_id.toString()
            );
        }

        const subscription = await stripe.subscriptions.update(
            stripe_subscription_id!,
            {
                pause_collection: {
                    behavior: 'void',
                },
            }
        );
    } catch (error: any) {
        console.error('pausePaymentCollectionForSubscription Error: ', error);
    }

    return;
}

export async function changeSubscriptionRenewalDate(
    subscription_id: number,
    stripe_subscription_id: string,
    new_end_date_epoch: number,
    weeks: number
) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

    try {
        const subscription = await stripe.subscriptions.retrieve(
            stripe_subscription_id
        );

        if (subscription.schedule) {
            await stripe.subscriptionSchedules.release(
                subscription.schedule.toString()
            );
        }

        const renewalOrder = await getLatestRenewalOrderForSubscription(
            subscription_id
        );

        if (!renewalOrder) {
            console.error(
                'Could not update user to single vial - no renewal order found'
            );
            return Status.Success;
        }

        try {
            if (weeks >= 0) {
                const endDate = convertEpochToDate(new_end_date_epoch);

                if (
                    renewalOrder.subscription_type ===
                    SubscriptionCadency.Monthly
                ) {
                    endDate.setDate(endDate.getDate() - 14);

                    await createNewSpecificCommsJob(
                        JobSchedulerTypes.MonthlyCheckInCustomerIO,
                        endDate.toISOString(),
                        {
                            user_id: renewalOrder.customer_uuid,
                            subscription_id: renewalOrder.subscription_id,
                            current_step: MONTHLY_COMMS_FINAL_STEP_ID,
                            reason: 'Moved refill date',
                        }
                    );
                } else if (
                    renewalOrder.subscription_type ===
                    SubscriptionCadency.Quarterly
                ) {
                    endDate.setDate(endDate.getDate() - 21);

                    await createNewSpecificCommsJob(
                        JobSchedulerTypes.QuarterlyCheckInCustomerIO,
                        endDate.toISOString(),
                        {
                            user_id: renewalOrder.customer_uuid,
                            subscription_id: renewalOrder.subscription_id,
                            current_step: QUARTERLY_COMMS_FINAL_STEP_ID,
                            reason: 'Moved refill date',
                        }
                    );
                } else if (
                    renewalOrder.subscription_type ===
                    SubscriptionCadency.Biannually
                ) {
                    endDate.setDate(endDate.getDate() - 21);

                    await createNewSpecificCommsJob(
                        JobSchedulerTypes.BiannuallyCheckInCustomerIO,
                        endDate.toISOString(),
                        {
                            user_id: renewalOrder.customer_uuid,
                            subscription_id: renewalOrder.subscription_id,
                            current_step: BIANNUALLY_COMMS_FINAL_STEP_ID,
                            reason: 'Moved refill date',
                        }
                    );
                } else if (
                    renewalOrder.subscription_type ===
                    SubscriptionCadency.Annually
                ) {
                    endDate.setDate(endDate.getDate() - 21);

                    await createNewSpecificCommsJob(
                        JobSchedulerTypes.AnnuallyCheckInCustomerIO,
                        endDate.toISOString(),
                        {
                            user_id: renewalOrder.customer_uuid,
                            subscription_id: renewalOrder.subscription_id,
                            current_step: ANNUALLY_COMMS_FINAL_STEP_ID,
                            reason: 'Moved refill date',
                        }
                    );
                }
            }
        } catch (error: any) {
            console.error(error, stripe_subscription_id);
            await forwardOrderToEngineering(
                String(subscription_id),
                AUTO_STATUS_CHANGER_UUID,
                error.message
            );
        }

        if (
            weeks === -1 ||
            renewalOrder.subscription_type === SubscriptionCadency.Quarterly
        ) {
            await changeRefillDate(
                renewalOrder,
                stripe_subscription_id,
                new_end_date_epoch,
                weeks
            );
        } else if (
            renewalOrder.subscription_type === SubscriptionCadency.Monthly
        ) {
            await stripe.subscriptions.update(stripe_subscription_id, {
                trial_end: new_end_date_epoch,
                proration_behavior: 'none',
            });
        }

        return Status.Success;
    } catch (error: any) {
        console.log('change renewal date error: ', error);
        return Status.Failure;
    }
}

export async function getStripeSubscriptionFromSubscription(
    subscription_id: string
): Promise<Stripe.Response<Stripe.Subscription> | null> {
    const supabase = createSupabaseServiceClient();

    const stripe_subscription_id =
        await getStripeSubscriptionIdFromSubscription(subscription_id);

    if (!stripe_subscription_id) {
        return null;
    }

    const stripeSubscription = await getStripeSubscription(
        stripe_subscription_id
    );

    if (!stripeSubscription) {
        return null;
    }

    return stripeSubscription;
}

// Adjust subscription renewal date to be +30 days from now if a monthly subscription and +90 if quarterly.
// To be called when the script is sent to the pharmacy
// Given: The user will have always paid and is on the next 'phase' at this point
export async function autoUpdateStripeSubscriptionRenewalDate(
    renewal_order_id: string,
    subscription_id: string
) {
    try {
        const stripeSubscription = await getStripeSubscriptionFromSubscription(
            subscription_id
        );

        if (!stripeSubscription) {
            console.error(
                'Error getting stripe subscription from subscription id',
                renewal_order_id,
                subscription_id
            );
            return null;
        }

        const subscription_schedule_id = stripeSubscription.schedule;

        // No subscription shcedule attached
        if (!subscription_schedule_id) {
            await adjustSubscriptionDate(
                subscription_id,
                stripeSubscription.id
            );
            return;
        }

        // Release subscription schedule

        await releaseSubscriptionSchedule(subscription_schedule_id.toString());

        await adjustSubscriptionDate(subscription_id, stripeSubscription.id);
    } catch (error) {
        console.error(error);
    }
}

async function releaseSubscriptionSchedule(sub_sched_id: string) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

    await stripe.subscriptionSchedules.release(sub_sched_id);
}

async function adjustSubscriptionDate(
    subscription_id: string,
    stripe_subscription_id: string
) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

    try {
        const subscription = await getPrescriptionSubscription(
            parseInt(subscription_id)
        );

        if (!subscription) {
            return null;
        }

        const now = new Date();
        const newEndDate = new Date(now);

        if (subscription.subscription_type === SubscriptionCadency.Monthly) {
            newEndDate.setDate(now.getDate() + 31);
        } else if (
            subscription.subscription_type === SubscriptionCadency.Quarterly
        ) {
            newEndDate.setDate(now.getDate() + 91);
        } else if (
            subscription.subscription_type === SubscriptionCadency.Biannually
        ) {
            newEndDate.setDate(now.getDate() + 181);
        } else if (
            subscription.subscription_type === SubscriptionCadency.Annually
        ) {
            newEndDate.setDate(now.getDate() + 366);
        } else if (
            subscription.subscription_type === SubscriptionCadency.Pentamonthly
        ) {
            newEndDate.setDate(now.getDate() + 151);
        } else if (
            subscription.subscription_type === SubscriptionCadency.Bimonthly
        ) {
            newEndDate.setDate(now.getDate() + 61);
        } else if (
            subscription.subscription_type === SubscriptionCadency.OneTime
        ) {
            return;
        }

        const newEndDate_Epoch = convertDateToEpochTimestamp(newEndDate);

        await stripe.subscriptions.update(stripe_subscription_id, {
            trial_end: newEndDate_Epoch,
            proration_behavior: 'none',
        });
    } catch (error) {
        console.error(
            'Error adjusting subscription date',
            error,
            subscription_id,
            stripe_subscription_id
        );
    }
}

export async function changeRenewalSubscriptionRenewalDate(
    renewal_order_id: string,
    subscription_id: string
) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});
    try {
        const stripe_subscription_id =
            await getStripeSubscriptionIdFromSubscription(subscription_id);
        if (typeof stripe_subscription_id !== 'string') {
            throw new Error(
                'Unable to get stripe_subscription_id for subscription'
            );
        }
        const subscription = await stripe.subscriptions.retrieve(
            stripe_subscription_id
        );

        const subscription_schedule_id = subscription.schedule;

        if (!subscription_schedule_id) {
            const now = new Date();
            const newEndDate =
                subscription.current_period_end +
                convertDateToEpochTimestamp(now) -
                subscription.current_period_start;

            // Update the subscription with the new end date
            await stripe.subscriptions.update(stripe_subscription_id, {
                trial_end: newEndDate,
                proration_behavior: 'none',
            });
            return 'success';
        }

        /**
         * 5.21.24 - Nathan Cho: This subcsription schedule code is considered safe.
         * Required to remove subscription schedule dependency on this date.
         * This code remains in order to function with depreacted subscription schedules that are still ongoing.
         * From this date, in 3 months, 8.21.24, subscription schedule code can be removed permanently.
         *
         * SCHEDULE SAFE CODE
         */
        if (typeof subscription_schedule_id !== 'string') {
            throw new Error('Invalid or missing subscription schedule ID');
        }

        const subscriptionSchedule =
            await stripe.subscriptionSchedules.retrieve(
                subscription_schedule_id
            );

        let current_phase = 0;
        const now = new Date();

        const epochTimeNow = convertDateToEpochTimestamp(now);

        if (subscriptionSchedule.phases[0].end_date < epochTimeNow) {
            current_phase = 1;
        }

        function mapSubscriptionScheduleToPhases(subscription_schedule: any) {
            if (current_phase === 0) {
                console.error('This should never be triggered');
                auditRenewalOrder(
                    renewal_order_id,
                    JSON.stringify({ subscription_schedule_id }),
                    'Current phase of 0 when updating renewal order'
                );
                throw new Error('Current phase is zero');
            } else {
                const newPhaseOneStartDate = epochTimeNow;

                const phaseZeroStartDate =
                    subscriptionSchedule.phases[0].start_date;
                const phaseZeroEndDate =
                    subscriptionSchedule.phases[0].end_date;

                const newPhaseOneEndDate =
                    subscriptionSchedule.phases[1].end_date +
                    epochTimeNow -
                    phaseZeroEndDate;

                return subscription_schedule.phases.map(
                    (
                        phase: Stripe.SubscriptionScheduleUpdateParams.Phase,
                        index: number
                    ) => {
                        return {
                            items: phase.items.map((item: any) => {
                                return {
                                    price: item.price,
                                    quantity: item.quantity,
                                };
                            }),
                            currency: phase.currency,
                            description: phase.description,
                            iterations: phase.iterations,
                            ...(index === 1
                                ? {
                                      start_date:
                                          subscriptionSchedule.phases[1]
                                              .start_date,
                                      end_date: newPhaseOneEndDate,
                                      proration_behavior: 'none',
                                      trial_end: newPhaseOneEndDate,
                                  }
                                : {
                                      end_date: phaseZeroEndDate,
                                      start_date: phaseZeroStartDate,
                                  }),
                            // Add any other properties from the phase object as needed
                        };
                    }
                );
            }
        }

        const updatedPhases =
            mapSubscriptionScheduleToPhases(subscriptionSchedule);

        const updated_subscription_schedule =
            await stripe.subscriptionSchedules.update(subscriptionSchedule.id, {
                phases: updatedPhases,
                proration_behavior: 'none',
            });

        return 'success';
    } catch (error) {
        console.error(
            'Error changing subscription renewal date for renewal order',
            error
        );
    }
}

function convertDateToEpochTimestamp(date: Date): number {
    return Math.floor(date.getTime() / 1000);
}

async function changeSubscriptionScheduleRenewalDate(
    subscription_schedule_id: string,
    new_end_date_epoch: number
) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

    try {
        const subscription_schedule =
            await stripe.subscriptionSchedules.retrieve(
                subscription_schedule_id
            );

        console.log(
            'SUPER SUBBY ======================== ',
            subscription_schedule
        );

        const current_phase = await getCurrentPhase(subscription_schedule);
        const now = new Date();

        console.log('current phase: ', current_phase);
        console.log('now epoch: ', now);

        const epochTimeNow = convertDateToEpochTimestamp(now);

        function mapSubscriptionScheduleToPhases(
            subscription_schedule: any
        ): any[] {
            // Assuming subscription_schedule.phases is an array of phase objects
            if (current_phase == 0) {
                return subscription_schedule.phases.map(
                    (
                        phase: Stripe.SubscriptionScheduleUpdateParams.Phase,
                        index: number
                    ) => {
                        return {
                            items: phase.items.map((item: any) => {
                                return {
                                    price: item.price,
                                    quantity: item.quantity,
                                };
                            }),
                            currency: phase.currency,
                            description: phase.description,
                            iterations: phase.iterations,
                            ...(index != 0
                                ? { start_date: new_end_date_epoch }
                                : {}),
                            ...(index === 0
                                ? {
                                      end_date: new_end_date_epoch,
                                      start_date: phase.start_date,
                                      trial_end: new_end_date_epoch,
                                  }
                                : {}),
                            // Add any other properties from the phase object as needed
                        };
                    }
                );
            } else {
                return subscription_schedule.phases
                    .filter((_: any, index: number) => index === 1)
                    .map(
                        (
                            phase: Stripe.SubscriptionScheduleUpdateParams.Phase
                        ) => {
                            return {
                                items: phase.items.map((item: any) => {
                                    return {
                                        price: item.price,
                                        quantity: item.quantity,
                                    };
                                }),
                                currency: phase.currency,
                                description: phase.description,
                                iterations: phase.iterations,
                                start_date: phase.start_date,
                                end_date: new_end_date_epoch,
                                trial_end: new_end_date_epoch,
                                proration_behavior: 'none',
                                // Add any other properties from the phase object as needed
                            };
                        }
                    );
            }
        }

        const updatedPhases = mapSubscriptionScheduleToPhases(
            subscription_schedule
        );

        const updated_subscription_schedule =
            await stripe.subscriptionSchedules.update(
                subscription_schedule.id,
                {
                    phases: updatedPhases,
                    proration_behavior: 'none',
                }
            );

        return 'success';
    } catch (error: any) {
        console.log(error);
        return 'failure';
    }
}

export async function getNextRenewalDateBySubscriptionId(
    subscription_id: string
) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

    try {
        const subscription = await stripe.subscriptions.retrieve(
            subscription_id
        );

        return subscription.current_period_end;
    } catch (error) {
        console.error('stripe Error: ', error);
        return -1;
    }
}

// export async function createSubscriptionInStripeV3(
//     orderId: number,
//     providerId: string
// ): Promise<{
//     result: 'failure' | 'success';
//     reason: string | null;
//     actually_paid?: boolean;
// }> {
//     /**
//      * Creating subscriptions in stripe consists of these parts:
//      *
//      * 1. Identifying and parsing order/patient information.
//      * 2. Creating subscription object and invoking stripe API
//      * 3. If order says to, apply coupon to the subscription with a one time duration
//      * 4. Pull the invoice and charge it immediately. Then check the status of the invoice.
//      * 5. Invoice paid => Progress and proceed.
//      * 6. Invoice unpaid => Mark it as having failed once in the metadata and update order status.
//      */

//     //retreive order data
//     const { data: orderData, error: orderDataError } =
//         await getAllOrderDataById(orderId);

//     if (orderDataError) {
//         console.log(
//             'Stripe Error, Type: Subscriptions, method: createSubscriptionInStripeV3, Cause: Order Data Retrieval Issue, Error: ',
//             orderDataError
//         );
//         return { result: 'failure', reason: 'supabase-error' };
//     }

//     //check if order is considered paid already (just in case)
//     if (orderData.order_status == 'Payment-Completed') {
//         console.log(
//             'Stripe Error, Type: Subscriptions, method: createSubscriptionInStripeV3, Cause: Record states payment was already made, Error: ',
//             'No specific code-origin error'
//         );
//         await createNewPaymentFailure(
//             orderId,
//             orderData.customer_uid,
//             null,
//             'Database records state payment was already made. [Subscription]'
//         );
//         return { result: 'failure', reason: 'already-paid' };
//     }

//     const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

//     const subscriptionList = await stripe.subscriptions.list({
//         customer: orderData.customer.stripe_customer_id,
//     });

//     // Check each subscription's metadata.order_id
//     for (const subscription of subscriptionList.data) {
//         if (subscription.metadata.order_id === orderData.id) {
//             console.log('Subscription already exists for this order.');
//             return { result: 'failure', reason: 'subscription-already-exists' };
//         }
//     }

//     try {
//         const subscription = await stripe.subscriptions.create({
//             customer: orderData.customer.stripe_customer_id,
//             items: [
//                 {
//                     price: orderData.price_id,
//                     quantity: 1,
//                 },
//             ],
//             payment_behavior: 'error_if_incomplete',
//             ...(orderData.discount_id && orderData.discount_id.length > 0
//                 ? { discounts: [{ coupon: orderData.discount_id[0] }] }
//                 : {}),
//             currency: 'usd',
//             ...(orderData.order_status === 'Payment-Declined'
//                 ? {}
//                 : {
//                       default_payment_method:
//                           orderData.stripe_metadata.paymentMethodId,
//                   }),
//             description: orderData.product.name + ' subscription',
//             metadata: {
//                 order_id: orderData.id,
//             },
//         });

//         let totalPrice: any = subscription.items.data[0].plan.amount;

//         const latestInvoiceId = subscription.latest_invoice;

//         if (latestInvoiceId) {
//             const invoice = await stripe.invoices.retrieve(
//                 latestInvoiceId.toString()
//             );

//             totalPrice = invoice.total;
//         }

//         if (totalPrice) {
//             const decimalPrice = (totalPrice / 100).toFixed(2);
//             const last4 = await fetchCardDigitsForSubscription(subscription.id);

//             await triggerEvent(orderData.customer_uid, ORDER_CONFIRMED, {
//                 date: await getCurrentDate(),
//                 id: orderId,
//                 paid: decimalPrice,
//                 last4,
//             });
//         }

//         const invoice = await stripe.invoices.retrieve(
//             String(subscription.latest_invoice)
//         );

//         await updateExistingOrderStatus(orderId, 'Payment-Completed');

//         const orderDataForSubscription: Order = {
//             orderId: orderData.id,
//             customer_uid: orderData.customer_uid,
//             product_href: orderData.product_href,
//             variant_text: orderData.variant_text,
//             subscription_type: orderData.subscription_type,
//             price_id: orderData.price_id,
//         };

//         //Add this subscription to supabase using given values.
//         await createSubscriptionWithOrderData(
//             orderDataForSubscription,
//             providerId,
//             subscription.id
//         );

//         return { result: 'success', reason: null, actually_paid: true };
//     } catch (error: any) {
//         await updateExistingOrderStatus(orderId, 'Payment-Declined');

//         console.log(
//             'This is the error. ',
//             error,
//             'only message: ',
//             error.message
//         );

//         //TODO put the script that creates payment failure audit here.
//         await createPaymentFailureAudit(
//             orderData.customer_uid,
//             orderData.id,
//             orderData.stripe_metadata.paymentMethodId,
//             error.message
//         );

//         // await createNewPaymentFailure(
//         //     orderId,
//         //     orderData.customer_uid,
//         //     {
//         //         subscription: subscription,
//         //     },
//         //     error.message
//         // );

//         return { result: 'failure', reason: 'payment-failed' };
//     }
// }

export async function updateSubscriptionProductAndDate(
    stripe_subscription_id: string,
    newProductName: string,
    new_price_id: string,
    date: Date
) {
    //Initialize Stripe
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

    try {
        //Obtain subscription in question from id. Supabase Subscription record <-> Stripe Subscription Object
        const subscription = await getStripeSubscription(
            stripe_subscription_id
        );

        //Construct a Date object that will be the end date for the next phase by adding 30 to the day that this will renew.
        //{date} is passed after user input - it is the epoch of when the subscription should renew next.
        const endDate = new Date(date);
        endDate.setDate(endDate.getDate() + 30);

        //Convert those dates to epochs to use in the setting of phases.
        const epochStartTime = convertDateToEpochTimestamp(date);
        const epochEndTime = convertDateToEpochTimestamp(endDate);

        //What to do if there is a pre-existing subscription schedule.
        if (subscription.schedule) {
            const subscriptionSchedule =
                await stripe.subscriptionSchedules.retrieve(
                    subscription.schedule.toString()
                );

            const currentPhase = await getCurrentPhase(subscriptionSchedule);
            console.log('currphase', currentPhase);

            // Split the phases into two, if necessary, based on the start time
            const newPhases: any[] = [];

            // Initialize with old phases first
            // for (var i = 0; i < currentPhase; i++) {
            //     const phase = subscriptionSchedule.phases[i];
            //     newPhases.push({
            //         items: phase.items.map((item: any) => {
            //             return {
            //                 price: item.price,
            //                 quantity: item.quantity,
            //             };
            //         }),
            //         currency: phase.currency,
            //         description: phase.description,
            //         start_date: phase.start_date,
            //         end_date: phase.end_date,
            //         collection_method: 'charge_automatically',
            //     });
            // }

            const existingPhase = subscriptionSchedule.phases[currentPhase];

            /**
             * Case 1: Update product before subscription renews, so modify the current phase and next phase
             * In ChargeCustomer V2 / Create Subscription V3 and below, all subscriptions made would've been on a subscription schedule already.
             * Following ChargeCustomer V3, all subscriptions start without a schedule, however whenever changes to renewal dates or other product changes occur
             * then a schedule will be created for the subscription.
             */

            // Phase before the change:
            // Mapping the previous phase's item, start date. Adding the NEW end date to be the start time of our new phase.
            // Important to include proration_behavior none.
            newPhases.push({
                items: existingPhase.items.map((item: any) => {
                    return {
                        price: item.price,
                        quantity: item.quantity,
                    };
                }),
                start_date: existingPhase.start_date,
                end_date: epochStartTime,
                proration_behavior: 'none',
                collection_method: 'charge_automatically',
            });

            // Phase after the change
            newPhases.push({
                items: [
                    {
                        price: new_price_id,
                        quantity: 1,
                    },
                ],
                start_date: epochStartTime,
                end_date: epochEndTime,
                proration_behavior: 'none',
                billing_cycle_anchor: 'phase_start',
                collection_method: 'charge_automatically',
            });

            console.log('final');
            console.log(newPhases);

            console.log(newPhases[0].items);
            console.log(newPhases[1].items);

            // return { toLog: [...newPhases] };

            await stripe.subscriptionSchedules.update(
                subscription.schedule.toString(),
                {
                    // @ts-ignore
                    phases: newPhases,
                    end_behavior: 'release',
                    proration_behavior: 'none',
                }
            );
            return true;
        } else {
            /* This code will be executed if there is NOT a SCHEDULE attached to the subscription.
             * In ChargeCustomer V2 / Create Subscription V3 and below, all subscriptions made would've been on a subscription schedule already.
             * Following ChargeCustomer V3, all subscriptions start without a schedule, however whenever changes to renewal dates or other product changes occur
             * then a schedule will be created for the subscription. */

            const subSchedule = await stripe.subscriptionSchedules.create({
                from_subscription: subscription.id,
            });

            const currentPhase = await getCurrentPhase(subSchedule);

            const scheduleStartDate =
                subSchedule.phases[currentPhase].start_date;

            await stripe.subscriptionSchedules.update(subSchedule.id, {
                /**
                 * Only 1 phase is necessary here. If there was only a subscription existent, then you can just change the subscription itself to
                 * contain the correct item, since there is no proration behavior.
                 *
                 * @editor Nathan Cho
                 * Added proration behavior 'none' in case that they swap from more expensive to less expensive.
                 * It would also bill the patient if they went from cheaper to more expensive.
                 */
                end_behavior: 'release',
                phases: [
                    {
                        items: [
                            {
                                price: new_price_id,
                                quantity: 1,
                            },
                        ],
                        end_date: epochEndTime,
                        start_date: scheduleStartDate,
                        billing_cycle_anchor: 'phase_start',
                        proration_behavior: 'none',
                    },
                ],
            });

            return true;
        }
    } catch (error: any) {
        console.error('changing subscription error: ', error);
        return false;
    }
}

export async function updateInternalSubscriptionProductAndDate(
    subscription_id: string,
    new_product_href: string,
    user_id: string
) {
    const supabase = createSupabaseServiceClient();

    //check if there is an existing, active subscription and if so, return an error.
    const { data: check_data, error: check_error } = await supabase
        .from('prescription_subscriptions')
        .select('*')
        .eq('patient_id', user_id)
        .eq('product_href', new_product_href)
        .eq('status', 'active');

    if (check_data && check_data.length > 0) {
        console.error('Found preexisting subscription value. Aborting.');
        return false;
    }

    //update for the new subscription.
    const { error } = await supabase
        .from('prescription_subscriptions')
        .update({
            product_href: new_product_href,
        })
        .eq('id', subscription_id);
}

export async function getCurrentPhase(
    schedule: Stripe.SubscriptionSchedule
): Promise<number> {
    const { current_phase, phases } = schedule;
    if (current_phase?.start_date && current_phase.end_date) {
        for (let i = 0; i < phases.length; i++) {
            if (
                phases[i].start_date === current_phase.start_date &&
                phases[i].end_date === current_phase.end_date
            ) {
                return i;
            }
        }
    }

    return -1;
}
