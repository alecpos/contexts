'use server';

import { createSupabaseServerComponentClient } from '@/app/utils/clients/supabaseServerClient';

export async function getProductImageDataForImageAPI(product_href: string) {
    const supabase = createSupabaseServerComponentClient();

    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('href', product_href)
        .single();

    if (error) {
        return { product: null, error: error };
    }

    return { product: data, error: error };
}
