'use client';

import { SetStateAction, Dispatch, useEffect, useState } from 'react';
import CheckboxQuestionV3 from '../../checkbox-v3';
import { useParams } from 'next/navigation';
import { getQuestionAnswerWithQuestionID } from '@/app/utils/database/controller/questionnaires/questionnaire';
import { string } from 'yup';
import { param } from 'jquery';

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
    userId: string;
}

export default function GLP1DosageRequestQuestion({
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
    userId,
}: GLP1SideEffectsQuestionProps) {
    const params = useParams();
    const [glp1MedTheyveTakenBefore, setGlp1MedTheyveTakenBefore] =
        useState<keyof typeof medMap>('none');

    const semaglutide_options: string[] = [
        '0.25 mg',
        '0.5 mg',
        '1 mg',
        '1.25 mg',
        '1.75 mg',
        '2.5 mg',
    ];
    const tirzepatide_options: string[] = [
        '2.5 mg',
        '5 mg',
        '7.5 mg',
        '10 mg',
        '12.5 mg',
    ];

    const medMap: { [key: string]: string[] } = {
        'Compounded Semaglutide': semaglutide_options,
        'Compounded Tirzepatide': tirzepatide_options,
        none: tirzepatide_options,
    };

    const question_custom = {
        type: 'checkbox',
        other: true,
        subtitle: ' ',
        options:
            params.product === 'semaglutide' ||
            params.product === 'ozempic-test'
                ? semaglutide_options
                : params.product === 'tirzepatide'
                ? tirzepatide_options
                : params.product === 'weight-loss'
                ? medMap[glp1MedTheyveTakenBefore] ?? tirzepatide_options
                : tirzepatide_options,
        question: `What weekly dosage would you like to request?`,
        singleChoice: true,
    };

    useEffect(() => {
        const fetchData = async () => {
            const response = await getQuestionAnswerWithQuestionID(281, userId);
            setGlp1MedTheyveTakenBefore(response?.answer?.answer?.answer);
        };
        fetchData();
    }, []);

    return (
        <>
            <CheckboxQuestionV3
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
