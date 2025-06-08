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
    INTAKE_PAGE_HEADER_TAILWIND,
    INTAKE_PAGE_SUBTITLE_TAILWIND,
    TRANSITION_HEADER_TAILWIND,
} from '../styles/intake-tailwind-declarations';
import AnimatedContinueButton from '../buttons/AnimatedContinueButton';
import Image from 'next/image';

interface GoodToGoProps {}

export default function WLStatComponent({}: GoodToGoProps) {
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
                    <div className="flex flex-col md:gap-12 gap-7 animate-slideRight">
                        <BioType className={`${TRANSITION_HEADER_TAILWIND} `}>
                            This is{' '}
                            <span className="text-primary">your time</span>.
                            <br />
                            Weight loss{' '}
                            <span className="text-primary">
                                for real change
                            </span>
                            .
                        </BioType>
                        {/* <AnimatedBioType
                            text={`Losing weight isn't as simple as just dieting and exercising.`}
                            className={'h5medium !font-twcmedium'}
                            gap_y={1}
                        /> */}

                        <div className="bg-[#E1E9EF] flex flex-col items-center text-center gap-6 px-4 py-6 md:px-6 md:py-9">
                            <div className="relative w-[25%] aspect-[1.3] mt-6 md:mb-4">
                                <Image
                                    alt="Group Icon"
                                    src="/img/intake/wl/group.svg"
                                    fill
                                    unoptimized
                                />
                            </div>
                            <BioType
                                className={`${TRANSITION_HEADER_TAILWIND}`}
                            >
                                About 1 in 3 adults achieved 20% weight loss.*
                            </BioType>
                        </div>

                        <AnimatedContinueButton onClick={pushToNextRoute} />

                        <BioType
                            className={`body1 text-[16px] text-textSecondary`}
                        >
                            *Source. In a study of 1,961 non-diabetic, obese or
                            overweight adults with weight-related medical
                            problems, 30% of participants prescribed Wegovy®
                            lost 20% or more weight vs. 2% of the placebo group.
                            Participants prescribed a reduced-calorie diet,
                            increased physical activity, and monthly nutritional
                            counseling. Novo Nordisk oversaw, designed, and
                            sponsored the study.
                        </BioType>
                    </div>
                </div>
            </div>
        </>
    );
}
