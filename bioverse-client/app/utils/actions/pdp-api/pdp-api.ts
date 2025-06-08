'use server';

import { createSupabaseServerComponentClient } from '../../clients/supabaseServerClient';

interface ProductInfo {
    [key: string]: string;
}

export async function fetchProducts() {
    const supabase = createSupabaseServerComponentClient();
    const { data, error } = await supabase.from('products').select('*');

    if (error) {
        return { error: error.message, data: null };
    }

    return { data, error: null };
}

export async function fetchProduct(productId: any) {
    const supabase = createSupabaseServerComponentClient();

    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

    console.log('Fetching product with ID:', productId);
    if (!productId) {
        console.error('Product ID is undefined');
        return { error: 'Product ID is undefined', data: null };
    }

    if (error) {
        console.error('Error fetching product:', error);
        return { error: error.message, data: null };
    }

    return { data, error: null };
}

export async function deleteProduct(productId: number, productHref: string) {
    const supabase = createSupabaseServerComponentClient();

    const { error: deletePriceError } = await supabase
        .from('product_price')
        .delete()
        .filter('reference_id', 'eq', productId)
        .or('product_href.eq.' + productHref);

    if (deletePriceError) {
        console.error(
            'Error deleting related product prices:',
            deletePriceError,
        );
        return { error: deletePriceError.message, data: null };
    }

    const { error: deleteProductError } = await supabase
        .from('products')
        .delete()
        .match({ id: productId });

    if (deleteProductError) {
        console.error('Error deleting product:', deleteProductError);
        return { error: deleteProductError.message, data: null };
    }

    return {
        data: 'Product and dependencies successfully deleted',
        error: null,
    };
}

export async function updateProduct(productId: any, updatedProductInfo: any) {
    const supabase = createSupabaseServerComponentClient();

    // Filter out empty fields
    const nonEmptyFields = Object.keys(updatedProductInfo).reduce(
        (acc, key) => {
            if (updatedProductInfo[key] !== '') {
                acc[key] = updatedProductInfo[key];
            }
            return acc;
        },
        {} as ProductInfo,
    );

    const { data, error } = await supabase
        .from('products')
        .update(nonEmptyFields)
        .match({ id: productId });

    if (error) {
        console.error('Error updating product:', error);
        return { error: error.message, data: null };
    }

    return { data, error: null };
}

export async function updateProductPrice(
    productId: any,
    updatedPriceInfo: any,
) {
    const supabase = createSupabaseServerComponentClient();
    console.log('updatedPriceInfo:', updatedPriceInfo);
    const { data, error } = await supabase
        .from('product_price')
        .update(updatedPriceInfo)
        .match({
            reference_id: productId,
            variant_index: updatedPriceInfo.variant_index,
        });

    if (error) {
        console.error('Error updating product price:', error);
        return { error: error.message, data: null };
    }

    return { data, error: null };
}

export async function createProduct(newProductInfo: any) {
    const supabase = createSupabaseServerComponentClient();

    const { data: productData, error: productError } = await supabase
        .from('products')
        .insert([newProductInfo])
        .select();

    if (productError) {
        console.error('Error in creating product:', productError);
        console.error('Error details:', productError.details);
        console.error('Error hint:', productError.hint);
        throw new Error(productError.message);
    }

    if (!Array.isArray(productData) || productData.length === 0) {
        throw new Error('No product data returned from Supabase.');
    }

    return productData[0];
}

export async function createProductPrice(
    productId: any,
    productHerf: any,
    variantList: any,
) {
    const supabase = createSupabaseServerComponentClient();

    if (
        !variantList ||
        !variantList.variants ||
        variantList.variants.length === 0
    ) {
        console.log('No variants to process');
        return;
    }

    for (const variant of variantList.variants) {
        console.log(
            'variant.subcription_includes_bullets:',
            JSON.stringify(variant.subcription_includes_bullets),
        );
        const isone_timeComplete =
            variant.one_time &&
            variant.one_time.length > 0 &&
            variant.one_time[0].marketPrice !== null &&
            variant.one_time[0].checkoutPrice !== null &&
            variant.one_time[0].originalPrice !== null &&
            variant.one_time[0].subcription_subtext !== '' &&
            variant.one_time[0].subcription_includes_bullets !== '';

        const isMonthlyComplete =
            variant.monthly &&
            variant.monthly.length > 0 &&
            variant.monthly[0].marketPrice !== null &&
            variant.monthly[0].checkoutPrice !== null &&
            variant.monthly[0].originalPrice !== null &&
            variant.monthly[0].subcription_subtext !== '' &&
            variant.monthly[0].subcription_includes_bullets !== '';

        const isquarterlyComplete =
            variant.quarterly &&
            variant.quarterly.length > 0 &&
            variant.quarterly[0].marketPrice !== null &&
            variant.quarterly[0].checkoutPrice !== null &&
            variant.quarterly[0].originalPrice !== null &&
            variant.quarterly[0].subcription_subtext !== '' &&
            variant.quarterly[0].subcription_includes_bullets !== '';
        const priceData = {
            reference_id: productId,
            product_href: productHerf,

            one_time: isone_timeComplete
                ? [
                      {
                          marketPrice: variant.one_time[0].marketPrice,
                          checkoutPrice: variant.one_time[0].checkoutPrice,
                          originalPrice: variant.one_time[0].originalPrice,
                          subcription_subtext:
                              variant.one_time[0].subcription_subtext,
                          subcription_includes_bullets:
                              variant.one_time[0].subcription_includes_bullets,
                      },
                  ]
                : null,
            monthly: isMonthlyComplete
                ? [
                      {
                          marketPrice: variant.monthly[0].marketPrice,
                          checkoutPrice: variant.monthly[0].checkoutPrice,
                          originalPrice: variant.monthly[0].originalPrice,
                          subcription_subtext:
                              variant.monthly[0].subcription_subtext,
                          subcription_includes_bullets:
                              variant.monthly[0].subcription_includes_bullets,
                      },
                  ]
                : null,
            quarterly: isquarterlyComplete
                ? [
                      {
                          marketPrice: variant.quarterly[0].marketPrice,
                          checkoutPrice: variant.quarterly[0].checkoutPrice,
                          originalPrice: variant.quarterly[0].originalPrice,
                          subcription_subtext:
                              variant.quarterly[0].subcription_subtext,
                          subcription_includes_bullets:
                              variant.quarterly[0].subcription_includes_bullets,
                      },
                  ]
                : null,
            variant: variant.variant,
            variant_index: variant.variant_index,
        };
        console.log('priceData: ++++++++', priceData);
        const { error } = await supabase
            .from('product_price')
            .insert([priceData]);

        if (error) {
            console.error('Error creating product price for variant:', error);
            throw new Error(error.message);
        }
    }

    return { message: 'Product prices for all variants created successfully' };
}
