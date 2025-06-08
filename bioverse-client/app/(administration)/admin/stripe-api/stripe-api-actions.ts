'use server';

import {
    removeCustomerFromAllJourneys,
    triggerEvent,
} from '@/app/services/customerio/customerioApiFactory';
import {
    SUBSCRIPTION_CANCELED,
    SUBSCRIPTION_CANCELED_ANNUAL,
} from '@/app/services/customerio/event_names';
import {
    RenewalOrder,
    RenewalOrderTabs,
    RenewalOrderStatus,
} from '@/app/types/renewal-orders/renewal-orders-types';
import {
    getPrescriptionSubscription,
    getSubscriptionDetails,
    updatePrescriptionSubscription,
} from '@/app/utils/actions/subscriptions/subscription-actions';
import {
    createSupabaseServerComponentClient,
    createSupabaseServiceClient,
} from '@/app/utils/clients/supabaseServerClient';
import {
    addOrRemoveStatusFlags,
    getCancelationDetails,
    getStripeSubscriptionIdFromSubscription,
} from '@/app/utils/database/controller/prescription_subscriptions/prescription_subscriptions';
import {
    getAllRenewalOrdersForOriginalOrderId,
    getLatestRenewalOrderForSubscription,
    updateRenewalOrder,
    updateRenewalOrderByRenewalOrderId,
} from '@/app/utils/database/controller/renewal_orders/renewal_orders';
import { Status } from '@/app/types/global/global-enumerators';
import Stripe from 'stripe';
import {
    createUserStatusTagWAction,
    forwardOrderToEngineering,
} from '@/app/utils/database/controller/patient-status-tags/patient-status-tags-api';
import {
    StatusTag,
    StatusTagAction,
    StatusTagNotes,
} from '@/app/types/status-tags/status-types';
import { incorrectPriceIds } from '@/app/services/pharmacy-integration/variant-swap/glp1-stripe-price-id';
import {
    getVariantIndexByPriceIdV2,
    getPriceIdForProductVariant,
} from '@/app/utils/database/controller/products/products';

import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import { Environment } from '@/app/types/product-prices/product-prices-types';
import { convertEpochToDate } from '@/app/utils/functions/dates';
import { convertBundleVariantToSingleVariant } from '@/app/utils/functions/pharmacy-helpers/bundle-variant-index-mapping';
import { logPatientAction } from '@/app/utils/database/controller/patient_action_history/patient-action-history';
import { PatientActionTask } from '@/app/utils/database/controller/patient_action_history/patient-action-history-types';
import { PrescriptionSubscription } from '@/app/components/patient-portal/subscriptions/types/subscription-types';
import { updateTrackerStatusById } from '@/app/utils/database/controller/payment_failure_tracker/payment_failure_tracker-api';
import { createPaymentFailureAuditForRenewalOrder } from '@/app/utils/database/controller/payment_failure_audit/payment_failure_audit-api';
import { PaymentFailureStatus } from '@/app/utils/database/controller/payment_failure_tracker/payment_failure_tracker_enums';
import {
    getPriceDataRecordWithVariant,
    getProductVariantStripePriceIDsWithVariantIndex,
} from '@/app/utils/database/controller/product_variants/product_variants';
import { auditErrorToSupabase } from '@/app/utils/database/controller/site-error-audit/site_error_audit';
import { SITE_ERROR_IDENTIFIER } from '@/app/utils/database/controller/site-error-audit/site_error_identifiers';
import { ProductVariantController } from '@/app/utils/classes/ProductVariant/ProductVariantController';
import { USStates } from '@/app/types/enums/master-enums';
import {
    cancelAnnualShipmentTracking,
    checkSubscriptionIsAnnual,
} from '@/app/utils/functions/annual-glp1/annual-glp1-controller';

export async function getAllProductsForPriceAPIWithoutStripeProductId() {
    const supabase = await createSupabaseServerComponentClient();

    const { data: productsData, error: fetchError } = await supabase
        .from('products')
        .select('name, category, description_short, href, type')
        .is('stripe_product_id', null)
        .order('name', { ascending: true });

    if (fetchError) {
        console.log('Product Price API Error in fetching data.');
        console.log(fetchError.message);
        return { data: null, error: fetchError };
    }

    return { data: productsData, error: null };
}

export async function createNewProductInStripe(product: any) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});
    const supabase = await createSupabaseServerComponentClient();

    try {
        const madeProduct = await stripe.products.create({
            name: product.name,
            description: product.description_short,
            metadata: {
                category: product.category,
                type: product.type,
                href: product.href,
            },
            shippable: true,
        });

        const { data: productData, error } = await supabase
            .from('products')
            .update({
                stripe_product_id: madeProduct.id,
            })
            .eq('href', madeProduct.metadata.href)
            .select();

        return {
            product: product,
            madeProduct: madeProduct,
            productData: productData,
            error: error,
        };
    } catch (e: any) {
        console.log('failed creating a product for: ' + product.name);
        return null;
    }
}

export async function getProductDetailsForStripeAPI(productHref: string) {
    const supabase = await createSupabaseServerComponentClient();

    const { data: productData, error } = await supabase
        .from('products')
        .select('name, description_short, type, category, href')
        .eq('href', productHref)
        .single();

    if (error) {
        console.log(error);
        return { data: null, error: error };
    }

    return { data: productData, error: null };
}

// When calling this function, it is SAFE to assume that the last charge on this subscription should be refunded
export async function refundPatientForSubscription(
    user_id: string,
    subscription_id: number
): Promise<boolean> {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

    const { data: subscription, status } = await getSubscriptionDetails(
        subscription_id
    );

    if (status === Status.Failure) {
        console.error(
            'Failed to get subscription to refund patient for',
            subscription,
            subscription_id
        );
        return false;
    }

    const stripeSubscriptionId = subscription.stripe_subscription_id;

    // Get subscription

    const stripeSubscription = await getStripeSubscription(
        stripeSubscriptionId
    );

    // Get most recent invoice
    const latestInvoiceId = stripeSubscription.latest_invoice;

    if (!latestInvoiceId) {
        console.error(
            'Failed to get invoice id to refund patient for',
            subscription,
            subscription_id,
            stripeSubscription
        );
        return false;
    }
    const invoice = await stripe.invoices.retrieve(latestInvoiceId.toString());

    // Get charge amount

    if (!invoice.charge) {
        console.error(
            'Failed to get charge id to refund patient for',
            subscription,
            subscription_id,
            stripeSubscription
        );
        return false;
    }

    const refund = await stripe.refunds.create({
        charge: invoice.charge?.toString(),
    });

    if (refund.status === 'succeeded') {
        await logPatientAction(
            user_id,
            PatientActionTask.REFUNDED_SUBSCRIPTION,
            { subscription_id, charge_id: invoice.charge?.toString() }
        );
        console.log(
            'Successfully refunded patient post deny renewal order for subscription',
            subscription,
            stripeSubscription
        );
        return true;
    } else {
        console.error(
            'Failed to refund patient for subscription',
            subscription,
            stripeSubscription
        );
        return false;
    }
}

export async function checkSubscriptionEligibility(subscription_id: number) {
    const stripe_subscription_id =
        await getStripeSubscriptionIdFromSubscription(String(subscription_id));

    if (!stripe_subscription_id) {
        return false;
    }
    const subscription = await getStripeSubscription(stripe_subscription_id);

    return await checkRefundEligibility(subscription.current_period_end);
}

export async function checkRefundEligibility(current_period_end: number) {
    const endDate = new Date(current_period_end * 1000);
    const now = new Date();
    const lastEligibleDate = new Date(endDate);
    lastEligibleDate.setDate(lastEligibleDate.getDate() - 2);

    const isEligibleForRefund = now < lastEligibleDate;
    return isEligibleForRefund;
}

// If < 2 days before subscriptions renews, cancel after they are charged
// Otherwise, set to cancel the subscription upon the next billing date
// Set subscription and renewal order status (if one is found, we will NEVER have to update an Order's status) to
// scheduled_cancel (with / without admin as necessary)
export async function cancelSubscriptionStripeAndDatabase(
    subscriptionId: number,
    stripeSubscriptionId: string,
    adminCancel: boolean = false
) {
    // const supabase = createSupabaseServiceClient();
    // console.log('Attempting to cancel subscription', stripeSubscriptionId);

    try {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

        const subscription = await stripe.subscriptions.retrieve(
            stripeSubscriptionId
        );

        // Determine if their eligible for skipping to pay (idk why I called it refund) (> 2 days before subscription renews)
        const isEligibleForRefund = await checkRefundEligibility(
            subscription.current_period_end
        );
        console.log('is eligible', isEligibleForRefund);

        // If it is within two day window, attach metadata to subscription, do nothing else
        if (!isEligibleForRefund) {
            await stripe.subscriptions.update(stripeSubscriptionId, {
                metadata: { cancel_after_paid: 'true' },
            });
            return { success: true, isEligibleForRefund: false };
        }

        const res = await safeCancelSubscription(
            subscription,
            subscriptionId,
            adminCancel
        );

        if (res.success) {
            console.log(
                'Successfully Cancelled subscription',
                stripeSubscriptionId,
                subscriptionId
            );
        } else {
            console.log(
                'Error cancelling subscription',
                stripeSubscriptionId,
                subscriptionId
            );
        }

        return { success: res.success, isEligibleForRefund };
    } catch (error) {
        console.error(
            'Failed to cancel subscription',
            error,
            stripeSubscriptionId
        );
        return { success: false };
    }
}

export async function cancelStripeSubscriptionManualOrder(
    subscription: PrescriptionSubscription
) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

    const stripeSub = await getStripeSubscription(
        subscription.stripe_subscription_id
    );

    if (stripeSub.schedule) {
        await stripe.subscriptionSchedules.release(
            stripeSub.schedule.toString()
        );
    }

    await stripe.subscriptions.update(stripeSub.id, {
        cancel_at_period_end: true,
    });

    const latestRenewalOrder = await getLatestRenewalOrderForSubscription(
        subscription.id
    );

    if (
        latestRenewalOrder &&
        latestRenewalOrder.order_status !==
            RenewalOrderStatus.PharmacyProcessing
    ) {
        await updateRenewalOrder(latestRenewalOrder.id, {
            order_status: RenewalOrderStatus.Scheduled_Admin_Cancel,
        });
    }

    await updatePrescriptionSubscription(subscription.id, {
        status: 'scheduled-cancel',
    });
}

export async function cancelStripeSubscriptionOnly(subscription_id: number) {
    try {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

        const subscription = await getPrescriptionSubscription(subscription_id);

        if (!subscription) {
            throw Error('Could not find subscription');
        }

        const stripe_subscription_id =
            await getStripeSubscriptionIdFromSubscription(subscription_id);

        await stripe.subscriptions.cancel(subscription.stripe_subscription_id);
    } catch (error) {
        console.error(
            'Error cancelling stripe subscription',
            subscription_id,
            error
        );
    }
}

export async function cancelStripeSubscriptionImmediately(
    stripe_subscription_id: string
) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});
    await stripe.subscriptions.cancel(stripe_subscription_id);
}

export async function refundLastPaidInvoiceForSubscription(
    stripe_subscription_id: string
) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

    // Fetch all invoices for the subscription
    const invoices = await stripe.invoices.list({
        subscription: stripe_subscription_id,
        limit: 10, // Increase limit if necessary
    });

    const lastInvoice = invoices.data
        .filter((invoice) => invoice.amount_paid > 0)
        .sort((a, b) => b.created - a.created)[0];

    await stripe.refunds.create({
        payment_intent: lastInvoice.payment_intent?.toString(),
        amount: lastInvoice.amount_paid,
    });
}

// Cancels stripe subscription and prescription_subscriptions and updates latest renewal order stauts
export async function safeCancelSubscription(
    subscription: Stripe.Subscription,
    subscriptionId: number,
    adminCancel: boolean = false
): Promise<{ success: boolean }> {
    try {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});
        const supabase = createSupabaseServiceClient();

        /**
         * 5.21.24 - Nathan Cho: This subcsription schedule code is considered safe.
         * Required to remove subscription schedule dependency on this date.
         * This code remains in order to function with depreacted subscription schedules that are still ongoing.
         * From this date, in 3 months, 8.21.24, subscription schedule code can be removed permanently.
         *
         * SCHEDULE SAFE CODE
         *
         * Currently, schedule cancellations don't cancel at the end of the PHASE, but just at the end of the next 'billing cycle'.
         *
         */
        const subscriptionScheduleID = subscription.schedule;
        if (subscriptionScheduleID) {
            console.log('releasing schedule', subscriptionScheduleID);
            await stripe.subscriptionSchedules.release(
                subscriptionScheduleID.toString()
            );
        }
        await stripe.subscriptions.update(subscription.id, {
            cancel_at_period_end: true,
        });

        // Cancel latest renewal order (if necessary)
        const latestRenewalOrder = await getLatestRenewalOrderForSubscription(
            subscriptionId
        );

        // if (!isEmpty(latestRenewalOrder) && latestRenewalOrder) {
        //     await updateRenewalOrder(latestRenewalOrder.id, {
        //         order_status: adminCancel
        //             ? RenewalOrderStatus.Scheduled_Admin_Cancel
        //             : RenewalOrderStatus.Scheduled_Cancel,
        //     });
        //     switch (latestRenewalOrder.order_status) {
        //         case RenewalOrderStatus.Incomplete:
        //         case RenewalOrderStatus.CheckupComplete_Unprescribed_Unpaid:
        //         case RenewalOrderStatus.CheckupComplete_Prescribed_Unpaid:
        //             console.log(
        //                 'Updating renewal order status for cancellation',
        //                 latestRenewalOrder,
        //             );
        //             await updateRenewalOrder(latestRenewalOrder.id, {
        //                 order_status: adminCancel
        //                     ? RenewalOrderStatus.Scheduled_Admin_Cancel
        //                     : RenewalOrderStatus.Scheduled_Cancel,
        //             });
        //     }
        // }

        const { data, error } = await supabase
            .from('prescription_subscriptions')
            .update({ status: 'scheduled-cancel' })
            .eq('id', subscriptionId);

        const cancelationDetails = await getCancelationDetails(subscriptionId);

        if (!cancelationDetails.name || !cancelationDetails.patient_id) {
            console.error(
                'Error sending cancelation customerio event',
                subscriptionId
            );
            return { success: false };
        }

        if (latestRenewalOrder?.renewal_order_id) {
            await createUserStatusTagWAction(
                StatusTag.Resolved,
                latestRenewalOrder?.renewal_order_id,
                StatusTagAction.INSERT,
                latestRenewalOrder.customer_uuid,
                StatusTagNotes.CanceledResolved,
                'ffabc905-5508-4d54-98fb-1e2ef2b9e99a',
                [StatusTag.Resolved]
            );
        }

        const isAnnualSubscription = await checkSubscriptionIsAnnual(
            subscriptionId
        );

        if (isAnnualSubscription) {
            await cancelAnnualShipmentTracking(subscriptionId);
            await triggerEvent(
                cancelationDetails.patient_id,
                SUBSCRIPTION_CANCELED_ANNUAL,
                { name: cancelationDetails.name }
            );

            const invoices = await stripe.invoices.list({
                subscription: subscription.id,
                limit: 10, // Increase limit if necessary
            });

            const paymentIntent = invoices.data[0].payment_intent;

            const doubleAmountToRefundForAnnualTotal = invoices.data[0].total;
            const halfToRefundForPatient =
                Math.round((doubleAmountToRefundForAnnualTotal / 200) * 100) /
                100;

            await refundStripePaymentIntentWithAmount(
                subscription.customer as string,
                paymentIntent as string,
                halfToRefundForPatient
            );
        } else {
            await triggerEvent(
                cancelationDetails.patient_id,
                SUBSCRIPTION_CANCELED,
                { name: cancelationDetails.name }
            );
        }

        await removeCustomerFromAllJourneys(cancelationDetails.patient_id);
        return { success: true };
    } catch (error) {
        console.error(
            'Error safe cancelling subscription',
            subscription,
            error
        );
        return { success: false };
    }
}

export async function getStripeSubscription(stripe_subscription_id: string) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

    const subscription = await stripe.subscriptions.retrieve(
        stripe_subscription_id
    );

    return subscription;
}

// export async function createPriceInStripeForPriceRecord(
//     priceRecord: any,
//     variantIndex: number,
//     productHref: string,
// ) {
//     const supabase = await createSupabaseServerComponentClient();

//     //get all price records
//     const { data: records, error: fetchError } = await supabase
//         .from('product_prices')
//         .select(
//             `
//             *,
//             product:products!product_href(
//                 name,
//                 stripe_product_id
//             )
//             `,
//         )
//         .eq('product_href', productHref)
//         .eq('variant_index', variantIndex);

//     if (fetchError) {
//         console.log('fetch error', fetchError.message);
//         return;
//     }

//     const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

//     for (let i = 0; i < records.length; i++) {
//         const record = records[i];
//         const productId = record.product.stripe_product_id;

//         //Check if the column data is applicable, and if it is then set it.
//         if (record.one_time !== null) {
//             const one_time_price_attributes = {
//                 currency: 'usd',
//                 metadata: {
//                     product_name: record.product.name,
//                     cadence: 'one_time',
//                     variant: record.variant,
//                 },
//                 nickname:
//                     record.product.name +
//                     ' ' +
//                     record.variant +
//                     ' ' +
//                     'one-time purchase price',
//                 unit_amount: record.one_time.product_price * 100,
//                 product: productId,
//             };

//             const price = await stripe.prices.create(one_time_price_attributes);
//             console.log(
//                 'price for one-time: ' +
//                     record.product.name +
//                     ' has been created.',
//             );
//         }

//         if (record.monthly !== null) {
//             const price = await stripe.prices.create({
//                 currency: 'usd',
//                 metadata: {
//                     product_name: record.product.name,
//                     cadence: 'monthly',
//                     variant: record.variant,
//                 },
//                 nickname:
//                     record.product.name +
//                     ' ' +
//                     record.variant +
//                     ' ' +
//                     'monthly purchase price',
//                 unit_amount: record.monthly.product_price * 100,
//                 product: productId,
//                 recurring: {
//                     interval: 'month',
//                 },
//             });
//             console.log(
//                 'price for monthly: ' +
//                     record.product.name +
//                     ' has been created.',
//             );
//         }

//         if (record.quarterly !== null) {
//             const price = await stripe.prices.create({
//                 currency: 'usd',
//                 metadata: {
//                     product_name: record.product.name,
//                     cadence: 'quarterly',
//                     variant: record.variant,
//                 },
//                 nickname:
//                     record.product.name +
//                     ' ' +
//                     record.variant +
//                     ' ' +
//                     'quarterly purchase price',
//                 unit_amount: record.quarterly.product_price * 100,
//                 product: productId,
//                 recurring: {
//                     interval: 'month',
//                     interval_count: 3,
//                 },
//             });
//             console.log(
//                 'price for quarterly: ' +
//                     record.product.name +
//                     ' has been created.',
//             );
//         }
//     }
// }

export async function toggleDelayedForStripeSubscription(
    stripe_subscription_id: string,
    value: 'true' | 'false'
) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

    await stripe.subscriptions.update(stripe_subscription_id, {
        metadata: {
            delayed: value,
        },
    });
}

export async function detachAllPaymentMethodsForCustomer(
    stripe_customer_id: string
) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});
    const paymentMethods = await stripe.paymentMethods.list({
        type: 'card',
        customer: stripe_customer_id,
    });

    for (const pm of paymentMethods.data) {
        const id = pm.id;
        await stripe.paymentMethods.detach(id);
    }
}

export async function getSubscriptionRenewalDate(subscription_id: number) {
    const subscription = await getPrescriptionSubscription(subscription_id);

    if (!subscription) {
        return '';
    }

    const stripeSubscription = await getStripeSubscription(
        subscription.stripe_subscription_id
    );

    const endDate = stripeSubscription.current_period_end;

    const endDateFormatted = convertEpochToDate(endDate);

    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };
    const formattedDate = endDateFormatted.toLocaleDateString('en-US', options);

    return formattedDate;
}

export async function shouldRefundCustomer(
    old_price_id: string,
    new_price_id: string
) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

    const oldPrice = await stripe.prices.retrieve(old_price_id);
    const newPrice = await stripe.prices.retrieve(new_price_id);

    if (!oldPrice.unit_amount || !newPrice.unit_amount) {
        console.error('Error in getting unit amount for refund');
        return false;
    }

    if (newPrice.unit_amount >= oldPrice.unit_amount) {
        return false;
    }

    return true;
}

// Refunds the price difference by going through all the customer's successful charges
export async function refundCustomerForPriceDifference(
    stripe_customer_id: string,
    stripe_subscription_id: string,
    old_price_id: string,
    new_price_id: string
) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

    const oldPrice = await stripe.prices.retrieve(old_price_id);
    const newPrice = await stripe.prices.retrieve(new_price_id);

    if (!oldPrice.unit_amount || !newPrice.unit_amount) {
        console.error(
            'Error in getting unit amount for refund',
            stripe_customer_id
        );
        return Status.Error;
    }

    let amountToRefund = oldPrice.unit_amount - newPrice.unit_amount;

    if (amountToRefund <= 0) {
        console.error('Nothing to refund error', stripe_customer_id);
        return Status.Error;
    }

    const invoices = await stripe.invoices.list({
        subscription: stripe_subscription_id,
        limit: 10, // Increase limit if necessary
    });

    const filteredInvoices = invoices.data
        .filter(
            (invoice) =>
                invoice.amount_paid > 0 && invoice.payment_intent?.toString()
        )
        .sort((a, b) => b.created - a.created);

    if (amountToRefund <= 0) {
        return Status.Failure;
    }

    for (const invoice of filteredInvoices) {
        if (amountToRefund <= 0) {
            break;
        }

        if (!invoice.paid) {
            continue;
        }

        const totalChargeAmount = invoice.amount_paid;

        if (amountToRefund <= totalChargeAmount) {
            return await refundStripePaymentIntentWithAmount(
                stripe_customer_id,
                invoice.payment_intent!.toString(),
                amountToRefund
            );
        } else {
            const refundStatus = await refundStripePaymentIntentWithAmount(
                stripe_customer_id,
                invoice.payment_intent!.toString(),
                totalChargeAmount
            );

            if (refundStatus === Status.Failure) {
                return Status.Failure;
            }
            amountToRefund -= totalChargeAmount;
        }
    }
    if (amountToRefund === 0) {
        return Status.Success;
    }
    return Status.Failure;
}

export async function refundStripePaymentIntentWithAmount(
    stripe_customer_id: string,
    payment_intent_id: string,
    amount: number
) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

    const refund = await stripe.refunds.create({
        payment_intent: payment_intent_id,
        amount,
    });

    const customer = await stripe.customers.retrieve(stripe_customer_id);

    if (customer.deleted) {
        return Status.Failure;
    }

    if (customer.balance < 0) {
        const availableCustomerCredit = -customer.balance;

        if (amount > availableCustomerCredit) {
            await stripe.customers.createBalanceTransaction(
                stripe_customer_id,
                {
                    amount: availableCustomerCredit,
                    currency: 'USD',
                }
            );
        } else {
            await stripe.customers.createBalanceTransaction(
                stripe_customer_id,
                {
                    amount: amount,
                    currency: 'USD',
                }
            );
        }
    }

    if (refund.status === 'succeeded') {
        return Status.Success;
    }
    return Status.Failure;
}

export async function refundStripeCharge(
    stripe_customer_id: string,
    charge_id: string,
    amount: number
): Promise<Status> {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

    const refund = await stripe.refunds.create({
        charge: charge_id,
        amount,
    });

    const customer = await stripe.customers.retrieve(stripe_customer_id);

    if (customer.deleted) {
        return Status.Failure;
    }

    // Check if should clear credit balance post refund
    if (customer.balance < 0) {
        const availableCustomerCredit = -customer.balance;

        if (amount > availableCustomerCredit) {
            await stripe.customers.createBalanceTransaction(
                stripe_customer_id,
                {
                    amount: availableCustomerCredit,
                    currency: 'USD',
                }
            );
        } else {
            await stripe.customers.createBalanceTransaction(
                stripe_customer_id,
                {
                    amount: amount,
                    currency: 'USD',
                }
            );
        }
    }

    if (refund.status === 'succeeded') {
        return Status.Success;
    }
    return Status.Failure;
}

export async function getLastInvoiceBeforeRenewal(
    stripe_subscription_id: string,
    current_invoice_id: string
) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

    try {
        const subscription = await stripe.subscriptions.retrieve(
            stripe_subscription_id
        );

        // Fetch all invoices for the subscription
        const invoices = await stripe.invoices.list({
            subscription: stripe_subscription_id,
            limit: 10, // Increase limit if necessary
        });

        // Find the most recent invoice with amount > 0, created before the current period start, excluding the current invoice
        const lastInvoice = invoices.data
            .filter(
                (invoice) =>
                    invoice.id !== current_invoice_id && invoice.amount_paid > 0
            )
            .sort((a, b) => b.created - a.created)[0]; // Sort descending by creation date

        if (!lastInvoice) {
            console.log(
                'No suitable invoice found before the subscription renewal.'
            );
            return null;
        }

        const price_id = lastInvoice?.lines?.data[0]?.price?.id;

        return price_id;
    } catch (error: any) {
        console.error(
            'Error getting last invoice for ',
            stripe_subscription_id,
            error
        );
        return null;
    }
}

export async function getStaticRefillDate(stripe_subscription_id: string) {
    const stripeSubscription = await getStripeSubscription(
        stripe_subscription_id
    );

    const startDate = stripeSubscription.current_period_start; // in UNIX timestamp (seconds)

    // Get the subscription's interval
    const interval = stripeSubscription.items.data[0].plan.interval; // "month" or "year"
    const intervalCount = stripeSubscription.items.data[0].plan.interval_count; // e.g., 1 (monthly), 12 (yearly)

    // Create a JavaScript Date object from the start date
    let oldRefillDate = new Date(startDate * 1000); // convert to milliseconds

    // Add the billing interval to the start date to get the first renewal date after the trial
    if (interval === 'month') {
        oldRefillDate.setMonth(oldRefillDate.getMonth() + intervalCount);
    } else if (interval === 'year') {
        oldRefillDate.setFullYear(oldRefillDate.getFullYear() + intervalCount);
    }

    return oldRefillDate;
}

export async function getStripePriceId(price_id: string) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

    const price = await stripe.prices.retrieve(price_id);

    return price;
}

export async function changeRefillDate(
    renewalOrder: RenewalOrder,
    stripe_subscription_id: string,
    newEndDateEpoch: number,
    weeks: number
) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

    const stripeSubscription = await getStripeSubscription(
        stripe_subscription_id
    );

    if (stripeSubscription.schedule) {
        await stripe.subscriptionSchedules.release(
            stripeSubscription.schedule.toString()
        );
    }

    const single_variant_index = convertBundleVariantToSingleVariant(
        renewalOrder.product_href,
        renewalOrder.variant_index
    );

    let new_price_id;
    console.log(
        'Nathan your check for the environments value',
        process.env.NEXT_PUBLIC_ENVIRONMENT
    );

    try {
        const price_id_from_db = await getPriceIdForProductVariant(
            renewalOrder.product_href,
            single_variant_index,
            process.env.NEXT_PUBLIC_ENVIRONMENT! as Environment
        );

        if (price_id_from_db) {
            new_price_id = price_id_from_db;
        }
    } catch (error) {
        console.error(
            'Could not identify new price id from incoming variant index',
            renewalOrder,
            single_variant_index
        );
    }

    const subscriptionSchedule = await stripe.subscriptionSchedules.create({
        from_subscription: stripe_subscription_id,
    });

    await stripe.subscriptionSchedules.update(subscriptionSchedule.id, {
        phases: [
            {
                items: [
                    {
                        price: stripeSubscription.items.data[0].price.id,
                        quantity: 1,
                    },
                ],
                start_date: subscriptionSchedule.current_phase?.start_date,
                end_date: newEndDateEpoch,
                trial: true,
            },
            {
                items: [
                    {
                        price:
                            weeks === -1
                                ? stripeSubscription.items.data[0].price.id
                                : new_price_id,
                        quantity: 1,
                    },
                ],
                start_date: newEndDateEpoch,
            },
        ],
        proration_behavior: 'none',
    });

    await stripe.subscriptions.update(stripe_subscription_id, {
        metadata: {
            delayed: 'true',
        },
    });
}

/**
 * updateStripeProduct
 *
 * Checks if the existing stripe subscription cadence is the same as the new one, if it is, we can just update the subscription with the new variant index/price id
 * If the cadences are different, we need to update those things in addition to updating the subscription schedule.
 * Designed to ONLY return Status.Error if the subscription or renewal order is not found. Otherwise, any issues will make it to the eng queue directly
 *
 * @param subscription_id
 * @param incoming_variant_index the variant index that they selected in dosage selection to update to.
 * @param hasPaid whether they have already paid, so an immediate reboot is needed.
 * @param shouldCreateJobAfterPaid
 */
export async function updateStripeProduct(
    subscription_id: number,
    incoming_variant_index: number, //the variant index that they selected in dosage selection to update to.
    hasPaid: boolean,
    shouldCreateJobAfterPaid: boolean = true
) {
    const subscription = await getPrescriptionSubscription(subscription_id);

    if (!subscription) {
        console.error(
            'Could not find subscription from subscription_id',
            subscription_id
        );
        return Status.Error;
    }

    const renewalOrder = await getLatestRenewalOrderForSubscription(
        subscription.id
    );

    /**
     * Nathan adding this Feb 13, 2025: The variant index we set to is now also dependent on the state.
     * Until subscription table data is up to date with the user's state of residence, we need to fetch renewal order
     * so we can do a state check to PVC.
     */
    if (!renewalOrder) {
        console.error(
            'Could not find renewal orer from subscription_id',
            subscription_id
        );
        return Status.Error;
    }

    if (incoming_variant_index === -1) {
        await forwardOrderToEngineering(
            String(subscription.order_id),
            subscription.patient_id,
            'Failed to update stripe product, variant index -1'
        );
        return;
    }

    //if they fill out dosage selection AFTER they have already paid, we reboot the subscription immediately
    if (hasPaid) {
        //make sure the status flags get wiped after subscription reboot!
        // const amountToCredit = await getAmountToCredit(subscription.id); //add credit equalling the amount charged
        // const rebootStatus = await rebootSubscription(
        //     incoming_variant_index,
        //     renewalOrder,
        //     'immediate',
        //     amountToCredit ? amountToCredit : 0;
        // );
        // if (rebootStatus = Status.Error) {
        //     await forwardOrderToEngineering(
        //         String(subscription.order_id),
        //         subscription.patient_id,
        //         'Subscription reboot failed'
        //     );
        //     return;
        // await wipeStatusFlags(subscription.id); //the only status flag should be NO_CHECK_IN_HOLD_PENDING_DS at this point, so wipe that
        await forwardOrderToEngineering(
            String(subscription.order_id),
            subscription.patient_id,
            'Subscription reboot needed, Ben should take a look at this'
        );
        return;
    }

    console.log('incoming_variant_index', incoming_variant_index);

    try {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

        let variant_index = incoming_variant_index;

        //let the PVC convert the chosen variant index to the correct variant index for the patient
        const product_variant_controller = new ProductVariantController(
            subscription.product_href as PRODUCT_HREF,
            incoming_variant_index,
            renewalOrder.state as USStates
        );

        const pvc_result =
            product_variant_controller.getConvertedVariantIndex();

        if (!pvc_result.variant_index) {
            console.error(
                'Stripe API Actions, PVC could not find eligible variant index - product href | variant index | state of residence',
                subscription.product_href as PRODUCT_HREF,
                incoming_variant_index,
                renewalOrder.state as USStates
            );

            throw new Error(
                'Stripe API Actions, PVC could not find eligible variant index - product href | variant index | state of residence'
            );
        } else {
            variant_index = pvc_result.variant_index; //this is the variant index that we will use to update the stripe subscription
        }

        let new_price_id; //now we need to get the price id for that^ new variant index

        const async_price_ids =
            await getProductVariantStripePriceIDsWithVariantIndex(
                subscription.product_href as PRODUCT_HREF,
                variant_index
            );
        if (!async_price_ids) {
            console.error(
                'Could not identify new price id from incoming variant index',
                subscription_id,
                variant_index,
                hasPaid
            );
            throw new Error(
                'Could not identify new price id from incoming variant index'
            );
        }

        //set new_price_id to the price id for the new variant index that the patient chose (post-PVC conversion)
        try {
            new_price_id =
                async_price_ids[
                    process.env.NEXT_PUBLIC_ENVIRONMENT! as Environment
                ];
        } catch (error) {
            console.error(
                'Could not identify new price id from incoming variant index',
                subscription_id,
                variant_index,
                hasPaid
            );
            throw new Error(
                'async_price_ids[process.env.NEXT_PUBLIC_ENVIRONMENT! as Environment] is undefined' //added May 5, 2025
            );
        }

        if (!new_price_id) {
            console.error(
                'Could not identify new price id from incoming variant index',
                subscription_id,
                variant_index,
                hasPaid
            );
            await forwardOrderToEngineering(
                String(subscription.order_id),
                subscription.patient_id,
                'updateStripeProduct Could not identify new price id from incoming variant index'
            );
            return;
        }

        const stripeSubscription = await getStripeSubscription(
            subscription.stripe_subscription_id
        );

        const renewalOrders = await getAllRenewalOrdersForOriginalOrderId(
            String(subscription.order_id)
        );

        if (!renewalOrders) {
            console.error(
                'Could not get renewal orders for customer',
                subscription
            );
            await forwardOrderToEngineering(
                String(subscription.order_id),
                subscription.patient_id,
                'Could not get renewal orders for customer'
            );
            return;
        }

        const old_price_id = stripeSubscription.items.data[0].price.id; //the priceID of the currrent subscription

        const lastUsedVariantIndex = await getVariantIndexByPriceIdV2(
            //the variant index associated with the priceID of the current subscription
            subscription.product_href as PRODUCT_HREF,
            old_price_id
        );

        const oldProductPrice = await getPriceDataRecordWithVariant(
            //the 'product_variants' table record associated with the priceID of the current subscription
            subscription.product_href,
            lastUsedVariantIndex.variant_index
        );
        const newProductPrice = await getPriceDataRecordWithVariant(
            //the 'product_variants' table record associated with the new PVC-converted variant index that the patient chose
            subscription.product_href,
            variant_index
        );

        //if the subscription has a schedule, release it (cancel the schedule)
        if (stripeSubscription.schedule) {
            await stripe.subscriptionSchedules.release(
                stripeSubscription.schedule.toString()
            );
        }

        // If same cadencies, don't need to use subscription schedule
        if (
            oldProductPrice?.cadence === newProductPrice?.cadence &&
            !incorrectPriceIds.includes(old_price_id)
        ) {
            await stripe.subscriptions.update(stripeSubscription.id, {
                items: [
                    {
                        id: stripeSubscription.items.data[0].id,
                        price: new_price_id,
                    },
                ],
                billing_cycle_anchor: 'unchanged',
                proration_behavior: 'none',
            });
        } else {
            // If the existing and chosen offers are different cadencies - create subscription schedule

            /* *
             * This is the key logic in updateStripeProduct.
             * We are making it such that the NEXT renewal invoice will be for new_price_id, which is
             * the pvc result of the incoming_variant_index parameter.
             * We schedule this update with a subscription schedule.
             * The current subscription price and cadence stay the same.
             * */
            const subscriptionSchedule =
                await stripe.subscriptionSchedules.create({
                    from_subscription: stripeSubscription.id,
                });

            await stripe.subscriptionSchedules.update(subscriptionSchedule.id, {
                phases: [
                    {
                        items: [
                            {
                                price: stripeSubscription.items.data[0].price
                                    .id,
                                quantity: 1,
                            },
                        ],
                        start_date:
                            subscriptionSchedule.current_phase?.start_date,
                        end_date: subscriptionSchedule.current_phase?.end_date,
                        trial: true,
                    },
                    {
                        items: [
                            {
                                price: new_price_id,
                                quantity: 1,
                            },
                        ],
                        start_date:
                            subscriptionSchedule.current_phase?.end_date,
                    },
                ],
                proration_behavior: 'none',
                end_behavior: 'release',
            });
        }
        return Status.Success;
    } catch (error) {
        console.error('Error updating stripe product', error);
        await forwardOrderToEngineering(
            String(subscription.order_id),
            subscription.patient_id,
            `Failed to update stripe product ${subscription_id} ${incoming_variant_index} ${error}`
        );
        await auditErrorToSupabase(
            SITE_ERROR_IDENTIFIER.update_stripe_product,
            `Failed to update stripe product ${subscription_id} ${incoming_variant_index}`,
            error
        );
        return Status.Failure;
    }
} //end of updateStripeProduct

export async function updateStripeSubscriptionAfterPaid(
    stripe_subscription_id: string,
    old_price_id: string,
    new_price_id: string,
    shouldCreateJobAfterPaid: boolean
) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

    const subscription = await stripe.subscriptions.retrieve(
        stripe_subscription_id
    );

    const oldPrice = await stripe.prices.retrieve(old_price_id);
    const newPrice = await stripe.prices.retrieve(new_price_id);

    if (!newPrice.unit_amount || !oldPrice.unit_amount) {
        throw new Error(`New price ${newPrice.id} has no unit_amount.`);
    }

    const oldPriceAmount = oldPrice.unit_amount; // in cents
    const newPriceAmount = newPrice.unit_amount; // in cents
    const difference = newPriceAmount - oldPriceAmount; // could be positive or negative
    const absoluteDifference = Math.abs(difference);

    const product_id =
        process.env.NEXT_PUBLIC_ENVIRONMENT === 'prod'
            ? 'prod_RYzKIQojNaAm5j'
            : 'prod_RYYatwt9QbZdT0';

    // 4) If new product is more expensive, charge the difference
    if (difference > 0) {
        await stripe.subscriptions.update(subscription.id, {
            items: [
                {
                    id: subscription.items.data[0].id,
                    price: new_price_id,
                },
            ],
            proration_behavior: 'none',
            add_invoice_items: [
                {
                    price_data: {
                        currency: 'USD',
                        product: product_id,
                        unit_amount: -oldPrice.unit_amount,
                    },
                },
            ],
            ...(shouldCreateJobAfterPaid && {
                metadata: {
                    process_next_zero_invoice_paid: 'true',
                },
            }),
        });
    } else if (difference < 0) {
        console.log('LESS EXP');
        // If the new product is cheaper, we do a partial refund on the last invoice
        // Grab the last invoice ID from subscription.latest_invoice
        // await stripe.invoiceItems.create({
        //     customer: subscription.customer as string,
        //     amount: -newPriceAmount, // positive => charge
        //     currency: newPrice.currency,
        //     description: `Waive new charge for customer: ${newPrice.id}`,
        //     subscription: stripe_subscription_id,
        // });

        await stripe.subscriptions.update(subscription.id, {
            add_invoice_items: [
                {
                    price_data: {
                        currency: 'USD',
                        product: product_id,
                        unit_amount: -newPrice.unit_amount,
                    },
                },
            ],
            ...(shouldCreateJobAfterPaid && {
                metadata: {
                    process_next_zero_invoice_paid: 'true',
                },
            }),
        });

        // if (!subscription.latest_invoice) {
        //     throw new Error(
        //         `No latest_invoice found on subscription ${subscription.id}`,
        //     );
        // }

        // Retrieve the last invoice to get its PaymentIntent
        const shouldRefund = await shouldRefundCustomer(
            old_price_id,
            new_price_id!
        );

        if (shouldRefund) {
            await refundCustomerForPriceDifference(
                subscription.customer.toString(),
                subscription.id,
                old_price_id,
                new_price_id
            );
        }
        const updatedSubscription = await stripe.subscriptions.update(
            stripe_subscription_id,
            {
                items: [
                    {
                        id: subscription.items.data[0].id,
                        price: new_price_id,
                    },
                ],
                proration_behavior: 'none',
            }
        );
    } else {
        const updatedSubscription = await stripe.subscriptions.update(
            stripe_subscription_id,
            {
                items: [
                    {
                        id: subscription.items.data[0].id,
                        price: new_price_id,
                    },
                ],
                proration_behavior: 'none',
            }
        );
    }

    // 5) Finally, update the subscription to use the new price with proration_behavior='none'
}

export async function updateStripeProductWithProduct(
    subscription: PrescriptionSubscription,
    variant_index: number,
    hasPaid: boolean
) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

    let new_price_id;
    console.log(
        'Nathan your check for the environments value',
        process.env.NEXT_PUBLIC_ENVIRONMENT
    );
    try {
        const price_id_from_db = await getPriceIdForProductVariant(
            subscription.product_href,
            variant_index,
            process.env.NEXT_PUBLIC_ENVIRONMENT! as Environment
        );

        if (price_id_from_db) {
            new_price_id = price_id_from_db;
        }
    } catch (error) {
        console.error(
            'Nathan the code you wrote has found the issue on lock in.',
            error
        );
    }

    if (!new_price_id) {
        console.error(
            'Could not identify new price id from incoming variant index',
            subscription.id,
            variant_index,
            hasPaid
        );
    }

    console.log('Nathan you fixed it by technicality. Look for this log');

    const stripeSubscription = await getStripeSubscription(
        subscription.stripe_subscription_id
    );
    // this unnecessary, but too lazy to delete, can just use variantindex passed in
    const newVariantIndex = await getVariantIndexByPriceIdV2(
        subscription.product_href as PRODUCT_HREF,
        new_price_id!
    );

    if (newVariantIndex.variant_index === '-1') {
        console.error(
            'Could not find variant index for swap',
            new_price_id,
            subscription
        );
        return Status.Error;
    }

    // const renewalOrder = await getLatestRenewalOrderForSubscriptionThatWasSent(
    //     subscription.id,
    // );

    // let lastUsedVariantIndex; // Find the variant index of the last order

    // if (!renewalOrder) {
    //     // If only 1 renewal order, use the original order's var index
    //     const { data, error } = await getOrderById(
    //         String(subscription.order_id),
    //     );

    //     if (!data || !data.variant_index) {
    //         console.error(
    //             'Could not find order for subscription',
    //             subscription,
    //         );
    //     }

    //     lastUsedVariantIndex = data.variant_index;
    // } else {
    //     lastUsedVariantIndex = renewalOrder.variant_index;
    // }

    const old_price_id = stripeSubscription.items.data[0].price.id;

    const lastUsedVariantIndex = await getVariantIndexByPriceIdV2(
        subscription.product_href as PRODUCT_HREF,
        old_price_id
    );

    if (!lastUsedVariantIndex || lastUsedVariantIndex.variant_index === '-1') {
        await forwardOrderToEngineering(
            String(subscription.order_id),
            subscription.patient_id,
            'Variant index not found for last order - upateStripeProductWithProduct'
        );
        return;
    }

    const oldProductPrice = await getPriceDataRecordWithVariant(
        subscription.product_href,
        lastUsedVariantIndex.variant_index
    );
    const newProductPrice = await getPriceDataRecordWithVariant(
        subscription.product_href,
        newVariantIndex.variant_index
    );

    if (stripeSubscription.schedule) {
        await stripe.subscriptionSchedules.release(
            stripeSubscription.schedule.toString()
        );
    }

    // If same cadencies, don't need to use subscription schedule
    if (oldProductPrice?.cadence === newProductPrice?.cadence) {
        if (hasPaid) {
            await stripe.subscriptions.update(stripeSubscription.id, {
                items: [
                    {
                        id: stripeSubscription.items.data[0].id,
                        price: new_price_id,
                    },
                ],
                billing_cycle_anchor: 'now',
                proration_behavior: 'always_invoice',
                payment_behavior: 'pending_if_incomplete',
                proration_date: stripeSubscription.current_period_start,
            });
            const shouldRefund = await shouldRefundCustomer(
                old_price_id,
                new_price_id!
            );

            if (shouldRefund) {
                const res = await refundCustomerForPriceDifference(
                    stripeSubscription.customer.toString(),
                    stripeSubscription.id,
                    old_price_id,
                    new_price_id!
                );

                if (res === Status.Failure) {
                    const lastRenewalOrderId = subscription.order_id;

                    if (lastRenewalOrderId) {
                        await forwardOrderToEngineering(
                            String(lastRenewalOrderId),
                            null,
                            StatusTagNotes.StripeRefundError
                        );
                    }
                }
            }
        } else {
            await stripe.subscriptions.update(stripeSubscription.id, {
                items: [
                    {
                        id: stripeSubscription.items.data[0].id,
                        price: new_price_id,
                    },
                ],
                billing_cycle_anchor: 'unchanged',
                proration_behavior: 'none',
            });
        }
    } else {
        // Different cadence - create subscription schedule
        if (hasPaid) {
            await stripe.subscriptions.update(stripeSubscription.id, {
                items: [
                    {
                        id: stripeSubscription.items.data[0].id,
                        price: new_price_id,
                    },
                ],
                billing_cycle_anchor: 'now',
                proration_behavior: 'always_invoice',
                proration_date: stripeSubscription.current_period_start,
                payment_behavior: 'pending_if_incomplete',
                ...(stripeSubscription.trial_end && { trial_end: 'now' }),
            });

            const shouldRefund = await shouldRefundCustomer(
                old_price_id,
                new_price_id!
            );

            if (shouldRefund) {
                await refundCustomerForPriceDifference(
                    stripeSubscription.customer.toString(),
                    stripeSubscription.id,
                    old_price_id,
                    new_price_id!
                );
            }
        } else {
            const subscriptionSchedule =
                await stripe.subscriptionSchedules.create({
                    from_subscription: stripeSubscription.id,
                });

            await stripe.subscriptionSchedules.update(subscriptionSchedule.id, {
                phases: [
                    {
                        items: [
                            {
                                price: stripeSubscription.items.data[0].price
                                    .id,
                                quantity: 1,
                            },
                        ],
                        start_date:
                            subscriptionSchedule.current_phase?.start_date,
                        end_date: subscriptionSchedule.current_phase?.end_date,
                        trial: true,
                    },
                    {
                        items: [
                            {
                                price: new_price_id,
                                quantity: 1,
                            },
                        ],
                        start_date:
                            subscriptionSchedule.current_phase?.end_date,
                    },
                ],
                proration_behavior: 'none',
                end_behavior: 'release',
            });
        }
    }
    return Status.Success;
}

export async function updateStripeSubscriptionMetadata(
    stripe_subscription_id: string,
    metadata: any
) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

    await stripe.subscriptions.update(stripe_subscription_id, { metadata });
}

export async function uncancelStripeSubscription(
    stripe_subscription_id: string
) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

    await stripe.subscriptions.update(stripe_subscription_id, {
        cancel_at_period_end: false,
    });
}

export async function updateStripeSubscriptionImmediately(
    stripe_subscription_id: string,
    new_price_id: string,
    isUpdateFree: boolean,
    metadata: any = {}
) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

    const stripeSubscription = await getStripeSubscription(
        stripe_subscription_id
    );

    if (stripeSubscription.schedule) {
        await stripe.subscriptionSchedules.release(
            stripeSubscription.schedule.toString()
        );
    }

    await stripe.subscriptions.update(stripe_subscription_id, {
        items: [
            {
                id: stripeSubscription.items.data[0].id,
                price: new_price_id,
            },
        ],
        billing_cycle_anchor: 'now',
        proration_behavior: 'always_invoice',
        ...(isUpdateFree && {
            proration_date: stripeSubscription.current_period_start,
        }),
        metadata,
    });
}

// export async function retrieveUpcomingSubscription Update()

export async function updateRenewalOrderQuarterlyProductToMonthlyVial(
    renewalOrder: RenewalOrder
) {
    const single_variant_index = convertBundleVariantToSingleVariant(
        renewalOrder.product_href,
        renewalOrder.variant_index
    );

    const status = await updateStripeProduct(
        renewalOrder.subscription_id,
        single_variant_index,
        false
    );

    if (status === Status.Error) {
        await forwardOrderToEngineering(
            renewalOrder.renewal_order_id,
            renewalOrder.customer_uuid,
            'Error in subscribing user to singular vial'
        );
    }
}

export async function createBalanceTransaction(
    stripe_customer_id: string,
    amount: number
) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

    await stripe.customers.createBalanceTransaction(stripe_customer_id, {
        amount,
        currency: 'usd',
    });
}

export async function listPaidInvoices(
    stripe_customer_id: string,
    threshold_amount: number
) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

    const invoices = await stripe.invoices.list({
        limit: 100,
        customer: stripe_customer_id,
    });

    const filteredInvoices = invoices.data.filter((invoice) => {
        return (
            invoice.status === 'paid' && invoice.amount_paid >= threshold_amount
        ); // amount_paid is in cents
    });

    return filteredInvoices;
}

export async function refundStripeInvoice(invoice_id: string) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

    const invoice = await stripe.invoices.retrieve(invoice_id);

    const refund = await stripe.refunds.create({
        payment_intent: invoice.payment_intent?.toString(),
    });

    if (refund.status === 'succeeded') {
        return Status.Success;
    }
    return Status.Failure;
}
export async function refundStripeInvoiceWithAmount(
    invoice_id: string,
    amount: number
) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

    const invoice = await stripe.invoices.retrieve(invoice_id);

    const refund = await stripe.refunds.create({
        payment_intent: invoice.payment_intent?.toString(),
        amount,
    });

    if (refund.status === 'succeeded') {
        return Status.Success;
    }
    return Status.Failure;
}

export async function getStripeInvoice(invoice_id: string) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

    const invoice = await stripe.invoices.retrieve(invoice_id);
    return invoice;
}

export async function extendSubscriptionRenewalBy5Days(
    stripe_subscription_id: string
) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});
    try {
        // Fetch the subscription to check if there is a subscription schedule
        const subscription = await stripe.subscriptions.retrieve(
            stripe_subscription_id
        );

        if (subscription.schedule) {
            const schedule = await stripe.subscriptionSchedules.retrieve(
                subscription.schedule.toString()
            );

            const new_price_id =
                schedule.phases[
                    schedule.phases.length - 1
                ].items[0].price.toString();

            await stripe.subscriptionSchedules.release(schedule.id);

            const newPeriodEnd = Math.floor(
                subscription.current_period_end + 5 * 24 * 60 * 60
            ); // Add 4 days in seconds

            await stripe.subscriptions.update(stripe_subscription_id, {
                trial_end: newPeriodEnd,
                proration_behavior: 'none',
            });

            const subscriptionSchedule =
                await stripe.subscriptionSchedules.create({
                    from_subscription: stripe_subscription_id,
                });

            await stripe.subscriptionSchedules.update(subscriptionSchedule.id, {
                phases: [
                    {
                        items: [
                            {
                                price: subscription.items.data[0].price.id,
                                quantity: 1,
                            },
                        ],
                        start_date:
                            subscriptionSchedule.current_phase?.start_date,
                        end_date: subscriptionSchedule.current_phase?.end_date,
                        trial: true,
                    },
                    {
                        items: [
                            {
                                price: new_price_id,
                                quantity: 1,
                            },
                        ],
                        start_date:
                            subscriptionSchedule.current_phase?.end_date,
                    },
                ],
                proration_behavior: 'none',
            });
        } else {
            const newPeriodEnd = Math.floor(
                subscription.current_period_end + 4 * 24 * 60 * 60
            ); // Add 4 days in seconds

            await stripe.subscriptions.update(stripe_subscription_id, {
                trial_end: newPeriodEnd,
                proration_behavior: 'none',
            });
        }
    } catch (error) {
        console.error('Failed to update subscription:', error);
    }
}

export async function attemptPaymentForInvoice(
    tracker_id: number,
    renewalOrder: RenewalOrder,
    invoice_id: string
) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

    try {
        const invoice = await stripe.invoices.pay(invoice_id);
        if (invoice.status === 'paid') {
            await updateTrackerStatusById(
                tracker_id,
                PaymentFailureStatus.Resolved
            );
        }
    } catch (error: unknown) {
        console.error(`error ${renewalOrder.customer_uuid}`, error);
        if (error instanceof Stripe.errors.StripeError) {
            await createPaymentFailureAuditForRenewalOrder(
                renewalOrder.customer_uuid,
                renewalOrder,
                '',
                invoice_id,
                error.message
            );
        } else {
            await createPaymentFailureAuditForRenewalOrder(
                renewalOrder.customer_uuid,
                renewalOrder,
                '',
                invoice_id,
                'Unknown failure reason'
            );
        }
    }
}

/**
 * 1. Update the renewal order so the variant index and assigned_pharmcy are updated to the pvc result of the new variant index
 * 2. Optionally applies credit to the customer's balance
 * 3. Ends any active trial if one exists
 * 4. Updates the subscription to the new price with a billing cycle anchor of now if 'immediate' or at their next renewal if 'scheduled'
 *
 * @param subscriptionId - The ID of the subscription to update.
 * @param newPriceId - The new Stripe price ID.
 * @param creditAmount - Optional. Amount (in dollars) to credit to the customer's balance.
 * @returns The updated subscription object.
 */

//tested on https://dashboard.stripe.com/customers/cus_RYY3BQ8bGDtE1Y  and it worked!
export async function rebootSubscription( //should have an option to either schedule it or reset billing cycle immediately
    variantIndex: number,
    renewalOrder: RenewalOrderTabs,
    scheduledOrImmediate: 'scheduled' | 'immediate',
    creditAmount?: number
): Promise<Status> {
    if (!renewalOrder) {
        console.error('Renewal order not found.');
        return Status.Error;
    }
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});
    const environment = process.env.NEXT_PUBLIC_ENVIRONMENT as string;

    const prescription_subscription = await getPrescriptionSubscription(
        renewalOrder.subscription_id
    );
    if (!prescription_subscription) {
        console.error('Prescription subscription not found');
        return Status.Error;
    }
    const subscription_id = prescription_subscription.stripe_subscription_id;
    const subscription = await stripe.subscriptions.retrieve(subscription_id);
    if (!subscription) {
        console.error('Subscription not found');
        return Status.Error;
    }

    const customerId = subscription.customer as string;

    const pvc = new ProductVariantController(
        renewalOrder.product_href as PRODUCT_HREF,
        renewalOrder.variant_index,
        renewalOrder.state as USStates
    );
    const pvc_result = pvc.getConvertedVariantIndex();
    const new_variant_index = pvc_result.variant_index ?? variantIndex;
    const new_pharmacy = pvc_result.pharmacy;

    if (!new_variant_index || !new_pharmacy) {
        console.error('New variant index or pharmacy not found');
        console.log('pvc_result', pvc_result);
        return Status.Error;
    }
    // console.log('new_variant_index', new_variant_index);
    // console.log('new_pharmacy', new_pharmacy);
    // // console.log('subscription_id', subscription_id);
    // // console.log('subscription', subscription);
    // // console.log('customerId', customerId);
    // return Status.Success;

    //1. update renewal order with the new variant index and pharmacy
    await updateRenewalOrderByRenewalOrderId(renewalOrder.renewal_order_id, {
        variant_index: new_variant_index,
        pharmacy: new_pharmacy,
    });

    //2. now we gotta update stripe
    if (scheduledOrImmediate === 'scheduled') {
        //not implemented yet
        return Status.Error;
    } else {
        //update the subscription immediately in stripe

        //find the price id we'll need to update the subscription to
        const newPriceId = await getPriceIdForProductVariant(
            renewalOrder.product_href as PRODUCT_HREF,
            new_variant_index,
            environment
        );
        if (!newPriceId) {
            console.error('New price ID not found.');
            return Status.Error;
        }

        //handle any unreleased schedules:
        const stripeSubscription = await getStripeSubscription(subscription_id);
        if (stripeSubscription.schedule) {
            await stripe.subscriptionSchedules.release(
                stripeSubscription.schedule.toString()
            );
        }

        // optionally add credit to customer's balance
        // if (creditAmount && creditAmount > 0) {
        //     await stripe.customers.createBalanceTransaction(customerId, {
        //         amount: Math.round(creditAmount * 100) * -1, // Credit is a negative amount
        //         currency: 'usd',
        //         description: `Manual credit of $${creditAmount.toFixed(2)} before subscription update.`,
        //     });
        // }

        // update the subscription
        let updatedSubscription;
        try {
            updatedSubscription = await stripe.subscriptions.update(
                subscription_id,
                {
                    items: [
                        {
                            id: subscription.items.data[0].id,
                            price: newPriceId,
                            quantity: 1,
                        },
                    ],
                    trial_end: 'now', // Ends trial immediately
                    billing_cycle_anchor: 'now', // Resets billing cycle
                    proration_behavior: 'none', // Prevents prorated charges
                }
            );
        } catch (error) {
            console.error('Failed to update subscription:', error);
            return Status.Error;
        }

        console.log('successfully rebooted subscription:', updatedSubscription);
        return Status.Success;
    } //end of handling immediate update
}
