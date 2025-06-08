'use client';

import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams,
} from 'next/navigation';

import React, { useState, useEffect } from 'react';

import Image from 'next/image';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import {
    INTAKE_PAGE_BODY_TAILWIND,
    INTAKE_PAGE_HEADER_TAILWIND,
    INTAKE_PAGE_SUBTITLE_TAILWIND,
} from '@/app/components/intake-v2/styles/intake-tailwind-declarations';
import { getIntakeURLParams } from '@/app/components/intake-v2/intake-functions';
import { LoadingButtonCustom } from '@/app/components/intake-v2/buttons/LoadingButtonCustom';

interface SkincareIngredientsProps {
    handleContinueButton: any;
    isButtonLoading: boolean;
}

export default function SkincareIngredientsComponent({
    handleContinueButton,
    isButtonLoading,
}: SkincareIngredientsProps) {
    const router = useRouter();
    const url = useParams();
    const searchParams = useSearchParams();
    const search = searchParams.toString();
    const fullPath = usePathname();
    const { product_href } = getIntakeURLParams(url, searchParams);

    return (
        <>
            <div className='flex w-full animate-slideRight'>
                <div className='flex flex-row gap-8'>
                    <div className='flex flex-col gap-6 md:gap-4 md:w-[433px]'>
                        <div>
                            <BioType
                                className={`${INTAKE_PAGE_HEADER_TAILWIND} !text-primary`}
                            >
                                93% of customers report their treatments to be
                                effective in addressing their skin concerns
                            </BioType>
                            <BioType
                                className={`${INTAKE_PAGE_SUBTITLE_TAILWIND}`}
                            >
                                We only use fresh + potent ingredients, loved
                                and trusted by dermatologists.
                            </BioType>
                        </div>

                        <div className='flex flex-col gap-4'>
                            <div className='flex flex-row gap-6 bg-[#FFF] rounded-xl overflow-hidden border border-solid border-[#BDBDBD] px-3 py-2 md:p-0'>
                                <div className='flex'>
                                    <div className='w-[104px] md:w-[176px] relative h-[88px] md:h-[144px] rounded-xl overflow-hidden'>
                                        <Image
                                            src={
                                                '/img/intake/skincare/tretinoin.png'
                                            }
                                            alt={'Tretinoin'}
                                            fill
                                            objectFit='cover'
                                            unoptimized
                                        />
                                    </div>
                                </div>
                                <div className='flex flex-1 items-center'>
                                    <BioType
                                        className={`${INTAKE_PAGE_BODY_TAILWIND} `}
                                    >
                                        <span className='!text-primary'>
                                            Tretinoin
                                        </span>{' '}
                                        revitalizes skin by accelerating healthy
                                        cell turnover and enhancing collagen
                                        production.
                                    </BioType>
                                </div>
                            </div>
                            <div className='flex flex-row gap-6 bg-[#FFF] rounded-xl overflow-hidden border border-solid border-[#BDBDBD] px-3 py-2 md:p-0'>
                                <div className='flex flex-1 items-center md:pl-4'>
                                    <BioType
                                        className={`${INTAKE_PAGE_BODY_TAILWIND} `}
                                    >
                                        <span className='!text-primary'>
                                            Niacinamide
                                        </span>{' '}
                                        helps to firm the skin by retaining
                                        moisture and smoothing the skin’s
                                        texture.
                                    </BioType>
                                </div>
                                <div className='flex'>
                                    <div className='w-[104px] md:w-[176px] relative h-[88px] md:h-[144px] rounded-xl overflow-hidden'>
                                        <Image
                                            src={
                                                '/img/intake/skincare/niacinamide.png'
                                            }
                                            alt={'Niacinamide'}
                                            fill
                                            objectFit='cover'
                                            unoptimized
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className='flex flex-row gap-6 bg-[#FFF] rounded-xl overflow-hidden border border-solid border-[#BDBDBD] px-3 py-2 md:p-0'>
                                <div className='flex'>
                                    <div className='w-[104px] md:w-[176px] relative h-[88px] md:h-[144px] rounded-xl overflow-hidden'>
                                        <Image
                                            src={
                                                '/img/intake/skincare/azelaic.png'
                                            }
                                            alt={'Azelaic Acid'}
                                            fill
                                            objectFit='cover'
                                            unoptimized
                                        />
                                    </div>
                                </div>
                                <div className='flex flex-1 items-center'>
                                    <BioType
                                        className={`${INTAKE_PAGE_BODY_TAILWIND} `}
                                    >
                                        <span className='!text-primary'>
                                            Azelaic acid
                                        </span>{' '}
                                        helps to reduce hyperpigmentation, acne
                                        scars, and inflammation for more even
                                        skin tone.
                                    </BioType>
                                </div>
                            </div>
                        </div>

                        <LoadingButtonCustom
                            onClick={handleContinueButton}
                            loading={isButtonLoading}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
