'use client';

import React from 'react';

import Image from 'next/image';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import {
    INTAKE_PAGE_BODY_TAILWIND,
    INTAKE_PAGE_HEADER_TAILWIND,
} from '@/app/components/intake-v2/styles/intake-tailwind-declarations';
import ContinueButton from '@/app/components/intake-v2/buttons/ContinueButton';

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
            <div className={`justify-center flex animate-slideRight mx-auto `}>
                <div className='flex flex-row gap-8 '>
                    <div className='flex flex-col md:gap-8 md:w-[433px] min-h-screen'>
                        <BioType
                            className={`${INTAKE_PAGE_HEADER_TAILWIND} !text-primary mb-3 md:mb-0`}
                        >
                            You&apos;re in good hands.
                        </BioType>

                        <div className=' flex flex-col gap-2 md:gap-12 mb-9 md:mb-0 '>
                            <div className=' flex flex-row justify-between w-full '>
                                <div className='relative w-[65%] md:w-[55%]  md:aspect-[3.04] aspect-[3.82]'>
                                    <Image
                                        src={
                                            '/img/intake/nad-researchers/harvard.png'
                                        }
                                        alt={'Harvard Med School Logo'}
                                        fill
                                        unoptimized
                                    />
                                </div>

                                <div className='relative w-[50%] md:w-[32.1%] aspect-[2.26]'>
                                    <Image
                                        src={
                                            '/img/intake/nad-researchers/ecole.png'
                                        }
                                        alt={'Ecole School Logo'}
                                        fill
                                        objectFit='contain'
                                        unoptimized
                                    />
                                </div>
                            </div>
                            <div className=' flex flex-row justify-between  w-full '>
                                <div className='relative w-[43.4%] md:w-[32.1%] aspect-[2.31]'>
                                    <Image
                                        src={
                                            '/img/intake/nad-researchers/duke.png'
                                        }
                                        alt={'Duke School Logo'}
                                        fill
                                        objectFit='contain'
                                        unoptimized
                                    />
                                </div>
                                <div className='relative w-[48.8%] md:w-[54.5%] aspect-[3.86]'>
                                    <Image
                                        src={
                                            '/img/intake/nad-researchers/mit.png'
                                        }
                                        alt={'MIT School Logo'}
                                        fill
                                        objectFit='cover'
                                        unoptimized
                                    />
                                </div>
                            </div>
                        </div>
                        <BioType className={`${INTAKE_PAGE_BODY_TAILWIND}`}>
                            Researchers from these institutions have highlighted
                            the benefits of NAD+ for health, aging, and disease
                            prevention.
                        </BioType>

                        <div
                            className={`w-full md:w-1/3 mx-auto md:flex md:justify-center`}
                        >
                            <ContinueButton
                                onClick={handleContinueButton}
                                buttonLoading={isButtonLoading}
                            />
                        </div>

                        {/* )} */}
                    </div>
                </div>
            </div>
        </>
    );
};

export default NadResearchersComponent;
