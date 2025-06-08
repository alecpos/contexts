'use server';

import WeightlossSupplyComponent from '@/app/components/intake-v2/pages/wl-supply';
import { USStates } from '@/app/types/enums/master-enums';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import { GLP1Questions } from '@/app/types/questionnaires/questionnaire-types';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { getMultipleQuestionInformationWithVersion } from '@/app/utils/database/controller/questionnaires/questionnaire';
import {
    constructQuestionObject,
    fetchData,
} from '@/app/utils/actions/intake/wl-supply';
import { getProductData } from '@/app/utils/database/api-controller/products/products';
import {
    getCombinedWeightlossOrderForUser,
    getIncompleteGlobalWLOrderPostHrefSwap,
    getOrderForProduct,
    updateOrder,
} from '@/app/utils/database/controller/orders/orders-api';
import { redirect } from 'next/navigation';

interface Props {
    params: {
        product: string;
    };
    searchParams: {
        pvn: any;
        st: any;
        psn: any;
        sd: any; //sd is important << as it is the discountable code.
        ub: any; // if coming from unbounce, this will be set to the landing page they're coming from
        /**
         * @Nathan > I wanted to make a simple, but not obvious indicator for the discounts:
         * Therefore 23c == 'Yes, do discount' and anything else is 'No, do not discount'
         */
        ptst: any;
    };
}
const DOSAGE_QUESTION_IDS = [280, 281, 282, 284, 286, 287];

export default async function WeightlossSupplyV2Page({
    params,
    searchParams,
}: Props) {
    //Immediately check user session presence
    const user_id = (await readUserSession()).data.session?.user.id!;

    if (!user_id) {
        redirect('/collections');
    }

    var orderData = await getOrderForProduct(params.product, user_id);

    // Order's product_href has not been swapped yet
    if (orderData) {
        const selectedProductHref = orderData.metadata.selected_product;
        await updateOrder(orderData.id, {
            product_href: selectedProductHref,
        });

        orderData = {
            ...orderData,
            product_href: selectedProductHref,
        };
    } else {
        // Order's product_href has already been swapped to the correct product
        const combinedOrder = await getIncompleteGlobalWLOrderPostHrefSwap(
            user_id
        );

        if (!combinedOrder) {
            redirect('/collections');
        }

        if (
            combinedOrder.product_href !==
            combinedOrder.metadata['selected_product']
        ) {
            const selectedProductHref = combinedOrder.metadata.selected_product;
            await updateOrder(combinedOrder.id, {
                product_href: selectedProductHref,
            });
            combinedOrder.product_href = selectedProductHref;
        }

        orderData = combinedOrder;
    }

    if (!orderData) {
        redirect('/');
    }

    // Need to fetch question answers for 280, 281, 282, 284, 286, 287

    const questionData = await getMultipleQuestionInformationWithVersion(
        user_id,
        PRODUCT_HREF.WEIGHT_LOSS,
        DOSAGE_QUESTION_IDS
    );

    const questionDict = await constructQuestionObject(questionData);

    const recommendedPrices = await fetchData(
        orderData.product_href,
        questionData,
        searchParams.pvn
    );

    if (
        !recommendedPrices ||
        !recommendedPrices.monthlyPrice ||
        !recommendedPrices.bundlePrice
    ) {
        console.error('Could not fetch price information');
        redirect('/');
    }

    if (
        orderData.state === USStates.Michigan ||
        searchParams.ptst === USStates.Michigan ||
        orderData.state === USStates.California ||
        searchParams.ptst === USStates.California
    ) {
        recommendedPrices.biannualPrice = null;
    }

    const allowModifyPlan =
        questionDict[GLP1Questions.TakenGLP1].answer?.answer === 'Yes';

    return (
        <>
            <WeightlossSupplyComponent
                monthlyPrice={recommendedPrices?.monthlyPrice}
                bundlePrice={recommendedPrices?.bundlePrice}
                biannualPrice={recommendedPrices?.biannualPrice}
                orderData={orderData}
                allowModifyPlan={allowModifyPlan}
                isV2={true}
            />
        </>
    );
}
