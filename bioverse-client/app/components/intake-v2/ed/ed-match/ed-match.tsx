'use client';

import { triggerEvent } from '@/app/services/customerio/customerioApiFactory';
import ImageCollection from '../components/image-collection';
import { getIntakeURLParams } from '@/app/components/intake-v2/intake-functions';
import { getNextIntakeRoute } from '@/app/utils/functions/intake-route-controller';
import { useParams, useSearchParams, usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { RudderstackEvent } from '@/app/types/services/rudderstack/rudderstack-types';

interface EDMatchComponentProps {
    user_id: string;
}

export default function EDMatchComponent({ user_id }: EDMatchComponentProps) {
    const router = useRouter();
    const url = useParams();
    const searchParams = useSearchParams();
    const search = searchParams.toString();
    const fullPath = usePathname();
    const { product_href } = getIntakeURLParams(url, searchParams);

    const pushToNextRoute = async () => {
        const nextRoute = getNextIntakeRoute(fullPath, product_href, search);
        const searchParams = new URLSearchParams(search);
        // Remove the 'nu' parameter
        searchParams.delete('nu');
        await triggerEvent(user_id, RudderstackEvent.ED_SELECTION_VIEWED);
        // Construct the new search string without the 'nu' parameter
        const newSearch = searchParams.toString();
        console.log(newSearch);
        router.push(
            `/intake/prescriptions/${product_href}/${nextRoute}?${newSearch}`,
        );
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            pushToNextRoute();
        }, 4000); // 4000 milliseconds = 4 seconds

        return () => clearTimeout(timer); // Cleanup on unmount
    }, []); // Empty dependency array means this runs once on mount

    return <ImageCollection />;
}
