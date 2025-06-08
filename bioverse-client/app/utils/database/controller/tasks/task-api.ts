'use server';

import { Status } from '@/app/types/global/global-enumerators';
import { OrderType } from '@/app/types/orders/order-types';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { createSupabaseServiceClient } from '@/app/utils/clients/supabaseServerClient';
import { isEmpty } from 'lodash';

export async function getIncompleteTaskList(limit: number) {
    const supabase = createSupabaseServiceClient();

    const { data: taskListData, error: taskListError } = await supabase
        .from('provider_tasks')
        .select('*')
        .eq('completion_status', false)
        .order('created_at', { ascending: false })
        .limit(limit);

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
        data: taskListData as ProviderTaskSupabaseRecord[],
        status: Status.Success,
    };
}

export async function getExistingIntakeRenewalTaskList() {
    const supabase = createSupabaseServiceClient();

    const { data: taskListData, error: taskListError } = await supabase
        .from('provider_tasks')
        .select('order_id, renewal_order_id')
        .in('type', ['intake', 'renewal'])
        .order('created_at', { ascending: false })
        .limit(10);

    if (taskListError) {
        console.error('getExistingIntakeRenewalTaskList error ', taskListError);
    }

    return taskListData;
}

export async function getLastProviderTask(userId: string) {
    const supabase = createSupabaseServiceClient();

    const { data: taskListData, error: taskListError } = await supabase
        .from('provider_tasks')
        .select('*')
        .eq('assigned_provider', userId)
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
        data: taskListData as ProviderTaskSupabaseRecord,
        status: Status.Success,
    };
}

export async function getLastTwoProviderTasks(userId: string) {
    const supabase = createSupabaseServiceClient();

    const { data: taskListData, error: taskListError } = await supabase
        .from('provider_tasks')
        .select('*')
        .eq('assigned_provider', userId)
        .order('created_at', { ascending: false })
        .limit(2);

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
        data: taskListData as ProviderTaskSupabaseRecord[],
        status: Status.Success,
    };
}

enum TaskType {
    Urgent = 'urgent',
    Message = 'message',
    Intake = 'intake',
    Renewal = 'renewal',
}

export async function checkIfTaskAlreadyExists(
    taskType: TaskType,
    taskData: StatusTagObject | TaskOrderObject | TaskRenewalObject
): Promise<boolean> {
    const supabase = createSupabaseServiceClient();

    let orderId: string;
    if (isTaskOrderObject(taskData)) {
        orderId = taskData.order_id.toString();
    } else if (isTaskRenewalObject(taskData)) {
        orderId = taskData.original_order_id.toString();
    } else if (isStatusTagObject(taskData)) {
        orderId = taskData.id.toString();
    } else {
        orderId = (taskData as StatusTagObject).id.toString();
    }

    const { data, error } = await supabase
        .from('provider_tasks')
        .select('*')
        .eq('type', taskType)
        .gte('created_at', new Date(Date.now() - 5 * 60 * 1000).toISOString())
        .eq('order_id', orderId);

    return data ? true : false;
}

export async function createTaskFromStatusTagData(
    status_tag_object: StatusTagObject,
    type: string,
    provider_id: string
) {
    const supabase = createSupabaseServiceClient();

    let isRenewalOrder: boolean;
    let status_order_id: number;

    if (status_tag_object.order_id.includes('-')) {
        status_order_id = parseInt(status_tag_object.order_id.split('-')[0]);
        isRenewalOrder = true;
    } else {
        status_order_id = parseInt(status_tag_object.order_id);
        isRenewalOrder = false;
    }

    const task_object: Partial<ProviderTaskSupabaseRecord> = {
        original_created_at: status_tag_object.created_at,
        order_id: status_order_id,
        ...(isRenewalOrder
            ? { renewal_order_id: status_tag_object.order_id }
            : {}),
        completion_status: false,
        assigned_provider: provider_id,
        type: type,
        environment: process.env.NEXT_PUBLIC_ENVIRONMENT!,
    };

    const { data, error } = await supabase
        .from('provider_tasks')
        .insert(task_object)
        .select('*')
        .limit(1)
        .maybeSingle();

    if (error) {
        return { status: Status.Error };
    }

    return { id: data.id, status: Status.Success };
}

export async function createTaskFromOrderOrRenewalData(
    orderType: OrderType,
    type: string,
    provider_id: string,
    order_data?: TaskOrderObject,
    renewal_data?: TaskRenewalObject
) {
    const supabase = createSupabaseServiceClient();

    if (orderType === OrderType.RenewalOrder && renewal_data) {
        const renewals_original_order_id = parseInt(
            renewal_data.renewal_order_id.split('-')[0]
        );

        const task_object: Partial<ProviderTaskSupabaseRecord> = {
            original_created_at:
                renewal_data.submission_time ?? new Date().toISOString(),
            order_id: renewals_original_order_id,
            renewal_order_id: renewal_data.renewal_order_id,
            completion_status: false,
            assigned_provider: provider_id,
            type: type,
            environment: process.env.NEXT_PUBLIC_ENVIRONMENT!,
        };

        const { data, error } = await supabase
            .from('provider_tasks')
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
        const task_object: Partial<ProviderTaskSupabaseRecord> = {
            original_created_at: order_data.created_at,
            order_id: order_data.order_id,
            renewal_order_id: undefined,
            completion_status: false,
            assigned_provider: provider_id,
            type: type,
            environment: process.env.NEXT_PUBLIC_ENVIRONMENT!,
        };

        const { data, error } = await supabase
            .from('provider_tasks')
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
    new_status: boolean
) {
    const supabase = createSupabaseServiceClient();

    const { error } = await supabase
        .from('provider_tasks')
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
        .from('provider_tasks')
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
        .from('provider_tasks')
        .select('*', { count: 'exact', head: true })
        .eq('assigned_provider', userId)
        .eq('completion_status', true)
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
    // const userId = '28e2a459-2805-425f-96f3-a3d7f39c0528'; //Kristen Curcio

    function getBeginningOfMonth(): string {
        const now = new Date();
        const beginningOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        return beginningOfMonth.toISOString();
    }
    const beginningOfMonth = getBeginningOfMonth();

    const { count, error } = await supabase
        .from('provider_tasks')
        .select('*', { count: 'exact', head: true })
        .eq('assigned_provider', userId)
        .eq('completion_status', true)
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
        .from('provider_tasks')
        .select('*', { count: 'exact', head: true })
        .eq('completion_status', true)
        .eq('environment', process.env.NEXT_PUBLIC_ENVIRONMENT!)
        .gte('created_at', getMidnightOfPreviousDay());

    return { data: count, status: Status.Success };
}

export async function reportTaskFailure(taskId: number) {
    const supabase = createSupabaseServiceClient();

    const { error } = await supabase
        .from('provider_tasks')
        .update({ reported_failure: true })
        .eq('id', taskId);

    if (error) {
        console.error('reportTaskFailure: task ID: ', taskId);
    }

    return;
}

function isTaskOrderObject(obj: any): obj is TaskOrderObject {
    return 'order_id' in obj && typeof obj.order_id === 'number';
}

function isTaskRenewalObject(obj: any): obj is TaskRenewalObject {
    return 'renewal_order_id' in obj && 'original_order_id' in obj;
}

function isStatusTagObject(obj: any): obj is StatusTagObject {
    return 'id' in obj && 'status_tag' in obj && 'order_id' in obj;
}
