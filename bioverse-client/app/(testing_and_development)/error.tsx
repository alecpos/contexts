'use client';

import { useEffect } from 'react';
import BioType from '../components/global-components/bioverse-typography/bio-type/bio-type';
import { Button } from '@mui/material';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className='flex flex-col justify-center items-center mt-[150px] gap-4'>
            <BioType className='h5'>Sorry, we are having some trouble</BioType>
            <div className='flex flex-row gap-4'>
                <Button
                    variant='outlined'
                    onClick={() => {
                        reset();
                    }}
                >
                    Try Again
                </Button>
            </div>
        </div>
    );
}
