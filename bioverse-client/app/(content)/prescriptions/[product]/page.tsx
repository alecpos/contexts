'use server';

import PrescriptionProductPage from '@/app/components/productPages/content-pages/prescriptions/pdp';
import { createSupabaseServerComponentClient } from '@/app/utils/clients/supabaseServerClient';

export default async function Page({
    params,
}: {
    params: { product: string };
}) {
    const toLowerCase = (str: string) => str.toLowerCase();
    const supabase = createSupabaseServerComponentClient();

    const { data: productData, error: productDataError } = await supabase
        .from('products')
        .select('*')
        .eq('href', toLowerCase(params.product))
        .single();

    if (productDataError) {
        console.error(
            'Error fetching data for prescription:',
            productDataError
        );
    }

    return (
        <div className='w-full overflow-hidden'>
            <PrescriptionProductPage
                data={productData}
            ></PrescriptionProductPage>
        </div>
    );
}

// function supabasePriceDataToProductPriceRecord(
//     priceVariantData: {
//         id: string;
//         created_at: string;
//         last_modified: string;
//         reference_id: string;
//         variant: string;
//         cadence: string;
//         one_time: any;
//         monthly: any;
//         quarterly: any;
//         product_href: string;
//         variant_index: number;
//         active: boolean;
//     }[]
// ): ProductPriceRecord[] {
//     return priceVariantData
//         .filter((data) => data.one_time || data.monthly || data.quarterly)
//         .map((data) => ({
//             id: data.id,
//             created_at: data.created_at,
//             last_modified: data.last_modified,
//             reference_id: data.reference_id,
//             variant: data.variant,
//             one_time: transformCadenceData(data.one_time),
//             monthly: transformCadenceData(data.monthly),
//             quarterly: transformCadenceData(data.quarterly),
//             product_href: data.product_href,
//             variant_index: data.variant_index,
//             active: data.active,
//         }));
// }

// function transformCadenceData(cadence: any): CadenceData | null {
//     if (!cadence) return null;
//     return {
//         cadence: cadence.cadence,
//         product_price: cadence.product_price,
//         discount_price: {
//             discount_type: cadence.discount_price?.discount_type,
//             discount_amount: cadence.discount_price?.discount_amount,
//         },
//         stripe_price_id: cadence.stripe_price_id,
//         custom_display_price: cadence.custom_display_price || null,
//         blue_display_text: cadence.blue_display_text,
//         gray_display_text: cadence.gray_display_text,
//         stripe_product_id: cadence.stripe_product_id,
//         quarterly_display_price: cadence.quarterly_display_price,
//         subcription_includes_bullets: cadence.subcription_includes_bullets,
//         price_text: cadence.price_text,
//     };
// }
