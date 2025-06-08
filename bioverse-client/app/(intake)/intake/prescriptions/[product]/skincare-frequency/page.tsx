'use server';

import SkincareFrequencyComponent from '@/app/components/intake-v2/pages/skincare-frequency';

import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { getOrderForProduct } from '@/app/utils/database/controller/orders/orders-api';
import { getPriceVariantTableData } from '@/app/utils/database/controller/product_variants/product_variants';
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

export default async function SkincareFrequencyPage({
    params,
    searchParams,
}: Props) {
    //Immediately check user session presence
    const user_id = (await readUserSession()).data.session?.user.id!;

    const orderData = await getOrderForProduct(params.product, user_id);
    if (!orderData) {
        redirect('/');
    }

    const productVariants = await getPriceVariantTableData(params.product);

    return (
        <>
            <SkincareFrequencyComponent
                productVariants={productVariants?.data!}
                orderData={orderData}
            />
        </>
    );
}
