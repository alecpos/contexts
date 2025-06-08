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

export default function WLIntroFirstClientComponent({}: GoodToGoProps) {
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
        console.log(newSearch);
        router.push(
            `/intake/prescriptions/${product_href}/${nextRoute}?${newSearch}`,
        );
    };

    // const [showButton, setShowButton] = useState(false);

    // // useEffect to change the state after a certain delay, e.g., 5 seconds
    // useEffect(() => {
    //     const timer = setTimeout(() => {
    //         setShowButton(true);
    //     }, 4000); // 5000 milliseconds = 5 seconds
    //     // Cleanup function to clear the timer if the component unmounts
    //     return () => clearTimeout(timer);
    // }, []); // Empty dependency array means this effect runs once on mount
    // updates
    return (
        <>
            <div className={`justify-center flex`}>
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col gap-8">
                        <WordByWord className={`${TRANSITION_HEADER_TAILWIND}`}>
                            Losing weight isn&apos;t as simple as just dieting
                            and exercising.
                        </WordByWord>

                        {/* <AnimatedBioType
                            text={`Losing weight isn't as simple as just dieting and exercising.`}
                            className={'h5medium !font-twcmedium'}
                            gap_y={1}
                        /> */}

                        <WordByWord className={`${TRANSITION_HEADER_TAILWIND}`}>
                            For many people, factors that we can&apos;t control,
                            like genetics and hormones, make it more difficult
                            to lose weight.
                        </WordByWord>

                        <WordByWord
                            className={`${TRANSITION_HEADER_TAILWIND} !text-primary`}
                        >
                            We&apos;re here to help you.
                        </WordByWord>
                    </div>
                    <AnimatedContinueButton onClick={pushToNextRoute} />
                </div>
            </div>
        </>
    );
}
