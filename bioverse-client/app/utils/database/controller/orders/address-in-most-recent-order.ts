'use server';

import {
    createSupabaseServerComponentClient,
    createSupabaseServiceClient,
} from '@/app/utils/clients/supabaseServerClient';


export async function getAddressOfMostRecentOrder(userId: string) {
    const supabase = createSupabaseServiceClient();

    const { data: addressData, error: addressDataFetchError } = await supabase
    .from('orders')
    .select(
        `
        address_line1,
        address_line2,
        city,
        state,
        zip
        `
    )
    .eq('customer_uid', userId)
    .not('address_line1', 'is', null) 
    .not('city', 'is', null)
    .not('state', 'is', null)
    .not('zip', 'is', null)
    .order('created_at', { ascending: false }) 
    .limit(1);


    if (addressDataFetchError) {
        console.log('Address in most recent order TS: ', addressDataFetchError.message);
        return { data: null, error: addressDataFetchError };
    }

    return { data: addressData, error: null };
}