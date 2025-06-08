'use client';

import { FC } from 'react';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import Card from './ED-Card';

interface Option {
    specialTag?: string;
    label: string;
    desc: string;
    chipLabel: string;
    image?: string;
    onClick: () => void;
}

interface GenericOnboardingStageProps {
    title?: string;
    options?: Option[];
}

const genericTitle = 'When do you want to take your medication?';

export default function IndividualFrequencySelector({
    title,
    options,
}: GenericOnboardingStageProps) {
    return (
        <div className='flex flex-col items-start gap-6 self-stretch w-full animate-slideRight'>
            <div className='inline-flex'>
                <BioType className='it-h1 md:itd-h1 text-primary'>
                    {title}
                </BioType>
            </div>
            {options?.map((option, index) => (
                <Card
                    key={index}
                    specialTag={option.specialTag}
                    label={option.label}
                    desc={option.desc}
                    chipLabel={option.chipLabel}
                    onClick={option.onClick}
                    image={option.image}
                />
            ))}
        </div>
    );
}
