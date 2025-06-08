'use server';

import PreIdBScreen from '@/app/components/intake-v2/pages/pre-id-b';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { getIDVerificationData } from '@/app/utils/database/controller/profiles/profiles';

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

export default async function PreIdPage({ params, searchParams }: Props) {
    //Immediately check user session presence
    const user_id = (await readUserSession()).data.session?.user.id!;

    const { license, selfie, name, gender } = await getIDVerificationData(
        user_id || ''
    );

    return (
        <>
            <PreIdBScreen
                user_id={user_id}
                preExistingLicense={license}
                preExistingSelfie={selfie}
            />
        </>
    );
}
