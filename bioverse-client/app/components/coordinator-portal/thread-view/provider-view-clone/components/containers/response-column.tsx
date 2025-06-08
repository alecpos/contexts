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
import { OrderType } from '@/app/types/orders/order-types';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';

interface ResponseColumnProps {
    isMinimized: boolean;
    setIsMinimized: Dispatch<SetStateAction<boolean>>;
    question_responses: QuestionAnswerObject[];
    patient_data: DBPatientData;
    order_data: DBOrderData;
    intakeResponses: CheckupResponseReturn[];
    orderType: OrderType;
}

export default function ResponseColumn({
    isMinimized,
    setIsMinimized,
    question_responses,
    patient_data,
    order_data,
    intakeResponses,
    orderType,
}: ResponseColumnProps) {
    const [selectedIntake, setSelectedIntake] = useState<string>(
        String(intakeResponses.length - 1)
    );
    const [showApprovalButtons, setShowApprovalButtons] =
        useState<boolean>(false);

    useEffect(() => {
        const fetchShowApproval = async () => {
            // const show = await showProviderApprovalButtons(
            //     order_data.order_status
            // );
            // setShowApprovalButtons(show);
        };
        fetchShowApproval();
    }, [order_data.order_status]);

    const handleIntakeChange = (event: SelectChangeEvent) => {
        setSelectedIntake(event.target.value as string);
    };

    function formatPostgresTimestampToDateString(timestamp: string) {
        // Parse the timestamp string into a JavaScript Date object
        const date = new Date(timestamp);

        // Check if the parsed date is valid
        if (isNaN(date.getTime())) {
            return 'Invalid Date';
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
                <Paper
                    className={`flex flex-col px-4 py-6 w-full gap-2 h-auto`}
                >
                    <div id='title_area' className='flex justify-around'>
                        <ArticleOutlinedIcon className=' text-primary ' />

                        <div className='border-2 border-solid border-primary rounded h-8 w-8 flex justify-center items-center hover:cursor-pointer'>
                            <UnfoldMoreIcon
                                className='text-primary ransform rotate-45 p-0'
                                onClick={() => {
                                    setIsMinimized(false);
                                }}
                            />
                        </div>
                    </div>
                </Paper>
            ) : (
                <Paper
                    className={`flex flex-col px-4 py-6 w-full gap-2 min-h-[80vh] `}
                >
                    <div
                        id='title_area'
                        className='flex flex-row justify-between '
                    >
                        <BioType className='itd-subtitle text-primary'>
                            Intake Responses
                        </BioType>

                        <div className='border-2 border-solid border-primary rounded h-8 w-8 flex justify-center items-center hover:cursor-pointer'>
                            <UnfoldLessIcon
                                className='text-primary transform rotate-45'
                                onClick={() => {
                                    setIsMinimized(true);
                                }}
                            />
                        </div>
                    </div>

                    <div id='dropdown flex w-full justify-center'>
                        <FormControl fullWidth>
                            <InputLabel>Select Intake</InputLabel>
                            <Select
                                id='intake-select'
                                value={selectedIntake}
                                label='Select Intake'
                                onChange={handleIntakeChange}
                                sx={{  borderRadius: '12px', padding: 0 }}
                            >
                                {intakeResponses.map(
                                    (
                                        response: CheckupResponseReturn,
                                        index: number
                                    ) => {
                                        return (
                                            <MenuItem
                                                key={index}
                                                value={index}
                                                className='flex space-x-2'
                                            >
                                                {response.product_name},
                                                <span className='text-[#00000099] ml-1'>
                                                    {formatPostgresTimestampToDateString(
                                                        response.submission_time
                                                    )}
                                                </span>
                                            </MenuItem>
                                        );
                                    }
                                )}
                            </Select>
                        </FormControl>
                    </div>

                    <div id='divider' className='flex w-full'>
                        <HorizontalDivider
                            backgroundColor={'#A7A7A7'}
                            height={1}
                        />
                    </div>
                    <div
                        id='response_area'
                        className='flex flex-col max-h-[70vh] overflow-y-scroll'
                    >
                        <ProviderIntakeQAList
                            question_responses={
                                intakeResponses[Number(selectedIntake)]
                                    .responses
                            }
                        />
                    </div>
                    <div id='divider' className='flex w-full'>
                        <HorizontalDivider
                            backgroundColor={'#A7A7A7'}
                            height={1}
                        />
                    </div>
                    <div
                        id='action_area'
                        className='flex flex-row justify-center items-center gap-2'
                    >
                        {showApprovalButtons && (
                            <ApprovalButtons
                                order_id={
                                    orderType === OrderType.Order
                                        ? order_data.id
                                        : order_data.renewal_order_id
                                }
                                provider_id={order_data.assigned_provider}
                                patient_id={patient_data.id}
                                product_href={order_data.product_href}
                                orderStatus={order_data.order_status}
                                pharmacy={order_data.assigned_pharmacy}
                                orderType={orderType}
                                orderData={order_data}
                            />
                        )}
                    </div>
                </Paper>
            )}
        </>
    );
}
