'use client';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { Button, FormGroup } from '@mui/material';
import React from 'react';
import RefillQuestionItem from './ChangeRefillQuestionItem';
import { useParams, useRouter } from 'next/navigation';

const question = {
    type: 'checkbox',
    other: false,

    otherOptions: [{ label: 'Earlier by 1 week', delta: -1, mode: 'w' }],
    options: [
        { label: 'By 1 week', delta: 1, mode: 'w' },
        { label: 'By 2 weeks', delta: 2, mode: 'w' },
        { label: 'By 3 weeks', delta: 3, mode: 'w' },
        { label: 'By 4 weeks', delta: 4, mode: 'w' },
        { label: 'By 8 weeks', delta: 8, mode: 'w' },
    ],
    question: 'Change your next refill',
    singleChoice: true,
};
const ChangeRefillForm = ({ date }: { date: Date }) => {
    const router = useRouter();

    const params = useParams();
    const [selectedOption, setSelectedOption] = React.useState<number | null>(
        null,
    );
    const handleCheckboxChange = (value: number) => {
        if (question.singleChoice && value !== selectedOption) {
            setSelectedOption(value);
        }
    };
    const handleContinue = () => {
        if (selectedOption && selectedOption !== null) {
            router.push(
                `/portal/subscriptions/refill/${params.subscription_id}/confirm?delta=${selectedOption}`,
            );
        }
    };
    return (
        <div className="flex flex-col gap-4 md:gap-[28px] mt-[28px]">
            <div>
                <BioType className="subtitle1 text-textSecondary mb-3">
                    Get sooner
                </BioType>
                <FormGroup className="gap-3">
                    {question.otherOptions.map((option, index) => (
                        <RefillQuestionItem
                            key={index}
                            option={option}
                            selected={selectedOption == option.delta}
                            handleCheckboxChange={handleCheckboxChange}
                            date={date}
                        />
                    ))}
                </FormGroup>
            </div>
            <div>
                <BioType className="subtitle1 text-textSecondary mb-3">
                    Get later
                </BioType>
                <FormGroup className="gap-4">
                    {question.options.map((option, index) => (
                        <RefillQuestionItem
                            key={index}
                            option={option}
                            selected={selectedOption == option.delta}
                            handleCheckboxChange={handleCheckboxChange}
                            date={date}
                        />
                    ))}
                </FormGroup>
            </div>
            <div className="flex justify-center w-full">
                <Button
                    disabled={!selectedOption || selectedOption === null}
                    variant="contained"
                    className="w-full md:w-auto"
                    sx={{
                        height: '52px',
                        zIndex: 30,
                    }}
                    onClick={handleContinue}
                >
                    Continue
                </Button>
            </div>
        </div>
    );
};

export default ChangeRefillForm;
