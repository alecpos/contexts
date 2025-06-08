'use client';

import { getProviderFromId } from '@/app/utils/database/controller/providers/providers-api';
import { Button, CircularProgress } from '@mui/material';
import useSWR from 'swr';
import { getNextProviderTask } from '../../utils/findNextTask';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { updateTaskCompletionStatus } from '@/app/utils/database/controller/tasks/task-api';
import { getTaskActionMenuData } from '../utils/task-action-data-fetch';
import React from 'react';
import { BV_AUTH_TYPE } from '@/app/types/auth/authorization-types';
import { getRegisteredNurseDashboardTasks } from '@/app/components/registered-nurse-portal/dashboard/utils/rn-dashboard-functions';

interface ProviderTrackingWindowProps {
    user_id: string;
    task_id?: string;
    canProceed: boolean;
    source: 'task' | 'dashboard';
    employeeAuthorization: BV_AUTH_TYPE | null;
}

export default function TaskActionInfoBar({
    user_id,
    task_id,
    canProceed,
    source,
    employeeAuthorization,
}: ProviderTrackingWindowProps) {
    const router = useRouter();
    const pathname = usePathname();

    const route = pathname?.split('/')[1];

    const isRegisteredNurse =
        employeeAuthorization === BV_AUTH_TYPE.REGISTERED_NURSE ||
        pathname.includes('registered-nurse');

    const { data: taskList, isLoading: rn_data_loading } = useSWR(
        isRegisteredNurse ? `registered-nurse-tags` : null,
        () => getRegisteredNurseDashboardTasks(user_id),
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            revalidateIfStale: false,
        }
    );

    const { data, error, isLoading } = useSWR(`${user_id}-provider-data`, () =>
        getProviderFromId(user_id)
    );
    const [isLoadingNextTask, setIsLoadingNextTask] = useState<boolean>(false);

    const {
        data: taskCount,
        error: taskCountError,
        isLoading: taskCountIsLoading,
    } = useSWR(`${user_id}-task-count`, () => getTaskActionMenuData());

    // const currentMonthYear = () => {
    //     const curr_date = new Date();
    //     // Using toLocaleString to format the date to "month year" format
    //     // Options can be adjusted according to your locale preferences
    //     const formattedDate = curr_date.toLocaleString('default', {
    //         month: 'long',
    //         year: 'numeric',
    //     });
    //     return formattedDate;
    // };

    const completeTask = async () => {
        try {
            setIsLoadingNextTask(true);

            await updateTaskCompletionStatus(task_id!, true);

            const nextTaskId = await getNextProviderTask(user_id);

            if (!nextTaskId) {
                router.push(`/${route}`);
            } else {
                router.push(`/${route}/tasks/${nextTaskId}`);
            }
        } catch (error: any) {
            setIsLoadingNextTask(false);
            return;
        }
    };

    const renderCurrentMonthYear = () => {
        const currentDate = new Date();
        const monthYear = currentDate.toLocaleString('default', {
            month: 'long',
            year: 'numeric',
        });
        return monthYear;
    };

    // TODO: Double check whats needed here in terms of tabs

    return (
        <div
            className={`flex items-center flex-grow ${
                source === 'task' ? 'justify-between' : ''
            } p-2 text-textSecondary max-w-[50vw] text-center bg-[#FFFFFF] border border-solid border-[#BDBDBD] rounded-[4px] h-[44px] inter-basic px-[16px]`}
        >
            {/*provider name, intakes completed, tasks in queue, total earnings, mark task complete btn*/}
            {/*PROVIDER NAME*/}
            <>
                <div className='flex flex-col text-[12px] h-full gap-2 min-w-[120px]'>
                    <p className='text-[12px] leading-[14px] whitespace-nowrap overflow-hidden text-ellipsis'>
                        {data ? data.name : 'Loading...'}
                    </p>
                    <p className='text-[12px] leading-[14px] text-strong whitespace-nowrap'>
                        {renderCurrentMonthYear()}
                    </p>
                </div>
                {/*INTAKES COMPLETED*/}
                {employeeAuthorization !== BV_AUTH_TYPE.REGISTERED_NURSE && (
                    <div className='flex flex-col text-[12px] h-full gap-2 min-w-[120px]'>
                        <p className='text-[12px] leading-[14px] whitespace-nowrap'>
                            Intakes Completed
                        </p>
                        <p className='text-[12px] leading-[14px] text-strong'>
                            {data ? data.intake_counter : 'Loading...'}
                        </p>
                    </div>
                )}
                {/* TASKS IN QUEUE*/}
                <div className='flex flex-col text-[12px] h-full gap-2 min-w-[100px]'>
                    <p className='text-[12px] leading-[14px] whitespace-nowrap'>
                        Tasks in Queue
                    </p>
                    <p className='text-[12px] leading-[14px] text-strong'>
                        {isRegisteredNurse
                            ? taskList?.length ?? 'Loading...'
                            : taskCount?.total_intakes_remaining ??
                              'Loading...'}
                    </p>
                </div>
                {/* TOTAL EARNINGS (MONTH) */}
                <div className='flex flex-col text-[12px] h-full gap-2 min-w-[140px]'>
                    <p className='text-[12px] leading-[14px] whitespace-nowrap'>
                        Total Earnings (Month)
                    </p>
                    <p className='text-[12px] leading-[14px] text-strong'>
                        {taskCount?.estimated_payment
                            ? `$${taskCount?.estimated_payment}`
                            : 'Loading...'}
                    </p>
                </div>
                <div className='flex flex-col  text-[12px] h-full gap-[6px]'>
                    <p className='text-[12px] h-[12px]'>Hours this week</p>
                    <p className='text-[12px] h-[12px] text-strong'>
                        {taskCount?.total_hours_this_week
                            ? formatMillisecondsToTime(
                                  taskCount?.total_hours_this_week *
                                      60 *
                                      60 *
                                      1000
                              )
                            : 'Loading...'}
                    </p>
                </div>
                {source === 'task' && (
                    <Button
                        variant='contained'
                        color='primary'
                        fullWidth
                        // className='min-w-[160px]'
                        onClick={completeTask}
                        disabled={!canProceed}
                        sx={{ width: '170px' }}
                    >
                        {isLoadingNextTask ? (
                            <CircularProgress
                                size={22}
                                style={{ color: 'white' }}
                            />
                        ) : (
                            <span className='text-[14px]'>
                                Mark Task Complete
                            </span>
                        )}
                    </Button>
                )}
            </>
        </div>
    );
}

function formatMillisecondsToTime(ms: number): string {
    const totalMinutes = Math.floor(ms / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours}h ${minutes}m`;
}
