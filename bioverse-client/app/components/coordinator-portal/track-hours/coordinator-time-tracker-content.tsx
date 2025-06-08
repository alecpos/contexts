'use client';

import { useEffect, useState } from 'react';
import BioType from '../../global-components/bioverse-typography/bio-type/bio-type';
import { MenuItem, Select, Tabs, Tab, Checkbox, Button } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import useSWR from 'swr';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { Dayjs } from 'dayjs';
import ArrowBackIosNew from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIos from '@mui/icons-material/ArrowForwardIos';
import LoadingScreen from '@/app/components/global-components/loading-screen/loading-screen';
import { CoordinatorTimeTrackerArrayItem } from '@/app/utils/functions/coordinator-portal/time-tracker/coordinator-time-tracker-types';
import {
    fetchCoordinatorActivityAuditCountsData,
    fetchCoordinatorAutomaticSessionLogData,
    fetchCoordinatorWeeklySummaryRowsData,
} from '@/app/utils/functions/coordinator-portal/time-tracker/coordinator-time-tracker-functions';

const SessionHoursColumns: GridColDef[] = [
    { field: 'employeeName', headerName: 'Employee Name', width: 200 },
    {
        field: 'startTime',
        headerName: 'Start Time',
        width: 200,
        renderCell: (params) =>
            !params.value ||
            params.value === '0' ||
            params.value === '0h 0m' ? (
                <span className='text-gray-400'>-</span>
            ) : (
                <span className='inter_body_regular'>{params.value}</span>
            ),
    },
    {
        field: 'endTime',
        headerName: 'End Time',
        width: 200,
        renderCell: (params) =>
            !params.value ||
            params.value === '0' ||
            params.value === '0h 0m' ? (
                <span className='text-gray-400'>-</span>
            ) : (
                <span className='inter_body_regular'>{params.value}</span>
            ),
    },
    {
        field: 'sessionsDuration',
        headerName: 'Sessions Duration',
        width: 200,
        renderCell: (params) =>
            !params.value ||
            params.value === '0' ||
            params.value === '0h 0m' ? (
                <span className='text-gray-400'>-</span>
            ) : (
                <span className='inter_body_regular'>{params.value}</span>
            ),
    },
    {
        field: 'totalHoursDaily',
        headerName: 'Total Hours (Daily)',
        width: 200,
        renderCell: (params) =>
            !params.value ||
            params.value === '0' ||
            params.value === '0h 0m' ? (
                <span className='text-gray-400'>-</span>
            ) : (
                <span className='inter_body_regular'>{params.value}</span>
            ),
    },
];

const PerformanceColumns: GridColDef[] = [
    { field: 'employeeName', headerName: 'Employee Name', width: 200 },
    {
        field: 'hoursLogged',
        headerName: 'Hours Logged',
        width: 200,
        renderCell: (params) =>
            !params.value ||
            params.value === '0' ||
            params.value === '0h 0m' ? (
                <span className='text-gray-400'>-</span>
            ) : (
                <span className='inter_body_regular'>{params.value}</span>
            ),
    },
    {
        field: 'messagesAnswered',
        headerName: 'Messages Answered',
        width: 200,
        renderCell: (params) =>
            !params.value ||
            params.value === '0' ||
            params.value === '0h 0m' ? (
                <span className='text-gray-400'>-</span>
            ) : (
                <span className='inter_body_regular'>{params.value}</span>
            ),
    },
    {
        field: 'fwdPercentage',
        headerName: 'Fwd. Percentage',
        width: 200,
        renderCell: (params) =>
            !params.value ||
            params.value === '0' ||
            params.value === '0h 0m' ? (
                <span className='text-gray-400'>-</span>
            ) : (
                <span className='inter_body_regular'>{params.value}</span>
            ),
    },
];

const WeeklySummaryColumns: GridColDef[] = [
    { field: 'employeeName', headerName: 'Employee Name', width: 200 },
    {
        field: 'hoursM',
        headerName: 'Hours (M)',
        width: 120,
        renderCell: (params) =>
            !params.value ||
            params.value === '0' ||
            params.value === '0h 0m' ? (
                <span className='text-gray-400'>-</span>
            ) : (
                <span className='inter_body_regular'>{params.value}</span>
            ),
    },
    {
        field: 'hoursT',
        headerName: 'Hours (Tu)',
        width: 120,
        renderCell: (params) =>
            !params.value ||
            params.value === '0' ||
            params.value === '0h 0m' ? (
                <span className='text-gray-400'>-</span>
            ) : (
                <span className='inter_body_regular'>{params.value}</span>
            ),
    },
    {
        field: 'hoursW',
        headerName: 'Hours (W)',
        width: 120,
        renderCell: (params) =>
            !params.value ||
            params.value === '0' ||
            params.value === '0h 0m' ? (
                <span className='text-gray-400'>-</span>
            ) : (
                <span className='inter_body_regular'>{params.value}</span>
            ),
    },
    {
        field: 'hoursTh',
        headerName: 'Hours (Th)',
        width: 120,
        renderCell: (params) =>
            !params.value ||
            params.value === '0' ||
            params.value === '0h 0m' ? (
                <span className='text-gray-400'>-</span>
            ) : (
                <span className='inter_body_regular'>{params.value}</span>
            ),
    },
    {
        field: 'hoursF',
        headerName: 'Hours (F)',
        width: 120,
        renderCell: (params) =>
            !params.value ||
            params.value === '0' ||
            params.value === '0h 0m' ? (
                <span className='text-gray-400'>-</span>
            ) : (
                <span className='inter_body_regular'>{params.value}</span>
            ),
    },
    {
        field: 'hoursSa',
        headerName: 'Hours (Sa)',
        width: 120,
        renderCell: (params) =>
            !params.value ||
            params.value === '0' ||
            params.value === '0h 0m' ? (
                <span className='text-gray-400'>-</span>
            ) : (
                <span className='inter_body_regular'>{params.value}</span>
            ),
    },
    {
        field: 'hoursSu',
        headerName: 'Hours (Su)',
        width: 120,
        renderCell: (params) =>
            !params.value ||
            params.value === '0' ||
            params.value === '0h 0m' ? (
                <span className='text-gray-400'>-</span>
            ) : (
                <span className='inter_body_regular'>{params.value}</span>
            ),
    },
    {
        field: 'weeklyTotal',
        headerName: 'Weekly Total',
        width: 200,
        renderCell: (params) =>
            !params.value ||
            params.value === '0' ||
            params.value === '0h 0m' ? (
                <span className='text-gray-400'>-</span>
            ) : (
                <span className='inter_body_regular'>{params.value}</span>
            ),
    },
    {
        field: 'weeklyEarnings',
        headerName: 'Weekly Earnings',
        width: 200,
        renderCell: (params) =>
            !params.value ||
            params.value === '0' ||
            params.value === '0h 0m' ? (
                <span className='text-gray-400'>-</span>
            ) : (
                <span className='inter_body_regular'>{params.value}</span>
            ),
    },
];

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

interface TimeTrackerContentProps {
    coordinatorArray: CoordinatorTimeTrackerArrayItem[];
}

export default function CoordaintorTimeTrackerContent({
    coordinatorArray,
}: TimeTrackerContentProps) {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const [selectedCoordinatorIds, setSelectedCoordinatorIds] = useState<
        string[]
    >([]);

    const [selectedTab, setSelectedTab] = useState(0); //0 = sessions & hours, 1 = performance, 2 = weekly summary
    const [rows, setRows] = useState<any[]>([]);
    const [columns, setColumns] = useState<GridColDef[]>(SessionHoursColumns);
    //for sessions & hours tab:
    const [selectedDateSessionsHoursTab, setSelectedDateSessionsHoursTab] =
        useState<Dayjs | null>(dayjs()); //for a single date picker (not a range)

    //for performance tab:
    const [
        selectedStartDatePerformanceTab,
        setSelectedStartDatePerformanceTab,
    ] = useState<Dayjs | null>(dayjs());
    const [selectedEndDatePerformanceTab, setSelectedEndDatePerformanceTab] =
        useState<Dayjs | null>(dayjs());

    //for weekly summary tab:
    const [
        selectedStartDateWeeklySummaryTab,
        setSelectedStartDateWeeklySummaryTab,
    ] = useState<Dayjs | null>(() => {
        const today = dayjs();
        const lastSunday = today.day() === 0 ? today : today.day(0); // If today is not Sunday, find the last Sunday
        return lastSunday.subtract(6, 'day'); // Go back to the previous Monday
    });
    //for weekly summary tab:
    const [
        selectedEndDateWeeklySummaryTab,
        setSelectedEndDateWeeklySummaryTab,
    ] = useState<Dayjs | null>(() => {
        const today = dayjs();
        return today.day() === 0 ? today : today.day(0); // If today is not Sunday, find the last Sunday
    });

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
        selectedCoordinatorIds.length > 0
            ? [
                  'coordinator-tracking-data',
                  selectedCoordinatorIds,
                  selectedTab,
                  selectedDateSessionsHoursTab?.toISOString(),
                  selectedStartDatePerformanceTab?.toISOString(),
                  selectedEndDatePerformanceTab?.toISOString(),
                  selectedStartDateWeeklySummaryTab?.toISOString(),
                  selectedEndDateWeeklySummaryTab?.toISOString(),
              ]
            : null,
        async () => {
            switch (selectedTab) {
                case 0:
                    return await fetchCoordinatorAutomaticSessionLogData({
                        selectedCoordinatorIds,
                        selectedDateSessionsHoursTab:
                            selectedDateSessionsHoursTab?.toISOString() || null,
                        selectedTab,
                        array: coordinatorArray,
                        timeZone,
                    });
                case 1:
                    return await fetchCoordinatorActivityAuditCountsData({
                        selectedCoordinatorIds,
                        selectedStartDatePerformanceTab:
                            selectedStartDatePerformanceTab?.toISOString() ||
                            null,
                        selectedEndDatePerformanceTab:
                            selectedEndDatePerformanceTab?.toISOString() ||
                            null,
                        selectedTab,
                        array: coordinatorArray,
                        timeZone,
                    });
                case 2:
                    return await fetchCoordinatorWeeklySummaryRowsData({
                        selectedCoordinatorIds,
                        selectedStartDateWeeklySummaryTab:
                            selectedStartDateWeeklySummaryTab?.toISOString() ||
                            null,
                        selectedEndDateWeeklySummaryTab:
                            selectedEndDateWeeklySummaryTab?.toISOString() ||
                            null,
                        selectedTab,
                        array: coordinatorArray,
                        timeZone,
                    });

                default:
                    return null;
            }
        }
    );

    // Update rows when data changes
    useEffect(() => {
        if (data && Array.isArray(data)) {
            setRows(data);
        }
    }, [data]);

    // Update mutateTrackingData to use the mutate function from SWR
    const mutateTrackingData = () => {
        mutate();
    };

    const changeSelectedCoordinator = (value: string[]) => {
        if (value.length === 0) {
            setSelectedCoordinatorIds([]);
            setRows([]);
        } else {
            setSelectedCoordinatorIds(value);
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
        }
        mutateTrackingData();
    };
    const paginationModel = { page: 0, pageSize: 10 };

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
                            Coordinator Tracker
                        </BioType>
                        <div
                            id='coordinator-select'
                            className='flex flex-col pt-4 w-[450px] mb-[10px]'
                        >
                            <p className='inter-basic text-[16px]'>Team</p>
                            <Select
                                value={selectedCoordinatorIds}
                                onChange={(e) => {
                                    changeSelectedCoordinator(
                                        e.target.value as string[]
                                    );
                                }}
                                multiple
                                displayEmpty
                                renderValue={(selected) => {
                                    if (selected.length === 0) {
                                        return (
                                            <span className='inter-basic text-[16px] text-gray-500'>
                                                Select coordinator
                                            </span>
                                        );
                                    }
                                    return (
                                        <p className='inter-basic text-[16px]'>
                                            {selected.length} coordinators
                                            selected
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
                                {coordinatorArray.map((item) => {
                                    return (
                                        <MenuItem value={item.id} key={item.id}>
                                            <Checkbox
                                                checked={selectedCoordinatorIds.includes(
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
                        pageSizeOptions={[5, 10]}
                        checkboxSelection
                        sx={{ border: 0, fontFamily: 'Inter, sans-serif' }}
                        className='inter-basic text-[16px]'
                        style={{ minHeight: '500px' }}
                        slots={{
                            noRowsOverlay: () => (
                                <CustomNoRowsOverlay isLoading={isLoading} />
                            ),
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
