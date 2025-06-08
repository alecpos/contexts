'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import { SetStateAction, useEffect, useRef, useState } from 'react';
import MultiSelectItem from './multi-select/multi-select-item-v3';
import ContinueButton from '@/app/components/intake-v2/buttons/ContinueButton';
import {
    QUESTION_HEADER_TAILWIND,
    INTAKE_PAGE_SUBTITLE_TAILWIND,
} from '@/app/components/intake-v3/styles/intake-tailwind-declarations';

interface Props {
    handleCheckboxChange: any;
    question: any; // Define the specific type for your question
    // continueButton: () => React.ReactElement;
    checkedBoxes: any;
    // arrowBack: any;
    handleContinueButton: any;
    isButtonLoading: boolean;
}

export default function MultiSelectQuestion({
    question,
    handleCheckboxChange,
    // continueButton,
    checkedBoxes,
    // arrowBack,
    handleContinueButton,
    isButtonLoading,
}: Props) {
    return (
        <div className="flex flex-col items-center justify-center gap-[2.5vw] p-0 min-w-full">
            <div className="flex flex-col gap-[16px] rounded-md border min-w-full">
                <BioType className={`${QUESTION_HEADER_TAILWIND}`}>
                    Highlight the areas you&apos;re looking to improve or gain
                    knowledge in.
                </BioType>
                <BioType className={`${INTAKE_PAGE_SUBTITLE_TAILWIND}`}>
                    Your health journey is unique, and we want to support it in
                    the best way possible.
                </BioType>
                <BioType className={`${INTAKE_PAGE_SUBTITLE_TAILWIND}`}>
                    Select all that apply.
                </BioType>

                <FormGroup className="gap-4">
                    {question.options.map((option: string, index: number) => (
                        <MultiSelectItem
                            key={index}
                            selected={checkedBoxes.includes(option)}
                            option={option}
                            handleCheckboxChange={handleCheckboxChange}
                            showCheck={true}
                            intake
                        />
                    ))}
                </FormGroup>
            </div>

            <div className="md:mt-4">
                <ContinueButton
                    onClick={handleContinueButton}
                    buttonLoading={isButtonLoading}
                />
            </div>
        </div>
    );
}
