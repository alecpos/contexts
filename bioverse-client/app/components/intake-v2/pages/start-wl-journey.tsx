'use client';

import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams,
} from 'next/navigation';
import { getNextIntakeRoute } from '@/app/utils/functions/intake-route-controller';
import { getIntakeURLParams } from '../intake-functions';
import React, { useEffect, useState } from 'react';
import BioType from '../../global-components/bioverse-typography/bio-type/bio-type';
import ContinueButton from '../buttons/ContinueButton';
import { TRANSITION_HEADER_TAILWIND } from '../styles/intake-tailwind-declarations';
import AnimatedContinueButton from '../buttons/AnimatedContinueButton';
import WordByWord from '../../global-components/bioverse-typography/animated-type/word-by-word';

interface GoodToGoProps {}

export default function StartWLJourneyComponent({}: GoodToGoProps) {
    const router = useRouter();
    const url = useParams();
    const searchParams = useSearchParams();
    const search = searchParams.toString();
    const fullPath = usePathname();
    const { product_href } = getIntakeURLParams(url, searchParams);
    const [buttonLoading, setButtonLoading] = useState<boolean>(false);

    const pushToNextRoute = () => {
        setButtonLoading(true);
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

    return (
        <>
            <div className={`justify-center flex`}>
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col gap-8">
                        <WordByWord
                            className={`${TRANSITION_HEADER_TAILWIND} text-primary`}
                        >
                            Start your weight loss journey.
                        </WordByWord>

                        <WordByWord className={`${TRANSITION_HEADER_TAILWIND}`}>
                            Learn about your treatment options based on your
                            goals, habits and health history.
                        </WordByWord>
                    </div>
                    <AnimatedContinueButton onClick={pushToNextRoute} />
                </div>
            </div>
        </>
    );
}
