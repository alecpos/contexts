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
import {
    INTAKE_PAGE_BODY_TAILWIND,
    TRANSITION_HEADER_TAILWIND,
} from '../styles/intake-tailwind-declarations';
import Image from 'next/image';
import BioType from '../../global-components/bioverse-typography/bio-type/bio-type';
import { LoadingButtonCustom } from '../buttons/LoadingButtonCustom';

// TODO: Figure out how to add in dynamic price for the header
export default function SkincareIntroComponent() {
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
        return;
    };

    return (
        <div className={`justify-center flex animate-slideRight `}>
            <div className="flex flex-row gap-8">
                <div className="flex flex-col gap-[14px] md:w-[420px]">
                    <BioType
                        className={`${TRANSITION_HEADER_TAILWIND} text-left !text-primary`}
                    >
                        Anti-aging & anti-wrinkle Rx skincare made for you –
                        <br /> only $36/month
                    </BioType>

                    <div className="mx-auto">
                        <div className="w-[234px] relative h-[234px]">
                            <Image
                                src={'/img/intake/skincare/cream.png'}
                                alt={'Doctor Image'}
                                fill
                                unoptimized
                            />
                        </div>
                    </div>

                    <div className="flex flex-row  w-auto gap-2 md:gap-3">
                        <div className="flex">
                            <div className="w-[64px] relative h-[64px]">
                                <Image
                                    src={
                                        '/img/intake/skincare/anti-wrinkle.svg'
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
                                className={`${INTAKE_PAGE_BODY_TAILWIND} `}
                            >
                                Smooth fine lines and wrinkles
                            </BioType>
                        </div>
                    </div>
                    <div className="flex flex-row  w-auto gap-2 md:gap-3">
                        <div className="flex">
                            <div className="w-[64px] relative h-[64px]">
                                <Image
                                    src={'/img/intake/skincare/dark-spot.svg'}
                                    alt={'Doctor Image'}
                                    fill
                                    objectFit="cover"
                                    unoptimized
                                />
                            </div>
                        </div>
                        <div className="flex flex-1 items-center ">
                            <BioType
                                className={`${INTAKE_PAGE_BODY_TAILWIND} `}
                            >
                                Fade dark spots.
                            </BioType>
                        </div>
                    </div>

                    <div className="flex flex-row  w-auto gap-2 md:gap-3">
                        <div className="flex">
                            <div className="w-[64px] relative h-[64px]">
                                <Image
                                    src={
                                        '/img/intake/skincare/rejuvenation.svg'
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
                                className={`${INTAKE_PAGE_BODY_TAILWIND} `}
                            >
                                Rejuvenate your complexion with Rx skincare that
                                works.
                            </BioType>
                        </div>
                    </div>
                    <LoadingButtonCustom
                        onClick={pushToNextRoute}
                        loading={buttonLoading}
                    />
                </div>
            </div>
        </div>
    );
}
