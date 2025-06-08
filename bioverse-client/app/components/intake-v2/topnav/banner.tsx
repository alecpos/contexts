'use client';

import { useEffect, useState } from 'react';
import BioType from '../../global-components/bioverse-typography/bio-type/bio-type';
import { useParams, usePathname, useSearchParams } from 'next/navigation';
import { getIntakeURLParams } from '../intake-functions';
import useSWR from 'swr';
import {
    PRODUCT_HREF,
    PRODUCT_NAME_HREF_MAP,
} from '@/app/types/global/product-enumerator';
import {
    getCombinedOrder,
    getCombinedOrderV2,
} from '@/app/utils/database/controller/orders/orders-api';
import {
    getPriceVariantTableData,
    ProductVariantRecord,
} from '@/app/utils/database/controller/product_variants/product_variants';
import { AB_TESTS_IDS } from '../types/intake-enumerators';

interface BannerProps {
    logged_in: boolean;
    user_id: string | false | undefined;
}

export default function IntakeBannerV2({ logged_in, user_id }: BannerProps) {
    const [priceData, setPriceData] = useState<ProductVariantRecord[]>();
    const [productName, setProductName] = useState<string>();
    const [lookupProductHref, setLookupProductHref] = useState<string>('');

    const params = useParams();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const { product_href, variant_index, subscription_cadence } =
        getIntakeURLParams(params, searchParams);

    const { data: orderData, mutate: mutateOrder } = useSWR(
        logged_in && product_href === PRODUCT_HREF.WEIGHT_LOSS
            ? `weightloss-banner-${product_href}`
            : null,
        () => getCombinedOrderV2(user_id),
    );

    const { data: swrPriceData } = useSWR(
        `${product_href}-price-variants`,
        () => getPriceVariantTableData(product_href),
    );

    useEffect(() => {
        if (!orderData && product_href === PRODUCT_HREF.WEIGHT_LOSS) {
            setLookupProductHref('unset');
        } else if (orderData && product_href === PRODUCT_HREF.WEIGHT_LOSS) {
            if (orderData.metadata['selected_product']) {
                setLookupProductHref(orderData.metadata['selected_product']);
            } else {
                setLookupProductHref('unset');
            }
        } else {
            setLookupProductHref(product_href);
        }
    }, [product_href, orderData, pathname]);

    useEffect(() => {
        const splitted_path = pathname.split('/');

        if (splitted_path.at(-1) === '801') {
            mutateOrder();
        }
    }, [pathname]);

    useEffect(() => {
        if (swrPriceData?.data) {
            setPriceData(swrPriceData.data);
            setProductName(PRODUCT_NAME_HREF_MAP[product_href]);
        }
    }, [swrPriceData]);

    if (
        pathname === '/intake/complete' ||
        searchParams.get('test_id') === AB_TESTS_IDS.WL_FUNNEL_V3
    ) {
        return null;
    }

    if (pathname.includes('/rush-melts/ed-checkout')) {
        return <div className="mb-12"></div>;
    }

    const getBannerText = () => {
        switch (lookupProductHref) {
            case 'unset':
                return 'Lose weight your way';
            case PRODUCT_HREF.METFORMIN:
                return 'Limited Time: $20 off your first order';
            case PRODUCT_HREF.SEMAGLUTIDE:
                return 'Limited Time: Semaglutide for as little as $159/mo!';
            case PRODUCT_HREF.TIRZEPATIDE:
                return 'Limited Time: Tirzepatide for as little as $234/mo!';
            case PRODUCT_HREF.B12_INJECTION:
                return 'Limited Time: $45 off your first quarterly order';
            case PRODUCT_HREF.ED_GLOBAL:
            case PRODUCT_HREF.PEAK_CHEWS:
            case PRODUCT_HREF.X_CHEWS:
            case PRODUCT_HREF.X_MELTS:
            case PRODUCT_HREF.RUSH_MELTS:
                return `Get Hard. Stay Hard. Don't Compromise`;
            case PRODUCT_HREF.TRETINOIN:
                return 'Last Chance! Skin Care for as little as $36/mo!';

            default:
                const priceVariantRecord = priceData?.find(
                    (record) => record.variant_index == parseInt(variant_index),
                );

                if (priceVariantRecord?.price_data.discount_price) {
                    return `Limited Time: $${priceVariantRecord.price_data.discount_price.discount_amount} off your first order`;
                }
                return `Learn more about ${productName ?? 'your medication'}`;
        }
    };

    return (
        <div className="flex w-full h-[40px] md:mt-0 bg-primary items-center justify-center">
            <BioType className="itd-h1 text-[1rem] md:text-[1.5rem] text-nowrap self-center text-white text-center">
                {getBannerText()}
            </BioType>
        </div>
    );
}
