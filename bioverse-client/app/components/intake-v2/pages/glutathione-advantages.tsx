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
import MultiSelectItem from '../questions/question-types/multi-select/multi-select-item';

const GlutathioneAdvantagesComponent = () => {
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
            <div className={`justify-center flex animate-slideRight`}>
                <div className="flex flex-row gap-8">
                    <div className="flex flex-col gap-6">
                        <BioType className={`${INTAKE_PAGE_HEADER_TAILWIND}`}>
                            High doses of glutathione can
                            enhance energy, immunity, well-being, mood, and
                            significantly improve the appearance of skin.
                        </BioType>
                        <div
                            className={`w-full mx-auto  md:justify-center animate-slideRight`}
                        >
                            <ContinueButton
                                onClick={pushToNextRoute}
                                buttonLoading={buttonLoading}
                            />
                        </div>
                        {/* )} */}
                    </div>
                </div>
            </div>
        </>
    );
};

export default GlutathioneAdvantagesComponent;
