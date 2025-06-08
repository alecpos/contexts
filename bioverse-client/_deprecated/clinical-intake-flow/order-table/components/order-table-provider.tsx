// 'use client';
// import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
// import {
//     Paper,
//     Table,
//     TableHead,
//     TableRow,
//     TableCell,
//     TableBody,
//     Button,
//     Skeleton,
// } from '@mui/material';
// import Link from 'next/link';
// import { useEffect, useState } from 'react';
// import ProviderSearchBar from './search/provider-order-search';
// import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
// import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
// import ProviderFilter from './filter/provider-order-filter';
// import { RenewalOrderStatus } from '@/app/types/renewal-orders/renewal-orders-types';
// import { ProviderDashboardFetchV1 } from '@/app/utils/actions/provider/dashboard-scripts';
// import useSWR from 'swr';
// import ProviderTrackingWindow from '../../../provider-tracking-window/components/tracking-window';
// import { createSupabaseBrowserClient } from '@/app/utils/clients/supabaseBrowserClient';
// import {
//     determineLicenseSelfieStatus,
//     renderApprovalStatus,
//     renderStatusTag,
// } from '../utils/status-helpers';
// import { Status } from '@/app/types/global/global-enumerators';
// import { useRouter } from 'next/navigation';
// import { assignCurrentProviderToOrder } from '../utils/assign-provider-helper';
// import BioverseSnackbarMessage from '@/app/components/global-components/snackbar/bioverse-snackbar';
// import { fetchAssignedIntakesAndRenewals } from '../utils/assigned-order-fetch-helper';

// interface Props {
//     userId: string;
// }

// export default function ProviderOrderTable({ userId }: Props) {
//     const router = useRouter();
//     const {
//         data: intake_list,
//         error: intake_list_error,
//         isLoading: intake_list_isLoading,
//         mutate: mutate_intake_list,
//     } = useSWR(`${userId}-provider-intake-list`, () =>
//         ProviderDashboardFetchV1()
//     );
//     const {
//         data: assigned_intake_list,
//         error: assigned_intake_list_error,
//         isLoading: assigned_intake_list_loading,
//         mutate: mutate_assigned_intakes,
//     } = useSWR(`${userId}-assigned-intakes`, () =>
//         fetchAssignedIntakesAndRenewals()
//     );
//     const [isRedirecting, setIsRedirecting] = useState<boolean>(false);
//     const [filteredOrders, setFilteredOrders] =
//         useState<PatientOrderProviderDetails[]>();
//     const [sortConfig, setSortConfig] = useState<{
//         column: string;
//         direction: 'asc' | 'desc' | null;
//     }>({ column: '', direction: null });
//     const [idFilter, setIdFilter] = useState<boolean>(true);
//     const [selectedApprovalStatusFilters, setSelectedApprovalStatusFilters] =
//         useState<string[]>([
//             'Unapproved-CardDown',
//             'CheckupComplete-ProviderUnapproved-Unpaid',
//             RenewalOrderStatus.CheckupComplete_ProviderUnapproved_Unpaid,
//             RenewalOrderStatus.CheckupComplete_ProviderUnapproved_Paid,
//             RenewalOrderStatus.CheckupComplete_ProviderApproved_Unprescribed_Paid,
//             RenewalOrderStatus.CheckupComplete_ProviderApproved_Unprescribed_Unpaid,
//         ]);
//     const [currentSearchTerm, setCurrentSearchTerm] = useState('');
//     const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);

//     useEffect(() => {
//         const applyFilters = (currentFilters: string[]) => {
//             if (!intake_list) {
//                 return;
//             }
//             let filtered = intake_list;

//             if (idFilter) {
//                 filtered = filtered.filter(
//                     (order) => order.licensePhotoUrl && order.selfiePhotoUrl
//                 );
//             }

//             if (currentFilters.length > 0) {
//                 filtered = filtered.filter((order) =>
//                     currentFilters.includes(order.approvalStatus)
//                 );
//             }

//             if (currentSearchTerm) {
//                 const regex = new RegExp(currentSearchTerm, 'i');
//                 filtered = filtered.filter(
//                     (order) =>
//                         regex.test(order.patientName) ||
//                         regex.test(order.prescription)
//                 );
//             }

//             setFilteredOrders(filtered);
//         };

//         applyFilters(selectedApprovalStatusFilters);
//     }, [
//         selectedApprovalStatusFilters,
//         idFilter,
//         intake_list,
//         currentSearchTerm,
//     ]);

//     /**
//      * Supabase Realtime Script:
//      * Listens to all allowed events on orders table (update).
//      * Triggers handleRealtimeUpdate function when events are triggered.
//      */
//     const supabase = createSupabaseBrowserClient();
//     const handleRealtimeUpdate = () => {
//         mutate_intake_list(); //refresh list when there is an update to the orders table.
//     };
//     const subscription = supabase
//         .channel('orders')
//         .on(
//             'postgres_changes',
//             { event: 'UPDATE', schema: 'public', table: 'orders' },
//             handleRealtimeUpdate
//         )
//         .subscribe();
//     /**
//      * End Real-time script
//      */

//     const handleSearch = (searchTerm: string) => {
//         setCurrentSearchTerm(searchTerm.trim());
//     };

//     const handleFilterChange = (newFilters: string[]) => {
//         setSelectedApprovalStatusFilters(newFilters);
//     };

//     const handleSort = (column: string) => {
//         const direction =
//             sortConfig.column === column && sortConfig.direction === 'asc'
//                 ? 'desc'
//                 : 'asc';
//         setSortConfig({ column, direction });

//         const sortedOrders = [...(filteredOrders ?? intake_list ?? [])].sort(
//             (a: any, b: any) => {
//                 if (a[column] < b[column]) return direction === 'asc' ? -1 : 1;
//                 if (a[column] > b[column]) return direction === 'asc' ? 1 : -1;
//                 return 0;
//             }
//         );

//         setFilteredOrders(sortedOrders);
//     };

//     const renderSortArrow = (columnName: string) => {
//         return sortConfig.column === columnName ? (
//             <span style={{ verticalAlign: 'middle', marginLeft: '4px' }}>
//                 {sortConfig.direction === 'asc' ? (
//                     <KeyboardArrowUpIcon />
//                 ) : (
//                     <KeyboardArrowDownIcon />
//                 )}
//             </span>
//         ) : null;
//     };

//     const handleOrderRedirect = async (
//         order_id: string,
//         preassigned: boolean = false
//     ) => {
//         if (preassigned) {
//             router.push(`/provider/intakes/${order_id}`);
//         } else {
//             setIsRedirecting(true);
//             const status = await assignCurrentProviderToOrder(order_id);
//             if (status === Status.Success) {
//                 router.push(`/provider/intakes/${order_id}`);
//             } else {
//                 setSnackbarOpen(true);
//             }
//             setIsRedirecting(false);
//         }
//     };

//     return (
//         <>
//             <BioType className='mt-10 text-[2.5em] font-light'>
//                 {intake_list ? (
//                     <ProviderTrackingWindow
//                         user_id={userId}
//                         intakes_to_complete={filteredOrders?.length ?? 0}
//                         intake_list={intake_list}
//                     />
//                 ) : (
//                     <Skeleton width={'70%'} height={'120px'} />
//                 )}
//             </BioType>

//             {!assigned_intake_list_loading &&
//                 assigned_intake_list &&
//                 assigned_intake_list.length > 0 && (
//                     <Paper className='flex flex-col px-4 pb-8 w-full'>
//                         <div className='flex flex-row justify-between items-center'>
//                             {assigned_intake_list && (
//                                 <BioType className='p-1 itd-h1 text-red-500'>
//                                     Assigned Intakes: PLEASE COMPLETE FIRST
//                                 </BioType>
//                             )}
//                         </div>
//                         <Table sx={{ minWidth: 650 }} aria-label='simple table'>
//                             <TableHead>
//                                 <TableRow>
//                                     <TableCell
//                                         onClick={() => handleSort('orderId')}
//                                     >
//                                         <BioType className='table-header-label'>
//                                             Order ID{renderSortArrow('orderId')}
//                                         </BioType>
//                                     </TableCell>
//                                     <TableCell
//                                         align='left'
//                                         onClick={() =>
//                                             handleSort('patientName')
//                                         }
//                                     >
//                                         <BioType className='table-header-label'>
//                                             Patient Name
//                                             {renderSortArrow('patientName')}
//                                         </BioType>
//                                     </TableCell>
//                                     <TableCell
//                                         align='left'
//                                         onClick={() =>
//                                             handleSort('prescriptionStatus')
//                                         }
//                                     >
//                                         <BioType className='table-header-label'>
//                                             Prescription Status
//                                             {renderSortArrow(
//                                                 'prescriptionStatus'
//                                             )}
//                                         </BioType>
//                                     </TableCell>
//                                     <TableCell align='left'>
//                                         <BioType className='table-header-label'>
//                                             Tags
//                                         </BioType>
//                                     </TableCell>
//                                     <TableCell
//                                         align='left'
//                                         onClick={() =>
//                                             handleSort('prescription')
//                                         }
//                                     >
//                                         <BioType className='table-header-label'>
//                                             Prescription & Dose Requested
//                                             {renderSortArrow('prescription')}
//                                         </BioType>
//                                     </TableCell>
//                                     <TableCell align='left'>
//                                         <BioType className='table-header-label'>
//                                             ID Status
//                                         </BioType>
//                                     </TableCell>
//                                 </TableRow>
//                             </TableHead>
//                             <TableBody>
//                                 {assigned_intake_list?.map((order, index) => (
//                                     <TableRow key={index}>
//                                         <TableCell component='th' scope='row'>
//                                             <Button
//                                                 variant='outlined'
//                                                 onClick={() => {
//                                                     if (!isRedirecting) {
//                                                         handleOrderRedirect(
//                                                             order.id,
//                                                             true
//                                                         );
//                                                     }
//                                                 }}
//                                             >
//                                                 <BioType className='body1 text-primary'>
//                                                     BV-{order.id}
//                                                 </BioType>
//                                             </Button>
//                                         </TableCell>
//                                         <TableCell align='left'>
//                                             <Link
//                                                 className='text-primary no-underline hover:underline'
//                                                 href={`/provider/all-patients/${order.patientId}`}
//                                             >
//                                                 <BioType className='body1 text-primary'>
//                                                     {order.patientName ??
//                                                         'No-Name'}
//                                                 </BioType>
//                                             </Link>
//                                         </TableCell>
//                                         <TableCell align='left'>
//                                             {renderApprovalStatus(
//                                                 order.approvalStatus
//                                             )}
//                                         </TableCell>
//                                         <TableCell align='left'>
//                                             <BioType className='body1'>
//                                                 {renderStatusTag(
//                                                     order.statusTag!
//                                                 )}
//                                             </BioType>
//                                         </TableCell>
//                                         <TableCell align='left'>
//                                             <BioType>
//                                                 {order.prescription}
//                                                 {order &&
//                                                     order.id &&
//                                                     typeof order.id ===
//                                                         'string' &&
//                                                     order.id.includes('-') &&
//                                                     ', Renewal'}
//                                             </BioType>
//                                         </TableCell>
//                                         <TableCell align='left'>
//                                             {determineLicenseSelfieStatus(
//                                                 order.licensePhotoUrl,
//                                                 order.selfiePhotoUrl
//                                             )}
//                                         </TableCell>
//                                     </TableRow>
//                                 ))}
//                             </TableBody>
//                         </Table>
//                     </Paper>
//                 )}

//             {!intake_list_isLoading && (
//                 <Paper className='flex flex-col px-4 pb-8 w-full max-h-[80vh]'>
//                     <div className='flex flex-row justify-between items-center'>
//                         {assigned_intake_list && (
//                             <BioType className='p-1 itd-h1'>
//                                 New Intakes
//                             </BioType>
//                         )}
//                         <div className='flex flex-row justify-between flex-grow'>
//                             <div className='flex flex-row flex-grow justify-end'>
//                                 <ProviderSearchBar
//                                     handleSearch={handleSearch}
//                                 />
//                                 <div className='mt-4'>
//                                     <ProviderFilter
//                                         onFilterChange={handleFilterChange}
//                                         selectedApprovalStatusFilters={
//                                             selectedApprovalStatusFilters
//                                         }
//                                         idFilterStatus={idFilter}
//                                         setIDFilterStatus={setIdFilter}
//                                     />
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                     <Table sx={{ minWidth: 650 }} aria-label='simple table'>
//                         <TableHead>
//                             <TableRow>
//                                 <TableCell
//                                     onClick={() => handleSort('orderId')}
//                                 >
//                                     <BioType className='table-header-label'>
//                                         Order ID{renderSortArrow('orderId')}
//                                     </BioType>
//                                 </TableCell>
//                                 <TableCell
//                                     align='left'
//                                     onClick={() => handleSort('patientName')}
//                                 >
//                                     <BioType className='table-header-label'>
//                                         Patient Name
//                                         {renderSortArrow('patientName')}
//                                     </BioType>
//                                 </TableCell>
//                                 <TableCell
//                                     align='left'
//                                     onClick={() =>
//                                         handleSort('prescriptionStatus')
//                                     }
//                                 >
//                                     <BioType className='table-header-label'>
//                                         Prescription Status
//                                         {renderSortArrow('prescriptionStatus')}
//                                     </BioType>
//                                 </TableCell>
//                                 <TableCell align='left'>
//                                     <BioType className='table-header-label'>
//                                         Tags
//                                     </BioType>
//                                 </TableCell>
//                                 <TableCell
//                                     align='left'
//                                     onClick={() => handleSort('prescription')}
//                                 >
//                                     <BioType className='table-header-label'>
//                                         Prescription & Dose Requested
//                                         {renderSortArrow('prescription')}
//                                     </BioType>
//                                 </TableCell>
//                                 <TableCell align='left'>
//                                     <BioType className='table-header-label'>
//                                         ID Status
//                                     </BioType>
//                                 </TableCell>
//                             </TableRow>
//                         </TableHead>
//                         <TableBody>
//                             {filteredOrders?.map((order, index) => (
//                                 <TableRow key={index}>
//                                     <TableCell component='th' scope='row'>
//                                         <Button
//                                             variant='outlined'
//                                             onClick={() => {
//                                                 if (!isRedirecting) {
//                                                     handleOrderRedirect(
//                                                         order.id
//                                                     );
//                                                 }
//                                             }}
//                                         >
//                                             <BioType className='body1 text-primary'>
//                                                 BV-{order.id}
//                                             </BioType>
//                                         </Button>
//                                     </TableCell>
//                                     <TableCell align='left'>
//                                         <Link
//                                             className='text-primary no-underline hover:underline'
//                                             href={`/provider/all-patients/${order.patientId}`}
//                                         >
//                                             <BioType className='body1 text-primary'>
//                                                 {order.patientName ?? 'No-Name'}
//                                             </BioType>
//                                         </Link>
//                                     </TableCell>
//                                     <TableCell align='left'>
//                                         {renderApprovalStatus(
//                                             order.approvalStatus
//                                         )}
//                                     </TableCell>
//                                     <TableCell align='left'>
//                                         <BioType className='body1'>
//                                             {renderStatusTag(order.statusTag!)}
//                                         </BioType>
//                                     </TableCell>
//                                     <TableCell align='left'>
//                                         <BioType>
//                                             {order.prescription}
//                                             {order &&
//                                                 order.id &&
//                                                 typeof order.id === 'string' &&
//                                                 order.id.includes('-') &&
//                                                 ', Renewal'}
//                                         </BioType>
//                                     </TableCell>
//                                     <TableCell align='left'>
//                                         {determineLicenseSelfieStatus(
//                                             order.licensePhotoUrl,
//                                             order.selfiePhotoUrl
//                                         )}
//                                     </TableCell>
//                                 </TableRow>
//                             ))}
//                         </TableBody>
//                     </Table>
//                 </Paper>
//             )}
//             <BioverseSnackbarMessage
//                 open={snackbarOpen}
//                 setOpen={setSnackbarOpen}
//                 color={'error'}
//                 message={
//                     'There was an issue with directing you to the intake. If you believe this to be a mistake, please contact Engineering.'
//                 }
//             />
//         </>
//     );
// }
