'use server';

import DateOfBirthSelectionClientComponent from '@/app/components/intake-v2/pages/date-of-birth';
import IntakeErrorComponent from '@/app/components/intake-v2/error/intake-error';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { getUserDateOfBirth } from '@/app/utils/database/controller/profiles/profiles';
import DateOfBirthSelectionClientComponentV3 from '@/app/components/intake-v3/pages/date-of-birth-v3';
import PreSignupDateOfBirthSelectionClientComponentV3 from '@/app/components/intake-v3/pages/date-of-birth-pre-v3';

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

export default async function PreDOBPageIntake({
    params,
    searchParams,
}: Props) {
    return (
        <>
            <PreSignupDateOfBirthSelectionClientComponentV3 />
        </>
    );
}
