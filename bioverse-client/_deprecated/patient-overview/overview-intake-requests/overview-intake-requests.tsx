// 'use client';
// import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
// import {
//     Button,
//     Paper,
//     Table,
//     TableBody,
//     TableCell,
//     TableContainer,
//     TableHead,
//     TableRow,
// } from '@mui/material';
// import { useState } from 'react';
// import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
// import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';

// interface Props {
//     patientOrderData: {
//         id: any;
//         created_at: any;
//         variant_text: any;
//         product: {
//             name: any;
//         }[];
//     }[];

//     patientId: string;
// }

// export default function ProviderPatientViewOrderRequests({
//     patientOrderData,
//     patientId,
// }: Props) {
//     const [expanded, setExpanded] = useState<boolean>(true);

//     const router = useRouter();

//     const sectionHeaderClass = `flex flex-row items-center gap-2 p-8`;

//     // Function to calculate the time since the order was created
//     const getTimeSinceRequested = (createdAt: string) => {
//         const createdDate = new Date(createdAt);
//         const now = new Date();
//         const differenceInHours =
//             Math.abs(now.getTime() - createdDate.getTime()) / 36e5;
//         return `${Math.floor(differenceInHours)} hours`;
//     };

//     // Function to convert PatientOrderData to OrderData format
//     const convertToOrderData = (
//         patientOrderData: any
//     ): PatientOverviewOrderData[] => {
//         return patientOrderData.map(
//             (data: {
//                 id: { toString: () => any };
//                 created_at: string;
//                 product: { name: any };
//                 variant_text: any;
//             }) => {
//                 // Check if the product array is not empty and has a name property
//                 return {
//                     orderId: data.id.toString(),
//                     timeSinceRequested: getTimeSinceRequested(data.created_at),
//                     prescription: `${data.product.name}, ${data.variant_text}`,
//                 };
//             }
//         );
//     };

//     const orderData: PatientOverviewOrderData[] =
//         convertToOrderData(patientOrderData);

//     // Example data (you would fetch this data from your backend or state management)
//     const rows: PatientOverviewOrderData[] = [
//         {
//             orderId: '01234567',
//             timeSinceRequested: '25 hours',
//             prescription: 'NAD+ Injection, 5 ml',
//         },
//         {
//             orderId: '01234567',
//             timeSinceRequested: '47 hours',
//             prescription: 'Acarbose, as needed',
//         },
//     ];

//     const handleRedirect = (orderId: string) => {
//         router.push(`/provider/patient-intakes/${orderId}`);
//     };

//     return (
//         <>
//             <Paper className='w-full mb-12'>
//                 <div
//                     className={sectionHeaderClass}
//                     onClick={() => setExpanded((prev) => !prev)}
//                 >
//                     <BioType className='h6 text-primary'>
//                         Intake Requests
//                     </BioType>
//                     {expanded ? (
//                         <KeyboardArrowUpIcon />
//                     ) : (
//                         <KeyboardArrowDownIcon />
//                     )}
//                 </div>

//                 {expanded && (
//                     <>
//                         <div className='p-8'>
//                             <TableContainer component={Paper}>
//                                 <Table
//                                     sx={{ minWidth: 650 }}
//                                     aria-label='simple table'
//                                 >
//                                     <TableHead>
//                                         <TableRow>
//                                             <TableCell>Order ID</TableCell>
//                                             <TableCell>
//                                                 Time Since Requested (hrs)
//                                             </TableCell>
//                                             <TableCell>
//                                                 Prescription &amp; Dose
//                                                 Requested
//                                             </TableCell>
//                                             <TableCell>
//                                                 Message Patient
//                                             </TableCell>
//                                             <TableCell align='right'></TableCell>
//                                             {/* Blank header for the buttons */}
//                                         </TableRow>
//                                     </TableHead>
//                                     <TableBody>
//                                         {orderData.map((row) => (
//                                             <TableRow
//                                                 key={row.orderId}
//                                                 sx={{
//                                                     '&:last-child td, &:last-child th':
//                                                         { border: 0 },
//                                                 }}
//                                             >
//                                                 <TableCell
//                                                     component='th'
//                                                     scope='row'
//                                                 >
//                                                     {row.orderId}
//                                                 </TableCell>
//                                                 <TableCell>
//                                                     {row.timeSinceRequested}
//                                                 </TableCell>
//                                                 <TableCell>
//                                                     {row.prescription}
//                                                 </TableCell>
//                                                 <TableCell>
//                                                     <Link
//                                                         className='text-primary'
//                                                         href={`/messages?contact=${patientId}`}
//                                                     >
//                                                         Message
//                                                     </Link>
//                                                 </TableCell>
//                                                 <TableCell align='right'>
//                                                     <Button
//                                                         variant='contained'
//                                                         onClick={() =>
//                                                             handleRedirect(
//                                                                 row.orderId
//                                                             )
//                                                         }
//                                                     >
//                                                         View
//                                                     </Button>
//                                                     <Button
//                                                         variant='outlined'
//                                                         color='primary'
//                                                         sx={{ ml: 1 }}
//                                                     >
//                                                         Approve
//                                                     </Button>
//                                                 </TableCell>
//                                             </TableRow>
//                                         ))}
//                                     </TableBody>
//                                 </Table>
//                             </TableContainer>
//                         </div>
//                     </>
//                 )}
//             </Paper>
//         </>
//     );
// }
