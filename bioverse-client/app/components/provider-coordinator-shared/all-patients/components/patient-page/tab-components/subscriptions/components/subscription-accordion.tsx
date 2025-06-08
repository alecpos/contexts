'use client';

import {
    cancelStripeSubscriptionImmediately,
    cancelSubscriptionStripeAndDatabase,
} from '@/app/(administration)/admin/stripe-api/stripe-api-actions';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import BioverseSnackbarMessage from '@/app/components/global-components/snackbar/bioverse-snackbar';
import { triggerEvent } from '@/app/services/customerio/customerioApiFactory';
import {
    ORDER_CANCELED,
    WL_CHECKIN_RESEND,
} from '@/app/services/customerio/event_names';
import { retrieveStripeSubscription } from '@/app/services/stripe/subscriptions';
import { Status } from '@/app/types/global/global-enumerators';
import { insertAuditIntoAdministrativeCancelTable } from '@/app/utils/database/controller/admin_order_cancel_audit/admin-order-cancel-audit';
import {
    TableRow,
    TableCell,
    IconButton,
    Collapse,
    Button,
} from '@mui/material';
import { useState, useEffect, Fragment } from 'react';
import useSWR from 'swr';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { BV_AUTH_TYPE } from '@/app/types/auth/authorization-types';
import { determineAccessByRoleName } from '@/app/utils/functions/auth/authorization/authorizaiton-helper';
import ConfirmationDialog from './confirmation-dialog-box/confirmation-dialog';
import LoadingScreen from '@/app/components/global-components/loading-screen/loading-screen';
import dynamic from 'next/dynamic';
import { sendCheckInCustomerIOEvent } from '@/app/utils/actions/stripe/stripe-webhook-actions';
import { logPatientAction } from '@/app/utils/database/controller/patient_action_history/patient-action-history';
import { PatientActionTask } from '@/app/utils/database/controller/patient_action_history/patient-action-history-types';
import CancelSubscriptionConfirmationDialog from './confirmation-dialog-box/confirmation-dialog';
import { updateSubscription, addOrRemoveStatusFlags } from '@/app/utils/database/controller/prescription_subscriptions/prescription_subscriptions';
import { SubscriptionStatusFlags } from '@/app/utils/database/controller/prescription_subscriptions/prescription_subscription_enums';

interface SubscriptionTabRowProps {
    subscription: SubscriptionTableItem;
    access_type: BV_AUTH_TYPE | null;
}

const DynamicChangeProductComponent = dynamic(
    () => import('./change-product-dialog/ChangeSubscriptionInformationDialog'),
    {
        loading: () => <LoadingScreen />,
    }
);

const DynamicChangeCadenceComponent = dynamic(
    () => import('./change-cadence-dialog/change-cadence-dialog'),
    {
        loading: () => <LoadingScreen />,
    }
);

export default function SubscriptionTabRow({
    subscription,
    access_type,
}: SubscriptionTabRowProps) {
    const [open, setOpen] = useState(false);

    const [cancelationDialogOpen, setCancellationDialogOpen] =
        useState<boolean>(false);
    const [
        changeSubscriptionRenewalDialogOpen,
        setSubscriptionRenewalDialogOpen,
    ] = useState<boolean>(false);
    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
    const [renewalSuccessSnackbarOpen, setRenewalSuccessSnackbarOpen] =
        useState<boolean>(false);
    const [renewalFailureSnackbarOpen, setRenewalFailureSnackbarOpen] =
        useState<boolean>(false);
    const [changeSubscriptionDialog, setChangeSubscriptionDialog] =
        useState<boolean>(false);
    const [checkInSnackBarSucessOpen, setCheckInSnackBarSuccessOpen] =
        useState<boolean>(false);
    const [sendCheckInFormDialog, setSendCheckInFormDialog] =
        useState<boolean>(false);
    const [snackbarMessage, setSnackbarMessage] = useState<string>('');
    const [snackbarStatus, setSnackbarStatus] = useState<'success' | 'error'>(
        'success'
    );
    const [showSnackbar, setShowSnackbar] = useState<boolean>(false);

    const [stripeData, setStripeData] = useState<any>();
    const [statusFlagChanging, setStatusFlagChanging] = useState<boolean>(false);

    const { data, isLoading } = useSWR(
        `${subscription.stripe_subscription_id}-swr`,
        () => retrieveStripeSubscription(subscription.stripe_subscription_id)
    );

    useEffect(() => {
        if (data) {
            setStripeData(JSON.parse(data));
        }
    }, [data]);

    const convertSubscriptionStatus = (status: string) => {
        if (
            subscription.status_flags &&
            subscription.status_flags.includes('no_check_in_hold')
        ) {
            return (
                <span className='flex flex-row gap-2'>
                    {status}{' '}
                    <span className='text-red-500 font-bold'> NCI Hold</span>
                </span>
            );
        }

        if (
            subscription.status_flags &&
            subscription.status_flags.includes('no_check_in_hold_charged')
        ) {
            return (
                <span className='flex flex-row gap-2'>
                    {status}{' '}
                    <span className='text-red-500 font-bold'> NCI Hold (Charged)</span>
                </span>
            );
        }

        if (
            subscription.status_flags &&
            subscription.status_flags.includes('no_check_in_hold_pending_ds')
        ) {
            return (
                <span className='flex flex-row gap-2'>
                    {status}{' '}
                    <span className='text-red-500 font-bold'> NCI Hold (Charged + Checkin Completed)</span>
                </span>
            );
        }
        return status;
    };

    const cancelThisSubscription = async (reason: string) => {
        const result = await fullCancelSubscriptionAdministratively(reason);
        if (result == 'success') {
            setSnackbarOpen(true);
        }
    };

    const fullCancelSubscriptionAdministratively = async (reason: string) => {
        const { error } = await insertAuditIntoAdministrativeCancelTable(
            subscription.order_id,
            reason
        );

        if (error) {
            return Status.Failure;
        }

        // const { success } = await cancelSubscriptionStripeAndDatabase(
        //     parseInt(subscription.id),
        //     subscription.stripe_subscription_id,
        //     true
        // );

        try {
            await cancelStripeSubscriptionImmediately(
                subscription.stripe_subscription_id
            );

            await updateSubscription(parseInt(subscription.id), {
                status: 'canceled',
            });

            await triggerEvent(subscription.patient_id, ORDER_CANCELED, {
                order_id: subscription.order_id,
            });

            setCancellationDialogOpen(false);
            return Status.Success;
        } catch (error: any) {
            console.log('failed due to stripe cancellation');
            return Status.Failure;
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

    function convertEpochToReadableTimestamp(epoch: number): string {
        const date = new Date(epoch * 1000); // Convert epoch to milliseconds
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        };
        return new Intl.DateTimeFormat('en-US', options).format(date);
    }

    const redirectToOrderId = (order_id: string) => {
        if (determineAccessByRoleName(access_type, BV_AUTH_TYPE.PROVIDER)) {
            window.open(`/provider/intakes/${order_id}`, '_blank');
        } else if (
            determineAccessByRoleName(access_type, BV_AUTH_TYPE.COORDINATOR)
        ) {
            window.open(`/coordinator/${order_id}`, '_blank');
        }
    };

    const sendCheckinFormToCustomer = async () => {
        const resp = await triggerEvent(
            subscription.patient_id,
            WL_CHECKIN_RESEND,
            {
                checkin_url: `https://app.gobioverse.com/check-up/${subscription.product_href}`,
            }
        );
        await logPatientAction(
            subscription.patient_id,
            PatientActionTask.CHECKIN_FORM_SENT,
            { product_href: subscription.product_href }
        );
        if (resp.status === 200) {
            setCheckInSnackBarSuccessOpen(true);
        }
        setSendCheckInFormDialog(false);
    };

    const addOrReplaceNCIFlag = async (flag: string) => {
        setStatusFlagChanging(true);
        if (subscription.status_flags?.includes(flag)) {
            await addOrRemoveStatusFlags(
                Number(subscription.id),
                'remove',
                flag as SubscriptionStatusFlags
            );
        } else {
            await addOrRemoveStatusFlags(
                Number(subscription.id),
                'add',
                flag as SubscriptionStatusFlags
            );
        }
        setStatusFlagChanging(false);
    }

    return (
        <Fragment>
            <>
                <TableRow
                    sx={{
                        '& > *': { borderBottom: 'unset' },
                        cursor: 'pointer',
                    }}
                    onClick={() => setOpen(!open)}
                >
                    <TableCell
                        className='body1 text-primary hover:underline hover:cursor-pointer'
                        onClick={() => {
                            redirectToOrderId(subscription.order_id);
                        }}
                    >
                        <BioType>BV-{subscription.order_id}</BioType>
                    </TableCell>
                    <TableCell>
                        {convertTimestamp(subscription.created_at)}
                    </TableCell>
                    <TableCell>{subscription.product.name}</TableCell>
                    <TableCell>{subscription.subscription_type}</TableCell>
                    <TableCell>
                        {convertSubscriptionStatus(subscription.status)}
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
                                <div className='flex flex-col justify-start items-start gap-2'>
                                    <BioType className='body1'>
                                        Subscription ID: {subscription.id}
                                    </BioType>
                                    <div>
                                        <BioType className='body1'>
                                            Stripe Data:
                                        </BioType>
                                        {stripeData && (
                                            <div className='flex flex-col p-2 body2'>
                                                <BioType>
                                                    Name:{' '}
                                                    {subscription.product.name}
                                                </BioType>
                                                <BioType>
                                                    Cadence:{' '}
                                                    {
                                                        subscription.subscription_type
                                                    }
                                                </BioType>
                                                <BioType>
                                                    Recurring price:{' '}
                                                    {stripeData.plan &&
                                                        Number(
                                                            stripeData.plan
                                                                .amount
                                                        ) / 100}
                                                </BioType>
                                                <BioType className='flex flex-row gap-2'>
                                                    Discount applied ?:{' '}
                                                    {subscription &&
                                                    subscription.order &&
                                                    subscription.order
                                                        .discount_id ? (
                                                        <BioType className='body2 text-primary'>
                                                            True
                                                        </BioType>
                                                    ) : (
                                                        <BioType className='body2 text-red-500'>
                                                            False
                                                        </BioType>
                                                    )}
                                                </BioType>
                                                <BioType>
                                                    Next renewal date:{' '}
                                                    {stripeData &&
                                                        stripeData.current_period_end &&
                                                        convertEpochToReadableTimestamp(
                                                            stripeData.current_period_end
                                                        )}
                                                </BioType>
                                            </div>
                                        )}
                                    </div>

                                    {determineAccessByRoleName(
                                        access_type,
                                        BV_AUTH_TYPE.ADMIN
                                    ) && (
                                    <div className='flex flex-row gap-2'>
                                        <div>
                                            <Button
                                                variant='contained'
                                                disabled={statusFlagChanging}
                                                onClick={() => 

                                                    addOrReplaceNCIFlag(SubscriptionStatusFlags.NO_CHECK_IN_HOLD)
                                                }
                                                sx={{
                                                    backgroundColor: subscription.status_flags?.includes(SubscriptionStatusFlags.NO_CHECK_IN_HOLD) 
                                                        ? subscription.status_flags.length > 1 ? 'red' : '#4CAF50'
                                                        : 'gray',
                                                    '&:hover': {
                                                        backgroundColor: subscription.status_flags?.includes(SubscriptionStatusFlags.NO_CHECK_IN_HOLD)
                                                            ? subscription.status_flags.length > 1 ? 'darkred' : '#45a049'
                                                            : 'darkgray'
                                                    }
                                                }}
                                            >
                                                <p className='text-white'>{statusFlagChanging ? 'Updating...' : 'NCI Hold'}</p>
                                            </Button>
                                        </div>
                                        <div>
                                            <Button
                                                variant='contained'
                                                disabled={statusFlagChanging}
                                                onClick={() => addOrReplaceNCIFlag(SubscriptionStatusFlags.NO_CHECK_IN_HOLD_CHARGED)}
                                                sx={{
                                                    backgroundColor: subscription.status_flags?.includes(SubscriptionStatusFlags.NO_CHECK_IN_HOLD_CHARGED)
                                                        ? subscription.status_flags.length > 1 ? 'red' : '#4CAF50'  
                                                        : 'gray',
                                                    '&:hover': {
                                                        backgroundColor: subscription.status_flags?.includes(SubscriptionStatusFlags.NO_CHECK_IN_HOLD_CHARGED)
                                                            ? subscription.status_flags.length > 1 ? 'darkred' : '#45a049'
                                                            : 'darkgray'
                                                    }
                                                }}
                                            >
                                                <p className='text-white'>{statusFlagChanging ? 'Updating...' : 'NCI Hold (Charged)'}</p>
                                            </Button>
                                        </div>
                                        <div>
                                            <Button
                                                variant='contained'
                                                disabled={statusFlagChanging}
                                                onClick={() => addOrReplaceNCIFlag(SubscriptionStatusFlags.NO_CHECK_IN_HOLD_PENDING_DS)}
                                                sx={{
                                                    backgroundColor: subscription.status_flags?.includes(SubscriptionStatusFlags.NO_CHECK_IN_HOLD_PENDING_DS)
                                                        ? subscription.status_flags.length > 1 ? 'red' : '#4CAF50'
                                                        : 'gray',
                                                    '&:hover': {
                                                        backgroundColor: subscription.status_flags?.includes(SubscriptionStatusFlags.NO_CHECK_IN_HOLD_PENDING_DS)
                                                            ? subscription.status_flags.length > 1 ? 'darkred' : '#45a049'
                                                            : 'darkgray'
                                                    }
                                                }}
                                            >
                                                <p className='text-white'>{statusFlagChanging ? 'Updating...' : 'NCI Hold (Charged + Checkin Completed)'}</p>
                                            </Button>
                                        </div>
                                    </div>
                                    )}

                                    <div className='flex flex-row gap-2 mt-4'>
                                        {determineAccessByRoleName(
                                            access_type,
                                            BV_AUTH_TYPE.COORDINATOR
                                        ) && (
                                            <Button
                                                variant='outlined'
                                                size='medium'
                                                color='primary'
                                                onClick={() => {
                                                    setSubscriptionRenewalDialogOpen(
                                                        true
                                                    );
                                                }}
                                            >
                                                Change Renewal Date
                                            </Button>
                                        )}
                                        {determineAccessByRoleName(
                                            access_type,
                                            BV_AUTH_TYPE.COORDINATOR
                                        ) && (
                                            <Button
                                                variant='outlined'
                                                size='medium'
                                                color='info'
                                                onClick={() =>
                                                    setChangeSubscriptionDialog(
                                                        true
                                                    )
                                                }
                                            >
                                                Change Subscription Details
                                            </Button>
                                        )}
                                        {determineAccessByRoleName(
                                            access_type,
                                            BV_AUTH_TYPE.LEAD_COORDINATOR
                                        ) && (
                                            <Button
                                                variant='outlined'
                                                size='medium'
                                                color='error'
                                                onClick={() => {
                                                    setCancellationDialogOpen(
                                                        true
                                                    );
                                                }}
                                            >
                                                Full Cancel Subscription
                                            </Button>
                                        )}

                                        {determineAccessByRoleName(
                                            access_type,
                                            BV_AUTH_TYPE.COORDINATOR
                                        ) && (
                                            <Button
                                                variant='outlined'
                                                size='medium'
                                                color='primary'
                                                onClick={() => {
                                                    setSendCheckInFormDialog(
                                                        true
                                                    );
                                                }}
                                            >
                                                Resend Check-in Form
                                            </Button>
                                        )}
                                        <DynamicChangeProductComponent
                                            subscriptionData={subscription}
                                            onClose={() =>
                                                setChangeSubscriptionDialog(
                                                    false
                                                )
                                            }
                                            open={changeSubscriptionDialog}
                                            setSnackbarMessage={
                                                setSnackbarMessage
                                            }
                                            setSnackbarStatus={
                                                setSnackbarStatus
                                            }
                                            setShowSnackbar={setShowSnackbar}
                                        />
                                        <ConfirmationDialog
                                            open={sendCheckInFormDialog}
                                            onClose={() => {
                                                setSendCheckInFormDialog(false);
                                            }}
                                            onConfirm={() =>
                                                sendCheckinFormToCustomer()
                                            }
                                            title={
                                                'Resend Check-in Form for Patient'
                                            }
                                            showReason={false}
                                            content={`This will send resend a 'Complete your Check-in' email to the patient for their ${subscription.product_href} subscription`}
                                        />

                                        <CancelSubscriptionConfirmationDialog
                                            open={cancelationDialogOpen}
                                            onClose={() => {
                                                setCancellationDialogOpen(
                                                    false
                                                );
                                            }}
                                            onConfirm={cancelThisSubscription}
                                            title={'Cancel Order For Patient'}
                                            content={
                                                'CAUTION: THIS WILL CANCEL THE SUBSCRIPTION ON STRIPE IMMEDIATELY. Please type: "I understand" to proceed'
                                            }
                                        />

                                        <DynamicChangeCadenceComponent
                                            subscription_data={subscription}
                                            open={
                                                changeSubscriptionRenewalDialogOpen
                                            }
                                            onClose={() => {
                                                setSubscriptionRenewalDialogOpen(
                                                    false
                                                );
                                            }}
                                            stripe_data={stripeData}
                                            onSuccess={() => {
                                                setRenewalSuccessSnackbarOpen(
                                                    true
                                                );
                                            }}
                                            onFailure={() => {
                                                setRenewalFailureSnackbarOpen(
                                                    true
                                                );
                                            }}
                                        />

                                        <BioverseSnackbarMessage
                                            open={snackbarOpen}
                                            setOpen={setSnackbarOpen}
                                            color={'success'}
                                            message={
                                                'Subscription Cancelled. Worry no more about this you beast 🦁'
                                            }
                                        />

                                        <BioverseSnackbarMessage
                                            open={renewalSuccessSnackbarOpen}
                                            setOpen={
                                                setRenewalSuccessSnackbarOpen
                                            }
                                            color={'success'}
                                            message={
                                                'This subscriptions renewal date has been changed. Keep up the great work.'
                                            }
                                        />

                                        <BioverseSnackbarMessage
                                            open={checkInSnackBarSucessOpen}
                                            setOpen={
                                                setCheckInSnackBarSuccessOpen
                                            }
                                            color={'success'}
                                            message={
                                                'Successfully sent check-in form to customer'
                                            }
                                        />

                                        <BioverseSnackbarMessage
                                            open={renewalFailureSnackbarOpen}
                                            setOpen={
                                                setRenewalFailureSnackbarOpen
                                            }
                                            color={'error'}
                                            message={
                                                'There was an error that happened while changing this. Contact Nathan for support.'
                                            }
                                        />
                                        {determineAccessByRoleName(
                                            access_type,
                                            BV_AUTH_TYPE.ADMIN
                                        ) && (
                                            <div className='flex self-start mb-4'>
                                                <Button
                                                    variant='outlined'
                                                    color='success'
                                                    onClick={() => {
                                                        window.open(
                                                            `https://supabase.com/dashboard/project/pplhazgfonbrptwkzfbe/editor/35855?filter=id%3Aeq%3A${subscription.id}`,
                                                            '_blank'
                                                        );
                                                    }}
                                                >
                                                    Open Supabase Subscription
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Collapse>
                    </TableCell>
                </TableRow>
            </>
        </Fragment>
    );
}
