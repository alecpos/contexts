'use client';

import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams,
} from 'next/navigation';
import { getNextIntakeRoute } from '@/app/utils/functions/intake-route-controller';
import { getIntakeURLParams } from '../intake-functions';
import React, { useState } from 'react';
import BioType from '../../global-components/bioverse-typography/bio-type/bio-type';
import {
    INTAKE_INPUT_TAILWIND,
    INTAKE_PAGE_BODY_TAILWIND,
    INTAKE_PAGE_HEADER_TAILWIND,
    INTAKE_PAGE_SUBTITLE_TAILWIND,
    TRANSITION_HEADER_TAILWIND,
} from '../styles/intake-tailwind-declarations';
import AnimatedContinueButtonV3 from '../buttons/AnimatedContinueButtonV3';
import { Chip, Paper } from '@mui/material';
import Image from 'next/image';

interface GoodToGoProps {}

export default function WLIntroOptionsClientComponent({}: GoodToGoProps) {
    const router = useRouter();
    const url = useParams();
    const searchParams = useSearchParams();
    const search = searchParams.toString();
    const fullPath = usePathname();
    const { product_href } = getIntakeURLParams(url, searchParams);
    const [buttonLoading, setButtonLoading] = useState<boolean>(false);

    const pushToNextRoute = () => {
        setButtonLoading(true);
        const nextRoute = getNextIntakeRoute(fullPath, product_href, search);
        const searchParams = new URLSearchParams(search);
        // Remove the 'nu' parameter
        searchParams.delete('nu');
        // Construct the new search string without the 'nu' parameter
        const newSearch = searchParams.toString();

        router.push(
            `/intake/prescriptions/${product_href}/${nextRoute}?${newSearch}`
        );
    };

    return (
        <>
            <div
                className={`justify-center flex mt-[1.25rem] md:mt-[48px] w-full md:max-w-[490px]`}
            >
                <div className='flex flex-col '>
                    <div className='flex flex-col  animate-slideRight mb-[1.25rem] md:mb-[48px]'>
                        <div className='w-full'>
                            <BioType className={`inter-h5-question-header `}>
                                Affordable treatments, for everybody.
                            </BioType>
                            <div className='flex flex-col gap-4 w-full my-[2.5rem] md:my-[40px]'>
                                <div className='flex gap-4 w-full'>
                                    <div className='w-[50%] relative aspect-[1.1]  rounded-lg'>
                                        <Image
                                            src={'/img/intake/wl/options1.png'}
                                            alt={'Doctor Image'}
                                            fill
                                            objectFit='cover'
                                            style={{
                                                borderRadius: '12px',
                                            }}
                                            
                                        />
                                    </div>
                                    <div className='w-[50%] relative aspect-[1.1] rounded-lg'>
                                        <Image
                                            src={
                                                '/img/intake/wl/happy_lady.png'
                                            }
                                            alt={'Doctor Image'}
                                            fill
                                            objectFit='cover'
                                            style={{
                                                borderRadius: '12px',
                                            }}
                                            
                                        />
                                    </div>
                                </div>
                                <div className='flex gap-4 w-full'>
                                    {/* <div className="w-[50%] relative aspect-[1.1]">
                                        <Image
                                            src={'/img/intake/wl/options3.jpeg'}
                                            alt={'Doctor Image'}
                                            fill
                                            objectFit="cover"
                                            unoptimized
                                        />
                                    </div> */}

                                    <div className=' hidden md:flex w-[50%]  aspect-[1.1] relative  overflow-hidden  rounded-lg'>
                                        <Image
                                            src={'/img/intake/wl/aiDoctor.jpg'}
                                            fill
                                            alt='Doctor Image'
                                            style={{
                                                objectFit: 'cover',
                                            }}
                                            
                                        />
                                    </div>
                                    <div className='md:hidden flex w-[50%] relative aspect-[1.1] overflow-hidden rounded-lg'>
                                        <Image
                                            src={'/img/intake/wl/aiDoctor.jpg'}
                                            fill
                                            alt='Doctor Image'
                                            style={{
                                                objectFit: 'cover',
                                            }}
                                            
                                        />
                                    </div>
                                    <div className='w-[50%] relative aspect-[1.1]  rounded-lg'>
                                        <Image
                                            src={'/img/intake/wl/options5.png'}
                                            alt={'Doctor Image'}
                                            fill
                                            objectFit='cover'
                                            style={{
                                                borderRadius: '12px',
                                            }}
                                            
                                        />
                                    </div>
                                </div>
                            </div>

                            <BioType
                                className={`intake-subtitle md:mb-0 mb-[100px]`}
                            >
                                Access a range of treatment options, from
                                compounded semaglutide to brand name GLP-1
                                injections if you qualify.
                            </BioType>
                        </div>
                    </div>
                    <AnimatedContinueButtonV3 onClick={pushToNextRoute} />
                </div>
            </div>
        </>
    );
}
