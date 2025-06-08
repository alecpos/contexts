'use server';

import IntakeErrorComponent from '@/app/components/intake-v2/error/intake-error';
import StateSelectionClientComponent from '@/app/components/intake-v2/pages/state-selection';
import StateSelectionHersComponent from '@/app/components/intake-v2/pages/state-selection-hers';
import StateSelectionClientComponentV3 from '@/app/components/intake-v3/pages/state-selection-v3';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { getUserState } from '@/app/utils/database/controller/profiles/profiles';

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

export default async function StateSelectionHersPage({
    params,
    searchParams,
}: Props) {
    return (
        <>
            <StateSelectionHersComponent />
        </>
    );
}
