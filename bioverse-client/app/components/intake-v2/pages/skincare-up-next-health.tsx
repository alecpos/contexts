'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import BioType from '../../global-components/bioverse-typography/bio-type/bio-type';
import {
    INTAKE_PAGE_BODY_TAILWIND,
    INTAKE_PAGE_HEADER_TAILWIND,
    INTAKE_PAGE_SUBTITLE_TAILWIND,
} from '../styles/intake-tailwind-declarations';
import Image from 'next/image';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import VerticalGradientLineSVG from '../assets/vertical-gradient-line';
import CheckIcon from '@mui/icons-material/Check';
import { Paper } from '@mui/material';
import VerticalGradientLineSVGMobile from '../assets/vertical-gradient-line-mobile';
import { getQuestionsForProduct_with_Version } from '@/app/utils/database/controller/questionnaires/questionnaire';
import { continueButtonExitAnimation } from '../intake-animations';
import { LoadingButtonCustom } from '../buttons/LoadingButtonCustom';

interface UpNextProps {}

export default function SkincareUpNextHealthComponent({}: UpNextProps) {
    const router = useRouter();
    const url = useParams();
    const searchParams = useSearchParams();
    const search = searchParams.toString();
    const [loading, setLoading] = useState<boolean>(false);

    const fixPushToNextRouteQuestions = async () => {
        setLoading(true);
        const searchParams = new URLSearchParams(search);
        // Remove the 'nu' parameter
        searchParams.delete('nu');
        // Construct the new search string without the 'nu' parameter
        const newSearch = searchParams.toString();

        const questions_array = await getQuestionsForProduct_with_Version(
            url.product as string,
            0
        );
        await continueButtonExitAnimation(150);
        return router.push(
            `/intake/prescriptions/${url.product}/questions/${questions_array[0].question_id}?${newSearch}`
        );
    };

    return (
        <>
            <div className={`justify-center flex animate-slideRight`}>
                <div className='flex flex-row gap-8'>
                    <div className='flex flex-col gap-4 md:gap-[28px] mb-[50px]'>
                        <BioType className={`${INTAKE_PAGE_HEADER_TAILWIND}`}>
                            Up next, your health history
                        </BioType>

                        <BioType className={`${INTAKE_PAGE_SUBTITLE_TAILWIND}`}>
                            Answer some questions about you and your lifestyle
                            so your provider can curate the right formula for
                            you. It takes less than 5 minutes.
                        </BioType>

                        <div className='flex flex-row'>
                            <div className='flex flex-col justify-between gap-2'>
                                <CheckIcon sx={{ color: '#AFAFAF' }} />
                                <div className='mt-[13.5vw] md:mt-[57px] absolute'>
                                    <RadioButtonCheckedIcon color='primary' />
                                </div>

                                <div className='ml-3 hidden md:flex mt-[83px] absolute'>
                                    <VerticalGradientLineSVG
                                        height='200'
                                        key={'linedesktopvert'}
                                    />
                                </div>
                                <div className='ml-3 flex md:hidden mt-[20vw] absolute'>
                                    <VerticalGradientLineSVGMobile
                                        height='90vw'
                                        key={'linemobilevert'}
                                    />
                                </div>

                                {/* <div className="ml-0.4 mt-[77.8vw] md:mt-[258px] absolute">
                                    <RadioButtonUncheckedIcon
                                        sx={{
                                            color: '#AFAFAF',
                                            backgroundColor: '#FAFAFA',
                                            padding: 0,
                                            margin: 0,
                                        }}
                                    />
                                </div>
                                <div className="ml-0.4 mt-[91.3vw] md:mt-[315px] absolute">
                                    <RadioButtonUncheckedIcon
                                        sx={{
                                            color: '#AFAFAF',
                                            backgroundColor: '#FAFAFA',
                                        }}
                                    />
                                </div> */}
                                <div className='ml-[1.5px] mt-[104.8vw] md:mt-[280px] absolute'>
                                    <RadioButtonUncheckedIcon
                                        sx={{
                                            color: '#AFAFAF',
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
                                        className={`flex flex-row justify-start items-center ${INTAKE_PAGE_SUBTITLE_TAILWIND}`}
                                    >
                                        Health History
                                    </BioType>
                                    <Paper className='flex flex-col md:flex-row w-full h-[50vw] md:h-[140px] items-start md:items-center gap-2'>
                                        <div className='flex pl-4 pt-4 md:pt-0'>
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
                                        <div className='flex flex-1 pl-4 md:pl-2 pr-4 py-2'>
                                            <BioType
                                                className={`${INTAKE_PAGE_BODY_TAILWIND}`}
                                            >
                                                This is important because
                                                it&rsquo;ll be used by your
                                                provider to write your custom Rx
                                                prescription, if medically
                                                appropriate.
                                            </BioType>
                                        </div>
                                    </Paper>
                                </div>
                                {/* <div className="mt-4 flex flex-col gap-1">
                                    <BioType
                                        className={`flex flex-row justify-start items-center text-textSecondary ${INTAKE_PAGE_SUBTITLE_TAILWIND}`}
                                    >
                                        Upload photos
                                    </BioType>
                                </div>
                                <div className="mt-4 flex flex-col gap-1">
                                    <BioType
                                        className={`flex flex-row justify-start items-center text-textSecondary ${INTAKE_PAGE_SUBTITLE_TAILWIND}`}
                                    >
                                        ID Verification
                                    </BioType>
                                </div> */}
                                <div className='mt-8 flex flex-col gap-1'>
                                    <BioType
                                        className={`flex flex-row justify-start items-center text-textSecondary ${INTAKE_PAGE_SUBTITLE_TAILWIND}`}
                                    >
                                        Treatment Preview
                                    </BioType>
                                </div>
                            </div>
                        </div>
                        <LoadingButtonCustom
                            onClick={fixPushToNextRouteQuestions}
                            loading={loading}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
