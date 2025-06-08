'use client';

import { QuestionAnswer } from '../frequenly-asked-questions';
import { useState } from 'react';
import FaqMenuItem from './faq-menu-item';
import Button from '@mui/material/Button';
import HorizontalDivider from '@/app/components/global-components/dividers/horizontalDivider/horizontalDivider';

interface Props {
    questions: QuestionAnswer[];
}

export default function FaqMenu({ questions }: Props) {
    const [showAll, setShowAll] = useState(false);
    const visibleQuestions = showAll ? questions : questions.slice(0, 6);

    return (
        <div className='flex flex-col gap-faq-gap items-start self-stretch w-full md:w-[44.31vw]'>
            {visibleQuestions.map((item: QuestionAnswer, index: number) => (
                <div key={index} className='w-full mt-4'>
                    <FaqMenuItem questionAnswer={item} />
                </div>
            ))}
            {questions.length > 6 && (
                <div className='text-start w-full mt-4'>
                    <Button
                        fullWidth
                        variant='outlined'
                        onClick={() => setShowAll(!showAll)}
                    >
                        {showAll ? 'HIDE FAQs' : 'SEE MORE FAQs'}
                    </Button>
                </div>
            )}
        </div>
    );
}
