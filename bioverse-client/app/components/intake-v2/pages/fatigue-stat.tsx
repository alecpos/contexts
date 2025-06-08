'use client';

import React, { useState, useEffect } from 'react';
import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams,
} from 'next/navigation';
import { getNextIntakeRoute } from '@/app/utils/functions/intake-route-controller';
import { getIntakeURLParams } from '../intake-functions';
import BioType from '../../global-components/bioverse-typography/bio-type/bio-type';
import ContinueButton from '../buttons/ContinueButton';
import {
    INTAKE_PAGE_HEADER_TAILWIND,
    TRANSITION_HEADER_TAILWIND,
} from '../styles/intake-tailwind-declarations';
import { continueButtonExitAnimation } from '../intake-animations';

const FatigueStatComponent = () => {
    const router = useRouter();
    const url = useParams();
    const searchParams = useSearchParams();
    const search = searchParams.toString();
    const fullPath = usePathname();
    const { product_href } = getIntakeURLParams(url, searchParams);
    const [buttonLoading, setButtonLoading] = useState<boolean>(false);

    const pushToNextRoute = async () => {
        setButtonLoading(true);
        const nextRoute = getNextIntakeRoute(fullPath, product_href, search);
        const searchParams = new URLSearchParams(search);

        const newSearch = searchParams.toString();
        await continueButtonExitAnimation(150);
        router.push(
            `/intake/prescriptions/${product_href}/${nextRoute}?${newSearch}`,
        );
    };

    return (
        <>
            <div className={`justify-center flex animate-slideRight mx-auto`}>
                <div className="flex flex-col gap-8">
                    <div className="md:h-auto h-full flex flex-col gap-8 ">
                        <BioType className={`${INTAKE_PAGE_HEADER_TAILWIND} `}>
                            42% of Americans report feeling fatigued as early as
                            12 p.m.
                        </BioType>
                        <BioType className={`${INTAKE_PAGE_HEADER_TAILWIND} `}>
                            We are here to help you.
                        </BioType>
                    </div>

                    <div
                        className={`w-full md:w-1/3 mx-auto md:flex md:justify-center animate-slideRight`}
                    >
                        <ContinueButton
                            onClick={pushToNextRoute}
                            buttonLoading={buttonLoading}
                        />
                    </div>

                    {/* )} */}
                </div>
            </div>
        </>
    );
};

export default FatigueStatComponent;
