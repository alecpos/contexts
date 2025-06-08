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
    INTAKE_PAGE_HEADER_TAILWIND,
    INTAKE_PAGE_SUBTITLE_TAILWIND,
} from '../styles/intake-tailwind-declarations';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import VerticalGradientLineSVG from '../assets/vertical-gradient-line';
import CheckIcon from '@mui/icons-material/Check';
import VerticalGradientLineSVGMobile from '../assets/vertical-gradient-line-mobile';
import { continueButtonExitAnimation } from '../intake-animations';
import { Paper } from '@mui/material';
import Image from 'next/image';

interface UpNextProps {}

export default function SkincareUpNextUploadComponent({}: UpNextProps) {
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
            `/intake/prescriptions/${product_href}/${nextRoute}?${newSearch}`,
        );
    };

    return (
        <>
            <div className={`justify-center flex animate-slideRight`}>
                <div className="flex flex-row gap-8">
                    <div className="flex flex-col gap-4 md:gap-[28px]">
                        <BioType className={`${INTAKE_PAGE_HEADER_TAILWIND}`}>
                            Next, upload photos.
                        </BioType>

                        <BioType className={`${INTAKE_PAGE_SUBTITLE_TAILWIND}`}>
                            Share photos of your concerns so your provider can
                            determine the right formula for you.
                        </BioType>

                        <div className="flex flex-row">
                            <div className="flex flex-col justify-between gap-2">
                                <CheckIcon sx={{ color: '#AFAFAF' }} />
                                <div className="mt-[13.5vw] md:mt-[57px] absolute">
                                    <CheckIcon sx={{ color: '#AFAFAF' }} />
                                </div>
                                <div className="mt-[27vw] md:mt-[114px] absolute">
                                    <RadioButtonCheckedIcon color="primary" />
                                </div>
                            </div>
                            <div className="flex flex-col ml-2 gap-2 justify-between">
                                <div className="mt-1">
                                    <BioType
                                        className={`flex flex-row justify-start items-center text-[#AFAFAF] ${INTAKE_PAGE_SUBTITLE_TAILWIND}`}
                                    >
                                        Account created
                                    </BioType>
                                </div>
                                <div className="mt-4 flex flex-col gap-1">
                                    <BioType
                                        className={`flex flex-row justify-start items-center text-[#AFAFAF] ${INTAKE_PAGE_SUBTITLE_TAILWIND}`}
                                    >
                                        Health history completed
                                    </BioType>
                                </div>
                                <div className="mt-4 flex flex-col gap-1">
                                    <BioType
                                        className={`flex flex-row justify-start items-center ${INTAKE_PAGE_SUBTITLE_TAILWIND}`}
                                    >
                                        Treatment Preview
                                    </BioType>
                                </div>
                            </div>
                        </div>

                        <Paper className="h-[108px] w-[350px] md:w-[400px] md:ml-10">
                            <div className="flex flex-row p-4 gap-8">
                                <div>
                                    <Image
                                        alt=""
                                        src={
                                            '/img/intake/skincare/skin-care-up-next-image-card.png'
                                        }
                                        width={114}
                                        height={76}
                                        unoptimized
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <BioType className="it-body md:itd-body">
                                        • Upload photos
                                    </BioType>
                                    <BioType className="it-body md:itd-body">
                                        • What you&apos;ll get
                                    </BioType>
                                    <BioType className="it-body md:itd-body">
                                        • Submit request
                                    </BioType>
                                </div>
                            </div>
                        </Paper>

                        <div
                            className={`w-full md:w-1/3 mx-auto md:flex md:justify-center animate-slideRight`}
                        >
                            <ContinueButton
                                onClick={pushToNextRoute}
                                buttonLoading={buttonLoading}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
