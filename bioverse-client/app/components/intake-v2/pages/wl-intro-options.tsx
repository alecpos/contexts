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
    INTAKE_INPUT_TAILWIND,
    INTAKE_PAGE_BODY_TAILWIND,
    INTAKE_PAGE_HEADER_TAILWIND,
    INTAKE_PAGE_SUBTITLE_TAILWIND,
    TRANSITION_HEADER_TAILWIND,
} from '../styles/intake-tailwind-declarations';
import AnimatedContinueButton from '../buttons/AnimatedContinueButton';
import { Chip, Paper } from '@mui/material';
import Image from 'next/image';

interface GoodToGoProps {}

export default function WLIntroOptionsClientComponent({}: GoodToGoProps) {
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
                    <div className="flex flex-col  gap-[36px] animate-slideRight ">
                        <div className="w-full">
                            <BioType
                                className={`${INTAKE_PAGE_HEADER_TAILWIND} mb-2`}
                            >
                                Affordable options, for every body.
                            </BioType>
                            <div className="flex flex-col gap-4 w-full md:mb-[36px] mb-2">
                                <div className="flex gap-4 w-full">
                                    <div className="w-[50%] relative aspect-[1.1]">
                                        <Image
                                            src={'/img/intake/wl/options1.png'}
                                            alt={'Doctor Image'}
                                            fill
                                            objectFit="cover"
                                            unoptimized
                                        />
                                    </div>
                                    <div className="w-[50%] relative aspect-[1.1]">
                                        <Image
                                            src={'/img/intake/wl/options2.png'}
                                            alt={'Doctor Image'}
                                            fill
                                            objectFit="cover"
                                            unoptimized
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-4 w-full">
                                    {/* <div className="w-[50%] relative aspect-[1.1]">
                                        <Image
                                            src={'/img/intake/wl/options3.jpeg'}
                                            alt={'Doctor Image'}
                                            fill
                                            objectFit="cover"
                                            unoptimized
                                        />
                                    </div> */}

                                    <div className=" hidden md:flex w-[50%] relative aspect-[1.1] overflow-hidden">
                                        <Image
                                            src={'/img/intake/wl/options3.jpeg'}
                                            height={500}
                                            width={500}
                                            alt="Doctor Image"
                                            style={{
                                                objectPosition: '-80px -50px',
                                                transform: 'scale(1.3)',
                                            }}
                                            unoptimized
                                        />
                                    </div>
                                    <div className="md:hidden flex w-[50%] relative aspect-[1.1] overflow-hidden">
                                        <Image
                                            src={'/img/intake/wl/options3.jpeg'}
                                            height={225}
                                            width={225}
                                            alt="Doctor Image"
                                            style={{
                                                objectPosition: '-10px  -0px',
                                                transform: 'scale(2)',
                                            }}
                                            unoptimized
                                        />
                                    </div>
                                    <div className="w-[50%] relative aspect-[1.1]">
                                        <Image
                                            src={'/img/intake/wl/options4.png'}
                                            alt={'Doctor Image'}
                                            fill
                                            objectFit="cover"
                                            unoptimized
                                        />
                                    </div>
                                </div>
                            </div>

                            <BioType
                                className={`${INTAKE_PAGE_SUBTITLE_TAILWIND} md:mb-0 mb-[100px]`}
                            >
                                Access a range of treatment options, from
                                compounded semaglutide to brand name GLP-1
                                injections if you qualify.
                            </BioType>
                        </div>
                    </div>
                    <AnimatedContinueButton onClick={pushToNextRoute} />
                </div>
            </div>
        </>
    );
}
