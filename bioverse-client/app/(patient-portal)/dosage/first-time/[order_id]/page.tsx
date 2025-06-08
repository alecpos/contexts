'use server';
import ErrorMessage from '@/app/components/patient-portal/dosage-selection-first-time/components/ErrorMessage';
import DosageSelectionFirstTime from '@/app/components/patient-portal/dosage-selection-first-time/DosageSelectionFirstTime';
import { USStates } from '@/app/types/enums/master-enums';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import { OrderStatus } from '@/app/types/orders/order-types';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { getDosingOptionByDosageChangeEquivalenceCode } from '@/app/utils/classes/DosingChangeController/DosageChangeConstantIndex';
import { DosageChangeController } from '@/app/utils/classes/DosingChangeController/DosageChangeController';
import { DosageChangeEquivalenceCodes } from '@/app/utils/classes/DosingChangeController/DosageChangeEquivalenceMap';
import { ProductVariantController } from '@/app/utils/classes/ProductVariant/ProductVariantController';
import {
    getBaseOrderById,
    updateOrder,
} from '@/app/utils/database/controller/orders/orders-api';
import { getPriceDataRecordWithVariant } from '@/app/utils/database/controller/product_variants/product_variants';
import { reverse } from 'lodash';
import { redirect } from 'next/navigation';

interface DosageSelectionFirstTimePageProps {
    params: { order_id: string };
    searchParams: { plan?: any; quvi?: any };
}

export default async function DosageSelectionPage({
    params,
}: DosageSelectionFirstTimePageProps) {
    const { data: activeSession } = await readUserSession();
    const user_id = activeSession?.session?.user?.id;

    if (!user_id)
        return redirect('/login?originalRef=%2Fportal%2Forder-history');

    const order_id = Number(params.order_id);
    if (!order_id) return <ErrorMessage message='Invalid Order ID' />;

    const order = await getBaseOrderById(order_id);
    if (!order)
        return <ErrorMessage message='Could not fetch order for order ID' />;
    // if (order.customer_uid !== user_id)
    //     return (
    //         <ErrorMessage message="You are not the customer for this order" />
    //     );
    if (!order.metadata?.recommendedDosageCode)
        return (
            <ErrorMessage message='Could not find dosage recommendation for customer' />
        );

    if (order.order_status !== OrderStatus.UnapprovedCardDown) {
        return <ErrorMessage message='No further action required' />;
    }

    const recommendedDosageCode = order.metadata
        .recommendedDosageCode as DosageChangeEquivalenceCodes;
    const recommendedProductHref = recommendedDosageCode.split(
        '-'
    )[0] as PRODUCT_HREF;

    if (recommendedProductHref !== order.product_href) {
        await updateOrder(order.id, {
            product_href: recommendedProductHref,
            variant_index: 2, //setting to 2 to zero it out
        });
    }

    console.log('Debug values:', {
        product_href: order.product_href,
        recommendedProductHref,
        recommendedDosageCode,
        state: order.state,
    });

    try {
        const { dosingOption, priceDataRecords } =
            await getDosageRecommendation(
                recommendedDosageCode,
                recommendedProductHref as PRODUCT_HREF,
                order.state as USStates
            );

        return (
            <DosageSelectionFirstTime
                dosingOption={dosingOption}
                priceData={reverse(priceDataRecords)}
                product_href={order.product_href as PRODUCT_HREF}
                order={order}
            />
        );
    } catch (error: any) {
        console.error('logging page error dosage selection ', error);
        return <ErrorMessage message={error.message} />;
    }
}

async function getDosageRecommendation(
    dosageCode: DosageChangeEquivalenceCodes,
    product_href: PRODUCT_HREF,
    state: USStates
) {
    const dosingOption =
        getDosingOptionByDosageChangeEquivalenceCode(dosageCode);

    if (!dosingOption) {
        throw new Error('Could not find dosing option for user');
    }

    const DosageChangeInstance = new DosageChangeController(
        product_href,
        dosageCode
    );

    const dosageEquivalent = DosageChangeInstance.getDosageEquivalence();

    const convertedIndexes: Record<
        string,
        { variant_index?: number; pharmacy?: string }
    > = {};

    for (const [cadence, variantIndex] of Object.entries(dosageEquivalent)) {
        const productVariantController = new ProductVariantController(
            product_href,
            variantIndex,
            state
        );

        convertedIndexes[cadence] =
            productVariantController.getConvertedVariantIndex();
    }

    const dosage_suggestion_variant_indexes = Object.values(convertedIndexes)
        .map(({ variant_index }) => variant_index)
        .filter(
            (variantIndex): variantIndex is number => variantIndex !== undefined
        ); // Filter out undefined values

    // Fetch price data records for all variant indexes
    const priceDataRecords = await Promise.all(
        dosage_suggestion_variant_indexes.map((variantIndex) =>
            getPriceDataRecordWithVariant(product_href, variantIndex)
        )
    );

    return {
        dosingOption,
        priceDataRecords,
    };
}
