'use server';

import {
    createSupabaseServerComponentClient,
    createSupabaseServiceClient,
} from '../../clients/supabaseServerClient';

export async function getAccountProfileDataforMessage(uuid: string) {
    const supabase = await createSupabaseServiceClient();
    const { data, error } = await supabase
        .from('profiles')
        .select('id,authorization,first_name')
        .eq('id', uuid)
        .single();

    if (error) {
        console.log(error, error.message);
    } else {
        return data;
    }
}

export async function getAllAccountProfiles() {
    const supabase = await createSupabaseServiceClient();
    const { data, error } = await supabase.from('profiles').select('*');

    if (error) {
        console.log(error, error.message);
        return null;
    } else {
        return data;
    }
}

export async function getUserAuthorization(uuid: string) {
    const supabase = await createSupabaseServiceClient();
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', uuid)
        .single();

    if (error) {
        console.error('Error fetching current user profile:', error);
        return null;
    }
    console.log(data);

    return data;
}

export interface currentUserProfileData {
    id: number;
    authorization: string;
}

export interface AccountNameEmailPhoneData2 {
    id: number;
}

export interface getAllAccountProfiles {
    id: number;
    first_name: string;
}
