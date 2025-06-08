'use server';

import { createSupabaseServiceClient } from '@/app/utils/clients/supabaseServerClient';

export async function addMemberToThread(
    user_id_to_add: string,
    thread_id: string
): Promise<boolean> {
    const supabase = createSupabaseServiceClient();

    const { error } = await supabase
        .from('thread_members')
        .insert({
            thread_id: thread_id,
            user_id: user_id_to_add,
            last_read_at: new Date(),
        });

    if (error) {
        console.error(error, error.message);
    }

    return false;
}

/**
 * Updates the last_read_at column value to be the current Date-Time
 * @param user_id The uuid of the user viewing thread
 * @param thread_id The ID of the thread in question
 */
export async function updateThreadMemberLastReadAt(
    user_id: string,
    thread_id: number
) {
    const supabase = createSupabaseServiceClient();

    const { error } = await supabase
        .from('thread_members')
        .update({ last_read_at: new Date() })
        .eq('user_id', user_id)
        .eq('thread_id', thread_id);

    if (error) {
        console.error(error, error.message);
    }
}

/**
 * Updates the last_read_at column value for a non-patient user
 * @param user_id
 * @param thread_id
 */
export async function updateThreadMemberLastReadAtWithPatientAndProduct(
    user_id: string,
    thread_id: number
) {
    const supabase = createSupabaseServiceClient();

    const { error } = await supabase
        .from('thread_members')
        .update({ last_read_at: new Date() })
        .eq('user_id', user_id)
        .eq('thread_id', thread_id);

    if (error) {
        console.error(error, error.message);
    }
}
