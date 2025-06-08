'use server';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import {
    createSupabaseServerComponentClient,
    createSupabaseServiceClient,
} from '@/app/utils/clients/supabaseServerClient';

/**
 * @author Nathan Cho
 * @returns returns collections records which are labeled as active only.
 */
export async function getActiveCollectionsData() {
    const supabase = createSupabaseServerComponentClient();

    const { data, error } = await supabase
        .from('products')
        .select(
            'name, category, price, description_short, image_ref, href, type, filter_metadata,review_image_ref'
        )
        .eq('active', true);

    if (error) {
        console.error(
            'Collections Page ran into an issue fetching data. Details: ',
            error.message
        );
        return { data: null, error: error.message };
    }

    return { data: data, error: null };
}

/**
 * @author Nathan Cho
 * @param product_href
 * @returns image Href array
 */
export async function getImageRefUsingProductHref(product_href: string) {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('products')
        .select('image_ref')
        .eq('href', product_href)
        .single();

    if (error) {
        console.error(error, error.message);
        return { data: null, error: error };
    }

    return { data: data.image_ref, error: null };
}

/**
 * @author Nathan Cho
 * @returns returns select columns in collections data.
 * Deprecated and used earlier for collections page.
 */
export async function getCollectionsData() {
    const supabase = createSupabaseServerComponentClient();

    const { data, error } = await supabase
        .from('products')
        .select(
            'name, category, price, description_short, image_ref, href, type, filter_metadata,review_image_ref'
        );

    if (error) {
        console.error(
            'Collections Page ran into an issue fetching data. Details: ',
            error.message
        );
        return { data: null, error: error.message };
    }

    return { data: data, error: null };
}

export async function getProductName(product_href: string) {
    const supabase = createSupabaseServerComponentClient();

    const { data, error } = await supabase
        .from('products')
        .select('name')
        .eq('href', product_href)
        .single();

    if (error) {
        return { name: null, error: error.message };
    }

    return { name: data.name, error: null };
}

export async function getProductVariant(product_href: string) {
    const supabase = createSupabaseServerComponentClient();

    const { data, error } = await supabase
        .from('products')
        .select('variants')
        .eq('href', product_href)
        .single();

    if (error) {
        return { variant: null, error: error.message };
    }

    return { variant: data.variants, error: null };
}

export interface ProductQuestionnaireVersion {
    current_question_set_version: number;
    checkup_questionnaire_set_version: number;
}

export async function getQuestionnaireVersionsForProduct(
    product_href: PRODUCT_HREF
) {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('products')
        .select(
            'current_question_set_version, checkup_questionnaire_set_version'
        )
        .eq('href', product_href)
        .single();

    if (error) {
        console.error(
            'Failed getQuestionnaireVersionsForProduct for',
            product_href,
            error
        );
        return null;
    }

    return data as ProductQuestionnaireVersion;
}

export async function getProductMetadata(productHref: string) {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('products')
        .select('metadata')
        .eq('href', productHref)
        .limit(1)
        .single();

    if (error) {
        console.log('getProductMetadata', error);
    }

    return data?.metadata;
}

// export async function getProductVariantPrices(product_href: string) {
//     const supabase = createSupabaseServerComponentClient();

//     const { data, error } = await supabase
//         .from('product_prices')
//         .select(
//             `
//                 id,
//                 created_at,
//                 last_modified,
//                 reference_id,
//                 variant,
//                 vial,
//                 one_time,
//                 monthly,
//                 bimonthly,
//                 quarterly,
//                 pentamonthly,
//                 product_href,
//                 variant_index,
//                 cadence,
//                 active
//             `
//         )
//         .eq('product_href', product_href) // Use .in() instead of .eq()
//         .order('variant_index', { ascending: true });

//     if (error) {
//         console.error(
//             'Error while fetching product variant prices. Details: ',
//             error.message
//         );
//         return { variants: null, error: error.message };
//     }

//     return { variants: data, error: null };
// }

type Environment = 'dev' | 'prod';
/**
 * getVariantIndexByPriceIdV2
 *
 * Looks at the product_variants table and returns the variant_index associated with the priceId passed in.
 * If more than 1 variant index corresponds to a priceId, it handles that in the beginning of the function,
 * returning the variant index that we want to use. To be implemented first in updateStripeProduct
 *
 * @param product_href
 * @param priceId
 * @returns variant index
 *
 */
export async function getVariantIndexByPriceIdV2(
    product_href: PRODUCT_HREF,
    priceId: string
): Promise<{
    variant_index: string;
    cadence: string;
}> {
    /**
     *
     * We have some situations where more than one row in product_variants table have the same priceID.
     * So the function would look for a product_variants row with the given priceID and it would encounter 2 rows and not know
     * which one to choose to return the variant_index. We will just return the ones that we want to keep by hard coding.
     * If any checkIsMatching errors get thrown, we can just one by one move users off of the deprecated product variant rows.
     * Eventually we want to delete the product_variants records that are duplicative
     *
     */
    if (
        product_href === PRODUCT_HREF.SEMAGLUTIDE &&
        priceId === 'price_1Phu0tDyFtOu3ZuTiQTyy9kT'
    ) {
        //this price ID is shared between variant indexes 1 and 5 in product_variants table. 5 is the one we want people to be on
        return {
            variant_index: '5',
            cadence: 'monthly',
        };
    }

    if (
        product_href === PRODUCT_HREF.SEMAGLUTIDE &&
        priceId === 'price_1QYPryDyFtOu3ZuTM7ODsRoa'
    ) {
        //this priceID is the same for variant indices 15 and 17 in the product_variants table. 15 the one we still offer
        return {
            variant_index: '15',
            cadence: 'biannually',
        };
    }

    if (
        product_href === PRODUCT_HREF.SEMAGLUTIDE &&
        priceId === 'price_1PMHr4DyFtOu3ZuTwLzYF221'
    ) {
        //this priceID is the same for variant indices 3 and 13 in product_variants table. 13 is the one we want people to be on
        return {
            variant_index: '13',
            cadence: 'monthly',
        };
    }

    if (
        product_href === PRODUCT_HREF.TIRZEPATIDE &&
        priceId === 'price_1QhwigDyFtOu3ZuTU04jMNgV'
    ) {
        //product_variants has a different priceID which is incorrect for variant index 9
        //if that incorrect priceID is passed in, we want to return the correct variant index
        return {
            variant_index: '9',
            cadence: 'quarterly',
        };
    }

    if (
        product_href === PRODUCT_HREF.TIRZEPATIDE &&
        priceId === 'price_1PQZ3JDyFtOu3ZuTATlJcMKk'
    ) {
        //this priceID for 12 and 21 are the same in product_variants table. 21 is hallandale
        return {
            variant_index: '21',
            cadence: 'quarterly',
        };
    }

    const supabase = createSupabaseServiceClient();
    const env = process.env.NEXT_PUBLIC_ENVIRONMENT as Environment; // Explicitly cast to 'dev' | 'prod'
    const { data, error } = await supabase
        .from('product_variants')
        .select('stripe_price_ids,variant_index,cadence')
        .eq('product_href', product_href)
        .order('variant_index', { ascending: true });

    if (error) {
        console.error(
            'Error while fetching product variant index. Details: ',
            error.message
        );
        return {
            variant_index: '-1',
            cadence: 'ErrorFindingCadence',
        };
    }

    const filteredVariants = data?.filter(
        (variant) => variant?.stripe_price_ids?.[env] === priceId
    );

    if (!filteredVariants) {
        console.error(
            `Could not find a variant index for ${priceId} in environment ${env}, but found 0.`
        );
        return {
            variant_index: '-1',
            cadence: 'ErrorFindingCadence',
        };
    }

    if (filteredVariants.length > 1) {
        console.error(
            `Found more than one ${product_href} variant indices for ${priceId} in environment ${env}.`
        );
        console.error(filteredVariants);
        return {
            variant_index: '-1',
            cadence: 'ErrorFindingCadence',
        };
    }

    const variant_index = filteredVariants[0]?.variant_index;
    const cadence = filteredVariants[0]?.cadence;

    if (variant_index) {
        return {
            variant_index: variant_index.toString(),
            cadence: cadence,
        };
    } else {
        console.log(
            `variant index for ${priceId} not found in environment ${env}`
        );
        return {
            variant_index: '-1',
            cadence: 'ErrorFindingCadence',
        };
    }
}

export async function getCheckupQuestionnaireIdForProduct(
    productHref: string
): Promise<number | null> {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('products')
        .select('checkup_questionnaire_id')
        .eq('href', productHref)
        .limit(1)
        .maybeSingle();

    if (error) {
        console.error(
            `Error while fetching checkup questionnaire id for product ${productHref}. Details: ${error.message}`
        );
        return null;
    }

    return data?.checkup_questionnaire_id;
}

export async function getPriceIdForProductVariant(
    productHref: string,
    variantIndex: number,
    environment: string
): Promise<string | null> {
    const supabase = createSupabaseServiceClient();

    console.log('productHref', productHref);
    console.log('variantIndex', variantIndex);
    console.log('environment', environment);

    const { data, error } = await supabase
        .from('product_variants')
        .select('stripe_price_ids')
        .eq('product_href', productHref)
        .eq('variant_index', variantIndex)
        .limit(1);

    if (error) {
        console.error(
            `Price ID for product ${productHref} and variant index ${variantIndex} not found in environment ${environment}`
        );
        return null;
    }

    const productVariant = data[0];

    console.log('productVariant', productVariant);
    if (!productVariant) {
        console.error(`Product ${productHref} not found`);
        return null;
    }

    console.log(
        'returning price id',
        productVariant.stripe_price_ids[environment]
    );
    return productVariant.stripe_price_ids[environment];
}

//should return cadence (string)
export async function getSingleProductVariantCadence(
    productHref: string,
    variantIndex: number,
    environment: string
): Promise<string | null> {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('product_variants')
        .select('stripe_price_ids, cadence, variant_index')
        .eq('product_href', productHref)
        .eq('variant_index', variantIndex)
        .limit(1);

    if (error) {
        console.error(
            `Error while fetching product variant cadence. Details: ${error.message}`
        );
        return null;
    }

    return data[0]?.cadence;
}
