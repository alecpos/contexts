// 'use client';
// import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
// import { Paper } from '@mui/material';
// import { useState } from 'react';
// import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
// import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

// interface Props {
//     patientData: any;
//     orderData: any;
//     showAddress: boolean;
// }

// export default function ProviderPatientInformation({
//     patientData,
//     orderData,
//     showAddress,
// }: Props) {
//     const [expanded, setExpanded] = useState<boolean>(true);

//     const sectionHeaderClass = `flex flex-row items-center gap-2 p-8`;

//     const patientDataRow = `flex flex-row gap-3 px-4`;
//     const patientDataColumn = `flex flex-col gap-[6px] w-1/2 justify-between flex-grow px-4 py-2`;

//     return (
//         <>
//             <Paper className='w-full'>
//                 <div
//                     className={sectionHeaderClass}
//                     onClick={() => setExpanded((prev) => !prev)}
//                 >
//                     <BioType className='h6 text-primary'>Patient Notes</BioType>
//                     {expanded ? (
//                         <KeyboardArrowUpIcon />
//                     ) : (
//                         <KeyboardArrowDownIcon />
//                     )}
//                 </div>

//                 {expanded && (
//                     <>
//                         <div
//                             id='patient-information'
//                             className='flex flex-col pb-8'
//                         >
//                             {patientData && (
//                                 <>
//                                     <div className={patientDataRow}>
//                                         <div className={patientDataColumn}>
//                                             <BioType className='subtitle3'>
//                                                 First Name
//                                             </BioType>
//                                             <BioType className='body1'>
//                                                 {patientData.first_name}
//                                             </BioType>
//                                         </div>

//                                         <div className={patientDataColumn}>
//                                             <BioType className='subtitle3'>
//                                                 Last Name
//                                             </BioType>
//                                             <BioType className='body1'>
//                                                 {patientData.last_name}
//                                             </BioType>
//                                         </div>
//                                     </div>

//                                     <div className={patientDataRow}>
//                                         <div className={patientDataColumn}>
//                                             <BioType className='subtitle3'>
//                                                 Date of Birth
//                                             </BioType>
//                                             <BioType className='body1'>
//                                                 {patientData.date_of_birth}
//                                             </BioType>
//                                         </div>

//                                         <div className={patientDataColumn}>
//                                             <BioType className='subtitle3'>
//                                                 Sex Assigned at Birth
//                                             </BioType>
//                                             <BioType className='body1'>
//                                                 {patientData.sex_at_birth}
//                                             </BioType>
//                                         </div>
//                                     </div>

//                                     {showAddress && (
//                                         <div className={patientDataRow}>
//                                             <div className={patientDataColumn}>
//                                                 <BioType className='subtitle3'>
//                                                     Mailing Address
//                                                 </BioType>
//                                                 <div>
//                                                     <BioType className='body1'>
//                                                         {
//                                                             orderData.address_line1
//                                                         }
//                                                         ,{' '}
//                                                         {
//                                                             orderData.address_line2
//                                                         }
//                                                     </BioType>
//                                                     <BioType className='body1'>
//                                                         {orderData.city},{' '}
//                                                         {orderData.state}{' '}
//                                                         {orderData.zip}
//                                                     </BioType>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     )}
//                                 </>
//                             )}
//                         </div>

//                         <div id='subscription-information'></div>
//                     </>
//                 )}
//             </Paper>
//         </>
//     );
// }
