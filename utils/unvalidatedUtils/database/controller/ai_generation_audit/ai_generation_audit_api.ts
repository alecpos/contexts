'use server';

import { createSupabaseServiceClient } from '@/app/utils/clients/supabaseServerClient';

export async function createAIGenerationAudit(
    providerId: string,
    initialThreadData: any,
    type: string,
    ai_response: any,
    metadata?: any
) {
    const supabase = createSupabaseServiceClient();

    const audit_obj = {
        provider_id: providerId,
        response_type: type,
        initial_message_array: initialThreadData,
        ai_response: ai_response,
        metadata: metadata ?? null,
    };

    const { error } = await supabase
        .from('ai_generation_audit')
        .insert(audit_obj);

    if (error) {
        console.log(error);
    }

    return;
}
