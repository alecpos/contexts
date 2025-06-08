'use server';
import PreQuestionIDComponentV3 from '@/app/components/intake-v3/pages/pre-question-id-v3';
import { Suspense } from 'react';

interface QuestionNumberProps {
    params: {
        product: string;
        question_id: number;
    };
    searchParams: {
        [key: string]: string;
    };
}

export default async function IntakePreQuestionsPage({
    params,
    searchParams,
}: QuestionNumberProps) {
    const current_question = params.question_id;

    return (
        <Suspense>
            <PreQuestionIDComponentV3 current_question={current_question} />
        </Suspense>
    );
}
