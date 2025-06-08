'use client';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import {
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Button,
    Skeleton,
    Switch,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
} from '@mui/material';
import Link from 'next/link';
import { useEffect, useState, useCallback } from 'react';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { SubscriptionCadency } from '@/app/types/renewal-orders/renewal-orders-types';
import {
    getLeadProviderOrderStatusTags,
    getProviderDashboardTasks,
    ProviderDashboardFetchV1,
} from '@/app/utils/actions/provider/dashboard-scripts';
import useSWR from 'swr';
import { renderApprovalStatus, renderStatusTag } from '../utils/status-helpers';
import { Status } from '@/app/types/global/global-enumerators';
import { useRouter } from 'next/navigation';
import { assignCurrentProviderToOrder } from '../utils/assign-provider-helper';
import BioverseSnackbarMessage from '@/app/components/global-components/snackbar/bioverse-snackbar';
import { fetchAssignedIntakesAndRenewals } from '../utils/assigned-order-fetch-helper';
import { StatusTag } from '@/app/types/status-tags/status-types';
import ProviderTrackingWindow from '../../provider-tracking-window/components/tracking-window';
import { SelectChangeEvent } from '@mui/material/Select';
import LoadingScreen from '@/app/components/global-components/loading-screen/loading-screen';
import { removeAssignedProviderForProviderAssignedQueue } from '@/app/utils/database/controller/orders/orders-api';
import ClearAssignedDialog from './clear-assigned-dialog/clear-assigned-dialog';
import React from 'react';
import ProviderDashboardIntakeList from './provider-dashboard-intake-list';
import LeadProviderDashboardIntakeList from './lead-provider-dashboard-table';
import { updateStatusTagAssignedProvider } from '@/app/utils/database/controller/patient-status-tags/patient-status-tags-api';

interface Props {
    userId: string;
    isPortalAdmin: boolean;
    isLeadProviderOrHigher: boolean;
    provider_list: ProviderOption[];
}

export default function ProviderOrderTable({
    userId,
    isPortalAdmin,
    isLeadProviderOrHigher,
    provider_list,
}: Props) {
    const router = useRouter();
    const [targetProviderId, setTargetProviderId] = useState<string>('');
    const [clearAssignedDialogOpen, setClearAssignedDialogOpen] =
        useState<boolean>(false);
    const { data: fetched_order_data, isLoading: intake_list_isLoading } =
        useSWR(`${userId}-provider-intake-list`, () =>
            ProviderDashboardFetchV1()
        );

    const { data: taskList, isLoading } = useSWR(
        `${userId}-task-list-dashboard`,
        () => getProviderDashboardTasks(userId)
    );

    const { data: lead_provider_swr_data } = useSWR(
        `${isLeadProviderOrHigher ? 'lead-provider-queue' : null}`,
        () => getLeadProviderOrderStatusTags()
    );

    const {
        data: assigned_intake_list,
        isLoading: assigned_intake_list_loading,
        mutate: mutate_assigned_intakes,
    } = useSWR(`${userId}-assigned-intakes`, () =>
        fetchAssignedIntakesAndRenewals(
            targetProviderId !== '' ? targetProviderId : userId
        )
    );

    const [isRedirecting, setIsRedirecting] = useState<boolean>(false);
    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
    const [showingLeadProviderOnly, setShowingLeadProviderOnly] =
        useState<boolean>(false);
    const [sortConfig, setSortConfig] = useState<{
        column: string;
        direction: 'asc' | 'desc' | null;
    }>({ column: '', direction: null });
    const [intake_list, setIntakeList] =
        useState<PatientOrderProviderDetails[]>();
    const [assignedIntakeList, setAssignedIntakeList] =
        useState<PatientOrderProviderDetails[]>();

    useEffect(() => {
        if (fetched_order_data) {
            setIntakeList(fetched_order_data.generalOrders);
        }
    }, [fetched_order_data]);

    useEffect(() => {
        if (assigned_intake_list) {
            setAssignedIntakeList(assigned_intake_list);
        }
    }, [assigned_intake_list]);

    const handleTargetProviderChange = useCallback((e: SelectChangeEvent) => {
        setTargetProviderId(e.target.value);
    }, []);

    useEffect(() => {
        if (targetProviderId) {
            mutate_assigned_intakes();
        }
    }, [targetProviderId, mutate_assigned_intakes]);

    const clearAssignedProviderListForProvider = useCallback(async () => {
        await removeAssignedProviderForProviderAssignedQueue(targetProviderId);
        await mutate_assigned_intakes();
    }, [targetProviderId, mutate_assigned_intakes]);

    const handleSort = (column: string) => {
        setSortConfig((prev) => ({
            column,
            direction:
                prev.column === column && prev.direction === 'asc'
                    ? 'desc'
                    : 'asc',
        }));
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

    const handleOrderRedirect = async (
        order_id: string,
        status_tag_id?: number,
        preassigned: boolean = false
    ) => {
        if (preassigned) {
            router.push(`/provider/intakes/${order_id}`);
        } else {
            setIsRedirecting(true);
            const status = await assignCurrentProviderToOrder(order_id);
            if (status_tag_id) {
                await updateStatusTagAssignedProvider(userId, status_tag_id);
            }
            if (status === Status.Success) {
                router.push(`/provider/intakes/${order_id}`);
            } else {
                setSnackbarOpen(true);
            }
            setIsRedirecting(false);
        }
    };

    const inactiveProviderList = [
        '2325cc51-8e98-4aff-9a16-0cd81096a5df',
        '51da5013-ff39-4714-937b-c6c36dbf0c15',
        'da5b213d-7676-4792-bc73-11151d0da4e6',
    ];

    return (
        <>
            <BioType className='mt-10 text-[2.5em] font-light'>
                {intake_list ? (
                    <ProviderTrackingWindow
                        user_id={userId}
                        intake_list={intake_list}
                    />
                ) : (
                    <Skeleton width={'70%'} height={'120px'} />
                )}
            </BioType>

            {isLeadProviderOrHigher && (
                <div>
                    <BioType className='text-[24px] font-inter font-medium leading-[140%] text-[rgba(51,51,51,0.75)] [font-feature-settings:"liga"_off,"clig"_off]'>
                        Queue Type:
                    </BioType>
                    <div className='flex flex-row items-center'>
                        <BioType
                            className={`${
                                !showingLeadProviderOnly
                                    ? 'text-primary inter-basic'
                                    : 'inter-basic'
                            }`}
                        >
                            All Providers
                        </BioType>
                        <Switch
                            onChange={() => {
                                setShowingLeadProviderOnly((prev) => !prev);
                            }}
                        />
                        <BioType
                            className={`${
                                showingLeadProviderOnly
                                    ? 'text-primary inter-basic'
                                    : 'text-gray-500 inter-basic'
                            }`}
                        >
                            Lead Provider
                        </BioType>
                    </div>
                </div>
            )}

            {(isPortalAdmin ||
                (!assigned_intake_list_loading &&
                    !intake_list_isLoading &&
                    assigned_intake_list &&
                    assigned_intake_list.length > 0)) && (
                <Paper className='flex flex-col px-4 pb-8 w-full'>
                    <div className='flex flex-row justify-between items-center pt-4'>
                        {assigned_intake_list && (
                            <BioType className='p-1 font-inter text-[20px] font-medium leading-[26px] text-[rgba(51,51,51,0.75)] [font-feature-settings:"liga"_off,"clig"_off] [text-edge:cap] [leading-trim:both] w-full'>
                                Provider Assigned Intakes:{' '}
                                {`${
                                    assignedIntakeList &&
                                    assignedIntakeList.length
                                }`}
                            </BioType>
                        )}
                        {isPortalAdmin && provider_list && (
                            <div className='w-full justify-end items-end flex gap-2'>
                                {targetProviderId && (
                                    <>
                                        <Button
                                            onClick={() =>
                                                setClearAssignedDialogOpen(true)
                                            }
                                            variant='outlined'
                                            sx={{ height: '60px' }}
                                        >
                                            Clear
                                        </Button>
                                        <ClearAssignedDialog
                                            open={clearAssignedDialogOpen}
                                            onClose={() =>
                                                setClearAssignedDialogOpen(
                                                    false
                                                )
                                            }
                                            onConfirm={() => {
                                                setClearAssignedDialogOpen(
                                                    false
                                                );
                                                clearAssignedProviderListForProvider();
                                            }}
                                        />
                                    </>
                                )}
                                <FormControl
                                    sx={{ width: '21.5vw', minWidth: '200px' }}
                                >
                                    <InputLabel
                                        id='demo-simple-select-label'
                                        sx={{
                                            fontFamily: 'Inter Regular',
                                            fontSize: '16px',
                                            fontWeight: 400,
                                            lineHeight: '24px',
                                            color: 'rgba(51, 51, 51, 0.75)',
                                            fontFeatureSettings:
                                                '"liga" off, "clig" off',
                                        }}
                                    >
                                        Select Provider
                                    </InputLabel>
                                    <Select
                                        labelId='demo-simple-select-label'
                                        id='demo-simple-select'
                                        value={targetProviderId}
                                        label='Select an option'
                                        onChange={handleTargetProviderChange}
                                        sx={{
                                            fontFamily: 'Inter Regular',
                                            fontSize: '16px',
                                            fontWeight: 400,
                                            lineHeight: '24px',
                                            color: 'rgba(51, 51, 51, 0.75)',
                                            fontFeatureSettings:
                                                '"liga" off, "clig" off',
                                            borderRadius: '12px',
                                            '& .MuiOutlinedInput-notchedOutline':
                                                {
                                                    borderRadius: '12px',
                                                },
                                        }}
                                    >
                                        <MenuItem
                                            value='unset'
                                            sx={{
                                                fontFamily: 'Inter Regular',
                                                fontSize: '16px',
                                                fontWeight: 400,
                                                lineHeight: '24px',
                                                color: 'rgba(51, 51, 51, 0.75)',
                                                fontFeatureSettings:
                                                    '"liga" off, "clig" off',
                                            }}
                                        >
                                            Select
                                        </MenuItem>
                                        {provider_list.map(
                                            (provider_option) => {
                                                if (
                                                    inactiveProviderList.includes(
                                                        provider_option.id
                                                    )
                                                ) {
                                                    return null;
                                                }

                                                return (
                                                    <MenuItem
                                                        key={provider_option.id}
                                                        value={
                                                            provider_option.id
                                                        }
                                                        sx={{
                                                            fontFamily:
                                                                'Inter Regular',
                                                            fontSize: '16px',
                                                            fontWeight: 400,
                                                            lineHeight: '24px',
                                                            color: 'rgba(51, 51, 51, 0.75)',
                                                            fontFeatureSettings:
                                                                '"liga" off, "clig" off',
                                                        }}
                                                    >
                                                        {provider_option.name}
                                                    </MenuItem>
                                                );
                                            }
                                        )}
                                    </Select>
                                </FormControl>
                            </div>
                        )}
                    </div>
                    <Table sx={{ minWidth: 650 }} aria-label='simple table'>
                        <TableHead>
                            <TableRow>
                                <TableCell
                                    onClick={() => handleSort('orderId')}
                                >
                                    <BioType className='inter-body'>
                                        Order ID
                                        {renderSortArrow('orderId')}
                                    </BioType>
                                </TableCell>
                                <TableCell
                                    align='left'
                                    onClick={() => handleSort('patientName')}
                                >
                                    <BioType className='inter-body'>
                                        Patient Name
                                        {renderSortArrow('patientName')}
                                    </BioType>
                                </TableCell>
                                <TableCell
                                    align='left'
                                    onClick={() =>
                                        handleSort('prescriptionStatus')
                                    }
                                >
                                    <BioType className='inter-body'>
                                        Prescription Status
                                        {renderSortArrow('prescriptionStatus')}
                                    </BioType>
                                </TableCell>
                                <TableCell align='left'>
                                    <BioType className='inter-body'>
                                        Tags
                                    </BioType>
                                </TableCell>
                                <TableCell
                                    align='left'
                                    onClick={() => handleSort('prescription')}
                                >
                                    <BioType className='inter-body'>
                                        Prescription & Dose Requested
                                        {renderSortArrow('prescription')}
                                    </BioType>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {assigned_intake_list_loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} align='center'>
                                        <LoadingScreen />
                                    </TableCell>
                                </TableRow>
                            ) : (
                                assignedIntakeList?.map((order, index) => (
                                    <TableRow key={index}>
                                        <TableCell component='th' scope='row'>
                                            <div
                                                onClick={() => {
                                                    if (!isRedirecting) {
                                                        handleOrderRedirect(
                                                            order.id,
                                                            order.status_tag_id,
                                                            true
                                                        );
                                                    }
                                                }}
                                            >
                                                <BioType className='inter-body'>
                                                    BV-{order.id}
                                                </BioType>
                                            </div>
                                        </TableCell>
                                        <TableCell align='left'>
                                            <Link
                                                className='text-primary no-underline hover:underline'
                                                href={`/provider/all-patients/${order.patientId}`}
                                                style={{
                                                    textDecoration: 'none',
                                                    color: '#1A1A1A',
                                                }}
                                            >
                                                <BioType className='inter-body'>
                                                    {order.patientName ??
                                                        'No-Name'}
                                                </BioType>
                                            </Link>
                                        </TableCell>
                                        <TableCell align='left'>
                                            {renderApprovalStatus(
                                                order.approvalStatus,
                                                order.statusTag! as StatusTag
                                            )}
                                        </TableCell>
                                        <TableCell align='left'>
                                            <BioType className='inter-body'>
                                                {renderStatusTag(
                                                    order.statusTag!
                                                )}
                                            </BioType>
                                        </TableCell>
                                        <TableCell align='left'>
                                            <BioType>
                                                {order.productName}
                                                {order.vial_dosages &&
                                                    `, ${order.vial_dosages}`}
                                                {order.subscriptionType ===
                                                    SubscriptionCadency.Monthly &&
                                                    `, ${order.variant}`}
                                                {order &&
                                                    order.id &&
                                                    typeof order.id ===
                                                        'string' &&
                                                    order.id.includes('-') &&
                                                    ', Renewal'}
                                            </BioType>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </Paper>
            )}

            {!intake_list_isLoading && (
                <Paper className='flex flex-col px-4 pb-8 w-full max-h-[80vh] overflow-y-auto'>
                    <div className='flex flex-row justify-between items-center'>
                        <BioType className='p-1 font-inter text-[20px] font-medium leading-[26px] text-[rgba(51,51,51,0.75)] [font-feature-settings:"liga"_off,"clig"_off] [text-edge:cap] [leading-trim:both]'>
                            New Intakes
                        </BioType>
                    </div>
                    {showingLeadProviderOnly ? (
                        <LeadProviderDashboardIntakeList
                            orderList={lead_provider_swr_data ?? undefined}
                            handleOrderRedirect={handleOrderRedirect}
                            isRedirecting={isRedirecting}
                        />
                    ) : (
                        <ProviderDashboardIntakeList
                            filteredOrders={taskList?.combined}
                            handleOrderRedirect={handleOrderRedirect}
                            isRedirecting={isRedirecting}
                            isLoading={isLoading}
                        />
                    )}
                </Paper>
            )}
            <BioverseSnackbarMessage
                open={snackbarOpen}
                setOpen={setSnackbarOpen}
                color={'error'}
                message={
                    'There was an issue with directing you to the intake. If you believe this to be a mistake, please contact Engineering.'
                }
            />
        </>
    );
}
