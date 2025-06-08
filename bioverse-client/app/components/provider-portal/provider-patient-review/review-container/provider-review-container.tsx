'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { getTaskOrderIdFromTaskId } from '@/app/utils/database/controller/tasks/task-api';
import ProviderReviewUI from '../provider-review-UI/provider-review-ui';
import ProviderReviewTopInfoComponent from '../top-information-display/provider-review-topinfo';
import { BV_AUTH_TYPE } from '@/app/types/auth/authorization-types';
import { intakeViewDataFetch } from '@/app/components/provider-portal/intake-view/v2/components/containers/utils/data-fetch/intake-view-datafetch';

interface ProviderReviewContainerProps {
    source: 'task' | 'dashboard';
    orderId?: string;
    taskId?: string;
    userId: string;
    employeeAuthorization: BV_AUTH_TYPE | null;
}

export default function ProviderReviewContainer({
    source,
    orderId,
    taskId,
    userId,
    employeeAuthorization,
}: ProviderReviewContainerProps) {
    const [canProceed, setCanProceed] = useState<boolean>(false);

    /**
     * Fetch order ID
     */
    const { data: task_order_id } = useSWR(
        source === 'task' && `task-order-id-${taskId}`,
        () => getTaskOrderIdFromTaskId(taskId!)
    );

    const {
        data: intakeFetchData,
        isLoading: fetchLoading,
        mutate,
    } = useSWR(
        `intake-view-${orderId}`,
        () => intakeViewDataFetch(String(orderId ?? task_order_id!)),
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            revalidateOnMount: true,
            revalidateIfStale: false,
            dedupingInterval: 5000,
            shouldRetryOnError: false,
        }
    );

    return (
        <div className='max-h-[120vh] h-full flex flex-col items-start justify-start gap-2 bg-[#fafcfc]'>
            <ProviderReviewTopInfoComponent
                orderId={orderId ?? task_order_id!}
                taskId={taskId}
                source={source}
                canProceed={canProceed}
                userId={userId}
                setCanProceed={setCanProceed}
                employeeAuthorization={employeeAuthorization}
                intakeFetchData={intakeFetchData}
                fetchLoading={fetchLoading}
            />

            <div className='flex flex-col w-full h-full'>
                <ProviderReviewUI
                    providerId={userId}
                    order_id={orderId ?? task_order_id!}
                    setCanProceed={setCanProceed}
                    employeeAuthorization={employeeAuthorization}
                    intakeFetchData={intakeFetchData}
                    fetchLoading={fetchLoading}
                    mutate={mutate}
                />
            </div>
        </div>
    );
}
