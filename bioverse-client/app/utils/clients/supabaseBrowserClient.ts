'use client';
import { createBrowserClient } from '@supabase/ssr';

export function createSupabaseBrowserClient() {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_supabase_url!,
        process.env.NEXT_PUBLIC_supabase_anon_key!
    );
}
