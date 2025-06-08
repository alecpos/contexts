'use server';
import {
    createSupabaseServerComponentClient,
    createSupabaseServiceClient,
} from '../../clients/supabaseServerClient';

export async function getSuggestedDosages(productHref: string, suggestedDosageIndices: Number[]) {

    const supabase = createSupabaseServiceClient();
    const { data: dosageData, error: patientDataFetchError } = await supabase
        .from('product_variants')
        .select(
            `
            id,
            vial,
            cadence,
            vial_dosages,
            dosages,
            pharmacy,
            variant_index,
            price_data
            `
        )
        .eq('product_href', productHref)
        .in('variant_index', suggestedDosageIndices)


    if (patientDataFetchError) {
        console.log('Suggested Dosages TS: ', patientDataFetchError.message);
        return { data: null, error: patientDataFetchError };
    }
    return { data: dosageData, error: null };

}