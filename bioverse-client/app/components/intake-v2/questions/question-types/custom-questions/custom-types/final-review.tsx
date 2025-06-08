import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import ContinueButton from '@/app/components/intake-v2/buttons/ContinueButton';
import {
    QUESTION_HEADER_TAILWIND,
    INTAKE_PAGE_SUBTITLE_TAILWIND,
    INTAKE_INPUT_TAILWIND,
    INTAKE_PAGE_BODY_TAILWIND,
} from '@/app/components/intake-v2/styles/intake-tailwind-declarations';
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
        isTransitionScreen: boolean,
    ) => void;
    answered: boolean;
}

export default function FinalReviewComponentCustomQuestion({
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
            updatedFormInformation[1] = value;
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
        <div className="flex flex-col items-center h-full w-full gap-[2.5vw]">
            <div className="flex flex-col gap-[16px] rounded-md border">
                <BioType className={`${QUESTION_HEADER_TAILWIND}`}>
                    Before we review your treatment request, is there anything
                    else you want your prescriber to know about your health?
                </BioType>

                <FormControl variant="outlined" fullWidth>
                    <OutlinedInput
                        className={`${INTAKE_INPUT_TAILWIND}`}
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
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={
                                otherTextFieldValue ===
                                'No, I’ve already provided all relevant information and have no questions. Thank you!'
                            }
                            onChange={(e) => {
                                if (e.target.checked) {
                                    handleLogicInputResponseChange(
                                        'No, I’ve already provided all relevant information and have no questions. Thank you!',
                                    );
                                } else {
                                    handleLogicInputResponseChange('');
                                }
                            }}
                            name="noFurtherInfo"
                            color="primary"
                        />
                    }
                    label={
                        <BioType
                            className={`text-[18px] ${INTAKE_PAGE_BODY_TAILWIND}`}
                        >
                            No, I’ve already provided all relevant information
                            and have no questions. Thank you!
                        </BioType>
                    }
                />
            </div>
            {answered && (
                <div className="md:mt-4 relative w-full">
                    <div className='flex flex-row relative w-full'>
                    <ContinueButton
                        onClick={handleContinueButton}
                        buttonLoading={isButtonLoading}
                    />
                    </div>
                </div>
            )}
        </div>
    );
}
