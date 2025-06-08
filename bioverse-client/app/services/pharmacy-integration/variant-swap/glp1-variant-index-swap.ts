import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import { validateStateForGLP1VariantIndex } from '@/app/components/provider-portal/intake-view/v2/components/containers/utils/pharmacy-variant-index-conversion/state-based-variant-converter';

/**
 * List of GLP1 Variants that are swappable as a full list.
 */
export const GLP1_SWAPPABLE_VARIANTS = {
    semaglutide: [0, 2, 3, 4, 6, 11, 12, 13, 14],
    tirzepatide: [0, 3, 4, 10, 11, 15, 23],
};

/**
 * Mapping of initial variant :: [Variants it can be swapped to outbound].
 *
 */
export const GLP1_VARIANT_SWAPPABLE_PRICES = {
    semaglutide: {
        0: [2, 3, 4],
        2: [2, 3, 4],
        3: [2, 3, 4],
        4: [2, 3, 4],
        6: [6, 11],
        11: [11, 12],
        12: [11, 12],
        13: [2, 13, 14],
        14: [2, 13, 14],
    },
    tirzepatide: {
        0: [3, 4],
        3: [3, 4],
        4: [3, 4],
        10: [10, 11],
        11: [10, 11],
        15: [15, 23],
        23: [15, 23],
    },
};

export const ALL_GLP1_VARIANTS = {
    semaglutide: [
        2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 19, 20, 21, 22,
        23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
        41, 42, 43, 44,
    ],
    tirzepatide: [
        3, 4, 5, 10, 11, 15, 23, 6, 8, 9, 16, 17, 18, 19, 20, 24, 25, 27, 28,
        29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
    ],
};

export function getSwappableVariantIndexForCoordinatorMenu(
    productHref: string,
    state: string
): number[] {
    const indices =
        ALL_GLP1_VARIANTS[productHref as keyof typeof ALL_GLP1_VARIANTS] || [];

    return indices.filter(
        (index) =>
            validateStateForGLP1VariantIndex(
                productHref as PRODUCT_HREF,
                index,
                state
            ) === index
    );
}

export function getSwappableVariantIndexFromProductVariant(
    productHref: string,
    variantIndex: number
): number[] | null {
    const product =
        GLP1_VARIANT_SWAPPABLE_PRICES[
            productHref as keyof typeof GLP1_VARIANT_SWAPPABLE_PRICES
        ];
    if (!product) {
        console.error(`Product ${productHref} not found`);
        return null;
    }

    const prices = product[variantIndex as keyof typeof product];
    if (!prices) {
        console.error(
            `Variant index ${variantIndex} not found for product ${productHref}`
        );
        return null;
    }

    return prices;
}

export const GLP1_SWAPPABLE_VARIANT_DISPLAY_NAMES = {
    semaglutide: {
        2: '[1-month] Semaglutide 1 mg total (0.25 mg dosing) [$289]',
        3: '[1-month] Semaglutide 2.5 mg total (0.5 mg dosing) [$289]',
        4: '[1-month] Semaglutide 5 mg total (1.25 mg dosing) [$289]',
        5: '[1-month] Semaglutide 12.5 mg total (2.5 mg dosing) [$449]',
        6: '[3-month] Semaglutide 8.5 mg total (0.25mg, 0.5mg, 1.25mg dosing) [$477.15]',
        7: '[3-month] Semaglutide 15 mg total (1.25mg, 1.25mg, 1.25mg dosing) [$603.72]',
        8: '[3-month] Semaglutide 20 mg total (0.5mg, 1.25mg, 2.5mg dosing) [$808.92]',
        9: '[3-month] Semaglutide 30 mg total (1.25mg, 2.5mg, 2.5mg dosing) [$916.92]',
        10: '[3-month] Semaglutide 37.5 mg total (2.5mg, 2.5mg, 2.5mg dosing) [$1024.92]',
        11: '[3-month] Semaglutide 7.5 mg (0.5 mg dosing) [$477.15]',
        12: '[3-month] Semaglutide 10 mg (0.25 mg, 0.5 mg, 1.25 mg dosing) [$477.15]',
        13: '[1-month] Semaglutide 2.5 mg total (0.5 mg dosing) [$289]',
        14: '[1-month] Semaglutide 5 mg total (1.25 mg dosing) [$289]',
        15: '[6-month] Semaglutide 7.5 mg total (0.25 mg x 6 dosing) [$834]',
        16: '[6-month] Semaglutide 15 mg total (0.5 mg x 6 dosing) [$894]',
        17: '[ERROR] Do not prescribe this product',
        18: '[6-month] Semaglutide 17.5 mg total (0.25 mg, 0.5 mg, 0.5 mg, 1 mg x 3 dosing) [$774]',
        19: '[6-month] Semaglutide 37.5 mg total (12.5 mg x 3 dosing) [$1494]',
        20: '[6-month] Semaglutide 50 mg total (1.25 mg x 3, 2.5 mg x 3 dosing) [$1674]',
    },
    tirzepatide: {
        3: '[1-month] Tirzepartide 20 mg total (2.5 mg dosing) [$449]',
        4: '[1-month] Tirzepartide 20 mg total (5 mg dosing) [$449]',
        5: '[1-month] Tirzepartide 34 mg total (7.5 mg dosing) [$529]',
        10: '[1-month] Trizepatide 54 mg total (10 mg dosing) [$799]',
        11: '[1-month] Trizepatide 54 mg total (12.5 mg dosing) [$799]',
        15: '[1-month] Tirzepartide 40 mg total (10 mg dosing) [$729.00]',
        23: '[1-month] Tirzepartide 50 mg total (12.5 mg dosing) [$729.00]',
        6: '[3-month] Tirzepartide 60 mg total (2.5 mg, 5 mg, 5 mg dosing) [$702]',
        8: '[3-month] Tirzepartide 88 mg total (5 mg dosing, check-in with provider) [$1186.92]',
        9: '[3-month] Tirzepartide 102 mg total (7.5 mg dosing) [$1399]',
        12: '[3-month] Tirzepartide 120 mg total (10 mg dosing) [$1599]',
        13: '[3-month] Tirzepartide 150 mg total (12.5 mg dosing) [$2299]',
        16: '[3-month] Tirzepartide 50 mg total (2.5 mg, 5 mg, 5 mg dosing) [$702]',
        17: '[3-month] Tirzepartide 60 mg total (5 mg, 5 mg, 5 mg dosing) [$777]',
        18: '[3-month] Tirzepartide 60 mg total (Maintenance) (5 mg, 5 mg, 5 mg dosing) [$747]',
        19: '[3-month] Tirzepartide 70 mg total (5 mg, 5 mg, 7.5 mg dosing) [$1186]',
        20: '[3-month] Tirzepartide 90 mg total (7.5 mg, 7.5 mg, 7.5 mg dosing) [$1399]',
        21: '[3-month] Tirzepartide 120 mg total (10 mg, 10 mg, 10 mg dosing) [$1599]',
        22: '[3-month] Tirzepartide 150 mg total (2.5 mg, 5 mg, 5 mg dosing) [$1999]',
        24: '[6-month] Tirzepatide 60 mg total (2.5 mg x 6 dosing) [$1314]',
        25: '[6-month] Tirzepatide 240 mg total (10 mg x 6 dosing) [$3174]',
        27: '[6-month] Tirzepatide 90 mg total (2.5 mg x 3, 5 mg x 3 dosing) [$1374]',
        28: '[3-month] Tirzepatide 136 mg total (10 mg, 10 mg, 10 mg dosing) [$1599]',
        29: '[3-month] Tirzepatide 170 mg total (12.5 mg, 12.5 mg, 12.5 mg dosing) [$1999]',
    },
};

export function getDisplayNameForVariantGLP1Swap(
    productHref: string,
    variantIndex: number
): string | null {
    const product =
        GLP1_SWAPPABLE_VARIANT_DISPLAY_NAMES[
            productHref as keyof typeof GLP1_SWAPPABLE_VARIANT_DISPLAY_NAMES
        ];
    if (!product) {
        console.error(`Product ${productHref} not found`);
        return null;
    }

    const displayName = product[variantIndex as keyof typeof product];
    if (!displayName) {
        console.error(
            `Variant index ${variantIndex} not found for product ${productHref}`
        );
        return null;
    }

    return displayName;
}

export function getSwappableGLP1Variants(productName: string): number[] {
    if (
        ![PRODUCT_HREF.SEMAGLUTIDE, PRODUCT_HREF.TIRZEPATIDE].includes(
            productName as PRODUCT_HREF
        )
    ) {
        return [];
    }

    const variants =
        GLP1_SWAPPABLE_VARIANTS[
            productName as keyof typeof GLP1_SWAPPABLE_VARIANTS
        ];
    if (!variants) {
        console.error(`Product ${productName} not found`);
        return [];
    }
    return variants;
}


