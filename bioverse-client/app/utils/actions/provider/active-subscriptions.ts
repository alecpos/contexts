'use server';

import {
    createSupabaseServerComponentClient,
    createSupabaseServiceClient,
} from '../../clients/supabaseServerClient';


/**
 * We enforce type safety for the orders value, because supabase thinks it will be an array of objects,
 * But it actually sends an object. If two orders show up, an error would be desirable.
 */
type ActiveSub = {
    id : string;
    order_id : string;
    product_href : string;
    orders : {
        id : string;
        assigned_dosage : string;
        product_href : string;
    } 
}

export async function getActiveSubscriptionInfobyPatientId(patientId: string) {
    const supabase = createSupabaseServiceClient();

    const { data: subscriptionData, error: patientDataFetchError } = await supabase
        .from('prescription_subscriptions')
        .select(
            `
            id,
            order_id,
            product_href,
            orders!prescription_subscriptions_order_id_fkey ( id, assigned_dosage, product_href )          
            `
        )
        .eq('patient_id', patientId)
        .eq('status', 'active')
        .returns<ActiveSub[]>();

    if (patientDataFetchError) {
        console.log('Patient Subscriptions TS: ', patientDataFetchError.message);
        return { data: null, error: patientDataFetchError };
    }

    return { data: subscriptionData, error: null };
}
