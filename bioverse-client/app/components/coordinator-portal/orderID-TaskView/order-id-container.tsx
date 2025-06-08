'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';

import { useMemo, useState } from 'react';

import BioverseSnackbarMessage from '@/app/components/global-components/snackbar/bioverse-snackbar';
import PatientInformationColumn from '../thread-view/provider-view-clone/components/containers/patient-information-column';
import NotesColumn from '../thread-view/provider-view-clone/components/containers/notes-column';

import TabColumn from '../thread-view/provider-view-clone/components/containers/tab-container';

import { Button, Paper } from '@mui/material';
import StatusDropdown from '../../provider-coordinator-shared/order-charts/components/StatusDropdown';
import CoordinatorConfirmPrescriptionDialog from './confirm-prescription-dialog/confirm-prescription-dialog';
import { OrderType } from '@/app/types/orders/order-types';
import { WEIGHT_LOSS_PRODUCT_HREF } from '../../intake-v2/constants/constants';
import CoordinatorTaskActionInfoBar from '../thread-view/provider-view-clone/components/containers/components/coordinator-task-action-info-bar';

import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import useSWR from 'swr';
import { intakeViewDataFetch } from '../../provider-portal/intake-view/v2/components/containers/utils/data-fetch/intake-view-datafetch';
import {
    determineCoordinatorWidthArray,
    getCoordinatorTaskTitle,
} from './utils/coordinator-task-display-properties';
import { StatusTag } from '@/app/types/status-tags/status-types';
import { PillStatus } from '@/app/types/provider-portal/provider-portal-types';
import StatusPillV2 from '../../provider-portal/intake-view/v2/components/containers/components/StatusPillV2';
import ActiveSubscriptionsPill from '../../provider-coordinator-shared/order-charts/components/ActiveSubscriptionsPill';
import InternalNoteAlert from '../../provider-portal/provider-patient-review/top-information-display/internal-note-alert';

interface IntakeViewMainContainerProps {
    orderId: string;
    patient_data: DBPatientData;
    order_data: DBOrderData;
    isLead: boolean;
    userId: string;
    taskId?: string;
}

export default function CoordinatorOrderViewContainer({
    orderId,
    patient_data,
    order_data,
    isLead,
    userId,
    taskId,
}: IntakeViewMainContainerProps) {
    const [tabSelected, setTabSelected] = useState<string>('messages');
    const [macroDestination, setMacroDestination] =
        useState<string>('messages');

    const [confirmPrescriptionOpen, setConfirmPrescriptionOpen] =
        useState<boolean>(false);

    const [successSnackbarOpen, setSuccessSnackbarOpen] =
        useState<boolean>(false);
    const [failureSnackbarOpen, setFailureSnackbarOpen] =
        useState<boolean>(false);

    const [messageContent, setMessageContent] = useState<string>('');

    const [isPatientInformationMinimized, setPatientInformationMinimized] =
        useState<boolean>(false);

    const [isClinicalNotesMinimized, setClinicalNotesMinimized] =
        useState<boolean>(false);

    const [canProceed, setCanProceed] = useState<boolean>(false);

    const widthArray = useMemo(
        () =>
            determineCoordinatorWidthArray(
                isPatientInformationMinimized,
                isClinicalNotesMinimized
            ),
        [isPatientInformationMinimized, isClinicalNotesMinimized]
    );

    const { data: intakeFetchData, isLoading: fetchLoading } = useSWR(
        `intake-view-${orderId}`,
        () => intakeViewDataFetch(String(orderId)),
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            revalidateOnMount: true,
            revalidateIfStale: false,
            dedupingInterval: 5000,
            shouldRetryOnError: false,
        }
    );

    const goToPatientChart = () => {
        window.open(`/coordinator/all-patients/${patient_data.id}`, '_blank');
    };

    return (
        <div
            id='main_container'
            className='flex flex-col px-4 gap-2 py-2 h-screen overflow-hidden'
        >
            <div
                id='patient_product_name_container'
                className='flex space-x-6 justify-between items-start'
            >
                <div className='flex items-start flex-col'>
                    <div className='flex flex-row items-center justify-center gap-2 mb-3'>
                        <BioType className='intake-v3-form-label font-inter'>
                            {patient_data?.last_name},{' '}
                            {patient_data?.first_name}
                        </BioType>
                    </div>

                    <div>
                        <Button
                            variant='outlined'
                            onClick={goToPatientChart}
                            className='!text-black font-inter text-[16px] rounded-[var(--Corner-radius-M,12px)] border border-[color:var(--Stroke-Strong,rgba(0,0,0,0.90))] border-solid normal-case'
                        >
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                width='20'
                                height='20'
                                viewBox='0 0 20 20'
                                fill='none'
                                className='mr-2'
                            >
                                <path
                                    d='M14 12.8173C13.2628 12.8173 12.6362 12.5592 12.1202 12.0433C11.6042 11.5273 11.3462 10.9007 11.3462 10.1635C11.3462 9.42633 11.6042 8.79975 12.1202 8.28375C12.6362 7.76775 13.2628 7.50975 14 7.50975C14.7372 7.50975 15.3638 7.76775 15.8798 8.28375C16.3958 8.79975 16.6538 9.42633 16.6538 10.1635C16.6538 10.9007 16.3958 11.5273 15.8798 12.0433C15.3638 12.5592 14.7372 12.8173 14 12.8173ZM14 11.3173C14.3218 11.3173 14.5946 11.2054 14.8182 10.9817C15.0419 10.7581 15.1538 10.4853 15.1538 10.1635C15.1538 9.84167 15.0419 9.56892 14.8182 9.34525C14.5946 9.12142 14.3218 9.0095 14 9.0095C13.6782 9.0095 13.4054 9.12142 13.1818 9.34525C12.9581 9.56892 12.8462 9.84167 12.8462 10.1635C12.8462 10.4853 12.9581 10.7581 13.1818 10.9817C13.4054 11.2054 13.6782 11.3173 14 11.3173ZM8.34625 19.2693V16.7153C8.34625 16.4257 8.41525 16.1535 8.55325 15.8985C8.69125 15.6435 8.88442 15.4402 9.13275 15.2885C9.63092 14.9913 10.1563 14.745 10.709 14.5495C11.2617 14.354 11.826 14.2093 12.402 14.1155L14 16.125L15.5885 14.1155C16.1677 14.2093 16.7312 14.354 17.279 14.5495C17.8267 14.745 18.351 14.9913 18.852 15.2885C19.1007 15.4397 19.2948 15.6423 19.4345 15.8962C19.5743 16.1501 19.6474 16.4199 19.6538 16.7057V19.2693H8.34625ZM9.82125 17.7693H13.3865L11.8348 15.7923C11.4814 15.8818 11.1379 15.998 10.8042 16.141C10.4706 16.2842 10.1429 16.4436 9.82125 16.6193V17.7693ZM14.6135 17.7693H18.1538V16.6193C17.8423 16.4333 17.5197 16.273 17.186 16.1385C16.8525 16.0038 16.5091 15.8917 16.1557 15.802L14.6135 17.7693ZM2.31225 17.5C1.81058 17.5 1.38308 17.323 1.02975 16.969C0.676583 16.615 0.5 16.1894 0.5 15.6923V2.30775C0.5 1.81058 0.677 1.385 1.031 1.031C1.385 0.677 1.81058 0.5 2.30775 0.5H15.6923C16.1894 0.5 16.615 0.677 16.969 1.031C17.323 1.385 17.5 1.81058 17.5 2.30775V6.65375C17.291 6.41658 17.0683 6.1945 16.8318 5.9875C16.5953 5.7805 16.318 5.63658 16 5.55575V2.30775C16 2.21792 15.9712 2.14417 15.9135 2.0865C15.8558 2.02883 15.7821 2 15.6923 2H2.30775C2.21792 2 2.14417 2.02883 2.0865 2.0865C2.02883 2.14417 2 2.21792 2 2.30775V15.6923C2 15.7821 2.02883 15.8558 2.0865 15.9135C2.14417 15.9712 2.21792 16 2.30775 16H6.05375C6.02308 16.1192 6 16.2384 5.9845 16.3577C5.96917 16.4769 5.9615 16.5961 5.9615 16.7153V17.5H2.31225ZM4.25 5.86525H11.4615C11.7987 5.62808 12.1631 5.45183 12.5548 5.3365C12.9464 5.22117 13.3448 5.15708 13.75 5.14425V4.3655H4.25V5.86525ZM4.25 9.75H9.0095C9.02233 9.48333 9.05825 9.22658 9.11725 8.97975C9.17625 8.73308 9.25317 8.48983 9.348 8.25H4.25V9.75ZM4.25 13.6345H7.373C7.55 13.491 7.73625 13.3593 7.93175 13.2395C8.12725 13.1195 8.32692 13.0127 8.53075 12.9192V12.1348H4.25V13.6345ZM2 16V2V5.5405V5.125V16Z'
                                    fill='#4D4D4D'
                                    fillOpacity='0.45'
                                />
                            </svg>{' '}
                            Open Patient Chart
                        </Button>
                    </div>

                    {!fetchLoading && (
                        <BioType className='inter-basic font-bold text-black text-[15px] leading-[22px] mb-2 mt-[16px]'>
                            <span
                                style={{
                                    background:
                                        'linear-gradient(135deg, #fff59d 0%, #fff9c4 100%)',
                                    display: 'inline',
                                    padding: '0.4em 0.7em',
                                    borderRadius: '20px',
                                    border: '1px solid #fff176',
                                }}
                            >
                                {getCoordinatorTaskTitle(
                                    intakeFetchData?.statusTag as StatusTag
                                )}
                            </span>
                        </BioType>
                    )}
                </div>

                <div className='flex flex-col'>
                    <CoordinatorTaskActionInfoBar
                        user_id={userId}
                        task_id={taskId}
                        canProceed={canProceed}
                        patient_id={patient_data.id}
                        order_id={String(orderId)}
                    />

                    <div className='flex flex-row gap-3'>
                        {/* status pills */}
                        <div className='flex flex-wrap justify-start gap-y-1 gap-x-2 flex-grow'>
                            <ActiveSubscriptionsPill
                                patient_id={intakeFetchData?.patientData!.id}
                                order_id={String(orderId)}
                                order_product_href={
                                    intakeFetchData?.orderData.product_href
                                }
                            />

                            <StatusDropdown
                                patient_id={intakeFetchData?.patientData!.id}
                                order_id={String(orderId)}
                                orderType={intakeFetchData?.orderType}
                                order_data={intakeFetchData?.orderData}
                                employee_type={
                                    intakeFetchData?.orderData.employee_type
                                }
                                setCanProceed={setCanProceed}
                            />

                            <InternalNoteAlert
                                patient_id={intakeFetchData?.patientData!.id}
                                order_id={String(orderId)}
                            />

                            {intakeFetchData?.orderPillStatuses &&
                                intakeFetchData.orderPillStatuses.map(
                                    (pillStatus: PillStatus, index: number) => {
                                        return (
                                            <StatusPillV2
                                                status={pillStatus}
                                                key={index}
                                            />
                                        );
                                    }
                                )}
                            {intakeFetchData?.glp1Statuses &&
                                Object.entries(
                                    intakeFetchData.glp1Statuses
                                ).map(([key, value]) => {
                                    if (value) {
                                        return (
                                            <StatusPillV2
                                                status={key as PillStatus}
                                                key={key}
                                            />
                                        );
                                    }
                                    return null;
                                })}

                            {/* To Do: Make sure this only says autoshipped if the last shipped order was autoshipped
                             * it should check if the PREVIOUS renewal order was autoshipped, not the current one
                             * UNLESS the current order has already been shipped, in which case it should say autoshipped (if it was autoshipped)
                             */}
                            {intakeFetchData?.orderData?.autoshipped && (
                                <StatusPillV2 status={PillStatus.Autoshipped} />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div
                id='intake_content_column_container'
                className='flex flex-row gap-4 h-[calc(100vh-180px)] min-h-0'
            >
                {(isClinicalNotesMinimized ||
                    isPatientInformationMinimized) && (
                    <div
                        className={`flex flex-row gap-y-3 gap-x-[16px] relative left-0 ml-2 col-auto rounded-md h-full cursor-pointer overflow-y-auto`}
                    >
                        {isClinicalNotesMinimized && (
                            <div
                                className='flex flex-col w-8 bg-white p-3 h-full'
                                style={{
                                    boxShadow:
                                        '0px -2px 15px 0px rgba(0, 0, 0, 0.15)',
                                    borderRadius: '4px',
                                }}
                            >
                                <Paper
                                    className={`flex flex-col`}
                                    style={{ boxShadow: 'none' }}
                                >
                                    <div
                                        id='title_area'
                                        className='flex justify-center items-center hover:cursor-pointer border-[1px]  border-solid border-[#D7E3EB] rounded'
                                    >
                                        <UnfoldMoreIcon
                                            className='text-black  p-0 cursor-pointer   transform rotate-45'
                                            onClick={() => {
                                                setClinicalNotesMinimized(
                                                    false
                                                );
                                            }}
                                        />
                                    </div>
                                </Paper>

                                <div className='mt-7'></div>

                                <div className='transform rotate-90  '>
                                    <p className='w-[300px] provider-intake-tab-title '>
                                        Internal Notes
                                    </p>
                                </div>
                            </div>
                        )}

                        {isPatientInformationMinimized && (
                            <div
                                className='flex flex-col w-8  p-3 bg-white'
                                style={{
                                    boxShadow:
                                        '0px -2px 15px 0px rgba(0, 0, 0, 0.15)',
                                    borderRadius: '4px',
                                }}
                            >
                                <Paper
                                    className={`flex flex-col`}
                                    style={{ boxShadow: 'none' }}
                                >
                                    <div
                                        id='title_area'
                                        className='flex justify-center items-center hover:cursor-pointer  border-solid border-[1px] border-[#D7E3EB] rounded'
                                    >
                                        <UnfoldMoreIcon
                                            className='text-black  p-0 cursor-pointer   transform rotate-45'
                                            onClick={() => {
                                                setPatientInformationMinimized(
                                                    false
                                                );
                                            }}
                                        />
                                    </div>
                                </Paper>

                                <div className='mt-7'></div>

                                <div className='transform rotate-90'>
                                    <p className='w-[380px] provider-intake-tab-title'>
                                        Demographics, Intakes & Orders
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
                {!isClinicalNotesMinimized && (
                    <Paper
                        className={`w-[${widthArray.clinicalNotes}%] flex flex-col h-full flex-grow overflow-y-auto bg-white rounded-lg`}
                        elevation={2}
                        sx={{
                            '& .MuiPaper-root': {
                                boxShadow: 'none',
                            },
                        }}
                    >
                        <NotesColumn
                            patient_data={patient_data}
                            order_data={order_data}
                            setClinicalNotesMinimized={
                                setClinicalNotesMinimized
                            }
                        />
                    </Paper>
                )}

                {!isPatientInformationMinimized && (
                    <Paper
                        className={`w-[${widthArray.patientInformation}%] flex flex-col h-full flex-grow overflow-y-auto bg-white rounded-lg`}
                        elevation={2}
                        sx={{
                            '& .MuiPaper-root': {
                                boxShadow: 'none',
                            },
                        }}
                    >
                        <PatientInformationColumn
                            patient_data={patient_data}
                            order_data={order_data}
                            setPatientInformationMinimized={
                                setPatientInformationMinimized
                            }
                            setMessageContent={setMessageContent}
                        />
                    </Paper>
                )}
                <Paper
                    className={`w-[${widthArray.tabWindow}%] flex flex-col h-full flex-grow overflow-y-auto bg-white rounded-lg`}
                    elevation={2}
                    sx={{
                        '& .MuiPaper-root': {
                            boxShadow: 'none',
                        },
                    }}
                >
                    <TabColumn
                        patient_data={patient_data}
                        tabSelected={tabSelected}
                        setTabSelected={setTabSelected}
                        macroDestination={macroDestination}
                        setMacroDestination={setMacroDestination}
                        messageContent={messageContent}
                        setMessageContent={setMessageContent}
                    />
                </Paper>
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
