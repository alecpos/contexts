// import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
// import { RenewalOrderStatus } from '@/app/types/renewal-orders/renewal-orders-types';

// interface Props {
//     status: string;
// }

// export function ConvertDatabaseOrderStatusToPlainText({ status }: Props) {
//     switch (status) {
//         case 'Unapproved-NoCard':
//         case 'Unapproved-CardDown':
//             return (
//                 <BioType className='body1 text-orange-500'>
//                     {' '}
//                     Review Pending{' '}
//                 </BioType>
//             );
//         case 'Approved-NoCard':
//         case 'Approved-CardDown':
//             return (
//                 <BioType className='body1 text-green-500'> Reviewed </BioType>
//             );
//         case 'Payment-Completed':
//             return (
//                 <BioType className='body1 text-green-500'>
//                     {' '}
//                     Ready to Prescribe{' '}
//                 </BioType>
//             );
//         case 'Payment-Declined':
//             return (
//                 <BioType className='body1 text-red-500'>
//                     {' '}
//                     Payment Declined, Retrying{' '}
//                 </BioType>
//             );
//         case 'Denied-NoCard':
//         case 'Denied-CardDown':
//             return <BioType className='body1 text-red-500'> Declined </BioType>;
//         case 'Canceled':
//             return (
//                 <BioType className='body1 text-red-600'>
//                     {' '}
//                     Canceled by Patient{' '}
//                 </BioType>
//             );
//         case 'Incomplete':
//             return (
//                 <BioType className='body1 text-grey-500'> Incomplete </BioType>
//             );
//         case 'Pending-Customer-Response':
//             return (
//                 <BioType className='body1 text-orange-500'>
//                     {' '}
//                     Pending Patient Response{' '}
//                 </BioType>
//             );
//         case 'Approved-CardDown-Finalized':
//             return (
//                 <BioType className='body1 text-green-500'>
//                     {' '}
//                     Order Finalized By Provider{' '}
//                 </BioType>
//             );
//         case 'Approved-NoCard-Finalized':
//             return (
//                 <BioType className='body1 text-green-500'>
//                     {' '}
//                     Order Preapproved By Provider{' '}
//                 </BioType>
//             );
//         case RenewalOrderStatus.PharmacyProcessing:
//         case RenewalOrderStatus.CheckupComplete_ProviderApproved_Prescribed_Unpaid:
//             return (
//                 <BioType className='body1 text-green-500'>
//                     {' '}
//                     Prescription Submitted for Customer
//                 </BioType>
//             );
//         default:
//             return (
//                 <BioType className='body1 text-black'> Status Unknown </BioType>
//             );
//     }
// }
