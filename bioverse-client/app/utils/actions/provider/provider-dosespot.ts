'use server';
import { createSupabaseServerComponentClient } from '@/app/utils/clients/supabaseServerClient';
import { getCurrentProviderDoseSpotId } from '../../database/controller/providers/providers-api';

export async function getProviderNotificationCount() {
    const supabase = await createSupabaseServerComponentClient();

    const doseSpotId = await getCurrentProviderDoseSpotId();

    const { data: countData, error: countError } = await supabase
        .from('dose_spot_provider_notifications')
        .select('*')
        .eq('clinician_id', doseSpotId)
        .single();

    if (countError) {
        return { data: 0 };
    }

    const count =
        countData.pending_prescription_count +
        countData.transmission_error_count +
        countData.refill_request_count +
        countData.change_request_count;

    return { data: count };
}
