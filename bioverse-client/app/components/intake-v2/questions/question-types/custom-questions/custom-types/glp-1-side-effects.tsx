'use client';

import { SetStateAction, Dispatch, useEffect } from 'react';
import CheckboxQuestion from '../../checkbox';
import { useParams } from 'next/navigation';
import { getQuestionAnswerWithQuestionID } from '@/app/utils/database/controller/questionnaires/questionnaire';
import useSWR from 'swr';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import LoadingScreen from '@/app/components/global-components/loading-screen/loading-screen';

interface GLP1SideEffectsQuestionProps {
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
    setMetadata: Dispatch<SetStateAction<any>>;
}

export default function GLP1SideEffectsQuestion({
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
    setMetadata,
}: GLP1SideEffectsQuestionProps) {
    const params = useParams();

    const {
        data: data_282,
        error: error_282,
        isLoading: isLoading_282,
    } = useSWR(`user-question-282-answer`, () =>
        getQuestionAnswerWithQuestionID('282')
    );

    const {
        data: data_281,
        error: error_281,
        isLoading: isLoading_281,
    } = useSWR(`user-question-281-answer`, () =>
        getQuestionAnswerWithQuestionID('281')
    );

    useEffect(() => {
        if (data_281 && data_281.answer) {
            setMetadata(data_281.answer.answer.formData[0]);
        }
    }, [data_281]);

    if (isLoading_282 || isLoading_281) {
        return <LoadingScreen />;
    }

    if (error_282 || error_281) {
        return (
            <>
                <BioType>Error</BioType>
            </>
        );
    }

    const question_282_answer = data_282!.answer?.answer.formData[0].match(
        /Other: /
    )
        ? `this`
        : 'the ' + data_282!.answer?.answer.formData[0];

    const question_custom = {
        type: 'checkbox',
        other: true,
        options: [
            'No side effects',
            'Nausea',
            'Vomiting',
            'Diarrhea',
            'Constipation',
            'Headache',
            'Heartburn',
            'Fatigue',
        ],
        question: `Did you experience any side effects while taking the ${question_282_answer} dose?`,
        singleChoice: false,
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
