'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { Button, Paper } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface Props {
    title: string;
    image_ref: string;
    description: string;
    deal: string;
    getStartedHref: string;
    learnMoreHref: string;
}

export default function PopularTreatmentItem({
    title,
    image_ref,
    description,
    deal,
    learnMoreHref,
    getStartedHref,
}: Props) {
    const router = useRouter();
    return (
        <Paper
            className='w-[264px] h-[470px] flex flex-col p-4 space-y-4 '
            elevation={2}
            sx={{
                backgroundColor: '#f6f9fb',
            }}
        >
            <BioType className='h6 text-[18px]'>{title}</BioType>
            <div className='w-full flex justify-center'>
                <Image
                    src={`${process.env.NEXT_PUBLIC_PDP_MAIN_IMAGE_KEY}${image_ref}`}
                    alt={title}
                    width={160}
                    height={160}
                    className=''
                    unoptimized
                />
            </div>
            <div className='w-full flex flex-col pt-2'>
                <BioType className='body1 text-black text-[18px]'>
                    {description}
                </BioType>
                <br />
                <BioType className='body1 text-black text-[18px]'>
                    {deal}
                </BioType>
            </div>
            <div className='w-full flex flex-col space-y-2'>
                <Button
                    onClick={() => router.push(getStartedHref)}
                    variant='contained'
                    fullWidth
                    sx={{ height: 36 }}
                >
                    <BioType className='body1 text-white text-[18px]'>
                        Get Started
                    </BioType>
                </Button>
                <Button
                    onClick={() => router.push(learnMoreHref)}
                    variant='outlined'
                    fullWidth
                    sx={{ height: 36 }}
                >
                    <BioType className='body1 text-[#286BA2] text-[18px]'>
                        Learn More
                    </BioType>
                </Button>
            </div>
        </Paper>
    );
}
