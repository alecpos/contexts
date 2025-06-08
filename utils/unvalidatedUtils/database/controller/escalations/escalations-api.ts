'use server';

import { triggerEvent } from '@/app/services/customerio/customerioApiFactory';
import { Status } from '@/app/types/global/global-enumerators';
import { createSupabaseServiceClient } from '@/app/utils/clients/supabaseServerClient';

export async function createSupabaseEscalation(
    escalation_data: EscalationDataObject
) {
    const supabase = createSupabaseServiceClient();

    const { error } = await supabase.from('escalations').insert({
        ...escalation_data,
        environment: process.env.NEXT_PUBLIC_ENVIRONMENT!,
    });

    if (error) {
        return Status.Error;
    }

    await triggerEvent(
        '2eb849bc-62cf-46a0-b0ef-25b0b0efcdfd',
        'escalate-order',
        {
            content: escalation_data.metadata.email_content,
        }
    );

    return Status.Success;
}

export async function createSupabaseEscalationByPharmacy(
    escalation_data: EscalationDataObject,
    event: string
) {
    const supabase = createSupabaseServiceClient();

    const { error } = await supabase.from('escalations').insert({
        ...escalation_data,
        environment: process.env.NEXT_PUBLIC_ENVIRONMENT!,
    });

    if (error) {
        return Status.Error;
    }

    await triggerEvent('2eb849bc-62cf-46a0-b0ef-25b0b0efcdfd', event, {
        content: escalation_data.metadata.email_content,
    });

    return Status.Success;
}

export async function getAllEscalations() {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('escalations')
        .select(
            '*, patient:profiles!patient_id(first_name, last_name), escalator:employees!escalated_by(display_name)'
        )
        .order('status', { ascending: true })
        .order('created_at', { ascending: false })
        .eq('environment', process.env.NEXT_PUBLIC_ENVIRONMENT!);

    return data as PatientEscalationData[];
}

export async function getAllPatientEscalations(patient_id: string) {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('escalations')
        .select(
            '*, patient:profiles!patient_id(first_name, last_name), escalator:employees!escalated_by(display_name)'
        )
        .order('status', { ascending: true })
        .order('created_at', { ascending: false })
        .eq('patient_id', patient_id);

    return data as PatientEscalationData[];
}

export async function changeEscalationStatus(
    escalation_id: string | number,
    new_status: string
) {
    const supabase = createSupabaseServiceClient();

    const { error } = await supabase
        .from('escalations')
        .update({ status: new_status, last_updated_at: new Date() })
        .eq('id', escalation_id);

    if (error) {
        return Status.Error;
    }

    return Status.Success;
}

export async function editEscalationNote(
    escalation_id: string | number,
    newNote: string
) {
    const supabase = createSupabaseServiceClient();

    const { error } = await supabase
        .from('escalations')
        .update({ note: newNote, last_updated_at: new Date() })
        .eq('id', escalation_id);

    if (error) {
        return Status.Error;
    }

    return Status.Success;
}
