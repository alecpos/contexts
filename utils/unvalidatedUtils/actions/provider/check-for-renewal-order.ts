'use server';
import {
    createSupabaseServerComponentClient,
    createSupabaseServiceClient,
} from '../../clients/supabaseServerClient';

export async function checkForRenewalOrder(renewal_order_id: string) {

    const supabase = createSupabaseServiceClient();
    const { data: subscriptionData, error: patientDataFetchError } = await supabase
        .from('renewal_orders')
        .select(
            `
            id,
            assigned_pharmacy,
            variant_index,
            dosage_suggestion_variant_indexes,
            dosage_selection_completed,
            order_status
            `
        )
        .eq('renewal_order_id', renewal_order_id)
        .single();
    if (patientDataFetchError) {
        console.log('Renewal Order TS: ', patientDataFetchError.message);
        return { data: null, error: patientDataFetchError };
    }
    return { data: subscriptionData, error: null };

}