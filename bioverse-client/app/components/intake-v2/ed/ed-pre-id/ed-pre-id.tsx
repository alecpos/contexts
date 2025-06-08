'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams,
} from 'next/navigation';
import { getNextIntakeRoute } from '@/app/utils/functions/intake-route-controller';
import { useState } from 'react';

import CheckIcon from '@mui/icons-material/Check';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import { Paper } from '@mui/material';
import Image from 'next/image';

import { trackRudderstackEvent } from '@/app/utils/functions/rudderstack/rudderstack-utils';
import { RudderstackEvent } from '@/app/types/services/rudderstack/rudderstack-types';
import AnimatedContinueButton from '../../buttons/AnimatedContinueButton';
import { getIntakeURLParams } from '../../intake-functions';
import {
    INTAKE_PAGE_HEADER_TAILWIND,
    INTAKE_PAGE_SUBTITLE_TAILWIND,
    INTAKE_PAGE_BODY_TAILWIND,
} from '../../styles/intake-tailwind-declarations';
import { ED_PRODUCT_IMAGE_RED_MAP } from '../utils/ed-selection-index';

interface PreIDProps {
    user_id: string;
    edSelectionMetadata: any;
}

export default function EDPreIdScreen({
    user_id,
    edSelectionMetadata,
}: PreIDProps) {
    const router = useRouter();
    const url = useParams();
    const searchParams = useSearchParams();
    const search = searchParams.toString();
    const fullPath = usePathname();
    const { product_href } = getIntakeURLParams(url, searchParams);
    const [buttonLoading, setButtonLoading] = useState<boolean>(false);

    const pushToNextRoute = async () => {
        setButtonLoading(true);

        await trackRudderstackEvent(
            user_id,
            RudderstackEvent.ID_VERIFICATION_REACHED
        );

        const nextRoute = getNextIntakeRoute(fullPath, product_href, search);
        router.push(
            `/intake/prescriptions/${product_href}/${nextRoute}?${search}`
        );
    };

    const mainImageRef =
        ED_PRODUCT_IMAGE_RED_MAP[edSelectionMetadata.productHref];

    return (
        <div className={`justify-center flex animate-slideRight`}>
            <div className='flex flex-row gap-10'>
                <div className='flex flex-col gap-4'>
                    <div className='gap-6 md:gap-4 flex-col flex'>
                        <BioType className={`${INTAKE_PAGE_HEADER_TAILWIND}`}>
                            Finally, let&apos;s verify your identity and preview
                            your treatment request.
                        </BioType>
                        <BioType className={`${INTAKE_PAGE_SUBTITLE_TAILWIND}`}>
                            We are required by telemedicine laws to verify your
                            identity before prescribing medication.
                        </BioType>

                        <div className='flex flex-col gap-4 px-4'>
                            <BioType
                                className={`flex flex-row justify-start items-center text-[#AFAFAF] ${INTAKE_PAGE_BODY_TAILWIND} gap-2`}
                            >
                                <CheckIcon />
                                Account Created
                            </BioType>

                            <BioType
                                className={`flex flex-row justify-start items-center text-[#AFAFAF] ${INTAKE_PAGE_BODY_TAILWIND} gap-2`}
                            >
                                <CheckIcon />
                                Health history completed
                            </BioType>

                            <BioType
                                className={`flex flex-row justify-start items-center text-text ${INTAKE_PAGE_BODY_TAILWIND} gap-2`}
                            >
                                <RadioButtonCheckedIcon color='primary' />
                                Treatment Preview
                            </BioType>
                        </div>
                        <Paper className='flex flex-row justify-start gap-8 px-16 py-4'>
                            <div className=''>
                                <Image
                                    src={`${mainImageRef}`}
                                    width={92}
                                    height={76}
                                    sizes='(max-width:  360px)  327px, (max-width:  1440px)  550px, (max-width:  2560px)  768px, (max-width:  3840px)  1024px,  100vw'
                                    alt={`Product Image: ${mainImageRef}`}
                                    priority
                                    unoptimized
                                />
                            </div>
                            <div
                                className={`flex flex-col justify-center items-start ${INTAKE_PAGE_BODY_TAILWIND} gap-2`}
                            >
                                <BioType>• Verify Identity</BioType>
                                <BioType>• What you&apos;ll get</BioType>
                                <BioType>• Submit request</BioType>
                            </div>
                        </Paper>
                    </div>

                    <AnimatedContinueButton
                        onClick={pushToNextRoute}
                        customText={'Verify Identity'}
                    />
                </div>
            </div>
        </div>
    );
}
