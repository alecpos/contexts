'use server';

import WLInGoodHandsComponent from '@/app/components/intake-v2/pages/wl-in-good-hands';
import WLIntroFirstClientComponent from '@/app/components/intake-v2/pages/wl-intro-1';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { getCombinedOrder, getCombinedOrderV2 } from '@/app/utils/database/controller/orders/orders-api';

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

export default async function WLInGoodHandsPage({
    params,
    searchParams,
}: Props) {
    //Immediately check user session presence
    const user_id = (await readUserSession()).data.session?.user.id!;

    const orderData = await getCombinedOrderV2(user_id);

    return (
        <>
            <WLInGoodHandsComponent orderData={orderData} />
        </>
    );
}
