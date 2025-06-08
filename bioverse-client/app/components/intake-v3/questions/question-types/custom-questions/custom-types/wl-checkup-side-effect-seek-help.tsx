'use client';

import React from 'react';
import ContinueButtonV3 from '@/app/components/intake-v3/buttons/ContinueButtonV3';

interface UpNextHealthHistoryProps {
    handleContinueButton: any;
    isButtonLoading: boolean;
}

export default function WLCheckupSideEffectSeekHelp({
    handleContinueButton,
    isButtonLoading,
}: UpNextHealthHistoryProps) {
    return (
        <>
            <div
                className={`justify-center flex animate-slideRight mt-[1.25rem] md:mt-[48px]`}
            >
                <div className='flex flex-col w-full max-w-[600px]'>
                    <div className='flex flex-col gap-[1.25rem] md:gap-[48px]'>
                        <div className='flex flex-col gap-[1.2rem] md:gap-[28px] mb-16 md:mb-0'>
                            <div className={`inter-h5-question-header`}>
                                If you are currently experiencing any severe,
                                persistent, and/or intolerable side effects,
                                please seek medical attention immediately at
                                your local urgent care or emergency department.
                            </div>
                        </div>

                        <div
                            className={`w-full md:w-1/3 mx-auto flex justify-center`}
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
