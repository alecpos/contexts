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
    INTAKE_PAGE_BODY_TAILWIND,
    INTAKE_PAGE_HEADER_TAILWIND,
    TRANSITION_HEADER_TAILWIND,
} from '../styles/intake-tailwind-declarations';
import AnimatedContinueButton from '../buttons/AnimatedContinueButton';
import { Paper } from '@mui/material';
import Image from 'next/image';

interface GoodToGoProps {}

export default function WLReviewsComponent({}: GoodToGoProps) {
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
                    <div className="flex flex-col gap-8 animate-slideRight mb-[100px]">
                        <BioType className={`${INTAKE_PAGE_HEADER_TAILWIND}`}>
                            <span className="!text-[#000000]">
                                With semaglutide, 1 in 3 adults lost
                            </span>{' '}
                            20% of their body weight.*
                        </BioType>
                        <Paper className="rounded-xl" elevation={6}>
                            <div className="px-4 md:px-6 pb-4 pt-[22px] ">
                                <div className="relative  w-[140px] h-[28px] mb-4">
                                    <Image
                                        alt="rating-stars"
                                        src="/img/intake/wl/rating-stars-group.svg"
                                        fill
                                        unoptimized
                                    />
                                </div>

                                <div className={`${INTAKE_PAGE_BODY_TAILWIND}`}>
                                    Semaglutide has helped me create a whole new
                                    life for myself. I&rsquo;ve lost 38 pounds,
                                    feel healthier, and feel so much more
                                    confident in my day-to-day life.
                                </div>
                                <div className="flex flex-col mt-9">
                                    <BioType
                                        className={`${INTAKE_PAGE_BODY_TAILWIND} `}
                                    >
                                        Crystal W.
                                    </BioType>
                                    <BioType
                                        className={`${INTAKE_PAGE_BODY_TAILWIND} text-textSecondary`}
                                    >
                                        Fort Lauderdale, FL
                                    </BioType>
                                </div>
                            </div>
                        </Paper>

                        <Paper className="rounded-xl" elevation={6}>
                            <div className="px-4 md:px-6 pb-4 pt-[22px] ">
                                <div className="relative  w-[140px] h-[28px]  mb-4">
                                    <Image
                                        alt="rating-stars"
                                        src="/img/intake/wl/rating-stars-group.svg"
                                        fill
                                        unoptimized
                                    />
                                </div>

                                <BioType
                                    className={`${INTAKE_PAGE_BODY_TAILWIND} mt-2 `}
                                >
                                    Medical Weight loss used to feel so far out
                                    of reach for me. Now, I&apos;ve lost 29
                                    pounds (so far)! Thanks for providing an
                                    easy, affordable option for semaglutide.
                                </BioType>
                                <div className="flex flex-col mt-9">
                                    <BioType
                                        className={`${INTAKE_PAGE_BODY_TAILWIND} `}
                                    >
                                        Michael R.
                                    </BioType>
                                    <BioType
                                        className={`${INTAKE_PAGE_BODY_TAILWIND} text-textSecondary`}
                                    >
                                        Chino Hills, CA
                                    </BioType>
                                </div>
                            </div>
                        </Paper>
                    </div>
                    <AnimatedContinueButton onClick={pushToNextRoute} />
                </div>
            </div>
        </>
    );
}
