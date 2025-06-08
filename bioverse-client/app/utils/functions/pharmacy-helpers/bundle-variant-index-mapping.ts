/**
 * Consumes one variant index and returns a new variant index for bundle<->single variants.
 */

import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';

export function convertBundleVariantToSingleVariant(
    product: string,
    bundle_variant_index: number
): number {
    if (
        !shouldConvertBundleSubscriptionToMonthly(
            product as PRODUCT_HREF,
            bundle_variant_index
        )
    ) {
        return bundle_variant_index;
    }
    switch (product) {
        case 'semaglutide':
            return SEMAGLUTIDE_BUNDLE_MONTHLY_MAPPING[bundle_variant_index];
        case 'tirzepatide':
            return TIRZEPATIDE_BUNDLE_MONTHLY_MAPPING[bundle_variant_index];
    }

    return -1;
}

// Semaglutide & Tirzepatide variants that shouldn't be converted to monthly variant on subscription renewal
const SEMAGLUTIDE_NO_CONVERT_VARIANTS = [8, 9, 10, 7, 27, 34, 57, 30];
const TIRZEPATIDE_NO_CONVERT_VARIANTS = [12, 13, 28, 29, 21, 38, 39];

export function shouldConvertBundleSubscriptionToMonthly(
    product_href: PRODUCT_HREF,
    variant_index: number
) {
    if (product_href === PRODUCT_HREF.SEMAGLUTIDE) {
        if (SEMAGLUTIDE_NO_CONVERT_VARIANTS.includes(variant_index)) {
            return false;
        }
        return true;
    }

    if (product_href === PRODUCT_HREF.TIRZEPATIDE) {
        if (TIRZEPATIDE_NO_CONVERT_VARIANTS.includes(variant_index)) {
            return false;
        }

        return true;
    }
}

interface BundleMonthlyMapping {
    [key: number]: number;
}

const SEMAGLUTIDE_BUNDLE_MONTHLY_MAPPING: BundleMonthlyMapping = {
    0: 2,
    1: 2,
    2: 2,
    3: 13,
    4: 14,
    5: 5,
    6: 14,
    7: 14,
    8: 5,
    9: 5,
    10: 5,
    11: 14,
    12: 14,
    13: 13,
    14: 14,
    15: 2,
    16: 13,
    17: 14,
    18: 14,
    19: 5,
    20: 5,
    21: 14,
    26: 22,
    27: 24,
    28: 23,
    29: 24,
    30: 25,
    31: 24,
    32: 32,
    33: 2,
    34: 4,
    35: 4,
    36: 3,
};

const TIRZEPATIDE_BUNDLE_MONTHLY_MAPPING: BundleMonthlyMapping = {
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 4,
    7: 3,
    8: 4,
    9: 5,
    10: 10,
    11: 11,
    12: 10,
    13: 23,
    14: 3,
    15: 10,
    16: 4,
    17: 4,
    18: 4,
    19: 5,
    20: 5,
    21: 10,
    22: 11,
    23: 11,
    24: 3,
    25: 10,
    26: 5,
    27: 4,
    28: 10,
    29: 23,
    35: 30,
    36: 31,
    37: 32,
    38: 33,
    39: 34,
};
