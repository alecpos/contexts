'use client';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { getDateHourDifference } from '@/app/utils/functions/dates';
import {
    TableContainer,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Button,
} from '@mui/material';
import Link from 'next/link';
import ProviderSearchBar from './search/provider-order-search';
import { useState } from 'react';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

/**
 * Deprecated. NOT IN USE
 * @author Nathan Cho
 */

interface Props {
    processedOrders: PatientOrderProviderDetails[];
}

export default function ProviderOrderTableNewOrders({
    processedOrders,
}: Props) {
    const [filteredOrders, setFilteredOrders] =
        useState<PatientOrderProviderDetails[]>();
    const [sortConfig, setSortConfig] = useState<{
        column: string;
        direction: 'asc' | 'desc' | null;
    }>({ column: '', direction: null });

    const handleSearch = (searchTerm: string) => {
        if (!searchTerm.trim()) {
            setFilteredOrders(processedOrders); // Reset if search term is empty
            return;
        }
        const regex = new RegExp(searchTerm, 'i'); // 'i' for case-insensitive
        const filtered = processedOrders.filter(
            (order) =>
                regex.test(order.patientName) || regex.test(order.prescription)
        );
        setFilteredOrders(filtered);
    };

    const handleSort = (column: string) => {
        const direction =
            sortConfig.column === column && sortConfig.direction === 'asc'
                ? 'desc'
                : 'asc';
        setSortConfig({ column, direction });

        const sortedOrders = [...(filteredOrders || processedOrders)].sort(
            (a: any, b: any) => {
                if (a[column] < b[column]) return direction === 'asc' ? -1 : 1;
                if (a[column] > b[column]) return direction === 'asc' ? 1 : -1;
                return 0;
            }
        );

        setFilteredOrders(sortedOrders);
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
        <div>
            <TableContainer component={Paper} className='px-8 pb-8'>
                <div className='flex flex-row justify-between'>
                    <BioType className='h6 text-primary pt-4'>
                        New Orders
                    </BioType>

                    <ProviderSearchBar handleSearch={handleSearch} />
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
                            <TableCell>Message Patient</TableCell>
                            <TableCell
                                onClick={() => handleSort('approvalStatus')}
                            >
                                Prescription Status
                                {renderSortArrow('approvalStatus')}
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(filteredOrders || processedOrders).map(
                            (order: PatientOrderProviderDetails) => (
                                <TableRow
                                    key={order.id}
                                    sx={{
                                        '&:last-child td, &:last-child th': {
                                            border: 0,
                                        },
                                    }}
                                >
                                    <TableCell component='th' scope='row'>
                                        <Link
                                            className='text-primary no-underline hover:underline'
                                            href={`/provider/patient-intakes/${order.id}`}
                                        >
                                            <BioType className='body1 text-primary'>
                                                BV-{order.id}
                                            </BioType>
                                        </Link>
                                    </TableCell>

                                    <TableCell>
                                        <Link
                                            className='text-primary no-underline hover:underline'
                                            href={`/provider/patient-overview/${order.patientId}`}
                                        >
                                            <BioType className='body1 text-primary'>
                                                {order.patientName}
                                            </BioType>
                                        </Link>
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
                                        <Link
                                            className='text-primary no-underline hover:underline body1'
                                            href={`/provider/messages?contact=${order.patientId}`}
                                        >
                                            Message
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        {(order.approvalStatus ===
                                            'Unapproved-NoCard' ||
                                            order.approvalStatus ===
                                                'Unapproved-CardDown') && (
                                            <BioType className='text-red-400 body1'>
                                                Pending Review
                                            </BioType>
                                        )}
                                        {/* {order.approvalStatus === 'Approved-PendingPayment' && (
                                        <BioType className="text-green-400 body1">
                                            Reviewed
                                        </BioType>
                                    )} */}
                                    </TableCell>
                                </TableRow>
                            )
                        )}
                    </TableBody>
                </Table>
                {processedOrders.length === 0 && (
                    <div className='my-10 text-center italic'>
                        {`You currently don't have any requests.`}
                    </div>
                )}
            </TableContainer>
        </div>
    );
}
