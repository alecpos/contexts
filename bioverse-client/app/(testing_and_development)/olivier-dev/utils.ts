'use server';

import {
    getStripeSubscription,
    updateStripeProduct,
} from '@/app/(administration)/admin/stripe-api/stripe-api-actions';
import ActionItemFactory from '@/app/components/patient-portal/action-items/utils/ActionItemFactory';
import { getSubscriptionRewewalDate } from '@/app/components/patient-portal/subscriptions/components/SubscriptionList/utils/SubscriptionItem-functions';
import { getEligiblePharmacy } from '@/app/components/provider-portal/intake-view/v2/components/containers/utils/approval-pharmacy-scripts/approval-pharmacy-product-map';
import { generateHallandaleScript } from '@/app/utils/functions/prescription-scripts/hallandale-approval-script-generator';
import { getProviderMacroHTMLPrePopulated } from '@/app/components/provider-portal/intake-view/v2/components/containers/utils/post-prescribe-macro-selector/post-prescribe-macro-selector';
import { convertHallandaleOrderToBase64 } from '@/app/components/provider-portal/intake-view/v2/components/tab-column/prescribe/prescribe-windows/hallandale/utils/hallandale-base64-pdf';
import {
    batchTriggerEvent,
    triggerEvent,
} from '@/app/services/customerio/customerioApiFactory';
import {
    PRESCRIPTION_DELIVERED,
    PRESCRIPTION_RENEWAL_SHIPPED,
    WL_CHECKIN_INCOMPLETE,
    WL_MULTI_MONTH_CHECKIN,
} from '@/app/services/customerio/event_names';
import {
    CREATE_TRACKER_BASE_URL,
    FEDEX_CODE,
} from '@/app/services/easypost/constants';
import {
    createTracker,
    fetchWithRetry,
} from '@/app/services/easypost/easypost-tracker';
import { sendHallendaleScript } from '@/app/services/pharmacy-integration/hallandale/hallandale-script-api';
import { AUTO_STATUS_CHANGER_UUID } from '@/app/services/pharmacy-integration/provider-static-information';
import { Status } from '@/app/types/global/global-enumerators';
import { MessagePayload } from '@/app/types/messages/messages-types';
import {
    BaseOrderInterface,
    OrderStatus,
    OrderType,
    ScriptSource,
    ShippingStatus,
} from '@/app/types/orders/order-types';
import {
    RenewalOrder,
    RenewalOrderStatus,
    SubscriptionCadency,
} from '@/app/types/renewal-orders/renewal-orders-types';
import {
    StatusTag,
    StatusTagAction,
} from '@/app/types/status-tags/status-types';
import { getPatientInformationById } from '@/app/utils/actions/provider/patient-overview';
import {
    getPrescriptionSubscription,
    getSubscriptionDetails,
    updatePrescriptionSubscription,
} from '@/app/utils/actions/subscriptions/subscription-actions';
import { ScriptHandlerFactory } from '@/app/utils/classes/Scripts/ScriptHandlerFactory';
import { createSupabaseServiceClient } from '@/app/utils/clients/supabaseServerClient';
import { getPatientAllergyData } from '@/app/utils/database/controller/clinical_notes/clinical-notes';
import { postNewMessage } from '@/app/utils/database/controller/messaging/messages/messages';
import { getThreadIDByPatientIDAndProduct } from '@/app/utils/database/controller/messaging/threads/threads';
import {
    fetchOrderData,
    getBaseOrderById,
    insertNewFirstTimeOrder,
} from '@/app/utils/database/controller/orders/orders-api';
import {
    createUserStatusTagWAction,
    forwardOrderToEngineering,
    updateStatusTagToResolved,
    updateStatusTagToReview,
} from '@/app/utils/database/controller/patient-status-tags/patient-status-tags-api';
import { getSubscriptionWithStripeSubscriptionId } from '@/app/utils/database/controller/prescription_subscriptions/prescription_subscriptions';
import { getPriceDataRecordWithVariant } from '@/app/utils/database/controller/product_variants/product_variants';
import {
    getProfileIDFromEmail,
    getUserFromEmail,
    getUserProfile,
} from '@/app/utils/database/controller/profiles/profiles';

import {
    createFirstTimeRenewalOrder,
    createUpcomingRenewalOrder,
    getLatestRenewalOrderForOriginalOrderId,
    getLatestRenewalOrderForSubscription,
    getLatestRenewalOrderWithVariant,
    getRenewalOrder,
    updateRenewalOrder,
    updateRenewalOrderByRenewalOrderId,
    updateRenewalOrderFromRenewalOrderId,
} from '@/app/utils/database/controller/renewal_orders/renewal_orders';
import { extractRenewalOrderId } from '@/app/utils/functions/client-utils';
import {
    convertDateToEpoch,
    convertEpochToDate,
} from '@/app/utils/functions/dates';
import { getProductName } from '@/app/utils/functions/formatting';
import { convertBundleVariantToSingleVariant } from '@/app/utils/functions/pharmacy-helpers/bundle-variant-index-mapping';
import { getOrderStatusDetails } from '@/app/utils/functions/renewal-orders/renewal-orders';
import { isEmpty } from 'lodash';
import Stripe from 'stripe';
import { PrescriptionSubscription } from '@/app/components/patient-portal/subscriptions/types/subscription-types';
import { sendRenewalCurexaOrder } from '@/app/services/pharmacy-integration/curexa/curexa-actions';
import { sendRenewalOrderToEmpower } from '@/app/services/pharmacy-integration/empower/send-script';
import { sendGGMRenewalRequest } from '@/app/services/pharmacy-integration/gogomeds/ggm-actions';
import { sendRenewalOrderToTMC } from '@/app/services/pharmacy-integration/tmc/tmc-actions';
import { getOrderByPatientId } from '@/app/utils/actions/provider/prescription-requests';
import { processDosageSelectionFirstTimeRequest } from '@/app/utils/actions/intake/order-util';

export async function auditHallandaleOrder(user_id: string, order_id: string) {
    const supabase = createSupabaseServiceClient();

    await supabase.from('tirzepatide_orders').insert({
        user_id,
        order_id,
    });
}

export async function insertNewGclid(
    user_id: string,
    product_href: string,
    gclid: string
) {
    const supabase = createSupabaseServiceClient();

    await supabase.from('gclids').insert({
        user_id,
        gclid,
        product_href,
    });
}

export async function resendEmailScripts() {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase.from('tmp_emails').select('*');

    if (!data) {
        console.error('no data');
        return;
    }
    for (const item of data) {
        const email = item.email;
        try {
            const customer_id = await getProfileIDFromEmail(email);
            if (!data) {
                console.error('Could not get customer id', email);
                continue;
            }
            const orders = await getOrderByPatientId(customer_id);

            if (!orders.data) {
                console.error('Errr order data', email);
                continue;
            }

            if (orders.data.length > 1) {
                console.error('too many orders', email);
                continue;
            }

            const order = orders.data[0];

            const baseOrder = await getBaseOrderById(order.id);

            if (!baseOrder) {
                console.error('no base order', email);
                continue;
            }

            const priceData = await getPriceDataRecordWithVariant(
                baseOrder.product_href,
                baseOrder.variant_index
            );

            if (!priceData) {
                console.error('no price', email);
                continue;
            }

            await processDosageSelectionFirstTimeRequest(baseOrder, priceData);
        } catch (error) {
            console.error(error, email);
        }
    }
}

export async function beepStripe() {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

    const stripe_subscription_id = 'sub_1Q18sSDyFtOu3ZuT6D8n1MHL';

    const stripeSubscription = await stripe.subscriptions.retrieve(
        stripe_subscription_id
    );

    if (stripeSubscription.schedule) {
        await stripe.subscriptionSchedules.release(
            stripeSubscription.schedule.toString()
        );
    }

    // console.log(subscription);

    // const subscriptionSchedule = await stripe.subscriptionSchedules.create({
    //     from_subscription: stripe_subscription_id,
    // });
    console.log(stripeSubscription.items.data);
    const old_price_id = stripeSubscription.items.data[0].price.id;
    const new_price_id = 'price_1PMFsoDyFtOu3ZuT8ajgCmBa';

    await stripe.subscriptions.update(stripe_subscription_id, {
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
}

export async function resendOrders() {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase.rpc('get_temp_resend_orders');

    for (const order of data) {
        const order_id = order.order_id;

        await updateStatusTagToReview(AUTO_STATUS_CHANGER_UUID, order_id);
    }
}

export async function insertNewProfileAdsTracking(
    user_id: string,
    ad_id: string,
    type: 'google' | 'meta'
) {
    const supabase = createSupabaseServiceClient();

    await supabase.from('profile_ads_tracking').insert({
        user_id,
        ...(type === 'google' && { gclid: ad_id }),
        ...(type === 'meta' && { fbclid: ad_id }),
    });
}

export async function insertNewFbclid(
    user_id: string,
    product_href: string,
    fbclid: string
) {
    const supabase = createSupabaseServiceClient();

    await supabase.from('fbclids').insert({
        user_id,
        fbclid,
        product_href,
    });
}

export async function fixIDJob() {
    const supabase = createSupabaseServiceClient();

    console.log('Starting fixIDJob...');

    const { data, error } = await supabase
        .from('job_scheduler')
        .select('*')
        .eq('job_type', 'id_selfie_check_post_checkout')
        .is('last_run_at', null);

    if (error) {
        console.error('Error fetching jobs:', error);
        return;
    }

    if (!data || data.length === 0) {
        console.log('No jobs found for processing.');
        return;
    }

    console.log(`Found ${data.length} jobs to process.`);

    for (const order of data) {
        const orderId = order.metadata?.order_id;
        const patientId = order.metadata?.patient_id;

        if (!orderId || !patientId) {
            console.warn(`Skipping order due to missing metadata:`, order);
            continue;
        }

        try {
            const hasReviewTag = await getAllStatusTagsForOrder(orderId);

            if (!hasReviewTag) {
                await updateStatusTagToReview(patientId, orderId);
                console.log(
                    `✅ Successfully updated order ${orderId} to 'Review'`
                );
            } else {
                console.log(`ℹ️ Order ${orderId} already has 'Review' status.`);
            }
        } catch (err) {
            console.error(`❌ Failed to process order ${orderId}:`, err);
        }
    }

    console.log('FixIDJob completed.');
}

export async function getAllStatusTagsForOrder(
    order_id: string
): Promise<boolean> {
    const supabase = createSupabaseServiceClient();
    console.log('Fetching status tags for order:', order_id);

    const { data, error } = await supabase
        .from('patient_status_tags')
        .select('*')
        .eq('order_id', order_id)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching status tags:', error);
        return false; // Handle error case appropriately
    }

    // Check if any of the items have a status_tag of 'Review'
    return data.some((item) => item.status_tag === 'Review');
}

export async function insertNewUrl(user_id: string, url: string) {
    const supabase = createSupabaseServiceClient();

    await supabase.from('urls').insert({
        user_id,
        url,
    });
}

export async function seeWhoPaid() {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

    try {
        // Calculate the timestamp for one month ago
        const startDate = Math.floor(
            new Date('2024-10-25T00:00:00Z').getTime() / 1000
        );
        const endDate = Math.floor(
            new Date('2024-11-13T23:59:59Z').getTime() / 1000
        );

        const renewalInvoices = [];

        console.log('starting');

        // Use auto-pagination to retrieve all invoices
        for await (const invoice of stripe.invoices.list({
            created: { gte: startDate, lte: endDate }, // Greater than or equal to one month ago
            status: 'paid', // Only retrieve paid invoices
        })) {
            // Check if the invoice is a renewal invoice
            if (
                (invoice.billing_reason === 'subscription_cycle' ||
                    invoice.billing_reason === 'subscription_update') &&
                invoice.amount_paid > 0
            ) {
                renewalInvoices.push({
                    stripe_customer_id: invoice.customer,
                    invoice_id: invoice.id,
                    stripe_subscription_id: invoice.subscription,
                    created_at: convertEpochToDate(invoice.created),
                });
                // console.log(
                //     `Invoice ID: ${invoice.id}, Amount Paid: ${invoice.amount_paid}`,
                // );
            }
        }

        console.log('renewal invoices length', renewalInvoices.length);

        const supabase = createSupabaseServiceClient();

        await supabase.from('tmp_fixes').insert(renewalInvoices);
        // console.log(renewalInvoices);

        // Now you can process all renewal invoices as needed
    } catch (error) {
        console.error('Error retrieving renewal invoices:', error);
    }
}

const emails = [
    'mreece29@yahoo.com',
    'untgrad04@gmail.com',
    'nessamauricio1@gmail.com',
    'dkee327@gmail.com',
    'sbnkqkbpfv@privaterelay.appleid.com',
    'thebigchill910@hotmail.com',
    'sullivan.donna2@gmail.com',
    'traciememerson@msn.com',
    'susansi01@aol.com',
    'kwcttbyz9r@privaterelay.appleid.com',
    'robinson.erick@gmail.com',
    'kwcttbyz9r@privaterelay.appleid.com',
    'tiffandjeremy2012@gmail.com',
    'tricia.gruhn@gmail.com',
    'dcmcclain@aol.com',
    'carapierce@sbcglobal.net',
    'tiffandjeremy2012@gmail.com',
    'myv4f9257f@privaterelay.appleid.com',
    'nalani31@gmail.com',
    '9rhpxcxjt5@privaterelay.appleid.com',
    'xjfm6259n8@privaterelay.appleid.com',
    'gmhamvay@gmail.com',
    'marlayna@hotmail.com',
    'renaenicole86@gmail.com',
    'foreverblessedx3@gmail.com',
    'kevin.williams007.kw@gmail.com',
    'rb372568@dal.ca',
    'reagan.quinn@yahoo.com',
    'jerry.crump80@gmail.com',
];

export async function doCrazyStuff() {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase.from('tmp_fixes').select();

    if (!data) {
        return;
    }

    const orders = [];

    console.log('starting', data.length);

    for (const order of data) {
        const { subscription } = await getSubscriptionWithStripeSubscriptionId(
            order.stripe_subscription_id
        );

        if (!subscription) {
            continue;
        }

        const latestOrder = await getLatestRenewalOrderForSubscription(
            subscription.id
        );

        if (!latestOrder) {
            continue;
        }

        const profile = await getUserProfile(latestOrder?.customer_uuid!);

        if (!profile) {
            continue;
        }

        if (
            new Date(latestOrder?.created_at!) <
            new Date('2024-10-25T00:00:00Z')
        ) {
            orders.push({
                created_at: order.created_at,
                user_id: latestOrder?.customer_uuid,
                email: profile?.email,
                stripe_subscription_id: order.stripe_subscription_id,
                product_href: latestOrder?.product_href,
                renewal_order_id: latestOrder?.renewal_order_id,
            });
        }
    }

    await supabase.from('tmp_res').insert(orders);
}

export async function updateStripeSubscriptionTester() {
    const supabase = createSupabaseServiceClient();
    for (const email of emails) {
        await delay(1500);
        try {
            const user = await getUserFromEmail(email);
            if (!user) {
                throw new Error(`no user found ${email}`);
            }

            const { data, error } = await supabase
                .from('renewal_orders')
                .select('*')
                .eq('customer_uuid', user.id)
                .order('created_at', { ascending: false })
                .limit(1)
                .maybeSingle();

            if (!data || data.length === 0) {
                throw new Error(`Could not find renewal order for ${email}`);
            }

            const newVariantIndex = convertBundleVariantToSingleVariant(
                data.product_href,
                data.variant_index
            );

            await updateStripeProduct(
                data.subscription_id,
                newVariantIndex,
                false
            );
            console.log('success', email);
        } catch (error) {
            console.error(error);
        }
    }
}

export async function populateVariantIndexes() {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase.rpc(
        'get_latest_null_variant_orders_for_products'
    );

    if (error) {
        console.error('Error fetching null variant index orders:', error);
        return;
    }

    if (!data || data.length === 0) {
        console.log('No renewal orders with null variant index found.');
        return;
    }

    // Prepare an array of promises to handle updates in parallel
    const updatePromises = data.map(async (renewalOrder: any) => {
        try {
            let variant_index;
            // Try to fetch the latest renewal order with a valid variant_index
            const latestRenewalOrder = await getLatestRenewalOrderWithVariant(
                renewalOrder.original_order_id
            );

            if (latestRenewalOrder) {
                const latestRenewalOrderDetails = extractRenewalOrderId(
                    latestRenewalOrder.renewal_order_id
                );
                const currentRenewalOrderDetails = extractRenewalOrderId(
                    renewalOrder.renewal_order_id
                );

                if (
                    latestRenewalOrderDetails[1] >=
                    currentRenewalOrderDetails[1]
                ) {
                    console.log('SKIP');
                    return null;
                }

                variant_index = latestRenewalOrder.variant_index;
            } else {
                // If no latest renewal order is found, fetch the base order
                const order = await getBaseOrderById(
                    renewalOrder.original_order_id
                );

                if (!order) {
                    console.error(
                        'Base order not found for original_order_id:',
                        renewalOrder.original_order_id
                    );
                    return null;
                }
                variant_index = order.variant_index;
            }

            if (!variant_index) {
                if (variant_index == 0) {
                } else {
                    throw Error(
                        `Could not variant index for order ${renewalOrder.renewal_order_id}`
                    );
                }
            }

            // Update the renewal order with the fetched variant_index
            await updateRenewalOrderByRenewalOrderId(
                renewalOrder.renewal_order_id,
                { variant_index }
            );
        } catch (err) {
            console.error(
                'Error processing renewal order:',
                renewalOrder.renewal_order_id,
                err
            );
        }
    });

    // Await all updates in parallel
    await Promise.all(updatePromises);

    console.log('Variant indexes populated successfully.');
}

export async function populationSubscriptionId() {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('action_items')
        .select('*')
        .gte('id', 650)
        .is('subscription_id', null)
        .order('id');

    if (!data) {
        console.error('data null');
        return;
    }

    for (const item of data) {
        const actionItem = new ActionItemFactory(item.type);

        const product_href = actionItem.getProductHref();
        const num = actionItem.getIteration();

        const { data: subscription, error: subError } = await supabase
            .from('prescription_subscriptions')
            .select('*')
            .eq('product_href', product_href)
            .eq('patient_id', item.patient_id)
            .maybeSingle();

        if (!subscription || !subscription.id) {
            console.error('error', item);
            continue;
        }

        await supabase
            .from('action_items')
            .update({
                iteration: num + 1,
                subscription_id: subscription.id,
                action_type: 'check_up',
                product_href,
            })
            .eq('id', item.id);

        console.log(`action item ${item.id} succeess`);
    }
}

export async function completedDosageSelectionForRenewalOrder(
    renewalOrder: RenewalOrder
) {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('audit_checkup')
        .select('*')
        .eq('form_type', 'dosage_suggestion')
        .eq('patient_id', renewalOrder.customer_uuid)
        .order('id', { ascending: false })
        .limit(1);

    if (!data) {
        return false;
    }

    if (data[0]) {
        const record = data[0];

        const completedAt = record.created_at;

        if (new Date(completedAt) >= new Date(renewalOrder.created_at)) {
            return true;
        }
    }

    return false;
}

export async function revenueAnalysis() {
    const supabase = createSupabaseServiceClient();

    const priceDetails = {
        'b12-injection': {
            0: 90,
            1: 225,
        },
        'glutathione-injection': {
            0: 165,
        },
        metformin: {
            0: 75,
        },
        'nad-face-cream': {
            0: 150,
        },
        'nad-injection': {
            0: 259,
        },
        'nad-nasal-spray': {
            0: 119,
        },
        semaglutide: {
            2: 219,
            3: 219,
            4: 219,
            5: 449,
            6: 477.15,
            7: 603.72,
            8: 808.92,
            9: 916.92,
            10: 1024.92,
            11: 477.15,
            12: 477.15,
            13: 219,
            14: 219,
        },
        tirzepatide: {
            3: 399,
            4: 399,
            5: 529,
            6: 702,
            8: 1186.92,
            9: 1399,
            12: 1599,
            13: 2299,
            15: 729,
            16: 702,
            19: 1186.92,
        },
        tretinoin: {
            1: 35,
        },
    };

    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .gte('submission_time', '10-01-2024')
        .lte('submission_time', '10-30-2024')
        .eq('environment', 'prod');

    var running = 0;

    if (!data) {
        return;
    }

    // for (const order of data) {
    //     const price = priceDetails[order.product_href][order.variant_index];
    //     running += price;
    // }

    console.log('total price: ', running);
}

export async function buildNewFirstTimeOrder(
    order_id: number,
    variantIndex: number
) {
    const order = await getBaseOrderById(order_id);

    if (!order) {
        console.error('no order');
        return;
    }

    const priceDetails = await getPriceDataRecordWithVariant(
        order.product_href,
        variantIndex
    );

    if (!priceDetails) {
        console.error('price details');
        return;
    }

    console.log(priceDetails);

    const orderPayload: Partial<BaseOrderInterface> = {
        address_line1: order.address_line1,
        address_line2: order.address_line2,
        city: order.city,
        zip: order.zip,
        state: order.state,
        source: 'admin',
        question_set_version: order.question_set_version,
        subscription_type: priceDetails.cadence as SubscriptionCadency,
        stripe_metadata: {
            clientSecret: '',
            setupIntentId: '',
            paymentMethodId: order?.stripe_metadata?.paymentMethodId,
        },
        variant_index: variantIndex,
        price_id: priceDetails.stripe_price_ids!.prod,
        customer_uid: order.customer_uid,
        variant_text: priceDetails.variant,
        order_status: OrderStatus.UnapprovedCardDown,
        product_href: order.product_href,
        assigned_pharmacy: priceDetails.pharmacy,
        environment: 'prod',
        submission_time: new Date(Date.now()).toISOString(),
    };

    const newOrder = await insertNewFirstTimeOrder(orderPayload);

    await updateStatusTagToReview(newOrder.customer_uid, String(newOrder.id));
}

export async function sendInjection(renewal_order_id: string) {
    const renewalOrder = await getRenewalOrder(renewal_order_id);

    if (!renewalOrder) {
        console.error('error');
        return;
    }

    const sub = await getPrescriptionSubscription(renewalOrder.subscription_id);

    if (!sub) {
        console.error('error');
        return;
    }

    const factory = ScriptHandlerFactory.createHandler(
        renewalOrder,
        sub,
        ScriptSource.Manual
    );

    factory.sendScript();
}

export async function handlePharmacyRenewal(
    subscription: PrescriptionSubscription,
    renewalOrder: RenewalOrder
) {
    switch (subscription.assigned_pharmacy) {
        case 'curexa':
            await sendRenewalCurexaOrder(subscription, renewalOrder);
            break;
        case 'ggm':
            await sendGGMRenewalRequest(subscription, renewalOrder);
            break;
        case 'tmc':
            await sendRenewalOrderToTMC(subscription, renewalOrder);
            break;
        case 'empower':
            await sendRenewalOrderToEmpower(subscription, renewalOrder);
            break;
        default:
            break;
    }
}

export async function resendNonWLOrders() {
    const order_ids = [
        { order_id: '30860', quantity: 2 },
        { order_id: '23483-5', quantity: 2 },
        { order_id: '25918', quantity: 3 },
        { order_id: '25726', quantity: 1 },
        { order_id: '34741', quantity: 1 },
        { order_id: '37010', quantity: 1 },
        { order_id: '26911', quantity: 1 },
        { order_id: '26889', quantity: 1 },
        { order_id: '27118', quantity: 1 },
        { order_id: '38107', quantity: 1 },
        { order_id: '31728', quantity: 2 },
        { order_id: '37811', quantity: 1 },
        { order_id: '27417', quantity: 3 },
        { order_id: '39657', quantity: 1 },
        { order_id: '7663', quantity: 1 },
        { order_id: '27659', quantity: 1 },
        { order_id: '26024-1', quantity: 1 },
        { order_id: '21016-4', quantity: 2 },
    ];
}

export async function resendNonWLOrder(order_id: string) {
    if (order_id.includes('-')) {
        const renewalOrder = await getRenewalOrder(order_id);

        if (!renewalOrder) {
            console.log('ERROR', order_id);
            return;
        }

        const subscription = await getPrescriptionSubscription(
            renewalOrder.subscription_id
        );

        if (!subscription) {
            console.log('NO SUB', order_id);
            return;
        }

        await handlePharmacyRenewal(subscription, renewalOrder);
    } else {
        await createFirstTimeRenewalOrder(order_id);

        const renewalOrder = await getLatestRenewalOrderForOriginalOrderId(
            order_id
        );

        if (!renewalOrder) {
            console.log('ERROR', order_id);
            return;
        }

        const subscription = await getPrescriptionSubscription(
            renewalOrder.subscription_id
        );

        if (!subscription) {
            console.log('NO SUB', order_id);
            return;
        }

        await handlePharmacyRenewal(subscription, renewalOrder);
    }

    // mark resolves

    await updateStatusTagToResolved(
        order_id,
        AUTO_STATUS_CHANGER_UUID,
        'Marked resolved after sending script'
    );
}

export async function correctScript() {
    const supabase = createSupabaseServiceClient();

    // Fetch active prescription subscriptions
    const { data: subscriptions, error: subscriptionError } = await supabase
        .from('prescription_subscriptions')
        .select('*')
        .eq('status', 'active')
        .in('product_href', ['tirzepatide', 'semaglutide'])
        .eq('subscription_type', 'quarterly');

    if (subscriptionError) {
        console.error('Error fetching subscriptions:', subscriptionError);
        return;
    }

    if (!subscriptions || subscriptions.length === 0) {
        console.log('No active subscriptions found.');
        return;
    }

    console.log('TOTAL SUBS:', subscriptions.length);

    // Process subscriptions
    for (let counter = 0; counter < subscriptions.length; counter++) {
        const subscription = subscriptions[counter];
        console.log(`PROCESSING ${counter}`);
        await delay(1500);

        try {
            const stripeSubscription = await getStripeSubscription(
                subscription.stripe_subscription_id
            );

            // Skip if Stripe subscription is not active or has a schedule
            if (stripeSubscription.status !== 'active') {
                console.log('Stripe subscription not active');
                continue;
            }

            if (stripeSubscription.schedule) {
                console.log('Stripe subscription has a schedule, skipping');
                continue;
            }

            // Get the latest renewal order
            let renewalOrder = await getLatestRenewalOrderForSubscription(
                subscription.id
            );

            if (!renewalOrder) {
                console.log('Creating first-time order...');
                await createFirstTimeRenewalOrder(
                    String(subscription.order_id)
                );

                renewalOrder = await getLatestRenewalOrderForSubscription(
                    subscription.id
                );

                if (!renewalOrder) {
                    console.error(
                        'Could not find renewal order after creation:',
                        subscription.id
                    );
                    continue;
                }
            }

            // Skip if dosage selection is completed
            if (renewalOrder.dosage_selection_completed) {
                console.log('Dosage selection already complete, skipping');
                continue;
            }

            // Check if dosage selection has been completed
            const completedDosage =
                await completedDosageSelectionForRenewalOrder(renewalOrder);

            if (completedDosage) {
                console.log(
                    'Dosage selection completed, logging fix to tmp_fixes'
                );
                await supabase.from('tmp_fixes').insert({
                    user_id: renewalOrder.customer_uuid,
                    order_id: renewalOrder.renewal_order_id,
                    subscription_id: renewalOrder.subscription_id,
                });
                continue;
            }

            // Determine variant index
            let variant_index = renewalOrder.variant_index;
            if (!variant_index) {
                const baseOrder = await getBaseOrderById(
                    renewalOrder.original_order_id
                );

                if (!baseOrder) {
                    console.error(
                        'Could not find base order for renewal order:',
                        renewalOrder
                    );
                    continue;
                }

                variant_index = baseOrder.variant_index;
            }

            const newVariantIndex = convertBundleVariantToSingleVariant(
                renewalOrder.product_href,
                variant_index
            );

            const { isPaid } = getOrderStatusDetails(renewalOrder.order_status);

            if (isPaid) {
                console.log('Order is paid, logging to tmp_fixes');
                await supabase.from('tmp_fixes').insert({
                    user_id: renewalOrder.customer_uuid,
                    order_id: renewalOrder.renewal_order_id,
                    subscription_id: renewalOrder.subscription_id,
                });
            } else {
                console.log('Updating Stripe product with new variant index');
                await updateStripeProduct(
                    subscription.id,
                    newVariantIndex,
                    false
                );
            }
        } catch (err) {
            await supabase.from('tmp_fixes').insert({
                user_id: subscription.customer_uuid,
                order_id: subscription.order_id,
                subscription_id: subscription.id,
            });
            console.error(
                'Error processing subscription:',
                subscription.id,
                err
            );
        }
    }
}

const addDeltaToDate = (
    date: Date,
    delta: number,
    unit: 'd' | 'm' | 'y'
): Date => {
    const newDate = new Date(date);
    switch (unit) {
        case 'd':
            newDate.setDate(newDate.getDate() + delta);
            break;
        case 'm':
            newDate.setMonth(newDate.getMonth() + delta);
            break;
        case 'y':
            newDate.setFullYear(newDate.getFullYear() + delta);
            break;
        default:
            break;
    }
    return newDate;
};

export async function refundCustomerAndSendScript() {
    const renewalOrder = await getRenewalOrder('9685-1');

    if (!renewalOrder) {
        return;
    }

    const order = await getBaseOrderById(renewalOrder.original_order_id);
    if (!order) {
        return;
    }

    const newIndex = convertBundleVariantToSingleVariant(
        renewalOrder.product_href,
        order.variant_index
    );

    const newPharmacy = getEligiblePharmacy(
        renewalOrder.product_href,
        newIndex
    );

    await updateStripeProduct(renewalOrder.subscription_id, newIndex, true);

    const { data, status } = await updateRenewalOrderByRenewalOrderId(
        renewalOrder.renewal_order_id,
        {
            variant_index: newIndex,
            assigned_pharmacy: newPharmacy,
        }
    );

    if (status === Status.Failure) {
        console.error('error');
        return;
    }

    const updatedOrder = data!;

    const subscription = await getPrescriptionSubscription(
        updatedOrder.subscription_id
    );

    if (!subscription) {
        console.error('error in sub');
        return;
    }
    // const scriptHandler = ScriptHandlerFactory.createHandler(
    //     updatedOrder,
    //     subscription,
    // );

    // await scriptHandler.regenerateAndSendScript();
}

export async function autoSendMacro() {
    // const renewalOrder = await getBaseOrderById(22748);
    const renewalOrder = await getRenewalOrder('3476-4');
    if (!renewalOrder) {
        return;
    }

    const { data: patientData, error: patientDataError } =
        await getPatientInformationById(renewalOrder.customer_uuid!);

    if (!patientData) {
        return;
    }

    const macroHtml = await getProviderMacroHTMLPrePopulated(
        renewalOrder.product_href!,
        renewalOrder.variant_index,
        patientData,
        renewalOrder.assigned_provider!
    );

    if (macroHtml) {
        const thread_id = await getThreadIDByPatientIDAndProduct(
            renewalOrder.customer_uuid!,
            renewalOrder.product_href!
        );

        if (thread_id === '') {
            console.error('Could not find thread for user');
            await forwardOrderToEngineering(
                String(renewalOrder.renewal_order_id)!,
                renewalOrder.customer_uuid!,
                'Did not send sig after sending one month vial'
            );
        }
        const messagePayload: MessagePayload = {
            content: macroHtml,
            sender_id: renewalOrder.assigned_provider!,
            thread_id: Number(thread_id),
            contains_phi: false,
            requires_coordinator: false,
            requires_lead: false,
            requires_provider: false,
        };
        await postNewMessage(messagePayload);

        console.log(
            'Nathan invoicePaid Log 2 message payload delivery',
            messagePayload
        );
    }
}

// To fix UpdateSubscription

export async function markResolvedOrdersResolved() {
    const supabase = createSupabaseServiceClient();

    // Fetch resend orders from Supabase RPC
    const { data: resendOrders, error } = await supabase.rpc(
        'get_temp_resend_orders'
    );
    console.log(resendOrders);

    for (const order of resendOrders) {
        console.log('doing');
        await createUserStatusTagWAction(
            StatusTag.Resolved,
            order.order_id,
            StatusTagAction.REPLACE,
            AUTO_STATUS_CHANGER_UUID,
            'Resolved by script',
            AUTO_STATUS_CHANGER_UUID,
            [StatusTag.Resolved]
        );
    }
    console.log('done');
}

export async function updatePeoplesStripeSubscription() {
    const supabase = createSupabaseServiceClient();

    // Fetch resend orders from Supabase RPC
    const { data: resendOrders, error } = await supabase.rpc(
        'get_temp_resend_orders'
    );

    if (error || !resendOrders) {
        console.error('Failed to fetch resend orders', error);
        return;
    }

    await Promise.allSettled(
        resendOrders.map(async (resendOrder: any) => {
            try {
                const renewalOrder = await getRenewalOrder(
                    resendOrder.order_id
                );
                if (!renewalOrder) {
                    console.error('Renewal order not found', resendOrder);
                    return;
                }

                const baseOrder = await getBaseOrderById(
                    renewalOrder.original_order_id
                );
                if (!baseOrder) {
                    console.error('Base order not found', resendOrder);
                    return;
                }

                const newVariantIndex = convertBundleVariantToSingleVariant(
                    renewalOrder.product_href,
                    baseOrder.variant_index
                );

                // Update Stripe product with new variant
                await updateStripeProduct(
                    renewalOrder.subscription_id,
                    newVariantIndex,
                    false
                );
                console.log(
                    'Stripe subscription updated',
                    renewalOrder.renewal_order_id
                );

                // Create user status tag
                await createUserStatusTagWAction(
                    StatusTag.Resolved,
                    renewalOrder.renewal_order_id,
                    StatusTagAction.REPLACE,
                    renewalOrder.customer_uuid,
                    'Updated stripe sub',
                    'ffabc905-5508-4d54-98fb-1e2ef2b9e99a',
                    [StatusTag.Resolved]
                );
            } catch (err) {
                console.error(
                    'Error processing renewal order',
                    resendOrder,
                    err
                );
            }
        })
    );
}

export async function manuallyGenerateHallandaleScript(
    user_id: string,
    renewal_order_id: string,
    variant_index: number
) {
    const { data: patientData, error: patientDataError } =
        await getPatientInformationById(user_id);

    const { data: allergyData, error: allergyError } =
        await getPatientAllergyData(user_id, 'asd');

    const { type: orderType, data: renewalOrder } = await fetchOrderData(
        renewal_order_id
    );

    if (patientData && renewalOrder && allergyData) {
        const scriptMetadata = generateHallandaleScript(
            patientData,
            renewalOrder,
            {
                address_line1: '',
                address_line2: '',
                state: '',
                zip: '',
                city: '',
            },
            OrderType.RenewalOrder,
            variant_index
        );

        if (scriptMetadata) {
            const base64pdf = convertHallandaleOrderToBase64(
                scriptMetadata.script,
                allergyData && allergyData.length > 0
                    ? allergyData[0].allergies
                    : 'nkda'
            );

            const orderWithPdf: HallandaleOrderObject = {
                ...scriptMetadata.script,
                document: { pdfBase64: base64pdf },
            };

            const body_json: HallandaleScriptJSON = {
                message: {
                    id: renewalOrder.id,
                    sentTime: new Date().toISOString(),
                },
                order: orderWithPdf,
            };

            const pharmacy = getEligiblePharmacy(
                renewalOrder.product_href,
                variant_index
            );

            await updateRenewalOrderFromRenewalOrderId(renewal_order_id, {
                prescription_json: body_json,
                assigned_pharmacy: pharmacy,
            });
        }
    }
}

// To fix resend script
export async function letsSendScripts() {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase.rpc('get_temp_resend_orders');

    if (!data) {
        return;
    }

    await Promise.allSettled(
        data.map((data: any) => updateStatusTags(data.order_id))
    );
}

export async function correctWronglyPaidOrders(
    renewal_order_id: string,
    variant_index: number
) {
    const renewal_order = await getRenewalOrder(renewal_order_id);
    if (!renewal_order) {
        return;
    }

    await updateStripeProduct(
        renewal_order.subscription_id,
        variant_index,
        true
    );

    const assigned_pharmacy = await getEligiblePharmacy(
        renewal_order.product_href,
        variant_index
    );

    await updateRenewalOrderByRenewalOrderId(renewal_order_id, {
        subscription_type: SubscriptionCadency.Monthly,
        variant_index,
        assigned_pharmacy,
    });

    await updatePrescriptionSubscription(renewal_order.subscription_id, {
        subscription_type: SubscriptionCadency.Monthly,
        variant_text: '',
    });

    await triggerEvent(renewal_order.customer_uuid, WL_CHECKIN_INCOMPLETE, {
        checkin_url: `https://app.gobioverse.com/check-up/${renewal_order.product_href}`,
        order_id: renewal_order.renewal_order_id,
    });

    await createUserStatusTagWAction(
        StatusTag.Resolved,
        renewal_order_id,
        StatusTagAction.REPLACE,
        renewal_order.customer_uuid,
        'Refunded and resolved',
        AUTO_STATUS_CHANGER_UUID,
        [StatusTag.Resolved]
    );
}

export async function updateStatusTags(order_id: string) {
    const renewal_order = await getBaseOrderById(Number(order_id));
    if (!renewal_order) {
        return;
    }

    await createUserStatusTagWAction(
        StatusTag.Review,
        order_id,
        StatusTagAction.REPLACE,
        renewal_order.customer_uid,
        'Review pts order request',
        AUTO_STATUS_CHANGER_UUID,
        [StatusTag.Review]
    );
}

/**
 * Note from Nathan : By making the matrix I deprecated the:
 * await scriptHandler.convertVariantIndex
 *
 * above code is deprecated, and there is a controller for that process now.
 * @returns
 */
// export async function resendScriptsForSomeOrders(renewal_order_id: string) {
//     const renewalOrder = await getRenewalOrder(renewal_order_id);

//     if (!renewalOrder) {
//         console.log('no renewal order');
//         return;
//     }

//     const subscription = await getPrescriptionSubscription(
//         renewalOrder?.subscription_id
//     );

//     if (!subscription) {
//         console.log('no sub');
//         return;
//     }

//     let scriptHandler = ScriptHandlerFactory.createHandler(
//         renewalOrder,
//         subscription,
//         ScriptSource.Engineer
//     );

//     const stripeSub = await getStripeSubscription(
//         subscription.stripe_subscription_id
//     );

//     const price_id = stripeSub.items.data[0].price.id;

//     const varIndex = getVariantIndexByPriceId(
//         renewalOrder.product_href as PRODUCT_HREF,
//         price_id
//     );

//     const { data, status } = await scriptHandler.convertVariantIndex(
//         Number(varIndex)
//     );

//     if (status === Status.Failure) {
//         console.error('Something went wrong');
//         return;
//     }
//     scriptHandler = data;

//     await scriptHandler.regenerateAndSendScript();
// }

// export async function testStripeStuff() {
//     const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});
//     const supabase = createSupabaseServiceClient();

//     let hasMore = true;
//     let lastInvoiceId = null;
//     let invoicesWithCoupon: any[] = [];
//     console.log('hello');

//     while (hasMore) {
//         const params = {
//             limit: 100, // Maximum allowed value is 100
//         };

//         if (lastInvoiceId) {
//             params.starting_after = lastInvoiceId; // For pagination
//         }

//         // Fetch invoices
//         const invoices = await stripe.invoices.list(params);

//         // Filter invoices with the given coupon
//         const filteredInvoices = invoices.data.filter(async (invoice) => {
//             const priceId = invoice.lines.data[0]?.price?.id;
//             const { subscription } =
//                 await getSubscriptionWithStripeSubscriptionId(
//                     invoice.subscription?.toString() || '',
//                 );

//             if (!priceId || !subscription) {
//                 return false;
//             }
//             const varIndex = getVariantIndexByPriceId(
//                 subscription.product_href as PRODUCT_HREF,
//                 priceId,
//             );

//             if (
//                 !['semaglutide', 'tirzepatide'].includes(
//                     subscription.product_href,
//                 )
//             ) {
//                 return false;
//             }

//             const cadency =
//                 GLP1_STRIPE_PRICE_ID_LIST[subscription.product_href][varIndex][
//                     'cadency'
//                 ];

//             if (cadency === SubscriptionCadency.Monthly) {
//                 return false;
//             }

//             if (
//                 invoice.discount &&
//                 (invoice.discount.coupon.id === '0OY1wzJJ' ||
//                     invoice.discount.coupon.id === '6JYNXzZ2')
//             ) {
//                 await supabase.from('tmp_fixes').insert({
//                     user_id: subscription.patient_id,
//                     subscription_id: subscription.id,
//                     invoice_id: invoice.id.toString(),
//                 });
//                 console.log('Inserted for', invoice.subscription);
//             }
//         });

//         // Append to the result list
//         invoicesWithCoupon = invoicesWithCoupon.concat(filteredInvoices);

//         // Pagination
//         hasMore = invoices.has_more;
//         if (hasMore) {
//             lastInvoiceId = invoices.data[invoices.data.length - 1].id;
//         }
//     }

//     // if (await refundCustomerForPriceDifference(stripeSubscription.customer.toString(), 'price_1PiIqADyFtOu3ZuT8ptETEAh', 'price_1PiIr6DyFtOu3ZuTNVoUM8iG'))
// }

// export async function findEarliestStripeSubscription() {
//     let subscriptions = [];
//     let hasMore = true;
//     let startingAfter = null;

//     while (hasMore) {
//         const response = await stripe.subscriptions.list({
//             limit: 100, // Fetch in batches of 100
//             starting_after: startingAfter,
//             price: 'price_1PNiJrDyFtOu3ZuTJuqwK59p',
//         });

//         subscriptions = subscriptions.concat(response.data);
//         hasMore = response.has_more;
//         startingAfter = response.data[response.data.length - 1].id;
//     }

//     // Find the earliest subscription
//     const earliestSubscription = subscriptions.reduce(
//         (earliest, subscription) => {
//             return !earliest || subscription.created < earliest.created
//                 ? subscription
//                 : earliest;
//         },
//         null,
//     );

//     return earliestSubscription;
// }

export async function populateHallandaleShipping() {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('renewal_orders')
        .select('*')
        .eq('order_status', RenewalOrderStatus.PharmacyProcessing)
        .eq('assigned_pharmacy', 'hallandale')
        .eq('environment', 'prod')
        .is('tracking_number', null);

    if (!data) {
        return;
    }

    for (const order of data as RenewalOrder[]) {
        await delay(5000);
        try {
            if (!order.external_tracking_metadata) {
                continue;
            }
            const hallandaleOrderId =
                order.external_tracking_metadata['hallandaleOrderId'];

            const { data: shippingData, error: shippingError } = await supabase
                .from('shipping_status_audit')
                .select('*')
                .eq('request_json->0->>orderId', hallandaleOrderId)
                .order('id', { ascending: false })
                .limit(1)
                .maybeSingle();

            if (!shippingData || isEmpty(shippingData)) {
                continue;
            }

            const trackingNumber =
                shippingData.request_json[0]['trackingNumber'];

            if (!trackingNumber) {
                continue;
            }

            // await createTracker(order.renewal_order_id, trackingNumber, FEDEX_CODE, PHARMACY.HALLANDALE);

            const payload = {
                tracker: {
                    tracking_code: trackingNumber,
                    carrier: FEDEX_CODE,
                },
            };

            const data = await fetchWithRetry(CREATE_TRACKER_BASE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Basic ${Buffer.from(
                        `${process.env.EASYPOST_API_KEY}:`
                    ).toString('base64')}`,
                },
                body: JSON.stringify(payload),
            });

            if (data.status === 'delivered') {
                await updateRenewalOrderByRenewalOrderId(
                    order.renewal_order_id,
                    {
                        shipping_status: 'Delivered',
                        tracking_number: trackingNumber,
                        easypost_tracking_id: data.id,
                    }
                );
            } else {
                const productName = getProductName(order.product_href);
                if (productName) {
                    await triggerEvent(
                        order.customer_uuid,
                        PRESCRIPTION_RENEWAL_SHIPPED,
                        {
                            order_id: order.renewal_order_id,
                            tracking_number: trackingNumber,
                            tracking_url: data.public_url,
                            product_name: productName,
                        }
                    );
                }
                await updateRenewalOrderByRenewalOrderId(
                    order.renewal_order_id,
                    {
                        shipping_status: 'Shipped',
                        tracking_number: trackingNumber,
                        easypost_tracking_id: data.id,
                    }
                );
            }
            console.log('processing', order.renewal_order_id);
        } catch (error) {
            console.error("Couldn't process", order.renewal_order_id, error);
        }
    }
}
// export async function testChargeCustomer() {
//     const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});
//     const supabase = createSupabaseServiceClient();

//     await stripe.subscriptions.create({
//         customer: 'cus_QulxzC43NlxEUF',
//         cancel_at_period_end: true,
//         items: [{ price: 'price_1Q5YneDyFtOu3ZuTJu4NGpIY' }],
//         metadata: { dont_process: 'true' },
//     });

//     return;

//     // Fetch all data at once
//     const { data, error } = await supabase
//         .from('tmp_fixes')
//         .select('*')
//         .eq('charged', false);

//     if (!data || error) {
//         console.error('Error fetching data from Supabase:', error);
//         return;
//     }

//     // Create an array to hold all the promises
//     const chargePromises = data.map(async (order) => {
//         const { email, amount } = order;
//         const user = await getUserFromEmail(email);

//         if (!user) {
//             console.warn(`User not found for email: ${email}`);
//             return; // Skip this iteration if user is not found
//         }

//         let priceId;

//         // Determine the price ID based on the amount
//         if (amount === '407.15') {
//             priceId = 'price_1Q5YneDyFtOu3ZuTJu4NGpIY';
//         } else if (amount === '652') {
//             priceId = 'price_1Q5YpSDyFtOu3ZuTtiLJza6c';
//         } else {
//             console.warn(
//                 `No matching price for amount: ${amount}, email: ${email}`,
//             );
//             return; // Skip if amount doesn't match
//         }

//         // Create the subscription
//         const res = await stripe.subscriptions.create({
//             customer: user.stripe_customer_id,
//             cancel_at_period_end: true,
//             items: [{ price: priceId }],
//             metadata: { dont_process: 'true' },
//         });

//         // Check the response and update Supabase
//         if (res?.status === 'active') {
//             await supabase
//                 .from('tmp_fixes')
//                 .update({ charged: true })
//                 .eq('email', email);
//             console.log(`Subscription created successfully for ${email}.`);
//         } else {
//             console.error(`Payment failed for customer ${email}`);
//         }
//     });

//     // Execute all promises concurrently
//     await Promise.all(chargePromises);
// }

export async function doMyStripe() {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});
    const supabase = createSupabaseServiceClient();

    const res = await stripe.subscriptions.create({
        customer: 'cus_QuofG3U3Z1V4NN',
        cancel_at_period_end: true,
        items: [
            {
                price: 'price_1Q5YS5DyFtOu3ZuTFLoMLUr2',
            },
        ],
        metadata: {
            dont_process: 'true',
        },
    });
    console.log(res);
}

function delay(ms: any) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// export async function addSubscriptionScheduleToProducts() {
//     // Find all bundle orders who didnt complete a check-in during their third month
//     const supabase = createSupabaseServiceClient();
//     const { data, error } = await supabase.rpc('get_users_to_update');

//     if (!data) {
//         console.log('err', data);
//         console.log(error);
//         return;
//     }
//     var counter = 0;

//     for (const order of data) {
//         const { renewal_order_id, original_order_id } = order;
//         console.log(order);
//         console.log(counter);
//         try {
//             if (!renewal_order_id) {
//                 continue;
//             }

//             const renewalOrder = await getRenewalOrder(renewal_order_id);

//             let number = renewal_order_id.charAt(renewal_order_id.length - 1);

//             if (!renewalOrder) {
//                 await forwardOrderToEngineering(
//                     renewal_order_id,
//                     null,
//                     'Did not update renewal order to single month vial - FOR OLIVIER',
//                 );
//                 continue;
//             }

//             let variant_index = renewalOrder.variant_index;

//             if (!variant_index) {
//                 if (number == '1') {
//                     const { data, error } = await getOrderById(
//                         original_order_id,
//                     );
//                     variant_index = data.variant_index;
//                 } else {
//                     const latest = Number(number) - 1;
//                     const newRenewal = await getRenewalOrder(
//                         `${original_order_id}-${latest}`,
//                     );
//                     if (newRenewal) {
//                         variant_index = newRenewal.variant_index;
//                     }
//                 }
//             }

//             if (!variant_index) {
//                 await forwardOrderToEngineering(
//                     renewal_order_id,
//                     null,
//                     'Did not update renewal order to single month vial - FOR OLIVIER',
//                 );
//                 continue;
//             }

//             await updateRenewalOrderQuarterlyProductToMonthlyVial(
//                 renewalOrder,
//                 variant_index,
//             );

//             await delay(1000);

//             counter += 1;
//         } catch (error) {
//             console.error(error);
//             await forwardOrderToEngineering(
//                 renewal_order_id,
//                 null,
//                 'Did not update renewal order to single month vial - FOR OLIVIER',
//             );
//         }
//     }
// }

export async function testSomeStuff() {
    const x = await getLatestRenewalOrderForSubscription(1619);

    console.log(x);
}

// Script for Issue where Olivier created quarterly stripe product but it was actually renewing monthly. This moves monthly products -> quarterly

export async function modifyStripeSubs() {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

    let hasMore = true;
    let lastSubscriptionId = null;

    while (hasMore) {
        // Fetch the list of subscriptions
        console.log('BATCH');
        const subList: any = await stripe.subscriptions.list({
            price: 'price_1PiIgZDyFtOu3ZuTXCDQz6cc',
            limit: 100, // Stripe allows a maximum of 100 subscriptions per request
            ...(lastSubscriptionId && { starting_after: lastSubscriptionId }),
        });
        console.log('LENGTH', subList.data.length);

        // Process each subscription
        for (const subscription of subList.data) {
            const startDate = convertEpochToDate(subscription.start_date);

            const endDate = addDeltaToDate(startDate, 90, 'd');
            const endDateEpoch = convertDateToEpoch(endDate);

            try {
                const subSchedule = await stripe.subscriptionSchedules.create({
                    from_subscription: subscription.id,
                });
                await stripe.subscriptionSchedules.update(subSchedule.id, {
                    end_behavior: 'release',
                    proration_behavior: 'none',
                    phases: [
                        {
                            items: [
                                {
                                    price: 'price_1PiIgZDyFtOu3ZuTXCDQz6cc',
                                    quantity: 1,
                                },
                            ],
                            start_date: subSchedule.phases[0].start_date,
                            end_date: endDateEpoch,
                            trial: true,
                            proration_behavior: 'none',
                        },
                        {
                            items: [
                                {
                                    price: 'price_1PnQrmDyFtOu3ZuTAWkJMIXu',
                                    quantity: 1,
                                },
                            ],
                            proration_behavior: 'none',
                        },
                    ],
                });
            } catch (error) {
                console.error(
                    `Error processing subscription ${subscription.id}:`
                );
                continue; // Move to the next subscription
            }
        }

        // Check if there are more subscriptions to fetch
        hasMore = subList.has_more;
        console.log('HAS MORE?', hasMore);
        if (hasMore) {
            lastSubscriptionId = subList.data[subList.data.length - 1].id;
        }
    }
}

export const sendScriptTest = async () => {
    const supabase = createSupabaseServiceClient();
    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', 16191)
        .single();

    if (!data) {
        return;
    }

    const body_json: HallandaleScriptJSON = {
        message: { id: data.id, sentTime: new Date().toISOString() },
        order: data.pharmacy_script.order,
    };

    console.log('PRACTICE', body_json.order.practice);

    const result = await sendHallendaleScript(
        body_json,
        data.id,
        '24138d35-e26f-4113-bcd9-7f275c4f9a47',
        OrderStatus.PaymentCompleted,
        OrderType.Order
    );

    console.log('RESULT', result);
};

export async function correctEnvironments() {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('renewal_orders')
        .select('*')
        .eq('environment', 'dev');

    if (!data) {
        return;
    }

    // console.log('DATA', data);

    for (const order of data) {
        const { data: subscriptionData, status } = await getSubscriptionDetails(
            order.subscription_id
        );

        if (!subscriptionData || !subscriptionData.stripe_subscription_id) {
            continue;
        }

        try {
            const stripeSub = await getStripeSubscription(
                subscriptionData.stripe_subscription_id
            );

            await updateRenewalOrder(order.id, { environment: 'prod' });

            console.log(order.renewal_order_id);
        } catch (err) {
            // console.log('STRIPE SUB NOT VLAID');
        }
    }
}

export async function populateSubscriptionEnvironment() {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('prescription_subscriptions')
        .select('*')
        .order('id');

    if (!data || data.length === 0) {
        return;
    }

    for (const item of data) {
        if (!item.order_id) {
            continue;
        }
        const { data: subData, error: subError } = await supabase
            .from('orders')
            .select('*')
            .eq('id', item.order_id)
            .single();

        if (!subData || !subData.environment) {
            continue;
        }

        await supabase
            .from('prescription_subscriptions')
            .update({ environment: subData.environment })
            .eq('id', item.id);

        console.log('Updated', subData.id);
    }
}

function getDaysBetweenDates(date1: Date, date2: Date) {
    // Get the difference in time between the two dates in milliseconds
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    // Convert the difference from milliseconds to days
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

export async function reTriggerIDCampaign() {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase.rpc('get_id_unuploaded_users');

    if (!data) {
        return;
    }

    const res = data.map((user: any, index: number) => {
        return {
            patient_id: user.user_id,
        };
    });

    await supabase.from('customerio_id_verification').insert(res);
}

export async function sendCheckInForms() {
    const supabase = createSupabaseServiceClient();
    const { data: subData, error: subError } = await supabase
        .from('prescription_subscriptions')
        .select('*')
        .eq('subscription_type', 'quarterly')
        .in('product_href', ['semaglutide', 'tirzepatide'])
        .eq('status', 'active')
        .eq('environment', 'prod')
        .order('created_at');

    if (!subData || subData.length === 0) {
        return;
    }

    const WL_IMMEDIATE = 'wl-multi-month-immediate';
    const WL_ONE_WEEK = 'wl-one-week';
    const WL_TWO_WEEKS = 'wl-two-weeks';

    for (const subscription of subData) {
        const stripeSubscription = await getStripeSubscription(
            subscription.stripe_subscription_id
        );

        const endDate = convertEpochToDate(
            stripeSubscription.current_period_end
        );
        const startDate = convertEpochToDate(
            stripeSubscription.current_period_start
        );

        const diffDays = getDaysBetweenDates(startDate, new Date());
        const checkin_url = `https://app.gobioverse.com/check-up/${subscription.product_href}`;

        if (diffDays >= 21) {
        } else if (diffDays >= 14) {
            await triggerEvent(subscription.patient_id, WL_ONE_WEEK, {
                order_id: subscription.order_id,
                checkin_url: `https://app.gobioverse.com/check-up/${subscription.product_href}`,
            });
        } else if (diffDays >= 7) {
            await triggerEvent(subscription.patient_id, WL_TWO_WEEKS, {
                order_id: subscription.order_id,
                checkin_url: `https://app.gobioverse.com/check-up/${subscription.product_href}`,
            });
        } else {
            await triggerEvent(
                subscription.patient_id,
                WL_MULTI_MONTH_CHECKIN,
                {
                    order_id: subscription.order_id,
                    checkin_url: `https://app.gobioverse.com/check-up/${subscription.product_href}`,
                }
            );
        }
    }
}

export async function populateSubmissionTime() {
    const supabase = createSupabaseServiceClient();
    const { data, error } = await supabase
        .from('action_items')
        .select('*')
        .order('id');
    // .eq('patient_id', 'c2a74f00-6f3b-4be3-abef-e906e80e6a95');

    if (!data || data.length === 0) {
        return;
    }

    for (const item of data) {
        const { data: answerData, error: checkupError } = await supabase.rpc(
            'get_questionnaire_answers_for_provider_with_version_v2',
            {
                user_id_: item.patient_id,
                product_name_: item.type,
                version_: 0,
            }
        );

        if (!answerData || answerData.length < 4) {
            // console.log(`Skipping ${item.id}`);
            continue;
        }

        await supabase
            .from('action_items')
            .update({ submission_time: answerData.at(-1).created_at })
            .eq('id', item.id);
        console.log(`Updated ${item.id}`);

        // console.log(answerData);
    }
}

export async function populateFinalReview() {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('renewal_orders')
        .select('*')
        .eq('subscription_type', 'quarterly')
        .lte('final_review_starts', '2020-01-01');
    if (!data) {
        return;
    }

    for (const order of data) {
        if (!order.subscription_id) {
            continue;
        }
        const subRenewalDate = await getSubscriptionRewewalDate(
            order.subscription_id
        );

        if (!subRenewalDate) {
            continue;
        }

        const date = convertEpochToDate(subRenewalDate);
        date.setDate(date.getDate() - 21);

        await updateRenewalOrder(order.id, { final_review_starts: date });
        console.log(order.original_order_id);
    }
}

// For orders
export async function createRenewalOrdersForOrder() {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('order_status', 'Approved-CardDown-Finalized');

    if (!data) {
        return;
    }

    for (const order of data) {
        if (!order.subscription_id) {
            continue;
        }
        const renewalOrder = await getLatestRenewalOrderForSubscription(
            order.subscription_id
        );

        if (!renewalOrder) {
            if (order.shipping_status === 'Delivered') {
                // Create renewal order
                await createFirstTimeRenewalOrder(order.id);
                console.log(order.id);
            }
        }
    }
}

export async function createRenewalOrdersForRenewals() {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('prescription_subscriptions')
        .select('*')
        .eq('status', 'active');

    if (!data) {
        return;
    }

    for (const sub of data) {
        const renewalOrder = await getLatestRenewalOrderForSubscription(sub.id);

        if (!renewalOrder || !renewalOrder.id) {
            continue;
        }

        if (
            renewalOrder?.order_status ===
                RenewalOrderStatus.PharmacyProcessing &&
            renewalOrder.shipping_status === ShippingStatus.Delivered
        ) {
            await createUpcomingRenewalOrder(renewalOrder);
            console.log(renewalOrder.original_order_id);
        }
    }
}

export async function populateCheckupCompleted() {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('renewal_orders')
        .select('*')
        .order('id');

    if (!data) {
        return;
    }

    for (const item of data) {
        if (item.submission_time) {
            await supabase
                .from('renewal_orders')
                .update({ checkup_completed: true })
                .eq('id', item.id);
            console.log(`Success process ${item.id}`);
        } else {
            console.log('fail for ', item.id);
        }
    }
}

export async function populateRenewalOrderId() {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase.from('action_items').select('*');

    if (!data) {
        return;
    }

    for (const item of data) {
        const latest = await getLatestRenewalOrderForSubscription(
            item.subscription_id
        );

        if (!latest) {
            continue;
        }
        await supabase
            .from('action_items')
            .update({ renewal_order_id: latest.renewal_order_id })
            .eq('id', item.id);
        console.log(latest.renewal_order_id);
    }
}

function extractJsonData(dataString: string) {
    const objectStartIndex = dataString.indexOf('['); // Find the start of the array
    const objectEndIndex = dataString.indexOf(']') + 1; // Find the end of the array

    // Extract the JSON-like part of the string
    const jsonString = dataString.slice(
        objectStartIndex + 1,
        objectEndIndex - 1
    );

    // Replace single quotes with double quotes to create a valid JSON string
    const orderIdMatch = jsonString.match(/orderId:\s*'(\d+)'/);
    const trackingNumberMatch = jsonString.match(/trackingNumber:\s*'(\d+)'/);

    if (orderIdMatch && trackingNumberMatch) {
        const orderId = orderIdMatch[1];
        const trackingNumber = trackingNumberMatch[1];

        return { orderId, trackingNumber };
    } else {
        return { orderId: null, trackingNumber: null };
    }
}

export async function createRenewalOrdersFix() {
    const renewalOrders = [
        '5237-2',
        '6325-3',
        '3086-4',
        '5279-3',
        '12856-3',
        '12856-1',
        '5601-2',
        '3774-3',
        '3137-4',
        '2022-4',
        '4422-4',
        '11473-1',
        '2914-4',
        '5267-2',
        '2085-4',
        '4505-3',
        '1823-4',
        '3493-5',
        '6325-3',
        '5685-2',
        '4533-4',
        '5942-3',
        '10889-1',
        '14323-1',
        '14592-1',
        '3339-4',
        '2680-4',
        '5103-3',
        '12398-1',
        '4824-3',
        '4798-3',
    ];

    const renewalPromises = renewalOrders.map(async (orderId) => {
        const renewalOrder = await getRenewalOrder(orderId);

        if (renewalOrder) {
            return createUpcomingRenewalOrder(renewalOrder);
        }
    });

    await Promise.all(renewalPromises);
    console.log('complete');
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// For data fetched from order-update logs
export async function sendHallandaleShippingUpdates() {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase.from('temporary').select('*');

    var tracked: string[] = [];

    const operations = (data || []).map(async (item: any, index: number) => {
        console.log(index);

        const { orderId, trackingNumber } = extractJsonData(item.Message);

        if (!orderId || !trackingNumber) {
            return supabase
                .from('temporary_insert')
                .insert({ order_data: item.Message });
        }

        const { data: orderData, error } = await supabase.rpc(
            'get_hallandale_order',
            { order_id_: orderId }
        );

        if (!orderData || orderData.length !== 1) {
            if (!tracked.includes(orderId)) {
                tracked.push(orderId);
                return supabase
                    .from('temporary_insert')
                    .insert({ order_data: item.Message });
            }
        } else {
            if (orderData[0].easypost_tracking_id) {
                return;
            }
            return createTracker(
                orderData[0].id,
                trackingNumber,
                'FedEx',
                'hallandale'
            );
            await sleep(1500);
        }
    });

    // Only call Promise.all if there are operations to run
    if (operations.length > 0) {
        await Promise.all(operations);
    }

    printLargeList(tracked);
}

export async function sendDeliveredEmails() {
    const supabase = createSupabaseServiceClient();
    const delivered = [
        '17627',
        '16243',
        '16246',
        '17830',
        '16844',
        '15621',
        '17584',
        '16544',
        '17049',
        '16357',
        '18197',
        '16828',
        '16333',
        '17340',
        '17801',
        '16745',
        '16840',
        '17246',
        '15693',
        '17697',
        '17746',
        '17649',
        '14037',
        '17441',
        '17125',
        '16839',
        '16494',
        '16654',
        '14149',
        '17411',
        '15962',
        '18186',
        '17242',
        '16835',
        '16577',
        '16710',
        '15973',
        '17353',
        '15518',
        '17305',
        '15596',
        '13846',
        '17772',
        '18130',
        '16877',
        '14769',
        '17065',
        '16232',
        '10447',
        '15824',
        '16302',
        '16781',
        '17192',
        '17269',
        '17629',
        '17362',
        '17616',
        '16747',
        '16970',
        '16814',
        '15854',
        '17809',
        '17187',
        '17063',
        '17222',
        '17190',
        '17121',
        '14638',
        '17470',
        '15804',
        '17454',
        '17244',
        '16611',
        '15620',
        '17503',
        '16645',
        '15946',
        '15320',
        '17583',
        '16242',
        '15176',
        '16834',
        '12381',
        '17655',
        '17659',
        '13855',
        '13262',
        '17193',
        '17321',
        '17049',
        '17449',
        '17491',
        '17569',
        '17067',
        '16666',
        '17358',
        '16864',
        '17639',
        '17609',
        '8525',
        '17221',
        '17164',
        '16203',
        '16623',
        '16586',
        '17464',
        '17326',
        '17620',
        '16075',
        '17372',
        '17397',
        '16668',
        '16928',
        '18045',
        '17236',
        '14443',
        '17518',
        '16940',
        '16847',
        '17070',
        '17455',
        '16252',
        '17282',
        '18042',
        '17552',
        '17513',
        '11816',
        '17044',
        '17532',
        '17271',
        '17133',
        '17015',
        '17258',
        '16422',
    ];

    const renewal_delivered = [
        '5942-3',
        '2680-4',
        '5267-2',
        '14592-1',
        '8096-1',
        '4824-3',
        '14347-1',
        '14323-1',
        '11473-1',
        '2085-4',
        '2914-4',
        '8090-2',
        '3421-3',
        '3774-3',
        '4505-3',
    ];

    const res = await Promise.all(
        renewal_delivered.map(async (orderId: any, index: number) => {
            const order = await getRenewalOrder(orderId);

            if (!order) {
                return {};
            }

            return {
                type: 'person',
                action: 'event',
                identifiers: { id: order.customer_uuid },
                attributes: { order_id: orderId },
                name: PRESCRIPTION_DELIVERED,
            };
        })
    );

    await batchTriggerEvent({ batch: res });
}

function printLargeList(list: string[]) {
    // Start the output string with the opening bracket
    let output = '[';

    // Iterate over each item in the list
    for (let i = 0; i < list.length; i++) {
        // Add the current item to the output string
        // For arrays of numbers or strings, you can simply add the item
        // For objects or other complex types, you might need to stringify them first
        output += `'${list[i]}'`;

        // If not the last item, add a comma and space for formatting
        if (i < list.length - 1) {
            output += ', ';
        }
    }

    // End the output string with the closing bracket
    output += ']';

    // Log the formatted string
    console.log(output);
}
