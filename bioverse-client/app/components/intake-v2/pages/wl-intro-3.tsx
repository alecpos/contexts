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
import { TRANSITION_HEADER_TAILWIND } from '../styles/intake-tailwind-declarations';
import AnimatedContinueButton from '../buttons/AnimatedContinueButton';
import WordByWord from '../../global-components/bioverse-typography/animated-type/word-by-word';
import { trackRudderstackEvent } from '@/app/utils/functions/rudderstack/rudderstack-utils';
import { RudderstackEvent } from '@/app/types/services/rudderstack/rudderstack-types';

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
        const nextRoute = getNextIntakeRoute(fullPath, product_href, search);
        const searchParams = new URLSearchParams(search);
        // Remove the 'nu' parameter
        searchParams.delete('nu');
        // Construct the new search string without the 'nu' parameter
        const newSearch = searchParams.toString();

        await trackRudderstackEvent(
            user_id,
            RudderstackEvent.BUNDLE_SCREEN_VIEWED,
            { product_name: product_href }
        );

        await trackRudderstackEvent(
            user_id,
            RudderstackEvent.INTAKE_COMPLETED,
            {
                product_name: product_href,
            }
        );

        router.push(
            `/intake/prescriptions/${product_href}/${nextRoute}?${newSearch}`
        );
    };

    return (
        <>
            <div className={`justify-center flex animate-slideRight`}>
                <div className='flex flex-row gap-8'>
                    <div className='flex flex-col gap-8'>
                        <WordByWord
                            className={`${TRANSITION_HEADER_TAILWIND} `}
                        >
                            <span className='text-primary'>
                                You&apos;re in good hands.
                            </span>
                            Before you&apos;re prescribed, a licensed provider
                            will assess your health history to ensure your
                            treatment request is a good fit for you.
                        </WordByWord>

                        <AnimatedContinueButton onClick={pushToNextRoute} />
                    </div>
                </div>
            </div>
        </>
    );
}
