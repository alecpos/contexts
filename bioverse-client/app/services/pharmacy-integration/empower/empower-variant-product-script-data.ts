/**
 * @author: Nathan Cho
 *
 * Notes:
 * ** This document is the most recent Empower catalog as of 12/11/2024.
 * ** The goal here was to interface the catalog in a way that maps product_href & variant_index => Script Instruction Array
 *
 * IMPORTANT FOR SEARCHING THIS FILE:
 * You can search for the product/variant-index you want by CMD + F and searching {product_href}-{variant_index}
 * (i.e.) tirzepatide-6 => Tirzepatide variant 6
 */

import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';

export interface EMPOWER_PRODUCT_VARIANT_CATALOG_ARRAY {
    [key: string]: {
        [key: number]: EmpowerVariantSigData;
    };
}

export function getEmpowerCatalogObject(
    productHref: PRODUCT_HREF,
    variantIndex: number
): EmpowerVariantSigData {
    try {
        return EMPOWER_PRODUCT_VARIANT_CATALOG[productHref][variantIndex];
    } catch (error) {
        console.error('Empower Product Variant Map Error: ', error);
        throw error;
    }
}

export const EMPOWER_UNITS_PER_MG_MAP = {
    [PRODUCT_HREF.SEMAGLUTIDE as PRODUCT_HREF]: {
        'S-1-1': 100,
        'S-5-2.5': 20,
        'S-1-2.5': 100,
        'S-5-1': 20,
    },
    [PRODUCT_HREF.TIRZEPATIDE as PRODUCT_HREF]: {
        'T-8-2.5': 12, 
        'T-17-2': 5.9,
        'T-17-4': 5.9,
    },
}

const EMPOWER_PRODUCT_VARIANT_CATALOG: EMPOWER_PRODUCT_VARIANT_CATALOG_ARRAY = {
    /**
     * SEMAGLUTIDE ============================================================================================================================
     */

    semaglutide: {
        0: {
            //semaglutide-0
            selectDisplayName:
                '[1-month] Semaglutide 1 mg total (0.25 mg dosing) [$289]',
            array: [
                {
                    catalogItemCode: 'S-1-1',
                    sigText:
                        'Inject 25 units (0.25 mg of semaglutide) subcutaneously once a week for four weeks',
                    internalSigText:
                        'Inject 25 units (0.25 mg of semaglutide) subcutaneously once a week for four weeks',
                    quantity: 1,
                    daysSupply: 28,
                },
                {
                    catalogItemCode: 'syringe-swab',
                    sigText: 'Use as Directed',
                    internalSigText: 'Use as Directed',
                    quantity: 10,
                    daysSupply: 28,
                },
            ],
        },

        1: {
            //semaglutide-1
            selectDisplayName:
                '[1-month] Semaglutide 2.5 mg total (2.5 mg dosing) [$449]',
            array: [
                {
                    catalogItemCode: 'S-5-2.5',
                    sigText:
                        'Inject 50 units (2.5 mg of semaglutide)  subcutaneously once a week for four weeks',
                    internalSigText:
                        'Inject 50 units (2.5 mg of semaglutide)  subcutaneously once a week for four weeks',
                    quantity: 1,
                    daysSupply: 28,
                },
                {
                    catalogItemCode: 'syringe-swab',
                    sigText: 'Use as Directed',
                    internalSigText: 'Use as Directed',
                    quantity: 10,
                    daysSupply: 28,
                },
            ],
        },

        2: {
            //semaglutide-2
            selectDisplayName:
                '[1-month] Semaglutide 1 mg total (0.25 mg dosing) [$289]',
            array: [
                {
                    catalogItemCode: 'S-1-1',
                    sigText:
                        'Inject 25 units (0.25 mg of semaglutide) subcutaneously once a week for four weeks',
                    internalSigText:
                        'Inject 25 units (0.25 mg of semaglutide) subcutaneously once a week for four weeks',
                    quantity: 1,
                    daysSupply: 28,
                },
                {
                    catalogItemCode: 'syringe-swab',
                    sigText: 'Use as Directed',
                    internalSigText: 'Use as Directed',
                    quantity: 10,
                    daysSupply: 28,
                },
            ],
        },

        3: {
            //semaglutide-3
            selectDisplayName:
                '[1-month] Semaglutide 2.5 mg total (0.5 mg dosing) [$289]',
            array: [
                {
                    catalogItemCode: 'S-1-2.5',
                    sigText:
                        'Inject 50 units (0.5 mg of semaglutide) subcutaneously once a week for four weeks',
                    internalSigText:
                        'Inject 50 units (0.5 mg of semaglutide) subcutaneously once a week for four weeks',
                    quantity: 1,
                    daysSupply: 28,
                },
                {
                    catalogItemCode: 'syringe-swab',
                    sigText: 'Use as Directed',
                    internalSigText: 'Use as Directed',
                    quantity: 10,
                    daysSupply: 28,
                },
            ],
        },

        4: {
            //semaglutide-4
            selectDisplayName:
                '[1-month] Semaglutide 5 mg total (1.25 mg dosing) [$289]',
            array: [
                {
                    catalogItemCode: 'S-5-1',
                    sigText:
                        'Inject 25 units (1.25 mg of semaglutide) subcutaneously once a week for four weeks',
                    internalSigText:
                        'Inject 25 units (1.25 mg of semaglutide) subcutaneously once a week for four weeks',
                    quantity: 1,
                    daysSupply: 28,
                },
                {
                    catalogItemCode: 'syringe-swab',
                    sigText: 'Use as Directed',
                    internalSigText: 'Use as Directed',
                    quantity: 10,
                    daysSupply: 28,
                },
            ],
        },

        5: {
            //semaglutide-5
            selectDisplayName:
                '[1-month] Semaglutide 12.5 mg total (2.5 mg dosing) [$449]',
            array: [
                {
                    catalogItemCode: 'S-5-2.5',
                    sigText:
                        'Inject 50 units (2.5 mg of semaglutide)  subcutaneously once a week for four weeks',
                    internalSigText:
                        'Inject 50 units (2.5 mg of semaglutide)  subcutaneously once a week for four weeks',
                    quantity: 1,
                    daysSupply: 28,
                },
                {
                    catalogItemCode: 'syringe-swab',
                    sigText: 'Use as Directed',
                    internalSigText: 'Use as Directed',
                    quantity: 10,
                    daysSupply: 28,
                },
            ],
        },

        6: {
            //semaglutide-6
            selectDisplayName:
                '[Bundle] Semaglutide 8.5 mg total (0.25mg, 0.5mg, 1.25mg dosing) [$477.15]',
            array: [
                {
                    catalogItemCode: 'S-1-1',
                    sigText:
                        'Month 1 Inject 25 units (0.25 mg of semaglutide) subcutaneously once per week for weeks 1-4',
                    internalSigText:
                        'Month 1 Inject 25 units (0.25 mg of semaglutide) subcutaneously once per week for weeks 1-4',
                    quantity: 1,
                    daysSupply: 28,
                },
                {
                    catalogItemCode: 'S-1-2.5',
                    sigText:
                        'Month 2 Inject 50 units (0.5 mg of semaglutide) subcutaneously once per week for weeks 5-8',
                    internalSigText:
                        'Month 2 Inject 50 units (0.5 mg of semaglutide) subcutaneously once per week for weeks 5-8',
                    quantity: 1,
                    daysSupply: 28,
                },
                {
                    catalogItemCode: 'S-5-1',
                    sigText:
                        'Month 3 Inject 25 units (1.25 mg of semaglutide) subcutaneously once per week for weeks 9-12',
                    internalSigText:
                        'Month 3 Inject 25 units (1.25 mg of semaglutide) subcutaneously once per week for weeks 9-12',
                    quantity: 1,
                    daysSupply: 28,
                },
                {
                    catalogItemCode: 'syringe-swab',
                    sigText: 'Use as Directed',
                    internalSigText: 'Use as Directed',
                    quantity: 20,
                    daysSupply: 84,
                },
            ],
        },

        7: {
            //semaglutide-7
            selectDisplayName:
                '[Bundle] Semaglutide 15 mg total (1.25mg dosing or as directed by provider) [$603.72]',
            array: [
                {
                    catalogItemCode: 'S-5-1',
                    sigText:
                        'Months 1-3 Inject 25 units (1.25 mg of semaglutide) subcutaneously once per week for weeks 1-12 or as directed by your provider',
                    internalSigText:
                        'Months 1-3 Inject 25 units (1.25 mg of semaglutide) subcutaneously once per week for weeks 1-12 or as directed by your provider',
                    quantity: 3,
                    daysSupply: 84,
                },
                {
                    catalogItemCode: 'syringe-swab',
                    sigText: 'Use as Directed',
                    internalSigText: 'Use as Directed',
                    quantity: 20,
                    daysSupply: 84,
                },
            ],
        },

        8: {
            //semaglutide-8
            selectDisplayName:
                '[Bundle] Semaglutide 20 mg total (0.5mg, 1.25mg, 2.5mg dosing) [$808.92]',
            array: [
                {
                    catalogItemCode: 'S-1-2.5',
                    sigText:
                        'Month 1 Inject 50 units (0.5 mg of semaglutide) subcutaneously once per week for weeks 1-4',
                    internalSigText:
                        'Month 1 Inject 50 units (0.5 mg of semaglutide) subcutaneously once per week for weeks 1-4',
                    quantity: 1,
                    daysSupply: 28,
                },
                {
                    catalogItemCode: 'S-5-1',
                    sigText:
                        'Month 2 Inject 25 units (1.25 mg of semaglutide) subcutaneously once per week for weeks 5-8',
                    internalSigText:
                        'Month 2 Inject 25 units (1.25 mg of semaglutide) subcutaneously once per week for weeks 5-8',
                    quantity: 1,
                    daysSupply: 28,
                },
                {
                    catalogItemCode: 'S-5-2.5',
                    sigText:
                        'Month 3 Inject 50 units (2.5 mg of semaglutide) subcutaneously once per week for weeks 9-12',
                    internalSigText:
                        'Month 3 Inject 50 units (2.5 mg of semaglutide) subcutaneously once per week for weeks 9-12',
                    quantity: 1,
                    daysSupply: 28,
                },
                {
                    catalogItemCode: 'syringe-swab',
                    sigText: 'Use as Directed',
                    internalSigText: 'Use as Directed',
                    quantity: 20,
                    daysSupply: 84,
                },
            ],
        },

        9: {
            //semaglutide-9
            selectDisplayName:
                '[Bundle] Semaglutide 30 mg total (1.25mg, 2.5mg, 2.5mg dosing) [$916.92]',
            array: [
                {
                    catalogItemCode: 'S-5-1',
                    sigText:
                        'Month 1 Inject 25 units (1.25 mg of semaglutide) subcutaneously once per week for weeks 1-4',
                    internalSigText:
                        'Month 1 Inject 25 units (1.25 mg of semaglutide) subcutaneously once per week for weeks 1-4',
                    quantity: 1,
                    daysSupply: 28,
                },
                {
                    catalogItemCode: 'S-5-2.5',
                    sigText:
                        'Months 2-3 Inject 50 units (2.5 mg of semaglutide) subcutaneously once per week for weeks 5-12',
                    internalSigText:
                        'Months 2-3 Inject 50 units (2.5 mg of semaglutide) subcutaneously once per week for weeks 5-12',
                    quantity: 2,
                    daysSupply: 28,
                },
                {
                    catalogItemCode: 'syringe-swab',
                    sigText: 'Use as Directed',
                    internalSigText: 'Use as Directed',
                    quantity: 20,
                    daysSupply: 84,
                },
            ],
        },

        10: {
            //semaglutide-10
            selectDisplayName:
                '[Bundle] Semaglutide 37.5 mg total (2.5mg dosing or as directed by your provider) [$1024.92]',
            array: [
                {
                    catalogItemCode: 'S-5-2.5',
                    sigText:
                        'Months 1-3 Inject 50 units (2.5 mg of semaglutide) subcutaneously once per week for weeks 1-12 or as directed by your provider',
                    internalSigText:
                        'Months 1-3 Inject 50 units (2.5 mg of semaglutide) subcutaneously once per week for weeks 1-12 or as directed by your provider',
                    quantity: 3,
                    daysSupply: 84,
                },
                {
                    catalogItemCode: 'syringe-swab',
                    sigText: 'Use as Directed',
                    internalSigText: 'Use as Directed',
                    quantity: 20,
                    daysSupply: 84,
                },
            ],
        },
        21: {
            //semaglutide-21
            selectDisplayName:
                '[Bundle] Semaglutide 22.5 mg total (1.25mg, 1.25mg, 2.5mg) [$849]',
            array: [
                {
                    catalogItemCode: 'S-5-1',
                    sigText:
                        'Month 1-2 (Weeks 1-8) Inject 25 units (1.25mg) subcutaneously once per week for weeks 1-8',
                    internalSigText:
                        'Month 1-2 (Weeks 1-8) Inject 25 units (1.25mg) subcutaneously once per week for weeks 1-8',
                    quantity: 2,
                    daysSupply: 84,
                },
                {
                    catalogItemCode: 'S-5-2.5',
                    sigText:
                        'Month 3 (Weeks 9-12) Inject 50 units (2.5mg) subcutaneously once per week for 4 weeks',
                    internalSigText:
                        'Month 3 (Weeks 9-12) Inject 50 units (2.5mg) subcutaneously once per week for 4 weeks',
                    quantity: 1,
                    daysSupply: 84,
                },
                {
                    catalogItemCode: 'syringe-swab',
                    sigText: 'Use as Directed',
                    internalSigText: 'Use as Directed',
                    quantity: 20,
                    daysSupply: 84,
                },
            ],
        },
    },

    /**
     * TIRZEPATIDE ============================================================================================================================
     */
    tirzepatide: {
        0: {
            //tirzepatide-0
            selectDisplayName:
                '[1-month] Tirzepartide 20 mg total (2.5 mg dosing) [$449]',
            array: [
                {
                    catalogItemCode: 'T-8-2.5',
                    sigText:
                        'Inject 31 units (2.5 mg of tirzepatide) subcutaneously once a week for four weeks',
                    internalSigText:
                        'Inject 31 units (2.5 mg of tirzepatide) subcutaneously once a week for four weeks',
                    quantity: 1,
                    daysSupply: 28,
                },
                {
                    catalogItemCode: 'syringe-swab',
                    sigText: 'Use as Directed',
                    internalSigText: 'Use as Directed',
                    quantity: 10,
                    daysSupply: 28,
                },
            ],
        },

        3: {
            //tirzepatide-3
            selectDisplayName:
                '[1-month] Tirzepartide 20 mg total (2.5 mg dosing) [$449]',
            array: [
                {
                    catalogItemCode: 'T-8-2.5',
                    sigText:
                        'Inject 31 units (2.5 mg of tirzepatide) subcutaneously once a week for four weeks',
                    internalSigText:
                        'Inject 31 units (2.5 mg of tirzepatide) subcutaneously once a week for four weeks',
                    quantity: 1,
                    daysSupply: 28,
                },
                {
                    catalogItemCode: 'syringe-swab',
                    sigText: 'Use as Directed',
                    internalSigText: 'Use as Directed',
                    quantity: 10,
                    daysSupply: 28,
                },
            ],
        },

        4: {
            //tirzepatide-4
            selectDisplayName:
                '[1-month] Tirzepartide 20 mg total (5 mg dosing) [$449]',
            array: [
                {
                    catalogItemCode: 'T-8-2.5',
                    sigText:
                        'Inject 62 units (5 mg of tirzepatide) subcutaneously once a week for four weeks',
                    internalSigText:
                        'Inject 62 units (5 mg of tirzepatide) subcutaneously once a week for four weeks',
                    quantity: 1,
                    daysSupply: 28,
                },
                {
                    catalogItemCode: 'syringe-swab',
                    sigText: 'Use as Directed',
                    internalSigText: 'Use as Directed',
                    quantity: 10,
                    daysSupply: 28,
                },
            ],
        },

        5: {
            //tirzepatide-5
            selectDisplayName:
                '[1-month] Tirzepartide 34 mg total (7.5 mg dosing) [$449]',
            array: [
                {
                    catalogItemCode: 'T-17-2',
                    sigText:
                        'Inject 44 units (7.5 mg of tirzepatide) subcutaneously once a week for four weeks',
                    internalSigText:
                        'Inject 44 units (7.5 mg of tirzepatide) subcutaneously once a week for four weeks',
                    quantity: 1,
                    daysSupply: 28,
                },
                {
                    catalogItemCode: 'syringe-swab',
                    internalSigText: 'Use as Directed',
                    sigText: 'Use as Directed',
                    quantity: 10,
                    daysSupply: 28,
                },
            ],
        },

        6: {
            //tirzepatide-6
            selectDisplayName:
                '[Bundle] Tirzepatide 60 mg total (2.5mg, 5mg dosing) [$702]',
            array: [
                {
                    catalogItemCode: 'T-8-2.5',
                    sigText:
                        'Month 1 Inject 31 units (2.5 mg of tirzepatide) subcutaneously once per week for weeks 1-4',
                    internalSigText:
                        'Month 1 Inject 31 units (2.5 mg of tirzepatide) subcutaneously once per week for weeks 1-4',
                    quantity: 1,
                    daysSupply: 28,
                },
                {
                    catalogItemCode: 'T-8-2.5',
                    sigText:
                        'Month 2-3 Inject 63 units (5mg of tirzepatide) subcutaneously once per week for weeks 5-12',
                    internalSigText:
                        'Month 2-3 Inject 63 units (5mg of tirzepatide) subcutaneously once per week for weeks 5-12',
                    quantity: 2,
                    daysSupply: 56,
                },
                {
                    catalogItemCode: 'syringe-swab',
                    sigText: 'Use as Directed',
                    internalSigText: 'Use as Directed',
                    quantity: 20,
                    daysSupply: 84,
                },
            ],
        },

        7: {
            //tirzepatide-7
            selectDisplayName:
                '[Bundle] Tirzepatide 60 mg total (2.5mg dosing and check in for further instructions) [$702]',
            array: [
                {
                    catalogItemCode: 'T-8-2.5',
                    sigText:
                        'Month 1 Inject 31 units (2.5 mg of tirzepatide) subcutaneously once per week for weeks 1-4',
                    internalSigText:
                        'Month 1 Inject 31 units (2.5 mg of tirzepatide) subcutaneously once per week for weeks 1-4',
                    quantity: 1,
                    daysSupply: 28,
                },
                {
                    catalogItemCode: 'T-8-2.5',
                    sigText:
                        'Months 2-3 Inject 31 units ( 2.5 mg of tirzepatide) subcutaneously once per week for weeks 5-12 or check-in with your provider for further instructions',
                    internalSigText:
                        'Months 2-3 Inject 31 units ( 2.5 mg of tirzepatide) subcutaneously once per week for weeks 5-12 or check-in with your provider for further instructions',
                    quantity: 2,
                    daysSupply: 56,
                },
                {
                    catalogItemCode: 'syringe-swab',
                    sigText: 'Use as Directed',
                    internalSigText: 'Use as Directed',
                    quantity: 20,
                    daysSupply: 84,
                },
            ],
        },

        8: {
            //tirzepatide-8
            selectDisplayName:
                '[Bundle] Tirzepatide 88 mg total (5mg dosing and check in for further instructions) [$1186.92]',
            array: [
                {
                    catalogItemCode: 'T-8-2.5',
                    sigText:
                        'Month 1 (Weeks 1-4) Inject 63 units (5 mg) subcutaneously once per week for 4 weeks',
                    internalSigText:
                        'Month 1 (Weeks 1-4) Inject 63 units (5 mg) subcutaneously once per week for 4 weeks',
                    quantity: 1,
                    daysSupply: 28,
                },
                {
                    catalogItemCode: 'T-17-2',
                    sigText:
                        'Month 2-3 (Weeks 5-12) Inject 44 units (7.5 mg) subcutaneously once per week for weeks 5-12',
                    internalSigText:
                        'Month 2-3 (Weeks 5-12) Inject 44 units (7.5 mg) subcutaneously once per week for weeks 5-12',
                    quantity: 2,
                    daysSupply: 56,
                },
                {
                    catalogItemCode: 'syringe-swab',
                    sigText: 'Use as Directed',
                    internalSigText: 'Use as Directed',
                    quantity: 20,
                    daysSupply: 84,
                },
            ],
        },

        9: {
            //tirzepatide-9
            selectDisplayName:
                '[Bundle] Tirzepatide 102 mg total (7.5mg, 7.5mg, 7.5mg dosing) [$1399.00]',
            array: [
                {
                    catalogItemCode: 'T-17-2',
                    sigText:
                        'Months 1-3 Inject 44 units (7.5 mg of tirzepatide) subcutaneously once per week for weeks 1-12',
                    internalSigText:
                        'Months 1-3 Inject 44 units (7.5 mg of tirzepatide) subcutaneously once per week for weeks 1-12',
                    quantity: 3,
                    daysSupply: 84,
                },
                {
                    catalogItemCode: 'syringe-swab',
                    sigText: 'Use as Directed',
                    internalSigText: 'Use as Directed',
                    quantity: 20,
                    daysSupply: 84,
                },
            ],
        },

        10: {
            //tirzepatide-10
            selectDisplayName:
                '[1-month] Trizepatide 54 mg total (10 mg dosing) [$799]',
            array: [
                {
                    catalogItemCode: 'T-8-2.5',
                    sigText:
                        'Inject 125 units (10 mg of tirzepatide) subcutaneously once a week for weeks 1-2',
                    internalSigText:
                        'Inject 125 units (10 mg of tirzepatide) subcutaneously once a week for weeks 1-2',
                    quantity: 1,
                    daysSupply: 14,
                },
                {
                    catalogItemCode: 'T-17-2',
                    sigText:
                        'Inject 59 units (10 mg of tirzepatide) subcutaneously once a week for weeks 3-4',
                    internalSigText:
                        'Inject 59 units (10 mg of tirzepatide) subcutaneously once a week for weeks 3-4',
                    quantity: 1,
                    daysSupply: 14,
                },
                {
                    catalogItemCode: 'syringe-swab',
                    internalSigText: 'Use as Directed',
                    sigText: 'Use as Directed',
                    quantity: 10,
                    daysSupply: 28,
                },
            ],
        },

        11: {
            //tirzepatide-11
            // tirzepatide var 11, index 8
            selectDisplayName:
                '[1-month] Trizepatide 54 mg total (12.5 mg dosing) [$799]',
            array: [
                {
                    catalogItemCode: 'T-8-2.5',
                    sigText:
                        'Inject 156 units (12.5 mg of tirzepatide) subcutaneously once a week for one week (week 1)',
                    internalSigText:
                        'Inject 156 units (12.5 mg of tirzepatide) subcutaneously once a week for one week (week 1)',
                    quantity: 1,
                    daysSupply: 14,
                },
                {
                    catalogItemCode: 'T-17-2',
                    sigText:
                        'Inject 74 units (12.5 mg of tirzepatide) subcutaneously once a week for weeks  2-4',
                    internalSigText:
                        'Inject 74 units (12.5 mg of tirzepatide) subcutaneously once a week for weeks  2-4',
                    quantity: 1,
                    daysSupply: 14,
                },
                {
                    catalogItemCode: 'syringe-swab',
                    internalSigText: 'Use as Directed',
                    sigText: 'Use as Directed',
                    quantity: 10,
                    daysSupply: 28,
                },
            ],
        },

        12: {
            //tirzepatide-12
            selectDisplayName:
                '[Bundle] Trizepatide 120 mg total (10 mg dosing) [$1599.00]',
            array: [
                {
                    catalogItemCode: 'T-17-4',
                    sigText:
                        'Inject 59 units or 0.59 ML (10 mg) subcutaneously once per week for 12 weeks',
                    internalSigText:
                        'Inject 59 units or 0.59 ML (10 mg) subcutaneously once per week for 12 weeks',
                    quantity: 2,
                    daysSupply: 84,
                },
                {
                    catalogItemCode: 'syringe-swab',
                    sigText: 'Use as Directed',
                    internalSigText: 'Use as Directed',
                    quantity: 20,
                    daysSupply: 84,
                },
            ],
        },

        13: {
            //tirzepatide-13
            selectDisplayName:
                '[Bundle] Trizepatide 150 mg total (12.5 mg dosing) [$2299]',
            array: [
                {
                    catalogItemCode: 'T-17-2',
                    sigText:
                        'Inject 74 units (12.5 mg) subcutaneously once per week for weeks 1-4',

                    internalSigText:
                        'Inject 74 units (12.5 mg) subcutaneously once per week for weeks 1-4',
                    quantity: 1,
                    daysSupply: 28,
                },
                {
                    catalogItemCode: 'T-17-4',
                    sigText:
                        'Inject 74 units (12.5 mg) subcutaneously once per week for weeks 5-12',

                    internalSigText:
                        'Inject 74 units (12.5 mg) subcutaneously once per week for weeks 5-12',
                    quantity: 2,
                    daysSupply: 56,
                },
                {
                    catalogItemCode: 'syringe-swab',
                    sigText: 'Use as Directed',
                    internalSigText: 'Use as Directed',
                    quantity: 20,
                    daysSupply: 84,
                },
            ],
        },

        28: {
            //tirzepatide-28
            selectDisplayName:
                '[Bundle] Tirzepatide 136 mg total (10 mg dosing) [$1599]',
            array: [
                {
                    catalogItemCode: 'T-17-4',
                    sigText:
                        'Inject 59 units (10 mg) subcutaneously once per week for 12 weeks',
                    internalSigText:
                        'Inject 59 units (10 mg) subcutaneously once per week for 12 weeks',
                    quantity: 2,
                    daysSupply: 84,
                },
                {
                    catalogItemCode: 'syringe-swab',
                    sigText: 'Use as Directed',
                    internalSigText: 'Use as Directed',
                    quantity: 20,
                    daysSupply: 84,
                },
            ],
        },

        29: {
            //tirzepatide-29
            selectDisplayName:
                '[Bundle] Tirzepatide 170 mg total (12.5 mg dosing) [$1999]',
            array: [
                {
                    catalogItemCode: 'T-17-2',
                    sigText:
                        'Inject 74 units (12.5 mg) subcutaneously once per week for 12 weeks',
                    internalSigText:
                        'Inject 74 units (12.5 mg) subcutaneously once per week for 12 weeks',
                    quantity: 1,
                    daysSupply: 84,
                },
                {
                    catalogItemCode: 'T-17-4',
                    sigText:
                        'Inject 74 units (12.5 mg) subcutaneously once per week for 12 weeks',
                    internalSigText:
                        'Inject 74 units (12.5 mg) subcutaneously once per week for 12 weeks',
                    quantity: 2,
                    daysSupply: 84,
                },
                {
                    catalogItemCode: 'syringe-swab',
                    sigText: 'Use as Directed',
                    internalSigText: 'Use as Directed',
                    quantity: 20,
                    daysSupply: 84,
                },
            ],
        },
    },

    /**
     * WL Capsules ============================================================================================================================
     */
    'wl-capsule': {
        0: {
            //wl-capsule-0
            selectDisplayName:
                'BIOVERSE Weight Loss Capsules (Burproprion HCL / Naltrexone HCL / Topiramate) [$75.00]',
            array: [
                {
                    catalogItemCode: 'BELLA-5',
                    sigText: 'Take 1 capsule by mouth daily',
                    internalSigText: 'Take 1 capsule by mouth daily',
                    quantity: 30,
                    daysSupply: 30,
                },
            ],
        },
        1: {
            //wl-capsule-1
            selectDisplayName:
                'BIOVERSE Weight Loss Capsules (Burproprion HCL / Naltrexone HCL / Topiramate) [$199.00]',
            array: [
                {
                    catalogItemCode: 'BELLA-5',
                    sigText: 'Take 1 capsule by mouth daily',
                    internalSigText: 'Take 1 capsule by mouth daily',
                    quantity: 90,
                    daysSupply: 90,
                },
            ],
        },
    },

    /**
     * ED: PEAK CHEWS ============================================================================================================================
     */

    // {
    //     //peak-chews-0
    //     selectDisplayName: 'DISPLAYNAME',
    //     array: [
    //         {
    //             catalogItemCode: 'CATALOGCODE',
    //             sigText: 'SIGTEXT',
    //             internalSigText: 'ISIGTEXT',
    //             quantity: 1000,
    //             daysSupply: 1000,
    //         },
    //     ],
    // },

    'peak-chews': {
        0: {
            //peak-chews-0
            selectDisplayName:
                '[monthly] Peak Chews (Tadalafil RTD 8.5 mg - Daily)',
            array: [
                {
                    catalogItemCode: 'tadalafil-odt-8.5',
                    sigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    internalSigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    quantity: 30,
                    daysSupply: 30,
                },
            ],
        },
        1: {
            //peak-chews-1
            selectDisplayName:
                '[quarterly] Peak Chews (Tadalafil RTD 8.5 mg - Daily)',
            array: [
                {
                    catalogItemCode: 'tadalafil-odt-8.5',
                    sigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    internalSigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    quantity: 90,
                    daysSupply: 90,
                },
            ],
        },
        2: {
            //peak-chews-2
            selectDisplayName:
                '[biannually] Peak Chews (Tadalafil RTD 8.5 mg - Daily)',
            array: [
                {
                    catalogItemCode: 'tadalafil-odt-8.5',
                    sigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    internalSigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    quantity: 180,
                    daysSupply: 180,
                },
            ],
        },

        3: {
            //peak-chews-3
            selectDisplayName:
                '[quarterly] Peak Chews (Tadalafil RTD 8.5 mg - 6 ct / month)',
            array: [
                {
                    catalogItemCode: 'tadalafil-odt-8.5',
                    sigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    internalSigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    quantity: 18,
                    daysSupply: 90,
                },
            ],
        },

        4: {
            //peak-chews-4
            selectDisplayName:
                '[biannually] Peak Chews (Tadalafil RTD 8.5 mg - 6 ct / month)',
            array: [
                {
                    catalogItemCode: 'tadalafil-odt-8.5',
                    sigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    internalSigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    quantity: 36,
                    daysSupply: 180,
                },
            ],
        },

        5: {
            //peak-chews-5
            selectDisplayName:
                '[quarterly] Peak Chews (Tadalafil RTD 8.5 mg - 8 ct / month)',
            array: [
                {
                    catalogItemCode: 'tadalafil-odt-8.5',
                    sigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    internalSigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    quantity: 24,
                    daysSupply: 90,
                },
            ],
        },

        6: {
            //peak-chews-6
            selectDisplayName:
                '[biannually] Peak Chews (Tadalafil RTD 8.5 mg - 8 ct / month)',
            array: [
                {
                    catalogItemCode: 'tadalafil-odt-8.5',
                    sigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    internalSigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    quantity: 48,
                    daysSupply: 180,
                },
            ],
        },

        7: {
            //peak-chews-7
            selectDisplayName:
                '[monthly] Peak Chews (Tadalafil RTD 8.5 mg - 10 ct / month)',
            array: [
                {
                    catalogItemCode: 'tadalafil-odt-8.5',
                    sigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    internalSigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    quantity: 10,
                    daysSupply: 30,
                },
            ],
        },

        8: {
            //peak-chews-8
            selectDisplayName:
                '[quarterly] Peak Chews (Tadalafil RTD 8.5 mg - 10 ct / month)',
            array: [
                {
                    catalogItemCode: 'tadalafil-odt-8.5',
                    sigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    internalSigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    quantity: 30,
                    daysSupply: 90,
                },
            ],
        },

        9: {
            //peak-chews-9
            selectDisplayName:
                '[biannually] Peak Chews (Tadalafil RTD 8.5 mg - 10 ct / month)',
            array: [
                {
                    catalogItemCode: 'tadalafil-odt-8.5',
                    sigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    internalSigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    quantity: 60,
                    daysSupply: 180,
                },
            ],
        },

        10: {
            //peak-chews-10
            selectDisplayName:
                '[monthly] Peak Chews (Tadalafil RTD 8.5 mg - 12 ct / month)',
            array: [
                {
                    catalogItemCode: 'tadalafil-odt-8.5',
                    sigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    internalSigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    quantity: 12,
                    daysSupply: 30,
                },
            ],
        },

        11: {
            //peak-chews-11
            selectDisplayName:
                '[quarterly] Peak Chews (Tadalafil RTD 8.5 mg - 12 ct / month)',
            array: [
                {
                    catalogItemCode: 'tadalafil-odt-8.5',
                    sigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    internalSigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    quantity: 36,
                    daysSupply: 90,
                },
            ],
        },

        12: {
            //peak-chews-12
            selectDisplayName:
                '[biannually] Peak Chews (Tadalafil RTD 8.5 mg - 12 ct / month)',
            array: [
                {
                    catalogItemCode: 'tadalafil-odt-8.5',
                    sigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    internalSigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    quantity: 72,
                    daysSupply: 180,
                },
            ],
        },

        13: {
            //peak-chews-13
            selectDisplayName:
                '[monthly] Peak Chews (Tadalafil RTD 8.5 mg - 14 ct / month)',
            array: [
                {
                    catalogItemCode: 'tadalafil-odt-8.5',
                    sigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    internalSigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    quantity: 14,
                    daysSupply: 30,
                },
            ],
        },

        14: {
            //peak-chews-14
            selectDisplayName:
                '[quarterly] Peak Chews (Tadalafil RTD 8.5 mg - 14 ct / month)',
            array: [
                {
                    catalogItemCode: 'tadalafil-odt-8.5',
                    sigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    internalSigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    quantity: 42,
                    daysSupply: 90,
                },
            ],
        },

        15: {
            //peak-chews-15
            selectDisplayName:
                '[biannually] Peak Chews (Tadalafil RTD 8.5 mg - 14 ct / month)',
            array: [
                {
                    catalogItemCode: 'tadalafil-odt-8.5',
                    sigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    internalSigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    quantity: 84,
                    daysSupply: 180,
                },
            ],
        },

        16: {
            //peak-chews-16
            selectDisplayName:
                '[monthly] Peak Chews (Tadalafil RTD 8.5 mg - 16 ct / month)',
            array: [
                {
                    catalogItemCode: 'tadalafil-odt-8.5',
                    sigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    internalSigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    quantity: 16,
                    daysSupply: 30,
                },
            ],
        },

        17: {
            //peak-chews-17
            selectDisplayName:
                '[quarterly] Peak Chews (Tadalafil RTD 8.5 mg - 16 ct / month)',
            array: [
                {
                    catalogItemCode: 'tadalafil-odt-8.5',
                    sigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    internalSigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    quantity: 48,
                    daysSupply: 90,
                },
            ],
        },

        18: {
            //peak-chews-18
            selectDisplayName:
                '[biannually] Peak Chews (Tadalafil RTD 8.5 mg - 16 ct / month)',
            array: [
                {
                    catalogItemCode: 'tadalafil-odt-8.5',
                    sigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    internalSigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    quantity: 96,
                    daysSupply: 180,
                },
            ],
        },

        /**
         * Peak Chews variant indices 19 - 36 were removed from catalog as they are not set to be selected at all.
         */

        37: {
            //peak-chews-37
            selectDisplayName:
                '[quarterly] Peak Chews (Tadalafil RTD 8.5 mg - 4 ct / month)',
            array: [
                {
                    catalogItemCode: 'tadalafil-odt-8.5',
                    sigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    internalSigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    quantity: 48,
                    daysSupply: 90,
                },
            ],
        },

        38: {
            //peak-chews-38
            selectDisplayName:
                '[biannually] Peak Chews (Tadalafil RTD 8.5 mg - 4 ct / month)',
            array: [
                {
                    catalogItemCode: 'tadalafil-odt-8.5',
                    sigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    internalSigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    quantity: 96,
                    daysSupply: 180,
                },
            ],
        },
    },

    /**
     * ED: RUSH CHEWS ============================================================================================================================
     */
    'rush-chews': {
        0: {
            //rush-chews-0
            selectDisplayName:
                '[monthly] Rush Chews (Sildenafil RTD 36 mg - Daily)',
            array: [
                {
                    catalogItemCode: 'sildenafil-odt-36',
                    sigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    internalSigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    quantity: 30,
                    daysSupply: 30,
                },
            ],
        },
        1: {
            //rush-chews-1
            selectDisplayName:
                '[quarterly] Rush Chews (Sildenafil RTD 36 mg - Daily)',
            array: [
                {
                    catalogItemCode: 'sildenafil-odt-36',
                    sigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    internalSigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    quantity: 90,
                    daysSupply: 90,
                },
            ],
        },
        2: {
            //rush-chews-2
            selectDisplayName:
                '[biannually] Rush Chews (Sildenafil RTD 36 mg - Daily)',
            array: [
                {
                    catalogItemCode: 'sildenafil-odt-36',
                    sigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    internalSigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    quantity: 180,
                    daysSupply: 180,
                },
            ],
        },

        3: {
            //rush-chews-3
            selectDisplayName:
                '[monthly] Rush Chews (Sildenafil RTD 60 mg - Daily)',
            array: [
                {
                    catalogItemCode: 'sildenafil-odt-60',
                    sigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    internalSigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    quantity: 30,
                    daysSupply: 30,
                },
            ],
        },
        4: {
            //rush-chews-4
            selectDisplayName:
                '[quarterly] Rush Chews (Sildenafil RTD 60 mg - Daily)',
            array: [
                {
                    catalogItemCode: 'sildenafil-odt-60',
                    sigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    internalSigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    quantity: 90,
                    daysSupply: 90,
                },
            ],
        },
        5: {
            //rush-chews-5
            selectDisplayName:
                '[biannually] Rush Chews (Sildenafil RTD 60 mg - Daily)',
            array: [
                {
                    catalogItemCode: 'sildenafil-odt-60',
                    sigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    internalSigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    quantity: 180,
                    daysSupply: 180,
                },
            ],
        },

        /**
         * 36 mg as-needed
         */

        6: {
            //rush-chews-6
            selectDisplayName:
                '[quarterly] Rush Chews (Sildenafil RTD 36 mg - As-Needed - 6 ct / month)',
            array: [
                {
                    catalogItemCode: 'sildenafil-odt-36',
                    sigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    internalSigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    quantity: 18,
                    daysSupply: 90,
                },
            ],
        },
        7: {
            //rush-chews-7
            selectDisplayName:
                '[biannually] Rush Chews (Sildenafil RTD 36 mg - As-Needed - 6 ct / month)',
            array: [
                {
                    catalogItemCode: 'sildenafil-odt-36',
                    sigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    internalSigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    quantity: 36,
                    daysSupply: 180,
                },
            ],
        },

        8: {
            //rush-chews-8
            selectDisplayName:
                '[quarterly] Rush Chews (Sildenafil RTD 36 mg - As-Needed - 8 ct / month)',
            array: [
                {
                    catalogItemCode: 'sildenafil-odt-36',
                    sigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    internalSigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    quantity: 24,
                    daysSupply: 90,
                },
            ],
        },
        9: {
            //rush-chews-9
            selectDisplayName:
                '[biannually] Rush Chews (Sildenafil RTD 36 mg - As-Needed - 8 ct / month)',
            array: [
                {
                    catalogItemCode: 'sildenafil-odt-36',
                    sigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    internalSigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    quantity: 48,
                    daysSupply: 180,
                },
            ],
        },

        10: {
            //rush-chews-10
            selectDisplayName:
                '[quarterly] Rush Chews (Sildenafil RTD 36 mg - As-Needed - 10 ct / month)',
            array: [
                {
                    catalogItemCode: 'sildenafil-odt-36',
                    sigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    internalSigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    quantity: 30,
                    daysSupply: 90,
                },
            ],
        },
        11: {
            //rush-chews-11
            selectDisplayName:
                '[biannually] Rush Chews (Sildenafil RTD 36 mg - As-Needed - 10 ct / month)',
            array: [
                {
                    catalogItemCode: 'sildenafil-odt-36',
                    sigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    internalSigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    quantity: 60,
                    daysSupply: 180,
                },
            ],
        },

        12: {
            //rush-chews-12
            selectDisplayName:
                '[quarterly] Rush Chews (Sildenafil RTD 36 mg - As-Needed - 12 ct / month)',
            array: [
                {
                    catalogItemCode: 'sildenafil-odt-36',
                    sigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    internalSigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    quantity: 36,
                    daysSupply: 90,
                },
            ],
        },
        13: {
            //rush-chews-13
            selectDisplayName:
                '[biannually] Rush Chews (Sildenafil RTD 36 mg - As-Needed - 12 ct / month)',
            array: [
                {
                    catalogItemCode: 'sildenafil-odt-36',
                    sigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    internalSigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    quantity: 72,
                    daysSupply: 180,
                },
            ],
        },

        14: {
            //rush-chews-14
            selectDisplayName:
                '[quarterly] Rush Chews (Sildenafil RTD 36 mg - As-Needed - 14 ct / month)',
            array: [
                {
                    catalogItemCode: 'sildenafil-odt-36',
                    sigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    internalSigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    quantity: 42,
                    daysSupply: 90,
                },
            ],
        },
        15: {
            //rush-chews-15
            selectDisplayName:
                '[biannually] Rush Chews (Sildenafil RTD 36 mg - As-Needed - 14 ct / month)',
            array: [
                {
                    catalogItemCode: 'sildenafil-odt-36',
                    sigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    internalSigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    quantity: 84,
                    daysSupply: 180,
                },
            ],
        },

        16: {
            //rush-chews-16
            selectDisplayName:
                '[quarterly] Rush Chews (Sildenafil RTD 36 mg - As-Needed - 16 ct / month)',
            array: [
                {
                    catalogItemCode: 'sildenafil-odt-36',
                    sigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    internalSigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    quantity: 48,
                    daysSupply: 90,
                },
            ],
        },
        17: {
            //rush-chews-17
            selectDisplayName:
                '[biannually] Rush Chews (Sildenafil RTD 36 mg - As-Needed - 16 ct / month)',
            array: [
                {
                    catalogItemCode: 'sildenafil-odt-36',
                    sigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    internalSigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    quantity: 96,
                    daysSupply: 180,
                },
            ],
        },

        /**
         * 60 mg as-needed below.
         */

        18: {
            //rush-chews-18
            selectDisplayName:
                '[quarterly] Rush Chews (Sildenafil RTD 60 mg - 4 ct / month)',
            array: [
                {
                    catalogItemCode: 'sildenafil-odt-60',
                    sigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    internalSigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    quantity: 12,
                    daysSupply: 90,
                },
            ],
        },
        19: {
            //rush-chews-19
            selectDisplayName:
                '[biannually] Rush Chews (Sildenafil RTD 60 mg - 4 ct / month)',
            array: [
                {
                    catalogItemCode: 'sildenafil-odt-60',
                    sigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    internalSigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    quantity: 24,
                    daysSupply: 180,
                },
            ],
        },

        20: {
            //rush-chews-20
            selectDisplayName:
                '[quarterly] Rush Chews (Sildenafil RTD 60 mg - 6 ct / month)',
            array: [
                {
                    catalogItemCode: 'sildenafil-odt-60',
                    sigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    internalSigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    quantity: 18,
                    daysSupply: 90,
                },
            ],
        },

        21: {
            //rush-chews-21
            selectDisplayName:
                '[biannually] Rush Chews (Sildenafil RTD 60 mg - 6 ct / month)',
            array: [
                {
                    catalogItemCode: 'sildenafil-odt-60',
                    sigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    internalSigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    quantity: 36,
                    daysSupply: 180,
                },
            ],
        },

        22: {
            //rush-chews-22
            selectDisplayName:
                '[quarterly] Rush Chews (Sildenafil RTD 60 mg - 8 ct / month)',
            array: [
                {
                    catalogItemCode: 'sildenafil-odt-60',
                    sigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    internalSigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    quantity: 24,
                    daysSupply: 90,
                },
            ],
        },
        23: {
            //rush-chews-23
            selectDisplayName:
                '[biannually] Rush Chews (Sildenafil RTD 60 mg - 8 ct / month)',
            array: [
                {
                    catalogItemCode: 'sildenafil-odt-60',
                    sigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    internalSigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    quantity: 48,
                    daysSupply: 180,
                },
            ],
        },

        24: {
            //rush-chews-24
            selectDisplayName:
                '[quarterly] Rush Chews (Sildenafil RTD 60 mg - 10 ct / month)',
            array: [
                {
                    catalogItemCode: 'sildenafil-odt-60',
                    sigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    internalSigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    quantity: 30,
                    daysSupply: 90,
                },
            ],
        },
        25: {
            //rush-chews-25
            selectDisplayName:
                '[biannually] Rush Chews (Sildenafil RTD 60 mg - 10 ct / month)',
            array: [
                {
                    catalogItemCode: 'sildenafil-odt-60',
                    sigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    internalSigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    quantity: 60,
                    daysSupply: 180,
                },
            ],
        },

        26: {
            //rush-chews-26
            selectDisplayName:
                '[quarterly] Rush Chews (Sildenafil RTD 60 mg - 12 ct / month)',
            array: [
                {
                    catalogItemCode: 'sildenafil-odt-60',
                    sigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    internalSigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    quantity: 36,
                    daysSupply: 90,
                },
            ],
        },
        27: {
            //rush-chews-27
            selectDisplayName:
                '[biannually] Rush Chews (Sildenafil RTD 60 mg - 12 ct / month)',
            array: [
                {
                    catalogItemCode: 'sildenafil-odt-60',
                    sigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    internalSigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    quantity: 72,
                    daysSupply: 180,
                },
            ],
        },

        28: {
            //rush-chews-28
            selectDisplayName:
                '[quarterly] Rush Chews (Sildenafil RTD 60 mg - 14 ct / month)',
            array: [
                {
                    catalogItemCode: 'sildenafil-odt-60',
                    sigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    internalSigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    quantity: 42,
                    daysSupply: 90,
                },
            ],
        },
        29: {
            //rush-chews-29
            selectDisplayName:
                '[biannually] Rush Chews (Sildenafil RTD 60 mg - 14 ct / month)',
            array: [
                {
                    catalogItemCode: 'sildenafil-odt-60',
                    sigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    internalSigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    quantity: 84,
                    daysSupply: 180,
                },
            ],
        },

        30: {
            //rush-chews-30
            selectDisplayName:
                '[quarterly] Rush Chews (Sildenafil RTD 60 mg - 16 ct / month)',
            array: [
                {
                    catalogItemCode: 'sildenafil-odt-60',
                    sigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    internalSigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    quantity: 48,
                    daysSupply: 90,
                },
            ],
        },
        31: {
            //rush-chews-31
            selectDisplayName:
                '[biannually] Rush Chews (Sildenafil RTD 60 mg - 16 ct / month)',
            array: [
                {
                    catalogItemCode: 'sildenafil-odt-60',
                    sigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    internalSigText:
                        'Dissolve 1 tablet under tongue at least 15 minutes before sexual activity (maximum of 1 ODT per day).',
                    quantity: 96,
                    daysSupply: 180,
                },
            ],
        },
    },

    /**
     * NAD NASAL SPRAY ============================================================================================================================
     */
    'nad-nasal-spray': {
        0: {
            //nad-nasal-spray-0
            selectDisplayName: 'NAD+ Nasal Spray 300 mg/mL (15 mL)',
            array: [
                {
                    catalogItemCode: 'nad-nasal-spray',
                    sigText:
                        'Administer 1-2 sprays in each nostril once or twice daily.',
                    internalSigText:
                        'Administer 1-2 sprays in each nostril once or twice daily.',
                    quantity: 1,
                    daysSupply: 28,
                },
            ],
        },
    },
};
