'use server';

import { getNextRenewalDateBySubscriptionId } from '@/app/services/stripe/subscriptions';
import { Status } from '@/app/types/global/global-enumerators';
import { OrderStatus } from '@/app/types/orders/order-types';
import { createSupabaseServiceClient } from '@/app/utils/clients/supabaseServerClient';
import {
    createNewOrderV2,
    getOrderByCustomerIdAndProductHref,
} from '@/app/utils/database/controller/orders/orders-api';
import { getSubscriptionById } from '@/app/utils/database/controller/prescription_subscriptions/prescription_subscriptions';
import { getPriceVariantTableData } from '@/app/utils/database/controller/product_variants/product_variants';
import { cleanStaleOrders } from '@/app/utils/functions/clean-stale-orders/clean-stale-orders';

export async function getSubscriptionRewewalDate(subscription_id: number) {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('prescription_subscriptions')
        .select('stripe_subscription_id')
        .eq('id', subscription_id)
        .single();

    if (error) {
        console.error('subscription renewal date retrieval error ', error);
    }

    const renewal_date = await getNextRenewalDateBySubscriptionId(
        data?.stripe_subscription_id
    );

    return renewal_date;
}

export async function getSplitShipmentRecordsBySubscriptionId(
    subscription_id: number
) {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('split_shipment_order_tracking')
        .select(
            'product_href, scheduled_second_supply_date, scheduled_next_renewal_date,created_at'
        )
        .eq('subscription_id', subscription_id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

    if (error) {
        console.error('split shipment records retrieval error ', error);
        return null;
    }

    if (!data) {
        return null;
    }

    // Check if scheduled_next_renewal_date is prior to now
    const renewalDate = new Date(data.scheduled_next_renewal_date);
    const now = new Date();

    if (renewalDate < now) {
        return null;
    }

    return data;
}

/**
 * @important While this function is named Subscription Reactivation, it does not explicitly "reactivate" any subscription but rather:
 * Places a new order on the customer's account and also wipes any prior orders that could  potentially confuse anyone & void's them.
 *
 * The patient is intended to enter the intake flow to answer questions for the product they are reactivating for.
 *
 * @param subscription_id used as a start point to preform the entire operation.
 */
export async function handleSubscriptionReactivation(
    subscription_id: number
): Promise<Status> {
    /**
     * This function does the following:
     * Takes the subscription ID and finds all relevant information to create a new order.
     * Creates a brand-new order for the patient with all data current.
     * Invokes the stale order clean up function to clean up all stale orders and prepare patient to re-enter flow.
     */

    try {
        const subscription = await getSubscriptionById(subscription_id);

        const { data: priceData, error: priceDataError } =
            await getPriceVariantTableData(subscription.product_href);

        if (priceDataError || !priceData) {
            throw new Error('price data error ');
        }

        const latest_order = await getOrderByCustomerIdAndProductHref(
            subscription.patient_id,
            subscription.product_href
        );

        if (
            latest_order &&
            latest_order.order_status !== OrderStatus.Incomplete
        ) {
            const { error: order_creation_error } = await createNewOrderV2(
                subscription.patient_id,
                {
                    product_href: subscription.product_href,
                    variant: subscription.variant_index,
                    subscriptionType: subscription.subscription_type,
                },
                priceData,
                {
                    source: 'subscription_reactivation',
                }
            );

            if (order_creation_error) {
                throw new Error('order creation error ');
            }
        }

        /**
         * invoke this function now since it will clean up all orders associated except the latest - which we just made.
         */
        const stale_order_cleanup_result = await cleanStaleOrders(
            subscription.patient_id,
            subscription.product_href
        );

        /**
         * Only checking for error since Failure is okay.
         */
        if (stale_order_cleanup_result === Status.Error) {
            throw new Error('stale order cleanup error ');
        }

        return Status.Success;
    } catch (error) {
        console.error('price data error ', error);
        return Status.Error;
    }
}
