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
    INTAKE_PAGE_HEADER_TAILWIND,
    TRANSITION_HEADER_TAILWIND,
} from '../styles/intake-tailwind-declarations';
import AnimatedContinueButton from '../buttons/AnimatedContinueButton';

interface GoodToGoProps {}

export default function WLPreDemographicComponent({}: GoodToGoProps) {
    const router = useRouter();
    const url = useParams();
    const searchParams = useSearchParams();
    const search = searchParams.toString();
    const fullPath = usePathname();
    const { product_href } = getIntakeURLParams(url, searchParams);

    const pushToNextRoute = () => {
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
                    <div className="flex flex-col gap-8 animate-slideRight">
                        <BioType className={`${INTAKE_PAGE_HEADER_TAILWIND}`}>
                            Good news! We can provide you with care.
                        </BioType>
                        <BioType className={`${TRANSITION_HEADER_TAILWIND}`}>
                            Let&rsquo;s continue with some questions about you
                            and your lifestyle.
                        </BioType>
                    </div>
                    <AnimatedContinueButton onClick={pushToNextRoute} />
                </div>
            </div>
        </>
    );
}
