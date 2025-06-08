'use client';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { getDateHourDifference } from '@/app/utils/functions/dates';
import CloseIcon from '@mui/icons-material/Close';
import {
    TableContainer,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    Input,
    Snackbar,
    IconButton,
    SnackbarContent,
} from '@mui/material';
import { SetStateAction, useEffect, useState } from 'react';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { updateExistingOrderStatusUsingId } from '@/app/utils/database/controller/orders/orders-api';
import BioverseSnackbarMessage from '@/app/components/global-components/snackbar/bioverse-snackbar';
import { insertAuditIntoAdministrativeCancelTable } from '@/app/utils/database/controller/admin_order_cancel_audit/admin-order-cancel-audit';
import AdminFilter from './admin-order-filter';
import { getAdminOrderManagementData } from '@/app/utils/database/api-controller/order_management/admin-order-management';
import { prescriptionRequestToAdminDashboard } from './admin-parser';

interface Props {}

export default function AdministratorOrderTable({}: Props) {
    const [listUpdater, setListUpdater] = useState<boolean>(false);
    const [filteredOrders, setFilteredOrders] =
        useState<PatientOrderProviderDetailsAdminOrderAPI[]>();
    const [sortConfig, setSortConfig] = useState<{
        column: string;
        direction: 'asc' | 'desc' | null;
    }>({ column: '', direction: null });

    const [isLoadingOrders, setIsLoadingOrders] = useState<boolean>(true);
    const [ordersToDisplay, setOrdersToDisplay] =
        useState<PatientOrderProviderDetailsAdminOrderAPI[]>();
    const [filterStartDate, setFilterStartDate] = useState<Date>();
    const [filterEndDate, setFilterEndDate] = useState<Date>(new Date());

    const [successMessage, setSuccessMessageOpen] = useState<boolean>(false);

    const handleSuccessMessageClose = () => {
        setSuccessMessageOpen(false);
    };

    useEffect(() => {
        setIsLoadingOrders(true);
        (async () => {
            const { data: completeOrderData, error: orderError } =
                await getAdminOrderManagementData(
                    filterStartDate ?? undefined,
                    filterEndDate ?? undefined
                );

            if (!completeOrderData) {
                console.log(
                    'Order Fetching for general orders failed. error message: ',
                    orderError.message
                );
            }

            const parsedOrders = prescriptionRequestToAdminDashboard(
                completeOrderData ?? []
            );

            setOrdersToDisplay(parsedOrders);
            setIsLoadingOrders(false);
        })();
    }, [filterEndDate, filterStartDate, listUpdater]);

    const handleStartFilterChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        // Asserting the event type to be specific to HTMLInputElement
        const inputEvent = event as React.ChangeEvent<HTMLInputElement>;
        setFilterStartDate(new Date(inputEvent.target.value));
    };

    const handleEndFilterChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        // Asserting the event type to be specific to HTMLInputElement
        const inputEvent = event as React.ChangeEvent<HTMLInputElement>;
        setFilterEndDate(new Date(inputEvent.target.value));
    };

    const [idFilter, setIdFilter] = useState<boolean>(false);

    const [successSnackbarOpen, setSuccessSnackbarOpen] =
        useState<boolean>(false);
    const [errorSnackbarOpen, setErrorSnackbarOpen] = useState<boolean>(false);

    const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false);
    const openConfirmDialog = () => {
        setConfirmDialogOpen(true);
    };
    const closeConfirmDialog = () => {
        setConfirmDialogOpen(false);
    };

    const [patientInformationDialogOpen, setPatientInformationDialogOpenState] =
        useState<boolean>(false);
    const [patientOrderDataForDialog, setPatientOrderDataForDialog] =
        useState<PatientOrderProviderDetailsAdminOrderAPI>();

    const openPatientInformationDialog = (
        order: PatientOrderProviderDetailsAdminOrderAPI
    ) => {
        setPatientOrderDataForDialog(order);
        setPatientInformationDialogOpenState(true);
    };

    const closePatientInformationDialog = () => {
        setPatientInformationDialogOpenState(false);
    };

    // Add a new state for storing the selected filters
    const [selectedApprovalStatusFilters, setSelectedApprovalStatusFilters] =
        useState<string[]>(['Unapproved-CardDown', 'Administrative-Cancel']);

    // Update this state to store the current search term
    const [currentSearchTerm, setCurrentSearchTerm] = useState('');

    const [selectedOrderId, setSelectedOrderId] = useState<number>(-1);

    const applyFilters = (currentFilters: string[]) => {
        // If there are no filters selected, do not apply any filtering
        if (currentFilters.length === 0) {
            setFilteredOrders(ordersToDisplay);
            return;
        }

        let filtered = ordersToDisplay!;

        if (currentFilters.length > 0) {
            filtered = filtered.filter((order) =>
                currentFilters.includes(order.approvalStatus)
            );
        }

        if (currentSearchTerm) {
            const regex = new RegExp(currentSearchTerm, 'i');
            filtered = filtered.filter(
                (order) =>
                    regex.test(order.patientName) ||
                    regex.test(order.prescription)
            );
        }

        setFilteredOrders(filtered);
    };

    useEffect(() => {
        if (ordersToDisplay) {
            applyFilters(selectedApprovalStatusFilters);
        }
    }, [ordersToDisplay, applyFilters, selectedApprovalStatusFilters]);

    const handleSearch = (searchTerm: string) => {
        setCurrentSearchTerm(searchTerm.trim());

        if (!searchTerm.trim()) {
            setFilteredOrders(ordersToDisplay);
        } else {
            applyFilters(selectedApprovalStatusFilters);
        }
    };

    const handleFilterChange = (newFilters: string[]) => {
        setSelectedApprovalStatusFilters(newFilters);
        applyFilters(newFilters);
    };

    const handleSort = (column: string) => {
        const direction =
            sortConfig.column === column && sortConfig.direction === 'asc'
                ? 'desc'
                : 'asc';
        setSortConfig({ column, direction });

        const sortedOrders = [...(filteredOrders || ordersToDisplay!)].sort(
            (a: any, b: any) => {
                if (a[column] < b[column]) return direction === 'asc' ? -1 : 1;
                if (a[column] > b[column]) return direction === 'asc' ? 1 : -1;
                return 0;
            }
        );

        setFilteredOrders(sortedOrders);
    };

    const renderApprovalStatus = (status: string) => {
        switch (status) {
            case 'Unapproved-CardDown':
                return (
                    <BioType className='body1 text-red-400'>
                        Pending Review
                    </BioType>
                );
            case 'Approved-CardDown':
                return (
                    <BioType className='body1 text-green-400'>Approved</BioType>
                );
            case 'Pending Payment':
                return (
                    <BioType className='body1 text-orange-400'>
                        Payment Pending
                    </BioType>
                );
            case 'Denied-CardDown':
                return (
                    <BioType className='body1 text-red-400'>
                        Order Denied
                    </BioType>
                );
            case 'Pending-Customer-Response':
                return (
                    <BioType className='body1 text-yellow-400'>
                        Pending Customer Response
                    </BioType>
                );
            case 'Approved-PendingPayment':
                return (
                    <BioType className='text-orange-400'>
                        Pending Payment
                    </BioType>
                );
            case 'Approved-NoCard':
                return (
                    <BioType className='body1 text-green-500'>
                        Approved No Card
                    </BioType>
                );
            case 'Payment-Completed':
                return (
                    <BioType className='body1 text-blue-400'>
                        Payment Completed
                    </BioType>
                );
            case 'Payment-Declined':
                return (
                    <BioType className='body1 text-red-500'>
                        Payment Declined
                    </BioType>
                );
            case 'Canceled':
                return (
                    <BioType className='body1 text-gray-400'>Canceled</BioType>
                );
            case 'Incomplete':
                return (
                    <BioType className='body1 text-gray-500'>
                        Incomplete
                    </BioType>
                );
            case 'Approved-NoCard-Finalized':
                return (
                    <BioType className='body1 text-green-600'>
                        Approved No Card Finalized
                    </BioType>
                );
            case 'Approved-CardDown-Finalized':
                return (
                    <BioType className='body1 text-green-700'>
                        Approved Card Down Finalized
                    </BioType>
                );
            case 'Order-Processing':
                return (
                    <BioType className='body1 text-blue-500'>
                        Order Processing
                    </BioType>
                );
            case 'Administrative-Cancel':
                return (
                    <BioType className='body1 text-red-800'>
                        Cancelled By Admin
                    </BioType>
                );
            default:
                return null;
        }
    };

    const renderSortArrow = (columnName: string) => {
        return sortConfig.column === columnName ? (
            <span style={{ verticalAlign: 'middle', marginLeft: '4px' }}>
                {sortConfig.direction === 'asc' ? (
                    <KeyboardArrowUpIcon />
                ) : (
                    <KeyboardArrowDownIcon />
                )}
            </span>
        ) : null;
    };

    const cancelOrderAdministratively = async (
        orderId: string,
        reason: string
    ) => {
        const { data: updateData, error: updateError } =
            await updateExistingOrderStatusUsingId(
                parseInt(orderId),
                'Administrative-Cancel'
            );

        if (updateError) {
            console.log('update error: ', updateError);
            setErrorSnackbarOpen(true);
        }

        const { error } = await insertAuditIntoAdministrativeCancelTable(
            orderId,
            reason
        );

        if (error) {
            console.log('admin audit error: ', error);
            setErrorSnackbarOpen(true);
        }

        closeConfirmDialog();
        setSuccessMessageOpen(true);
        setListUpdater((prev) => !prev);
    };

    return (
        <>
            <TableContainer component={Paper} className='px-8 pb-8'>
                <div className='flex flex-col justify-between flex-grow'>
                    <div className='flex flex-row justify-between flex-grow'>
                        <BioType className='h6 text-primary pt-4'>
                            Order List
                        </BioType>

                        <div className='flex flex-row flex-grow justify-end'>
                            <div className='flex flex-row items-center justify-center mx-auto gap-4'>
                                <div className='flex flex-row items-center justify-center gap-2'>
                                    <BioType className='body1'>Start:</BioType>
                                    <Input
                                        type='date'
                                        value={
                                            filterStartDate
                                                ? filterStartDate
                                                      .toISOString()
                                                      .split('T')[0]
                                                : ''
                                        }
                                        onChange={(event) => {
                                            handleStartFilterChange(event);
                                        }}
                                    />
                                </div>
                                <div className='flex flex-row items-center justify-center gap-2'>
                                    <BioType className='body1'>End:</BioType>
                                    <Input
                                        type='date'
                                        value={
                                            filterEndDate
                                                ? filterEndDate
                                                      .toISOString()
                                                      .split('T')[0]
                                                : ''
                                        }
                                        onChange={(event) => {
                                            handleEndFilterChange(event);
                                        }}
                                    />
                                </div>
                            </div>
                            <div className='mt-4'>
                                <AdminFilter
                                    onFilterChange={handleFilterChange}
                                    selectedApprovalStatusFilters={
                                        selectedApprovalStatusFilters
                                    }
                                    idFilterStatus={idFilter}
                                    setIDFilterStatus={setIdFilter}
                                />
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-row my-2'>
                        {selectedOrderId !== -1 && (
                            <Button
                                color='error'
                                variant='contained'
                                onClick={openConfirmDialog}
                            >
                                Cancel Order #: {selectedOrderId}
                            </Button>
                        )}
                    </div>
                </div>
                <Table sx={{ minWidth: 650 }} aria-label='simple table'>
                    <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell onClick={() => handleSort('id')}>
                                Order ID{renderSortArrow('id')}
                            </TableCell>
                            <TableCell
                                onClick={() => handleSort('patientName')}
                            >
                                Patient Name{renderSortArrow('patientName')}
                            </TableCell>
                            <TableCell
                                onClick={() =>
                                    handleSort('requestSubmissionTime')
                                }
                            >
                                Time Since Requested (hrs)
                                {renderSortArrow('requestSubmissionTime')}
                            </TableCell>
                            <TableCell
                                onClick={() => handleSort('deliveryState')}
                            >
                                State Delivery Address
                                {renderSortArrow('deliveryState')}
                            </TableCell>
                            <TableCell
                                onClick={() => handleSort('prescription')}
                            >
                                Prescription & Dose Requested
                                {renderSortArrow('prescription')}
                            </TableCell>

                            <TableCell
                                onClick={() => handleSort('approvalStatus')}
                            >
                                Prescription Status
                                {renderSortArrow('approvalStatus')}
                            </TableCell>
                            <TableCell>Tracking Number</TableCell>
                        </TableRow>
                    </TableHead>
                    {!isLoadingOrders && ordersToDisplay ? (
                        <TableBody>
                            {(filteredOrders || ordersToDisplay).map(
                                (
                                    order: PatientOrderProviderDetailsAdminOrderAPI
                                ) => (
                                    <TableRow
                                        key={order.id}
                                        sx={{
                                            '&:last-child td, &:last-child th':
                                                {
                                                    border: 0,
                                                },
                                        }}
                                    >
                                        <TableCell>
                                            <Checkbox
                                                checked={
                                                    parseInt(order.id) ===
                                                    selectedOrderId
                                                }
                                                onChange={() => {
                                                    if (
                                                        selectedOrderId ===
                                                        parseInt(order.id)
                                                    ) {
                                                        setSelectedOrderId(-1);
                                                    } else {
                                                        setSelectedOrderId(
                                                            parseInt(order.id)
                                                        );
                                                    }
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell component='th' scope='row'>
                                            <BioType className='body1'>
                                                BV-{order.id}
                                            </BioType>
                                        </TableCell>

                                        <TableCell>
                                            <BioType
                                                className='body1 !text-primary underline hover:cursor-pointer'
                                                onClick={() => {
                                                    openPatientInformationDialog(
                                                        order
                                                    );
                                                }}
                                            >
                                                {order.patientName}
                                            </BioType>
                                        </TableCell>
                                        <TableCell>
                                            <BioType className='body1'>
                                                {getDateHourDifference(
                                                    new Date(
                                                        order.requestSubmissionTime
                                                    ),
                                                    new Date()
                                                )}
                                            </BioType>
                                        </TableCell>
                                        <TableCell>
                                            <BioType className='body1'>
                                                {order.deliveryState}
                                            </BioType>
                                        </TableCell>
                                        <TableCell>
                                            <BioType className='body1'>
                                                {order.prescription}
                                            </BioType>
                                        </TableCell>
                                        <TableCell>
                                            {renderApprovalStatus(
                                                order.approvalStatus
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <BioType
                                                className={
                                                    order.tracking_number
                                                        ? 'body1'
                                                        : 'body1 !text-red-300'
                                                }
                                            >
                                                {order.tracking_number ??
                                                    'no tracking number'}
                                            </BioType>
                                        </TableCell>
                                    </TableRow>
                                )
                            )}
                        </TableBody>
                    ) : (
                        <div className='flex flex-col p-2'>
                            <BioType className='body1'>
                                Loading Orders... Please wait one moment...
                            </BioType>
                        </div>
                    )}
                </Table>
                {ordersToDisplay && ordersToDisplay.length === 0 && (
                    <div className='my-10 text-center italic'>
                        {`There are no requests to show.`}
                    </div>
                )}
            </TableContainer>
            <BioverseSnackbarMessage
                open={false}
                setOpen={function (value: SetStateAction<boolean>): void {
                    throw new Error('Function not implemented.');
                }}
                color={'success'}
                message={'The cancellation was successful. Fantastic!'}
            />

            <BioverseSnackbarMessage
                open={errorSnackbarOpen}
                setOpen={setErrorSnackbarOpen}
                color={'error'}
                message={
                    'There was an error in changing the status of the Order.'
                }
            />

            <ConfirmationDialog
                open={confirmDialogOpen}
                onClose={closeConfirmDialog}
                onConfirm={cancelOrderAdministratively}
                title={'Confirm Cancellation'}
                content={`Are you sure you would like to cancel this order? Please input a reason to log.`}
                selectedOrderId={String(selectedOrderId)}
            />

            <PatientInformationDialog
                open={patientInformationDialogOpen}
                onClose={closePatientInformationDialog}
                order={patientOrderDataForDialog}
            />

            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={successMessage}
                autoHideDuration={6000}
                onClose={handleSuccessMessageClose}
                color='success'
            >
                <SnackbarContent
                    message='Update was successful! Thank you for using the API. You are an absolute BOSS!'
                    action={
                        <IconButton
                            size='small'
                            aria-label='close'
                            color='error'
                            onClick={handleSuccessMessageClose}
                        >
                            <CloseIcon fontSize='small' />
                        </IconButton>
                    }
                />
            </Snackbar>
        </>
    );
}

interface ConfirmationDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (orderId: string, reason: string) => void;
    title: string;
    content: string;
    selectedOrderId: string;
}

function ConfirmationDialog({
    open,
    onClose,
    onConfirm,
    title,
    content,
    selectedOrderId,
}: ConfirmationDialogProps) {
    const [reason, setReason] = useState<string>('');

    const handleDeny = () => {
        onClose();
        // Additional actions on deny
    };

    const handleConfirm = () => {
        onConfirm(selectedOrderId, reason);
        onClose(); // Close dialog after confirmation
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
        >
            <DialogTitle id='alert-dialog-title'>{title}</DialogTitle>
            <DialogContent>
                <div>
                    <DialogContentText id='alert-dialog-description'>
                        {content}
                    </DialogContentText>
                </div>
                <div className='mt-4'>
                    <TextField
                        label={'Reason'}
                        fullWidth
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                    />
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleDeny}>Deny</Button>
                <Button
                    disabled={reason === ''}
                    onClick={handleConfirm}
                    autoFocus
                >
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
}

interface PatientInformationDialogProps {
    open: boolean;
    onClose: () => void;
    order: PatientOrderProviderDetailsAdminOrderAPI | undefined;
}

function PatientInformationDialog({
    open,
    onClose,
    order,
}: PatientInformationDialogProps) {
    const determineLicenseStatus = () => {
        if (order?.licensePhotoUrl && order.selfiePhotoUrl) {
            return (
                <>
                    <BioType className='body1 text-green-400'>Uploaded</BioType>
                </>
            );
        } else {
            return <BioType className='body1'>Not Uploaded</BioType>;
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
        >
            {order && (
                <>
                    <DialogTitle id='alert-dialog-title'>
                        Patient Information - Order #{order.id}
                    </DialogTitle>
                    <DialogContent>
                        <div>
                            <DialogContentText id='alert-dialog-description'>
                                <div className='flex flex-col'>
                                    <div className='flex flex-row gap-2'>
                                        <BioType className='text-black'>
                                            Patient Name:{' '}
                                        </BioType>
                                        <BioType>{order.patientName}</BioType>
                                    </div>
                                    <div className='flex flex-row gap-2'>
                                        <BioType className='text-black'>
                                            Email:{' '}
                                        </BioType>
                                        <BioType>{order.email}</BioType>
                                    </div>
                                    <div className='flex flex-row gap-2'>
                                        <BioType className='text-black'>
                                            Sex at birth:{' '}
                                        </BioType>
                                        <BioType>{order.patientGender}</BioType>
                                    </div>
                                    <div className='flex flex-row gap-2'>
                                        <BioType className='text-black'>
                                            DOB:{' '}
                                        </BioType>
                                        <BioType>{order.patientDOB}</BioType>
                                    </div>
                                    <div className='flex flex-row gap-2'>
                                        <BioType className='text-black'>
                                            Phone #:{' '}
                                        </BioType>
                                        <BioType>{order.patientPhone}</BioType>
                                    </div>
                                    <div className='flex flex-row gap-2'>
                                        <BioType className='text-black'>
                                            Address:{' '}
                                        </BioType>
                                        <div className='flex flex-col'>
                                            <BioType>
                                                {order.patientAddress.line1},{' '}
                                                {order.patientAddress.line2 ??
                                                    ''}
                                            </BioType>
                                            <BioType>
                                                {order.patientAddress.city},{' '}
                                                {order.patientAddress.state},{' '}
                                                {order.patientAddress.zip}
                                            </BioType>
                                        </div>
                                    </div>
                                    <div className='flex flex-row gap-2 items-center'>
                                        <BioType className='text-black'>
                                            License Status:{' '}
                                        </BioType>
                                        {determineLicenseStatus()}
                                    </div>
                                    <div className='flex flex-row gap-2'>
                                        <BioType>Stripe Customer ID: </BioType>
                                        <BioType>
                                            {order.stripeCustomerId}
                                        </BioType>
                                    </div>
                                </div>
                            </DialogContentText>
                        </div>
                    </DialogContent>
                </>
            )}
        </Dialog>
    );
}
