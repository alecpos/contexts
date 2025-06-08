'use server';
import { OrderType } from '@/app/types/orders/order-types';
import { createSupabaseServerComponentClient } from '../../utils/clients/supabaseServerClient';
import { createPaymentIntent } from './paymentIntent';
import { getURL } from '@/app/utils/functions/utils';

/**
 * @author Nathan Cho
 * @param orderData - orderData JSON of the order record
 * @param providerId - ID of the provider to associate and bind.
 *
 * @description This function handles the charging of the customer and returns either a success or failure message.
 * Upon failure, it will add to the payment-failure table.
 *
 */
export async function chargeCustomerV2(
    orderId: string,
    providerId: string,
    orderType: OrderType
): Promise<{
    result: 'failure' | 'success';
    reason: string | null;
    actually_paid?: boolean;
}> {
    const supabase = await createSupabaseServerComponentClient();

    /**
     * Determine the type of the order since there are two different tables / interfaces to work with.
     */
    if (orderType === OrderType.RenewalOrder) {
        return { result: 'success', reason: null };
    }

    const { data, error } = await supabase
        .from('orders')
        .select('subscription_type, id')
        .eq('id', orderId)
        .limit(1)
        .maybeSingle();

    console.log('datacheckn,', data);

    if (error || !data) {
        return { result: 'failure', reason: 'supabase-error' };
    }

    if (data.subscription_type === 'one_time') {
        const apiUrl = await getURL();

        const single_payment_create_response = await fetch(
            `${apiUrl}/api/stripe/subscription/create`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${process.env.BV_API_KEY}`,
                },
                body: JSON.stringify({
                    orderId: Number(orderId),
                    providerId: providerId,
                }),
            }
        );

        const result = await single_payment_create_response.json();
        return result;
    } else {
        const apiUrl = await getURL();

        const subscription_create_response = await fetch(
            `${apiUrl}/api/stripe/subscription/create`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${process.env.BV_API_KEY}`,
                },
                body: JSON.stringify({
                    orderId: Number(orderId),
                    providerId: providerId,
                }),
            }
        );

        const result = await subscription_create_response.json();
        return result;
        // return await createSubscriptionInStripeV3(Number(orderId), providerId);
    }
}
