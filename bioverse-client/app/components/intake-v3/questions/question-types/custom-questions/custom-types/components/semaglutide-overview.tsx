'use client';

import React from 'react';
import { Button, CircularProgress } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Image from 'next/image';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';

interface OverviewComponentProps {
    handleContinueButton: any;
    isButtonLoading: boolean;
    setSelectedProduct: any;
    getPrice: (product_href: string) => string;
    color: string;
}

export default function SemaglutideOverviewComponent({
    handleContinueButton,
    isButtonLoading,
    setSelectedProduct,
    getPrice,
    color,
}: OverviewComponentProps) {
    return (
        <>
            <div
                className={`justify-center flex flex-col w-full md:max-w-[490px] pb-16 md:pb-0`}
            >
                <a
                    onClick={() => setSelectedProduct(null)}
                    className='cursor-pointer'
                >
                    <ArrowBackIcon className='text-slate-400' />
                </a>

                <p className='inter-h5-question-header mt-[0.7rem] md:mt-[12px]'>
                    Confirm your preferred treatment option
                </p>

                <p className={`intake-subtitle mt-[1rem] md:mt-[16px]`}>
                    While you should share your preferred treatment option, your
                    provider will ultimately only move forward with a treatment
                    option that is medically appropriate for you.
                </p>

                <div
                    className={`rounded-[12px] mt-[1.25rem] md:mt-[48px] p-[32px]`}
                    style={{ backgroundColor: color }}
                >
                    <div className='h-[200px] aspect-square relative mx-auto'>
                        <Image
                            src='/img/intake/wl/semaglutide/clear-semaglutide-syringe-cropped.png'
                            fill
                            alt='semaglutide vial'
                            objectFit='cover'
                            
                        />
                    </div>
                    <p className='intake-v3-18px-20px-bold mt-3'>Semaglutide</p>

                    <p className='intake-v3-form-label-bold mt-[1.56rem] md:mt-[25px]'>
                        Overview
                    </p>
                    <p className='intake-v3-form-label text-weak mt-[0.56rem] md:mt-[9px]'>
                        {' '}
                        Semaglutide is the generic name for Ozempic® and
                        Wegovy®, GLP-1 medications that are FDA-approved for
                        treatment of type 2 diabetes and weight loss
                        respectively.
                    </p>
                    <p className='intake-v3-form-label text-weak mt-[0.56rem] md:mt-[9px]'>
                        {' '}
                        Compounded semaglutide contains the same active
                        ingredient as the commercially available medications
                        Ozempic® and Wegovy®.*
                    </p>

                    <p className='intake-v3-form-label-bold mt-[1.56rem] md:mt-[25px]'>
                        Results
                    </p>
                    <p className='intake-v3-form-label text-weak mt-[0.56rem] md:mt-[9px]'>
                        {' '}
                        Studies have shown that once weekly semaglutide
                        injections led to 14.9% of body weight loss on average
                        over 68 weeks.†
                    </p>

                    <p className='intake-v3-form-label-bold mt-[1.56rem] md:mt-[25px]'>
                        Cost
                    </p>
                    <p className='intake-v3-form-label text-weak mt-[0.56rem] md:mt-[9px]'>
                        {' '}
                        BIOVERSE offers compounded semaglutide for as little as
                        ${getPrice(PRODUCT_HREF.SEMAGLUTIDE)}/month – much more
                        affordable than other healthcare providers. Unlike other
                        healthcare providers, we do not require insurance or
                        prior authorization. Your medication would be shipped to
                        your home at no additional cost.
                    </p>

                    <Button
                        variant='contained'
                        className='hidden md:block mt-[1.25rem] md:mt-[48px] w-full normal-case bg-black hover:bg-slate-800 rounded-[12px] intake-v3-disclaimer-text font-bold text-white h-[2.25rem] md:h-[36px]'
                        onClick={handleContinueButton}
                        disabled={isButtonLoading}
                    >
                        {isButtonLoading ? (
                            <CircularProgress size={24} />
                        ) : (
                            'Select as preferred medication and continue'
                        )}
                    </Button>
                    <Button
                        variant='contained'
                        className='md:hidden mt-[1.25rem] md:mt-[48px] w-full normal-case bg-black hover:bg-slate-800 rounded-[12px] intake-v3-disclaimer-text font-bold text-white h-[2.25rem] md:h-[36px]'
                        onClick={handleContinueButton}
                        disabled={isButtonLoading}
                    >
                        {isButtonLoading ? (
                            <CircularProgress size={24} />
                        ) : (
                            'Select and continue'
                        )}
                    </Button>
                </div>

                <p className='intake-v3-disclaimer-text text-weak mt-[1.25rem] md:mt-[48px]'>
                    * Compound formulations are not FDA-approved and may not
                    yield the same results as the commercially available
                    formulations. † When used in combination with a restricted
                    calorie diet and exercise program.
                </p>
            </div>
        </>
    );
}
