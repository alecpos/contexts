'use server';

import CheckoutContainer from '@/app/components/intake-v2/pages/checkout';
import IntakeErrorComponent from '@/app/components/intake-v2/error/intake-error';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { fetchProductImageAndPriceData } from '@/app/utils/actions/intake/product-data';
import {
    checkForExistingOrderV2,
    getOrderForProduct,
    updateOrderDiscount,
} from '@/app/utils/database/controller/orders/orders-api';
import { getFullIntakeProfileData } from '@/app/utils/database/controller/profiles/profiles';
import { redirect } from 'next/navigation';
import { WEIGHT_LOSS_PRODUCT_HREF } from '@/app/components/intake-v2/constants/constants';
import { getPriceVariantTableData } from '@/app/utils/database/controller/product_variants/product_variants';
import EDCheckoutContainer from '@/app/components/intake-v2/ed/ed-checkout/ed-checkout-container';

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

export default async function EDCheckoutPage({
    searchParams,
    params,
}: CheckoutProps) {
    const { data: session, error } = await readUserSession();

    if (!session) {
        return redirect(
            `/intake/prescriptions/${params.product}/registration?pvn=${searchParams.pvn}&st=${searchParams.st}&sd=${searchParams.sd}`
        );
    }

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

    const existing_order_data = await getOrderForProduct(
        params.product,
        user_id
    );

    if (!existing_order_data) {
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

    // * ED has no discounts atm *
    // if (
    //     searchParams.sd === '23c' ||
    //     WEIGHT_LOSS_PRODUCT_HREF.includes(params.product)
    // ) {
    //     if (existing_order_data && existing_order_data.id) {
    //         updateOrderDiscount(existing_order_data.id);
    //     }
    // }

    return (
        <>
            <EDCheckoutContainer
                order_data={existing_order_data}
                user_id={user_id}
                user_email={user_email}
                user_profile_data={personalData}
            />
        </>
    );
}
