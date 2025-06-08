'use client';

import { Button } from '@mui/material';
import { useEffect } from 'react';

import Image from 'next/image';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div
            className='flex flex-col  gap-4  z-10 '
            style={{
                width: '100vw',
            }}
        >
            <div className='md:hidden flex'>
                <Image
                    src='/img/error/error1.jpeg'
                    alt='error pic'
                    fill
                    style={{
                        objectFit: 'cover',
                        objectPosition: 'center',
                        zIndex: 1,
                        opacity: 0.6,
                    }}
                    unoptimized
                />
            </div>
            <div className='hidden md:flex'>
                <Image
                    src='/img/error/error1.jpeg'
                    alt='error pic'
                    fill
                    style={{
                        objectFit: 'cover',
                        objectPosition: 'center',
                        zIndex: 1,
                        opacity: 0.6,
                    }}
                    unoptimized
                />
            </div>

            <div className='max-w-[605px] md:ml-20 mt-10 z-20 md:pt-5 pt-20 px-5'>
                <BioType className='md:h3 h6 text-black'>
                    We seem to have encountered an error. Please refresh the
                    page or contact customer support.
                </BioType>
                <div className='w-full md:w-1/2 mt-2'>
                    <Button
                        variant='contained'
                        fullWidth
                        onClick={() => {
                            reset();
                        }}
                        sx={{ height: '52px' }}
                    >
                        Refresh Page
                    </Button>
                </div>
            </div>
        </div>
    );
}
