import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';

//Possible semaglutide variants that are considered empower and also overtaken by hallandale
const SEMAGLUTIDE_CONVERTIBLE_VARIANTS = [3, 4, 6];

//Possible tirzepatide variants that are considered empower and also overtaken by hallandale
// const TIRZEPATIDE_CONVERTIBLE_VARIANTS = [3, 10, 6, 8, 9, 12, 13];
// variants considered hallandale -> Hallandale does not sell tirzepatide any longer.
const TIRZEPATIDE_HALLANDALE_VARIANTS = [
    14, 15, 23, 16, 17, 18, 19, 20, 21, 22, 12, 13,
];

export function convertEmpowerOrderToHallandaleVariant(
    product_href: string,
    variant_index: number
): number {
    //Binary conditional since there are only two different glp-1 product href's to reference between at this point.
    if (product_href === PRODUCT_HREF.SEMAGLUTIDE) {
        //When creating this, the current implementation just used whatever variant index was appropriate so this is failure behavior.
        if (!SEMAGLUTIDE_CONVERTIBLE_VARIANTS.includes(variant_index)) {
            return variant_index;
        }

        //This line below will return the conversion map's appropriate, corresponding numeric written in the dict
        return EMPOWER_HALLANDALE_CONVERSION_MAP.semaglutide[
            variant_index as keyof typeof EMPOWER_HALLANDALE_CONVERSION_MAP.semaglutide
        ];
    } else {
        if (!TIRZEPATIDE_HALLANDALE_VARIANTS.includes(variant_index)) {
            return variant_index;
        }

        //This line below will return the conversion map's appropriate, corresponding numeric written in the dict
        return HALLANDALE_EMPOWER_CONVERSION_MAP.tirzepatide[
            variant_index as keyof typeof HALLANDALE_EMPOWER_CONVERSION_MAP.tirzepatide
        ];
    }
}

//Conversion map for empower - hallandale product variant indices.
// left hand # key is the empower variant-index, and right hand value is the variant index of the product for the corresponding hallandale item
const EMPOWER_HALLANDALE_CONVERSION_MAP = {
    semaglutide: {
        3: 13,
        4: 14,
        6: 12,
    },
    tirzepatide: {
        3: 14,
        10: 15,
        6: 16,
        8: 19,
        9: 20,
        12: 21,
        13: 22,
    },
};

// Convert Hallandale Product -> Empower (only for Michigan at the moment)
export const HALLANDALE_EMPOWER_CONVERSION_MAP = {
    semaglutide: {
        2: 2,
        3: 3,
        4: 4,
        5: 5,
        6: 6,
        7: 7,
        8: 8,
        9: 9,
        10: 10,
        11: 6,
        13: 3,
        14: 4,
        12: 6,
    },
    tirzepatide: {
        1: 1,
        2: 2,
        3: 3,
        4: 4,
        5: 5,
        6: 6,
        7: 7,
        8: 8,
        9: 9,
        10: 10,
        11: 11,
        12: 28,
        13: 29,
        14: 3,
        15: 10,
        16: 6,
        17: 6,
        18: 6,
        19: 8,
        20: 9,
        21: 12,
        22: 13,
        23: 11,
        24: 24,
        25: 25,
        26: 26,
        27: 27,
        28: 28,
        29: 29,
        30: 30,
        31: 31,
        32: 32,
        33: 33,
        34: 34,
        35: 35,
        36: 36,
        37: 37,
        38: 38,
        39: 39,
        40: 40,
        41: 41,
    },
};

export const EMPOWER_VARIANT_INDEX_ARRAY_SEMAGLTIDE = [
    2, 3, 4, 5, 6, 7, 8, 9, 10,
];

export const EMPOWER_VARIANT_INDEX_ARRAY_TIRZEPATIDE = [
    3, 4, 5, 10, 11, 6, 7, 8, 9, 12, 13, 28, 29,
];
