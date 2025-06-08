'use client';

import { OrderType } from '@/app/types/orders/order-types';
import { RenewalOrderStatus } from '@/app/types/renewal-orders/renewal-orders-types';
import {
    assignProviderToOrderUsingOrderId,
    updateExistingOrderStatusAndPharmacyUsingId,
} from '@/app/utils/database/controller/orders/orders-api';
import { addProviderToPatientRelationship } from '@/app/utils/database/controller/patient_providers/patient-providers';
import { Button } from '@mui/material';
import { Dispatch, SetStateAction, useState } from 'react';
import ConfirmPaymentDialog from './approval-dialog';
import { updateExistingOrderStatus } from '@/app/utils/actions/intake/order-control';
import { useRouter } from 'next/navigation';
import DeclineOrderDialog from './decline-dialog';
import { PRESCRIPTION_APPROVED } from '@/app/services/customerio/event_names';
import { updateRenewalOrderStatus } from '@/app/utils/database/controller/renewal_orders/renewal_orders';
import { triggerEvent } from '@/app/services/customerio/customerioApiFactory';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { createNewProviderActivityAudit } from '@/app/utils/database/controller/provider_activity_audit/provider_activity_audit-api';
import { refundPatientForSubscription } from '@/app/(administration)/admin/stripe-api/stripe-api-actions';
import { auditStripe } from '@/app/utils/database/controller/stripe_audit/stripe_audit';
import { createUserStatusTagWAction } from '@/app/utils/database/controller/patient-status-tags/patient-status-tags-api';
import {
    StatusTag,
    StatusTagAction,
} from '@/app/types/status-tags/status-types';
import { KeyedMutator } from 'swr';
import { APPROVE_AND_PRESCRIBE_PRODUCTS } from '../containers/utils/approval-pharmacy-scripts/approval-pharmacy-product-map';
import ConfirmApprovalAndScriptDialog from './approve-script-dialog';
import { getMacroById } from '@/app/utils/database/controller/macros/macros-api';
import QuarterlyFinalReviewDialog from './quarterly-final-review-dialog';
import React from 'react';

interface ApprovalButtonProps {
    order_id: string;
    provider_id: string;
    patient_id: string;
    patientData: DBPatientData;
    product_href: string;
    orderStatus: string;
    pharmacy: string;
    orderType: OrderType;
    orderData: DBOrderData;
    mutateIntakeData: KeyedMutator<any>;
    setMessageContent: Dispatch<SetStateAction<string>>;
    setCanProceed?: Dispatch<SetStateAction<boolean>>;
    setClinicalNoteTextInputValue: Dispatch<SetStateAction<string>>;
    responseRequired: boolean;
    setResponseRequired: Dispatch<SetStateAction<boolean>>;
    statusTag: string | undefined;
    activeProviderId: string;
}

export default function ApprovalButtons({
    patient_id,
    provider_id,
    order_id,
    product_href,
    orderStatus,
    pharmacy,
    orderType,
    orderData,
    patientData,
    mutateIntakeData,
    setMessageContent,
    setCanProceed,
    setClinicalNoteTextInputValue,
    responseRequired,
    setResponseRequired,
    statusTag,
    activeProviderId,
}: ApprovalButtonProps) {
    const router = useRouter();
    const [openConfirmationDialogue, setConfirmationDialogueOpenStatus] =
        useState(false);
    const [approveAndPrescribeDialogOpen, setApproveAndPrescribeDialogOpen] =
        useState(false);

    const [quarterlyFinalReviewDialogOpen, setQuarterlyFinalReviewDialogOpen] =
        useState<boolean>(false);

    const [selectedPharmacy, setSelectedPharmacy] =
        useState<string>('Please Select');
    const [openDeclineVerifyDialogue, setDeclineVerifyDialogueOpenStatus] =
        useState(false);

    const handleOpenValidationMessage = () => {
        if (statusTag && statusTag === StatusTag.FinalReview) {
            setQuarterlyFinalReviewDialogOpen(true);
        } else if (
            APPROVE_AND_PRESCRIBE_PRODUCTS.includes(orderData.product_href)
        ) {
            setApproveAndPrescribeDialogOpen(true);
        } else setConfirmationDialogueOpenStatus(true);
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
            case RenewalOrderStatus.CheckupComplete_Unprescribed_Unpaid:
                return RenewalOrderStatus.CheckupComplete_Unprescribed_Unpaid;
            case RenewalOrderStatus.CheckupComplete_Unprescribed_Paid:
                return RenewalOrderStatus.CheckupComplete_Unprescribed_Paid;
            default:
                console.error(
                    'Unsure what order status to go to next',
                    patient_id,
                    orderData
                );
                return RenewalOrderStatus.Unknown;
        }
    };

    const handlePatientOrderApproval = async () => {
        await handleProviderApprovalAudit(true);

        try {
            if (orderType === OrderType.Order) {
                assignProviderToOrderUsingOrderId(
                    Number(order_id),
                    provider_id
                );
                addProviderToPatientRelationship(patient_id, provider_id);

                await triggerEvent(patient_id, PRESCRIPTION_APPROVED, {
                    order_id: order_id,
                    product_name: product_href,
                });
            } else if (orderType === OrderType.RenewalOrder) {
                await triggerEvent(patient_id, PRESCRIPTION_APPROVED, {
                    order_id: order_id,
                    product_name: `${product_href}-renewal`,
                });
            }
            const nextOrderStatus = getNextOrderStatus(orderStatus);

            await updateExistingOrderStatusAndPharmacyUsingId(
                order_id,
                nextOrderStatus,
                selectedPharmacy,
                orderType
            );
            handleCloseValidationMessage();
            router.refresh();
        } catch (error) {
            console.error('Error approving prescription', order_id, patient_id);
        }
    };

    const handleDeclineOrder = async () => {
        let handleStatusTagCreation = true;

        handleProviderApprovalAudit(false);

        if (orderType === OrderType.Order) {
            await assignProviderToOrderUsingOrderId(
                Number(order_id),
                provider_id
            );
            await addProviderToPatientRelationship(patient_id, provider_id);
        }

        if (orderStatus === 'Unapproved-CardDown') {
            await updateExistingOrderStatus(order_id, 'Denied-CardDown');
            router.refresh();
        } else if (orderStatus === 'Unapproved-NoCard') {
            await updateExistingOrderStatus(order_id, 'Denied-NoCard');
            router.refresh();
        } else if (orderStatus === 'Pending-Customer-Response') {
            await updateExistingOrderStatus(order_id, 'Denied-CardDown');
            router.refresh();
        } else if (
            orderStatus ===
            RenewalOrderStatus.CheckupComplete_Unprescribed_Unpaid
        ) {
            await updateRenewalOrderStatus(
                orderData.id,
                RenewalOrderStatus.Denied_Unpaid
            );
        } else if (
            orderStatus === RenewalOrderStatus.CheckupComplete_Unprescribed_Paid
        ) {
            // Refund Patient
            await refundPatientForSubscription(
                patient_id,
                parseInt(orderData.subscription_id)
            );

            await updateRenewalOrderStatus(
                orderData.id,
                RenewalOrderStatus.Denied_Paid
            );
        } else {
            handleStatusTagCreation = false;

            console.error(
                'Error: Could not identify order status for this order',
                order_id
            );
            await auditStripe(
                'Denial Failed Refund',
                null,
                null,
                patient_id,
                'N/A',
                null
            );
            await updateRenewalOrderStatus(
                orderData.id,
                RenewalOrderStatus.Denied_Unpaid
            );
        }

        if (handleStatusTagCreation) {
            await createUserStatusTagWAction(
                StatusTag.NE,
                order_id,
                StatusTagAction.REPLACE,
                patient_id,
                'Changed to a resolved status after order has been denied',
                'ffabc905-5508-4d54-98fb-1e2ef2b9e99a',
                ['N/E']
            );
        }

        //delete this:
        if (product_href === 'semaglutide' || product_href === 'tirzepatide') {
            const {
                status: messageStatus,
                data: messageMacro,
                error: messageError,
            } = await getMacroById(238);
            setMessageContent(messageMacro?.macroHtml);
        }

        if (setCanProceed) {
            setCanProceed(true);
        }

        handleCloseDeclineVerifyMessage();
    };

    const handleProviderApprovalAudit = async (approval: boolean) => {
        const time = new Date().getTime(); // Record start time
        const new_audit: ProviderActivityAuditCreateObject = {
            provider_id: (await readUserSession()).data.session?.user.id!,
            action: approval ? 'approve_intake' : 'deny_intake',
            timestamp: time,
            metadata: {
                pharmacy: selectedPharmacy,
            },
            environment: process.env.NEXT_PUBLIC_ENVIRONMENT!,
            ...(orderType === OrderType.RenewalOrder
                ? {
                      renewal_order_id: orderData.renewal_order_id,
                      order_id: orderData.original_order_id!,
                  }
                : { order_id: parseInt(order_id) }),
        };
        await createNewProviderActivityAudit(new_audit);
    };

    console.log('#@!$#@!$#OK@#LKL$KL#$K#$KO#');

    return (
        <>
            <Button variant='contained' onClick={handleOpenValidationMessage}>
                Approve
            </Button>
            <Button
                variant='outlined'
                color='error'
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

            <DeclineOrderDialog
                open={openDeclineVerifyDialogue}
                onClose={handleCloseDeclineVerifyMessage}
                onConfirm={handleDeclineOrder}
                orderData={orderData}
                patientData={patientData}
                orderType={orderType}
                setMessageContent={setMessageContent}
                mutateIntakeData={mutateIntakeData}
                handleProviderApprovalAudit={handleProviderApprovalAudit}
                setCanProceed={setCanProceed}
                handleCloseDeclineVerifyMessage={
                    handleCloseDeclineVerifyMessage
                }
            />

            <ConfirmApprovalAndScriptDialog
                open={approveAndPrescribeDialogOpen}
                onClose={() => setApproveAndPrescribeDialogOpen(false)}
                orderData={orderData}
                patientData={patientData}
                provider_id={provider_id}
                mutateIntakeData={mutateIntakeData}
                setMessageContent={setMessageContent}
                orderType={orderType}
                setResponseRequired={setResponseRequired}
            />

            <QuarterlyFinalReviewDialog
                open={quarterlyFinalReviewDialogOpen}
                onClose={() => setQuarterlyFinalReviewDialogOpen(false)}
                orderData={orderData}
                patientData={patientData}
                provider_id={provider_id}
                mutateIntakeData={mutateIntakeData}
                activeProviderId={activeProviderId}
                setMessageContent={setMessageContent}
            />
        </>
    );
}
