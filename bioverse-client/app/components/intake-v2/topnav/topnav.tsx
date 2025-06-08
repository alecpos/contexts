'use client';
import Image from 'next/image';

import { useEffect, useState } from 'react';
import { useParams, usePathname, useSearchParams } from 'next/navigation';
import {
    TOPNAV_ROUTES_NOT_TO_SHOW_BAR,
    LATEST_INTAKE_VERSIONS,
    WL_INTAKE_ROUTES,
    STANDARD_INTAKE_ROUTES,
    TOPNAV_PRODUCT_ROUTES_NOT_TO_SHOW_BAR,
    NAD_INTAKE_ROUTES,
    SKINCARE_INTAKE_ROUTES,
    COMBINED_WEIGHT_LOSS_ROUTES,
    SEMAGLUTIDE_ROUTES,
    TIRZEPATIDE_ROUTES,
} from '../constants/route-constants';
import { LinearProgress, linearProgressClasses, styled } from '@mui/material';
import {
    SKINCARE_PRODUCT_HREF,
    WEIGHT_LOSS_PRODUCT_HREF,
} from '../constants/constants';
import { getQuestionsForProduct_with_Version } from '@/app/utils/database/controller/questionnaires/questionnaire';
import useSWR from 'swr';
import {
    GLP1_PRODUCT_HREF,
    NAD_INJECTION_PRODUCT_HREF,
} from '@/app/services/tracking/constants';
import { INTAKE_ROUTE } from '../types/intake-enumerators';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import { getRouteArrayForTest } from '@/app/utils/functions/intake-route-controller';

interface TopNavProps {
    logged_in: boolean;
}

export default function IntakeTopNavV2({ logged_in }: TopNavProps) {
    const [question_length, setQuestionLength] = useState<number>(0);
    const [currentProgress, setCurrentProgress] = useState<number>(0);
    const [shouldShowProgress, setShouldShowProgress] =
        useState<boolean>(false);
    const pathName = usePathname();
    const pathArray = pathName.split('/');
    const searchParams = useSearchParams();
    const searchParamsURL = new URLSearchParams(searchParams.toString());
    const test_id = searchParams.get('test_id');
    const params = useParams();

    const {
        data: swr_question_set,
        error: swr_question_set_error,
        isLoading: swr_question_set_isLoading,
    } = useSWR(`${params.product as string}-question-set`, () =>
        getQuestionsForProduct_with_Version(params.product as string, 0)
    );

    useEffect(() => {
        if (swr_question_set) {
            setQuestionLength(swr_question_set.length - 1);
        }
    }, [swr_question_set]);

    useEffect(() => {
        const segmentArray = pathArray;

        setShouldShowProgress(
            !TOPNAV_ROUTES_NOT_TO_SHOW_BAR.includes(
                segmentArray[segmentArray.length - 1] as INTAKE_ROUTE
            ) &&
                !TOPNAV_PRODUCT_ROUTES_NOT_TO_SHOW_BAR.includes(
                    params.product as string
                )
        );

        setCurrentProgress(calculateProgress());
    }, [pathName, swr_question_set]);

    if (pathName === '/intake/complete') {
        return <></>;
    }

    const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
        height: 10,
        borderRadius: 5,
        [`&.${linearProgressClasses.colorPrimary}`]: {
            backgroundColor:
                theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
        },
        [`& .${linearProgressClasses.bar}`]: {
            borderRadius: 5,
            background: `linear-gradient(to right, #59B7C1 ,#286BA2)`,
        },
    }));

    /**
     *
     * @returns progress in a % as an integer between 0 and 100
     */
    const calculateProgress = (): number => {
        /**
         * type will determine whether it is weight loss or not, WL = 1, standard = 0
         * version specifies version found
         */
        let type: number;
        let version: number;
        let total_length: number;
        let current_index: number = 0;
        let current_question_index: number;

        if (WEIGHT_LOSS_PRODUCT_HREF.includes(params.product as string)) {
            type = 1;
        } else if (NAD_INJECTION_PRODUCT_HREF == (params.product as string)) {
            type = 2;
        } else if (PRODUCT_HREF.WEIGHT_LOSS == (params.product as string)) {
            type = 3;
        } else if (SKINCARE_PRODUCT_HREF.includes(params.product as string)) {
            type = 4;
        } else {
            type = 0;
        }

        const vwo_test_ids: string[] =
            typeof window !== 'undefined'
                ? JSON.parse(localStorage.getItem('vwo_ids') || '[]')
                : [];

        //If it is a weight loss intake
        if (type === 1) {
            //find version
            let route_array;

            if (params.product === PRODUCT_HREF.SEMAGLUTIDE) {
                version = LATEST_INTAKE_VERSIONS['semaglutide'].latest_version;
                route_array = getRouteArrayForTest(
                    SEMAGLUTIDE_ROUTES[version],
                    vwo_test_ids
                );
            } else if (params.product === PRODUCT_HREF.TIRZEPATIDE) {
                version = LATEST_INTAKE_VERSIONS['tirzepatide'].latest_version;
                route_array = getRouteArrayForTest(
                    TIRZEPATIDE_ROUTES[version],
                    vwo_test_ids
                );
            } else {
                version = LATEST_INTAKE_VERSIONS['weight_loss'].latest_version;
                route_array = getRouteArrayForTest(
                    WL_INTAKE_ROUTES[version],
                    vwo_test_ids
                );
            }

            //total length = number of routes in intake + number of questions in intake - 1 to account for questions route itself
            total_length = route_array.length + question_length;

            const segmentArray = pathArray;
            //find the index at which questions live
            const question_index = route_array.findIndex(
                (route) => route === INTAKE_ROUTE.QUESTIONS
            );

            //handle if the user is ON questions
            if (
                segmentArray[segmentArray.length - 2] === INTAKE_ROUTE.QUESTIONS
            ) {
                swr_question_set
                    ? (current_question_index = swr_question_set.findIndex(
                          (question: { question_id: number }) =>
                              question.question_id ===
                              parseInt(segmentArray[segmentArray.length - 1])
                      ))
                    : (current_question_index = 1);

                current_index += current_question_index;

                current_index +=
                    route_array.findIndex(
                        (route) => route === INTAKE_ROUTE.QUESTIONS
                    ) - 1;

                return (current_index / total_length) * 100;
            } else {
                route_array.findIndex(
                    (route) => route === segmentArray[segmentArray.length - 1]
                );

                if (current_index > question_index) {
                    current_index += swr_question_set
                        ? swr_question_set.length
                        : 0;
                }
            }
            return (current_index / total_length) * 100;
        } else if (type === 2) {
            version = LATEST_INTAKE_VERSIONS['nad'].latest_version;
            //total length = number of routes in intake + number of questions in intake - 1 to account for questions route itself
            total_length =
                NAD_INTAKE_ROUTES[version].route_array.length + question_length;

            const segmentArray = pathArray;
            //find the index at which questions live
            const question_index = NAD_INTAKE_ROUTES[
                version
            ].route_array.findIndex(
                (route) => route === INTAKE_ROUTE.QUESTIONS
            );

            //handle if the user is ON questions
            if (
                segmentArray[segmentArray.length - 2] === INTAKE_ROUTE.QUESTIONS
            ) {
                swr_question_set
                    ? (current_question_index = swr_question_set.findIndex(
                          (question: { question_id: number }) =>
                              question.question_id ===
                              parseInt(segmentArray[segmentArray.length - 1])
                      ))
                    : (current_question_index = 1);

                current_index += current_question_index;

                current_index +=
                    NAD_INTAKE_ROUTES[version].route_array.findIndex(
                        (route) => route === INTAKE_ROUTE.QUESTIONS
                    ) - 1;

                return (current_index / total_length) * 100;
            } else {
                current_index += NAD_INTAKE_ROUTES[
                    version
                ].route_array.findIndex(
                    (route) => route === segmentArray[segmentArray.length - 1]
                );

                if (current_index > question_index) {
                    current_index += swr_question_set
                        ? swr_question_set.length
                        : 0;
                }
            }
            return (current_index / total_length) * 100;
        } else if (type === 3) {
            version =
                LATEST_INTAKE_VERSIONS['combined_weight_loss'].latest_version;

            const route_array = getRouteArrayForTest(
                COMBINED_WEIGHT_LOSS_ROUTES[version],
                vwo_test_ids
            );

            //total length = number of routes in intake + number of questions in intake - 1 to account for questions route itself
            total_length = route_array.length + question_length;

            const segmentArray = pathArray;
            //find the index at which questions live
            const question_index = route_array.findIndex(
                (route) => route === INTAKE_ROUTE.QUESTIONS
            );

            //handle if the user is ON questions
            if (
                segmentArray[segmentArray.length - 2] === INTAKE_ROUTE.QUESTIONS
            ) {
                swr_question_set
                    ? (current_question_index = swr_question_set.findIndex(
                          (question: { question_id: number }) =>
                              question.question_id ===
                              parseInt(segmentArray[segmentArray.length - 1])
                      ))
                    : (current_question_index = 1);

                current_index += current_question_index;

                current_index +=
                    route_array.findIndex(
                        (route) => route === INTAKE_ROUTE.QUESTIONS
                    ) - 1;

                return (current_index / total_length) * 100;
            } else {
                current_index += route_array.findIndex(
                    (route) => route === segmentArray[segmentArray.length - 1]
                );

                if (current_index > question_index) {
                    current_index += swr_question_set
                        ? swr_question_set.length
                        : 0;
                }
            }
            return (current_index / total_length) * 100;
        } else if (type === 4) {
            version = LATEST_INTAKE_VERSIONS['skincare'].latest_version;
            //total length = number of routes in intake + number of questions in intake - 1 to account for questions route itself
            total_length =
                SKINCARE_INTAKE_ROUTES[version].route_array.length +
                question_length;

            const segmentArray = pathArray;
            //find the index at which questions live
            const question_index = SKINCARE_INTAKE_ROUTES[
                version
            ].route_array.findIndex((route) => route === 'questions');

            //handle if the user is ON questions
            if (segmentArray[segmentArray.length - 2] === 'questions') {
                swr_question_set
                    ? (current_question_index = swr_question_set.findIndex(
                          (question: { question_id: number }) =>
                              question.question_id ===
                              parseInt(segmentArray[segmentArray.length - 1])
                      ))
                    : (current_question_index = 1);

                current_index += current_question_index;

                current_index +=
                    SKINCARE_INTAKE_ROUTES[version].route_array.findIndex(
                        (route) => route === 'questions'
                    ) - 1;

                return (current_index / total_length) * 100;
            } else {
                current_index += SKINCARE_INTAKE_ROUTES[
                    version
                ].route_array.findIndex(
                    (route) => route === segmentArray[segmentArray.length - 1]
                );

                if (current_index > question_index) {
                    current_index += swr_question_set
                        ? swr_question_set.length
                        : 0;
                }
            }
            return (current_index / total_length) * 100;
        } else {
            //find version
            version = LATEST_INTAKE_VERSIONS['standard'].latest_version;
            //total length = number of routes in intake + number of questions in intake - 1 to account for questions route itself
            total_length =
                STANDARD_INTAKE_ROUTES[version].route_array.length +
                question_length -
                1;

            const segmentArray = pathArray;
            //find the index at which questions live
            const question_index = STANDARD_INTAKE_ROUTES[
                version
            ].route_array.findIndex(
                (route) => route === INTAKE_ROUTE.QUESTIONS
            );

            //handle if the user is ON questions
            if (
                segmentArray[segmentArray.length - 2] === INTAKE_ROUTE.QUESTIONS
            ) {
                swr_question_set
                    ? (current_question_index = swr_question_set.findIndex(
                          (question: { question_id: string }) =>
                              question.question_id ===
                              segmentArray[segmentArray.length - 1]
                      ))
                    : (current_question_index = 1);

                current_index += current_question_index;

                current_index +=
                    STANDARD_INTAKE_ROUTES[version].route_array.findIndex(
                        (route) => route === INTAKE_ROUTE.QUESTIONS
                    ) - 1;

                return (current_index / total_length) * 100;
            } else {
                current_index += STANDARD_INTAKE_ROUTES[
                    version
                ].route_array.findIndex(
                    (route) => route === segmentArray[segmentArray.length - 1]
                );

                if (current_index > question_index) {
                    current_index += swr_question_set
                        ? swr_question_set.length
                        : 0;
                }
            }
            return (current_index / total_length) * 100;
        }
    };
    return (
        <>
            <div
                className={`flex flex-col w-screen top-0 h-[75px] items-center justify-center ${
                    logged_in ? `md:h-[90px]` : `md:h-[70px]`
                } bg-white md:gap-2 items-center py-[7px]`}
            >
                {/* Logo on top */}
                <div className='hidden md:flex self-center'>
                    {shouldShowProgress ? (
                        <Image
                            src={`${process.env.NEXT_PUBLIC_PDP_MAIN_IMAGE_KEY}brand/logo/bioverse-logo-new.png`}
                            alt={'bioverse-banner'}
                            width={194.4}
                            height={48}
                            sizes='(max-width:  1440px) calc(100vw -  2 * ((100vw -  162px) /  2)),  100vw'
                            priority
                            unoptimized
                        />
                    ) : (
                        <div>
                            <Image
                                src={`${process.env.NEXT_PUBLIC_PDP_MAIN_IMAGE_KEY}brand/logo/bioverse-logo-new.png`}
                                alt={'bioverse-banner'}
                                width={238}
                                height={58.76}
                                sizes='(max-width:  1440px) calc(100vw -  2 * ((100vw -  162px) /  2)),  100vw'
                                priority
                                unoptimized
                            />
                        </div>
                    )}
                </div>
                {/* Logo on top */}

                <div
                    className={`flex md:hidden self-center ${
                        shouldShowProgress ? '' : 'mt-6'
                    }`}
                >
                    <Image
                        src={`${process.env.NEXT_PUBLIC_PDP_MAIN_IMAGE_KEY}brand/logo/bioverse-logo-new.png`}
                        alt={'bioverse-banner'}
                        width={194.4}
                        height={48}
                        sizes='(max-width:  1440px) calc(100vw -  2 * ((100vw -  162px) /  2)),  100vw'
                        priority
                        unoptimized
                    />
                </div>

                {/**
                 * Below is code for displaying the progress bars throughout.
                 */}
                {shouldShowProgress && (
                    <BorderLinearProgress
                        variant='determinate'
                        value={currentProgress}
                        color='primary'
                        sx={{
                            width: { xs: '90%', sm: '500px' },
                            height: '0.5rem',
                            display: 'flex',
                        }}
                    ></BorderLinearProgress>
                    // <div className='flex md:mx-auto md:w-full items-center justify-center'>
                    //     <div className='w-[33%] md:w-36 m-1'>
                    //         <CustomizedProgressBar
                    //             color={step === 0 ? 'secondary' : 'primary'}
                    //             val_linear={
                    //                 step === 0 ? 100 : step >= 0 ? 100 : 0
                    //             }
                    //             title_linear={'Create Account'}
                    //         />
                    //     </div>
                    //     <div className='w-[33%] md:w-36 m-1'>
                    //         <CustomizedProgressBar
                    //             color={step === 1 ? 'secondary' : 'primary'}
                    //             val_linear={
                    //                 step === 1 ? 100 : step >= 2 ? 100 : 0
                    //             }
                    //             title_linear={'Take Assessment'}
                    //         />
                    //     </div>
                    //     <div className='w-[33%] md:w-36 m-1'>
                    //         <CustomizedProgressBar
                    //             color={step === 2 ? 'secondary' : 'primary'}
                    //             val_linear={step >= 2 ? 100 : 0}
                    //             title_linear={'Start Care'}
                    //         />
                    //     </div>
                    // </div>
                )}
            </div>
        </>
    );
}
