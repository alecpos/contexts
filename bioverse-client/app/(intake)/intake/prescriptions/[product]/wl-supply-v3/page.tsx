'use server';

import WeightlossSupplyComponent from '@/app/components/intake-v3/pages/wl-supply-v3';
import { USStates } from '@/app/types/enums/master-enums';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import { GLP1Questions } from '@/app/types/questionnaires/questionnaire-types';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { getMultipleQuestionInformationWithVersion } from '@/app/utils/database/controller/questionnaires/questionnaire';
import {
    constructQuestionObject,
    fetchData,
} from '@/app/utils/actions/intake/wl-supply';
import {
    getOrderForProduct,
    getIncompleteGlobalWLOrderPostHrefSwap,
    updateOrder,
    getCombinedOrderV2,
} from '@/app/utils/database/controller/orders/orders-api';
import { getUserProfile } from '@/app/utils/database/controller/profiles/profiles';
import { redirect } from 'next/navigation';
import { AB_TESTS_IDS } from '@/app/components/intake-v2/types/intake-enumerators';

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
        fot: any; //the 'fewer options test' (f.o.t.) basically only shows monthly and quarterly
        ab?: string; // A/B test parameter for semaglutide
    };
}

const DOSAGE_QUESTION_IDS = [280, 281, 282, 284, 286, 287];

export default async function WeightlossSupplyPage({
    params,
    searchParams,
}: Props) {
    //Immediately check user session presence
    const user_id = (await readUserSession()).data.session?.user.id!;

    const user_profile = await getUserProfile(user_id);
    const sex_at_birth = user_profile?.sex_at_birth;

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
        params.product,
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

    const isAbTest = searchParams.ab === AB_TESTS_IDS.SEM_6MB;
    let resolvedBiannualPrice = recommendedPrices.biannualPrice;
    
    // If A/B test is active and we have V74 price data, use that instead
    if (isAbTest && recommendedPrices?.semaglutideV74PriceData?.biannualPrice) {
        console.log("[Server] Using V74 price data for A/B test");
        resolvedBiannualPrice = recommendedPrices.semaglutideV74PriceData.biannualPrice;
    }
    
    console.log("[Server] A/B Test Debug:", {
        isAbTest,
        vwo_test_param: searchParams.ab,
        originalBiannualPrice: recommendedPrices.biannualPrice,
        resolvedBiannualPrice,
        v74PriceData: recommendedPrices.semaglutideV74PriceData,
        product: selectedProduct
    });

    //Michigan and California do not do non-monthly plans
    if (
        orderData.state === USStates.Michigan ||
        searchParams.ptst === USStates.Michigan ||
        orderData.state === USStates.California ||
        searchParams.ptst === USStates.California
    ) {
        recommendedPrices.bundlePrice = null;
        recommendedPrices.biannualPrice = null;
        recommendedPrices.annualPrice = null;
    }

    //this is redundant i think:
    if (
        (orderData.state === USStates.California ||
            searchParams.ptst === USStates.California) &&
        orderData.product_href == PRODUCT_HREF.TIRZEPATIDE
    ) {
        recommendedPrices.bundlePrice = null;
        recommendedPrices.biannualPrice = null;
        recommendedPrices.annualPrice = null;
    }

    //fewer options vwo test:
    if (searchParams.fot === 'true') {
        recommendedPrices.biannualPrice = null;
        recommendedPrices.annualPrice = null;
    }

    return (
        <>
        <WeightlossSupplyComponent
            monthlyPrice={recommendedPrices?.monthlyPrice}
            bundlePrice={recommendedPrices?.bundlePrice}
            biannualPrice={resolvedBiannualPrice}
            annualPrice={recommendedPrices?.annualPrice}
            orderData={orderData}
            allowModifyPlan={true}
            userSexAtBirth={sex_at_birth ?? ''}
            //semaglutideV74BiannualPrice={recommendedPrices.semaglutideV74PriceData?.biannualPrice}
        />
        </>
    );
}
