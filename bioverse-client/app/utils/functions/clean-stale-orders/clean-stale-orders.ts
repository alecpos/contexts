'use server';

import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import { createSupabaseServiceClient } from '../../clients/supabaseServerClient';
import { Status } from '@/app/types/global/global-enumerators';
import { OrderStatus } from '@/app/types/orders/order-types';

/**
 * This function cleans stale orders from the database.
 * It checks if the order is stale and sets those to Administrative-Cancel state
 *
 * Order is conisdered "Stale" if there is another order that exists with a larger created_at & order is in order_status 'Incomplete' or 'Unapproved-CardDown'
 * Returns Status.Success if update is complete, Status.Failure if there are no orders to update, Status.Error if error is encountered
 *
 * Note: If performing clean up on a patient that will get a new order, make sure to clean up AFTER creating the new order.
 *
 * @param patient_id - The id of the patient.
 * @param product_href - The href of the product to check for stale orders.
 */
export async function cleanStaleOrders(
    patient_id: string,
    product_href: PRODUCT_HREF
) {
    //Order of operations:
    //1. Obtain all orders for patient under product_href
    //2. Filter fetched data for orders with order_status 'Incomplete' or 'Unapproved-CardDown' & also remove latest order
    //3. Call an update to supabase such that we update the order status of all those orders to Administrative-Cancel.

    try {
        if (!product_href) {
            throw new Error('No Product Href');
        }

        const getProductsToCheck = (href: PRODUCT_HREF): PRODUCT_HREF[] => {
            switch (href) {
                case PRODUCT_HREF.SEMAGLUTIDE:
                case PRODUCT_HREF.TIRZEPATIDE:
                    return [PRODUCT_HREF.SEMAGLUTIDE, PRODUCT_HREF.TIRZEPATIDE];
                default:
                    return [href];
            }
        };
        const supabase = createSupabaseServiceClient();

        const { data: orders, error: ordersError } = await supabase
            .from('orders')
            .select('*')
            .eq('customer_uid', patient_id)
            .in('product_href', getProductsToCheck(product_href))
            .order('created_at', { ascending: false });

        if (ordersError) {
            console.error('Error fetching orders:', ordersError);
            throw new Error(
                `Error fetching orders for patient. ${patient_id} Logging error message: ${ordersError.message}`
            );
        }

        if (orders.length <= 1) {
            return Status.Failure;
        }

        const staleOrders = orders
            .slice(1) //slice at 1 to exclude the most recent order.
            .filter(
                (order) =>
                    order.order_status === 'Incomplete' ||
                    order.order_status === 'Unapproved-CardDown'
            );

        const { error: updateError } = await supabase
            .from('orders')
            .update({ order_status: OrderStatus.Voided })
            .in(
                'id',
                staleOrders.map((order) => order.id)
            );

        if (updateError) {
            throw new Error(
                `Error updating order status for patient. ${patient_id} Logging error message: ${updateError.message}`
            );
        }
        return Status.Success;
    } catch (error) {
        console.error(error);
        return Status.Error;
    }
}
