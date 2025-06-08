'use client';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { getCurrentUserSexAtBirth } from '@/app/utils/database/controller/profiles/profiles';
import { Dispatch, SetStateAction } from 'react';
import useSWR from 'swr';
import CheckboxQuestion from '../../checkbox';
import LoadingScreen from '@/app/components/global-components/loading-screen/loading-screen';
import { useLocalStorage } from '@/app/utils/actions/intake/hooks/useLocalStorage';

interface Props {
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
        isTransitionScreen: boolean
    ) => void;
}

export default function IdentifySexCustomQuestion({
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
}: Props) {
    const [userSex, setUserSex] = useLocalStorage('userSex', '');

    const { data, error, isLoading } = useSWR(userSex?`user-sex`:null, () =>
        getCurrentUserSexAtBirth()
    );

    if (isLoading) {
        return <LoadingScreen />;
    }

    if (error) {
        return (
            <>
                <BioType>Error</BioType>
            </>
        );
    }


    const determineGenderToDisplay = () => {
        if (!userSex) {
            if(!data){
                return ''; 
            }
            return data?.sex_at_birth === 'Male' ? 'man' : 'woman';
        }
        return userSex === 'Male' ? 'man' : 'woman';
    };

    const question_custom = {
        type: 'checkbox',
        other: false,
        options: ['Yes', 'No'],
        question: `Do you identify as a ${determineGenderToDisplay()}?`,
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
            handleQuestionContinue={handleQuestionContinue}
            isButtonLoading={isButtonLoading}
            handleContinueButton={handleContinueButton}
            question_array={[]}
        />
    );
}
