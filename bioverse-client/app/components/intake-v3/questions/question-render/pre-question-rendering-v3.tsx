'use client';

import { useCallback, useMemo, useState } from 'react';
// import CheckboxQuestion from '../question-types/checkbox';
// import CustomQuestion from '../question-types/custom-questions/custom';
// import InputQuestion from '../question-types/input';
// import LogicQuestion from '../question-types/logic';
// import MultipleChoiceQuestion from '../question-types/multiple-choice';
// import RadioQuesiton from '../question-types/radio';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { isTransitionScreen } from '@/app/utils/functions/isTransitionScreen';
import dynamic from 'next/dynamic';
import { updateCurrentProfileHeight } from '@/app/utils/database/controller/profiles/profiles';
import LoadingScreen from '@/app/components/global-components/loading-screen/loading-screen';

const DynamicCheckboxQuestion = dynamic(
    () => import('../question-types/checkbox-v3'),
    {
        loading: () => <LoadingScreen />,
        ssr: false,
    }
);
const DynamicCustomQuestion = dynamic(
    () => import('../question-types/custom-questions/custom-v3'),
    {
        loading: () => <LoadingScreen />,
        ssr: false,
    }
);
const DynamicInputQuestion = dynamic(
    () => import('../question-types/input-v3'),
    {
        loading: () => <LoadingScreen />,
        ssr: false,
    }
);
const DynamicLogicQuestion = dynamic(
    () => import('../question-types/logic-v3'),
    {
        loading: () => <LoadingScreen />,
        ssr: false,
    }
);
const DynamicMultipleChoiceQuestion = dynamic(
    () => import('../question-types/multiple-choice-v3'),
    {
        loading: () => <LoadingScreen />,
        ssr: false,
    }
);

const DynamicRadioQuestion = dynamic(
    () => import('../question-types/radio-v3'),
    {
        loading: () => <LoadingScreen />,
        ssr: false,
    }
);

interface Props {
    question: any;
    currentQuestionNumber: number;
    answer: Answer;
    questionId?: number;
    handleContinueToNextQuestion: (
        answer: Answer,
        isTransitionScreen: boolean
    ) => void;
    router: AppRouterInstance;
    question_array: any[];
    isCheckup: boolean;
    user_id: string;
}

const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: 48 * 4.5 + 8,
            width: 250,
        },
    },
};

export default function QuestionRenderComponentV3({
    question,
    answer,
    questionId,
    router,
    handleContinueToNextQuestion,
    question_array,
    isCheckup,
    user_id,
}: Props) {
    const [response, setResponse] = useState<string>(
        answer && answer.answer ? answer.answer : ''
    );
    const [formInformation, setFormInformation] = useState<string[]>(
        answer ? answer.formData ?? [] : []
    );
    const [answered, setAnswered] = useState<boolean>(false);
    const [metadata, setMetadata] = useState<any>();
    const [checkedBoxes, setCheckedBoxes] = useState<string[]>([]);
    const [otherChecked, setOtherChecked] = useState<boolean>(false);
    const [otherTextFieldValue, setOtherTextFieldValue] = useState<string>('');
    const [shouldLogicShowStepTwo, setShouldLogicShowStepTwo] =
        useState<boolean>(false);

    const [isButtonLoading, setIsButtonLoading] = useState<boolean>(false);
    const handleInputResponseChange = useCallback(
        (index: number, value: string) => {
            setFormInformation((prevFormInformation) => {
                const updatedFormInformation = [...prevFormInformation];
                updatedFormInformation[index] = value;

                const combinedResponse = updatedFormInformation
                    .map((info, i) => `${info} ${question.label?.[i] ?? ''}`)
                    .join(', ');

                setResponse(combinedResponse);
                return updatedFormInformation;
            });
            setAnswered(true);
        },
        [question?.label]
    );

    const handleContinueButton = () => {
        setIsButtonLoading(true);
        // For transition screens

        if (isTransitionScreen(question)) {
            handleContinueToNextQuestion(
                { question: '', answer: '', formData: [] },
                true
            );
        }

        if (formInformation.length === 0 || formInformation[0] === null) {
            return;
        }

        const constructed_answer = {
            question: question.question,
            answer: response,
            formData: formInformation,
            ...(metadata ? { metadata: metadata } : {}),
        };

        if (questionId === 3) {
            let heightFeetStr = constructed_answer.formData[0].replace(
                /[^\d.]/g,
                ''
            );
            heightFeetStr = heightFeetStr.replace(/(\..*)\./g, '$1');
            let heightFeetTrunc = parseInt(heightFeetStr, 10);

            let heightInchesStr = constructed_answer.formData[1].replace(
                /[^\d.]/g,
                ''
            );
            heightInchesStr = heightInchesStr.replace(/(\..*)\./g, '$1');
            let heightInchesTrunc = parseInt(heightInchesStr, 10);

            updateCurrentProfileHeight(
                heightFeetTrunc * 12 + heightInchesTrunc
            );
        }

        handleContinueToNextQuestion(constructed_answer, false);
    };
    switch (question?.type) {
        /**
         * @Commentor Nathan Cho
         * Select questions are deprecated now, but keeping this just in case.
         */
        // case 'select':
        //     /**
        //      * Select has the following props:
        //      * question - question text
        //      * type - select
        //      * placeholder - placeholder text
        //      * options - the options that go in the select
        //      * accessory? - pictures and text to accompany
        //      */
        //     return (
        //         <SelectQuestion
        //             // arrowBack={arrowBack}
        //             continueButton={continueButton}
        //             question={question}
        //             response={response}
        //             handleSelectResponseChange={handleSelectResponseChange}
        //             MenuProps={MenuProps}
        //         />
        //     );

        case 'mcq':
            /**
             * MCQ has the following attributes
             * type: mcq
             * question: question text
             * options: array of options selectable
             * accessory: see above
             */
            const preselectedOption = formInformation[0] || null;

            return (
                <DynamicMultipleChoiceQuestion
                    // arrowBack={arrowBack}
                    // continueButton={continueButton}
                    question={question}
                    setFormInformation={setFormInformation}
                    handleContinueToNextQuestion={handleContinueToNextQuestion}
                    setResponse={setResponse}
                    setAnswered={setAnswered}
                    preselectedOption={preselectedOption}
                />
            );

        case 'input':
            /**
             * Input has the following attributes
             * type: input
             * fieldCount : number of inputs to make
             * question: question string
             * label: array of labels that go to each input respecitve
             * accessory: see above
             */
            return (
                <DynamicInputQuestion
                    // arrowBack={arrowBack}
                    // continueButton={continueButton}
                    question={question}
                    formInformation={formInformation}
                    handleInputResponseChange={handleInputResponseChange}
                    isButtonLoading={isButtonLoading}
                    handleContinueButton={handleContinueButton}
                    isCheckup={isCheckup}
                />
            );

        case 'checkbox':
            /**
             * Checkbox has the following attributes
             * question: quesiton
             * options: options
             * other: boolean value of whether the Other, please specify is there or not.
             * accessory: see above
             */
            return (
                <DynamicCheckboxQuestion
                    // arrowBack={arrowBack}
                    // continueButton={continueButton}
                    question={question}
                    formInformation={formInformation}
                    setFormInformation={setFormInformation}
                    setResponse={setResponse}
                    setOtherTextFieldValue={setOtherTextFieldValue}
                    setOtherChecked={setOtherChecked}
                    setCheckedBoxes={setCheckedBoxes}
                    setAnswered={setAnswered}
                    checkedBoxes={checkedBoxes}
                    otherChecked={otherChecked}
                    otherTextFieldValue={otherTextFieldValue}
                    handleQuestionContinue={handleContinueToNextQuestion}
                    isButtonLoading={isButtonLoading}
                    handleContinueButton={handleContinueButton}
                    question_array={question_array}
                    isCheckup={isCheckup}
                />
            );

        case 'radio':
            return (
                <DynamicRadioQuestion
                    question={question}
                    setFormInformation={setFormInformation}
                    setResponse={setResponse}
                    setAnswered={setAnswered}
                    options={question.options}
                    formInformation={formInformation}
                    radio_options={question.radio_options}
                    // arrowBack={arrowBack}
                    // continueButton={continueButton}
                />
            );

        case 'logic':
            return (
                <>
                    <DynamicLogicQuestion
                        // arrowBack={arrowBack}
                        // continueButton={continueButton}
                        question={question}
                        response={response}
                        MenuProps={MenuProps}
                        formInformation={formInformation}
                        shouldLogicShowStepTwo={shouldLogicShowStepTwo}
                        otherTextFieldValue={otherTextFieldValue}
                        answered={answered}
                        setFormInformation={setFormInformation}
                        setOtherTextFieldValue={setOtherTextFieldValue}
                        setResponse={setResponse}
                        setAnswered={setAnswered}
                        setShouldLogicShowStepTwo={setShouldLogicShowStepTwo}
                        // questionId={questionId}
                        // customer_id={user_id}
                        handleContinueToNextQuestion={
                            handleContinueToNextQuestion
                        }
                        isCheckup={isCheckup}
                    />
                </>
            );
        // case 'multi-select':
        // 	return (
        // 		<MultiSelectQuestion
        // 			continueButton={continueButton}
        // 			question={question}
        // 			formInformation={formInformation}
        // 			setFormInformation={setFormInformation}
        // 			setResponse={setResponse}
        // 			setAnswered={setAnswered}
        // 		/>
        // 	);

        case 'custom':
            return (
                <>
                    <DynamicCustomQuestion
                        question={question}
                        setFormInformation={setFormInformation}
                        setResponse={setResponse}
                        setAnswered={setAnswered}
                        // arrowBack={arrowBack}
                        // continueButton={continueButton}
                        formInformation={formInformation}
                        answer={answer}
                        isButtonLoading={isButtonLoading}
                        handleContinueButton={handleContinueButton}
                        answered={answered}
                        setOtherTextFieldValue={setOtherTextFieldValue}
                        setOtherChecked={setOtherChecked}
                        setCheckedBoxes={setCheckedBoxes}
                        checkedBoxes={checkedBoxes}
                        otherChecked={otherChecked}
                        otherTextFieldValue={otherTextFieldValue}
                        handleQuestionContinue={handleContinueToNextQuestion}
                        setMetadata={setMetadata}
                        userId={user_id}
                    />
                </>
            );

        default:
            return <></>; // Handle other types or provide a default case
    }
}
