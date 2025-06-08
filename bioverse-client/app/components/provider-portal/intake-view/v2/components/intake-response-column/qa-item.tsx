'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import React from 'react';
import { isEmpty } from 'lodash';

interface QAItemProps {
    answer_object: QuestionAnswerObject;
}

export default function QAItem({ answer_object }: QAItemProps) {
    const selected_answer = answer_object.answer
        ? answer_object.answer.answer
        : '';

    const formData = answer_object.answer ? answer_object.answer.formData : [];

    if (
        answer_object.answer.answer === '' ||
        isEmpty(answer_object.answer.formData)
    ) {
        return <></>;
    }

    return (
        <>
            {answer_object.answer &&
                answer_object.question &&
                answer_object.question.question !== 'Transition Screen' && (
                    <div>
                        <BioType className='inter-basic font-interbold text-[14px]'>
                            {answer_object.answer
                                ? answer_object.answer.question
                                : answer_object.question.question}
                        </BioType>
                        {answer_object.question.options ? (
                            <>
                                {answer_object.question.noneBox && (
                                    <BioType
                                        className={`inter-basic text-[14px] ${
                                            selected_answer ===
                                            'None of the above'
                                                ? 'text-text'
                                                : 'text-[#666666] line-through'
                                        }`}
                                    >
                                        None of the above
                                    </BioType>
                                )}
                                {answer_object.question.options.map(
                                    (option: string) => (
                                        <BioType
                                            className={`inter-basic text-[14px] ${
                                                formData?.includes(option)
                                                    ? 'text-text'
                                                    : 'text-[#666666] line-through'
                                            }`}
                                            key={
                                                answer_object.question_id +
                                                '-' +
                                                option
                                            }
                                        >
                                            {option}
                                        </BioType>
                                    )
                                )}
                                {answer_object.question.other && (
                                    <BioType
                                        className={`inter-basic text-[14px] ${
                                            formData?.some((item) =>
                                                /Other/i.test(item)
                                            )
                                                ? 'text-text'
                                                : 'text-[#666666] line-through'
                                        }`}
                                    >
                                        {formData?.some((item) =>
                                            /Other/i.test(item)
                                        )
                                            ? formData[formData?.length - 1]
                                            : 'Other'}
                                    </BioType>
                                )}
                            </>
                        ) : answer_object.answer ? (
                            <BioType className='inter-basic text-[14px]'>
                                {answer_object.answer.answer}
                            </BioType>
                        ) : (
                            ''
                        )}
                    </div>
                )}
        </>
    );
}
