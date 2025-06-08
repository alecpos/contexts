'use client';

import {
    CheckupResponse,
    TaskViewQuestionResponse,
} from '@/app/types/questionnaires/questionnaire-types';
import QAItem from './qa-item';
import { Fragment } from 'react';

interface QADisplayProps {
    question_responses: TaskViewQuestionResponse[];
}

export default function ProviderIntakeQAList({
    question_responses,
}: QADisplayProps) {
    return (
        <div>
            <div className='flex flex-col gap-5'>
                {question_responses.map((answer_item) => (
                    <Fragment key={answer_item.question_id}>
                        <QAItem answer_object={answer_item} />
                    </Fragment>
                ))}
            </div>
        </div>
    );
}
