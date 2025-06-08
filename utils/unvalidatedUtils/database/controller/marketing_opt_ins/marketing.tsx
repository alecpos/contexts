'use server';

import { createSupabaseServiceClient } from "@/app/utils/clients/supabaseServerClient";

export async function insertMarketingOptIn(
    email:string
) {
    const supabase = createSupabaseServiceClient();

    const { data: createData, error: createError } = await supabase
        .from('marketing_opt_ins')
        .insert({
            email:email
        })
        .select()


    if (createError) {
        console.error(createError);
        console.error('Error inserting a marketing opt in', createError);
    }
}