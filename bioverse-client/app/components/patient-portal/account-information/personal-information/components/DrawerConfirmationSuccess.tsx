'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { Button } from '@mui/material';
import { Dispatch, SetStateAction } from 'react';

interface Props {
    setOpenDrawer: Dispatch<SetStateAction<boolean>>;
    message: string;
    buttonText: string;
}

export default function DrawerConfirmationSuccess({
    setOpenDrawer,
    message,
    buttonText,
}: Props) {
    return (
        <div className='w-full flex flex-col space-y-9 mt-6'>
            <BioType className='h6 text-[24px] text-black'>{message}</BioType>
            <Button
                variant='contained'
                fullWidth
                sx={{ height: 52 }}
                onClick={() => setOpenDrawer(false)}
            >
                <BioType className='body1 text-white text-[16px]'>
                    {buttonText}
                </BioType>
            </Button>
        </div>
    );
}
