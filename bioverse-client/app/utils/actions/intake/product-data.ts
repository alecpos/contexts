'use server';
import { createSupabaseServerComponentClient } from '../../clients/supabaseServerClient';

export async function fetchProductImageAndPriceData(productName: string) {
    const supabase = await createSupabaseServerComponentClient();
    const { data: productInformationData, error: informationDataError } =
        await supabase
            .from('products')
            .select(
                `image_ref, 
                variants,
                name, 
                category, 
                description_short,
                review_image_ref,
                href`
            )
            .eq('href', productName)
            .single();

    if (informationDataError) {
        console.log(informationDataError, informationDataError.message);
        return {
            prodcutData: null,
            priceData: null,
            error: informationDataError,
        };
    }

    return {
        productData: productInformationData,
        error: null,
    };
}
