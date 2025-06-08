import { Dispatch, SetStateAction } from 'react';
import dynamic from 'next/dynamic';
import LoadingScreen from '@/app/components/global-components/loading-screen/loading-screen';

// Dynamic imports for all custom question components
const DynamicCancelFeedbackOptions = dynamic(
    () => import('./custom-types/cancel-feedback-options'),
    { loading: () => <LoadingScreen />, ssr: false }
);
const DynamicCancelInputQuestion = dynamic(
    () => import('./custom-types/cancel-input'),
    { loading: () => <LoadingScreen />, ssr: false }
);
const DynamicEDDrugWarningComponent = dynamic(
    () => import('./custom-types/ed-drug-warning'),
    { loading: () => <LoadingScreen />, ssr: false }
);
const DynamicFinalReviewComponentCustomQuestion = dynamic(
    () => import('./custom-types/final-review'),
    { loading: () => <LoadingScreen />, ssr: false }
);
const DynamicFloridaConsentQuestion = dynamic(
    () => import('./custom-types/florida-consent'),
    { loading: () => <LoadingScreen />, ssr: false }
);
const DynamicGLP1BeforeQuestion = dynamic(
    () => import('./custom-types/glp-1-before'),
    { loading: () => <LoadingScreen />, ssr: false }
);
const DynamicGLP1DosageRequestQuestion = dynamic(
    () => import('./custom-types/glp-1-dosage-request'),
    { loading: () => <LoadingScreen />, ssr: false }
);
const DynamicGLP1SideEffectsQuestion = dynamic(
    () => import('./custom-types/glp-1-side-effects'),
    { loading: () => <LoadingScreen />, ssr: false }
);
const DynamicGLP1HowLongQuestion = dynamic(
    () => import('./custom-types/glp-how-long'),
    { loading: () => <LoadingScreen />, ssr: false }
);
const DynamicGlpSurgeryDocUploadComponent = dynamic(
    () => import('./custom-types/glp-surgery-doc-upload'),
    { loading: () => <LoadingScreen />, ssr: false }
);
const DynamicGLPWeeklyDoseQuestion = dynamic(
    () => import('./custom-types/glp-weekly-dose'),
    { loading: () => <LoadingScreen />, ssr: false }
);
const DynamicNadResearchersComponent = dynamic(
    () =>
        import(
            '@/app/components/intake-v3/questions/question-types/custom-questions/custom-types/nad-researchers'
        ),
    { loading: () => <LoadingScreen />, ssr: false }
);
const DynamicRefillFeedbackOptions = dynamic(
    () =>
        import(
            '@/app/components/intake-v2/questions/question-types/custom-questions/custom-types/refill-feedback-options'
        ),
    { loading: () => <LoadingScreen />, ssr: false }
);
const DynamicCustomUpload = dynamic(
    () =>
        import(
            '@/app/components/intake-v2/questions/question-types/custom-questions/custom-types/upload'
        ),
    { loading: () => <LoadingScreen />, ssr: false }
);
const DynamicAnythingElseComponentCustomQuestion = dynamic(
    () => import('./custom-types/wl-checkin-anything-else'),
    { loading: () => <LoadingScreen />, ssr: false }
);
const DynamicListMedicinesComponentCustomQuestion = dynamic(
    () => import('./custom-types/wl-list-medicines'),
    { loading: () => <LoadingScreen />, ssr: false }
);
const DynamicGLP1WarningTransition = dynamic(
    () => import('./custom-types/glp-1-warning-transition'),
    { loading: () => <LoadingScreen />, ssr: false }
);
const DynamicUpNextHealthHistoryTransition = dynamic(
    () => import('./custom-types/up-next-health'),
    { loading: () => <LoadingScreen />, ssr: false }
);
const DynamicWLCustomerReviewTransition = dynamic(
    () => import('./custom-types/wl-customer-review-transition'),
    { loading: () => <LoadingScreen />, ssr: false }
);
const DynamicWhatIsYourSexAtBirthV3 = dynamic(
    () => import('./custom-types/what-is-your-sex-v3'),
    { loading: () => <LoadingScreen />, ssr: false }
);
const DynamicIdentifySexCustomQuestionV3 = dynamic(
    () => import('./custom-types/identify-sex-v3'),
    { loading: () => <LoadingScreen />, ssr: false }
);
const DynamicWLGoalTransitionV3 = dynamic(
    () => import('./custom-types/wl-goal-transition-v3'),
    { loading: () => <LoadingScreen />, ssr: false }
);
const DynamicWLFamilyQuestionV3 = dynamic(
    () => import('./custom-types/wl-family-transition-v3'),
    { loading: () => <LoadingScreen />, ssr: false }
);
const DynamicBmiQuestionV3 = dynamic(() => import('./custom-types/bmi-v3'), {
    loading: () => <LoadingScreen />,
    ssr: false,
});
const DynamicSelectWLTreatmentComponent = dynamic(
    () => import('./custom-types/select-wl-treatment-v3'),
    { loading: () => <LoadingScreen />, ssr: false }
);
const DynamicWLSleepFact = dynamic(
    () => import('./custom-types/wl-sleep-fact-hers'),
    { loading: () => <LoadingScreen />, ssr: false }
);
const DynamicWLHormoneInfo = dynamic(
    () => import('./custom-types/wl-hormone-info'),
    { loading: () => <LoadingScreen />, ssr: false }
);
const DynamicWLSuicidalInfographic = dynamic(
    () => import('./custom-types/wl-suicidal-infographic'),
    { loading: () => <LoadingScreen />, ssr: false }
);
const DynamicWLNicotineInfo = dynamic(
    () => import('./custom-types/wl-nicotine-info'),
    { loading: () => <LoadingScreen />, ssr: false }
);
const DynamicWLSideEffectDisclaimer = dynamic(
    () => import('./custom-types/wl-side-effect-disclaimer'),
    { loading: () => <LoadingScreen />, ssr: false }
);
const DynamicWLCheckupSideEffectSeekHelp = dynamic(
    () => import('./custom-types/wl-checkup-side-effect-seek-help'),
    { loading: () => <LoadingScreen />, ssr: false }
);
const DynamicWLCheckupLastQuestion = dynamic(
    () => import('./custom-types/wl-checkup-last-question'),
    { loading: () => <LoadingScreen />, ssr: false }
);
const DynamicCompetitorComparisonsQuestion = dynamic(
    () => import('./custom-types/competitor-comparisons'),
    { loading: () => <LoadingScreen />, ssr: false }
);
const DynamicCompetitorComparisonsQuestionRO = dynamic(
    () => import('./custom-types/ro-competitor-comparison'),
    { loading: () => <LoadingScreen />, ssr: false }
);
const DynamicHenryMedsCompetitorComparisonsQuestion = dynamic(
    () => import('./custom-types/henry-meds-competitor-comparison'),
    { loading: () => <LoadingScreen />, ssr: false }
);
const DynamicFoundCompetitorComparisonsQuestion = dynamic(
    () => import('./custom-types/found-competitor-comparison'),
    { loading: () => <LoadingScreen />, ssr: false }
);
const DynamicIvimHealthCompetitorComparisonsQuestion = dynamic(
    () => import('./custom-types/ivim-health-competitor-comparison'),
    { loading: () => <LoadingScreen />, ssr: false }
);
const DynamicWeightWatchersCompetitorComparisonsQuestion = dynamic(
    () => import('./custom-types/weight-watchers-competitor-comparison'),
    { loading: () => <LoadingScreen />, ssr: false }
);
const DynamicNoomCompetitorComparisonsQuestion = dynamic(
    () => import('./custom-types/noom-competitor-comparison'),
    { loading: () => <LoadingScreen />, ssr: false }
);
const DynamicOtherPlansCompetitorComparisonsQuestion = dynamic(
    () => import('./custom-types/other-plans-competitor-comparison'),
    { loading: () => <LoadingScreen />, ssr: false }
);
const DynamicNADAnythingElse = dynamic(
    () => import('./custom-types/nad-anything-else'),
    { loading: () => <LoadingScreen />, ssr: false }
);
const DynamicCheckupV2SideEffectQuestion = dynamic(
    () => import('./custom-types/checkup-v2-side-effect-question'),
    { loading: () => <LoadingScreen />, ssr: false }
);

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

export default function CustomQuestionV3({
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
                    <DynamicCustomUpload
                        question={question}
                        setFormInformation={setFormInformation}
                        setResponse={setResponse}
                        setAnswered={setAnswered}
                        formInformation={formInformation}
                        handleContinueButton={handleContinueButton}
                        isButtonLoading={isButtonLoading}
                    />
                );
            case 'bmi':
                return (
                    <DynamicBmiQuestionV3
                        question={question}
                        setFormInformation={setFormInformation}
                        setResponse={setResponse}
                        answer={answer}
                        handleContinueButton={handleContinueButton}
                        isButtonLoading={isButtonLoading}
                    />
                );
            case 'wl-goal-transition':
                return (
                    <DynamicWLGoalTransitionV3
                        handleContinueButton={handleContinueButton}
                        isButtonLoading={isButtonLoading}
                    />
                );
            case 'identify-sex':
                return (
                    <DynamicIdentifySexCustomQuestionV3
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
            case 'wl-family-transition':
                return (
                    <DynamicWLFamilyQuestionV3
                        handleContinueButton={handleContinueButton}
                        isButtonLoading={isButtonLoading}
                    />
                );
            case 'glp-1-before':
                return (
                    <DynamicGLP1BeforeQuestion
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
                    <DynamicGLP1HowLongQuestion
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
                    <DynamicGLP1SideEffectsQuestion
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
                    <DynamicGLPWeeklyDoseQuestion
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
                    <DynamicGLPWeeklyDoseQuestion
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
                    <DynamicGLP1DosageRequestQuestion
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
                        userId={userId}
                    />
                );
            case 'wl-list-medicines':
                return (
                    <DynamicListMedicinesComponentCustomQuestion
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
                    <DynamicGLP1WarningTransition
                        handleContinueButton={handleContinueButton}
                        isButtonLoading={isButtonLoading}
                    />
                );
            case 'wl-final-review-request':
                return (
                    <DynamicFinalReviewComponentCustomQuestion
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
                    <DynamicAnythingElseComponentCustomQuestion
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
                    <DynamicWLCustomerReviewTransition
                        handleContinueButton={handleContinueButton}
                        isButtonLoading={isButtonLoading}
                    />
                );
            case 'wl-up-next-hh-transition':
                return (
                    <DynamicUpNextHealthHistoryTransition
                        handleContinueButton={handleContinueButton}
                        isButtonLoading={isButtonLoading}
                    />
                );
            case 'what-is-your-sex':
                return (
                    <DynamicWhatIsYourSexAtBirthV3
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
                );
            case 'florida-consent':
                return (
                    <DynamicFloridaConsentQuestion
                        question={question}
                        setFormInformation={setFormInformation}
                        setResponse={setResponse}
                        handleContinueButton={handleContinueButton}
                        isButtonLoading={isButtonLoading}
                    />
                );
            case 'cancel-input':
                return (
                    <DynamicCancelInputQuestion
                        question={question}
                        setFormInformation={setFormInformation}
                        setResponse={setResponse}
                        setAnswered={setAnswered}
                        formInformation={formInformation}
                        handleContinueButton={handleContinueButton}
                        isButtonLoading={isButtonLoading}
                    />
                );
            case 'wl-sleep-fact':
                return (
                    <DynamicWLSleepFact
                        handleContinueButton={handleContinueButton}
                        isButtonLoading={isButtonLoading}
                    />
                );
            case 'wl-hormone-info':
                return (
                    <DynamicWLHormoneInfo
                        handleContinueButton={handleContinueButton}
                        isButtonLoading={isButtonLoading}
                    />
                );
            case 'wl-suicidal-prevention':
                return (
                    <DynamicWLSuicidalInfographic
                        handleContinueButton={handleContinueButton}
                        isButtonLoading={isButtonLoading}
                    />
                );
            case 'wl-nicotine-info':
                return (
                    <DynamicWLNicotineInfo
                        handleContinueButton={handleContinueButton}
                        isButtonLoading={isButtonLoading}
                    />
                );
            case 'cancel-feedback-options':
                return (
                    <DynamicCancelFeedbackOptions
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
                    <DynamicRefillFeedbackOptions
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
                    <DynamicNadResearchersComponent
                        handleContinueButton={handleContinueButton}
                        isButtonLoading={isButtonLoading}
                    />
                );
            case 'final-review-question':
                return (
                    <DynamicFinalReviewComponentCustomQuestion
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
                    <DynamicGlpSurgeryDocUploadComponent
                        question={question}
                        setAnswered={setAnswered}
                        setFormInformation={setFormInformation}
                        setResponse={setResponse}
                        handleContinueButton={handleContinueButton}
                        patientId={userId}
                        isButtonLoading={isButtonLoading}
                    />
                );
            case 'glp-select-treatment':
                return (
                    <DynamicSelectWLTreatmentComponent
                        handleContinueButton={handleContinueButton}
                    />
                );
            case 'ed-drug-warning':
                return (
                    <DynamicEDDrugWarningComponent
                        handleContinueButton={handleContinueButton}
                        isButtonLoading={isButtonLoading}
                    />
                );
            case 'wl-side-effect-disclaimer':
                return (
                    <DynamicWLSideEffectDisclaimer
                        handleContinueButton={handleContinueButton}
                        isButtonLoading={isButtonLoading}
                    />
                );
            case 'wl-checkup-side-effect-seek-help':
                return (
                    <DynamicWLCheckupSideEffectSeekHelp
                        handleContinueButton={handleContinueButton}
                        isButtonLoading={isButtonLoading}
                    />
                );
            case 'wl-checkup-last-question':
                return (
                    <DynamicWLCheckupLastQuestion
                        setFormInformation={setFormInformation}
                        setResponse={setResponse}
                        setAnswered={setAnswered}
                        formInformation={formInformation}
                        handleContinueButton={handleContinueButton}
                        isButtonLoading={isButtonLoading}
                        setOtherTextFieldValue={setOtherTextFieldValue}
                        otherTextFieldValue={otherTextFieldValue}
                        answered={answered}
                    />
                );
            case 'competitor-comparisons': //hims/hers
                return (
                    <DynamicCompetitorComparisonsQuestion
                        handleContinueButton={handleContinueButton}
                        isButtonLoading={isButtonLoading}
                    />
                );
            case 'ro-competitor-comparison': //ro
                return (
                    <DynamicCompetitorComparisonsQuestionRO
                        handleContinueButton={handleContinueButton}
                        isButtonLoading={isButtonLoading}
                    />
                );
            case 'henry-meds-competitor-comparison': //henry meds
                return (
                    <DynamicHenryMedsCompetitorComparisonsQuestion
                        handleContinueButton={handleContinueButton}
                        isButtonLoading={isButtonLoading}
                    />
                );
            case 'found-competitor-comparison': //found
                return (
                    <DynamicFoundCompetitorComparisonsQuestion
                        handleContinueButton={handleContinueButton}
                        isButtonLoading={isButtonLoading}
                    />
                );
            case 'ivim-health-competitor-comparison': //ivim health
                return (
                    <DynamicIvimHealthCompetitorComparisonsQuestion
                        handleContinueButton={handleContinueButton}
                        isButtonLoading={isButtonLoading}
                    />
                );
            case 'weight-watchers-competitor-comparison': //weight watchers
                return (
                    <DynamicWeightWatchersCompetitorComparisonsQuestion
                        handleContinueButton={handleContinueButton}
                        isButtonLoading={isButtonLoading}
                    />
                );
            case 'noom-competitor-comparison': //noom
                return (
                    <DynamicNoomCompetitorComparisonsQuestion
                        handleContinueButton={handleContinueButton}
                        isButtonLoading={isButtonLoading}
                    />
                );
            case 'other-plans-competitor-comparison': //other plans
                return (
                    <DynamicOtherPlansCompetitorComparisonsQuestion
                        handleContinueButton={handleContinueButton}
                        isButtonLoading={isButtonLoading}
                    />
                );
            case 'nad-anything-else':
                return (
                    <DynamicNADAnythingElse
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
            case 'checkup-v2-side-effect-question':
                return (
                    <DynamicCheckupV2SideEffectQuestion
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
            default:
                return null;
        }
    };

    return <>{renderLogic()}</>;
}
