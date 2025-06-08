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
import {
    INTAKE_INPUT_TAILWIND,
    INTAKE_PAGE_BODY_TAILWIND,
    INTAKE_PAGE_HEADER_TAILWIND,
    INTAKE_PAGE_SUBTITLE_TAILWIND,
    TRANSITION_HEADER_TAILWIND,
} from '../styles/intake-tailwind-declarations';
import AnimatedContinueButtonV3 from '../buttons/AnimatedContinueButtonV3';
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
            <div className={`justify-center flex w-full md:max-w-[490px] mt-[1.25rem] md:mt-[48px]`}>
                <div className="flex flex-col ">
                    <div className="flex flex-col animate-slideRight ">
                        <BioType className={`inter-h5-question-header`}>
                            Break the cycle, reach your goals!
                        </BioType>

                        <p className={`intake-subtitle mt-[1rem] md:mt-[16px]`}>
                            You can now lose weight with treatments that help
                            you curb cravings and support your weight loss
                            goals.
                        </p>

                        <div className="relative md:w-[490px] w-full aspect-[1.36] my-[1.24rem] md:my-[46px] ">
                            <Image
                                alt="Weightloss graph"
                                src="/img/intake/wl/wl-graph.svg"
                                fill
                                style={{
                                    borderRadius: '12px',
                                }}
                                
                            />
                        </div>
                        <AnimatedContinueButtonV3 onClick={pushToNextRoute} />
                        <p
                            className={`intake-v3-disclaimer-text text-weak mt-[0rem] md:mt-[48px]`}
                        >
                            Graph for illustrative purposes only to demonstrate
                            potential weight loss trends. Individual results may
                            vary.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
