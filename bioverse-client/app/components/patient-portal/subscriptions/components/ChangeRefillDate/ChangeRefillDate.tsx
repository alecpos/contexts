'use client';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import ContinueButton from '@/app/components/intake-v2/buttons/ContinueButton';
import { Button } from '@mui/material';
import React from 'react';
import { addDeltaToDate } from '@/app/utils/functions/dates';
import { useRouter } from 'next/navigation';
import { NotNull } from 'yup';
import ChangeRefillForm from './ChangeRefillForm';

interface Props {
    refillDate: Date;
    subscription_id: number;
    staticRefillDate: Date;
}
const question = {
    type: 'checkbox',
    other: false,

    otherOptions: [{ label: 'Earlier by 1 week', weeks: -1 }],
    options: [
        { label: 'By 1 week', weeks: 1 },
        { label: 'By 2 weeks', weeks: 2 },
        { label: 'By 3 weeks', weeks: 3 },
        { label: 'By 4 weeks', weeks: 4 },
    ],
    question: 'Change your next refill',
    singleChoice: true,
};
const ChangeRefillDate = ({
    subscription_id,
    staticRefillDate,
    refillDate,
}: Props) => {
    const router = useRouter();
    const [selectedOption, setSelectedOption] = React.useState<number | null>(
        null,
    );

    const handleCheckboxChange = (value: number) => {
        // Single choice logic
        if (question.singleChoice) {
            setSelectedOption(value);
        }
    };

    return (
        <div className="container mx-auto w-full mt-[var(--nav-height)] max-w-[456px]">
            <div className="w-full mt-9 md:mt-[160px] ">
                <BioType className="h5 text-black">{question.question}</BioType>
                <BioType className="body1 mt-4">
                    Your next refill occurs on {refillDate.toLocaleDateString()}
                </BioType>

                <ChangeRefillForm date={staticRefillDate} />
            </div>
        </div>
    );
};

export default ChangeRefillDate;
