'use server';

import { REVIVE_UNITS_PER_MG_MAP, REVIVE_PRODUCT_VARIANT_MAP} from '@/app/services/pharmacy-integration/revive/revive-variant-mappings';
import { BOOTHWYN_VARIANT_MAP, BOOTHWYN_UNITS_PER_MG_MAP } from '@/app/services/pharmacy-integration/boothwyn/boothwyn-variant-mapping';
import { getEmpowerCatalogObject, EMPOWER_UNITS_PER_MG_MAP } from '@/app/services/pharmacy-integration/empower/empower-variant-product-script-data';
import { getHallandaleCatalogObject, HALLANDALE_UNITS_PER_MG_MAP } from '@/app/services/pharmacy-integration/hallandale/hallandale-variant-product-script-data';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import { PHARMACY } from '@/app/types/pharmacy-integrations/pharmacy-types';
import { createSupabaseServiceClient } from '@/app/utils/clients/supabaseServerClient';
import { PostgrestError } from '@supabase/supabase-js';

export interface ProductVariantRecord {
    id: number;
    created_at: Date;
    variant: string;
    price_data: any;
    product_href: string;
    variant_index: number;
    cadence:
        | 'one_time'
        | 'monthly'
        | 'quarterly'
        | 'bimonthly'
        | 'pentamonthly'
        | 'biannually'
        | 'annually';
    stripe_price_ids: {
        dev: string;
        prod: string; //allows for using [ environment ] as a key for the stripe price ID
    };
    active: boolean;
    vial: string;
    vial_dosages: string;
    dosages: string;
    pharmacy: string;
}

export async function getProductVariantList() {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase.rpc(
        'get_product_variants_href_list'
    );

    return data;
}

export async function getPriceVariantTableData(productHref: string): Promise<{
    data: ProductVariantRecord[] | null;
    error: PostgrestError | null;
}> {
    const supabase = createSupabaseServiceClient();

    const { data: priceData, error: priceDataError } = await supabase
        .from('product_variants')
        .select('*')
        .eq('product_href', productHref)
        .order('variant_index', { ascending: true });

    if (priceDataError) {
        console.error('Error fetching data for prescription:', priceDataError);
        return { data: null, error: priceDataError };
    }

    return { data: priceData as ProductVariantRecord[], error: null };
}

export async function getActiveVariantsForProduct(
    productHref: string
): Promise<{
    data: ProductVariantRecord[] | null;
    error: PostgrestError | null;
}> {
    const supabase = createSupabaseServiceClient();

    const { data: priceData, error: priceDataError } = await supabase
        .from('product_variants')
        .select('*')
        .eq('product_href', productHref)
        .eq('active', true)
        .order('variant_index', { ascending: true });

    if (priceDataError) {
        console.error('Error fetching data for prescription:', priceDataError);
        return { data: null, error: priceDataError };
    }

    return { data: priceData as ProductVariantRecord[], error: null };
}

export async function getMonthlyAndQuarterlyPriceVariantData(
    product_href: string
): Promise<{
    monthlyPrice: Partial<ProductVariantRecord> | null;
    quarterlyPrice: Partial<ProductVariantRecord> | null;
}> {
    const supabase = createSupabaseServiceClient();

    const { data: monthlyFetch, error: monthlyFetchError } = await supabase
        .from('product_variants')
        .select('price_data, variant_index, stripe_price_ids')
        .eq('product_href', product_href)
        .eq('cadence', 'monthly')
        .limit(1)
        .single();

    const { data: quarterlyFetch, error: quarterlyFetchError } = await supabase
        .from('product_variants')
        .select('price_data, variant_index, stripe_price_ids')
        .eq('product_href', product_href)
        .eq('cadence', 'quarterly')
        .limit(1)
        .single();

    return {
        monthlyPrice: monthlyFetch,
        quarterlyPrice: quarterlyFetch,
    };
}

export async function getPriceDataRecordWithVariant(
    product_href: string,
    variant_index: number | string
): Promise<Partial<ProductVariantRecord> | null> {
    const supabase = createSupabaseServiceClient();

    if (variant_index == -1) {
        console.log(
            `Variant Index is -1 in getPriceDataRecordWithVariant, returning null, product_href: ${product_href}, variant_index: ${variant_index}`
        );
        return null;
    }

    console.log(
        'Checkign Variant Index on Get PriceDataRecordWithVariant',
        product_href,
        variant_index
    );

    const { data, error } = await supabase
        .from('product_variants')
        .select(
            `variant, vial, cadence, price_data, variant_index, vial_dosages, dosages, pharmacy, stripe_price_ids`
        )
        .eq('product_href', product_href)
        .eq('variant_index', variant_index)
        .single();

    if (error) {
        console.error('Error getting price for variant', error);
        return null;
    }

    return data;
}

export async function getProductVariantStripePriceIDsWithCadence(
    product_href: string,
    cadence: 'one_time' | 'monthly' | 'quarterly' | 'bimonthly' | 'pentamonthly'
): Promise<{ [key: string]: string } | null> {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('product_variants')
        .select('stripe_price_ids')
        .eq('product_href', product_href)
        .eq('cadence', cadence)
        .limit(1)
        .single();

    if (error) {
        console.error('Error getting stripe price', product_href, cadence);
        return null;
    }

    return data.stripe_price_ids;
}

export async function getProductVariantStripePriceIDsWithVariantIndex(
    product_href: string,
    variant_index: number
): Promise<{ [key: string]: string } | null> {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('product_variants')
        .select('stripe_price_ids')
        .eq('product_href', product_href)
        .eq('variant_index', variant_index)
        .single();

    if (error) {
        console.error(
            'Error getting stripe price',
            product_href,
            variant_index
        );
        return null;
    }

    return data.stripe_price_ids;
}

export async function getGLP1PriceVariantTableData(): Promise<
    Partial<ProductVariantRecord>[] | null
> {
    const supabase = createSupabaseServiceClient();

    const { data: priceData, error: priceDataError } = await supabase
        .from('product_variants')
        .select('stripe_price_ids, product_href, variant_index')
        .in('product_href', ['semaglutide', 'tirzepatide'])
        .order('product_href', { ascending: true })
        .order('variant_index', { ascending: true });

    if (priceDataError) {
        console.error('Error fetching data for prescription:', priceDataError);
    }

    return priceData;
}


export async function getDosagesForProductVariant(
    product_href: string,
    variant_index: number
): Promise<string | null> {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('product_variants')
        .select('dosages')
        .eq('product_href', product_href)
        .eq('variant_index', variant_index)
        .single();

    if (error) {
        console.error('Error getting vial dosages', error);
        return null;
    }

    return data.dosages;
}

/*
*
*
* Used to get the units per mg for a vial - used in the adjust dosing dialog
*
*
*/
export async function getVialUnitsPerMgForMonth(
    product_href: string,
    variant_index: number,
    month: number
): Promise<number | null> {

    console.log("inside getVialUnitsPerMgForMonth", product_href, variant_index, month);
    //add a check, just in case the variant index of the order is not the same as the variant index post pvc variant index

    const productVariantRow = await getPriceDataRecordWithVariant(product_href, variant_index);
    if (!productVariantRow) {
        console.error('No product variant row found', product_href, variant_index);
        return null;
    }

    if (productVariantRow.pharmacy === PHARMACY.REVIVE) {

        const vialsThatComeWithTheOffer = REVIVE_PRODUCT_VARIANT_MAP[product_href as PRODUCT_HREF][variant_index];
        if (!vialsThatComeWithTheOffer) {
            console.error('No vials that come with the offer', product_href, variant_index); return null;
        }

        let vialIdList = []; //collect all unix vial ids for the vials that come with the offer
        for (const vial of vialsThatComeWithTheOffer) {
            const vialId = vial.product_identification.product_identifier;
            vialIdList.push(vialId);
        }

        //loop through all the vial ids with the REVIVE_UNITS_PER_MG_MAP and see if they all have the same units per mg
        let unitsPerMgForAllVials = null;
        for (const vialId of vialIdList) {
            const unitsPerMg = REVIVE_UNITS_PER_MG_MAP[product_href as PRODUCT_HREF][vialId as keyof typeof REVIVE_UNITS_PER_MG_MAP[PRODUCT_HREF]];
            if (unitsPerMgForAllVials === null) {
                unitsPerMgForAllVials = unitsPerMg;
            } else if (unitsPerMg !== unitsPerMgForAllVials) {
                //figure out which vial should be allocated to that month. 
                console.error('Units per mg is not the same for all the vials', product_href, variant_index);
                return null; //if the units per mg is not the same for all the vials, that's when it gets fun
            }
        }

        return unitsPerMgForAllVials || null; //if the units per mg is the same for all the vials, we're safe to use that

    }

    if (productVariantRow.pharmacy === PHARMACY.BOOTHWYN) {

        const vialsThatComeWithTheOffer = BOOTHWYN_VARIANT_MAP[product_href as PRODUCT_HREF][variant_index];
        if (!vialsThatComeWithTheOffer) {
            console.error('No vials that come with the offer', product_href, variant_index); return null;
        }

        let vialIdList = []; //collect all unix vial ids for the vials that come with the offer
        for (const vial of vialsThatComeWithTheOffer) {
            const vialId = vial.sku;
            vialIdList.push(vialId);
        }

        //loop through all the vial ids with the REVIVE_UNITS_PER_MG_MAP and see if they all have the same units per mg
        let unitsPerMgForAllVials = null;
        for (const vialId of vialIdList) {
            const unitsPerMg = BOOTHWYN_UNITS_PER_MG_MAP[product_href as PRODUCT_HREF][vialId as keyof typeof BOOTHWYN_UNITS_PER_MG_MAP[PRODUCT_HREF]];
            if (!unitsPerMg) { console.error('Need a units/mg ratio mapping for this boothwyn vial', vialId); }

            if (unitsPerMgForAllVials === null) {
                unitsPerMgForAllVials = unitsPerMg;
            } else if (unitsPerMg !== unitsPerMgForAllVials) {
                //figure out which vial should be allocated to that month. 
                return null; //if the units per mg is not the same for all the vials, that's when it gets fun
            }
        }

        return unitsPerMgForAllVials || null; 
    }

    if (productVariantRow.pharmacy === PHARMACY.EMPOWER) {

        const empowerCatalogObject = getEmpowerCatalogObject(product_href as PRODUCT_HREF, variant_index);
        if (!empowerCatalogObject) {
            console.error('No empower catalog object found', product_href, variant_index); return null;
        }

        let vialIdList = empowerCatalogObject.array.map((vial: any) => vial.catalogItemCode);    
        if (!vialIdList) {
            console.error('No vials that come with the offer', product_href, variant_index); return null;
        }

        //loop through all the vial ids with the REVIVE_UNITS_PER_MG_MAP and see if they all have the same units per mg
        let unitsPerMgForAllVials = null;
        for (const vialId of vialIdList) {
            const unitsPerMg = EMPOWER_UNITS_PER_MG_MAP[product_href as PRODUCT_HREF][vialId as keyof typeof EMPOWER_UNITS_PER_MG_MAP[PRODUCT_HREF]];
            console.log("unitsPerMg", unitsPerMg);
            if (unitsPerMgForAllVials === null) {
                unitsPerMgForAllVials = unitsPerMg;
            } else if (unitsPerMg !== unitsPerMgForAllVials) {
                //figure out which vial should be allocated to that month. 
                console.error('Units per mg is not the same for all the vials', product_href, variant_index);
                return null; //if the units per mg is not the same for all the vials, that's when it gets fun
            }
        }

        return unitsPerMgForAllVials || null; //if the units per mg is the same for all the vials, we're safe to use that

    }

    if (productVariantRow.pharmacy === PHARMACY.HALLANDALE) {

        const hallandaleCatalogObject = getHallandaleCatalogObject(product_href as PRODUCT_HREF, variant_index);
        if (!hallandaleCatalogObject) {
            console.error('No hallandale catalog object found', product_href, variant_index); return null;
        }

        let vialIdList = hallandaleCatalogObject.array.map((vial: any) => vial.catalogItemCode);
        if (!vialIdList) {
            console.error('No vials that come with the offer', product_href, variant_index); return null;
        }
        vialIdList = vialIdList.filter((vialId: string) => vialId !== 'GLP-INJECTION-KIT');

        let unitsPerMgForAllVials = null;
        for (const vialId of vialIdList) {
            const unitsPerMg = HALLANDALE_UNITS_PER_MG_MAP[product_href as PRODUCT_HREF][vialId as keyof typeof HALLANDALE_UNITS_PER_MG_MAP[PRODUCT_HREF]];
            if (unitsPerMgForAllVials === null) {
                unitsPerMgForAllVials = unitsPerMg;
            } else if (unitsPerMg !== unitsPerMgForAllVials) {
                //figure out which vial should be allocated to that month. 
                console.error('Units per mg is not the same for all the vials', product_href, variant_index);
                return null; //if the units per mg is not the same for all the vials, that's when it gets fun
            }
        }

        return unitsPerMgForAllVials || null; //if the units per mg is the same for all the vials, we're safe to use that
        
    }

    console.error('Pharmacy not mapped for adjust dosing', product_href, variant_index);
    console.log("productVariantRow", productVariantRow);
    return null;
}