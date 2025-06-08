'use server';

import WeightlossSupplyComponentNo6 from '@/app/components/intake-v3/pages/wl-supply-v3-no-6';
import { GLP1Questions } from '@/app/types/questionnaires/questionnaire-types';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { getMultipleQuestionInformationWithVersion } from '@/app/utils/database/controller/questionnaires/questionnaire';
import {
    constructQuestionObject,
    fetchData,
} from '@/app/utils/actions/intake/wl-supply';
import {
    getCombinedWeightlossOrderForUser,
    getIncompleteGlobalWLOrderPostHrefSwap,
    getOrderForProduct,
    getCombinedOrderV2,
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
    };
}

const DOSAGE_QUESTION_IDS = [280, 281, 282, 284, 286, 287];

export default async function WeightlossSupplyPageNo6({
    params,
    searchParams,
}: Props) {
    //Immediately check user session presence
    const user_id = (await readUserSession()).data.session?.user.id!;

    let selectedProduct = params.product; //this will be redefined below if the user is coming from the global wl funnel
    //the params.product won't work for finding pricing data if the user is coming from the global wl funnel:
    if (params.product === 'weight-loss') {
        const originalOrder = await getOrderForProduct(params.product, user_id); //try to find a weight-loss order for the user

        if (!originalOrder) {
            //if you can't find it, then maybe it the product_href was already swapped with their selected product
            const globalWLOrder = await getIncompleteGlobalWLOrderPostHrefSwap(
                user_id
            ); //try to find a sem/tirz/metf order for the user
            if (!globalWLOrder?.product_href) {
                console.error('No order found for global weight loss funnel');
                redirect('/');
            }
            //in case they chose one medication then went back in the flow and switched to another:
            if (
                globalWLOrder.product_href !==
                globalWLOrder.metadata['selected_product']
            ) {
                const selectedProductHref =
                    globalWLOrder.metadata.selected_product;
                await updateOrder(globalWLOrder.id, {
                    product_href: selectedProductHref,
                });
            }
            selectedProduct = globalWLOrder?.product_href;
        } else {
            //if you can find a weight-loss order, then swap the product_href with the selected product
            if (
                originalOrder.product_href !==
                originalOrder.metadata['selected_product']
            ) {
                const selectedProductHref =
                    originalOrder.metadata.selected_product;
                await updateOrder(originalOrder.id, {
                    product_href: selectedProductHref,
                });
            }
            selectedProduct = originalOrder.metadata.selected_product;
        }
    }

    // Need to fetch question answers for 280, 281, 282, 284, 286, 287

    const questionData = await getMultipleQuestionInformationWithVersion(
        user_id,
        selectedProduct,
        DOSAGE_QUESTION_IDS
    );

    const questionDict = await constructQuestionObject(questionData);

    const recommendedPrices = await fetchData(
        selectedProduct,
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

    let orderData: any = null;
    if (params.product === 'weight-loss') {
        orderData = await getCombinedOrderV2(user_id);
    } else {
        orderData = await getOrderForProduct(selectedProduct, user_id);
    }

    if (!orderData) {
        console.error('Could not find order for user');
        redirect('/');
    }

    const allowModifyPlan =
        questionDict[GLP1Questions.TakenGLP1].answer?.answer === 'Yes';

    return (
        <>
            <WeightlossSupplyComponentNo6
                monthlyPrice={recommendedPrices?.monthlyPrice}
                bundlePrice={recommendedPrices?.bundlePrice}
                biannualPrice={recommendedPrices?.biannualPrice}
                orderData={orderData}
                allowModifyPlan={true}
            />
        </>
    );
}
