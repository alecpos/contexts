'use server';

import { WEIGHT_LOSS_PRODUCT_HREF } from '@/app/components/intake-v2/constants/constants';
import IntakeErrorComponent from '@/app/components/intake-v2/error/intake-error';
import ProductOverview from '@/app/components/intake-v2/pages/product-overview';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { fetchProductImageAndPriceData } from '@/app/utils/actions/intake/product-data';
import { createSupabaseServerComponentClient } from '@/app/utils/clients/supabaseServerClient';
import {
    checkForExistingOrderV2,
    updateOrderDiscount,
} from '@/app/utils/database/controller/orders/orders-api';
import { getPriceVariantTableData } from '@/app/utils/database/controller/product_variants/product_variants';
import { getIntakeProfileData } from '@/app/utils/database/controller/profiles/profiles';
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

export default async function IntakeCheckoutPage({
    searchParams,
    params,
}: CheckoutProps) {
    const { data: session } = await readUserSession();

    if (!session) {
        return redirect(
            `/intake/prescriptions/${params.product}/registration?pvn=${searchParams.pvn}&st=${searchParams.st}&sd=${searchParams.sd}`
        );
    }

    const product_data = {
        product_href: params.product,
        variant: searchParams.pvn,
        subscriptionType: searchParams.st,
        discountable: searchParams.sd === '23c',
    };

    const user_id = (await readUserSession()).data.session?.user.id!;

    if (!user_id) {
        return redirect(
            `/intake/prescriptions/${params.product}/registration?pvn=${searchParams.pvn}&st=${searchParams.st}&sd=${searchParams.sd}`
        );
    }

    const { productData: fetchedProductData, error: ImagePriceError } =
        await fetchProductImageAndPriceData(product_data.product_href);

    if (ImagePriceError) {
        console.log(' Intake flow - product / price data issue. ');
    }

    const { data: priceData, error: priceDataError } =
        await getPriceVariantTableData(params.product);

    if (priceDataError) {
        console.error('Error fetching data for prescription:', priceDataError);
    }

    const { data: orderData } = await checkForExistingOrderV2(
        user_id,
        params.product
    );

    if (
        searchParams.sd === '23c' ||
        WEIGHT_LOSS_PRODUCT_HREF.includes(params.product)
    ) {
        if (orderData && orderData.id) {
            updateOrderDiscount(parseInt(orderData.id));
        }
    }

    return (
        <>
            <ProductOverview
                productInformationData={fetchedProductData}
                product_data={product_data}
                priceData={priceData!}
            />
        </>
    );
}
