import { cancelSubscriptionStripeAndDatabase } from '@/app/(administration)/admin/stripe-api/stripe-api-actions';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import BioverseSnackbarMessage from '@/app/components/global-components/snackbar/bioverse-snackbar';
import {
    triggerEvent,
    removeCustomerFromAllJourneys,
} from '@/app/services/customerio/customerioApiFactory';
import { ORDER_CANCELED } from '@/app/services/customerio/event_names';
import { itemList } from '@/app/services/pharmacy-integration/empower/empower-item-list';
import { BV_AUTH_TYPE } from '@/app/types/auth/authorization-types';
import { OrderStatus, OrderType } from '@/app/types/orders/order-types';
import { insertAuditIntoAdministrativeCancelTable } from '@/app/utils/database/controller/admin_order_cancel_audit/admin-order-cancel-audit';
import { updateExistingOrderStatusUsingId } from '@/app/utils/database/controller/orders/orders-api';
import { determineAccessByRoleName } from '@/app/utils/functions/auth/authorization/authorizaiton-helper';
import {
    TableRow,
    TableCell,
    IconButton,
    Collapse,
    Chip,
    Button,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState, Fragment } from 'react';
import useSWR, { KeyedMutator } from 'swr';
import AddressEditDialog from '../../info/address-edit-dialog';
import ChangeOrderInformationDialog from './components/ChangeOrderInformationDialog';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import OrderTableConfirmationDialog from './components/confirmation-dialog';
import ResendScriptConfirmationDialog from './components/resend-script-confirmation';
import EscalateOrderDialog from './components/escalation/escalate-order-dialog';
import { ESCALATION_CAPABLE_PHARMACIES } from '../utils/escalation-util';
import React from 'react';
import RetryPaymentDialogPatientChart from './components/RetryPaymentDialog';
import { PaymentFailureStatus } from '@/app/utils/database/controller/payment_failure_tracker/payment_failure_tracker_enums';
import PaymentFailureHistoryDialog from '../../info/payment-failure-dialog';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import {
    getPrescriptionSentAudit,
    hasOrderPharmacyScriptBeenSent,
} from '@/app/utils/database/controller/order_data_audit/order_data_audit_api';
import { OrderDataAuditActions } from '@/app/utils/database/controller/order_data_audit/order_audit_descriptions';
import { RESEND_MAPPED_PRODUCTS } from './components/resend-script-view-components/resend-available-products';
import StatusDropdown from '@/app/components/provider-coordinator-shared/order-charts/components/StatusDropdown';
import { PHARMACY } from '@/app/types/pharmacy-integrations/pharmacy-types';
import { sendMoreNeedlesHallandale } from '@/app/utils/functions/prescription-scripts/hallandale-approval-script-generator';

interface OrderTabRowProps {
    order_data: OrderTabOrder;
    mutate_orders: KeyedMutator<any>;
    access_type: BV_AUTH_TYPE | null;
    profile_data: APProfileData;
}

export default function OrderTabRow({
    order_data,
    mutate_orders,
    access_type,
    profile_data,
}: OrderTabRowProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [cancelationDialogOpen, setCancellationDialogOpen] =
        useState<boolean>(false);
    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
    const [addressEditBoxOpen, setAddressEditBoxOpenState] =
        useState<boolean>(false);

    const [changeOrderOpen, setChangeOrderOpen] = useState<boolean>(false);
    const [snackbarMessage, setSnackbarMessage] = useState<string>('');
    const [snackbarStatus, setSnackbarStatus] = useState<'success' | 'error'>(
        'success'
    );
    const [showSnackbar, setShowSnackbar] = useState<boolean>(false);

    const [showResendDialog, setShowResendDialog] = useState<boolean>(false);
    const [showEscalateDialog, setShowEscalateDialog] =
        useState<boolean>(false);
    const [retryPaymentDialogOpen, setRetryPaymentDialogOpen] =
        useState<boolean>(false);

    const [paymentFailureDialogOpen, setPaymentFailureDialogOpen] =
        useState<boolean>(false);

    const {
        data: prescriptionSentAudit,
        error,
        isLoading,
    } = useSWR(`${order_data.id}-audit`, () =>
        getPrescriptionSentAudit(order_data.id)
    );

    const cancelThisOrder = async (reason: string) => {
        const result = await cancelOrderAdministratively(order_data.id, reason);
        if (result == 'success') {
            setSnackbarOpen(true);
        }
    };

    const cancelThisOrderAndSubscription = async (reason: string) => {
        const result = await fullCancelOrderAdministratively(
            order_data.id,
            reason
        );
        if (result == 'success') {
            setSnackbarOpen(true);
        }
    };

    const cancelOrderAdministratively = async (
        orderId: string,
        reason: string
    ) => {
        const { data: updateData, error: updateError } =
            await updateExistingOrderStatusUsingId(
                parseInt(orderId),
                'Administrative-Cancel'
            );

        await triggerEvent(order_data.customer_uid, ORDER_CANCELED, {
            order_id: order_data.id,
        });

        if (updateError) {
            return 'failure';
        }

        const { error } = await insertAuditIntoAdministrativeCancelTable(
            orderId,
            reason
        );

        await removeCustomerFromAllJourneys(order_data.customer_uid);

        if (error) {
            return 'failure';
        }

        setCancellationDialogOpen(false);
        return 'success';
    };

    const openAddressEditBox = () => {
        setAddressEditBoxOpenState(true);
        mutate_orders();
    };

    const closeAddressEditBox = () => {
        setAddressEditBoxOpenState(false);
    };

    const fullCancelOrderAdministratively = async (
        orderId: string,
        reason: string
    ) => {
        const { data: updateData, error: updateError } =
            await updateExistingOrderStatusUsingId(
                parseInt(orderId),
                'Administrative-Cancel'
            );

        if (updateError) {
            return 'failure';
        }

        const { error } = await insertAuditIntoAdministrativeCancelTable(
            orderId,
            reason
        );

        if (error) {
            return 'failure';
        }

        if (order_data.subscription) {
            const { success } = await cancelSubscriptionStripeAndDatabase(
                order_data.subscription.id,
                order_data.subscription.stripe_subscription_id,
                true
            );
            if (!success) {
                console.error('failed due to stripe cancellation');
                return 'failure';
            }
        }

        await removeCustomerFromAllJourneys(order_data.customer_uid);

        await triggerEvent(order_data.customer_uid, ORDER_CANCELED, {
            order_id: order_data.id,
        });

        setCancellationDialogOpen(false);
        return 'success';
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

    const parseLastUsedScript = (script: any, pharmacy: string) => {
        if (!script) {
            return <></>;
        }

        switch (pharmacy) {
            case 'empower':
                if (!script || !script.newRxs || script.newRxs.length < 1) {
                    return (
                        <>
                            <BioType className='itd-body'>
                                There was an issue with this order pharmacy
                                details. If this is suspected to be an error,
                                please contact Engineering.
                            </BioType>
                        </>
                    );
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
                        {rx_item_array &&
                            rx_item_array.map((item: any, index: number) => {
                                return (
                                    <div
                                        key={index}
                                        className='flex flex-col mb-2'
                                    >
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
                                            item.drugName !=
                                                'GLP-1 Inj Kit' && (
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
                const url = `http://wwwapps.ups.com/WebTracking/processInputRequest?TypeOfInquiryNumber=T&InquiryNumber1=${order_data.tracking_number}`;
                window.open(url, '_blank');
            default:
                return;
        }
    };

    const parseShippingData = () => {
        switch (order_data.assigned_pharmacy) {
            case 'empower':
                return (
                    <>
                        <BioType>
                            <span className='body1bold'>
                                Shipping Statues:{' '}
                            </span>
                            <span className='body1'>
                                {order_data.shipping_status}
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
                                {order_data.tracking_number}
                            </span>
                        </BioType>
                        {order_data.external_tracking_metadata && (
                            <>
                                <BioType className='body1'>
                                    <BioType>
                                        <span className='body1bold'>
                                            Empower Order ID (LFID):
                                        </span>{' '}
                                        <span>
                                            {
                                                order_data
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
                                                order_data
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
                                {order_data.shipping_status}
                            </span>
                        </BioType>
                        <BioType>
                            <span className='body1bold'>Tracking #: </span>
                            <span className='body1'>
                                {order_data.tracking_number}
                            </span>
                        </BioType>
                    </>
                );
        }
    };

    const convertOrderStatus = (
        order_status: string,
        payment_failure_data: any
    ): JSX.Element => {
        if (
            order_data.shipping_status === 'Shipped' ||
            order_data.shipping_status === 'InTransit'
        ) {
            return (
                <BioType className='body1 text-primary'>
                    Medication Shipped
                </BioType>
            );
        } else if (order_data.shipping_status === 'Delivered') {
            return <BioType className='body1 text-primary'>Delivered</BioType>;
        }

        if (order_status === OrderStatus.Canceled) {
            return <BioType className='body1 text-red-500'>Canceled</BioType>;
        }

        if (
            payment_failure_data &&
            payment_failure_data[0] &&
            payment_failure_data[0].status
        ) {
            const payment_failure_status = payment_failure_data[0].status;

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
        }
        switch (order_status) {
            case 'Incomplete':
                return (
                    <BioType className='body1 text-gray-500'>
                        Intake Incomplete
                    </BioType>
                );

            case 'Approved-CardDown':
                return (
                    <BioType className='body1 text-secondary'>
                        Provider Approved, Pending Charge/Prescription
                    </BioType>
                );

            case 'Payment-Completed':
                return (
                    <BioType className='body1 text-amber-500'>
                        Customer Charged, Not Prescribed
                    </BioType>
                );

            case 'Unapproved-CardDown':
                return (
                    <BioType className='body1 text-green-600'>
                        Under Review, Not Approved
                    </BioType>
                );

            case 'Denied-CardDown':
                return (
                    <BioType className='body1 text-red-800'>
                        Provider Declined
                    </BioType>
                );

            case 'Approved-CardDown-Finalized':
                if (
                    order_data.shipping_status === 'InProgress' ||
                    order_data.shipping_status === 'Processing'
                ) {
                    return (
                        <BioType className='body1 text-primary'>
                            Pharmacy Processing
                        </BioType>
                    );
                }

            default:
                return (
                    <BioType className='body1 text-gray-500'>
                        {order_status}
                    </BioType>
                );
        }
    };

    const redirectToOrderId = (order_id: string) => {
        if (determineAccessByRoleName(access_type, BV_AUTH_TYPE.PROVIDER)) {
            window.open(`/provider/intakes/${order_id}`, '_blank');
        } else if (
            determineAccessByRoleName(access_type, BV_AUTH_TYPE.COORDINATOR)
        ) {
            window.open(`/coordinator/${order_id}`, '_blank');
        }
    };


    const sendMoreNeedles = async () => {
        console.log("sendMoreNeedles");

        alert("still working on this");
        return;

        // if (order_data.assigned_pharmacy === PHARMACY.HALLANDALE) {
        //     console.log("hallandale");
        //     const result = await sendMoreNeedlesHallandale(profile_data, order_data);
        //     console.log("result", result);
        // }

        // if (order_data.assigned_pharmacy === PHARMACY.EMPOWER) {
        //     console.log("empower");
        // }
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
                            redirectToOrderId(order_data.id);
                        }}
                        className='text-primary'
                    >
                        BV-{order_data.id}
                    </BioType>
                </TableCell>
                <TableCell>{order_data.product.name}</TableCell>
                <TableCell>{order_data.variant_text ?? 'n/a'}</TableCell>
                <TableCell>
                    {convertTimestamp(
                        order_data.submission_time ?? order_data.created_at
                    )}
                </TableCell>
                <TableCell>
                    {convertOrderStatus(
                        order_data.order_status,
                        order_data.payment_failure
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
                                        {order_data.id}
                                    </span>
                                </BioType>

                                {determineAccessByRoleName(
                                    access_type,
                                    BV_AUTH_TYPE.ADMIN
                                ) && (
                                    <div className='flex flex-row gap-2'>
                                        <BioType>Variant Index:</BioType>
                                        <span className='body1 mt-1'> 
                                            {order_data.variant_index}
                                        </span>
                                    </div>
                                )}

                                <div className='flex flex-row gap-2'>
                                    <BioType>Status:</BioType>
                                    <StatusDropdown
                                        patient_id={order_data.customer_uid}
                                        order_id={order_data.id}
                                    />
                                </div>

                                <BioType className='flex flex-row gap-2'>
                                    <span className='body1bold'>
                                        Approving Provider:{' '}
                                    </span>
                                    <span className='body1'>
                                        {order_data.provider
                                            ? order_data.provider.name
                                            : 'not tracked'}
                                    </span>
                                </BioType>
                                {/**
                                 * Conditionally renders approval time if it exists.
                                 */}
                                {order_data.approval_denial_timestamp && (
                                    <BioType className='flex flex-row gap-2'>
                                        <span className='body1bold'>
                                            Approval Time:{' '}
                                        </span>
                                        <span className='body1'>
                                            {convertTimestamp(
                                                order_data.approval_denial_timestamp
                                            )}
                                        </span>
                                    </BioType>
                                )}
                                <BioType className='flex flex-row gap-2'>
                                    <span className='body1bold'>
                                        Discount Applied ?:{' '}
                                    </span>
                                    <span className='body1'>
                                        {order_data.discount_id ? (
                                            <>
                                                <BioType className='text-primary'>
                                                    True
                                                </BioType>
                                            </>
                                        ) : (
                                            <>
                                                <BioType className='text-red-700'>
                                                    False
                                                </BioType>
                                            </>
                                        )}
                                    </span>
                                </BioType>
                                <BioType className='flex flex-col gap-1'>
                                    <span className='body1bold'>
                                        Shipping Information:{' '}
                                    </span>
                                    <div className='flex flex-col ml-4'>
                                        {parseShippingData()}
                                    </div>
                                </BioType>
                                {order_data.subscription && (
                                    <BioType className='flex flex-row gap-2'>
                                        <span className='body1bold'>
                                            Subscription Status:{' '}
                                        </span>
                                        <span className='body1'>
                                            {order_data.subscription.status}
                                        </span>
                                    </BioType>
                                )}
                            </div>
                            <div className='flex flex-col justify-start items-start w-[50%] gap-2'>
                                {isLoading && (
                                    <BioType className='body1'>
                                        Loading Script Audit Data...
                                    </BioType>
                                )}

                                {prescriptionSentAudit &&
                                    prescriptionSentAudit[0].action ===
                                        OrderDataAuditActions.PrescriptionSent && (
                                        <BioType className='body1'>
                                            ✅ Script Sent:{' '}
                                            {convertPrescriptionSentTimestamp(
                                                prescriptionSentAudit[0]
                                                    .created_at
                                            )}
                                        </BioType>
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
                                                <BioType className='body1' key={index}>
                                                    ✅ Second Split Shipment Script Sent:{' '}
                                                    {convertPrescriptionSentTimestamp(
                                                        audit.created_at
                                                    )}
                                                </BioType>
                                            );
                                        }
                                    )}

                                <BioType>
                                    <span className='body1bold'>
                                        Pharmacy / Script Information
                                    </span>
                                </BioType>

                                {order_data.subscription &&
                                    parseLastUsedScript(
                                        order_data.subscription
                                            .last_used_script,
                                        order_data.assigned_pharmacy
                                    )}
                                <BioType className='body1bold'>
                                    Cadence:{' '}
                                    <span className='body1'>
                                        {order_data.subscription_type}
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
                                            {order_data.address_line1},{' '}
                                            {order_data.address_line2}
                                        </BioType>
                                        <BioType className='body1'>
                                            {order_data.city},{' '}
                                            {order_data.state}
                                            {'  '}
                                            {order_data.zip}
                                        </BioType>
                                        <BioType className='body1'>
                                            United States
                                        </BioType>
                                    </div>
                                    <div className='flex'>
                                        {order_data.payment_failure &&
                                            order_data.payment_failure[0] &&
                                            order_data.payment_failure[0]
                                                .status && (
                                                <Button
                                                    variant='contained'
                                                    color='primary'
                                                    onClick={() =>
                                                        setPaymentFailureDialogOpen(
                                                            true
                                                        )
                                                    }
                                                >
                                                    View Payment Failure
                                                    Information
                                                </Button>
                                            )}
                                    </div>
                                </div>
                            </div>
                        </div>{' '}
                        {order_data.order_status !==
                            OrderStatus.ApprovedCardDownFinalized &&
                            determineAccessByRoleName(
                                access_type,
                                BV_AUTH_TYPE.COORDINATOR
                            ) && (
                                <div className='px-6 py-2'>
                                    <Button
                                        variant='contained'
                                        color='info'
                                        onClick={() => setChangeOrderOpen(true)}
                                    >
                                        Swap product
                                    </Button>
                                </div>
                            )}
                        <ChangeOrderInformationDialog
                            open={changeOrderOpen}
                            onClose={() => setChangeOrderOpen(false)}
                            orderData={order_data}
                            setSnackbarMessage={setSnackbarMessage}
                            setSnackbarStatus={setSnackbarStatus}
                            setShowSnackbar={setShowSnackbar}
                            mutate_orders={mutate_orders}
                        />
                        {determineAccessByRoleName(
                            access_type,
                            BV_AUTH_TYPE.LEAD_COORDINATOR
                        ) &&
                            RESEND_MAPPED_PRODUCTS.includes(
                                order_data.product_href as PRODUCT_HREF
                            ) &&
                            order_data.pharmacy_script && (
                                <div className='flex self-start mb-4 px-6'>
                                    <Button
                                        variant='contained'
                                        color='primary'
                                        onClick={() => {
                                            setShowResendDialog(true);
                                        }}
                                    >
                                        Resend Script
                                    </Button>
                                    <ResendScriptConfirmationDialog
                                        open={showResendDialog}
                                        onClose={() => {
                                            setShowResendDialog(false);
                                        }}
                                        orderId={order_data.id}
                                        assigned_provider={
                                            order_data.assigned_provider
                                        }
                                        script_sent={Boolean(
                                            prescriptionSentAudit &&
                                                prescriptionSentAudit.length > 0
                                        )}
                                        order_type={OrderType.Order}
                                        variant_index={order_data.variant_index}
                                        product_href={
                                            order_data.product_href as PRODUCT_HREF
                                        }
                                        patientId={profile_data.id}
                                    />
                                </div>
                            )}
                        {determineAccessByRoleName(
                            access_type,
                            BV_AUTH_TYPE.ADMIN
                        ) && (
                            <div className='flex self-start mb-4 px-6'>
                                <Button
                                    variant='outlined'
                                    color='success'
                                    onClick={() => {
                                        window.open(
                                            `https://supabase.com/dashboard/project/pplhazgfonbrptwkzfbe/editor/34274?filter=id%3Aeq%3A${order_data.id}`,
                                            '_blank'
                                        );
                                    }}
                                >
                                    Open Supabase Order
                                </Button>
                            </div>
                        )}

                        {determineAccessByRoleName(
                            access_type,
                            BV_AUTH_TYPE.ADMIN
                        ) && (
                            <div className='flex self-start mb-4 px-6'>
                                <Button
                                    variant='contained'
                                    sx={{ 
                                        borderRadius: '12px', 
                                        backgroundColor: 'black',
                                        paddingX: '32px',
                                        paddingY: '14px',
                                        ":hover": {
                                            backgroundColor: 'darkslategray',
                                        }
                                    }}
                                    onClick={() => {
                                        sendMoreNeedles();   
                                    }}
                                >
                                        <span className='normal-case provider-bottom-button-text  text-white'>Send more needles</span>
                                </Button>
                            </div>
                        )}

                        {determineAccessByRoleName(
                            access_type,
                            BV_AUTH_TYPE.LEAD_COORDINATOR
                        ) &&
                            ESCALATION_CAPABLE_PHARMACIES.includes(
                                order_data.assigned_pharmacy
                            ) && (
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
                                    <EscalateOrderDialog
                                        open={showEscalateDialog}
                                        onClose={() => {
                                            setShowEscalateDialog(false);
                                        }}
                                        order_data={order_data}
                                        profile_data={profile_data}
                                    />
                                </>
                            )}
                        {order_data.subscription &&
                            order_data.subscription.status !== 'canceled' && (
                                <div className='px-6 mb-6'>
                                    {determineAccessByRoleName(
                                        access_type,
                                        BV_AUTH_TYPE.LEAD_COORDINATOR
                                    ) && (
                                        <>
                                            <Button
                                                variant='contained'
                                                color='error'
                                                onClick={() => {
                                                    setCancellationDialogOpen(
                                                        true
                                                    );
                                                }}
                                            >
                                                Cancel Order & Subscription
                                            </Button>

                                            <OrderTableConfirmationDialog
                                                open={cancelationDialogOpen}
                                                onClose={() => {
                                                    setCancellationDialogOpen(
                                                        false
                                                    );
                                                }}
                                                onConfirm={
                                                    cancelThisOrderAndSubscription
                                                }
                                                title={
                                                    'Cancel Order For Patient'
                                                }
                                                content={
                                                    'Caution: this will cancel the order from being viewed by providers AND cancel the subscription on stripe if it exists. '
                                                }
                                            />
                                            <BioverseSnackbarMessage
                                                open={snackbarOpen}
                                                setOpen={setSnackbarOpen}
                                                color={'success'}
                                                message={
                                                    'The order was cancelled successfully! Absolutely LEGENDARY you are.'
                                                }
                                            />
                                        </>
                                    )}
                                </div>
                            )}
                        {!order_data.subscription &&
                            determineAccessByRoleName(
                                access_type,
                                BV_AUTH_TYPE.LEAD_COORDINATOR
                            ) && (
                                <>
                                    <div className='px-6 py-1'>
                                        <Button
                                            variant='contained'
                                            color='error'
                                            onClick={() => {
                                                setCancellationDialogOpen(true);
                                            }}
                                        >
                                            Cancel Order
                                        </Button>

                                        <OrderTableConfirmationDialog
                                            open={cancelationDialogOpen}
                                            onClose={() => {
                                                setCancellationDialogOpen(
                                                    false
                                                );
                                            }}
                                            onConfirm={cancelThisOrder}
                                            title={'Cancel Order For Patient'}
                                            content={
                                                'Caution: this will ONLY cancel the order from being viewed by providers. This order does NOT have a subscription created for it yet.'
                                            }
                                        />
                                        <BioverseSnackbarMessage
                                            open={snackbarOpen}
                                            setOpen={setSnackbarOpen}
                                            color={'success'}
                                            message={
                                                'The order was cancelled successfully! Absolutely LEGENDARY you are.'
                                            }
                                        />
                                    </div>
                                </>
                            )}
                        {determineAccessByRoleName(
                            access_type,
                            BV_AUTH_TYPE.COORDINATOR
                        ) &&
                            order_data.order_status == 'Payment-Declined' && (
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
                    </Collapse>
                </TableCell>
            </TableRow>
            <AddressEditDialog
                onClose={closeAddressEditBox}
                onConfirm={() => router.refresh()}
                order_data={order_data}
                dialog_open={addressEditBoxOpen}
                orderType={OrderType.Order}
            />
            <BioverseSnackbarMessage
                color={snackbarStatus}
                message={snackbarMessage}
                open={showSnackbar}
                setOpen={setShowSnackbar}
            />
            <PaymentFailureHistoryDialog
                open={paymentFailureDialogOpen}
                setOpen={setPaymentFailureDialogOpen}
                order_id={order_data.id}
            />
            <RetryPaymentDialogPatientChart
                open={retryPaymentDialogOpen}
                onClose={() => setRetryPaymentDialogOpen(false)}
                orderId={order_data.id}
                orderType={OrderType.Order}
            />
        </Fragment>
    );
}
