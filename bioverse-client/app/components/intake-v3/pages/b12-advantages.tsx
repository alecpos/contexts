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
import ContinueButtonV3 from '../buttons/ContinueButtonV3';
import {
    INTAKE_PAGE_HEADER_TAILWIND,
    TRANSITION_HEADER_TAILWIND,
} from '../styles/intake-tailwind-declarations';
import MultiSelectItemV3 from '../questions/question-types/multi-select/multi-select-item-v3';

const B12AdvantagesComponent = () => {
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

        const newSearch = searchParams.toString();
        router.push(
            `/intake/prescriptions/${product_href}/${nextRoute}?${newSearch}`,
        );
    };

    return (
        <>
            <div className={`justify-center flex animate-slideRight max-w-[490px] mt-[1.25rem] md:mt-[48px]`}>
                <div className="flex flex-row gap-8">
                    <div className="flex flex-col gap-[1.25rem] md:gap-[48px]">
                        <p className={`inter_h5_regular`}>
                            High doses of B12 can combat fatigue, enhance brain
                            function and support your nervous system.
                        </p>
                        <div
                            className={`w-full mx-auto relative animate-slideRight`}
                        >   
                            <div className='flex justify-center'>
                                <ContinueButtonV3
                                    onClick={pushToNextRoute}
                                    buttonLoading={buttonLoading}
                                />
                            </div>
                        </div>
                        {/* )} */}
                    </div>
                </div>
            </div>
        </>
    );
};

export default B12AdvantagesComponent;
