import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import {
    Button,
    CircularProgress,
    FormGroup,
    OutlinedInput,
} from '@mui/material';
import React, { SetStateAction } from 'react';
import MultiSelectItem from '../../multi-select/multi-select-item';

interface Props {
    question: any; // Define the specific type for your question
    setFormInformation: (value: SetStateAction<string[]>) => void;
    setResponse: (value: SetStateAction<string>) => void;
    setCheckedBoxes: (value: SetStateAction<string[]>) => void;
    setAnswered: (value: SetStateAction<boolean>) => void;
    setOtherTextFieldValue: (value: SetStateAction<string>) => void;
    setOtherChecked: (value: SetStateAction<boolean>) => void;
    checkedBoxes: string[];
    isButtonLoading: boolean;
    handleContinueButton: any;
    otherChecked: boolean;
    otherTextFieldValue: string;
}
const RefillFeedbackOptions = ({
    question,
    setFormInformation,
    setResponse,
    setCheckedBoxes,
    setAnswered,
    checkedBoxes,
    isButtonLoading,
    handleContinueButton,
    setOtherTextFieldValue,
    setOtherChecked,
    otherChecked,
    otherTextFieldValue,
}: Props) => {
    const handleCheckboxChange = (value: string) => {
        setCheckedBoxes([value]);
        updateFormAndResponse([value]);
        if (value === 'Other') {
            setOtherChecked(true);
            return;
        } else {
            setOtherChecked(false);
        }
    };

    const updateFormAndResponse = (updatedCheckedBoxes: string[]) => {
        setFormInformation(updatedCheckedBoxes);
        setResponse(updatedCheckedBoxes.join(', '));

        if (!question.logic) {
            setAnswered(updatedCheckedBoxes.length > 0);
        }
    };

    // const handleOtherTextFieldChange = (
    //     event: React.ChangeEvent<HTMLInputElement>,
    // ) => {
    //     const newValue = event.target.value;
    //     setOtherTextFieldValue(newValue);
    //     if (otherChecked) {
    //         setFormInformation((prev) =>
    //             prev.map((item) =>
    //                 item.startsWith('Other') ? `Other: ${newValue}` : item,
    //             ),
    //         );
    //         setResponse((prev) =>
    //             prev
    //                 .split(', ')
    //                 .map((item) =>
    //                     item.startsWith('Other') ? `Other: ${newValue}` : item,
    //                 )
    //                 .join(', '),
    //         );
    //     }
    // };

    return (
        <div className='flex flex-col items-center justify-center gap-[2.5vw] p-0 min-w-full'>
            <div className='flex flex-col rounded-md border min-w-full'>
                <BioType className='body1'>{question.question}</BioType>

                <FormGroup className='gap-4 my-[28px]'>
                    {question.options.map((label: string, index: number) => (
                        <MultiSelectItem
                            key={index}
                            option={label}
                            selected={checkedBoxes.includes(label)}
                            handleCheckboxChange={handleCheckboxChange}
                            showCheck={question.singleChoice ? false : true}
                            intake
                        />
                    ))}
                    {question.other === true && (
                        <>
                            <MultiSelectItem
                                key={'other'}
                                option={'Other'}
                                selected={otherChecked}
                                showCheck={question.singleChoice ? false : true}
                                handleCheckboxChange={handleCheckboxChange}
                                intake
                            />
                        </>
                    )}
                    {/* {otherChecked && (
                        <OutlinedInput
                            className="body1"
                            value={otherTextFieldValue}
                            onChange={handleOtherTextFieldChange}
                            placeholder="Please specify"
                            inputProps={{
                                'aria-label': `weight-${1}`,
                            }}
                        />
                    )} */}
                </FormGroup>
                <div className='flex justify-center items-center mx-auto w-full'>
                    <Button
                        disabled={checkedBoxes.length < 1 ? true : false}
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

export default RefillFeedbackOptions;
