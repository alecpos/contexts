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
import { getCombinedOrder, getCombinedOrderV2} from '@/app/utils/database/controller/orders/orders-api';
import {
    getPriceVariantTableData,
    ProductVariantRecord,
} from '@/app/utils/database/controller/product_variants/product_variants';
import { AB_TESTS_IDS } from '@/app/components/intake-v2/types/intake-enumerators';
import { INTAKE_ROUTE_V3 } from '@/app/components/intake-v2/types/intake-enumerators';

interface BannerProps {
    logged_in: boolean;
    user_id: string | false | undefined;
}

export default function IntakeBannerV3({ logged_in, user_id }: BannerProps) {
    const [priceData, setPriceData] = useState<ProductVariantRecord[]>();
    const [productName, setProductName] = useState<string>();
    const [lookupProductHref, setLookupProductHref] = useState<string>('');

    const params = useParams();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const vwo_test_ids: string[] =
    typeof window !== 'undefined'
        ? JSON.parse(localStorage.getItem('vwo_ids') || '[]')
        : [];


    const TIMER_KEY = 'countDownTimerStart';
    const FIFTEEN_MINUTES = 15 * 60 * 1000; // 15 minutes in milliseconds
    const THIRTY_MINUTES = 30 * 60 * 1000; // 30 minutes in milliseconds

    if (typeof window !== 'undefined') {
        const existingTimer = localStorage.getItem(TIMER_KEY);
        const now = Date.now();
        // console.log("existingTimer", existingTimer);
        if (!existingTimer || now - parseInt(existingTimer, 10) > THIRTY_MINUTES) {
            // console.log("Setting new timer");
            localStorage.setItem(TIMER_KEY, now.toString());
        }
    }

    const [timeRemaining, setTimeRemaining] = useState({ minutes: 15, seconds: 0 });

    useEffect(() => {
        const interval = setInterval(() => {
            const now = Date.now();
            const storedTime = localStorage.getItem(TIMER_KEY);
            if (storedTime) {
                const elapsed = now - parseInt(storedTime, 10);
                const remaining = Math.max(0, FIFTEEN_MINUTES - elapsed);
                
                const minutes = Math.floor(remaining / 60000);
                const seconds = Math.floor((remaining % 60000) / 1000);

                setTimeRemaining({ minutes, seconds });
            } else {
                setTimeRemaining({ minutes: 15, seconds: 0 });
            }
        }, 1000); // Update every second

        return () => clearInterval(interval); // Cleanup on unmount
    }, []);



    const { product_href, variant_index, subscription_cadence } =
        getIntakeURLParams(params, searchParams);

    const { data: orderData, mutate: mutateOrder } = useSWR(
        logged_in && product_href === PRODUCT_HREF.WEIGHT_LOSS
            ? `weightloss-banner-${product_href}`
            : null,
        () => getCombinedOrderV2(user_id)
    );

    const { data: swrPriceData } = useSWR(
        `${product_href}-price-variants`,
        () => getPriceVariantTableData(product_href)
    );

    useEffect(() => {
        // if (!orderData && product_href === PRODUCT_HREF.WEIGHT_LOSS) {
        //     setLookupProductHref('unset');
        // } else if (orderData && product_href === PRODUCT_HREF.WEIGHT_LOSS) {
        //     if (orderData.metadata['selected_product']) {
        //         setLookupProductHref(orderData.metadata['selected_product']);
        //     } else {
        //         setLookupProductHref('unset');
        //     }
        // } else {
            setLookupProductHref(product_href);
        // }
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
    if (
        searchParams.get('banner_id') === AB_TESTS_IDS.SEM_SL &&
        (
            pathname.includes(INTAKE_ROUTE_V3.WEIGHT_LOSS_ACCOMPLISH_GOALS) ||
            pathname.includes(INTAKE_ROUTE_V3.WEIGHT_LOSS_BMI) ||
            pathname.includes(INTAKE_ROUTE_V3.WEIGHT_LOSS_DATA_PROCESSING) ||
            pathname.includes(INTAKE_ROUTE_V3.WEIGHT_LOSS_GRAPH_PRE_SIGNUP) 
        ) 
    ) {
        return null;
    }

    if (vwo_test_ids.includes(AB_TESTS_IDS.ZEALTHY_BEST_PRACTICES)) {

        if (pathname.includes(INTAKE_ROUTE_V3.GREETING)) {
            return null;
        }

        if ( 
            pathname.includes(INTAKE_ROUTE_V3.UP_NEXT) ||
            pathname.includes(INTAKE_ROUTE_V3.QUESTIONS) ||
            pathname.includes(INTAKE_ROUTE_V3.WEIGHT_LOSS_CALCULATING_V3) ||
            pathname.includes(INTAKE_ROUTE_V3.WEIGHT_LOSS_GRAPH) ||
            pathname.includes(INTAKE_ROUTE_V3.WEIGHT_LOSS_INTRO_3) ||
            pathname.includes(INTAKE_ROUTE_V3.WEIGHT_LOSS_SUPPLY) ||
            pathname.includes(INTAKE_ROUTE_V3.ORDER_SUMMARY) ||
            pathname.includes(INTAKE_ROUTE_V3.WEIGHT_LOSS_REVIEWS) ||
            pathname.includes(INTAKE_ROUTE_V3.PRE_ID_VERIFICATION) ||
            pathname.includes(INTAKE_ROUTE_V3.ID_VERIFICATION) ||
            pathname.includes(INTAKE_ROUTE_V3.SHIPPING_INFORMATION) ||
            pathname.includes(INTAKE_ROUTE_V3.WEIGHT_LOSS_CHECKOUT) ||
            pathname.includes(INTAKE_ROUTE_V3.PATIENT_MATCH) ||
            pathname.includes(INTAKE_ROUTE_V3.WEIGHT_LOSS_DATA_PROCESSING) ||
            pathname.includes(INTAKE_ROUTE_V3.WEIGHT_LOSS_SUPPLY_NO_6) 
        )  {
            return (
                <div 
                    className='flex w-full h-[65px] md:mt-0  items-center justify-center bg-[#faffb3] rounded-md gap-[16px]'
                >
                    <p className='inter-basic font-bold text-[14px] md:text-[18px] text-nowrap self-center text-black text-center'>
                        One Time Offer: Next 15 minutes
                    </p>
                    <div 
                        className='bg-[#fafbec] w-[168px] h-[41px] px-[8px] py-[4px] flex'
                        style={{
                            borderRadius: 4,
                            border: '1px solid #d8d8d8',
                        }}
                    >
                        <div className='flex flex-col h-full justify-center intake-v3-disclaimer-text'>Time remaining:</div>
                        <div className='flex flex-col h-full justify-center intake-v3-disclaimer-text ml-3'>
                            <p className='inter-basic font-bold text-[16px]'>
                                {timeRemaining.minutes}
                            </p>
                            <p>min</p>
                        </div>
                        <div className='flex flex-col h-full justify-center intake-v3-disclaimer-text ml-2'>
                            <p className='inter-basic font-bold text-[16px]'>
                                {timeRemaining.seconds}
                            </p>
                            <p>sec</p>
                        </div>


                    </div>
                </div>
            )
        }
    }


    const getBannerText = () => {
        switch (lookupProductHref) {
            case 'unset':
                return 'Lose weight your way';
            case PRODUCT_HREF.WEIGHT_LOSS:
            case PRODUCT_HREF.SEMAGLUTIDE:
                return 'Last Chance: Spring Sale ends June 10';
            case PRODUCT_HREF.METFORMIN:
                return 'Limited Time: $20 off your first order';
            case PRODUCT_HREF.TIRZEPATIDE:
                return 'Limited Time: Tirzepatide for as little as $234/mo!';
            case PRODUCT_HREF.B12_INJECTION:
                return 'Limited Time: $45 off your first quarterly order';
            default:
                return ''
                // const priceVariantRecord = priceData?.find(
                //     (record) => record.variant_index == parseInt(variant_index)
                // );

                // if (priceVariantRecord?.price_data.discount_price) {
                //     return `Limited Time: $${priceVariantRecord.price_data.discount_price.discount_amount} off your first order`;
                // }
                // return `Learn more about ${productName ?? 'your medication'}`;
        }
    };

    return (
        <div className='flex w-full h-[2.75rem] md:h-[40px] md:mt-[8px]  items-center justify-center bg-[#faffb3]'
            // style={{
            //     backgroundImage: "url('/img/banner-v3-background.png')",
            //     backgroundSize: "cover", 
            //     backgroundPosition: "center", 
            // }}
        >
            <BioType className='inter_body_regular text-nowrap self-center text-black text-center'>
                {getBannerText()}
            </BioType>
        </div>
    );
}
