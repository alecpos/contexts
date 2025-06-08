'use client';

import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams,
} from 'next/navigation';
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
import {
    B12_INJECTION_PRODUCT_HREF,
    GLUTATHIONE_INJECTION_PRODUCT_HREF,
} from '@/app/services/tracking/constants';
import VerticalSolidLineSVG from '../assets/vertical-line';
import VerticalLineSVGMobile from '../assets/vertical-line-mobile';

interface UpNextProps {}

export default function UpNext4HealthComponent({}: UpNextProps) {
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

        return router.push(
            `/intake/prescriptions/${url.product}/questions/${questions_array[0].question_id}?${newSearch}`
        );
    };

    const renderHealthText = (product: string) => {
        switch (product) {
            case B12_INJECTION_PRODUCT_HREF:
                return 'B12';
            case GLUTATHIONE_INJECTION_PRODUCT_HREF:
                return 'GSH';
        }
    };

    return (
        <>
            <div className={`justify-center flex animate-slideRight `}>
                <div className='flex flex-row gap-8'>
                    <div className='flex flex-col gap-4 mb-[100px] md:mb-0'>
                        <BioType className={`${INTAKE_PAGE_HEADER_TAILWIND}`}>
                            Nice! Looks like you&rsquo;re good to go on our end.
                        </BioType>

                        <BioType className={`${INTAKE_PAGE_SUBTITLE_TAILWIND}`}>
                            Next, answer some questions about you and your
                            lifestyle. It takes less than 5 minutes.
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
                                        height='62vw'
                                        key={'linemobilevert'}
                                    />
                                </div>

                                <div className='ml-0.5 mt-[77vw] md:mt-[245px] absolute'>
                                    <RadioButtonUncheckedIcon
                                        sx={{ color: '#AFAFAF' }}
                                    />
                                </div>

                                <div className='ml-3 hidden md:flex mt-[272px] absolute'>
                                    <VerticalSolidLineSVG
                                        height='18'
                                        key={'linedesktopvert'}
                                        color='#AFAFAF'
                                    />
                                </div>
                                <div className='ml-3 flex md:hidden mt-[83.5vw] absolute'>
                                    <VerticalLineSVGMobile
                                        height='22vw'
                                        key={'linemobilevert'}
                                        color='#AFAFAF'
                                    />
                                </div>

                                <div className='ml-0.5 mt-[89vw] md:mt-[285px] absolute'>
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
                                    <Paper className='flex flex-col md:flex-row w-auto  p-4 items-start md:items-center gap-4'>
                                        <div className='flex'>
                                            <div className='w-[114px] relative h-[76px]'>
                                                <Image
                                                    src={
                                                        '/img/intake/up-next/upnext4healthdoctor.jpeg'
                                                    }
                                                    alt={'Scientist Image'}
                                                    fill
                                                    sizes='(max-width:  1440px) calc(100vw -  2 * ((100vw -  456px) /  2)),  100vw'
                                                    unoptimized
                                                />
                                            </div>
                                        </div>
                                        <div className='flex flex-1'>
                                            <BioType
                                                className={`${INTAKE_PAGE_BODY_TAILWIND}`}
                                            >
                                                Tell us about your health
                                                history. Your provider will use
                                                this information to write your
                                                custom{' '}
                                                {renderHealthText(
                                                    url.product as string
                                                )}{' '}
                                                prescription, if medically
                                                appropriate.
                                            </BioType>
                                        </div>
                                    </Paper>
                                </div>
                                <BioType
                                    className={`mt-[1vw] md:mt-3.5 flex flex-row justify-start items-center text-[#AFAFAF] ${INTAKE_PAGE_BODY_TAILWIND}`}
                                >
                                    ID verification
                                </BioType>
                                <BioType
                                    className={`mt-[1vw] mb-[1vw] md:mt-1.5 flex flex-row justify-start items-center text-[#AFAFAF] ${INTAKE_PAGE_BODY_TAILWIND}`}
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
