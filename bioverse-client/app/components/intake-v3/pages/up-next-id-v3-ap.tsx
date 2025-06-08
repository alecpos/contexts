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
import ContinueButtonV3 from '../buttons/ContinueButtonV3';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckIcon from '@mui/icons-material/Check';
import { continueButtonExitAnimation } from '../intake-animations';
import SvgIcon from '@mui/material/SvgIcon';
import Image from 'next/image';
export default function UpNextIdComponent() {
    const router = useRouter();
    const url = useParams();
    const searchParams = useSearchParams();
    const search = searchParams.toString();
    const fullPath = usePathname();
    const { product_href } = getIntakeURLParams(url, searchParams);
    const [buttonLoading, setButtonLoading] = useState<boolean>(false);

    const pushToNextRoute = async () => {
        setButtonLoading(true);
        const nextRoute = getNextIntakeRoute(fullPath, product_href, search);
        const searchParams = new URLSearchParams(search);
        // Remove the 'nu' parameter
        searchParams.delete('nu');
        // Construct the new search string without the 'nu' parameter
        const newSearch = searchParams.toString();
        await continueButtonExitAnimation(150);
        router.push(
            `/intake/prescriptions/${product_href}/${nextRoute}?${newSearch}`
        );
    };

    // Custom radio icon that matches the design in other components
    const CustomRadioCheckedIcon = (props: any) => (
        <SvgIcon {...props}>
            <circle cx="12" cy="12" r="9" fill="none" stroke="#6DB0CC" strokeWidth="2" />
            <circle cx="12" cy="12" r="2.5" fill="#6DB0CC" />
        </SvgIcon>
    );

    return (
        <>
            <div className="flex flex-col animate-slideRight mt-[1.25rem] md:mt-[48px] w-full max-w-[490px] ">
                {/* Header Section */}
                <div className="flex flex-col gap-[0.75rem] md:gap-[10px] mb-[1.25rem] md:mb-[48px]">
                    <BioType className="inter_h5_regular text-strong">
                        Next, submit ID verification
                    </BioType>

                    <BioType className="inter_body_regular text-weak">
                        We&apos;re required by telehealth laws to verify
                        your identity with a picture of you.
                    </BioType>
                </div>

                {/* Progress Steps with Vertical Line */}
                <div className="flex flex-col relative hidden md:flex">
                    {/* Step 1: Account Created */}
                    <div className="flex flex-row items-center mb-8 relative z-10">
                        <div className="mr-2 flex-shrink-0">
                            <CheckIcon sx={{ color: '#AFAFAF' }} />
                        </div>
                        <BioType className="inter_body_regular text-weak">
                            Account created
                        </BioType>
                    </div>
                    
                    {/* Step 2: Health History */}
                    <div className="flex flex-row items-center mb-8 relative z-10">
                        <div className="mr-2 flex-shrink-0">
                            <CheckIcon sx={{ color: '#AFAFAF' }} />
                        </div>
                        <BioType className="inter_body_regular text-weak">
                            Health history
                        </BioType>
                    </div>
                    
                    {/* Step 3: ID verification with custom radio icon and gradient line */}
                    <div className="flex flex-row items-center mb-8 relative">
                        {/* Gradient line below the ID verification step */}
                        <div className="absolute left-[13px] top-[28px] h-[calc(100%+12px)] w-[4px] bg-gradient-to-b from-[#6DB0CC] to-[#D7E3EB] z-0"></div>
                        
                        <div className="mr-2 flex-shrink-0 relative z-10">
                            <CustomRadioCheckedIcon sx={{ color: '#6DB0CC' }} />
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


                <div className='mt-[1.25rem] md:mt-[48px] relative w-full  block md:hidden h-[10.5rem]'>
                    <Image
                        src='/img/intake/nad-benefits/up-next-v3-ap.png'
                        alt='up next v3 ap'
                        fill
                        className='object-contain'
                    />
                </div>

                {/* Continue Button */}
                <div className="mt-10 md:mt-16 w-full flex justify-center">
                    <ContinueButtonV3 
                        onClick={pushToNextRoute} 
                        buttonLoading={buttonLoading}
                    />
                </div>
            </div>
        </>
    );
}