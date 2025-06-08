import { FC } from 'react';
import Image from 'next/image';

import { Avatar, Paper } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import GenericOnboardingStage from './template';

const ImageCollection: FC = () => {
    return (
        <div className='animate-slideRight'>
            <div>
                <GenericOnboardingStage title='Great news - we have options that may work for you.' />
            </div>
            <div className='my-4'>
                <CheckmarkCircle />
            </div>
            <div className='grid grid-cols-2 gap-4'>
                <div className='flex items-center justify-center'>
                    <div className='rounded-md p-0 overflow-hidden relative w-24 h-32 sm:w-32 sm:h-40 md:w-64 md:h-80'>
                        <Image
                            src='/img/intake/ed/manWomanIntimate.png'
                            alt='Middle Image'
                            className='object-cover'
                            fill
                            unoptimized
                        />
                    </div>
                </div>

                <div className='grid grid-rows-2 gap-4'>
                    <Paper className='rounded-md p-0 overflow-hidden relative w-24 h-32 sm:w-32 sm:h-40 md:w-48 md:h-60 bg-[#C17D6A] left-4'>
                        <Image
                            src='/img/intake/ed/manTakingPinkTablet.png'
                            alt='Large Image'
                            className='object-cover'
                            fill
                            unoptimized
                        />
                    </Paper>
                    <Paper className='rounded-md p-0 overflow-hidden relative w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 bg-[#C17D6A]'>
                        <Image
                            src='/img/intake/ed/b-tablet.png'
                            alt='Small Image'
                            className='object-cover'
                            fill
                            unoptimized
                        />
                    </Paper>
                </div>
            </div>
        </div>
    );
};

const CheckmarkCircle: FC = () => {
    return (
        <Avatar
            sx={{
                bgcolor: 'transparent',
                border: '3px solid #286BA2',
                width: 60,
                height: 60,
            }}
        >
            <CheckIcon sx={{ color: '#286BA2', height: 50, width: 80 }} />
        </Avatar>
    );
};

export default ImageCollection;
