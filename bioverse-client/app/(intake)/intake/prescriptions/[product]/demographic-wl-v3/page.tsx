'use server';

import IntakeErrorComponent from '@/app/components/intake-v2/error/intake-error';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { getIntakeProfileData } from '@/app/utils/database/controller/profiles/profiles';
import DemographicIntakeWL from '@/app/components/intake-v2/pages/demographic-wl';
import { getPriceVariantTableData } from '@/app/utils/database/controller/product_variants/product_variants';
import DemographicIntakeWLV3 from '@/app/components/intake-v3/pages/demographic-wl-v3';

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

export default async function WeightLossDemographicPage({
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

    //Parse fetched profile data into consumable format for component
    const personalData: ProfileDataIntakeFlow = {
        first_name: profilesData.first_name,
        last_name: profilesData.last_name,
        sex_at_birth: profilesData.sex_at_birth,
        phone_number: profilesData.phone_number,
        stripe_customer_id: profilesData.stripe_customer_id,
        intake_completed: profilesData.intake_completed,
        text_opt_in: profilesData.text_opt_in,
        email: profilesData.email,
    };

    const product_data = {
        product_href: params.product,
        /**
         * 12/3/24: Nathan - Added this to ensure that orders are always made even if the url params are broken.
         */
        variant:
            searchParams.pvn && searchParams.pvn !== 'undefined'
                ? searchParams.pvn
                : 0,
        subscriptionType:
            searchParams.st && searchParams.st !== 'undefined'
                ? searchParams.st
                : 'monthly',
    };

    //Fetch price data for product to attach to order [This happens server-side]
    const { data: priceData, error: priceDataError } =
        await getPriceVariantTableData(params.product);

    if (priceDataError) {
        console.error('Error fetching data for prescription:', priceDataError);
    }

    return (
        <>
            <DemographicIntakeWLV3
                fetchedUserProfileData={personalData}
                sessionId={user_id}
                product_data={product_data}
                priceData={priceData}
                couponParam={searchParams.sd}
            />
        </>
    );
}
