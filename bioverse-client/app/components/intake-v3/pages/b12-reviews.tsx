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
import ContinueButton from '../buttons/ContinueButtonV3';
import {
    INTAKE_PAGE_BODY_TAILWIND,
    INTAKE_PAGE_HEADER_TAILWIND,
    TRANSITION_HEADER_TAILWIND,
} from '../styles/intake-tailwind-declarations';
import AnimatedContinueButton from '../buttons/AnimatedContinueButtonV3';
import { Paper } from '@mui/material';
import Image from 'next/image';
import AnimatedContinueButtonV3 from '../buttons/AnimatedContinueButtonV3';

interface GoodToGoProps {}

export default function B12ReviewsComponent({}: GoodToGoProps) {
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
            <div className="flex flex-col gap-5 md:gap-8 animate-slideRight mb-[40px] mt-[1.25rem] md:mt-[48px]">
            <BioType className={`inter-h5-question-header`}>
                Supplementing B12 levels with injections 
                <span className="inter-h5-question-header-bold">
                    {' '}
                    improves energy levels and brain function.
                </span>
            </BioType>
            <Paper className="rounded-xl" elevation={6}>
                <div className="px-4 md:px-6 pb-4 pt-[22px] ">
                    <div className="flex flex-row gap-3">
                        <Image
                            alt="Melissa S profile pic"
                            src="/img/intake/b12/MelissaS.png"
                            width={56}
                            height={56}
                            
                        />
                        <div className="flex flex-col ">
                            <BioType
                                className={`inter-h5-question-header-bold`}
                            >
                                Melissa S.
                            </BioType>
                            <BioType className={`intake-subtitle text-weak`}>
                                Miami, FL
                            </BioType>
                        </div>
                    </div>
                    <div className={`intake-subtitle mt-4`}>
                        “Can&quot;t overlook and understate the benefits of B12: mental clarity and improved memory function. I feel like I&quot;m looking after my neurological functions, which is new for me as I get older.”
                    </div>
                    <div className="relative w-[140px] h-[28px] mt-4 mb-4">
                        <Image
                            alt="rating-stars"
                            src="/img/intake/wl/yellow-ratings-stars.svg"
                            fill
                            
                        />
                    </div>
                </div>
            </Paper>

            <Paper className="rounded-xl" elevation={6}>
                <div className="px-4 md:px-6 pb-4 pt-[22px] ">
                    <div className="flex flex-row gap-3">
                        <Image
                            alt="Kyle L profile pic"
                            src="/img/intake/b12/KyleL.png"
                            width={56}
                            height={56}
                            
                        />
                        <div className="flex flex-col ">
                            <BioType
                                className={`inter-h5-question-header-bold`}
                            >
                                Kyle L
                            </BioType>
                            <BioType className={`intake-subtitle text-weak`}>
                                Anaheim, CA
                            </BioType>
                        </div>
                    </div>

                    <BioType className={`intake-subtitle mt-5`}>
                        “When I take my B12 injections I get an almost immediate boost in energy. I used to be vitamin B12 and my energy levels suffered. Not anymore though!”
                    </BioType>

                    <div className="relative  w-[140px] h-[28px]  mb-4 mt-4">
                        <Image
                            alt="rating-stars"
                            src="/img/intake/wl/yellow-ratings-stars.svg"
                            fill
                            
                        />
                    </div>
                </div>
            </Paper>
            <AnimatedContinueButtonV3 onClick={pushToNextRoute} />

        </div>
        </>
    );
}
