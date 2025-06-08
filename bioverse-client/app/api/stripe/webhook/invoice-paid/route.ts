import {
    getLastInvoiceBeforeRenewal,
    getStripeSubscription,
    safeCancelSubscription,
    toggleDelayedForStripeSubscription,
    updateStripeProduct,
    updateStripeSubscriptionMetadata,
} from '@/app/(administration)/admin/stripe-api/stripe-api-actions';
import {
    removeCustomerFromAllJourneys,
    triggerEvent,
} from '@/app/services/customerio/customerioApiFactory';
import {
    NON_WL_CHECKIN_UNPAID,
    NON_WL_UNPAID,
    PAYMENT_FAILED,
    PAYMENT_SUCCESS,
    RENEWAL_ORDER_RECEIVED,
    TREATMENT_CONFIRMED,
    WL_CHECKIN_INCOMPLETE,
    WL_NEED_CHECKIN_UNPAID,
    WL_UNPAID,
} from '@/app/services/customerio/event_names';

import {
    fetchCardDigitsForSubscription,
    // handleSubscriptionUpdatePaid,
} from '@/app/services/stripe/subscriptions';
import { SubscriptionStatus, USStates } from '@/app/types/enums/master-enums';
import { OrderType } from '@/app/types/orders/order-types';
import {
    RenewalOrderStatus,
    SubscriptionCadency,
} from '@/app/types/renewal-orders/renewal-orders-types';

import { sendCheckInCustomerIOEvent } from '@/app/utils/actions/stripe/stripe-webhook-actions';
import { updatePrescriptionSubscription } from '@/app/utils/actions/subscriptions/subscription-actions';
import { getSubscriptionWithStripeSubscriptionId } from '@/app/utils/database/controller/prescription_subscriptions/prescription_subscriptions';
import { getCustomerIdWithStripeId } from '@/app/utils/database/controller/profiles/profiles';
import { auditRenewalOrder } from '@/app/utils/database/controller/renewal_order_audit/renewal_order_audit';
import {
    createFirstTimeRenewalOrder,
    getLatestRenewalOrderForSubscription,
    getRenewalOrderBySubscriptionId,
    updateRenewalOrder,
    updateRenewalOrderByRenewalOrderId,
    updateRenewalOrderStatus,
} from '@/app/utils/database/controller/renewal_orders/renewal_orders';
import {
    isGLP1Product,
    isWeightlossProduct,
} from '@/app/utils/functions/pricing';
import { getCurrentDate } from '@/app/utils/functions/utils';
import { isNull } from 'lodash';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import {
    forwardOrderToEngineering,
    updateStatusTagToReview,
} from '@/app/utils/database/controller/patient-status-tags/patient-status-tags-api';
import {
    getVariantIndexByPriceIdV2,
    getPriceIdForProductVariant,
} from '@/app/utils/database/controller/products/products';

import { getVariantIndexByPriceId } from '@/app/services/pharmacy-integration/variant-swap/glp1-stripe-price-id';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import { getBaseOrderById } from '@/app/utils/database/controller/orders/orders-api';
import { logPatientAction } from '@/app/utils/database/controller/patient_action_history/patient-action-history';
import { PatientActionTask } from '@/app/utils/database/controller/patient_action_history/patient-action-history-types';
import { convertBundleVariantToSingleVariant } from '@/app/utils/functions/pharmacy-helpers/bundle-variant-index-mapping';
import { getOrderStatusDetails } from '@/app/utils/functions/renewal-orders/renewal-orders';
import {
    shouldCreateTrackerForRenewals,
    stopAllPaymentFailureRetriesForOriginalOrderId,
} from '@/app/utils/database/controller/payment_failure_tracker/payment_failure_tracker-api';
import {
    createNewRenewalValidationJob,
    createNewStripeInvoicePaidJob,
} from '@/app/utils/database/controller/job-scheduler/job-scheduler-actions';
import {
    getLastCheckInFormSubmission,
    isWithinLastThreeMonths,
} from '@/app/utils/actions/check-up/check-up-actions';
import { usedAllRefills } from '@/app/utils/functions/job-scheduler/jobs/StripeInvoicePaidJobHandler';
import { ProductVariantController } from '@/app/utils/classes/ProductVariant/ProductVariantController';
import { getPriceDataRecordWithVariant } from '@/app/utils/database/controller/product_variants/product_variants';

// For now we are hardcoding the mapping of product & subscription type to the number of max refills
// A more permanent option in the database should eventually be considered

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
    const sig = req.headers.get('stripe-signature');

    /**
     * //TODO: uncomment below before sending to prod.
     */

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            await req.text(),
            sig!,
            endpointSecret
        );
    } catch (err: any) {
        console.error(err);
        return new NextResponse(`Webhook Error: ${err.message}`, {
            status: 400,
        });
    }

    // const event = await req.json(); //comment this before sending to prod.

    // Handle the event
    try {
        switch (event.type) {
            case 'invoice.paid':
                const invoicePaid = event.data.object;

                // console.log('invoice paid event data: ', invoicePaid); //TODO delete this
                // console.log('Billing reason: ', invoicePaid.billing_reason);

                const stripeSubscription = await getStripeSubscription(
                    invoicePaid.subscription as string
                );

                if (invoicePaid.amount_paid === 0) {
                    console.log('Amount paid is zero', invoicePaid);

                    if (
                        stripeSubscription.metadata[
                            'process_next_zero_invoice_paid'
                        ] !== 'true'
                    ) {
                        break;
                    } else {
                        await updateStripeSubscriptionMetadata(
                            stripeSubscription.id,
                            { process_next_zero_invoice_paid: '' }
                        );
                    }
                }

                const totalPrice = (invoicePaid.amount_due / 100).toFixed(2);

                if (stripeSubscription.metadata['dont_process'] == 'true') {
                    break;
                }

                const stripeCustomerId = stripeSubscription.customer.toString();

                if (stripeCustomerId) {
                    const { user_id } = await getCustomerIdWithStripeId(
                        stripeCustomerId
                    );
                    if (user_id) {
                        await triggerEvent(user_id, PAYMENT_SUCCESS);
                        await triggerEvent(user_id, TREATMENT_CONFIRMED);
                    }
                }

                const stripeSubscriptionId = invoicePaid.subscription;

                const { subscription: subscriptionCycle } =
                    await getSubscriptionWithStripeSubscriptionId(
                        stripeSubscriptionId as string
                    );

                if (isNull(subscriptionCycle) || !subscriptionCycle) {
                    console.error(
                        'Could not find subscription for paid event',
                        stripeSubscription
                    );
                    return new NextResponse(null, { status: 500 });
                }

                const last4 = await fetchCardDigitsForSubscription(
                    invoicePaid.subscription as string
                );

                if (stripeSubscription.metadata['manual_order'] == 'true') {
                    const latestRenewal =
                        await getLatestRenewalOrderForSubscription(
                            subscriptionCycle.id
                        );

                    if (latestRenewal) {
                        await updateRenewalOrderByRenewalOrderId(
                            latestRenewal.renewal_order_id,
                            {
                                order_status:
                                    RenewalOrderStatus.CheckupComplete_Unprescribed_Paid,
                            }
                        );
                        await updateStripeSubscriptionMetadata(
                            subscriptionCycle.stripe_subscription_id,
                            { manual_order: '' }
                        );
                        await updateStatusTagToReview(
                            latestRenewal.customer_uuid,
                            latestRenewal.renewal_order_id
                        );
                    }
                }

                if (
                    stripeSubscription.metadata['cancel_after_paid'] === 'true'
                ) {
                    // Cancel subscription immediately
                    await safeCancelSubscription(
                        stripeSubscription,
                        subscriptionCycle.id
                    );
                    break;
                }

                const latestRenewal =
                    await getLatestRenewalOrderForSubscription(
                        subscriptionCycle.id
                    );

                if (latestRenewal) {
                    await triggerEvent(
                        subscriptionCycle.patient_id,
                        RENEWAL_ORDER_RECEIVED,
                        {
                            date: await getCurrentDate(),
                            order_id: latestRenewal.renewal_order_id,
                            total_price: totalPrice,
                            last4,
                        }
                    );
                }

                switch (invoicePaid.billing_reason) {
                    case 'subscription_update':
                    case 'subscription_cycle':
                        if (latestRenewal) {
                            await createNewStripeInvoicePaidJob(
                                latestRenewal.renewal_order_id,
                                invoicePaid.id,
                                invoicePaid.subscription?.toString()!
                            );
                        } else {
                            await createFirstTimeRenewalOrder(
                                String(subscriptionCycle.order_id)
                            );

                            const newLatestRenewalOrder =
                                await getLatestRenewalOrderForSubscription(
                                    subscriptionCycle.id
                                );

                            if (!newLatestRenewalOrder) {
                                await forwardOrderToEngineering(
                                    String(subscriptionCycle.order_id),
                                    subscriptionCycle.patient_id,
                                    'Invalid order for invoice paid'
                                );
                            } else {
                                await createNewStripeInvoicePaidJob(
                                    newLatestRenewalOrder.renewal_order_id,
                                    invoicePaid.id,
                                    invoicePaid.subscription?.toString()!
                                );
                            }
                        }
                        break;
                    case 'subscription_create':
                        // await triggerEvent(
                        //     subscriptionCycle.patient_id,
                        //     ORDER_CONFIRMED,
                        //     {
                        //         date: await getCurrentDate(),
                        //         id: subscriptionCycle.order_id,
                        //         paid: totalPrice,
                        //         last4,
                        //     },
                        // );
                        const latestRenewalOrder =
                            await getLatestRenewalOrderForSubscription(
                                subscriptionCycle.id
                            );

                        let product_href;
                        let variant_index;

                        console.log(
                            'SUBSCRIPTION CREATE',
                            latestRenewalOrder,
                            subscriptionCycle,
                            invoicePaid
                        );

                        if (!latestRenewalOrder) {
                            console.error(
                                'Could not get latest renewal order for customer on sub create',
                                subscriptionCycle
                            );

                            const order = await getBaseOrderById(
                                subscriptionCycle.order_id
                            );

                            if (!order) {
                                console.error(
                                    'Could not get order for sub create',
                                    subscriptionCycle
                                );
                                break;
                            }

                            product_href = order.product_href;
                            variant_index = order.variant_index;
                        } else {
                            product_href = latestRenewalOrder.product_href;
                            variant_index = latestRenewalOrder.variant_index;
                        }

                        const mappedVariantIndex =
                            await getVariantIndexByPriceIdV2(
                                product_href as PRODUCT_HREF,
                                invoicePaid.lines.data[0].price?.id!
                            );

                        const record_data = await getPriceDataRecordWithVariant(
                            product_href,
                            mappedVariantIndex.variant_index
                        );

                        const cadence = record_data?.cadence;

                        if (!record_data) {
                            console.error(
                                'Could not find record data for sub create',
                                product_href,
                                mappedVariantIndex.variant_index
                            );
                            throw new Error(
                                'Could not find record data for sub create within invoice paid route.'
                            );
                        }

                        if (cadence !== SubscriptionCadency.Monthly) {
                            const newVariantIndex =
                                convertBundleVariantToSingleVariant(
                                    product_href,
                                    variant_index
                                );
                            await updateStripeProduct(
                                subscriptionCycle.id,
                                newVariantIndex,
                                false
                            );
                        }
                        break;

                    default:
                        break;
                }
                // Then define and call a function to handle the invoice.paid event
                break;

            case 'invoice.upcoming':
                const invoiceUpcoming = event.data.object;

                // Then define and call a function to handle the event invoice.upcoming
                const subscriptionId = invoiceUpcoming.subscription;
                const { subscription } =
                    await getSubscriptionWithStripeSubscriptionId(
                        subscriptionId as string
                    );

                if (isNull(subscription) || !subscription) {
                    console.error(
                        'Could not find subscription for invoice upcoming event',
                        invoiceUpcoming
                    );
                    return new NextResponse(null, { status: 200 });
                }

                // 1. Determine Product
                const product_href = subscription.product_href;

                /**
                 * If this is a GLP1 product, we need to create a renewal validation job
                 * To check whether the patient has completed check-ins and dosage selection
                 * The RenewalValidationJobHandler will be made from this record created.
                 * This will either put an NCI-Hold on the account or invoke the LDMC to conver to monthly.
                 */
                if (isGLP1Product(product_href)) {
                    await createNewRenewalValidationJob(subscription.id);
                }

                // If this is not a weight loss item and the patient has not used all refills
                if (!isGLP1Product(product_href)) {
                    try {
                        await triggerEvent(
                            subscription.patient_id,
                            WL_CHECKIN_INCOMPLETE,
                            {
                                click_url: `https://app.gobioverse.com/check-up/${product_href}`,
                            }
                        );
                    } catch {
                        forwardOrderToEngineering(
                            String(subscription.order_id),
                            subscription.patient_id,
                            `Max refills lookup failed for ${subscription.product_href} -> ${subscription.subscription_type}`
                        );
                    }
                }
                break;
            case 'customer.subscription.deleted': {
                const subscriptionDeleted = event.data.object;

                const stripeSubscriptionId = subscriptionDeleted.id;

                if (
                    subscriptionDeleted.status === SubscriptionStatus.Canceled
                ) {
                    const { subscription } =
                        await getSubscriptionWithStripeSubscriptionId(
                            stripeSubscriptionId
                        );
                    if (!subscription) {
                        console.error(
                            'Failed to fetch subscription stripe subscription',
                            stripeSubscriptionId
                        );
                        return;
                    }

                    await stopAllPaymentFailureRetriesForOriginalOrderId(
                        subscription.order_id
                    );

                    const latestRenewalOrder =
                        await getLatestRenewalOrderForSubscription(
                            subscription.id
                        );

                    if (latestRenewalOrder) {
                        if (
                            latestRenewalOrder.order_status !==
                            RenewalOrderStatus.PharmacyProcessing
                        ) {
                            await updateRenewalOrder(latestRenewalOrder.id, {
                                order_status: RenewalOrderStatus.Canceled,
                            });
                        }
                    }

                    await updatePrescriptionSubscription(subscription.id, {
                        status: SubscriptionStatus.Canceled,
                    });
                    await removeCustomerFromAllJourneys(
                        subscription.patient_id
                    );
                    console.log(
                        'Successfully cancelled subscription',
                        subscription.patient_id,
                        subscription.order_id
                    );
                }
                break;
            }
            // Only enter this case for renewal order payment failures
            case 'customer.subscription.updated': {
                const subscriptionUpdated = event.data.object;

                const stripe_subscription_id = subscriptionUpdated.id;

                const { subscription } =
                    await getSubscriptionWithStripeSubscriptionId(
                        stripe_subscription_id
                    );

                if (!subscription) {
                    console.error(
                        'Unknown stripe subscription',
                        subscriptionUpdated
                    );
                    break;
                }

                if (!subscriptionUpdated.cancel_at_period_end) {
                    await updatePrescriptionSubscription(subscription.id, {
                        status: 'active',
                    });
                }
                break;
            }
            case 'invoice.payment_failed':
                const invoiceFailed = event.data.object;

                const cus_id = invoiceFailed.customer;
                const { user_id, error } = await getCustomerIdWithStripeId(
                    cus_id as string
                );

                const subscriptionData =
                    await getSubscriptionWithStripeSubscriptionId(
                        invoiceFailed.subscription as string
                    );
                const failedSubscription = subscriptionData.subscription;

                // cant be too safe :)
                if (isNull(failedSubscription) || !failedSubscription) {
                    await triggerEvent(user_id, PAYMENT_FAILED, {
                        order_type: OrderType.Order,
                    });
                    return new NextResponse(null, { status: 200 });
                }
                var renewalOrder = await getRenewalOrderBySubscriptionId(
                    failedSubscription.id
                );

                if (!renewalOrder) {
                    await createFirstTimeRenewalOrder(
                        String(subscriptionData.subscription?.order_id)
                    );
                    renewalOrder = await getRenewalOrderBySubscriptionId(
                        failedSubscription.id
                    );
                }

                if (renewalOrder) {
                    await logPatientAction(
                        renewalOrder.customer_uuid,
                        PatientActionTask.PAYMENT_FAILED,
                        {
                            product_href: renewalOrder.product_href,
                            order_id: renewalOrder.renewal_order_id,
                            source: 'invoice.paid',
                        }
                    );
                }

                if (isWeightlossProduct(failedSubscription.product_href)) {
                    if (isNull(renewalOrder) || !renewalOrder) {
                        console.error(
                            'Cannot find renewal order in payment fail event',
                            failedSubscription
                        );
                        return new NextResponse(null, { status: 200 });
                    }

                    const shouldCreateTracker =
                        await shouldCreateTrackerForRenewals(
                            renewalOrder,
                            invoiceFailed.id
                        );

                    if (!shouldCreateTracker) {
                        break;
                    }

                    const checkin_url = `https://app.gobioverse.com/check-up/${renewalOrder.product_href}`;

                    const orderStatusDetails = getOrderStatusDetails(
                        renewalOrder.order_status
                    );

                    if (orderStatusDetails.isPaid) {
                        await forwardOrderToEngineering(
                            renewalOrder.renewal_order_id,
                            renewalOrder.customer_uuid,
                            'Payment failure event - already paid?.'
                        );
                        return;
                    }

                    const lastPriceIdPaidFor =
                        await getLastInvoiceBeforeRenewal(
                            invoiceFailed.subscription?.toString()!,
                            invoiceFailed.id
                        );

                    if (!lastPriceIdPaidFor) {
                        await forwardOrderToEngineering(
                            renewalOrder.renewal_order_id,
                            renewalOrder.customer_uuid,
                            'cant find price id - failed payment?.'
                        );
                        return;
                    }

                    const lastVariantIndex = await getVariantIndexByPriceIdV2(
                        renewalOrder.product_href as PRODUCT_HREF,
                        lastPriceIdPaidFor
                    );

                    const record_data = await getPriceDataRecordWithVariant(
                        renewalOrder.product_href as PRODUCT_HREF,
                        lastVariantIndex.variant_index
                    );

                    const lastCadency = record_data?.cadence;

                    if (lastCadency !== SubscriptionCadency.Monthly) {
                        const next_order_status =
                            await getNextQuarterlyPaymentFailedOrderStatus(
                                renewalOrder.renewal_order_id,
                                renewalOrder.order_status
                            );

                        if (orderStatusDetails.isCheckupComplete) {
                            if (
                                lastCadency ===
                                    SubscriptionCadency.Biannually ||
                                lastCadency === SubscriptionCadency.Annually
                            ) {
                                const lastCheckin =
                                    await getLastCheckInFormSubmission(
                                        renewalOrder.customer_uuid,
                                        renewalOrder.product_href as PRODUCT_HREF
                                    );
                                if (lastCheckin) {
                                    const checkinDate =
                                        lastCheckin.submission_time;

                                    if (
                                        await isWithinLastThreeMonths(
                                            checkinDate
                                        )
                                    ) {
                                        await triggerEvent(
                                            renewalOrder.customer_uuid,
                                            WL_UNPAID,
                                            {
                                                order_id:
                                                    renewalOrder.renewal_order_id,
                                            }
                                        );
                                    } else {
                                        await triggerEvent(
                                            renewalOrder.customer_uuid,
                                            WL_NEED_CHECKIN_UNPAID,
                                            {
                                                checkin_url,
                                                order_id:
                                                    renewalOrder.renewal_order_id,
                                            }
                                        );

                                        await triggerEvent(
                                            user_id,
                                            PAYMENT_FAILED,
                                            {
                                                order_id:
                                                    renewalOrder.renewal_order_id,
                                                order_type:
                                                    OrderType.RenewalOrder,
                                            }
                                        );
                                    }
                                }
                            } else {
                                await triggerEvent(
                                    renewalOrder.customer_uuid,
                                    WL_UNPAID,
                                    { order_id: renewalOrder.renewal_order_id }
                                );
                            }
                        } else {
                            await triggerEvent(
                                renewalOrder.customer_uuid,
                                WL_NEED_CHECKIN_UNPAID,
                                {
                                    checkin_url,
                                    order_id: renewalOrder.renewal_order_id,
                                }
                            );

                            await triggerEvent(user_id, PAYMENT_FAILED, {
                                order_id: renewalOrder.renewal_order_id,
                                order_type: OrderType.RenewalOrder,
                            });
                        }

                        if (next_order_status === RenewalOrderStatus.Unknown) {
                            await forwardOrderToEngineering(
                                renewalOrder.renewal_order_id,
                                renewalOrder.customer_uuid,
                                `Next Order Status is Unknown. Payment Failure. ${renewalOrder.order_status}`
                            );
                            break;
                        }
                        await updateRenewalOrderStatus(
                            renewalOrder.id,
                            next_order_status
                        );
                    } else {
                        const next_order_status =
                            await getNextPaymentFailedOrderStatus(
                                renewalOrder.renewal_order_id,
                                renewalOrder.order_status
                            );
                        if (
                            failedSubscription.since_last_checkup < 3 ||
                            orderStatusDetails.isCheckupComplete
                        ) {
                            if (orderStatusDetails.isCheckupComplete) {
                                await updateRenewalOrderStatus(
                                    renewalOrder.id,
                                    next_order_status
                                );

                                await triggerEvent(user_id, WL_UNPAID, {
                                    order_id: renewalOrder.renewal_order_id,
                                });
                            } else {
                                await updateRenewalOrderStatus(
                                    renewalOrder.id,
                                    next_order_status
                                );
                                await triggerEvent(user_id, PAYMENT_FAILED, {
                                    order_id: renewalOrder.renewal_order_id,
                                    order_type: OrderType.RenewalOrder,
                                });
                            }
                        } else {
                            if (
                                renewalOrder.order_status ===
                                RenewalOrderStatus.Incomplete
                            ) {
                                await updateRenewalOrderStatus(
                                    renewalOrder.id,
                                    RenewalOrderStatus.CheckupIncomplete_Unprescribed_Unpaid
                                );
                            }

                            await triggerEvent(
                                user_id,
                                WL_NEED_CHECKIN_UNPAID,
                                {
                                    checkin_url,
                                    order_id: renewalOrder.renewal_order_id,
                                }
                            );
                            await triggerEvent(user_id, PAYMENT_FAILED, {
                                order_id: renewalOrder.renewal_order_id,
                                order_type: OrderType.RenewalOrder,
                            });
                        }
                    }
                } else if (subscriptionData.subscription && renewalOrder) {
                    try {
                        const shouldCreateTracker =
                            await shouldCreateTrackerForRenewals(
                                renewalOrder,
                                invoiceFailed.id
                            );

                        if (!shouldCreateTracker) {
                            break;
                        }
                        if (!usedAllRefills(subscriptionData.subscription)) {
                            await triggerEvent(user_id, NON_WL_UNPAID);
                            await updateRenewalOrderStatus(
                                renewalOrder.id,
                                RenewalOrderStatus.CheckupWaived_Unprescribed_Unpaid
                            );
                        } else {
                            await triggerEvent(user_id, NON_WL_CHECKIN_UNPAID);
                            await updateRenewalOrderStatus(
                                renewalOrder.id,
                                RenewalOrderStatus.CheckupIncomplete_Unprescribed_Unpaid
                            );
                        }
                    } catch {
                        forwardOrderToEngineering(
                            String(renewalOrder?.renewal_order_id),
                            null,
                            `Max refills lookup failed for ${renewalOrder?.product_href} -> ${renewalOrder?.subscription_type}`
                        );
                    }
                }
                break;
            default:
                console.log(`Unhandled event type ${event.type}`);
        }
    } catch (error) {
        console.error('Error with stripe event', error);
    }

    // Return a 200 response to acknowledge receipt of the event
    return new NextResponse(null, { status: 200 });
}

// Patients who autoswapped from quarterly -> single vial don't get processed by this flow (should already be made PharmacyProcessing above)

// IF checkupcomplete-unprescribed-unpaid:
// Can assume we either 1) send whatever they paid for

// For patients who don't complete their dosage selection:
// Monthly: send last used script
// quarterly: send single vial (gets processed above)

// Monthly Order Dosage Selection Offered, not Selected
// checkupcomplete-unprescribed-unpaid
// Monthly Order Dosage Selection Offered, Selected
// checkupcomplete-prescribed-unpaid

// Monthly Order Dosage Selection not offered --
// Quarterly Order Dosage Selection Offered, not Selected
// Quarterly Order Dosage Selection Offered, Selected
// Quarterly dosage selection not offered --

async function getNextPaymentFailedOrderStatus(
    order_id: string | undefined,
    order_status: RenewalOrderStatus
) {
    switch (order_status) {
        case RenewalOrderStatus.CheckupComplete_Prescribed_Unpaid:
        case RenewalOrderStatus.CheckupComplete_Prescribed_Unpaid_1:
            return RenewalOrderStatus.CheckupComplete_Prescribed_Unpaid_1;
        case RenewalOrderStatus.CheckupComplete_Unprescribed_Unpaid:
        case RenewalOrderStatus.CheckupComplete_Unprescribed_Unpaid_1:
            return RenewalOrderStatus.CheckupComplete_Unprescribed_Unpaid_1;
        case RenewalOrderStatus.CheckupComplete_Unprescribed_Unpaid_2:
            return RenewalOrderStatus.CheckupComplete_Unprescribed_Unpaid_2;
        case RenewalOrderStatus.CheckupComplete_Prescribed_Unpaid_2:
            return RenewalOrderStatus.CheckupComplete_Prescribed_Unpaid_2;
        case RenewalOrderStatus.Incomplete:
            return RenewalOrderStatus.CheckupWaived_Unprescribed_Unpaid;
        case RenewalOrderStatus.Scheduled_Cancel:
        case RenewalOrderStatus.Administrative_Canceled:
        case RenewalOrderStatus.CheckupIncomplete_Unprescribed_Unpaid:
            return order_status;
        default:
            await auditRenewalOrder(
                order_id || 'Unknown',
                JSON.stringify({ order_id, order_status }),
                'Unknown Status Update'
            );
            return RenewalOrderStatus.Unknown;
    }
}

async function getNextQuarterlyPaymentFailedOrderStatus(
    order_id: string,
    order_status: RenewalOrderStatus
) {
    switch (order_status) {
        case RenewalOrderStatus.CheckupComplete_Prescribed_Unpaid:
        case RenewalOrderStatus.CheckupComplete_Prescribed_Unpaid_1:
            return RenewalOrderStatus.CheckupComplete_Prescribed_Unpaid_1;
        case RenewalOrderStatus.CheckupComplete_Unprescribed_Unpaid:
        case RenewalOrderStatus.CheckupComplete_Unprescribed_Unpaid_1:
            return RenewalOrderStatus.CheckupComplete_Unprescribed_Unpaid_1;
        case RenewalOrderStatus.CheckupComplete_Unprescribed_Unpaid_2:
            return RenewalOrderStatus.CheckupComplete_Unprescribed_Unpaid_2;
        case RenewalOrderStatus.CheckupComplete_Prescribed_Unpaid_2:
            return RenewalOrderStatus.CheckupComplete_Prescribed_Unpaid_2;
        case RenewalOrderStatus.Incomplete:
            return RenewalOrderStatus.CheckupIncomplete_Unprescribed_Unpaid;
        case RenewalOrderStatus.Scheduled_Cancel:
        case RenewalOrderStatus.Administrative_Canceled:
        case RenewalOrderStatus.CheckupIncomplete_Unprescribed_Unpaid:
            return order_status;
        default:
            await auditRenewalOrder(
                order_id || 'Unknown',
                JSON.stringify({ order_id, order_status }),
                'Unknown Status Update'
            );
            return RenewalOrderStatus.Unknown;
    }
}
