import { Dispatch, SetStateAction } from 'react';
import CustomUpload from './custom-types/upload';
import BmiQuestion from './custom-types/bmi';
import WLGoalTransition from './custom-types/wl-goal-transition';
import FloridaConsentQuestion from './custom-types/florida-consent';
import IdentifySexCustomQuestion from './custom-types/identify-sex';
import WhatIsYourSexAtBirth from './custom-types/what-is-your-sex';
import WLFamilyQuestion from './custom-types/wl-family-transition';
import GLP1BeforeQuestion from './custom-types/glp-1-before';
import GLP1HowLongQuestion from './custom-types/glp-how-long';
import GLPWeeklyDoseQuestion from './custom-types/glp-weekly-dose';
import GLP1SideEffectsQuestion from './custom-types/glp-1-side-effects';
import GLP1DosageRequestQuestion from './custom-types/glp-1-dosage-request';
import CancelInputQuestion from './custom-types/cancel-input';
import CancelFeedbackOptions from './custom-types/cancel-feedback-options';
import RefillFeedbackOptions from './custom-types/refill-feedback-options';
import GLP1WarningTransition from './custom-types/glp-1-warning-transition';
import NadResearchersComponent from './custom-types/nad-researchers';
import SkincareIngredientsComponent from './custom-types/skincare-ingredients';
import SkincareResultsComponent from './custom-types/skincare-results';
import SkincareReviewsComponent from './custom-types/skincare-reviews';
import SkincareSideEffectsComponent from './custom-types/skincare-side-effects';
import SelectWLTreatmentComponent from './custom-types/select-wl-treatment';
import WLCustomerReviewTransition from './custom-types/wl-customer-review-transition';
import UpNextHealthHistoryTransition from './custom-types/up-next-health';
import FinalReviewComponentCustomQuestion from './custom-types/final-review';
import ListMedicinesComponentCustomQuestion from './custom-types/wl-list-medicines';
import React from 'react';
import AnythingElseComponentCustomQuestion from './custom-types/wl-checkin-anything-else';
import GlpSurgeryDocUploadComponent from './custom-types/glp-surgery-doc-upload';
import EDDrugWarningComponent from './custom-types/ed-drug-warning';
import SelectWLTreatmentRoComponent from './select-wl-treatment-ro';

interface Props {
    question: any;
    setFormInformation: (value: SetStateAction<string[]>) => void;
    setResponse: (value: SetStateAction<string>) => void;
    setAnswered: (value: SetStateAction<boolean>) => void;
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
    setMetadata: Dispatch<any>;
    userId: string;
    answered: boolean;
}

export default function CustomQuestion({
    question,
    formInformation,
    setFormInformation,
    setResponse,
    setAnswered,
    answer,
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
    userId,
    answered,
}: Props) {
    const renderLogic = () => {
        switch (question.custom_name) {
            case 'upload':
                return (
                    <>
                        <CustomUpload
                            question={question}
                            setFormInformation={setFormInformation}
                            setResponse={setResponse}
                            setAnswered={setAnswered}
                            formInformation={formInformation}
                            handleContinueButton={handleContinueButton}
                            isButtonLoading={isButtonLoading}
                        />
                    </>
                );
            case 'bmi':
                return (
                    <>
                        <BmiQuestion
                            question={question}
                            setFormInformation={setFormInformation}
                            setResponse={setResponse}
                            // setAnswered={setAnswered}
                            // arrowBack={arrowBack}
                            // continueButton={continueButton}
                            // formInformation={formInformation}
                            answer={answer}
                            handleContinueButton={handleContinueButton}
                            isButtonLoading={isButtonLoading}
                        />
                    </>
                );
            case 'wl-goal-transition':
                return (
                    <>
                        <WLGoalTransition
                            // continueButton={continueButton}
                            handleContinueButton={handleContinueButton}
                            isButtonLoading={isButtonLoading}
                        />
                    </>
                );

            case 'identify-sex':
                return (
                    <>
                        <IdentifySexCustomQuestion
                            question={question}
                            setFormInformation={setFormInformation}
                            setResponse={setResponse}
                            setAnswered={setAnswered}
                            formInformation={formInformation}
                            answer={answer}
                            handleContinueButton={handleContinueButton}
                            isButtonLoading={isButtonLoading}
                            setOtherTextFieldValue={setOtherTextFieldValue}
                            setOtherChecked={setOtherChecked}
                            setCheckedBoxes={setCheckedBoxes}
                            checkedBoxes={checkedBoxes}
                            otherChecked={otherChecked}
                            otherTextFieldValue={otherTextFieldValue}
                            handleQuestionContinue={handleQuestionContinue}
                        />
                    </>
                );

            case 'wl-family-transition':
                return (
                    <>
                        <WLFamilyQuestion
                            // continueButton={continueButton}
                            handleContinueButton={handleContinueButton}
                            isButtonLoading={isButtonLoading}
                        />
                    </>
                );

            case 'glp-1-before':
                return (
                    <GLP1BeforeQuestion
                        question={question}
                        setFormInformation={setFormInformation}
                        setResponse={setResponse}
                        setAnswered={setAnswered}
                        formInformation={formInformation}
                        answer={answer}
                        handleContinueButton={handleContinueButton}
                        isButtonLoading={isButtonLoading}
                        setOtherTextFieldValue={setOtherTextFieldValue}
                        setOtherChecked={setOtherChecked}
                        setCheckedBoxes={setCheckedBoxes}
                        checkedBoxes={checkedBoxes}
                        otherChecked={otherChecked}
                        otherTextFieldValue={otherTextFieldValue}
                        handleQuestionContinue={handleQuestionContinue}
                    />
                );

            case 'glp-how-long':
                return (
                    <GLP1HowLongQuestion
                        setFormInformation={setFormInformation}
                        setResponse={setResponse}
                        setAnswered={setAnswered}
                        formInformation={formInformation}
                        handleContinueButton={handleContinueButton}
                        isButtonLoading={isButtonLoading}
                        setOtherTextFieldValue={setOtherTextFieldValue}
                        setOtherChecked={setOtherChecked}
                        setCheckedBoxes={setCheckedBoxes}
                        checkedBoxes={checkedBoxes}
                        otherChecked={otherChecked}
                        otherTextFieldValue={otherTextFieldValue}
                        handleQuestionContinue={handleQuestionContinue}
                    />
                );

            case 'glp-1-side-effects':
                return (
                    <GLP1SideEffectsQuestion
                        setFormInformation={setFormInformation}
                        setResponse={setResponse}
                        setAnswered={setAnswered}
                        formInformation={formInformation}
                        handleContinueButton={handleContinueButton}
                        isButtonLoading={isButtonLoading}
                        setOtherTextFieldValue={setOtherTextFieldValue}
                        setOtherChecked={setOtherChecked}
                        setCheckedBoxes={setCheckedBoxes}
                        checkedBoxes={checkedBoxes}
                        otherChecked={otherChecked}
                        otherTextFieldValue={otherTextFieldValue}
                        handleQuestionContinue={handleQuestionContinue}
                        setMetadata={setMetadata}
                    />
                );

            case 'glp-weekly-dose':
                return (
                    <GLPWeeklyDoseQuestion
                        question={question}
                        setFormInformation={setFormInformation}
                        setResponse={setResponse}
                        setAnswered={setAnswered}
                        formInformation={formInformation}
                        handleContinueButton={handleContinueButton}
                        isButtonLoading={isButtonLoading}
                        setOtherTextFieldValue={setOtherTextFieldValue}
                        setOtherChecked={setOtherChecked}
                        setCheckedBoxes={setCheckedBoxes}
                        checkedBoxes={checkedBoxes}
                        otherChecked={otherChecked}
                        otherTextFieldValue={otherTextFieldValue}
                        handleQuestionContinue={handleQuestionContinue}
                        isCheckup={false}
                    />
                );
            case 'glp-checkup-weekly-dose':
                return (
                    <GLPWeeklyDoseQuestion
                        question={question}
                        setFormInformation={setFormInformation}
                        setResponse={setResponse}
                        setAnswered={setAnswered}
                        formInformation={formInformation}
                        handleContinueButton={handleContinueButton}
                        isButtonLoading={isButtonLoading}
                        setOtherTextFieldValue={setOtherTextFieldValue}
                        setOtherChecked={setOtherChecked}
                        setCheckedBoxes={setCheckedBoxes}
                        checkedBoxes={checkedBoxes}
                        otherChecked={otherChecked}
                        otherTextFieldValue={otherTextFieldValue}
                        handleQuestionContinue={handleQuestionContinue}
                        isCheckup={true}
                    />
                );
            case 'glp-1-dosage-request':
                return (
                    <GLP1DosageRequestQuestion
                        setFormInformation={setFormInformation}
                        setResponse={setResponse}
                        setAnswered={setAnswered}
                        formInformation={formInformation}
                        handleContinueButton={handleContinueButton}
                        isButtonLoading={isButtonLoading}
                        setOtherTextFieldValue={setOtherTextFieldValue}
                        setOtherChecked={setOtherChecked}
                        setCheckedBoxes={setCheckedBoxes}
                        checkedBoxes={checkedBoxes}
                        otherChecked={otherChecked}
                        otherTextFieldValue={otherTextFieldValue}
                        handleQuestionContinue={handleQuestionContinue}
                    />
                );
            case 'wl-list-medicines':
                return (
                    <ListMedicinesComponentCustomQuestion
                        setFormInformation={setFormInformation}
                        setResponse={setResponse}
                        setAnswered={setAnswered}
                        formInformation={formInformation}
                        handleContinueButton={handleContinueButton}
                        isButtonLoading={isButtonLoading}
                        setOtherTextFieldValue={setOtherTextFieldValue}
                        setOtherChecked={setOtherChecked}
                        setCheckedBoxes={setCheckedBoxes}
                        checkedBoxes={checkedBoxes}
                        otherChecked={otherChecked}
                        otherTextFieldValue={otherTextFieldValue}
                        handleQuestionContinue={handleQuestionContinue}
                        answered={answered}
                    />
                );
            case 'glp-1-warning-transition':
                return (
                    <GLP1WarningTransition
                        handleContinueButton={handleContinueButton}
                        isButtonLoading={isButtonLoading}
                    />
                );
            case 'wl-final-review-request':
                return (
                    <FinalReviewComponentCustomQuestion
                        setFormInformation={setFormInformation}
                        setResponse={setResponse}
                        setAnswered={setAnswered}
                        formInformation={formInformation}
                        handleContinueButton={handleContinueButton}
                        isButtonLoading={isButtonLoading}
                        setOtherTextFieldValue={setOtherTextFieldValue}
                        setOtherChecked={setOtherChecked}
                        setCheckedBoxes={setCheckedBoxes}
                        checkedBoxes={checkedBoxes}
                        otherChecked={otherChecked}
                        otherTextFieldValue={otherTextFieldValue}
                        handleQuestionContinue={handleQuestionContinue}
                        answered={answered}
                    />
                );
            case 'wl-checkin-anythingelse':
                return (
                    <AnythingElseComponentCustomQuestion
                        setFormInformation={setFormInformation}
                        setResponse={setResponse}
                        setAnswered={setAnswered}
                        formInformation={formInformation}
                        handleContinueButton={handleContinueButton}
                        isButtonLoading={isButtonLoading}
                        setOtherTextFieldValue={setOtherTextFieldValue}
                        setOtherChecked={setOtherChecked}
                        setCheckedBoxes={setCheckedBoxes}
                        checkedBoxes={checkedBoxes}
                        otherChecked={otherChecked}
                        otherTextFieldValue={otherTextFieldValue}
                        handleQuestionContinue={handleQuestionContinue}
                        answered={answered}
                    />
                );
            case 'wl-customer-review-transition':
                return (
                    <WLCustomerReviewTransition
                        handleContinueButton={handleContinueButton}
                        isButtonLoading={isButtonLoading}
                    />
                );
            case 'wl-up-next-hh-transition':
                return (
                    <UpNextHealthHistoryTransition
                        handleContinueButton={handleContinueButton}
                        isButtonLoading={isButtonLoading}
                    />
                );
            case 'what-is-your-sex':
                return (
                    <>
                        <WhatIsYourSexAtBirth
                            setFormInformation={setFormInformation}
                            setResponse={setResponse}
                            setAnswered={setAnswered}
                            formInformation={formInformation}
                            answer={answer}
                            handleContinueButton={handleContinueButton}
                            isButtonLoading={isButtonLoading}
                            setOtherTextFieldValue={setOtherTextFieldValue}
                            setOtherChecked={setOtherChecked}
                            setCheckedBoxes={setCheckedBoxes}
                            checkedBoxes={checkedBoxes}
                            otherChecked={otherChecked}
                            otherTextFieldValue={otherTextFieldValue}
                            handleQuestionContinue={handleQuestionContinue}
                            userId={userId}
                        />
                    </>
                );

            case 'florida-consent':
                return (
                    <>
                        <FloridaConsentQuestion
                            question={question}
                            setFormInformation={setFormInformation}
                            setResponse={setResponse}
                            handleContinueButton={handleContinueButton}
                            isButtonLoading={isButtonLoading}
                        />
                    </>
                );
            case 'cancel-input':
                return (
                    <CancelInputQuestion
                        question={question}
                        setFormInformation={setFormInformation}
                        setResponse={setResponse}
                        setAnswered={setAnswered}
                        formInformation={formInformation}
                        handleContinueButton={handleContinueButton}
                        isButtonLoading={isButtonLoading}
                    />
                );
            case 'cancel-feedback-options':
                return (
                    <CancelFeedbackOptions
                        question={question}
                        setFormInformation={setFormInformation}
                        setResponse={setResponse}
                        setCheckedBoxes={setCheckedBoxes}
                        setAnswered={setAnswered}
                        checkedBoxes={checkedBoxes}
                        isButtonLoading={isButtonLoading}
                        handleContinueButton={handleContinueButton}
                    />
                );
            case 'refill-feedback-options':
                return (
                    <RefillFeedbackOptions
                        question={question}
                        setFormInformation={setFormInformation}
                        setResponse={setResponse}
                        setCheckedBoxes={setCheckedBoxes}
                        setAnswered={setAnswered}
                        checkedBoxes={checkedBoxes}
                        isButtonLoading={isButtonLoading}
                        handleContinueButton={handleContinueButton}
                        setOtherTextFieldValue={setOtherTextFieldValue}
                        setOtherChecked={setOtherChecked}
                        otherChecked={otherChecked}
                        otherTextFieldValue={otherTextFieldValue}
                    />
                );
            case 'nad-researchers':
                return (
                    <NadResearchersComponent
                        handleContinueButton={handleContinueButton}
                        isButtonLoading={isButtonLoading}
                    />
                );
            case 'skincare-ingredients':
                return (
                    <SkincareIngredientsComponent
                        handleContinueButton={handleContinueButton}
                        isButtonLoading={isButtonLoading}
                    />
                );
            case 'skincare-results':
                return (
                    <SkincareResultsComponent
                        handleContinueButton={handleContinueButton}
                        isButtonLoading={isButtonLoading}
                    />
                );
            case 'skincare-reviews':
                return (
                    <SkincareReviewsComponent
                        handleContinueButton={handleContinueButton}
                        isButtonLoading={isButtonLoading}
                    />
                );
            case 'skincare-side-effects':
                return (
                    <SkincareSideEffectsComponent
                        handleContinueButton={handleContinueButton}
                        isButtonLoading={isButtonLoading}
                    />
                );
            case 'glp-select-treatment':
                return (
                    <SelectWLTreatmentComponent
                        handleContinueButton={handleContinueButton}
                    />
                );
            case 'glp-select-treatment-ro':
                return (
                    <SelectWLTreatmentRoComponent
                        handleContinueButton={handleContinueButton}
                    />
                );
            case 'final-review-question':
                return (
                    <FinalReviewComponentCustomQuestion
                        setFormInformation={setFormInformation}
                        setResponse={setResponse}
                        setAnswered={setAnswered}
                        formInformation={formInformation}
                        handleContinueButton={handleContinueButton}
                        isButtonLoading={isButtonLoading}
                        setOtherTextFieldValue={setOtherTextFieldValue}
                        setOtherChecked={setOtherChecked}
                        setCheckedBoxes={setCheckedBoxes}
                        checkedBoxes={checkedBoxes}
                        otherChecked={otherChecked}
                        otherTextFieldValue={otherTextFieldValue}
                        handleQuestionContinue={handleQuestionContinue}
                        answered={answered}
                    />
                );
            case 'glp-surgery-doc-upload':
                return (
                    <>
                        <GlpSurgeryDocUploadComponent
                            question={question}
                            setAnswered={setAnswered}
                            setFormInformation={setFormInformation}
                            setResponse={setResponse}
                            handleContinueButton={handleContinueButton}
                            patientId={userId}
                            isButtonLoading={isButtonLoading}
                        />
                    </>
                );
            case 'ed-drug-warning':
                return (
                    <EDDrugWarningComponent
                        handleContinueButton={handleContinueButton}
                        isButtonLoading={isButtonLoading}
                    />
                );
            default:
                return null;
        }
    };

    return <>{renderLogic()}</>;
}
