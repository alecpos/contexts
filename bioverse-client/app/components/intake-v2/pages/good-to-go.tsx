'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams,
} from 'next/navigation';
import { getIntakeURLParams } from '../intake-functions';
import { useEffect, useState } from 'react';
import { getNextIntakeRoute } from '@/app/utils/functions/intake-route-controller';
import { IntakeButtonWithLoading } from '../buttons/loadable-button';
import AnimatedBioType from '@/app/components/global-components/bioverse-typography/animated-type/animation-type';
import ContinueButton from '../buttons/ContinueButton';
import { getQuestionsForProduct_with_Version } from '@/app/utils/database/controller/questionnaires/questionnaire';
import {
    INTAKE_PAGE_HEADER_TAILWIND,
    INTAKE_PAGE_SUBTITLE_TAILWIND,
} from '../styles/intake-tailwind-declarations';
import { continueButtonExitAnimation } from '../intake-animations';

interface GoodToGoProps {
    medicationName: string;
}

export default function GoodToGoV2({ medicationName }: GoodToGoProps) {
    const [isButtonLoading, setIsButtonLoading] = useState<boolean>(false);

    const router = useRouter();
    const url = useParams();
    const searchParams = useSearchParams();
    const search = searchParams.toString();
    const fullPath = usePathname();
    const { product_href } = getIntakeURLParams(url, searchParams);

    const pushToNextRoute = () => {
        //HEADSUP Route Pushing Code Intake.
        setIsButtonLoading(true);

        const nextRoute = getNextIntakeRoute(fullPath, product_href, search);
        router.push(
            `/intake/prescriptions/${product_href}/${nextRoute}?${search}`
        );
    };

    const fixPushToNextRouteQuestions = async () => {
        const searchParams = new URLSearchParams(search);
        setIsButtonLoading(true);
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

    // const [showButton, setShowButton] = useState(false);

    // useEffect to change the state after a certain delay, e.g., 5 seconds
    // useEffect(() => {
    //     const timer = setTimeout(() => {
    //         setShowButton(true);
    //     }, 3500); // 5000 milliseconds = 5 seconds

    //     // Cleanup function to clear the timer if the component unmounts
    //     return () => clearTimeout(timer);
    // }, []); // Empty dependency array means this effect runs once on mount

    return (
        <div className={`animate-slideRight`}>
            <div className='flex flex-row gap-10'>
                <div className='flex flex-col gap-6'>
                    <BioType className={`${INTAKE_PAGE_HEADER_TAILWIND}`}>
                        Let&apos;s get you started!
                    </BioType>
                    {/* <AnimatedBioType
                        text={`Let’s get you started!`}
                        className={'h3 !text-primary'}
                        gap_y={1}
                    /> */}

                    <div className='gap-6 flex-col flex'>
                        <BioType className={`${INTAKE_PAGE_SUBTITLE_TAILWIND}`}>
                            Next, we will ask you questions about your medical
                            history and your lifestyle.{' '}
                            <span className='h6medium !text-primary'>
                                These questions will take less than{' '}
                                {product_href === 'nad-injection' ||
                                product_href === 'metformin'
                                    ? '5'
                                    : '9'}{' '}
                                minutes to answer.
                            </span>
                        </BioType>
                        {/* <AnimatedBioType
                            text={`Next, we will ask you questions about your medical history and your lifestyle. These questions will take less than 10 minutes to answer.`}
                            className={'body1'}
                            gap_y={1}
                            custom_class='body1bold'
                            custom_class_start_index={13}
                            custom_class_end_index={22}
                            delay={0.25}
                        /> */}
                        <BioType className={`${INTAKE_PAGE_SUBTITLE_TAILWIND}`}>
                            This is important to complete because it will be
                            used by your BIOVERSE medical provider to write your{' '}
                            {medicationName} prescription, if medically
                            appropriate.
                        </BioType>
                        {/* <AnimatedBioType
                            text={`This is important to complete because it will be used by your BIOVERSE medical provider to write your ${medicationName} prescription, if medically appropriate.`}
                            className={'body1'}
                            gap_y={1}
                            delay={2.5}
                        /> */}
                    </div>

                    <ContinueButton
                        onClick={fixPushToNextRouteQuestions}
                        buttonLoading={isButtonLoading}
                    />
                </div>
            </div>
        </div>
    );
}
