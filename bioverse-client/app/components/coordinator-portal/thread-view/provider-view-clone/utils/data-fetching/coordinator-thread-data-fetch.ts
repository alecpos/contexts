'use server';

import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import { getPatientInformationById } from '@/app/utils/actions/provider/patient-overview';
import { createSupabaseServiceClient } from '@/app/utils/clients/supabaseServerClient';
import { getOrderById } from '@/app/utils/database/controller/orders/orders-api';

export async function getPatientAndOrderDataWithThreadId(thread_id: number) {
    const supabase = createSupabaseServiceClient();

    const { data: thread_data, error: thread_error } = await supabase
        .from('threads')
        .select(
            `id, patient_id, product, created_at,
            escalation:thread_escalations!id (
                requires_provider,
                requires_lead,
                requires_coordinator
            )
            `
        )
        .eq('id', thread_id)
        .single();

    if (thread_error) {
        console.log(thread_error);
    }

    const patient_id = thread_data?.patient_id;

    const { data: patientData, error: patientDataError } =
        await getPatientInformationById(patient_id);

    let searched_order_id = undefined;

    //We record the product as weight loss for a specific weight loss funnel but those patients cannot
    if (thread_data?.product === 'weight-loss') {
        const { data: wlOrderId, error: orderId_error } = await supabase
            .from('orders')
            .select('id')
            .eq('customer_uid', patient_id)
            .in('product_href', [
                PRODUCT_HREF.METFORMIN,
                PRODUCT_HREF.SEMAGLUTIDE,
                PRODUCT_HREF.TIRZEPATIDE,
            ])
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

        searched_order_id = wlOrderId?.id ?? 0;
    }

    if (thread_data?.product === PRODUCT_HREF.ED_GLOBAL) {
        const { data: edOrderId, error: ed_orderId_error } = await supabase
            .from('orders')
            .select('id')
            .eq('customer_uid', patient_id)
            .in('product_href', [
                PRODUCT_HREF.PEAK_CHEWS,
                PRODUCT_HREF.RUSH_CHEWS,
                PRODUCT_HREF.RUSH_MELTS,
                PRODUCT_HREF.X_CHEWS,
                PRODUCT_HREF.X_MELTS,
                PRODUCT_HREF.SILDENAFIL,
                PRODUCT_HREF.TADALAFIL,
                PRODUCT_HREF.CIALIS,
                PRODUCT_HREF.VIAGRA,
            ])
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

        searched_order_id = edOrderId?.id ?? 0;
    }

    const { data: orderId, error: orderId_error } = await supabase
        .from('orders')
        .select('id')
        .eq('customer_uid', patient_id)
        .eq('product_href', thread_data?.product)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

    const { data: orderData, error: orderError } = await getOrderById(
        searched_order_id ? searched_order_id : orderId?.id
    );

    return {
        thread_data: thread_data,
        patient_data: patientData,
        order_data: orderData,
    };
}
