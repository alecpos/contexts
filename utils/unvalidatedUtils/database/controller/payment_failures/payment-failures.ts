'use server';

import { Status } from '@/app/types/global/global-enumerators';
import { OrderType } from '@/app/types/orders/order-types';
import { createSupabaseServiceClient } from '@/app/utils/clients/supabaseServerClient';

export async function createNewPaymentFailure(
    orderId: number,
    customerId: string,
    stripeMetadata: any,
    reason: string,
) {
    const supabase = await createSupabaseServiceClient();

    const { error } = await supabase.from('payment_failures').insert({
        created_at: new Date(),
        orderId: orderId,
        customer_uid: customerId,
        stripe_metadata: stripeMetadata,
        reason: reason,
    });

    if (error) {
        console.log(
            'Controller Error, tablename: payment_failures, method_name: createNewPaymentFailure, error: ',
            error,
        );
    }
}

export async function retryPaymentFailureOnOrder(
    orderId: number | string,
    orderType: OrderType,
) {
    const supabase = createSupabaseServiceClient();

    const function_name =
        orderType === OrderType.Order
            ? 'retry_payment_on_failed_order'
            : 'retry_payment_on_failed_renewal_order';

    const args =
        orderType === OrderType.Order
            ? { order_id_: orderId }
            : { renewal_order_id_: orderId };

    try {
        const result = await supabase.rpc(function_name, args);

        return Status.Success;
    } catch (error) {
        console.error('retry payment error: ', error);
        return Status.Error;
    }
}
