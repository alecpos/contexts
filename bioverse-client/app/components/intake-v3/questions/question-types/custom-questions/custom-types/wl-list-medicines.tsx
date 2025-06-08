import ContinueButtonV3 from '@/app/components/intake-v3/buttons/ContinueButtonV3';
import { FormControl, OutlinedInput } from '@mui/material';
import { SetStateAction, Dispatch } from 'react';

interface FinalReviewCustomQuestionProps {
    setFormInformation: (value: SetStateAction<string[]>) => void;
    setResponse: (value: SetStateAction<string>) => void;
    setAnswered: (value: SetStateAction<boolean>) => void;
    // arrowBack: JSX.Element;
    // continueButton: () => React.ReactElement;
    formInformation: string[];
    handleContinueButton: any;
    isButtonLoading: boolean;
    setOtherTextFieldValue: Dispatch<SetStateAction<string>>;
    setOtherChecked: Dispatch<SetStateAction<boolean>>;
    setCheckedBoxes: Dispatch<SetStateAction<string[]>>;
    checkedBoxes: string[];
    otherChecked: boolean;
    otherTextFieldValue: string;
    handleQuestionContinue: (
        answer: Answer,
        isTransitionScreen: boolean
    ) => void;
    answered: boolean;
}

export default function ListMedicinesComponentCustomQuestion({
    formInformation,
    setFormInformation,
    setResponse,
    setAnswered,
    handleContinueButton,
    isButtonLoading,
    setOtherTextFieldValue,
    setOtherChecked,
    setCheckedBoxes,
    checkedBoxes,
    otherChecked,
    otherTextFieldValue,
    handleQuestionContinue,
    answered,
}: FinalReviewCustomQuestionProps) {
    const handleLogicInputResponseChange = (value: string) => {
        setFormInformation((prevFormInformation) => {
            const updatedFormInformation = [...prevFormInformation];
            updatedFormInformation[0] = value;
            // Calculate combinedResponse using updatedFormInformation
            const combinedResponse = updatedFormInformation
                .map((info, i) => `${info}`)
                .join(', ');
            // Update the response state with the combinedResponse
            setResponse(combinedResponse);
            // Return the updated form information
            setOtherTextFieldValue(value);
            return updatedFormInformation;
        });

        if (value.trim()) {
            setAnswered(true);
        } else {
            setAnswered(false);
        }
    };

    return (
        <div className='flex flex-col items-center h-full w-full  mt-[1.25rem] md:mt-[48px] pb-16 lg:pb-0 '>
            <div className='flex flex-col  rounded-md border mb-[1.25rem]  md:mb-[48px]'>
                <p
                    className={`inter-h5-question-header mb-[1.25rem] md:mb-[48px]`}
                >
                    Please list any other current medicines, vitamins, or
                    dietary supplements you take regularly that you haven’t
                    already told us about.
                </p>
                <p
                    className={`intake-subtitle text-weak mb-[0.75rem] md:mb-[12px]`}
                >
                    Include exact names of any medicines (e.g. Lipitor, Zyrtec,
                    Ibuprofen)
                </p>

                <FormControl variant='outlined' fullWidth>
                    <OutlinedInput
                        className={`intake-subtitle`}
                        value={otherTextFieldValue}
                        id={`outlined-adornment-weight-${1}`}
                        onChange={(e) =>
                            handleLogicInputResponseChange(e.target.value)
                        }
                        aria-describedby={`outlined-weight-helper-text-${1}`}
                        placeholder={
                            'Enter "no" if you have nothing else to mention'
                        }
                        inputProps={{
                            'aria-label': `weight-${1}`,
                        }}
                        multiline
                        minRows={4}
                    />
                </FormControl>
                {/* <FormControlLabel
                    control={
                        <Checkbox
                            checked={
                                otherTextFieldValue ===
                                'No, I’ve already provided all relevant information!'
                            }
                            onChange={(e) => {
                                if (e.target.checked) {
                                    handleLogicInputResponseChange(
                                        'No, I’ve already provided all relevant information!',
                                    );
                                } else {
                                    handleLogicInputResponseChange('');
                                }
                            }}
                            name="noFurtherInfo"
                            color="primary"
                            className='mt-2'
                        />
                    }
                    label={
                        <BioType
                            className={`intake-subtitle mt-2`}
                        >
                            No, I’ve already provided all relevant information!
                        </BioType>
                    }
                /> */}
            </div>
            {answered && (
                <div className='relative w-full'>
                    <ContinueButtonV3
                        onClick={handleContinueButton}
                        buttonLoading={isButtonLoading}
                    />
                </div>
            )}
        </div>
    );
}
