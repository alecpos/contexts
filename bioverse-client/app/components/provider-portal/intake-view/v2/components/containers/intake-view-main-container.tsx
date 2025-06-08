'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { useEffect, useState } from 'react';
import { OrderType } from '@/app/types/orders/order-types';
import { PillStatus } from '@/app/types/provider-portal/provider-portal-types';
import StatusPill from './components/StatusPill';
import { Button, Paper, Stack, Tooltip } from '@mui/material';
import { useParams } from 'next/navigation';
import {
    determineProviderIntakeWidth,
    ProviderWidths,
} from './utils/minimizer-width-controller';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import ContactPageOutlinedIcon from '@mui/icons-material/ContactPageOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { createNewProviderActivityAudit } from '@/app/utils/database/controller/provider_activity_audit/provider_activity_audit-api';
import { INTAKE_WINDOW_WIDTHS } from '../../constants/intake-v2-constants';
import StatusDropdown from '@/app/components/provider-coordinator-shared/order-charts/components/StatusDropdown';
import useSWR from 'swr';
import { intakeViewDataFetch } from './utils/data-fetch/intake-view-datafetch';
import LoadingScreen from '@/app/components/global-components/loading-screen/loading-screen';

interface IntakeViewMainContainerProps {
    providerId: string;
}

export default function IntakeViewMainContainer({
    providerId,
}: IntakeViewMainContainerProps) {
    const params = useParams();
    const order_id = params.orderId as string;

    const {
        data: intakeFetchData,
        isLoading: fetchLoading,
        error: fetchError,
        mutate: mutateIntakeData,
    } = useSWR(`intake-view-${order_id}`, () => intakeViewDataFetch(order_id), {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        revalidateOnMount: true,
        revalidateIfStale: false,
        dedupingInterval: 5000,
        shouldRetryOnError: false,
    });

    const [widthArray, setWidthArray] = useState<ProviderWidths>({
        intake: INTAKE_WINDOW_WIDTHS.intake,
        patientInformation: INTAKE_WINDOW_WIDTHS.patientInformation,
        tabWindow: INTAKE_WINDOW_WIDTHS.tabWindow,
    });
    const [isIntakeMinimized, setIntakeMinimized] = useState<boolean>(false);
    const [isDemographicsMinimized, setDemographicsMinimized] =
        useState<boolean>(false);

    // const [orderPillStatusState, setOrderPillStatusState] = useState<any>();
    const [messageContent, setMessageContent] = useState<string>('');
    const [responseRequired, setResponseRequired] = useState<boolean>(true);

    // useEffect(() => {
    //     if (orderPillStatuses) {
    //         setOrderPillStatusState(orderPillStatuses);
    //     }
    // }, [orderPillStatuses]);

    useEffect(() => {
        setWidthArray(
            determineProviderIntakeWidth(
                isIntakeMinimized,
                isDemographicsMinimized
            )
        );
    }, [isIntakeMinimized, isDemographicsMinimized]);

    useEffect(() => {
        if (
            intakeFetchData &&
            intakeFetchData.statusTag &&
            intakeFetchData.statusTag === 'ProviderMessage'
        ) {
            setDemographicsMinimized(true);
            setIntakeMinimized(true);
        }
    }, [intakeFetchData]);

    useEffect(() => {
        const handleProviderAudit = async () => {
            const time = new Date().getTime(); // Record start time

            const new_audit: ProviderActivityAuditCreateObject = {
                provider_id: (await readUserSession()).data.session?.user.id!,
                action: 'view_intake',
                timestamp: time,
                // metadata: {},
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
    }, [intakeFetchData?.orderType, intakeFetchData?.orderData]);

    if (fetchLoading || !intakeFetchData) {
        return <LoadingScreen />;
    }

    return (
        <div id='main_container' className='flex flex-col px-8 pt-8 pb-6 gap-0'>
            <div className='flex mb-[32px]'>
                <div className='w-[66%] flex flex-row items-center gap-3'>
                    <div className='flex flex-grow-1'>
                        <Tooltip title='Open Patient Chart'>
                            <Button
                                variant='outlined'
                                style={{
                                    borderColor: 'black',
                                    color: 'black',
                                    height: '40px',
                                    whiteSpace: 'nowrap', // Prevent line breaks
                                }}
                                onClick={() => {
                                    const url = `/provider/all-patients/${
                                        intakeFetchData?.patientData!.id
                                    }`;
                                    window.open(url, '_blank');
                                }}
                            >
                                <div className='flex flex-row items-center justify-center gap-2'>
                                    <svg
                                        xmlns='http://www.w3.org/2000/svg'
                                        width='20'
                                        height='20'
                                        viewBox='0 0 20 20'
                                        fill='none'
                                    >
                                        <path
                                            d='M14 12.8173C13.2628 12.8173 12.6362 12.5592 12.1202 12.0433C11.6042 11.5273 11.3462 10.9007 11.3462 10.1635C11.3462 9.42633 11.6042 8.79975 12.1202 8.28375C12.6362 7.76775 13.2628 7.50975 14 7.50975C14.7372 7.50975 15.3638 7.76775 15.8798 8.28375C16.3958 8.79975 16.6538 9.42633 16.6538 10.1635C16.6538 10.9007 16.3958 11.5273 15.8798 12.0433C15.3638 12.5592 14.7372 12.8173 14 12.8173ZM14 11.3173C14.3218 11.3173 14.5946 11.2054 14.8182 10.9817C15.0419 10.7581 15.1538 10.4853 15.1538 10.1635C15.1538 9.84167 15.0419 9.56892 14.8182 9.34525C14.5946 9.12142 14.3218 9.0095 14 9.0095C13.6782 9.0095 13.4054 9.12142 13.1818 9.34525C12.9581 9.56892 12.8462 9.84167 12.8462 10.1635C12.8462 10.4853 12.9581 10.7581 13.1818 10.9817C13.4054 11.2054 13.6782 11.3173 14 11.3173ZM8.34625 19.2693V16.7153C8.34625 16.4257 8.41525 16.1535 8.55325 15.8985C8.69125 15.6435 8.88442 15.4402 9.13275 15.2885C9.63092 14.9913 10.1563 14.745 10.709 14.5495C11.2617 14.354 11.826 14.2093 12.402 14.1155L14 16.125L15.5885 14.1155C16.1677 14.2093 16.7312 14.354 17.279 14.5495C17.8267 14.745 18.351 14.9913 18.852 15.2885C19.1007 15.4397 19.2948 15.6423 19.4345 15.8962C19.5743 16.1501 19.6474 16.4199 19.6538 16.7057V19.2693H8.34625ZM9.82125 17.7693H13.3865L11.8348 15.7923C11.4814 15.8818 11.1379 15.998 10.8042 16.141C10.4706 16.2842 10.1429 16.4436 9.82125 16.6193V17.7693ZM14.6135 17.7693H18.1538V16.6193C17.8423 16.4333 17.5197 16.273 17.186 16.1385C16.8525 16.0038 16.5091 15.8917 16.1557 15.802L14.6135 17.7693ZM2.31225 17.5C1.81058 17.5 1.38308 17.323 1.02975 16.969C0.676583 16.615 0.5 16.1894 0.5 15.6923V2.30775C0.5 1.81058 0.677 1.385 1.031 1.031C1.385 0.677 1.81058 0.5 2.30775 0.5H15.6923C16.1894 0.5 16.615 0.677 16.969 1.031C17.323 1.385 17.5 1.81058 17.5 2.30775V6.65375C17.291 6.41658 17.0683 6.1945 16.8318 5.9875C16.5953 5.7805 16.318 5.63658 16 5.55575V2.30775C16 2.21792 15.9712 2.14417 15.9135 2.0865C15.8558 2.02883 15.7821 2 15.6923 2H2.30775C2.21792 2 2.14417 2.02883 2.0865 2.0865C2.02883 2.14417 2 2.21792 2 2.30775V15.6923C2 15.7821 2.02883 15.8558 2.0865 15.9135C2.14417 15.9712 2.21792 16 2.30775 16H6.05375C6.02308 16.1192 6 16.2384 5.9845 16.3577C5.96917 16.4769 5.9615 16.5961 5.9615 16.7153V17.5H2.31225ZM4.25 5.86525H11.4615C11.7987 5.62808 12.1631 5.45183 12.5548 5.3365C12.9464 5.22117 13.3448 5.15708 13.75 5.14425V4.3655H4.25V5.86525ZM4.25 9.75H9.0095C9.02233 9.48333 9.05825 9.22658 9.11725 8.97975C9.17625 8.73308 9.25317 8.48983 9.348 8.25H4.25V9.75ZM4.25 13.6345H7.373C7.55 13.491 7.73625 13.3593 7.93175 13.2395C8.12725 13.1195 8.32692 13.0127 8.53075 12.9192V12.1348H4.25V13.6345ZM2 16V2V5.5405V5.125V16Z'
                                            fill='#1C1B1F'
                                        />
                                    </svg>
                                    <BioType className='itd-h1 text-[20px] text-black'>
                                        {
                                            intakeFetchData?.patientData!
                                                .last_name
                                        }
                                        ,{' '}
                                        {
                                            intakeFetchData?.patientData!
                                                .first_name
                                        }
                                    </BioType>
                                </div>
                            </Button>
                        </Tooltip>
                    </div>

                    <div
                        id='patient_product_name_container'
                        className='flex justify-between flex-col'
                    >
                        <div className='flex flex-row items-center space-x-2 mt-4 mb-2'>
                            <BioType className='itd-body text-primary text-[1.2em] leading-[1.3em]'>
                                {/* {intakeFetchData?.dashboardTitle} */}
                            </BioType>
                        </div>
                        {intakeFetchData.currentDosage && (
                            <div>
                                <BioType className='itd-input text-black text-[1em]'>
                                    Current Dosage:{' '}
                                    {intakeFetchData.currentDosage}
                                </BioType>
                            </div>
                        )}
                    </div>
                </div>

                <div className='flex w-[38%] flex-row flex-wrap gap-2'>
                    {intakeFetchData?.orderPillStatuses && (
                        <div className='flex flex-wrap gap-y-1 gap-x-2'>
                            {intakeFetchData.orderPillStatuses.map(
                                (pillStatus: PillStatus, index: number) => {
                                    return (
                                        <StatusPill
                                            status={pillStatus}
                                            key={index}
                                        />
                                    );
                                }
                            )}
                            {Object.entries(intakeFetchData.glp1Statuses).map(
                                ([key, value]) => {
                                    if (value) {
                                        return (
                                            <StatusPill
                                                status={key as PillStatus}
                                                key={key}
                                            />
                                        );
                                    }
                                    return null;
                                }
                            )}

                            {/* To Do: Make sure this only says autoshipped if the last shipped order was autoshipped */}
                            {intakeFetchData?.orderData?.autoshipped && (
                                <StatusPill status={PillStatus.Autoshipped} />
                            )}
                            <StatusDropdown
                                patient_id={intakeFetchData?.patientData!.id}
                                order_id={order_id}
                                orderType={intakeFetchData?.orderType}
                                order_data={intakeFetchData?.orderData}
                                employee_type={'provider'}
                            />
                        </div>
                    )}
                </div>
            </div>

            <div
                id='intake_content_column_container'
                className='flex flex-row gap-10'
            >
                <div
                    style={{
                        width: '7%',
                    }}
                    className={`${
                        isIntakeMinimized || isDemographicsMinimized
                            ? ''
                            : 'hidden'
                    } flex flex-col gap-4`}
                >
                    {isIntakeMinimized && (
                        <Paper
                            className={`flex flex-col px-4 py-6 w-full gap-2 h-auto`}
                        >
                            <div
                                id='title_area'
                                className='flex justify-around'
                            >
                                <ArticleOutlinedIcon className=' text-primary ' />
                                <div className='border-2 border-solid border-primary rounded h-8 w-8 flex justify-center items-center hover:cursor-pointer'>
                                    <UnfoldMoreIcon
                                        className='text-primary ransform rotate-45 p-0'
                                        onClick={() => {
                                            setIntakeMinimized(false);
                                        }}
                                    />
                                </div>
                            </div>
                        </Paper>
                    )}
                    {isDemographicsMinimized && (
                        <div>
                            <Paper
                                className={`flex flex-col px-4 py-6 w-full gap-2 h-auto`}
                            >
                                <div
                                    id='title_area'
                                    className='flex justify-around'
                                >
                                    <ContactPageOutlinedIcon className=' text-primary ' />
                                    <div className='border-2 border-solid border-primary rounded h-8 w-8 flex justify-center items-center hover:cursor-pointer'>
                                        <UnfoldMoreIcon
                                            className='text-primary ransform rotate-45 p-0'
                                            onClick={() => {
                                                setDemographicsMinimized(false);
                                            }}
                                        />
                                    </div>
                                </div>
                            </Paper>
                        </div>
                    )}
                </div>
                {!isIntakeMinimized && (
                    <div style={{ width: `${widthArray.intake}%` }}>
                        {/* <ResponseColumn
                            isMinimized={isIntakeMinimized}
                            setIsMinimized={setIntakeMinimized}
                            order_data={intakeFetchData?.orderData}
                            patient_data={intakeFetchData?.patientData!}
                            intakeResponses={intakeFetchData?.intakeResponses}
                            orderType={intakeFetchData?.orderType!}
                            statusTag={intakeFetchData?.statusTag}
                            mutateIntakeData={mutateIntakeData}
                            setMessageContent={setMessageContent}
                            setClinicalNoteTextInputValue={
                                setClinicalNoteTextInputValue
                            }
                            responseRequired={responseRequired}
                            setResponseRequired={setResponseRequired}
                            activeProviderId={providerId}
                        /> */}
                    </div>
                )}
                {!isDemographicsMinimized && (
                    <div style={{ width: `${widthArray.patientInformation}%` }}>
                        {/* <PatientInformationColumn
                            patient_data={intakeFetchData?.patientData!}
                            order_data={intakeFetchData?.orderData}
                            clinicalNoteTextInputValue={
                                clinicalNoteTextInputValue
                            }
                            setClinicalNoteTextInputValue={
                                setClinicalNoteTextInputValue
                            }
                            setTabSelected={setTabSelected}
                            setMacroDestination={setMacroDestination}
                            isPatientInformationMinimized={
                                isDemographicsMinimized
                            }
                            setPatientInformationMinimized={
                                setDemographicsMinimized
                            }
                        /> */}
                    </div>
                )}
                <div style={{ width: `${widthArray.tabWindow}%` }}>
                    {/* <TabColumn
                        providerId={providerId}
                        patient_data={intakeFetchData?.patientData!}
                        order_data={intakeFetchData?.orderData}
                        orderType={intakeFetchData?.orderType!}
                        tabSelected={tabSelected}
                        setTabSelected={setTabSelected}
                        clinicalNoteTextInputValue={clinicalNoteTextInputValue}
                        setClinicalNoteTextInputValue={
                            setClinicalNoteTextInputValue
                        }
                        macroDestination={macroDestination}
                        setMacroDestination={setMacroDestination}
                        statusTag={intakeFetchData?.statusTag}
                        setIntakeMinimized={setIntakeMinimized}
                        setDemographicsMinimized={setDemographicsMinimized}
                        messageContent={messageContent}
                        setMessageContent={setMessageContent}
                        responseRequired={responseRequired}
                        setResponseRequired={setResponseRequired}
                    /> */}
                </div>
            </div>
        </div>
    );
}
