'use client';

import React from 'react';

import Image from 'next/image';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import {
    INTAKE_PAGE_BODY_TAILWIND,
    INTAKE_PAGE_HEADER_TAILWIND,
} from '@/app/components/intake-v2/styles/intake-tailwind-declarations';
import ContinueButtonV3 from '@/app/components/intake-v3/buttons/ContinueButtonV3';

interface NadResearchersQuestionProps {
    handleContinueButton: any;
    isButtonLoading: boolean;
}
const NadResearchersComponent = ({
    handleContinueButton,
    isButtonLoading,
}: NadResearchersQuestionProps) => {
    return (
        <>
            <div className={`justify-center flex animate-slideRight w-full mt-[1.25rem] md:mt-[48px]`}>
                <div className='flex flex-row gap-8 w-full'>
                    <div className='flex flex-col  min-h-screen'>
                        <BioType
                            className={`inter_h5_regular`}
                        >
                            You&apos;re in good hands.
                        </BioType>

                        <div className='mt-[1.25rem] md:mt-[48px] relative w-full h-[12.5rem]'>
                            <Image
                                src='/img/intake/nad-researchers/4universities.png'
                                alt='Harvard Med School Logo'
                                fill
                                className='object-contain'
                            />
                        </div>
                        <p className={`inter_body_regular text-weak mt-[1.25rem] md:mt-[48px]`}>
                            Researchers from these institutions have highlighted
                            the benefits of NAD+ for health, aging, and disease
                            prevention.
                        </p>

                        <div
                            className={`w-full md:w-1/3 mx-auto md:flex md:justify-center mt-[1.25rem] md:mt-[48px]`}
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
};

export default NadResearchersComponent;