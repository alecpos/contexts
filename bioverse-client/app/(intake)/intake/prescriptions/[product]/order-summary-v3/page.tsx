'use server';

import OrderSummaryNew from '@/app/components/intake-v3/checkout/order-summary-v3/order-summary-v3';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import { SubscriptionCadency } from '@/app/types/renewal-orders/renewal-orders-types';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import {
    getCombinedOrder,
    getCombinedOrderV2,
    getOrderForProduct,
    updateOrder,
    updateOrderDiscount,
} from '@/app/utils/database/controller/orders/orders-api';
import { getPriceDataRecordWithVariant } from '@/app/utils/database/controller/product_variants/product_variants';
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

    console.log('USER ID', user_id);

    var orderData;
    if (params.product === PRODUCT_HREF.WEIGHT_LOSS) {
        orderData = await getCombinedOrderV2(user_id);
    } else {
        orderData = await getOrderForProduct(params.product, user_id);
    }

    if (!orderData) {
        return redirect(
            `/intake/prescriptions/${params.product}/registration?pvn=${searchParams.pvn}&st=${searchParams.st}&sd=${searchParams.sd}`
        );
    }
    const selectedProductHref = orderData?.metadata.selected_product;

    if (selectedProductHref === PRODUCT_HREF.METFORMIN) {
        const productPrice = await getPriceDataRecordWithVariant(
            PRODUCT_HREF.METFORMIN,
            0
        );

        if (!productPrice) {
            console.error(
                'Unable to get product price for user on order summary',
                user_id
            );
            return redirect(
                `/intake/prescriptions/${params.product}/registration?pvn=${searchParams.pvn}&st=${searchParams.st}&sd=${searchParams.sd}`
            );
        }

        const updatedPayload = {
            variant_index: 0,
            subscription_type: SubscriptionCadency.Quarterly,
            product_href: selectedProductHref,
            price_id: String(productPrice.price_data.stripe_price_id),
            variant_text: productPrice.variant ?? '',
        };

        await updateOrder(orderData.id, updatedPayload);
        orderData = { ...orderData, ...updatedPayload };
    }

    await updateOrderDiscount(orderData.id);

    if (!orderData) {
        redirect('/');
    }

    const priceData = await getPriceDataRecordWithVariant(
        orderData.product_href,
        Number(orderData.variant_index)
    );

    if (!user_id || !priceData) {
        return redirect(
            `/intake/prescriptions/${params.product}/registration?pvn=${searchParams.pvn}&st=${searchParams.st}&sd=${searchParams.sd}`
        );
    }

    return (
        <>
            <OrderSummaryNew orderData={orderData} priceData={priceData} />
        </>
    );
}
