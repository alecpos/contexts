'use client';

import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams,
} from 'next/navigation';
import React, { useState } from 'react';
import BioType from '../../../../../../global-components/bioverse-typography/bio-type/bio-type';
import {
    INTAKE_PAGE_BODY_TAILWIND,
    INTAKE_PAGE_HEADER_TAILWIND,
    INTAKE_PAGE_SUBTITLE_TAILWIND,
} from '../../../../../styles/intake-tailwind-declarations';
import { Button, CircularProgress, Divider } from '@mui/material';
import { USStates } from '@/app/types/enums/master-enums';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';

interface OverviewComponentProps {
    handleContinueButton: any;
    isButtonLoading: boolean;
    getPrice: (product_href: string) => string;
}

export default function SemaglutideOverviewComponent({
    handleContinueButton,
    isButtonLoading,
    getPrice,
}: OverviewComponentProps) {
    const searchParams = useSearchParams();

    return (
        <>
            <div className={`justify-center flex`}>
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col md:gap-[28px] gap-4 animate-slideRight">
                        <BioType className={`${INTAKE_PAGE_HEADER_TAILWIND}`}>
                            Semaglutide
                        </BioType>
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col md:gap-2 gap-4">
                                <BioType
                                    className={`${INTAKE_PAGE_SUBTITLE_TAILWIND}`}
                                >
                                    Overview
                                </BioType>
                                <BioType
                                    className={`${INTAKE_PAGE_BODY_TAILWIND} text-textSecondary`}
                                >
                                    Semaglutide is the generic name for Ozempic
                                    ® and Wegovy®, GLP-1 medications that are
                                    FDA-approved for treatment of type 2
                                    diabetes and weight loss respectively.{' '}
                                    <br />
                                    <br />
                                    Compounded semaglutide contains the same
                                    active ingredient as the commercially
                                    available medications Ozempic ® and
                                    Wegovy®.*
                                </BioType>
                            </div>
                            <Divider />
                            <div className="flex flex-col md:gap-2 gap-4">
                                <BioType
                                    className={`${INTAKE_PAGE_SUBTITLE_TAILWIND}`}
                                >
                                    Results
                                </BioType>
                                <BioType
                                    className={`${INTAKE_PAGE_BODY_TAILWIND} text-textSecondary`}
                                >
                                    Studies have shown that once weekly
                                    semaglutide injections led to 14.9% of body
                                    weight loss on average over 68 weeks. †
                                </BioType>
                            </div>
                            <div className="flex flex-col md:gap-2 gap-4">
                                <BioType
                                    className={`${INTAKE_PAGE_SUBTITLE_TAILWIND}`}
                                >
                                    Cost
                                </BioType>
                                <BioType
                                    className={`${INTAKE_PAGE_BODY_TAILWIND} text-textSecondary`}
                                >
                                    BIOVERSE offers compounded semaglutide for
                                    as little as $
                                    {getPrice(PRODUCT_HREF.SEMAGLUTIDE)}/ month
                                    – much more affordable than other healthcare
                                    providers. Unlike other healthcare
                                    providers, we do not require insurance or
                                    prior authorization. Your medication would
                                    be shipped to your home at no additional
                                    cost.
                                </BioType>
                            </div>
                        </div>
                        <div className="md:my-0 my-4">
                            <Button
                                variant="contained"
                                fullWidth
                                sx={{
                                    width: {
                                        xs: 'calc(100vw - 48px)',
                                        sm: '100%',
                                    },
                                    height: '52px',
                                    // '@media (min-width:768px)': {
                                    //     width: '118px',
                                    // },
                                    // position: { xs: 'fixed', sm: 'static' },
                                    // bottom: { xs: bottomXs, sm: 0 },
                                    padding: '16px',
                                    zIndex: 30,
                                    backgroundColor: '#000000',
                                    '&:hover': {
                                        backgroundColor: '#666666',
                                    },
                                }}
                                onClick={handleContinueButton}
                            >
                                <BioType className="hidden md:flex">
                                    {isButtonLoading ? (
                                        <CircularProgress
                                            sx={{ color: '#FFFFFF' }}
                                        />
                                    ) : (
                                        'Select as preferred medication and continue'
                                    )}
                                </BioType>
                                <BioType className="md:hidden">
                                    {isButtonLoading ? (
                                        <CircularProgress
                                            sx={{ color: '#FFFFFF' }}
                                        />
                                    ) : (
                                        'Select as preferred medication'
                                    )}
                                </BioType>
                            </Button>
                        </div>
                        <div className="flex flex-col gap-2 md:mb-0 mb-[100px]">
                            <BioType
                                className={`${INTAKE_PAGE_BODY_TAILWIND} opacity-[.38] `}
                            >
                                * Compound formulations are not FDA-approved and
                                may not yield the same results as the
                                commercially available formulations.
                                <br />
                                <br />† When used in combination with a
                                restricted calorie diet and exercise program.
                            </BioType>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
