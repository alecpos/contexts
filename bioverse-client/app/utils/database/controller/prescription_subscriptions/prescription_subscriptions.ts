'use server';

import { createSupabaseServiceClient } from '@/app/utils/clients/supabaseServerClient';
import { updateOrderSubscriptionID } from '../orders/orders-api';
import { getRefillCount } from '@/app/services/pharmacy-integration/prescription-refill-count';
import { PrescriptionSubscription } from '@/app/components/patient-portal/subscriptions/types/subscription-types';
import {
    getPrescriptionSubscription,
    getSubscriptionDetails,
    updatePrescriptionSubscription,
} from '@/app/utils/actions/subscriptions/subscription-actions';
import { Status } from '@/app/types/global/global-enumerators';
import {
    extendSubscriptionRenewalBy5Days,
    getStripeSubscription,
} from '@/app/(administration)/admin/stripe-api/stripe-api-actions';
import { SubscriptionStatusFlags } from './prescription_subscription_enums';

export async function isCustomersFirstSubscription(
    user_id: string,
    product_href: string
) {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('prescription_subscriptions')
        .select('*')
        .eq('product_href', product_href)
        .eq('patient_id', user_id);

    if (error) {
        return true;
    }

    if (!data || data.length === 0) {
        return true;
    }

    return false;
}

export async function updateSubscription(
    subscription_id: number,
    update_payload: Partial<PrescriptionSubscription>
) {
    const supabase = createSupabaseServiceClient();

    const { error } = await supabase
        .from('prescription_subscriptions')
        .update(update_payload)
        .eq('id', subscription_id);

    if (error) {
        console.log(
            'failure in updating subscription with Last Used Script.',
            error
        );
    }

    return Status.Success;
}

// If this is the customer's first time ordering this product, apply discount
export async function shouldApplyDiscountToFirstTimeOrder(
    user_id: string,
    product_href: string
) {
    const isFirstSubscription = await isCustomersFirstSubscription(
        user_id,
        product_href
    );

    return isFirstSubscription;
}

export async function createSubscriptionWithOrderData(
    orderData: Order,
    providerId: string,
    stripe_subscription_id: string,
    failure?: boolean
) {
    const supabase = createSupabaseServiceClient();

    const { data: newlyCreatedSubscription, error: subscriptionCreationError } =
        await supabase
            .from('prescription_subscriptions')
            .insert([
                {
                    patient_id: orderData.customer_uid,
                    provider_id: providerId,
                    last_updated: new Date(),
                    product_href: orderData.product_href,
                    next_refill_date: null,
                    variant_text: orderData.variant_text,
                    subscription_type: orderData.subscription_type,
                    order_id: orderData.orderId,
                    stripe_subscription_id: stripe_subscription_id,
                    assigned_pharmacy: orderData.assigned_pharmacy,
                    renewal_count: 0,
                    status: 'active',
                    environment: orderData.environment,
                    recent_variants: [orderData.variant_index],
                    ...(failure ? { status: 'payment-failed' } : {}),
                },
            ])
            .select();

    if (subscriptionCreationError) {
        console.log(
            'prescription-subscriptions.ts - subscription creation error. Message: ' +
                subscriptionCreationError.message
        );
        console.error(subscriptionCreationError);
        return { error: 'creation failed' };
    }

    await updateOrderSubscriptionID(
        orderData.orderId,
        newlyCreatedSubscription![0].id
    );

    return newlyCreatedSubscription![0].id;
}

export async function updateSubscriptionLastUsedJSON(
    order_id: string,
    pharmacy: string,
    json: any
) {
    const supabase = createSupabaseServiceClient();

    const { error } = await supabase
        .from('prescription_subscriptions')
        .update({ last_used_script: json, assigned_pharmacy: pharmacy })
        .eq('order_id', order_id);

    if (error) {
        console.log(
            'failure in updating subscription with Last Used Script.',
            error
        );
    }

    return Status.Success;
}

export async function getAllSubscriptionsForPatient(patient_id: string) {
    const supabase = createSupabaseServiceClient();

    const { data: subscriptions, error: error } = await supabase
        .from('prescription_subscriptions')
        .select(
            `*, product:products!product_href(
            name
        ), order:orders!order_id(
            discount_id
        )`
        )
        .eq('patient_id', patient_id);
    if (error) {
        console.log('Prescription Subscription Error in fetching, ', error);
        return { data: null, error: error };
    }
    return { data: subscriptions, error: null };
}

export async function getSubscriptionWithStripeSubscriptionId(
    stripe_subscription_id: string
): Promise<{ subscription: PrescriptionSubscription | null }> {
    const supabase = createSupabaseServiceClient();

    const { data: subscription, error: error } = await supabase
        .from('prescription_subscriptions')
        .select('*')
        .eq('stripe_subscription_id', stripe_subscription_id)
        .maybeSingle();

    if (error) {
        console.log(
            'prescription-subscriptions.ts - getSubscriptionWithStripeSubscriptionId, Message: ' +
                error.message
        );
        return { subscription: null };
    }

    if (!subscription) {
        return { subscription: null };
    }

    return { subscription };
}

export async function createPrescriptionSubscription(
    subscription_payload: Partial<PrescriptionSubscription>
) {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('prescription_subscriptions')
        .insert(subscription_payload)
        .select();

    if (error) {
        console.error(
            'Error creating prescription subscription with payload',
            subscription_payload
        );
        return null;
    }

    if (data[0]) {
        return data[0] as PrescriptionSubscription;
    }

    return null;
}

export async function updateRenewalCount(
    subscription_id: string,
    new_renewal_count_value: number
) {
    const supabase = createSupabaseServiceClient();

    const { error } = await supabase
        .from('prescription_subscriptions')
        .update({ renewal_count: new_renewal_count_value })
        .eq('id', subscription_id);

    await updateRefillCount(subscription_id);
}

export async function updateLastRenewalDate(subscription_id: string) {
    const supabase = createSupabaseServiceClient();

    const { error } = await supabase
        .from('prescription_subscriptions')
        .update({ last_renewal_date: new Date() })
        .eq('id', subscription_id);

    await updateRefillCount(subscription_id);
}

export async function getCancelationDetails(subscription_id: number): Promise<{
    patient_id: string;
    name: string;
}> {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .rpc('get_cancelation_details', { subscription_id_: subscription_id })
        .single();

    if (error) {
        console.error('Failed to get cancelation details for', subscription_id);
        return { patient_id: '', name: '' };
    }
    return data as {
        patient_id: string;
        name: string;
    };
}

export async function setRefillCount(
    subscription_id: string,
    product_href: string,
    cadence: string
) {
    const supabase = createSupabaseServiceClient();

    const refill_value = getRefillCount(product_href, cadence);
    const { error } = await supabase
        .from('prescription_subscriptions')
        .update({ refills_remaining: refill_value })
        .eq('id', subscription_id);

    if (error) {
        console.log('refill count assignment error. details: ', error);
    }
}

async function updateRefillCount(subscription_id: string) {
    const supabase = createSupabaseServiceClient();

    const { data: refill_data, error: refill_previous_error } = await supabase
        .from('prescription_subscriptions')
        .select('refills_remaining')
        .eq('id', subscription_id)
        .single();

    if (refill_previous_error) {
        return;
    }

    const new_refills = refill_data.refills_remaining - 1;

    const { error } = await supabase
        .from('prescription_subscriptions')
        .update({ refills_remaining: new_refills })
        .eq('id', subscription_id);

    return;
}

export async function getPaymentFailedSubscriptionWithID(
    subscription_id: string
) {
    const supabase = createSupabaseServiceClient();

    const { data: subscription, error: error } = await supabase
        .from('prescription_subscriptions')
        .select('*')
        .eq('stripe_subscription_id', subscription_id)
        .eq('status', 'payment-failed')
        .maybeSingle();

    if (error) {
        console.log(
            'prescription-subscriptions.ts - getSubscriptionWithStripeSubscriptionId, Message: ' +
                error.message
        );
        return null;
    }

    return { subscription: subscription };
}

export async function incrementSinceLastCheckup(subscription_id: number) {
    const supabase = createSupabaseServiceClient();
    await supabase.rpc('increment_since_last_checkup', { subscription_id });
}

export async function getStripeSubscriptionIdFromSubscription(
    subscription_id: string | number
): Promise<string | null> {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('prescription_subscriptions')
        .select('stripe_subscription_id')
        .eq('id', subscription_id)
        .maybeSingle();

    if (error) {
        console.error(
            'prescription-subscriptions.ts - getStripeSubscriptionIdFromSubscription, Message: ' +
                error.message
        );
    }

    if (!data?.stripe_subscription_id) {
        return null;
    }
    return data.stripe_subscription_id;
}

export async function isActiveSubscription(order_id: string): Promise<string> {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('prescription_subscriptions')
        .select('status')
        .eq('order_id', order_id)
        .maybeSingle();

    if (error) {
        console.error('Error getting order pill status', error);
        return 'error';
    }

    return data?.status;
}

export async function getSubscriptionStatusFlagsFromOriginalOrderId(
    order_id: string
): Promise<string[]> {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('prescription_subscriptions')
        .select('status_flags')
        .eq('order_id', order_id)
        .maybeSingle();

    if (error) {
        console.error('Error getting order pill status', error);
        return [];
    }

    return data?.status_flags;
}

/**
 * @author Nathan Cho
 * This function is unused. However I am changing it to use 'active' needing to be true here.
 * @param product_href
 * @param customer_id
 * @returns
 */
export async function getSubscriptionByProduct(
    product_href: string,
    customer_id: string
): Promise<PrescriptionSubscription | null> {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('prescription_subscriptions')
        .select('*')
        .eq('product_href', product_href)
        .eq('patient_id', customer_id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

    if (error) {
        console.error(
            'Error doesCustomerHaveSubscriptionWithProduct',
            error,
            product_href,
            customer_id
        );
        return null;
    }

    return data;
}

export async function getSubscriptionById(subscription_id: number) {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('prescription_subscriptions')
        .select('*')
        .eq('id', subscription_id)
        .maybeSingle();

    if (error || !data) {
        console.error('Error getting subscription by id', error);
        return null;
    }
    return data;
}

export async function updateRecentVariants(
    subscription_id: number,
    new_variant_id: number
) {
    const { data, status } = await getSubscriptionDetails(subscription_id);

    if (status === Status.Failure) {
        console.error(
            'Error updating recent variants. Failed to get sub details',
            subscription_id,
            new_variant_id
        );
        return;
    }

    const newRecentVariants = [
        new_variant_id,
        ...data.recent_variants.slice(0, 2),
    ];

    await updatePrescriptionSubscription(subscription_id, {
        recent_variants: newRecentVariants,
    });
}

export async function getLastUsedVariantForSubscription(
    subscription_id: number
): Promise<number> {
    const { data, status } = await getSubscriptionDetails(subscription_id);

    if (status === Status.Failure) {
        console.error(
            'Error updating recent variants. Failed to get sub details',
            subscription_id
        );
        return -1;
    }

    if (data.recent_variants) {
        return data.recent_variants[0];
    }
    return -1;
}

// export async function shouldExtendStripeSubscription(subscription_id: number) {
//     const subscription = await getPrescriptionSubscription(subscription_id);

//     if (!subscription) {
//         throw new Error('Could not find subscription');
//     }

//     const stripeSubscription = await getStripeSubscription(
//         subscription.stripe_subscription_id
//     );

//     const currentTime = Math.floor(Date.now() / 1000); // Convert current time to seconds (Stripe uses Unix timestamps)
//     const renewalTime = stripeSubscription.current_period_end;

//     // Check if the renewal is within 4 days (4 * 24 * 60 * 60 seconds)
//     const fourDaysInSeconds = 4 * 24 * 60 * 60;

//     if (renewalTime <= currentTime + fourDaysInSeconds) {
//         return true;
//     }

//     return false;
// }

export async function handleCheckUpSubscriptionExtension(
    subscriptionData: PrescriptionSubscription
) {
    const stripeSubscription = await getStripeSubscription(
        subscriptionData.stripe_subscription_id
    );

    const currentTime = Math.floor(Date.now() / 1000); // Convert current time to seconds (Stripe uses Unix timestamps)
    const renewalTime = stripeSubscription.current_period_end;

    // Check if the renewal is within 4 days (4 * 24 * 60 * 60 seconds)
    const fourDaysInSeconds = 4 * 24 * 60 * 60;

    if (renewalTime <= currentTime + fourDaysInSeconds) {
        await extendSubscriptionRenewalBy5Days(
            subscriptionData.stripe_subscription_id
        );
    }
}

export async function wipeStatusFlags(subscription_id: number) {
    const supabase = createSupabaseServiceClient();
    const { error: prescriptionError2 } = await supabase
        .from('prescription_subscriptions')
        .update({
            status_flags: [], //just replace the entire array
        })
        .eq('id', subscription_id);
    if (prescriptionError2) {
        console.error(
            'Error updating prescription last_checkup 69420',
            subscription_id,
            prescriptionError2
        );
    }
}

export async function addOrRemoveStatusFlags(
    subscription_id: number,
    addOrRemove: 'add' | 'remove',
    statusFlag: SubscriptionStatusFlags
) {
    const subscription = await getPrescriptionSubscription(subscription_id);

    if (!subscription) {
        return Status.Failure;
    }

    const supabase = createSupabaseServiceClient();

    const { data: currentData, error: fetchError } = await supabase
        .from('prescription_subscriptions')
        .select('status_flags')
        .eq('id', subscription_id)
        .single();

    if (fetchError) {
        console.error(fetchError);
        return Status.Failure;
    }

    let updatedFlags;

    if (addOrRemove === 'remove') {
        updatedFlags =
            currentData.status_flags?.filter(
                (tag: string) => tag !== statusFlag
            ) || [];
    }

    if (addOrRemove === 'add') {
        !currentData.status_flags || currentData.status_flags.length === 0
            ? (updatedFlags = [statusFlag])
            : currentData.status_flags.includes(statusFlag)
            ? (updatedFlags = currentData.status_flags)
            : (updatedFlags = [...currentData.status_flags, statusFlag]);
    }

    const { error: prescriptionError } = await supabase
        .from('prescription_subscriptions')
        .update({
            status_flags: updatedFlags,
        })
        .eq('id', subscription_id);

    if (prescriptionError) {
        console.error(prescriptionError);
        return Status.Failure;
    }

    return Status.Success;
}
