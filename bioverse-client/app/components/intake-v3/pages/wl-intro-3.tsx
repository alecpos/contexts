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

import AnimatedContinueButton from '../buttons/AnimatedContinueButtonV3';

import WordByWord from '../../global-components/bioverse-typography/animated-type/word-by-word';
import { trackRudderstackEvent } from '@/app/utils/functions/rudderstack/rudderstack-utils';
import { RudderstackEvent } from '@/app/types/services/rudderstack/rudderstack-types';
import { getCombinedOrderV2 } from '@/app/utils/database/controller/orders/orders-api';

import Image from 'next/image';

interface WLIntro3Props {
    user_id: string;
}
export default function WLIntroThirdClientComponent({
    user_id,
}: WLIntro3Props) {
    const router = useRouter();
    const url = useParams();
    const searchParams = useSearchParams();
    const search = searchParams.toString();
    const fullPath = usePathname();
    const { product_href } = getIntakeURLParams(url, searchParams);
    const [buttonLoading, setButtonLoading] = useState<boolean>(false);

    const pushToNextRoute = async () => {
        setButtonLoading(true);

        let selectedProduct = null;
        if (product_href === 'weight-loss') {
            let wlOrder = await getCombinedOrderV2(user_id);
            if (!wlOrder) {
                console.error('No weight-loss order found');
                router.push('/collections');
                return;
            }
            selectedProduct = wlOrder.metadata['selected_product'];
            if (!selectedProduct) {
                console.error('No selected product found in weight-loss order');
                router.push('/collections');
                return;
            }
        }

        const nextRoute = getNextIntakeRoute(
            fullPath,
            product_href,
            search,
            false,
            'none',
            selectedProduct
        );

        const searchParams = new URLSearchParams(search);
        // Remove the 'nu' parameter
        searchParams.delete('nu');

        //this is for a vwo test where we have a control and variant for only MI and CA ppl and another control+7 variants for all other states
        const stateSearch = searchParams.get('ptst');
        if (stateSearch === 'MI' || stateSearch === 'CA') {
            searchParams.set('sp_id', 'mica');
        } else {
            searchParams.set('sp_id', 'nomica');
        }

        // Construct the new search string without the 'nu' parameter
        const newSearch = searchParams.toString();

        await trackRudderstackEvent(
            user_id,
            RudderstackEvent.BUNDLE_SCREEN_VIEWED,
            { product_name: product_href }
        );

        router.push(
            `/intake/prescriptions/${product_href}/${nextRoute}?${newSearch}`
        );
    };

    return (
        <>
            <div
                className={`justify-center flex animate-slideRight mt-[1.25rem] md:mt-[48px]`}
            >
                <div className='flex flex-row gap-8'>
                    <div className='flex flex-col '>
                        <WordByWord className={`inter-h5-question-header`}>
                            <span className={`inter-h5-question-header-bold`}>
                                You&apos;re in good hands.
                            </span>
                            Before you&apos;re prescribed, a licensed provider
                            will assess your health history to ensure your
                            treatment request is a good fit for you.
                        </WordByWord>

                        <div className='w-full h-[210px] flex mt-[1.25rem] md:mt-[48px]'>
                            <div className='relative flex-1 rounded-lg   xbg-[#F4F4F4F4] overflow-hidden'>
                                <Image
                                    src='/img/intake/wl/wl-intro-3-v3-image.png'
                                    fill
                                    className='rounded-t-lg '
                                    alt='Vial Image'
                                    style={{ objectFit: 'cover' }}
                                    
                                />
                            </div>
                        </div>

                        <div className='mt-[20px] sm:mt-[48px]'>
                            <AnimatedContinueButton onClick={pushToNextRoute} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
