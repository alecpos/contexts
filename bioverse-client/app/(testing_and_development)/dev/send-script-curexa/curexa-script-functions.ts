'use server';

import { getBestMatchingOrder } from '@/app/api/dosespot/_event-actions/dose-spot/order-matcher';
import { handlePrescriptionRxVerified } from '@/app/api/dosespot/_event-type-cases/handlePrescriptionResult';
import { createSupabaseServiceClient } from '@/app/utils/clients/supabaseServerClient';
import { result } from 'lodash';

export async function curexaManualSearch(order_number: string) {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('dose_spot_webhook_audit')
        .select('*')
        .eq('status_update_data->patient_id', order_number)
        .order('created_at', { ascending: true });
    // .eq('status_update_data->prescription_status', '13');

    return data;
}

export async function mimicCurexaSendingScriptAcceptingDSStatusData(
    status_update_data_string: string
) {
    const status_update_data = JSON.parse(
        status_update_data_string
    ) as DoseSpotStatusPrescriptionData;

    const { order, prescriptionData } = await getBestMatchingOrder(
        status_update_data
    );

    if (order === null) {
        return { result: 'failure', reason: 'no order found.' };
    }

    if (order.order_status !== 'Payment-Completed') {
        return {
            result: 'failure',
            reason: 'customer would have been charged again.',
        };
    }

    try {
        await handlePrescriptionRxVerified(
            prescriptionData,
            order,
            status_update_data
        );

        return { result: 'success', reason: 'NONE, IT WORKED. 😭' };
    } catch (error: any) {
        console.log('error', error);
        return {
            result: 'failure',
            reason: 'during sending script, there was an issue. ',
            error: error,
        };
    }
}
