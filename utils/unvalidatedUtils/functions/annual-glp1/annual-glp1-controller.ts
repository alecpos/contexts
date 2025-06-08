'use server';

import { OrderType } from '@/app/types/orders/order-types';
import { createSupabaseServiceClient } from '../../clients/supabaseServerClient';
import { fetchOrderData } from '../../database/controller/orders/orders-api';
import {
    ANNUAL_GLP1_VARIANT_MAP,
    AnnualGLP1VariantIndexMap,
} from './annual-glp1-mappings';

import { getStripeSubscriptionIdFromSubscription } from '../../database/controller/prescription_subscriptions/prescription_subscriptions';
import { getStripeSubscription } from '@/app/(administration)/admin/stripe-api/stripe-api-actions';

export async function createAnnualGLP1Record(orderId: string, scriptJSON: any) {
    const { data, type } = await fetchOrderData(orderId);

    const subscriptionId = data.subscription_id;

    /**
     * Start with the fact that the script was sent for a specific order/renewal order id
     */
    //Fetch the subscription data with subscription ID
    const stripe_subscription_id =
        await getStripeSubscriptionIdFromSubscription(subscriptionId);

    if (!stripe_subscription_id) {
        throw new Error('No Stripe Subscription found for ID');
    }

    //Use subscription data to get the stripe subcsription data and then fetch the next renewal date epoch
    const stripeSubscription = await getStripeSubscription(
        stripe_subscription_id
    );

    const nextRenewalEpoch = stripeSubscription.current_period_end;

    const currentTimeEpoch = Math.floor(Date.now() / 1000);

    //take the epoch time of that and the epoch time of current and then take half the difference and add it to the current
    const timeDifference = nextRenewalEpoch - currentTimeEpoch;
    const halfTimeDifference = Math.floor(timeDifference / 2);

    // Then take the current and add the 1/2-difference and get the scheduled release time
    const scheduledReleaseEpoch = currentTimeEpoch + halfTimeDifference;

    // turn the subscription renewal time & the 1/2-difference and then turn them into timestamptz for the database to store.
    const scheduledReleaseTime = new Date(
        scheduledReleaseEpoch * 1000
    ).toISOString();
    const subscriptionRenewalTime = new Date(
        nextRenewalEpoch * 1000
    ).toISOString();

    // These timestamps can now be stored in Supabase
    const timestampsForDatabase = {
        scheduled_release_time: scheduledReleaseTime,
        subscription_renewal_time: subscriptionRenewalTime,
    };

    const supabase = createSupabaseServiceClient();

    const annualOrderTrackingRecord = {
        patient_id:
            type === OrderType.Order ? data.customer_uid : data.customer_uuid,
        product_href: data.product_href,
        variant_index: data.variant_index,
        scheduled_next_renewal_date:
            timestampsForDatabase.subscription_renewal_time,
        scheduled_second_supply_date:
            timestampsForDatabase.scheduled_release_time,
        base_order_id:
            type === OrderType.Order ? data.id : data.original_order_id,
        renewal_order_id:
            type === OrderType.RenewalOrder ? data.renewal_order_id : null,
        subscription_id: subscriptionId,
        prescription_json_1: scriptJSON,
    };

    const { data: record_added, error } = await supabase
        .from('annual_order_tracking')
        .insert(annualOrderTrackingRecord)
        .select('id')
        .single();

    if (error) {
        throw new Error('Could not add record to supabase: ' + error.message);
    }

    return record_added.id;
}

export async function updateAnnualGLP1RecordCheckIns() {}

export async function updateAnnualGLP1SecondShipmentSent(
    annualShipmentRecordId: number,
    scriptJSON: any
) {
    const supabase = createSupabaseServiceClient();

    const { error } = await supabase
        .from('annual_order_tracking')
        .update({
            status: 'complete',
            second_script_sent_time: new Date().toISOString(),
            prescription_json_2: scriptJSON,
        })
        .eq('id', annualShipmentRecordId);

    if (error) {
        console.log(error);
    }
}

export async function checkIfOrderIsAnnualVariant(
    new_variant_index: number,
    orderId: string
): Promise<{
    isAnnualOrderScript: boolean;
    shipmentNumber: 'first' | 'second';
}> {
    let isAnnualOrderScript: boolean = false;
    let shipmentNumber: 'first' | 'second' = 'first';

    const { data, type } = await fetchOrderData(orderId);

    const product_href = data.product_href;

    isAnnualOrderScript =
        AnnualGLP1VariantIndexMap[product_href].includes(new_variant_index);
    const elibibleVariants =
        ANNUAL_GLP1_VARIANT_MAP[product_href][new_variant_index];

    if (!elibibleVariants) {
        return {
            isAnnualOrderScript: false,
            shipmentNumber: 'first',
        };
    }

    if (elibibleVariants.firstShipmentVariant === new_variant_index) {
        shipmentNumber = 'first';
    } else {
        shipmentNumber = 'second';
    }

    console.log('ANNUAL CHECK RESULT SHIP NUM: ', shipmentNumber);

    return {
        isAnnualOrderScript: isAnnualOrderScript,
        shipmentNumber: shipmentNumber,
    };
}

export async function cancelAnnualShipmentTracking(subscription_id: number) {
    const supabase = createSupabaseServiceClient();

    const { error } = await supabase
        .from('annual_order_tracking')
        .update({ status: 'canceled' })
        .eq('subscription_id', subscription_id);

    if (error) {
        console.error('Error in canceling annual shipment information ', error);
    }

    return;
}

export async function checkSubscriptionIsAnnual(subscription_id: number) {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('prescription_subscriptions')
        .select('subscription_type')
        .eq('id', subscription_id)
        .limit(1)
        .maybeSingle();

    if (!data || error) {
        console.error(
            'No record found for subscription on check is annual ',
            error
        );
    }

    return data?.subscription_type === 'annually';
}
