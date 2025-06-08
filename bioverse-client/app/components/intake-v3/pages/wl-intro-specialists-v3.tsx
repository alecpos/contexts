'use client';

import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams,
} from 'next/navigation';
import { getNextIntakeRoute } from '@/app/utils/functions/intake-route-controller';
import React, { useState } from 'react';
import BioType from '../../global-components/bioverse-typography/bio-type/bio-type';
import { Chip, Paper } from '@mui/material';
import Image from 'next/image';
import AnimatedContinueButton from '../../intake-v2/buttons/AnimatedContinueButton';
import { getIntakeURLParams } from '../intake-functions';
import {
    INTAKE_PAGE_HEADER_TAILWIND,
    INTAKE_PAGE_SUBTITLE_TAILWIND,
    INTAKE_INPUT_TAILWIND,
    INTAKE_PAGE_BODY_TAILWIND,
} from '../../intake-v2/styles/intake-tailwind-declarations';
import AnimatedContinueButtonV3 from '../buttons/AnimatedContinueButtonV3';

interface GoodToGoProps {}

export default function WLIntroSpecialistsClientComponentV3({}: GoodToGoProps) {
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
            `/intake/prescriptions/${product_href}/${nextRoute}?${newSearch}`,
        );
    };

    return (
        <>
            <div className={`justify-center flex mt-[1.25rem]  md:mt-[48px]`}>
                <div className="flex flex-col gap-8 ">
                    <div className="flex flex-col animate-slideRight mb-3 pb-36 sm:pb-0">
                        <div className="">
                            <BioType
                                className={`inter-h5-question-header mb-[12px]`}
                            >
                                Made by specialists, designed for you.
                            </BioType>

                            <BioType
                                className={`intake-subtitle text-weak mb-[1.25rem] md:mb-[48px]`}
                            >
                                Developed with weight loss specialists, our
                                program is customized to your needs and goals.
                            </BioType>
                        </div>
                        <div className="flex flex-col items-center relative  w-5/6 md:w-[432px] mx-auto mb-[1.25rem] md:mb-[48px]">
                            <Paper className=" py-5 px-2 text-center flex flex-col items-center  h-[16.67rem] md:h-[362px] w-[11.65rem] md:w-[253px] ">
                                <BioType
                                    className={`inter-basic text-[0.829rem] md:text-[18px] mb-2 leading-[1.1rem] md:leading-6`}
                                >
                                    Your Weight Loss
                                    <br /> Care Team
                                </BioType>

                                <div className="relative w-[2.94rem] md:w-[64px] p-1">
                                    <div className="absolute ">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className='h-[1.29rem] md:h-[28px] z-1'
                                            viewBox="0 0 29 28"
                                            fill="none"
                                        >
                                            <circle
                                                cx="14.5"
                                                cy="14"
                                                r="13.5"
                                                fill="#EEEEEE"
                                                stroke="white"
                                            />
                                        </svg>
                                    </div>
                                    <div className="absolute left-4">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className='h-[1.29rem] md:h-[28px] z-1'

                                            viewBox="0 0 29 28"
                                            fill="none"
                                        >
                                            <circle
                                                cx="14.5"
                                                cy="14"
                                                r="13.5"
                                                fill="#EEEEEE"
                                                stroke="white"
                                            />
                                        </svg>
                                    </div>
                                    <div className="absolute left-7">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className='h-[1.29rem] md:h-[28px] z-10'

                                            viewBox="0 0 29 28"
                                            fill="none"
                                        >
                                            <circle
                                                cx="14.5"
                                                cy="14"
                                                r="13.5"
                                                fill="#EEEEEE"
                                                stroke="white"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </Paper>
                            <Paper className="absolute left-0 top-[33%] p-2  w-[10.36rem] md:w-[225px]   rounded-xl  ">
                            <div className="flex gap-4 items-center">
                                <div className="w-[4.19rem] md:w-[67px] h-[4.19rem] md:h-[67px] overflow-hidden rounded-full relative ">
                                    <Image
                                            src="/img/intake/doctor.jpeg"
                                            fill
                                            alt="Doctor Image"
                                            style={{
                                                objectFit: 'cover',
                                                objectPosition: '-8px 8px',
                                                transform: 'scale(2.2)',
                                            }}
                                            
                                        />
                                    </div>


                                    <div className="flex flex-col justify-between h-[3.07rem] w-[5.54rem] md:w-[160px]  ">
                                        <Chip
                                            variant="filled"
                                            size="medium"
                                            label={``}
                                            sx={{
                                                width: '71.75px',
                                                height: '10.5px',
                                                background:
                                                    'linear-gradient(90deg, #3B8DC5, #59B7C1)',
                                                color: 'white', // Optional: Set text color to white for better visibility
                                            }}
                                        />
                                        <Chip
                                            variant="filled"
                                            size="medium"
                                            label={``}
                                            sx={{
                                                background: '#E0E0E0',
                                                height: '10.5px',
                                                width: 'auto',
                                            }}
                                        />
                                        <BioType
                                            className={`inter-basic leading-[0.64] font-bold text-[0.55rem] md:text-[12px]`}
                                        >
                                            Board certified
                                        </BioType>
                                        <Chip
                                            variant="filled"
                                            size="medium"
                                            label={``}
                                            sx={{
                                                background: '#E0E0E0',
                                                height: '10.5px',
                                            }}
                                        />
                                    </div>
                                </div>
                            </Paper>
                            <Paper className="absolute right-0 top-[64%] md:top-[61%] p-2  w-[10.36rem] md:w-[225px]  rounded-xl ">
                                <div className="flex gap-4 items-center">
                                    <div className="w-[4.19rem] md:w-[67px] h-[4.19rem] md:h-[67px] overflow-hidden rounded-full relative ">
                                        <Image
                                            src="/img/intake/wl/doctor5.png"
                                            fill
                                            alt="Doctor Image"
                                            style={{
                                                objectFit: 'cover',
                                                objectPosition: '-28px 13px', // Adjust to focus on the face
                                                transform: 'scale(1.6)',
                                            }}
                                            
                                        />
                                    </div>


                                    <div className="flex flex-col justify-between h-[3.07rem] w-[5.54rem] md:w-[160px]  ">
                                        <Chip
                                            variant="filled"
                                            size="medium"
                                            label={``}
                                            sx={{
                                                width: '71.75px',
                                                height: '10.5px',
                                                background:
                                                    'linear-gradient(90deg, #3B8DC5, #59B7C1)',
                                                color: 'white', // Optional: Set text color to white for better visibility
                                            }}
                                        />
                                        <Chip
                                            variant="filled"
                                            size="medium"
                                            label={``}
                                            sx={{
                                                background: '#E0E0E0',
                                                height: '10.5px',
                                                width: 'auto',

                                            }}
                                        />
                                        <BioType
                                            className={`intake-v3-disclaimer-text font-bold text-[0.55rem] md:text-[12px]`}
                                            >
                                            Industry specialists
                                        </BioType>
                                        <Chip
                                            variant="filled"
                                            size="medium"
                                            label={``}
                                            sx={{
                                                background: '#E0E0E0',
                                                height: '10.5px',
                                            }}
                                        />
                                    </div>
                                </div>
                            </Paper>
                            <Paper className="absolute left-[4%] md:left-[11%] bottom-[-95px] sm:bottom-[-125px] md:bottom-[-50px] p-2  w-[10.36rem] md:w-[225px] rounded-lg">
                                <div className="flex md:gap-4  gap-2 items-center">
                                    <div className="w-[4.19rem] md:w-[67px] h-[4.19rem] md:h-[67px] overflow-hidden rounded-full relative ">
                                        <Image
                                            src="/img/intake/wl/doctor2.jpeg"
                                            fill
                                            alt="Doctor Image"
                                            style={{
                                                objectFit: 'cover',
                                                objectPosition: '-10px 0px',
                                                transform: 'scale(2.5)',
                                            }}
                                        />
                                    </div>

                                    <div className="flex flex-col justify-between h-[3.07rem] w-[5.54rem] md:w-[160px]  ">
                                        <Chip
                                            variant="filled"
                                            size="medium"
                                            label={``}
                                            sx={{
                                                width: '71.75px',
                                                height: '10.5px',
                                                background:
                                                    'linear-gradient(90deg, #3B8DC5, #59B7C1)',
                                                color: 'white', // Optional: Set text color to white for better visibility
                                            }}
                                        />
                                        <Chip
                                            variant="filled"
                                            size="medium"
                                            label={``}
                                            sx={{
                                                background: '#E0E0E0',
                                                height: '10.5px',
                                                width: 'auto',
                                            }}
                                        />
                                        <BioType
                                            className={`inter-basic leading-[0.64] font-bold text-[0.55rem] md:text-[12px]`}
                                            >
                                            24/7 support
                                        </BioType>
                                        <Chip
                                            variant="filled"
                                            size="medium"
                                            label={``}
                                            sx={{
                                                background: '#E0E0E0',
                                                height: '10.5px',
                                            }}
                                        />
                                    </div>
                                </div>
                            </Paper>
                        </div>
                    </div>
                    <AnimatedContinueButtonV3 onClick={pushToNextRoute} />
                </div>
            </div>
        </>
    );
}
