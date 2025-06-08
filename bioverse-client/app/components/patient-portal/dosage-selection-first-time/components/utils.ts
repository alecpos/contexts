import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import { SubscriptionCadency } from '@/app/types/renewal-orders/renewal-orders-types';
import { ProductVariantRecord } from '@/app/utils/database/controller/product_variants/product_variants';
import { getProductName } from '@/app/utils/functions/formatting';

export function displayTotalPriceFirstTimeDosage(
    priceData: Partial<ProductVariantRecord>,
    product_href: PRODUCT_HREF
) {
    if (product_href === PRODUCT_HREF.METFORMIN) {
        return priceData.price_data.product_price!;
    }
    if (
        product_href === PRODUCT_HREF.SEMAGLUTIDE ||
        product_href === PRODUCT_HREF.TIRZEPATIDE
    ) {
        if (
            priceData.cadence === 'quarterly' ||
            priceData.cadence === 'biannually'
        ) {
            return priceData.price_data.savings?.original_price ?? 0;
        } else {
            return priceData.price_data.product_price ?? 0;
        }
    }
    return 0;
}

//need to make sure priceData is accurate for biannual
export function displayDiscountedPriceFirstTimeDosage(
    priceData: Partial<ProductVariantRecord>,
    product_href: PRODUCT_HREF
) {
    if (product_href === PRODUCT_HREF.METFORMIN) {
        return (
            priceData.price_data?.product_price -
            priceData.price_data?.discount_price?.discount_amount
        );
    }
    if (
        product_href === PRODUCT_HREF.SEMAGLUTIDE ||
        product_href === PRODUCT_HREF.TIRZEPATIDE
    ) {
        if (
            priceData.cadence === 'quarterly' ||
            priceData.cadence === 'biannually'
        ) {
            return priceData.price_data?.product_price ?? 0;
        } else {
            return (
                priceData.price_data?.product_price -
                priceData.price_data?.discount_price?.discount_amount
            );
        }
    }
    return 0;
}

export function displayVialInformationFirstTimeDosage(
    priceData: Partial<ProductVariantRecord>,
    product_href: PRODUCT_HREF
) {
    const multipleVials =
        priceData.price_data.vial_sizes &&
        priceData.price_data.vial_sizes.length > 1;

    if (product_href === PRODUCT_HREF.METFORMIN) {
        return null;
    }

    const numVials = priceData.price_data.vial_sizes?.length || 0;
    let text: any = '';
    if (multipleVials) {
        text = priceData.price_data.vial_sizes
            .map((vialSize: any, index: number) => {
                return `${vialSize} mg${index === numVials - 1 ? '' : ', '}`;
            })
            .join('');
        return ` ${
            //if there are multiple vials included
            multipleVials ? `(${numVials} vials included - ${text})` : ''
        }`;
    } else {
        //if there's only one vial included
        return `One ${priceData.vial} vial included`;
    }
}

export function displayProductTitleFirstTimeDosage(
    priceData: Partial<ProductVariantRecord>,
    product_href: PRODUCT_HREF
) {
    if (product_href === PRODUCT_HREF.METFORMIN) {
        return 'Metformin';
    } else if (
        product_href === PRODUCT_HREF.SEMAGLUTIDE ||
        product_href === PRODUCT_HREF.TIRZEPATIDE
    ) {
        return `${getProductName(product_href)} Weekly Injections`;
    }

    return priceData.product_href;
}

export function displayVialDescriptions(
    priceData: Partial<ProductVariantRecord>
) {
    if (priceData.cadence === SubscriptionCadency.Monthly) {
        return `${priceData.vial} (1 vial for 4 week supply)`;
    }

    const vial_description = priceData.price_data.vial_description;

    if (!vial_description) {
        return '';
    }

    return vial_description
        .map((item: any) => `${item.vial} - (${item.description})`)
        .join(', ');
}

export function displaySupplyTotalFirstTimeDosage(
    cadence: SubscriptionCadency
) {
    switch (cadence) {
        case SubscriptionCadency.Annually:
            return '12-month supply total';
        case SubscriptionCadency.Biannually:
            return '6-month supply total';
        case SubscriptionCadency.Quarterly:
            return '3-month supply total';
        case SubscriptionCadency.Monthly:
            return '';
        default:
            return '';
    }
}

export const displaySavingsFirstTimeDosageFirstTimeDosage = (
    priceData: Partial<ProductVariantRecord>,
    product_href: PRODUCT_HREF
) => {
    if (
        priceData.cadence === 'quarterly' ||
        priceData.cadence === 'biannually'
    ) {
        if (product_href === PRODUCT_HREF.METFORMIN) {
            return priceData.price_data?.discount_price?.discount_amount ?? 0;
        }
        return priceData.price_data?.savings?.exact_total ?? 0;
    } else {
        return priceData.price_data?.discount_price?.discount_amount ?? 0;
    }
};
