'use server';

import PreIdScreen from '@/app/components/intake-v3/pages/pre-id-v3';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { getIDVerificationData } from '@/app/utils/database/controller/profiles/profiles';
import {
    getCombinedOrder,
    getCombinedOrderV2,
} from '@/app/utils/database/controller/orders/orders-api';

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
        user_id || '',
    );

    let productName = '';
    if (params.product === 'weight-loss') {
        const orderData = await getCombinedOrderV2(user_id);
        productName = orderData?.metadata?.selected_product
            ? orderData?.metadata?.selected_product
            : '';
    }

    return (
        <>
            <PreIdScreen
                user_id={user_id}
                preExistingLicense={license}
                preExistingSelfie={selfie}
                productName={productName}
            />
        </>
    );
}
