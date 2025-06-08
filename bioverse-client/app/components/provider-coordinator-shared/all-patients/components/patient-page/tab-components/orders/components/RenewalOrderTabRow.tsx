import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { itemList } from '@/app/services/pharmacy-integration/empower/empower-item-list';
import {
    RenewalOrderStatus,
    RenewalOrderTabs,
} from '@/app/types/renewal-orders/renewal-orders-types';
import {
    Button,
    Chip,
    Collapse,
    IconButton,
    TableCell,
    Tooltip,
    TableRow,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { Fragment, useState } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import BioverseSnackbarMessage from '@/app/components/global-components/snackbar/bioverse-snackbar';
import AddressEditDialog from '../../info/address-edit-dialog';
import { triggerEvent } from '@/app/services/customerio/customerioApiFactory';
import { WL_CHECKIN_INCOMPLETE } from '@/app/services/customerio/event_names';
import CancelationConfirmationDialog from './components/CancelationConfirmationDialog';
import {
    administrativeCancelRenewalOrder,
    updateRenewalOrderByRenewalOrderId,
} from '@/app/utils/database/controller/renewal_orders/renewal_orders';
import { Status } from '@/app/types/global/global-enumerators';
import { isEmpty } from 'lodash';
import { OrderType, ShippingStatus } from '@/app/types/orders/order-types';
import { BV_AUTH_TYPE } from '@/app/types/auth/authorization-types';
import { determineAccessByRoleName } from '@/app/utils/functions/auth/authorization/authorizaiton-helper';
import EscalateRenewalOrderDialog from './components/escalation/escalate-renewal-order-dialog';
import ResendScriptConfirmationDialog from './components/resend-script-confirmation';
import React from 'react';
import OrderTableConfirmationDialog from './components/confirmation-dialog';
import { logPatientAction } from '@/app/utils/database/controller/patient_action_history/patient-action-history';
import CoordinatorConfirmDosage from './components/CoordinatorConfirmDosage';
import { PatientActionTask } from '@/app/utils/database/controller/patient_action_history/patient-action-history-types';
import useSWR, { KeyedMutator } from 'swr';
import RetryPaymentDialogPatientChart from './components/RetryPaymentDialog';
import { PaymentFailureStatus } from '@/app/utils/database/controller/payment_failure_tracker/payment_failure_tracker_enums';
import PaymentFailureHistoryDialog from '../../info/payment-failure-dialog';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import {
    getPrescriptionSentAudit,
    getRenewalDosageSelectionAudit,
} from '@/app/utils/database/controller/order_data_audit/order_data_audit_api';
import { OrderDataAuditActions } from '@/app/utils/database/controller/order_data_audit/order_audit_descriptions';
import { RESEND_MAPPED_PRODUCTS } from './components/resend-script-view-components/resend-available-products';
import StatusDropdown from '@/app/components/provider-coordinator-shared/order-charts/components/StatusDropdown';
import RebootSubscriptionDialog from '../../info/reboot-subscription-dialog';
import { rebootSubscription } from '@/app/(administration)/admin/stripe-api/stripe-api-actions';
import { getDosageEquivalenceCodeFromVariantIndex } from '@/app/utils/classes/DosingChangeController/DosageChangeEquivalenceMap';
import { DosageChangeController } from '@/app/utils/classes/DosingChangeController/DosageChangeController';
import { convertBundleVariantToSingleVariant } from '@/app/utils/functions/pharmacy-helpers/bundle-variant-index-mapping';
import { getUserState } from '@/app/utils/database/controller/profiles/profiles';
import { USStates } from '@/app/types/enums/master-enums';


interface RenewalOrderTabRowProps {
    access_type: BV_AUTH_TYPE | null;
    profile_data: APProfileData;
    renewalOrder: RenewalOrderTabs;
    mutate_orders: KeyedMutator<any>;
}

export default function RenewalOrderTabRow({
    renewalOrder,
    access_type,
    profile_data,
    mutate_orders,
}: RenewalOrderTabRowProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [cancelationDialogOpen, setCancellationDialogOpen] =
        useState<boolean>(false);
    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
    const [snackbarMessage, setSnackbarMessage] = useState<string>('');
    const [snackbarStatus, setSnackbarStatus] = useState<'success' | 'error'>(
        'success'
    );
    const [showResendDialog, setShowResendDialog] = useState<boolean>(false);
    const [showEscalateDialog, setShowEscalateDialog] =
        useState<boolean>(false);
    const [addressEditBoxOpen, setAddressEditBoxOpenState] =
        useState<boolean>(false);
    const [voidOrderDialogOpen, setVoidOrderDialogOpen] =
        useState<boolean>(false);
    const [retryPaymentDialogOpen, setRetryPaymentDialogOpen] =
        useState<boolean>(false);
    const [paymentFailureDialogOpen, setPaymentFailureDialogOpen] =
        useState<boolean>(false);
    const [subscriptionRebootModalOpen, setSubscriptionRebootModalOpen] =
        useState<boolean>(false);

    const [checkinIncompleteEventFiring, setCheckinIncompleteEventFiring] =
        useState<boolean>(false);
    const [subscriptionRebooting, setSubscriptionRebooting] = useState<boolean>(false);
    const [labelingAsAutoShipped, setLabelingAsAutoShipped] = useState<boolean>(false);
    const [allowingCoordinatorToResend, setAllowingCoordinatorToResend] = useState<boolean>(false);
    const [convertingToMonthly, setConvertingToMonthly] = useState<boolean>(false);
    
    const { data: prescriptionSentAudit, isLoading } = useSWR(
        `${renewalOrder.renewal_order_id}-audit`,
        () =>
            getPrescriptionSentAudit(
                renewalOrder.original_order_id,
                renewalOrder.renewal_order_id
            )
    );
    const { data: renewalDosageSelectionAudit } = useSWR(
        `${renewalOrder.renewal_order_id}-dosage-selectionaudit`,
        () => getRenewalDosageSelectionAudit(renewalOrder.renewal_order_id)
    );

    // console.log('THE RENEWAL ORDER', renewalOrder);

    const openAddressEditBox = () => {
        setAddressEditBoxOpenState(true);
    };

    const closeAddressEditBox = () => {
        setAddressEditBoxOpenState(false);
        mutate_orders();
    };

    const convertPrescriptionSentTimestamp = (timestamp: string) => {
        if (!timestamp) {
            return 'Not sent';
        }

        const date = new Date(timestamp);
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        };
        return new Intl.DateTimeFormat('en-US', options).format(date);
    };

    const cancelRenewalOrder = async (reason: string) => {
        const res = await administrativeCancelRenewalOrder(
            renewalOrder.renewal_order_id,
            reason,
            renewalOrder.subscription_id,
            renewalOrder.stripe_subscription_id,
            renewalOrder.customer_id
        );

        if (res === Status.Success) {
            setSnackbarMessage(
                'You have successfully canceled this renewal order'
            );
            setSnackbarStatus('success');
            setSnackbarOpen(true);
            setCancellationDialogOpen(false);
        } else {
            setSnackbarMessage(
                'Error: Unable to cancel order. Please reach out to engineering.'
            );
            setSnackbarStatus('error');
            setSnackbarOpen(true);
            setCancellationDialogOpen(false);
        }
    };

    const convertTimestamp = (timestamp: string) => {
        if (!timestamp) {
            return 'not tracked';
        }

        const date = new Date(timestamp);
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        };
        return new Intl.DateTimeFormat('en-US', options).format(date);
    };

    const parseLastUsedScript = (script: any, pharmacy: string) => {
        if (!script) {
            return <></>;
        }

        switch (pharmacy) {
            case 'empower':
                if (isEmpty(script.newRxs)) {
                    return <></>;
                }
                const itemDesignatorId =
                    script.newRxs[0].medication.itemDesignatorId;

                // Find the item in the itemList that matches the itemDesignatorId
                const item = itemList.find(
                    (item) => item.itemDesignatorId === itemDesignatorId
                );
                return (
                    <>
                        <BioType className='body1bold'>
                            Medication:{' '}
                            <span className='body1'>
                                {item?.drugDescription}
                            </span>
                        </BioType>
                        <BioType className='body1bold'>
                            Dosage:{' '}
                            <span className='body1'>{item?.dosage}</span>
                        </BioType>
                        <BioType className='body1bold'>
                            Vial Size:{' '}
                            <span className='body1'>{item?.quantity}</span>
                        </BioType>
                        <BioType className='body1bold'>
                            Sig:{' '}
                            <span className='body1'>
                                {script.newRxs[0].medication.sigText}
                            </span>
                        </BioType>
                    </>
                );

            case 'hallandale':
                if (
                    !script ||
                    !script.order ||
                    !script.order.rxs ||
                    script.order.rxs.length === 0
                ) {
                    return (
                        <BioType className='body1'>
                            No prescription information available for this
                            order.
                        </BioType>
                    );
                }
                const rx_item_array = script.order.rxs;
                return (
                    <>
                        {rx_item_array.map((item: any, index: number) => {
                            return (
                                <div key={index} className='flex flex-col mb-2'>
                                    <BioType className='itd-input'>
                                        Item {index + 1}:
                                    </BioType>
                                    <BioType className='itd-input'>
                                        • Medication:{' '}
                                        <span className='itd-body'>
                                            {item.drugName}
                                        </span>
                                    </BioType>
                                    <BioType className='itd-input'>
                                        • Dosage:{' '}
                                        <span className='itd-body'>
                                            {item.drugStrength}
                                        </span>
                                    </BioType>
                                    <BioType className='itd-input'>
                                        • Quantity:{' '}
                                        <span className='itd-body'>
                                            {item.quantity}
                                        </span>
                                    </BioType>
                                    {item.internalSigDisplay &&
                                        item.drugName != 'GLP-1 Inj Kit' && (
                                            <BioType className='itd-input'>
                                                • Sig:{' '}
                                                {item.internalSigDisplay.map(
                                                    (
                                                        sigItem: any,
                                                        index: number
                                                    ) => {
                                                        return (
                                                            <div
                                                                className='itd-body ml-3'
                                                                key={index}
                                                            >
                                                                • {sigItem}
                                                            </div>
                                                        );
                                                    }
                                                )}
                                            </BioType>
                                        )}
                                </div>
                            );
                        })}
                    </>
                );

            default:
                return <></>;
        }
    };

    const redirectShipping = (pharmacy: string) => {
        switch (pharmacy) {
            case 'empower':
                const url = `http://wwwapps.ups.com/WebTracking/processInputRequest?TypeOfInquiryNumber=T&InquiryNumber1=${renewalOrder.tracking_number}`;
                window.open(url, '_blank');
            default:
                return;
        }
    };

    const voidOrder = async (reason: string) => {
        try {
            await updateRenewalOrderByRenewalOrderId(
                renewalOrder.renewal_order_id,
                { order_status: RenewalOrderStatus.Voided }
            );
            await logPatientAction(
                renewalOrder.customer_id,
                PatientActionTask.ORDER_VOIDED,
                { order_id: renewalOrder.renewal_order_id, reason }
            );
            setSnackbarMessage('Successfully voided order');
            setSnackbarStatus('success');
            setSnackbarOpen(true);
        } catch (error) {
            setSnackbarMessage('Error: Unable to void order');
            setSnackbarStatus('error');
            setSnackbarOpen(true);
        } finally {
            setVoidOrderDialogOpen(false);
        }
    };

    const parseShippingData = () => {
        switch (renewalOrder.assigned_pharmacy) {
            case 'empower':
                return (
                    <>
                        <BioType>
                            <span className='body1bold'>
                                Shipping Statuses:{' '}
                            </span>
                            <span className='body1'>
                                {renewalOrder.shipping_status}
                            </span>
                        </BioType>
                        <BioType>
                            <span className='body1bold'>Tracking #: </span>
                            <span
                                className='body1 hover:cursor-pointer underline hover:text-primary'
                                onClick={() => {
                                    redirectShipping('empower');
                                }}
                            >
                                {renewalOrder.tracking_number}
                            </span>
                        </BioType>
                        {renewalOrder.external_tracking_metadata && (
                            <>
                                <BioType className='body1'>
                                    <BioType>
                                        <span className='body1bold'>
                                            Empower Order ID (LFID):
                                        </span>{' '}
                                        <span>
                                            {
                                                renewalOrder
                                                    .external_tracking_metadata
                                                    .lfOrderId
                                            }
                                        </span>
                                    </BioType>
                                </BioType>
                                <BioType className='body1'>
                                    <BioType>
                                        <span className='body1bold'>
                                            Pharmacy Order Status:
                                        </span>{' '}
                                        <span>
                                            {
                                                renewalOrder
                                                    .external_tracking_metadata
                                                    .orderStatus
                                            }
                                        </span>
                                    </BioType>
                                </BioType>
                            </>
                        )}
                    </>
                );

            default:
                return (
                    <>
                        <BioType>
                            <span className='body1bold'>Shipping Status: </span>
                            <span className='body1'>
                                {renewalOrder.shipping_status}
                            </span>
                        </BioType>
                        <BioType>
                            <span className='body1bold'>Tracking #: </span>
                            <span className='body1'>
                                {renewalOrder.tracking_number}
                            </span>
                        </BioType>
                    </>
                );
        }
    };

    const convertOrderStatus = (
        order_status: string,
        shipping_status: string,
        payment_failure_status: string | null
    ): JSX.Element => {
        if (shipping_status) {
            if (shipping_status === ShippingStatus.Shipped) {
                return (
                    <BioType className='body1 text-primary'>Shipped</BioType>
                );
            } else if (shipping_status === ShippingStatus.Delivered) {
                return (
                    <BioType className='body1 text-primary'>Delivered</BioType>
                );
            }
        }

        if (order_status === RenewalOrderStatus.Canceled) {
            return <BioType className='body1 text-red-500'>Canceled</BioType>;
        }

        if (payment_failure_status) {
            if (payment_failure_status === PaymentFailureStatus.Expired) {
                return (
                    <BioType className='body1 text-primary'>
                        Expired - Stopped Retrying Payment
                    </BioType>
                );
            } else if (
                payment_failure_status === PaymentFailureStatus.Retrying
            ) {
                return (
                    <BioType className='body1 text-red-500'>
                        Retrying Payment
                    </BioType>
                );
            }
        }

        switch (order_status) {
            case RenewalOrderStatus.Incomplete:
                return (
                    <BioType className='body1 text-gray-500'>
                        Incomplete - Not completed & Not Billed Yet
                    </BioType>
                );
            case RenewalOrderStatus.PharmacyProcessing:
                return (
                    <BioType className='body1 text-primary'>
                        Pharmacy Processing
                    </BioType>
                );
            case RenewalOrderStatus.Denied_Paid:
                return (
                    <BioType className='body1 text-primary'>
                        Provider Denied - Paid
                    </BioType>
                );
            case RenewalOrderStatus.Denied_Unpaid:
                return (
                    <BioType className='body1 text-primary'>
                        Provider Denied - Unpaid
                    </BioType>
                );
            case RenewalOrderStatus.Canceled:
                return (
                    <BioType className='body1 text-red-500'>Canceled</BioType>
                );
            case RenewalOrderStatus.CheckupComplete_Prescribed_Unpaid:
                return (
                    <BioType className='body1 text-primary'>
                        Check-in Complete - Prescribed - Unpaid
                    </BioType>
                );
            case RenewalOrderStatus.CheckupComplete_Prescribed_Unpaid_1:
                return (
                    <BioType className='body1 text-primary'>
                        Check-in Completed - Prescription Written - Payment
                        Failed (1)
                    </BioType>
                );
            case RenewalOrderStatus.CheckupComplete_Prescribed_Unpaid_2:
                return (
                    <BioType className='body1 text-primary'>
                        Check-in Completed - Prescription Written - Payment
                        Failed (2)
                    </BioType>
                );
            case RenewalOrderStatus.CheckupComplete_Unprescribed_Paid:
                return (
                    <BioType className='body1 text-primary'>
                        Check-in Completed - Not Prescribed - Paid
                    </BioType>
                );
            case RenewalOrderStatus.CheckupComplete_Prescribed_Paid:
                return (
                    <BioType className='body1 text-primary'>
                        Check-in Completed - Prescribed - Paid
                    </BioType>
                );
            case RenewalOrderStatus.CheckupComplete_Unprescribed_Unpaid:
                return (
                    <BioType className='body1 text-primary'>
                        Check-in Completed - Not Prescribed - Not Paid
                    </BioType>
                );
            case RenewalOrderStatus.CheckupComplete_Unprescribed_Unpaid_1:
                return (
                    <BioType className='body1 text-primary'>
                        Check-in Completed - Not Prescribed - Payment Failed (1)
                    </BioType>
                );
            case RenewalOrderStatus.CheckupComplete_Unprescribed_Unpaid_2:
                return (
                    <BioType className='body1 text-primary'>
                        Check-in Completed - Not Prescribed - Payment Failed (2)
                    </BioType>
                );
            case RenewalOrderStatus.CheckupIncomplete_Unprescribed_Paid:
                return (
                    <BioType className='body1 text-primary'>
                        Check-in Incomplete - Paid
                    </BioType>
                );
            case RenewalOrderStatus.CheckupIncomplete_Unprescribed_Paid_1:
                return (
                    <BioType className='body1 text-primary'>
                        Check-in Incomplete - Paid (1)
                    </BioType>
                );
            case RenewalOrderStatus.CheckupIncomplete_Unprescribed_Paid_2:
                return (
                    <BioType className='body1 text-primary'>
                        Order Abandoned - Required Check-in Completion - Paid
                    </BioType>
                );
            case RenewalOrderStatus.CheckupIncomplete_Unprescribed_Unpaid:
                return (
                    <BioType className='body1 text-primary'>
                        Check-in Incomplete - Unprescribed - Unpaid
                    </BioType>
                );
            case RenewalOrderStatus.CheckupIncomplete_Unprescribed_Unpaid_1:
                return (
                    <BioType className='body1 text-primary'>
                        Check-in Incomplete - Unpaid
                    </BioType>
                );
            case RenewalOrderStatus.CheckupWaived_Unprescribed_Unpaid:
                return (
                    <BioType className='body1 text-primary'>
                        Sending last used script once paid - Payment Failed
                    </BioType>
                );
            default:
                return (
                    <BioType className='body1 text-gray-500'>
                        {order_status}
                    </BioType>
                );
        }
    };

    const redirectToOrderId = (order_id: string) => {
        router.push(`/provider/intakes/${order_id}`);
    };

    const getCheckedInStatus = () => {
        if (renewalOrder.submission_time) {
            return 'Yes';
        } else {
            return 'No';
        }
    };

    const getPaymentStatus = () => {
        if (
            renewalOrder.order_status.includes('Paid') ||
            renewalOrder.order_status === RenewalOrderStatus.PharmacyProcessing
        ) {
            return 'Yes';
        } else if (renewalOrder.order_status.includes('Unpaid')) {
            return 'No';
        } else {
            return 'Unknown';
        }
    };

    const triggerCheckinIncompleteEvent = async () => {
        setCheckinIncompleteEventFiring(true);
        await triggerEvent(renewalOrder.customer_id, WL_CHECKIN_INCOMPLETE, {
            checkin_url: `https://app.gobioverse.com/check-up/${renewalOrder.product_href}`,
            order_id: renewalOrder.renewal_order_id,
        });
        setCheckinIncompleteEventFiring(false);

        alert('Checkin Incomplete Event Triggered');
    };

    const handleRebootSubscription = async (
        variantIndex: number, 
        scheduledOrImmediate: 'scheduled' | 'immediate'
    ) => {
        setSubscriptionRebooting(true);
        console.log('Rebooting subscription with variant index: ', variantIndex, ' and scheduledOrImmediate: ', scheduledOrImmediate);
        const rebootStatus = await rebootSubscription(
            variantIndex, 
            renewalOrder, 
            scheduledOrImmediate
        );
        console.log('Reboot status: ', rebootStatus);
        setSubscriptionRebooting(false);
        setSubscriptionRebootModalOpen(false);
        
        if (rebootStatus === Status.Success) {
            alert('Subscription rebooted successfully');
        } else {
            alert('Error rebooting subscription');
        }
    };


    const addEmptyPrescriptionJsonToRenewalOrder = async (renewalOrderId: string) => {
        setAllowingCoordinatorToResend(true);

        if (renewalOrder.prescription_json !== null && renewalOrder.prescription_json !== undefined) {
            alert('Coordinators can already resend');
            return;
        }

        await updateRenewalOrderByRenewalOrderId(renewalOrderId, {
            prescription_json: {}
        });

        router.refresh();
        mutate_orders();
        setAllowingCoordinatorToResend(false);
    };

    const labelAsAutoShipped = async (renewalOrderId: string) => {
        setLabelingAsAutoShipped(true);
        await updateRenewalOrderByRenewalOrderId(renewalOrderId, {
            autoshipped: true
        });

        router.refresh();
        mutate_orders();
        setLabelingAsAutoShipped(false);
    };

    const convertToMonthly = async (renewalOrderId: string) => {
        setConvertingToMonthly(true);

        //this is the same code that runs in the renewal validation job handler:

        const equivalenceCode = getDosageEquivalenceCodeFromVariantIndex(
            renewalOrder.product_href as PRODUCT_HREF,
            Number(renewalOrder.variant_index)
        );

        let newVariantIndex = null;

        /**
         * The Dosage Equivalence control logic should technically always find a variant.
         *
         * However if it does not then there is a chance it is a deprecated variant, so we will keep the old function:
         * convertBundleVariantToSingleVariant to do that job.
         *
         * In the future, we may want to change the else clause to a catch all safety net instead.
         */
        if (equivalenceCode) {
            const dosageChangeController = new DosageChangeController(
                renewalOrder.product_href as PRODUCT_HREF,
                equivalenceCode
            );

            const patientState = await getUserState(renewalOrder.customer_id);

            newVariantIndex =
                dosageChangeController.getMonthlyVariantFromEquivalenceWithPVC(
                    patientState.state as USStates
                );
        } else {
            newVariantIndex = convertBundleVariantToSingleVariant(
                renewalOrder.product_href,
                Number(renewalOrder.variant_index)
            );
        }

        await updateRenewalOrderByRenewalOrderId(renewalOrderId, {
            variant_index: newVariantIndex
        });
        
        
        router.refresh();
        mutate_orders();
        setConvertingToMonthly(false);
    }

    return (
        <Fragment>
            <TableRow
                sx={{
                    '& > *': { borderBottom: 'unset' },
                    cursor: 'pointer',
                }}
                onClick={() => setOpen(!open)}
            >
                <TableCell
                    component='th'
                    className='body1 text-primary hover:underline hover:cursor-pointer'
                >
                    <BioType
                        onClick={() => {
                            redirectToOrderId(renewalOrder.renewal_order_id);
                        }}
                        className='text-primary'
                    >
                        BV-{renewalOrder.renewal_order_id}
                    </BioType>
                </TableCell>
                <TableCell>{renewalOrder.product_name}</TableCell>
                <TableCell>{renewalOrder.variant_text}</TableCell>
                <TableCell>
                    {convertTimestamp(renewalOrder.created_at)}
                </TableCell>
                <TableCell>
                    {convertOrderStatus(
                        renewalOrder.order_status,
                        renewalOrder.shipping_status,
                        renewalOrder.payment_failure_status
                    )}
                </TableCell>
                <TableCell>
                    <IconButton aria-label='expand row' size='small'>
                        {open ? (
                            <KeyboardArrowUpIcon />
                        ) : (
                            <KeyboardArrowDownIcon />
                        )}
                    </IconButton>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                    colSpan={5}
                >
                    <Collapse in={open} timeout='auto' unmountOnExit>
                        <div className='flex flex-row justify-start items-start gap-20 px-8 py-6'>
                            <div className='flex flex-col justify-start items-start w-[50%] gap-1'>
                                <BioType>
                                    <span className='body1bold'>
                                        Order ID:{' '}
                                    </span>
                                    <span className='body1'>
                                        {renewalOrder.renewal_order_id}
                                    </span>
                                </BioType>

                                {determineAccessByRoleName(
                                    access_type,
                                    BV_AUTH_TYPE.ADMIN
                                ) && (
                                    <BioType className='flex flex-row gap-2'>
                                        <span className='body1bold'>
                                            Variant Index:
                                        </span>
                                        <span className='body1'>
                                            {renewalOrder.variant_index}
                                        </span>
                                    </BioType>
                                )}

                                <div className='flex flex-row gap-2'>
                                    <BioType>Status:</BioType>
                                    <StatusDropdown
                                        patient_id={renewalOrder.customer_id}
                                        order_id={renewalOrder.renewal_order_id}
                                    />
                                </div>
                                <BioType className='flex flex-row gap-2'>
                                    <span className='body1bold'>
                                        Completed Check-in?
                                    </span>
                                    <span className='body1'>
                                        {getCheckedInStatus()}
                                    </span>
                                </BioType>
                                <BioType className='flex flex-row gap-2'>
                                    <span className='body1bold'>Paid?</span>
                                    <span className='body1'>
                                        {getPaymentStatus()}
                                    </span>
                                </BioType>
                                <BioType className='flex flex-row gap-2'>
                                    <span className='body1bold'>
                                        Approving Provider:{' '}
                                    </span>
                                    <span className='body1'>
                                        {renewalOrder.provider_name
                                            ? renewalOrder.provider_name
                                            : 'not tracked'}
                                    </span>
                                </BioType>
                                {/**
                                 * Conditionally renders approval time if it exists.
                                 */}
                                {renewalOrder.approval_denial_timestamp && (
                                    <BioType className='flex flex-row gap-2'>
                                        <span className='body1bold'>
                                            Approval Time:{' '}
                                        </span>
                                        <span className='body1'>
                                            {convertTimestamp(
                                                renewalOrder.approval_denial_timestamp
                                            )}
                                        </span>
                                    </BioType>
                                )}
                                <BioType className='flex flex-col gap-1'>
                                    <span className='body1bold'>
                                        Shipping Information:{' '}
                                    </span>
                                    <div className='flex flex-col ml-4'>
                                        {parseShippingData()}
                                    </div>
                                </BioType>
                                {renewalOrder.subscription_id && (
                                    <BioType className='flex flex-row gap-2'>
                                        <span className='body1bold'>
                                            Subscription Status:{' '}
                                        </span>
                                        <span className='body1'>
                                            {renewalOrder.subscription_status}
                                        </span>
                                    </BioType>
                                )}

                                <div className='flex flex-col gap-2 bg-slate-100  rounded-md mt-2 p-2'>
                                    <span
                                        className='body1bold text-center'
                                        style={{
                                            borderBottom: '2px solid #e5e7eb',
                                        }}
                                    >
                                        Patient Dosage Selection
                                    </span>
                                    {renewalDosageSelectionAudit ? (
                                        <>
                                            <span className='body1'>
                                                <span className='font-bold'>
                                                    Completed:
                                                </span>{' '}
                                                {convertTimestamp(
                                                    renewalDosageSelectionAudit.created_at
                                                )}
                                            </span>
                                            <span className='body1'>
                                                <span className='font-bold'>
                                                    Selected Plan:
                                                </span>{' '}
                                                {
                                                    renewalDosageSelectionAudit.selectedDosageString
                                                }
                                            </span>
                                            {access_type === 'admin' && (
                                                <span className='body1'>
                                                    <span className='font-bold'>
                                                        Selected Variant Index:
                                                    </span>{' '}
                                                    {
                                                        renewalDosageSelectionAudit.selectedVariantIndex
                                                    }
                                                </span>
                                            )}
                                        </>
                                    ) : (
                                        <span className='body1 text-center'>
                                            <span className=''>
                                                No Dosage Selection Audit Found
                                            </span>
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className='flex flex-col justify-start items-start w-[50%] gap-2'>
                                {isLoading && (
                                    <BioType className='body1'>
                                        Loading Script Audit Data...
                                    </BioType>
                                )}

                                {renewalOrder.created_at &&
                                new Date(renewalOrder.created_at) <
                                    new Date('2025-01-01') ? (
                                    <BioType className='body1'>
                                        Audit Data Not Tracked for orders before
                                        January 1st, 2025
                                    </BioType>
                                ) : (
                                    renewalOrder.created_at
                                )}
                                {prescriptionSentAudit &&
                                    prescriptionSentAudit[0].action ===
                                        OrderDataAuditActions.PrescriptionSent && (
                                        <>
                                            <BioType className='body1'>
                                                ✅ Script Sent:{' '}
                                                {convertPrescriptionSentTimestamp(
                                                    prescriptionSentAudit[0]
                                                        .created_at
                                                )}
                                            </BioType>
                                        </>
                                    )}
                                {prescriptionSentAudit &&
                                    prescriptionSentAudit.map(
                                        (audit, index) => {
                                            if (
                                                audit.action !==
                                                OrderDataAuditActions.ResendPrescription
                                            ) {
                                                return null;
                                            }

                                            return (
                                                <BioType
                                                    className='body1'
                                                    key={index}
                                                >
                                                    ✅ Script Resent:{' '}
                                                    {convertPrescriptionSentTimestamp(
                                                        audit.created_at
                                                    )}
                                                </BioType>
                                            );
                                        }
                                    )}

                                {prescriptionSentAudit &&
                                    prescriptionSentAudit.map(
                                        (audit, index) => {
                                            if (
                                                audit.action !==
                                                    OrderDataAuditActions.SecondSplitShipmentScriptSent &&
                                                audit.action !==
                                                    OrderDataAuditActions.SecondAnnualShipmentSent
                                            ) {
                                                return null;
                                            }

                                            return (
                                                <BioType
                                                    className='body1'
                                                    key={index}
                                                >
                                                    ✅ Second Split Shipment
                                                    Script Sent:{' '}
                                                    {convertPrescriptionSentTimestamp(
                                                        audit.created_at
                                                    )}
                                                </BioType>
                                            );
                                        }
                                    )}
                                {/* autoshipped indicators were implemented with new architecture on 4/17/2025, so data before this date is not reliable */}
                                {/* the 'autoshipped' field was being added to the wrong renewal orders before 4/17/2025 */}
                                {prescriptionSentAudit &&
                                    renewalOrder.autoshipped &&
                                    !renewalOrder.dosage_selection_completed && (
                                        <div className='bg-gradient-to-r from-cyan-100 to-green-100 text-white px-2 py-1 rounded-md shadow-md border-solid border-2 border-cyan-500'>
                                            <Tooltip title='Patient did not complete their dosage selection form, so we automatically sent them a monthly vial.'>
                                                <IconButton>
                                                    <span className='body1bold'>
                                                        ✅ Autoshipped
                                                    </span>
                                                </IconButton>
                                            </Tooltip>
                                        </div>
                                    )}

                                <BioType>
                                    <span className='body1bold'>
                                        Pharmacy / Script Information
                                    </span>
                                </BioType>

                                {renewalOrder.prescription_json &&
                                    parseLastUsedScript(
                                        renewalOrder.prescription_json,
                                        renewalOrder.assigned_pharmacy
                                    )}
                                <BioType className='body1bold'>
                                    Cadence:{' '}
                                    <span className='body1'>
                                        {renewalOrder.subscription_type}
                                    </span>
                                </BioType>
                                <div className='flex flex-col items-start self-start w-full gap-2'>
                                    <div className='flex flex-row gap-8'>
                                        <BioType className='h6 underline'>
                                            Address Information
                                        </BioType>
                                        <Chip
                                            label={`Edit`}
                                            sx={{
                                                paddingX: 3, // Equivalent to 'px-4'
                                                paddingY: 2, // Equivalent to 'py-2'
                                                cursor: 'pointer', // Equivalent to 'cursor-pointer'
                                            }}
                                            onClick={() => {
                                                openAddressEditBox();
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <BioType className='body1'>
                                            {renewalOrder.address_line1},{' '}
                                            {renewalOrder.address_line2}
                                        </BioType>
                                        <BioType className='body1'>
                                            {renewalOrder.city},{' '}
                                            {renewalOrder.state}
                                            {'  '}
                                            {renewalOrder.zip}
                                        </BioType>
                                        <BioType className='body1'>
                                            United States
                                        </BioType>
                                    </div>
                                    <div className='flex'>
                                        {renewalOrder.payment_failure_status && (
                                            <Button
                                                variant='contained'
                                                color='primary'
                                                onClick={() =>
                                                    setPaymentFailureDialogOpen(
                                                        true
                                                    )
                                                }
                                            >
                                                View Payment Failure Information
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>{' '}
                        {determineAccessByRoleName(
                            access_type,
                            BV_AUTH_TYPE.LEAD_COORDINATOR
                        ) &&
                            RESEND_MAPPED_PRODUCTS.includes(
                                renewalOrder.product_href as PRODUCT_HREF
                            ) &&
                            renewalOrder.prescription_json && (
                                <div className='flex self-start mb-4 px-6'>
                                    <Button
                                        variant='contained'
                                        onClick={() => {
                                            setShowResendDialog(true);
                                        }}
                                        sx={{ 
                                            borderRadius: '12px', 
                                            backgroundColor: 'black',
                                            paddingX: '32px',
                                            paddingY: '14px',
                                            ":hover": {
                                                backgroundColor: 'darkslategray',
                                            }
                                        }}

                                    >
                                        <span className='normal-case provider-bottom-button-text  text-white'>Resend Script</span>
                                    </Button>

                                    <ResendScriptConfirmationDialog
                                        open={showResendDialog}
                                        onClose={() => {
                                            setShowResendDialog(false);
                                        }}
                                        orderId={renewalOrder.original_order_id.toString()}
                                        assigned_provider={
                                            renewalOrder.assigned_provider
                                        }
                                        order_type={OrderType.RenewalOrder}
                                        renewal_order_id={
                                            renewalOrder.renewal_order_id
                                        }
                                        script_sent={Boolean(
                                            prescriptionSentAudit &&
                                                prescriptionSentAudit.length > 0
                                        )}
                                        variant_index={
                                            renewalOrder.variant_index
                                        }
                                        product_href={
                                            renewalOrder.product_href as PRODUCT_HREF
                                        }
                                        subscription_id={
                                            renewalOrder.subscription_id
                                        }
                                        patientId={profile_data.id}
                                    />
                                </div>
                            )}
                        {determineAccessByRoleName(
                            access_type,
                            BV_AUTH_TYPE.LEAD_COORDINATOR
                        ) &&
                            ![
                                RenewalOrderStatus.PharmacyProcessing,
                                RenewalOrderStatus.Voided,
                            ].includes(renewalOrder.order_status) && (
                                <div className='px-6 py-1'>
                                    <Button
                                        variant='contained'

                                        onClick={() =>
                                            setVoidOrderDialogOpen(true)
                                        }
                                        sx={{ 
                                            borderRadius: '12px', 
                                            backgroundColor: 'black',
                                            paddingX: '32px',
                                            paddingY: '14px',
                                            ":hover": {
                                                backgroundColor: 'darkslategray',
                                            }
                                        }} 
                                    >
                                     <span className='normal-case provider-bottom-button-text  text-white'>Void Order</span>
                                    </Button>

                                    <OrderTableConfirmationDialog
                                        content='Are you sure you want to void this order?'
                                        onClose={() =>
                                            setVoidOrderDialogOpen(false)
                                        }
                                        onConfirm={voidOrder}
                                        open={voidOrderDialogOpen}
                                        title={'Void this order?'}
                                    />
                                </div>
                            )}
                        <CoordinatorConfirmDosage order_data={renewalOrder} />
                        {renewalOrder.subscription_status !== 'canceled' &&
                            determineAccessByRoleName(
                                access_type,
                                BV_AUTH_TYPE.LEAD_COORDINATOR
                            ) && (
                                <>
                                    <div className='px-6 py-1'>
                                        <Button
                                            variant='contained'
                                            onClick={() => {
                                                setCancellationDialogOpen(true);
                                            }}
                                            sx={{ 
                                                borderRadius: '12px', 
                                                backgroundColor: 'red',
                                                paddingX: '32px',
                                                paddingY: '14px',
                                                ":hover": {
                                                    backgroundColor: 'darkred',
                                                }
                                            }}
                                        >
                                            <span className='normal-case provider-bottom-button-text  text-white'>Cancel Order & Subscription</span>
                                        </Button>
                                        <CancelationConfirmationDialog
                                            open={cancelationDialogOpen}
                                            onClose={() =>
                                                setCancellationDialogOpen(false)
                                            }
                                            onConfirm={cancelRenewalOrder}
                                            title={
                                                'Cancel Renewal Order for Patient'
                                            }
                                            content={
                                                'Caution: this will cancel the order from being viewed by providers AND cancel the subscription on stripe if it exists. '
                                            }
                                        />

                                        <BioverseSnackbarMessage
                                            open={snackbarOpen}
                                            setOpen={setSnackbarOpen}
                                            color={snackbarStatus}
                                            message={snackbarMessage}
                                        />
                                    </div>
                                </>
                            )}
                        {determineAccessByRoleName(
                            access_type,
                            BV_AUTH_TYPE.COORDINATOR
                        ) &&
                            renewalOrder.payment_failure_status ===
                                PaymentFailureStatus.Retrying && (
                                <div className='px-6 py-1'>
                                    <Button
                                        variant='outlined'
                                        color='warning'
                                        onClick={() =>
                                            setRetryPaymentDialogOpen(true)
                                        }
                                    >
                                        Retry Payment
                                    </Button>
                                </div>
                            )}
                        {determineAccessByRoleName(
                            access_type,
                            BV_AUTH_TYPE.LEAD_COORDINATOR
                        ) &&
                            renewalOrder.assigned_pharmacy === 'empower' && (
                                <>
                                    <div className='flex self-start mb-4 px-6'>
                                        <Button
                                            variant='contained'
                                            color='warning'
                                            onClick={() => {
                                                setShowEscalateDialog(true);
                                            }}
                                        >
                                            Escalate Order
                                        </Button>
                                    </div>
                                    <EscalateRenewalOrderDialog
                                        open={showEscalateDialog}
                                        onClose={() => {
                                            setShowEscalateDialog(false);
                                        }}
                                        renewal_order_data={renewalOrder}
                                        profile_data={profile_data}
                                    />
                                </>
                            )}


                            {determineAccessByRoleName(
                                access_type,
                                BV_AUTH_TYPE.ADMIN
                            ) && (
     
                            <div className='flex flex-row gap-2 mb-3 bg-slate-100 pt-8 mt-3 rounded-lg'>
                                    <p className='inter_body_regular ml-4 mt-3'>Admin Tools</p>
                                    <div className='flex flex-row gap-2 mb-3'>
                                        {determineAccessByRoleName(
                                            access_type,
                                            BV_AUTH_TYPE.ADMIN
                                        ) && (
                                            <div className='px-6 '>
                                                <Tooltip title='This will start a customer.io campaign reminding them to checkin, and if they do not checkin within 3 weeks roughly, customer.io will handle the refund of their most recent invoice and cancellation of their subscription.'>
                                                    <Button
                                                        sx={{
                                                            borderRadius: '12px',
                                                            backgroundColor: 'black',
                                                            paddingX: '32px',
                                                            paddingY: '14px',
                                                            ':hover': {
                                                                backgroundColor:
                                                                    'darkslategray',
                                                            },
                                                        }}
                                                        onClick={
                                                            triggerCheckinIncompleteEvent
                                                        }
                                                    >
                                                        <span className='normal-case provider-bottom-button-text  text-white'>
                                                            {checkinIncompleteEventFiring
                                                                ? 'Firing...'
                                                                : 'Trigger NCI Comms'}
                                                        </span>
                                                    </Button>
                                                </Tooltip>
                                            </div>
                                        )}
                                        {determineAccessByRoleName(
                                            access_type,
                                            BV_AUTH_TYPE.ADMIN
                                        ) && (
                                            <div className='px-6 '>
                                                <Tooltip title='This will update their subscription in our database and in stripe to whatever offer is selected'>
                                                    <Button
                                                        sx={{
                                                            borderRadius: '12px',
                                                            paddingX: '32px',
                                                            paddingY: '14px',
                                                            color: 'white',
                                                            background:
                                                                'linear-gradient(to bottom right, #2dd4bf, #3b82f6, #4ade80)', // teal-400, blue-500, green-400
                                                            boxShadow: 3,
                                                            ':hover': {
                                                                background:
                                                                    'linear-gradient(to bottom right, #2acfb8, #3a7eea, #45d373)',
                                                            },
                                                        }}
                                                        onClick={() => {
                                                            setSubscriptionRebootModalOpen(
                                                                true
                                                            );
                                                        }}
                                                    >
                                                        <span className='normal-case provider-bottom-button-text  text-white'>
                                                            {subscriptionRebooting
                                                                ? 'Rebooting...'
                                                                : 'Reboot Subscription'}
                                                        </span>
                                                    </Button>
                                                </Tooltip>
                                                
                                            </div>
                                            
                                        )}
                                        {
                                        determineAccessByRoleName(
                                            access_type,
                                            BV_AUTH_TYPE.ADMIN
                                        ) &&
                                        !renewalOrder.prescription_json && (
                                            <div className='flex self-start mb-4 px-6'>
                                                <Button
                                                    variant='contained'
                                                
                                                    onClick={() => {
                                                        addEmptyPrescriptionJsonToRenewalOrder(renewalOrder.renewal_order_id);
                                                    }}
                                                    sx={{
                                                        borderRadius: '12px',
                                                        paddingX: '32px',
                                                        paddingY: '14px',
                                                        color: 'white',
                                                        background:
                                                            'linear-gradient(to bottom right, #FF4500, #1A1A1B, #0079D3)', // Reddit orange, dark gray, Reddit blue
                                                        boxShadow: 3,
                                                        ':hover': {
                                                            background:
                                                                'linear-gradient(to bottom right, #E63E00, #141415, #0066B3)', // Darker versions of the same colors
                                                        },
                                                    }}
                                                >
                                                        <span className='normal-case provider-bottom-button-text  text-white'>
                                                            {allowingCoordinatorToResend ? 'Allowing...' : 'Allow coordinator to resend'}
                                                        </span>
                                                </Button>
                                            </div>
                                        )
                                    }

                                    {
                                        determineAccessByRoleName(
                                            access_type,
                                            BV_AUTH_TYPE.ADMIN
                                        ) &&
                                        !renewalOrder.autoshipped && (
                                            <div className='flex self-start mb-4 px-6'>
                                                <Button
                                                    variant='contained'
                                                
                                                    onClick={() => {
                                                        labelAsAutoShipped(renewalOrder.renewal_order_id);
                                                    }}
                                                    sx={{
                                                        position: 'relative',
                                                        overflow: 'hidden',
                                                        borderRadius: '20px',
                                                        paddingX: '10px',
                                                        paddingY: '18px',
                                                        fontWeight: 700,
                                                        fontSize: '1.1rem',
                                                        letterSpacing: '1.5px',
                                                        textTransform: 'uppercase',
                                                        color: '#ffffff',
                                                        background: 'radial-gradient(circle at 30% 30%, #6D28D9, #111827)',
                                                        boxShadow: `
                                                          0 0 12px rgba(109,40,217,0.4),
                                                          0 0 32px rgba(255,255,255,0.1),
                                                          inset 0 0 8px rgba(255,255,255,0.05)
                                                        `,
                                                        transition: 'all 0.4s ease-in-out',
                                                        '::before': {
                                                          content: '""',
                                                          position: 'absolute',
                                                          top: '-50%',
                                                          left: '-50%',
                                                          width: '200%',
                                                          height: '200%',
                                                          background:
                                                            'conic-gradient(from 180deg at 50% 50%, #00FFFF 0deg, #FF00FF 180deg, #00FFFF 360deg)',
                                                          animation: 'spinAura 6s linear infinite',
                                                          opacity: 0.08,
                                                          zIndex: 0,
                                                        },
                                                        ':hover': {
                                                          transform: 'scale(1.05)',
                                                          boxShadow: `
                                                            0 0 16px rgba(109,40,217,0.6),
                                                            0 0 36px rgba(255,255,255,0.2),
                                                            inset 0 0 12px rgba(255,255,255,0.08)
                                                          `,
                                                        },
                                                        '@keyframes spinAura': {
                                                          '0%': { transform: 'rotate(0deg)' },
                                                          '100%': { transform: 'rotate(360deg)' },
                                                        },
                                                        zIndex: 1,
                                                      }}
                                                >
                                                        <span className='normal-case provider-bottom-button-text  text-white'>
                                                            {labelingAsAutoShipped ? 'Labeling...' : 'Label as auto-shipped'}
                                                        </span>
                                                </Button>
                                            </div>
                                        )
                                    }


                                    {
                                        determineAccessByRoleName(
                                            access_type,
                                            BV_AUTH_TYPE.ADMIN
                                        ) && (
                                            <div className='flex self-start mb-4 px-6'>
                                                <Button
                                                    onClick={() => {
                                                        convertToMonthly(renewalOrder.renewal_order_id);
                                                    }}
                                                    sx={{
                                                        borderRadius: '16px',
                                                        paddingX: '36px',
                                                        paddingY: '16px',
                                                        color: 'white',
                                                        background: `
                                                          linear-gradient(135deg, #00FFA3 0%, #DC1FFF 100%)`,
                                                        boxShadow: `
                                                          0 8px 24px rgba(0, 0, 0, 0.3),
                                                          0 0 4px rgba(255, 255, 255, 0.2),
                                                          inset 0 1px 1px rgba(255,255,255,0.05)
                                                        `,
                                                        backdropFilter: 'blur(4px)',
                                                        fontWeight: 600,
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '1.2px',
                                                        transition: 'all 0.35s ease',
                                                        position: 'relative',
                                                        overflow: 'hidden',
                                                        '::before': {
                                                          content: '""',
                                                          position: 'absolute',
                                                          top: 0,
                                                          left: '-50%',
                                                          width: '200%',
                                                          height: '100%',
                                                          background:
                                                            'linear-gradient(120deg, transparent, rgba(255,255,255,0.2), transparent)',
                                                          transform: 'translateX(-100%)',
                                                          animation: 'glint 2.5s infinite',
                                                        },
                                                        '@keyframes glint': {
                                                          '0%': { transform: 'translateX(-100%)' },
                                                          '50%': { transform: 'translateX(100%)' },
                                                          '100%': { transform: 'translateX(100%)' },
                                                        },
                                                        ':hover': {
                                                          background: `linear-gradient(135deg, #00FFC6 0%, #E700FF 100%)`,
                                                          boxShadow: `
                                                            0 10px 30px rgba(0, 0, 0, 0.4),
                                                            0 0 8px rgba(255, 255, 255, 0.25),
                                                            inset 0 1px 2px rgba(255,255,255,0.1)
                                                          `,
                                                          transform: 'scale(1.03)',
                                                        },
                                                      }}
                                                >
                                                        <span className='normal-case provider-bottom-button-text  text-white'>
                                                            {convertingToMonthly ? 'Converting...' : 'Convert to monthly'}
                                                        </span>
                                                </Button>
                                            </div>
                                        )
                                    }
                                    </div>
                                </div>
                            )}
                    </Collapse>
                </TableCell>
            </TableRow>
            <AddressEditDialog
                onClose={closeAddressEditBox}
                onConfirm={() => router.refresh()}
                order_data={renewalOrder}
                dialog_open={addressEditBoxOpen}
                orderType={OrderType.RenewalOrder}
            />
            <RetryPaymentDialogPatientChart
                open={retryPaymentDialogOpen}
                onClose={() => setRetryPaymentDialogOpen(false)}
                orderId={renewalOrder.renewal_order_id}
                orderType={OrderType.RenewalOrder}
            />
            <PaymentFailureHistoryDialog
                open={paymentFailureDialogOpen}
                setOpen={setPaymentFailureDialogOpen}
                order_id={renewalOrder.renewal_order_id}
            />
            <RebootSubscriptionDialog
                dialog_open={subscriptionRebootModalOpen}
                onClose={() => setSubscriptionRebootModalOpen(false)}
                onConfirm={handleRebootSubscription}
                order_data={renewalOrder}
                orderType={OrderType.RenewalOrder}
            />
        </Fragment>
    );
}
