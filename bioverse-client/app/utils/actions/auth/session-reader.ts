'use server';

import {
    createSupabaseServerClient,
    createSupabaseServerComponentClient,
} from '../../clients/supabaseServerClient';
import { getEmployeeRecordById } from '../../database/controller/employees/employees-api';

export async function readUserSession() {
    const supabase = createSupabaseServerClient();
    return await supabase.auth.getSession();
}

/**
 * This differs from readUserSession as getSession accesses auth cookies, but getUser accesses the database
 */
export async function readActiveUser() {
    const supabase = createSupabaseServerClient();
    return await supabase.auth.getUser();
}

export async function readUserSessionCheckForMFARequirement() {
    const supabase = await createSupabaseServerClient();
    const session = await supabase.auth.getSession();
    const user_id = session.data.session?.user.id;

    if (user_id) {
        const assurance_level =
            await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

        const employee_record = await getEmployeeRecordById(user_id);

        if (employee_record) {
            return {
                user_id: user_id,
                mfa_required: true,
                assurance_level: assurance_level,
            };
        } else {
            return {
                user_id: user_id,
                mfa_required: false,
                assurance_level: assurance_level,
            };
        }
    } else return null;
}

export async function getCurrentUserId() {
    const supabase = await createSupabaseServerComponentClient();

    const { data, error } = await supabase.auth.getSession();

    if (error) {
        console.log('Error retrieving the user ID', error);
        return null;
    }

    return data.session ? data.session.user.id : null;
}

export async function getAuthLevel() {
    const supabase = await createSupabaseServerComponentClient();

    const uid = (await supabase.auth.getSession()).data.session?.user.id;

    if (uid) {
        const { data: authTextualData, error } = await supabase
            .from('profiles')
            .select('authorization')
            .eq('id', uid)
            .single();

        if (authTextualData) {
            switch (authTextualData.authorization) {
                case 'customer':
                    return 0;
                case 'coordinator':
                    return 1;
                case 'provider':
                    return 2;
                case 'developer':
                    return 2;
                case 'administrator':
                    return 3;
                case 'customer_service':
                    return 4;
            }
        }
    }
    return 0;
}
