'use client';

import { Box, IconButton, Collapse } from '@mui/material';
import { QuestionAnswer } from '../frequenly-asked-questions';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useState } from 'react';
import HorizontalDivider from '@/app/components/global-components/dividers/horizontalDivider/horizontalDivider';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';

interface Props {
    questionAnswer: QuestionAnswer;
}

export default function FaqMenuItem({ questionAnswer }: Props) {
    const [expanded, setExpanded] = useState(false);

    const handleClick = () => {
        setExpanded((prev) => !prev);
    };

    return (
        <>
            <div>
                {/* Added onClick event to the wrapper div */}
                <div
                    className='flex flex-row justify-between items-center mb-4'
                    onClick={handleClick}
                >
                    <BioType className=' body1'>
                        {questionAnswer.question}
                    </BioType>
                    <IconButton
                        style={{
                            transform: `rotate(${
                                expanded ? '180deg' : '0deg'
                            })`,
                            transition: 'transform 0.3s ease-in-out',
                        }}
                    >
                        {expanded ? <RemoveIcon /> : <AddIcon />}
                    </IconButton>
                </div>
                <Collapse in={expanded} timeout='auto' unmountOnExit>
                    <div
                        style={{
                            opacity: expanded ? 1 : 0,
                            maxHeight: expanded ? '500px' : '0',
                            overflow: 'hidden',
                            transition:
                                'opacity 0.3s ease, max-height 0.3s ease',
                        }}
                        className='mb-4'
                    >
                        <BioType className='body1 !font-normal !text-[#1B1B1B99]'>
                            {questionAnswer.answer}
                        </BioType>
                    </div>
                </Collapse>
                <HorizontalDivider height={1} backgroundColor='#B1B1B1' />
            </div>
        </>
    );
}
