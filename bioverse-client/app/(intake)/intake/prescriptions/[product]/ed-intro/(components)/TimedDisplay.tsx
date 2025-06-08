'use client';

import { FC, ReactNode } from 'react';
import WordByWord from '@/app/components/global-components/bioverse-typography/animated-type/word-by-word';
import { TRANSITION_HEADER_TAILWIND } from '@/app/components/intake-v2/styles/intake-tailwind-declarations';

type Props = {
    children: ReactNode;
    stepIndex?: number; // Add this prop to force re-render
};

const TimedDisplay: FC<Props> = ({ children, stepIndex }) => {
    return (
        <div className='flex justify-center mt-10'>
            <WordByWord
                key={stepIndex} // Add this key prop
                className={`${TRANSITION_HEADER_TAILWIND}`}
            >
                {children}
            </WordByWord>
        </div>
    );
};

export default TimedDisplay;
