// import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
// import { RenewalOrderStatus } from '@/app/types/renewal-orders/renewal-orders-types';
// import { StatusTag } from '@/app/types/status-tags/status-types';
// import { Chip } from '@mui/material';

// export const renderApprovalStatus = (status: string) => {
//     switch (status) {
//         case RenewalOrderStatus.CheckupComplete_ProviderUnapproved_Unpaid:
//         case RenewalOrderStatus.CheckupComplete_ProviderUnapproved_Paid:
//             return <BioType className='body1'>Check in / Review</BioType>;
//         case RenewalOrderStatus.CheckupComplete_ProviderApproved_Unprescribed_Paid:
//         case RenewalOrderStatus.CheckupComplete_ProviderApproved_Unprescribed_Unpaid:
//             return <BioType className='body1'>Check in / Prescribe</BioType>;
//         case 'Unapproved-CardDown':
//             return <BioType className='body1'>Pending Review</BioType>;
//         case 'Approved-CardDown':
//             return <BioType className='body1'>Approved</BioType>;
//         case 'Pending Payment':
//             return <BioType className='body1'>Payment Pending</BioType>;
//         case 'Denied-CardDown':
//             return <BioType className='body1'>Order Denied</BioType>;
//         case 'Pending-Customer-Response':
//             return (
//                 <BioType className='body1'>Pending Customer Response</BioType>
//             );
//         case 'Approved-PendingPayment':
//             return <BioType className=''>Pending Payment</BioType>;
//         case 'Approved-NoCard':
//             return <BioType className='body1'>Approved No Card</BioType>;
//         case 'Payment-Completed':
//             return <BioType className='body1'>Payment Completed</BioType>;
//         case 'Payment-Declined':
//             return <BioType className='body1'>Payment Declined</BioType>;
//         case 'Canceled':
//             return <BioType className='body1'>Canceled</BioType>;
//         case 'Incomplete':
//             return <BioType className='body1'>Incomplete</BioType>;
//         case 'Approved-NoCard-Finalized':
//             return (
//                 <BioType className='body1'>Approved No Card Finalized</BioType>
//             );
//         case 'Approved-CardDown-Finalized':
//             return (
//                 <BioType className='body1'>
//                     Approved Card Down Finalized
//                 </BioType>
//             );
//         case 'Order-Processing':
//             return <BioType className='body1'>Order Processing</BioType>;
//         case RenewalOrderStatus.PharmacyProcessing:
//             return <BioType className='body1'>Sent to Pharmacy</BioType>;
//         default:
//             return null;
//     }
// };

// export const determineLicenseSelfieStatus = (
//     license_url: string,
//     selfie_url: string
// ) => {
//     if (license_url && selfie_url) {
//         return <div className='body1 text-green-500'>Uploaded</div>;
//     }

//     return <div className='body1'>Not Uploaded</div>;
// };

// export const renderStatusTag = (status: string) => {
//     switch (status) {
//         case StatusTag.Overdue:
//             return (
//                 <Chip
//                     variant='outlined'
//                     color='error'
//                     label={StatusTag.Overdue}
//                 />
//             );
//         default:
//             return (
//                 <Chip
//                     variant='outlined'
//                     color='primary'
//                     label={status}
//                 />
//             )
//     }
// };
