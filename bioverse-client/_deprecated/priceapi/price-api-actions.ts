// 'use server';
// import { createSupabaseServerComponentClient } from '@/app/utils/clients/supabaseServerClient';
// import Stripe from 'stripe';

// export async function getAllProductsForPriceAPI() {
//     const supabase = await createSupabaseServerComponentClient();

//     const { data: productsData, error: fetchError } = await supabase
//         .from('products')
//         .select('name, href')
//         .order('name', { ascending: true });

//     if (fetchError) {
//         console.log('Product Price API Error in fetching data.');
//         console.log(fetchError.message);
//         return { data: null, error: fetchError };
//     }

//     return { data: productsData, error: null };
// }

// export async function getIndividualProductInfoForApi(href: string) {
//     const supabase = await createSupabaseServerComponentClient();

//     const { data: productPriceData, error: fetchError } = await supabase
//         .from('product_prices')
//         .select('*')
//         .eq('product_href', href)
//         .order('variant_index', { ascending: true });

//     if (fetchError) {
//         console.log('Fetching data error', fetchError.message);
//         return { data: null, error: fetchError };
//     }

//     return { data: productPriceData, error: null };
// }

// export async function getNameDataPriceAPI(producthref: string) {
//     const supabase = await createSupabaseServerComponentClient();
//     const { data: nameData, error: error } = await supabase
//         .from('products')
//         .select('name')
//         .eq('href', producthref)
//         .single();

//     return { name: nameData, error: error };
// }

// export async function handleStripeForProduct(
//     variantIndex: number,
//     productHref: string
// ) {
//     console.log('handling stripe for product!');
//     /**
//      * We need to create a new price each time we change the price itself.
//      */
//     const hasStripePrices = await doesHrefIndexHaveStripePrices(
//         variantIndex,
//         productHref
//     );
//     if (hasStripePrices) {
//         //if it has prices, just update them
//         console.log('updating prices!');
//         updateStripePriceForProductRecord(variantIndex, productHref);
//     }
//     console.log('creating price!');
//     createStripePricesForProductRecord(variantIndex, productHref);
// }

// async function doesHrefIndexHaveStripePrices(
//     variantIndex: number,
//     productHref: string
// ): Promise<boolean | null> {
//     const supabase = await createSupabaseServerComponentClient();

//     const { data, error } = await supabase
//         .from('product_prices')
//         .select('one_time, monthly, quarterly')
//         .eq('product_href', productHref)
//         .eq('variant_index', variantIndex)
//         .single();

//     if (error) {
//         console.log(
//             'method: doesHrefIndexHaveStripePrices, price-api-actions',
//             error
//         );
//         return null;
//     }

//     if (
//         data.one_time !== null &&
//         data.one_time.stripe_price_id != '' &&
//         data.one_time.stripe_price_id !== null
//     ) {
//         return true;
//     }

//     if (
//         data.monthly !== null &&
//         data.monthly.stripe_price_id != '' &&
//         data.monthly.stripe_price_id !== null
//     ) {
//         return true;
//     }
//     console.log('monthly fail', data.monthly);
//     if (
//         data.quarterly !== null &&
//         data.quarterly.stripe_price_id != '' &&
//         data.quarterly.stripe_price_id !== null
//     ) {
//         return true;
//     }

//     return false;
// }

// async function createStripePricesForProductRecord(
//     variantIndex: number,
//     productHref: string
// ) {
//     const supabase = await createSupabaseServerComponentClient();

//     //get all price records
//     const { data: record, error: fetchError } = await supabase
//         .from('product_prices')
//         .select(
//             `
//             *,
//             product:products!product_href(
//                 name,
//                 stripe_product_id
//             )
//             `
//         )
//         .eq('product_href', productHref)
//         .eq('variant_index', variantIndex)
//         .single();

//     if (fetchError) {
//         console.log('fetch error', fetchError.message);
//         return;
//     }

//     const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

//     const productId = record.product.stripe_product_id;

//     //Check if the column data is applicable, and if it is then set it.
//     if (record.one_time !== null) {
//         const one_time_price_attributes = {
//             currency: 'usd',
//             metadata: {
//                 product_name: record.product.name,
//                 cadence: 'one_time',
//                 variant: record.variant,
//             },
//             nickname:
//                 record.product.name +
//                 ' ' +
//                 record.variant +
//                 ' ' +
//                 'one-time purchase price',
//             unit_amount: record.one_time.product_price * 100,
//             product: productId,
//         };

//         const price = await stripe.prices.create(one_time_price_attributes);

//         updateSupabasePriceRecordPriceId(
//             variantIndex,
//             productHref,
//             'one_time',
//             price.id
//         );

//         console.log(
//             'price for one-time: ' + record.product.name + ' has been created.'
//         );
//     }

//     if (record.monthly !== null) {
//         const price = await stripe.prices.create({
//             currency: 'usd',
//             metadata: {
//                 product_name: record.product.name,
//                 cadence: 'monthly',
//                 variant: record.variant,
//             },
//             nickname:
//                 record.product.name +
//                 ' ' +
//                 record.variant +
//                 ' ' +
//                 'monthly purchase price',
//             unit_amount: record.monthly.product_price * 100,
//             product: productId,
//             recurring: {
//                 interval: 'month',
//             },
//         });

//         updateSupabasePriceRecordPriceId(
//             variantIndex,
//             productHref,
//             'monthly',
//             price.id
//         );
//         console.log(
//             'price for monthly: ' + record.product.name + ' has been created.'
//         );
//     }

//     if (record.quarterly !== null) {
//         const price = await stripe.prices.create({
//             currency: 'usd',
//             metadata: {
//                 product_name: record.product.name,
//                 cadence: 'quarterly',
//                 variant: record.variant,
//             },
//             nickname:
//                 record.product.name +
//                 ' ' +
//                 record.variant +
//                 ' ' +
//                 'quarterly purchase price',
//             unit_amount: record.quarterly.product_price * 100,
//             product: productId,
//             recurring: {
//                 interval: 'month',
//                 interval_count: 3,
//             },
//         });

//         updateSupabasePriceRecordPriceId(
//             variantIndex,
//             productHref,
//             'quarterly',
//             price.id
//         );
//         console.log(
//             'price for quarterly: ' + record.product.name + ' has been created.'
//         );
//     }
// }

// async function updateStripePriceForProductRecord(
//     variantIndex: number,
//     productHref: string
// ) {
//     const supabase = await createSupabaseServerComponentClient();

//     //get all price records
//     const { data: record, error: fetchError } = await supabase
//         .from('product_prices')
//         .select('one_time, monthly, quarterly, product_href')
//         .eq('product_href', productHref)
//         .eq('variant_index', variantIndex)
//         .single();

//     if (fetchError) {
//         console.log('fetch error', fetchError.message);
//         return;
//     }

//     const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

//     //Check if the column data is applicable, and if it is then set it.
//     if (record.one_time !== null) {
//         const priceId = record.one_time.stripe_price_id;

//         const price = await stripe.prices.update(priceId, { active: false });
//         console.log(
//             'price for one-time: ' + record.product_href + ' has been updated.'
//         );
//     }

//     if (record.monthly !== null) {
//         const priceId = record.monthly.stripe_price_id;
//         const price = await stripe.prices.update(priceId, { active: false });
//         console.log(
//             'price for monthly: ' + record.product_href + ' has been updated.'
//         );
//     }

//     if (record.quarterly !== null) {
//         const priceId = record.quarterly.stripe_price_id;
//         const price = await stripe.prices.update(priceId, { active: false });
//         console.log(
//             'price for quarterly: ' + record.product_href + ' has been updated.'
//         );
//     }
// }

// async function updateSupabasePriceRecordPriceId(
//     variantIndex: number,
//     productHref: string,
//     cadence: string,
//     priceId: string
// ) {
//     const supabase = await createSupabaseServerComponentClient();

//     if (cadence === 'one_time') {
//         const { data: currentMetadata, error: metadataerror } = await supabase
//             .from('product_prices')
//             .select('one_time')
//             .eq('product_href', productHref)
//             .eq('variant_index', variantIndex)
//             .single();

//         if (metadataerror) {
//             console.log('metadata error', metadataerror.message);
//             return;
//         }

//         const { data: finaldata, error: dataerror } = await supabase
//             .from('product_prices')
//             .update({
//                 one_time: {
//                     ...currentMetadata.one_time,
//                     stripe_price_id: priceId,
//                 },
//             })
//             .eq('product_href', productHref)
//             .eq('variant_index', variantIndex);

//         if (dataerror) {
//             console.log('data error!', dataerror);
//         } else {
//             console.log('update success!');
//         }
//     }

//     if (cadence === 'monthly') {
//         const { data: currentMetadata, error: metadataerror } = await supabase
//             .from('product_prices')
//             .select('monthly')
//             .eq('product_href', productHref)
//             .eq('variant_index', variantIndex)
//             .single();

//         if (metadataerror) {
//             console.log('metadata error', metadataerror.message);
//             return;
//         }

//         const { data: finaldata, error: dataerror } = await supabase
//             .from('product_prices')
//             .update({
//                 monthly: {
//                     ...currentMetadata.monthly,
//                     stripe_price_id: priceId,
//                 },
//             })
//             .eq('product_href', productHref)
//             .eq('variant_index', variantIndex);

//         if (dataerror) {
//             console.log('data error!', dataerror);
//         } else {
//             console.log('update success monthly!');
//         }
//     }

//     if (cadence === 'quarterly') {
//         const { data: currentMetadata, error: metadataerror } = await supabase
//             .from('product_prices')
//             .select('quarterly')
//             .eq('product_href', productHref)
//             .eq('variant_index', variantIndex)
//             .single();

//         if (metadataerror) {
//             console.log('metadata error', metadataerror.message);
//             return;
//         }

//         const { data: finaldata, error: dataerror } = await supabase
//             .from('product_prices')
//             .update({
//                 quarterly: {
//                     ...currentMetadata.quarterly,
//                     stripe_price_id: priceId,
//                 },
//             })
//             .eq('product_href', productHref)
//             .eq('variant_index', variantIndex);

//         if (dataerror) {
//             console.log('data error!', dataerror);
//         } else {
//             console.log('update success!');
//         }
//     }
// }
