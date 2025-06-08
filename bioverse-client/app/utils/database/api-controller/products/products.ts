'use server';
import { createSupabaseServiceClient } from '@/app/utils/clients/supabaseServerClient';

export async function getProductData(product_href: string, fields: string) {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('products')
        .select(fields)
        .eq('href', product_href)
        .single();

    if (error || !data) {
        console.error(
            'Error fetching product data',
            error,
            product_href,
            fields,
        );
        return null;
    }

    return data;
}
