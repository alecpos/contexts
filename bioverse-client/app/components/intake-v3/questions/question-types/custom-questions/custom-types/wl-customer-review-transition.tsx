'use client';

import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams,
} from 'next/navigation';
import React, { useState } from 'react';
import BioType from '../../../../../global-components/bioverse-typography/bio-type/bio-type';
import { Paper } from '@mui/material';
import Image from 'next/image';
import ContinueButtonV3 from '@/app/components/intake-v3/buttons/ContinueButtonV3';
import { getIntakeURLParams } from '@/app/components/intake-v2/intake-functions';
import {
    INTAKE_PAGE_HEADER_TAILWIND,
    INTAKE_PAGE_SUBTITLE_TAILWIND,
    INTAKE_PAGE_BODY_TAILWIND,
} from '@/app/components/intake-v2/styles/intake-tailwind-declarations';

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
        <div className="flex flex-col mt-[1.25rem] md:mt-[48px]">
            <div className={`flex justify-center`}>
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col gap-8 animate-slideRight">
                        <BioType className={`inter-h5-question-header`}>
                            You&apos;re in good company
                        </BioType>
                        <div className="rounded-xl bg-white h-auto" style={{ border: '1px solid #E5E5E5' }}>
                            <div className="px-4 md:px-6 pb-4 pt-[22px] flex flex-col gap-4 ">
                                <div className="flex flex-row gap-3">
                                    <Image alt="Michael R profile pic" src='/img/intake/wl/testimonial_woman2.png' width={56} height={56} unoptimized />
                                    <div className="flex flex-col ">
                                            <BioType
                                                className={`inter-h5-question-header-bold`}
                                            >
                                                Rachel B,
                                            </BioType>
                                            <BioType
                                                className={`intake-subtitle text-weak`}
                                            >
                                                Bioverse Customer
                                            </BioType>
                                    </div>
                                </div>

                                <div
                                    className={`intake-subtitle text-black`}
                                >
                                    &ldquo;After struggling with my weight for
                                    years and feeling like I&rsquo;d run out of
                                    options to make a change, I finally found
                                    BIOVERSE. No more diets or over-the-counter
                                    medications. It&rsquo;s only been 2 months
                                    and I&rsquo;ve already lost 16
                                    pounds.&rdquo;
                                </div>

                                <div className="relative  w-[140px] h-[28px] mb-4">
                                    <Image
                                        alt="rating-stars"
                                        src="/img/intake/wl/yellow-ratings-stars.svg"
                                        fill
                                        unoptimized
                                    />
                                </div>
                               
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <p className='intake-subtitle text-weak mt-3'>Medication prices may vary based on quantity and dosing.</p>
            <div className="w-full mt-[1.25rem] md:mt-[48px] md:flex md:justify-center">
                <ContinueButtonV3
                    onClick={handleContinueButton}
                    buttonLoading={isButtonLoading}
                />
            </div>
        </div>
    );
}
