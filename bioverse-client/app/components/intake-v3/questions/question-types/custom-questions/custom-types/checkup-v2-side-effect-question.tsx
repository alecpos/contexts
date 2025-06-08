import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import ContinueButtonV3 from '@/app/components/intake-v3/buttons/ContinueButtonV3';
import {
    Checkbox,
    FormControl,
    FormControlLabel,
    OutlinedInput,
} from '@mui/material';
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

export default function CheckupV2SideEffectQuestion({
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
        <div className='flex flex-col items-center h-full w-full mt-[1.25rem] md:mt-[48px]'>
            <div className='flex flex-col rounded-md border '>
                <p
                    className={`inter-h5-question-header mb-[20px] sm:mb-[48px]`}
                >
                    Please tell us, in as much detail as possible, about the
                    severe side effects you&apos;re having.
                </p>

                <FormControl
                    variant='outlined'
                    fullWidth
                    className=' mb-[20px] sm:mb-[48px] rounded-sm'
                >
                    <OutlinedInput
                        className={`intake-subtitle`}
                        value={otherTextFieldValue}
                        id={`outlined-adornment-weight-${1}`}
                        onChange={(e) =>
                            handleLogicInputResponseChange(e.target.value)
                        }
                        aria-describedby={`outlined-weight-helper-text-${1}`}
                        inputProps={{
                            'aria-label': `weight-${1}`,
                        }}
                        multiline
                        minRows={4}
                    />
                </FormControl>

                {answered && (
                    <div className='md:mt-4 '>
                        <ContinueButtonV3
                            onClick={handleContinueButton}
                            buttonLoading={isButtonLoading}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
