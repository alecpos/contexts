'use client';
import {
    Button,
    Paper,
    FormControl,
    TextField,
    InputLabel,
    Select,
    MenuItem,
    SelectChangeEvent,
} from '@mui/material';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { BV_AUTH_TYPE } from '@/app/types/auth/authorization-types';
import LoadingScreen from '../../global-components/loading-screen/loading-screen';
import { AdminOrderDashboardFetch } from '@/app/utils/actions/admin/dashboard-scripts';
import Link from 'next/link';
import { RenewalOrderStatus } from '@/app/types/renewal-orders/renewal-orders-types';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { USStates } from '@/app/types/enums/master-enums';

import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import dayjs, { Dayjs } from 'dayjs';
import EscalateOrderDialog from './escalation/escalate-order-dialog';
import { EASYPOST_PHARMACIES } from '@/app/services/easypost/constants';

interface AllOrdersContainerProps {
    access_type: BV_AUTH_TYPE | null;
}

export default function AllOrdersPageContainer({
    access_type,
}: AllOrdersContainerProps) {
    // Pull order data
    const { data, isLoading } = useSWR('all-orders', () =>
        AdminOrderDashboardFetch()
    );

    const [showEscalateDialog, setShowEscalateDialog] =
        useState<boolean>(false);
    const [selectedRow, setSelectedRow] =
        useState<PatientOrderAdminDetails | null>(null);

    const [orderIdFilterValue, setOrderIdFilterValue] = useState('');
    const [stateFilterValue, setStateFilterValue] = useState<string>('');
    const [providerNameFilterValue, setProviderNameFilterValue] =
        useState<string>('');
    const [pharmacyNameFilterValue, setPharmacyNameFilterValue] =
        useState<string>('');
    const [patientIDFilterValue, setPatientIDFilterValue] =
        useState<string>('');
    const [drugNameFilterValue, setDrugNameFilterValue] = useState<string>('');
    const [shippingStatusFilterValue, setShippingStatusFilterValue] =
        useState<string>('');
    const [orderStatusFilterValue, setOrderStatusFilterValue] =
        useState<string>('');

    const [startingDateFilterValue, setStartingDateFilterValue] =
        useState<Date | null>(null);
    const [endingDateFilterValue, setEndingFilterValue] = useState<Date | null>(
        null
    );
    const [filteredOrders, setFilteredOrders] = useState<
        PatientOrderAdminDetails[]
    >([]);

    const [calculatedTurnAroundTime, setCalculatedTurnaroundTime] =
        useState<string>('0');

    const clearFilters = () => {
        if (data) {
            setFilteredOrders(data);

            setOrderIdFilterValue('');
            setStateFilterValue('');
            setProviderNameFilterValue('');
            setPharmacyNameFilterValue('');
            setPatientIDFilterValue('');
            setDrugNameFilterValue('');
            setShippingStatusFilterValue('');
            setOrderStatusFilterValue('');
            setStartingDateFilterValue(null);
            setEndingFilterValue(null);
        }
    };

    useEffect(() => {
        if (data && data.length > 0) {
            setFilteredOrders(data);
        }
    }, [data]);

    useEffect(() => {
        if (filteredOrders && filteredOrders.length > 0) {
            const newTurnaroundTime =
                calculateTurnAroundTime(filteredOrders).toFixed(2);
            setCalculatedTurnaroundTime(newTurnaroundTime);
        }
    }, [filteredOrders]);

    if (isLoading) {
        return <LoadingScreen />;
    }

    const applyFilters = () => {
        if (!data) {
            return;
        }
        let filteredOrders = data;

        if (stateFilterValue) {
            filteredOrders = filteredOrders.filter((order) =>
                String(order.state)
                    .toLowerCase()
                    .includes(stateFilterValue.toLowerCase())
            );
        }

        if (orderIdFilterValue) {
            filteredOrders = filteredOrders.filter((order) =>
                String(order.id)
                    .toLowerCase()
                    .includes(orderIdFilterValue.toLowerCase())
            );
        }

        if (providerNameFilterValue) {
            filteredOrders = filteredOrders.filter((order) =>
                String(order.providerName)
                    .toLowerCase()
                    .includes(providerNameFilterValue.toLowerCase())
            );
        }
        if (pharmacyNameFilterValue) {
            filteredOrders = filteredOrders.filter((order) =>
                String(order.pharmacy)
                    .toLowerCase()
                    .includes(pharmacyNameFilterValue)
            );
        }
        if (patientIDFilterValue) {
            filteredOrders = filteredOrders.filter((order) =>
                String(order.patientId)
                    .toLowerCase()
                    .includes(patientIDFilterValue)
            );
        }
        if (drugNameFilterValue) {
            filteredOrders = filteredOrders.filter((order) =>
                String(order.product_name)
                    .toLowerCase()
                    .includes(drugNameFilterValue)
            );
        }

        if (orderStatusFilterValue) {
            filteredOrders = filteredOrders.filter((order) => {
                return (
                    renderApprovalStatus(order.order_status) as string
                ).includes(orderStatusFilterValue);
            });
        }
        if (shippingStatusFilterValue) {
            filteredOrders = filteredOrders.filter((order) => {
                return (
                    order.shipping_status &&
                    order.shipping_status.includes(shippingStatusFilterValue)
                );
            });
        }
        if (startingDateFilterValue) {
            filteredOrders = filteredOrders.filter((order) => {
                const prescribedTime = order.prescribed_time;
                const createdAt = order.created_at;
                const filterDate = dayjs(startingDateFilterValue);

                if (prescribedTime) {
                    return dayjs(prescribedTime).isAfter(filterDate);
                } else {
                    return dayjs(createdAt).isAfter(filterDate);
                }
            });
        }

        if (endingDateFilterValue) {
            filteredOrders = filteredOrders.filter((order) => {
                const prescribedTime = order.prescribed_time;
                const createdAt = order.created_at;
                const endDate = dayjs(endingDateFilterValue);

                if (prescribedTime) {
                    return (
                        dayjs(prescribedTime).isBefore(endDate) ||
                        dayjs(prescribedTime).isSame(endDate)
                    );
                } else {
                    return (
                        dayjs(createdAt).isBefore(endDate) ||
                        dayjs(createdAt).isSame(endDate)
                    );
                }
            });
        }

        setFilteredOrders(filteredOrders);
    };

    const renderApprovalStatus = (status: string) => {
        switch (status) {
            case RenewalOrderStatus.CheckupComplete_Unprescribed_Unpaid:
            case RenewalOrderStatus.CheckupComplete_Unprescribed_Paid:
                return 'Review & Prescribe';
            case 'Unapproved-CardDown':
                return 'Pending Review';
            case 'Approved-CardDown':
                return 'Approved';
            case 'Pending Payment':
                return 'Payment Pending';
            case 'Denied-CardDown':
                return 'Order Denied';
            case 'Pending-Customer-Response':
                return 'Pending Customer Response';
            case 'Approved-PendingPayment':
                return 'Pending Payment';
            case 'Approved-NoCard':
                return 'Approved No Card';
            case 'Payment-Completed':
                return 'Payment Completed';
            case 'Payment-Declined':
                return 'Payment Declined';
            case 'Canceled':
                return 'Canceled';
            case 'Incomplete':
                return 'Incomplete';
            case 'Approved-NoCard-Finalized':
                return 'Approved No Card Finalized';
            case 'Approved-CardDown-Finalized':
                return 'Approved Card Down Finalized';
            case 'Order-Processing':
                return 'Order Processing';
            case 'Administrative-Cancel':
                return ' Administrative Cancel';
            case RenewalOrderStatus.PharmacyProcessing:
                return 'Sent to Pharmacy';
            default:
                return status;
        }
    };

    //Columns used for the datagrid
    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: 'ID',
            width: 100,
            sortable: false,
            renderCell: (params: any) => (
                <Link
                    href={`/provider/intakes/${params.value}`}
                    className='text-primary no-underline hover:underline'
                >
                    {params.value}
                </Link>
            ),
        },
        {
            field: 'pharmacy_id',
            headerName: 'Pharmacy Order ID',
            width: 130,
            sortable: false,
        },
        {
            field: 'providerName',
            headerName: 'Provider',
            width: 130,
            sortable: false,
        },
        {
            field: 'patientId',
            headerName: 'Patient ID',
            width: 130,
            sortable: false,
            renderCell: (params: any) => (
                <Link
                    href={`/provider/all-patients/${params.value}`}
                    className='text-primary no-underline hover:underline'
                >
                    {params.value}
                </Link>
            ),
        },
        { field: 'state', headerName: 'State', width: 50, sortable: false },
        {
            field: 'product_name',
            headerName: 'Drug Name',
            width: 170,
            sortable: false,
        },
        {
            field: 'pharmacy',
            headerName: 'Pharmacy',
            width: 110,
            sortable: false,
        },
        {
            field: 'order_status',
            headerName: 'Order Status',
            width: 130,
            sortable: false,
            valueGetter: (value: any, row: any) => renderApprovalStatus(value),
        },
        {
            field: 'amount_paid',
            headerName: 'Amount Paid',
            width: 110,
            sortable: false,
        },
        {
            field: 'shipping_status',
            headerName: 'Shipping Status',
            width: 110,
            sortable: false,
        },

        // {
        //     field: 'dateFulfilled',
        //     headerName: 'Date Fulfilled',
        //     width: 110,
        //     sortable: false,
        // },
        {
            field: 'processing_time',
            headerName: 'Processing Time',
            width: 130,
            sortable: false,
        },
        {
            field: 'tracking_number',
            headerName: 'Tracking Number',
            width: 130,
            sortable: false,
        },
        {
            field: 'prescribed_time',
            headerName: 'Prescribed At',
            width: 130,
            valueGetter: (value: any, row: any) => formatTimestamp(value),
        },

        // { field: 'updated', headerName: 'Updated', width: 130, sortable: false },
        {
            field: 'created_at',
            headerName: 'Created At',
            width: 130,
            valueGetter: (value: any, row: any) => formatTimestamp(value),
        },
        {
            field: 'is_escalated',
            headerName: 'Has been escalated?',
            width: 130,
            sortable: false,
            valueGetter: (value: any, row: any) => (value ? 'Elevated' : 'NA'),
        },
    ];

    const formatTimestamp = (timestamp: string) => {
        if (!timestamp || timestamp == null) {
            return '';
        }
        const date = new Date(timestamp); // Convert the timestamp string to a Date object
        const months = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
        ];
        const month = months[date.getMonth()]; // Get the month name
        const day = date.getDate(); // Get the day of the month
        const year = date.getFullYear(); // Get the full year
        const hours = date.getHours(); // Get the hours (0-23)
        const minutes = date.getMinutes(); // Get the minutes (0-59)
        const seconds = date.getSeconds(); // Get the seconds (0-59)
        const milliseconds = date.getMilliseconds(); // Get the milliseconds (0-999)

        // Format the date and time as "Month Day, Year Hours:Minutes:Seconds.Milliseconds Timestamp"
        const formattedDate = `${month} ${day}, ${year} ${hours}:${minutes}:${seconds}.${milliseconds}`;

        return formattedDate;
    };

    const calculateTurnAroundTime = (
        filteredOrders: PatientOrderAdminDetails[]
    ) => {
        // Filter out items where processing_time is not populated
        const populatedItems = filteredOrders.filter(
            (order) => order.processing_time != null
        );

        // Check if there are any populated items
        if (populatedItems.length === 0) {
            return 0; // Or handle as needed, e.g., throw an error or return null
        }

        // Calculate the average processing time
        const totalProcessingTime = populatedItems.reduce(
            (sum, item) => sum + item.processing_time!,
            0
        );
        const averageProcessingTime =
            totalProcessingTime / populatedItems.length;

        return averageProcessingTime;
    };

    const handleRowSelectionModelChange = (
        selectionModel: GridRowSelectionModel
    ) => {
        const selectedRowId = selectionModel[0];
        const rowData =
            filteredOrders.find((row) => row.id === selectedRowId) || null;
        setSelectedRow(rowData);
    };

    const handleButtonClick = () => {
        setShowEscalateDialog(true);
    };

    return (
        <>
            <Paper className='w-full p-4 min-h-[75vh]' elevation={3}>
                <div
                    id='profile-search-filter'
                    className='flex flex-col w-full'
                >
                    <div className='flex flex-col gap-4 mb-4'>
                        <div className='flex flex-row gap-4 '>
                            <FormControl className='flex flex-col gap-4'>
                                <div className='flex flex-row gap-5'>
                                    <TextField
                                        id='outlined-search'
                                        label='Order ID'
                                        type='search'
                                        value={orderIdFilterValue}
                                        onChange={(e) =>
                                            setOrderIdFilterValue(
                                                e.target.value
                                            )
                                        }
                                    />
                                    <TextField
                                        id='outlined-search'
                                        label='Provider first name'
                                        type='search'
                                        value={providerNameFilterValue}
                                        onChange={(e) =>
                                            setProviderNameFilterValue(
                                                e.target.value
                                            )
                                        }
                                    />
                                    <TextField
                                        id='outlined-search'
                                        label='Patient ID'
                                        type='search'
                                        value={patientIDFilterValue}
                                        onChange={(e) =>
                                            setPatientIDFilterValue(
                                                e.target.value
                                            )
                                        }
                                    />
                                    <TextField
                                        id='outlined-search'
                                        label='Drug name'
                                        type='search'
                                        value={drugNameFilterValue}
                                        onChange={(e) =>
                                            setDrugNameFilterValue(
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>
                                <div className=' flex'>
                                    <LocalizationProvider
                                        dateAdapter={AdapterDayjs}
                                    >
                                        <DatePicker
                                            label='Starting Date'
                                            value={startingDateFilterValue}
                                            onChange={(newValue) =>
                                                setStartingDateFilterValue(
                                                    newValue
                                                )
                                            }
                                        />
                                        <DatePicker
                                            label='Ending Date'
                                            value={endingDateFilterValue}
                                            onChange={(newValue) =>
                                                setEndingFilterValue(newValue)
                                            }
                                        />
                                    </LocalizationProvider>
                                </div>
                                {/* <div>
                                    <TextField
                                        id="outlined-search"
                                        label="Shipping Status"
                                        type="search"
                                    />
                                </div> */}
                            </FormControl>
                            <div className='flex flex-col gap-4'>
                                <Button
                                    variant='contained'
                                    onClick={applyFilters}
                                >
                                    Apply Filters
                                </Button>

                                <Button
                                    variant='outlined'
                                    onClick={clearFilters}
                                >
                                    Clear Filters
                                </Button>
                            </div>
                        </div>
                        <div className='flex flex-row gap-5'>
                            <FormControl fullWidth>
                                <InputLabel id='status-select-label'>
                                    Status
                                </InputLabel>
                                <Select
                                    labelId='status-select-label'
                                    id='demo-simple-select'
                                    value={orderStatusFilterValue}
                                    label='Order Status'
                                    onChange={(event: SelectChangeEvent) =>
                                        setOrderStatusFilterValue(
                                            event.target.value
                                        )
                                    }
                                >
                                    <MenuItem
                                        value={'Approved Card Down Finalized'}
                                    >
                                        Approved Card Down Finalized
                                    </MenuItem>
                                    <MenuItem value={'Sent to Pharmacy'}>
                                        Sent to Pharmacy
                                    </MenuItem>
                                </Select>
                            </FormControl>

                            <FormControl fullWidth>
                                <InputLabel id='shipping-status-select-label'>
                                    Shipping Status
                                </InputLabel>
                                <Select
                                    labelId='shipping-status-select-label'
                                    id='shipping-status-select'
                                    value={shippingStatusFilterValue}
                                    label='Shipping Status'
                                    onChange={(event: SelectChangeEvent) =>
                                        setShippingStatusFilterValue(
                                            event.target.value
                                        )
                                    }
                                >
                                    <MenuItem value={'Shipped'}>
                                        Shipped
                                    </MenuItem>
                                    <MenuItem value={'Delivered'}>
                                        Delivered
                                    </MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl fullWidth>
                                <InputLabel id='pharmacy-select-label'>
                                    Pharmacy
                                </InputLabel>
                                <Select
                                    labelId='dpharmacy-select-label'
                                    id='pharmacy-select'
                                    label='Pharmacy'
                                    value={pharmacyNameFilterValue}
                                    onChange={(event: SelectChangeEvent) =>
                                        setPharmacyNameFilterValue(
                                            event.target.value
                                        )
                                    }
                                >
                                    <MenuItem
                                        value={EASYPOST_PHARMACIES.CUREXA}
                                    >
                                        {EASYPOST_PHARMACIES.CUREXA}
                                    </MenuItem>
                                    {/* <MenuItem value={GOGO_MEDS_PHARMACY}>
                                        {GOGO_MEDS_PHARMACY}
                                    </MenuItem> */}
                                    <MenuItem value={EASYPOST_PHARMACIES.TMC}>
                                        {EASYPOST_PHARMACIES.TMC}
                                    </MenuItem>
                                    <MenuItem
                                        value={EASYPOST_PHARMACIES.EMPOWER}
                                    >
                                        {EASYPOST_PHARMACIES.EMPOWER}
                                    </MenuItem>
                                    <MenuItem
                                        value={EASYPOST_PHARMACIES.BELMAR}
                                    >
                                        {EASYPOST_PHARMACIES.BELMAR}
                                    </MenuItem>
                                    <MenuItem
                                        value={EASYPOST_PHARMACIES.HALLANDALE}
                                    >
                                        {EASYPOST_PHARMACIES.HALLANDALE}
                                    </MenuItem>
                                    <MenuItem
                                        value={EASYPOST_PHARMACIES.REVIVE}
                                    >
                                        {EASYPOST_PHARMACIES.REVIVE}
                                    </MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl fullWidth>
                                <InputLabel id='demo-simple-select-label'>
                                    State
                                </InputLabel>
                                <Select
                                    labelId='demo-simple-select-label'
                                    id='demo-simple-select'
                                    value={stateFilterValue}
                                    label='State'
                                    onChange={(event: SelectChangeEvent) => {
                                        setStateFilterValue(event.target.value);
                                    }}
                                >
                                    {Object.values(USStates).map(
                                        (stateCode) => (
                                            <MenuItem
                                                key={stateCode}
                                                value={stateCode}
                                            >
                                                {stateCode}
                                            </MenuItem>
                                        )
                                    )}
                                </Select>
                            </FormControl>
                        </div>
                    </div>
                </div>

                <div style={{ width: '100%', height: 'auto' }}>
                    <DataGrid
                        rows={filteredOrders}
                        columns={columns}
                        initialState={{
                            pagination: {
                                paginationModel: { page: 0, pageSize: 10 },
                            },
                        }}
                        pageSizeOptions={[10, 25, 50, 100]}
                        checkboxSelection
                        disableRowSelectionOnClick
                        onRowSelectionModelChange={
                            handleRowSelectionModelChange
                        }
                    />
                    {selectedRow &&
                        selectedRow !== null &&
                        (selectedRow.pharmacy == 'empower' ||
                            selectedRow.pharmacy == 'hallandale' ||
                            selectedRow.pharmacy == 'tmc') && (
                            <Button
                                onClick={handleButtonClick}
                                variant='contained'
                                color='primary'
                            >
                                Escalate Selected Row
                            </Button>
                        )}
                </div>
                <div className='flex justify-end'>
                    Average turnaround time: {calculatedTurnAroundTime} hours
                </div>
            </Paper>

            <EscalateOrderDialog
                open={showEscalateDialog}
                onClose={() => {
                    setShowEscalateDialog(false);
                    setSelectedRow(null);
                }}
                selectedRowData={selectedRow}
            />
        </>
    );
}
