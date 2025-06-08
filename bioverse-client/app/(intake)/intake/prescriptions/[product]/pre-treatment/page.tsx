'use server';

import StartWLJourneyComponent from '@/app/components/intake-v3/pages/start-wl-journey-v3';
import WLIntroFirstClientComponent from '@/app/components/intake-v2/pages/wl-intro-1';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import PreTreatmentComponent from '@/app/components/intake-v3/pages/pre-treatment';

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

export default async function PreTreatmentPage({
    params,
    searchParams,
}: Props) {
    return (
        <>
            <PreTreatmentComponent />
        </>
    );
}
