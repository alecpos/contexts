'use client';

import React, { useState } from 'react';
import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams,
} from 'next/navigation';
import { getNextIntakeRoute } from '@/app/utils/functions/intake-route-controller';
import { getIntakeURLParams } from '../intake-functions';
import BioType from '../../global-components/bioverse-typography/bio-type/bio-type';
import ContinueButtonV3 from '../buttons/ContinueButtonV3';
import { continueButtonExitAnimation } from '../intake-animations';

const NadBenefitsComponent = () => {
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

    // Benefits data structure with icons and text
    const benefits = [
        {
            id: 'energy',
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13 3L4 14H13L11 21L20 10H11L13 3Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            ),
            text: 'Increased Energy'
        },
        {
            id: 'immune',
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8 12H16" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 8V16" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            ),
            text: 'Increased immune function'
        },
        {
            id: 'regeneration',
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.4802 2.26L9.03023 8.6C8.94639 8.79955 8.81029 8.97145 8.63456 9.09523C8.45883 9.21901 8.2505 9.29 8.03023 9.3H2.44023C1.82023 9.36 1.40023 10.18 1.85023 10.59L7.09023 15.07C7.25397 15.2111 7.37568 15.3979 7.43911 15.6076C7.50254 15.8173 7.5051 16.041 7.44653 16.252L5.25023 22.68C5.06023 23.34 5.73023 23.87 6.25023 23.48L11.9202 19.18C12.1001 19.0483 12.3128 18.9774 12.5302 18.9774C12.7477 18.9774 12.9604 19.0483 13.1402 19.18L18.8102 23.49C19.3302 23.89 20.0002 23.35 19.8102 22.69L17.6102 16.26C17.5516 16.049 17.5542 15.8253 17.6176 15.6156C17.6811 15.4059 17.8028 15.2191 17.9665 15.078L23.2065 10.598C23.6565 10.188 23.2365 9.368 22.6165 9.308H17.0302C16.81 9.29731 16.602 9.22579 16.4264 9.10182C16.2508 8.97785 16.1148 8.80598 16.0302 8.607L13.5802 2.307C13.3702 1.677 12.5102 1.677 12.2902 2.307L11.5002 2.26H11.4802Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            ),
            text: 'Enhanced cellular regeneration'
        },
        {
            id: 'clarity',
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            ),
            text: 'Improved mental clarity'
        }
    ];

    return (
        <div className="w-full flex justify-center  mt-[1.25rem] md:mt-[48px]">
            <div className="flex flex-col items-center animate-slideRight w-full">
                <div className="flex flex-col w-full">
                    <h1 className=" inter_h5_regular">
                        NAD+ Injection Benefits
                    </h1>

                    {/* Benefits list - with constrained width and centered */}
                    <div className="flex flex-col gap-[1rem] md:gap-[20px] items-center mt-[1.25rem] md:mt-[48px] w-[20rem] md:w-[490px] ">
                        {benefits.map(benefit => (
                            <div 
                                key={benefit.id} 
                                className="flex items-center  rounded-[12px] bg-[#E4EEF2] w-[20rem] md:w-[490px] h-[4rem] md:h-[72px]"
                            >
                                <div className="flex-shrink-0 flex items-center justify-center pl-6">
                                    {benefit.icon}
                                </div>
                                <span className="inter_body_medium_regular ml-4">{benefit.text}</span>
                            </div>
                        ))}
                    </div>

                    {/* Continue button with the same width as benefit items */}
                    <div className="mt-[1.25rem] md:mt-[48px]  w-full">
                        <div className="w-full mx-auto flex justify-center animate-slideRight mt-4">
                            <ContinueButtonV3
                                onClick={pushToNextRoute}
                                buttonLoading={buttonLoading}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NadBenefitsComponent;