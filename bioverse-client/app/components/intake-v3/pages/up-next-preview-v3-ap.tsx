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
import CheckIcon from '@mui/icons-material/Check';
import { continueButtonExitAnimation } from '../intake-animations';
import SvgIcon from '@mui/material/SvgIcon';

export default function UpNextPreviewComponent() {
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
        const newSearch = searchParams.toString();
        await continueButtonExitAnimation(150);
        router.push(
            `/intake/prescriptions/${product_href}/${nextRoute}?${newSearch}`,
        );
    };

    const CustomRadioCheckedIcon = (props: any) => (
        <SvgIcon {...props}>
            <circle cx="12" cy="12" r="9" fill="none" stroke="#6DB0CC" strokeWidth="2" />
            <circle cx="12" cy="12" r="2.5" fill="#6DB0CC" />
        </SvgIcon>
    );

    return (
        <>
            <div className="flex flex-col animate-slideRight mt-[1.25rem] md:mt-[48px] max-w-[426px] mx-auto">
                {/* Header Section */}
                <div className="flex flex-col mb-[2rem] md:mb-[32px]">
                    <BioType className="inter_h5_regular text-strong mb-[0.5rem]">
                        Last step, review your treatment
                    </BioType>
                </div>

                {/* Progress Steps with consistent left alignment */}
                <div className="flex flex-col pl-[2px] w-full">
                    {/* Step 1: Account Created */}
                    <div className="flex flex-row items-center mb-6 w-full">
                        <div className="mr-2 flex-shrink-0">
                            <CheckIcon sx={{ color: '#AFAFAF', fontSize: 20 }} />
                        </div>
                        <BioType className="inter_body_regular text-weak">
                            Account created
                        </BioType>
                    </div>
                    
                    {/* Step 2: Health History */}
                    <div className="flex flex-row items-center mb-6 w-full">
                        <div className="mr-2 flex-shrink-0">
                            <CheckIcon sx={{ color: '#AFAFAF', fontSize: 20 }} />
                        </div>
                        <BioType className="inter_body_regular text-weak">
                            Health history
                        </BioType>
                    </div>
                    
                    {/* Step 3: ID verification */}
                    <div className="flex flex-row items-center mb-6 w-full">
                        <div className="mr-2 flex-shrink-0">
                            <CheckIcon sx={{ color: '#AFAFAF', fontSize: 20 }} />
                        </div>
                        <BioType className="inter_body_regular text-weak">
                            ID verification
                        </BioType>
                    </div>
                    
                    {/* Step 4: Treatment Preview */}
                    <div className="flex flex-row items-center mb-6 w-full">
                        <div className="mr-2 flex-shrink-0">
                            <CustomRadioCheckedIcon sx={{ color: '#6DB0CC', fontSize: 20 }} />
                        </div>
                        <BioType className="inter_body_regular text-weak">
                            Treatment preview
                        </BioType>
                    </div>
                </div>

                {/* Continue Button aligned with progress steps */}
                <div className="mt-6 md:mt-12 w-full relative flex justify-center">
                    <ContinueButtonV3 
                        onClick={pushToNextRoute} 
                        buttonLoading={buttonLoading}
                    />
                </div>
            </div>
        </>
    );
}