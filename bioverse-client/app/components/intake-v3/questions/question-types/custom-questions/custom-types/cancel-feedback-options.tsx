import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { Button, CircularProgress, FormGroup } from '@mui/material';
import React, { SetStateAction } from 'react';
import MultiSelectItemV3 from '../../multi-select/multi-select-item-v3';

interface Props {
    question: any; // Define the specific type for your question
    setFormInformation: (value: SetStateAction<string[]>) => void;
    setResponse: (value: SetStateAction<string>) => void;
    setCheckedBoxes: (value: SetStateAction<string[]>) => void;
    setAnswered: (value: SetStateAction<boolean>) => void;
    checkedBoxes: string[];
    isButtonLoading: boolean;
    handleContinueButton: any;
}
const CancelFeedbackOptions = ({
    question,
    setFormInformation,
    setResponse,
    setCheckedBoxes,
    setAnswered,
    checkedBoxes,
    isButtonLoading,
    handleContinueButton,
}: Props) => {
    const handleCheckboxChange = (value: string) => {
        setCheckedBoxes((prevCheckedBoxes) => {
            const isChecked = prevCheckedBoxes.includes(value);
            let updatedCheckedBoxes = isChecked
                ? prevCheckedBoxes.filter((box) => box !== value)
                : [
                      ...prevCheckedBoxes.filter(
                          (box) =>
                              box !== 'None of the above' &&
                              !box.startsWith('customer-input:')
                      ),
                      value,
                  ];

            updateFormAndResponse(updatedCheckedBoxes);
            return updatedCheckedBoxes;
        });
    };

    const updateFormAndResponse = (updatedCheckedBoxes: string[]) => {
        setFormInformation(updatedCheckedBoxes);
        setResponse(updatedCheckedBoxes.join(', '));

        if (!question.logic) {
            setAnswered(updatedCheckedBoxes.length > 0);
        }
    };

    return (
        <div className='flex flex-col items-center justify-center gap-[2.5vw] p-0 min-w-full mt-[1.25rem] md:mt-[48px]'>
            <div className='flex flex-col gap-[16px] rounded-md border min-w-full'>
                <BioType className='hquestion mb-1 leading-8'>
                    We&apos;ve canceled your prescription
                </BioType>
                <BioType className='body1'>{question.question}</BioType>
                <BioType className='body1 '>
                    {question.subtitle
                        ? question.subtitle
                        : question.singleChoice
                        ? 'Select a response.'
                        : 'Select all that apply.'}
                </BioType>
                <FormGroup className='gap-4'>
                    {question.options.map((label: string, index: number) => (
                        <MultiSelectItemV3
                            key={index}
                            option={label}
                            selected={checkedBoxes.includes(label)}
                            handleCheckboxChange={handleCheckboxChange}
                            showCheck={question.singleChoice ? false : true}
                            intake
                        />
                    ))}
                </FormGroup>
                <div className='flex justify-center md:mt-9 mb-9 md:mb-[155px]'>
                    <Button
                        variant='contained'
                        className='w-full md:w-auto'
                        sx={{
                            height: '52px',
                        }}
                        onClick={handleContinueButton}
                    >
                        {isButtonLoading ? (
                            <CircularProgress
                                sx={{ color: 'white' }}
                                size={22}
                            />
                        ) : (
                            'Continue'
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CancelFeedbackOptions;
