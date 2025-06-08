'use client';

import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams,
} from 'next/navigation';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckIcon from '@mui/icons-material/Check';
import { Paper } from '@mui/material';
import { getIntakeURLParams } from '@/app/components/intake-v2/intake-functions';
import SvgIcon from '@mui/material/SvgIcon';
import AnimatedContinueButton from '../buttons/AnimatedContinueButtonV3';
import BioType from '../../global-components/bioverse-typography/bio-type/bio-type';
import { getNextIntakeRoute } from '@/app/utils/functions/intake-route-controller';
interface UpNextHealthHistoryProps {
    
}

export default function UpNextHealthHistoryTransition({

}: UpNextHealthHistoryProps) {
    const router = useRouter();
    const url = useParams();
    const searchParams = useSearchParams();
    const search = searchParams.toString();
    const fullPath = usePathname();
    const { product_href } = getIntakeURLParams(url, searchParams);

    const CustomRadioCheckedIcon = (props: any) => (
        <SvgIcon {...props}>
            <circle cx="12" cy="12" r="9" fill="none" stroke="#6DB0CC" strokeWidth="2" />
            <circle cx="12" cy="12" r="2.5" fill="#6DB0CC" />
        </SvgIcon>
    );

    const pushToNextRoute = () => {
        const nextRoute = getNextIntakeRoute(fullPath, product_href, search);
        const searchParams = new URLSearchParams(search);
        // Remove the 'nu' parameter
        searchParams.delete('nu');
        // Construct the new search string without the 'nu' parameter
        const newSearch = searchParams.toString();
        console.log(newSearch);
        router.push(
            `/intake/prescriptions/${product_href}/${nextRoute}?${newSearch}`,
        );
    };


    return (
        <>
            <div className="flex flex-col animate-slideRight mt-[1.25rem] md:mt-[48px] w-full max-w-[490px] ">
                {/* Header Section */}
                <div className="flex flex-col gap-[0.75rem] md:gap-[12px] mb-[1.25rem] md:mb-[48px] ">
                    <BioType className="inter_h5_regular text-strong">
                        Up next, your health history
                    </BioType>

                    <BioType className="inter_body_regular text-weak">
                        Answer some questions about you and your lifestyle. It takes less than 5 minutes.
                    </BioType>
                </div>

                <div className=' relative w-full  block md:hidden h-[18rem]'>
                    <Image
                        src='/img/up-next-health-v3-ap.png'
                        alt='up next health v3 ap'
                        fill
                        className='object-contain'
                    />
                </div>

                {/* Progress Steps with Vertical Line */}
                <div className="flex flex-col relative hidden md:flex">
                    {/* Step 1: Account Created */}
                    <div className="flex flex-row items-center mb-[1.5rem] md:mb-[24px] relative z-10">
                        <div className="mr-2 flex-shrink-0">
                            <CheckIcon sx={{ color: '#AFAFAF' }} />
                        </div>
                        <BioType className="inter_body_regular text-weak">
                            Account created
                        </BioType>
                    </div>
                    
                    <div className="flex flex-col mb-8 relative">
    {/* Adjusted vertical line - shorter and more to the right */}
    <div className="absolute left-[13px] top-[27px] h-[calc(100%+12px)] w-[4px] bg-gradient-to-b from-[#6DB0CC] to-[#D7E3EB] z-0"></div>
    
    <div className="flex flex-row items-center mb-3 relative z-10">
        <div className="mr-2 flex-shrink-0">
            <CustomRadioCheckedIcon sx={{ color: '#6DB0CC' }} />
        </div>
        <BioType className="inter_body_regular text-strong">
            Health history
        </BioType>
    </div>
    
    <div className="ml-7 z-10 relative "> 
        <Paper className="flex flex-row w-full h-auto md:h-[120px] mt-2 items-center shadow-sm rounded-lg" style={{ width: 'calc(110% - 1rem)' }}>
                                <div className="flex ml-4 md:pt-0">
                                    <div className="w-[5rem] md:w-[100px] relative h-[5rem] md:h-[100px]">
                                        <Image
                                            src="/img/intake/up-next/female-doctor-head-cropped.png"
                                            alt="Doctor Image"
                                            fill
                                            style={{
                                                objectFit: 'cover',
                                                borderRadius: '8px',
                                            }}
                                            unoptimized
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-1 pl-4 md:pl-2 pr-4 py-3">
                                    <BioType className="inter_body_small_regular text-strong">
                                        This is important because it&apos;ll be used by your provider to write your custom Rx prescription, if medically appropriate.
                                    </BioType>
                                </div>
                            </Paper>
                        </div>
                    </div>
                    
                    {/* Step 3: ID verification */}
                    <div className="flex flex-row items-center mb-[1.5rem] md:mb-[24px] relative z-10">
                        <div className="relative mr-2 flex-shrink-0">
                            <RadioButtonUncheckedIcon sx={{ color: '#AFAFAF', position: 'relative' }} />
                        </div>
                        <BioType className="inter_body_regular text-weak">
                            ID verification
                        </BioType>
                    </div>
                    
                    {/* Step 4: Treatment Preview */}
                    <div className="flex flex-row items-center relative z-10">
                        <div className="mr-2 flex-shrink-0">
                            <RadioButtonUncheckedIcon sx={{ color: '#AFAFAF' }} />
                        </div>
                        <BioType className="inter_body_regular text-weak">
                            Treatment preview
                        </BioType>
                    </div>
                </div>

                <div className='mt-[1.25rem] md:mt-[48px] relative w-full flex flex-col hidden md:flex '>
                    {/* Continue Button */}
                    <AnimatedContinueButton onClick={pushToNextRoute} />
                </div>

                <div className='mt-[1.25rem] md:mt-[48px] relative w-full flex flex-col justify-center items-center md:hidden '>
                    {/* Continue Button */}
                    <AnimatedContinueButton onClick={pushToNextRoute} />
                </div>
                
            </div>
        </>
    );
}