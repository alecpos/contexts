'use server';

import { createSupabaseServerClient } from '../../clients/supabaseServerClient';

export async function getUserIdFromSession() {
    const supabase = createSupabaseServerClient();

    return (await supabase.auth.getSession()).data.session?.user.id;
}
