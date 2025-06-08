import { CookieOptions, createServerClient } from '@supabase/ssr';
import { getCookie, setCookie } from 'cookies-next';

export function createSupabaseReqResClient(req: any, res: any) {
    return createServerClient(
        process.env.NEXT_PUBLIC_supabase_url!,
        process.env.NEXT_PUBLIC_supabase_anon_key!,
        {
            cookies: {
                get(name: string) {
                    return getCookie(name, { req, res });
                },
                set(name: string, value: string, options: CookieOptions) {
                    setCookie(name, value, { req, res, ...options });
                },
                remove(name: string, options: CookieOptions) {
                    setCookie(name, '', { req, res, ...options });
                },
            },
        },
    );
}
