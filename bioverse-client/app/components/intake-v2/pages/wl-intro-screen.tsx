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

import Image from 'next/image';

interface GoodToGoProps {}

export default function WLIntroScreenComponent({}: GoodToGoProps) {
    const router = useRouter();
    const url = useParams();
    const searchParams = useSearchParams();
    const search = searchParams.toString();
    const fullPath = usePathname();
    const { product_href } = getIntakeURLParams(url, searchParams);

    const pushToNextRoute = () => {
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

    setTimeout(pushToNextRoute, 2000);

    return (
        <>
            <div className={` flex flex-col w-full`}>
                <div className="flex flex-col gap-8 animate-slideRight  min-w-[297px] md:max-w-[481px]">
                    <div className="relative md:h-[640px] h-[500px]">
                        <div className=" border-8 border-white border-solid rounded-[28px] absolute md:w-[47.1%] w-[47%] aspect-square top-0 left-[40.7%] bg-[#F4F4F4F4] overflow-hidden">
                            <Image
                                src="/img/intake/wl/vial-nad.png"
                                fill
                                alt={`Vial Image`}
                                className=""
                                unoptimized
                            />
                        </div>
                        <div className=" border-8 border-white border-solid rounded-[28px] absolute md:w-[55%] w-[57.6%] aspect-square md:top-[19.8%] top-[26%] bg-[#F4F4F4F4] overflow-hidden">
                            <Image
                                src="/img/patient-portal/wl-checkout3.jpeg"
                                fill
                                alt={`Couple Image`}
                                style={{
                                    objectFit: 'cover',
                                    objectPosition: '0 0',
                                    transform: 'scale(1.1)',
                                }}
                                className=""
                                unoptimized
                            />
                        </div>

                        <div className="hidden md:flex  border-8 border-white border-solid rounded-[28px] absolute md:w-[69.3%] w-[61%] aspect-square md:bottom-0 right-0 bg-[#F4F4F4F4] overflow-hidden">
                            <Image
                                src="/img/intake/doctor.jpeg"
                                fill
                                alt={`Doctor Image`}
                                style={{
                                    objectFit: 'cover',
                                    objectPosition: '-50px 0',
                                    transform: 'scale(1.2)',
                                }}
                                className=""
                                unoptimized
                            />
                        </div>
                        <div className=" md:hidden flex  border-8 border-white border-solid rounded-[28px] absolute md:w-[69.3%] w-[61%] aspect-square bottom-0 right-0 bg-[#F4F4F4F4] overflow-hidden">
                            <Image
                                src="/img/intake/doctor.jpeg"
                                fill
                                alt={`Doctor Image`}
                                style={{
                                    objectFit: 'cover',
                                    objectPosition: '-25px 0',
                                    transform: 'scale(1.2)',
                                }}
                                className=""
                                unoptimized
                            />
                        </div>
                    </div>
                    <div className=" relative w-full aspect-[3.9] mx-auto">
                        <Image
                            src={'/img/bioverse-logo-full.png'}
                            alt={'bioverse-banners'}
                            fill
                            objectFit="cover"
                            unoptimized
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
