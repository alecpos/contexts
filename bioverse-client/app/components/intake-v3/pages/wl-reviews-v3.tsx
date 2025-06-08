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
import AnimatedContinueButtonV3 from '../buttons/AnimatedContinueButtonV3';
import SemaglutideWLReviewsV3 from './wl-reviews-v3/SemaglutideWLReviewsV3';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import TirzepatideWLReviewsV3 from './wl-reviews-v3/TirzepatideWLReviewsV3';
import MetforminWLReviewsV3 from './wl-reviews-v3/MetforminWLReviewsV3';
import { RudderstackEvent } from '@/app/types/services/rudderstack/rudderstack-types';
import { trackRudderstackEvent } from '@/app/utils/functions/rudderstack/rudderstack-utils';
import { AB_TESTS_IDS } from '../../intake-v2/types/intake-enumerators';
import WLCapsuleReviewsV3 from './wl-reviews-v3/WLCapsuleReviewsV3';
import { addMetadataToOrder, getCombinedOrderV2, getOrderForProduct } from '@/app/utils/database/controller/orders/orders-api';

interface GoodToGoProps {
    user_id: string;
    product_href: PRODUCT_HREF;
    url_product_href?: PRODUCT_HREF;
}

export default function WLReviewsComponent({
    user_id,
    product_href,
    url_product_href,
}: GoodToGoProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const search = searchParams.toString();
    const fullPath = usePathname();
    const [buttonLoading, setButtonLoading] = useState<boolean>(false);


    const vwo_test_ids: string[] =
        typeof window !== 'undefined'
            ? JSON.parse(localStorage.getItem('vwo_ids') || '[]')
            : [];

    const pushToNextRoute = async () => {
        const nextRoute = getNextIntakeRoute(
            fullPath,
            url_product_href ? url_product_href : product_href,
            search
        );
        const searchParams = new URLSearchParams(search);
        // Remove the 'nu' parameter
        searchParams.delete('nu');
        // Construct the new search string without the 'nu' parameter
        const newSearch = searchParams.toString();
        await trackRudderstackEvent(
            user_id,
            RudderstackEvent.ID_VERIFICATION_REACHED
        );

        if (searchParams.get('id_test') === AB_TESTS_IDS.WL_SHOW_ID_AFTER_CHECKOUT) {
            let orderData: any = null;
            if (fullPath.includes('weight-loss')) {
                orderData = await getCombinedOrderV2(user_id);
            } else {
                orderData = await getOrderForProduct(product_href, user_id);
            }
            await addMetadataToOrder(orderData.id, {
                metadata: {
                    id_test: 'id-after-checkout',
                },
            });
            router.push(
                `/intake/prescriptions/${product_href}/shipping-information-v3?${newSearch}`
            );
        } else {
            router.push(
                `/intake/prescriptions/${
                    url_product_href ? url_product_href : product_href
                }/${nextRoute}?${newSearch}`
            );
        }
    };

    return (
        <>
            <div className={`justify-center flex mt-[1.25rem] md:mt-[48px]`}>
                <div className="flex flex-col gap-8">
                    {product_href === PRODUCT_HREF.SEMAGLUTIDE && (
                        <SemaglutideWLReviewsV3 />
                    )}
                    {product_href === PRODUCT_HREF.TIRZEPATIDE && (
                        <TirzepatideWLReviewsV3 />
                    )}
                    {product_href === PRODUCT_HREF.WL_CAPSULE && (
                        <WLCapsuleReviewsV3 />
                    )}
                    {product_href === PRODUCT_HREF.METFORMIN && (
                        <MetforminWLReviewsV3 />
                    )}
                    <AnimatedContinueButtonV3 onClick={pushToNextRoute} />
                </div>
            </div>
        </>
    );
}
