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
import ContinueButton from '../buttons/ContinueButton';
import {
    INTAKE_INPUT_TAILWIND,
    INTAKE_PAGE_BODY_TAILWIND,
    INTAKE_PAGE_HEADER_TAILWIND,
    INTAKE_PAGE_SUBTITLE_TAILWIND,
    TRANSITION_HEADER_TAILWIND,
} from '../styles/intake-tailwind-declarations';
import AnimatedContinueButton from '../buttons/AnimatedContinueButton';
import { Chip, Paper } from '@mui/material';
import Image from 'next/image';

interface GoodToGoProps {}

export default function WLIntroSpecialistsClientComponent({}: GoodToGoProps) {
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
            <div className={`justify-center flex`}>
                <div className="flex flex-col gap-8">
                    <div className="flex md:flex-col flex-col-reverse  gap-4 animate-slideRight ">
                        <div>
                            <BioType
                                className={`${INTAKE_PAGE_HEADER_TAILWIND} mb-4`}
                            >
                                Made by specialists, designed for you.
                            </BioType>

                            <BioType
                                className={`${INTAKE_PAGE_SUBTITLE_TAILWIND} md:mb-[36px]`}
                            >
                                Developed with weight loss specialists, our
                                program is customized to your needs and goals.
                            </BioType>
                        </div>
                        <div className="flex flex-col items-center relative mb-[50px]  md:mb-[36px]">
                            <Paper className="py-[36px] px-2 text-center flex  flex-col items-center md:w-[58.5%] w-[60%] md:h-[362px] h-[310px] ">
                                <BioType
                                    className={`${INTAKE_INPUT_TAILWIND} text-primary mb-2`}
                                >
                                    Your Weight Loss
                                    <br /> Care Team
                                </BioType>

                                <div className="relative w-9">
                                    <div className="absolute">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="29"
                                            height="28"
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
                                            width="29"
                                            height="28"
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
                                    <div className="absolute left-8">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="29"
                                            height="28"
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
                            <Paper className="absolute left-0 top-[33%] p-2 md:w-auto w-[180px]">
                                <div className="flex md:gap-4 gap-2 items-center">
                                    <div className="w-[70px] h-[70px] overflow-hidden rounded-full relative">
                                        <Image
                                            src="/img/intake/doctor.jpeg"
                                            fill
                                            alt="Doctor Image"
                                            style={{
                                                objectFit: 'cover',
                                                objectPosition: '-8px 8px',
                                                transform: 'scale(2.2)',
                                            }}
                                            unoptimized
                                        />
                                    </div>

                                    <div className="flex flex-col gap-2 md:w-[160px] w-[100px] ">
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
                                            className={`${INTAKE_PAGE_BODY_TAILWIND} !text-[.70rem] !leading-[13.732px]`}
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
                            <Paper className="absolute right-0 top-[58.8%] p-2 md:w-auto w-[180px]">
                                <div className="flex gap-4 items-center">
                                    <div className="w-[70px] h-[70px] overflow-hidden rounded-full relative">
                                        <Image
                                            src="/img/intake/wl/doctor5.png"
                                            fill
                                            alt="Doctor Image"
                                            style={{
                                                objectFit: 'cover',
                                                objectPosition: '-28px 13px', // Adjust to focus on the face
                                                transform: 'scale(1.6)',
                                            }}
                                            unoptimized
                                        />
                                    </div>

                                    <div className="flex flex-col gap-2 md:w-[160px] w-[100px]">
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
                                            }}
                                        />
                                        <BioType
                                            className={`${INTAKE_PAGE_BODY_TAILWIND} !text-[.70rem] !leading-[.85rem]`}
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
                            <Paper className="absolute left-[11%]  bottom-[-50px] p-2  md:w-auto  w-[180px]">
                                <div className="flex md:gap-4  gap-2 items-center">
                                    <div className="w-[70px] h-[70px] overflow-hidden rounded-full relative">
                                        <Image
                                            src="/img/intake/wl/doctor2.jpeg"
                                            fill
                                            alt="Doctor Image"
                                            style={{
                                                objectFit: 'cover',
                                                objectPosition: '-10px 0px',
                                                transform: 'scale(2.5)',
                                            }}
                                            unoptimized
                                        />
                                    </div>

                                    <div className="flex flex-col gap-2 md:w-[160px] w-[100px] ">
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
                                            className={`${INTAKE_PAGE_BODY_TAILWIND} !text-[.70rem] !leading-[13.732px]`}
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
                        </div>
                    </div>
                    <AnimatedContinueButton onClick={pushToNextRoute} />
                </div>
            </div>
        </>
    );
}
