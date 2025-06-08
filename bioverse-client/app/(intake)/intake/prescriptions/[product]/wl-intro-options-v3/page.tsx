'use server';

import WLIntroOptionsClientComponent from '@/app/components/intake-v3/pages/wl-intro-options-v3';
import WLIntroSpecialistsClientComponent from '@/app/components/intake-v2/pages/wl-intro-specialists';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { AB_TESTS_IDS } from '@/app/components/intake-v2/types/intake-enumerators';
import { redirect } from 'next/navigation';

interface Props {
    params: {
        product: string;
    };
    searchParams: {
        vwo_test_param: string;
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

export default async function WLIntroOptionsPage({
    params,
    searchParams,
}: Props) {
    //Immediately check user session presence
    const user_id = (await readUserSession()).data.session?.user.id!;

    if (searchParams.vwo_test_param === 'wl-ro-test') {
        return redirect(
            `/intake/prescriptions/${params.product}/wl-accomplish-goals`
        );
    }

    return (
        <>
            <WLIntroOptionsClientComponent />
        </>
    );
}
