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
import AnimatedContinueButtonV3 from '../buttons/AnimatedContinueButtonV3';
import { VWO_TEST_QUESTIONNAIRES_VERSION_MAPPINGS } from '../../intake-v2/constants/route-constants';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import { AB_TESTS_IDS } from '../../intake-v2/types/intake-enumerators';
import {
    getActiveVWOTestIDForQuestionnaire,
    getVersionForActiveVWOTestID,
} from '@/app/utils/functions/client-utils';

interface UpNextProps {}

export default function UpNextComponentV3({}: UpNextProps) {
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

        const vwo_test_ids: string[] =
            typeof window !== 'undefined'
                ? JSON.parse(localStorage.getItem('vwo_ids') || '[]')
                : [];

        const activeVWOTestID = getActiveVWOTestIDForQuestionnaire(
            vwo_test_ids,
            product_href as PRODUCT_HREF
        );

        const version = activeVWOTestID
            ? getVersionForActiveVWOTestID(
                  activeVWOTestID,
                  product_href as PRODUCT_HREF
              )
            : null;

        if (version) {
            // Do something with version
            const nextQuestionId = await getFirstQuestionAfterPreQuestions(
                product_href as PRODUCT_HREF,
                version
            );

            if (nextQuestionId) {
                return router.push(
                    `/intake/prescriptions/${url.product}/questions-v3/${nextQuestionId}?${newSearch}`
                );
            }
        }

        const questions_array = await getQuestionsForProduct_with_Version(
            url.product as string,
            0
        );

        return router.push(
            `/intake/prescriptions/${url.product}/questions-v3/${questions_array[0].question_id}?${newSearch}`
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
                                {product_href === PRODUCT_HREF.B12_INJECTION
                                    ? 'Nice! Looks like you’re good to go on our end.'
                                    : 'Up next, your health history'}
                            </BioType>

                            <BioType className={`intake-subtitle text-weak `}>
                                {product_href === PRODUCT_HREF.B12_INJECTION
                                    ? 'Next, answer some questions about you and your lifestyle. It takes less than 5 minutes.'
                                    : 'Answer some questions about you and your lifestyle to build your weight loss profile. It takes less than 9 minutes.'}
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
                                            d='M12.5 22.4714C18.0228 22.4714 22.5 17.9943 22.5 12.4714C22.5 6.94859 18.0228 2.47144 12.5 2.47144C6.97715 2.47144 2.5 6.94859 2.5 12.4714C2.5 17.9943 6.97715 22.4714 12.5 22.4714Z'
                                            stroke='#6DB0CC'
                                            stroke-width='1.5'
                                            stroke-linecap='round'
                                            stroke-linejoin='round'
                                        />

                                        <svg
                                            xmlns='http://www.w3.org/2000/svg'
                                            width='7'
                                            height='7'
                                            viewBox='0 0 7 7'
                                            fill='none'
                                            x='9'
                                            y='9'
                                        >
                                            <circle
                                                cx='3.49609'
                                                cy='3.47534'
                                                r='3.07422'
                                                fill='#6DB0CC'
                                            />
                                        </svg>
                                    </svg>
                                </div>

                                <div className='ml-[10px] hidden md:flex mt-[89px] absolute'>
                                    <VerticalGradientLineSVGV3
                                        height='182'
                                        key={'linedesktopvert'}
                                    />
                                </div>
                                <div className='flex md:hidden mt-[75.5px] ml-[10px] absolute'>
                                    <VerticalGradientLineSVGMobileV3
                                        height='55vw'
                                        key={'linemobilevert'}
                                    />
                                </div>

                                <div className='ml-[1.5px] md:ml-0.5 mt-[287px] md:mt-[243px] absolute'>
                                    <svg
                                        xmlns='http://www.w3.org/2000/svg'
                                        width='25'
                                        height='25'
                                        viewBox='0 0 25 25'
                                        fill='none'
                                    >
                                        <path
                                            d='M12.5 22.032C18.0228 22.032 22.5 17.5548 22.5 12.032C22.5 6.50913 18.0228 2.03198 12.5 2.03198C6.97715 2.03198 2.5 6.50913 2.5 12.032C2.5 17.5548 6.97715 22.032 12.5 22.032Z'
                                            stroke='#BBC5CC'
                                            stroke-width='1.5'
                                            stroke-linecap='round'
                                            stroke-linejoin='round'
                                        />
                                    </svg>
                                </div>
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
                                    <div className='flex flex-row mt-2 w-[3/4] md:w-[435px]  h-[9.5rem] md:h-[94px] md:h-[94px] px-[1.501rem] md:px-[24px] items-center gap-[1.38rem] md:gap-[16px] rounded-md border border-opacity-20 border-[#666666] bg-white shadow-[27px_25px_10px_0px_rgba(0,0,0,0),17px_16px_9px_0px_rgba(0,0,0,0.01),10px_9px_8px_0px_rgba(0,0,0,0.05),4px_4px_6px_0px_rgba(0,0,0,0.09),1px_1px_3px_0px_rgba(0,0,0,0.1)]'>
                                        <div className='flex md:pt-0 '>
                                            <div className='w-[7.13rem] md:w-[114px] relative  h-[7rem] md:h-[76px]'>
                                                <Image
                                                    src={
                                                        '/img/intake/up-next/female-doctor-head-cropped.png'
                                                    }
                                                    alt={'Scientist Image'}
                                                    fill
                                                    className=''
                                                    style={{
                                                        objectFit: 'cover',
                                                        borderRadius: '12px',
                                                    }}
                                                    unoptimized
                                                />
                                            </div>
                                        </div>
                                        <div className='flex flex-1 w-[6.38rem] md:w-[435px]'>
                                            <BioType
                                                className={`intake-v3-disclaimer-text `}
                                            >
                                                {product_href ===
                                                PRODUCT_HREF.B12_INJECTION
                                                    ? 'This is important because it’ll be used by your provider to write your custom Rx prescription, if medically appropriate.'
                                                    : 'This is important because it’ll be used by your provider to write your custom Rx prescription, if medically appropriate.'}
                                            </BioType>
                                        </div>
                                    </div>
                                </div>
                                <BioType
                                    className={`mt-[10px] md:mt-[9px] flex flex-row justify-start items-center intake-subtitle text-weak`}
                                >
                                    Treatment Preview
                                </BioType>
                            </div>
                        </div>

                        <AnimatedContinueButtonV3
                            onClick={fixPushToNextRouteQuestions}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
