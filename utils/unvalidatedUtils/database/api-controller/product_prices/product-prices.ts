/**
 * File is Deprecated
 */

// export async function getProductList() {
//     const supabase = createSupabaseServiceClient();

//     const { data, error } = await supabase.rpc('get_product_prices_href_list');

//     return data;
// }

/**
 * Deprecated function for price editing.
 */
// export async function updateProductPricesWithDataAndVariantIndex(
//     data: any,
//     variantIndex: number,
//     productHref: string
// ) {
//     const supabase = await createSupabaseServerComponentClient();

//     const { data: updatedData, error: updateError } = await supabase
//         .from('product_prices')
//         .update(data)
//         .eq('product_href', productHref)
//         .eq('variant_index', variantIndex)
//         .select();

//     if (updateError) {
//         console.log('updateError', updateError);
//         return { data: null, error: updateError };
//     }

//     return { data: updatedData, error: null };
// }

// export async function getPriceTableData(productHref: string) {
//     const supabase = createSupabaseServerComponentClient();

//     const { data: priceData, error: priceDataError } = await supabase
//         .from('product_prices')
//         .select('*')
//         .eq('product_href', productHref)
//         .order('variant_index', { ascending: true });

//     if (priceDataError) {
//         console.error('Error fetching data for prescription:', priceDataError);
//         return { data: null, error: priceDataError };
//     }

//     return { data: priceData, error: null };
// }

// export async function getGLP1PriceTableData() {
//     const supabase = createSupabaseServerComponentClient();

//     const { data: priceData, error: priceDataError } = await supabase
//         .from('product_prices')
//         .select('*')
//         .in('product_href', ['semaglutide', 'tirzepatide'])
//         .order('product_href', { ascending: true })
//         .order('variant_index', { ascending: true });

//     if (priceDataError) {
//         console.error('Error fetching data for prescription:', priceDataError);
//     }

//     return priceData;
// }

// export async function getStripePrice(
//     product_href: string,
//     cadence: 'one_time' | 'monthly' | 'quarterly'
// ): Promise<CadencePriceInformation | null> {
//     const supabase = createSupabaseServiceClient();

//     const { data, error } = await supabase
//         .from('product_prices')
//         .select('one_time, monthly, quarterly')
//         .eq('product_href', product_href)
//         .single();

//     if (error) {
//         console.error('Error getting stripe price', product_href, cadence);
//         return null;
//     }

//     return data[cadence];
// }

// export async function getProductFromStripePrice(
//     stripe_price_id: string
// ): Promise<ProductPrice | null> {
//     const supabase = createSupabaseServiceClient();

//     const { data, error } = await supabase
//         .rpc('get_product_from_stripe_price', { price_id: stripe_price_id })
//         .single();

//     if (error) {
//         console.error(
//             'Error getting product from stripe price',
//             stripe_price_id
//         );
//         return null;
//     }
//     return data as ProductPrice;
// }

// export async function getPriceForVariant(
//     product_href: string,
//     variant_index: number | string,
//     is_bundle: boolean | null
// ): Promise<VariantProductPrice | null> {
//     const supabase = createSupabaseServiceClient();
//     let isBundle;
//     if (is_bundle == null) {
//         isBundle = getIsBundleValue(
//             mappingVariants,
//             product_href,
//             variant_index.toString()
//         );
//     } else {
//         isBundle = is_bundle;
//     }

//     const { data, error } = await supabase
//         .from('product_prices')
//         .select(
//             `variant, vial, cadence, ${
//                 isBundle ? 'quarterly' : 'monthly'
//             }, variant_index, vial_dosages, dosages, pharmacy`
//         )
//         .eq('product_href', product_href)
//         .eq('variant_index', variant_index)
//         .limit(1)
//         .single();

//     if (error) {
//         console.error('Error getting price for variant', error);
//         return null;
//     }

//     return { ...data, variant_index, isBundle };
// }

/**
 * Deprecated Function
 */
// export async function getPriceDataForVariant(
//     product_href: string,
//     variant_index: number | string
// ): Promise<VariantProductPrice | null> {
//     const supabase = createSupabaseServiceClient();

//     const { data, error } = await supabase
//         .from('product_prices')
//         .select(
//             'variant, vial, cadence, quarterly, monthly, variant_index, dosages, pharmacy'
//         )
//         .eq('product_href', product_href)
//         .eq('variant_index', variant_index)
//         .limit(1)
//         .single();

//     if (error) {
//         console.error('Error getting price for variant', error);
//         return null;
//     }

//     return { ...data, variant_index };
// }

// export async function getMonthlyAndQuarterlyPriceData(product_href: string) {
//     const supabase = createSupabaseServiceClient();

//     const { data: monthlyFetch, error: monthlyFetchError } = await supabase
//         .from('product_prices')
//         .select('monthly, variant_index')
//         .eq('product_href', product_href)
//         .eq('cadence', 'monthly')
//         .limit(1)
//         .single();

//     const { data: quarterlyFetch, error: quarterlyFetchError } = await supabase
//         .from('product_prices')
//         .select('quarterly, variant_index')
//         .eq('product_href', product_href)
//         .eq('cadence', 'quarterly')
//         .limit(1)
//         .single();

//     return {
//         monthlyPrice: monthlyFetch,
//         quarterlyPrice: quarterlyFetch,
//     };
// }

// type ProductType = 'semaglutide' | 'tirzepatide';
// type MappingVariant = Partial<Record<string, { is_bundle: boolean }>>;

// function getIsBundleValue(
//     mappingVariants: MappingVariants,
//     product_href: string,
//     index: string
// ): boolean {
//     return mappingVariants[product_href]?.[index]?.is_bundle ?? false;
// }

// interface MappingVariants {
//     [key: string]: MappingVariant;
// }

// const mappingVariants: MappingVariants = {
//     semaglutide: {
//         '6': { is_bundle: true },
//         '7': { is_bundle: true },
//         '8': { is_bundle: true },
//         '9': { is_bundle: true },
//         '10': { is_bundle: true },
//         '11': { is_bundle: true },
//         '12': { is_bundle: true },
//     },
//     tirzepatide: {
//         '6': { is_bundle: true },
//         '7': { is_bundle: true },
//         '8': { is_bundle: true },
//         '9': { is_bundle: true },
//         '12': { is_bundle: true },
//         '13': { is_bundle: true },
//         '16': { is_bundle: true },
//         '17': { is_bundle: true },
//         '18': { is_bundle: true },
//         '19': { is_bundle: true },
//         '20': { is_bundle: true },
//         '21': { is_bundle: true },
//         '22': { is_bundle: true },
//     },
//     metformin: {
//         '0': { is_bundle: true },
//         '1': { is_bundle: true },
//         '2': { is_bundle: true },
//         '3': { is_bundle: true },
//         '4': { is_bundle: true },
//         '5': { is_bundle: true },
//         '6': { is_bundle: true },
//         '7': { is_bundle: true },
//         '8': { is_bundle: true },
//         '9': { is_bundle: true },
//         '10': { is_bundle: true },
//         '11': { is_bundle: true },
//         '12': { is_bundle: true },
//         '13': { is_bundle: true },
//         '14': { is_bundle: true },
//         '15': { is_bundle: true },
//         '16': { is_bundle: true },
//         '17': { is_bundle: true },
//         '18': { is_bundle: true },
//         '19': { is_bundle: true },
//         '20': { is_bundle: true },
//         '21': { is_bundle: true },
//         '22': { is_bundle: true },
//     },
//     [PRODUCT_HREF.GLUTATIONE_INJECTION]: {
//         '1': { is_bundle: true },
//     },
//     [PRODUCT_HREF.B12_INJECTION]: {
//         '1': { is_bundle: true },
//     },
//     [PRODUCT_HREF.NAD_INJECTION]: {},
//     [PRODUCT_HREF.TELMISARTAN]: {},
//     [PRODUCT_HREF.TADALAFIL_DAILY]: {},
//     [PRODUCT_HREF.TADALAFIL_AS_NEEDED]: {},
//     [PRODUCT_HREF.ZOFRAN]: {},
//     [PRODUCT_HREF.WL_CAPSULE]: {},
// };
