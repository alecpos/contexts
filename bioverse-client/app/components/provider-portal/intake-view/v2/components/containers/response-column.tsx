'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import {
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    SelectChangeEvent,
} from '@mui/material';
import ProviderIntakeQAList from '../intake-response-column/qa-display';
import HorizontalDivider from '@/app/components/global-components/dividers/horizontalDivider/horizontalDivider';
import ApprovalButtons from '../intake-response-column/approval-buttons';
import { CheckupResponseReturn } from '@/app/types/questionnaires/questionnaire-types';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { IntakeButtonTypes } from '@/app/utils/functions/provider-portal/intakes/provider-intake-utils';
import { OrderType } from '@/app/types/orders/order-types';
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess';
import { KeyedMutator } from 'swr';
import { SubscriptionCadency } from '@/app/types/renewal-orders/renewal-orders-types';
import AdjustDosingButton from './components/adjust-dosing-button/AdjustDosingButton';
import React from 'react';

interface ResponseColumnProps {
    isMinimized: boolean;
    setIsMinimized: Dispatch<SetStateAction<boolean>>;
    patient_data: DBPatientData;
    order_data: DBOrderData;
    intakeResponses?: CheckupResponseReturn[];
    orderType: OrderType;
    statusTag: string | undefined;
    mutateIntakeData: KeyedMutator<any>;
    setMessageContent: Dispatch<SetStateAction<string>>;
    setCanProceed?: Dispatch<SetStateAction<boolean>>;
    setClinicalNoteTextInputValue: Dispatch<SetStateAction<string>>;
    responseRequired: boolean;
    setResponseRequired: Dispatch<SetStateAction<boolean>>;
    activeProviderId: string;
}

export default function ResponseColumn({
    isMinimized,
    setIsMinimized,
    patient_data,
    order_data,
    intakeResponses,
    orderType,
    statusTag,
    mutateIntakeData,
    setMessageContent,
    setCanProceed,
    setClinicalNoteTextInputValue,
    responseRequired,
    setResponseRequired,
    activeProviderId,
}: ResponseColumnProps) {
    const [selectedIntake, setSelectedIntake] = useState<string>(
        String(intakeResponses ? intakeResponses.length - 1 : 0),
    );

    const [showButton, setShowButton] = useState<string>(
        IntakeButtonTypes.None,
    );

    // useEffect(() => {
    //     const buttonController = showButtonController(
    //         order_data.order_status,
    //         statusTag,
    //         order_data.subscription_type as SubscriptionCadency,
    //     );

    //     setShowButton(buttonController);
    // }, [order_data.order_status, statusTag, order_data.subscription_type]);

    const handleIntakeChange = (event: SelectChangeEvent) => {
        setSelectedIntake(event.target.value as string);
    };

    function formatPostgresTimestampToDateString(timestamp: string) {
        // Parse the timestamp string into a JavaScript Date object
        const date = new Date(timestamp);

        // Check if the parsed date is valid
        if (isNaN(date.getTime())) {
            return 'No Date';
        }

        // Get the month, day, and year from the Date object
        const month = new Intl.DateTimeFormat('en-US', {
            month: 'long',
        }).format(date);
        const day = date.getDate();
        const year = date.getFullYear();

        // Format the date string in 'Month day, year' format
        const formattedDate = `${month} ${day}, ${year}`;

        return formattedDate;
    }
    return (
        <>
            {isMinimized ? (
                <></>
            ) : (
                <Paper
                    className={`flex flex-col px-4 py-3 w-full gap-2 min-h-[80vh] max-h-[82vh] overflow-hidden`}
                >
                    <div
                        id="title_area"
                        className="flex flex-row justify-between "
                    >
                        <BioType className="itd-subtitle text-primary">
                            Intake Responses
                        </BioType>

                        <div className="border-2 border-solid border-primary rounded h-8 w-8 flex justify-center items-center hover:cursor-pointer">
                            <UnfoldLessIcon
                                className="text-primary transform rotate-45"
                                onClick={() => {
                                    setIsMinimized(true);
                                }}
                            />
                        </div>
                    </div>

                    {intakeResponses && (
                        <div id="dropdown flex w-full justify-center">
                            <FormControl fullWidth>
                                <InputLabel>Select Intake</InputLabel>
                                <Select
                                    id="intake-select"
                                    value={selectedIntake}
                                    label="Select Intake"
                                    onChange={handleIntakeChange}
                                    sx={{  borderRadius: '12px', padding: 0 }}
                                >
                                    {intakeResponses.map(
                                        (
                                            response: CheckupResponseReturn,
                                            index: number,
                                        ) => {
                                            return (
                                                <MenuItem
                                                    key={index}
                                                    value={index}
                                                    className="flex space-x-2"
                                                >
                                                    {response.product_name},
                                                    <span className="text-[#00000099] ml-1">
                                                        {formatPostgresTimestampToDateString(
                                                            response.submission_time,
                                                        )}
                                                    </span>
                                                </MenuItem>
                                            );
                                        },
                                    )}
                                </Select>
                            </FormControl>
                        </div>
                    )}

                    <div id="divider" className="flex w-full">
                        <HorizontalDivider
                            backgroundColor={'#A7A7A7'}
                            height={1}
                        />
                    </div>
                    {intakeResponses && (
                        <div
                            id="response_area"
                            className="flex flex-col max-h-[65vh] overflow-y-scroll"
                        >
                            <ProviderIntakeQAList
                                question_responses={
                                    intakeResponses[Number(selectedIntake)]
                                        .responses
                                }
                            />
                        </div>
                    )}
                    <div id="divider" className="flex w-full">
                        <HorizontalDivider
                            backgroundColor={'#A7A7A7'}
                            height={1}
                        />
                    </div>
                    <div
                        id="action_area"
                        className="flex flex-row justify-center items-center gap-2"
                    >
                        {showButton === IntakeButtonTypes.ApprovalButtons && (
                            <ApprovalButtons
                                order_id={
                                    orderType === OrderType.Order
                                        ? order_data.id
                                        : order_data.renewal_order_id
                                }
                                provider_id={order_data.assigned_provider}
                                patient_id={patient_data.id}
                                patientData={patient_data}
                                product_href={order_data.product_href}
                                orderStatus={order_data.order_status}
                                pharmacy={order_data.assigned_pharmacy}
                                orderType={orderType}
                                orderData={order_data}
                                mutateIntakeData={mutateIntakeData}
                                setMessageContent={setMessageContent}
                                setCanProceed={setCanProceed}
                                setClinicalNoteTextInputValue={
                                    setClinicalNoteTextInputValue
                                }
                                responseRequired={responseRequired}
                                setResponseRequired={setResponseRequired}
                                statusTag={statusTag}
                                activeProviderId={activeProviderId}
                            />
                        )}
                        {/* {showButton === IntakeButtonTypes.AdjustDosing && (
                            <AdjustDosingButton
                                patient_id={patient_data.id}
                                order_data={order_data}
                                mutateIntakeData={mutateIntakeData}
                                setMessageContent={setMessageContent}
                                patientData={patient_data}
                            />
                        )} */}
                    </div>
                </Paper>
            )}
        </>
    );
}
