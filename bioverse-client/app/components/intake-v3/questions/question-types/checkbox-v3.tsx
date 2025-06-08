import React, { SetStateAction, useEffect, useState } from 'react';
import { FormGroup, OutlinedInput } from '@mui/material';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import CheckboxDisplayStep from './checkbox-logic/checkbox-display-v3';
import CheckboxInputStep from './checkbox-logic/checkbox-input-v3';
import CheckboxCustom from './checkbox-logic/checkbox-custom-v3';
import MultiSelectQuestion from './multi-select-v3';
import MultiSelectItem from './multi-select/multi-select-item-v3';
import { getCurrentUserSexAtBirth } from '@/app/utils/database/controller/profiles/profiles';
import useSWR from 'swr';
import {
    QUESTION_HEADER_TAILWIND,
    INTAKE_PAGE_SUBTITLE_TAILWIND,
} from '@/app/components/intake-v2/styles/intake-tailwind-declarations';
import ContinueButtonV3 from '../../buttons/ContinueButtonV3';
import MultiSelectItemV3 from './multi-select/multi-select-item-v3';
import CustomStyledMultiSelectItem from '@/app/components/intake-v2/questions/question-types/multi-select/custom-styled-multiselect-item';

// Helper function to determine the initial state of showLogic
const getInitialShowLogic = (
    questionLogic: boolean,
    currentFormInformation: string[]
): boolean => {
    if (questionLogic) {
        return currentFormInformation.some(
            (item) =>
                item !== 'None of the above' &&
                item !== 'Other' &&
                item !== 'All of the above' &&
                item !== 'No, I have not experienced any of these' &&
                item !== 'No, none of these' &&
                item !== 'No, none of these apply to me' &&
                item !== 'No, none of the above' &&
                !item.startsWith('customer-input:')
        );
    }
    return false;
};

interface Props {
    // arrowBack: JSX.Element;
    // continueButton: () => React.ReactElement;
    question: any; // Define the specific type for your question
    formInformation: string[];
    setFormInformation: (value: SetStateAction<string[]>) => void;
    setResponse: (value: SetStateAction<string>) => void;
    setOtherTextFieldValue: (value: SetStateAction<string>) => void;
    setOtherChecked: (value: SetStateAction<boolean>) => void;
    setCheckedBoxes: (value: SetStateAction<string[]>) => void;
    setAnswered: (value: SetStateAction<boolean>) => void;
    checkedBoxes: string[];
    otherChecked: boolean;
    otherTextFieldValue: string;
    handleQuestionContinue: any;
    isButtonLoading: boolean;
    handleContinueButton: any;
    question_array: any[];
    isCheckup?: boolean;
}

export default function CheckboxQuestionV3({
    // arrowBack,
    question,
    // continueButton,
    setFormInformation,
    setResponse,
    setOtherTextFieldValue,
    setOtherChecked,
    setCheckedBoxes,
    setAnswered,
    checkedBoxes,
    otherChecked,
    otherTextFieldValue,
    formInformation,
    handleQuestionContinue,
    isButtonLoading,
    handleContinueButton,
    question_array,
    isCheckup = false,
}: Props) {
    const [showLogic, setShowLogic] = useState<boolean>(() =>
        getInitialShowLogic(question.logic, formInformation)
    );
    // console.log('CheckboxDisplayStep', question);

    const { data, error, isLoading } = useSWR('user-sex', () =>
        getCurrentUserSexAtBirth()
    );

    let customSubtitle = question.customSubtitle ?? undefined;

    useEffect(() => {
        if (question.logic === true && showLogic === false) {
            // Check if the only item in checkedBoxes is 'None of the above'
            if (
                checkedBoxes.length === 1 &&
                checkedBoxes[0] === 'None of the above'
            ) {
                setAnswered(true);
            } else {
                setAnswered(false);
            }
        }
    }, [showLogic, question.logic, checkedBoxes]);

    useEffect(() => {
        // Initialize state based on formInformation
        // Assuming formInformation is an array of string representing checked options
        setCheckedBoxes(formInformation);
        if (!question.logic) {
            setAnswered(formInformation.length > 0);
        }
        // Set showLogic based on the initial state and question logic
        setShowLogic(getInitialShowLogic(question.logic, formInformation));
    }, [formInformation, question.logic, setCheckedBoxes, setAnswered]);

    const handleCheckboxChange = (value: string) => {
        // Single choice logic
        if (question.singleChoice) {
            // If 'None of the above' is selected in single-choice mode
            if (
                value === 'None of the above' ||
                value === "No I've experienced none of these" ||
                value === 'No, none of the above' ||
                value === question.altNoneBoxText
            ) {
                setCheckedBoxes([value]);
                updateFormAndResponse([value]);
                setAnswered(true);
            } else {
                // If any other checkbox is selected
                setCheckedBoxes([value]);
                updateFormAndResponse([value]);
                if (value === 'Other' && question.other) {
                    setOtherChecked(true);
                    return;
                } else {
                    setOtherChecked(false);
                }
            }
            setTimeout(async () => {
                await handleQuestionContinue({
                    question: question.question,
                    answer: value,
                    formData: [value],
                });
            }, 250);
        } else {
            // Regular multiple choice logic
            if (
                value === 'None of the above' ||
                value === "No I've experienced none of these" ||
                value === question.altNoneBoxText ||
                value === 'All of the above' ||
                value === 'No, I have not experienced any of these' ||
                value === 'No, none of these' ||
                value === 'No, none of these apply to me' ||
                value === 'No, none of the above'
            ) {
                // Check if the clicked value is already checked
                const isAlreadyChecked = checkedBoxes.includes(value);

                if (isAlreadyChecked) {
                    // If it's already checked, uncheck it
                    setCheckedBoxes([]);
                    updateFormAndResponse([]);
                    setShowLogic(false);
                } else {
                    // If it's not checked, handle as before
                    let updatedCheckedBoxes;

                    if (value === 'All of the above') {
                        updatedCheckedBoxes = ['All of the above'];
                    } else if (
                        value === 'No, I have not experienced any of these' ||
                        value === 'No, none of these' ||
                        value === 'No, none of these apply to me' ||
                        value === 'No, none of the above' ||
                        value === question.altNoneBoxText
                    ) {
                        updatedCheckedBoxes = [value];
                    } else {
                        updatedCheckedBoxes = ['None of the above'];
                    }
                    setCheckedBoxes(updatedCheckedBoxes);
                    setOtherChecked(false);
                    updateFormAndResponse(updatedCheckedBoxes);
                    setShowLogic(false);
                }
            } else {
                setCheckedBoxes((prevCheckedBoxes) => {
                    const isChecked = prevCheckedBoxes.includes(value);
                    let updatedCheckedBoxes = isChecked
                        ? prevCheckedBoxes.filter((box) => box !== value)
                        : [
                              ...prevCheckedBoxes.filter(
                                  (box) =>
                                      box !== 'None of the above' &&
                                      box !== 'All of the above' &&
                                      box !==
                                          'No, I have not experienced any of these' &&
                                      box !== 'No, none of these' &&
                                      box !== 'No, none of these apply to me' &&
                                      box !== 'No, none of the above' &&
                                      box !== question.altNoneBoxText &&
                                      !box.startsWith('customer-input:')
                              ),
                              value,
                          ];

                    if (value === 'Other' && !question.dontShowOther) {
                        setOtherChecked(!isChecked);
                    }
                    updateFormAndResponse(updatedCheckedBoxes);
                    return updatedCheckedBoxes;
                });
            }
        }
    };

    const updateFormAndResponse = (updatedCheckedBoxes: string[]) => {
        setFormInformation(updatedCheckedBoxes);
        setResponse(updatedCheckedBoxes.join(', '));

        if (!question.logic) {
            setAnswered(updatedCheckedBoxes.length > 0);
        }

        // Update showLogic based on the updatedCheckedBoxes
        if (question.logic) {
            const otherBoxes = [
                'None of the above',
                'Other',
                'customer-input:',
                "No I've experienced none of these",
                'No, I have not experienced any of these',
                'No, none of these',
                'No, none of these apply to me',
            ];
            const relevantBoxesChecked = updatedCheckedBoxes.some(
                (item) =>
                    !otherBoxes.includes(item) &&
                    !item.startsWith('customer-input:')
            );
            setShowLogic(relevantBoxesChecked);
        } else {
            // If there are no checked boxes in multiple-choice mode, set showLogic to false
            setShowLogic(updatedCheckedBoxes.length > 0);
        }
        return true;
    };

    const handleOtherTextFieldChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const newValue = event.target.value;
        setOtherTextFieldValue(newValue);
        if (otherChecked) {
            setFormInformation((prev) =>
                prev.map((item) =>
                    item.startsWith('Other') ? `Other: ${newValue}` : item
                )
            );
            setResponse((prev) =>
                prev
                    .split(', ')
                    .map((item) =>
                        item.startsWith('Other') ? `Other: ${newValue}` : item
                    )
                    .join(', ')
            );
        }
    };

    const renderLogicDetails = () => {
        switch (question.logicDetails?.type) {
            case 'input':
                return (
                    <CheckboxInputStep
                        question={question}
                        setFormInformation={setFormInformation}
                        setResponse={setResponse}
                        setAnswered={setAnswered}
                        formInformation={formInformation}
                    />
                );
            case 'custom':
                return (
                    <CheckboxCustom
                        question={question}
                        setFormInformation={setFormInformation}
                        setResponse={setResponse}
                        setAnswered={setAnswered}
                        formInformation={formInformation}
                        checkedBoxes={checkedBoxes}
                        setCheckedBoxes={setCheckedBoxes}
                    />
                );
            case 'display':
                return (
                    <CheckboxDisplayStep
                        question={question}
                        setAnswered={setAnswered}
                    />
                );
            default:
                return null;
        }
    };

    if (question['display-type'] === 'bubble') {
        return (
            <MultiSelectQuestion
                question={question}
                handleCheckboxChange={handleCheckboxChange}
                // continueButton={continueButton}
                checkedBoxes={checkedBoxes}
                // arrowBack={arrowBack}
                isButtonLoading={isButtonLoading}
                handleContinueButton={handleContinueButton}
            />
        );
    }

    const determineContinueRender = () => {
        if (question.singleChoice && question.other && otherChecked) {
            return true;
        }
        if (question.singleChoice) {
            return false;
        }
        if (question.type === 'checkbox' && checkedBoxes.length === 0) {
            return false;
        }
        return true;
    };

    return (
        <div className='flex flex-col items-center justify-center gap-[2.5vw] p-0 min-w-full pb-20 md:pb-0 mt-[1.25rem] md:mt-[48px]'>
            <div className='flex flex-col rounded-md border min-w-full '>
                <div
                    className={`inter-h5-question-header mb-[1.25rem] md:mb-[48px]`}
                >
                    {question.question}

                    <div className=''>
                        {(!question.is_unique_subtitle ||
                            question.is_unique_subtitle === false) &&
                            (question.subtitle ? (
                                <div className='intake-subtitle'>
                                    {question.subtitle.trim() !== '' && (
                                        <p className='intake-subtitle mt-[16px]'>
                                            {question.subtitle}
                                        </p>
                                    )}
                                </div>
                            ) : question.singleChoice ? (
                                <p className='intake-subtitle mt-[16px]'>
                                    {customSubtitle
                                        ? customSubtitle
                                        : 'Select a response.'}
                                </p>
                            ) : (
                                <p className='intake-subtitle mt-[16px]'>
                                    {customSubtitle
                                        ? customSubtitle
                                        : 'Select all that apply.'}
                                </p>
                            ))}
                        {question.is_unique_subtitle && (
                            <p className={`intake-subtitle text-weak`}>
                                {question.subtitle}
                            </p>
                        )}
                    </div>
                </div>

                <FormGroup className='h-auto md:gap-2'>
                    {question.options.map((label: string, index: number) => {
                        if (question.customOptionStyle) {
                            return (
                                <CustomStyledMultiSelectItem
                                    key={index}
                                    option={label}
                                    selected={checkedBoxes.includes(label)}
                                    handleCheckboxChange={handleCheckboxChange}
                                    showCheck={
                                        question.singleChoice ? false : true
                                    }
                                    customOptionStyle={
                                        question.customOptionStyle
                                    }
                                />
                            );
                        }

                        return (
                            <MultiSelectItemV3
                                key={index}
                                option={label}
                                selected={checkedBoxes.includes(label)}
                                handleCheckboxChange={handleCheckboxChange}
                                showCheck={question.singleChoice ? false : true}
                                intake
                            />
                        );
                    })}
                    {question.other === true && (
                        <>
                            <MultiSelectItemV3
                                key={'other'}
                                option={'Other'}
                                selected={otherChecked}
                                showCheck={question.singleChoice ? false : true}
                                handleCheckboxChange={handleCheckboxChange}
                                intake
                                alternate_other_text={
                                    question?.alternate_other_text ?? undefined
                                }
                            />
                        </>
                    )}
                    {otherChecked && (
                        <div className='flex flex-col mt-2 gap-2'>
                            <BioType className='intake-subtitle text-weak '>
                                Please tell us more
                            </BioType>
                            <OutlinedInput
                                className='intake-subtitle mb-[1rem] md:mb-[16px] '
                                value={otherTextFieldValue}
                                onChange={handleOtherTextFieldChange}
                                multiline
                                minRows={4}
                                placeholder='Tell us more.'
                                inputProps={{
                                    'aria-label': `weight-${1}`,
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor:
                                            'rgba(102, 102, 102, 0.20)', // Set your border color here
                                    },
                                }}
                            />
                        </div>
                    )}
                    {question.noneBox === true && (
                        <>
                            {/* <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={checkedBoxes.includes(
                                            'None of the above',
                                        )}
                                        onChange={() =>
                                            handleCheckboxChange(
                                                'None of the above',
                                            )
                                        }
                                    />
                                }
                                label="None of the above"
                            /> */}
                            <MultiSelectItemV3
                                key={'None of the above'}
                                option={
                                    question.altNoneBox
                                        ? question.altNoneBoxText ??
                                          "No I've experienced none of these"
                                        : 'None of the above'
                                }
                                selected={
                                    checkedBoxes.includes(
                                        'None of the above'
                                    ) ||
                                    checkedBoxes.includes(
                                        question.altNoneBoxText
                                    ) ||
                                    checkedBoxes.includes(
                                        "No I've experienced none of these"
                                    )
                                }
                                handleCheckboxChange={handleCheckboxChange}
                                showCheck={question.singleChoice ? false : true}
                                intake
                            />
                        </>
                    )}

                    {showLogic && <>{renderLogicDetails()}</>}
                </FormGroup>
                {determineContinueRender() && (
                    <div className=' md:mt-[26px]'>
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
