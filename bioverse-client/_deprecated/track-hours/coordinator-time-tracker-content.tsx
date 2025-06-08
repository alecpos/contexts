// 'use client';

// import React, { useState } from 'react';
// import BioType from '../../global-components/bioverse-typography/bio-type/bio-type';
// import {
//     MenuItem,
//     Paper,
//     Select,
//     Table,
//     TableBody,
//     TableCell,
//     TableContainer,
//     TableHead,
//     Button,
//     TableRow,
// } from '@mui/material';
// import useSWR from 'swr';
// import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import {
//     getAllAuditedCoordinators,
//     type AuditedCoordinator,
// } from '@/app/utils/database/controller/coordinator_activity_audit/coordinator_activity_audit-api';

// interface TimeTrackerContentProps {}

// export default function TimeTrackerContent({}: TimeTrackerContentProps) {
//     const [startDate, setStartDate] = useState<Date>(() => {
//         const today = new Date();
//         const sevenDaysAgo = new Date(today);
//         sevenDaysAgo.setDate(today.getDate() - 7);
//         return sevenDaysAgo;
//     });
//     const [endDate, setEndDate] = useState<Date>(new Date());
//     const [tableData, setTableData] = useState<TableArrayEntry[] | undefined>(
//         undefined
//     );
//     const [selectedCoordinator, setSelectedCoordinator] =
//         useState<string>('select coordinator');

//     const { data: allCoordinators, isLoading } = useSWR<AuditedCoordinator[]>(
//         'all-coordinators',
//         () => getAllAuditedCoordinators()
//     );

//     const formatDate = (timestamp: number) => {
//         return new Date(timestamp).toLocaleString();
//     };

//     const calculateDuration = (start: number, end: number) => {
//         const durationMs = end - start;
//         const hours = Math.floor(durationMs / 3600000);
//         const minutes = Math.floor((durationMs % 3600000) / 60000);
//         return `${hours}h ${minutes}m`;
//     };

//     const calculateTotalHours = () => {
//         if (!tableData || tableData.length === 0) return '0h 0m';

//         const totalMilliseconds = tableData.reduce((total, entry) => {
//             return (
//                 total +
//                 (entry.end_session_timestamp - entry.start_session_timestamp)
//             );
//         }, 0);

//         const totalHours = Math.floor(totalMilliseconds / 3600000);
//         const totalMinutes = Math.floor((totalMilliseconds % 3600000) / 60000);

//         return `${totalHours}h ${totalMinutes}m`;
//     };

//     return (
//         <div className='flex flex-col w-full items-center justify-center mt-32 '>
//             <Paper className='flex flex-col w-[80%] p-4'>
//                 <BioType className='itd-h1'>Track Coordinator Hours:</BioType>

//                 <LocalizationProvider dateAdapter={AdapterDateFns}>
//                     <div className='flex flex-row space-x-4 p-4'>
//                         <div className='flex flex-col'>
//                             <BioType className='itd-body'>Start Date:</BioType>
//                             <DatePicker
//                                 value={startDate}
//                                 onChange={(newValue) => {
//                                     if (newValue) setStartDate(newValue);
//                                 }}
//                             />
//                         </div>
//                         <div className='flex flex-col'>
//                             <BioType className='itd-body'>End Date:</BioType>
//                             <DatePicker
//                                 value={endDate}
//                                 onChange={(newValue) => {
//                                     if (newValue) setEndDate(newValue);
//                                 }}
//                             />
//                         </div>
//                     </div>
//                 </LocalizationProvider>

//                 <div
//                     id='provider-select'
//                     className='flex flex-col p-4 max-w-[30%]'
//                 >
//                     <BioType className='itd-body'>Select Coordinator:</BioType>
//                     <Select
//                         value={selectedCoordinator}
//                         variant='standard'
//                         onChange={(e) => {
//                             setSelectedCoordinator(e.target.value as string);
//                         }}
//                     >
//                         <MenuItem value={'none'} disabled>
//                             Select Coordinator
//                         </MenuItem>

//                         {allCoordinators &&
//                             allCoordinators.map((coordinator, index) => (
//                                 <MenuItem key={index} value={coordinator.id}>
//                                     {coordinator.display_name}
//                                 </MenuItem>
//                             ))}
//                     </Select>
//                 </div>

//                 {selectedCoordinator !== 'select coordinator' && (
//                     <Button
//                         variant='contained'
//                         className='w-48 ml-5'
//                         onClick={() => {
//                             setSelectedCoordinator('select coordinator');
//                         }}
//                     >
//                         Back
//                     </Button>
//                 )}

//                 <div className='flex p-4'>
//                     {' '}
//                     {selectedCoordinator !== 'select coordinator' ? (
//                         <TableContainer>
//                             <Table>
//                                 <TableHead>
//                                     <TableRow>
//                                         <TableCell>Start Time</TableCell>
//                                         <TableCell>End Time</TableCell>
//                                         <TableCell>Duration</TableCell>
//                                     </TableRow>
//                                 </TableHead>
//                             </Table>
//                         </TableContainer>
//                     ) : (
//                         <TableContainer>
//                             <Table>
//                                 <TableHead>
//                                     <TableRow>
//                                         <TableCell>Coordinator</TableCell>
//                                         <TableCell>Msgs. Opened</TableCell>
//                                         <TableCell>Msgs. Answered</TableCell>
//                                     </TableRow>
//                                 </TableHead>
//                                 <TableBody>
//                                     {allCoordinators &&
//                                         allCoordinators.map(
//                                             (coordinator, index) => (
//                                                 <TableRow key={index}>
//                                                     <TableCell>
//                                                         {
//                                                             coordinator.display_name
//                                                         }
//                                                     </TableCell>
//                                                     <TableCell>
//                                                         {
//                                                             coordinator.thread_views
//                                                         }
//                                                     </TableCell>
//                                                     <TableCell>
//                                                         {
//                                                             coordinator.messages_answered
//                                                         }
//                                                     </TableCell>
//                                                 </TableRow>
//                                             )
//                                         )}
//                                 </TableBody>
//                             </Table>
//                         </TableContainer>
//                     )}
//                 </div>
//                 {tableData && tableData.length > 0 && (
//                     <div className='flex justify-end p-4 mr-20'>
//                         <BioType className='itd-body'>
//                             Total Hours: {calculateTotalHours()}
//                         </BioType>
//                     </div>
//                 )}
//             </Paper>
//         </div>
//     );
// }

// interface TableArrayEntry {
//     start_session_timestamp: number;
//     end_session_timestamp: number;
//     session_time: number;
// }
