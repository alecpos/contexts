'use client';

import React, { useState } from 'react';
import BioType from '../../../../../../global-components/bioverse-typography/bio-type/bio-type';
import {
    INTAKE_PAGE_BODY_TAILWIND,
    INTAKE_PAGE_HEADER_TAILWIND,
    INTAKE_PAGE_SUBTITLE_TAILWIND,
} from '../../../../../styles/intake-tailwind-declarations';
import { Button, CircularProgress, Divider } from '@mui/material';
import Image from 'next/image';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useSearchParams } from 'next/navigation';

interface OverviewComponentProps {
    handleContinueButton: any;
    isButtonLoading: boolean;
    setSelectedProduct: any;
    color: string;
}

export default function MetforminOverviewComponent({
    handleContinueButton,
    isButtonLoading,
    setSelectedProduct,
    color,
}: OverviewComponentProps) {
    const searchParams = useSearchParams();

    let metforminPriceSentence: string;
    switch (searchParams.get('met-price-var')) {
        case '1':
            metforminPriceSentence =
                'BIOVERSE offers metformin for as little as $18.33/month!';
            break;
        case '2':
            metforminPriceSentence =
                'BIOVERSE offers metformin for as little as $55 for your first order!';
            break;
        default:
            metforminPriceSentence =
                'BIOVERSE offers metformin for as little as $5 for the first month!';
            break;
    }

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
                            src='/img/intake/wl/metformin.png'
                            fill
                            alt='semaglutide vial'
                            objectFit='cover'
                            
                        />
                    </div>
                    <p className='intake-v3-18px-20px-bold mt-3'>Metformin</p>

                    <p className='intake-v3-form-label-bold mt-[1.56rem] md:mt-[25px]'>
                        Overview
                    </p>
                    <p className='intake-v3-form-label text-weak mt-[0.56rem] md:mt-[9px]'>
                        {' '}
                        Metformin is a widely prescribed medication primarily
                        for Type 2 diabetes, known for its effectiveness in
                        improving insulin sensitivity and reducing blood sugar
                        levels.{' '}
                    </p>
                    <p className='intake-v3-form-label text-weak mt-[0.56rem] md:mt-[9px]'>
                        {' '}
                        Additionally, metformin has shown potential in aiding
                        weight management and improving cardiovascular health,
                        making it a valuable tool in addressing metabolic
                        disorders.
                    </p>

                    <p className='intake-v3-form-label-bold mt-[1.56rem] md:mt-[25px]'>
                        Results
                    </p>
                    <p className='intake-v3-form-label text-weak mt-[0.56rem] md:mt-[9px]'>
                        {' '}
                        Studies have shown that patients taking metformin
                        experienced a 5% decrease in body weight over one year.†
                    </p>

                    <p className='intake-v3-form-label-bold mt-[1.56rem] md:mt-[25px]'>
                        Cost
                    </p>
                    <p className='intake-v3-form-label text-weak mt-[0.56rem] md:mt-[9px]'>
                        {metforminPriceSentence} Unlike other healthcare
                        providers, we do not require insurance or prior
                        authorization. Your medication would be shipped to your
                        home at no additional cost if prescribed.
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
                    † When used in combination with a restricted calorie diet
                    and exercise program.
                </p>
            </div>
        </>
    );
}
