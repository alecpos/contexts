'use server';

import SelectSupplyComponent from '@/app/components/intake-v2/pages/select-supply';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { getNonGLPDiscountForProduct } from '@/app/utils/database/api-controller/discounts/database-discounts-api';
import { getOrderForProduct } from '@/app/utils/database/controller/orders/orders-api';
import { getMonthlyAndQuarterlyPriceVariantData } from '@/app/utils/database/controller/product_variants/product_variants';
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

const DOSAGE_QUESTION_IDS = [280, 281, 282, 284, 286, 287];

export default async function WeightlossSupplyPage({
    params,
    searchParams,
}: Props) {
    //Immediately check user session presence
    const user_id = (await readUserSession()).data.session?.user.id!;

    // Need to fetch question answers for 280, 281, 282, 284, 286, 287

    const orderData = await getOrderForProduct(params.product, user_id);
    if (!orderData) {
        redirect('/');
    }

    const product_data = {
        product_href: params.product,
        variant: searchParams.pvn,
        subscriptionType: searchParams.st,
        discountable: searchParams.sd === '23c',
    };

    const { monthlyPrice, quarterlyPrice } =
        await getMonthlyAndQuarterlyPriceVariantData(product_data.product_href);

    const { monthlyDiscount, quarterlyDiscount } =
        await getNonGLPDiscountForProduct(product_data.product_href);

    return (
        <>
            <SelectSupplyComponent
                orderData={orderData}
                isV2={true}
                monthlyPriceData={monthlyPrice}
                quarterlyPriceData={quarterlyPrice}
                monthlyDiscount={monthlyDiscount}
                quarterlyDiscount={quarterlyDiscount}
            />
        </>
    );
}
