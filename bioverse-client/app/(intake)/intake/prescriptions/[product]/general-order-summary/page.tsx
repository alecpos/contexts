'use server';

import GeneralOrderSummary from '@/app/components/intake-v2/pages/general-order-summary';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { getOrderForProduct } from '@/app/utils/database/controller/orders/orders-api';
import {
    getPriceDataRecordWithVariant,
    ProductVariantRecord,
} from '@/app/utils/database/controller/product_variants/product_variants';
import { redirect } from 'next/navigation';

interface CheckoutProps {
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

export default async function OrderSummaryPage({
    searchParams,
    params,
}: CheckoutProps) {
    const { data: session, error } = await readUserSession();

    if (!session) {
        return redirect(
            `/intake/prescriptions/${params.product}/registration?pvn=${searchParams.pvn}&st=${searchParams.st}&sd=${searchParams.sd}`
        );
    }

    const user_id = session.session?.user.id!;

    const order_data = await getOrderForProduct(params.product, user_id);

    const product_data = {
        product_href: params.product,
        variant: searchParams.pvn,
        subscriptionType: searchParams.st,
        discountable: searchParams.sd === '23c',
    };

    const priceData = await getPriceDataRecordWithVariant(
        product_data.product_href,
        order_data?.variant_index ?? product_data.variant
    );

    if (!user_id || !priceData) {
        console.log('redirecting');
        return redirect(
            `/intake/prescriptions/${params.product}/registration?pvn=${searchParams.pvn}&st=${searchParams.st}&sd=${searchParams.sd}`
        );
    }

    return (
        <>
            <GeneralOrderSummary
                product_data={product_data}
                priceRecord={priceData as ProductVariantRecord}
            />
        </>
    );
}
