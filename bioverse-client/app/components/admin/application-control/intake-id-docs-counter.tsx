'use client';

import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useState } from 'react';
import BioType from '../../global-components/bioverse-typography/bio-type/bio-type';
import { Paper } from '@mui/material';
import useSWR from 'swr';
import { getIntakeWithIDCount } from '@/app/utils/database/controller/patient-status-tags/patient-status-tags-api';

interface IDDocsCounterProps {}

export default function IDDocsCounter({}: IDDocsCounterProps) {
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

    const { data, error } = useSWR(
        ['intake-id-count', startDate.toISOString(), endDate.toISOString()],
        () => getIntakeWithIDCount(startDate, endDate),
        {
            revalidateOnFocus: false, // Prevents refetch when window regains focus
            dedupingInterval: 5000, // Prevents multiple requests within 5 seconds
        }
    );

    return (
        <>
            <Paper className='flex flex-col p-2'>
                <div>
                    <BioType className='it-h1'>Intake ID Tracker</BioType>
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
                <div className='flex flex-col'>
                    <BioType className='itd-input'>
                        Total Intakes:{' '}
                        {data
                            ? (data.with_ID_count ?? 0) +
                              (data.no_ID_count ?? 0)
                            : 'Loading...'}
                    </BioType>
                    <BioType className='itd-input'>
                        Intakes With ID:{' '}
                        {data ? data.with_ID_count : 'Loading...'}
                    </BioType>
                    <BioType className='itd-input'>
                        Intakes Without ID:{' '}
                        {data ? data.no_ID_count : 'Loading...'}
                    </BioType>
                </div>
            </Paper>
        </>
    );
}
