'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { getStatusTagTaskCount } from '@/app/utils/database/controller/patient-status-tags/patient-status-tags-api';
import { getProviderCompletionCount } from '@/app/utils/database/controller/provider_activity_audit/provider_activity_audit-api';
import { getProviderFromId } from '@/app/utils/database/controller/providers/providers-api';
import { Paper } from '@mui/material';
import useSWR from 'swr';
import { getTaskActionMenuData } from '../../tasks/task-action-page/utils/task-action-data-fetch';

interface ProviderTrackingWindowProps {
    user_id: string;
    intake_list: PatientOrderProviderDetails[];
}

async function fetchAllProviderData(user_id: string) {
    const [providerData, taskData, completedData, messageData] =
        await Promise.all([
            getProviderFromId(user_id),
            getTaskActionMenuData(),
            getProviderCompletionCount(),
            getStatusTagTaskCount('ProviderMessage'),
        ]);

    console.log(taskData);

    return {
        providerData,
        total_intakes_remaining: taskData?.total_intakes_remaining,
        auditCompletedData: completedData,
        messageCount: messageData?.data,
    };
}

export default function ProviderTrackingWindow({
    user_id,
    intake_list,
}: ProviderTrackingWindowProps) {
    const { data } = useSWR(`${user_id}-provider-tracking-data`, () =>
        fetchAllProviderData(user_id)
    );

    const overdue_list = intake_list!.filter((intake_item) => {
        return (
            intake_item.statusTag &&
            intake_item.statusTag === 'Overdue' &&
            ['Unapproved-CardDown', 'Approved-CardDown'].includes(
                intake_item.approvalStatus
            )
        );
    });

    const currentMonthYear = () => {
        const curr_date = new Date();
        // Using toLocaleString to format the date to "month year" format
        // Options can be adjusted according to your locale preferences
        const formattedDate = curr_date.toLocaleString('default', {
            month: 'long',
            year: 'numeric',
        });
        return formattedDate;
    };

    return (
        <Paper
            className='flex flex-row max-w-[70%] min-h-[50px] bg-[#B2E8FF] items-center p-2 justify-between rounded-lg'
            sx={{ backgroundColor: '#B2E8FF' }}
        >
            <div className='flex flex-col text-center text-[#12171A] p-1'>
                <BioType className='inter-body text-[#475D66]'>
                    {data?.providerData ? data.providerData.name : 'Loading'}
                </BioType>
                <BioType className='inter-body'>{currentMonthYear()}</BioType>
            </div>
            <div className='flex flex-col text-center text-[#12171A] p-1'>
                <BioType className='inter-body text-[#475D66]'>
                    Tasks Completed
                </BioType>
                <BioType className='inter-body'>
                    {data?.auditCompletedData ?? 'Loading...'}
                </BioType>
            </div>
            <div className='flex flex-col text-center text-[#12171A] p-1'>
                <BioType className='inter-body text-[#475D66]'>
                    Tasks in Queue
                </BioType>
                <BioType className='inter-body'>
                    {data?.total_intakes_remaining ?? 'Loading...'}
                </BioType>
            </div>
            <div className='flex flex-col bg-[#E5A7A8] rounded-lg text-center text-[#12171A] p-1'>
                <BioType className='inter-body text-[#475D66]'>Overdue</BioType>
                <BioType className='inter-body'>{overdue_list.length}</BioType>
            </div>
            <div className='flex flex-col text-center text-[#12171A] p-1'>
                <BioType className='inter-body text-[#475D66]'>
                    Messages to Respond
                </BioType>
                <BioType className='inter-body'>
                    {data?.messageCount ?? 'Loading...'}
                </BioType>
            </div>
        </Paper>
    );
}
