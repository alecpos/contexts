'use client';

import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams,
} from 'next/navigation';
import { getIntakeURLParams } from '../../../../intake-functions';
import React, { useState } from 'react';
import BioType from '../../../../../global-components/bioverse-typography/bio-type/bio-type';
import ContinueButton from '../../../../buttons/ContinueButton';
import {
    INTAKE_PAGE_BODY_TAILWIND,
    INTAKE_PAGE_HEADER_TAILWIND,
    INTAKE_PAGE_SUBTITLE_TAILWIND,
    TRANSITION_HEADER_TAILWIND,
} from '../../../../styles/intake-tailwind-declarations';
import AnimatedContinueButton from '../../../../buttons/AnimatedContinueButton';
import { Paper } from '@mui/material';
import Image from 'next/image';

interface GoodToGoProps {
    handleContinueButton: any;
    isButtonLoading: boolean;
}

export default function WLCustomerReviewTransition({
    handleContinueButton,
    isButtonLoading,
}: GoodToGoProps) {
    const router = useRouter();
    const url = useParams();
    const searchParams = useSearchParams();
    const search = searchParams.toString();
    const fullPath = usePathname();
    const { product_href } = getIntakeURLParams(url, searchParams);
    const [buttonLoading, setButtonLoading] = useState<boolean>(false);

    return (
        <div className="flex flex-col">
            <div className={`flex justify-center`}>
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col gap-8 animate-slideRight">
                        <BioType className={`${INTAKE_PAGE_HEADER_TAILWIND}`}>
                            We make weight loss medication affordable for you and ship
                            to your door.
                        </BioType>
                        <div className="rounded-xl bg-[#E1E9EF] h-auto">
                            <div className="px-4 md:px-6 pb-4 pt-[22px] ">
                                <div className="relative  w-[140px] h-[28px] mb-4">
                                    <Image
                                        alt="rating-stars"
                                        src="/img/intake/wl/rating-stars-group.svg"
                                        fill
                                        unoptimized
                                    />
                                </div>

                                <div
                                    className={`${INTAKE_PAGE_SUBTITLE_TAILWIND} !font-twcsemimedium`}
                                >
                                    &ldquo;After struggling with my weight for
                                    years and feeling like I&rsquo;d run out of
                                    options to make a change, I finally found
                                    BIOVERSE. No more diets or over-the-counter
                                    medications. It&rsquo;s only been 2 months
                                    and I&rsquo;ve already lost 16
                                    pounds.&rdquo;
                                </div>
                                <div className="flex justify-between mt-9 items-center">
                                    <div className="flex flex-col">
                                        <BioType
                                            className={`${INTAKE_PAGE_BODY_TAILWIND} `}
                                        >
                                            Rachel B.
                                        </BioType>
                                        <BioType
                                            className={`${INTAKE_PAGE_BODY_TAILWIND} text-textSecondary`}
                                        >
                                            BIOVERSE Customer
                                        </BioType>
                                    </div>
                                    <div>
                                        <div className="relative w-24 aspect-[3.9]">
                                            <Image
                                                src={
                                                    '/img/bioverse-logo-full.png'
                                                }
                                                alt={'bioverse-banners'}
                                                fill
                                                objectFit="cover"
                                                unoptimized
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full mt-4 md:flex md:justify-center">
                <ContinueButton
                    onClick={handleContinueButton}
                    buttonLoading={isButtonLoading}
                />
            </div>
        </div>
    );
}
