import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';

/**
 * Equivalence Map Breakdown:
 * 1st Key (string): Product Href i.e. Semaglutide / Tirzepatide
 * 2nd Key (number): variant index
 * Output (number): Variant Index for the product mapped to the dosage equivalence.
 */
interface ProductVariantEquivalenceMap {
    [key: string]: ProductVariantGroup[];
}

interface ProductVariantGroup {
    variantIndices: number[];
    equivalence: ProductEquivalence;
}

export enum EquivalenceCodes {
    //SEMAGLUTIDE
    SEMA1MO_0_25_MG = 'semaglutide-1-monthly-0.25mg',
    SEMA2MO_0_5_MG = 'semaglutide-2-monthly-0.5mg',
    SEMA3MO_1_25_MG = 'semaglutide-3-monthly-1.25mg',
    SEMA4MO_2_5_MG = 'semaglutide-4-monthly-2.5mg',
    SEMA5QU = 'semaglutide-5-quarterly',
    SEMA6QU = 'semaglutide-6-quarterly',
    SEMA7QU = 'semaglutide-7-quarterly',
    SEMA8QU = 'semaglutide-8-quarterly',
    SEMA9QU = 'semaglutide-9-quarterly',
    SEMA10QU = 'semaglutide-10-quarterly',
    SEMA11QU = 'semaglutide-11-quarterly',
    SEMA12BIAN = 'semaglutide-12-biannual',
    SEMA13BIAN = 'semaglutide-13-biannual',
    SEMA14BIAN = 'semaglutide-14-biannual',
    SEMA15BIAN = 'semaglutide-15-biannual',
    SEMA16BIAN = 'semaglutide-16-biannual',
    SEMA17BIAN = 'semaglutide-17-biannual',
    SEMA18BIAN = 'semaglutide-18-biannual', 
    SEMA18ANN = 'semaglutide-18-annual',
    SEMA19ANN = 'semaglutide-19-annual',
    SEMA20ANN = 'semaglutide-20-annual',

    //TIRZEPATIDE
    TIRZ1MO = 'tirzepatide-1-monthly',
    TIRZ2MO = 'tirzepatide-2-monthly',
    TIRZ3MO = 'tirzepatide-3-monthly',
    TIRZ4MO = 'tirzepatide-4-monthly',
    TIRZ5MO = 'tirzepatide-5-monthly',
    TIRZ6QU = 'tirzepatide-6-quarterly',
    TIRZ7QU = 'tirzepatide-7-quarterly',
    TIRZ8QU = 'tirzepatide-8-quarterly',
    TIRZ9QU = 'tirzepatide-9-quarterly',
    TIRZ10QU = 'tirzepatide-10-quarterly',
    TIRZ11QU = 'tirzepatide-11-quarterly',
    TIRZ12QU = 'tirzepatide-12-quarterly',
    TIRZ13BIAN = 'tirzepatide-13-biannual',
    TIRZ14BIAN = 'tirzepatide-14-biannual',
    TIRZ15BIAN = 'tirzepatide-15-biannual',
    TIRZ16ANN = 'tirzepatide-16-annual',

    // METFORMIN
    METFORMIN1QU = 'metformin-1-quarterly',

    // WL CAPSULES
    CAPSULE1MO = 'wl-capsule-1-monthly',
    CAPSULE2QU = 'wl-capsule-2-quarterly',

    // SERMORELIN
    SERM1MO = 'sermorelin-1-monthly',
    SERM2QU = 'sermorelin-2-quarterly',
    SERM3BIAN = 'sermorelin-3-biannual',

}

export const PRODUCT_VARIANCE_EQUIVALENCE_MAP: ProductVariantEquivalenceMap = {
    metformin: [
        // Quarterly
        {
            variantIndices: [0],
            equivalence: {
                equivalenceCode: EquivalenceCodes.METFORMIN1QU,
                productHref: PRODUCT_HREF.METFORMIN,
                dosage: '1000 mg',
                cadence: 'quarterly',
                pharmacyMap: {
                    curexa: 0,
                },
            },
        },
    ],
    [PRODUCT_HREF.WL_CAPSULE]: [
        // monthly
        {
            variantIndices: [0],
            equivalence: {
                equivalenceCode: EquivalenceCodes.CAPSULE1MO,
                productHref: PRODUCT_HREF.WL_CAPSULE,
                dosage: '',
                cadence: 'monthly',
                pharmacyMap: {
                    empower: 0,
                },
            },
        },
        {
            variantIndices: [1],
            equivalence: {
                equivalenceCode: EquivalenceCodes.CAPSULE2QU,
                productHref: PRODUCT_HREF.WL_CAPSULE,
                dosage: '',
                cadence: 'quarterly',
                pharmacyMap: {
                    empower: 1,
                },
            },
        },
    ],
    semaglutide: [
        {
            //0.25 MG Dosing Monthly
            variantIndices: [0, 1, 2, 22, 45],
            equivalence: {
                equivalenceCode: EquivalenceCodes.SEMA1MO_0_25_MG,
                productHref: PRODUCT_HREF.SEMAGLUTIDE,
                dosage: '0.25 mg',
                cadence: 'monthly',
                pharmacyMap: {
                    empower: 2,
                    boothwyn: 22,
                },
            },
        },
        {
            //0.5 MG Dosing Monthly
            variantIndices: [3, 13, 23, 32, 55, 46],
            equivalence: {
                equivalenceCode: EquivalenceCodes.SEMA2MO_0_5_MG,
                productHref: PRODUCT_HREF.SEMAGLUTIDE,
                dosage: '0.5 mg',
                cadence: 'monthly',
                pharmacyMap: {
                    empower: 3,
                    hallandale: 13,
                    boothwyn: 23,
                    revive: 55,
                },
            },
        },

        {
            //1.25 MG Dosing Monthly
            variantIndices: [4, 14, 24, 47],
            equivalence: {
                equivalenceCode: EquivalenceCodes.SEMA3MO_1_25_MG,
                productHref: PRODUCT_HREF.SEMAGLUTIDE,
                dosage: '1.25 mg',
                cadence: 'monthly',
                pharmacyMap: {
                    empower: 4,
                    boothwyn: 24,
                },
            },
        },

        {
            //2.5 MG Dosing Monthly
            variantIndices: [5, 25, 48],
            equivalence: {
                equivalenceCode: EquivalenceCodes.SEMA4MO_2_5_MG,
                productHref: PRODUCT_HREF.SEMAGLUTIDE,
                dosage: '2.5 mg',
                cadence: 'monthly',
                pharmacyMap: {
                    empower: 5,
                    boothwyn: 25,
                },
            },
        },

        /**
         * Quarterly Offers
         */
        {
            //(.25 mg / .5 mg / 1.25 mg) MG Dosing Quarterly
            variantIndices: [6, 11, 12, 26, 33, 56, 49],
            equivalence: {
                equivalenceCode: EquivalenceCodes.SEMA5QU,
                productHref: PRODUCT_HREF.SEMAGLUTIDE,
                dosage: '(0.25, 0.5, 1.25) mg',
                cadence: 'quarterly',
                pharmacyMap: {
                    empower: 6,
                    hallandale: 12,
                    boothwyn: 26,
                    revive: 56,
                },
            },
        },

        {
            //(1.25 mg / 1.25 mg / 1.25 mg) MG Dosing Quarterly
            variantIndices: [7, 27, 34, 57, 50],
            equivalence: {
                equivalenceCode: EquivalenceCodes.SEMA6QU,
                productHref: PRODUCT_HREF.SEMAGLUTIDE,
                dosage: '(1.25, 1.25, 1.25) mg',
                cadence: 'quarterly',
                pharmacyMap: {
                    empower: 7,
                    boothwyn: 27,
                    revive: 57,
                },
            },
        },

        {
            //(0.5 mg / 1.25 mg / 2.5 mg) MG Dosing Quarterly
            variantIndices: [8, 28, 36, 59, 52],
            equivalence: {
                equivalenceCode: EquivalenceCodes.SEMA7QU,
                productHref: PRODUCT_HREF.SEMAGLUTIDE,
                dosage: '(0.5, 1.25, 2.5) mg',
                cadence: 'quarterly',
                pharmacyMap: {
                    empower: 8,
                    boothwyn: 28,
                    revive: 59,
                },
            },
        },

        {
            //(0.5 x3) MG Dosing Quarterly
            variantIndices: [12],
            equivalence: {
                equivalenceCode: EquivalenceCodes.SEMA8QU,
                productHref: PRODUCT_HREF.SEMAGLUTIDE,
                dosage: '(0.5, 0.5, 0.5) mg',
                cadence: 'quarterly',
                pharmacyMap: {
                    hallandale: 12,
                },
            },
        },

        {
            //(1.25 mg / 1.25 mg / 2.5 mg) MG Dosing Quarterly
            variantIndices: [21, 31, 35, 43, 58, 51],
            equivalence: {
                equivalenceCode: EquivalenceCodes.SEMA9QU,
                productHref: PRODUCT_HREF.SEMAGLUTIDE,
                dosage: '(1.25, 1.25, 2.5) mg',
                cadence: 'quarterly',
                pharmacyMap: {
                    empower: 21,
                    boothwyn: 31,
                    hallandale: 43,
                    revive: 58,
                },
            },
        },

        {
            //(1.25 mg / 2.5 mg / 2.5 mg) MG Dosing Quarterly
            variantIndices: [9, 29, 44, 53],
            equivalence: {
                equivalenceCode: EquivalenceCodes.SEMA10QU,
                productHref: PRODUCT_HREF.SEMAGLUTIDE,
                dosage: '(1.25, 2.5, 2.5) mg',
                cadence: 'quarterly',
                pharmacyMap: {
                    empower: 9,
                    boothwyn: 29,
                    hallandale: 44,
                },
            },
        },

        {
            //(2.5 mg / 2.5 mg / 2.5 mg) MG Dosing Quarterly
            variantIndices: [10, 30, 54],
            equivalence: {
                equivalenceCode: EquivalenceCodes.SEMA11QU,
                productHref: PRODUCT_HREF.SEMAGLUTIDE,
                dosage: '(2.5, 2.5, 2.5) mg',
                cadence: 'quarterly',
                pharmacyMap: {
                    empower: 10,
                    boothwyn: 30,
                },
            },
        },

        /**
         * Biannual Offers:
         */

        {
            //(0.25 mg, 0.25 mg, 0.25 mg, 0.25 mg, 0.25 mg, 0.25 mg) MG Dosing Biannually
            variantIndices: [15, 64],
            equivalence: {
                equivalenceCode: EquivalenceCodes.SEMA12BIAN,
                productHref: PRODUCT_HREF.SEMAGLUTIDE,
                dosage: '(0.25, 0.25, 0.25, 0.25, 0.25, 0.25) mg',
                cadence: 'biannually',
                pharmacyMap: {
                    hallandale: 15,
                    revive: 64,
                },
            },
        },

        {
            //(0.5 mg, 0.5 mg, 0.5 mg, 0.5 mg, 0.5 mg, 0.5 mg) MG Dosing Biannually
            variantIndices: [16, 66],
            equivalence: {
                equivalenceCode: EquivalenceCodes.SEMA13BIAN,
                productHref: PRODUCT_HREF.SEMAGLUTIDE,
                dosage: '(0.5, 0.5, 0.5, 0.5, 0.5, 0.5) mg',
                cadence: 'biannually',
                pharmacyMap: {
                    hallandale: 16,
                    revive: 66,
                },
            },
        },

        {
            //(1.25 mg, 1.25 mg, 1.25 mg, 1.25 mg, 1.25 mg, 1.25 mg) MG Dosing Biannually
            variantIndices: [17],
            equivalence: {
                equivalenceCode: EquivalenceCodes.SEMA14BIAN,
                productHref: PRODUCT_HREF.SEMAGLUTIDE,
                dosage: '(1.25, 1.25, 1.25, 1.25, 1.25, 1.25) mg',
                cadence: 'biannually',
                pharmacyMap: {
                    hallandale: 17,
                },
            },
        },

        {
            //(0.25 mg, 0.5 mg, 0.5 mg, 1 mg, 1 mg, 1 mg) MG Dosing Biannually
            variantIndices: [18, 68],
            equivalence: {
                equivalenceCode: EquivalenceCodes.SEMA15BIAN,
                productHref: PRODUCT_HREF.SEMAGLUTIDE,
                dosage: '(0.25, 0.5, 0.5, 1, 1, 1) mg',
                cadence: 'biannually',
                pharmacyMap: {
                    hallandale: 18,
                    revive: 68,
                },
            },
        },

        {
            //(0.5 mg, 0.5 mg, 1.25 mg, 1.25 mg, 2.5 mg, 2.5 mg) MG Dosing Biannually
            variantIndices: [19, 70],
            equivalence: {
                equivalenceCode: EquivalenceCodes.SEMA16BIAN,
                productHref: PRODUCT_HREF.SEMAGLUTIDE,
                dosage: '(0.5, 0.5, 1.25, 1.25, 2.5, 2.5) mg',
                cadence: 'biannually',
                pharmacyMap: {
                    hallandale: 19,
                    revive: 70,
                },
            },
        },

        {
            //(1.25 mg, 1.25 mg, 1.25 mg, 2.5 mg, 2.5 mg, 2.5 mg) MG Dosing Biannually
            variantIndices: [20, 72],
            equivalence: {
                equivalenceCode: EquivalenceCodes.SEMA17BIAN,
                productHref: PRODUCT_HREF.SEMAGLUTIDE,
                dosage: '(1.25, 1.25, 1.25, 2.5, 2.5, 2.5) mg',
                cadence: 'biannually',
                pharmacyMap: {
                    hallandale: 20,
                    revive: 72,
                },
            },
        },

        {
            //(0.25, 0.5, 1, 1.25, 1.25, 1.25) MG Dosing Biannually
            variantIndices: [74],
            equivalence: {
                equivalenceCode: EquivalenceCodes.SEMA18BIAN,
                productHref: PRODUCT_HREF.SEMAGLUTIDE,
                dosage: '(0.25, 0.5, 1, 1.25, 1.25, 1.25) mg',
                cadence: 'biannually',
                pharmacyMap: {
                    revive: 74,
                },
            },
        },

        /**
         * Annual Offers
         */
        {
            //(0.25, 0.5, 1, 1, 1, 1.25, 1.25, 1.25, 1.25, 1.25, 1.25, 1.25) MG Dosing Annually
            variantIndices: [37],
            equivalence: {
                equivalenceCode: EquivalenceCodes.SEMA18ANN,
                productHref: PRODUCT_HREF.SEMAGLUTIDE,
                dosage: '(0.25, 0.5, 1, 1, 1, 1.25, 1.25, 1.25, 1.25, 1.25, 1.25, 1.25) mg',
                cadence: 'annually',
                pharmacyMap: {
                    hallandale: 37,
                },
            },
        },

        {
            //(0.5, 0.5, 1.25, 1.25, 1.25, 1.25, 1.25, 1.25, 1.25, 1.25, 1.25, 1.25) MG Dosing Annually
            variantIndices: [39],
            equivalence: {
                equivalenceCode: EquivalenceCodes.SEMA19ANN,
                productHref: PRODUCT_HREF.SEMAGLUTIDE,
                dosage: '(0.5, 0.5, 1.25, 1.25, 1.25, 1.25, 1.25, 1.25, 1.25, 1.25, 1.25, 1.25) mg',
                cadence: 'annually',
                pharmacyMap: {
                    hallandale: 39,
                },
            },
        },

        {
            //(1.25, 1.25, 1.25, 1.25, 1.25, 1.25, 1.25, 1.25, 1.25, 1.25, 1.25, 1.25) MG Dosing Annually
            variantIndices: [41],
            equivalence: {
                equivalenceCode: EquivalenceCodes.SEMA20ANN,
                productHref: PRODUCT_HREF.SEMAGLUTIDE,
                dosage: '(1.25, 1.25, 1.25, 1.25, 1.25, 1.25, 1.25, 1.25, 1.25, 1.25, 1.25, 1.25mg) mg',
                cadence: 'annually',
                pharmacyMap: {
                    hallandale: 41,
                },
            },
        },
    ],

    tirzepatide: [
        {
            //2.5 MG Dosing Monthly
            variantIndices: [0, 1, 2, 3, 14, 30, 42],
            equivalence: {
                equivalenceCode: EquivalenceCodes.TIRZ1MO,
                productHref: PRODUCT_HREF.TIRZEPATIDE,
                dosage: '2.5 mg',
                cadence: 'monthly',
                pharmacyMap: {
                    empower: 3,
                    hallandale: 14,
                    boothwyn: 42,
                },
            },
        },
        {
            //5 MG Dosing Monthly
            variantIndices: [4, 31, 43],
            equivalence: {
                equivalenceCode: EquivalenceCodes.TIRZ2MO,
                productHref: PRODUCT_HREF.TIRZEPATIDE,
                dosage: '5 mg',
                cadence: 'monthly',
                pharmacyMap: {
                    empower: 4,
                    boothwyn: 43,
                },
            },
        },

        {
            //7.5 MG Dosing Monthly
            variantIndices: [5, 32, 44],
            equivalence: {
                equivalenceCode: EquivalenceCodes.TIRZ3MO,
                productHref: PRODUCT_HREF.TIRZEPATIDE,
                dosage: '7.5 mg',
                cadence: 'monthly',
                pharmacyMap: {
                    empower: 5,
                    boothwyn: 44,
                },
            },
        },

        {
            //10 MG Dosing Monthly
            variantIndices: [10, 15, 33, 45],
            equivalence: {
                equivalenceCode: EquivalenceCodes.TIRZ4MO,
                productHref: PRODUCT_HREF.TIRZEPATIDE,
                dosage: '10 mg',
                cadence: 'monthly',
                pharmacyMap: {
                    empower: 10,
                    hallandale: 15,
                    boothwyn: 45,
                },
            },
        },

        {
            //12.5 MG Dosing Monthly
            variantIndices: [11, 23, 34, 46],
            equivalence: {
                equivalenceCode: EquivalenceCodes.TIRZ5MO,
                productHref: PRODUCT_HREF.TIRZEPATIDE,
                dosage: '10 mg',
                cadence: 'monthly',
                pharmacyMap: {
                    empower: 11,
                    hallandale: 23,
                    boothwyn: 46,
                },
            },
        },

        /**
         * Quarterly Offers:
         */

        {
            //(2.5, 5, 5) MG Dosing Quarterly
            variantIndices: [6, 7, 16, 35],
            equivalence: {
                equivalenceCode: EquivalenceCodes.TIRZ6QU,
                productHref: PRODUCT_HREF.TIRZEPATIDE,
                dosage: '(2.5, 5, 5) mg',
                cadence: 'monthly',
                pharmacyMap: {
                    empower: 6,
                    hallandale: 16,
                    boothwyn: 35,
                },
            },
        },

        {
            //(5, 5, 5) MG Dosing Quarterly
            variantIndices: [17, 18],
            equivalence: {
                equivalenceCode: EquivalenceCodes.TIRZ7QU,
                productHref: PRODUCT_HREF.TIRZEPATIDE,
                dosage: '(5, 5, 5) mg',
                cadence: 'quarterly',
                pharmacyMap: {
                    hallandale: 17,
                },
            },
        },

        {
            //(5, 5, 7.5) MG Dosing Quarterly
            variantIndices: [19],
            equivalence: {
                equivalenceCode: EquivalenceCodes.TIRZ8QU,
                productHref: PRODUCT_HREF.TIRZEPATIDE,
                dosage: '(5, 5, 7.5) mg',
                cadence: 'quarterly',
                pharmacyMap: {
                    hallandale: 19,
                },
            },
        },

        {
            //(5, 7.5, 7.5) MG Dosing Quarterly
            variantIndices: [8, 36],
            equivalence: {
                equivalenceCode: EquivalenceCodes.TIRZ9QU,
                productHref: PRODUCT_HREF.TIRZEPATIDE,
                dosage: '(5, 7.5, 7.5) mg',
                cadence: 'quarterly',
                pharmacyMap: {
                    empower: 8,
                    boothwyn: 36,
                },
            },
        },

        {
            //(7.5, 7.5, 7.5) MG Dosing Quarterly
            variantIndices: [9, 20, 37],
            equivalence: {
                equivalenceCode: EquivalenceCodes.TIRZ10QU,
                productHref: PRODUCT_HREF.TIRZEPATIDE,
                dosage: '(7.5, 7.5, 7.5) mg',
                cadence: 'quarterly',
                pharmacyMap: {
                    empower: 9,
                    boothwyn: 37,
                },
            },
        },

        {
            //(10, 10, 10) MG Dosing Quarterly
            variantIndices: [12, 28, 21, 38],
            equivalence: {
                equivalenceCode: EquivalenceCodes.TIRZ11QU,
                productHref: PRODUCT_HREF.TIRZEPATIDE,
                dosage: '(10, 10, 10) mg',
                cadence: 'quarterly',
                pharmacyMap: {
                    empower: 28,
                    boothwyn: 38,
                },
            },
        },

        {
            //(12.5, 12.5, 12.5) MG Dosing Quarterly
            variantIndices: [13, 22, 29, 39],
            equivalence: {
                equivalenceCode: EquivalenceCodes.TIRZ12QU,
                productHref: PRODUCT_HREF.TIRZEPATIDE,
                dosage: '(12.5, 12.5, 12.5) mg',
                cadence: 'quarterly',
                pharmacyMap: {
                    empower: 29,
                    boothwyn: 39,
                },
            },
        },

        /**
         * Biannual offers:
         */

        {
            //(2.5, 2.5, 2.5, 2.5, 2.5, 2.5) MG Dosing Biannually
            variantIndices: [24, 57],
            equivalence: {
                equivalenceCode: EquivalenceCodes.TIRZ13BIAN,
                productHref: PRODUCT_HREF.TIRZEPATIDE,
                dosage: '(2.5, 2.5, 2.5, 2.5, 2.5, 2.5) mg',
                cadence: 'biannually',
                pharmacyMap: {
                    hallandale: 24,
                    revive: 57,
                },
            },
        },

        {
            //(10 mg, 10 mg, 10 mg, 10 mg, 10 mg, 10 mg) MG Dosing Biannually
            variantIndices: [25],
            equivalence: {
                equivalenceCode: EquivalenceCodes.TIRZ14BIAN,
                productHref: PRODUCT_HREF.TIRZEPATIDE,
                dosage: '(10, 10, 10, 10, 10, 10) mg',
                cadence: 'biannually',
                pharmacyMap: {
                    hallandale: 25,
                },
            },
        },

        // {
        //     //(2.5 mg, 5 mg, 5 mg, 7.5 mg, 7.5 mg, 7.5 mg) MG Dosing Biannually
        //     variantIndices: [26],
        //     equivalence: {
        //         productHref: PRODUCT_HREF.TIRZEPATIDE,
        //         dosage: '(2.5, 5, 5, 7.5, 7.5, 7.5) mg',
        //         cadence: 'biannually',
        //         pharmacyMap: {
        //             hallandale: 26,
        //         },
        //     },
        // },

        {
            //(2.5 mg, 2.5 mg, 2.5 mg, 5 mg, 5 mg, 5 mg) MG Dosing Biannually
            variantIndices: [26, 27, 59],
            equivalence: {
                equivalenceCode: EquivalenceCodes.TIRZ15BIAN,
                productHref: PRODUCT_HREF.TIRZEPATIDE,
                dosage: '(2.5, 2.5, 2.5, 5, 5, 5) mg',
                cadence: 'biannually',
                pharmacyMap: {
                    hallandale: 27,
                    revive: 59,
                },
            },
        },

        /**
         * Annual Offers:
         */
        {
            //(2.5, 2.5, 2.5, 2.5, 2.5, 2.5, 5, 5, 5, 5, 5, 5) MG Dosing Annually
            variantIndices: [40],
            equivalence: {
                equivalenceCode: EquivalenceCodes.TIRZ16ANN,
                productHref: PRODUCT_HREF.TIRZEPATIDE,
                dosage: '(2.5, 2.5, 2.5, 2.5, 2.5, 2.5, 5, 5, 5, 5, 5, 5) mg',
                cadence: 'annually',
                pharmacyMap: {
                    hallandale: 40,
                },
            },
        },
    ],
    [PRODUCT_HREF.SERMORELIN]: [
        {
            // First Month Sermorelin
            variantIndices: [0],
            equivalence: {
                equivalenceCode: EquivalenceCodes.SERM1MO,
                productHref: PRODUCT_HREF.SERMORELIN,
                dosage: '10 mg',
                cadence: 'monthly',
                pharmacyMap: {
                    boothwyn: 0,
                },
            },
        },
        {
            // Monthly Sermorelin
            variantIndices: [1],
            equivalence: {
                equivalenceCode: EquivalenceCodes.SERM1MO,
                productHref: PRODUCT_HREF.SERMORELIN,
                dosage: '10 mg',
                cadence: 'monthly',
                pharmacyMap: {
                    boothwyn: 1,
                },
            },
        },
        {
            // Quarterly Sermorelin (3 month supply)
            variantIndices: [2],
            equivalence: {
                equivalenceCode: EquivalenceCodes.SERM2QU,
                productHref: PRODUCT_HREF.SERMORELIN,
                dosage: '10 mg x 3',
                cadence: 'quarterly',
                pharmacyMap: {
                    boothwyn: 2,
                },
            },
        },
        {
            // Biannual Sermorelin (6 month supply)
            variantIndices: [3],
            equivalence: {
                equivalenceCode: EquivalenceCodes.SERM3BIAN,
                productHref: PRODUCT_HREF.SERMORELIN,
                dosage: '10 mg x 6',
                cadence: 'biannually',
                pharmacyMap: {
                    boothwyn: 3,
                },
            },
        },
        {
            // A/B Test Biannual Sermorelin (6 month supply) - First Shipment
            variantIndices: [74],
            equivalence: {
                equivalenceCode: EquivalenceCodes.SERM3BIAN,
                productHref: PRODUCT_HREF.SERMORELIN,
                dosage: '10 mg x 6',
                cadence: 'biannually',
                pharmacyMap: {
                    boothwyn: 74,
                },
            },
        },
    ],
};
