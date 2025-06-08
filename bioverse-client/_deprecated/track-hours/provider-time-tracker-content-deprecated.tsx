'use client';

import React, { useCallback, useEffect, useState } from 'react';
import BioType from '../../global-components/bioverse-typography/bio-type/bio-type';
import {
    MenuItem,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
} from '@mui/material';
import useSWR from 'swr';
import {
    getProviderSessionLog,
    getProviderAutomaticSessionLog,
} from '@/app/utils/functions/provider-portal/time-tracker/provider-time-tracker-functions';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { getProviderEstimatedPaymentBetweenDatesV2Verbose } from '@/app/utils/database/controller/provider_activity_audit/provider_activity_audit-api';

interface TimeTrackerContentProps {
    loggedInUserAuthorization: string | null;
}

const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
};

const calculateDuration = (start: number, end: number) => {
    const durationMs = end - start;
    const hours = Math.floor(durationMs / 3600000);
    const minutes = Math.floor((durationMs % 3600000) / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
};

export default function TimeTrackerContent({
    loggedInUserAuthorization,
}: TimeTrackerContentProps) {
    const [selectedProviderId, setSelectedProviderId] =
        useState<string>('none');

    //initialize start and end date to be 7 days ago and today
    const [startDate, setStartDate] = useState<Date>(() => {
        const today = new Date();
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);
        return sevenDaysAgo;
    });
    const [endDate, setEndDate] = useState<Date>(new Date());

    //useState to store the provider session log based on the provider clicking 'start session' and 'end session' buttons
    const [tableData, setTableData] = useState<TableArrayEntry[] | undefined>(
        undefined
    );

    //useState to store the provider automatic session log based on the 'logged_in' and 'logged_out' actions in the provider_activity_audit table
    const [automaticSessionTableData, setAutomaticSessionTableData] = useState<
        TableArrayEntry[] | undefined
    >(undefined);

    const [providerPayThisMonth, setProviderPayThisMonth] = useState<{
        intakesHandled: number;
        renewalsHandled: number;
        checkinsHandled: number;
        messagesAnswered: number;
        totalPayInPeriod: number;
    } | null>(null);

    //fetch provider session log based on the provider clicking 'start session' and 'end session' buttons
    const fetchProviderSessionLog = useCallback(async () => {
        if (selectedProviderId !== 'none') {
            const startDateMs = startDate.getTime();
            const endDateMs = endDate.getTime();

            return await getProviderSessionLog(
                selectedProviderId,
                startDateMs,
                endDateMs
            );
        }
        return null;
    }, [selectedProviderId, startDate, endDate]);
    const { data, isLoading, isValidating, mutate } = useSWR(
        selectedProviderId !== 'none'
            ? ['provider-session-array', selectedProviderId, startDate, endDate]
            : null,
        fetchProviderSessionLog
    );
    //end of code to fetch provider session log based on the provider clicking 'start session' and 'end session' buttons

    //fetch provider automatic session log based on the 'logged_in' and 'logged_out' actions in the provider_activity_audit table
    const fetchProviderAutomaticSessionLog = useCallback(async () => {
        if (selectedProviderId !== 'none') {
            const startDateMs = startDate.getTime();
            const endDateMs = endDate.getTime();

            return await getProviderAutomaticSessionLog(
                selectedProviderId,
                startDateMs,
                endDateMs
            );
        }
        return null;
    }, [selectedProviderId, startDate, endDate]);
    const {
        data: automaticSessionData,
        isLoading: automaticSessionLoading,
        isValidating: automaticSessionValidating,
        mutate: automaticSessionMutate,
    } = useSWR(
        selectedProviderId !== 'none'
            ? [
                  'provider-automatic-session-array',
                  selectedProviderId,
                  startDate,
                  endDate,
              ]
            : null,
        fetchProviderAutomaticSessionLog
    );
    //end of code to fetch provider automatic session log based on the 'logged_in' and 'logged_out' actions in the provider_activity_audit table

    useEffect(() => {
        if (data) {
            setTableData(data);
        } else {
            setTableData(undefined);
        }

        if (automaticSessionData) {
            setAutomaticSessionTableData(automaticSessionData);
        } else {
            setAutomaticSessionTableData(undefined);
        }
    }, [data, automaticSessionData]);

    //useEffect to fetch provider pay this month
    useEffect(() => {
        if (selectedProviderId === 'none') {
            return;
        }

        const fetchProviderPay = async () => {
            const { start_date: first_day_of_month, end_date } =
                getStartAndEndDate();

            try {
                const totalPayInPeriod =
                    await getProviderEstimatedPaymentBetweenDatesV2Verbose(
                        selectedProviderId,
                        first_day_of_month,
                        end_date
                    );
                setProviderPayThisMonth(totalPayInPeriod);
            } catch (error) {
                console.error('Error fetching provider payment:', error);
            }
        };

        fetchProviderPay();
    }, [selectedProviderId]);

    const changeSelectedProvider = (value: string) => {
        setSelectedProviderId(value);
    };

    if (!isLoading && !isValidating) {
        console.log('fetched: ', data);
    } else {
        console.log('validation happening');
    }

    //calculate total hours in period for self reported session log
    const calculateTotalHours = () => {
        if (!tableData || tableData.length === 0) return '0h 0m';

        const totalMilliseconds = tableData.reduce((total, entry) => {
            return (
                total +
                (entry.end_session_timestamp - entry.start_session_timestamp)
            );
        }, 0);

        const totalHours = Math.floor(totalMilliseconds / 3600000);
        const totalMinutes = Math.floor((totalMilliseconds % 3600000) / 60000);

        return `${totalHours}h ${totalMinutes}m`;
    };

    //calculate total hours in period for automatic session log
    const calculateTotalHoursAutomatic = () => {
        if (
            !automaticSessionTableData ||
            automaticSessionTableData.length === 0
        )
            return '0h 0m';

        const totalMilliseconds = automaticSessionTableData.reduce(
            (total, entry) => {
                return (
                    total +
                    (entry.end_session_timestamp -
                        entry.start_session_timestamp)
                );
            },
            0
        );

        const totalHours = Math.floor(totalMilliseconds / 3600000);
        const totalMinutes = Math.floor((totalMilliseconds % 3600000) / 60000);

        return `${totalHours}h ${totalMinutes}m`;
    };

    return (
        <div className='flex flex-col w-full items-center justify-center mt-32 '>
            <Paper className='flex flex-col w-[80%] p-4 '>
                {loggedInUserAuthorization === 'admin' && (
                    <Button
                        variant='contained'
                        color='primary'
                        className='w-fit mb-4 bounce'
                        onClick={() =>
                            window.open('/provider/track-hours-v2', '_blank')
                        }
                        sx={{
                            backgroundColor: 'green',
                            color: '#FFFFFF',
                            '&:hover': {
                                backgroundColor: '#000000',
                            },
                        }}
                    >
                        Go to Version 2
                    </Button>
                )}
                <BioType className='itd-h1'>Track Provider Hours:</BioType>

                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <div className='flex flex-row space-x-4 p-4'>
                        <div className='flex flex-col'>
                            <BioType className='itd-body'>Start Date:</BioType>
                            <DatePicker
                                value={startDate}
                                onChange={(newValue) => {
                                    if (newValue) setStartDate(newValue);
                                }}
                            />
                        </div>
                        <div className='flex flex-col'>
                            <BioType className='itd-body'>End Date:</BioType>
                            <DatePicker
                                value={endDate}
                                onChange={(newValue) => {
                                    if (newValue) setEndDate(newValue);
                                }}
                            />
                        </div>
                    </div>
                </LocalizationProvider>

                <div className='flex flex-row space-x-4 p-4'>
                    <div
                        id='provider-select'
                        className='flex flex-col p-4 w-[450px]'
                    >
                        <BioType className='itd-body'>Select Provider:</BioType>
                        <Select
                            value={selectedProviderId}
                            variant='standard'
                            onChange={(e) => {
                                changeSelectedProvider(e.target.value);
                            }}
                        >
                            <MenuItem value={'none'} disabled>
                                Select Provider
                            </MenuItem>
                            {providerArray.map((item) => {
                                return (
                                    <MenuItem value={item.id} key={item.id}>
                                        {item.name}
                                    </MenuItem>
                                );
                            })}
                        </Select>
                    </div>
                    {loggedInUserAuthorization === 'admin' && (
                        <div className=' bg-white rounded-xl shadow-lg p-6 border border-slate-200 w-[450px]'>
                            <div className='mb-4'>
                                <span className='text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full'>
                                    Admin View Only
                                </span>
                            </div>

                            <div className='space-y-4'>
                                <div className='flex justify-between items-center border-b border-slate-100 pb-4'>
                                    <h3 className='text-xl font-semibold text-slate-800'>
                                        Total Pay This Month
                                    </h3>
                                    <span className='text-2xl font-bold text-emerald-600'>
                                        $
                                        {providerPayThisMonth?.totalPayInPeriod.toFixed(
                                            2
                                        )}
                                    </span>
                                </div>

                                <div className='grid gap-3'>
                                    <div className='flex justify-between items-center p-3 bg-slate-50 rounded-lg'>
                                        <span className='text-slate-600'>
                                            New Intakes
                                        </span>
                                        <span className='font-medium text-slate-800'>
                                            $
                                            {providerPayThisMonth?.intakesHandled.toFixed(
                                                2
                                            )}
                                        </span>
                                    </div>

                                    <div className='flex justify-between items-center p-3 bg-slate-50 rounded-lg'>
                                        <span className='text-slate-600'>
                                            Renewals
                                        </span>
                                        <span className='font-medium text-slate-800'>
                                            $
                                            {providerPayThisMonth?.renewalsHandled.toFixed(
                                                2
                                            )}
                                        </span>
                                    </div>

                                    <div className='flex justify-between items-center p-3 bg-slate-50 rounded-lg'>
                                        <span className='text-slate-600'>
                                            Check-ins
                                        </span>
                                        <span className='font-medium text-slate-800'>
                                            $
                                            {providerPayThisMonth?.checkinsHandled.toFixed(
                                                2
                                            )}
                                        </span>
                                    </div>

                                    <div className='flex justify-between items-center p-3 bg-slate-50 rounded-lg'>
                                        <span className='text-slate-600'>
                                            Provider Messages
                                        </span>
                                        <span className='font-medium text-slate-800'>
                                            $
                                            {providerPayThisMonth?.messagesAnswered.toFixed(
                                                2
                                            )}
                                        </span>
                                    </div>
                                </div>

                                <div className='pt-4 mt-4 border-t border-slate-100'>
                                    <span className='text-sm text-slate-500'>
                                        Provider ID:{' '}
                                        <span className='font-mono'>
                                            {selectedProviderId}
                                        </span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className='flex flex-row space-x-4 p-4'>
                    {/* Self Reported Session Log */}
                    <div className='flex p-4 bg-slate-100 rounded-lg shadow-md'>
                        {tableData && tableData.length > 0 ? (
                            <div className='flex flex-col'>
                                <p className='text-lg text-center text-slate-500'>
                                    Self Reported
                                </p>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>
                                                    Start Time
                                                </TableCell>
                                                <TableCell>End Time</TableCell>
                                                <TableCell>Duration</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {tableData.map((entry, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>
                                                        {formatDate(
                                                            entry.start_session_timestamp
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {formatDate(
                                                            entry.end_session_timestamp
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {calculateDuration(
                                                            entry.start_session_timestamp,
                                                            entry.end_session_timestamp
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                {tableData && tableData.length > 0 && (
                                    <div className='flex justify-end p-4 mr-20'>
                                        <BioType className='itd-body'>
                                            Total Hours: {calculateTotalHours()}
                                        </BioType>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <BioType className='itd-body'>
                                No data available
                            </BioType>
                        )}
                    </div>

                    {/* Automatic Session Log */}
                    {loggedInUserAuthorization === 'admin' && (
                        <div className='flex p-4 bg-cyan-100 rounded-lg shadow-md'>
                            {automaticSessionTableData &&
                            automaticSessionTableData.length > 0 ? (
                                <div className='flex flex-col'>
                                    <p className='text-lg text-center text-slate-500'>
                                        Automatic (only visible to admins)
                                    </p>
                                    <TableContainer>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>
                                                        Start Time
                                                    </TableCell>
                                                    <TableCell>
                                                        End Time
                                                    </TableCell>
                                                    <TableCell>
                                                        Duration
                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {automaticSessionTableData.map(
                                                    (entry, index) => (
                                                        <TableRow key={index}>
                                                            <TableCell>
                                                                {formatDate(
                                                                    entry.start_session_timestamp
                                                                )}
                                                            </TableCell>
                                                            <TableCell>
                                                                {formatDate(
                                                                    entry.end_session_timestamp
                                                                )}
                                                            </TableCell>
                                                            <TableCell>
                                                                {calculateDuration(
                                                                    entry.start_session_timestamp,
                                                                    entry.end_session_timestamp
                                                                )}
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                )}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    {automaticSessionTableData &&
                                        automaticSessionTableData.length >
                                            0 && (
                                            <div className='flex justify-end p-4 mr-20'>
                                                <BioType className='itd-body'>
                                                    Total Hours:{' '}
                                                    {calculateTotalHoursAutomatic()}
                                                </BioType>
                                            </div>
                                        )}
                                </div>
                            ) : (
                                <BioType className='itd-body'>
                                    No data available
                                </BioType>
                            )}
                        </div>
                    )}
                </div>
            </Paper>
        </div>
    );
}

interface TableArrayEntry {
    start_session_timestamp: number;
    end_session_timestamp: number;
    session_time: number;
}

interface ProviderArrayItem {
    id: string;
    name: string;
    role: 'provider' | 'coordinator' | 'admin';
}

const providerArray: ProviderArrayItem[] = [
    // {
    //     id: '025668ab-3f9e-4839-a0c5-75790305cfe9',
    //     name: 'Nathan Cho',
    //     role: 'admin',
    // },
    {
        id: '24138d35-e26f-4113-bcd9-7f275c4f9a47',
        name: 'Maylin Chen',
        role: 'provider',
    },
    {
        id: '3bc131b7-b978-4e21-8fbc-73809ee9fcce',
        name: 'Lea Thomas',
        role: 'provider',
    },
    {
        id: '84e3e542-6dba-4826-9e64-fab60ac64eed',
        name: 'Morgan Edwards',
        role: 'provider',
    },
    {
        id: 'c39ca73e-a750-4be1-a098-af7e6d72d508',
        name: 'Kathy Agiri',
        role: 'provider',
    },
    {
        id: '28e2a459-2805-425f-96f3-a3d7f39c0528',
        name: 'Kristin Curcio',
        role: 'provider',
    },
    {
        id: 'da5b213d-7676-4792-bc73-11151d0da4e6',
        name: 'Amanda Little',
        role: 'provider',
    },
    {
        id: 'e622a415-8adc-426e-a03c-96e726007f4e',
        name: 'Lauren Dulay',
        role: 'provider',
    },
    {
        id: '4412dafa-cccc-4539-a46f-f8f594f0ad21',
        name: 'Dave Biederman',
        role: 'provider',
    },
    {
        id: '71ae1ee2-5c2b-4f78-a4a4-9d30e6dfad71',
        name: 'Nicole Jackson',
        role: 'provider',
    },
    {
        id: 'b34211ca-fc99-4aac-a8eb-f7e3eebaeb9a',
        name: 'Michelle Igori',
        role: 'provider',
    },
    {
        id: '7cf6a976-fce4-443e-be9c-f265adfb67e7',
        name: 'Kayla Doran',
        role: 'provider',
    },
];

function getStartAndEndDate(): { start_date: string; end_date: string } {
    const now = new Date();
    const start_date = new Date(now.getFullYear(), now.getMonth(), 1); // First day of the current month
    const end_date = now; // Current date

    return {
        start_date: getFormattedDate(start_date),
        end_date: getFormattedDate(end_date),
    };
}

function getFormattedDate(date: Date): string {
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}-${day}-${year}`;
}
