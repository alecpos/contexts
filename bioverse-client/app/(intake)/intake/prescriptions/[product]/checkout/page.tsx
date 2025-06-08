'use server';

import CheckoutContainer from '@/app/components/intake-v2/pages/checkout';
import IntakeErrorComponent from '@/app/components/intake-v2/error/intake-error';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { fetchProductImageAndPriceData } from '@/app/utils/actions/intake/product-data';
import {
    checkForExistingOrderV2,
    updateOrderDiscount,
} from '@/app/utils/database/controller/orders/orders-api';
import { getFullIntakeProfileData } from '@/app/utils/database/controller/profiles/profiles';
import { redirect } from 'next/navigation';
import { WEIGHT_LOSS_PRODUCT_HREF } from '@/app/components/intake-v2/constants/constants';
import { getPriceVariantTableData } from '@/app/utils/database/controller/product_variants/product_variants';

interface CheckoutProps {
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

export default async function IntakeCheckoutPage({
    searchParams,
    params,
}: CheckoutProps) {
    const { data: session, error } = await readUserSession();

    if (!session) {
        return redirect(
            `/intake/prescriptions/${params.product}/registration?pvn=${searchParams.pvn}&st=${searchParams.st}&sd=${searchParams.sd}`
        );
    }

    const product_data = {
        product_href: params.product,
        variant: searchParams.pvn,
        subscriptionType: searchParams.st,
        discountable: searchParams.sd === '23c',
    };

    const user_id = (await readUserSession()).data.session?.user.id!;

    if (!user_id) {
        return redirect(
            `/intake/prescriptions/${params.product}/registration?pvn=${searchParams.pvn}&st=${searchParams.st}&sd=${searchParams.sd}`
        );
    }

    const user_email = (await readUserSession()).data.session?.user.email!;

    //Pull profile data to pre-populate fields if available.
    const { data: profilesData, error: profilesError } =
        await getFullIntakeProfileData(user_id);

    if (profilesError) {
        return <IntakeErrorComponent />;
    }

    const { data: existing_order_data, error: existing_order_check_error } =
        await checkForExistingOrderV2(user_id, params.product);

    if (existing_order_check_error || !existing_order_data) {
        console.error('Error: Unable to fetch order', user_id, params.product);
        return <IntakeErrorComponent />;
    }

    const personalData: ProfileDataIntakeFlowCheckout = {
        first_name: profilesData.first_name,
        last_name: profilesData.last_name,
        date_of_birth: profilesData.date_of_birth,
        sex_at_birth: profilesData.sex_at_birth,
        address_line1: existing_order_data.address_line1,
        address_line2: existing_order_data.address_line2,
        city: existing_order_data.city,
        state: existing_order_data.state,
        zip: existing_order_data.zip,
        phone_number: profilesData.phone_number,
        stripe_customer_id: profilesData.stripe_customer_id,
        intake_completed: profilesData.intake_completed,
        text_opt_in: profilesData.text_opt_in,
    };

    const { productData: fetchedProductData, error: ImagePriceError } =
        await fetchProductImageAndPriceData(product_data.product_href);

    if (ImagePriceError) {
        console.log(' Intake flow - product / price data issue. ');
    }

    const { data: priceData } = await getPriceVariantTableData(params.product);

    if (!priceData) {
        console.error('Error fetching data for prescription');
        return <></>;
    }

    if (
        searchParams.sd === '23c' ||
        WEIGHT_LOSS_PRODUCT_HREF.includes(params.product)
    ) {
        if (existing_order_data && existing_order_data.id) {
            updateOrderDiscount(parseInt(existing_order_data.id));
        }
    }

    return (
        <>
            <CheckoutContainer
                order_data={existing_order_data}
                user_id={user_id}
                user_email={user_email}
                product_data={product_data}
                user_profile_data={personalData}
                priceData={priceData}
                productInformationData={fetchedProductData}
            />
        </>
    );
}
