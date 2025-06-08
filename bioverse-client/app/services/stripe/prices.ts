'use server';
import { createSupabaseServiceClient } from '@/app/utils/clients/supabaseServerClient';
import Stripe from 'stripe';

export async function getPriceUsingOrderNumber(order_id: string | number) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});
    const supabase = createSupabaseServiceClient();

    let parsed_order_id;

    if (typeof order_id === 'string' && order_id.includes('-')) {
        parsed_order_id = order_id.split('-')[0];
    } else {
        parsed_order_id = order_id;
    }

    if (parsed_order_id) {
        const { data: product, error } = await supabase
            .from('orders')
            .select('price_id')
            .eq('id', parsed_order_id)
            .single();

        if (error) {
            console.error(
                'Error: prices.ts - method: getPriceUsingOrderNumber',
                'order id used: ' + order_id,
                error
            );
            return null;
        }

        const stripe_product = await stripe.prices.retrieve(product?.price_id);

        return stripe_product.unit_amount! / 100;
    } else return null;
}
