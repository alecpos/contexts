'use client';

import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams,
} from 'next/navigation';
import React, { useState } from 'react';
import ContinueButtonV3 from '@/app/components/intake-v3/buttons/ContinueButtonV3';
import { getIntakeURLParams } from '@/app/components/intake-v2/intake-functions';

interface UpNextHealthHistoryProps {
    handleContinueButton: any;
    isButtonLoading: boolean;
}

export default function WLSideEffectDisclaimer({
    handleContinueButton,
    isButtonLoading,
}: UpNextHealthHistoryProps) {
    return (
        <>
            <div
                className={`justify-center flex animate-slideRight mt-[1.25rem] md:mt-[48px]`}
            >
                <div className='flex flex-row '>
                    <div className='flex flex-col gap-[1.25rem] md:gap-[48px]'>
                        <div className='flex flex-col gap-[1.2rem] md:gap-[28px]'>
                            <div className={`inter-h5-question-header`}>
                                GLP-1 medications can be very effective, though
                                many users experience side effects.
                            </div>
                            <div className={`inter-h5-question-header`}>
                                At Bioverse, we offer customized treatment plans
                                designed to support your weight loss journey
                                while reducing these common side effects.
                            </div>
                            <div className={`inter-h5-question-header`}>
                                The following questions will help us understand
                                your weight loss history to better tailor your
                                treatment.
                            </div>
                        </div>

                        <div
                            className={`w-full md:w-1/3 mx-auto md:flex md:justify-center `}
                        >
                            <ContinueButtonV3
                                onClick={handleContinueButton}
                                buttonLoading={isButtonLoading}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
