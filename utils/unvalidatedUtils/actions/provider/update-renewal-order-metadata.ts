'use server';
import {
    createSupabaseServerComponentClient,
    createSupabaseServiceClient,
} from '../../clients/supabaseServerClient';

export async function updateRenewalOrderMetadata(renewal_order_id: string) {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('renewal_orders')
        .update({
            metadata: {
                coordinatorDosageSelected: true,
            }
          })
        .eq('renewal_order_id', renewal_order_id);

    if (error) {
        console.log('Error updating metadata: ', error.message);
        return { data: null, error };
    }

    return { data, error: null };
}
