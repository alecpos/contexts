'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import PatientInformationColumn from './patient-information-column';
import { useState } from 'react';
import TabColumn from './tab-container';
import { Button, Chip, InputLabel, MenuItem, Select } from '@mui/material';
import {
    updateConsiderCompleteForThreadId,
    updateRequiresLeadForThreadId,
    updateRequiresProviderForThreadId,
} from '@/app/utils/database/controller/messaging/thread_escalations/thread_escalations';
import BioverseSnackbarMessage from '@/app/components/global-components/snackbar/bioverse-snackbar';
import { useRouter } from 'next/navigation';
import EngineerModal from './components/EngineerModal';
import ReviewModal from './components/ReviewModal';
import {
    getAllRenewalOrdersForOriginalOrderId,
    updateRenewalOrderByRenewalOrderId,
} from '@/app/utils/database/controller/renewal_orders/renewal_orders';
import useSWR from 'swr';
import { createUserStatusTagWAction } from '@/app/utils/database/controller/patient-status-tags/patient-status-tags-api';
import {
    StatusTag,
    StatusTagAction,
} from '@/app/types/status-tags/status-types';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import React from 'react';
import { updateOrder } from '@/app/utils/database/controller/orders/orders-api';

interface IntakeViewMainContainerProps {
    patient_data: DBPatientData;
    order_data: DBOrderData;
    escalation_data: any;
    thread_id: number;
    mutateSWRData: () => void;
    // orderType: OrderType;
    // orderPillStatuses: PillStatus[];
}

export default function CoordinatorThreadViewMainContainer({
    patient_data,
    order_data,
    thread_id,
    escalation_data,
    mutateSWRData,
}: IntakeViewMainContainerProps) {
    const [tabSelected, setTabSelected] = useState<string>('messages');
    const [macroDestination, setMacroDestination] =
        useState<string>('messages');

    const [successSnackbarOpen, setSuccessSnackbarOpen] =
        useState<boolean>(false);
    const [failureSnackbarOpen, setFailureSnackbarOpen] =
        useState<boolean>(false);

    const [sendAction, setSendAction] = useState<string>('complete');

    const [isStatusTagModalOpen, setIsStatusTagModalOpen] =
        useState<boolean>(false);
    const [isProviderReviewModalOpen, setIsProviderReviewModalOpen] =
        useState<boolean>(false);

    const [messageContent, setMessageContent] = useState<string>('');

    const router = useRouter();

    //Supabase has an issue where if a joined table returns 1 row.
    const escalation = escalation_data as DBEscalationData;

    const {
        data: renewal_thread_data,
        error: thread_error,
        isLoading: threads_Loading,
        mutate,
    } = useSWR(
        order_data.id ? `${order_data.id}-patient-order-data` : null,
        () => getAllRenewalOrdersForOriginalOrderId(order_data.id)
    );

    const markAsCompleted = async () => {
        await updateRequiresProviderForThreadId(thread_id, false);
        const res = await updateConsiderCompleteForThreadId(thread_id, true);
        if (res) {
            setSuccessSnackbarOpen(true);
        } else {
            setFailureSnackbarOpen(true);
        }
        mutateSWRData();
    };
    const handleProviderMessageTagInsert = async () => {
        const user_id = (await readUserSession()).data.session?.user.id;

        const note = 'Provider needs to message patient';
        if (renewal_thread_data && renewal_thread_data.length > 0) {
            await updateRenewalOrderByRenewalOrderId(
                renewal_thread_data[renewal_thread_data.length - 1]
                    .renewal_order_id,
                { assigned_provider: null }
            );
            await createUserStatusTagWAction(
                StatusTag.ProviderMessage,
                renewal_thread_data[renewal_thread_data.length - 1]
                    .renewal_order_id,
                StatusTagAction.REPLACE,
                order_data.customer_uid,
                note,
                user_id!,
                [StatusTag.ProviderMessage]
            );
        } else {
            await updateOrder(order_data.id, { assigned_provider: null });
            await createUserStatusTagWAction(
                StatusTag.ProviderMessage,
                order_data.id,
                StatusTagAction.REPLACE,
                order_data.customer_uid,
                note,
                user_id!,
                [StatusTag.ProviderMessage]
            );
        }
    };

    const shouldShowRNOption = () => {
        if (
            ['MN', 'MI', 'IL', 'NY', 'PA', 'MA', 'AK', 'HI'].includes(
                order_data.state
            )
        ) {
            return false;
        }
        return true;
    };

    const handleRegisteredNurseMessageTagInsert = async () => {
        const user_id = (await readUserSession()).data.session?.user.id;

        const note = 'Registered Nurse needs to message patient';
        if (renewal_thread_data && renewal_thread_data.length > 0) {
            await updateRenewalOrderByRenewalOrderId(
                renewal_thread_data[renewal_thread_data.length - 1]
                    .renewal_order_id,
                { assigned_provider: null }
            );
            await createUserStatusTagWAction(
                StatusTag.RegisteredNurseMessage,
                renewal_thread_data[renewal_thread_data.length - 1]
                    .renewal_order_id,
                StatusTagAction.REPLACE,
                order_data.customer_uid,
                note,
                user_id!,
                [StatusTag.RegisteredNurseMessage]
            );
        } else {
            await updateOrder(order_data.id, { assigned_provider: null });
            await createUserStatusTagWAction(
                StatusTag.RegisteredNurseMessage,
                order_data.id,
                StatusTagAction.REPLACE,
                order_data.customer_uid,
                note,
                user_id!,
                [StatusTag.RegisteredNurseMessage]
            );
        }
    };

    const sendToRegisteredNurse = async () => {
        await handleRegisteredNurseMessageTagInsert();
        await updateConsiderCompleteForThreadId(thread_id, false);
        const res = await updateRequiresProviderForThreadId(thread_id, true); // TODO: Not sure about this

        if (res) {
            setSuccessSnackbarOpen(true);
        } else {
            setFailureSnackbarOpen(true);
        }
        mutateSWRData();
    };

    const sendToProvider = async () => {
        await handleProviderMessageTagInsert();
        await updateConsiderCompleteForThreadId(thread_id, false);
        const res = await updateRequiresProviderForThreadId(thread_id, true);

        if (res) {
            setSuccessSnackbarOpen(true);
        } else {
            setFailureSnackbarOpen(true);
        }
        mutateSWRData;
    };

    const sendToLead = async () => {
        await updateRequiresLeadForThreadId(thread_id, false);
        const res = await updateRequiresProviderForThreadId(thread_id, true);
        if (res) {
            setSuccessSnackbarOpen(true);
        } else {
            setFailureSnackbarOpen(true);
        }
        mutateSWRData;
    };
    const sendToEngineerQueue = async () => {
        setIsStatusTagModalOpen(true);
    };
    const sendToProviderForReview = async () => {
        setIsProviderReviewModalOpen(true);
    };

    const goToPatientChart = () => {
        window.open(`/coordinator/all-patients/${patient_data.id}`, '_blank');
    };

    const renderAssignedParty = (): JSX.Element => {
        if (escalation.requires_lead) {
            return <Chip label={'Lead'} color='error'></Chip>;
        }
        if (escalation.requires_provider) {
            return <Chip label={'Provider'} color='primary'></Chip>;
        }

        return (
            <>
                <Chip label={'Coordinator/Unassigned'} color='secondary'></Chip>
            </>
        );
    };

    const enactCoordinatorAction = (action: string) => {
        switch (action) {
            case 'complete':
                markAsCompleted();
                break;
            case 'registered-nurse':
                sendToRegisteredNurse();
                break;
            case 'provider':
                sendToProvider();
                break;
            case 'lead':
                sendToLead();
                break;
            case 'engineer':
                sendToEngineerQueue();
                break;
            case 'review':
                sendToProviderForReview();
                break;
        }
    };

    return (
        <div id='main_container' className='flex flex-col px-8 pt-8 pb-6 gap-6'>
            <div
                id='patient_product_name_container'
                className='flex items-center space-x-6 justify-between'
            >
                <div className='flex flex-col'>
                    <BioType className='itd-h1 text-primary'>
                        {patient_data?.first_name} {patient_data?.last_name}:{' '}
                        {order_data?.product?.name}
                    </BioType>
                    <Button variant='outlined' onClick={goToPatientChart}>
                        OPEN Patient Chart
                    </Button>
                </div>
                <div className=' flex flex-row gap-3'>
                    <EngineerModal
                        orderData={order_data}
                        isModalOpen={isStatusTagModalOpen}
                        setIsModalOpen={setIsStatusTagModalOpen}
                        threadId={thread_id}
                        renewal_thread_data={renewal_thread_data}
                    />

                    <ReviewModal
                        isModalOpen={isProviderReviewModalOpen}
                        setIsModalOpen={setIsProviderReviewModalOpen}
                        orderData={order_data}
                        renewal_thread_data={renewal_thread_data}
                    />
                    <div className='flex flex-col gap-2'>
                        <BioType className='it-body'>
                            Currently Assigned To: {renderAssignedParty()}
                        </BioType>
                        <div className='flex flex-row gap-2'>
                            <Select
                                value={sendAction}
                                onChange={(e) => setSendAction(e.target.value)}
                            >
                                <MenuItem value={'lead'}>Send to Lead</MenuItem>
                                <MenuItem value={'provider'}>
                                    Send to Provider
                                </MenuItem>
                                {shouldShowRNOption() && (
                                    <MenuItem value={'registered-nurse'}>
                                        Send to Registered Nurse
                                    </MenuItem>
                                )}
                                <MenuItem value={'complete'}>
                                    Mark as Complete
                                </MenuItem>
                                <MenuItem value={'engineer'}>
                                    Send to Engineer
                                </MenuItem>
                                <MenuItem value={'review'}>
                                    Send for Review
                                </MenuItem>
                            </Select>
                            <Button
                                variant='outlined'
                                onClick={() =>
                                    enactCoordinatorAction(sendAction)
                                }
                            >
                                Send
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <div
                id='intake_content_column_container'
                className='flex flex-row gap-10'
            >
                <div style={{ width: '50%' }}>
                    <PatientInformationColumn
                        patient_data={patient_data}
                        order_data={order_data}
                        setMessageContent={setMessageContent}
                    />
                </div>
                <div style={{ width: '50%' }}>
                    <TabColumn
                        patient_data={patient_data}
                        tabSelected={tabSelected}
                        setTabSelected={setTabSelected}
                        macroDestination={macroDestination}
                        setMacroDestination={setMacroDestination}
                        messageContent={messageContent}
                        setMessageContent={setMessageContent}
                    />
                </div>
            </div>
            <BioverseSnackbarMessage
                open={successSnackbarOpen}
                setOpen={setSuccessSnackbarOpen}
                color={'success'}
                message={'You are a rockstar! Keep it up! 🚀🎧'}
            />
            <BioverseSnackbarMessage
                open={failureSnackbarOpen}
                setOpen={setFailureSnackbarOpen}
                color={'error'}
                message={
                    'There was a problem with this. Please contact Kevin Castro'
                }
            />
        </div>
    );
}
