'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { getQuestionAnswerWithQuestionID } from '@/app/utils/database/controller/questionnaires/questionnaire';
import { useParams } from 'next/navigation';
import { SetStateAction, Dispatch, useEffect } from 'react';
import useSWR from 'swr';
import CheckboxQuestion from '../../checkbox';
import { IntakeProductNames } from '@/app/types/intake/intake-flow-types';
import LoadingScreen from '@/app/components/global-components/loading-screen/loading-screen';

interface GLPWeeklyDoseQuestionProps {
    question: any;
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
    isCheckup: boolean;
}

class ProductDosage {
    static getDosagesForProduct(
        productName: string
    ): { [key: string]: any } | undefined {
        switch (productName) {
            case IntakeProductNames.Semaglutide:
                return ProductDosage.getDosagesForSemaglutide();
            case IntakeProductNames.Tirzepatide:
                return ProductDosage.getDosagesForTirzepatide();
            case IntakeProductNames.Wegovy:
                return ProductDosage.getDosagesForWegovy();
            case IntakeProductNames.Ozempic:
                return ProductDosage.getDosagesForOzempic();
            case IntakeProductNames.Rybelsus:
                return ProductDosage.getDosagesForRybelsus();
            case IntakeProductNames.Mounjaro:
                return ProductDosage.getDosagesForMounjaro();
            case IntakeProductNames.Zepbound:
                return ProductDosage.getDosagesForZepbound();
            case IntakeProductNames.Saxenda:
                return ProductDosage.getDosagesForSaxenda();
            case IntakeProductNames.Trulicity:
                return ProductDosage.getDosagesForTrulicity();
            case IntakeProductNames.Victoza:
                return ProductDosage.getDosagesForVictoza();
            default:
                console.warn(`Unknown product: ${productName}`);
                return undefined;
        }
    }

    static getDosagesForSemaglutide(): { [key: string]: any } {
        return {
            type: 'checkbox',
            other: true,
            subtitle: ' ',
            options: [
                '0.25 mg',
                '0.5 mg',
                '1 mg',
                '1.25 mg',
                '1.75 mg',
                '2.5 mg',
                'I do not remember',
            ],
            question: `What was the most recent weekly dose of Compounded Semaglutide you took?`,
            singleChoice: true,
        };
    }

    static getDosagesForTirzepatide(): { [key: string]: any } {
        return {
            type: 'checkbox',
            other: true,
            subtitle: ' ',
            options: [
                '2.5 mg',
                '5 mg',
                '7.5 mg',
                '10 mg',
                '12.5 mg',
                '15 mg',
                'I do not remember',
            ],
            question: `What was the most recent weekly dose of Compounded Tirzepatide you took?`,
            singleChoice: true,
        };
    }

    static getDosagesForWegovy(): { [key: string]: any } {
        return {
            type: 'checkbox',
            other: false,
            subtitle:
                'Round to the nearest dosage if your most recent dosage was in between two dosages.',
            options: [
                '0.25 mg per week (1 mg per month)',
                '0.5 mg per week (2 mg per month)',
                '1 mg per week (4 mg per month)',
                '1.7 mg per week (6.8 mg per month)',
                '2.4 mg per week (9.6 mg per month)',
            ],
            question: `What was the most recent dose of Wegovy you took?`,
            singleChoice: true,
        };
    }

    static getDosagesForOzempic(): { [key: string]: any } {
        return {
            type: 'checkbox',
            other: false,
            subtitle:
                'Round to the nearest dosage if your most recent dosage was in between two dosages.',
            options: [
                '0.25 mg per week (1 mg per month)',
                '0.5 mg per week (2 mg per month)',
                '1 mg per week (4 mg per month)',
                '2 mg per week (8 mg per month)',
            ],
            question: `What was the most recent dose of Ozempic you took?`,
            singleChoice: true,
        };
    }

    static getDosagesForRybelsus(): { [key: string]: any } {
        return {
            type: 'checkbox',
            other: true,
            subtitle:
                'Round to the nearest dosage if your most recent dosage was in between two dosages.',
            options: [
                '3 mg per day (21 mg per week)',
                '7 mg per day (49 mg per week)',
                '14 mg per day (98 mg per week)',
            ],
            question: `What was the most recent dose of Rybelsus you took?`,
            singleChoice: true,
        };
    }

    static getDosagesForMounjaro(): { [key: string]: any } {
        return {
            type: 'checkbox',
            other: false,
            subtitle:
                'Round to the nearest dosage if your most recent dosage was in between two dosages.',
            options: [
                '2.5 mg per week (10 mg per month)',
                '5 mg per week (20 mg per month)',
                '7.5 mg per week (30 mg per month)',
                '10 mg per week (40 mg per month)',
                '12.5 mg per week (50 mg per month)',
            ],
            question: `What was the most recent dose of Mounjaro you took?`,
            singleChoice: true,
        };
    }

    static getDosagesForZepbound(): { [key: string]: any } {
        return {
            type: 'checkbox',
            other: false,
            subtitle:
                'Round to the nearest dosage if your most recent dosage was in between two dosages.',
            options: [
                '2.5 mg per week (10 mg per month)',
                '5 mg per week (20 mg per month)',
                '7.5 mg per week (30 mg per month)',
                '10 mg per week (40 mg per month)',
                '12.5 mg per week (50  mg per month)',
                '15 mg per week (60 mg per month)',
            ],
            question: `What was the most recent dose of Zepbound you took?`,
            singleChoice: true,
        };
    }

    static getDosagesForSaxenda(): { [key: string]: any } {
        return {
            type: 'checkbox',
            other: false,
            subtitle:
                'Round to the nearest dosage if your most recent dosage was in between two dosages.',
            options: [
                '0.6 mg per day (4.2 mg per week)',
                '1.2 mg per day (8.4 mg per week)',
                '1.8 mg per day (12.6 mg per week)',
                '2.4 mg per day (16.8 mg per week)',
                '3.0 mg per day (21 mg per week)',
            ],
            question: `What was the most recent dose of Victoza you took?`,
            singleChoice: true,
        };
    }

    static getDosagesForVictoza(): { [key: string]: any } {
        return {
            type: 'checkbox',
            other: false,
            subtitle:
                'Round to the nearest dosage if your most recent dosage was in between two dosages.',
            options: [
                '0.6 mg per day (4.2 mg per week)',
                '1.2 mg per day (8.4 mg per week)',
                '1.8 mg per day (12.6 mg per week)',
            ],
            question: `What was the most recent dose of Victoza you took?`,
            singleChoice: true,
        };
    }

    static getDosagesForTrulicity(): { [key: string]: any } {
        return {
            type: 'checkbox',
            other: false,
            subtitle:
                'Round to the nearest dosage if your most recent dosage was in between two dosages.',
            options: [
                '0.75 mg per week (3 mg per month)',
                '1.5 mg per week (6 mg per month)',
                '3 mg per week (12 mg per month)',
                '4.5 mg per week (18 mg per month)',
            ],
            question: `What was the most recent dose of Trulicity you took?`,
            singleChoice: true,
        };
    }
}

export default function GLPWeeklyDoseQuestion({
    question,
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
    isCheckup,
}: GLPWeeklyDoseQuestionProps) {
    const params = useParams();

    const SELECTED_MEDICATION_QUESTION_ID = question.referenceQuestionId;

    const { data, error, isLoading, mutate } = useSWR(
        `user-question-selected-medication-answer`,
        () => getQuestionAnswerWithQuestionID(SELECTED_MEDICATION_QUESTION_ID)
    );

    useEffect(() => {
        mutate();
    }, []);

    if (isLoading) {
        return <LoadingScreen />;
    }

    const href = params.product;

    const question_custom = ProductDosage.getDosagesForProduct(
        data?.answer?.answer?.answer
    );

    if (error || !data || question_custom === undefined) {
        return (
            <>
                <BioType>Error</BioType>
            </>
        );
    }

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
