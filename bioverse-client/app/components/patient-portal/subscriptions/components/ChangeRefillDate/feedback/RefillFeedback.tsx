'use client';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import QuestionRenderComponent from '@/app/components/intake-v2/questions/question-render/question-rendering';
import useSWR from 'swr';
import {
    getQuestionInformation_with_type,
    getQuestionsForProduct_with_type,
    writeQuestionnaireAnswerWithVersion,
} from '@/app/utils/database/controller/questionnaires/questionnaire';
import { SubscriptionDetails } from '../../../types/subscription-types';
import LoadingScreen from '@/app/components/global-components/loading-screen/loading-screen';

interface Props {
    subscription_id: number;
    subscription: SubscriptionDetails;
    user_id: string;
    product_href: string;
    question_id: number;
}
const RefillFeedback = ({
    subscription_id,
    subscription,
    user_id,
    product_href,
    question_id,
}: Props) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [cl_question, setQuestion] = useState<any>();
    const [cl_answer, setAnswer] = useState<any>();

    const delta = searchParams.get('delta');
    const mode = searchParams.get('mode') ?? 'w';
    const newDate = Number(searchParams.get('new'));
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
    } = useSWR(`${product_href}-refill-question-data`, () =>
        getQuestionInformation_with_type(
            user_id,
            product_href,
            question_id,
            'refill'
        )
    );

    const {
        data: swr_question_set,
        error: swr_question_set_error,
        isLoading: swr_question_set_isLoading,
    } = useSWR(`${product_href}-refill-sdc-question-set`, () =>
        getQuestionsForProduct_with_type(product_href, 'refill')
    );
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
    const next_index_question = Number(question_id) + 1;

    const handleContinueToNextQuestion = async (
        answer: Answer,
        isTransitionScreen: boolean
    ) => {
        const next_question_index =
            swr_question_set.findIndex(
                (q: { question_id: number }) => q.question_id == question_id
            ) + 1;

        if (!isTransitionScreen) {
            writeQuestionnaireAnswerWithVersion(
                user_id,
                question_id,
                answer,
                answerSetVersion
            );
        }

        if (next_question_index == swr_question_set.length) {
            router.push(
                `/portal/subscriptions/refill/${subscription_id}/confirmed?date=${Number(
                    newDate
                )}`
            );
        } else {
            router.push(
                `/portal/subscriptions/refill/${subscription_id}/feedback/${swr_question_set[next_question_index].question_id}`
            );
        }
    };

    return (
        <div className='container mx-auto w-full mt-[var(--nav-height)] max-w-[456px]'>
            <div className='w-full mt-9 md:mt-[160px] '>
                <BioType className='h5'>
                    We&apos;ve changed your next order by{' '}
                    {mode === 'w'
                        ? Number(delta) <= 1
                            ? '1 week'
                            : `${delta} weeks.`
                        : Number(delta) <= 1
                        ? '1 day'
                        : `${delta} days.`}
                </BioType>

                <div className='w-full mt-4'>
                    <QuestionRenderComponent
                        question={cl_question}
                        currentQuestionNumber={question_id}
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
};

export default RefillFeedback;
