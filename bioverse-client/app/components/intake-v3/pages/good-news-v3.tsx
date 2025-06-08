'use client';

import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams,
} from 'next/navigation';
import { getNextIntakeRoute } from '@/app/utils/functions/intake-route-controller';
import React, { useEffect, useState } from 'react';
import BioType from '../../global-components/bioverse-typography/bio-type/bio-type';
import WordByWord from '../../global-components/bioverse-typography/animated-type/word-by-word';
import AnimatedContinueButton from '../../intake-v2/buttons/AnimatedContinueButton';
import { getIntakeURLParams } from '../../intake-v2/intake-functions';
import { TRANSITION_HEADER_TAILWIND } from '../../intake-v2/styles/intake-tailwind-declarations';
import AnimatedContinueButtonV3 from '../buttons/AnimatedContinueButtonV3';

interface GoodToGoProps {}

export default function GoodNewsClientComponentV3({}: GoodToGoProps) {
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
            <div className={`justify-center flex mt-[1.25rem] md:mt-[48px]`}>
                <div className="flex flex-col gap-[1.25rem] md:gap-[48px]">
                    <div className="flex flex-col gap-[0.75rem] md:gap-[12px] mb-2">
                        <WordByWord className={`inter-h5-question-header-bold`}>
                            Good news! We can provide you with care.
                        </WordByWord>

                        {/* <AnimatedBioType
                            text={`Losing weight isn't as simple as just dieting and exercising.`}
                            className={'h5medium !font-twcmedium'}
                            gap_y={1}
                        /> */}

                        <WordByWord className={`inter-h5-question-header text-strong mt-1`}>
                            Let&apos;s continue with some questions about you
                            and your lifestyle.
                        </WordByWord>
                    </div>
                    <AnimatedContinueButtonV3 onClick={pushToNextRoute} />
                </div>
            </div>
        </>
    );
}
