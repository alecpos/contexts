
import { fetchOrderData } from "../../database/controller/orders/orders-api";
import { SPLIT_SHIPMENT_GLP1_VARIANT_MAP , SplitShipmentGLP1VariantIndexMap} from "./split-shipment-variant-mappings";
import { OrderType } from '@/app/types/orders/order-types';
import { createSupabaseServiceClient } from '../../clients/supabaseServerClient';
import { getStripeSubscriptionIdFromSubscription } from '../../database/controller/prescription_subscriptions/prescription_subscriptions';
import { getStripeSubscription } from '@/app/(administration)/admin/stripe-api/stripe-api-actions';
import { PRODUCT_HREF } from "@/app/types/global/product-enumerator";


export async function checkIfOrderIsSplitShipmentVariant(
    new_variant_index: number,
    orderId: string
): Promise<{
    isSplitShipmentVariant: boolean;
    shipmentNumber: 'first' | 'second';
}> {
    let isSplitShipmentVariant: boolean = false;
    let shipmentNumber: 'first' | 'second' = 'first';

    const { data, type } = await fetchOrderData(orderId);

    const product_href = data.product_href;

    if (product_href !== PRODUCT_HREF.SEMAGLUTIDE && product_href !== PRODUCT_HREF.TIRZEPATIDE) {
        return {
            isSplitShipmentVariant: false,
            shipmentNumber: 'first',
        };
    }

    isSplitShipmentVariant =
        SplitShipmentGLP1VariantIndexMap[product_href].includes(new_variant_index);
    const elibibleVariants =
        SPLIT_SHIPMENT_GLP1_VARIANT_MAP[product_href][new_variant_index];

    if (!elibibleVariants) {
        return {
            isSplitShipmentVariant: false,
            shipmentNumber: 'first',
        };
    }

    if (elibibleVariants.firstShipmentVariant === new_variant_index) {
        shipmentNumber = 'first';
    } else {
        shipmentNumber = 'second';
    }

    console.log('SPLIT SHIPMENT CHECK RESULT SHIP NUM: ', shipmentNumber);

    return {
        isSplitShipmentVariant: isSplitShipmentVariant,
        shipmentNumber: shipmentNumber,
    };
}

export async function createSplitShipmentGLP1Record(orderId: string, scriptJSON: any) {
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

    const splitShipmentOrderTrackingRecord = {
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
        .from('split_shipment_order_tracking')
        .insert(splitShipmentOrderTrackingRecord)
        .select('id')
        .single();

    if (error) {
        throw new Error('Could not add record to supabase: ' + error.message);
    }

    return record_added.id;
}


export async function updateSplitShipmentGLP1SecondShipmentSent(
    splitShipmentRecordId: number,
    scriptJSON: any
) {
    const supabase = createSupabaseServiceClient();

    const { error } = await supabase
        .from('split_shipment_order_tracking')
        .update({
            status: 'complete',
            second_script_sent_time: new Date().toISOString(),
            prescription_json_2: scriptJSON,
        })
        .eq('id', splitShipmentRecordId);

    if (error) {
        console.log(error);
    }
}