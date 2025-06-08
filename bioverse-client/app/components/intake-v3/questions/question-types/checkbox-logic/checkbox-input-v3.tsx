'use client';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { FormControl, OutlinedInput } from '@mui/material';
import { SetStateAction, useEffect, useState } from 'react';

interface Props {
    question: any;
    setFormInformation: (value: SetStateAction<string[]>) => void;
    setResponse: (value: SetStateAction<string>) => void;
    setAnswered: (value: SetStateAction<boolean>) => void;
    formInformation: string[];
}

export default function CheckboxInputStep({
    question,
    setFormInformation,
    setResponse,
    setAnswered,
    formInformation,
}: Props) {
    const [localInputResponse, setLocalInputResponse] = useState<string>();

    useEffect(() => {
        // Find and set the initial value for 'customer-input'
        const customerInputEntry = formInformation.find((info) =>
            info.startsWith('customer-input:'),
        );
        if (customerInputEntry) {
            setLocalInputResponse(
                customerInputEntry.replace('customer-input: ', ''),
            );
        }
    }, [formInformation]);

    const handleInputChange = (input: string) => {
        setLocalInputResponse(input);
        const responseText = `customer-input: ${input}`;

        // Update the response text
        setResponse((prevResponse) => {
            if (prevResponse.includes('customer-input')) {
                return prevResponse.replace(/customer-input: .*/, responseText);
            }
            return prevResponse
                ? `${prevResponse}, ${responseText}`
                : responseText;
        });

        // Update formInformation
        const index = formInformation.findIndex((info) =>
            info.startsWith('customer-input:'),
        );
        let updatedFormInformation = [...formInformation];
        if (index >= 0) {
            // Update existing 'customer-input' entry
            updatedFormInformation[index] = responseText;
        } else {
            // Add new 'customer-input' entry
            updatedFormInformation.push(responseText);
        }
        setFormInformation(updatedFormInformation);

        // Set answered state
        if (input.length > 0) {
            setAnswered(true);
        } else {
            setAnswered(false);
        }
    };
    console.log('CheckboxDisplayStep', question);

    return (
        <>
            <div
                id="checkbox-input"
                className="flex mt-8 min-w-[30vw] justify-center items-center flex-col gap-[12px]"
            >
                <BioType className="label1 self-start">
                    {question.logicDetails.question}
                </BioType>
                <div className="flex min-w-[30vw] w-full justify-center items-center flex-row gap-[12px]">
                    <FormControl variant="outlined" fullWidth>
                        <OutlinedInput
                            value={localInputResponse}
                            onChange={(e) => handleInputChange(e.target.value)}
                            placeholder="Enter your response here."
                        />
                    </FormControl>
                </div>
            </div>
        </>
    );
}
