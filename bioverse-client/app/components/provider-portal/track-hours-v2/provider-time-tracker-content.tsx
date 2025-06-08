'use client';

import React, { useState } from 'react';
import BioType from '../../global-components/bioverse-typography/bio-type/bio-type';
import {
    MenuItem,
    Select,
    Tabs,
    Tab,
    Checkbox,
    Button,
    Box,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import useSWR from 'swr';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
    fetchProviderAutomaticSessionLogData,
    fetchProviderActivityAuditCountsData,
    fetchProviderWeeklySummaryRowsData,
    fetchProviderEarningsBreakdownRowsData,
} from '@/app/utils/functions/provider-portal/time-tracker/provider-time-tracker-functions';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { Dayjs } from 'dayjs';
import ArrowBackIosNew from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIos from '@mui/icons-material/ArrowForwardIos';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Modal from '@mui/material/Modal';
import LoadingScreen from '@/app/components/global-components/loading-screen/loading-screen';
import { ProviderArrayItem } from '@/app/utils/functions/provider-portal/time-tracker/provider-time-tracker-types';

interface TimeTrackerContentProps {
    providerArray: ProviderArrayItem[];
}

const SessionHoursColumns: GridColDef[] = [
    { field: 'employeeName', headerName: 'Employee Name', width: 200 },
    { field: 'startTime', headerName: 'Start Time', width: 200 },
    { field: 'endTime', headerName: 'End Time', width: 200 },
    { field: 'sessionsDuration', headerName: 'Sessions Duration', width: 200 },
    { field: 'totalHoursDaily', headerName: 'Total Hours (Daily)', width: 200 },
];

const PerformanceColumns: GridColDef[] = [
    { field: 'employeeName', headerName: 'Employee Name', width: 200 },
    { field: 'hoursLogged', headerName: 'Hours Logged', width: 200 },
    { field: 'messagesAnswered', headerName: 'Messages Answered', width: 200 },
    { field: 'intakesCompleted', headerName: 'Intakes Completed', width: 200 },
    { field: 'fwdPercentage', headerName: 'Fwd. Percentage', width: 200 },
];

const WeeklySummaryColumns: GridColDef[] = [
    { field: 'employeeName', headerName: 'Employee Name', width: 200 },
    { field: 'hoursM', headerName: 'Hours (M)', width: 120 },
    { field: 'hoursT', headerName: 'Hours (Tu)', width: 120 },
    { field: 'hoursW', headerName: 'Hours (W)', width: 120 },
    { field: 'hoursTh', headerName: 'Hours (Th)', width: 120 },
    { field: 'hoursF', headerName: 'Hours (F)', width: 120 },
    { field: 'hoursSa', headerName: 'Hours (Sa)', width: 120 },
    { field: 'hoursSu', headerName: 'Hours (Su)', width: 120 },
    { field: 'weeklyTotal', headerName: 'Weekly Total', width: 200 },
    { field: 'weeklyEarnings', headerName: 'Weekly Earnings', width: 200 },
];

const earningsBreakdownModalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const CustomNoRowsOverlay = ({ isLoading }: { isLoading: boolean }) => {
    if (isLoading) {
        return <LoadingScreen />;
    }
    return (
        <div className='flex items-center justify-center h-full'>
            <p className='inter-basic text-[16px] text-gray-500'>No rows</p>
        </div>
    );
};

export default function TimeTrackerContent({
    providerArray,
}: TimeTrackerContentProps) {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    //non-admin providers will only be able to see their own data

    const [selectedProviderIds, setSelectedProviderIds] = useState<string[]>(
        []
    );

    const [selectedTab, setSelectedTab] = React.useState(0); //0 = sessions & hours, 1 = performance, 2 = weekly summary, 3 = earnings breakdown
    const [rows, setRows] = useState<any[]>([]);
    const [columns, setColumns] = useState<GridColDef[]>(SessionHoursColumns);
    const [startDate, setStartDate] = useState<Date>(() => {
        const today = new Date();
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);
        return sevenDaysAgo;
    });
    //for sessions & hours tab:
    const [selectedDateSessionsHoursTab, setSelectedDateSessionsHoursTab] =
        React.useState<Dayjs | null>(dayjs()); //for a single date picker (not a range)

    //for performance tab:
    const [
        selectedStartDatePerformanceTab,
        setSelectedStartDatePerformanceTab,
    ] = React.useState<Dayjs | null>(dayjs());
    const [selectedEndDatePerformanceTab, setSelectedEndDatePerformanceTab] =
        React.useState<Dayjs | null>(dayjs());

    //for weekly summary tab:
    const [
        selectedStartDateWeeklySummaryTab,
        setSelectedStartDateWeeklySummaryTab,
    ] = React.useState<Dayjs | null>(() => {
        const today = dayjs();
        const lastSunday = today.day() === 0 ? today : today.day(0); // If today is not Sunday, find the last Sunday
        return lastSunday.subtract(6, 'day'); // Go back to the previous Monday
    });
    //for weekly summary tab:
    const [
        selectedEndDateWeeklySummaryTab,
        setSelectedEndDateWeeklySummaryTab,
    ] = React.useState<Dayjs | null>(() => {
        const today = dayjs();
        return today.day() === 0 ? today : today.day(0); // If today is not Sunday, find the last Sunday
    });

    //for the earnings breakdown tab:
    const [
        selectedStartDateEarningsBreakdownTab,
        setSelectedStartDateEarningsBreakdownTab,
    ] = React.useState<Dayjs | null>(dayjs());
    const [
        selectedEndDateEarningsBreakdownTab,
        setSelectedEndDateEarningsBreakdownTab,
    ] = React.useState<Dayjs | null>(dayjs());
    const [openEarningsBreakdownModal, setOpenEarningsBreakdownModal] =
        React.useState(false);
    const [earningsBreakdownDetails, setEarningsBreakdownDetails] =
        React.useState<any>(null);
    const handleOpenEarningsBreakdownModal = () =>
        setOpenEarningsBreakdownModal(true);
    const handleCloseEarningsBreakdownModal = () =>
        setOpenEarningsBreakdownModal(false);

    //for weekly summary tab:
    const handleWeekRangeChange = (direction: 'left' | 'right') => {
        if (
            !selectedStartDateWeeklySummaryTab ||
            !selectedEndDateWeeklySummaryTab
        ) {
            return;
        }
        if (direction === 'left') {
            setSelectedStartDateWeeklySummaryTab(
                selectedStartDateWeeklySummaryTab?.subtract(7, 'day')
            );
            setSelectedEndDateWeeklySummaryTab(
                selectedEndDateWeeklySummaryTab?.subtract(7, 'day')
            );
        } else {
            setSelectedStartDateWeeklySummaryTab(
                selectedStartDateWeeklySummaryTab?.add(7, 'day')
            );
            setSelectedEndDateWeeklySummaryTab(
                selectedEndDateWeeklySummaryTab?.add(7, 'day')
            );
        }
    };

    const { data, isLoading, isValidating, mutate } = useSWR(
        selectedProviderIds.length > 0
            ? [
                  'provider-tracking-data',
                  selectedProviderIds,
                  selectedTab,
                  selectedDateSessionsHoursTab,
                  selectedStartDatePerformanceTab,
                  selectedEndDatePerformanceTab,
                  selectedStartDateWeeklySummaryTab,
                  selectedEndDateWeeklySummaryTab,
                  selectedStartDateEarningsBreakdownTab,
                  selectedEndDateEarningsBreakdownTab,
              ]
            : null,
        async () => {
            switch (selectedTab) {
                case 0:
                    //Sessions & Hours tab:
                    return await fetchProviderAutomaticSessionLogData({
                        selectedProviderIds,
                        selectedDateSessionsHoursTab:
                            selectedDateSessionsHoursTab?.toISOString() || null,
                        selectedTab,
                        array: providerArray,
                        timeZone,
                    });
                case 1:
                    //Performance tab:
                    return await fetchProviderActivityAuditCountsData({
                        selectedProviderIds,
                        selectedStartDatePerformanceTab:
                            selectedStartDatePerformanceTab?.toISOString() ||
                            null,
                        selectedEndDatePerformanceTab:
                            selectedEndDatePerformanceTab?.toISOString() ||
                            null,
                        selectedTab,
                        array: providerArray,
                        timeZone,
                    });
                case 2:
                    //Weekly Summary tab:
                    return await fetchProviderWeeklySummaryRowsData({
                        selectedProviderIds,
                        selectedStartDateWeeklySummaryTab:
                            selectedStartDateWeeklySummaryTab?.toISOString() ||
                            null,
                        selectedEndDateWeeklySummaryTab:
                            selectedEndDateWeeklySummaryTab?.toISOString() ||
                            null,
                        selectedTab,
                        array: providerArray,
                        timeZone,
                    });
                case 3:
                    //Earnings Breakdown tab:
                    return await fetchProviderEarningsBreakdownRowsData({
                        selectedProviderIds,
                        selectedStartDateEarningsBreakdownTab:
                            selectedStartDateEarningsBreakdownTab?.toISOString() ||
                            null,
                        selectedEndDateEarningsBreakdownTab:
                            selectedEndDateEarningsBreakdownTab?.toISOString() ||
                            null,
                        selectedTab,
                        array: providerArray,
                        timeZone,
                    });
                default:
                    return null;
            }
        }
    );

    // Update rows when data changes
    React.useEffect(() => {
        if (data && Array.isArray(data)) {
            setRows(data);
        }
    }, [data]);

    // Update mutateTrackingData to use the mutate function from SWR
    const mutateTrackingData = () => {
        mutate();
    };

    //for the earnings breakdown tab:
    const handleDetailsClick = (rowData: any) => {
        console.log('Details clicked for:', rowData);
        //open the modal with the details:
        setEarningsBreakdownDetails(rowData);
        handleOpenEarningsBreakdownModal();
    };

    const changeSelectedProvider = (value: string[]) => {
        if (value.length === 0) {
            setSelectedProviderIds([]);
            setRows([]);
        } else {
            setSelectedProviderIds(value);
        }
    };

    function a11yProps(index: number) {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setSelectedTab(newValue);
        setRows([]);
        switch (newValue) {
            case 0:
                setColumns(SessionHoursColumns);
                break;
            case 1:
                setColumns(PerformanceColumns);
                break;
            case 2:
                setColumns(WeeklySummaryColumns);
                break;
            case 3:
                setColumns(EarningsBreakdownColumns);
                break;
        }
        mutateTrackingData();
    };
    const paginationModel = { page: 0, pageSize: 100 };

    //these earning breakdown columns need to be in the component because the handleDetailsClick function is used:
    const EarningsBreakdownColumns: GridColDef[] = [
        { field: 'employeeName', headerName: 'Employee Name', width: 200 },
        { field: 'newIntakes', headerName: 'New Intakes $', width: 200 },
        { field: 'renewals', headerName: 'Renewals $', width: 200 },
        { field: 'checkins', headerName: 'Check-ins $', width: 200 },
        {
            field: 'providerMessages',
            headerName: 'Provider Messages $',
            width: 200,
        },
        {
            field: 'totalPayForPeriod',
            headerName: 'Total Pay for Period',
            width: 200,
        },
        {
            field: 'details',
            headerName: 'Details',
            flex: 1,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <div className='flex flex-col justify-center h-full'>
                    <div className='flex flex-row h-fit gap-2'>
                        <a
                            onClick={() => handleDetailsClick(params.row)}
                            className='cursor-pointer inter_body_small_bold flex flex-col justify-center items-center'
                        >
                            View details
                        </a>
                        <VisibilityIcon className='text-weak text-[20px]' />
                    </div>
                </div>
            ),
        },
    ];

    return (
        <div
            className='flex flex-col justify-center w-full pt-10 '
            style={{
                background:
                    'linear-gradient(to bottom,rgb(229, 242, 248), #ffffff)',
            }}
        >
            <div className='mx-4'>
                <div className='flex flex-row justify-between'>
                    <div className='flex flex-col'>
                        <BioType className='inter-h5-question-header font-bold'>
                            Provider Tracker
                        </BioType>
                        <div
                            id='provider-select'
                            className='flex flex-col pt-4 w-[450px] mb-[10px]'
                        >
                            <p className='inter-basic text-[16px]'>Team</p>
                            <Select
                                value={selectedProviderIds}
                                onChange={(e) => {
                                    if (e.target.value.includes('SELECT ALL')) {
                                        if (selectedProviderIds.length === providerArray.length) {
                                            setSelectedProviderIds([]); //handle if all providers are already selected
                                            setRows([]);
                                        } else {
                                            setSelectedProviderIds(providerArray.map((item) => item.id)); //add all provider ids to the selected provider ids array
                                        }
                                    } else {
                                        changeSelectedProvider(
                                            e.target.value as string[]
                                        );
                                    }
                                }}
                                multiple
                                displayEmpty
                                renderValue={(selected) => {
                                    if (selected.length === 0) {
                                        return (
                                            <span className='inter-basic text-[16px] text-gray-500'>
                                                Select provider
                                            </span>
                                        );
                                    }
                                    return (
                                        <p className='inter-basic text-[16px]'>
                                            {selected.length} providers selected
                                        </p>
                                    );
                                }}
                                sx={{
                                    borderRadius: '12px',
                                    padding: 0,
                                    '& .MuiOutlinedInput-input': {
                                        borderRadius: '12px',
                                    },
                                }}
                            >
                                <MenuItem value={'SELECT ALL'} key={'SELECT ALL'}>
                                    <Checkbox
                                        checked={selectedProviderIds.length === providerArray.length}
                                    
                                    />
                                    <span className='inter-basic text-[16px]'>
                                        Select all
                                    </span>
                                </MenuItem>
                                {providerArray.map((item) => {
                                    return (
                                        <MenuItem value={item.id} key={item.id}>
                                            <Checkbox
                                                checked={selectedProviderIds.includes(
                                                    item.id
                                                )}
                                            />
                                            <span className='inter-basic text-[16px]'>
                                                {item.name}
                                            </span>
                                        </MenuItem>
                                    );
                                })}
                            </Select>
                        </div>
                    </div>
                    <div className='flex flex-col'>
                        {selectedTab === 0 && (
                            <>
                                {/* single date picker for sessions & hours tab: */}
                                <p className='inter-basic text-[16px]'>Date</p>
                                <LocalizationProvider
                                    dateAdapter={AdapterDayjs}
                                >
                                    <DatePicker
                                        value={selectedDateSessionsHoursTab}
                                        onChange={(newValue) =>
                                            setSelectedDateSessionsHoursTab(
                                                newValue
                                            )
                                        }
                                        className='rounded-[12px]'
                                        sx={{
                                            '.MuiPickersToolbar-root': {
                                                color: '#1565c0',
                                                borderRadius: '14px',
                                                borderWidth: '1px',
                                                borderColor: '#2196f3',
                                                border: '1px solid',
                                                backgroundColor: '#90caf9',
                                            },
                                        }}
                                        slotProps={{
                                            textField: {
                                                sx: {
                                                    borderRadius: '14px',
                                                    '& .MuiOutlinedInput-root':
                                                        {
                                                            borderRadius:
                                                                '14px',
                                                        },
                                                },
                                            },
                                        }}
                                    />
                                </LocalizationProvider>
                            </>
                        )}
                        {selectedTab === 1 && (
                            <>
                                {/* double date picker for performance tab: */}
                                <div className='flex flex-row gap-4'>
                                    <div className='flex flex-col'>
                                        <p className='inter_body_regular text-weak mb-1'>
                                            Start Date
                                        </p>
                                        <LocalizationProvider
                                            dateAdapter={AdapterDayjs}
                                        >
                                            <DatePicker
                                                value={
                                                    selectedStartDatePerformanceTab
                                                }
                                                onChange={(newValue) =>
                                                    setSelectedStartDatePerformanceTab(
                                                        newValue
                                                    )
                                                }
                                                className='rounded-[12px]'
                                                slotProps={{
                                                    textField: {
                                                        sx: {
                                                            borderRadius:
                                                                '14px',
                                                            '& .MuiOutlinedInput-root':
                                                                {
                                                                    borderRadius:
                                                                        '14px',
                                                                },
                                                        },
                                                    },
                                                }}
                                            />
                                        </LocalizationProvider>
                                    </div>
                                    <div className='flex flex-col'>
                                        <p className='inter_body_regular text-weak mb-1'>
                                            End Date
                                        </p>
                                        <LocalizationProvider
                                            dateAdapter={AdapterDayjs}
                                        >
                                            <DatePicker
                                                value={
                                                    selectedEndDatePerformanceTab
                                                }
                                                onChange={(newValue) =>
                                                    setSelectedEndDatePerformanceTab(
                                                        newValue
                                                    )
                                                }
                                                className='rounded-[12px] '
                                                slotProps={{
                                                    textField: {
                                                        sx: {
                                                            borderRadius:
                                                                '14px',
                                                            '& .MuiOutlinedInput-root':
                                                                {
                                                                    borderRadius:
                                                                        '14px',
                                                                },
                                                        },
                                                    },
                                                }}
                                            />
                                        </LocalizationProvider>
                                    </div>
                                </div>
                            </>
                        )}
                        {selectedTab === 2 && (
                            <>
                                {/* single date picker for sessions & hours tab: */}
                                <div>
                                    <p className='inter_body_regular text-weak mb-1'>
                                        Week Date Range
                                    </p>

                                    <div
                                        className='flex flex-col justify-center items-center rounded-[12px] p-2 bg-white'
                                        style={{
                                            border: '1px solid rgb(13, 13, 13)',
                                        }}
                                    >
                                        <div className='flex flex-row inter_body_regular text-weak'>
                                            <div className='flex flex-col justify-center items-center mr-2'>
                                                <p>
                                                    {selectedStartDateWeeklySummaryTab
                                                        ? selectedStartDateWeeklySummaryTab.format(
                                                              'MMMM D, YYYY'
                                                          )
                                                        : ''}
                                                </p>
                                            </div>
                                            <div className='flex flex-col justify-center items-center'>
                                                <p>-</p>
                                            </div>
                                            <div className='flex flex-col justify-center items-center ml-2'>
                                                <p>
                                                    {selectedEndDateWeeklySummaryTab
                                                        ? selectedEndDateWeeklySummaryTab.format(
                                                              'MMMM D, YYYY'
                                                          )
                                                        : ''}
                                                </p>
                                            </div>
                                            <Button
                                                onClick={() =>
                                                    handleWeekRangeChange(
                                                        'left'
                                                    )
                                                }
                                            >
                                                <ArrowBackIosNew className='text-weak text-[18px]' />
                                            </Button>
                                            <Button
                                                onClick={() =>
                                                    handleWeekRangeChange(
                                                        'right'
                                                    )
                                                }
                                            >
                                                <ArrowForwardIos className='text-weak text-[18px] p-0' />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {selectedTab === 3 && (
                            <>
                                {/* double date picker for earnings breakdown tab: */}
                                <div className='flex flex-row gap-4'>
                                    <div className='flex flex-col'>
                                        <p className='inter_body_regular text-weak mb-1'>
                                            Start Date
                                        </p>
                                        <LocalizationProvider
                                            dateAdapter={AdapterDayjs}
                                        >
                                            <DatePicker
                                                value={
                                                    selectedStartDateEarningsBreakdownTab
                                                }
                                                onChange={(newValue) =>
                                                    setSelectedStartDateEarningsBreakdownTab(
                                                        newValue
                                                    )
                                                }
                                                className='rounded-[12px]'
                                                slotProps={{
                                                    textField: {
                                                        sx: {
                                                            borderRadius:
                                                                '14px',
                                                            '& .MuiOutlinedInput-root':
                                                                {
                                                                    borderRadius:
                                                                        '14px',
                                                                },
                                                        },
                                                    },
                                                }}
                                            />
                                        </LocalizationProvider>
                                    </div>
                                    <div className='flex flex-col'>
                                        <p className='inter_body_regular text-weak mb-1'>
                                            End Date
                                        </p>
                                        <LocalizationProvider
                                            dateAdapter={AdapterDayjs}
                                        >
                                            <DatePicker
                                                value={
                                                    selectedEndDateEarningsBreakdownTab
                                                }
                                                onChange={(newValue) =>
                                                    setSelectedEndDateEarningsBreakdownTab(
                                                        newValue
                                                    )
                                                }
                                                className='rounded-[12px] '
                                                slotProps={{
                                                    textField: {
                                                        sx: {
                                                            borderRadius:
                                                                '14px',
                                                            '& .MuiOutlinedInput-root':
                                                                {
                                                                    borderRadius:
                                                                        '14px',
                                                                },
                                                        },
                                                    },
                                                }}
                                            />
                                        </LocalizationProvider>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <Tabs
                    value={selectedTab}
                    onChange={handleChange}
                    aria-label='basic tabs example'
                >
                    <Tab
                        label={
                            <p className='inter-basic text-[16px] normal-case'>
                                Sessions & Hours
                            </p>
                        }
                        {...a11yProps(0)}
                    />
                    <Tab
                        label={
                            <p className='inter-basic text-[16px] normal-case'>
                                Performance
                            </p>
                        }
                        {...a11yProps(1)}
                    />
                    <Tab
                        label={
                            <p className='inter-basic text-[16px] normal-case'>
                                Weekly Summary
                            </p>
                        }
                        {...a11yProps(2)}
                    />
                    <Tab
                        label={
                            <p className='inter-basic text-[16px] normal-case'>
                                Earnings Breakdown
                            </p>
                        }
                        {...a11yProps(3)}
                    />
                </Tabs>

                <div className='flex flex-col pt-4  mt-[24px] mb-[10px] bg-white shadow-sm rounded-sm w-full '>
                    <p className='inter-basic font-bold text-[20px] ml-3'>
                        {selectedTab === 0
                            ? 'Sessions & Hours'
                            : selectedTab === 1
                            ? 'Performance'
                            : selectedTab === 2
                            ? 'Weekly Summary'
                            : 'Earnings Breakdown'}
                    </p>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        initialState={{ pagination: { paginationModel } }}
                        pageSizeOptions={[10, 100]}
                        checkboxSelection
                        sx={{ border: 0, fontFamily: 'Inter, sans-serif' }}
                        className='inter-basic text-[16px]'
                        style={{ minHeight: '500px' }}
                        slots={{
                            noRowsOverlay: () => (
                                <CustomNoRowsOverlay isLoading={isLoading || isValidating} />
                            ),
                        }}
                    />
                </div>
            </div>

            {/* earnings breakdown modal: */}
            <Modal
                open={openEarningsBreakdownModal}
                onClose={handleCloseEarningsBreakdownModal}
                aria-labelledby='modal-modal-title'
                aria-describedby='modal-modal-description'
            >
                <Box sx={earningsBreakdownModalStyle}>
                    <p className='inter_body_large_bold text-strong mb-2'>
                        Earnings Breakdown Details
                    </p>
                    <p className='inter_body_medium_regular text-weak mb-2'>
                        Provider: {earningsBreakdownDetails?.employeeName}
                    </p>
                    <p className='inter_body_medium_regular text-weak mb-5'>
                        {selectedStartDateEarningsBreakdownTab
                            ? selectedStartDateEarningsBreakdownTab.format(
                                  'MMMM D, YYYY'
                              )
                            : ''}{' '}
                        -{' '}
                        {selectedEndDateEarningsBreakdownTab
                            ? selectedEndDateEarningsBreakdownTab.format(
                                  'MMMM D, YYYY'
                              )
                            : ''}
                    </p>
                    <div className='grid grid-cols-2 gap-4 inter_body_medium_regular'>
                        <p>Intakes:</p>
                        <p>{earningsBreakdownDetails?.newIntakes}</p>
                        <p>Renewals:</p>
                        <p>{earningsBreakdownDetails?.renewals}</p>
                        <p>Check-ins:</p>
                        <p>{earningsBreakdownDetails?.checkins}</p>
                        <p>Provider Messages:</p>
                        <p>{earningsBreakdownDetails?.providerMessages}</p>
                    </div>
                </Box>
            </Modal>
        </div>
    );
}
