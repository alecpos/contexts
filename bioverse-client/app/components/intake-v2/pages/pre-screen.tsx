'use client';

import { IntakeContext } from '@/app/(intake)/intake/intake-context';
import { useState, useEffect } from 'react';

import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams,
} from 'next/navigation';
import IntakeLoadingComponent from '../loading/intake-loading';
import { getIntakeURLParams } from '../intake-functions';
import { getNextIntakeRoute } from '@/app/utils/functions/intake-route-controller';

interface PreScreenProps {}

export default function IntakePreScreen({}: PreScreenProps) {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const router = useRouter();
    const fullPath = usePathname();
    const url = useParams();
    const searchParams = useSearchParams();
    const search = searchParams.toString();
    const { product_href } = getIntakeURLParams(url, searchParams);

    useEffect(() => {
        setIsLoading(false);

        // ****   ****    ***
        // *   *  *   *  *   *
        // ****   ****   *   *
        // *   *  *  *   *   *
        // *   *  *   *  *   *
        // ****   *   *   ***
        // This is the code to prevent transition if it is weight loss in order to show the screens to add.
        // if (!isWeightLoss) {
        //     `/intake/prescriptions/${product_href}/registration?pvn=${variant_index}&st=${subscription_cadence}&sd=${
        //         discountable ? '23c' : ''
        //     }`;
        // }

        const nextRoute = getNextIntakeRoute(
            fullPath,
            product_href,
            search,
            true,
            'none',
            undefined
        );

        router.push(
            `/intake/prescriptions/${product_href}/${nextRoute}?${search}`
        );
    }, []); // Add dependencies here

    if (isLoading) {
        return (
            <>
                <IntakeLoadingComponent />
            </>
        );
    }

    return <></>;
}
