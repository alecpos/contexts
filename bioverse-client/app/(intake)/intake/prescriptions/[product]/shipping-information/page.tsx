'use server';

import IntakeLoadingComponent from '@/app/components/intake-v2/loading/intake-loading';
import ShippingInformation from '@/app/components/intake-v2/pages/shipping-information';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { getShippingInformationData } from '@/app/utils/database/controller/profiles/profiles';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

/**
 * @author Nathan Cho
 * Goal of page:
 *  Make a call to supabase to fetch array list of questions to send user to.
 *  Be a transition screen that holds pre-screen information prior to going into questions.
 *
 */

interface ShippingProps {
    params: {
        product: string;
    };
    searchParams: {
        pvn: any; //variant index
        st: any; //subscription cadence text
        pvt: any; //prescription variant text
        sd: any; //sd is important << as it is the discountable code.
        ub: any; // if coming from unbounce, this will be set to the landing page they're coming from
        /**
         * @Nathan > I wanted to make a simple, but not obvious indicator for the discounts:
         * Therefore 23c == 'Yes, do discount' and anything else is 'No, do not discount'
         */
    };
}
export default async function ShippingInformationPage({
    params,
    searchParams,
}: ShippingProps) {
    /**
     * Make async call to fetch shipping information to prepopulate.
     */

    const { data, error } = await readUserSession();

    const userId = data?.session?.user.id;

    const shippingInformation: ShippingInformation =
        await getShippingInformationData(userId);

    return (
        <Suspense fallback={<></>}>
            <ShippingInformation
                shippingInformation={shippingInformation}
                userId={userId}
            />
        </Suspense>
    );
}
