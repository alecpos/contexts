'use server';

import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { createSupabaseServiceClient } from '@/app/utils/clients/supabaseServerClient';

export async function getAllThreadEscalations() {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase.from('thread_escalations').select(
        `
            *,
            threads!inner(id, patient_id, product,
                patient:profiles!patient_id(first_name, last_name, email, state) )
            `
    );

    if (error) {
        console.log(error);
    }

    return data;
}

/**
 * @author Nathan Cho
 * Retrieves all threads.
 * Specific to this function, it orders by the list by
 */
export async function getCoordinatorThreadList() {
    const supabase = createSupabaseServiceClient();

    let coordinator_id;

    const session = await readUserSession();
    coordinator_id = session.data.session?.user.id;

    let tableName;
    // TODO: Deprecate this and recognize better
    if (coordinator_id === 'c25c6769-2d12-4e58-9585-7fb73f552aeb') {
        tableName = 'get_lead_coordinator_messages';
    } else {
        // tableName = 'get_coordinator_threads';
        tableName = 'get_latest_coordinator_messages';
    }
    const { data, error } = await supabase.rpc(tableName);

    if (error) {
        console.log(
            'error in chat threads for coordiantors: ',
            error,
            error.message
        );
    }

    // Sort the data such that indices where data[n].last_patient_message_time > last_bioverse_message_time come first
    const sortedData = data.sort(
        (
            a: {
                last_patient_message_time: string | number | Date;
                last_bioverse_message_time: string | number | Date;
                requires_coordinator: boolean;
            },
            b: {
                last_patient_message_time: string | number | Date;
                last_bioverse_message_time: string | number | Date;
                requires_coordinator: boolean;
            }
        ) => {
            const aTime = new Date(a.last_patient_message_time).getTime();
            const bTime = new Date(b.last_patient_message_time).getTime();
            const aBioverseTime = new Date(
                a.last_bioverse_message_time
            ).getTime();
            const bBioverseTime = new Date(
                b.last_bioverse_message_time
            ).getTime();

            // First, prioritize requires_coordinator
            if (a.requires_coordinator && !b.requires_coordinator) {
                return -1;
            } else if (!a.requires_coordinator && b.requires_coordinator) {
                return 1;
            }

            // If both require coordinator, or both don't, then sort by message times
            if (a.requires_coordinator && b.requires_coordinator) {
                if (aTime > aBioverseTime && bTime <= bBioverseTime) {
                    return -1;
                } else if (aTime <= aBioverseTime && bTime > bBioverseTime) {
                    return 1;
                } else {
                    return 0;
                }
            }

            // If neither require coordinator, sort by message times
            if (aTime > aBioverseTime && bTime <= bBioverseTime) {
                return -1;
            } else if (aTime <= aBioverseTime && bTime > bBioverseTime) {
                return 1;
            } else {
                return 0;
            }
        }
    );

    return sortedData;
}

/**
 * @author Nathan Cho
 * @returns all Thread_escalation records where provider is required, but not the ones where lead is required.
 */
export async function getProviderThreadList() {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase.rpc('get_provider_message_list');

    if (error) {
        console.log(
            'error in chat threads for coordiantors: ',
            error,
            error.message
        );
    }

    // Sort the data such that indices where data[n].last_patient_message_time > last_bioverse_message_time come first
    const sortedData = data.sort(
        (
            a: {
                last_patient_message_time: string | number | Date;
                last_bioverse_message_time: string | number | Date;
                requires_coordinator: boolean;
            },
            b: {
                last_patient_message_time: string | number | Date;
                last_bioverse_message_time: string | number | Date;
                requires_coordinator: boolean;
            }
        ) => {
            const aTime = new Date(a.last_patient_message_time).getTime();
            const bTime = new Date(b.last_patient_message_time).getTime();
            const aBioverseTime = new Date(
                a.last_bioverse_message_time
            ).getTime();
            const bBioverseTime = new Date(
                b.last_bioverse_message_time
            ).getTime();

            // First, prioritize requires_coordinator
            if (a.requires_coordinator && !b.requires_coordinator) {
                return -1;
            } else if (!a.requires_coordinator && b.requires_coordinator) {
                return 1;
            }

            // If both require coordinator, or both don't, then sort by message times
            if (a.requires_coordinator && b.requires_coordinator) {
                if (aTime > aBioverseTime && bTime <= bBioverseTime) {
                    return -1;
                } else if (aTime <= aBioverseTime && bTime > bBioverseTime) {
                    return 1;
                } else {
                    return 0;
                }
            }

            // If neither require coordinator, sort by message times
            if (aTime > aBioverseTime && bTime <= bBioverseTime) {
                return -1;
            } else if (aTime <= aBioverseTime && bTime > bBioverseTime) {
                return 1;
            } else {
                return 0;
            }
        }
    );

    return sortedData;
}

export async function getProviderThreadCount() {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase.rpc('getprovidermessagecount');

    if (error) {
        console.error(error);
    }

    console.log('count!!', data);
    return data;
}

export async function getLeadCoordinatorThreadList() {
    const supabase = createSupabaseServiceClient();
    /*
- patient_first_name
- patient_last_name
- patient_email
- product
- created_at
*/

    const { data, error } = await supabase
        .from('thread_escalations')
        .select(
            `
            *,
            threads!inner(id, patient_id, product,
                patient:profiles!patient_id(first_name, last_name, email) )
            `
        )
        .eq('requires_lead', true);

    if (error) {
        console.log(error);
    }

    return data;
}

/**
 * @author Nathan Cho
 * @param thread_id
 * @param consider_complete
 * @returns a boolean value true if successful, false if not successful.
 */
export async function updateConsiderCompleteForThreadId(
    thread_id: number,
    consider_complete: boolean
): Promise<boolean> {
    const supabse = createSupabaseServiceClient();

    const { error } = await supabse
        .from('thread_escalations')
        .update({
            consider_complete: consider_complete,
        })
        .eq('thread_id', thread_id);

    if (error) {
        console.log('error in updating thread column: consider_complete ');
        return false;
    }

    return true;
}

/**
 * @author Nathan Cho
 * @param thread_id
 * @param requires_provider
 * @returns a boolean value true if successful, false if not successful.
 */
export async function updateRequiresProviderForThreadId(
    thread_id: number,
    requires_provider: boolean
): Promise<boolean> {
    const supabse = createSupabaseServiceClient();

    const { error } = await supabse
        .from('thread_escalations')
        .update({
            requires_provider: requires_provider,
        })
        .eq('thread_id', thread_id);

    if (error) {
        console.log('error in updating thread column: consider_complete ');
        return false;
    }

    return true;
}

export async function updateReadProviderTimeForThreadId(
    thread_id: number
): Promise<boolean> {
    const supabase = createSupabaseServiceClient();

    const { error } = await supabase
        .from('thread_escalations')
        .update({
            last_provider_read_time: new Date().toISOString(), // Use current time in ISO format
        })
        .eq('thread_id', thread_id);

    if (error) {
        console.log(
            'Error in updating thread column: last_provider_read_time',
            error.message
        );
        return false;
    }

    return true;
}

/**
 * @author Nathan Cho
 * @param thread_id
 * @param requires_lead
 * @returns a boolean value true if successful, false if not successful.
 */
export async function updateRequiresLeadForThreadId(
    thread_id: number,
    requires_lead: boolean
): Promise<boolean> {
    const supabse = createSupabaseServiceClient();

    const { error } = await supabse
        .from('thread_escalations')
        .update({
            requires_lead: requires_lead,
        })
        .eq('thread_id', thread_id);

    if (error) {
        console.log('error in updating thread column: consider_complete ');
        return false;
    }

    return true;
}

export async function removeCurrentProviderfromProvidersListForThreadId(
    thread_id: number,
    user_id: string
): Promise<boolean> {
    const supabase = createSupabaseServiceClient();

    const { data, error: fetchError } = await supabase
        .from('thread_escalations')
        .select('providers')
        .eq('thread_id', thread_id)
        .single(); // Ensure we get a single row

    if (fetchError) {
        console.log(
            'Error in fetching current providers list:',
            fetchError.message
        );
        return false;
    }

    const updatedProviders = data.providers.filter(
        (provider: string) => provider !== user_id
    );

    const { error: updateError } = await supabase
        .from('thread_escalations')
        .update({ providers: updatedProviders })
        .eq('thread_id', thread_id);

    if (updateError) {
        console.log('error in updating thread column: providers ');
        return false;
    }

    return true;
}
