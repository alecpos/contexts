'use server';
import { createSupabaseServerComponentClient } from '@/app/utils/clients/supabaseServerClient';

export async function getReviewDataForProductUsingHref(productHref: string) {
    const supabase = createSupabaseServerComponentClient();

    const { data: reviewData, error: fetchError } = await supabase
        .from('products')
        .select('name, customer_reviews')
        .eq('href', productHref)
        .single();

    if (fetchError) {
        console.log('Fetching data error', fetchError.message);
        return { data: null, error: fetchError };
    }

    return { data: reviewData, error: null };
}

export async function updateReviewDataForProductHref(
    productHref: string,
    reviewJSON: ReviewApiJSON[],
) {
    const supabase = createSupabaseServerComponentClient();

    const res = await supabase
        .from('products')
        .update({ customer_reviews: reviewJSON })
        .eq('href', productHref)
        .select();

    return res.statusText;
}
