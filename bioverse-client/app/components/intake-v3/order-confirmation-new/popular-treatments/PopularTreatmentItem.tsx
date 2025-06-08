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
    bg_color: string;
}

export default function PopularTreatmentItem({
    title,
    image_ref,
    description,
    deal,
    learnMoreHref,
    getStartedHref,
    bg_color
}: Props) {
    const router = useRouter();

    return (
        <div
            style={{ backgroundColor: bg_color }}
            className=" h-[410px] min-w-[260px] max-w-[261px] flex flex-col p-4 md:p-5 rounded-xl bg-black justify-between"
        >

            <div className='w-full flex flex-col h-2/3 '>
                <div className='w-full flex justify-center h-3/5'>
                    <Image
                        src={`${process.env.NEXT_PUBLIC_PDP_MAIN_IMAGE_KEY}${image_ref}`}
                        alt={title}
                        layout="responsive"
                        width={160}
                        height={160}
                        className='object-contain'
                        unoptimized
                    />
                </div>

           
                <BioType className='inter-tight-bold text-[18px]'>{title}</BioType>

                <BioType className='inter-tight  text-slate-600 text-[18px] mt-1'>
                    {description}
                </BioType>
                <br />
                <BioType className='inter-tight mt-2 text-black text-[18px]'>
                    {deal}
                </BioType>
            </div>


            <div className='w-full flex flex-col md:flex-row gap-3 sm:gap-2 mt-9'>
                <Button
                    onClick={() => router.push(getStartedHref)}
                    variant='contained'
                    fullWidth
                    sx={{ height: 36, borderRadius: 3 }}
                    className='normal-case bg-black  inter-h5-constant-bold '
                >
                    <BioType className=' text-white text-[14px]'>
                        Get Started
                    </BioType>
                </Button>
                <Button
                    onClick={() => router.push(learnMoreHref)}
                    variant='outlined'
                    fullWidth
                    className='normal-case inter-h5-constant-bold '
                    sx={{ height: 36, 
                        border: '1px solid black',
                        backgroundColor: 'transparent',
                        borderRadius: 3,


                    }}
                >
                    <BioType className=' text-black text-[14px]'>
                        Learn More
                    </BioType>
                </Button>
            </div>
        </div>
    );
}
