'use client';

import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams,
} from 'next/navigation';
import { getNextIntakeRoute } from '@/app/utils/functions/intake-route-controller';
import { getIntakeURLParams } from '../intake-functions';
import React, { useState } from 'react';
import BioType from '../../global-components/bioverse-typography/bio-type/bio-type';
import ContinueButton from '../buttons/ContinueButton';
import { TRANSITION_HEADER_TAILWIND } from '../styles/intake-tailwind-declarations';
import AnimatedContinueButton from '../buttons/AnimatedContinueButton';
import Image from 'next/image';
import { BaseOrder } from '@/app/types/orders/order-types';
import { isWeightlossProduct } from '@/app/utils/functions/pricing';
import { trackRudderstackEvent } from '@/app/utils/functions/rudderstack/rudderstack-utils';
import { RudderstackEvent } from '@/app/types/services/rudderstack/rudderstack-types';

interface GoodToGoProps {
    orderData: BaseOrder | null;
}

export default function WLInGoodHandsComponent({ orderData }: GoodToGoProps) {
    const router = useRouter();
    const url = useParams();
    const searchParams = useSearchParams();
    const search = searchParams.toString();
    const fullPath = usePathname();
    const { product_href } = getIntakeURLParams(url, searchParams);
    const [buttonLoading, setButtonLoading] = useState<boolean>(false);

    const pushToNextRoute = async () => {
        setButtonLoading(true);
        const nextRoute = getNextIntakeRoute(
            fullPath,
            product_href,
            search,
            false,
            'none',
            orderData?.metadata['selected_product'],
        );
        const searchParams = new URLSearchParams(search);
        // Remove the 'nu' parameter
        searchParams.delete('nu');

        if (isWeightlossProduct(product_href)) {
            await trackRudderstackEvent(
                orderData?.customer_uid || '',
                RudderstackEvent.BUNDLE_SCREEN_VIEWED,
                { product_href },
            );
        }

        //this is for a vwo test where we have a control and variant for only MI and CA ppl and another control+7 variants for all other states
        const stateSearch = searchParams.get('ptst');
        if (stateSearch === 'MI' || stateSearch === 'CA') {
            searchParams.set('sp_id', 'mica');
        } else {
            searchParams.set('sp_id', 'nomica');
        }
        
        // Construct the new search string without the 'nu' parameter
        const newSearch = searchParams.toString();
        router.push(
            `/intake/prescriptions/${product_href}/${nextRoute}?${newSearch}`,
        );
    };

    // const [showButton, setShowButton] = useState(false);

    // // useEffect to change the state after a certain delay, e.g., 5 seconds
    // useEffect(() => {
    //     const timer = setTimeout(() => {
    //         setShowButton(true);
    //     }, 4000); // 5000 milliseconds = 5 seconds
    //     // Cleanup function to clear the timer if the component unmounts
    //     return () => clearTimeout(timer);
    // }, []); // Empty dependency array means this effect runs once on mount

    return (
        <>
            <div className={`justify-center flex`}>
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col gap-8 animate-slideRight">
                        <BioType className={`${TRANSITION_HEADER_TAILWIND}`}>
                            <span className="text-primary">
                                You&rsquo;re in good hands.
                            </span>{' '}
                            Before you&rsquo;re prescribed, a licensed provider
                            will assess your health history to ensure your
                            treatment request is a good fit for you.
                        </BioType>

                        <div className="relative ">
                            <div className="w-[38%] aspect-square overflow-hidden rounded-full  border-white md:border-8 border-[5px] border-solid relative ">
                                <span className="md:flex hidden">
                                    <Image
                                        src="/img/intake/doctor.jpeg"
                                        fill
                                        alt="Doctor Image"
                                        style={{
                                            objectFit: 'cover',
                                            objectPosition: '-25px 0px',
                                            transform: 'scale(1.5)',
                                        }}
                                        unoptimized
                                    />
                                </span>
                                <span className="flex md:hidden">
                                    <Image
                                        src="/img/intake/doctor.jpeg"
                                        fill
                                        alt="Doctor Image"
                                        style={{
                                            objectFit: 'cover',
                                            objectPosition: '-15px 0px',
                                            transform: 'scale(1.5)',
                                        }}
                                        unoptimized
                                    />
                                </span>
                            </div>
                            <div className="flex flex-col">
                                <div className="w-[38%] aspect-square overflow-hidden rounded-full  border-white  md:border-8 border-[5px] border-solid top-0 absolute left-[30%]">
                                    <span className="md:flex hidden">
                                        <Image
                                            src="/img/intake/wl/doctor5.png"
                                            fill
                                            alt="Doctor Image"
                                            style={{
                                                objectFit: 'cover',
                                                objectPosition: '-80px 30px',
                                                transform: 'scale(1.5)',
                                            }}
                                            unoptimized
                                        />
                                    </span>
                                    <span className="flex md:hidden">
                                        <Image
                                            src="/img/intake/wl/doctor5.png"
                                            fill
                                            alt="Doctor Image"
                                            style={{
                                                objectFit: 'cover',
                                                objectPosition: '-55px 23px',
                                                transform: 'scale(1.5)',
                                            }}
                                            unoptimized
                                        />
                                    </span>
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <div className="w-[38%] aspect-square overflow-hidden rounded-full  border-white  md:border-8 border-[5px] border-solid top-0 absolute right-0">
                                    <span className="md:flex hidden">
                                        <Image
                                            src="/img/intake/wl/doctor2.jpeg"
                                            fill
                                            alt="Doctor Image"
                                            style={{
                                                objectFit: 'cover',
                                                objectPosition: '-25px -12px',
                                                transform: 'scale(1.9)',
                                            }}
                                            unoptimized
                                        />
                                    </span>
                                    <span className="flex md:hidden">
                                        <Image
                                            src="/img/intake/wl/doctor2.jpeg"
                                            fill
                                            alt="Doctor Image"
                                            style={{
                                                objectFit: 'cover',
                                                objectPosition: '-20px -8px',
                                                transform: 'scale(1.7)',
                                            }}
                                            unoptimized
                                        />
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <AnimatedContinueButton onClick={pushToNextRoute} />
                </div>
            </div>
        </>
    );
}
