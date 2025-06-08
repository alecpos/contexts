'use client';

import BioType from '../../global-components/bioverse-typography/bio-type/bio-type';
import AnimatedContinueButtonV3 from '@/app/components/intake-v3/buttons/AnimatedContinueButtonV3';
import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams,
} from 'next/navigation';
import { getIntakeURLParams } from '../../intake-v2/intake-functions';
import { getNextIntakeRoute } from '@/app/utils/functions/intake-route-controller';

/** Placeholder checkout screen for the global weight loss funnel. */
export default function GlobalWLCheckout() {
    const router = useRouter();
    const url = useParams();
    const searchParams = useSearchParams();
    const search = searchParams.toString();
    const fullPath = usePathname();
    const { product_href } = getIntakeURLParams(url, searchParams);

    const pushToNextRoute = () => {
        const nextRoute = getNextIntakeRoute(fullPath, product_href, search);
        router.push(`/intake/prescriptions/${product_href}/${nextRoute}?${search}`);
    };

    return (
        <div className="flex flex-col items-center gap-4 mt-6">
            <BioType className="inter-h5-question-header">Global WL Checkout</BioType>
            <p className="text-sm text-gray-600">Checkout coming soon.</p>
            <AnimatedContinueButtonV3 onClick={pushToNextRoute} />
        </div>
    );
}
