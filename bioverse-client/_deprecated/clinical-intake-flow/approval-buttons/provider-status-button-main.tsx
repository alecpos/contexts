// 'use client';
// import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
// import { ConvertDatabaseOrderStatusToPlainText } from '../intake-display/status-parser/status-parser';
// import ProviderPrescriptionApprovalButtons from './provider-approval-buttons';
// import DoseSpotPatientCreationButton from './dose-spot-patient-creation-button';
// import { Dispatch, SetStateAction, useEffect, useState } from 'react';
// import DoseSpotPatientUpdateButton from './dose-spot-update-patient-button';
// import { Button, Paper } from '@mui/material';
// import FinalizeOrderButton from './finalize-order-button';
// import ReadyToPrescribeButton from './ready-to-prescribe-button';
// import { RenewalOrderStatus } from '@/app/types/renewal-orders/renewal-orders-types';
// import { OrderType } from '@/app/types/orders/order-types';

// /**
//  * author: @NathanCho
//  * Created Feb 5
//  *
//  * Purpose: Main container for prescriber button logic. It needs to show different buttons depending on the status of the order.
//  */

// interface Props {
//     orderData: any;
//     providerId: string;
//     orderId: string;
//     patientData: any;
//     setPrescribeWindowState: Dispatch<SetStateAction<boolean>>;
//     prescribeWindowOpen: boolean;
//     orderType: OrderType;
// }

// export default function ProviderStatusButtonMain({
//     orderData,
//     providerId,
//     orderId,
//     patientData,
//     setPrescribeWindowState,
//     prescribeWindowOpen,
//     orderType,
// }: Props) {
//     const [doseSpotId, setDoseSpotId] = useState<string>(
//         patientData.dose_spot_id
//     );

//     useEffect(() => {}, [prescribeWindowOpen]);

//     function renderAssignedPhamracy(): string {
//         switch (orderData.assigned_pharmacy) {
//             case 'curexa':
//                 return 'Curexa';
//             case 'ggm':
//                 return 'Gogo Meds';
//             case 'empower':
//                 return 'Empower';
//             case 'tmc':
//                 return 'Tailor Made Compounds';

//             default:
//                 return 'Error, please refresh page';
//         }
//     }

//     /**
//      *
//      * @author Nathan Cho
//      * While this below code to render the right button is very overloaded.
//      * I was in a mad rush to create this. If you are seeing this in the future, please organize.
//      * Essentially, it should show the ability to approve or deny if it is unapproved.
//      * If it is card down, you should be able to create dose spot patients for ggm/curexa orders
//      * And if tmc/empower it is immediately prescribable.
//      */

//     // Use order.id if regular order, otherwise renewal_order_id

//     const formattedOrderId =
//         orderType === OrderType.Order ? Number(orderId) : orderId;

//     switch (orderData.order_status) {
//         case RenewalOrderStatus.CheckupComplete_ProviderUnapproved_Unpaid:
//         case RenewalOrderStatus.CheckupComplete_ProviderUnapproved_Paid:
//         case 'Unapproved-NoCard':
//         case 'Unapproved-CardDown':
//         case 'Pending-Customer-Response':
//             return (
//                 <>
//                     <BioType className='label1'>
//                         Approve prescription request?
//                     </BioType>
//                     {providerId && (
//                         <ProviderPrescriptionApprovalButtons
//                             orderStatus={orderData.order_status}
//                             orderId={formattedOrderId}
//                             providerId={providerId}
//                             subcsription_cadence={orderData.subscription_type}
//                             patientId={orderData.customer_uid}
//                             orderType={orderType}
//                             orderData={orderData}
//                         />
//                     )}
//                 </>
//             );
//         case RenewalOrderStatus.CheckupComplete_ProviderApproved_Unprescribed_Unpaid:
//         case RenewalOrderStatus.CheckupComplete_ProviderApproved_Unprescribed_Paid:
//             return (
//                 <div>
//                     <BioType className='body1 text-red-500 mb-2'>
//                         Renewal order has been approved, but patient needs to be
//                         prescribed
//                     </BioType>
//                     <ReadyToPrescribeButton
//                         orderData={orderData}
//                         providerId={providerId}
//                         setPrescribeWindowState={setPrescribeWindowState}
//                     />
//                 </div>
//             );
//         case 'Payment-Completed':
//         case 'Approved-CardDown':
//             return (
//                 <>
//                     {orderData.order_status == 'Payment-Completed' ? (
//                         <BioType className='body1 text-green-600 mb-2'>
//                             This payment has succeeded, but is not prescribed
//                         </BioType>
//                     ) : (
//                         <></>
//                     )}
//                     {orderData.assigned_pharmacy === 'curexa' ||
//                     orderData.assigned_pharmacy === 'ggm' ? (
//                         <>
//                             {doseSpotId ? (
//                                 <>
//                                     {patientData.personal_data_recently_changed ? (
//                                         <DoseSpotPatientUpdateButton
//                                             providerId={providerId}
//                                             patientData={patientData}
//                                             patientId={orderData.customer_uid}
//                                             orderData={orderData}
//                                         />
//                                     ) : !prescribeWindowOpen ? (
//                                         <>
//                                             <ReadyToPrescribeButton
//                                                 orderData={orderData}
//                                                 providerId={providerId}
//                                                 setPrescribeWindowState={
//                                                     setPrescribeWindowState
//                                                 }
//                                             />
//                                         </>
//                                     ) : (
//                                         <>
//                                             (
//                                             <FinalizeOrderButton
//                                                 orderId={orderId}
//                                                 orderStatus={
//                                                     orderData.order_status
//                                                 }
//                                             />
//                                             )
//                                         </>
//                                     )}
//                                 </>
//                             ) : (
//                                 <DoseSpotPatientCreationButton
//                                     providerId={providerId}
//                                     patientData={patientData}
//                                     patientId={orderData.customer_uid}
//                                     setDoseSpotId={setDoseSpotId}
//                                     orderData={orderData}
//                                 />
//                             )}
//                         </>
//                     ) : (
//                         <>
//                             <ReadyToPrescribeButton
//                                 orderData={orderData}
//                                 providerId={providerId}
//                                 setPrescribeWindowState={
//                                     setPrescribeWindowState
//                                 }
//                             />
//                         </>
//                     )}
//                 </>
//             );

//         case 'Approved-NoCard':
//             return (
//                 <>
//                     {doseSpotId ? (
//                         <>
//                             {patientData.personal_data_recently_changed ? (
//                                 <DoseSpotPatientUpdateButton
//                                     providerId={providerId}
//                                     patientData={patientData}
//                                     patientId={orderData.customer_uid}
//                                     orderData={orderData}
//                                 />
//                             ) : !prescribeWindowOpen ? (
//                                 <>
//                                     <ReadyToPrescribeButton
//                                         orderData={orderData}
//                                         providerId={providerId}
//                                         setPrescribeWindowState={
//                                             setPrescribeWindowState
//                                         }
//                                     />
//                                 </>
//                             ) : (
//                                 <>
//                                     {/* <FinalizeOrderButton
//                     orderId={orderId}
//                     orderStatus={orderData.order_status}
//                   /> */}
//                                 </>
//                             )}
//                         </>
//                     ) : (
//                         <>
//                             <DoseSpotPatientCreationButton
//                                 providerId={providerId}
//                                 patientData={patientData}
//                                 patientId={orderData.customer_uid}
//                                 setDoseSpotId={setDoseSpotId}
//                                 orderData={orderData}
//                             />
//                         </>
//                     )}
//                 </>
//             );

//         default:
//             return (
//                 <>
//                     <Paper className='p-2'>
//                         <ConvertDatabaseOrderStatusToPlainText
//                             status={orderData.order_status}
//                         />
//                     </Paper>
//                 </>
//             );
//     }
// }
