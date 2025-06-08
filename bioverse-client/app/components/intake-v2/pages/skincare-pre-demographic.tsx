'use client';

import React, { useState } from 'react';
import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams,
} from 'next/navigation';
import { getNextIntakeRoute } from '@/app/utils/functions/intake-route-controller';
import { getIntakeURLParams } from '../intake-functions';
import BioType from '../../global-components/bioverse-typography/bio-type/bio-type';
import {
    INTAKE_PAGE_BLACK_HEADER_TAILWIND,
    INTAKE_PAGE_HEADER_TAILWIND,
} from '../styles/intake-tailwind-declarations';
import { continueButtonExitAnimation } from '../intake-animations';
import { LoadingButtonCustom } from '../buttons/LoadingButtonCustom';

const SkincarePreDemographic = () => {
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
            <div>
                <div
                    className={`flex flex-col gap-6 md:gap-6 justify-start animate-slideRight`}
                >
                    <BioType className={`${INTAKE_PAGE_HEADER_TAILWIND}`}>
                        Good news! We can provide you with care.
                    </BioType>
                    <BioType className={`${INTAKE_PAGE_BLACK_HEADER_TAILWIND}`}>
                        Your anti-aging journey begins <br /> now!
                    </BioType>
                    <LoadingButtonCustom
                        onClick={pushToNextRoute}
                        loading={buttonLoading}
                    />
                </div>
            </div>
        </>
    );
};

export default SkincarePreDemographic;
