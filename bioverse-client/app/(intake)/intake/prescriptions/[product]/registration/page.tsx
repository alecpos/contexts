'use server';

import IntakeRegistrationV2 from '@/app/components/intake-v2/pages/registration';
import { createSupabaseServerComponentClient } from '@/app/utils/clients/supabaseServerClient';
import { getNextIntakeRoute } from '@/app/utils/functions/intake-route-controller';
import { redirect } from 'next/navigation';
import React from 'react';

interface RegistrationProps {
    params: {
        product: string;
    };
    searchParams: {
        pvn: any; //variant index
        st: any; //subscription cadence text
        pvt: any; //prescription variant text
        sd: any; //sd is important << as it is the discountable code.
        ub: any; // if coming from unbounce, this will be set to the landing page they're coming from
        test: string; // ab test via vwo
        test_id: string; // test id
        /**
         * @Nathan > I wanted to make a simple, but not obvious indicator for the discounts:
         * Therefore 23c == 'Yes, do discount' and anything else is 'No, do not discount'
         */
    };
}
export default async function IntakeRegistrationPage({
    searchParams,
    params,
}: RegistrationProps) {
    const supabase = createSupabaseServerComponentClient();
    const { data } = await supabase.auth.getSession();

    const session = data.session;
    const discountable: boolean = searchParams.sd === '23c';

    //Initial Redirect if logged in.
    if (session) {
        const path = `/intake/prescriptions/${params.product}/registration`;

        let test_id = '';
        if (searchParams.test_id) {
            test_id = `test_id=${searchParams.test_id}`;
        } 
        const nextRoute = getNextIntakeRoute(path, params.product, test_id);

        return redirect(
            `/intake/prescriptions/${params.product}/${nextRoute}?pvn=${
            searchParams.pvn
            }&st=${searchParams.st}&sd=${searchParams.sd}${
            searchParams.test ? '&test=ab' : ''
            }${searchParams.test_id ? `&test_id=${searchParams.test_id}` : ''}`,
        );
    }

    return (
        <>
            <IntakeRegistrationV2
                search_param_data={{
                    variant_index: searchParams.pvn,
                    subscription_cadence: searchParams.st,
                    discountable: discountable,
                }}
                session_data={session}
            />
        </>
    );
}
