import { BV_AUTH_TYPE } from '@/app/types/auth/authorization-types';
import { USStates } from '@/app/types/enums/master-enums';
import { OrderType } from '@/app/types/orders/order-types';
import { StatusTag } from '@/app/types/status-tags/status-types';
import { getEmployeeAuthorization } from '@/app/utils/database/controller/employees/employees-api';
import {
    assignProviderToOrderUsingOrderId,
    getNextOrderForTaskQueue,
} from '@/app/utils/database/controller/orders/orders-api';
import {
    updateStatusTagAssignedProvider,
    getStatusTags,
    getCoordinatorTaskByStatusTagArray,
} from '@/app/utils/database/controller/patient-status-tags/patient-status-tags-api';
import {
    getProviderIntakeCounterAndStates,
    getProviderLicensedStatesWithID,
    updateProviderIntakeCounter,
} from '@/app/utils/database/controller/providers/providers-api';
import {
    assignProviderToOrderUsingRenewalOrderId,
    getNextRenewalOrderForTaskQueue,
} from '@/app/utils/database/controller/renewal_orders/renewal_orders';
import {
    createTaskFromOrderOrRenewalData,
    createTaskFromStatusTagData,
    getLastProviderTask,
    getLastTwoProviderTasks,
} from '@/app/utils/database/controller/tasks/task-api';
import { isNull } from 'lodash';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const requestData = await req.json();
    const userId = requestData.userId;

    const taskItemId = await getNextProviderTask(userId);

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

enum TaskType {
    Urgent = 'urgent',
    Message = 'message',
    Intake = 'intake',
    Renewal = 'renewal',
}

async function getNextProviderTask(userId: string): Promise<number | null> {
    // const licensed_states = await getProviderLicensedStatesWithID(userId);
    const { intake_counter, licensed_states } =
        await getProviderIntakeCounterAndStates(userId);
    const employeeAuthorization = await getEmployeeAuthorization(userId);
    // const previousTaskList = await getExistingIntakeRenewalTaskList();

    //If we cannot find the authorization we return null
    if (!employeeAuthorization) {
        // console.log('================================ no permission 1');
        return null;
    }

    let environment_override = false;

    //We return null if the authorization is not a provider do not allow assignment.
    if (
        employeeAuthorization !== BV_AUTH_TYPE.LEAD_PROVIDER &&
        employeeAuthorization !== BV_AUTH_TYPE.PROVIDER &&
        employeeAuthorization !== BV_AUTH_TYPE.REGISTERED_NURSE
    ) {
        if (process.env.NEXT_PUBLIC_ENVIRONMENT === 'prod') {
            environment_override = true;
        }
    }

    /**
     * Get the most recent provider Task that has already been created for the provider.
     */
    const { data: lastTaskItem, status: getIncompleteTask } =
        await getLastProviderTask(userId);

    /**
     * Return the already-created task if it exists and is not completed yet.
     */
    if (lastTaskItem && lastTaskItem.completion_status === false) {
        return lastTaskItem.id;
    }

    //If there were no already-created tasks, we will need to create a new task.

    if (employeeAuthorization === BV_AUTH_TYPE.REGISTERED_NURSE) {
        //handle registered nurse task here
        const { data: rn_data } = await getNextItemForRegisteredNurse(
            licensed_states ?? [],
            environment_override,
            userId
        );

        // Check if rn_data is an array and extract the first item, or use as is if it's a singular object
        const processedRnData = Array.isArray(rn_data) ? rn_data[0] : rn_data;

        if (processedRnData) {
            const taskId = await createTaskFromItem(
                TaskType.Message,
                userId,
                processedRnData
            );
            return taskId;
        } else {
            return null;
        }
    }

    /**
     * Obtain the intake counter to determine if we should serve a message. **DEPRECATED**
     * As well as licensed states to filter out the wrong licensed state from the intakes.
     */

    //Array indicating the order in which to search for the intakes:
    const taskCheckOrderArray = [
        'intake',
        'message',
        'renewal',
        'intake',
        'message',
        'renewal',
    ];

    let startingCheckIndex: number;

    if (!lastTaskItem) {
        startingCheckIndex = 0;
    }

    /**
     * If the last task was message or renewal, we can change them accordingly
     */
    switch (lastTaskItem?.type) {
        case 'message':
            startingCheckIndex = 2;
            break;
        case 'renewal':
        default:
            startingCheckIndex = 0;
    }

    if (intake_counter === null || !intake_counter) {
        startingCheckIndex = 0;
        await updateProviderIntakeCounter(userId, 0);
    }

    /**
     * increasing the intake ratio artificially with a counter
     */
    if (intake_counter) {
        if (intake_counter < 5) {
            startingCheckIndex = 0;
        }
        if (intake_counter >= 5) {
            startingCheckIndex = 1;
        }
    }

    // switch (lastTaskItem?.type) {
    //     case 'intake':
    //         startingCheckIndex = 1;
    //         break;
    //     case 'message':
    //         startingCheckIndex = 2;
    //         break;
    //     case 'renewal':
    //         startingCheckIndex = 0;
    //         break;
    //     default:
    //         startingCheckIndex = 0;
    // }

    let taskItemData:
        | StatusTagObject
        | TaskOrderObject
        | TaskRenewalObject
        | undefined = undefined;

    let taskItemType: TaskType | undefined = undefined;

    //First check for any orders that would be considered urgent tasks
    //First check for any orders that would be considered urgent tasks
    const { data, type } = await getNextItemToAssign(
        TaskType.Urgent,
        licensed_states ?? [],
        environment_override,
        userId
    );

    //If we find an order that would be considered an urgent task, we create the task and return that task
    if (data && type) {
        const taskId = createTaskFromItem(type, userId, data);
        return taskId;
    }

    //loop through the different types of tasks and for each type, we check if there is a order that should be a task that has not been created yet
    for (let i = startingCheckIndex; i < taskCheckOrderArray.length; i++) {
        const typeToCheck = taskCheckOrderArray[i];

        const customStates = custom_licensed_states[userId];

        if (customStates) {
            const { data, type } = await getNextItemToAssign(
                typeToCheck as TaskType,
                customStates,
                environment_override,
                userId
            );

            if (data) {
                taskItemData = data;
                taskItemType = type;
            }

            if (taskItemData) break; //if the taskItemData is found, we break out of the loop, we'll create a task with this data
        }

        const { data, type } = await getNextItemToAssign(
            typeToCheck as TaskType,
            licensed_states ?? [],
            environment_override,
            userId
        );

        taskItemData = data;
        taskItemType = type;

        if (taskItemData) break; //if the taskItemData is found, we break out of the loop, we'll create a task with this data
    } //end of loop

    if (!taskItemData) {
        return null;
    }

    // console.log(
    //     '================================ taskItemData has been found',
    //     taskItemData
    // );

    const taskId = await createTaskFromItem(
        taskItemType!,
        userId,
        taskItemData
    );
    return taskId;
}

async function getNextItemToAssign(
    type: TaskType,
    licensed_states: USStates[],
    environment_override: boolean = false,
    userId: string
): Promise<{
    data: StatusTagObject | TaskOrderObject | TaskRenewalObject | undefined;
    type: TaskType | undefined;
}> {
    console.log('Getting next item to assign for type:', type);
    console.log('Licensed states:', licensed_states);
    console.log('Environment override:', environment_override);
    console.log('User ID:', userId);

    let returnData;
    let foundType: TaskType | undefined;

    switch (type) {
        case 'intake':
            console.log('Processing intake task...');
            const { data: intake_task, error: intake_task_error } =
                await getNextOrderForTaskQueue(
                    licensed_states,
                    environment_override,
                    userId
                );

            console.log('Intake task result:', intake_task);
            console.log('Intake task error:', intake_task_error);

            if (!isNull(intake_task) && intake_task) {
                returnData = intake_task;
                foundType = TaskType.Intake;
            } else {
                returnData = undefined;
                foundType = undefined;
            }
            break;
        case 'renewal':
            console.log('Processing renewal task...');
            const { data: renewal_task, error: renewal_task_error } =
                await getNextRenewalOrderForTaskQueue(
                    licensed_states,
                    environment_override,
                    userId
                );

            console.log('Renewal task result:', renewal_task);
            console.log('Renewal task error:', renewal_task_error);

            if (renewal_task) {
                returnData = renewal_task;
                foundType = TaskType.Renewal;
            } else {
                returnData = undefined;
                foundType = undefined;
            }
            break;
        case 'message':
            console.log('Processing message task...');
            const { data: data_list, status: fetch_status } =
                await getStatusTags(
                    3,
                    StatusTag.ProviderMessage,
                    licensed_states,
                    environment_override ? 'dev' : undefined
                );

            console.log('Message task result:', data_list);
            console.log('Message task status:', fetch_status);

            if (!isNull(data_list) && data_list && data_list.length > 0) {
                returnData = data_list[0];
                foundType = TaskType.Message;
            } else {
                returnData = undefined;
                foundType = undefined;
            }
            break;

        case 'urgent':
            console.log('Processing urgent task...');
            const { data: urgent_data_list, status: urgent_fetch_status } =
                await getStatusTags(
                    1,
                    StatusTag.UrgentRequiresProvider,
                    licensed_states,
                    environment_override ? 'dev' : undefined
                );

            if (
                !isNull(urgent_data_list) &&
                urgent_data_list &&
                urgent_data_list.length > 0
            ) {
                returnData = urgent_data_list[0];
                foundType = TaskType.Urgent;
            } else {
                returnData = undefined;
                foundType = undefined;
            }
            break;
    }

    console.log('Final return data:', returnData);
    console.log('Final found type:', foundType);

    return { data: returnData, type: foundType };
}

async function getNextItemForRegisteredNurse(
    licensed_states: USStates[],
    environment_override: boolean = false,
    userId: string
): Promise<{
    data: StatusTagObject | undefined;
    type: TaskType | undefined;
}> {
    const { data: status_tag_task } = await getCoordinatorTaskByStatusTagArray(
        [StatusTag.RegisteredNurseMessage],
        licensed_states,
        userId,
        environment_override
    );

    return { data: status_tag_task ?? undefined, type: TaskType.Message };
}

async function createTaskFromItem(
    type: TaskType,
    providerId: string,
    taskData: StatusTagObject | TaskOrderObject | TaskRenewalObject
): Promise<number> {
    let taskId = -1;

    switch (type) {
        case TaskType.Intake:
            if ('order_id' in taskData) {
                await assignProviderToOrderUsingOrderId(
                    taskData.order_id as number,
                    providerId
                );
            }

            const task_id = await createTaskFromOrderOrRenewalData(
                OrderType.Order,
                'intake',
                providerId,
                taskData as TaskOrderObject,
                undefined
            );
            taskId = task_id.id;
            break;
        case TaskType.Renewal:
            //assignProviderToOrderUsingRenewalOrderId

            if ('renewal_order_id' in taskData) {
                await assignProviderToOrderUsingRenewalOrderId(
                    taskData.renewal_order_id as string,
                    providerId
                );
            }

            const renewal_task = await createTaskFromOrderOrRenewalData(
                OrderType.RenewalOrder,
                'renewal',
                providerId,
                undefined,
                taskData as TaskRenewalObject
            );
            taskId = renewal_task.id;
            break;
        case TaskType.Message:
            if ('id' in taskData) {
                await updateStatusTagAssignedProvider(
                    providerId,
                    taskData.id as number
                );
            }
            const message_task = await createTaskFromStatusTagData(
                taskData as StatusTagObject,
                'message',
                providerId
            );

            taskId = message_task.id;
            break;

        case TaskType.Urgent:
            if ('id' in taskData) {
                await updateStatusTagAssignedProvider(
                    providerId,
                    taskData.id as number
                );
            }
            const urgent_task = await createTaskFromStatusTagData(
                taskData as StatusTagObject,
                'message',
                providerId
            );

            taskId = urgent_task.id;
            break;
    }

    return taskId;
}

interface CustomLicensedStates {
    //provider_id -> custom licensed states
    [key: string]: USStates[];
}

const custom_licensed_states: CustomLicensedStates = {
    '24138d35-e26f-4113-bcd9-7f275c4f9a47': [
        //Maylin Chen
        USStates.Michigan,
        USStates.NorthCarolina,
    ],
    '28e2a459-2805-425f-96f3-a3d7f39c0528': [
        //Kristin Curcio
        USStates.Illinois,
    ],
    'da5b213d-7676-4792-bc73-11151d0da4e6': [
        //Amanda Little
        USStates.Pennsylvania,
    ],
    '7cf6a976-fce4-443e-be9c-f265adfb67e7': [
        //Kayla Doran
        USStates.Indiana,
    ],
    '84e3e542-6dba-4826-9e64-fab60ac64eed': [
        //Morgan
        USStates.Indiana,
    ],
    '2585f937-4b9e-42c5-b0b3-1ea002fe64fd': [
        //Angie
        USStates.Illinois,
    ],
};
