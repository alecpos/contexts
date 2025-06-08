'use client';

import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams,
} from 'next/navigation';
import { getNextIntakeRoute } from '@/app/utils/functions/intake-route-controller';
import { getIntakeURLParams } from '../intake-functions';
import React, { useState } from 'react';
import BioType from '../../global-components/bioverse-typography/bio-type/bio-type';
import { QUESTION_HEADER_TAILWIND } from '../styles/intake-tailwind-declarations';
import MultiSelectItem from '../questions/question-types/multi-select/multi-select-item-v3';
import { FormGroup } from '@mui/material';
import useSessionStorage from '@/app/utils/hooks/session-storage/useSessionStorage';

interface GoodToGoProps {}

export default function WLGoalHers({}: GoodToGoProps) {
    const router = useRouter();
    const url = useParams();
    const searchParams = useSearchParams();
    const search = searchParams.toString();
    const fullPath = usePathname();
    const { product_href } = getIntakeURLParams(url, searchParams);
    const [buttonLoading, setButtonLoading] = useState<boolean>(false);
    const [selectedOption, setSelectedOption] = useState<string>('');
    const [answer, setAnswer] = useSessionStorage('wl-goal-hers', {
        question: "What's your weight loss goal?",
        answer: '',
    });

    const pushToNextRouteAndSaveAnswer = (label: string) => {
        setButtonLoading(true);
        setAnswer((prev: any) => {
            return {
                question: "What's your weight loss goal?",
                answer: label,
            };
        });
        const nextRoute = getNextIntakeRoute(fullPath, product_href, search);
        const searchParams = new URLSearchParams(search);
        // Remove the 'nu' parameter
        searchParams.delete('nu');
        // Construct the new search string without the 'nu' parameter
        const newSearch = searchParams.toString();
        router.push(
            `/intake/prescriptions/${product_href}/${nextRoute}?${newSearch}`,
        );
    };
    const options = [
        'Losing 1-15 pounds',
        'Losing 16-50 pounds',
        'Losing 51+ pounds',
        'Not sure, I just need to lose weight',
    ];

    return (
        <>
            <div
                className={`flex flex-col w-full items-center animate-slideRight mt-[1.25rem] md:mt-[48px]`}
            >
                <div className={`justify-center flex`}>
                    <div className="flex flex-col gap-8">
                        <div className="flex flex-col items-center justify-center gap-[2.5vw] p-0 min-w-full">
                            <div className="flex flex-col  rounded-md border min-w-full">
                                <BioType
                                    className={`inter-h5-question-header  `}
                                >
                                    What&apos;s your weight loss goal?
                                </BioType>
                                <FormGroup className="my-[1.25rem] md:my-[48px]">
                                    {options.map(
                                        (label: string, index: number) => (
                                            <MultiSelectItem
                                                key={index}
                                                option={label}
                                                selected={
                                                    selectedOption == label
                                                }
                                                handleCheckboxChange={() => {
                                                    setSelectedOption(label);
                                                    pushToNextRouteAndSaveAnswer(
                                                        label,
                                                    );
                                                }}
                                                showCheck={false}
                                                intake
                                            />
                                        ),
                                    )}
                                </FormGroup>
                                {/* <div className='w-full md:flex md:justify-center md:mt-4 mt-[137px] md:mb-8'>
                    {determineContinueRender() && (
                        <ContinueButton
                            onClick={handleContinueButton}
                            buttonLoading={isButtonLoading}
                            isCheckup={isCheckup}
                        />
                    )}
                </div> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
