'use client';

import { useState } from 'react';
import { TaskViewQuestionData } from '@/app/types/questionnaires/questionnaire-types';
import {
    FormControl,
    MenuItem,
    Select,
    SelectChangeEvent,
} from '@mui/material';
import ProviderIntakeQAList from '@/app/components/provider-portal/intake-view/v2/components/intake-response-column/qa-display';

interface DemographicsContentProps {
    intakeResponses: TaskViewQuestionData[];
}

export default function IntakeResponsesContent({
    intakeResponses,
}: DemographicsContentProps) {
    console.log(intakeResponses);

    const [selectedIntake, setSelectedIntake] = useState<string>(String(0));

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

    // if (intakeResponses === undefined) {
    //     return <p>No intake responses defined.</p>
    // }
    // console.log('Intake Responses:', intakeResponses);
    // console.log(
    //     'current to map: ',
    //     intakeResponses[Number(selectedIntake)].responses
    // );

    return (
        <div className='flex flex-col inter-basic'>
            {/*DROPDOWN*/}
            <div id='dropdown flex w-full justify-center '>
                {/*DROPDOWN SELECT*/}
                {/*<div className=''>*/}
                <FormControl
                    fullWidth
                    sx={{ marginBottom: '12px', border: 'none' }}
                    className='bg-[#E5EDF4] h-[100px] flex flex-col justify-center'
                >
                    <p className='text-[14px] pl-[9px]'>Select Intake</p>
                    <Select
                        id='intake-select'
                        value={selectedIntake}
                        onChange={handleIntakeChange}
                        className=' text-black mx-[8px]'
                        sx={{
                            borderRadius: '12px',
                            padding: '10px',
                            '& .MuiOutlinedInput-input': {
                                borderRadius: '12px',
                                padding: '0px',
                            },
                            '& .MuiSelect-select': {
                                borderRadius: '12px',
                            },
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '12px',
                                padding: '10px',
                            },
                        }}
                    >
                        {intakeResponses.map(
                            (response: TaskViewQuestionData, index: number) => {
                                return (
                                    <MenuItem
                                        key={index}
                                        value={index}
                                        className='flex space-x-2 inter-basic text-[14px] rounded-lg border-none '
                                        sx={{ paddingX: '10px' }}
                                    >
                                        <span className='inter-basic text-[16px]'>
                                            {' '}
                                            {response.product_name}
                                        </span>
                                        ,
                                        <span className='ml-1 inter-basic text-[16px]'>
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
                {/*</div>*/}
            </div>
            {/*INTAKE RESPONSES*/}
            <div className='pl-[9px]'>
                <ProviderIntakeQAList
                    question_responses={
                        intakeResponses[Number(selectedIntake)].responses
                    }
                />
            </div>
        </div>
    );
}
