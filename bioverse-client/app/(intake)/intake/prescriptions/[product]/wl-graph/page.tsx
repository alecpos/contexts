'use server';

import WLGraphContainer from '@/app/components/intake-v2/pages/wl-graph';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { getQuestionAnswerWithQuestionID } from '@/app/utils/database/controller/questionnaires/questionnaire';
import {
    getCombinedOrder,
    getCombinedOrderV2,
    getOrderForProduct,
} from '@/app/utils/database/controller/orders/orders-api';
import { getProductName } from '@/app/utils/database/controller/products/products';
import { getCustomerFirstNameById } from '@/app/utils/database/controller/profiles/profiles';
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

export default async function WLGraphPage({ params, searchParams }: Props) {
    //Immediately check user session presence
    const user_id = (await readUserSession()).data.session?.user.id!;

    if (!user_id) {
        return redirect(
            `/intake/prescriptions/${params.product}/registration?pvn=${searchParams.pvn}&st=${searchParams.st}&psn=${searchParams.psn}&sd=${searchParams.sd}&ub=${searchParams.ub}`
        );
    }

    var orderData;

    if (params.product === PRODUCT_HREF.WEIGHT_LOSS) {
        orderData = await getCombinedOrderV2(user_id);
    } else {
        orderData = await getOrderForProduct(params.product, user_id);
    }

    if (!orderData) {
        return redirect(
            `/intake/prescriptions/${params.product}/registration?pvn=${searchParams.pvn}&st=${searchParams.st}&psn=${searchParams.psn}&sd=${searchParams.sd}&ub=${searchParams.ub}`
        );
    }

    var product_href = orderData.product_href;

    if (product_href === PRODUCT_HREF.WEIGHT_LOSS) {
        product_href = orderData.metadata['selected_product'];
    }

    if (!product_href) {
        console.error('Could not get valid product_href for customer');
        return redirect(
            `/intake/prescriptions/${params.product}/registration?pvn=${searchParams.pvn}&st=${searchParams.st}&psn=${searchParams.psn}&sd=${searchParams.sd}&ub=${searchParams.ub}`
        );
    }

    const { name: product_name, error: product_name_error } =
        await getProductName(product_href);

    const { first_name } = await getCustomerFirstNameById(user_id);

    const { answer, error } = await getQuestionAnswerWithQuestionID(
        '166',
        user_id
    );

    const user_body_weight = answer ? answer!.answer.formData[2] : -1;

    return (
        <>
            <WLGraphContainer
                first_name={first_name}
                product_name={product_name}
                user_body_weight={user_body_weight}
                orderData={orderData}
                product_href={product_href}
            />
        </>
    );
}
