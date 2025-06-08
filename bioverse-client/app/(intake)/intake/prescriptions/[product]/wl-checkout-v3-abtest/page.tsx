'use server';

import IntakeErrorComponent from '@/app/components/intake-v2/error/intake-error';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { fetchProductImageAndPriceData } from '@/app/utils/actions/intake/product-data';
import { createSupabaseServerComponentClient } from '@/app/utils/clients/supabaseServerClient';
import {
    checkForExistingOrderV2,
    updateOrderDiscount,
    getCombinedOrder,
    getCombinedOrderV2,
    getOrderForProduct,
} from '@/app/utils/database/controller/orders/orders-api';
import { getFullIntakeProfileData } from '@/app/utils/database/controller/profiles/profiles';
import { redirect } from 'next/navigation';
import {
    WEIGHTLOSS_GOAL_QUESTION_ID,
    WEIGHTLOSS_RECENT_DOSE_QUESTION_ID,
    WEIGHT_LOSS_PRODUCT_HREF,
} from '@/app/components/intake-v2/constants/constants';
import WLCheckoutContainer from '@/app/components/intake-v3/pages/wl-checkout-v3';
import { getQuestionAnswerWithQuestionID } from '@/app/utils/database/controller/questionnaires/questionnaire';
import {
    getPriceDataRecordWithVariant,
    getPriceVariantTableData,
} from '@/app/utils/database/controller/product_variants/product_variants';
import WLCheckoutContainerABTest from '@/app/components/intake-v3/pages/wl-checkout-v3-ab';
import { DosageSelectionVariantIndexToDosage } from '@/app/components/provider-portal/intake-view/v2/components/intake-response-column/approve-and-prescribe-confirmation-details/dosage-change/dosage-change-quarterly-final-review';
import { getRecommendedPrices } from '@/app/utils/actions/intake/wl-supply';
import { USStates } from '@/app/types/enums/master-enums';
import {
    getQuestionAnswersForBMI,
    getQuestionAnswersForGoalBMI,
} from '@/app/utils/database/controller/clinical_notes/clinical_notes_v2';

interface WLSearchParams {
    pvn: any;
    st: any;
    psn: any;
    sd: any; //sd is important << as it is the discountable code.
    ub: any; // if coming from unbounce, this will be set to the landing page they're coming from
    /**
     * @Nathan > I wanted to make a simple, but not obvious indicator for the discounts:
     * Therefore 23c == 'Yes, do discount' and anything else is 'No, do not discount'
     */
}

interface CheckoutProps {
    params: {
        product: string;
    };
    searchParams: WLSearchParams;
}

export default async function WlCheckoutPage({
    searchParams,
    params,
}: CheckoutProps) {
    const sessionData = await handleUserSession(params.product, searchParams);

    if (!sessionData) return null;

    const {
        user_id,
        user_email,
        profilesData,
        existing_order_data,
        priceData,
        productData,
        weightLossGoal,
        recommendedPrices,
        selectedDose,
    } = await fetchData(params.product, searchParams);

    if (
        !user_id ||
        !profilesData ||
        !priceData ||
        !user_email ||
        !productData ||
        !weightLossGoal ||
        !recommendedPrices
    ) {
        return <IntakeErrorComponent />;
    }

    let currentSelection = 0;

    // 0: monthly, 1: quarterly, 2: biannual

    const orderVariantIndex = existing_order_data.variant_index;

    if (recommendedPrices.biannualPrice?.variant_index === orderVariantIndex) {
        currentSelection = 2;
    } else if (
        recommendedPrices.bundlePrice?.variant_index === orderVariantIndex
    ) {
        currentSelection = 1;
    } else {
        currentSelection = 0;
    }

    const product_href =
        existing_order_data.metadata.flowSelectedProduct ??
        existing_order_data.product_href;

    const personalData = buildPersonalData(profilesData, existing_order_data);

    await handleDiscountLogic(
        searchParams.sd,
        product_href,
        existing_order_data
    );

    const { productData: fetchedProductData, error: ImagePriceError } =
        await fetchProductImageAndPriceData(product_href);

    if (ImagePriceError) {
        console.log('Intake flow - product / price data issue.');
    }

    if (
        existing_order_data.state === USStates.Michigan ||
        existing_order_data.state === USStates.California
    ) {
        recommendedPrices.biannualPrice = null;
    }

    const formattedRecommendedPrices = [
        recommendedPrices.monthlyPrice,
        recommendedPrices.bundlePrice,
        recommendedPrices.biannualPrice,
    ];

    console.log(formattedRecommendedPrices);

    return (
        <>
            <WLCheckoutContainerABTest
                order_data={existing_order_data}
                user_id={user_id}
                user_email={user_email}
                product_data={productData}
                user_profile_data={personalData}
                priceData={priceData}
                productInformationData={fetchedProductData}
                weightlossGoal={weightLossGoal}
                selectedDose={selectedDose}
                recommendedPrices={formattedRecommendedPrices}
                currentSelection={currentSelection}
            />
        </>
    );
}

async function handleUserSession(
    product: string,
    searchParams: WLSearchParams
) {
    const { data: session, error } = await readUserSession();
    if (!session) {
        redirect(
            `/intake/prescriptions/${product}/registration?pvn=${searchParams.pvn}&st=${searchParams.st}&sd=${searchParams.sd}`
        );
        return null;
    }
    return session;
}

async function fetchData(product: string, searchParams: WLSearchParams) {
    const user_id = (await readUserSession()).data.session?.user.id;
    const user_email = (await readUserSession()).data.session?.user.email;

    if (!user_id) {
        return {
            user_id: '',
            user_email: '',
            profilesData: {},
            existing_order_data: {},
            priceData: null,
            productData: {
                product_href: '',
                variant: 0,
                subscriptionType: '',
                discountable: false,
            },
            recommendedPrices: {
                bundlePrice: null,
                monthlyPrice: null,
                biannualPrice: null,
            },
        };
    }

    const { data: profilesData, error: profilesError } =
        await getFullIntakeProfileData(user_id);

    let orderData: any = null;
    if (product === 'weight-loss') {
        orderData = await getCombinedOrderV2(user_id);
    } else {
        orderData = await getOrderForProduct(product, user_id);
    }

    if (!orderData) {
        return {
            user_id: '',
            user_email: '',
            profilesData: {},
            existing_order_data: {},
            priceData: null,
            productData: {
                product_href: '',
                variant: 0,
                subscriptionType: '',
                discountable: false,
            },
            recommendedPrices: {
                bundlePrice: null,
                monthlyPrice: null,
                biannualPrice: null,
            },
        };
    }

    const product_href =
        orderData.metadata.flowSelectedProduct ?? orderData.product_href;

    const { data: priceData, error: priceDataError } =
        await getPriceVariantTableData(product_href);

    const productData = {
        product_href: product_href,
        variant: orderData.variant_index,
        subscriptionType: orderData.subscription_type,
        discountable: searchParams.sd === '23c',
    };

    // Fetch question answer data for weightloss goal
    var weightLossGoal;
    if (orderData.metadata.flowSelectedProduct) {
        const currentBMI = await getQuestionAnswersForBMI(user_id);
        const goalBMI = await getQuestionAnswersForGoalBMI(user_id);

        weightLossGoal = Number(
            currentBMI.weight_lbs - goalBMI.weight_lbs
        ).toFixed(0);
    } else {
        const { answer: weightlossGoalAnswer, error: weightlossGoalError } =
            await getQuestionAnswerWithQuestionID(
                WEIGHTLOSS_GOAL_QUESTION_ID,
                user_id
            );
        weightLossGoal = processData(weightlossGoalAnswer);
    }

    const { answer: selectedDoseAnswer, error: selectedDoseError } =
        await getQuestionAnswerWithQuestionID(
            WEIGHTLOSS_RECENT_DOSE_QUESTION_ID,
            user_id
        );

    // Get 3 offers here
    const currentDosage =
        DosageSelectionVariantIndexToDosage[product_href][
            orderData.variant_index
        ];

    const recommendedPrices = await getRecommendedPrices(
        currentDosage,
        product_href
    );

    if (selectedDoseError) {
        console.error(
            'Error retrieving answer for selected dose at checkout screen',
            selectedDoseError,
            user_id
        );
    }

    return {
        user_id,
        user_email,
        profilesData,
        existing_order_data: orderData,
        priceData,
        productData,
        weightLossGoal,
        recommendedPrices,
        selectedDose: selectedDoseAnswer?.answer,
    };
}

function processData(weightlossGoalAnswer: any) {
    if (!weightlossGoalAnswer || !weightlossGoalAnswer.answer) {
        return 'Unknown';
    }

    switch (weightlossGoalAnswer.answer.answer) {
        case 'Losing 1-15 pounds':
            return '1-15';
        case 'Losing 16-50 pounds':
            return '16-50';
        case 'Losing 51+ pounds':
            return '51+';
        default:
            return 'Unknown';
    }
}

function buildPersonalData(profilesData: any, existing_order_data: any) {
    return {
        first_name: profilesData.first_name,
        last_name: profilesData.last_name,
        date_of_birth: profilesData.date_of_birth,
        sex_at_birth: profilesData.sex_at_birth,
        address_line1: existing_order_data?.address_line1,
        address_line2: existing_order_data?.address_line2,
        city: existing_order_data?.city,
        state: existing_order_data?.state,
        zip: existing_order_data?.zip,
        phone_number: profilesData.phone_number,
        stripe_customer_id: profilesData.stripe_customer_id,
        intake_completed: profilesData.intake_completed,
        text_opt_in: profilesData.text_opt_in,
    };
}

async function handleDiscountLogic(
    discountCode: string,
    product: string,
    existing_order_data: any
) {
    if (discountCode === '23c' || WEIGHT_LOSS_PRODUCT_HREF.includes(product)) {
        if (existing_order_data && existing_order_data.id) {
            await updateOrderDiscount(parseInt(existing_order_data.id));
        }
    }
}
