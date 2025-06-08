'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import dynamic from 'next/dynamic';
import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess';
import LoadingScreen from '@/app/components/global-components/loading-screen/loading-screen';
import {
    CheckupResponseReturn,
    TaskViewQuestionData,
} from '@/app/types/questionnaires/questionnaire-types';
import React from 'react';
import ProviderReviewApprovalButtons from '@/app/components/provider-portal/provider-patient-review/provider-review-UI/patient-information/approval-buttons/review-approval-buttons';
import { KeyedMutator } from 'swr';
import { OrderType } from '@/app/types/orders/order-types';
import { BV_AUTH_TYPE } from '@/app/types/auth/authorization-types';

const DynamicDemographicsAccordionContent = dynamic(
    () => import('../patient-information-column/demographics-content'),
    {
        loading: () => <LoadingScreen />,
        ssr: false,
    }
);

const DynamicIntakeResponsesContent = dynamic(
    () => import('../patient-information-column/intake-responses-content'),
    {
        loading: () => <LoadingScreen />,
        ssr: false,
    }
);

const DynamicOrderAccordionContent = dynamic(
    () => import('../patient-information-column/orders-content'),
    {
        loading: () => <LoadingScreen />,
        ssr: false,
    }
);

const DynamicDocumentsAccordionConent = dynamic(
    () =>
        import(
            '@/app/components/provider-portal/provider-patient-review/provider-review-UI/patient-information/document-accordion/documents-accordion'
        ),
    {
        loading: () => <LoadingScreen />,
        ssr: false,
    }
);

const DynamicInternalNotesAccordionConent = dynamic(
    () =>
        import(
            '@/app/components/provider-portal/provider-patient-review/provider-review-UI/patient-information/internal-notes-accordion/internal-notes-accordion'
        ),
    {
        loading: () => <LoadingScreen />,
        ssr: false,
    }
);

interface PatientResponseColumnProps {
    patient_data: DBPatientData;
    order_data: DBOrderData;
    isPatientInformationMinimized: boolean;
    setPatientInformationMinimized: Dispatch<SetStateAction<boolean>>;
    intakeResponses: TaskViewQuestionData[];
    provider_Id: string;
    orderType: OrderType;
    mutateIntakeData: KeyedMutator<any>;
    setMessageContent: Dispatch<SetStateAction<string>>;
    setResponseRequired: Dispatch<SetStateAction<boolean>>;
    statusTag: string | undefined;
    setCanProceed?: Dispatch<SetStateAction<boolean>>;
    currentMonth: number;
    currentDosage: string;
    employeeAuthorization: BV_AUTH_TYPE | null;
    dashboardTitle: any;
}

export default function PatientInformationColumn({
    patient_data,
    order_data,
    intakeResponses,
    isPatientInformationMinimized,
    setPatientInformationMinimized,
    provider_Id,
    orderType,
    mutateIntakeData,
    setMessageContent,
    setResponseRequired,
    statusTag,
    setCanProceed,
    currentMonth,
    currentDosage,
    employeeAuthorization,
    dashboardTitle,
}: PatientResponseColumnProps) {
    const [isOpenOrders, setIsOpenOrders] = useState<boolean>(false);
    const [isOpenResponses, setIsOpenResponses] = useState<boolean>(false);
    const [isOpenDemographics, setIsOpenDemographics] = useState<boolean>(true);
    const [isOpenDocuments, setIsOpenDocuments] = useState<boolean>(false);
    const [isOpenInternalNotes, setIsOpenInternalNotes] =
        useState<boolean>(false);

    const memoizedApprovalButtons = useMemo(
        () => (
            <ProviderReviewApprovalButtons
                provider_id={provider_Id}
                patientData={patient_data}
                orderType={orderType}
                orderData={order_data}
                mutateIntakeData={mutateIntakeData}
                setMessageContent={setMessageContent}
                setResponseRequired={setResponseRequired}
                statusTag={statusTag}
                setCanProceed={setCanProceed}
                currentMonth={currentMonth}
                currentDosage={currentDosage}
                employeeAuthorization={employeeAuthorization}
                dashboardTitle={dashboardTitle}
            />
        ),
        [
            provider_Id,
            patient_data,
            orderType,
            order_data,
            mutateIntakeData,
            setMessageContent,
            setResponseRequired,
            statusTag,
            setCanProceed,
            currentMonth,
            currentDosage,
            employeeAuthorization,
            dashboardTitle,
        ]
    );

    if (isPatientInformationMinimized) {
        return <></>;
    }

    return (
        <div
            className='flex flex-col pt-0.5 pb-3 bg-white rounded flex-grow overflow-auto'
            style={{ boxShadow: '0px -2px 15px 0px rgba(0, 0, 0, 0.15)' }}
        >
            <div
                id='title_area'
                className='w-full h-[32px] flex justify-between items-center py-[10px]'
            >
                <div className='px-3 flex items-center justify-between w-full'>
                    <BioType className='provider-intake-tab-title'>
                        Demographics, Intakes & Orders
                    </BioType>
                    <div className='flex justify-center items-center hover:cursor-pointer border-[1px] border-solid border-[#D7E3EB] rounded'>
                        <UnfoldLessIcon
                            className='text-black transform rotate-45'
                            onClick={() => {
                                setPatientInformationMinimized(true);
                            }}
                        />
                    </div>
                </div>
            </div>

            {/*HORIZONTAL DIVIDER*/}
            <div className='w-full h-[1px] bg-[#1B1B1B1F] z-20' />

            {/*<div className='flex flex-col justify-between relative h-full max-h-[calc(var(--nav-page-height) - 182px)]'>*/}
            <div className='flex flex-col justify-between h-full overflow-y-auto'>
                {/*PATIENT INFO PANEL*/}
                <div className='flex flex-col w-full h-full'>
                    {/*PATIENT DEMOGRAPHICS*/}
                    <Accordion
                        defaultExpanded
                        disableGutters
                        sx={{
                            boxShadow: 'none',
                            width: '100%',
                            padding: 0,
                            position: 'sticky',
                        }}
                        onChange={() =>
                            setIsOpenDemographics(!isOpenDemographics)
                        }
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            id='panel1a-header'
                            sx={{
                                position: 'sticky',
                                overflowY: 'auto',
                            }}
                        >
                            {/*<Typography>Patient Demographics</Typography>*/}
                            <p
                                className={`provider-dropdown-title ${
                                    isOpenDemographics ? 'underline' : ''
                                }`}
                            >
                                Patient Demographics
                            </p>
                        </AccordionSummary>
                        <AccordionDetails sx={{ overflowY: 'auto' }}>
                            <DynamicDemographicsAccordionContent
                                patient_data={patient_data}
                                setMessageContent={setMessageContent}
                            />
                        </AccordionDetails>
                    </Accordion>

                    {/*INTAKE RESPONSES*/}
                    <Accordion
                        disableGutters
                        sx={{
                            boxShadow: 'none',
                            width: '100%',
                            padding: 0,
                            position: 'sticky',
                        }}
                        onChange={() => setIsOpenResponses(!isOpenResponses)}
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            id='panel1a-header'
                            sx={{
                                position: 'sticky',
                                overflowY: 'auto',
                            }}
                        >
                            <p
                                className={`provider-dropdown-title ${
                                    isOpenResponses ? 'underline' : ''
                                }`}
                            >
                                Intake Responses
                            </p>
                        </AccordionSummary>
                        <AccordionDetails sx={{ overflowY: 'auto' }}>
                            <DynamicIntakeResponsesContent
                                intakeResponses={intakeResponses}
                            />
                        </AccordionDetails>
                    </Accordion>

                    {/*PAST ORDERS*/}
                    <Accordion
                        disableGutters
                        sx={{
                            boxShadow: 'none',
                            width: '100%',
                            padding: 0,
                            position: 'sticky',
                        }}
                        onChange={() => setIsOpenOrders(!isOpenOrders)}
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            id='panel1a-header'
                            sx={{
                                position: 'sticky',
                                overflowY: 'auto',
                            }}
                            onClick={() => setIsOpenOrders(!isOpenOrders)}
                        >
                            <p
                                className={`provider-dropdown-title ${
                                    isOpenOrders ? 'underline' : ''
                                }`}
                            >
                                Past Orders
                            </p>
                        </AccordionSummary>
                        <AccordionDetails sx={{ overflowY: 'auto' }}>
                            <DynamicOrderAccordionContent
                                patient_id={patient_data.id}
                                isOpenOrders={isOpenOrders}
                            />
                        </AccordionDetails>
                    </Accordion>

                    <Accordion
                        disableGutters
                        sx={{
                            boxShadow: 'none',
                            width: '100%',
                            padding: 0,
                            position: 'sticky',
                        }}
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            id='panel1a-header'
                            sx={{
                                position: 'sticky',
                                overflowY: 'auto',
                            }}
                            onClick={() => setIsOpenDocuments(!isOpenDocuments)}
                        >
                            <p
                                className={`provider-dropdown-title ${
                                    isOpenOrders ? 'underline' : ''
                                }`}
                            >
                                Documents
                            </p>
                        </AccordionSummary>
                        <AccordionDetails sx={{ overflowY: 'auto' }}>
                            <DynamicDocumentsAccordionConent
                                patientId={patient_data.id}
                            />
                        </AccordionDetails>
                    </Accordion>

                    <Accordion
                        sx={{
                            padding: 0,
                            boxShadow: 'none',
                            position: 'sticky',
                        }}
                        onChange={() =>
                            setIsOpenInternalNotes(!isOpenInternalNotes)
                        }
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            id='panel1a-header'
                            sx={{
                                position: 'sticky',
                                overflowY: 'auto',
                            }}
                        >
                            <p
                                className={`provider-dropdown-title ${
                                    isOpenOrders ? 'underline' : ''
                                }`}
                            >
                                Internal Notes
                            </p>
                        </AccordionSummary>
                        <AccordionDetails sx={{ overflowY: 'auto' }}>
                            <DynamicInternalNotesAccordionConent
                                patientId={patient_data.id}
                            />
                        </AccordionDetails>
                    </Accordion>
                </div>
            </div>

            <div className='flex flex-col items-center justify-end flex-grow mt-4'>
                {/*APPROVE / DENY BUTTONS*/}
                <div>
                    {/**LEGITSCRIPTCODETOREMOVE */}
                    {provider_Id !== 'bb22b7f2-cd8e-4b08-85c8-04f482d52cd5' && (
                        <div className='flex flex-row gap-2'>
                            {memoizedApprovalButtons}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
