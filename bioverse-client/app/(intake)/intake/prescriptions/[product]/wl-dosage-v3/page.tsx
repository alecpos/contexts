'use server';

import WeightlossDosageComponent from '@/app/components/intake-v2/pages/semaglutide-dosage';
import WeightlossSelectDosageComponent from '@/app/components/intake-v3/pages/wl-select-dosage-v3';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import {
    getCombinedWeightlossOrderForUser,
    getIncompleteGlobalWLOrderPostHrefSwap,
    getOrderForProduct,
} from '@/app/utils/database/controller/orders/orders-api';
import { redirect } from 'next/navigation';

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

export default async function WeightlossDosagePage({
    params,
    searchParams,
}: Props) {
    //Immediately check user session presence
    const user_id = (await readUserSession()).data.session?.user.id!;

    let orderData;

    if (params.product === PRODUCT_HREF.WEIGHT_LOSS) {
        orderData = await getIncompleteGlobalWLOrderPostHrefSwap(user_id); 
    } else {
        orderData = await getOrderForProduct(params.product, user_id);
    }

    if (!orderData) {
        redirect('/collections');
    }

    return (
        <>
            <WeightlossSelectDosageComponent orderData={orderData} />
        </>
    );
}
