'use server';

import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { createSupabaseServiceClient } from '@/app/utils/clients/supabaseServerClient';

// API For Tablename: patient_weight_audit
// Created on: 6.11.24
// Created by: Nathan Cho

////////////////////////////////////////////////////////////////////////////////
// Create
// -----------------------------

export async function createPatientWeightAudit(
    audit_data: PatientWeightAuditCreate
) {
    const supabase = createSupabaseServiceClient();

    const { error } = await supabase
        .from('patient_weight_audit')
        .insert(audit_data);

    if (error) {
        console.error('createPatientWeightAudit', audit_data, error);
    }

    return;
}

export async function createCurrentPatientWeightAudit(
    weight: number,
    source: string
) {
    const supabase = createSupabaseServiceClient();

    const user_id = (await readUserSession()).data.session?.user.id;

    const { error } = await supabase.from('patient_weight_audit').insert({
        patient_id: user_id,
        weight: weight,
        source: source,
        environment: process.env.NEXT_PUBLIC_ENVIRONMENT!,
    });

    if (error) {
        console.error(
            'createPatientWeightAudit',
            'user_id: ',
            user_id,
            'weight: ',
            weight,
            'source: ',
            source,
            'error: ',
            error
        );
    }

    return;
}

// -----------------------------
// END CREATE FUNCTIONS
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
// Read
// -----------------------------

export async function getWeightAuditsForPatient(
    patient_id: string
): Promise<PatientWeightAuditSBR[] | null> {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('patient_weight_audit')
        .select('*')
        .eq('patient_id', patient_id);

    if (error) {
        console.error('getWeightAuditsForPatient', patient_id, error);
        return null;
    }

    return data as PatientWeightAuditSBR[];
}

// -----------------------------
// END READ FUNCTIONS
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
// Update
// -----------------------------

// -----------------------------
// END UPDATE FUNCTIONS
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
// Delete
// -----------------------------

// -----------------------------
// END DELETE FUNCTIONS
////////////////////////////////////////////////////////////////////////////////
