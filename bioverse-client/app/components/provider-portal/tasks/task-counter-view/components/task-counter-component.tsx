'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { Paper } from '@mui/material';
import useSWR from 'swr';
import { getAllTaskCounts } from '../functions/getAllTaskCount';

interface TaskCounterProps {
    userId: string;
}

export default function TaskCounterComponent({ userId }: TaskCounterProps) {
    const {
        data: countData,
        error: countDataError,
        isLoading: countIsLoading,
    } = useSWR(`task-count`, () => getAllTaskCounts());

    console.log('count data! ====== ', countData);

    const currentDate = () => {
        const curr_date = new Date();
        // Using toLocaleDateString to format the date to "month day, year" format
        // Options can be adjusted according to your locale preferences
        const formattedDate = curr_date.toLocaleDateString('default', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        });
        return formattedDate;
    };

    return (
        <>
            <Paper className='flex flex-row gap-2 min-h-[50px] rounded-lg bg-primary items-start p-2 justify-between'>
                <div className='flex flex-col text-center text-white p-1'>
                    <BioType className='it-subtitle'>{currentDate()}</BioType>
                </div>

                <div className='flex flex-col text-center text-white p-1'>
                    <BioType className='it-subtitle'>Intakes</BioType>
                    <BioType className='it-subtitle'>
                        {countIsLoading ? 'Loading...' : countData!.reviewCount}
                    </BioType>
                </div>

                <div className='flex flex-col text-center text-white p-1'>
                    <BioType className='it-subtitle'>Messages</BioType>
                    <BioType className='it-subtitle'>
                        {countIsLoading
                            ? 'Loading...'
                            : countData!.messageCount}
                    </BioType>
                </div>

                <div className='flex flex-col text-center text-white p-1'>
                    <BioType className='it-subtitle'>
                        Intakes Completed Today
                    </BioType>
                    <BioType className='it-subtitle'>
                        {countIsLoading
                            ? 'Loading...'
                            : countData!.dailyCompletionCount}
                    </BioType>
                </div>
            </Paper>
        </>
    );
}
