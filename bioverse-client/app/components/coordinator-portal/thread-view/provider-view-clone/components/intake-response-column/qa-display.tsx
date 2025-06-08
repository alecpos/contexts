'use client';

import { CheckupResponse } from '@/app/types/questionnaires/questionnaire-types';
import QAItem from './qa-item';

interface QADisplayProps {
    question_responses: CheckupResponse[];
}

export default function ProviderIntakeQAList({
    question_responses,
}: QADisplayProps) {
    console.log('QResp LIst: ', question_responses);

    return (
        <div>
            <div className='flex flex-col gap-5'>
                {question_responses.map((answer_item) => (
                    <div key={answer_item.question_id}>
                        <QAItem answer_object={answer_item} />
                    </div>
                ))}
            </div>
        </div>
    );
}
