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
    formInformation: string[];
    handleContinueButton: any;
    isButtonLoading: boolean;
    setOtherTextFieldValue: Dispatch<SetStateAction<string>>;
    otherTextFieldValue: string;
    answered: boolean;
}

export default function WLCheckupLastQuestion({
    setFormInformation,
    setResponse,
    setAnswered,
    handleContinueButton,
    isButtonLoading,
    setOtherTextFieldValue,
    otherTextFieldValue,
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

            console.log('updatedFormInformation', updatedFormInformation);

            return updatedFormInformation;
        });

        if (value.trim()) {
            setAnswered(true);
        } else {
            setAnswered(false);
        }
    };

    return (
        <div
            className='flex flex-col w-full items-center'
            style={{ minHeight: 'calc(100dvh - 194px)' }}
        >
            <div className='flex flex-col rounded-md border w-full max-w-xl'>
                <p
                    className={`inter-h5-question-header mb-[20px] sm:mb-[48px]`}
                >
                    Tell us about any medical update(s) and anything else
                    you&apos;d like your provider to know.
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
                                "No, I've already provided all relevant information and have no questions. Thank you!"
                            }
                            onChange={(e) => {
                                if (e.target.checked) {
                                    handleLogicInputResponseChange(
                                        "No, I've already provided all relevant information and have no questions. Thank you!"
                                    );
                                } else {
                                    handleLogicInputResponseChange('');
                                }
                            }}
                            name='noFurtherInfo'
                            color='primary'
                            inputProps={{
                                className: 'intake-subtitle',
                            }}
                        />
                    }
                    label={
                        <BioType className='intake-subtitle text-black'>
                            No, I&apos;ve already provided all relevant
                            information and have no questions. Thank you!
                        </BioType>
                    }
                />
            </div>
            {answered && (
                <ContinueButtonV3
                    onClick={handleContinueButton}
                    buttonLoading={isButtonLoading}
                />
            )}
        </div>
    );
}
