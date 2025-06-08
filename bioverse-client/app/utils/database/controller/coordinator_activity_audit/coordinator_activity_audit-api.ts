'use server';

import { Status } from '@/app/types/global/global-enumerators';
import { createSupabaseServiceClient } from '@/app/utils/clients/supabaseServerClient';
import { getAllOrdersForCoordinatorOrderTable } from '../orders/orders-api';
import { getAllRenewalOrdersForCoordinatorOrderTable } from '../renewal_orders/renewal_orders';

export async function createNewCoordinatorActivityAudit(
    new_audit_data: CoordinatorActivityAuditCreateObject
): Promise<Status> {
    const supabase = createSupabaseServiceClient();

    console.log(
        'new_audit_data in createNewCoordinatorActivityAudit',
        new_audit_data
    );

    const { error } = await supabase
        .from('coordinator_activity_audit')
        .insert(new_audit_data);

    if (error) {
        console.error(
            'createNewCoordinatorActivityAudit',
            error,
            `new audit data: ${new_audit_data}`
        );

        return Status.Error;
    }

    return Status.Success;
}

export type Coordinator = {
    authorization: string;
    display_name: string;
    id: string;
};

export type AuditedCoordinator = {
    authorization: string;
    display_name: string;
    id: string;
    messages_sent: number;
    thread_views: number;
    status_tag_updates: number;
    messages_answered: number;
};

/**
 * Gets the list of records. Returns either 1 record with end_session
 * OR an array with records where the last item is start_session and the previous items are records that happen chronoligically in reverse
 * @param coordinator_id
 * @returns
 */
export async function getCoordinatorSessionRecord(
    coordinator_id: string
): Promise<Partial<CoordinatorActivityAuditRecord[]>> {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase.rpc(
        'check_coordinator_session_log',
        {
            coordinator_id_: coordinator_id,
        }
    );

    return data;
}

export async function getPendingCoordinatorTasksCount(): Promise<
    Partial<number | null>
> {
    const supabase = createSupabaseServiceClient();

    const { count: pendingCount } = await supabase
        .from('coordinator_tasks')
        .select('*', { count: 'exact', head: true })
        .eq('completion_status', 'pending');

    return pendingCount;
}

export async function getCompletedCoordinatorTasksCount(
    coordinator_id: string,
    start_date: Date,
    end_date: Date
): Promise<Partial<number | null>> {
    const supabase = createSupabaseServiceClient();

    const { count: completedCount } = await supabase
        .from('coordinator_tasks')
        .select('*', { count: 'exact', head: true })
        .eq('completion_status', 'completed')
        .eq('assigned_coordinator', coordinator_id)
        .gte('created_at', start_date)
        .lte('created_at', end_date);

    return completedCount ?? 0;
}

export async function getCompletedForwardedTasksCount(
    coordinator_id: string,
    start_date: Date,
    end_date: Date
): Promise<Partial<number | null>> {
    const supabase = createSupabaseServiceClient();

    const { count: forwardedCount } = await supabase
        .from('coordinator_tasks')
        .select('*', { count: 'exact', head: true })
        .eq('completion_status', 'forwarded')
        .eq('assigned_coordinator', coordinator_id)
        .gte('created_at', start_date)
        .lte('created_at', end_date);

    return forwardedCount ?? 0;
}

export async function getMessagesOverdueCount(): Promise<
    Partial<number | null>
> {
    const supabase = createSupabaseServiceClient();

    const { count: messagesOverdueCount } = await supabase
        .from('patient_status_tags')
        .select('*', { count: 'exact', head: true })
        .eq('status_tag', 'Overdue');

    return messagesOverdueCount;
}

export async function getCoordinatorAutomaticSessionTimes(
    coordinator_id: string,
    start_date: Date,
    end_date: Date
) {
    const supabase = createSupabaseServiceClient();

    const start_date_epoch = start_date.getTime();
    const end_date_epoch = end_date.getTime();

    const { data, error } = await supabase.rpc(
        'get_coordinator_automatic_session_times',
        {
            coordinator_id_: coordinator_id,
            start_date: start_date_epoch,
            end_date: end_date_epoch,
        }
    );

    const filteredData = data.filter((item: any) => item.session_time > 0.01);

    if (error) {
        console.error('getHoursLoggedByCoordinator', error);
    }

    return filteredData;
}

/**
 * Creates a new session_start record in coordinator audit with current timestamp
 * @param coordinator_id
 */
export async function startNewSession(coordinator_id: string) {
    const supabase = createSupabaseServiceClient();

    const startSessionAuditRecord = {
        coordinator_id: coordinator_id,
        action: 'start_session',
        timestamp: new Date().getTime(),
        environment: process.env.NEXT_PUBLIC_ENVIRONMENT,
    };

    const { data, error } = await supabase
        .from('coordinator_activity_audit')
        .insert(startSessionAuditRecord);

    console.log('data: =>', data);

    if (error) {
        console.error('End session error: ', error);
    }
}

/**
 * Adds a new record to the coordinator audit for end_session at the endTime epoch timestamp or if not provided, the current timestamp.
 * @param coordinator_id
 */
export async function endSession(coordinator_id: string, endTime?: number) {
    const supabase = createSupabaseServiceClient();

    const endSessionAuditRecord = {
        coordinator_id,
        action: 'end_session',
        timestamp: endTime ? endTime : new Date().getTime(),
        environment: process.env.NEXT_PUBLIC_ENVIRONMENT,
        ...(endTime
            ? { metadata: { source: 'automatic' } }
            : { metadata: { source: 'manual' } }),
    };

    const stream = await getCoordinatorSessionRecord(coordinator_id);

    if (!stream) {
        return;
    }

    if (stream[0]?.action === 'end_session') {
        return;
    }

    const { error } = await supabase
        .from('coordinator_activity_audit')
        .insert(endSessionAuditRecord);

    if (error) {
        console.error('End session error: ', error);
    }
}

export async function getAllAuditedCoordinators(): Promise<
    AuditedCoordinator[]
> {
    const supabase = createSupabaseServiceClient();

    const { data: coordinators, error: coordinatorError } = await supabase
        .from('employees')
        .select('authorization, display_name, id')
        .in('authorization', ['coordinator', 'lead-coordinator', 'admin']);

    if (coordinatorError) {
        console.error(
            'getAllAuditedCoordinators - coordinators',
            coordinatorError
        );
        return [];
    }

    if (!coordinators) {
        return [];
    }

    const auditedCoordinators = await Promise.all(
        coordinators.map(async (coordinator) => {
            const { id } = coordinator;

            const { count: messageSentCount, error: messageError } =
                await supabase
                    .from('coordinator_activity_audit')
                    .select('id', { count: 'exact', head: true })
                    .eq('coordinator_id', id)
                    .eq('action', 'message_thread');

            const { count: threadViewedCount, error: threadError } =
                await supabase
                    .from('coordinator_activity_audit')
                    .select('id', { count: 'exact', head: true })
                    .eq('coordinator_id', id)
                    .eq('action', 'view_thread');

            const { data: statusTagUpdates, error: statusUpdatesError } =
                await supabase
                    .from('coordinator_activity_audit')
                    .select('id, metadata')
                    .eq('coordinator_id', id)
                    .eq('action', 'tag_order');

            const statusTagUpdateCount = statusTagUpdates
                ? statusTagUpdates.length
                : 0;

            //count the number of messages 'answered' by the coordinator
            let messagesAnsweredCount = 0;
            if (statusTagUpdates) {
                messagesAnsweredCount = statusTagUpdates.reduce(
                    (acc, update) => {
                        if (
                            update.metadata.previous_status_tag ===
                                'Coordinator' ||
                            update.metadata.previous_status_tag === 'ID/Docs' ||
                            update.metadata.previous_status_tag === 'Follow Up'
                        ) {
                            acc++;
                        }
                        return acc;
                    },
                    0
                );
            }

            if (messageError || threadError || statusUpdatesError) {
                console.error('getAllAuditedCoordinators - activity counts', {
                    messageError,
                    threadError,
                    statusUpdatesError,
                });
            }

            return {
                authorization: coordinator.authorization,
                display_name: coordinator.display_name,
                id: coordinator.id,
                messages_sent: messageSentCount || 0,
                thread_views: threadViewedCount || 0,
                status_tag_updates: statusTagUpdateCount || 0,
                messages_answered: messagesAnsweredCount || 0,
            };
        })
    );

    return auditedCoordinators;
}

export async function getCoordinatorProcessedTagCountFromDateRange(
    start_date: Date,
    end_date: Date
) {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase.rpc(
        'get_coordinator_processed_tag_count',
        {
            start_date: start_date,
            end_date: end_date,
        }
    );

    if (error) {
        console.error('getCoordinatorProcessedTagCountFromDateRange', error);
    }

    return data;
}

export async function getCoordinatorDashboardCount() {
    const { data: completeOrderData, error: orderError } =
        await getAllOrdersForCoordinatorOrderTable();

    const renewalOrderData =
        await getAllRenewalOrdersForCoordinatorOrderTable();

    const count = completeOrderData.length + renewalOrderData.length;

    return count;
}

export async function getCoordinatorActivityAuditCountsBetweenDates(
    coordinatorId: string,
    start_date: number,
    end_date: number
) {
    const supabase = createSupabaseServiceClient();

    const { count: coordinatorMessagesAnswered, error: messagesAnsweredError } =
        await supabase
            .from('coordinator_activity_audit')
            .select('*', { count: 'exact', head: true })
            .eq('coordinator_id', coordinatorId)
            .in('action', ['message_thread'])
            // .eq('metadata->>current_status_tag', 'ProviderMessage')
            .neq('metadata->>last_message_sender', coordinatorId)
            .gt('timestamp', start_date)
            .lt('timestamp', end_date);

    const { count: completedTasks, error: completedError } = await supabase
        .from('coordinator_tasks')
        .select('*', { count: 'exact', head: true })
        .eq('assigned_coordinator', coordinatorId)
        .eq('completion_status', 'completed')
        .gt('created_at', start_date)
        .lt('created_at', end_date);

    const { count: forwardedTasks, error: forwardedError } = await supabase
        .from('coordinator_tasks')
        .select('*', { count: 'exact', head: true })
        .eq('assigned_coordinator', coordinatorId)
        .eq('completion_status', 'forwarded')
        .gt('created_at', start_date)
        .lt('created_at', end_date);

    const totalTasks = (completedTasks || 0) + (forwardedTasks || 0);
    const forwardPercentage =
        totalTasks > 0
            ? (((forwardedTasks || 0) / totalTasks) * 100).toFixed(1)
            : undefined;

    return {
        coordinatorMessagesAnswered,
        forwardPercentage,
    };
}
