'use client';

import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams,
} from 'next/navigation';
import { getNextIntakeRoute } from '@/app/utils/functions/intake-route-controller';
import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
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
import { createBrowserClient } from '@supabase/ssr';

interface UpNextProps {}

// New sermorelin-specific gradient line component (Updated to accept numeric height)
interface VerticalGradientLineSermorelinProps {
    height: number; // Height is now a number (pixels)
}

function VerticalGradientLineSermorelin({
    height,
}: VerticalGradientLineSermorelinProps) {
    // This SVG is adapted from VerticalGradientLineSVGV3 but uses the height prop
    // Adjusted viewBox and path/gradient y-coordinates for scaling based on height (px)
    const originalViewBoxHeight = 156;
    const scaleFactor = height / originalViewBoxHeight;

    const scaledY1 = 2.47144 * scaleFactor;
    const scaledY2 = 153.032 * scaleFactor;

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="7"
            height={height} // Dynamic height from prop (number)
            viewBox={`0 0 7 ${height}`} // Use dynamic height in viewBox
            fill="none"
        >
            <path
                d={`M3 ${scaledY1}L4 ${scaledY2}`}
                stroke="url(#paint0_linear_19888_44333)"
                strokeWidth="4"
                strokeLinecap="square"
            />
            <defs>
                <linearGradient
                    id="paint0_linear_19888_44333"
                    x1="3.5"
                    y1={scaledY1} // Use scaled y1
                    x2="3.5"
                    y2={scaledY2} // Use scaled y2
                    gradientUnits="userSpaceOnUse"
                >
                    <stop offset="0.53" stopColor="#6DB0CC" />
                    <stop offset="1" stopColor="#D7E3EB" />
                </linearGradient>
            </defs>
        </svg>
    );
}

export default function UpNextComponentV3({}: UpNextProps) {
    const router = useRouter();
    const url = useParams();
    const searchParams = useSearchParams();
    const search = searchParams.toString();
    const fullPath = usePathname();
    const { product_href } = getIntakeURLParams(url, searchParams);
    const [buttonLoading, setButtonLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // State for dynamic gradient line height and top position, and circle positions
    const [gradientLineHeight, setGradientLineHeight] = useState(product_href === 'sermorelin' ? 0 : 182); // Start at 0 for sermorelin, default for others
    const [gradientLineTop, setGradientLineTop] = useState(product_href === 'sermorelin' ? 0 : 89); // Start at 0 for sermorelin, default for others
    const [healthHistoryCircleTop, setHealthHistoryCircleTop] = useState(product_href === 'sermorelin' ? -9999 : 60); // Start off-screen for sermorelin, default for others
    const [treatmentPreviewCircleTop, setTreatmentPreviewCircleTop] = useState(product_href === 'sermorelin' ? -9999 : 300); // Start off-screen for sermorelin, default for others

    // State to control visibility of sermorelin specific elements
    const [showSermorelinElements, setShowSermorelinElements] = useState(true);

    // Refs for the text elements to measure
    const healthHistoryRef = useRef<HTMLDivElement>(null);
    const treatmentPreviewRef = useRef<HTMLDivElement>(null);
    // Ref for the parent container relative to which positions are measured
    const parentContainerRef = useRef<HTMLDivElement>(null);

    // Effect to measure content height and update state
    useLayoutEffect(() => {
        let resizeTimeout: NodeJS.Timeout;

        const updateLinePositionAndHeight = () => {
            if (
                parentContainerRef.current &&
                healthHistoryRef.current &&
                treatmentPreviewRef.current &&
                product_href === 'sermorelin'
            ) {
                const parentRect = parentContainerRef.current.getBoundingClientRect();
                const healthHistoryRect = healthHistoryRef.current.getBoundingClientRect();
                const treatmentPreviewRect = treatmentPreviewRef.current.getBoundingClientRect();

                const healthHistoryMiddle = (healthHistoryRect.top + healthHistoryRect.bottom) / 2 - parentRect.top;
                const treatmentPreviewMiddle = (treatmentPreviewRect.top + treatmentPreviewRect.bottom) / 2 - parentRect.top;

                const lineTop = healthHistoryMiddle;
                const lineHeight = treatmentPreviewMiddle - healthHistoryMiddle;
                const adjustedLineHeight = lineHeight + 10;

                console.log('healthHistoryMiddle:', healthHistoryMiddle);
                console.log('treatmentPreviewMiddle:', treatmentPreviewMiddle);
                console.log('lineTop:', lineTop);
                console.log('Calculated gradientLineHeight:', adjustedLineHeight);

                setGradientLineHeight(adjustedLineHeight);
                setGradientLineTop(lineTop);
                setHealthHistoryCircleTop(healthHistoryMiddle - 12.5); // Adjust -12.5 based on circle size
                setTreatmentPreviewCircleTop(treatmentPreviewMiddle - 12.5); // Adjust -12.5 based on circle size

                console.log('State gradientLineTop:', gradientLineTop); // Note: This will log the *previous* state value due to closure
                console.log('State healthHistoryCircleTop:', healthHistoryCircleTop); // Note: This will log the *previous* state value
                console.log('State treatmentPreviewCircleTop:', treatmentPreviewCircleTop); // Note: This will log the *previous* state value

            } else { // Explicitly set defaults if not sermorelin
                setGradientLineHeight(182);
                setGradientLineTop(89);
                setHealthHistoryCircleTop(60);
                setTreatmentPreviewCircleTop(300);
            }
        };

        // Debounced resize handler
        const handleResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                updateLinePositionAndHeight();
            }, 100); // 100ms debounce
        };

        // Update on mount and when product_href changes
        updateLinePositionAndHeight();

        // Add resize observer and window resize listener
        const currentParentContainer = parentContainerRef.current;
        if (currentParentContainer) {
            const resizeObserver = new ResizeObserver(handleResize);
            resizeObserver.observe(currentParentContainer);
            window.addEventListener('resize', handleResize);

            return () => {
                resizeObserver.disconnect();
                window.removeEventListener('resize', handleResize);
                clearTimeout(resizeTimeout);
            };
        }
    }, [product_href]);

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
        setError(null);
        const searchParams = new URLSearchParams(search);
        // Remove the 'nu' parameter
        searchParams.delete('nu');
        // Construct the new search string without the 'nu' parameter
        const newSearch = searchParams.toString();

        console.log('Starting question fetch for product:', url.product);
        console.log('Product href:', product_href);

        if (product_href === 'sermorelin') {
            try {
                const supabase = createBrowserClient(
                    process.env.NEXT_PUBLIC_supabase_url!,
                    process.env.NEXT_PUBLIC_supabase_anon_key!
                );
                const { data: sessionData } = await supabase.auth.getSession();
                console.log('Calling RPC function for sermorelin with params:', {
                    user_id_: sessionData.session?.user.id,
                    product_name_: 'sermorelin',
                    questionnaire_type_: 'intake',
                    version_: 2
                });

                const { data, error } = await supabase.rpc(
                    'alec_get_questionnaire_answers_for_provider_with_version',
                    {
                        user_id_: sessionData.session?.user.id,
                        product_name_: 'sermorelin',
                        questionnaire_type_: 'intake',
                        version_: 2
                    }
                );

                if (error) {
                    console.error('Error fetching sermorelin questions:', error);
                    setError('An error occurred while loading questions. Please try again or contact support.');
                    setButtonLoading(false);
                    return;
                }

                if (!data || data.length === 0) {
                    console.error('No questions found for sermorelin');
                    setError('Unable to load questions. Please try again or contact support.');
                    setButtonLoading(false);
                    return;
                }

                return router.push(
                    `/intake/prescriptions/${url.product}/questions-v3/${data[0].question_id}?${newSearch}`
                );
            } catch (error) {
                console.error('Error fetching sermorelin questions:', error);
                setError('An error occurred while loading questions. Please try again or contact support.');
                setButtonLoading(false);
                return;
            }
        }

        // Original logic for non-sermorelin products
        const vwo_test_ids: string[] =
            typeof window !== 'undefined'
                ? JSON.parse(localStorage.getItem('vwo_ids') || '[]')
                : [];

        console.log('VWO test IDs:', vwo_test_ids);

        const activeVWOTestID = getActiveVWOTestIDForQuestionnaire(
            vwo_test_ids,
            product_href as PRODUCT_HREF
        );

        console.log('Active VWO test ID:', activeVWOTestID);

        const version = activeVWOTestID
            ? getVersionForActiveVWOTestID(
                  activeVWOTestID,
                  product_href as PRODUCT_HREF
              )
            : null;

        console.log('Version from VWO:', version);

        if (version) {
            console.log('Fetching first question after pre-questions with version:', version);
            const nextQuestionId = await getFirstQuestionAfterPreQuestions(
                product_href as PRODUCT_HREF,
                version
            );

            console.log('Next question ID:', nextQuestionId);

            if (nextQuestionId) {
                return router.push(
                    `/intake/prescriptions/${url.product}/questions-v3/${nextQuestionId}?${newSearch}`
                );
            }
        }

        try {
            console.log('Fetching questions with version 0 (will use current version)');
            const questions_array = await getQuestionsForProduct_with_Version(
                url.product as string,
                0
            );

            console.log('Questions array:', questions_array);

            if (!questions_array || questions_array.length === 0) {
                console.error('No questions found for product:', url.product);
                setError('Unable to load questions. Please try again or contact support.');
                setButtonLoading(false);
                return;
            }

            return router.push(
                `/intake/prescriptions/${url.product}/questions-v3/${questions_array[0].question_id}?${newSearch}`
            );
        } catch (error) {
            console.error('Error fetching questions:', error);
            setError('An error occurred while loading questions. Please try again or contact support.');
            setButtonLoading(false);
            return;
        }
    };

    return (
        <>
            <div
                className={`justify-center flex animate-slideRight mt-[1.25rem] md:mt-[48px] mb-16 md:mb-0`}
            >
                <div className='flex flex-row'>
                    <div ref={parentContainerRef} className='flex flex-col gap-4 relative'>
                        <div className='flex flex-col gap-[12px]'>
                            <BioType
                                className={`inter-h5-question-header text-strong`}
                            >
                                {product_href === PRODUCT_HREF.B12_INJECTION
                                    ? 'Nice! Looks like you&apos;re good to go on our end.'
                                    : product_href === PRODUCT_HREF.SERMORELIN
                                    ? 'Up next, your health history'
                                    : 'Up next, your health history'}
                            </BioType>

                            <BioType className={`intake-subtitle text-weak`}>
                                {product_href === PRODUCT_HREF.B12_INJECTION
                                    ? 'Next, answer some questions about you and your lifestyle. It takes less than 5 minutes.'
                                    : product_href === PRODUCT_HREF.SERMORELIN
                                    ? 'Next, answer some questions about you and your lifestyle. It takes less than 5 minutes.'
                                    : 'Answer some questions about you and your lifestyle to build your weight loss profile. It takes less than 9 minutes.'}
                            </BioType>
                        </div>

                        <div className='flex flex-row mb-2 md:mb-5'>
                            <div className='flex flex-col justify-between gap-2 mt-2 md:mt-0'>
                                {/* Circles column */}
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
                                            strokeOpacity='0.45'
                                            strokeWidth='1.5'
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                        />
                                    </svg>
                                </div>
                                {/* Health History circle */}
                                {product_href === 'sermorelin' ? (
                                    <div className={`absolute`} style={{ top: `${healthHistoryCircleTop + 10}px`, zIndex: 2 }}>
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
                                                strokeWidth='1.5'
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                                fill='white'
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
                                ) : product_href !== 'sermorelin' ? (
                                    <div className='mt-[53px] md:mt-[67px] absolute' style={{ top: `${healthHistoryCircleTop}px` }}>
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
                                                strokeWidth='1.5'
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                            />
                                            <circle
                                                cx='12.5'
                                                cy='12.5'
                                                r='3'
                                                fill='#6DB0CC'
                                            />
                                        </svg>
                                    </div>
                                ) : null}
                                {/* Treatment Preview circle */}
                                {product_href === 'sermorelin' ? (
                                    <div className={`absolute`} style={{ top: `${treatmentPreviewCircleTop + 10}px`, zIndex: 2 }}>
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
                                                strokeWidth='1.5'
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                                fill='white'
                                            />
                                        </svg>
                                    </div>
                                ) : product_href !== 'sermorelin' ? (
                                    <div className='ml-[1.5px] md:ml-0.5 absolute' style={{ top: `${treatmentPreviewCircleTop}px` }}>
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
                                                strokeWidth='1.5'
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                            />
                                        </svg>
                                    </div>
                                ) : null}
                            </div>

                            <div className='flex flex-col ml-2 gap-[20px] md:gap-[30px] justify-between'>
                                <div className='mt-2'>
                                    <BioType className={`flex flex-row justify-start items-center text-weak intake-subtitle`}>
                                        Account Created
                                    </BioType>
                                </div>
                                <div className='flex flex-col gap-1'>
                                    <div ref={healthHistoryRef}>
                                        <BioType className={`flex flex-row justify-start items-center intake-subtitle text-weak mt-[0.5rem] md:mt-1`}>
                                            Health History
                                        </BioType>
                                    </div>
                                    <div className='flex flex-row mt-2 w-[3/4] md:w-[435px] h-[9.5rem] md:h-[94px] px-[1.501rem] md:px-[24px] items-center gap-[1.38rem] md:gap-[16px] rounded-md border border-opacity-20 border-[#666666] bg-white shadow-[27px_25px_10px_0px_rgba(0,0,0,0),17px_16px_9px_0px_rgba(0,0,0,0.01),10px_9px_8px_0px_rgba(0,0,0,0.05),4px_4px_6px_0px_rgba(0,0,0,0.09),1px_1px_3px_0px_rgba(0,0,0,0.1)]'>
                                        <div className='flex md:pt-0'>
                                            <div className='w-[7.13rem] md:w-[114px] relative h-[7rem] md:h-[76px]'>
                                                <Image
                                                    src='/img/intake/up-next/female-doctor-head-cropped.png'
                                                    alt='Scientist Image'
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
                                            <BioType className="intake-v3-disclaimer-text">
                                                This is important because it&apos;ll be used by your provider to write your custom Rx prescription, if medically appropriate.
                                            </BioType>
                                        </div>
                                    </div>
                                </div>
                                <div ref={treatmentPreviewRef}>
                                    <BioType className={`mt-[10px] md:mt-[9px] flex flex-row justify-start items-center intake-subtitle text-weak`}>
                                        Treatment Preview
                                    </BioType>
                                </div>
                            </div>

                            {/* Gradient Line Rendering (Conditional) */}
                            {product_href === 'sermorelin' && gradientLineHeight > 0 ? (
                                <div className={`ml-[9px] absolute`} style={{ top: `${gradientLineTop + 10}px`, zIndex: 1 }}>
                                    <VerticalGradientLineSermorelin height={gradientLineHeight} key='line-sermorelin' />
                                </div>
                            ) : product_href !== 'sermorelin' ? (
                                <>
                                    <div className='ml-[10px] hidden md:flex absolute' style={{ top: `${gradientLineTop}px` }}>
                                        <VerticalGradientLineSVGV3 height='182' key='linedesktopvert' />
                                    </div>
                                    <div className='flex md:hidden mt-[75.5px] ml-[10px] absolute'>
                                        <VerticalGradientLineSVGMobileV3 height='55vw' key='linemobilevert' />
                                    </div>
                                </>
                            ) : null}
                        </div>

                        {error && (
                            <div className="text-red-500 mt-4 text-center">
                                {error}
                            </div>
                        )}

                        <AnimatedContinueButtonV3 
                            onClick={fixPushToNextRouteQuestions} 
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
