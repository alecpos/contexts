'use server';

import { BV_AUTH_TYPE } from '@/app/types/auth/authorization-types';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { createSupabaseServiceClient } from '@/app/utils/clients/supabaseServerClient';

// API For Tablename: provider_activity_audit
// Created on: 6.6.24
// Created by: Nathan Cho

type ProviderPayMap = {
    [key: string]: {
        intake: number;
        renewal: number;
        message: number;
    };
};

//used to show them their estimated earning in the current month in the task-action-info-bar
const PROVIDER_PAY_MAP: ProviderPayMap = {
    '2325cc51-8e98-4aff-9a16-0cd81096a5df': {
        // German Excheverry
        intake: 6,
        renewal: 6,
        message: 1,
    },
    '24138d35-e26f-4113-bcd9-7f275c4f9a47': {
        //Maylin Chen
        intake: 6,
        renewal: 6,
        message: 1,
    },
    '28e2a459-2805-425f-96f3-a3d7f39c0528': {
        //Kristin Curcio
        intake: 6,
        renewal: 6,
        message: 1,
    },
    '2c2ab5a1-9e0a-4213-acf7-8c3f5eee1bd7': {
        //Kaely Matthews
        intake: 6,
        renewal: 6,
        message: 1,
    },
    '3bc131b7-b978-4e21-8fbc-73809ee9fcce': {
        //Lea Thomas
        intake: 6,
        renewal: 6,
        message: 1,
    },
    '4412dafa-cccc-4539-a46f-f8f594f0ad21': {
        //Dave Biederman
        intake: 6,
        renewal: 6,
        message: 1,
    },
    '51da5013-ff39-4714-937b-c6c36dbf0c15': {
        //Bobby Desai
        intake: 6,
        renewal: 6,
        message: 1,
    },
    '7cf6a976-fce4-443e-be9c-f265adfb67e7': {
        //Kayla Doran
        intake: 6,
        renewal: 6,
        message: 1,
    },
    '84e3e542-6dba-4826-9e64-fab60ac64eed': {
        //Morgan Edwards
        intake: 6,
        renewal: 6,
        message: 1,
    },
    'b34211ca-fc99-4aac-a8eb-f7e3eebaeb9a': {
        //Michelle Igori
        intake: 4.9,
        renewal: 3.9,
        message: 0.9,
    },
    'c39ca73e-a750-4be1-a098-af7e6d72d508': {
        //Kathy Agiri
        intake: 6,
        renewal: 6,
        message: 1,
    },
    'd29331f6-fdca-4ea1-a0ad-28708425dd17': {
        //Emily McSparin
        intake: 6,
        renewal: 6,
        message: 1,
    },
    'da5b213d-7676-4792-bc73-11151d0da4e6': {
        //Amanda Little
        intake: 6,
        renewal: 6,
        message: 1,
    },
};

export async function createNewProviderActivityAudit(
    new_audit_data: ProviderActivityAuditCreateObject
): Promise<void> {
    const supabase = createSupabaseServiceClient();

    const { error } = await supabase
        .from('provider_activity_audit')
        .insert(new_audit_data);

    if (error) {
        console.error(
            'createNewProviderActivityAudit',
            error,
            `new audit data: ${new_audit_data}`
        );
    }
}

/**
 * DEPRECATED
 */
export async function getProviderCompletionCount() {
    const supabase = createSupabaseServiceClient();

    const userId = (await readUserSession()).data.session?.user.id!;

    function getBeginningOfMonth(): string {
        const now = new Date();
        const beginningOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        return beginningOfMonth.toISOString();
    }
    const beginningOfMonth = getBeginningOfMonth();

    const { count, error } = await supabase
        .from('provider_activity_audit')
        .select('*', { count: 'exact', head: true })
        .eq('provider_id', userId)
        .in('action', ['prescribe_intake', 'deny_intake'])
        .gt('created_at', beginningOfMonth);

    if (error) {
        console.error(error);
    }

    return count;
}

/**
 *
 * @param providerId
 * @param start_date MM-DD-YYYY string
 * @param end_date MM-DD-YYYY string
 * @returns
 */
export async function getProviderIntakeRenewalCompletionCountBetweenDates(
    providerId: string,
    start_date: string,
    end_date: string
) {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase.rpc(
        'get_provider_intake_renewal_completion_count_with_dates',
        {
            provider_id_arg: providerId,
            start_date_: start_date,
            end_date_: end_date,
        }
    );

    if (error) {
        console.error(error);
        return null;
    }

    return data;
}

export async function getProviderEstimatedPaymentBetweenDatesV2Verbose(
    providerId: string,
    start_date: number,
    end_date: number
) {
    const supabase = createSupabaseServiceClient();

    //1. new order approval/denial
    const { count: providerIntakesHandled1, error: intakesHandledError1 } =
        await supabase
            .from('provider_activity_audit')
            .select('*', { count: 'exact', head: true })
            .eq('provider_id', providerId)
            .in('action', ['prescribe_intake', 'deny_intake'])
            .is('renewal_order_id', null)
            .gt('timestamp', start_date)
            .lt('timestamp', end_date);

    //2. Curexa intakes handled (separate from above because of dosespot)
    const { count: providerIntakesHandled2, error: intakesHandledError2 } =
        await supabase
            .from('provider_activity_audit')
            .select('*', { count: 'exact', head: true })
            .eq('provider_id', providerId)
            .in('action', ['approve_intake'])
            .is('renewal_order_id', null)
            .gt('timestamp', start_date)
            .lt('timestamp', end_date);

    //3. renewal order approval/denial
    const { count: providerRenewalsHandled, error: renewalsHandledError } =
        await supabase
            .from('provider_activity_audit')
            .select('*', { count: 'exact', head: true })
            .eq('provider_id', providerId)
            .in('action', ['prescribe_intake', 'deny_intake']) //make sure it's final-review?
            .not('renewal_order_id', 'is', null)
            .gt('timestamp', start_date)
            .lt('timestamp', end_date);

    //4. monthly checkins handled
    const { count: providerCheckinsHandled1, error: checkinsHandledError1 } =
        await supabase
            .from('provider_activity_audit')
            .select('*', { count: 'exact', head: true })
            .eq('provider_id', providerId)
            .in('action', ['tag_intake'])
            .eq('metadata->>previous_status_tag', 'ReviewNoPrescribe')
            .eq('metadata->>new_status_tag', 'Resolved')
            .not('renewal_order_id', 'is', null)
            .gt('timestamp', start_date)
            .lt('timestamp', end_date);

    //4. overdue monthly checkins handled
    const { count: providerCheckinsHandled2, error: checkinsHandledError2 } =
        await supabase
            .from('provider_activity_audit')
            .select('*', { count: 'exact', head: true })
            .eq('provider_id', providerId)
            .in('action', ['tag_intake'])
            .eq('metadata->>previous_status_tag', 'OverdueNoPrescribe')
            .eq('metadata->>new_status_tag', 'Resolved')
            .gt('timestamp', start_date)
            .lt('timestamp', end_date);

    //5. Review status tags on renewal orders (monthly checkin)
    const { count: providerCheckinsHandled3, error: checkinsHandledError3 } =
        await supabase
            .from('provider_activity_audit')
            .select('*', { count: 'exact', head: true })
            .eq('provider_id', providerId)
            .in('action', ['tag_intake'])
            .eq('metadata->>previous_status_tag', 'Review')
            .eq('metadata->>new_status_tag', 'Resolved')
            .gt('timestamp', start_date)
            .lt('timestamp', end_date)
            .not('renewal_order_id', 'is', null);

    //6. Overdue monthly checkin x 2
    const { count: providerCheckinsHandled4, error: checkinsHandledError4 } =
        await supabase
            .from('provider_activity_audit')
            .select('*', { count: 'exact', head: true })
            .eq('provider_id', providerId)
            .in('action', ['tag_intake'])
            .eq('metadata->>previous_status_tag', 'Overdue')
            .eq('metadata->>new_status_tag', 'Resolved')
            .not('renewal_order_id', 'is', null)
            .gt('timestamp', start_date)
            .lt('timestamp', end_date);

    let providerIntakesHandled = 0;
    if (providerIntakesHandled1) {
        providerIntakesHandled += providerIntakesHandled1;
    }
    if (providerIntakesHandled2) {
        providerIntakesHandled += providerIntakesHandled2;
    }

    let providerCheckinsHandled = 0;
    if (providerCheckinsHandled1) {
        providerCheckinsHandled += providerCheckinsHandled1;
    }
    if (providerCheckinsHandled2) {
        providerCheckinsHandled += providerCheckinsHandled2;
    }
    if (providerCheckinsHandled3) {
        providerCheckinsHandled += providerCheckinsHandled3;
    }
    if (providerCheckinsHandled4) {
        providerCheckinsHandled += providerCheckinsHandled4;
    }

    //5. Look for all provider_activity_audit message sent where the previous status tag was ProviderMessage
    const { count: providerMessagesAnswered, error: messagesAnsweredError } =
        await supabase
            .from('provider_activity_audit')
            .select('*', { count: 'exact', head: true })
            .eq('provider_id', providerId)
            .in('action', ['message_intake'])
            .eq('metadata->>current_status_tag', 'ProviderMessage')
            .neq('metadata->>last_message_sender', providerId) //don't count sent messages where the provider is the last message sender
            .gt('timestamp', start_date)
            .lt('timestamp', end_date);

    const payRates = PROVIDER_PAY_MAP[providerId] || {
        intake: 0,
        renewal: 0,
        message: 0,
    };

    const intakesHandled = providerIntakesHandled
        ? providerIntakesHandled * payRates.intake
        : 0;
    const renewalsHandled = providerRenewalsHandled
        ? providerRenewalsHandled * payRates.renewal
        : 0;
    const checkinsHandled = providerCheckinsHandled
        ? providerCheckinsHandled * payRates.renewal
        : 0;
    const messagesAnswered = providerMessagesAnswered
        ? providerMessagesAnswered * payRates.message
        : 0;

    return {
        intakesHandled,
        renewalsHandled,
        checkinsHandled,
        messagesAnswered,
        totalPayInPeriod:
            intakesHandled +
            messagesAnswered +
            renewalsHandled +
            checkinsHandled,
    };
}

export async function getProviderActivityAuditCountsBetweenDates(
    providerId: string,
    start_date: number,
    end_date: number
) {
    const supabase = createSupabaseServiceClient();

    //1. new order approval/denial
    const { count: providerIntakesHandled, error: intakesHandledError } =
        await supabase
            .from('provider_activity_audit')
            .select('*', { count: 'exact', head: true })
            .eq('provider_id', providerId)
            .in('action', ['prescribe_intake', 'deny_intake', 'approve_intake'])
            .is('renewal_order_id', null)
            .gt('timestamp', start_date)
            .lt('timestamp', end_date);

    //2. renewal order approval/denial
    const { count: providerRenewalsHandled, error: renewalsHandledError } =
        await supabase
            .from('provider_activity_audit')
            .select('*', { count: 'exact', head: true })
            .eq('provider_id', providerId)
            .in('action', ['prescribe_intake', 'deny_intake'])
            .not('renewal_order_id', 'is', null)
            .gt('timestamp', start_date)
            .lt('timestamp', end_date);

    //3. monthly checkins handled
    const { count: providerCheckinsHandled1, error: checkinsHandledError1 } =
        await supabase
            .from('provider_activity_audit')
            .select('*', { count: 'exact', head: true })
            .eq('provider_id', providerId)
            .in('action', ['tag_intake'])
            .eq('metadata->>previous_status_tag', 'ReviewNoPrescribe')
            .eq('metadata->>new_status_tag', 'Resolved')
            .gt('timestamp', start_date)
            .lt('timestamp', end_date);

    //4. overdue monthly checkins handled
    const { count: providerCheckinsHandled2, error: checkinsHandledError2 } =
        await supabase
            .from('provider_activity_audit')
            .select('*', { count: 'exact', head: true })
            .eq('provider_id', providerId)
            .in('action', ['tag_intake'])
            .eq('metadata->>previous_status_tag', 'OverdueNoPrescribe')
            .eq('metadata->>new_status_tag', 'Resolved')
            .gt('timestamp', start_date)
            .lt('timestamp', end_date);

    const { count: providerCheckinsHandled3, error: checkinsHandledError3 } =
        await supabase
            .from('provider_activity_audit')
            .select('*', { count: 'exact', head: true })
            .eq('provider_id', providerId)
            .in('action', ['tag_intake'])
            .eq('metadata->>previous_status_tag', 'Review')
            .eq('metadata->>new_status_tag', 'Resolved')
            .gt('timestamp', start_date)
            .lt('timestamp', end_date)
            .not('renewal_order_id', 'is', null);

    const { count: providerCheckinsHandled4, error: checkinsHandledError4 } =
        await supabase
            .from('provider_activity_audit')
            .select('*', { count: 'exact', head: true })
            .eq('provider_id', providerId)
            .in('action', ['tag_intake'])
            .eq('metadata->>previous_status_tag', 'Overdue')
            .eq('metadata->>new_status_tag', 'Resolved')
            .gt('timestamp', start_date)
            .lt('timestamp', end_date)
            .not('renewal_order_id', 'is', null);

    //handling the final checkin in a renewal period where the dosage selection link is sent: 
    const { count: providerCheckinsHandled5, error: checkinsHandledError5 } =
        await supabase
            .from('provider_activity_audit')
            .select('*', { count: 'exact', head: true })
            .eq('provider_id', providerId)
            .in('action', ['tag_intake'])
            .eq('metadata->>previous_status_tag', 'FinalReview')
            .eq('metadata->>new_status_tag', 'Resolved')
            .gt('timestamp', start_date)
            .lt('timestamp', end_date)
            .not('renewal_order_id', 'is', null);

    let providerCheckinsHandled = 0;
    if (providerCheckinsHandled1) {
        providerCheckinsHandled += providerCheckinsHandled1;
    }
    if (providerCheckinsHandled2) {
        providerCheckinsHandled += providerCheckinsHandled2;
    }
    if (providerCheckinsHandled3) {
        providerCheckinsHandled += providerCheckinsHandled3;
    }
    if (providerCheckinsHandled4) {
        providerCheckinsHandled += providerCheckinsHandled4;
    }
    if (providerCheckinsHandled5) {
        providerCheckinsHandled += providerCheckinsHandled5;
    }

    //5. Look for all provider_activity_audit message sent where the previous status tag was ProviderMessage
    const { count: providerMessagesAnswered, error: messagesAnsweredError } =
        await supabase
            .from('provider_activity_audit')
            .select('*', { count: 'exact', head: true })
            .eq('provider_id', providerId)
            .in('action', ['message_intake'])
            .in('metadata->>current_status_tag', [
                'ProviderMessage',
                'LeadProviderAwaitingResponse',
                'ReadPatientMessage',
                'UrgentRequiresProvider'
            ])
            .neq('metadata->>last_message_sender', providerId) //don't count sent messages where the provider is the last message sender
            .gt('timestamp', start_date)
            .lt('timestamp', end_date);

    //6. Look at all situations where a provider tags an order as "provider awaiting response" - this will count "clarification question messages"
    const { count: providerAwaitingResponse, error: awaitingResponseError } =
        await supabase
            .from('provider_activity_audit')
            .select('*', { count: 'exact', head: true })
            .eq('provider_id', providerId)
            .in('action', ['tag_intake'])
            .in('metadata->>previous_status_tag', [
                'Review', 
                'ReviewNoPrescribe',
                'FinalReview'
            ])
            .eq('metadata->>new_status_tag', 'Provider Awaiting Response')
            .gt('timestamp', start_date)
            .lt('timestamp', end_date);

    let providerMessages = 0;
    if (providerMessagesAnswered) {
        providerMessages += providerMessagesAnswered;
    }
    if (providerAwaitingResponse) {
        providerMessages += providerAwaitingResponse;
    }

    // console.log('providerIntakesHandled', providerIntakesHandled);
    // console.log('providerRenewalsHandled', providerRenewalsHandled);
    // console.log('providerCheckinsHandled', providerCheckinsHandled);
    // console.log('providerMessages1: ', providerMessagesAnswered);
    // console.log('providerMessages2: ', providerAwaitingResponse);
    return {
        providerIntakesHandled,
        providerRenewalsHandled,
        providerCheckinsHandled,
        providerMessages,
    };
}

export async function getProviderHistoryAuditDetails(provider_id: string) {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase.rpc(
        'get_provider_history_with_profile',
        {
            input_provider_id: provider_id,
        }
    );

    if (error) {
        console.error(error);
        return null;
    }

    return data;
}

/**
 *
 * @param providerId
 * @param start_date MM-DD-YYYY string
 * @param end_date MM-DD-YYYY string
 * @returns
 */
export async function getRenewalCheckInCompletionCount(
    providerId: string,
    start_date: string,
    end_date: string
) {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase.rpc(
        'get_provider_check_in_completion_count_with_dates',
        {
            provider_id_: providerId,
            start_date_: start_date,
            end_date_: end_date,
        }
    );

    if (error) {
        console.error(error);
        return null;
    }

    return data;
}

/**
 * Adds a new record to the provider audit for end_session at the endTime epoch timestamp or if not provided, the current timestamp.
 * @param provider_id
 */
export async function endSession(provider_id: string, endTime?: number) {
    const supabase = createSupabaseServiceClient();

    const endSessionAuditRecord = {
        provider_id: provider_id,
        action: 'end_session',
        timestamp: endTime ? endTime : new Date().getTime(),
        environment: process.env.NEXT_PUBLIC_ENVIRONMENT,
        ...(endTime
            ? { metadata: { source: 'automatic' } }
            : { metadata: { source: 'manual' } }),
    };

    const stream = await getProviderSessionRecord(provider_id);
    if (!stream) {
        return;
    }

    if (stream[0]?.action === 'end_session') {
        return;
    }

    const { error } = await supabase
        .from('provider_activity_audit')
        .insert(endSessionAuditRecord);

    if (error) {
        console.error('End session error: ', error);
    }
}

/**
 * Gets the list of records. Returns either 1 record with end_session
 * OR an array with records where the last item is start_session and the previous items are records that happen chronoligically in reverse
 * @param provider_id
 * @returns
 */
async function getProviderSessionRecord(
    provider_id: string
): Promise<Partial<ProviderActivityAuditRecord[]>> {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase.rpc(
        // 'get_all_orders_for_provider_dashboard',
        'check_provider_session_log',
        {
            provider_id_: provider_id,
        }
    );

    return data;
}

export async function getProviderIntakeProcessedCount(
    start_date: Date,
    end_date: Date
) {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase.rpc('get_intake_processed_count', {
        start_date: start_date,
        end_date: end_date,
    });

    if (error) {
        console.error('getProviderIntakeProcessedCount error ', error);
    }

    return data;
}

export async function getProviderRenewalProcessedCount(
    start_date: Date,
    end_date: Date
) {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase.rpc('get_renewal_processed_count', {
        start_date: start_date,
        end_date: end_date,
    });

    if (error) {
        console.error('getProviderRenewalProcessedCount error ', error);
    }

    return data;
}

export async function getProviderMessageProcessedCount(
    start_date: Date,
    end_date: Date
) {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase.rpc('get_messages_processed_count', {
        start_date: start_date,
        end_date: end_date,
    });

    if (error) {
        console.error('get_messages_processed_count error ', error);
    }

    return data;
}

export async function getAverageIntakeProcessingTime(
    start_date: Date,
    end_date: Date
) {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase.rpc(
        'get_average_intake_processing_time',
        {
            start_date: start_date,
            end_date: end_date,
        }
    );

    if (error) {
        console.error('getAverageIntakeProcessingTime error ', error);
    }

    return data;
}

export async function getAverageRenewalProcessingTime(
    start_date: Date,
    end_date: Date
) {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase.rpc(
        'get_average_renewal_processing_time',
        {
            start_date: start_date,
            end_date: end_date,
        }
    );

    if (error) {
        console.error('getAverageRenewalProcessingTime error ', error);
    }

    return data;
}

/**
 * createEmployeeLogoutAudit
 * @param provider_id
 * @param customLogoutTime
 * @param metadata
 * @returns void
 *
 * Creates a new logout audit record for the employee with the current time or a custom logout time if provided.
 *
 */
export async function createEmployeeLogoutAudit(
    employeeId: string,
    customLogoutTime?: number,
    metadata?: any,
    employeeRole?: BV_AUTH_TYPE
) {
    let auditTable: string;
    let idColumn: string;
    if (
        employeeRole === BV_AUTH_TYPE.PROVIDER ||
        employeeRole === BV_AUTH_TYPE.LEAD_PROVIDER ||
        employeeRole === BV_AUTH_TYPE.ADMIN ||
        employeeRole === BV_AUTH_TYPE.REGISTERED_NURSE
    ) {
        auditTable = 'provider_activity_audit';
        idColumn = 'provider_id';
    } else {
        auditTable = 'coordinator_activity_audit';
        idColumn = 'coordinator_id';
    }

    if (employeeId === '6d920c41-4fa8-46c6-94f9-c97e6e3c5219') {
        //Lara is an admin, but we want to log her to coordinator audit table
        auditTable = 'coordinator_activity_audit';
        idColumn = 'coordinator_id';
    }

    const supabase = createSupabaseServiceClient();

    if (!customLogoutTime) {
        //if no custom logout time is provided, we will create a new logout audit record right after the last action they took
        let logOutTime = new Date().getTime();

        const { data: recentAction, error: recentActionError } = await supabase
            .from(auditTable)
            .select('*')
            .eq(idColumn, employeeId)
            .order('timestamp', { ascending: false })
            .limit(1)
            .single();

        if (recentActionError) {
            console.error('Error fetching recent action:', recentActionError);
        } else {
            if (recentAction.action !== 'logged_out') {
                logOutTime = recentAction.timestamp + 1; //make the logout time right after the last action they took
            }
        }

        const employeeLoggedOutAuditRecord = {
            [idColumn]: employeeId,
            action: 'logged_out',
            timestamp: logOutTime,
            environment: process.env.NEXT_PUBLIC_ENVIRONMENT,
            metadata: metadata,
        };

        const { error } = await supabase
            .from(auditTable)
            .insert(employeeLoggedOutAuditRecord);

        return;
    } else {
        // console.log("creating a new logout audit record with custom logout time: ", customLogoutTime);

        const employeeLoggedOutAuditRecord = {
            [idColumn]: employeeId,
            action: 'logged_out',
            timestamp: customLogoutTime,
            environment: process.env.NEXT_PUBLIC_ENVIRONMENT,
            metadata: metadata,
        };

        const { error } = await supabase
            .from(auditTable)
            .insert(employeeLoggedOutAuditRecord);

        return;
    }
}

/**
 * createEmployeeLoginAudit
 * @param provider_id
 * @returns void
 *
 * Checks if the most recent auth action (logged_in or logged_out) was a logged_in. If it was, that means they never logged out of their last session.
 * In that case, we just create a logout audit for them right after the last action they took.
 * Then we go ahead and create the new login audit.
 *
 * If their most recent auth action (logged_in or logged_out) was a logged_out, we just create a new login audit for them with the current time.
 *
 */
export async function createEmployeeLoginAudit(
    employeeId: string,
    employeeRole: BV_AUTH_TYPE
) {
    let auditTableToUpdate: string;
    let idColumn: string;
    if (
        employeeRole === BV_AUTH_TYPE.PROVIDER ||
        employeeRole === BV_AUTH_TYPE.LEAD_PROVIDER ||
        employeeRole === BV_AUTH_TYPE.REGISTERED_NURSE ||
        employeeRole === BV_AUTH_TYPE.ADMIN
    ) {
        auditTableToUpdate = 'provider_activity_audit';
        idColumn = 'provider_id';
    } else {
        auditTableToUpdate = 'coordinator_activity_audit';
        idColumn = 'coordinator_id';
    }

    if (employeeId === '6d920c41-4fa8-46c6-94f9-c97e6e3c5219') {
        //Lara is an admin, but we want to log her to coordinator audit table
        auditTableToUpdate = 'coordinator_activity_audit';
        idColumn = 'coordinator_id';
    }

    const supabase = createSupabaseServiceClient();

    const { data: recentAuthAction, error: recentActionError } = await supabase
        .from(auditTableToUpdate)
        .select('*')
        .eq(idColumn, employeeId)
        .in('action', ['logged_in', 'logged_out'])
        .order('timestamp', { ascending: false })
        .limit(1)
        .single();

    // console.log("recentAuthAction: ", recentAuthAction);

    if (recentActionError) {
        //if the error is that there are no records, the code will just skip down to creating the new login audit
        console.error('Error fetching recent action:', recentActionError);
    } else if (recentAuthAction && recentAuthAction.action === 'logged_in') {
        //if their most recent auth action was logging in, we will create a logout audit for them right after the last action they took
        const { data: recentAction, error: recentActionError } = await supabase
            .from(auditTableToUpdate)
            .select('*')
            .eq(idColumn, employeeId)
            .order('timestamp', { ascending: false })
            .limit(1)
            .single();

        //could first check if the most recent action in general was taken was less than 10 minutes ago
        //if it was, we could just return...we wouldn't create the login/logout audit,
        //since their most recent auth action was logged_in, so they'll just continue that session!
        // if (recentAction.timestamp > new Date().getTime() - 10 * 60 * 1000) {
        //     return;
        // }

        await createEmployeeLogoutAudit(
            employeeId,
            recentAction.timestamp + 1,
            { source: 'automatic' },
            employeeRole
        );
    }

    //create the new login audit record
    const employeeLoggedInAuditRecord = {
        [idColumn]: employeeId,
        action: 'logged_in',
        timestamp: new Date().getTime(),
        environment: process.env.NEXT_PUBLIC_ENVIRONMENT,
    };

    const { error } = await supabase
        .from(auditTableToUpdate)
        .insert(employeeLoggedInAuditRecord);

    //log the error to Nathan's log
}
