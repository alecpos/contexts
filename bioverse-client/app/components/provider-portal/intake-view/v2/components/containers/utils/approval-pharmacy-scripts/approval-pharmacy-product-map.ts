import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';

export const APPROVAL_PHARMACY_MAP = {
    empower: [
        PRODUCT_HREF.SEMAGLUTIDE,
        PRODUCT_HREF.TIRZEPATIDE,
        PRODUCT_HREF.WL_CAPSULE,
        PRODUCT_HREF.NAD_NASAL_SPRAY,
        PRODUCT_HREF.PEAK_CHEWS,
        PRODUCT_HREF.RUSH_CHEWS,
    ],
    // belmar: ['semaglutide', 'tirzepatide'],
    tmc: [
        PRODUCT_HREF.NAD_INJECTION,
        PRODUCT_HREF.GLUTATIONE_INJECTION,
        // PRODUCT_HREF.B12_INJECTION,
    ],
    hallandale: [
        PRODUCT_HREF.SEMAGLUTIDE,
        PRODUCT_HREF.TIRZEPATIDE,
        PRODUCT_HREF.X_CHEWS,
        PRODUCT_HREF.X_MELTS,
    ],
    boothwyn: [
        PRODUCT_HREF.SERMORELIN,
    ],

    revive: [
        PRODUCT_HREF.B12_INJECTION,
    ],
};

export const APPROVE_AND_PRESCRIBE_PRODUCTS = [
    'semaglutide',
    'tirzepatide',
    'nad-injection',
    'glutathione-injection',
    'b12-injection',
    'wl-capsule',
    'nad-nasal-spray',
    PRODUCT_HREF.X_CHEWS,
    PRODUCT_HREF.X_MELTS,
    PRODUCT_HREF.PEAK_CHEWS,
    PRODUCT_HREF.RUSH_CHEWS,
    PRODUCT_HREF.SERMORELIN,
];

//Possible semaglutide variants that are considered empower and also overtaken by hallandale
const SEMAGLUTIDE_CONVERTIBLE_VARIANTS = [3, 4, 6];

//Possible tirzepatide variants that are considered empower and also overtaken by hallandale
const TIRZEPATIDE_CONVERTIBLE_VARIANTS = [3, 10, 6, 8, 9, 12, 13];

const TIRZEPATIDE_HALLANDALE_VARIANTS = [
    14, 15, 23, 16, 17, 18, 19, 20, 21, 22,
];

const getGLP1PharmacyFromProductAndVariant = (
    product_href: string,
    variant_index: number
) => {
    if (product_href == 'semaglutide') {
        if (SEMAGLUTIDE_CONVERTIBLE_VARIANTS.includes(variant_index)) {
            return 'hallandale';
        }

        if (variant_index <= 10 || variant_index === 21) {
            return 'empower';
        } else if (variant_index > 10 && variant_index <= 20) {
            return 'hallandale';
        }
    }

    if (product_href == 'tirzepatide') {
        if (TIRZEPATIDE_HALLANDALE_VARIANTS.includes(variant_index)) {
            return 'empower';
        }

        if (variant_index <= 13) {
            return 'empower';
        } else if (variant_index > 13 && variant_index <= 27) {
            return 'hallandale';
        } else if (variant_index >= 28 && variant_index <= 29) {
            return 'empower';
        }
    }

    if (product_href == 'wl-capsule') {
        return 'empower';
    }
};

export function getEligiblePharmacy(
    product: string,
    variant_index: number,
    state?: string
): string | undefined {
    if (product === 'semaglutide' || product === 'tirzepatide') {
        if (state === 'MI') {
            return 'empower';
        }

        return getGLP1PharmacyFromProductAndVariant(product, variant_index);
    }

    // Iterate over each entry in the APPROVAL_PHARMACY_MAP
    for (const [pharmacy, products] of Object.entries(APPROVAL_PHARMACY_MAP)) {
        // Check if the current pharmacy's product list includes the specified product
        if (products.includes(product as PRODUCT_HREF)) {
            // If it does, return the pharmacy name
            return pharmacy;
        }
    }

    return undefined;
}
