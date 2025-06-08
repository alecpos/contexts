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

import MultiSelectItemV3 from '../questions/question-types/multi-select/multi-select-item-v3';


const ImproveFunctionComponent = () => {
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
            <div className={`justify-center flex animate-slideRight mt-[1.25rem] md:mt-[48px]`}>
                <div className="flex flex-row gap-8">
                    <div className="flex flex-col gap-6">
                        <p className={`inter_h5_regular`}>
                            Are you looking to increase your energy and brain
                            function?
                        </p>

                        <div className="flex flex-col ">
                            <MultiSelectItemV3
                                option="Yes"
                                showCheck={false}
                                selected={false}
                                handleCheckboxChange={pushToNextRoute}
                                intake={false}
                            />
                            <MultiSelectItemV3
                                option="No"
                                showCheck={false}
                                selected={false}
                                handleCheckboxChange={pushToNextRoute}
                                intake={false}
                            />
                        </div>

                        {/* )} */}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ImproveFunctionComponent;
