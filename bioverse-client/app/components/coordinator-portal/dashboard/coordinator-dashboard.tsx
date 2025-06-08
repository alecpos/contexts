'use client';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import {
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Chip,
    Switch,
} from '@mui/material';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import { RenewalOrderStatus } from '@/app/types/renewal-orders/renewal-orders-types';

import useSWR from 'swr';
import CoordinatorSearchBar from './coordinator-dashboard-search';
import {
    CoordinatorDashboardFetch,
    LeadCoordinatorDashboardFetch,
} from '@/app/utils/actions/coordinator/dashboard-scripts';
import { StatusTag } from '@/app/types/status-tags/status-types';
import CoordinatorFilter from './coordinator-dashboard-filter';
import { BV_AUTH_TYPE } from '@/app/types/auth/authorization-types';
import { verifyUserPermission } from '@/app/utils/actions/auth/authorization';

interface Props {
    isLeadCoordinator: boolean;
}

export default function CoordinatorDashboardTable({
    isLeadCoordinator,
}: Props) {
    const { data: intake_list } = useSWR(`$coordinator-intake-list`, () =>
        CoordinatorDashboardFetch()
    );

    const { data: lead_coordinator_list } = useSWR(
        `${isLeadCoordinator ? `lead-coordinator-list` : null}`,
        () => LeadCoordinatorDashboardFetch()
    );

    const [filteredOrders, setFilteredOrders] =
        useState<PatientOrderCoordinatorDetails[]>();
    const [sortConfig, setSortConfig] = useState<{
        column: string;
        direction: 'asc' | 'desc' | null;
    }>({ column: '', direction: null });

    const [idFilter, setIdFilter] = useState<boolean>(false);

    // Add a new state for storing the selected filters
    const [selectedApprovalStatusFilters, setSelectedApprovalStatusFilters] =
        useState<string[]>([]);
    const [userIsLeadCoordinator, setUserIsLeadCoordinator] =
        useState<boolean>(false);
    const [showLeadCoordinatorStatus, setShowLeadCoordinatorStatus] =
        useState<boolean>(false);

    // Update this state to store the current search term
    const [currentSearchTerm, setCurrentSearchTerm] = useState('');

    useEffect(() => {
        const checkPermission = async () => {
            const result = await verifyUserPermission(
                BV_AUTH_TYPE.LEAD_COORDINATOR
            );

            if (result.access_granted) {
                setUserIsLeadCoordinator(true);
            }
        };
        checkPermission();
    }, []);

    useEffect(() => {
        applyFilters(selectedApprovalStatusFilters);
    }, [selectedApprovalStatusFilters, idFilter, intake_list]);

    const applyFilters = (currentFilters: string[]) => {
        if (!intake_list) {
            return;
        }

        let filtered = intake_list;

        if (currentSearchTerm) {
            const regex = new RegExp(currentSearchTerm, 'i');
            filtered = filtered.filter(
                (order) =>
                    regex.test(order.patientName) ||
                    regex.test(order.prescription) ||
                    (order.statusTags &&
                        order.statusTags.some((tag) => regex.test(tag)))
            );
        }

        if (idFilter) {
            filtered = intake_list.filter((order) => {
                if (!order.licensePhotoUrl || !order.selfiePhotoUrl) {
                    return false;
                } else return true;
            });
        }
        setFilteredOrders(filtered);
    };

    const handleFilterChange = (newFilters: string[]) => {
        applyFilters(newFilters);
    };

    const handleSearch = (searchTerm: string) => {
        setCurrentSearchTerm(searchTerm.trim());
        applyFilters(selectedApprovalStatusFilters);
    };

    const handleSort = (column: string) => {
        const direction =
            sortConfig.column === column && sortConfig.direction === 'asc'
                ? 'desc'
                : 'asc';
        setSortConfig({ column, direction });

        const sortedOrders = [...(filteredOrders ?? intake_list ?? [])].sort(
            (a: any, b: any) => {
                if (a[column] < b[column]) return direction === 'asc' ? -1 : 1;
                if (a[column] > b[column]) return direction === 'asc' ? 1 : -1;
                return 0;
            }
        );

        setFilteredOrders(sortedOrders);
    };

    const determineLicenseSelfieStatus = (
        license_url: string,
        selfie_url: string
    ) => {
        if (license_url && selfie_url) {
            return <div className='body1 text-green-500'>Uploaded</div>;
        }

        return <div className='body1'>Not Uploaded</div>;
    };

    const renderApprovalStatus = (status: string) => {
        switch (status) {
            case RenewalOrderStatus.CheckupComplete_Unprescribed_Unpaid:
            case RenewalOrderStatus.CheckupComplete_Unprescribed_Paid:
                return (
                    <BioType className='body1'>Check in / Prescribe</BioType>
                );
            case 'Unapproved-CardDown':
                return <BioType className='body1'>Pending Review</BioType>;
            case 'Approved-CardDown':
                return <BioType className='body1'>Approved</BioType>;
            case 'Pending Payment':
                return <BioType className='body1'>Payment Pending</BioType>;
            case 'Denied-CardDown':
                return <BioType className='body1'>Order Denied</BioType>;
            case 'Pending-Customer-Response':
                return (
                    <BioType className='body1'>
                        Pending Customer Response
                    </BioType>
                );
            case 'Approved-PendingPayment':
                return <BioType className=''>Pending Payment</BioType>;
            case 'Approved-NoCard':
                return <BioType className='body1'>Approved No Card</BioType>;
            case 'Payment-Completed':
                return <BioType className='body1'>Payment Completed</BioType>;
            case 'Payment-Declined':
                return <BioType className='body1'>Payment Declined</BioType>;
            case 'Canceled':
                return <BioType className='body1'>Canceled</BioType>;
            case 'Incomplete':
                return <BioType className='body1'>Incomplete</BioType>;
            case 'Approved-NoCard-Finalized':
                return (
                    <BioType className='body1'>
                        Approved No Card Finalized
                    </BioType>
                );
            case 'Approved-CardDown-Finalized':
                return (
                    <BioType className='body1'>
                        Approved Card Down Finalized
                    </BioType>
                );
            case 'Order-Processing':
                return <BioType className='body1'>Order Processing</BioType>;
            case RenewalOrderStatus.PharmacyProcessing:
                return <BioType className='body1'>Sent to Pharmacy</BioType>;
            default:
                return null;
        }
    };

    const renderStatusTag = (status: string) => {
        switch (status) {
            case StatusTag.FollowUp:
                return (
                    <Chip
                        variant='outlined'
                        color='error'
                        label={StatusTag.FollowUp}
                    />
                );
            case StatusTag.AwaitingResponse:
                return (
                    <Chip
                        variant='outlined'
                        color='success'
                        label={StatusTag.AwaitingResponse}
                    />
                );
            case StatusTag.IDDocs:
                return (
                    <Chip
                        variant='outlined'
                        color='primary'
                        label={StatusTag.IDDocs}
                    />
                );
            case StatusTag.Coordinator:
                return (
                    <Chip
                        variant='outlined'
                        color='warning'
                        label={StatusTag.Coordinator}
                    />
                );
            case StatusTag.DoctorLetterRequired:
                return (
                    <Chip
                        variant='outlined'
                        color='secondary'
                        label={StatusTag.DoctorLetterRequired}
                    />
                );
            case StatusTag.LeadCoordinator:
                return (
                    <Chip
                        variant='outlined'
                        style={{ color: 'green', borderColor: 'green' }}
                        label={StatusTag.LeadCoordinator}
                    />
                );
            default:
                return (
                    <Chip variant='outlined' color='primary' label={status} />
                );
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

    return (
        <>
            <div className='w-full px-10'>
                <BioType className='mt-10 mb-[1.25rem] ml-10 text-[2.5em] font-light'>
                    # of Orders: {filteredOrders?.length}
                </BioType>

                {userIsLeadCoordinator && (
                    <div className='flex flex-col px-10'>
                        <BioType className='it-h1'>Queue Type:</BioType>
                        <div className='flex flex-row items-center'>
                            <BioType
                                className={`${
                                    !showLeadCoordinatorStatus
                                        ? 'text-primary itd-subtitle'
                                        : 'itd-body'
                                }`}
                            >
                                All Status Tags
                            </BioType>
                            <Switch
                                onChange={() => {
                                    setShowLeadCoordinatorStatus(
                                        (prev) => !prev
                                    );
                                }}
                            />
                            <BioType
                                className={`${
                                    showLeadCoordinatorStatus
                                        ? 'text-primary itd-subtitle'
                                        : 'itd-body'
                                }`}
                            >
                                Lead Coordinator Tags
                            </BioType>
                        </div>
                    </div>
                )}

                <Paper className='px-4 pb-8 mx-10'>
                    <div className='flex flex-row justify-between items-center'>
                        <div className='flex flex-row justify-between flex-grow'>
                            <div className='flex flex-row flex-grow justify-end'>
                                <CoordinatorSearchBar
                                    handleSearch={handleSearch}
                                />
                                <div className='mt-4'>
                                    <CoordinatorFilter
                                        onFilterChange={handleFilterChange}
                                        idFilterStatus={idFilter}
                                        setIDFilterStatus={setIdFilter}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <Table sx={{ minWidth: 650 }} aria-label='simple table'>
                        <TableHead>
                            <TableRow>
                                <TableCell onClick={() => handleSort('id')}>
                                    Order ID{renderSortArrow('id')}
                                </TableCell>
                                <TableCell
                                    onClick={() => handleSort('patientName')}
                                >
                                    Patient Name{renderSortArrow('patientName')}
                                </TableCell>
                                <TableCell
                                    onClick={() => handleSort('approvalStatus')}
                                >
                                    Prescription Status
                                    {renderSortArrow('approvalStatus')}
                                </TableCell>
                                <TableCell
                                    onClick={() => handleSort('statusTag')}
                                >
                                    Status Tags
                                    {renderSortArrow('statusTag')}
                                </TableCell>
                                <TableCell
                                    onClick={() => handleSort('prescription')}
                                >
                                    Prescription & Dose Requested
                                    {renderSortArrow('prescription')}
                                </TableCell>

                                <TableCell>ID Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {intake_list &&
                                (showLeadCoordinatorStatus
                                    ? lead_coordinator_list
                                        ? lead_coordinator_list
                                        : []
                                    : filteredOrders ?? intake_list
                                ).map(
                                    (order: PatientOrderCoordinatorDetails) => {
                                        return (
                                            <TableRow
                                                key={order.id}
                                                sx={{
                                                    '&:last-child td, &:last-child th':
                                                        {
                                                            border: 0,
                                                        },
                                                }}
                                            >
                                                <TableCell
                                                    component='th'
                                                    scope='row'
                                                >
                                                    <Link
                                                        className='text-primary no-underline hover:underline'
                                                        href={`/coordinator/orders/${order.id}`}
                                                    >
                                                        <BioType className='body1 text-primary'>
                                                            BV-{order.id}
                                                        </BioType>
                                                    </Link>
                                                </TableCell>

                                                <TableCell>
                                                    <Link
                                                        className='text-primary no-underline hover:underline'
                                                        href={`/provider/all-patients/${order.patientId}`}
                                                    >
                                                        <BioType className='body1 text-primary'>
                                                            {order.patientName ??
                                                                'No-Name'}
                                                        </BioType>
                                                    </Link>
                                                </TableCell>
                                                <TableCell>
                                                    {renderApprovalStatus(
                                                        order.approvalStatus
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <div className='flex flex-col gap-2'>
                                                        {order.statusTags?.map(
                                                            (tag) =>
                                                                renderStatusTag(
                                                                    tag
                                                                )
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <BioType className='body1'>
                                                        {order.prescription}
                                                        {order &&
                                                            order.id &&
                                                            typeof order.id ===
                                                                'string' &&
                                                            order.id.includes(
                                                                '-'
                                                            ) &&
                                                            ', Renewal'}
                                                    </BioType>
                                                </TableCell>

                                                <TableCell>
                                                    {showLeadCoordinatorStatus
                                                        ? 'N/A'
                                                        : determineLicenseSelfieStatus(
                                                              order.licensePhotoUrl,
                                                              order.selfiePhotoUrl
                                                          )}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    }
                                )}
                        </TableBody>
                    </Table>
                </Paper>
                {/* {!intake_list ||
                (intake_list.length === 0 && (
                    <div className='my-10 text-center italic'>
                        No requests
                    </div>
                ))} */}
            </div>
        </>
    );
}
