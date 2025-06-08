'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { Paper } from '@mui/material';

interface Props {
    taskCount: number;
    employee_name: string;
}

export default function RNTaskTracker({ taskCount, employee_name }: Props) {
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
            className='flex flex-row max-w-[30%] min-h-[50px] bg-[#B2E8FF] justify-between items-center p-2 rounded-lg flex-shrink'
            sx={{ backgroundColor: '#B2E8FF' }}
        >
            <div className='flex flex-col text-center text-[#12171A] p-1'>
                <BioType className='inter-body text-[#475D66]'>
                    {employee_name}
                </BioType>
                <BioType className='inter-body'>{currentMonthYear()}</BioType>
            </div>
            {/* <div className='flex flex-col text-center text-[#12171A] p-1'>
                <BioType className='inter-body text-[#475D66]'>
                    Tasks Completed
                </BioType>
                <BioType className='inter-body'>bbb</BioType>
            </div> */}
            <div className='flex flex-col text-center text-[#12171A] p-1'>
                <BioType className='inter-body text-[#475D66]'>
                    Tasks in Queue
                </BioType>
                <BioType className='inter-body'>{taskCount}</BioType>
            </div>
            {/* <div className='flex flex-col bg-[#E5A7A8] rounded-lg text-center text-[#12171A] p-1'>
                <BioType className='inter-body text-[#475D66]'>Overdue</BioType>
                <BioType className='inter-body'>ddd</BioType>
            </div> */}
            {/* <div className='flex flex-col text-center text-[#12171A] p-1'>
                <BioType className='inter-body text-[#475D66]'>
                    Messages to Respond
                </BioType>
                <BioType className='inter-body'>eee</BioType>
            </div> */}
        </Paper>
    );
}
