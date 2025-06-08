'use server';

import SelectSupplyComponent from '@/app/components/intake-v3/pages/select-supply-ap';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { getNonGLPDiscountForProduct } from '@/app/utils/database/api-controller/discounts/database-discounts-api';
import { getOrderForProduct } from '@/app/utils/database/controller/orders/orders-api';
import { getActiveVariantsForProduct } from '@/app/utils/database/controller/product_variants/product_variants';
import { getUserProfile } from '@/app/utils/database/controller/profiles/profiles';
import { redirect } from 'next/navigation';

interface Props {
    params: {
        product: string;
    };
searchParams: {
        pvn: any;
        st: any;
        psn: any;
        sd: any;
        ub: any;
    };
}

interface SelectSupplyProps {
    monthlyPriceData: any;
    quarterlyPriceData: any;
    orderData: any;
    monthlyDiscount: string;
    quarterlyDiscount: string;
    sexAtBirth: string;
    priceData: any[];
}

export default async function WeightlossSupplyPage({
    params,
    searchParams,
}: Props) {
    const user_id = (await readUserSession()).data.session?.user.id!;

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

    // Fetch all active variants for the product
    const { data: priceData, error } = await getActiveVariantsForProduct(product_data.product_href);
    if (error) throw new Error('Failed to fetch product variants');

    // Log the raw priceData
    console.log('[select-supply-ap] priceData:', priceData);

    // Filter for monthly and biannually/quarterly
    const monthly = priceData?.find(v => v.cadence === 'monthly') || null;
    const bundle = priceData?.find(
        v => v.cadence === 'biannually' || v.cadence === 'quarterly'
    ) || null;

    // Log the filtered variants
    console.log('[select-supply-ap] monthly:', monthly);
    console.log('[select-supply-ap] bundle:', bundle);

    const { monthlyDiscount, quarterlyDiscount } =
        await getNonGLPDiscountForProduct(product_data.product_href);

    const user_profile = await getUserProfile(user_id);
    const sex_at_birth = user_profile?.sex_at_birth;

    const getVariantForSupply = (supply: 'monthly' | 'quarterly' | 'biannually') =>
        priceData?.find(v => v.cadence === supply) || null;

    const monthlyVariant = getVariantForSupply('monthly');
    const quarterlyVariant = getVariantForSupply('quarterly');
    const biannualVariant = getVariantForSupply('biannually');

    return (
        <>
            <SelectSupplyComponent
                orderData={orderData}
                monthlyPriceData={monthly}
                quarterlyPriceData={bundle}
                monthlyDiscount={monthlyDiscount}
                quarterlyDiscount={quarterlyDiscount}
                priceData={priceData || []}
            />
            <div className="hidden">
                {JSON.stringify({
                    monthlyVariant,
                    quarterlyVariant,
                    biannualVariant
                })}
            </div>
        </>
    );
}
