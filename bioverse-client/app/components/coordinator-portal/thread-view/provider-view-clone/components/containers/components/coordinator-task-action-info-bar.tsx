'use client';

import { Button, CircularProgress } from '@mui/material';
import useSWR from 'swr';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import React from 'react';
import { getEmployeeRecordById } from '@/app/utils/database/controller/employees/employees-api';
import { getTaskActionMenuData } from '@/app/components/coordinator-portal/tasks/task-action-page/utils/task-action-data-fetch';
import { updateTaskCompletionStatus } from '@/app/utils/database/controller/coordinator_tasks/coordinator-task-api';
import { getNextCoordinatorTask } from '@/app/components/coordinator-portal/tasks/utils/findNextTask';
import SuperSatisfiedCustomerDialog from './super-satisfied-customer-dialog';
import { StatusTag } from '@/app/types/status-tags/status-types';
import { getUserStatusTags } from '@/app/utils/database/controller/patient-status-tags/patient-status-tags-api';

interface ProviderTrackingWindowProps {
    user_id: string;
    task_id?: string;
    canProceed: boolean;
    patient_id: string;
    order_id: string;
}

const StatItem = ({ value, label }: { value: string; label: string }) => {
    return (
        <div className='first:border-l-0  border-l border-gray-200 border-solid border-0 p-2'>
            <p className='text-[14px] text-black  font-inter'>{value}</p>
            <p className='text-[12px] text-gray-400 text-nowrap  font-inter'>
                {label}
            </p>
        </div>
    );
};

const HappyFaceIcon = () => {
    return (
        <svg
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
            className='mr-2'
        >
            <path
                d='M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14M9 9H9.01M15 9H15.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z'
                stroke='#4D4D4D'
                strokeOpacity='0.45'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
            />
        </svg>
    );
};

export default function CoordinatorTaskActionInfoBar({
    user_id,
    task_id,
    canProceed,
    patient_id,
    order_id,
}: ProviderTrackingWindowProps) {
    const router = useRouter();
    const pathname = usePathname();

    const route = pathname?.split('/')[1];

    const [isLoadingNextTask, setIsLoadingNextTask] = useState<boolean>(false);

    const [employeeName, setEmployeeName] = useState('');

    const [
        isSuperSatisfiedCustomerDialogOpen,
        setIsSuperSatisfiedCustomerDialogOpen,
    ] = useState(false);

    const { data: statusTags } = useSWR(
        `${patient_id}-status-Tags`,
        () => getUserStatusTags(patient_id, order_id),
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
        }
    );

    /**
     * //TODO Take this use Effect and remove it. Put it in a server component and have it fetch with the server instance.
     */
    useEffect(() => {
        const fetchEmployeeName = async () => {
            const employeeData = await getEmployeeRecordById(user_id);
            setEmployeeName(employeeData.display_name);
        };

        fetchEmployeeName();
    }, [user_id]);

    const { data: taskCount } = useSWR(`${user_id}-task-count`, () =>
        getTaskActionMenuData(user_id)
    );

    const completeTask = async () => {
        try {
            setIsLoadingNextTask(true);

            const taskStatus =
                statusTags?.data.status_tag == StatusTag.Resolved
                    ? 'completed'
                    : 'forwarded';

            await updateTaskCompletionStatus(task_id!, taskStatus);

            console.log('post updateTaskCompletionStatus');

            const nextTaskId = await getNextCoordinatorTask(user_id);

            console.log('post nextTaskId: ', nextTaskId);

            if (!nextTaskId) {
                router.push(`/${route}`);
            } else {
                router.push(`/${route}/tasks/${nextTaskId}`);
            }
        } catch (error: any) {
            console.error('Error completing task: ', error);
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

    return (
        <>
            <div className='max-w-md mx-auto bg-white rounded-sm shadow-md overflow-hidden md:max-w-2xl mb-[10px]'>
                <div className='flex flex-col'>
                    <div className='flex p-2 pt-0 items-center justify-between'>
                        <div>
                            <h1 className='text-[14px] font-bold text-black font-inter '>
                                {employeeName || 'Loading...'}
                            </h1>
                            <p className='text-[12px] font-inter text-gray-400 text-nowrap'>
                                Coordinator Name
                            </p>
                        </div>
                        <Button
                            color='info'
                            variant='outlined'
                            className={`normal-case m-[10px] font-inter text-[14px]  h-[36px] !text-black rounded-[var(--Corner-radius-M,12px)]  border-[solid] border-[black]`}
                            onClick={() => {
                                setIsSuperSatisfiedCustomerDialogOpen(true);
                            }}
                        >
                            <HappyFaceIcon /> Super Satisfied Customer
                        </Button>
                        <SuperSatisfiedCustomerDialog
                            open={isSuperSatisfiedCustomerDialogOpen}
                            onClose={() =>
                                setIsSuperSatisfiedCustomerDialogOpen(false)
                            }
                            patient_id={patient_id}
                        />

                        <Button
                            variant='contained'
                            color='primary'
                            onClick={completeTask}
                            disabled={!canProceed || !task_id}
                            className='normal-case text-[14px] font-inter'
                            sx={{
                                textTransform: 'none',
                                fontSize: '14px',
                                px: 6,
                                py: 0,
                                height: '36px',
                                borderRadius: 'var(--Corner-radius-M,12px)',
                                bgcolor: canProceed ? 'black' : 'grey',
                                color: !canProceed ? 'white' : 'white',
                                '&:hover': {
                                    bgcolor: '#666666',
                                },
                            }}
                        >
                            {isLoadingNextTask ? (
                                <CircularProgress
                                    size={22}
                                    style={{ color: 'white' }}
                                />
                            ) : (
                                'Mark Completed'
                            )}
                        </Button>
                    </div>

                    <div className='flex justify-between pb-[4px]'>
                        <StatItem
                            value={renderCurrentMonthYear()}
                            label='Current Period'
                        />
                        <StatItem
                            value={taskCount?.hoursLogged ?? 'Loading...'}
                            label='Hours Logged'
                        />
                        <StatItem
                            value={
                                taskCount?.pendingCount
                                    ? taskCount.pendingCount.toString()
                                    : 'Loading...'
                            }
                            label='Tasks in Queue'
                        />
                        <StatItem
                            value={
                                taskCount?.messagesOverdueCount
                                    ? taskCount.messagesOverdueCount.toString()
                                    : 'Loading...'
                            }
                            label='Messages Overdue'
                        />
                        <StatItem
                            value={
                                taskCount?.completedCount === 0
                                    ? '0'
                                    : taskCount?.completedCount
                                    ? taskCount.completedCount.toString()
                                    : 'Loading...'
                            }
                            label='Tasks Completed'
                        />
                        <StatItem
                            value={
                                taskCount?.forwardedCount === 0
                                    ? '0'
                                    : taskCount?.forwardedCount
                                    ? taskCount.forwardedCount.toString()
                                    : 'Loading...'
                            }
                            label='Tasks Forwarded'
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
