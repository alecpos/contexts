// 'use client';
// import { updateExistingOrderStatus } from '@/app/utils/actions/intake/order-control';
// import { updatePatientDoseSpotPatientId } from '@/app/utils/actions/provider/patient-intake';
// import { addPatient } from '@/app/services/dosespot/v1/patient/patient-actions';
// import {
//     Dialog,
//     DialogTitle,
//     DialogContent,
//     DialogContentText,
//     DialogActions,
//     Button,
//     Alert,
//     Snackbar,
//     CircularProgress,
// } from '@mui/material';
// import { useRouter } from 'next/navigation';
// import { Dispatch, SetStateAction, useState } from 'react';

// /**
//  * Author: @NathanCho
//  * Created Feb 5, 2024
//  *
//  * Component Purpose: Dose Spot Patient Creation button activated by the Provider.
//  */

// interface Props {
//     orderId: string;
//     orderStatus: string;
// }

// export default function FinalizeOrderButton({ orderId, orderStatus }: Props) {
//     const [openConfirmationDialogue, setConfirmationDialogueOpenStatus] =
//         useState(false);
//     const [approvalSnackbarOpenState, setApprovalSnackbarOpenState] =
//         useState<boolean>(false);

//     const router = useRouter();

//     const handleOpenValidationMessage = () => {
//         setConfirmationDialogueOpenStatus(true);
//     };

//     const handleCloseValidationMessage = () => {
//         setConfirmationDialogueOpenStatus(false);
//     };

//     const handleSnackbarClose = () => {
//         setApprovalSnackbarOpenState(false);
//     };

//     const handleFinalizationOfOrder = async () => {
//         if (orderStatus === 'Approved-CardDown') {
//             await updateExistingOrderStatus(
//                 Number(orderId),
//                 'Approved-CardDown-Finalized'
//             );
//             router.refresh();
//         }

//         if (orderStatus === 'Approved-NoCard') {
//             await updateExistingOrderStatus(
//                 Number(orderId),
//                 'Approved-NoCard-Finalized'
//             );
//             router.refresh();
//         }
//     };

//     return (
//         <>
//             <div className='flex-row flex gap-2'>
//                 <Button
//                     variant='contained'
//                     color='secondary'
//                     onClick={handleOpenValidationMessage}
//                 >
//                     UPDATE AFTER PRESCRIBING
//                 </Button>

//                 <ConfirmOrderFinalizationDialog
//                     open={openConfirmationDialogue}
//                     onClose={handleCloseValidationMessage}
//                     onConfirm={handleFinalizationOfOrder}
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

// interface ConfirmOrderFinalizationDialogProps {
//     open: boolean;
//     onClose: () => void;
//     onConfirm: () => void;
// }

// const ConfirmOrderFinalizationDialog: React.FC<
//     ConfirmOrderFinalizationDialogProps
// > = ({ open, onClose, onConfirm }) => (
//     <Dialog
//         open={open}
//         onClose={onClose}
//         aria-labelledby='confirm-dose-spot-patient-creation-dialog-title'
//         aria-describedby='confirm-dose-spot-patient-creation-dialog-description'
//     >
//         <DialogTitle id='confirm-dose-spot-patient-creation-dialog-title'>
//             {'Finalize Order?'}
//         </DialogTitle>
//         <DialogContent>
//             <DialogContentText id='confirm-dose-spot-patient-creation-dialog-description'>
//                 Alert: Confirming this order will set the status to complete,
//                 and it will not appear in the dashboard. You can still modify
//                 the prescription details in the patient overview.
//             </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//             <Button onClick={onConfirm} color='primary' variant='contained'>
//                 UPDATE
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
