'use client';

import { OrderType } from '@/app/types/orders/order-types';
import { StatusTag } from '@/app/types/status-tags/status-types';
import { getAllTaskQueueTotaOrderCount } from '@/app/utils/database/controller/orders/orders-api';
import {
    getAverageStatusTagRemovalTime,
    getIDDocsTaggedNewIntakesCountFromDateRange,
    getNewIntakeCountWithIDDocsFromDateRange,
    getNewMessageCountFromDateRange,
    getNewRenewalCountFromDateRange,
    getStatusTagArrayAssignmentCount,
    getStatusTagTaskCount,
} from '@/app/utils/database/controller/patient-status-tags/patient-status-tags-api';
import {
    getAverageIntakeProcessingTime,
    getAverageRenewalProcessingTime,
    getProviderIntakeProcessedCount,
    getProviderMessageProcessedCount,
    getProviderRenewalProcessedCount,
} from '@/app/utils/database/controller/provider_activity_audit/provider_activity_audit-api';
import { getAllTaskQueueTotaRenewalOrderCount } from '@/app/utils/database/controller/renewal_orders/renewal_orders';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import BioType from '../../global-components/bioverse-typography/bio-type/bio-type';
import HorizontalDivider from '../../global-components/dividers/horizontalDivider/horizontalDivider';
import TaskOverviewCard from './components/task-overview-card';
import {
    getCoordinatorDashboardCount,
    getCoordinatorProcessedTagCountFromDateRange,
} from '@/app/utils/database/controller/coordinator_activity_audit/coordinator_activity_audit-api';

interface TaskOverviewContainerProps {}

const getTaskOverviewData = async (start_date: Date, end_date: Date) => {
    const [
        { data: intake_count },
        { data: renewal_count },
        { data: message_count },
        coordinator_message_count,
        coordinator_new_message_count,
        new_intakes_count,
        new_renewals_count,
        new_messages_count,
        processed_intake_count,
        processed_renewal_count,
        processed_message_count,
        id_docs_tagged_new_intakes_count,
        coordinator_processed_tag_count,
    ] = await Promise.all([
        getAllTaskQueueTotaOrderCount(),
        getAllTaskQueueTotaRenewalOrderCount(),
        getStatusTagTaskCount('ProviderMessage'),
        getCoordinatorDashboardCount(),
        getStatusTagArrayAssignmentCount(
            [
                StatusTag.AwaitingResponse,
                StatusTag.DoctorLetterRequired,
                StatusTag.FollowUp,
                StatusTag.Coordinator,
                StatusTag.IDDocs,
                StatusTag.ReadPatientMessage,
                StatusTag.LeadCoordinator,
            ],
            start_date,
            end_date
        ),
        getNewIntakeCountWithIDDocsFromDateRange(start_date, end_date),
        getNewRenewalCountFromDateRange(start_date, end_date),
        getNewMessageCountFromDateRange(start_date, end_date),
        getProviderIntakeProcessedCount(start_date, end_date),
        getProviderRenewalProcessedCount(start_date, end_date),
        getProviderMessageProcessedCount(start_date, end_date),
        getIDDocsTaggedNewIntakesCountFromDateRange(start_date, end_date),
        getCoordinatorProcessedTagCountFromDateRange(start_date, end_date),
    ]);

    return {
        intake_count: intake_count,
        renewal_count: renewal_count,
        message_count: message_count,
        coordinator_message_count: coordinator_message_count,
        coordinator_new_message_count: coordinator_new_message_count,
        new_intakes_count: new_intakes_count,
        new_renewals_count: new_renewals_count,
        new_messages_count: new_messages_count,
        processed_intake_count: processed_intake_count,
        processed_renewal_count: processed_renewal_count,
        processed_message_count: processed_message_count,
        id_docs_tagged_new_intakes_count: id_docs_tagged_new_intakes_count,
        coordinator_processed_tag_count: coordinator_processed_tag_count,
    };
};

const getTaskProcessingTimeData = async (start_date: Date, end_date: Date) => {
    const [
        virtual_intake_processing_time,
        virtual_renewal_processing_time,
        patient_intake_processing_time,
        patient_renewal_processing_time,
        patient_message_processing_time,
        coordinator_message_processing_time,
    ] = await Promise.all([
        getAverageIntakeProcessingTime(start_date, end_date),
        getAverageRenewalProcessingTime(start_date, end_date),
        getAverageStatusTagRemovalTime(
            start_date,
            end_date,
            [StatusTag.Review, StatusTag.Overdue],
            OrderType.Order
        ),
        getAverageStatusTagRemovalTime(
            start_date,
            end_date,
            [
                StatusTag.Review,
                StatusTag.Overdue,
                StatusTag.ReviewNoPrescribe,
                StatusTag.FinalReview,
                StatusTag.OverdueNoPrescribe,
            ],
            OrderType.RenewalOrder
        ),
        getAverageStatusTagRemovalTime(start_date, end_date, [
            StatusTag.ProviderMessage,
        ]),
        getAverageStatusTagRemovalTime(
            start_date,
            end_date,
            [
                StatusTag.Coordinator,
                StatusTag.CancelOrderOrSubscription,
                StatusTag.IDDocs,
                StatusTag.ReadPatientMessage,
                StatusTag.AwaitingResponse,
                StatusTag.LeadCoordinator,
            ],
            OrderType.Order
        ),
    ]);

    return {
        virtual_intake_processing_time: virtual_intake_processing_time,
        virtual_renewal_processing_time: virtual_renewal_processing_time,
        patient_intake_processing_time: patient_intake_processing_time,
        patient_renewal_processing_time: patient_renewal_processing_time,
        patient_message_processing_time: patient_message_processing_time,
        coordinator_message_processing_time:
            coordinator_message_processing_time,
    };
};

export default function TaskOverviewContainer({}: TaskOverviewContainerProps) {
    const router = useRouter();

    const [startDate, setStartDate] = useState<Date>(() => {
        const today = new Date();
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);
        return sevenDaysAgo;
    });
    const [endDate, setEndDate] = useState<Date>(() => {
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        return today;
    });

    const {
        data: task_overview_data,
        isLoading: overview_data_loading,
        isValidating: overview_data_validating,
        mutate: mutateOverviewData,
    } = useSWR('provider-overview', () =>
        getTaskOverviewData(startDate, endDate)
    );

    const {
        data: task_processing_data,
        isLoading: processing_data_loading,
        isValidating: processing_data_validating,
        mutate: mutateProcessingData,
    } = useSWR('provider-processing-time', () =>
        getTaskProcessingTimeData(startDate, endDate)
    );

    useEffect(() => {
        mutateOverviewData();
        mutateProcessingData();
    }, [startDate, endDate, mutateOverviewData, mutateProcessingData]);

    const msToMMSS = (milliseconds: number): string => {
        // Handle invalid or zero input
        if (!milliseconds || milliseconds < 0) return '00:00';

        // Convert to seconds first
        const totalSeconds = Math.floor(milliseconds / 1000);

        // Calculate minutes and remaining seconds
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        return `${minutes} min ${seconds} seconds`;
    };

    function formatDuration(seconds: number): string {
        const days = Math.floor(seconds / 86400);
        const hours = Math.floor((seconds % 86400) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);

        if (days > 0) {
            // If there are days, show DD:HH:MM
            return `${days.toString().padStart(2, '0')}:${hours
                .toString()
                .padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        } else if (hours > 0) {
            // If there are hours but no days, show HH:MM
            return `${hours.toString().padStart(2, '0')}:${minutes
                .toString()
                .padStart(2, '0')}`;
        } else {
            // If only minutes, show 00:MM
            return `00:${minutes.toString().padStart(2, '0')}`;
        }
    }

    return (
        <div className='flex flex-col items-center justify-start min-h-[500px] mx-[200px] mt-16'>
            <div className='flex flex-col items-start w-full justify-start gap-4'>
                <div
                    className='flex flex-row items-center gap-2 cursor-pointer hover:underline decoration-1'
                    onClick={() => {
                        router.push('/admin');
                    }}
                >
                    <ArrowBackOutlinedIcon sx={{ color: '#6E6E6E' }} />
                    <BioType className='itd-input text-[#6e6e6e]'>
                        Back to Admin Dashboard
                    </BioType>
                </div>
                <BioType className='itd-h1'>Task Overview</BioType>
            </div>

            <div className='flex flex-row justify-end w-full'>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <div className='flex flex-row space-x-4 p-4'>
                        <div className='flex flex-col'>
                            <BioType className='itd-body text-[#646464]'>
                                Start Date:
                            </BioType>
                            <DatePicker
                                value={startDate}
                                onChange={(newValue) => {
                                    if (newValue) setStartDate(newValue);
                                }}
                            />
                        </div>
                        <div className='flex flex-col'>
                            <BioType className='itd-body text-[#646464]'>
                                End Date:
                            </BioType>
                            <DatePicker
                                value={endDate}
                                onChange={(newValue) => {
                                    if (newValue) {
                                        const endOfDay = new Date(newValue);
                                        endOfDay.setHours(23, 59, 59, 999);
                                        setEndDate(endOfDay);
                                    }
                                }}
                            />
                        </div>
                    </div>
                </LocalizationProvider>
            </div>

            <div className='flex flex-col w-full justify-start'>
                <BioType className='text-[#646464] itd-subtitle'>
                    Provider
                </BioType>
                <div className='flex flex-col w-full h-[1px]'>
                    <HorizontalDivider backgroundColor={'#DFDFDF'} height={1} />
                </div>
            </div>

            <div className='flex flex-row flex-wrap w-full justify-start p-4 gap-4'>
                <TaskOverviewCard
                    title='Outstanding Intakes'
                    primaryDisplayText={task_overview_data?.intake_count}
                    secondaryDisplayText={[
                        `New Intakes w/ ID: ${
                            task_overview_data?.new_intakes_count ?? ''
                        }`,
                        // `New Intakes Processed ${
                        //     task_overview_data?.processed_intake_count ?? ''
                        // }`,
                        `New Intakes Processed: ${
                            (task_overview_data?.new_intakes_count ?? 0) -
                            (task_overview_data?.intake_count ?? 0)
                        }`,
                        `Intakes w/o ID: ${
                            task_overview_data?.id_docs_tagged_new_intakes_count ??
                            ''
                        }`,
                        `Total Intakes: ${
                            (task_overview_data?.new_intakes_count ?? 0) -
                            (task_overview_data?.intake_count ?? 0) +
                            task_overview_data?.id_docs_tagged_new_intakes_count
                        }`,
                    ]}
                    isValidating={
                        overview_data_validating || overview_data_loading
                    }
                />

                <TaskOverviewCard
                    title='Outstanding Renewals'
                    primaryDisplayText={task_overview_data?.renewal_count}
                    secondaryDisplayText={[
                        `New Renewals: ${
                            task_overview_data?.new_renewals_count ?? ''
                        }`,
                        // `Renewals Processed ${
                        //     task_overview_data?.processed_renewal_count ?? ''
                        // }`,
                        `Renewals Processed: ${
                            (task_overview_data?.new_renewals_count ?? 0) -
                            (task_overview_data?.renewal_count ?? 0)
                        }`,
                    ]}
                    isValidating={
                        overview_data_validating || overview_data_loading
                    }
                />

                <TaskOverviewCard
                    title='Unanswered Messages'
                    primaryDisplayText={task_overview_data?.message_count}
                    secondaryDisplayText={[
                        `New Messages ${
                            task_overview_data?.new_messages_count ?? ''
                        }`,
                        // `Answered Messages ${
                        //     task_overview_data?.processed_message_count ?? ''
                        // }`,
                        `Answered Messages ${
                            (task_overview_data?.new_messages_count ?? 0) -
                            (task_overview_data?.message_count ?? 0)
                        }`,
                    ]}
                    isValidating={
                        overview_data_validating || overview_data_loading
                    }
                />

                <TaskOverviewCard
                    title='Intake Processing Time'
                    primaryDisplayText={
                        formatDuration(
                            task_processing_data?.patient_intake_processing_time
                        ) ?? ''
                    }
                    secondaryDisplayText={[
                        'Virtual Visit Processing Time: ',
                        msToMMSS(
                            task_processing_data?.virtual_intake_processing_time ??
                                0
                        ),
                    ]}
                    isValidating={
                        processing_data_loading || processing_data_validating
                    }
                />

                <TaskOverviewCard
                    title='Renewal Processing Time'
                    primaryDisplayText={formatDuration(
                        task_processing_data?.patient_renewal_processing_time ??
                            0
                    )}
                    secondaryDisplayText={[
                        'Virtual Visit Processing Time: ',
                        msToMMSS(
                            task_processing_data?.virtual_renewal_processing_time ??
                                0
                        ),
                    ]}
                    isValidating={
                        processing_data_loading || processing_data_validating
                    }
                />

                <TaskOverviewCard
                    title='Message Processing Time'
                    primaryDisplayText={formatDuration(
                        task_processing_data?.patient_message_processing_time ??
                            0
                    )}
                    secondaryDisplayText={[]}
                    isValidating={
                        processing_data_loading || processing_data_validating
                    }
                />

                {/**
                 * patient_message_processing_time
                 */}
            </div>

            <div className='flex flex-col w-full justify-start'>
                <BioType className='text-[#646464] itd-subtitle'>
                    Coordinator
                </BioType>
                <div className='flex flex-col w-[303px] h-[1px]'>
                    <HorizontalDivider backgroundColor={'#DFDFDF'} height={1} />
                </div>
            </div>
            <div className='flex flex-row flex-wrap w-full justify-start p-4 gap-4'>
                <TaskOverviewCard
                    title='Outstanding Messages'
                    primaryDisplayText={
                        task_overview_data?.coordinator_message_count
                    }
                    secondaryDisplayText={[
                        `New Messages ${
                            task_overview_data?.coordinator_new_message_count ??
                            ''
                        }`,
                        `Answered Messages ${
                            task_overview_data?.coordinator_processed_tag_count ??
                            ''
                        }`,
                    ]}
                    isValidating={
                        overview_data_validating || overview_data_loading
                    }
                />
                <TaskOverviewCard
                    title='Message Processing Time'
                    primaryDisplayText={formatDuration(
                        task_processing_data?.coordinator_message_processing_time ??
                            0
                    )}
                    secondaryDisplayText={[]}
                    isValidating={
                        processing_data_loading || processing_data_validating
                    }
                />
            </div>
        </div>
    );
}
