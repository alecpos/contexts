'use server';

import { Status } from '@/app/types/global/global-enumerators';
import { OrderType } from '@/app/types/orders/order-types';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { createSupabaseServiceClient } from '@/app/utils/clients/supabaseServerClient';
import { isEmpty } from 'lodash';

export async function getLastCoordinatorTask(userId: string) {
    const supabase = createSupabaseServiceClient();

    const { data: taskListData, error: taskListError } = await supabase
        .from('coordinator_tasks')
        .select('*')
        .eq('assigned_coordinator', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

    if (taskListError) {
        console.error(
            'getTaskList error - ',
            ' Error details: ',
            taskListError.message
        );
        return { data: null, status: Status.Error };
    }

    if (isEmpty(taskListData)) {
        return { data: null, status: Status.Success };
    }

    return {
        data: taskListData as CoordinatorTaskSupabaseRecord,
        status: Status.Success,
    };
}

export async function createCoordinatorTaskFromStatusTagData(
    status_tag_object: StatusTagObject,
    type: string,
    coordinator_id: string
) {
    const supabase = createSupabaseServiceClient();

    let isRenewalOrder: boolean;
    let status_order_id: number;

    console.log('status_tag_object: ', status_tag_object);

    if (
        typeof status_tag_object.order_id === 'string' &&
        status_tag_object.order_id.includes('-')
    ) {
        status_order_id = parseInt(status_tag_object.order_id.split('-')[0]);
        isRenewalOrder = true;
    } else {
        status_order_id = parseInt(status_tag_object.order_id);
        isRenewalOrder = false;
    }

    const task_object: Partial<CoordinatorTaskSupabaseRecord> = {
        original_created_at: status_tag_object.created_at,
        order_id: status_order_id,
        ...(isRenewalOrder
            ? { renewal_order_id: status_tag_object.order_id }
            : {}),
        completion_status: 'pending',
        assigned_coordinator: coordinator_id,
        type: type,
        environment: process.env.NEXT_PUBLIC_ENVIRONMENT!,
    };

    const { data, error } = await supabase
        .from('coordinator_tasks')
        .insert(task_object)
        .select('*')
        .limit(1)
        .maybeSingle();

    if (error) {
        console.error('createCoordinatorTaskFromStatusTagData error: ', error);
        return { status: Status.Error };
    }

    return { id: data.id, status: Status.Success };
}

export async function createTaskFromOrderOrRenewalData(
    orderType: OrderType,
    type: string,
    coordinator_id: string,
    order_data?: TaskOrderObject,
    renewal_data?: TaskRenewalObject
) {
    const supabase = createSupabaseServiceClient();

    if (orderType === OrderType.RenewalOrder && renewal_data) {
        const renewals_original_order_id = parseInt(
            renewal_data.renewal_order_id.split('-')[0]
        );

        const task_object: Partial<CoordinatorTaskSupabaseRecord> = {
            original_created_at:
                renewal_data.submission_time ?? new Date().toISOString(),
            order_id: renewals_original_order_id,
            renewal_order_id: renewal_data.renewal_order_id,
            completion_status: 'pending',
            assigned_coordinator: coordinator_id,
            type: type,
            environment: process.env.NEXT_PUBLIC_ENVIRONMENT!,
        };

        const { data, error } = await supabase
            .from('coordinator_tasks')
            .insert(task_object)
            .select('*')
            .limit(1)
            .maybeSingle();

        if (error) {
            console.error(
                'createTaskFromOrderOrRenewalData error: ',
                error.message
            );
        }

        return { id: data.id, status: Status.Success };
    } else if (orderType === OrderType.Order && order_data) {
        const task_object: Partial<CoordinatorTaskSupabaseRecord> = {
            original_created_at: order_data.created_at,
            order_id: order_data.order_id,
            renewal_order_id: undefined,
            completion_status: 'pending',
            assigned_coordinator: coordinator_id,
            type: type,
            environment: process.env.NEXT_PUBLIC_ENVIRONMENT!,
        };

        const { data, error } = await supabase
            .from('coordinator_tasks')
            .insert(task_object)
            .select('*')
            .limit(1)
            .maybeSingle();

        if (error) {
            console.error(
                'createTaskFromOrderOrRenewalData error: ',
                error.message
            );
        }

        return { id: data.id, status: Status.Success };
    }

    return { id: null, status: Status.Error };
}

export async function updateTaskCompletionStatus(
    task_id: string,
    new_status: CoordinatorTaskStatus
) {
    const supabase = createSupabaseServiceClient();

    const { error } = await supabase
        .from('coordinator_tasks')
        .update({ completion_status: new_status })
        .eq('id', task_id);

    if (error) {
        console.error(
            'updateTaskCompletionStatus: ',
            task_id,
            ' error msg: ',
            error.message
        );
        return { status: Status.Error };
    }
}

export async function getTaskOrderIdFromTaskId(taskId: string) {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('coordinator_tasks')
        .select('order_id, renewal_order_id')
        .eq('id', taskId)
        .limit(1)
        .maybeSingle();

    if (data?.renewal_order_id) {
        return data.renewal_order_id as string;
    }

    return data?.order_id as string;
}

export async function getTaskCompletionCount() {
    const supabase = createSupabaseServiceClient();

    const userId = (await readUserSession()).data.session?.user.id!;

    function getBeginningOfMonth(): string {
        const now = new Date();
        const beginningOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        return beginningOfMonth.toISOString();
    }
    const beginningOfMonth = getBeginningOfMonth();

    const { count, error } = await supabase
        .from('coordinator_tasks')
        .select('*', { count: 'exact', head: true })
        .eq('assigned_coordinator', userId)
        .eq('completion_status', 'completed')
        .eq('type', 'intake')
        .gt('created_at', beginningOfMonth);

    if (error) {
        console.error(error);
    }

    return count;
}

export async function getMessagingTaskCompletionCount() {
    const supabase = createSupabaseServiceClient();

    const userId = (await readUserSession()).data.session?.user.id!;

    function getBeginningOfMonth(): string {
        const now = new Date();
        const beginningOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        return beginningOfMonth.toISOString();
    }
    const beginningOfMonth = getBeginningOfMonth();

    const { count, error } = await supabase
        .from('coordinator_tasks')
        .select('*', { count: 'exact', head: true })
        .eq('assigned_coordinator', userId)
        .eq('completion_status', 'completed')
        .eq('type', 'message')
        .gt('created_at', beginningOfMonth);

    if (error) {
        console.error(error);
        return 0;
    }

    return count ?? 0;
}

export async function getTodaysTaskCompletionCount() {
    const supabase = createSupabaseServiceClient();

    function getMidnightOfPreviousDay(): string {
        const now = new Date();
        const previousDay = new Date(now);
        previousDay.setDate(now.getDate() - 1);
        previousDay.setHours(0, 0, 0, 0);
        return previousDay.toISOString();
    }

    const { count, error } = await supabase
        .from('coordinator_tasks')
        .select('*', { count: 'exact', head: true })
        .eq('completion_status', 'completed')
        .eq('environment', process.env.NEXT_PUBLIC_ENVIRONMENT!)
        .gte('created_at', getMidnightOfPreviousDay());

    return { data: count, status: Status.Success };
}

export async function reportTaskFailure(taskId: number) {
    const supabase = createSupabaseServiceClient();

    const { error } = await supabase
        .from('coordinator_tasks')
        .update({ reported_failure: true })
        .eq('id', taskId);

    if (error) {
        console.error('reportTaskFailure: task ID: ', taskId);
    }

    return;
}
