'use client';

import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams,
} from 'next/navigation';
import { getNextIntakeRoute } from '@/app/utils/functions/intake-route-controller';
import { getIntakeURLParams } from '../intake-functions';
import React, { useState, useEffect } from 'react';
import BioType from '../../global-components/bioverse-typography/bio-type/bio-type';
import ContinueButton from '../buttons/ContinueButton';
import {
    INTAKE_PAGE_HEADER_TAILWIND,
    INTAKE_PAGE_SUBTITLE_TAILWIND,
} from '../styles/intake-tailwind-declarations';
import Image from 'next/image';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import VerticalGradientLineSVG from '../assets/vertical-gradient-line';
import CheckIcon from '@mui/icons-material/Check';
import VerticalGradientLineSVGMobile from '../assets/vertical-gradient-line-mobile';
import { getQuestionsForProduct_with_Version } from '@/app/utils/database/controller/questionnaires/questionnaire';
import { continueButtonExitAnimation } from '../intake-animations';

interface UpNextProps {}

export default function SkincareUpNextIdComponent({}: UpNextProps) {
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

    const fixPushToNextRouteQuestions = async () => {
        const searchParams = new URLSearchParams(search);
        // Remove the 'nu' parameter
        searchParams.delete('nu');
        // Construct the new search string without the 'nu' parameter
        const newSearch = searchParams.toString();

        const questions_array = await getQuestionsForProduct_with_Version(
            url.product as string,
            0
        );

        return router.push(
            `/intake/prescriptions/${url.product}/questions/${questions_array[0].question_id}?${newSearch}`
        );
    };

    return (
        <>
            <div className={`justify-center flex animate-slideRight`}>
                <div className='flex flex-row gap-8'>
                    <div className='flex flex-col gap-4 md:gap-[28px]'>
                        <BioType className={`${INTAKE_PAGE_HEADER_TAILWIND}`}>
                            Submit ID verification
                        </BioType>

                        <BioType className={`${INTAKE_PAGE_SUBTITLE_TAILWIND}`}>
                            Before we review your treatment,we need to verify
                            your identity.
                        </BioType>

                        <div className='flex flex-row'>
                            <div className='flex flex-col justify-between gap-2'>
                                <CheckIcon sx={{ color: '#AFAFAF' }} />
                                <div className='mt-[13.5vw] md:mt-[57px] absolute'>
                                    <CheckIcon sx={{ color: '#AFAFAF' }} />
                                </div>
                                <div className='mt-[27vw] md:mt-[114px] absolute'>
                                    <CheckIcon sx={{ color: '#AFAFAF' }} />
                                </div>

                                <div className='ml-3 hidden md:flex mt-[198px] absolute'>
                                    <VerticalGradientLineSVG
                                        height='50'
                                        key={'linedesktopvert'}
                                    />
                                </div>
                                <div className='ml-3 flex md:hidden mt-[47vw] absolute'>
                                    <VerticalGradientLineSVGMobile
                                        height='50'
                                        key={'linemobilevert'}
                                    />
                                </div>
                                <div className='ml-0.4 mt-[40.5vw] md:mt-[171px] absolute'>
                                    <RadioButtonCheckedIcon color='primary' />
                                </div>
                                <div className='ml-0.4 mt-[54vw] md:mt-[228px] absolute'>
                                    <RadioButtonUncheckedIcon
                                        color='primary'
                                        sx={{
                                            color: '#AFAFAF',
                                            backgroundColor: '#FAFAFA',
                                        }}
                                    />
                                </div>
                            </div>
                            <div className='flex flex-col ml-2 gap-2 justify-between'>
                                <div className='mt-1'>
                                    <BioType
                                        className={`flex flex-row justify-start items-center text-[#AFAFAF] ${INTAKE_PAGE_SUBTITLE_TAILWIND}`}
                                    >
                                        Account Created
                                    </BioType>
                                </div>
                                <div className='mt-4 flex flex-col gap-1'>
                                    <BioType
                                        className={`flex flex-row justify-start items-center text-[#AFAFAF] ${INTAKE_PAGE_SUBTITLE_TAILWIND}`}
                                    >
                                        Health History
                                    </BioType>
                                </div>
                                <div className='mt-4 flex flex-col gap-1'>
                                    <BioType
                                        className={`flex flex-row justify-start items-center text-[#AFAFAF] ${INTAKE_PAGE_SUBTITLE_TAILWIND}`}
                                    >
                                        Upload Photos
                                    </BioType>
                                </div>
                                <div className='mt-4 flex flex-col gap-1'>
                                    <BioType
                                        className={`flex flex-row justify-start items-center ${INTAKE_PAGE_SUBTITLE_TAILWIND}`}
                                    >
                                        ID Verification
                                    </BioType>
                                </div>
                                <div className='mt-4 flex flex-col gap-1'>
                                    <BioType
                                        className={`flex flex-row justify-start items-center text-textSecondary ${INTAKE_PAGE_SUBTITLE_TAILWIND}`}
                                    >
                                        Treatment Preview
                                    </BioType>
                                </div>
                            </div>
                        </div>

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
