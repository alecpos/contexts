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

export default function TreatmentEvolveComponent({}: UpNextProps) {
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
                    Treatment plans that evolve with you
                </BioType>
                <BioType className="intake-subtitle text-weak">
                    Get a plan customized to your goals and medical history,
                    including medication options and dosage adjustments if
                    needed.
                </BioType>
            </div>
            {/* mobile - sorry for this :) */}
            <div className="md:hidden flex items-start space-x-4 self-stretch justify-center w-full">
                <div className="flex flex-col h-[384px] justify-center space-y-4">
                    <div className="relative flex flex-col items-start gap-4 flex-[1_0_0] self-stretch p-0 rounded-[12px] bg-cover bg-center">
                        <Image
                            src="/img/intake/wl/semaglutide-evolve.png"
                            alt="Descriptive Alt Text"
                            width={152} // Adjust as needed
                            height={184} // Adjust as needed
                            className="rounded-[12px] w-[152px] h-[184px]"
                        />
                        <BioType className="absolute top-[6px] left-[6px] w-full intake-v3-disclaimer-text text-white">
                            GLP-1 Medications
                        </BioType>
                    </div>
                    <div className="relative flex flex-col items-start gap-[4 flex-[1_0_0] self-stretch p-0 rounded-[12px] bg-cover bg-center">
                        <Image
                            src="/img/intake/wl/phone-evolve.png"
                            alt="Descriptive Alt Text"
                            width={152} // Adjust as needed
                            height={184} // Adjust as needed
                            className="rounded-[12px]"
                        />
                        <BioType className="absolute top-[6px] left-[6px] w-[95%] intake-v3-disclaimer-text text-black">
                            Unlimited check-ins with medical providers
                        </BioType>
                    </div>
                </div>
                <div className="flex flex-col h-[384px] justify-center space-y-4">
                    <div className="relative flex flex-col items-start gap-4 flex-[1_0_0] self-stretch p-0 rounded-[12px] bg-cover bg-center">
                        <Image
                            src="/img/intake/wl/evolve-yellow-bg.png"
                            alt="Descriptive Alt Text"
                            width={152} // Adjust as needed
                            height={184} // Adjust as needed
                            className="rounded-[12px]"
                        />
                        <Image
                            src="/img/intake/wl/evolve-capsules.png"
                            alt="Descriptive Alt Text"
                            width={135} // Adjust as needed
                            height={152} // Adjust as needed
                            className="rounded-[12px] absolute top-[31px] left-[16px]"
                        />
                        <BioType className="absolute top-[6px] left-[6px] w-[90%] intake-v3-disclaimer-text text-black">
                            Medication Kits
                        </BioType>
                    </div>
                    <div className="relative flex flex-col items-start gap-4 flex-[1_0_0] self-stretch p-0 rounded-[12px] bg-cover bg-center">
                        <Image
                            src="/img/intake/wl/evolve-mouth.png"
                            alt="Descriptive Alt Text"
                            width={152} // Adjust as needed
                            height={184} // Adjust as needed
                            className="rounded-[12px]"
                        />
                        <BioType className="absolute top-[6px] left-[6px] w-[95%] intake-v3-disclaimer-text text-white">
                            Additional longevity & wellness prescriptions
                        </BioType>
                    </div>
                </div>
            </div>
            {/* desktop - sorry for this :) */}
            <div className="hidden md:flex items-start space-x-4 self-stretch justify-center w-full">
                <div className="flex flex-col h-[384px] justify-center space-y-4">
                    <div className="relative flex flex-col items-start gap-4 flex-[1_0_0] self-stretch p-0 rounded-[12px] bg-cover bg-center">
                        <Image
                            src="/img/intake/wl/evolve-semaglutide-desktop.png"
                            alt="Descriptive Alt Text"
                            width={237} // Adjust as needed
                            height={184} // Adjust as needed
                            className="rounded-[12px]"
                        />
                        <BioType className="absolute top-[6px] left-[6px] w-full intake-v3-disclaimer-text text-white">
                            GLP-1 Medications
                        </BioType>
                    </div>
                    <div className="relative flex flex-col items-start gap-[4 flex-[1_0_0] self-stretch p-0 rounded-[12px] bg-cover bg-center">
                        <Image
                            src="/img/intake/wl/evolve-phone-desktop.png"
                            alt="Descriptive Alt Text"
                            width={237} // Adjust as needed
                            height={184} // Adjust as needed
                            className="rounded-[12px]"
                        />
                        <BioType className="absolute top-[6px] left-[6px] w-[95%] intake-v3-disclaimer-text text-black">
                            Unlimited check-ins with medical providers
                        </BioType>
                    </div>
                </div>
                <div className="flex flex-col h-[384px] justify-center space-y-4">
                    <div className="relative flex flex-col items-start gap-4 flex-[1_0_0] self-stretch p-0 rounded-[12px] bg-cover bg-center">
                        <Image
                            src="/img/intake/wl/evolve-yellow-bg-desktop.png"
                            alt="Descriptive Alt Text"
                            width={237} // Adjust as needed
                            height={184} // Adjust as needed
                            className="rounded-[12px]"
                        />
                        <Image
                            src="/img/intake/wl/evolve-capsules-desktop.png"
                            alt="Descriptive Alt Text"
                            width={190} // Adjust as needed
                            height={168} // Adjust as needed
                            className="rounded-[12px] absolute top-[15px] left-[90px]"
                        />
                        <BioType className="absolute top-[6px] left-[6px] w-[90%] intake-v3-disclaimer-text text-black">
                            Medication Kits
                        </BioType>
                    </div>
                    <div className="relative flex flex-col items-start gap-4 flex-[1_0_0] self-stretch p-0 rounded-[12px] bg-cover bg-center">
                        <Image
                            src="/img/intake/wl/evolve-mouth-desktop.png"
                            alt="Descriptive Alt Text"
                            width={237} // Adjust as needed
                            height={184} // Adjust as needed
                            className="rounded-[12px]"
                        />
                        <BioType className="absolute top-[6px] left-[6px] w-[90%] intake-v3-disclaimer-text text-white">
                            Additional longevity & wellness prescriptions
                        </BioType>
                    </div>
                </div>
            </div>
            <ContinueButtonV3
                onClick={pushToNextRoute}
                buttonLoading={buttonLoading}
            />
        </div>
    );
}
