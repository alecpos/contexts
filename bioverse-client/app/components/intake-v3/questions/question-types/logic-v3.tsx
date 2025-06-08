import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import ContinueButtonV3 from '../../buttons/ContinueButtonV3';

import {
    QUESTION_HEADER_TAILWIND,
    INTAKE_PAGE_SUBTITLE_TAILWIND,
    INTAKE_INPUT_TAILWIND,
    QUESTION_SUBTITLE_TAILWIND,
} from '@/app/components/intake-v3/styles/intake-tailwind-declarations';
import CheckIcon from '@mui/icons-material/Check';

import {
    SelectChangeEvent,
    FormControl,
    Select,
    OutlinedInput,
    MenuItem,
    Button,
} from '@mui/material';
import { SetStateAction, useEffect, useState } from 'react';

interface Props {
    // arrowBack: JSX.Element;
    // continueButton: () => React.ReactElement;
    question: any;
    response: string;
    MenuProps: {
        PaperProps: {
            style: {
                maxHeight: number;
                width: number;
            };
        };
    };
    // customer_id: string;
    formInformation: string[];
    shouldLogicShowStepTwo: boolean;
    otherTextFieldValue: string;
    answered: boolean;
    setFormInformation: (value: SetStateAction<string[]>) => void;
    setOtherTextFieldValue: (value: SetStateAction<string>) => void;
    setResponse: (value: SetStateAction<string>) => void;
    setAnswered: (value: SetStateAction<boolean>) => void;
    setShouldLogicShowStepTwo: (value: SetStateAction<boolean>) => void;
    // questionId
    handleContinueToNextQuestion: (
        answer: Answer,
        isTransitionScreen: boolean,
    ) => void;
    isCheckup: boolean;
}

export default function LogicQuestion({
    // arrowBack,
    question,
    response,
    MenuProps,
    formInformation,
    shouldLogicShowStepTwo,
    otherTextFieldValue,
    answered,
    // customer_id,
    setFormInformation,
    setOtherTextFieldValue,
    setResponse,
    setAnswered,
    setShouldLogicShowStepTwo,
    // questionId,
    handleContinueToNextQuestion,
    isCheckup,
}: Props) {
    const preselectedLogicOption = formInformation[0] || null;
    const preselectedLogicOptionQuestionTwo = formInformation[1] || null;

    const [isButtonLoading, setIsButtonLoading] = useState<boolean>(false);

    useEffect(() => {
        if (
            formInformation.length > 0 &&
            formInformation[0] !== question.steps[0].nextStepReq
        ) {
            setAnswered(true);
        } else {
            if (question.steps[1].type === 'mcq') {
                setAnswered(formInformation.length > 1);
            }
        }
    }, [formInformation]);

    const isWhitespaceString = (str: string) => !str.trim();

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
            return updatedFormInformation;
        });

        setOtherTextFieldValue(value);

        // if (shouldLogicShowStepTwo) {
        //     setAnswered(true);
        // }

        // Update shouldLogicShowStepTwo based on the condition
        setShouldLogicShowStepTwo(
            formInformation[0] === question.steps[0].nextStepReq,
        );
    };

    // When answer is updated, check if their first answer should warrant showing the next step
    // Otherwise, set answered to true
    useEffect(() => {
        const shouldLogicShowNext =
            formInformation[0] === question.steps[0].nextStepReq;
        setShouldLogicShowStepTwo(shouldLogicShowNext);
    }, [formInformation]);

    // Upon rendering logic step 2, prefill it
    useEffect(() => {
        if (preselectedLogicOptionQuestionTwo) {
            setFormInformation((prev) => {
                const updatedFormInformation = [...prev];
                updatedFormInformation[1] = preselectedLogicOptionQuestionTwo;
                return updatedFormInformation;
            });
            setOtherTextFieldValue(preselectedLogicOptionQuestionTwo);

            // if (formInformation)
            // setAnswered(true);
        }
    }, [shouldLogicShowStepTwo]);
    // If other text field is populated and logic step 2 is showing, set answered to true
    useEffect(() => {
        if (question.steps[1].type === 'input') {
            if (
                shouldLogicShowStepTwo &&
                !isWhitespaceString(otherTextFieldValue)
            ) {
                setAnswered(true);
            } else if (
                shouldLogicShowStepTwo &&
                isWhitespaceString(otherTextFieldValue)
            ) {
                setAnswered(false);
            }
        }
    }, [otherTextFieldValue, preselectedLogicOption]);

    const handleLogicQuestionContinue = () => {
        setIsButtonLoading(true);
        // setCurrentQuestion((prev) => prev + 1);
        handleContinueToNextQuestion(
            {
                question: question.steps[0].question,
                answer: response,
                formData: formInformation,
            },
            false,
        );

        // Reset shouldLogicShowStepTwo to false after continuing to the next question
        // setShouldLogicShowStepTwo(false);
    };

    const handleSelectLogicResponseChange = (
        event: SelectChangeEvent<string>,
    ) => {
        const {
            target: { value },
        } = event;
        setResponse(value);
        setFormInformation([value]);

        if (value === question.steps[0].nextStepReq) {
            setAnswered(false);
            setShouldLogicShowStepTwo(true);
            setOtherTextFieldValue('');
        } else {
            setShouldLogicShowStepTwo(false);
            setAnswered(true);
        }
    };

    return (
        <div className="flex flex-col items-center h-full w-full gap-[2.5vw] mt-[1.25rem] md:mt-[48px]">
            <div className="flex flex-col  rounded-md border">
                <BioType className={`inter-h5-question-header`}>
                    {question.steps[0].question}
                </BioType>

                {question.subtitle && (
                    <p className={`intake-subtitle text-weak mt-[1rem] md:mt-[16px]`}>
                        {question.subtitle}
                    </p>
                )}
                <div className="w-full h-full mt-[1.25rem] md:mt-[48px]">
                    {question.steps[0].type === 'select' ? (
                        <FormControl className="w-full">
                            {/* Render Select component */}
                            <Select
                                value={
                                    /Other/.test(response)
                                        ? 'Other'
                                        : formInformation[0]
                                        ? formInformation[0]
                                        : response
                                }
                                onChange={handleSelectLogicResponseChange}
                                input={<OutlinedInput />}
                                MenuProps={MenuProps}
                                inputProps={{ 'aria-label': 'Without label' }}
                                displayEmpty
                                renderValue={(value) =>
                                    value ? (
                                        <BioType className="body1">
                                            {value}
                                        </BioType>
                                    ) : (
                                        <BioType className="body2 text-gray-500">
                                            {question.placeholder}
                                        </BioType>
                                    )
                                }
                            >
                                {question.steps[0].options.map(
                                    (option: string) => (
                                        <MenuItem key={option} value={option}>
                                            <BioType className="intake-v3-question-text ">
                                                {option}
                                            </BioType>
                                        </MenuItem>
                                    ),
                                )}
                            </Select>
                        </FormControl>
                    ) : (
                        <div className="flex min-w-[30vw]  justify-center items-center flex-col ">
                            {/* Render MCQ component */}
                            {question.steps[0].options.map(
                                (option: string, index: number) => (
                                    <div key={index} className="flex w-full">
                                        <Button
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'center',
                                                alignItems: 'flex-start',
                                                
                                                paddingX: '16px',
                                                paddingY: '24px',
                                                border: '1px solid',
                                                borderRadius: '12px',
                                                cursor: 'pointer',
                                                backgroundColor:
                                                    option ===
                                                    preselectedLogicOption
                                                        ? 'rgba(40, 106, 162, 0.1)'
                                                        : 'white', // Adjusted for clarity
                                                borderColor:
                                                    option ===
                                                    preselectedLogicOption
                                                        ? 'rgba(40, 106, 162, 1)'
                                                        : '#BDBDBD',
                                                textTransform: 'none',
                                                '&:hover': {
                                                    backgroundColor: !(
                                                        option ===
                                                        preselectedLogicOption
                                                    )
                                                        ? '#286ba21f'
                                                        : undefined,
                                                },
                                                '&:active': {
                                                    backgroundColor:
                                                        option ===
                                                        preselectedLogicOption
                                                            ? 'rgba(40, 106, 162, 0.1)'
                                                            : 'white',
                                                },
                                            }}
                                            fullWidth
                                            className="intake-v3-question-button px-[1rem] md:px-[16px] mb-[1rem] md:mb-[22px]"
                                            onClick={() => {
                                                if (
                                                    option ===
                                                    preselectedLogicOption
                                                ) {
                                                    return;
                                                }

                                                const updatedOption =
                                                    option ===
                                                    preselectedLogicOption
                                                        ? null
                                                        : option;

                                                setFormInformation([
                                                    updatedOption!,
                                                ]);
                                                setResponse(
                                                    updatedOption || '',
                                                );
                                                // Update shouldLogicShowStepTwo based on the condition
                                                setShouldLogicShowStepTwo(
                                                    updatedOption ===
                                                        question.steps[0]
                                                            .nextStepReq,
                                                );
                                            }}
                                        >
                                            <div className="flex justify-between items-center w-full ">
                                                <BioType
                                                    className={`intake-v3-question-text ${
                                                        option ===
                                                        preselectedLogicOption
                                                            ? 'text-[#286BA2]'
                                                            : 'text-[#1B1B1B]'
                                                    } text-start`}
                                                >
                                                    {option}
                                                </BioType>
                                                <div className="mr-5 mt-1">
                                                    {option ===
                                                        preselectedLogicOption && (
                                                            <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="18"
                                                            height="19"
                                                            viewBox="0 0 18 19"
                                                            fill="none"
                                                        >
                                                            <rect
                                                                y="0.471436"
                                                                width="18"
                                                                height="18"
                                                                rx="4.5"
                                                                fill="#8CCEEA"
                                                            />
                                                            <path
                                                                d="M15 4.97144L6.75 13.2214L3 9.47144"
                                                                stroke="white"
                                                                stroke-width="1.125"
                                                                stroke-linecap="round"
                                                                stroke-linejoin="round"
                                                            />
                                                        </svg>
                                                    )}
                                                </div>
                                                
                                            </div>
                                        </Button>
                                    </div>
                                ),
                            )}
                        </div>
                    )}
                </div>
                {shouldLogicShowStepTwo && (
                    <>
                        <p className={`intake-subtitle mt-[1rem] md:mt-[32px] text-weak mb-1`}>
                            {question.steps[1].question
                                ? question.steps[1].question
                                : 'Please tell us more.'}
                        </p>

                        <div className="w-full">
                            {question.steps[1].type === 'input' ? (
                                <>
                                    <div className="flex min-w-[30vw] justify-center items-center flex-row gap-[12px]">
                                        <FormControl
                                            variant="outlined"
                                            fullWidth
                                        >
                                            <OutlinedInput
                                                className={`intake-subtitle`}
                                                value={otherTextFieldValue}
                                                id={`outlined-adornment-weight-${1}`}
                                                onChange={(e) =>
                                                    handleLogicInputResponseChange(
                                                        e.target.value,
                                                    )
                                                }
                                                aria-describedby={`outlined-weight-helper-text-${1}`}
                                                placeholder={
                                                    question.steps[1]
                                                        .placeholder
                                                        ? question.steps[1]
                                                              .placeholder
                                                        : ''
                                                }
                                                inputProps={{
                                                    'aria-label': `weight-${1}`,
                                                }}
                                                multiline
                                                minRows={4}
                                            />
                                        </FormControl>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="flex min-w-[30vw] justify-center items-center flex-col gap-[12px]">
                                        {/* Render MCQ component */}
                                        {question.steps[1].options.map(
                                            (option: string, index: number) => (
                                                <div
                                                    key={index}
                                                    className="flex w-full"
                                                >
                                                    <Button
                                                        fullWidth
                                                        sx={{
                                                            display: 'flex',
                                                            flexDirection:
                                                                'column',
                                                            justifyContent:
                                                                'center',
                                                            height: {
                                                                xs: '16.1vw',
                                                                sm: '84px',
                                                            },
                                                            border: '1px solid',
                                                            borderRadius:
                                                                '0.25rem',
                                                            cursor: 'pointer',
                                                            backgroundColor:
                                                                option ===
                                                                preselectedLogicOptionQuestionTwo
                                                                    ? 'rgba(40, 106, 162, 0.1)'
                                                                    : 'transparent', // Adjusted for clarity
                                                            borderColor:
                                                                option ===
                                                                preselectedLogicOptionQuestionTwo
                                                                    ? 'rgba(40, 106, 162, 1)'
                                                                    : '#BDBDBD',
                                                            textTransform:
                                                                'none',
                                                            '&:hover': {
                                                                backgroundColor:
                                                                    !(
                                                                        option ===
                                                                        preselectedLogicOptionQuestionTwo
                                                                    )
                                                                        ? '#286ba21f'
                                                                        : undefined,
                                                            },
                                                            '&:active': {
                                                                backgroundColor:
                                                                    option ===
                                                                    preselectedLogicOptionQuestionTwo
                                                                        ? 'rgba(40, 106, 162, 0.1)'
                                                                        : 'transparent',
                                                            },
                                                        }}
                                                        onClick={() => {
                                                            const isContained =
                                                                option ===
                                                                preselectedLogicOptionQuestionTwo;

                                                            if (!isContained) {
                                                                // If no buttons were selected, add the appropriate value to formInformation and response
                                                                setFormInformation(
                                                                    (
                                                                        prevFormInformation,
                                                                    ) => {
                                                                        const updatedFormInformation =
                                                                            [
                                                                                ...prevFormInformation,
                                                                            ];
                                                                        updatedFormInformation[1] =
                                                                            option;
                                                                        return updatedFormInformation;
                                                                    },
                                                                );

                                                                setResponse(
                                                                    (
                                                                        prevResponse,
                                                                    ) => {
                                                                        const updatedResponse = `${formInformation[0]}, ${option}`;
                                                                        return updatedResponse;
                                                                    },
                                                                );
                                                            } else {
                                                                // If the same button was contained, ignore the user click
                                                                return;
                                                            }

                                                            // Update shouldLogicShowStepTwo based on the condition
                                                            setAnswered(true);
                                                        }}
                                                    >
                                                        <div className="flex justify-between items-center w-full">
                                                            <BioType
                                                                className={`intake-v3-question-text ${
                                                                    option ===
                                                                    preselectedLogicOptionQuestionTwo
                                                                        ? 'text-[#286BA2]'
                                                                        : 'text-[#1B1B1B]'
                                                                }`}
                                                            >
                                                                {option}
                                                            </BioType>
                                                            <div className="mr-5 mt-1">
                                                                {option ===
                                                                    preselectedLogicOptionQuestionTwo && (
                                                                    <CheckIcon
                                                                        fontSize="small"
                                                                        sx={{
                                                                            color: 'rgba(40, 106, 162, 1)',
                                                                        }}
                                                                    />
                                                                    
                                                                )}
                                                            </div>
                                                            
                                                        </div>
                                                    </Button>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </>
                )}
                {answered && (
                    <div className="md:mt-[48px]">
                        <ContinueButtonV3
                            onClick={handleLogicQuestionContinue}
                            buttonLoading={isButtonLoading}
                        />
                    </div>
                )}
            </div>

            {/**testStuff only for dev */}
            {/*testStuff*/}
        </div>
    );
}
