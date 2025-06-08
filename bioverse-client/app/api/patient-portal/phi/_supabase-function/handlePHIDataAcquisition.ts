'use server';

import { createSupabaseServiceClient } from '@/app/utils/clients/supabaseServerClient';

export async function getPhiDataForUserUsingUsername(userId: string) {
    const supabase = await createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId);
}
