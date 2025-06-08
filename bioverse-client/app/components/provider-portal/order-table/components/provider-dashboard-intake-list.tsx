import Link from 'next/link';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { SubscriptionCadency } from '@/app/types/renewal-orders/renewal-orders-types';
import { StatusTag } from '@/app/types/status-tags/status-types';
import {
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
} from '@mui/material';
import { renderApprovalStatus, renderStatusTag } from '../utils/status-helpers';
import LoadingScreen from '@/app/components/global-components/loading-screen/loading-screen';

interface Props {
    filteredOrders: PatientOrderProviderDetails[] | undefined;
    handleOrderRedirect: (
        order_id: string,
        status_tag_id?: number,
        preassigned?: boolean
    ) => Promise<void>;
    isRedirecting: boolean;
    isLoading: boolean;
}

export default function ProviderDashboardIntakeList({
    filteredOrders,
    handleOrderRedirect,
    isRedirecting,
    isLoading,
}: Props) {
    return (
        <Table sx={{ minWidth: 650 }} aria-label='dashboard table'>
            <TableHead>
                <TableRow>
                    <TableCell>
                        <BioType className='inter-body'>Order ID</BioType>
                    </TableCell>
                    <TableCell align='left'>
                        <BioType className='inter-body'>Patient Name</BioType>
                    </TableCell>
                    <TableCell align='left'>
                        <BioType className='inter-body'>
                            Prescription Status
                        </BioType>
                    </TableCell>
                    <TableCell align='left'>
                        <BioType className='inter-body'>Tags</BioType>
                    </TableCell>
                    <TableCell align='left'>
                        <BioType className='inter-body'>
                            Prescription & Dose Requested
                        </BioType>
                    </TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {isLoading ? (
                    <TableRow>
                        <TableCell colSpan={6} align='center'>
                            <LoadingScreen />
                        </TableCell>
                    </TableRow>
                ) : (
                    filteredOrders?.map((order, index) => {
                        return (
                            <TableRow
                                key={index}
                                sx={{
                                    '&:nth-of-type(odd)': {
                                        backgroundColor: '#f8f8f8',
                                    },
                                    '&:hover': {
                                        backgroundColor: '#e8e8e8',
                                    },
                                }}
                            >
                                <TableCell component='th' scope='row'>
                                    <a
                                        href={`/provider/intakes/${order.id}`}
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        onClick={(e) => {
                                            // Check if command (metaKey) or control key is pressed
                                            if (!e.metaKey && !e.ctrlKey) {
                                                e.preventDefault(); // Prevent the default link behavior if neither key is pressed
                                                if (!isRedirecting) {
                                                    handleOrderRedirect(
                                                        order.id,
                                                        order.status_tag_id,
                                                        false
                                                    ); // Call your existing function
                                                }
                                            }
                                        }}
                                        style={{
                                            textDecoration: 'none',
                                            color: '#1A1A1A',
                                        }}
                                    >
                                        <BioType className='inter-body hover:text-[#1E71EA] hover:underline'>
                                            BV-{order.id}
                                        </BioType>
                                    </a>
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
                                        <BioType className='inter-body hover:underline'>
                                            {order.patientName ?? 'No-Name'}
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
                                    <BioType className='body1'>
                                        {renderStatusTag(order.statusTag!)}
                                    </BioType>
                                </TableCell>
                                <TableCell align='left'>
                                    <BioType className='inter-body'>
                                        {order.productName}
                                        {order.vial_dosages &&
                                            `, ${order.vial_dosages}`}
                                        {order.subscriptionType ===
                                            SubscriptionCadency.Monthly &&
                                            `, ${order.variant}`}
                                        {order &&
                                            order.id &&
                                            typeof order.id === 'string' &&
                                            order.id.includes('-') &&
                                            ', Renewal'}
                                    </BioType>
                                </TableCell>
                                {/* <TableCell align='left'>
                                {determineLicenseSelfieStatus(
                                    order.licensePhotoUrl,
                                    order.selfiePhotoUrl
                                )}
                            </TableCell> */}
                            </TableRow>
                        );
                    })
                )}
            </TableBody>
        </Table>
    );
}
