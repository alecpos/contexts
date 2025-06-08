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
    INTAKE_PAGE_BODY_TAILWIND,
    INTAKE_PAGE_HEADER_TAILWIND,
    INTAKE_PAGE_SUBTITLE_TAILWIND,
} from '../styles/intake-tailwind-declarations';
import Image from 'next/image';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import VerticalDivider from '../../global-components/dividers/verticalDivider/verticalDivider';
import VerticalGradientLineSVG from '../assets/vertical-gradient-line';
import CheckIcon from '@mui/icons-material/Check';
import { LinearProgress, Paper } from '@mui/material';
import VerticalGradientLineSVGMobile from '../assets/vertical-gradient-line-mobile';
import { getQuestionsForProduct_with_Version } from '@/app/utils/database/controller/questionnaires/questionnaire';
import AnimatedContinueButton from '../buttons/AnimatedContinueButton';

interface UpNextProps {}

export default function UpNextComponent({}: UpNextProps) {
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

    const fixPushToNextRouteQuestions = async () => {
        setButtonLoading(true);
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
                    <div className='flex flex-col gap-4'>
                        <BioType className={`${INTAKE_PAGE_HEADER_TAILWIND}`}>
                            Up next, your health history
                        </BioType>

                        <BioType className={`${INTAKE_PAGE_SUBTITLE_TAILWIND}`}>
                            Answer some questions about you and your lifestyle
                            to build your weight loss profile. It takes less
                            than 9 minutes.
                        </BioType>

                        <div className='flex flex-row'>
                            <div className='flex flex-col justify-between gap-2'>
                                <CheckIcon sx={{ color: '#AFAFAF' }} />
                                <div className='mt-[9.3vw] md:mt-[40px] absolute'>
                                    <RadioButtonCheckedIcon color='primary' />
                                </div>

                                <div className='ml-3 hidden md:flex mt-[65px] absolute'>
                                    <VerticalGradientLineSVG
                                        height='182'
                                        key={'linedesktopvert'}
                                    />
                                </div>
                                <div className='ml-3 flex md:hidden mt-[16vw] absolute'>
                                    <VerticalGradientLineSVGMobile
                                        height='55vw'
                                        key={'linemobilevert'}
                                    />
                                </div>

                                <div className='ml-0.5 mt-[70vw] md:mt-[245px] absolute'>
                                    <RadioButtonUncheckedIcon
                                        sx={{ color: '#AFAFAF' }}
                                    />
                                </div>
                            </div>
                            <div className='flex flex-col ml-2 gap-2 justify-between'>
                                <div className='mt-1'>
                                    <BioType
                                        className={`flex flex-row justify-start items-center text-[#AFAFAF] ${INTAKE_PAGE_BODY_TAILWIND}`}
                                    >
                                        Account Created
                                    </BioType>
                                </div>
                                <div className='mt-1 flex flex-col gap-1'>
                                    <BioType
                                        className={`flex flex-row justify-start items-center ${INTAKE_PAGE_BODY_TAILWIND}`}
                                    >
                                        Health History
                                    </BioType>
                                    <Paper className='flex flex-col md:flex-row w-full h-[50vw] md:h-[140px] items-start md:items-center gap-2'>
                                        <div className='flex px-4 pt-4 md:pt-0'>
                                            <div className='w-[114px] relative h-[76px]'>
                                                <Image
                                                    src={
                                                        '/img/intake/up-next/female-doctor-head-cropped.png'
                                                    }
                                                    alt={'Scientist Image'}
                                                    fill
                                                    sizes='(max-width:  1440px) calc(100vw -  2 * ((100vw -  456px) /  2)),  100vw'
                                                    unoptimized
                                                />
                                            </div>
                                        </div>
                                        <div className='flex flex-1 px-4 py-2'>
                                            <BioType
                                                className={`${INTAKE_PAGE_BODY_TAILWIND}`}
                                            >
                                                This is important because
                                                it&apos;ll be used by your
                                                provider to write your
                                                prescription, if medically
                                                appropriate.
                                            </BioType>
                                        </div>
                                    </Paper>
                                </div>
                                <BioType
                                    className={`mt-[1vw] mb-[1vw] md:mt-3 flex flex-row justify-start items-center text-[#AFAFAF] ${INTAKE_PAGE_BODY_TAILWIND}`}
                                >
                                    Treatment Preview
                                </BioType>
                            </div>
                        </div>

                        <AnimatedContinueButton
                            onClick={fixPushToNextRouteQuestions}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
