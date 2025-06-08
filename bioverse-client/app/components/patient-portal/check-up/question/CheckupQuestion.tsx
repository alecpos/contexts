'use client';

import { writeQuestionnaireAnswer } from '@/app/utils/database/controller/questionnaires/questionnaire';
import { useRouter } from 'next/navigation';
import styles from '@/app/components/intake-v2/intake-animations.module.css';
import { isEmpty } from 'lodash';
import QuestionRenderComponentV3 from '@/app/components/intake-v3/questions/question-render/question-rendering-v3';
import { getNextCheckupQuestion } from './checkup-question-logic';
import { ActionItemType } from '@/app/types/action-items/action-items-types';
import { handleCheckupCompletionV2 } from '@/app/utils/actions/check-up/check-up-actions';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';

interface CheckupQuestionProps {
    CheckUpQuestionData: CheckupQuestionDataSSR;
    product_href: string;
    userId: string;
    sessionId: number;
    question_junction: QUESTIONNAIRE_JUNCTION_TYPE[];
    questionnaire_id: number;
    last_action_item: ActionItemType;
    subscription_id: number;
}

export default function CheckupQuestion({
    CheckUpQuestionData,
    product_href,
    userId,
    sessionId,
    question_junction,
    questionnaire_id,
    last_action_item,
    subscription_id,
}: CheckupQuestionProps) {
    const router = useRouter();

    const handleContinueToNextQuestion = async (
        answer: Answer,
        isTransitionScreen: boolean
    ) => {
        if (!isTransitionScreen && isEmpty(answer.answer.trim())) {
            return;
        }

        if (!isTransitionScreen) {
            await writeQuestionnaireAnswer(
                userId,
                CheckUpQuestionData.question_record.id,
                answer,
                1,
                sessionId
            );
        }

        const next_question_id = await getNextCheckupQuestion(
            CheckUpQuestionData.question_record.id,
            product_href,
            userId,
            sessionId,
            question_junction,
            questionnaire_id,
            answer
        );

        if (next_question_id == -1) {
            console.warn(
                `No next question id found for question_id: ${CheckUpQuestionData.question_record.id}, redirecting...`
            );
            return;
        }

        if (next_question_id == -2) {
            const result = await handleCheckupCompletionV2(
                userId,
                product_href as PRODUCT_HREF,
                subscription_id,
                last_action_item
            );

            router.push(`/check-up/${product_href}/success`);
            return;
        }

        router.push(`/check-up/${product_href}/question/${next_question_id}`);
    };

    return (
        <div
            className={`flex flex-col w-full min-h-[calc(100dvh-194px)] md:w-[490px] items-center ${styles.fadeInRightToLeft} mt-2`}
        >
            {CheckUpQuestionData && (
                <QuestionRenderComponentV3
                    question_array={[]}
                    question={CheckUpQuestionData.question_record.question}
                    currentQuestionNumber={
                        CheckUpQuestionData.question_record.id
                    }
                    answer={CheckUpQuestionData.answer_record?.answer}
                    user_id={userId}
                    handleContinueToNextQuestion={handleContinueToNextQuestion}
                    router={router}
                    isCheckup={true} //This conditional prop is required to make this work for checkups
                />
            )}
        </div>
    );
}
