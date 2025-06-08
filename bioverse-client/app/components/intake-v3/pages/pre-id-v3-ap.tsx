'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams,
} from 'next/navigation';
import { getIntakeURLParams } from '../intake-functions';
import { getNextIntakeRoute } from '@/app/utils/functions/intake-route-controller';
import { useEffect, useState } from 'react';
import CheckIcon from '@mui/icons-material/Check';
import { Paper } from '@mui/material';
import { getImageRefUsingProductHref } from '@/app/utils/database/controller/products/products';
import useSWR from 'swr';
import Image from 'next/image';
import AnimatedContinueButtonV3AP from '../buttons/AnimatedContinueButtonV3AP';
import LoadingScreen from '../../global-components/loading-screen/loading-screen';
import { trackRudderstackEvent } from '@/app/utils/functions/rudderstack/rudderstack-utils';
import { RudderstackEvent } from '@/app/types/services/rudderstack/rudderstack-types';

interface PreIDProps {
    user_id: string;
    preExistingLicense: string;
    preExistingSelfie: string;
    productName?: string;
}

export default function PreIdScreen({
    user_id,
    preExistingLicense,
    preExistingSelfie,
    productName,
}: PreIDProps) {
    const router = useRouter();
    const url = useParams();
    const searchParams = useSearchParams();
    const search = searchParams.toString();
    const fullPath = usePathname();
    const { product_href } = getIntakeURLParams(url, searchParams);

    //getImageRefUsingProductHref
    const { data, error, isLoading } = useSWR(`${product_href}-image`, () =>
        getImageRefUsingProductHref(
            productName && productName !== 'metformin'
                ? productName
                : product_href
        )
    );


    const pushToNextRoute = async () => {
        await trackRudderstackEvent(
            user_id,
            RudderstackEvent.ID_VERIFICATION_REACHED
        );

        const nextRoute = getNextIntakeRoute(fullPath, product_href, search);
        router.push(
            `/intake/prescriptions/${product_href}/${nextRoute}?${search}`
        );
    };

    useEffect(() => {
        if (preExistingLicense && preExistingSelfie) {
            //pushToNextRoute();
        }
    }, [preExistingLicense, preExistingSelfie]);

    if (isLoading) {
        return <LoadingScreen />;
    }

    if (error) {
        return (
            <>
                <BioType>Error</BioType>
            </>
        );
    }

    const mainImageRef = data?.data?.[0];

    return (
        <div
            className={`justify-center flex animate-slideRight mt-[1.25rem] md:mt-[48px]`}
        >
            <div className='flex flex-row gap-10'>
                <div className='flex flex-col gap-4'>
                    <div className=' flex-col flex px-2'>
                        <BioType className={`inter-h5-question-header`}>
                            {product_href === 'sermorelin' 
                                ? "You're almost done. Let's verify your identity"
                                : "Finally, let's verify your identity and preview your treatment request."
                            }
                        </BioType>
                        <p className={`intake-subtitle mt-[12px]`}>
                            We are required by telemedicine laws to verify your
                            identity before prescribing medication.
                        </p>

                        <div className='flex flex-col gap-2 mt-4'>
                            <BioType
                                className={`flex flex-row justify-start items-center text-[#656565] intake-subtitle gap-2 `}
                            >
                                <CheckIcon />
                                Account Created
                            </BioType>

                            <BioType
                                className={`flex flex-row justify-start items-center text-[#656565] intake-subtitle  gap-2 `}
                            >
                                <CheckIcon />
                                {product_href === 'sermorelin' 
                                    ? "Health history completed"
                                    : "Weight loss profile built"
                                }
                            </BioType>

                            <BioType
                                className={`flex flex-row justify-start items-center text-[#656565] intake-subtitle  gap-2 `}
                            >
                            </BioType>

                            <BioType
                                className={`flex flex-row justify-start items-center text-[#656565] intake-subtitle  gap-2  mt-4 mb-5`}
                            >
                                <div
                                    className='relative w-6 h-6'
                                    style={{
                                        marginLeft: '3px',
                                        marginRight: '3px',
                                    }}
                                >
                                    <div className='absolute inset-0 rounded-full bg-[#6db0cc]'></div>
                                    <div className='absolute inset-[2px] rounded-full bg-white'></div>
                                    <div className='absolute inset-[10px] rounded-full bg-[#6db0cc]'></div>
                                </div>
                                {product_href === 'sermorelin' 
                                    ? "Treatment Preview"
                                    : "Treatment Preview"
                                }
                            </BioType>
                        </div>
                        <Paper className='flex flex-row rounded-xl mx-8 mb-4 h-[94px]'>
                            <div className='pl-6 sm:pl-8 sm:pr-4 h-[70px] mt-2 mb-3 overflow-hidden flex flex-col justify-center pt-1'>
                                <Image
                                    src={
                                        product_href === 'sermorelin'
                                            ? '/img/product-images/prescriptions/sermorelin.png'
                                            : data?.data?.[0]
                                            ? `${process.env.NEXT_PUBLIC_PDP_MAIN_IMAGE_KEY}${mainImageRef}`
                                            : '/img/intake/wl/metformin.png'
                                    }
                                    width={80}
                                    height={80}
                                    alt={`Product Image: ${mainImageRef}`}
                                    priority
                                    style={{ objectFit: 'contain' }}
                                    unoptimized
                                />
                            </div>
                            <div
                                className={`flex flex-col justify-center items-start intake-v3-question-text  text-[#666666] `}
                            >
                                <BioType>• Verify Identity</BioType>
                                <BioType>• What you&apos;ll get</BioType>
                                <BioType>• Submit request</BioType>
                            </div>
                        </Paper>
                    </div>

                    <AnimatedContinueButtonV3AP 
                        onClick={pushToNextRoute} 
                        buttonText={product_href === 'sermorelin' ? "Verify Identity" : undefined}
                    />
                </div>
            </div>
        </div>
    );
}
