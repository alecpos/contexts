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
import { TRANSITION_HEADER_TAILWIND } from '../styles/intake-tailwind-declarations';
import AnimatedContinueButtonV3 from '../buttons/AnimatedContinueButtonV3';
import WordByWord from '../../global-components/bioverse-typography/animated-type/word-by-word';

interface GoodToGoProps {}

export default function PreTreatmentComponent({}: GoodToGoProps) {
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
                <div className="flex flex-col ">
                    <div className="flex flex-col gap-[0.75rem] md:gap-[12px] mb-[1.25rem] md:mb-[48px]">
                        <WordByWord className={`inter-h5-question-header `}>
                            Before we review your
                            <span className="text-[#91C8E0] inter-h5-question-header-bold inline whitespace-nowrap">
                                treatment options,
                            </span>
                            here&apos;s
                            <span className="text-[#91C8E0] inter-h5-question-header-bold">
                                what you can expect
                            </span>
                            from BIOVERSE.
                        </WordByWord>
                    </div>
                    <AnimatedContinueButtonV3 onClick={pushToNextRoute} />
                </div>
            </div>
        </>
    );
}
