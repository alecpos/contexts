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
import MultiSelectItem from '../questions/question-types/multi-select/multi-select-item-v3';
import { FormGroup } from '@mui/material';
import useSessionStorage from '@/app/utils/hooks/session-storage/useSessionStorage';
import { trackRudderstackEvent } from '@/app/utils/functions/rudderstack/rudderstack-utils';
import { RudderstackEvent } from '@/app/types/services/rudderstack/rudderstack-types';

interface GoodToGoProps {
    user_id: string;
}

export default function WLIntroQuestion3Component({ user_id }: GoodToGoProps) {
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
        trackRudderstackEvent(user_id, RudderstackEvent.INTAKE_COMPLETED, {
            product_name: product_href,
        });
        const nextRoute = getNextIntakeRoute(fullPath, product_href, search);
        const searchParams = new URLSearchParams(search);
        // Remove the 'nu' parameter
        searchParams.delete('nu');
        // Construct the new search string without the 'nu' parameter
        const newSearch = searchParams.toString();
        router.push(
            `/intake/prescriptions/${product_href}/${nextRoute}?${newSearch}`
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
                className={`flex flex-col w-full items-center animate-slideRight mt-[1.25rem] md:mt-[48px]`}
            >
                <div className={`justify-center flex`}>
                    <div className='flex flex-col'>
                        <div className='flex flex-col items-center justify-center  p-0 min-w-full'>
                            <div className='flex flex-col rounded-md border min-w-full gap-[1.25rem] md:gap-[48px]'>
                                <BioType className={`inter-h5-question-header`}>
                                    Where do you hold most of your weight?
                                </BioType>
                                <FormGroup className=''>
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
                                                        label
                                                    );
                                                    setSelectedOption(label);
                                                }}
                                                showCheck={false}
                                                intake
                                            />
                                        )
                                    )}
                                </FormGroup>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
