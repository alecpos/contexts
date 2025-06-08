import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { Button, FormGroup } from '@mui/material';
import { SetStateAction, useState } from 'react';
import CheckIcon from '@mui/icons-material/Check';
import {
    INTAKE_PAGE_SUBTITLE_TAILWIND,
    QUESTION_HEADER_TAILWIND,
} from '../../styles/intake-tailwind-declarations';
import MultiSelectItem from './multi-select/multi-select-item';

interface Props {
    // arrowBack: JSX.Element;
    // continueButton: () => React.ReactElement;
    question: any;
    setFormInformation: (value: SetStateAction<string[]>) => void;
    setResponse: (value: SetStateAction<string>) => void;
    setAnswered: (value: SetStateAction<boolean>) => void;
    preselectedOption: string | null;
    handleContinueToNextQuestion: (
        answer: Answer,
        isTransitionScreen: boolean
    ) => void;
}

export default function MultipleChoiceQuestion({
    // arrowBack,
    question,
    setFormInformation,
    setResponse,
    setAnswered,
    preselectedOption,
    handleContinueToNextQuestion,
}: Props) {
    const [selectedOption, setSelectedOption] = useState<string>('');
    const handleCheckboxChange = (option: string) => {
        const updatedOption = option;
        setSelectedOption(option);
        setFormInformation([updatedOption!]);
        setResponse(updatedOption || '');
        setAnswered(!!updatedOption);

        const constructed_answer = {
            question: question.question,
            answer: updatedOption || '',
            formData: [updatedOption!],
        };
        handleContinueToNextQuestion(constructed_answer, false);
    };
    return (
        <div className='flex flex-col items-center justify-center w-full gap-[2.5vw] p-0'>
            <div className='flex flex-col gap-[16px] rounded-md border w-full'>
                <BioType className={`${QUESTION_HEADER_TAILWIND}`}>
                    {question.question}{' '}
                </BioType>
                {/* <BioType className='body1 text-[#1b1b1bde] text-[16px] -mt-0.5 md:mt-0'> */}
                <BioType className={`${INTAKE_PAGE_SUBTITLE_TAILWIND}`}>
                    Select a response.
                </BioType>

                <FormGroup className='gap-4'>
                    {question &&
                        question.options.map(
                            (option: string, index: number) => (
                                <MultiSelectItem
                                    key={index}
                                    option={option}
                                    selected={selectedOption === option}
                                    handleCheckboxChange={handleCheckboxChange}
                                    showCheck={
                                        question.singleChoice ? false : true
                                    }
                                    intake
                                />
                            )
                        )}
                </FormGroup>
            </div>
            {/* <div className="flex flex-col w-[90%] justify-center items-center gap-[16px] rounded-md border">
                {continueButton()}
            </div> */}
        </div>
    );
}
