'use server';

import { createSupabaseServerComponentClient } from '@/app/utils/clients/supabaseServerClient';

export async function SaveJsonUsedToFailureTable(
    jsonUsed: any,
    orderId: string,
    providerId: string | null,
    reason: string,
    response: any,
    pharmacy: string | null,
    source: string,
) {
    const supabase = await createSupabaseServerComponentClient();

    const { error } = await supabase.from('pharmacy-order-failures').insert({
        request_json_data: jsonUsed,
        response_json_data: JSON.stringify(response),
        orderId: orderId,
        providerId: providerId,
        reason: reason,
        pharmacy: pharmacy,
        source,
    });

    if (error) {
        console.log(
            'Error in Database Controller, filenam: pharmacy-order-failures.ts, method: SaveJsonUsedToFailureTable, error details: ',
            error,
        );
    }
}
