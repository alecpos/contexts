'use client';

import { SetStateAction, Dispatch } from 'react';
import CheckboxQuestion from '../../checkbox';
import {
    SEMAGLUTIDE_PRODUCTS,
    TIRZEPATIDE_PRODUCTS,
} from '@/app/components/intake-v2/constants/constants';
import { useParams, useSearchParams } from 'next/navigation';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import { getIntakeURLParams } from '@/app/components/intake-v2/intake-functions';

interface GLP1BeforeQuestionProps {
    question: any;
    setFormInformation: (value: SetStateAction<string[]>) => void;
    setResponse: (value: SetStateAction<string>) => void;
    setAnswered: (value: SetStateAction<boolean>) => void;
    // arrowBack: JSX.Element;
    // continueButton: () => React.ReactElement;
    formInformation: string[];
    answer: Answer;
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
        isTransitionScreen: boolean,
    ) => void;
}

export default function GLP1BeforeQuestion({
    question,
    // arrowBack,
    // continueButton,
    formInformation,
    setFormInformation,
    setResponse,
    setAnswered,
    handleContinueButton,
    isButtonLoading,
    answer,
    setOtherTextFieldValue,
    setOtherChecked,
    setCheckedBoxes,
    checkedBoxes,
    otherChecked,
    otherTextFieldValue,
    handleQuestionContinue,
}: GLP1BeforeQuestionProps) {
    const params = useParams();
    const searchParams = useSearchParams();
    const { product_href } = getIntakeURLParams(params, searchParams);

    const deterimineCompound = () => {
        if (SEMAGLUTIDE_PRODUCTS.includes(product_href as PRODUCT_HREF)) {
            return 'semaglutide';
        } else if (
            TIRZEPATIDE_PRODUCTS.includes(product_href as PRODUCT_HREF)
        ) {
            return 'tirzepatide';
        }

        return product_href;
    };

    const determineQuestion = () => {
        if (product_href === PRODUCT_HREF.WEIGHT_LOSS) {
            return `Have you taken any GLP-1 medication over the last month?`;
        } else {
            return `Have you taken ${deterimineCompound()} or any other GLP-1 medication over the last month?`;
        }
    };

    const question_custom = {
        type: 'checkbox',
        other: false,
        options: ['Yes', 'No'],
        question: determineQuestion(),
        singleChoice: true,
        subtitle: ' ',
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
