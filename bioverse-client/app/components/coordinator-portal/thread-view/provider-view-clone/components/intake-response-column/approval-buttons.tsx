'use client';

import { OrderType } from '@/app/types/orders/order-types';
import { RenewalOrderStatus } from '@/app/types/renewal-orders/renewal-orders-types';
import {
    assignProviderToOrderUsingOrderId,
    updateExistingOrderStatusAndPharmacyUsingId,
} from '@/app/utils/database/controller/orders/orders-api';
import { addProviderToPatientRelationship } from '@/app/utils/database/controller/patient_providers/patient-providers';
import { Button } from '@mui/material';
import { useState } from 'react';
import ConfirmPaymentDialog from './approval-dialog';
import { updateExistingOrderStatus } from '@/app/utils/actions/intake/order-control';
import { useRouter } from 'next/navigation';
import DenyPaymentDialog from './decline-dialog';
import { PRESCRIPTION_APPROVED } from '@/app/services/customerio/event_names';
import { updateRenewalOrderStatus } from '@/app/utils/database/controller/renewal_orders/renewal_orders';

interface ApprovalButtonProps {
    // orderType: OrderType;
    order_id: string;
    provider_id: string;
    patient_id: string;
    product_href: string;
    orderStatus: string;
    pharmacy: string;
    orderType: OrderType;
    orderData: DBOrderData;
}

export default function ApprovalButtons({
    // orderType,
    patient_id,
    provider_id,
    order_id,
    product_href,
    orderStatus,
    pharmacy,
    orderType,
    orderData,
}: ApprovalButtonProps) {
    const router = useRouter();
    const [openConfirmationDialogue, setConfirmationDialogueOpenStatus] =
        useState(false);
    const [selectedPharmacy, setSelectedPharmacy] =
        useState<string>('Please Select');
    const [openDeclineVerifyDialogue, setDeclineVerifyDialogueOpenStatus] =
        useState(false);

    const handleOpenValidationMessage = () => {
        setConfirmationDialogueOpenStatus(true);
    };

    const handleCloseValidationMessage = () => {
        setConfirmationDialogueOpenStatus(false);
    };

    const handleOpenDeclineVerifyMessage = () => {
        setDeclineVerifyDialogueOpenStatus(true);
    };

    const handleCloseDeclineVerifyMessage = () => {
        setDeclineVerifyDialogueOpenStatus(false);
    };

    const getNextOrderStatus = (oldOrderStatus: string) => {
        switch (oldOrderStatus) {
            case 'Unapproved-CardDown':
                return 'Approved-CardDown';
            case 'Unapproved-NoCard':
                return 'Approved-NoCard';
            case 'Pending-Customer-Response':
                return 'Approved-CardDown';
            case RenewalOrderStatus.CheckupComplete_ProviderUnapproved_Unpaid:
                return RenewalOrderStatus.CheckupComplete_Unprescribed_Unpaid;
            case RenewalOrderStatus.CheckupComplete_ProviderUnapproved_Paid:
                return RenewalOrderStatus.CheckupComplete_Unprescribed_Paid;
            default:
                return RenewalOrderStatus.Unknown;
        }
    };

    const getCustomerIORenewalProductName = () => {
        const eventName = `${product_href}-renewal`;
        return eventName;
    };

    const handlePatientOrderApproval = async () => {
        if (orderType === OrderType.Order) {
            assignProviderToOrderUsingOrderId(Number(order_id), provider_id);
            addProviderToPatientRelationship(patient_id, provider_id);

            // await postTransactionEvent(patient_id, PRESCRIPTION_APPROVED, {
            //     order_id: order_id,
            //     product_name: product_href,
            // });
        } else if (orderType === OrderType.RenewalOrder) {
            const eventName = getCustomerIORenewalProductName();
            // await postTransactionEvent(patient_id, PRESCRIPTION_APPROVED, {
            //     order_id: order_id,
            //     product_name: eventName,
            // });
        }
        const nextOrderStatus = getNextOrderStatus(orderStatus);

        await updateExistingOrderStatusAndPharmacyUsingId(
            order_id,
            nextOrderStatus,
            selectedPharmacy,
            orderType,
        );
        handleCloseValidationMessage();
        router.refresh();
    };

    const handleDeclineOrder = async () => {
        if (orderType === OrderType.Order) {
            assignProviderToOrderUsingOrderId(Number(order_id), provider_id);
            addProviderToPatientRelationship(patient_id, provider_id);
        }

        if (orderStatus === 'Unapproved-CardDown') {
            updateExistingOrderStatus(order_id, 'Denied-CardDown');
            router.refresh();
        } else if (orderStatus === 'Unapproved-NoCard') {
            updateExistingOrderStatus(order_id, 'Denied-NoCard');
            router.refresh();
        } else if (orderStatus === 'Pending-Customer-Response') {
            updateExistingOrderStatus(order_id, 'Denied-CardDown');
            router.refresh();
        } else if (
            orderStatus ===
            RenewalOrderStatus.CheckupComplete_ProviderUnapproved_Unpaid
        ) {
            updateRenewalOrderStatus(
                orderData.id,
                RenewalOrderStatus.Denied_Unpaid,
            );
        } else if (
            orderStatus ===
            RenewalOrderStatus.CheckupComplete_ProviderUnapproved_Paid
        ) {
            updateRenewalOrderStatus(
                orderData.id,
                RenewalOrderStatus.Denied_Paid,
            );
        } else {
            console.error(
                'Error: Could not identify order status for this order',
                order_id,
            );
        }
    };

    return (
        <>
            <Button variant="contained" onClick={handleOpenValidationMessage}>
                Approve
            </Button>
            <Button
                variant="outlined"
                color="error"
                onClick={handleOpenDeclineVerifyMessage}
            >
                Deny
            </Button>
            <ConfirmPaymentDialog
                open={openConfirmationDialogue}
                onClose={handleCloseValidationMessage}
                onConfirm={handlePatientOrderApproval}
                setSelectedPharmacy={setSelectedPharmacy}
                selectedPharmacy={selectedPharmacy}
            />
            <DenyPaymentDialog
                open={openDeclineVerifyDialogue}
                onClose={handleCloseDeclineVerifyMessage}
                onConfirm={handleDeclineOrder}
            />
        </>
    );
}
