'use server';

import { SubscriptionStatus } from '@/app/types/enums/master-enums';
import {
    createSupabaseServerComponentClient,
    createSupabaseServiceClient,
} from '../../clients/supabaseServerClient';
import {
    PrescriptionSubscription,
    SubscriptionDetailsResponse,
} from '@/app/components/patient-portal/subscriptions/types/subscription-types';
import { Status } from '@/app/types/global/global-enumerators';
import { getRenewalOrderBySubscriptionId } from '../../database/controller/renewal_orders/renewal_orders';

export async function createSubscriptionWithOrderDataDeprecated(
    orderData: Order,
    providerId: string,
    stripe_subscription_id: string
) {
    const supabase = await createSupabaseServerComponentClient();

    const { data: newlyCreatedSubscription, error: subscriptionCreationError } =
        await supabase.from('prescription_subscriptions').insert([
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
            },
        ]);

    if (subscriptionCreationError) {
        console.log(
            'subscription-actions.ts - subscription creation error. Message: ' +
                subscriptionCreationError.message
        );
    }
}

export async function getScriptDetails(subscriptionId: number) {
    const supabase = await createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('prescription_subscriptions')
        .select('last_used_script')
        .eq('id', subscriptionId)
        .single();

    if (error) {
        console.error(
            'Getting Script Details Error for Subscription',
            subscriptionId
        );
        return null;
    }
    return data.last_used_script;
}

export async function getSubscriptionDetails(
    subscriptionId: number
): Promise<SubscriptionDetailsResponse> {
    const supabase = await createSupabaseServiceClient();

    const { data, error } = await supabase
        .rpc('get_subscription_details', {
            subscription_id_: subscriptionId,
        })
        .single();

    if (error) {
        console.error(
            'Getting Subscription Details Error for Subscription',
            subscriptionId
        );
        console.error(error);
        return {
            status: Status.Failure,
            data: {
                name: '',
                href: '',
                variant: '',
                image_ref: [],
                address_line1: '',
                address_line2: '',
                state: '',
                city: '',
                zip: '',
                stripe_subscription_id: '',
                subscription_type: '',
                image_ref_transparent: [],
                order_id: -1,
                renewal_count: -1,
                created_at: '',
                status: SubscriptionStatus.Canceled,
                recent_variants: [],
            },
        };
    }
    return {
        status: Status.Success,
        data,
    } as SubscriptionDetailsResponse;
}

export async function updatePrescriptionSubscription(
    subscription_id: number,
    updated_payload: Partial<PrescriptionSubscription>
) {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('prescription_subscriptions')
        .update(updated_payload)
        .eq('id', subscription_id);

    if (error) {
        console.error(
            'Error updating renewal order order_status',
            error,
            updated_payload
        );
    }
}

export async function getPrescriptionSubscription(
    subscription_id: number
): Promise<PrescriptionSubscription | null> {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('prescription_subscriptions')
        .select('*')
        .eq('id', subscription_id)
        .maybeSingle();

    if (error) {
        console.error(
            'Error doesCustomerHaveOrderWithProduct',
            error,
            subscription_id
        );
        return null;
    }

    if (!data) {
        console.error('Could not fetch subscription for user', subscription_id);
        return null;
    }

    return data as PrescriptionSubscription;
}

export async function getLastVariantIndexForSubscription(
    subscription_id: number
) {
    const subscription = await getPrescriptionSubscription(subscription_id);

    if (!subscription) {
        console.error('Could not find stripe subscription', subscription_id);
        return null;
    }

    const x = getRenewalOrderBySubscriptionId;
}
