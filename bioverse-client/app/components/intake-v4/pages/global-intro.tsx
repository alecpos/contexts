'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import WordByWord from '@/app/components/global-components/bioverse-typography/animated-type/word-by-word';
import AnimatedContinueButtonV3 from '@/app/components/intake-v3/buttons/AnimatedContinueButtonV3';
import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams,
} from 'next/navigation';
import { getIntakeURLParams } from '@/app/components/intake-v2/intake-functions';
import { getNextIntakeRoute } from '@/app/utils/functions/intake-route-controller';
import { useState } from 'react';

/** Simple intro page for the global weight loss funnel. */
export default function GlobalIntro() {
    const router = useRouter();
    const url = useParams();
    const searchParams = useSearchParams();
    const search = searchParams.toString();
    const fullPath = usePathname();
    const { product_href } = getIntakeURLParams(url, searchParams);
    const [loading, setLoading] = useState(false);

    const pushToNextRoute = () => {
        setLoading(true);
        const nextRoute = getNextIntakeRoute(fullPath, product_href, search);
        router.push(`/intake/prescriptions/${product_href}/${nextRoute}?${search}`);
    };

    return (
        <div className="flex flex-col items-center gap-4 mt-6">
            <WordByWord className="inter-h5-question-header">
                Welcome to Bioverse
            </WordByWord>
            <BioType className="text-sm text-gray-600">
                Start your journey to better health.
            </BioType>
            <AnimatedContinueButtonV3 onClick={pushToNextRoute} />
        </div>
    );
}
