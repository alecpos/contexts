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
import ContinueButtonV3 from '../buttons/ContinueButtonV3';
import { TRANSITION_HEADER_TAILWIND } from '../styles/intake-tailwind-declarations';
import AnimatedContinueButton from '../buttons/AnimatedContinueButtonV3';
import WordByWord from '../../global-components/bioverse-typography/animated-type/word-by-word';

interface GoodToGoProps {}

export default function WLInformComponent({}: GoodToGoProps) {
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
            <div className={`justify-center flex `}>
                <div className="flex flex-col ">
                    <div className="flex flex-col animate-slideRight my-[1.25rem] md:my-[48px] gap-[0.75rem] md:gap-[12px]">
                        <WordByWord className={`inter-h5-question-header`}>
                            Did you know that adequate sleep is a key factor in
                            losing weight?
                        </WordByWord>

                        <WordByWord className={`inter-h5-question-header`}>
                            A study over 16 years revealed that
                            <span className="text-[#6DB0CC] inter-h5-question-header-bold">
                                sleeping less than 7 hours
                            </span>
                            a night can lead to a
                            <span className="text-[#6DB0CC] inter-h5-question-header-bold">
                                15% increased risk of weight gain
                            </span>
                            .
                        </WordByWord>
                    </div>
                    <AnimatedContinueButton onClick={pushToNextRoute} />
                </div>
            </div>
        </>
    );
}
