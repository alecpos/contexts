'use client';

import { updateCurrentUserSexAtBirth } from '@/app/utils/database/controller/profiles/profiles';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import CheckboxQuestion from '../../checkbox';
import { identifyUser } from '@/app/services/customerio/customerioApiFactory';
import { toLower } from 'lodash';
import { useLocalStorage } from '@/app/utils/actions/intake/hooks/useLocalStorage';

interface Props {
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
    userId: string;
}

export default function WhatIsYourSexAtBirth({
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
    userId,
}: Props) {
    const [boxChecked, setBoxChecked] = useState<boolean>(
        formInformation ? formInformation[0] === 'consent given' : false,
    );
    const [userSex, setUserSex] = useLocalStorage('userSex', '');

    useEffect(() => {
        if (boxChecked) {
            setResponse(`Florida Consent Provided: True`);
            setFormInformation(['consent given']);
        } else {
            setResponse(``);
            setFormInformation([]);
        }
    }, [boxChecked]);

    const handleContinueUpdateSex = async (obj: any) => {
        setUserSex(obj.answer);
        await updateCurrentUserSexAtBirth(obj.answer);
        await identifyUser(userId, { sex: toLower(obj.answer) });
        window.rudderanalytics.identify(userId, { sex: toLower(obj.answer) });
        handleQuestionContinue(obj, false);
    };

    const determineGenderToDisplay = () => {};

    const question_custom = {
        type: 'checkbox',
        other: false,
        options: ['Male', 'Female'],
        question: 'What was your sex assigned at birth?',
        singleChoice: true,
        subtitle: ' ',
    };

    return (
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
            handleQuestionContinue={handleContinueUpdateSex}
            isButtonLoading={isButtonLoading}
            handleContinueButton={handleContinueUpdateSex}
            question_array={[]}
        />
    );
}
