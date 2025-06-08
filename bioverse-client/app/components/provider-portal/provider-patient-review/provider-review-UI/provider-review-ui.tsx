'use client';

import {
    Dispatch,
    SetStateAction,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { OrderType } from '@/app/types/orders/order-types';
import { Paper } from '@mui/material';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { createNewProviderActivityAudit } from '@/app/utils/database/controller/provider_activity_audit/provider_activity_audit-api';
import LoadingScreen from '@/app/components/global-components/loading-screen/loading-screen';
import { reportTaskFailure } from '@/app/utils/database/controller/tasks/task-api';
import { useParams } from 'next/navigation';
import ClinicalNotesColumn from '@/app/components/provider-portal/intake-view/v2/components/clinical-notes-column/clinical-notes-column';
import PatientInformationColumn from '../../intake-view/v2/components/containers/patient-information-column';
import TabColumn from '../../intake-view/v2/components/containers/tab-container';
import { determineProviderReviewWidth } from '../utils/column-minimize-logic';
import { BV_AUTH_TYPE } from '@/app/types/auth/authorization-types';

interface IntakeViewMainContainerProps {
    providerId: string;
    order_id: string;
    setCanProceed?: Dispatch<SetStateAction<boolean>>;
    employeeAuthorization: BV_AUTH_TYPE | null;
    intakeFetchData: any;
    fetchLoading: boolean;
    mutate: any;
}

export default function ProviderReviewUI({
    providerId,
    setCanProceed,
    order_id,
    employeeAuthorization,
    intakeFetchData,
    fetchLoading,
    mutate,
}: IntakeViewMainContainerProps) {
    const params = useParams();
    const taskId = params.taskId as string;

    const [isClinicalNotesMinimized, setClinicalNotesMinimized] =
        useState<boolean>(false);
    const [isPatientInfoMinimized, setPatientInfoMinimized] =
        useState<boolean>(false);
    const [responseRequired, setResponseRequired] = useState<boolean>(true);
    const [messageContent, setMessageContent] = useState<string>('');

    const widthArray = useMemo(
        () =>
            determineProviderReviewWidth(
                isPatientInfoMinimized,
                isClinicalNotesMinimized
            ),
        [isPatientInfoMinimized, isClinicalNotesMinimized]
    );

    useEffect(() => {
        let isSubscribed = true;
        const handleProviderAudit = async () => {
            const time = new Date().getTime(); // Record start time

            const new_audit: ProviderActivityAuditCreateObject = {
                provider_id: (await readUserSession()).data.session?.user.id!,
                action: 'view_intake',
                timestamp: time,
                environment: process.env.NEXT_PUBLIC_ENVIRONMENT!,
                ...(intakeFetchData?.orderType === OrderType.RenewalOrder
                    ? {
                          renewal_order_id:
                              intakeFetchData?.orderData.renewal_order_id,
                          order_id:
                              intakeFetchData?.orderData.original_order_id!,
                      }
                    : { order_id: intakeFetchData?.orderData.id }),
            };

            await createNewProviderActivityAudit(new_audit);
        };

        if (intakeFetchData?.orderData && intakeFetchData.orderType) {
            handleProviderAudit();
        }
        return () => {
            isSubscribed = false;
        };
    }, [intakeFetchData?.orderType, intakeFetchData?.orderData]);

    const reportTaskFailureFunction = useCallback(async () => {
        await reportTaskFailure(parseInt(taskId));
    }, [taskId]);

    if (!fetchLoading && !intakeFetchData) {
        reportTaskFailureFunction();
        if (setCanProceed) {
            setCanProceed(true);
        }
        return <LoadingScreen />;
    }

    if (fetchLoading || !intakeFetchData) {
        return <LoadingScreen />;
    }

    return (
        <div
            id='main_container'
            className='flex w-[100%] h-full flex-col flex-grow justify-start items-center pt-1 pb-4'
        >
            <div
                id='intake_content_column_container'
                className='flex flex-row gap-4 w-[98%] h-full'
            >
                {/*MINIMIZED PANELS*/}
                {(isPatientInfoMinimized || isClinicalNotesMinimized) && (
                    <div
                        className={`flex flex-row gap-y-3  gap-x-[16px] relative left-0 ml-2 col-auto rounded-md h-[440px] cursor-pointer `}
                    >
                        {isPatientInfoMinimized && (
                            <div
                                className='flex flex-col w-8  bg-white p-3 h-[330px]'
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
                                                setPatientInfoMinimized(false);
                                            }}
                                        />
                                    </div>
                                </Paper>

                                <div className='mt-7'></div>

                                <div className='transform rotate-90  '>
                                    <p className='w-[300px] provider-intake-tab-title '>
                                        Demographics, Intakes & Orders
                                    </p>
                                </div>
                            </div>
                        )}

                        {isClinicalNotesMinimized && (
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
                                                setClinicalNotesMinimized(
                                                    false
                                                );
                                            }}
                                        />
                                    </div>
                                </Paper>

                                <div className='mt-7'></div>

                                <div className='transform rotate-90  '>
                                    <p className='w-[380px] provider-intake-tab-title '>
                                        Allergy, Medication, Vitals & Clinical
                                        Notes
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/*PATIENT INFORMATION PANEL*/}
                {!isPatientInfoMinimized && (
                    <div
                        className={`w-[${widthArray.patientInformation}%] flex flex-col h-full flex-grow`}
                    >
                        <PatientInformationColumn
                            intakeResponses={intakeFetchData?.intakeResponses}
                            patient_data={intakeFetchData?.patientData!}
                            order_data={intakeFetchData?.orderData}
                            isPatientInformationMinimized={
                                isPatientInfoMinimized
                            }
                            setPatientInformationMinimized={
                                setPatientInfoMinimized
                            }
                            provider_Id={providerId}
                            orderType={intakeFetchData?.orderType}
                            mutateIntakeData={mutate}
                            setMessageContent={setMessageContent}
                            setResponseRequired={setResponseRequired}
                            statusTag={intakeFetchData?.statusTag}
                            setCanProceed={setCanProceed}
                            currentMonth={intakeFetchData.currentMonth}
                            currentDosage={intakeFetchData.currentDosage}
                            employeeAuthorization={employeeAuthorization}
                            dashboardTitle={intakeFetchData.dashboardTitle}
                        />
                    </div>
                )}

                {/*CLINICAL NOTES PANEL*/}
                {!isClinicalNotesMinimized && (
                    <div
                        className={`w-[${widthArray.clinicalNotes}%] flex flex-col h-full flex-grow`}
                    >
                        <ClinicalNotesColumn
                            setClinicalNotesMinimized={
                                setClinicalNotesMinimized
                            }
                            patient_data={intakeFetchData?.patientData!}
                            order_data={intakeFetchData?.orderData}
                            provider_id={providerId}
                        />
                    </div>
                )}
                {/*MESSAGE/PRESCRIBE/MACROS PANEL*/}
                <div
                    className={`w-[${widthArray.tabWindow}%] flex flex-col h-full flex-grow bg-cyan-100`}
                    style={{
                        boxShadow: '0px -2px 15px 0px rgba(0, 0, 0, 0.15)',
                    }}
                >
                    <TabColumn
                        providerId={providerId}
                        patient_data={intakeFetchData?.patientData!}
                        order_data={intakeFetchData?.orderData}
                        orderType={intakeFetchData?.orderType}
                        statusTag={intakeFetchData?.statusTag}
                        messageContent={messageContent}
                        setMessageContent={setMessageContent}
                        responseRequired={responseRequired}
                        setResponseRequired={setResponseRequired}
                    />
                </div>
            </div>
        </div>
    );
}
