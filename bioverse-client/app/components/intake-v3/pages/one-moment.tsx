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
import {
    INTAKE_PAGE_HEADER_TAILWIND,
    TRANSITION_HEADER_TAILWIND,
} from '../styles/intake-tailwind-declarations';
import ContinueButton from '../buttons/ContinueButtonV3';
import { continueButtonExitAnimation } from '../intake-animations';
import Image from 'next/image';

const OneMomentComponent = () => {
    const router = useRouter();
    const url = useParams();
    const searchParams = useSearchParams();
    const search = searchParams.toString();
    const fullPath = usePathname();
    const { product_href } = getIntakeURLParams(url, searchParams);

    useEffect(() => {
        const timer = setTimeout(async () => {
            const nextRoute = getNextIntakeRoute(fullPath, product_href, search);
            const searchParams = new URLSearchParams(search);
            const newSearch = searchParams.toString();
            await continueButtonExitAnimation(150);
            router.push(
                `/intake/prescriptions/${product_href}/${nextRoute}?${newSearch}`,
            );
        }, 5000);

        return () => clearTimeout(timer);
    }, [fullPath, product_href, search, router]);

    return (
        <>
            <div
                className={`justify-center flex animate-slideRight max-w-[456px] mt-12`}
            >
                <div className="flex flex-row gap-8">
                    <div className="flex flex-col gap-6">
                        <p className={`inter_h5_regular `}>
                        One moment! We&apos;re sending your prescription 
                        request to your medical provider.
                        </p>
                        
                        <div className='w-full aspect-square flex'>
                            <div className='relative flex-1 overflow-hidden'>
                                <Image
                                    src='/img/intake/wl/doctor4.png'
                                    fill
                                    className='object-cover'
                                    alt='Doctor Image'
                                    unoptimized
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default OneMomentComponent;