'use client';

import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams,
} from 'next/navigation';
import React, { useState, useEffect } from 'react';
import BioType from '../../../../../global-components/bioverse-typography/bio-type/bio-type';
import Image from 'next/image';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import VerticalDivider from '../../../../../global-components/dividers/verticalDivider/verticalDivider';
import CheckIcon from '@mui/icons-material/Check';
import { LinearProgress, Paper } from '@mui/material';
import VerticalGradientLineSVG from '@/app/components/intake-v2/assets/vertical-gradient-line';
import VerticalGradientLineSVGMobile from '@/app/components/intake-v2/assets/vertical-gradient-line-mobile';
import ContinueButtonV3 from '@/app/components/intake-v3/buttons/ContinueButtonV3';
import { getIntakeURLParams } from '@/app/components/intake-v2/intake-functions';

interface UpNextHealthHistoryProps {
    handleContinueButton: any;
    isButtonLoading: boolean;
}

export default function UpNextHealthHistoryTransition({
    handleContinueButton,
    isButtonLoading,
}: UpNextHealthHistoryProps) {
    const router = useRouter();
    const url = useParams();
    const searchParams = useSearchParams();
    const search = searchParams.toString();
    const fullPath = usePathname();
    const { product_href } = getIntakeURLParams(url, searchParams);
    const [buttonLoading, setButtonLoading] = useState<boolean>(false);

    return (
        <>
            <div
                className={`justify-center flex animate-slideRight mt-[1.25rem] md:mt-[48px]`}
            >
                <div className="flex flex-row ">
                    <div className="flex flex-col gap-[1.25rem] md:gap-[48px]">
                        <div className="flex flex-col gap-[0.75rem] md:gap-[12px]">
                            <BioType className={`inter-h5-question-header`}>
                                Up next, your health history
                            </BioType>

                            <BioType className={`intake-subtitle`}>
                                Answer some questions about you and your
                                lifestyle. It takes less than 5 minutes.
                            </BioType>
                        </div>

                        <div className="flex flex-row">
                            <div className="flex flex-col justify-between gap-2">
                                <CheckIcon sx={{ color: '#AFAFAF' }} />

                                <div className="mt-[13.5vw] md:mt-[57px] absolute">
                                    <CheckIcon sx={{ color: '#AFAFAF' }} />
                                </div>

                                <div className="ml-0.4 mt-[27vw] md:mt-[116px] absolute">
                                    <RadioButtonCheckedIcon
                                        sx={{
                                            color: '#286BA2',
                                            padding: 0,
                                            margin: 0,
                                        }}
                                    />
                                </div>
                                <div className="ml-3 hidden md:flex mt-[140px] absolute">
                                    <VerticalGradientLineSVG
                                        height="180"
                                        key={'linedesktopvert'}
                                    />
                                </div>
                                <div className="ml-3 flex md:hidden mt-[33.5vw] absolute">
                                    <VerticalGradientLineSVGMobile
                                        height="60vw"
                                        key={'linemobilevert'}
                                    />
                                </div>
                                <div className="ml-0.4 mt-[91.3vw] md:mt-[315px] absolute">
                                    <RadioButtonUncheckedIcon
                                        sx={{
                                            color: '#AFAFAF',
                                            backgroundColor: '#FAFAFA',
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col ml-2 gap-4 justify-between">
                                <div className="mt-1">
                                    <BioType
                                        className={`flex flex-row justify-start items-center text-[#AFAFAF] intake-subtitle`}
                                    >
                                        Account Created
                                    </BioType>
                                </div>
                                <div className="mt-4 flex flex-col gap-1">
                                    <BioType
                                        className={`flex flex-row justify-start items-center intake-subtitle text-[#AFAFAF]`}
                                    >
                                        Weight Loss Profile Built
                                    </BioType>
                                </div>
                                <div className="mt-4 flex flex-col gap-1">
                                    <BioType
                                        className={`flex flex-row justify-start items-center  intake-subtitle`}
                                    >
                                        Health History
                                    </BioType>
                                    <Paper className="flex flex-row w-full h-[50vw] md:h-[150px] mt-2 items-center gap-2">
                                        <div className="flex ml-4  md:pt-0  ">
                                            <div className="w-[8rem] md:w-[150px] relative h-[6rem] md:h-[130px] ">
                                                <Image
                                                    src={
                                                        '/img/intake/up-next/female-doctor-head-cropped.png'
                                                    }
                                                    alt={'Doctor Image'}
                                                    fill
                                                    style={{
                                                        objectFit: 'cover',
                                                        borderRadius: '12px',
                                                    }}
                                                    unoptimized
                                                />
                                            </div>
                                        </div>
                                        <div className="flex flex-1 pl-4 md:pl-2 pr-4 py-2 ">
                                            <BioType
                                                className={`intake-v3-disclaimer-text`}
                                            >
                                                This is important because
                                                it&apos;ll be used by your
                                                provider to write your
                                                prescription, if medically
                                                appropriate.
                                            </BioType>
                                        </div>
                                    </Paper>
                                </div>
                                <div className="mt-1 flex flex-col gap-1">
                                    <BioType
                                        className={`flex flex-row justify-start items-center text-textSecondary intake-subtitle`}
                                    >
                                        Treatment Preview
                                    </BioType>
                                </div>
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
