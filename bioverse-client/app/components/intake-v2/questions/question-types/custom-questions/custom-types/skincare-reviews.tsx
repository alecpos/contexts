'use client';

import React from 'react';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { INTAKE_PAGE_BODY_TAILWIND, INTAKE_PAGE_HEADER_TAILWIND } from '@/app/components/intake-v2/styles/intake-tailwind-declarations';
import Image from 'next/image';
import { Button, CircularProgress, Paper } from '@mui/material';

interface SkincareReviewsProps {
    handleContinueButton: any;
    isButtonLoading:boolean;
}

export default function SkincareReviewsComponent({
    handleContinueButton,
    isButtonLoading
}: SkincareReviewsProps) {

    return (
        <>
            <div className={`justify-center flex animate-slideRight mx-auto`}>
                <div className="flex flex-row gap-8">
                    <div className="flex flex-col gap-6 w-full md:w-[433px]">
                        <BioType
                            className={`${INTAKE_PAGE_HEADER_TAILWIND} !text-primary`}
                        >
                            See what others are saying about their treatments.
                        </BioType>

                        <div className="flex flex-row md:justify-center gap-4 md:max-w-[840px] max-w-[315px] p-2 md:p-0 overflow-x-auto md:overflow-x-visible mx-auto md:m-0">
                            <Paper elevation={3}>
                                <div className="flex flex-col px-6 py-4 min-h-[382px]">
                                    <div className="flex">
                                        <div className="w-[216px] relative h-[144px] rounded-[4px] overflow-hidden">
                                            <Image
                                                src={
                                                    '/img/intake/skincare/reviews1.jpeg'
                                                }
                                                alt={'Review picture 1'}
                                                fill
                                                objectFit="cover"
                                                unoptimized
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-1 mt-4 flex-grow">
                                        <BioType
                                            className={`${INTAKE_PAGE_BODY_TAILWIND} `}
                                        >
                                            “My skin used to get so dry and
                                            cracked that it hurt. Since using
                                            this anti-aging cream, my skin looks
                                            and feels 100x better.”
                                        </BioType>
                                    </div>
                                    <div className="flex flex-col">
                                        <BioType
                                            className={`${INTAKE_PAGE_BODY_TAILWIND} `}
                                        >
                                            David L
                                        </BioType>
                                        <BioType
                                            className={`${INTAKE_PAGE_BODY_TAILWIND} !text-textSecondary`}
                                        >
                                            Los Angeles, CA
                                        </BioType>
                                    </div>
                                </div>
                            </Paper>
                            <Paper elevation={3}>
                                <div className="flex flex-col px-6 py-4 min-h-[382px]">
                                    <div className="flex">
                                    <div className="relative w-[216px] h-[144px] rounded-[4px] overflow-hidden">
                                        <div className="absolute top-[-30px] w-full h-[calc(100%+30px)]">
                                            <Image
                                                src={'/img/intake/skincare/reviews2.jpeg'}
                                                alt={'Review picture 2'}
                                                layout="fill"
                                                className="object-cover"
                                                unoptimized
                                            />
                                        </div>
                                    </div>

                                    </div>
                                    <div className="flex flex-1 mt-4 flex-grow">
                                        <BioType
                                            className={`${INTAKE_PAGE_BODY_TAILWIND} `}
                                        >
                                            “Breakouts had been a major source
                                            of embarrassment since high school.
                                            Now I don&apos;t have to worry about
                                            them and my skin glows!”
                                        </BioType>
                                    </div>
                                    <div className="flex flex-col">
                                        <BioType
                                            className={`${INTAKE_PAGE_BODY_TAILWIND} `}
                                        >
                                            Summer J.
                                        </BioType>
                                        <BioType
                                            className={`${INTAKE_PAGE_BODY_TAILWIND} !text-textSecondary`}
                                        >
                                            Fort Lauderdale, FL
                                        </BioType>
                                    </div>
                                </div>
                            </Paper>
                            <Paper elevation={3}>
                                <div className="flex flex-col px-6 py-4 min-h-[382px]">
                                    <div className="flex">
                                        <div className="w-[216px] relative h-[144px] rounded-[4px] overflow-hidden">
                                            <Image
                                                src={
                                                    '/img/intake/skincare/reviews3.jpeg'
                                                }
                                                alt={'Review picture 3'}
                                                fill
                                                objectFit="cover"
                                                unoptimized
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-1 mt-4 flex-grow">
                                        <BioType
                                            className={`${INTAKE_PAGE_BODY_TAILWIND} `}
                                        >
                                            “Very happy my dark spots have
                                            started to go away. Good Product.
                                            Good price.”
                                        </BioType>
                                    </div>
                                    <div className="flex flex-col">
                                        <BioType
                                            className={`${INTAKE_PAGE_BODY_TAILWIND} `}
                                        >
                                            Lucy N.
                                        </BioType>
                                        <BioType
                                            className={`${INTAKE_PAGE_BODY_TAILWIND} !text-textSecondary`}
                                        >
                                            San Bernadino, CA
                                        </BioType>
                                    </div>
                                </div>
                            </Paper>
                        </div>

                        <div
                            //In the class-name, mt-[100vh] is added to mobile to remove the button from view to avoid FOUC issues
                            className={`w-full md:flex md:justify-center animate-slideRight  md:mt-2`}
                        >
                            <Button
                                variant='contained'
                                fullWidth
                                sx={{
                                    width: {

                                        sm: '100%',
                                    },
                                    height: '52px',
                                    zIndex: 30,
                                    backgroundColor: '#000000',
                                    '&:hover': {
                                        backgroundColor: '#666666',
                                    },
                                }}
                                onClick={handleContinueButton}
                                >
                                {isButtonLoading ? (
                                    <CircularProgress sx={{ color: 'white' }} size={22} />
                                ) : (
                                    'Continue'
                                )}
                            </Button>
                        </div>
                        <BioType
                            className={`${INTAKE_PAGE_BODY_TAILWIND} text-textSecondary`}
                        >
                            Individual results may vary. Customer results have
                            not been independently verified.
                        </BioType>

                        {/* )} */}
                    </div>
                </div>
            </div>
        </>
    );
}
