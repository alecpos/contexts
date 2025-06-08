import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

export function createSupabaseServerClient(serverComponent = false) {
    const cookieStore = cookies();

    return createServerClient(
        process.env.NEXT_PUBLIC_supabase_url!,
        process.env.NEXT_PUBLIC_supabase_anon_key!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value;
                },
                set(name: string, value: string, options: CookieOptions) {
                    if (serverComponent) return;
                    cookieStore.set({ name, value, ...options });
                },
                remove(name: string, options: CookieOptions) {
                    if (serverComponent) return;
                    cookieStore.set({ name, value: '', ...options });
                },
            },
        }
    );
}

export function createSupabaseServerComponentClient() {
    return createSupabaseServerClient(true);
}

/**
 * Creates a supabase client that is used to interact with the database bypassing RLS
 * @returns A supabase client that is used to interact with the database.
 */
export function createSupabaseServiceClient() {
    return createClient(
        process.env.NEXT_PUBLIC_supabase_url!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
            auth: {
                persistSession: false,
                autoRefreshToken: false,
                detectSessionInUrl: false,
            },
        }
    );
}
