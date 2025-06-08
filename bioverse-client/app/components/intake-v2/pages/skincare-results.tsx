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
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import {
    INTAKE_PAGE_BODY_TAILWIND,
    INTAKE_PAGE_HEADER_TAILWIND,
    INTAKE_PAGE_SUBTITLE_TAILWIND,
} from '@/app/components/intake-v2/styles/intake-tailwind-declarations';

import Image from 'next/image';
import LoadingButton from '../loading/loading-button';
import { LoadingButtonCustom } from '../buttons/LoadingButtonCustom';

interface SkincareResultsProps {}

export default function SkincareResultsComponent({}: SkincareResultsProps) {
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
            <div className={`justify-center flex animate-slideRight`}>
                <div className="flex flex-row gap-8">
                    <div className="flex flex-col gap-6 w-full md:w-[456px]">
                        <BioType
                            className={`${INTAKE_PAGE_HEADER_TAILWIND} !text-primary`}
                        >
                            Thousands of patients love our custom anti-aging Rx
                            cream because <u>it works</u>.
                        </BioType>

                        <div className="flex flex-row gap-4 justify-center">
                            <div className="flex">
                                <div
                                    className="w-[146.5px] md:w-[220px] relative h-[218px] md:h-[322px] rounded-xl overflow-hidden"
                                    style={{
                                        boxShadow:
                                            '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
                                    }}
                                >
                                    <Image
                                        src={
                                            '/img/intake/skincare/results1.jpeg'
                                        }
                                        alt={'Results'}
                                        fill
                                        objectFit="cover"
                                        unoptimized
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-4">
                                <div
                                    className="w-[146.5px] md:w-[220px] relative h-[101px] md:h-[153px] rounded-xl overflow-hidden"
                                    style={{
                                        boxShadow:
                                            '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
                                    }}
                                >
                                    <Image
                                        src={
                                            '/img/intake/skincare/results2.jpeg'
                                        }
                                        alt={'Results'}
                                        fill
                                        objectFit="cover"
                                        unoptimized
                                    />
                                </div>
                                <div
                                    className="w-[146.5px] md:w-[220px] relative h-[101px] md:h-[153px] rounded-xl overflow-hidden"
                                    style={{
                                        boxShadow:
                                            '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
                                    }}
                                >
                                    <Image
                                        src={
                                            '/img/intake/skincare/results3.jpeg'
                                        }
                                        alt={'Results'}
                                        fill
                                        objectFit="cover"
                                        unoptimized
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 md:gap[26px] md:mt-2">
                            <BioType
                                className={`${INTAKE_PAGE_SUBTITLE_TAILWIND}`}
                            >
                                Visible results include:
                            </BioType>
                            <div className="flex flex-col gap-2 md:gap-4 ml-8 md:ml-0 mb-[50px] md:mb-0">
                                <div className=" flex flex-col md:flex-row gap-2 md:gap-4">
                                    <div className="flex flex-row gap-4 md:gap-6 md:w-[220px]">
                                        <div className="flex">
                                            <div className="w-[48px] md:w-[64px] relative h-[48px] md:h-[64px] ">
                                                <Image
                                                    src={
                                                        '/img/intake/skincare/repairing.svg'
                                                    }
                                                    alt={'Repairing image'}
                                                    fill
                                                    objectFit="cover"
                                                    unoptimized
                                                />
                                            </div>
                                        </div>
                                        <div className="flex flex-1 items-center">
                                            <BioType
                                                className={`${INTAKE_PAGE_BODY_TAILWIND} `}
                                            >
                                                Enhanced skin radiance
                                            </BioType>
                                        </div>
                                    </div>
                                    <div className="flex flex-row gap-4 md:gap-6 md:w-[220px]">
                                        <div className="flex">
                                            <div className="w-[48px] md:w-[64px] relative h-[48px] md:h-[64px] ">
                                                <Image
                                                    src={
                                                        '/img/intake/skincare/regeneration.svg'
                                                    }
                                                    alt={'Regeneration mage'}
                                                    fill
                                                    objectFit="cover"
                                                    unoptimized
                                                />
                                            </div>
                                        </div>
                                        <div className="flex flex-1 items-center">
                                            <BioType
                                                className={`${INTAKE_PAGE_BODY_TAILWIND} `}
                                            >
                                                Diminished fine lines + wrinkles
                                            </BioType>
                                        </div>
                                    </div>
                                </div>
                                <div className=" flex flex-col md:flex-row gap-2 md:gap-4">
                                    <div className="flex flex-row gap-4 md:gap-6 md:w-[220px]">
                                        <div className="flex">
                                            <div className="w-[48px] md:w-[64px] relative h-[48px] md:h-[64px] ">
                                                <Image
                                                    src={
                                                        '/img/intake/skincare/moisturizer.svg'
                                                    }
                                                    alt={'Hydration Image'}
                                                    fill
                                                    objectFit="cover"
                                                    unoptimized
                                                />
                                            </div>
                                        </div>
                                        <div className="flex flex-1 items-center">
                                            <BioType
                                                className={`${INTAKE_PAGE_BODY_TAILWIND} `}
                                            >
                                                Boosts skin hydration
                                            </BioType>
                                        </div>
                                    </div>
                                    <div className="flex flex-row gap-4 md:gap-6 md:w-[220px]">
                                        <div className="flex">
                                            <div className="w-[48px] md:w-[64px] relative h-[48px] md:h-[64px] ">
                                                <Image
                                                    src={
                                                        '/img/intake/skincare/even-skin.svg'
                                                    }
                                                    alt={'Even Skin Tone image'}
                                                    fill
                                                    objectFit="cover"
                                                    unoptimized
                                                />
                                            </div>
                                        </div>
                                        <div className="flex flex-1 items-center">
                                            <BioType
                                                className={`${INTAKE_PAGE_BODY_TAILWIND} `}
                                            >
                                                Evens skin tone
                                            </BioType>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <LoadingButtonCustom
                            loading={buttonLoading}
                            onClick={pushToNextRoute}
                        ></LoadingButtonCustom>
                    </div>
                </div>
            </div>
        </>
    );
}
