'use server';

import { createSupabaseServiceClient } from '@/app/utils/clients/supabaseServerClient';

export async function getNonGLPDiscountForProduct(product_href: string) {
    const supabase = createSupabaseServiceClient();

    const tableName =
        process.env.NEXT_PUBLIC_ENVIRONMENT === 'prod'
            ? 'stripe_product_coupon_pairs_production'
            : 'stripe_product_coupon_pairs';

    const { data: monthlyDiscount, error: monthlyDiscountError } =
        await supabase
            .from(tableName)
            .select('coupon_id')
            .eq('product_href', product_href)
            .eq('cadence', 'monthly')
            .limit(1)
            .single();

    const { data: quarterlyDiscount, error: quarterlyDiscountError } =
        await supabase
            .from(tableName)
            .select('coupon_id')
            .eq('product_href', product_href)
            .eq('cadence', 'quarterly')
            .limit(1)
            .single();

    return {
        monthlyDiscount: monthlyDiscount?.coupon_id,
        quarterlyDiscount: quarterlyDiscount?.coupon_id,
    };
}
