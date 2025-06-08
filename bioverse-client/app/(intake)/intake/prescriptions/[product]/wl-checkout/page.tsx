'use server';

import IntakeErrorComponent from '@/app/components/intake-v2/error/intake-error';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { fetchProductImageAndPriceData } from '@/app/utils/actions/intake/product-data';
import { createSupabaseServerComponentClient } from '@/app/utils/clients/supabaseServerClient';
import {
    checkForExistingOrderV2,
    updateOrderDiscount,
} from '@/app/utils/database/controller/orders/orders-api';
import { getFullIntakeProfileData } from '@/app/utils/database/controller/profiles/profiles';
import { redirect } from 'next/navigation';
import {
    WEIGHTLOSS_GOAL_QUESTION_ID,
    WEIGHTLOSS_RECENT_DOSE_QUESTION_ID,
    WEIGHT_LOSS_PRODUCT_HREF,
} from '@/app/components/intake-v2/constants/constants';
import WLCheckoutContainer from '@/app/components/intake-v2/pages/wl-checkout';
import { getQuestionAnswerWithQuestionID } from '@/app/utils/database/controller/questionnaires/questionnaire';
import {
    getPriceDataRecordWithVariant,
    getPriceVariantTableData,
} from '@/app/utils/database/controller/product_variants/product_variants';

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
        variantPriceData,
        selectedDose,
    } = await fetchData(params.product, searchParams);

    if (
        !user_id ||
        !profilesData ||
        !priceData ||
        !user_email ||
        !productData ||
        !weightLossGoal ||
        !variantPriceData
    ) {
        return <IntakeErrorComponent />;
    }

    const personalData = buildPersonalData(profilesData, existing_order_data);

    await handleDiscountLogic(
        searchParams.sd,
        params.product,
        existing_order_data
    );

    const { productData: fetchedProductData, error: ImagePriceError } =
        await fetchProductImageAndPriceData(params.product);

    if (ImagePriceError) {
        console.log('Intake flow - product / price data issue.');
    }

    return (
        <>
            <WLCheckoutContainer
                order_data={existing_order_data}
                user_id={user_id}
                user_email={user_email}
                product_data={productData}
                user_profile_data={personalData}
                priceData={priceData}
                productInformationData={fetchedProductData}
                weightlossGoal={weightLossGoal}
                selectedDose={selectedDose}
                variantPriceData={variantPriceData}
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
        };
    }

    const { data: profilesData, error: profilesError } =
        await getFullIntakeProfileData(user_id);
    const { data: existing_order_data, error: existing_order_check_error } =
        await checkForExistingOrderV2(user_id, product);

    if (!existing_order_data) {
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
        };
    }

    const { data: priceData, error: priceDataError } =
        await getPriceVariantTableData(product);

    const productData = {
        product_href: product,
        variant: searchParams.pvn,
        subscriptionType: searchParams.st,
        discountable: searchParams.sd === '23c',
    };

    // Fetch question answer data for weightloss goal
    const { answer: weightlossGoalAnswer, error: weightlossGoalError } =
        await getQuestionAnswerWithQuestionID(
            WEIGHTLOSS_GOAL_QUESTION_ID,
            user_id
        );

    const { answer: selectedDoseAnswer, error: selectedDoseError } =
        await getQuestionAnswerWithQuestionID(
            WEIGHTLOSS_RECENT_DOSE_QUESTION_ID,
            user_id
        );

    const weightLossGoal = processData(weightlossGoalAnswer);

    const variantPriceData = await getPriceDataRecordWithVariant(
        product,
        existing_order_data?.variant_index
    );

    if (weightlossGoalError) {
        console.error(
            'Error retrieving answer for weightloss goal at checkout screen',
            weightlossGoalError,
            user_id
        );
    }

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
        existing_order_data: existing_order_data,
        priceData,
        productData,
        weightLossGoal,
        variantPriceData,
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
