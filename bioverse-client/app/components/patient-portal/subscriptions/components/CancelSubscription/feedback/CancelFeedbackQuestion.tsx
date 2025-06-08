'use client';
import { cancelSubscriptionStripeAndDatabase } from '@/app/(administration)/admin/stripe-api/stripe-api-actions';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import QuestionRenderComponent from '@/app/components/intake-v2/questions/question-render/question-rendering';
import {
    getQuestionInformation_with_type,
    getQuestionsForProduct_with_type,
    writeQuestionnaireAnswerWithVersion,
} from '@/app/utils/database/controller/questionnaires/questionnaire';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import { SubscriptionDetails } from '../../../types/subscription-types';
import LoadingScreen from '@/app/components/global-components/loading-screen/loading-screen';
import { logPatientAction } from '@/app/utils/database/controller/patient_action_history/patient-action-history';
import { PatientActionTask } from '@/app/utils/database/controller/patient_action_history/patient-action-history-types';

interface CancelFeedbackQuestionIDProps {
    subscription_id: number;
    subscription: SubscriptionDetails;
    product_href: string;
    current_question: number;
    user_id: string;
}

export default function CancelFeedbackQuestion({
    subscription_id,
    subscription,
    product_href,
    current_question,
    user_id,
}: CancelFeedbackQuestionIDProps) {
    const router = useRouter();
    const url = useParams();
    const [cl_question, setQuestion] = useState<any>();
    const [cl_answer, setAnswer] = useState<any>();
    const [answerSetVersion, setAnswerSetVersion] = useState(() => {
        let storedValue;
        if (typeof window !== 'undefined') {
            storedValue = localStorage.getItem('answerSetVersion') || '';
        }

        if (storedValue) {
            return storedValue;
        }

        return '0';
    });
    const {
        data: swr_data,
        error: swr_error,
        isLoading: swr_isLoading,
    } = useSWR(`${url.question_id}-${answerSetVersion}-question-data`, () =>
        getQuestionInformation_with_type(
            user_id,
            product_href,
            current_question,
            'cancel'
        )
    );

    const {
        data: swr_question_set,
        error: swr_question_set_error,
        isLoading: swr_question_set_isLoading,
    } = useSWR(`${url.question_id}-sdc-question-set`, () =>
        getQuestionsForProduct_with_type(product_href, 'cancel')
    );

    const fetchDataAndCancelSubscription = async () => {
        if (subscription.status === 'canceled') {
            return;
        }

        const response = await cancelSubscriptionStripeAndDatabase(
            subscription_id,
            subscription.stripe_subscription_id
        );

        await logPatientAction(
            user_id,
            PatientActionTask.SUBSCRIPTION_CANCELED_REQUESTED,
            {
                subscription_id,
                product_href,
            }
        );
    };

    useEffect(() => {
        if (swr_data) {
            setQuestion(swr_data[0].question);
        }
    }, [swr_data]);

    if (swr_isLoading) {
        return <LoadingScreen />;
    }

    if (swr_error) {
        return (
            <>
                <BioType>Error</BioType>
            </>
        );
    }
    console.log(swr_question_set);

    const handleContinueToNextQuestion = async (
        answer: Answer,
        isTransitionScreen: boolean
    ) => {
        const next_question_index =
            swr_question_set.findIndex(
                (q: { question_id: number }) =>
                    q.question_id == current_question
            ) + 1;
        if (!isTransitionScreen) {
            if (next_question_index != swr_question_set.length) {
                await writeQuestionnaireAnswerWithVersion(
                    user_id,
                    current_question,
                    answer,
                    answerSetVersion
                );
            } else {
                writeQuestionnaireAnswerWithVersion(
                    user_id,
                    current_question,
                    answer,
                    answerSetVersion
                );
            }
        }

        if (
            swr_question_set &&
            next_question_index === swr_question_set.length - 2
        ) {
            await fetchDataAndCancelSubscription();
        }

        if (next_question_index == swr_question_set.length) {
            router.push(`/portal/subscriptions`);
        } else {
            router.push(
                `/portal/subscriptions/cancel-flow/${subscription_id}/feedback/${swr_question_set[next_question_index].question_id}`
            );
        }
    };
    return (
        <div className='container mx-auto w-full mt-[var(--nav-height)] max-w-[456px] min-h-[90vh]'>
            <div className='w-full mt-9 '>
                <div
                    className={`flex flex-col w-full items-center animate-slideRight`}
                >
                    <QuestionRenderComponent
                        question={cl_question}
                        currentQuestionNumber={current_question}
                        answer={cl_answer}
                        user_id={user_id}
                        handleContinueToNextQuestion={
                            handleContinueToNextQuestion
                        }
                        router={router}
                        question_array={swr_question_set}
                        isCheckup={true}
                    />
                </div>
            </div>
        </div>
    );
}
