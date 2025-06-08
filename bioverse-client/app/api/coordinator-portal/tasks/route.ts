import { BV_AUTH_TYPE } from '@/app/types/auth/authorization-types';
import { StatusTag } from '@/app/types/status-tags/status-types';
import { getEmployeeAuthorization } from '@/app/utils/database/controller/employees/employees-api';
import {
    createCoordinatorTaskFromStatusTagData,
    getLastCoordinatorTask,
} from '@/app/utils/database/controller/coordinator_tasks/coordinator-task-api';
import { getCoordinatorTaskByStatusTagArray } from '@/app/utils/database/controller/patient-status-tags/patient-status-tags-api';
import { isNull } from 'lodash';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const requestData = await req.json();
    const userId = requestData.userId;

    let taskItemId;

    try {
        taskItemId = await getNextCoordinatorTask(userId);
    } catch (error) {
        console.error('Error getting next coordinator task: ', error);
        return new NextResponse(JSON.stringify({ taskItemId: null }), {
            status: 500,
        });
    }

    if (taskItemId) {
        return new NextResponse(
            JSON.stringify({
                taskItemId: taskItemId,
            }),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
    }

    return new NextResponse(
        JSON.stringify({
            taskItemId: null,
        }),
        {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        }
    );
}

async function getNextCoordinatorTask(userId: string): Promise<number | null> {
    const employeeAuthorization = await getEmployeeAuthorization(userId);

    let environment_override = false;

    //If we cannot find the authorization we return null
    if (!employeeAuthorization) {
        return null;
    }

    // If auth type is ADMIN or PROVIDER+ and environment is prod, this will return null
    // since ADMIN is not LEAD_PROVIDER or COORDINATOR
    // If auth type is LEAD_PROVIDER, this if block is skipped since the first condition is false,
    // allowing the code to continue executing
    if (userId !== '4122d7b8-fd9f-4605-a3e7-796b8be75fda') {
        //hardcoded to allow daniel to go through coordiantor queue for now.
        if (
            employeeAuthorization !== BV_AUTH_TYPE.LEAD_PROVIDER &&
            employeeAuthorization !== BV_AUTH_TYPE.COORDINATOR
        ) {
            if (process.env.NEXT_PUBLIC_ENVIRONMENT === 'prod') {
                environment_override = true;
            }
        }
    }

    /**
     * Get the most recent coordinator Task for the coordinator.
     */
    const { data: lastTaskItem, status: getIncompleteTask } =
        await getLastCoordinatorTask(userId);

    if (lastTaskItem && lastTaskItem.completion_status === 'pending') {
        return lastTaskItem.id;
    }

    const { data, tag } = await getNextCoordinatorTaskItemToAssign(
        userId,
        environment_override
    );

    if (data && tag) {
        const taskId = createCoordinatorTaskFromItem(tag, userId, data);
        return taskId;
    } else {
        return null;
    }
}

async function getNextCoordinatorTaskItemToAssign(
    userId: string,
    environment_override: boolean
): Promise<{
    data: StatusTagObject | TaskOrderObject | TaskRenewalObject | undefined;
    tag: StatusTag | undefined;
}> {
    let returnData;
    let tag;

    const employeeAuthorization = await getEmployeeAuthorization(userId);
    const isLeadCoordinator =
        employeeAuthorization === BV_AUTH_TYPE.LEAD_COORDINATOR;

    const { data: status_tag_task } = await getCoordinatorTaskByStatusTagArray(
        [
            ...(isLeadCoordinator ? [StatusTag.LeadCoordinator] : []),
            StatusTag.ReadPatientMessage,
            StatusTag.AwaitingResponse,
            StatusTag.FollowUp,
            StatusTag.IDDocs,
            StatusTag.Coordinator,
            StatusTag.DoctorLetterRequired,
            // StatusTag.CancelOrderOrSubscription,
        ],
        null,
        userId,
        environment_override
    );

    if (!isNull(status_tag_task) && status_tag_task) {
        returnData = Array.isArray(status_tag_task)
            ? status_tag_task[0]
            : status_tag_task;
        tag = StatusTag.ReadPatientMessage;
    } else {
        returnData = undefined;
        tag = undefined;
    }

    return { data: returnData, tag: tag };
}

async function createCoordinatorTaskFromItem(
    tag: string,
    coordinatorId: string,
    taskData: StatusTagObject | TaskOrderObject | TaskRenewalObject
): Promise<number> {
    const coordinator_task = await createCoordinatorTaskFromStatusTagData(
        taskData as StatusTagObject,
        tag,
        coordinatorId
    );

    return coordinator_task?.id ?? -1;
}
