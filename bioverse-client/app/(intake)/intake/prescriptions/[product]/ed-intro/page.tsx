'use client';

import { FC, useState, useEffect, ReactNode } from 'react';
import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams,
} from 'next/navigation';
import TimedDisplay from './(components)/TimedDisplay';
import { getNextIntakeRoute } from '@/app/utils/functions/intake-route-controller';
import { getIntakeURLParams } from '@/app/components/intake-v2/intake-functions';
import SingleSelect from './(components)/SingleSelect';

type Step = {
    displayLength?: number;
    component: ReactNode;
};

const EDIntro: FC = () => {
    const router = useRouter();
    const url = useParams();
    const searchParams = useSearchParams();
    const search = searchParams.toString();
    const fullPath = usePathname();
    const { product_href } = getIntakeURLParams(url, searchParams);
    const [currentStep, setCurrentStep] = useState(0);

    const handleSelection = () => {
        setCurrentStep(currentStep + 1);
    };

    const steps: Step[] = [
        {
            displayLength: 3000,
            component: (
                <TimedDisplay>
                    You&apos;re on your way to
                    <span className='text-primary'>better sex.</span>
                </TimedDisplay>
            ),
        },
        {
            component: <SingleSelect handleSelection={handleSelection} />,
        },
        {
            displayLength: 3000,
            component: (
                <TimedDisplay stepIndex={2}>
                    Did you know that
                    <span className='text-primary'>40%</span>
                    of men experience ED symptoms by the
                    <span className='text-primary'>age of 40</span>?
                </TimedDisplay>
            ),
        },
        {
            displayLength: 3000,
            component: (
                <TimedDisplay stepIndex={3}>
                    There&apos;s good news!
                    <span className='text-primary'>BIOVERSE</span>
                    can help you find the right treatment.
                </TimedDisplay>
            ),
        },
    ];

    const pushToNextRoute = () => {
        const nextRoute = getNextIntakeRoute(fullPath, product_href, search);
        const searchParams = new URLSearchParams(search);
        const newSearch = searchParams.toString();
        router.push(
            `/intake/prescriptions/${product_href}/${nextRoute}?${newSearch}`
        );
    };

    useEffect(() => {
        const currentTimeDisplay = steps[currentStep].displayLength;
        let timeDisplayTimeout: NodeJS.Timeout;
        if (currentTimeDisplay) {
            if (currentStep !== steps.length - 1) {
                timeDisplayTimeout = setTimeout(() => {
                    setCurrentStep(currentStep + 1);
                }, currentTimeDisplay);
            } else {
                timeDisplayTimeout = setTimeout(() => {
                    pushToNextRoute();
                }, currentTimeDisplay);
            }
        }
        return () => {
            if (timeDisplayTimeout) {
                clearTimeout(timeDisplayTimeout);
            }
        };
    }, [currentStep, pushToNextRoute, steps]);

    return steps[currentStep].component;
};

export default EDIntro;
