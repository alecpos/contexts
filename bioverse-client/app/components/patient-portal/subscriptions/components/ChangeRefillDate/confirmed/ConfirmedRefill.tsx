'use client';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { convertEpochToDate } from '@/app/utils/functions/dates';
import { Button } from '@mui/material';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';

const ConfirmedRefill = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const date = searchParams.get('date');
    const refillDate: Date = convertEpochToDate(Number(date));

    return (
        <div className='container mx-auto w-full mt-[var(--nav-height)] max-w-[456px]'>
            <div className='w-full mt-9 md:mt-[160px] flex flex-col items-center'>
                <BioType className='h5'>We will see you later.</BioType>
                <BioType className='body1 mt-4'>
                    We&apos;ll process your next refill on{' '}
                    {refillDate.toLocaleDateString()}.
                </BioType>
                <div className='flex justify-center w-full mt-[28px] md:mb-[155px]'>
                    <Button
                        variant='contained'
                        className='w-full md:w-auto'
                        sx={{
                            height: '52px',
                        }}
                        onClick={() => router.push(`/portal/subscriptions`)}
                    >
                        BACK TO ACCOUNT
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmedRefill;
