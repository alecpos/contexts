'use server';

import { createSupabaseServerComponentClient } from '../../clients/supabaseServerClient';
import { SupabaseClient } from '@supabase/supabase-js';

export async function getMessages(userId: string, providerId: string) {
    const supabase = createSupabaseServerComponentClient();

    const { data, error } = await supabase
        .from('messages')
        .select('*')
        .in('sender_id', [userId, providerId])
        .in('provider_id', [userId, providerId])
        .order('created_at', { ascending: true });

    if (error) {
        return { error: error.message, data: null };
    }

    return { data, error: null };
}

// Server-side
export async function sendMessage(
    sender_id: string,
    provider_id: string,
    message: string,
) {
    if (!sender_id || !provider_id || !message) {
        console.error('Invalid sender_id, provider_id, or message:', {
            sender_id,
            provider_id,
            message,
        });
        return {
            error: 'Invalid sender_id, provider_id, or message',
            data: null,
        };
    }

    const supabase = createSupabaseServerComponentClient();
    const { data, error } = await supabase
        .from('messages')
        .insert([{ sender_id, provider_id, message }])
        .select()
        .single();

    if (error) {
        console.error('Error sending message:', error);
        return { error: error.message, data: null };
    }

    return { data };
}
