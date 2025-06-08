'use client';

import { OrderStatus, OrderType } from '@/app/types/orders/order-types';
import {
    RenewalOrderStatus,
    SubscriptionCadency,
} from '@/app/types/renewal-orders/renewal-orders-types';
import {
    assignProviderToOrderUsingOrderId,
    updateExistingOrderStatusAndPharmacyUsingId,
} from '@/app/utils/database/controller/orders/orders-api';
import { addProviderToPatientRelationship } from '@/app/utils/database/controller/patient_providers/patient-providers';
import { Button, Tooltip } from '@mui/material';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { updateExistingOrderStatus } from '@/app/utils/actions/intake/order-control';
import { usePathname, useRouter } from 'next/navigation';
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
import { getMacroById } from '@/app/utils/database/controller/macros/macros-api';
import React from 'react';
import ConfirmPaymentDialog from '@/app/components/coordinator-portal/thread-view/provider-view-clone/components/intake-response-column/approval-dialog';
import { APPROVE_AND_PRESCRIBE_PRODUCTS } from '@/app/components/provider-portal/intake-view/v2/components/containers/utils/approval-pharmacy-scripts/approval-pharmacy-product-map';
import ConfirmApprovalAndScriptDialog from '@/app/components/provider-portal/intake-view/v2/components/intake-response-column/approve-script-dialog';
import QuarterlyFinalReviewDialog from '@/app/components/provider-portal/intake-view/v2/components/intake-response-column/quarterly-final-review-dialog';
import DeclineOrderDialog from '@/app/components/provider-portal/intake-view/v2/components/intake-response-column/decline-dialog';
import {
    IntakeButtonTypes,
    showButtonController,
} from '@/app/utils/functions/provider-portal/intakes/provider-intake-utils';
import AdjustDosingButton from '@/app/components/provider-portal/intake-view/v2/components/containers/components/adjust-dosing-button/AdjustDosingButton';
import { BV_AUTH_TYPE } from '@/app/types/auth/authorization-types';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import { getProviderMacroHTMLPrePopulated } from '@/app/components/provider-portal/intake-view/v2/components/containers/utils/post-prescribe-macro-selector/post-prescribe-macro-selector';
import { USStates } from '@/app/types/enums/master-enums';
import { PHARMACY } from '@/app/types/pharmacy-integrations/pharmacy-types';
import { isGLP1Product } from '@/app/utils/functions/pricing';
import { ProviderTaskNames } from '@/app/utils/constants/provider-portal/ProviderTasks';

interface ApprovalButtonProps {
    provider_id: string;
    patientData: DBPatientData;
    orderType: OrderType;
    orderData: DBOrderData;
    mutateIntakeData: KeyedMutator<any>;
    setMessageContent: Dispatch<SetStateAction<string>>;
    setCanProceed?: Dispatch<SetStateAction<boolean>>;
    setResponseRequired: Dispatch<SetStateAction<boolean>>;
    statusTag: string | undefined;
    currentMonth: number;
    currentDosage: string;
    employeeAuthorization: BV_AUTH_TYPE | null;
    dashboardTitle: any;
}

const APPROVAL_MACRO_CREATED_PRODUCTS: PRODUCT_HREF[] = [
    PRODUCT_HREF.TRETINOIN,
];

export default function ProviderReviewApprovalButtons({
    provider_id,
    orderType,
    orderData,
    patientData,
    mutateIntakeData,
    setMessageContent,
    setCanProceed,
    setResponseRequired,
    statusTag,
    currentMonth,
    currentDosage,
    employeeAuthorization,
    dashboardTitle,
}: ApprovalButtonProps) {
    const router = useRouter();

    const pathName = usePathname();

    console.log('path path: ', pathName);

    const patient_id = patientData.id;
    const order_id =
        orderType === OrderType.Order
            ? orderData.id
            : orderData.renewal_order_id;
    const product_href = orderData.product_href;
    const orderStatus = orderData.order_status;

    const [showButton, setShowButton] = useState<string>(
        IntakeButtonTypes.None
    );

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

    //determine which buttons to show based on the task name (dashboardTitle)
    useEffect(() => {
        if (isGLP1Product(product_href)) {
            if (!dashboardTitle || !dashboardTitle?.taskName) {
                setShowButton(IntakeButtonTypes.None);
                return;
            }
            switch (dashboardTitle.taskName) {
                case ProviderTaskNames.SubscriptionReactivation:
                    setShowButton(IntakeButtonTypes.ApprovalButtons);
                    break;
                case ProviderTaskNames.ManuallyCreatedOrder:
                    setShowButton(IntakeButtonTypes.ApprovalButtons);
                    break;
                case ProviderTaskNames.NewPatientPrescribe:
                    setShowButton(IntakeButtonTypes.ApprovalButtons);
                    break;
                case ProviderTaskNames.WLMonthlyCheckin:
                    setShowButton(IntakeButtonTypes.ApprovalButtons);
                    break;
                case ProviderTaskNames.AdditionalVialsRequest:
                    setShowButton(IntakeButtonTypes.ApprovalButtons);
                    break;
                case ProviderTaskNames.CustomDosageRequest:
                    setShowButton(IntakeButtonTypes.ApprovalButtons);
                    break;
                case ProviderTaskNames.ProviderMessage:
                    setShowButton(IntakeButtonTypes.None);
                    break;
                case ProviderTaskNames.NonRefillCheckin:
                    setShowButton(IntakeButtonTypes.AdjustDosing);
                    // setShowButton(IntakeButtonTypes.None); //temporarily removing adjust dosing (may 8th, 2025)
                    break;
                case ProviderTaskNames.RefillRequest:
                    setShowButton(IntakeButtonTypes.ApprovalButtons);
                    break;
                case ProviderTaskNames.WLCheckinReview: //<-- this should theoretically never happen
                    setShowButton(IntakeButtonTypes.None);
                    break;
                case ProviderTaskNames.WLQuarterlyCheckin: //<-- this should theoretically never happen
                    setShowButton(IntakeButtonTypes.None);
                    break;
                default:
                    setShowButton(IntakeButtonTypes.None);
            }
        } else {
            //end of GLP1 product button logic (based on titles)
            const buttonController = showButtonController(
                orderData.order_status,
                statusTag,
                orderData.subscription_type as SubscriptionCadency,
                employeeAuthorization,
                orderData,
                orderType
            );
            console.log(
                'current show button controller result: ',
                buttonController
            );
            setShowButton(buttonController);
        }
    }, [
        orderData.order_status,
        statusTag,
        orderData.subscription_type,
        dashboardTitle,
    ]);

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

            if (
                APPROVAL_MACRO_CREATED_PRODUCTS.includes(
                    orderData.product_href as PRODUCT_HREF
                )
            ) {
                const htmlMacroText = await getProviderMacroHTMLPrePopulated(
                    orderData.product_href,
                    orderData.variant_index,
                    patientData,
                    orderData.assigned_provider
                );

                if (htmlMacroText) {
                    setMessageContent(htmlMacroText);
                }
            }

            handleCloseValidationMessage();
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
            refundPatientForSubscription(
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

        if (product_href === 'semaglutide' || product_href === 'tirzepatide') {
            const { data: messageMacro } = await getMacroById(238);
            setMessageContent(messageMacro?.macroHtml);
        }

        if (setCanProceed) {
            setCanProceed(true);
        }

        handleCloseDeclineVerifyMessage();
    };

    const isApproveButtonDisabled = (orderData: DBOrderData): boolean => {
        // Add more conditions here as needed
        if (orderData.state === USStates.NorthCarolina) {
            if (
                orderData.assigned_pharmacy === PHARMACY.CUREXA ||
                orderData.assigned_pharmacy === PHARMACY.TMC
            ) {
                return true;
            }
        }
        return false;
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

    const DO_NOT_PRESCRIBE_ORDER_STATUSES = [OrderStatus.DeniedCardDown];
    /**
     * Logic to not show buttons for an order with status in the above array.
     */
    const disabled = isApproveButtonDisabled(orderData);

    /**
     * code for RN portal -> Rn's do not need buttons.
     * @author Nathan
     *
     * If the RN needs buttons in the future, please remove this code below.
     */
    if (pathName.includes('registered-nurse')) {
        return null;
    }

    if (showButton === IntakeButtonTypes.ApprovalButtons) {
        return (
            <>
                <Tooltip
                    title={
                        disabled
                            ? `Cannot prescribe ${orderData.assigned_pharmacy} to North Carolina`
                            : ''
                    }
                    arrow
                >
                    {/* Wrapper span ensures the Tooltip is properly triggered */}
                    <span style={{ display: 'inline-block' }}>
                        <Button
                            variant='contained'
                            onClick={handleOpenValidationMessage}
                            disabled={disabled}
                            style={{
                                pointerEvents: disabled ? 'none' : 'auto',
                            }} // Ensures tooltip triggers
                            sx={{
                                borderRadius: '12px',
                                backgroundColor: 'black',
                                paddingX: '32px',
                                paddingY: '14px',
                                ':hover': {
                                    backgroundColor: 'darkslategray',
                                },
                            }}
                        >
                            <span className='normal-case intake-v3-form-label-bold text-white'>
                                Approve
                            </span>
                        </Button>
                    </span>
                </Tooltip>
                <Button
                    variant='outlined'
                    color='error'
                    onClick={handleOpenDeclineVerifyMessage}
                    sx={{
                        borderRadius: '12px',
                        paddingX: '32px',
                        paddingY: '14px',
                    }}
                >
                    <span className='normal-case intake-v3-form-label-bold'>
                        Deny
                    </span>
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
                    activeProviderId={provider_id}
                    setMessageContent={setMessageContent}
                />
            </>
        );
    } else if (showButton === IntakeButtonTypes.AdjustDosing) {
        return (
            <AdjustDosingButton
                patient_id={patientData.id}
                order_data={orderData}
                mutateIntakeData={mutateIntakeData}
                setMessageContent={setMessageContent}
                patientData={patientData}
                currentMonth={currentMonth}
                currentDosage={currentDosage}
            />
        );
    }

    return null;
}
