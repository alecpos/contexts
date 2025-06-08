'use client';

import React, { useState, useEffect } from 'react';
import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams,
} from 'next/navigation';
import { getIntakeURLParams } from '../../../../intake-functions';
import BioType from '../../../../../global-components/bioverse-typography/bio-type/bio-type';
import ContinueButton from '../../../../buttons/ContinueButton';
import {
    INTAKE_PAGE_HEADER_TAILWIND,
    TRANSITION_HEADER_TAILWIND,
} from '../../../../styles/intake-tailwind-declarations';
import { Button, CircularProgress } from '@mui/material';

interface SkincareSideeffectsProps {
    handleContinueButton: any;
    isButtonLoading: boolean;
}
const SkincareSideEffectsComponent = ({
    handleContinueButton,
    isButtonLoading,
}: SkincareSideeffectsProps) => {
    return (
        <>
            <div className={`justify-center flex animate-slideRight `}>
                <div className="flex flex-col gap-8">
                    <div className="md:h-auto h-full flex flex-col gap-8 ">
                        <BioType
                            className={`${INTAKE_PAGE_HEADER_TAILWIND} !text-primary`}
                        >
                            Side effects such as dryness, redness, peeling, or
                            breakouts may effect a small percentage of patients
                            during the initial days of treatment. If your
                            provider approves your treatment request, please
                            follow the provider treatment protocol to minimize
                            side effects.
                        </BioType>
                    </div>

                    <div
                        className={`w-full md:w-1/3 mx-auto md:flex md:justify-center animate-slideRight`}
                    >
                        <Button
                            variant="contained"
                            fullWidth
                            sx={{
                                width: {
                                    sm: '100%',
                                },
                                height: '52px',
                                // '@media (min-width:768px)': {
                                //     width: '118px',
                                // },
                                // position: { xs: 'fixed', sm: 'static' },
                                // bottom: { xs: bottomXs, sm: 0 },
                                zIndex: 30,
                                backgroundColor: '#000000',
                                '&:hover': {
                                    backgroundColor: '#666666',
                                },
                            }}
                            onClick={handleContinueButton}
                        >
                            {isButtonLoading ? (
                                <CircularProgress
                                    sx={{ color: 'white' }}
                                    size={22}
                                />
                            ) : (
                                'I understand'
                            )}
                        </Button>
                    </div>

                    {/* )} */}
                </div>
            </div>
        </>
    );
};

export default SkincareSideEffectsComponent;
