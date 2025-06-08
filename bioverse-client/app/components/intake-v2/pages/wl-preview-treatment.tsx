'use client';

import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams,
} from 'next/navigation';
import { getNextIntakeRoute } from '@/app/utils/functions/intake-route-controller';
import React, { useState, useEffect } from 'react';
import BioType from '../../global-components/bioverse-typography/bio-type/bio-type';
import Image from 'next/image';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import VerticalDivider from '../../global-components/dividers/verticalDivider/verticalDivider';
import CheckIcon from '@mui/icons-material/Check';
import { LinearProgress, Paper } from '@mui/material';
import {
    getFirstQuestionAfterPreQuestions,
    getQuestionsForProduct_with_Version,
} from '@/app/utils/database/controller/questionnaires/questionnaire';
import VerticalGradientLineSVG from '../../intake-v2/assets/vertical-gradient-line';
import VerticalGradientLineSVGMobile from '../../intake-v2/assets/vertical-gradient-line-mobile';
import AnimatedContinueButton from '../../intake-v2/buttons/AnimatedContinueButton';
import { getIntakeURLParams } from '../../intake-v2/intake-functions';
import {
    INTAKE_PAGE_HEADER_TAILWIND,
    INTAKE_PAGE_SUBTITLE_TAILWIND,
    INTAKE_PAGE_BODY_TAILWIND,
} from '../../intake-v2/styles/intake-tailwind-declarations';
import VerticalGradientLineSVGV3 from '../../intake-v2/assets/vertical-gradient-line-v3';
import VerticalGradientLineSVGMobileV3 from '../../intake-v2/assets/vertical-gradient-line-mobile-v3';
import { VWO_TEST_QUESTIONNAIRES_VERSION_MAPPINGS } from '../../intake-v2/constants/route-constants';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import { AB_TESTS_IDS } from '../../intake-v2/types/intake-enumerators';
import {
    getActiveVWOTestIDForQuestionnaire,
    getVersionForActiveVWOTestID,
} from '@/app/utils/functions/client-utils';
import AnimatedContinueButtonV3 from '../../intake-v3/buttons/AnimatedContinueButtonV3';

interface UpNextProps {}

export default function WLPreviewTreatmentComponent({}: UpNextProps) {
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

    return (
        <>
            <div
                className={`justify-center flex animate-slideRight mt-[1.25rem] md:mt-[48px] mb-16 md:mb-0`}
            >
                <div className='flex flex-row'>
                    <div className='flex flex-col gap-4'>
                        <div className='flex flex-col gap-[12px]'>
                            <BioType
                                className={`inter-h5-question-header text-strong`}
                            >
                                And last, let&apos;s preview your treatment
                            </BioType>
                        </div>

                        <div className='flex flex-row mb-2 md:mb-5'>
                            <div className='flex flex-col justify-between gap-2 mt-2 md:mt-0'>
                                <div className='mt-[0px] md:mt-[7px]'>
                                    <svg
                                        xmlns='http://www.w3.org/2000/svg'
                                        width='25'
                                        height='25'
                                        viewBox='0 0 25 25'
                                        fill='none'
                                    >
                                        <path
                                            d='M20.5 6.47144L9.5 17.4714L4.5 12.4714'
                                            stroke='#4D4D4D'
                                            stroke-opacity='0.45'
                                            stroke-width='1.5'
                                            stroke-linecap='round'
                                            stroke-linejoin='round'
                                        />
                                    </svg>
                                </div>
                                <div className='mt-[53px] md:mt-[67px] absolute'>
                                    <svg
                                        xmlns='http://www.w3.org/2000/svg'
                                        width='25'
                                        height='25'
                                        viewBox='0 0 25 25'
                                        fill='none'
                                    >
                                        <path
                                            d='M20.5 6.47144L9.5 17.4714L4.5 12.4714'
                                            stroke='#4D4D4D'
                                            stroke-opacity='0.45'
                                            stroke-width='1.5'
                                            stroke-linecap='round'
                                            stroke-linejoin='round'
                                        />
                                    </svg>
                                </div>
                                <Image
                                    className='relative -top-3 md:top-2'
                                    src='/img/intake/wl/line_img.png'
                                    width={24}
                                    height={104}
                                    alt={'line img'}
                                />
                            </div>
                            <div className='flex flex-col ml-2 gap-[20px] md:gap-[30px] justify-between'>
                                <div className='mt-2'>
                                    <BioType
                                        className={`flex flex-row justify-start items-center text-weak intake-subtitle`}
                                    >
                                        Account Created
                                    </BioType>
                                </div>
                                <div className=' flex flex-col gap-1'>
                                    <BioType
                                        className={`flex flex-row justify-start items-center intake-subtitle text-weak mt-[0.5rem]  md:mt-1 `}
                                    >
                                        Health History
                                    </BioType>
                                </div>
                                <div className='flex flex-col gap-1'>
                                    <div className='flex flex-row mt-2 w-[3/4] md:w-[435px] self-stretch py-4 md:py-0 md:h-[94px] px-[24px] md:px-[24px] items-center gap-[1.38rem] md:gap-[16px] rounded-md border border-opacity-20 border-[#666666] bg-white shadow-[27px_25px_10px_0px_rgba(0,0,0,0),17px_16px_9px_0px_rgba(0,0,0,0.01),10px_9px_8px_0px_rgba(0,0,0,0.05),4px_4px_6px_0px_rgba(0,0,0,0.09),1px_1px_3px_0px_rgba(0,0,0,0.1)]'>
                                        <div className='flex flex-col flex-1  md:w-[435px] gap-3'>
                                            <BioType className='intake-v3-disclaimer-text-bold'>
                                                Treatment preview
                                            </BioType>
                                            <BioType
                                                className={`intake-v3-disclaimer-text `}
                                            >
                                                This is important because
                                                it&apos;ll be used by your
                                                provider to write your
                                                prescription, if medically
                                                appropriate.
                                            </BioType>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <AnimatedContinueButtonV3 onClick={pushToNextRoute} />
                    </div>
                </div>
            </div>
        </>
    );
}
