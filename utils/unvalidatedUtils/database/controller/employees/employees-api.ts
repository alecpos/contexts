'use server';

import { BV_AUTH_TYPE } from '@/app/types/auth/authorization-types';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { createSupabaseServiceClient } from '@/app/utils/clients/supabaseServerClient';

// API For Tablename: employees
// Created on: 6.13.24
// Created by: Nathan Cho

////////////////////////////////////////////////////////////////////////////////
// Create
// -----------------------------

// -----------------------------
// END CREATE FUNCTIONS
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
// Read
// -----------------------------

export async function getEmployeeRecordById(employee_id: string) {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('id', employee_id)
        .limit(1)
        .maybeSingle();

    if (error) {
        return null;
    }

    return data;
}

export async function getEmployeeAuthorization(
    user_id: string
): Promise<BV_AUTH_TYPE | null> {
    const supabase = createSupabaseServiceClient();

    try {
        const { data, error } = await supabase
            .from('employees')
            .select('authorization')
            .eq('id', user_id)
            .maybeSingle();

        if (error) {
            console.error('getProviderRole', error);
            return null;
        }

        return data?.authorization as BV_AUTH_TYPE;
    } catch (error: any) {
        console.error('getProviderRole caught error', error);
        return null;
    }
}

export async function getCurrentEmployeeRole(): Promise<BV_AUTH_TYPE | null> {
    const supabase = createSupabaseServiceClient();

    try {
        const user_id = (await readUserSession()).data.session?.user.id;

        if (!user_id) {
            return null;
        }

        const { data, error } = await supabase
            .from('employees')
            .select('authorization')
            .eq('id', user_id)
            .limit(1)
            .maybeSingle();

        if (error) {
            console.error('getCurrentEmployeeRole', error);
            return null;
        }

        return data?.authorization;
    } catch (error: any) {
        console.error('getCurrentEmployeeRole', error);
        return null;
    }
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
