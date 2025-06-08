import React, { SetStateAction, useEffect, useState } from 'react';
import { FormGroup, OutlinedInput } from '@mui/material';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import CheckboxDisplayStep from './checkbox-logic/checkbox-display';
import CheckboxInputStep from './checkbox-logic/checkbox-input';
import CheckboxCustom from './checkbox-logic/checkbox-custom';
import MultiSelectQuestion from './multi-select';
import MultiSelectItem from './multi-select/multi-select-item';
import ContinueButton from '../../buttons/ContinueButton';
import { getCurrentUserSexAtBirth } from '@/app/utils/database/controller/profiles/profiles';
import useSWR from 'swr';
import {
    INTAKE_PAGE_SUBTITLE_TAILWIND,
    QUESTION_HEADER_TAILWIND,
} from '../../styles/intake-tailwind-declarations';
import CustomStyledMultiSelectItem from './multi-select/custom-styled-multiselect-item';

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

export default function CheckboxQuestion({
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
    const [showLogic, setShowLogic] = useState<boolean>(false);

    const { data, error, isLoading } = useSWR('user-sex', () =>
        getCurrentUserSexAtBirth()
    );

    // const url = useParams();
    // const searchParams = useSearchParams();
    // const search = searchParams.toString();
    // const fullPath = usePathname();
    // const { product_href } = getIntakeURLParams(url, searchParams);
    // const current_question = url.question_id;

    // const next_index_question_index = question_array
    //     ? question_array.findIndex((q) => q.question_id == current_question) + 1
    //     : 0;

    // //TODO REMOVE and FIX Reproductive question
    // useEffect(() => {
    //     if (data?.sex_at_birth === 'Male' && url.question_id === '23') {
    //         console.log('pushing');
    //         router.push(
    //             `/intake/prescriptions/${product_href}/questions/${question_array[next_index_question_index].question_id}?${search}`
    //         );
    //     }
    // }, [data]);

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
        if (question.logic) {
            setShowLogic(
                formInformation.some(
                    (item) =>
                        item !== 'None of the above' &&
                        item !== 'Other' &&
                        !item.startsWith('customer-input:')
                )
            );
        }
    }, [formInformation, question.logic, setCheckedBoxes, setAnswered]);

    const handleCheckboxChange = (value: string) => {
        // Single choice logic
        if (question.singleChoice) {
            // If 'None of the above' is selected in single-choice mode
            if (
                value === 'None of the above' ||
                value === "No I've experienced none of these" ||
                value === question.altNoneBoxText
            ) {
                setCheckedBoxes(['None of the above']);
                updateFormAndResponse(['None of the above']);
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
                value === question.altNoneBoxText
            ) {
                const updatedCheckedBoxes = ['None of the above'];
                setCheckedBoxes(updatedCheckedBoxes);
                setOtherChecked(false);
                updateFormAndResponse(updatedCheckedBoxes);
                setShowLogic(false);
            } else {
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

                    if (value === 'Other') {
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
        return true;
    };

    console.dir(question, { depth: null });

    return (
        <div className='flex flex-col items-center justify-center gap-[2.5vw] p-0 min-w-full'>
            <div className='flex flex-col gap-[16px] rounded-md border min-w-full'>
                <BioType className={`${QUESTION_HEADER_TAILWIND}`}>
                    {question.question}
                </BioType>
                <BioType className={`${INTAKE_PAGE_SUBTITLE_TAILWIND}`}>
                    {(!question.is_unique_subtitle ||
                        question.is_unique_subtitle === false) &&
                        (question.subtitle
                            ? question.subtitle
                            : question.singleChoice
                            ? 'Select a response.'
                            : 'Select all that apply.')}
                    {question.is_unique_subtitle && question.subtitle}
                </BioType>
                <FormGroup className='gap-4'>
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
                            <MultiSelectItem
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
                            <MultiSelectItem
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
                        <div className='flex flex-col mt-2 gap-1'>
                            <BioType className='it-subtitle md:itd-subtitle'>
                                Please tell us more
                            </BioType>
                            <OutlinedInput
                                className='body1'
                                value={otherTextFieldValue}
                                onChange={handleOtherTextFieldChange}
                                multiline
                                minRows={4}
                                placeholder='Enter your response here.'
                                inputProps={{
                                    'aria-label': `weight-${1}`,
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
                            <MultiSelectItem
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
                    <div className='mt-16 sm:mt-0'>
                        <ContinueButton
                            onClick={handleContinueButton}
                            buttonLoading={isButtonLoading}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
