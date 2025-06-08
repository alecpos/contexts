'use client';
import { BaseOrder } from '@/app/types/orders/order-types';
import { useState } from 'react';
import SemaglutideOrderSummaryV4 from './order-summary-v4/SemaglutideOrderSummary';
import WLCapsulesOrderSummaryV4 from './order-summary-v4/WLCapsulesOrderSummary';
import MetforminOrderSummary from './order-summary-v4/MetforminOrderSummary';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import { updateOrder } from '@/app/utils/database/controller/orders/orders-api';
import { getNextIntakeRoute } from '@/app/utils/functions/intake-route-controller';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { continueButtonExitAnimation } from '../intake-animations';
import { getAccountProfileData } from '@/app/utils/database/controller/profiles/profiles';

interface Props {
    orderData: BaseOrder;
    currentBMI: {
        height_feet: number;
        height_inches: number;
        weight_lbs: number;
        bmi: number;
    };
    goalBMI: {
        height_feet: number;
        height_inches: number;
        weight_lbs: number;
        bmi: number;
    };
}

export default function OrderSummaryV4({
    orderData,
    currentBMI,
    goalBMI,
}: Props) {
    const [page, setPage] = useState<PRODUCT_HREF>(PRODUCT_HREF.SEMAGLUTIDE);
    const [buttonLoading, setButtonLoading] = useState<boolean>(false);
    const router = useRouter();
    const fullPath = usePathname();
    const searchParams = useSearchParams();

    const handleClick = async () => {
        await updateOrder(orderData.id, {
            metadata: { flowSelectedProduct: page },
        });

        setButtonLoading(true);
        try {
            var nextRoute = getNextIntakeRoute(
                fullPath,
                orderData.product_href,
                searchParams.toString(),
                false,
                'latest',
                //...only if the funnel is global-wl. For other funnels it has no effect
            );

            const search = searchParams.toString();
            const searchParamsNew = new URLSearchParams(search);

            const accountProfile = await getAccountProfileData(
                orderData.customer_uid,
            );

            if (accountProfile?.sex_at_birth === 'Female') {
                router.push(
                    `/intake/prescriptions/semaglutide/wl-female-safety?${searchParamsNew}`,
                );
            } else {
                if (page === PRODUCT_HREF.SEMAGLUTIDE) {
                    router.push(
                        `/intake/prescriptions/semaglutide/wl-good-hands-review?${searchParamsNew}`,
                    );
                } else {
                    router.push(
                        `/intake/prescriptions/semaglutide/whats-next?${searchParamsNew}`,
                    );
                }
            }

            // await continueButtonExitAnimation(150);
            // router.push(
            //     `/intake/prescriptions/semaglutide/${nextRoute}?${searchParamsNew}`,
            // );
        } catch (error) {
            console.error(error);
        }
    };

    function renderPage() {
        switch (page) {
            case PRODUCT_HREF.SEMAGLUTIDE:
                return (
                    <SemaglutideOrderSummaryV4
                        currentBMI={currentBMI}
                        goalBMI={goalBMI}
                        setPage={setPage}
                        handleClick={handleClick}
                        buttonLoading={buttonLoading}
                    />
                );
            case PRODUCT_HREF.METFORMIN:
                return (
                    <MetforminOrderSummary
                        product_href={PRODUCT_HREF.METFORMIN}
                        setPage={setPage}
                        handleClick={handleClick}
                        buttonLoading={buttonLoading}
                    />
                );
            case PRODUCT_HREF.WL_CAPSULE:
                return (
                    <MetforminOrderSummary
                        product_href={PRODUCT_HREF.WL_CAPSULE}
                        setPage={setPage}
                        handleClick={handleClick}
                        buttonLoading={buttonLoading}
                    />
                );
        }
    }

    return (
        <div className="flex flex-col max-w-[360px] md:max-w-[490px] items-center gap-[20px] self-stretch mb-32 md:mb-0">
            {renderPage()}
        </div>
    );
}
