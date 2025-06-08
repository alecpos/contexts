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
    INTAKE_PAGE_SUBTITLE_TAILWIND,
    TRANSITION_HEADER_TAILWIND,
} from '../styles/intake-tailwind-declarations';
import AnimatedContinueButton from '../buttons/AnimatedContinueButtonV3';
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
            <div className={`justify-center flex w-full `}>
                <div className="flex flex-col w-full">
                    <div className="flex flex-col  w-full my-[1.25rem] md:my-[48px]">
                        <BioType className={`inter-h5-question-header`}>
                            This is{' '}
                            <span className="text-[#6DB0CC] inter-h5-question-header-bold">your time</span>.
                            <br />
                            Weight loss{' '}
                            <span className="text-[#6DB0CC] inter-h5-question-header-bold">
                                for real change
                            </span>
                            .
                        </BioType>

                    </div>
                    <AnimatedContinueButton onClick={pushToNextRoute} />

                   
                </div>
            </div>
        </>
    );
}
