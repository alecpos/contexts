// import Link from 'next/link';
// import styles from './styles.module.scss';
// import { getDateHourDifference } from '@/app/utils/functions/dates';

// interface Props {
//     dashboardEntries: PatientOrderProviderDetails[];
// }

// const DASHBOARD_HEADERS = [
//     'Order ID',
//     'Patient Name',
//     'Time Since Requested (hrs)',
//     'State Delivery Address',
//     'Prescription & Dose Requested',
//     'Message Patient',
//     'E-Prescribe',
// ];

// export default function ProviderOrderTable({ dashboardEntries }: Props) {
//     const currTime = new Date();

//     return (
//         <>
//             <table className={styles.table}>
//                 <thead>
//                     <tr>
//                         {DASHBOARD_HEADERS.map((dashboardHeaderItem) => (
//                             <th key={dashboardHeaderItem}>
//                                 {dashboardHeaderItem}
//                             </th>
//                         ))}
//                     </tr>
//                 </thead>

//                 <tbody>
//                     {dashboardEntries.map((dashboardOrderEntry) => (
//                         <tr key={dashboardOrderEntry.id}>
//                             <td>
//                                 <Link
//                                     href={`/provider/patient-intakes/${dashboardOrderEntry.id}`}
//                                 >
//                                     {dashboardOrderEntry.id}
//                                 </Link>
//                             </td>
//                             <td>
//                                 <Link
//                                     href={`/provider/patient-overview/${dashboardOrderEntry.patientId}`}
//                                 >
//                                     {dashboardOrderEntry.patientName}
//                                 </Link>
//                             </td>
//                             <td>
//                                 {getDateHourDifference(
//                                     currTime,
//                                     new Date(
//                                         dashboardOrderEntry.requestSubmissionTime,
//                                     ),
//                                 )}{' '}
//                                 hours
//                             </td>
//                             <td>{dashboardOrderEntry.deliveryState}</td>
//                             <td>{dashboardOrderEntry.prescription}</td>
//                             <td>
//                                 <Link
//                                     href={`/provider/messages?contact=${dashboardOrderEntry.patientId}`}
//                                 >
//                                     Messages
//                                 </Link>
//                             </td>
//                             <td>
//                                 {(dashboardOrderEntry.approvalStatus ===
//                                     'Unapproved-CardDown' ||
//                                     dashboardOrderEntry.approvalStatus ===
//                                         'Unapproved-NoCard') && (
//                                     <>
//                                         <Link
//                                             className={styles.approve}
//                                             href={``}
//                                         >
//                                             Approve
//                                         </Link>
//                                         {' / '}
//                                         <Link className={styles.deny} href={``}>
//                                             Deny
//                                         </Link>
//                                     </>
//                                 )}
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         </>
//     );
// }
