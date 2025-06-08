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
import ContinueButton from '../buttons/ContinueButton';
import {
    INTAKE_INPUT_TAILWIND,
    INTAKE_PAGE_BODY_TAILWIND,
    INTAKE_PAGE_HEADER_TAILWIND,
    INTAKE_PAGE_SUBTITLE_TAILWIND,
    TRANSITION_HEADER_TAILWIND,
} from '../styles/intake-tailwind-declarations';
import AnimatedContinueButton from '../buttons/AnimatedContinueButton';
import { Paper } from '@mui/material';
import Image from 'next/image';

interface GoodToGoProps {}

export default function WLIntroGraphClientComponent({}: GoodToGoProps) {
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
                    <div className="flex flex-col gap-4 animate-slideRight">
                        <BioType className={`${INTAKE_PAGE_HEADER_TAILWIND}`}>
                            Break the cycle, reach your goals!
                        </BioType>

                        <BioType className={`${INTAKE_PAGE_SUBTITLE_TAILWIND}`}>
                            You can now lose weight with treatments that help
                            you curb cravings and support your weight loss
                            goals.
                        </BioType>

                        <div className="relative md:w-[540px] w-full aspect-[1.36]">
                            <Image
                                alt="Weightloss graph"
                                src="/img/intake/wl/wl-graph.svg"
                                fill
                                sizes="(max-width: 768px) 100vw, 540px"
                                unoptimized
                            />
                        </div>
                        <AnimatedContinueButton onClick={pushToNextRoute} />
                        <BioType
                            className={`${INTAKE_PAGE_BODY_TAILWIND} text-textSecondary`}
                        >
                            Graph for illustrative purposes only to demonstrate
                            potential weight loss trends. Individual results may
                            vary.
                        </BioType>
                    </div>
                </div>
            </div>
        </>
    );
}
