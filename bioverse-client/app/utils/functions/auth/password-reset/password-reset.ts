'use server';

import { Status } from '@/app/types/global/global-enumerators';
import { createSupabaseServiceClient } from '@/app/utils/clients/supabaseServerClient';

export async function resetPasswordForUser(newPassword: string) {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
    });

    if (error) {
        console.error('Error in resetting password ', error);
        return Status.Error;
    }

    return Status.Success;
}

export async function loggerTester(content: any) {
    //console.log('Session log for testing ', content);
}

export async function logUserInWithCode(code: string) {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
        console.error('sign in with code error', error);
        return 'issue with login ' + error.message;
    } else {
        console.log('signed in with code');
        return 'success';
    }
}
