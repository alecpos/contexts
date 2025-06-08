'use client';

import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams,
} from 'next/navigation';
import { getNextIntakeRoute } from '@/app/utils/functions/intake-route-controller';
import React, { useState, useEffect } from 'react';
import BioType from '../../global-components/bioverse-typography/bio-type/bio-type';
import Image from 'next/image';
import { getIntakeURLParams } from '../../intake-v2/intake-functions';
import ContinueButtonV3 from '../buttons/ContinueButtonV3';

interface UpNextProps {}

export default function TreatmentSafetyComponent({}: UpNextProps) {
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
        <div className="flex flex-col gap-[20px] md:gap-12 flex-1 mt-[20px]">
            <div className="flex flex-col items-start gap-3 self-stretch">
                <BioType className={`inter-h5-question-header text-strong`}>
                    <span className="inter-h5-question-header-bold text-[#6FB1CD]">
                        Safety and quality
                    </span>{' '}
                    from medical experts
                </BioType>
                <BioType className="intake-subtitle text-weak">
                    BIOVERSE only works with U.S. based, FDA-regulated
                    pharmacies that uphold strict requirements and testing for
                    quality.
                </BioType>
            </div>
            {/* desktop */}
            <div className="hidden relative md:flex items-start space-x-4 self-stretch justify-center w-full">
                <Image
                    src="/img/intake/wl/treatment-safety-desktop.png"
                    alt="Descriptive Alt Text"
                    width={490} // Adjust as needed
                    height={431} // Adjust as needed
                    className="rounded-[12px] "
                />
            </div>
            {/* mobile - sorry for this :) */}
            <div className="md:hidden relative flex items-start space-x-4 self-stretch justify-center w-full">
                <Image
                    src="/img/intake/wl/treatment-safety-mobile.png"
                    alt="Descriptive Alt Text"
                    width={340} // Adjust as needed
                    height={431} // Adjust as needed
                    className="rounded-[12px] "
                />
            </div>
            <ContinueButtonV3
                onClick={pushToNextRoute}
                buttonLoading={buttonLoading}
            />
        </div>
    );
}
