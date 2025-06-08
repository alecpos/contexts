'use client';

import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams,
} from 'next/navigation';
import Image from 'next/image';
import { getIntakeURLParams } from '../intake-functions';
import React, { useEffect, useState } from 'react';
import CircularProgress, {
    CircularProgressProps,
} from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import styles from '../styles/text-animations.module.css';
import { IntakeButtonWithLoading } from '../buttons/loadable-button';
import useSessionStorage from '@/app/utils/hooks/session-storage/useSessionStorage';
import { AB_TESTS_IDS } from '@/app/components/intake-v2/types/intake-enumerators';

import { getNextIntakeRoute } from '@/app/utils/functions/intake-route-controller';

interface WLDataProcessing {
    bmi_data?: {
        height_feet: number;
        height_inches: number;
        weight_lbs: number;
        bmi: number;
    };
}

const stepCount = 3;

export default function WLDataProcessing({ bmi_data }: WLDataProcessing) {
    const router = useRouter();
    const url = useParams();
    const searchParams = useSearchParams();
    const search = searchParams.toString();
    const fullPath = usePathname();
    const { product_href } = getIntakeURLParams(url, searchParams);

    const [isFirstOpacityFull, setIsFirstOpacityFull] = useState(true);
    const [isSecondOpacityFull, setIsSecondOpacityFull] = useState(true);
    const [isThirdOpacityFull, setIsThirdOpacityFull] = useState(true);
    const [bmi, setBmi] = useSessionStorage('wl-bmi', {
        question: 'What is your current height and weight',
        answer: '',
        formData: ['', '', ''],
    });

    const vwo_test_ids: string[] =
        typeof window !== 'undefined'
            ? JSON.parse(localStorage.getItem('vwo_ids') || '[]')
            : [];

    const storedBmi = sessionStorage.getItem('wl-bmi');
    if (!storedBmi && bmi_data) {
        setBmi({
            question: 'What is your current height and weight',
            answer: '',
            formData: [
                bmi_data?.height_feet || 0,
                bmi_data?.height_inches || 0,
                bmi_data?.weight_lbs || 0,
            ],
        });
    }

    const [progress, setProgress] = useState(0);
    const [step, setStep] = useState(4);
    const [completed, setCompleted] = useState(false);

    const handleUpdateStepper = () => {
        setProgress((prevProgress) => {
            const nextProgress = prevProgress + 25;
            if (nextProgress < 100) {
                return nextProgress;
            } else {
                setCompleted(true);
                return 100;
            }
        });
        setStep((prevStep) => {
            if (prevStep > 1) {
                return prevStep - 1;
            } else {
                setCompleted(true);
            }
            return prevStep;
        });
    };
    console.log('BMI', bmi);

    useEffect(() => {
        const mod1 = Math.floor(Math.random() * 501) - 200;
        const mod2 = Math.floor(Math.random() * 501) - 200;
        const mod3 = Math.floor(Math.random() * 501) - 200;

        const timeout1 = setTimeout(() => {
            setIsFirstOpacityFull(false);
            handleUpdateStepper();
        }, 1000 + mod1); // Change opacity after 1 seconds

        const timeout2 = setTimeout(() => {
            setIsSecondOpacityFull(false);
            handleUpdateStepper();
        }, 2000 - mod2); // Change opacity after 2 seconds

        const timeout3 = setTimeout(() => {
            setIsThirdOpacityFull(false);
            handleUpdateStepper();
        }, 3000 + mod3); // Change opacity after 3 seconds

        const timeout4 = setTimeout(() => {
            handleUpdateStepper();
        }, 4000); // Change opacity after 4 seconds

        return () => {
            clearTimeout(timeout1);
            clearTimeout(timeout2);
            clearTimeout(timeout3);
            clearTimeout(timeout4);
        };
    }, []);

    const pushToNextRoute = () => {
        const nextRoute = getNextIntakeRoute(fullPath, product_href, search);

        const searchParams = new URLSearchParams(search);
        // Remove the 'nu' parameter
        searchParams.delete('nu');
        // Construct the new search string without the 'nu' parameter
        const newSearch = searchParams.toString();
        console.log(newSearch);

        //check if we are in the zealthy best practices flow and if so route to next route without verifyEmail === true
        if (vwo_test_ids.includes(AB_TESTS_IDS.ZEALTHY_BEST_PRACTICES)) {
            router.push(
                `/intake/prescriptions/${product_href}/${nextRoute}?${newSearch}`
            );
            return;
        }

        router.push(
            `/intake/prescriptions/${product_href}/${nextRoute}?${newSearch}&verifyEmail=true`
        );
    };

    const getTitle = () => {
        if (vwo_test_ids.includes(AB_TESTS_IDS.WL_HERS_FUNNEL)) {
            return 'Finding the right treatment for you';
        }
        return 'Calculating your potential weight loss';
    };

    return (
        <div className='flex h-[60vh]  w-full mt-[1.25rem] md:mt-[48px] '>
            <div className='flex flex-row gap-10 w-full'>
                <div className='flex flex-col gap-[20px] md:gap-[48px] md:h-full w-full'>
                    <div className='inter-h5-question-header text-center'>
                        <CircularProgressWithLabel
                            progress={progress}
                            step={step}
                            completed={completed}
                        />
                    </div>

                    <h5
                        className={`inter-tight font-normal text-[20px] md:text-[23px] leading-[24px] md:leading-[28px] text-[#000000E5]`}
                    >
                        {getTitle()}
                    </h5>
                    <div className='gap-6 md:gap-4 flex-col flex justify-center items-start'>
                        <p
                            className={`inter-tight font-normal text-[16px] leading-[20px] md:text-[18px] md:leading-[24px]  ${
                                isFirstOpacityFull
                                    ? 'text-[#000000E5] opacity-0'
                                    : `text-[#333333BF] ${styles['slide-up']}`
                            }`}
                        >
                            {`Your height ${bmi.formData[0]}\"${bmi.formData[1]}`}
                        </p>
                        <p
                            className={`inter-tight font-normal text-[16px] leading-[20px] md:text-[18px] md:leading-[24px]  ${
                                isSecondOpacityFull
                                    ? 'text-[#000000E5] opacity-0'
                                    : `text-[#333333BF] ${styles['slide-up']}`
                            }`}
                        >
                            {`Your weight ${bmi.formData[2]} lbs`}
                        </p>
                        <p
                            className={`inter-tight font-normal text-[16px] leading-[20px] md:text-[18px] md:leading-[24px] ${
                                isThirdOpacityFull
                                    ? 'text-[#000000E5] opacity-0'
                                    : `text-[#000000E5] ${styles['slide-up']}`
                            }`}
                        >
                            Calculating results based on clinical data
                        </p>
                    </div>

                    <div
                        className={`flex justify-center  opacity-0
                            ${completed && ' animate-slideRight opacity-100'}
                            `}
                    >
                        <div className='w-full'>
                            <IntakeButtonWithLoading
                                fullWidth={true}
                                button_text={'Continue'}
                                custom_function={pushToNextRoute}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function CircularProgressWithLabel(
    props: CircularProgressProps & {
        progress: number;
        step: number;
        completed: boolean;
    }
) {
    return (
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress
                variant='determinate'
                sx={{
                    color: '#A3CC96',
                    '& .MuiCircularProgress-circle': {
                        'stroke-linecap': 'round',
                    },
                }}
                size={152}
                thickness={1.5}
                value={props.progress}
            />
            <Box
                sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Typography
                    variant='caption'
                    component='div'
                    className='font-sans text-[32px] md:text-[45px] font-extralight leading-[38px] md:leading-[50px] text-[#000000E5]'
                >
                    {props.completed ? (
                        <Image
                            src='/img/intake/wl/checked-icon.png'
                            width={32}
                            height={22}
                            alt={`Checked Icon`}
                            className=''
                            unoptimized
                        />
                    ) : (
                        `${
                            props.step === stepCount + 1
                                ? stepCount
                                : props.step
                        }`
                    )}
                </Typography>
            </Box>
        </Box>
    );
}
