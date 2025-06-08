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
    INTAKE_PAGE_SUBTITLE_TAILWIND,
} from '../styles/intake-tailwind-declarations';
import MultiSelectItem from '../questions/question-types/multi-select/multi-select-item';
import Image from 'next/image';
import { continueButtonExitAnimation } from '../intake-animations';

const NadBenefitsComponent = () => {
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
                <div className="flex flex-row justify-center">
                    <div className="flex flex-col gap-6 ">
                        <BioType
                            className={`${INTAKE_PAGE_HEADER_TAILWIND} w-full`}
                        >
                            NAD+ Injection Benefits
                        </BioType>

                        <div className="flex flex-col gap-6 md:mb-0 mb-[50px] ">
                            <div className="flex md:flex-row flex-col gap-6">
                                <div className="flex flex-row md:flex-col md:w-[168px] w-auto gap-2">
                                    <div className="flex">
                                        <div className="md:w-[168px] relative md:h-[168px] w-[156px] h-[156px] rounded-lg overflow-hidden">
                                            <Image
                                                src={
                                                    '/img/intake/nad-benefits/energy.jpeg'
                                                }
                                                alt={'Doctor Image'}
                                                fill
                                                objectFit="cover"
                                                unoptimized
                                            />
                                        </div>
                                    </div>
                                    <div className="flex md:justify-center items-center">
                                        <BioType
                                            className={`${INTAKE_PAGE_SUBTITLE_TAILWIND} text-left md:text-center`}
                                        >
                                            Increased energy
                                        </BioType>
                                    </div>
                                </div>
                                <div className="flex flex-row md:flex-col md:w-[168px] w-auto gap-2">
                                    <div className="flex">
                                        <div className="md:w-[168px] relative md:h-[168px] w-[156px] h-[156px] rounded-lg overflow-hidden">
                                            <Image
                                                src={
                                                    '/img/intake/nad-benefits/immune-function.jpeg'
                                                }
                                                alt={'Doctor Image'}
                                                fill
                                                objectFit="cover"
                                                unoptimized
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-1 items-center">
                                        <BioType
                                            className={`${INTAKE_PAGE_SUBTITLE_TAILWIND} text-left md:text-center`}
                                        >
                                            Increased immune function
                                        </BioType>
                                    </div>
                                </div>
                            </div>

                            <div className="flex md:flex-row flex-col gap-6">
                                <div className="flex flex-row md:flex-col md:w-[168px] w-auto gap-2">
                                    <div className="flex">
                                        <div className="md:w-[168px] relative md:h-[168px] w-[156px] h-[156px] rounded-lg overflow-hidden">
                                            <Image
                                                src={
                                                    '/img/intake/nad-benefits/regeneration.jpeg'
                                                }
                                                alt={'Doctor Image'}
                                                fill
                                                objectFit="cover"
                                                unoptimized
                                            />
                                        </div>
                                    </div>
                                    <div className="flex md:justify-center items-center">
                                        <BioType
                                            className={`${INTAKE_PAGE_SUBTITLE_TAILWIND} text-left md:text-center`}
                                        >
                                            Enhanced cellular rejeneration
                                        </BioType>
                                    </div>
                                </div>
                                <div className="flex flex-row md:flex-col md:w-[168px] w-auto gap-2">
                                    <div className="flex">
                                        <div className="md:w-[168px] relative md:h-[168px] w-[156px] h-[156px] rounded-lg overflow-hidden">
                                            <Image
                                                src={
                                                    '/img/intake/nad-benefits/clarity.jpeg'
                                                }
                                                alt={'Doctor Image'}
                                                fill
                                                objectFit="cover"
                                                unoptimized
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-1 items-center">
                                        <BioType
                                            className={`${INTAKE_PAGE_SUBTITLE_TAILWIND} text-left md:text-center`}
                                        >
                                            Improved Mental clarity
                                        </BioType>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            className={`w-full md:w-1/3 mx-auto md:flex md:justify-center  mt-2`}
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

export default NadBenefitsComponent;
