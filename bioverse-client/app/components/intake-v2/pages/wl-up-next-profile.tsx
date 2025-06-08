'use client';

import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams,
} from 'next/navigation';
import { getIntakeURLParams } from '../intake-functions';
import React, { useState } from 'react';
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
import VerticalGradientLineSVG from '../assets/vertical-gradient-line';
import CheckIcon from '@mui/icons-material/Check';
import { Paper } from '@mui/material';
import VerticalGradientLineSVGMobile from '../assets/vertical-gradient-line-mobile';
import { getQuestionsForProduct_with_Version } from '@/app/utils/database/controller/questionnaires/questionnaire';
import { continueButtonExitAnimation } from '../intake-animations';

interface UpNextProps {}

export default function WLUpNextProfileComponent({}: UpNextProps) {
    const router = useRouter();
    const url = useParams();
    const searchParams = useSearchParams();
    const search = searchParams.toString();
    const fullPath = usePathname();
    const { product_href } = getIntakeURLParams(url, searchParams);
    const [buttonLoading, setButtonLoading] = useState<boolean>(false);

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
        await continueButtonExitAnimation(150);
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
                            Nice! Looks like you&rsquo;re good to go on our end.
                        </BioType>

                        <BioType className={`${INTAKE_PAGE_SUBTITLE_TAILWIND}`}>
                            Next, answer some questions about you and your
                            lifestyle to complete your weight loss profile. It
                            takes less than 5 minutes.
                        </BioType>

                        <div className='flex flex-row'>
                            <div className='flex flex-col justify-between gap-2'>
                                <CheckIcon sx={{ color: '#AFAFAF' }} />
                                <div className='mt-[13.5vw] md:mt-[57px] absolute'>
                                    <RadioButtonCheckedIcon color='primary' />
                                </div>

                                <div className='ml-3 hidden md:flex mt-[83px] absolute'>
                                    <VerticalGradientLineSVG
                                        height='210'
                                        key={'linedesktopvert'}
                                    />
                                </div>
                                <div className='ml-3 flex md:hidden mt-[20vw] absolute'>
                                    <VerticalGradientLineSVGMobile
                                        height='75vw'
                                        key={'linemobilevert'}
                                    />
                                </div>

                                <div className='ml-0.4 mt-[75.0vw] md:mt-[230px] absolute'>
                                    <RadioButtonUncheckedIcon
                                        sx={{
                                            color: '#AFAFAF',
                                            backgroundColor: '#FAFAFA',
                                            padding: 0,
                                            margin: 0,
                                        }}
                                    />
                                </div>
                                <div className='ml-0.4 mt-[88.5vw] md:mt-[287px] absolute'>
                                    <RadioButtonUncheckedIcon
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
                                        className={`flex flex-row justify-start items-center ${INTAKE_PAGE_SUBTITLE_TAILWIND}`}
                                    >
                                        Weight Loss Profile
                                    </BioType>
                                    <Paper className='flex flex-col md:flex-row w-[90%] md:w-full items-start md:items-center gap-2 p-4'>
                                        <div className='flex '>
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
                                        <div className='flex flex-1 pl-4 md:pl-2 overflow-wrap break-word'>
                                            <BioType
                                                className={`${INTAKE_PAGE_BODY_TAILWIND}`}
                                            >
                                                Tell us about your experience
                                                with your weight loss journey.
                                                Your answers will help us better
                                                plan your treatment.
                                            </BioType>
                                        </div>
                                    </Paper>
                                </div>
                                <div className='mt-4 flex flex-col gap-1'>
                                    <BioType
                                        className={`flex flex-row justify-start items-center text-textSecondary ${INTAKE_PAGE_SUBTITLE_TAILWIND}`}
                                    >
                                        Health History
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
                            className={`w-full md:w-1/3 mx-auto md:flex md:justify-center `}
                        >
                            <ContinueButton
                                onClick={fixPushToNextRouteQuestions}
                                buttonLoading={buttonLoading}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
