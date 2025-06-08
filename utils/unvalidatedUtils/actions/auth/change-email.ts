'use server';

import { createSupabaseServiceClient } from '../../clients/supabaseServerClient';

export async function changeEmail(new_email: string, patient_id: string) {
    const supabase = createSupabaseServiceClient();

    const { error } = await supabase.auth.admin.updateUserById(patient_id, {
        email: new_email,
    });
    if (error) {
        return { error: error };
    }

    return { error: error };
}

export async function checkIfEmailExists(email: string) {
    const supabase = createSupabaseServiceClient();
    const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email);

    if (error) {
        console.error('Error checking email:', error);
        return false;
    }

    return data && data.length > 0;
}

export async function changePassword(new_password: string, patient_id: string) {
    const supabase = createSupabaseServiceClient();

    const { error } = await supabase.auth.admin.updateUserById(patient_id, {
        password: new_password,
    });
    if (error) {
        return { error: error };
    }

    return { error: null };
}
