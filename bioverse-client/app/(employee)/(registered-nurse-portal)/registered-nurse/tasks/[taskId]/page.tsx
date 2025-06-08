'use server';

import ProviderReviewContainer from '@/app/components/provider-portal/provider-patient-review/review-container/provider-review-container';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { getEmployeeAuthorization } from '@/app/utils/database/controller/employees/employees-api';
import { fetchOrderData } from '@/app/utils/database/controller/orders/orders-api';
import { getTaskOrderIdFromTaskId } from '@/app/utils/database/controller/tasks/task-api';

interface Props {
    params: {
        taskId: string;
    };
}

export default async function TaskIdPage({ params }: Props) {
    const { data: activeSession } = await readUserSession();
    const registeredNurseId = activeSession?.session?.user.id;
    const employeeAuthorization = await getEmployeeAuthorization(
        registeredNurseId ?? ''
    );

    const order_id = await getTaskOrderIdFromTaskId(params.taskId);

    const { type: orderType, data: orderData } = await fetchOrderData(order_id);

    return (
        <div className='flex flex-col h-[90vh] max-h-[calc(100vh - var(--nav-height))] overflow-x-hidden'>
            <ProviderReviewContainer
                source={'task'}
                userId={registeredNurseId!}
                taskId={params.taskId}
                orderId={
                    orderData.renewal_order_id
                        ? orderData.renewal_order_id
                        : orderData.id
                }
                employeeAuthorization={employeeAuthorization}
            />
        </div>
    );
}
