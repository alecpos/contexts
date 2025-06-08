// 'use client';
// import {
//     Dialog,
//     DialogTitle,
//     DialogContent,
//     DialogContentText,
//     DialogActions,
//     Button,
//     Alert,
//     Snackbar,
// } from '@mui/material';
// import { Dispatch, SetStateAction, useState } from 'react';
// import ChangePharmacyMenu from './change-assigned-pharmacy-menu';
// import { updateAssignedPharmacyWithOrderId } from '@/app/utils/database/controller/orders/orders-api';
// import { useRouter } from 'next/navigation';
// import { OrderType } from '@/app/types/orders/order-types';

// /**
//  * Author: @NathanCho
//  * Created Feb 5, 2024
//  *
//  * Component Purpose: Dose Spot Patient Creation button activated by the Provider.
//  */

// interface Props {
//     providerId: string;
//     setPrescribeWindowState: Dispatch<SetStateAction<boolean>>;
//     orderData: any;
// }

// export default function ReadyToPrescribeButton({
//     providerId,
//     setPrescribeWindowState,
//     orderData,
// }: Props) {
//     const router = useRouter();
//     const [selectedPharmacy, setSelectedPharmacy] = useState<string>(
//         orderData.assigned_pharmacy
//     );

//     const renderDoseSpotWindow = () => {
//         setPrescribeWindowState(true);
//     };

//     const changeAssignedPharmacy = async () => {
//         await updateAssignedPharmacyWithOrderId(orderData.id, selectedPharmacy);
//         router.refresh();
//     };

//     return (
//         <>
//             <div className='flex-col flex gap-2'>
//                 <ChangePharmacyMenu
//                     orderId={orderData.id}
//                     selectedPharmacy={selectedPharmacy}
//                     setSelectedPharmacy={setSelectedPharmacy}
//                 />
//                 {selectedPharmacy === orderData.assigned_pharmacy ? (
//                     <Button variant='contained' onClick={renderDoseSpotWindow}>
//                         Open Prescribing Window
//                     </Button>
//                 ) : (
//                     <Button
//                         variant='contained'
//                         color='secondary'
//                         onClick={changeAssignedPharmacy}
//                     >
//                         Update Assigned Pharmacy
//                     </Button>
//                 )}
//             </div>
//         </>
//     );
// }
