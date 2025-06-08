'use client';

import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams,
} from 'next/navigation';
import { getIntakeURLParams } from '../intake-functions';
import CheckIcon from '@mui/icons-material/Check';
import React, { useEffect, useState } from 'react';
import { getNextIntakeRoute } from '@/app/utils/functions/intake-route-controller';
import LoadingScreen from '../../global-components/loading-screen/loading-screen';
import BioType from '../../global-components/bioverse-typography/bio-type/bio-type';

interface PatientMatchProps {}

export default function PatientMatchOneMoment({}: PatientMatchProps) {
    const router = useRouter();
    const url = useParams();
    const searchParams = useSearchParams();
    const search = searchParams.toString();
    const fullPath = usePathname();
    const { product_href } = getIntakeURLParams(url, searchParams);

    useEffect(() => {
        const timeout4 = setTimeout(() => {
            pushToNextRoute();
        }, 3000);

        return () => {
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
        <div className="flex h-[60vh] justify-self-start w-full justify-center">
            <div className="flex flex-row gap-10">
                <div className="flex flex-col gap-0 md:h-full justify-start">
                    <LoadingScreen
                        style={{
                            justifyContent: 'center',
                        }}
                    />
                    <div className="h5 !text-primary self-center text-center">
                        <span
                            className=""
                            style={{ verticalAlign: 'baseline' }}
                        >
                            One moment
                        </span>
                        <BioType className="itd-body text-black">
                            We are searching our network for your medical
                            provider
                        </BioType>
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
