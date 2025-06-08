'use client';

import { Paper } from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import {
    SEMAGLUTIDE_PRODUCTS,
    TIRZEPATIDE_PRODUCTS,
} from '../constants/constants';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import { useEffect, useState } from 'react';
import { INTAKE_PAGE_SUBTITLE_TAILWIND } from '../styles/intake-tailwind-declarations';
import Image from 'next/image';

interface WLPaperProps {
    user_body_weight: number;
    product_href: string;
}

export default function WLPaper({
    user_body_weight,
    product_href,
}: WLPaperProps) {
    const [{ newWeight, poundsLost }, setWeightLossMetrics] = useState(
        calculateNewWeightAndPoundsLost(user_body_weight, product_href)
    );

    const [currWeight, setCurrWeight] = useState(user_body_weight);
    const [currPoundsLost, setCurrPoundsLost] = useState(0);

    useEffect(() => {
        if (newWeight == null || poundsLost == null) {
            return;
        }
        let wTimer = setInterval(() => {
            setCurrWeight((prev) => {
                if (prev - 1 <= newWeight) {
                    clearInterval(wTimer);
                    return newWeight;
                }
                return prev - 1;
            });
        }, 70);
        let lbTimer = setInterval(() => {
            setCurrPoundsLost((prev) => {
                if (prev + 1 >= poundsLost) {
                    clearInterval(lbTimer);
                    return poundsLost;
                }
                return prev + 1;
            });
        }, 70);
    }, []);

    return (
        <>
            <div className='flex flex-col justify-start items-start gap-3'>
                <div className={`intake-subtitle text-slate-500`}>
                    Here&apos;s what to expect in your journey with BIOVERSE.
                </div>

                <div
                    className={`${INTAKE_PAGE_SUBTITLE_TAILWIND}  w-[90%] md:max-w-[520px] flex flex-col gap-3 shadow-lg rounded-lg p-4`}
                    style={{ border: '1.5px solid #E5E7EB' }}
                >
                    <div className='flex items-center gap-3'>
                        <Image
                            src='/img/intake/wl/Icon.png'
                            alt='checkmark'
                            width={20}
                            height={20}
                            unoptimized
                        />
                        <p>Your estimated new weight: {currWeight} lbs</p>
                    </div>
                    <div className='flex items-center gap-3'>
                        <Image
                            src='/img/intake/wl/Icon.png'
                            alt='checkmark'
                            width={20}
                            height={20}
                            unoptimized
                        />
                        <p>Total pounds lost: {currPoundsLost} lbs</p>
                    </div>
                    <div className='flex items-center gap-3'>
                        <Image
                            src='/img/intake/wl/Icon.png'
                            alt='checkmark'
                            width={20}
                            height={20}
                            unoptimized
                        />
                        <p>No restrictive dieting</p>
                    </div>
                </div>
            </div>
        </>
    );
}

function calculateNewWeightAndPoundsLost(
    user_body_weight: number,
    product_href: string
) {
    let newWeight: number | null = null;
    let poundsLost: number | null = null;

    if (SEMAGLUTIDE_PRODUCTS.includes(product_href as PRODUCT_HREF)) {
        const weightLost = 0.168;

        newWeight = Math.round(user_body_weight * (1 - weightLost));
        poundsLost = user_body_weight - newWeight;
    } else if (TIRZEPATIDE_PRODUCTS.includes(product_href as PRODUCT_HREF)) {
        const weightLost = 0.2;

        newWeight = Math.round(user_body_weight * (1 - weightLost));
        poundsLost = user_body_weight - newWeight;
    } else if (TIRZEPATIDE_PRODUCTS.includes(product_href as PRODUCT_HREF)) {
        const weightLost = 0.2;

        newWeight = Math.round(user_body_weight * (1 - weightLost));
        poundsLost = user_body_weight - newWeight;
    } else if (product_href === PRODUCT_HREF.METFORMIN) {
        const weightLost = 0.2;

        newWeight = Math.round(user_body_weight * (1 - weightLost));
        poundsLost = user_body_weight - newWeight;
    }

    if (poundsLost !== null) {
        poundsLost = Math.round(poundsLost * 10) / 10;
    }

    return { newWeight: newWeight, poundsLost: poundsLost };
}
