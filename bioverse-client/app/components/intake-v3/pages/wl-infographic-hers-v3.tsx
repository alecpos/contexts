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
import Image from 'next/image';

interface GoodToGoProps {}

export default function WLInfographicHersComponent({}: GoodToGoProps) {
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
                <div className="flex flex-col">
                    <div className="hidden md:flex">
                        <Image
                            src="/img/intake/wl/hers-infographic-desktop.png"
                            alt="Lose 20% of your weight"
                            width={490}
                            height={577}
                            objectFit="contain"
                            unoptimized
                        />
                    </div>
                    <div className="flex md:hidden justify-center">
                        <Image
                            src="/img/intake/wl/hers-infographic-mobile.png"
                            alt="Lose 20% of your weight"
                            width={320}
                            height={597}
                            objectFit="contain"
                            unoptimized
                        />
                    </div>
                    <div className="flex flex-col space-y-2 mt-10 mb-16 md:mb-8">
                        <BioType className="intake-v3-disclaimer-text text-weak">
                            Graph for illustrative purposes only to demonstrate
                            potential appetite suppression trends. Individuals
                            results will vary.
                        </BioType>
                        <BioType className="intake-v3-disclaimer-text text-weak">
                            *Along with a reduced calorie diet and increased
                            exercise. In a 68-233k clinical study of Wegovy®,
                            about 1 in 3 adults with obesity or with overweight
                            and weight-related medical problems achieved 20%
                            weight loss. Average weight loss achieved was 15%.
                            Wegovy® is a registered trademark of Novo Nordisk
                            A/S.
                        </BioType>
                    </div>
                    <AnimatedContinueButtonV3 onClick={pushToNextRoute} />
                </div>
            </div>
        </>
    );
}
