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
    INTAKE_PAGE_SUBTITLE_TAILWIND,
    TRANSITION_HEADER_TAILWIND,
} from '../styles/intake-tailwind-declarations';
import AnimatedContinueButton from '../buttons/AnimatedContinueButton';

interface GoodToGoProps {}

export default function WLStatementComponent({}: GoodToGoProps) {
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
                    <div className="flex flex-col gap-[28px] animate-slideRight ">
                        <BioType className={`${INTAKE_PAGE_HEADER_TAILWIND}`}>
                            We make GLP-1 medication affordable for you and ship
                            to your door.
                        </BioType>

                        <BioType
                            className={`${INTAKE_PAGE_SUBTITLE_TAILWIND}] `}
                        >
                            Medication prices may vary based on quantity and
                            dosing.
                        </BioType>

                        <AnimatedContinueButton onClick={pushToNextRoute} />
                    </div>
                </div>
            </div>
        </>
    );
}
