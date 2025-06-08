'use client';

import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams,
} from 'next/navigation';
import { getNextIntakeRoute } from '@/app/utils/functions/intake-route-controller';
import { getIntakeURLParams } from '../intake-functions';
import React, { useState, useEffect } from 'react';
import BioType from '../../global-components/bioverse-typography/bio-type/bio-type';
import ContinueButton from '../buttons/ContinueButton';
import {
    INTAKE_PAGE_BODY_TAILWIND,
    INTAKE_PAGE_HEADER_TAILWIND,
    INTAKE_PAGE_SUBTITLE_TAILWIND,
} from '../styles/intake-tailwind-declarations';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import CheckIcon from '@mui/icons-material/Check';
import { Paper } from '@mui/material';
import Image from 'next/image';
import useSWR from 'swr';
import { getImageRefUsingProductHref } from '@/app/utils/database/controller/products/products';
import { continueButtonExitAnimation } from '../intake-animations';
import { RudderstackEvent } from '@/app/types/services/rudderstack/rudderstack-types';
import { trackRudderstackEvent } from '@/app/utils/functions/rudderstack/rudderstack-utils';

interface UpNextProps {
    productName?: string;
    user_id: string;
}

export default function WLUpNextPreviewComponent({
    productName,
    user_id,
}: UpNextProps) {
    const router = useRouter();
    const url = useParams();
    const searchParams = useSearchParams();
    const search = searchParams.toString();
    const fullPath = usePathname();
    const { product_href } = getIntakeURLParams(url, searchParams);
    const [buttonLoading, setButtonLoading] = useState<boolean>(false);

    const { data, error, isLoading } = useSWR(`${product_href}-image`, () =>
        getImageRefUsingProductHref(
            productName && productName !== 'metformin'
                ? productName
                : product_href,
        ),
    );

    const pushToNextRoute = async () => {
        setButtonLoading(true);
        const nextRoute = getNextIntakeRoute(fullPath, product_href, search);
        const searchParams = new URLSearchParams(search);
        const newSearch = searchParams.toString();
        await continueButtonExitAnimation(150);
        await trackRudderstackEvent(
            user_id,
            RudderstackEvent.ID_VERIFICATION_REACHED,
        );
        router.push(
            `/intake/prescriptions/${product_href}/${nextRoute}?${newSearch}`,
        );
    };

    const mainImageRef = data?.data?.[0];

    return (
        <>
            <div className={`justify-center  animate-slideRight`}>
                <div className="flex flex-row gap-8">
                    <div className="flex flex-col gap-4">
                        <BioType className={`${INTAKE_PAGE_HEADER_TAILWIND}`}>
                            Finally, let&rsquo;s verify your identity and
                            preview your treatment request.
                        </BioType>

                        <BioType className={`${INTAKE_PAGE_SUBTITLE_TAILWIND}`}>
                            We are required by telemedicine laws to verify your
                            identity before prescribing medication.
                        </BioType>

                        <div className="flex flex-row w-full">
                            <div className="flex flex-col justify-between gap-2">
                                <CheckIcon sx={{ color: '#AFAFAF' }} />
                                <div className="mt-[13.5vw] md:mt-[57px] absolute">
                                    <CheckIcon sx={{ color: '#AFAFAF' }} />
                                </div>
                                <div className="mt-[27vw] md:mt-[114px] absolute">
                                    <CheckIcon sx={{ color: '#AFAFAF' }} />
                                </div>

                                <div className="ml-0.4 mt-[40.5vw] md:mt-[171px] absolute">
                                    <RadioButtonCheckedIcon color="primary" />
                                </div>
                            </div>
                            <div className="flex flex-col ml-2 gap-2 justify-between flex-1">
                                <div className="mt-1">
                                    <BioType
                                        className={`flex flex-row justify-start items-center text-[#AFAFAF] ${INTAKE_PAGE_SUBTITLE_TAILWIND}`}
                                    >
                                        Account Created
                                    </BioType>
                                </div>
                                <div className="mt-4 flex flex-col gap-1">
                                    <BioType
                                        className={`flex flex-row justify-start items-center text-[#AFAFAF] ${INTAKE_PAGE_SUBTITLE_TAILWIND}`}
                                    >
                                        Weight loss profile built
                                    </BioType>
                                </div>
                                <div className="mt-4 flex flex-col gap-1">
                                    <BioType
                                        className={`flex flex-row justify-start items-center text-[#AFAFAF] ${INTAKE_PAGE_SUBTITLE_TAILWIND}`}
                                    >
                                        Health history completed
                                    </BioType>
                                </div>
                                <div className="mt-4 flex flex-col gap-1">
                                    <BioType
                                        className={`flex flex-row justify-start items-center ${INTAKE_PAGE_SUBTITLE_TAILWIND}`}
                                    >
                                        Treatment Preview
                                    </BioType>
                                </div>
                                <div className="mt-2 flex flex-col gap-1 w-full">
                                    <Paper className="flex flex-row items-center md:items-center gap-3 md:gap-8 py-4 px-5 md:px-8 md:justify-start">
                                        <div className="flex">
                                            <div className="w-[114px] relative h-[76px]">
                                                <Image
                                                    src={
                                                        mainImageRef
                                                            ? `${process.env.NEXT_PUBLIC_PDP_MAIN_IMAGE_KEY}${mainImageRef}`
                                                            : '/img/intake/wl/metformin.png'
                                                    }
                                                    alt={'Vial Image'}
                                                    fill
                                                    objectFit="cover"
                                                    objectPosition="0px -5px"
                                                    sizes="(max-width:  1440px) calc(100vw -  2 * ((100vw -  456px) /  2)),  100vw"
                                                    unoptimized
                                                />
                                            </div>
                                        </div>
                                        <div className="flex pl-4">
                                            <BioType
                                                className={`${INTAKE_PAGE_BODY_TAILWIND}`}
                                            >
                                                <ul>
                                                    <li>Verify Identity</li>
                                                    <li>
                                                        What you&rsquo;ll get
                                                    </li>
                                                    <li>Submit request</li>
                                                </ul>
                                            </BioType>
                                        </div>
                                    </Paper>
                                </div>
                            </div>
                        </div>

                        <div
                            className={`w-full md:w-1/3 mx-auto md:flex md:justify-center `}
                        >
                            <ContinueButton
                                onClick={pushToNextRoute}
                                buttonLoading={buttonLoading}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
