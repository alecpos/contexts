'use client';

import { SetStateAction, Dispatch } from 'react';
import CheckboxQuestion from '../../checkbox';
import { useParams } from 'next/navigation';
import { getQuestionAnswerWithQuestionID } from '@/app/utils/database/controller/questionnaires/questionnaire';
import useSWR from 'swr';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import LoadingScreen from '@/app/components/global-components/loading-screen/loading-screen';

interface GLP1HowLongQuestionProps {
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
}

export default function GLP1HowLongQuestion({
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
}: GLP1HowLongQuestionProps) {
    const params = useParams();

    const {
        data: data_282,
        error: error_282,
        isLoading: isLoading_282,
    } = useSWR(`user-question-282-answer`, () =>
        getQuestionAnswerWithQuestionID('282')
    );

    if (isLoading_282) {
        return <LoadingScreen />;
    }

    if (error_282) {
        return (
            <>
                <BioType>Error</BioType>
            </>
        );
    }

    const question_282_answer = data_282!.answer?.answer.formData[0].match(
        /Other/
    )
        ? `this`
        : 'the ' + data_282!.answer?.answer.formData[0];

    const href = params.product;

    const question_custom = {
        type: 'checkbox',
        other: false,
        subtitle: ' ',
        options: [
            '1 week',
            '2 weeks',
            '3 weeks',
            '1 month',
            'More than 1 month',
        ],
        question: `How long were you taking ${question_282_answer} dose?`,
        singleChoice: true,
    };

    return (
        <>
            <CheckboxQuestion
                question={question_custom}
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
                handleQuestionContinue={handleQuestionContinue}
                isButtonLoading={isButtonLoading}
                handleContinueButton={handleContinueButton}
                question_array={[]}
            />
        </>
    );
}
