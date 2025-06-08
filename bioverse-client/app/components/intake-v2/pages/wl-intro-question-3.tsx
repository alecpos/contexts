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
import MultiSelectItem from '../questions/question-types/multi-select/multi-select-item';
import { FormGroup } from '@mui/material';
import useSessionStorage from '@/app/utils/hooks/session-storage/useSessionStorage';

interface GoodToGoProps {}

export default function WLIntroQuestion3Component({}: GoodToGoProps) {
    const router = useRouter();
    const url = useParams();
    const searchParams = useSearchParams();
    const search = searchParams.toString();
    const fullPath = usePathname();
    const { product_href } = getIntakeURLParams(url, searchParams);
    const [buttonLoading, setButtonLoading] = useState<boolean>(false);
    const [selectedOption, setSelectedOption] = useState<string>('');
    const [answer, setAnswer] = useSessionStorage('wl-intro-q3', {
        question: 'Where do you hold most of your weight?',
        answer: '',
    });

    const pushToNextRouteAndSaveAnswer = (label: string) => {
        setButtonLoading(true);
        setAnswer((prev: any) => {
            return {
                question: 'Where do you hold most of your weight?',
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
        'Around my stomach or waist',
        'Hips and thighs',
        'All over',
    ];

    return (
        <>
            <div
                className={`flex flex-col w-full items-center animate-slideRight`}
            >
                <div className={`justify-center flex`}>
                    <div className="flex flex-col gap-8">
                        <div className="flex flex-col items-center justify-center gap-[2.5vw] p-0 min-w-full">
                            <div className="flex flex-col gap-6 rounded-md border min-w-full">
                                <BioType
                                    className={`${QUESTION_HEADER_TAILWIND}`}
                                >
                                    Where do you hold most of your weight?
                                </BioType>
                                <FormGroup className="gap-4">
                                    {options.map(
                                        (label: string, index: number) => (
                                            <MultiSelectItem
                                                key={index}
                                                option={label}
                                                selected={
                                                    selectedOption == label
                                                }
                                                handleCheckboxChange={() => {
                                                    pushToNextRouteAndSaveAnswer(
                                                        label,
                                                    );
                                                    setSelectedOption(label);
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
