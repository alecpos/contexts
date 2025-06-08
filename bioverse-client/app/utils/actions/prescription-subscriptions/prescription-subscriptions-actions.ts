'use server';

import { OrderType } from '@/app/types/orders/order-types';
import {
    getOrderById,
    getOrderDetailsById,
} from '../../database/controller/orders/orders-api';
import { createSupabaseServiceClient } from '../../clients/supabaseServerClient';
import { getRenewalOrder } from '../../database/controller/renewal_orders/renewal_orders';
import { PrescriptionSubscription } from '@/app/components/patient-portal/subscriptions/types/subscription-types';
import { WEIGHT_LOSS_PRODUCT_HREF } from '@/app/components/intake-v2/constants/constants';

export async function updateRenewalCount(
    order_id: number | string,
    orderType: OrderType
) {
    const supabase = createSupabaseServiceClient();
    if (orderType === OrderType.Order) {
        const { data, error } = await getOrderDetailsById(Number(order_id));

        if (!data || !data.subscription_id) {
            console.error('Unable to update renewal count for order', order_id);
            return;
        }

        const { data: rpcData, error: rpcError } = await supabase.rpc(
            'increment_renewal_count',
            { subscription_id_: data.subscription_id }
        );

        if (rpcError) {
            console.error('Error updating renewal count:', rpcError, data);
        }
    } else {
        const renewalOrder = await getRenewalOrder(String(order_id));

        if (!renewalOrder) {
            console.error(
                'Unable to update renewal count for renewal order',
                order_id
            );
            return;
        }

        const { data: rpcData, error: rpcError } = await supabase.rpc(
            'increment_renewal_count',
            { subscription_id_: renewalOrder.subscription_id }
        );

        if (rpcError) {
            console.error(
                'Error updating renewal count:',
                rpcError,
                renewalOrder
            );
        }
    }
}

export async function getAllGLP1SubscriptionsForProduct(
    customer_id: string
): Promise<PrescriptionSubscription[] | null> {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('prescription_subscriptions')
        .select('*')
        .in('product_href', [WEIGHT_LOSS_PRODUCT_HREF])
        .eq('patient_id', customer_id);

    if (error) {
        console.error(
            'Error doesCustomerHaveOrderWithProduct',
            error,
            customer_id
        );
        return null;
    }

    return data as PrescriptionSubscription[];
}

export async function getAllActiveGLP1SubscriptionsForProduct(
    customer_id: string
): Promise<PrescriptionSubscription[]> {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('prescription_subscriptions')
        .select('*')
        .in('product_href', WEIGHT_LOSS_PRODUCT_HREF)
        .eq('patient_id', customer_id)
        .eq('status', 'active');

    if (error) {
        console.error(
            'Error doesCustomerHaveOrderWithProduct active subs',
            error,
            customer_id
        );
        return [];
    }

    return data as PrescriptionSubscription[];
}
