'use server';

import IntakeAccountScreen from '@/app/components/intake-v2/pages/demographic-information';
import IntakeErrorComponent from '@/app/components/intake-v2/error/intake-error';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import {} from '@/app/utils/database/controller/orders/orders-api';
import { getIntakeProfileData } from '@/app/utils/database/controller/profiles/profiles';
import { getPriceVariantTableData } from '@/app/utils/database/controller/product_variants/product_variants';

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

export default async function IntakeAccountPage({
    params,
    searchParams,
}: Props) {
    //Immediately check user session presence
    const user_id = (await readUserSession()).data.session?.user.id!;

    //Pull profile data to pre-populate fields if available.
    const { data: profilesData, error: profilesError } =
        await getIntakeProfileData(user_id);

    if (profilesError) {
        return <IntakeErrorComponent />;
    }

    const personalData: ProfileDataIntakeFlow = {
        first_name: profilesData.first_name,
        last_name: profilesData.last_name,
        sex_at_birth: profilesData.sex_at_birth,
        phone_number: profilesData.phone_number,
        stripe_customer_id: profilesData.stripe_customer_id,
        intake_completed: profilesData.intake_completed,
        text_opt_in: profilesData.text_opt_in,
    };

    const product_data = {
        product_href: params.product,
        variant: searchParams.pvn,
        subscriptionType: searchParams.st,
    };

    //Fetch price data for product to attach to order [This happens server-side]
    const { data: priceData, error: priceDataError } =
        await getPriceVariantTableData(params.product);
    if (priceDataError) {
        console.error('Error fetching data for prescription:', priceDataError);
    }

    return (
        <>
            <IntakeAccountScreen
                fetchedUserProfileData={personalData}
                sessionId={user_id}
                product_data={product_data}
                priceData={priceData}
                couponParam={searchParams.sd}
            />
        </>
    );
}
