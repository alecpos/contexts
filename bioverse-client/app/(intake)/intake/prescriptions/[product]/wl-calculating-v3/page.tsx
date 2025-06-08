'use server';

import WLCalculatingComponent from '@/app/components/intake-v3/pages/wl-calulating-v3';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { getOrderForProduct, getCombinedOrderV2 } from '@/app/utils/database/controller/orders/orders-api';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import { getQuestionAnswersForBMI } from '@/app/utils/database/controller/clinical_notes/clinical_notes_v2';

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

export default async function WLCalculatingPage({
    params,
    searchParams,
}: Props) {
    //Immediately check user session presence
    const user_id = (await readUserSession()).data.session?.user.id!;

    const order_data = await getCombinedOrderV2(
        user_id,
    );

    const bmi_data = await getQuestionAnswersForBMI(user_id);

    return (
        <>
            <WLCalculatingComponent
                selected_product={order_data?.metadata.selected_product}
                bmi_data={bmi_data}
            />
        </>
    );
}
