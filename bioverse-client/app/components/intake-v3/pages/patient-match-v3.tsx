'use client';

import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams,
} from 'next/navigation';
import { getIntakeURLParams } from '../intake-functions';
import { Chip } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import React, { useEffect, useState } from 'react';
import { getNextIntakeRoute } from '@/app/utils/functions/intake-route-controller';
import LoadingScreen from '../../global-components/loading-screen/loading-screen';

interface PatientMatchProps {}

export default function PatientMatch({}: PatientMatchProps) {
    const router = useRouter();
    const url = useParams();
    const searchParams = useSearchParams();
    const search = searchParams.toString();
    const fullPath = usePathname();
    const { product_href } = getIntakeURLParams(url, searchParams);

    const [isFirstOpacityFull, setIsFirstOpacityFull] = useState(false);
    const [isSecondOpacityFull, setIsSecondOpacityFull] = useState(false);
    const [isThirdOpacityFull, setIsThirdOpacityFull] = useState(false);

    useEffect(() => {
        const mod1 = Math.floor(Math.random() * 501) - 200;
        const mod2 = Math.floor(Math.random() * 501) - 200;
        const mod3 = Math.floor(Math.random() * 501) - 200;

        // After 2 seconds, set isOpacityFull to true, which will trigger the transition to full opacity
        const timeout1 = setTimeout(() => {
            setIsFirstOpacityFull(true);
        }, 1000 + mod1); // Change opacity after 1 seconds

        const timeout2 = setTimeout(() => {
            setIsSecondOpacityFull(true);
        }, 2300 - mod2); // Change opacity after 2.3 seconds

        const timeout3 = setTimeout(() => {
            setIsThirdOpacityFull(true);
        }, 4200 + mod3); // Change opacity after 4.2 seconds

        const timeout4 = setTimeout(() => {
            pushToNextRoute();
        }, 5000);

        return () => {
            clearTimeout(timeout1);
            clearTimeout(timeout2);
            clearTimeout(timeout3);
            clearTimeout(timeout4);
        };
    }, []);

    const pushToNextRoute = () => {
        const nextRoute = getNextIntakeRoute(fullPath, product_href, search);
        router.push(
            `/intake/prescriptions/${product_href}/${nextRoute}?${search}`,
        );
    };

    return (
        <div className="flex h-[60vh]  w-full mt-[1.25rem] md:mt-[48px] ">
            <div className="flex flex-row gap-10">
                <div className="flex flex-col gap-8 md:h-full ">
                    <div className="inter-h5-question-header">
                        <span
                            className=""
                            style={{ verticalAlign: 'baseline' }}
                        >
                            Loading...
                        </span>
                    </div>
                    <div className="gap-6 md:gap-4 flex-col flex justify-center items-start">
                        <style jsx>{`
                            .opacityChange {
                                opacity: 0.38;
                            }
                            .fullOpacity {
                                opacity: 1;
                                transition: opacity 1s ease-in-out;
                            }
                        `}</style>
                        <div
                            className={`flex flex-row items-center gap-2 opacityChange ${
                                isFirstOpacityFull
                                    ? 'fullOpacity'
                                    : 'opacity-35'
                            }`}
                        >
                            <Chip
                                label={`Reviewing your responses`}
                                color="primary"
                                className='intake-v3-question-text '
                            />
                            <CheckCircle />
                        </div>
                        <div
                            className={`flex flex-row items-center gap-2 opacityChange ${
                                isSecondOpacityFull
                                    ? 'fullOpacity'
                                    : 'opacity-35'
                            }`}
                        >
                            <Chip
                                label={`Matching you with a US-licensed provider`}
                                color="primary"
                                className='intake-v3-question-text '
                            />
                            <CheckCircle />
                        </div>
                        <div
                            className={`flex flex-row items-center gap-2 opacityChange ${
                                isThirdOpacityFull
                                    ? 'fullOpacity'
                                    : 'opacity-35'
                            }`}
                        >
                            <Chip label={`Complete`} color="primary" className='intake-v3-question-text'  />
                            <CheckCircle />
                        </div>
                        <LoadingScreen
                            style={{
                                justifyContent: 'start',
                                marginLeft: '-30px',
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

const CheckCircle = () => (
    <CheckIcon
        fontSize="small"
        style={{
            backgroundColor: '#2E7D32',
            color: 'white',
            borderRadius: '9999px',
            padding: '5px',
        }}
    />
);
