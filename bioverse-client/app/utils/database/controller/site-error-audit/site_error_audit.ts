'use server';

import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { createSupabaseServiceClient } from '@/app/utils/clients/supabaseServerClient';

export async function auditErrorToSupabase(
    identifier: string,
    error_message: string,
    error_json: any = {}
) {
    const supabase = createSupabaseServiceClient();

    let user_email;
    let user_id;

    try {
        const sessionData = (await readUserSession()).data.session;

        user_email = sessionData?.user.email;
        user_id = sessionData?.user.id;
    } catch (error) {
        user_email = undefined;
        user_id = undefined;
    }

    const { error } = await supabase.from(`site_error_audit`).insert({
        error_message: error_message,
        user_data: {
            user_id: user_id ?? undefined,
            user_email: user_email ?? undefined,
        },
        identifier: identifier,
        error_json: error_json,
    });
}

// export async function auditNotFoundToSupabase(url: string) {
//     const supabase = createSupabaseServiceClient();

//     let email: string | undefined;
//     let user_id: string | undefined;

//     try {
//         const sessionData = (await readUserSession()).data.session;
//         user_id = sessionData?.user.id;
//         email = sessionData?.user.email;
//     } catch (error: any) {
//         email = 'not-signed-in';
//         user_id = 'undefined-user-id';
//     }

//     const { error } = await supabase.from(`site_error_audit`).insert({
//         id: `not-found-${
//             user_id ? user_id : 'undefined-user-id'
//         }-${new Date().toTimeString()}`,
//         error_message: `ROUTE NOT FOUND: ${url}`,
//         source: 'URL_NOT_FOUND',
//         user_data: { email: email ? email : 'not-signed-in' },
//     });

//     if (error) {
//         console.error('site error audit error', error);
//     }
// }
