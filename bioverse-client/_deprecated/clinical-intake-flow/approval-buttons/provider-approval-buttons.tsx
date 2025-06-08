// 'use client';
// import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
// import { updateExistingOrderStatus } from '@/app/utils/actions/intake/order-control';
// import {
//     assignProviderToOrderUsingOrderId,
//     updateExistingOrderStatusAndPharmacyUsingId,
// } from '@/app/utils/database/controller/orders/orders-api';
// import { addProviderToPatientRelationship } from '@/app/utils/database/controller/patient_providers/patient-providers';
// import {
//     Alert,
//     Button,
//     Dialog,
//     DialogActions,
//     DialogContent,
//     DialogContentText,
//     DialogTitle,
//     MenuItem,
//     Select,
//     Snackbar,
// } from '@mui/material';
// import { useRouter } from 'next/navigation';
// import { Dispatch, SetStateAction, useState } from 'react';
// import { active_pharmacies } from './pharmacy-select-options';
// import { PRESCRIPTION_APPROVED } from '@/app/services/customerio/event_names';
// import { RenewalOrderStatus } from '@/app/types/renewal-orders/renewal-orders-types';
// import { OrderType } from '@/app/types/orders/order-types';
// import { updateRenewalOrderStatus } from '@/app/utils/database/controller/renewal_orders/renewal_orders';
// import { auditErrorToSupabase } from '@/app/utils/database/controller/site-error-audit/site_error_audit';
// import { triggerEvent } from '@/app/services/customerio/customerioApiFactory';

// interface Props {
//     orderId: number | string;
//     providerId: string;
//     subcsription_cadence: string;
//     orderStatus: string;
//     patientId: string;
//     orderType: OrderType;
//     orderData: any;
// }

// export default function ProviderPrescriptionApprovalButtons({
//     orderId,
//     providerId,
//     subcsription_cadence,
//     orderStatus,
//     patientId,
//     orderType,
//     orderData,
// }: Props) {
//     const [openConfirmationDialogue, setConfirmationDialogueOpenStatus] =
//         useState(false);
//     const [openDeclineVerifyDialogue, setDeclineVerifyDialogueOpenStatus] =
//         useState(false);
//     const [openPendingResponseDialog, setPendingResponseDialogOpenStatus] =
//         useState(false);
//     const [approvalSnackbarOpenState, setApprovalSnackbarOpenState] =
//         useState<boolean>(false);
//     const [selectedPharmacy, setSelectedPharmacy] =
//         useState<string>('Please Select');

//     const router = useRouter();

//     const refreshPage = () => {
//         router.refresh();
//     };

//     const handleOpenValidationMessage = () => {
//         setConfirmationDialogueOpenStatus(true);
//     };

//     const handleCloseValidationMessage = () => {
//         setConfirmationDialogueOpenStatus(false);
//     };

//     const handleOpenPendingVerificationMessage = () => {
//         setPendingResponseDialogOpenStatus(true);
//     };

//     const handleClosePendingVerificationMessage = () => {
//         setPendingResponseDialogOpenStatus(false);
//     };

//     const handleOpenDeclineVerifyMessage = () => {
//         setDeclineVerifyDialogueOpenStatus(true);
//     };

//     const handleCloseDeclineVerifyMessage = () => {
//         setDeclineVerifyDialogueOpenStatus(false);
//     };

//     const handleSnackbarClose = () => {
//         setApprovalSnackbarOpenState(false);
//     };

//     const handleSnackbarOpen = () => {
//         setApprovalSnackbarOpenState(true);
//     };

//     const getNextOrderStatus = (oldOrderStatus: string) => {
//         switch (oldOrderStatus) {
//             case 'Unapproved-CardDown':
//                 return 'Approved-CardDown';
//             case 'Unapproved-NoCard':
//                 return 'Approved-NoCard';
//             case 'Pending-Customer-Response':
//                 return 'Approved-CardDown';
//             case RenewalOrderStatus.CheckupComplete_ProviderUnapproved_Unpaid:
//                 return RenewalOrderStatus.CheckupComplete_ProviderApproved_Unprescribed_Unpaid;
//             case RenewalOrderStatus.CheckupComplete_ProviderUnapproved_Paid:
//                 return RenewalOrderStatus.CheckupComplete_ProviderApproved_Unprescribed_Paid;
//             default:
//                 return RenewalOrderStatus.Unknown;
//         }
//     };
//     const getCustomerIORenewalProductName = () => {
//         const eventName = `${orderData.product_href}-renewal`;
//         return eventName;
//     };

//     const handlePatientOrderApproval = async () => {
//         if (orderType === OrderType.Order) {
//             assignProviderToOrderUsingOrderId(Number(orderId), providerId);
//             addProviderToPatientRelationship(patientId, providerId);

//             await triggerEvent(patientId, PRESCRIPTION_APPROVED, {
//                 order_id: orderId,
//                 product_name: orderData.product_href,
//             });
//         } else if (orderType === OrderType.RenewalOrder) {
//             const eventName = getCustomerIORenewalProductName();
//             await triggerEvent(patientId, PRESCRIPTION_APPROVED, {
//                 order_id: orderId,
//                 product_name: eventName,
//             });
//         }
//         const nextOrderStatus = getNextOrderStatus(orderStatus);

//         updateExistingOrderStatusAndPharmacyUsingId(
//             orderId,
//             nextOrderStatus,
//             selectedPharmacy,
//             orderType
//         );

//         router.refresh();
//     };

//     const handleDeclineOrder = async () => {
//         if (orderType === OrderType.Order) {
//             assignProviderToOrderUsingOrderId(Number(orderId), providerId);
//             addProviderToPatientRelationship(patientId, providerId);
//         }

//         if (orderStatus === 'Unapproved-CardDown') {
//             updateExistingOrderStatus(orderId, 'Denied-CardDown');
//             router.refresh();
//         } else if (orderStatus === 'Unapproved-NoCard') {
//             updateExistingOrderStatus(orderId, 'Denied-NoCard');
//             router.refresh();
//         } else if (orderStatus === 'Pending-Customer-Response') {
//             updateExistingOrderStatus(orderId, 'Denied-CardDown');
//             router.refresh();
//         } else if (
//             orderStatus ===
//             RenewalOrderStatus.CheckupComplete_ProviderUnapproved_Unpaid
//         ) {
//             updateRenewalOrderStatus(
//                 Number(orderId),
//                 RenewalOrderStatus.Denied_Unpaid
//             );
//         } else if (
//             orderStatus ===
//             RenewalOrderStatus.CheckupComplete_ProviderUnapproved_Paid
//         ) {
//             updateRenewalOrderStatus(
//                 Number(orderId),
//                 RenewalOrderStatus.Denied_Paid
//             );
//         } else {
//             console.error(
//                 'Error: Could not identify order status for this order',
//                 orderData
//             );
//         }
//     };

//     const handlePatientOrderChangeToPendingCustomerResponse = async () => {
//         if (orderType === OrderType.Order) {
//             assignProviderToOrderUsingOrderId(Number(orderId), providerId);
//             addProviderToPatientRelationship(patientId, providerId);
//         }

//         updateExistingOrderStatus(orderId, 'Pending-Customer-Response');
//         handleClosePendingVerificationMessage();
//         router.refresh();
//     };

//     /**
//      * Deprecated method
//      * @author Nathan Cho
//      * Deprecated 2/12/2024
//      * Reason: In favor of charging the customer after the dose spot success message comes through instead.
//      */
//     // const handlePatientOrderApprovalOld = async () => {
//     //     if (subcsription_cadence === 'one-time') {
//     //         const paymentSuccess = await createPaymentIntent(orderId);

//     //         if (paymentSuccess === 'success') {
//     //             handleSnackbarOpen();
//     //             handleCloseValidationMessage();
//     //             refreshPage();
//     //         }
//     //     } else {
//     //         // const subscriptionPaymentSuccess = await createSubscriptionInStripe(
//     //         //     orderId,
//     //         //     providerId
//     //         // );
//     //         // if (subscriptionPaymentSuccess === 'success') {
//     //         //     handleSnackbarOpen();
//     //         //     handleCloseValidationMessage();
//     //         // }
//     //     }
//     // };

//     return (
//         <>
//             <div className='flex-col flex gap-2 w-full'>
//                 {orderStatus == 'Pending-Customer-Response' && (
//                     <BioType className='body1'>
//                         Current status: Pending Customer Response
//                     </BioType>
//                 )}
//                 <div className='flex-row gap-2 flex justify-between'>
//                     <Button
//                         variant='contained'
//                         fullWidth
//                         onClick={handleOpenValidationMessage}
//                     >
//                         Approve
//                     </Button>
//                     <Button
//                         variant='outlined'
//                         color='error'
//                         fullWidth
//                         onClick={handleOpenDeclineVerifyMessage}
//                     >
//                         Decline
//                     </Button>
//                 </div>
//                 {orderStatus === 'Unapproved-NoCard' && (
//                     <div>
//                         <Button
//                             variant='contained'
//                             color='success'
//                             onClick={handleOpenPendingVerificationMessage}
//                         >
//                             Request Extra Information
//                         </Button>
//                     </div>
//                 )}

//                 <ConfirmPaymentDialog
//                     open={openConfirmationDialogue}
//                     onClose={handleCloseValidationMessage}
//                     onConfirm={handlePatientOrderApproval}
//                     selectedPharmacy={selectedPharmacy}
//                     setSelectedPharmacy={setSelectedPharmacy}
//                 />

//                 <DenyPaymentDialog
//                     open={openDeclineVerifyDialogue}
//                     onClose={handleCloseDeclineVerifyMessage}
//                     onConfirm={handleDeclineOrder}
//                 />

//                 <ConfirmPendingResponseChangeDialog
//                     open={openPendingResponseDialog}
//                     onClose={handleClosePendingVerificationMessage}
//                     onConfirm={
//                         handlePatientOrderChangeToPendingCustomerResponse
//                     }
//                 />

//                 <div>
//                     <Snackbar
//                         anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
//                         open={approvalSnackbarOpenState}
//                         onClose={handleSnackbarClose}
//                         autoHideDuration={5000}
//                     >
//                         <Alert onClose={handleSnackbarClose} severity='success'>
//                             The order was approved successfully! Refresh the
//                             page to prescribe now.
//                         </Alert>
//                     </Snackbar>
//                 </div>
//             </div>
//         </>
//     );
// }

// interface ConfirmDialogProps {
//     open: boolean;
//     onClose: () => void;
//     onConfirm: () => void;
//     setSelectedPharmacy: Dispatch<SetStateAction<string>>;
//     selectedPharmacy: string;
// }

// interface DialogProps {
//     open: boolean;
//     onClose: () => void;
//     onConfirm: () => void;
// }

// const ConfirmPaymentDialog: React.FC<ConfirmDialogProps> = ({
//     open,
//     onClose,
//     onConfirm,
//     setSelectedPharmacy,
//     selectedPharmacy,
// }) => (
//     <Dialog
//         open={open}
//         onClose={onClose}
//         aria-labelledby='alert-dialog-title'
//         aria-describedby='alert-dialog-description'
//     >
//         <DialogTitle id='alert-dialog-title'>
//             {'Approve Patient Prescription Order?'}
//         </DialogTitle>
//         <DialogContent>
//             <DialogContentText id='alert-dialog-description'>
//                 Which Pharmacy will you be prescribing this with?
//             </DialogContentText>
//             <Select
//                 value={selectedPharmacy}
//                 onChange={(event) => setSelectedPharmacy!(event.target.value)}
//             >
//                 <MenuItem key={'empty'} value='Please Select'>
//                     <em>Please Select</em>
//                 </MenuItem>
//                 {active_pharmacies.map((item) => (
//                     <MenuItem key={item.key} value={item.value}>
//                         {item.key}
//                     </MenuItem>
//                 ))}
//             </Select>
//             <DialogContentText id='alert-dialog-description'>
//                 Are you sure you want to approve of this order?
//             </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//             <Button
//                 onClick={onConfirm}
//                 color='primary'
//                 disabled={selectedPharmacy === 'Please Select'}
//                 variant='contained'
//             >
//                 CONFIRM
//             </Button>
//             <Button
//                 onClick={onClose}
//                 autoFocus
//                 variant='outlined'
//                 color='error'
//             >
//                 CANCEL
//             </Button>
//         </DialogActions>
//     </Dialog>
// );

// const DenyPaymentDialog: React.FC<DialogProps> = ({
//     open,
//     onClose,
//     onConfirm,
// }) => (
//     <Dialog
//         open={open}
//         onClose={onClose}
//         aria-labelledby='alert-dialog-title'
//         aria-describedby='alert-dialog-description'
//     >
//         <DialogTitle id='alert-dialog-title'>
//             {'Decline patient order request?'}
//         </DialogTitle>
//         <DialogContent>
//             <DialogContentText id='alert-dialog-description'>
//                 Are you sure you want to decline this order? This action cannot
//                 be reversed by the provider.
//             </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//             <Button onClick={onConfirm} color='primary' variant='contained'>
//                 CONFIRM
//             </Button>
//             <Button
//                 onClick={onClose}
//                 autoFocus
//                 variant='outlined'
//                 color='error'
//             >
//                 CANCEL
//             </Button>
//         </DialogActions>
//     </Dialog>
// );

// const ConfirmPendingResponseChangeDialog: React.FC<DialogProps> = ({
//     open,
//     onClose,
//     onConfirm,
// }) => (
//     <Dialog
//         open={open}
//         onClose={onClose}
//         aria-labelledby='alert-dialog-title'
//         aria-describedby='alert-dialog-description'
//     >
//         <DialogTitle id='alert-dialog-title'>
//             {'Approve Patient Prescription Order?'}
//         </DialogTitle>
//         <DialogContent>
//             <DialogContentText id='alert-dialog-description'>
//                 This will change the status to Pending Customer Response, you
//                 will have to send a message to the customer. Would you like to
//                 make this change?
//             </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//             <Button onClick={onConfirm} color='primary' variant='contained'>
//                 CONFIRM
//             </Button>
//             <Button
//                 onClick={onClose}
//                 autoFocus
//                 variant='outlined'
//                 color='error'
//             >
//                 CANCEL
//             </Button>
//         </DialogActions>
//     </Dialog>
// );
