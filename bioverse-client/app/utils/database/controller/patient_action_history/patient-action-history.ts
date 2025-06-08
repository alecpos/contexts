'use server';
import { createSupabaseServiceClient } from '@/app/utils/clients/supabaseServerClient';
import {
    PatientActionHistory,
    PatientActionTask,
} from './patient-action-history-types';

export async function logPatientAction(
    patient_id: string,
    task_name: PatientActionTask,
    notes: any,
) {
    const supabase = createSupabaseServiceClient();
    await supabase
        .from('patient_action_history')
        .insert({ patient_id, task_name, notes });
}

export async function fetchHistoryLogsForPatient(
    patient_id: string,
): Promise<PatientActionHistory[]> {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('patient_action_history')
        .select('*')
        .eq('patient_id', patient_id)
        .order('created_at', { ascending: true });

    if (error) {
        console.error(error);
        return [];
    }

    if (!data) {
        return [];
    }

    return data as PatientActionHistory[];
}

export async function fetchPaymentFailureLogsForOrder(
    order_id: string,
): Promise<PatientActionHistory[]> {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('patient_action_history')
        .select('*')
        .eq('task_name', PatientActionTask.PAYMENT_FAILED)
        .eq('notes ->> order_id', order_id)
        .order('created_at', { ascending: false });

    if (error) {
        console.error(error);
        return [];
    }

    if (!data) {
        return [];
    }

    return data as PatientActionHistory[];
}
