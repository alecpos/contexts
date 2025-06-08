/**
 * @author: Nathan Cho
 *
 * Notes:
 * ** This document is the most recent Hallandale catalog as of 12/11/2024.
 * ** The goal here was to interface the catalog in a way that maps product_href & variant_index => Script Instruction Array
 *
 * IMPORTANT FOR SEARCHING THIS FILE:
 * You can search for the product/variant-index you want by CMD + F and searching {product_href}-{variant_index}
 * (i.e.) tirzepatide-6 => Tirzepatide variant 6
 */

import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';

export interface HALLANDALE_PRODUCT_VARIANT_CATALOG_ARRAY {
    [key: string]: {
        [key: number]: HallandaleVariantSigData;
    };
}

export function getHallandaleCatalogObject(
    productHref: PRODUCT_HREF,
    variantIndex: number
) {
    try {
        return HALLANDALE_PRODUCT_VARIANT_CATALOG[productHref][variantIndex];
    } catch (error) {
        console.error('Empower Product Variant Map Error: ', error);
        throw error;
    }
}

export const HALLANDALE_UNITS_PER_MG_MAP = {
    [PRODUCT_HREF.SEMAGLUTIDE as PRODUCT_HREF]: {
        'S-5': 40,
        'S-3': 40,
        'S-2': 40,
        'S-1': 40,
    },
    [PRODUCT_HREF.TIRZEPATIDE as PRODUCT_HREF]: {
        'T-1': 10,
        'T-2': 10,
        'T-3': 10,
        'T-4': 10,
        'T-5': 10,
    },
}

const HALLANDALE_PRODUCT_VARIANT_CATALOG: HALLANDALE_PRODUCT_VARIANT_CATALOG_ARRAY =
    {
        /**
         * SEMAGLUTIDE ============================================================================================================================
         */
        semaglutide: {
            11: {
                //semaglutide-11
                selectDisplayName:
                    '[3-month] Semaglutide 7.5 mg (0.5 mg dosing) [$477.15]',
                array: [
                    {
                        catalogItemCode: 'S-3',
                        sigText:
                            'Month 1 Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for weeks 1-4' +
                            'Month 2 Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for weeks 5-8' +
                            'Month 3 Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for weeks 9-12',
                        internalSigText:
                            'Month 1 Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for weeks 1-4' +
                            'Month 2 Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for weeks 5-8' +
                            'Month 3 Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for weeks 9-12',
                        internalDisplaySigText: [
                            'Month 1 Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for weeks 1-4',
                            'Month 2 Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for weeks 5-8',
                            'Month 3 Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for weeks 9-12',
                        ],
                        quantity: 1,
                        daysSupply: 90,
                    },
                    {
                        catalogItemCode: 'GLP-INJECTION-KIT',
                        sigText:
                            'Month 1 Inject 10 units (0.5 mg of semaglutide) subcutaneously once per week for weeks 1-4 ' +
                            'Month 2 Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for weeks 5-8 ' +
                            'Month 3 Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for weeks 9-12 ',
                        internalSigText:
                            'Month 1 Inject 10 units (0.5 mg of semaglutide) subcutaneously once per week for weeks 1-4 ' +
                            'Month 2 Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for weeks 5-8 ' +
                            'Month 3 Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for weeks 9-12',
                        quantity: 2, //patients need one syringe per injection, 4 injections per week, there are 10 syringes per injection kit. They need 12 syringes for a 3 month supply, so two kits (20 syringes) are needed.
                        daysSupply: 90,
                    },
                ],
            },

            12: {
                //semaglutide-12
                selectDisplayName:
                    '[3-month] Semaglutide 10 mg (0.25 mg, 0.5 mg, 1.25 mg dosing) [$477.15]',
                array: [
                    {
                        catalogItemCode: 'S-2',
                        sigText:
                            'Month 1 Inject 10 units (0.25 mg of semaglutide) subcutaneously once per week for weeks 1-4, ' +
                            'Month 2 Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for weeks 5-8, ' +
                            'Month 3 Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for weeks 9-12',
                        internalSigText:
                            'Month 1 Inject 10 units (0.25 mg of semaglutide) subcutaneously once per week for weeks 1-4,' +
                            'Month 2 Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for weeks 5-8, ' +
                            'Month 3 Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for weeks 9-12',

                        internalDisplaySigText: [
                            'Month 1 Inject 10 units (0.25 mg of semaglutide) subcutaneously once per week for weeks 1-4,',
                            'Month 2 Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for weeks 5-8',
                            'Month 3 Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for weeks 9-12',
                        ],
                        quantity: 2,
                        daysSupply: 90,
                    },
                    {
                        catalogItemCode: 'GLP-INJECTION-KIT',
                        sigText:
                            'Month 1 Inject 10 units (0.25 mg of semaglutide) subcutaneously once per week for weeks 1-4, ' +
                            'Month 2 Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for weeks 5-8, ' +
                            'Month 3 Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for weeks 9-12',
                        internalSigText:
                            'Month 1 Inject 10 units (0.25 mg of semaglutide) subcutaneously once per week for weeks 1-4, ' +
                            'Month 2 Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for weeks 5-8, ' +
                            'Month 3 Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for weeks 9-12',
                        internalDisplaySigText: [
                            'Month 1 Inject 10 units (0.25 mg of semaglutide) subcutaneously once per week for weeks 1-4,',
                            'Month 2 Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for weeks 5-8',
                            'Month 3 Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for weeks 9-12',
                        ],
                        quantity: 2,
                        daysSupply: 90,
                    },
                ],
            },

            13: {
                //semaglutide-13
                selectDisplayName: '[Monthly] Semaglutide 2.5 mg [$289]',
                array: [
                    {
                        catalogItemCode: 'S-1',
                        sigText:
                            'Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for 4 weeks',
                        internalSigText:
                            'Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for 4 weeks',
                        quantity: 1,
                        daysSupply: 30,
                    },
                    {
                        catalogItemCode: 'GLP-INJECTION-KIT',
                        sigText:
                            'Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for 4 weeks',
                        internalSigText:
                            'Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for 4 weeks',
                        quantity: 1,
                        daysSupply: 30,
                    },
                ],
            },

            14: {
                //semaglutide-14
                selectDisplayName: '[Monthly] Semaglutide 5 mg [$289]',
                array: [
                    {
                        catalogItemCode: 'S-2',
                        sigText:
                            'Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for 4 weeks',
                        internalSigText:
                            'Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for 4 weeks',
                        quantity: 1,
                        daysSupply: 30,
                    },
                    {
                        catalogItemCode: 'GLP-INJECTION-KIT',
                        sigText:
                            'Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for 4 weeks',
                        internalSigText:
                            'Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for 4 weeks',
                        quantity: 1,
                        daysSupply: 30,
                    },
                ],
            },

            15: {
                //semaglutide-15
                selectDisplayName:
                    '[6-month] Semaglutide 7.5 mg (0.25 mg, 0.25 mg, 0.25 mg, 0.25 mg, 0.25 mg, 0.25 mg dosing) [$834]',
                array: [
                    {
                        catalogItemCode: 'S-1',
                        sigText:
                            'Month 1-6: Inject 10 units (0.25 mg of semaglutide) subcutaneously once per week',
                        internalSigText:
                            'Month 1-6: Inject 10 units (0.25 mg of semaglutide) subcutaneously once per week',
                        quantity: 1,
                        daysSupply: 180,
                    },
                    {
                        catalogItemCode: 'S-2',
                        sigText:
                            'Month 1-6: Inject 10 units (0.25 mg of semaglutide) subcutaneously once per week',
                        internalSigText:
                            'Month 1-6: Inject 10 units (0.25 mg of semaglutide) subcutaneously once per week',
                        quantity: 1,
                        daysSupply: 180,
                    },
                    {
                        catalogItemCode: 'GLP-INJECTION-KIT',
                        sigText:
                            'Month 1-6: Inject 10 units (0.25 mg of semaglutide) subcutaneously once per week',
                        internalSigText:
                            'Month 1-6: Inject 10 units (0.25 mg of semaglutide) subcutaneously once per week',
                        quantity: 3,
                        daysSupply: 180,
                    },
                ],
            },

            16: {
                //semaglutide-16
                selectDisplayName:
                    '[6-month] Semaglutide 15 mg (0.5 mg, 0.5 mg, 0.5 mg, 0.5 mg, 0.5 mg, 0.5 mg dosing) [$894]',
                array: [
                    {
                        catalogItemCode: 'S-2',
                        sigText:
                            'Month 1-6:  Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week',
                        internalSigText:
                            'Month 1-6:  Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week',
                        quantity: 3,
                        daysSupply: 180,
                    },
                    {
                        catalogItemCode: 'GLP-INJECTION-KIT',
                        sigText:
                            'Month 1-6:  Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week',
                        internalSigText:
                            'Month 1-6:  Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week',
                        quantity: 3,
                        daysSupply: 180,
                    },
                ],
            },

            //There is no semaglutide product variant 17 as of Jan 8, 2025

            18: {
                //semaglutide-18
                selectDisplayName:
                    '[6-month] Semaglutide 17.5 mg (0.25 mg, 0.5 mg, 0.5 mg, 1 mg, 1 mg, 1 mg dosing) [$774]',
                array: [
                    {
                        catalogItemCode: 'S-2',
                        sigText:
                            'Month 1: Inject 10 units (0.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 2-3: Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for 8 weeks, ' +
                            'Month 3-6: Inject 40 units (1 mg of semaglutide) subcutaneously once per week',
                        internalSigText:
                            'Month 1: Inject 10 units (0.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 2-3: Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for 8 weeks, ' +
                            'Month 3-6: Inject 40 units (1 mg of semaglutide) subcutaneously once per week',
                        quantity: 1,
                        daysSupply: 180,
                    },
                    {
                        catalogItemCode: 'S-5',
                        sigText:
                            'Month 1: Inject 10 units (0.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 2-3: Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for 8 weeks, ' +
                            'Month 3-6: Inject 40 units (1 mg of semaglutide) subcutaneously once per week',
                        internalSigText:
                            'Month 1: Inject 10 units (0.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 2-3: Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for 8 weeks, ' +
                            'Month 3-6: Inject 40 units (1 mg of semaglutide) subcutaneously once per week',
                        quantity: 1,
                        daysSupply: 180,
                    },
                    {
                        catalogItemCode: 'GLP-INJECTION-KIT',
                        sigText:
                            'Month 1: Inject 10 units (0.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 2-3: Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for 8 weeks, ' +
                            'Month 3-6: Inject 40 units (1 mg of semaglutide) subcutaneously once per week',
                        internalSigText:
                            'Month 1: Inject 10 units (0.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 2-3: Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for 8 weeks, ' +
                            'Month 3-6: Inject 40 units (1 mg of semaglutide) subcutaneously once per week',
                        quantity: 3,
                        daysSupply: 180,
                    },
                ],
            },

            19: {
                //semaglutide-19
                selectDisplayName:
                    '[6-month] Semaglutide 37.5 mg (0.5 mg, 0.5 mg, 1.25 mg, 1.25 mg, 2.5 mg, 2.5 mg dosing) [$1494]',
                array: [
                    {
                        catalogItemCode: 'S-5',
                        sigText:
                            'Month 1-2: Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 2-4: Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 4-6: Inject 100 units (2.5 mg of semaglutide) subcutaneously once per week ',
                        internalSigText:
                            'Month 1-2: Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 2-4: Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 4-6: Inject 100 units (2.5 mg of semaglutide) subcutaneously once per week ',
                        quantity: 3,
                        daysSupply: 180,
                    },
                    {
                        catalogItemCode: 'GLP-INJECTION-KIT',
                        sigText:
                            'Month 1-2: Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 2-4: Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 4-6: Inject 100 units (2.5 mg of semaglutide) subcutaneously once per week ',
                        internalSigText:
                            'Month 1-2: Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 2-4: Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 4-6: Inject 100 units (2.5 mg of semaglutide) subcutaneously once per week ',
                        quantity: 3,
                        daysSupply: 180,
                    },
                ],
            },

            20: {
                //semaglutide-20
                selectDisplayName:
                    '[6-month] Semaglutide 50 mg (1.25 mg, 1.25 mg, 1.25 mg, 2.5 mg, 2.5 mg, 2.5 mg dosing) [$1674]',
                array: [
                    {
                        catalogItemCode: 'S-5',
                        sigText:
                            'Month 1-3: Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 3-6: Inject 100 units (2.5 mg of semaglutide) subcutaneously once per week for 12 weeks',
                        internalSigText:
                            'Month 1-3: Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 3-6: Inject 100 units (2.5 mg of semaglutide) subcutaneously once per week for 12 weeks',
                        quantity: 4,
                        daysSupply: 180,
                    },
                    {
                        catalogItemCode: 'GLP-INJECTION-KIT',
                        sigText:
                            'Month 1-3: Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 3-6: Inject 100 units (2.5 mg of semaglutide) subcutaneously once per week for 12 weeks',
                        internalSigText:
                            'Month 1-3: Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 3-6: Inject 100 units (2.5 mg of semaglutide) subcutaneously once per week for 12 weeks',
                        quantity: 3,
                        daysSupply: 180,
                    },
                ],
            },

            37: {
                //semaglutide-37
                selectDisplayName:
                    '[12-month] Semaglutide 50 mg (0.25 mg, 0.5 mg, 1 mg x 3 months, 1.25 mg x 7 months) [$1980] (Shipment 1 of 2)',
                array: [
                    {
                        catalogItemCode: 'S-5',
                        sigText:
                            'Month 1: Inject 10 units (0.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 2: Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 3: Inject 40 units (1 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 4: Inject 40 units (1 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 5: Inject 40 units (1 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 6: Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week',
                        internalSigText:
                            'Month 1: Inject 10 units (0.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 2: Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 3: Inject 40 units (1 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 4: Inject 40 units (1 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 5: Inject 40 units (1 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 6: Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week',
                        quantity: 2,
                        daysSupply: 180,
                    },
                    {
                        catalogItemCode: 'GLP-INJECTION-KIT',
                        sigText:
                            'Month 1: Inject 10 units (0.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 2: Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 3: Inject 40 units (1 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 4: Inject 40 units (1 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 5: Inject 40 units (1 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 6: Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week',
                        internalSigText:
                            'Month 1: Inject 10 units (0.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 2: Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 3: Inject 40 units (1 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 4: Inject 40 units (1 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 5: Inject 40 units (1 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 6: Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week',
                        quantity: 3,
                        daysSupply: 180,
                    },
                ],
            },
            38: {
                //semaglutide-38
                selectDisplayName:
                    '[12-month] Semaglutide 50 mg (0.25 mg, 0.5 mg, 1 mg x 3 months, 1.25 mg x 7 months) [$1980] (Shipment 2 of 2)',
                array: [
                    {
                        catalogItemCode: 'S-5',
                        sigText:
                            'Month 7: Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 8: Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 9: Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 10: Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week ' +
                            'Month 11: Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week ' +
                            'Month 12: Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week',
                        internalSigText:
                            'Month 7: Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 8: Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 9: Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 10: Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week ' +
                            'Month 11: Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week ' +
                            'Month 12: Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week',
                        quantity: 2,
                        daysSupply: 180,
                    },
                    {
                        catalogItemCode: 'GLP-INJECTION-KIT',
                        sigText:
                            'Month 7: Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 8: Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 9: Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 10: Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week ' +
                            'Month 11: Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week ' +
                            'Month 12: Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week',
                        internalSigText:
                            'Month 7: Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 8: Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 9: Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 10: Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week ' +
                            'Month 11: Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week ' +
                            'Month 12: Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week',
                        quantity: 3,
                        daysSupply: 180,
                    },
                ],
            },

            39: {
                //semaglutide-39
                selectDisplayName:
                    '[12-month] Semaglutide 55 mg (0.5 mg, 0.5 mg, 1.25 mg x 10 months) [$1980] (Shipment 1 of 2)',
                array: [
                    {
                        catalogItemCode: 'S-5',
                        sigText:
                            'Month 1: Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 2: Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 3:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 4:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 5:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 6:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week',
                        internalSigText:
                            'Month 1: Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 2: Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 3:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 4:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 5:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 6:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week',
                        quantity: 2,
                        daysSupply: 180,
                    },
                    {
                        catalogItemCode: 'S-2',
                        sigText:
                            'Month 1: Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 2: Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 3:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 4:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 5:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 6:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week',
                        internalSigText:
                            'Month 1: Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 2: Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 3:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 4:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 5:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 6:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week',
                        quantity: 1,
                        daysSupply: 180,
                    },
                    {
                        catalogItemCode: 'GLP-INJECTION-KIT',
                        sigText:
                            'Month 1: Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 2: Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 3:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 4:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 5:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 6:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week',
                        internalSigText:
                            'Month 1: Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 2: Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 3:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 4:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 5:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 6:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week',
                        quantity: 3,
                        daysSupply: 180,
                    },
                ],
            },
            40: {
                //semaglutide-40
                selectDisplayName:
                    '[12-month] Semaglutide 55 mg (0.5 mg, 0.5 mg, 1.25 mg x 10 months) [$1980] (Shipment 2 of 2)',
                array: [
                    {
                        catalogItemCode: 'S-5',
                        sigText:
                            'Month 7:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 8:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 9:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 10: Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 11: Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 12: Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week',
                        internalSigText:
                            'Month 7:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 8:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 9:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 10: Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 11: Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 12: Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week',
                        quantity: 2,
                        daysSupply: 180,
                    },
                    {
                        catalogItemCode: 'GLP-INJECTION-KIT',
                        sigText:
                            'Month 7:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 8:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 9:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 10: Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 11: Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 12: Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week',
                        internalSigText:
                            'Month 7:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 8:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 9:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 10: Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 11: Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 12: Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week',
                        quantity: 3,
                        daysSupply: 180,
                    },
                ],
            },

            41: {
                //semaglutide-41
                selectDisplayName:
                    '[12-month] Semaglutide 60 mg (1.25 mg x 12 months) [$2148] (Shipment 1 of 2)',
                array: [
                    {
                        catalogItemCode: 'S-5',
                        sigText:
                            'Month 1:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 2:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 3:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 4:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 5:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 6: Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week',
                        internalSigText:
                            'Month 1:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 2:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 3:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 4:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 5:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 6: Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week',
                        quantity: 3,
                        daysSupply: 180,
                    },
                    {
                        catalogItemCode: 'GLP-INJECTION-KIT',
                        sigText:
                            'Month 1:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 2:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 3:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 4:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 5:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 6: Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week',
                        internalSigText:
                            'Month 1:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 2:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 3:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 4:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 5:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 6: Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week',
                        quantity: 3,
                        daysSupply: 180,
                    },
                ],
            },
            42: {
                //semaglutide-42
                selectDisplayName:
                    '[12-month] Semaglutide 60 mg (1.25 mg x 12 months) [$2148] (Shipment 2 of 2)',
                array: [
                    {
                        catalogItemCode: 'S-5',
                        sigText:
                            'Month 7:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 8:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 9:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 10:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 11:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 12: Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week, ',
                        internalSigText:
                            'Month 7:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 8:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 9:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 10:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 11:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 12: Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week, ',
                        quantity: 2,
                        daysSupply: 180,
                    },
                    {
                        catalogItemCode: 'GLP-INJECTION-KIT',
                        sigText:
                            'Month 7:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 8:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 9:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 10:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 11:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 12: Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week, ',
                        internalSigText:
                            'Month 7:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 8:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 9:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 10:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 11:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week, ' +
                            'Month 12: Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week, ',
                        quantity: 3,
                        daysSupply: 180,
                    },
                ],
            },

            43: {
                //semaglutide-43
                selectDisplayName:
                    '[3-month] Semaglutide 20 mg (1.25 mg, 1.25 mg, 2.5 mg dosing) [$849]',
                array: [
                    {
                        catalogItemCode: 'S-2',
                        sigText:
                            'Month 1: Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for 4 weeks ' +
                            'Month 2: Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for 4 weeks ' +
                            'Month 3: Inject 100 units (2.5 mg of semaglutide) subcutaneously once per week for 4 weeks',
                        internalSigText:
                            'Month 1: Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for 4 weeks ' +
                            'Month 2: Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for 4 weeks ' +
                            'Month 3: Inject 100 units (2.5 mg of semaglutide) subcutaneously once per week for 4 weeks',
                        quantity: 2,
                        daysSupply: 84,
                    },
                    {
                        catalogItemCode: 'S-5',
                        sigText:
                            'Month 1: Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for 4 weeks ' +
                            'Month 2: Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for 4 weeks ' +
                            'Month 3: Inject 100 units (2.5 mg of semaglutide) subcutaneously once per week for 4 weeks',
                        internalSigText:
                            'Month 1: Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for 4 weeks ' +
                            'Month 2: Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for 4 weeks ' +
                            'Month 3: Inject 100 units (2.5 mg of semaglutide) subcutaneously once per week for 4 weeks',
                        quantity: 1,
                        daysSupply: 84,
                    },
                    {
                        catalogItemCode: 'GLP-INJECTION-KIT',
                        sigText:
                            'Month 1: Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for 4 weeks ' +
                            'Month 2: Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for 4 weeks ' +
                            'Month 3: Inject 100 units (2.5 mg of semaglutide) subcutaneously once per week for 4 weeks',
                        internalSigText:
                            'Month 1: Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for 4 weeks ' +
                            'Month 2: Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for 4 weeks ' +
                            'Month 3: Inject 100 units (2.5 mg of semaglutide) subcutaneously once per week for 4 weeks',
                        quantity: 3,
                        daysSupply: 84,
                    },
                ],
            },

            44: {
                //semaglutide-44
                selectDisplayName:
                    '[3-month] Semaglutide 25 mg (1.25 mg, 2.5 mg, 2.5 mg dosing) [$916.92]',
                array: [
                    {
                        catalogItemCode: 'S-5',
                        sigText:
                            'Month 1: Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for 4 weeks ' +
                            'Month 2: Inject 100 units (2.5 mg of semaglutide) subcutaneously once per week for 4 weeks ' +
                            'Month 3: Inject 100 units (2.5 mg of semaglutide) subcutaneously once per week for 4 weeks',
                        internalSigText:
                            'Month 1: Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for 4 weeks ' +
                            'Month 2: Inject 100 units (2.5 mg of semaglutide) subcutaneously once per week for 4 weeks ' +
                            'Month 3: Inject 100 units (2.5 mg of semaglutide) subcutaneously once per week for 4 weeks',
                        quantity: 2,
                        daysSupply: 84,
                    },
                    {
                        catalogItemCode: 'GLP-INJECTION-KIT',
                        sigText:
                            'Month 1: Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for 4 weeks ' +
                            'Month 2: Inject 100 units (2.5 mg of semaglutide) subcutaneously once per week for 4 weeks ' +
                            'Month 3: Inject 100 units (2.5 mg of semaglutide) subcutaneously once per week for 4 weeks',
                        internalSigText:
                            'Month 1: Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for 4 weeks ' +
                            'Month 2: Inject 100 units (2.5 mg of semaglutide) subcutaneously once per week for 4 weeks ' +
                            'Month 3: Inject 100 units (2.5 mg of semaglutide) subcutaneously once per week for 4 weeks',
                        quantity: 3,
                        daysSupply: 84,
                    },
                ],
            },
        },

        /**
         * TIRZEPATIDE ============================================================================================================================
         */
        tirzepatide: {
            14: {
                //tirzepatide-14
                selectDisplayName: '[Monthly] Tirzepatide 10 mg [$729]',
                array: [
                    {
                        catalogItemCode: 'T-1',
                        sigText:
                            'Inject 25 units (2.5 mg of Tirzepatide) subcutaneously once per week for 4 weeks',
                        internalSigText:
                            'Inject 25 units (2.5 mg of Tirzepatide) subcutaneously once per week for 4 weeks',
                        quantity: 1,
                        daysSupply: 30,
                    },
                    {
                        catalogItemCode: 'GLP-INJECTION-KIT',
                        sigText:
                            'Inject 25 units (2.5 mg of Tirzepatide) subcutaneously once per week for 4 weeks',
                        internalSigText:
                            'Inject 25 units (2.5 mg of Tirzepatide) subcutaneously once per week for 4 weeks',
                        quantity: 1,
                        daysSupply: 30,
                    },
                ],
            },

            15: {
                //tirzepatide-15
                selectDisplayName: '[Monthly] Tirzepatide 40 mg [$729]',
                array: [
                    {
                        catalogItemCode: 'T-2',
                        sigText:
                            'Inject 100 units (10 mg of Tirzepatide) subcutaneously once per week for 4 weeks',
                        internalSigText:
                            'Inject 100 units (10 mg of Tirzepatide) subcutaneously once per week for 4 weeks',
                        quantity: 2,
                        daysSupply: 30,
                    },
                    {
                        catalogItemCode: 'GLP-INJECTION-KIT',
                        sigText:
                            'Inject 100 units (10 mg of Tirzepatide) subcutaneously once per week for 4 weeks',
                        internalSigText:
                            'Inject 100 units (10 mg of Tirzepatide) subcutaneously once per week for 4 weeks',
                        quantity: 1,
                        daysSupply: 30,
                    },
                ],
            },

            16: {
                //tirzepatide-16
                selectDisplayName: '[Bundle] Tirzepatide 50 mg [$702]',
                array: [
                    {
                        catalogItemCode: 'T-5',
                        sigText:
                            'Month 1 Inject 25 units (2.5 mg of tirzepatide) subcutaneously once per week for weeks 1-4 ' +
                            'Month 2 Inject 50 units (5 mg of tirzepatide) subcutaneously once per week for weeks 5-8 ' +
                            'Month 3 Inject 50 units (5 mg of tirzepatide) subcutaneously once per week for weeks 9-12',
                        internalSigText:
                            'Month 1 Inject 25 units (2.5 mg of tirzepatide) subcutaneously once per week for weeks 1-4 ' +
                            'Month 2 Inject 50 units (5 mg of tirzepatide) subcutaneously once per week for weeks 5-8 ' +
                            'Month 3 Inject 50 units (5 mg of tirzepatide) subcutaneously once per week for weeks 9-12',
                        internalDisplaySigText: [
                            'Month 1 Inject 25 units (2.5 mg of tirzepatide) subcutaneously once per week for weeks 1-4 ',
                            'Month 2 Inject 50 units (5 mg of tirzepatide) subcutaneously once per week for weeks 5-8',
                            'Month 3 Inject 50 units (5 mg of tirzepatide) subcutaneously once per week for weeks 9-12',
                        ],
                        quantity: 1,
                        daysSupply: 90,
                    },
                    {
                        catalogItemCode: 'GLP-INJECTION-KIT',
                        sigText:
                            'Month 1 Inject 25 units (2.5 mg of tirzepatide) subcutaneously once per week for weeks 1-4 ' +
                            'Month 2 Inject 50 units (5 mg of tirzepatide) subcutaneously once per week for weeks 5-8 ' +
                            'Month 3 Inject 50 units (5 mg of tirzepatide) subcutaneously once per week for weeks 9-12',
                        internalSigText:
                            'Month 1 Inject 25 units (2.5 mg of tirzepatide) subcutaneously once per week for weeks 1-4 ' +
                            'Month 2 Inject 50 units (5 mg of tirzepatide) subcutaneously once per week for weeks 5-8 ' +
                            'Month 3 Inject 50 units (5 mg of tirzepatide) subcutaneously once per week for weeks 9-12',
                        quantity: 2,
                        daysSupply: 90,
                    },
                ],
            },

            17: {
                //tirzepatide-17
                selectDisplayName:
                    '[Bundle] Tirzepatide 60 mg (Maintenance) [$777]',
                array: [
                    {
                        catalogItemCode: 'T-3',
                        sigText:
                            'Month 1 Inject 50 units (5 mg of tirzepatide) subcutaneously once per week for weeks 1-4 ' +
                            'Month 2 Inject 50 units (5 mg of tirzepatide) subcutaneously once per week for weeks 5-8 ' +
                            'Month 3 Inject 50 units (5 mg of tirzepatide) subcutaneously once per week for weeks 9-12',
                        internalSigText:
                            'Month 1 Inject 50 units (5 mg of tirzepatide) subcutaneously once per week for weeks 1-4 ' +
                            'Month 2 Inject 50 units (5 mg of tirzepatide) subcutaneously once per week for weeks 5-8 ' +
                            'Month 3 Inject 50 units (5 mg of tirzepatide) subcutaneously once per week for weeks 9-12',
                        internalDisplaySigText: [
                            'Month 1 Inject 50 units (5 mg of tirzepatide) subcutaneously once per week for weeks 1-4',
                            'Month 2 Inject 50 units (5 mg of tirzepatide) subcutaneously once per week for weeks 5-8',
                            'Month 3 Inject 50 units (5 mg of tirzepatide) subcutaneously once per week for weeks 9-12',
                        ],
                        quantity: 2,
                        daysSupply: 90,
                    },
                    {
                        catalogItemCode: 'GLP-INJECTION-KIT',
                        sigText:
                            'Month 1 Inject 50 units (5 mg of tirzepatide) subcutaneously once per week for weeks 1-4 ' +
                            'Month 2 Inject 50 units (5 mg of tirzepatide) subcutaneously once per week for weeks 5-8 ' +
                            'Month 3 Inject 50 units (5 mg of tirzepatide) subcutaneously once per week for weeks 9-12',
                        internalSigText:
                            'Month 1 Inject 50 units (5 mg of tirzepatide) subcutaneously once per week for weeks 1-4 ' +
                            'Month 2 Inject 50 units (5 mg of tirzepatide) subcutaneously once per week for weeks 5-8 ' +
                            'Month 3 Inject 50 units (5 mg of tirzepatide) subcutaneously once per week for weeks 9-12',
                        quantity: 2,
                        daysSupply: 90,
                    },
                ],
            },

            18: {
                //tirzepatide-18
                selectDisplayName:
                    '[Bundle] Tirzepatide 60 mg (Maintenance) [$777]',
                array: [
                    {
                        catalogItemCode: 'T-3',
                        sigText:
                            'Month 1 Inject 50 units (5 mg of tirzepatide) subcutaneously once per week for weeks 1-4 ' +
                            'Month 2 Inject 50 units (5 mg of tirzepatide) subcutaneously once per week for weeks 5-8 ' +
                            'Month 3 Inject 50 units (5 mg of tirzepatide) subcutaneously once per week for weeks 9-12',
                        internalSigText:
                            'Month 1 Inject 50 units (5 mg of tirzepatide) subcutaneously once per week for weeks 1-4 ' +
                            'Month 2 Inject 50 units (5 mg of tirzepatide) subcutaneously once per week for weeks 5-8 ' +
                            'Month 3 Inject 50 units (5 mg of tirzepatide) subcutaneously once per week for weeks 9-12',
                        internalDisplaySigText: [
                            'Month 1 Inject 50 units (5 mg of tirzepatide) subcutaneously once per week for weeks 1-4',
                            'Month 2 Inject 50 units (5 mg of tirzepatide) subcutaneously once per week for weeks 5-8',
                            'Month 3 Inject 50 units (5 mg of tirzepatide) subcutaneously once per week for weeks 9-12',
                        ],
                        quantity: 2,
                        daysSupply: 90,
                    },
                    {
                        catalogItemCode: 'GLP-INJECTION-KIT',
                        sigText:
                            'Month 1 Inject 50 units (5 mg of tirzepatide) subcutaneously once per week for weeks 1-4 ' +
                            'Month 2 Inject 50 units (5 mg of tirzepatide) subcutaneously once per week for weeks 5-8 ' +
                            'Month 3 Inject 50 units (5 mg of tirzepatide) subcutaneously once per week for weeks 9-12',
                        internalSigText:
                            'Month 1 Inject 50 units (5 mg of tirzepatide) subcutaneously once per week for weeks 1-4 ' +
                            'Month 2 Inject 50 units (5 mg of tirzepatide) subcutaneously once per week for weeks 5-8 ' +
                            'Month 3 Inject 50 units (5 mg of tirzepatide) subcutaneously once per week for weeks 9-12',
                        quantity: 2,
                        daysSupply: 90,
                    },
                ],
            },

            19: {
                //tirzepatide-19
                selectDisplayName:
                    '[Bundle] Tirzepatide 30mg, 40mg (70 mg Total) [$1186.92]',
                array: [
                    {
                        catalogItemCode: 'T-3',
                        sigText:
                            'Month 1 Inject 50 units (5 mg of tirzepatide) subcutaneously once per week for weeks 1-4 ' +
                            'Month 2 Inject 50 units (5 mg of tirzepatide) subcutaneously once per week for weeks 5-8 ' +
                            'Month 3 Inject 75 units (7.5 mg of tirzepatide) subcutaneously once per week for weeks 9-12',
                        internalSigText:
                            'Month 1 Inject 50 units (5 mg of tirzepatide) subcutaneously once per week for weeks 1-4 ' +
                            'Month 2 Inject 50 units (5 mg of tirzepatide) subcutaneously once per week for weeks 5-8 ' +
                            'Month 3 Inject 75 units (7.5 mg of tirzepatide) subcutaneously once per week for weeks 9-12',
                        internalDisplaySigText: [
                            'Month 1 Inject 50 units (5 mg of tirzepatide) subcutaneously once per week for weeks 1-4',
                            'Month 2 Inject 50 units (5 mg of tirzepatide) subcutaneously once per week for weeks 5-8',
                            'Month 3 Inject 75 units (7.5 mg of tirzepatide) subcutaneously once per week for weeks 9-12',
                        ],
                        quantity: 1,
                        daysSupply: 90,
                    },
                    {
                        catalogItemCode: 'T-2',
                        sigText:
                            'Month 1 Inject 50 units (5 mg of tirzepatide) subcutaneously once per week for weeks 1-4 ' +
                            'Month 2 Inject 50 units (5 mg of tirzepatide) subcutaneously once per week for weeks 5-8 ' +
                            'Month 3 Inject 75 units (7.5 mg of tirzepatide) subcutaneously once per week for weeks 9-12',
                        internalSigText:
                            'Month 1 Inject 50 units (5 mg of tirzepatide) subcutaneously once per week for weeks 1-4 ' +
                            'Month 2 Inject 50 units (5 mg of tirzepatide) subcutaneously once per week for weeks 5-8 ' +
                            'Month 3 Inject 75 units (7.5 mg of tirzepatide) subcutaneously once per week for weeks 9-12',
                        internalDisplaySigText: [
                            'Month 1 Inject 50 units (5 mg of tirzepatide) subcutaneously once per week for weeks 1-4',
                            'Month 2 Inject 50 units (5 mg of tirzepatide) subcutaneously once per week for weeks 5-8',
                            'Month 3 Inject 75 units (7.5 mg of tirzepatide) subcutaneously once per week for weeks 9-12',
                        ],
                        quantity: 2,
                        daysSupply: 90,
                    },
                    {
                        catalogItemCode: 'GLP-INJECTION-KIT',
                        sigText:
                            'Month 1 Inject 50 units (5 mg of tirzepatide) subcutaneously once per week for weeks 1-4 ' +
                            'Month 2 Inject 50 units (5 mg of tirzepatide) subcutaneously once per week for weeks 5-8 ' +
                            'Month 3 Inject 75 units (7.5 mg of tirzepatide) subcutaneously once per week for weeks 9-12',
                        internalSigText:
                            'Month 1 Inject 50 units (5 mg of tirzepatide) subcutaneously once per week for weeks 1-4 ' +
                            'Month 2 Inject 50 units (5 mg of tirzepatide) subcutaneously once per week for weeks 5-8 ' +
                            'Month 3 Inject 75 units (7.5 mg of tirzepatide) subcutaneously once per week for weeks 9-12',
                        quantity: 2,
                        daysSupply: 90,
                    },
                ],
            },

            20: {
                //tirzepatide-20
                selectDisplayName:
                    '[Bundle] Tirzepatide 50mg, 40mg (90 mg Total) [$1399]',
                array: [
                    {
                        catalogItemCode: 'T-5',
                        sigText:
                            'Month 1 Inject 75 units (7.5 mg of tirzepatide) subcutaneously once per week for weeks 1-4 ' +
                            'Month 2 Inject 75 units (7.5 mg of tirzepatide) subcutaneously once per week for weeks 5-8 ' +
                            'Month 3 Inject 75 units (7.5 mg of tirzepatide) subcutaneously once per week for weeks 9-12',
                        internalSigText:
                            'Month 1 Inject 75 units (7.5 mg of tirzepatide) subcutaneously once per week for weeks 1-4 ' +
                            'Month 2 Inject 75 units (7.5 mg of tirzepatide) subcutaneously once per week for weeks 5-8 ' +
                            'Month 3 Inject 75 units (7.5 mg of tirzepatide) subcutaneously once per week for weeks 9-12',
                        internalDisplaySigText: [
                            'Month 1 Inject 75 units (7.5 mg of tirzepatide) subcutaneously once per week for weeks 1-4',
                            'Month 2 Inject 75 units (7.5 mg of tirzepatide) subcutaneously once per week for weeks 5-8',
                            'Month 3 Inject 75 units (7.5 mg of tirzepatide) subcutaneously once per week for weeks 9-12',
                        ],
                        quantity: 1,
                        daysSupply: 90,
                    },
                    {
                        catalogItemCode: 'T-2',
                        sigText:
                            'Month 1 Inject 75 units (7.5 mg of tirzepatide) subcutaneously once per week for weeks 1-4 ' +
                            'Month 2 Inject 75 units (7.5 mg of tirzepatide) subcutaneously once per week for weeks 5-8 ' +
                            'Month 3 Inject 75 units (7.5 mg of tirzepatide) subcutaneously once per week for weeks 9-12',

                        internalSigText:
                            'Month 1 Inject 75 units (7.5 mg of tirzepatide) subcutaneously once per week for weeks 1-4 ' +
                            'Month 2 Inject 75 units (7.5 mg of tirzepatide) subcutaneously once per week for weeks 5-8 ' +
                            'Month 3 Inject 75 units (7.5 mg of tirzepatide) subcutaneously once per week for weeks 9-12',
                        internalDisplaySigText: [
                            'Month 1 Inject 75 units (7.5 mg of tirzepatide) subcutaneously once per week for weeks 1-4',
                            'Month 2 Inject 75 units (7.5 mg of tirzepatide) subcutaneously once per week for weeks 5-8',
                            'Month 3 Inject 75 units (7.5 mg of tirzepatide) subcutaneously once per week for weeks 9-12',
                        ],
                        quantity: 2,
                        daysSupply: 90,
                    },
                    {
                        catalogItemCode: 'GLP-INJECTION-KIT',
                        sigText:
                            'Month 1 Inject 75 units (7.5 mg of tirzepatide) subcutaneously once per week for weeks 1-4 ' +
                            'Month 2 Inject 75 units (7.5 mg of tirzepatide) subcutaneously once per week for weeks 5-8 ' +
                            'Month 3 Inject 75 units (7.5 mg of tirzepatide) subcutaneously once per week for weeks 9-12',
                        internalSigText:
                            'Month 1 Inject 75 units (7.5 mg of tirzepatide) subcutaneously once per week for weeks 1-4 ' +
                            'Month 2 Inject 75 units (7.5 mg of tirzepatide) subcutaneously once per week for weeks 5-8 ' +
                            'Month 3 Inject 75 units (7.5 mg of tirzepatide) subcutaneously once per week for weeks 9-12',
                        quantity: 2,
                        daysSupply: 90,
                    },
                ],
            },

            21: {
                //tirzepatide-21
                selectDisplayName:
                    '[Bundle] Tirzepatide 30mg, 30mg, 30mg, 30mg (120 mg Total) [$1599]',
                array: [
                    {
                        catalogItemCode: 'T-3',
                        sigText:
                            'Month 1 Inject 100 units (10 mg of tirzepatide) subcutaneously once per week for weeks 1-4 ' +
                            'Month 2 Inject 100 units (10 mg of tirzepatide) subcutaneously once per week for weeks 5-8 ' +
                            'Month 3 Inject 100 units (10 mg of tirzepatide) subcutaneously once per week for weeks 9-12',
                        internalSigText:
                            'Month 1 Inject 100 units (10 mg of tirzepatide) subcutaneously once per week for weeks 1-4 ' +
                            'Month 2 Inject 100 units (10 mg of tirzepatide) subcutaneously once per week for weeks 5-8 ' +
                            'Month 3 Inject 100 units (10 mg of tirzepatide) subcutaneously once per week for weeks 9-12',
                        internalDisplaySigText: [
                            'Month 1 Inject 100 units (10 mg of tirzepatide) subcutaneously once per week for weeks 1-4',
                            'Month 2 Inject 100 units (10 mg of tirzepatide) subcutaneously once per week for weeks 5-8',
                            'Month 3 Inject 100 units (10 mg of tirzepatide) subcutaneously once per week for weeks 9-12',
                        ],
                        quantity: 4,
                        daysSupply: 90,
                    },
                    {
                        catalogItemCode: 'GLP-INJECTION-KIT',
                        sigText:
                            'Month 1 Inject 100 units (10 mg of tirzepatide) subcutaneously once per week for weeks 1-4 ' +
                            'Month 2 Inject 100 units (10 mg of tirzepatide) subcutaneously once per week for weeks 5-8 ' +
                            'Month 3 Inject 100 units (10 mg of tirzepatide) subcutaneously once per week for weeks 9-12',
                        internalSigText:
                            'Month 1 Inject 100 units (10 mg of tirzepatide) subcutaneously once per week for weeks 1-4 ' +
                            'Month 2 Inject 100 units (10 mg of tirzepatide) subcutaneously once per week for weeks 5-8 ' +
                            'Month 3 Inject 100 units (10 mg of tirzepatide) subcutaneously once per week for weeks 9-12',
                        internalDisplaySigText: [
                            'Month 1 Inject 100 units (10 mg of tirzepatide) subcutaneously once per week for weeks 1-4',
                            'Month 2 Inject 100 units (10 mg of tirzepatide) subcutaneously once per week for weeks 5-8',
                            'Month 3 Inject 100 units (10 mg of tirzepatide) subcutaneously once per week for weeks 9-12',
                        ],
                        quantity: 2,
                        daysSupply: 90,
                    },
                ],
            },

            22: {
                //tirzepatide-22
                selectDisplayName:
                    '[Bundle] Tirzepatide 50mg, 50mg, 50mg (150 mg Total)  [$1999]',
                array: [
                    {
                        catalogItemCode: 'T-5',
                        sigText:
                            'Month 1 Inject 125 units (12.5 mg of tirzepatide) subcutaneously once per week for weeks 1-4 ' +
                            'Month 2 Inject 125 units (12.5 mg of tirzepatide) subcutaneously once per week for weeks 5-8 ' +
                            'Month 3 Inject 125 units (12.5 mg of tirzepatide) subcutaneously once per week for weeks 9-12',
                        internalSigText:
                            'Month 1 Inject 125 units (12.5 mg of tirzepatide) subcutaneously once per week for weeks 1-4 ' +
                            'Month 2 Inject 125 units (12.5 mg of tirzepatide) subcutaneously once per week for weeks 5-8 ' +
                            'Month 3 Inject 125 units (12.5 mg of tirzepatide) subcutaneously once per week for weeks 9-12',
                        internalDisplaySigText: [
                            'Month 1 Inject 125 units (12.5 mg of tirzepatide) subcutaneously once per week for weeks 1-4',
                            'Month 2 Inject 125 units (12.5 mg of tirzepatide) subcutaneously once per week for weeks 5-8',
                            'Month 3 Inject 125 units (12.5 mg of tirzepatide) subcutaneously once per week for weeks 9-12',
                        ],
                        quantity: 3,
                        daysSupply: 90,
                    },
                    {
                        catalogItemCode: 'GLP-INJECTION-KIT',
                        sigText:
                            'Month 1 Inject 125 units (12.5 mg of tirzepatide) subcutaneously once per week for weeks 1-4 ' +
                            'Month 2 Inject 125 units (12.5 mg of tirzepatide) subcutaneously once per week for weeks 5-8 ' +
                            'Month 3 Inject 125 units (12.5 mg of tirzepatide) subcutaneously once per week for weeks 9-12',
                        internalSigText:
                            'Month 1 Inject 125 units (12.5 mg of tirzepatide) subcutaneously once per week for weeks 1-4 ' +
                            'Month 2 Inject 125 units (12.5 mg of tirzepatide) subcutaneously once per week for weeks 5-8 ' +
                            'Month 3 Inject 125 units (12.5 mg of tirzepatide) subcutaneously once per week for weeks 9-12',
                        internalDisplaySigText: [
                            'Month 1 Inject 125 units (12.5 mg of tirzepatide) subcutaneously once per week for weeks 1-4',
                            'Month 2 Inject 125 units (12.5 mg of tirzepatide) subcutaneously once per week for weeks 5-8',
                            'Month 3 Inject 125 units (12.5 mg of tirzepatide) subcutaneously once per week for weeks 9-12',
                        ],
                        quantity: 2,
                        daysSupply: 90,
                    },
                ],
            },

            23: {
                //tirzepatide-23
                selectDisplayName: '[Monthly] Tirzepatide 12.5 mg [$729]',
                array: [
                    {
                        catalogItemCode: 'T-5',
                        sigText:
                            'Inject 125 units (12.5 mg of Tirzepatide) subcutaneously once per week for 4 weeks',
                        internalSigText:
                            'Inject 125 units (12.5 mg of Tirzepatide) subcutaneously once per week for 4 weeks',
                        quantity: 1,
                        daysSupply: 30,
                    },
                    {
                        catalogItemCode: 'GLP-INJECTION-KIT',
                        sigText:
                            'Inject 125 units (12.5 mg of Tirzepatide) subcutaneously once per week for 4 weeks',
                        internalSigText:
                            'Inject 125 units (12.5 mg of Tirzepatide) subcutaneously once per week for 4 weeks',
                        quantity: 1,
                        daysSupply: 30,
                    },
                ],
            },

            24: {
                //tirzepatide-24
                selectDisplayName:
                    '[6-month] Tirzepatide 60 mg (2.5 mg, 2.5 mg, 2.5 mg, 2.5 mg, 2.5 mg, 2.5 mg dosing) [$1314]',
                array: [
                    {
                        catalogItemCode: 'T-3',
                        sigText:
                            'Month 1-6: Inject 25 units (2.5 mg of Tirzepatide) subcutaneously once per week',
                        internalSigText:
                            'Month 1-6: Inject 25 units (2.5 mg of Tirzepatide) subcutaneously once per week',
                        quantity: 2,
                        daysSupply: 90,
                    },
                    {
                        catalogItemCode: 'GLP-INJECTION-KIT',
                        sigText:
                            'Month 1-6: Inject 25 units (2.5 mg of Tirzepatide) subcutaneously once per week',
                        internalSigText:
                            'Month 1-6: Inject 25 units (2.5 mg of Tirzepatide) subcutaneously once per week',
                        quantity: 3,
                        daysSupply: 90,
                    },
                ],
            },

            25: {
                //tirzepatide-25
                selectDisplayName:
                    '[6-month] Tirzepatide 240 mg (10 mg, 10 mg, 10 mg, 10 mg, 10 mg, 10 mg dosing) [$3174]',

                array: [
                    {
                        catalogItemCode: 'T-4',
                        sigText:
                            'Month 1-6: Inject 100 units (10 mg of Tirzepatide) subcutaneously once per week',
                        internalSigText:
                            'Month 1-6: Inject 100 units (10 mg of Tirzepatide) subcutaneously once per week',
                        quantity: 1,
                        daysSupply: 180,
                    },
                    {
                        catalogItemCode: 'T-5',
                        sigText:
                            'Month 1-6: Inject 100 units (10 mg of Tirzepatide) subcutaneously once per week',
                        internalSigText:
                            'Month 1-6: Inject 100 units (10 mg of Tirzepatide) subcutaneously once per week',
                        quantity: 4,
                        daysSupply: 180,
                    },
                    {
                        catalogItemCode: 'GLP-INJECTION-KIT',
                        sigText:
                            'Month 1-6: Inject 100 units (10 mg of Tirzepatide) subcutaneously once per week',
                        internalSigText:
                            'Month 1-6: Inject 100 units (10 mg of Tirzepatide) subcutaneously once per week',
                        quantity: 3,
                        daysSupply: 180,
                    },
                ],
            },

            // offer was scrapped because unit economics didn't make sense (Jan 8, 2025)
            // 26: {
            //     //tirzepatide-26
            //     selectDisplayName:
            //         '[6-month] Tirzepatide 140 mg (2.5 mg, 5 mg, 5 mg, 7.5 mg, 7.5 mg, 7.5 mg dosing) [$2214]',

            //     array: [
            //         {
            //             catalogItemCode: 'T-4',
            //             sigText:
            //                 'Month 1 Inject 25 units (2.5 mg of tirzepatide) subcutaneously once per week for weeks 1-4' +
            //                 'Month 2 Inject 50 units (5 mg of tirzepatide) subcutaneously once per week for weeks 5-8' +
            //                 'Month 3 Inject 50 units (5 mg of tirzepatide) subcutaneously once per week for weeks 9-12' +
            //                 'Month 4 Inject 75 units (7.5 mg of tirzepatide) subcutaneously once per week for weeks 13-16' +
            //                 'Month 5 Inject 75 units (7.5 mg of tirzepatide) subcutaneously once per week for weeks 17-20' +
            //                 'Month 6 Inject 75 units (7.5 mg of tirzepatide) subcutaneously once per week for weeks 21-24',
            //             internalSigText:
            //                 'Month 1 Inject 25 units (2.5 mg of tirzepatide) subcutaneously once per week for weeks 1-4' +
            //                 'Month 2 Inject 50 units (5 mg of tirzepatide) subcutaneously once per week for weeks 5-8' +
            //                 'Month 3 Inject 50 units (5 mg of tirzepatide) subcutaneously once per week for weeks 9-12' +
            //                 'Month 4 Inject 75 units (7.5 mg of tirzepatide) subcutaneously once per week for weeks 13-16' +
            //                 'Month 5 Inject 75 units (7.5 mg of tirzepatide) subcutaneously once per week for weeks 17-20' +
            //                 'Month 6 Inject 75 units (7.5 mg of tirzepatide) subcutaneously once per week for weeks 21-24',
            //             quantity: 1,
            //             daysSupply: 180,
            //         },
            //         {
            //             catalogItemCode: 'T-5',
            //             sigText:
            //                 'Month 1 Inject 25 units (2.5 mg of tirzepatide) subcutaneously once per week for weeks 1-4' +
            //                 'Month 2 Inject 50 units (5 mg of tirzepatide) subcutaneously once per week for weeks 5-8' +
            //                 'Month 3 Inject 50 units (5 mg of tirzepatide) subcutaneously once per week for weeks 9-12' +
            //                 'Month 4 Inject 75 units (7.5 mg of tirzepatide) subcutaneously once per week for weeks 13-16' +
            //                 'Month 5 Inject 75 units (7.5 mg of tirzepatide) subcutaneously once per week for weeks 17-20' +
            //                 'Month 6 Inject 75 units (7.5 mg of tirzepatide) subcutaneously once per week for weeks 21-24',
            //             internalSigText:
            //                 'Month 1 Inject 25 units (2.5 mg of tirzepatide) subcutaneously once per week for weeks 1-4' +
            //                 'Month 2 Inject 50 units (5 mg of tirzepatide) subcutaneously once per week for weeks 5-8' +
            //                 'Month 3 Inject 50 units (5 mg of tirzepatide) subcutaneously once per week for weeks 9-12' +
            //                 'Month 4 Inject 75 units (7.5 mg of tirzepatide) subcutaneously once per week for weeks 13-16' +
            //                 'Month 5 Inject 75 units (7.5 mg of tirzepatide) subcutaneously once per week for weeks 17-20' +
            //                 'Month 6 Inject 75 units (7.5 mg of tirzepatide) subcutaneously once per week for weeks 21-24',
            //             quantity: 2,
            //             daysSupply: 180,
            //         },
            //         {
            //             catalogItemCode: 'GLP-INJECTION-KIT',
            //             sigText:
            //                 'Month 1 Inject 25 units (2.5 mg of tirzepatide) subcutaneously once per week for weeks 1-4' +
            //                 'Month 2 Inject 50 units (5 mg of tirzepatide) subcutaneously once per week for weeks 5-8' +
            //                 'Month 3 Inject 50 units (5 mg of tirzepatide) subcutaneously once per week for weeks 9-12' +
            //                 'Month 4 Inject 75 units (7.5 mg of tirzepatide) subcutaneously once per week for weeks 13-16' +
            //                 'Month 5 Inject 75 units (7.5 mg of tirzepatide) subcutaneously once per week for weeks 17-20' +
            //                 'Month 6 Inject 75 units (7.5 mg of tirzepatide) subcutaneously once per week for weeks 21-24',
            //             internalSigText:
            //                 'Month 1 Inject 25 units (2.5 mg of tirzepatide) subcutaneously once per week for weeks 1-4' +
            //                 'Month 2 Inject 50 units (5 mg of tirzepatide) subcutaneously once per week for weeks 5-8' +
            //                 'Month 3 Inject 50 units (5 mg of tirzepatide) subcutaneously once per week for weeks 9-12' +
            //                 'Month 4 Inject 75 units (7.5 mg of tirzepatide) subcutaneously once per week for weeks 13-16' +
            //                 'Month 5 Inject 75 units (7.5 mg of tirzepatide) subcutaneously once per week for weeks 17-20' +
            //                 'Month 6 Inject 75 units (7.5 mg of tirzepatide) subcutaneously once per week for weeks 21-24',
            //             quantity: 3,
            //             daysSupply: 180,
            //         },
            //     ],
            // },

            27: {
                //tirzepatide-27
                selectDisplayName:
                    '[6-month] Tirzepatide 90 mg (2.5 mg, 2.5 mg, 2.5 mg, 5 mg, 5 mg, 5 mg dosing) [$1374]',
                array: [
                    {
                        catalogItemCode: 'T-4',
                        sigText:
                            'Month 1-3: Inject 25 units (2.5 mg of Tirzepatide) subcutaneously once per week, ' +
                            'Month 3-6: Inject 50 units (5 mg of Tirzepatide) subcutaneously once per week for 12 weeks',
                        internalSigText:
                            'Month 1-3: Inject 25 units (2.5 mg of Tirzepatide) subcutaneously once per week, ' +
                            'Month 3-6: Inject 50 units (5 mg of Tirzepatide) subcutaneously once per week for 12 weeks',
                        quantity: 1,
                        daysSupply: 180,
                    },
                    {
                        catalogItemCode: 'T-5',
                        sigText:
                            'Month 1-3: Inject 25 units (2.5 mg of Tirzepatide) subcutaneously once per week, ' +
                            'Month 3-6: Inject 50 units (5 mg of Tirzepatide) subcutaneously once per week for 12 weeks',
                        internalSigText:
                            'Month 1-3: Inject 25 units (2.5 mg of Tirzepatide) subcutaneously once per week, ' +
                            'Month 3-6: Inject 50 units (5 mg of Tirzepatide) subcutaneously once per week for 12 weeks',
                        quantity: 1,
                        daysSupply: 180,
                    },
                    {
                        catalogItemCode: 'GLP-INJECTION-KIT',
                        sigText:
                            'Month 1-3: Inject 25 units (2.5 mg of Tirzepatide) subcutaneously once per week, ' +
                            'Month 3-6: Inject 50 units (5 mg of Tirzepatide) subcutaneously once per week for 12 weeks',
                        internalSigText:
                            'Month 1-3: Inject 25 units (2.5 mg of Tirzepatide) subcutaneously once per week, ' +
                            'Month 3-6: Inject 50 units (5 mg of Tirzepatide) subcutaneously once per week for 12 weeks',
                        quantity: 3,
                        daysSupply: 180,
                    },
                ],
            },

            40: {
                //tirzepatide-40
                selectDisplayName:
                    '[12-month] Tirzepatide 180 mg (2.5 mg x 6 months, 5 mg x 6 months)) [$2628] (Shipment 1 of 2)',
                array: [
                    {
                        catalogItemCode: 'T-3',
                        sigText:
                            'Month 1: Inject 25 units (2.5 mg of Tirzepatide) subcutaneously once per week, ' +
                            'Month 2: Inject 25 units (2.5 mg of Tirzepatide) subcutaneously once per week, ' +
                            'Month 3: Inject 25 units (2.5 mg of Tirzepatide) subcutaneously once per week, ' +
                            'Month 4: Inject 25 units (2.5 mg of Tirzepatide) subcutaneously once per week, ' +
                            'Month 5: Inject 25 units (2.5 mg of Tirzepatide) subcutaneously once per week, ' +
                            'Month 6: Inject 25 units (2.5 mg of Tirzepatide) subcutaneously once per week',
                        internalSigText:
                            'Month 1: Inject 25 units (2.5 mg of Tirzepatide) subcutaneously once per week, ' +
                            'Month 2: Inject 25 units (2.5 mg of Tirzepatide) subcutaneously once per week, ' +
                            'Month 3: Inject 25 units (2.5 mg of Tirzepatide) subcutaneously once per week, ' +
                            'Month 4: Inject 25 units (2.5 mg of Tirzepatide) subcutaneously once per week, ' +
                            'Month 5: Inject 25 units (2.5 mg of Tirzepatide) subcutaneously once per week, ' +
                            'Month 6: Inject 25 units (2.5 mg of Tirzepatide) subcutaneously once per week',
                        quantity: 1,
                        daysSupply: 180,
                    },
                    {
                        catalogItemCode: 'T-5',
                        sigText:
                            'Month 1: Inject 25 units (2.5 mg of Tirzepatide) subcutaneously once per week, ' +
                            'Month 2: Inject 25 units (2.5 mg of Tirzepatide) subcutaneously once per week, ' +
                            'Month 3: Inject 25 units (2.5 mg of Tirzepatide) subcutaneously once per week, ' +
                            'Month 4: Inject 25 units (2.5 mg of Tirzepatide) subcutaneously once per week, ' +
                            'Month 5: Inject 25 units (2.5 mg of Tirzepatide) subcutaneously once per week, ' +
                            'Month 6: Inject 25 units (2.5 mg of Tirzepatide) subcutaneously once per week',
                        internalSigText:
                            'Month 1: Inject 25 units (2.5 mg of Tirzepatide) subcutaneously once per week, ' +
                            'Month 2: Inject 25 units (2.5 mg of Tirzepatide) subcutaneously once per week, ' +
                            'Month 3: Inject 25 units (2.5 mg of Tirzepatide) subcutaneously once per week, ' +
                            'Month 4: Inject 25 units (2.5 mg of Tirzepatide) subcutaneously once per week, ' +
                            'Month 5: Inject 25 units (2.5 mg of Tirzepatide) subcutaneously once per week, ' +
                            'Month 6: Inject 25 units (2.5 mg of Tirzepatide) subcutaneously once per week',
                        quantity: 1,
                        daysSupply: 180,
                    },
                    {
                        catalogItemCode: 'GLP-INJECTION-KIT',
                        sigText:
                            'Month 1: Inject 25 units (2.5 mg of Tirzepatide) subcutaneously once per week, ' +
                            'Month 2: Inject 25 units (2.5 mg of Tirzepatide) subcutaneously once per week, ' +
                            'Month 3: Inject 25 units (2.5 mg of Tirzepatide) subcutaneously once per week, ' +
                            'Month 4: Inject 25 units (2.5 mg of Tirzepatide) subcutaneously once per week, ' +
                            'Month 5: Inject 25 units (2.5 mg of Tirzepatide) subcutaneously once per week, ' +
                            'Month 6: Inject 25 units (2.5 mg of Tirzepatide) subcutaneously once per week',
                        internalSigText:
                            'Month 1: Inject 25 units (2.5 mg of Tirzepatide) subcutaneously once per week, ' +
                            'Month 2: Inject 25 units (2.5 mg of Tirzepatide) subcutaneously once per week, ' +
                            'Month 3: Inject 25 units (2.5 mg of Tirzepatide) subcutaneously once per week, ' +
                            'Month 4: Inject 25 units (2.5 mg of Tirzepatide) subcutaneously once per week, ' +
                            'Month 5: Inject 25 units (2.5 mg of Tirzepatide) subcutaneously once per week, ' +
                            'Month 6: Inject 25 units (2.5 mg of Tirzepatide) subcutaneously once per week',
                        quantity: 3,
                        daysSupply: 180,
                    },
                ],
            },
            41: {
                //tirzepatide-41
                selectDisplayName:
                    '[12-month] Tirzepatide 180 mg (2.5 mg x 6 months, 5 mg x 6 months)) [$2628] (Shipment 2 of 2)',
                array: [
                    {
                        catalogItemCode: 'T-5',
                        sigText:
                            'Month 7: Inject 50 units (5 mg of Tirzepatide) subcutaneously once per week, ' +
                            'Month 8: Inject 50 units (5 mg of Tirzepatide) subcutaneously once per week, ' +
                            'Month 9: Inject 50 units (5 mg of Tirzepatide) subcutaneously once per week, ' +
                            'Month 10: Inject 50 units (5 mg of Tirzepatide) subcutaneously once per week, ' +
                            'Month 11: Inject 50 units (5 mg of Tirzepatide) subcutaneously once per week, ' +
                            'Month 12: Inject 50 units (5 mg of Tirzepatide) subcutaneously once per week',
                        internalSigText:
                            'Month 7: Inject 50 units (5 mg of Tirzepatide) subcutaneously once per week, ' +
                            'Month 8: Inject 50 units (5 mg of Tirzepatide) subcutaneously once per week, ' +
                            'Month 9: Inject 50 units (5 mg of Tirzepatide) subcutaneously once per week, ' +
                            'Month 10: Inject 50 units (5 mg of Tirzepatide) subcutaneously once per week, ' +
                            'Month 11: Inject 50 units (5 mg of Tirzepatide) subcutaneously once per week, ' +
                            'Month 12: Inject 50 units (5 mg of Tirzepatide) subcutaneously once per week',
                        quantity: 2,
                        daysSupply: 180,
                    },
                    {
                        catalogItemCode: 'GLP-INJECTION-KIT',
                        sigText:
                            'Month 7: Inject 50 units (5 mg of Tirzepatide) subcutaneously once per week, ' +
                            'Month 8: Inject 50 units (5 mg of Tirzepatide) subcutaneously once per week, ' +
                            'Month 9: Inject 50 units (5 mg of Tirzepatide) subcutaneously once per week, ' +
                            'Month 10: Inject 50 units (5 mg of Tirzepatide) subcutaneously once per week, ' +
                            'Month 11: Inject 50 units (5 mg of Tirzepatide) subcutaneously once per week, ' +
                            'Month 12: Inject 50 units (5 mg of Tirzepatide) subcutaneously once per week',
                        internalSigText:
                            'Month 7: Inject 50 units (5 mg of Tirzepatide) subcutaneously once per week, ' +
                            'Month 8: Inject 50 units (5 mg of Tirzepatide) subcutaneously once per week, ' +
                            'Month 9: Inject 50 units (5 mg of Tirzepatide) subcutaneously once per week, ' +
                            'Month 10: Inject 50 units (5 mg of Tirzepatide) subcutaneously once per week, ' +
                            'Month 11: Inject 50 units (5 mg of Tirzepatide) subcutaneously once per week, ' +
                            'Month 12: Inject 50 units (5 mg of Tirzepatide) subcutaneously once per week',
                        quantity: 3,
                        daysSupply: 180,
                    },
                ],
            },
        },

        /**
         * X CHEWS ============================================================================================================================
         */
        'x-chews': {
            0: {
                //x-chews-0
                selectDisplayName:
                    '[Monthly] X-Chews ( Tadalafil + Oxytocin: 100iu/5mg - Daily )',
                array: [
                    {
                        catalogItemCode: 'X-CHEWS',
                        sigText:
                            'Dissolve one troche under tongue at least 30-60 min before sexual activity (maximum of 1 troche per day).',
                        internalSigText:
                            'Dissolve one troche under tongue at least 30-60 min before sexual activity (maximum of 1 troche per day).',
                        quantity: 30,
                        daysSupply: 30,
                    },
                ],
            },

            1: {
                //x-chews-1
                selectDisplayName:
                    '[Quarterly] X-Chews ( Tadalafil + Oxytocin: 100iu/5mg - Daily )',
                array: [
                    {
                        catalogItemCode: 'X-CHEWS',
                        sigText:
                            'Dissolve one troche under tongue at least 30-60 min before sexual activity (maximum of 1 troche per day).',
                        internalSigText:
                            'Dissolve one troche under tongue at least 30-60 min before sexual activity (maximum of 1 troche per day).',
                        quantity: 90,
                        daysSupply: 90,
                    },
                ],
            },

            2: {
                //x-chews-2
                selectDisplayName:
                    '[Biannually] X-Chews ( Tadalafil + Oxytocin: 100iu/5mg - Daily )',
                array: [
                    {
                        catalogItemCode: 'X-CHEWS',
                        sigText:
                            'Dissolve one troche under tongue at least 30-60 min before sexual activity (maximum of 1 troche per day).',
                        internalSigText:
                            'Dissolve one troche under tongue at least 30-60 min before sexual activity (maximum of 1 troche per day).',
                        quantity: 180,
                        daysSupply: 180,
                    },
                ],
            },

            3: {
                //x-chews-3
                selectDisplayName:
                    '[Quarterly] X-Chews ( Tadalafil + Oxytocin: 100iu/5mg - 6 ct )',
                array: [
                    {
                        catalogItemCode: 'X-CHEWS',
                        sigText:
                            'Dissolve one troche under tongue at least 30-60 min before sexual activity (maximum of 1 troche per day).',
                        internalSigText:
                            'Dissolve one troche under tongue at least 30-60 min before sexual activity (maximum of 1 troche per day).',
                        quantity: 18,
                        daysSupply: 90,
                    },
                ],
            },

            4: {
                //x-chews-4
                selectDisplayName:
                    '[Biannually] X-Chews ( Tadalafil + Oxytocin: 100iu/5mg - 6 ct )',
                array: [
                    {
                        catalogItemCode: 'X-CHEWS',
                        sigText:
                            'Dissolve one troche under tongue at least 30-60 min before sexual activity (maximum of 1 troche per day).',
                        internalSigText:
                            'Dissolve one troche under tongue at least 30-60 min before sexual activity (maximum of 1 troche per day).',
                        quantity: 36,
                        daysSupply: 180,
                    },
                ],
            },

            5: {
                //x-chews-5
                selectDisplayName:
                    '[Monthly] X-Chews ( Tadalafil + Oxytocin: 100iu/5mg - 8 ct )',
                array: [
                    {
                        catalogItemCode: 'X-CHEWS',
                        sigText:
                            'Dissolve one troche under tongue at least 30-60 min before sexual activity (maximum of 1 troche per day).',
                        internalSigText:
                            'Dissolve one troche under tongue at least 30-60 min before sexual activity (maximum of 1 troche per day).',
                        quantity: 8,
                        daysSupply: 30,
                    },
                ],
            },

            6: {
                //x-chews-6
                selectDisplayName:
                    '[Quarterly] X-Chews ( Tadalafil + Oxytocin: 100iu/5mg - 8 ct )',
                array: [
                    {
                        catalogItemCode: 'X-CHEWS',
                        sigText:
                            'Dissolve one troche under tongue at least 30-60 min before sexual activity (maximum of 1 troche per day).',
                        internalSigText:
                            'Dissolve one troche under tongue at least 30-60 min before sexual activity (maximum of 1 troche per day).',
                        quantity: 24,
                        daysSupply: 90,
                    },
                ],
            },

            7: {
                //x-chews-6
                selectDisplayName:
                    '[Biannually] X-Chews ( Tadalafil + Oxytocin: 100iu/5mg - 8 ct )',
                array: [
                    {
                        catalogItemCode: 'X-CHEWS',
                        sigText:
                            'Dissolve one troche under tongue at least 30-60 min before sexual activity (maximum of 1 troche per day).',
                        internalSigText:
                            'Dissolve one troche under tongue at least 30-60 min before sexual activity (maximum of 1 troche per day).',
                        quantity: 48,
                        daysSupply: 180,
                    },
                ],
            },

            8: {
                //x-chews-8
                selectDisplayName:
                    '[Monthly] X-Chews ( Tadalafil + Oxytocin: 100iu/5mg - 10 ct )',
                array: [
                    {
                        catalogItemCode: 'X-CHEWS',
                        sigText:
                            'Dissolve one troche under tongue at least 30-60 min before sexual activity (maximum of 1 troche per day).',
                        internalSigText:
                            'Dissolve one troche under tongue at least 30-60 min before sexual activity (maximum of 1 troche per day).',
                        quantity: 10,
                        daysSupply: 30,
                    },
                ],
            },

            9: {
                //x-chews-9
                selectDisplayName:
                    '[Quarterly] X-Chews ( Tadalafil + Oxytocin: 100iu/5mg - 10 ct )',
                array: [
                    {
                        catalogItemCode: 'X-CHEWS',
                        sigText:
                            'Dissolve one troche under tongue at least 30-60 min before sexual activity (maximum of 1 troche per day).',
                        internalSigText:
                            'Dissolve one troche under tongue at least 30-60 min before sexual activity (maximum of 1 troche per day).',
                        quantity: 30,
                        daysSupply: 90,
                    },
                ],
            },

            10: {
                //x-chews-10
                selectDisplayName:
                    '[Biannually] X-Chews ( Tadalafil + Oxytocin: 100iu/5mg - 10 ct )',
                array: [
                    {
                        catalogItemCode: 'X-CHEWS',
                        sigText:
                            'Dissolve one troche under tongue at least 30-60 min before sexual activity (maximum of 1 troche per day).',
                        internalSigText:
                            'Dissolve one troche under tongue at least 30-60 min before sexual activity (maximum of 1 troche per day).',
                        quantity: 60,
                        daysSupply: 180,
                    },
                ],
            },

            11: {
                //x-chews-11
                selectDisplayName:
                    '[Monthly] X-Chews ( Tadalafil + Oxytocin: 100iu/5mg - 12 ct )',
                array: [
                    {
                        catalogItemCode: 'X-CHEWS',
                        sigText:
                            'Dissolve one troche under tongue at least 30-60 min before sexual activity (maximum of 1 troche per day).',
                        internalSigText:
                            'Dissolve one troche under tongue at least 30-60 min before sexual activity (maximum of 1 troche per day).',
                        quantity: 12,
                        daysSupply: 30,
                    },
                ],
            },

            12: {
                //x-chews-12
                selectDisplayName:
                    '[Quarterly] X-Chews ( Tadalafil + Oxytocin: 100iu/5mg - 12 ct )',
                array: [
                    {
                        catalogItemCode: 'X-CHEWS',
                        sigText:
                            'Dissolve one troche under tongue at least 30-60 min before sexual activity (maximum of 1 troche per day).',
                        internalSigText:
                            'Dissolve one troche under tongue at least 30-60 min before sexual activity (maximum of 1 troche per day).',
                        quantity: 36,
                        daysSupply: 90,
                    },
                ],
            },

            13: {
                //x-chews-13
                selectDisplayName:
                    '[Biannually] X-Chews ( Tadalafil + Oxytocin: 100iu/5mg - 12 ct )',
                array: [
                    {
                        catalogItemCode: 'X-CHEWS',
                        sigText:
                            'Dissolve one troche under tongue at least 30-60 min before sexual activity (maximum of 1 troche per day).',
                        internalSigText:
                            'Dissolve one troche under tongue at least 30-60 min before sexual activity (maximum of 1 troche per day).',
                        quantity: 72,
                        daysSupply: 180,
                    },
                ],
            },

            14: {
                //x-chews-14
                selectDisplayName:
                    '[Monthly] X-Chews ( Tadalafil + Oxytocin: 100iu/5mg - 14 ct )',
                array: [
                    {
                        catalogItemCode: 'X-CHEWS',
                        sigText:
                            'Dissolve one troche under tongue at least 30-60 min before sexual activity (maximum of 1 troche per day).',
                        internalSigText:
                            'Dissolve one troche under tongue at least 30-60 min before sexual activity (maximum of 1 troche per day).',
                        quantity: 14,
                        daysSupply: 30,
                    },
                ],
            },

            15: {
                //x-chews-15
                selectDisplayName:
                    '[Quarterly] X-Chews ( Tadalafil + Oxytocin: 100iu/5mg - 14 ct )',
                array: [
                    {
                        catalogItemCode: 'X-CHEWS',
                        sigText:
                            'Dissolve one troche under tongue at least 30-60 min before sexual activity (maximum of 1 troche per day).',
                        internalSigText:
                            'Dissolve one troche under tongue at least 30-60 min before sexual activity (maximum of 1 troche per day).',
                        quantity: 42,
                        daysSupply: 90,
                    },
                ],
            },

            16: {
                //x-chews-16
                selectDisplayName:
                    '[Biannually] X-Chews ( Tadalafil + Oxytocin: 100iu/5mg - 14 ct )',
                array: [
                    {
                        catalogItemCode: 'X-CHEWS',
                        sigText:
                            'Dissolve one troche under tongue at least 30-60 min before sexual activity (maximum of 1 troche per day).',
                        internalSigText:
                            'Dissolve one troche under tongue at least 30-60 min before sexual activity (maximum of 1 troche per day).',
                        quantity: 84,
                        daysSupply: 180,
                    },
                ],
            },

            17: {
                //x-chews-17
                selectDisplayName:
                    '[Monthly] X-Chews ( Tadalafil + Oxytocin: 100iu/5mg - 16 ct )',
                array: [
                    {
                        catalogItemCode: 'X-CHEWS',
                        sigText:
                            'Dissolve one troche under tongue at least 30-60 min before sexual activity (maximum of 1 troche per day).',
                        internalSigText:
                            'Dissolve one troche under tongue at least 30-60 min before sexual activity (maximum of 1 troche per day).',
                        quantity: 16,
                        daysSupply: 30,
                    },
                ],
            },

            18: {
                //x-chews-18
                selectDisplayName:
                    '[Quarterly] X-Chews ( Tadalafil + Oxytocin: 100iu/5mg - 16 ct )',
                array: [
                    {
                        catalogItemCode: 'X-CHEWS',
                        sigText:
                            'Dissolve one troche under tongue at least 30-60 min before sexual activity (maximum of 1 troche per day).',
                        internalSigText:
                            'Dissolve one troche under tongue at least 30-60 min before sexual activity (maximum of 1 troche per day).',
                        quantity: 48,
                        daysSupply: 90,
                    },
                ],
            },

            19: {
                //x-chews-19
                selectDisplayName:
                    '[Biannually] X-Chews ( Tadalafil + Oxytocin: 100iu/5mg - 16 ct )',
                array: [
                    {
                        catalogItemCode: 'X-CHEWS',
                        sigText:
                            'Dissolve one troche under tongue at least 30-60 min before sexual activity (maximum of 1 troche per day).',
                        internalSigText:
                            'Dissolve one troche under tongue at least 30-60 min before sexual activity (maximum of 1 troche per day).',
                        quantity: 96,
                        daysSupply: 180,
                    },
                ],
            },
        },

        /**
         * X MELTS ============================================================================================================================
         */
        'x-melts': {
            0: {
                //x-melts-0
                selectDisplayName:
                    '[Monthly] X-Melts ( Sildenafil + Oxytocin: 100iu/5mg - Daily )',
                array: [
                    {
                        catalogItemCode: 'X-MELTS',
                        sigText:
                            'Dissolve 1 tablet under tongue at least 15 min before sexual activity (maximum of 1 troche per day).',
                        internalSigText:
                            'Dissolve 1 tablet under tongue at least 15 min before sexual activity (maximum of 1 troche per day).',
                        quantity: 30,
                        daysSupply: 30,
                    },
                ],
            },

            1: {
                //x-melts-1
                selectDisplayName:
                    '[Quarterly] X-Melts ( Sildenafil + Oxytocin: 100iu/5mg - Daily )',
                array: [
                    {
                        catalogItemCode: 'X-MELTS',
                        sigText:
                            'Dissolve 1 tablet under tongue at least 15 min before sexual activity (maximum of 1 troche per day).',
                        internalSigText:
                            'Dissolve 1 tablet under tongue at least 15 min before sexual activity (maximum of 1 troche per day).',
                        quantity: 90,
                        daysSupply: 90,
                    },
                ],
            },

            2: {
                //x-melts-2
                selectDisplayName:
                    '[Biannually] X-Melts ( Sildenafil + Oxytocin: 100iu/5mg - Daily )',
                array: [
                    {
                        catalogItemCode: 'X-MELTS',
                        sigText:
                            'Dissolve 1 tablet under tongue at least 15 min before sexual activity (maximum of 1 troche per day).',
                        internalSigText:
                            'Dissolve 1 tablet under tongue at least 15 min before sexual activity (maximum of 1 troche per day).',
                        quantity: 180,
                        daysSupply: 180,
                    },
                ],
            },

            3: {
                //x-melts-3
                selectDisplayName:
                    '[Monthly] X-Melts ( Sildenafil + Oxytocin: 100iu/5mg - 4 ct )',
                array: [
                    {
                        catalogItemCode: 'X-MELTS',
                        sigText:
                            'Dissolve 1 tablet under tongue at least 15 min before sexual activity (maximum of 1 troche per day).',
                        internalSigText:
                            'Dissolve 1 tablet under tongue at least 15 min before sexual activity (maximum of 1 troche per day).',
                        quantity: 4,
                        daysSupply: 30,
                    },
                ],
            },

            4: {
                //x-melts-4
                selectDisplayName:
                    '[Quarterly] X-Melts ( Sildenafil + Oxytocin: 100iu/5mg - 4 ct )',
                array: [
                    {
                        catalogItemCode: 'X-MELTS',
                        sigText:
                            'Dissolve 1 tablet under tongue at least 15 min before sexual activity (maximum of 1 troche per day).',
                        internalSigText:
                            'Dissolve 1 tablet under tongue at least 15 min before sexual activity (maximum of 1 troche per day).',
                        quantity: 12,
                        daysSupply: 90,
                    },
                ],
            },

            5: {
                //x-melts-5
                selectDisplayName:
                    '[Biannually] X-Melts ( Sildenafil + Oxytocin: 100iu/5mg - 4 ct )',
                array: [
                    {
                        catalogItemCode: 'X-MELTS',
                        sigText:
                            'Dissolve 1 tablet under tongue at least 15 min before sexual activity (maximum of 1 troche per day).',
                        internalSigText:
                            'Dissolve 1 tablet under tongue at least 15 min before sexual activity (maximum of 1 troche per day).',
                        quantity: 24,
                        daysSupply: 180,
                    },
                ],
            },

            6: {
                //x-melts-6
                selectDisplayName:
                    '[Monthly] X-Melts ( Sildenafil + Oxytocin: 100iu/5mg - 6 ct )',
                array: [
                    {
                        catalogItemCode: 'X-MELTS',
                        sigText:
                            'Dissolve 1 tablet under tongue at least 15 min before sexual activity (maximum of 1 troche per day).',
                        internalSigText:
                            'Dissolve 1 tablet under tongue at least 15 min before sexual activity (maximum of 1 troche per day).',
                        quantity: 6,
                        daysSupply: 30,
                    },
                ],
            },

            7: {
                //x-melts-7
                selectDisplayName:
                    '[Quarterly] X-Melts ( Sildenafil + Oxytocin: 100iu/5mg - 6 ct )',
                array: [
                    {
                        catalogItemCode: 'X-MELTS',
                        sigText:
                            'Dissolve 1 tablet under tongue at least 15 min before sexual activity (maximum of 1 troche per day).',
                        internalSigText:
                            'Dissolve 1 tablet under tongue at least 15 min before sexual activity (maximum of 1 troche per day).',
                        quantity: 18,
                        daysSupply: 90,
                    },
                ],
            },

            8: {
                //x-melts-8
                selectDisplayName:
                    '[Biannually] X-Melts ( Sildenafil + Oxytocin: 100iu/5mg - 6 ct )',
                array: [
                    {
                        catalogItemCode: 'X-MELTS',
                        sigText:
                            'Dissolve 1 tablet under tongue at least 15 min before sexual activity (maximum of 1 troche per day).',
                        internalSigText:
                            'Dissolve 1 tablet under tongue at least 15 min before sexual activity (maximum of 1 troche per day).',
                        quantity: 36,
                        daysSupply: 180,
                    },
                ],
            },

            9: {
                //x-melts-9
                selectDisplayName:
                    '[Monthly] X-Melts ( Sildenafil + Oxytocin: 100iu/5mg - 8 ct )',
                array: [
                    {
                        catalogItemCode: 'X-MELTS',
                        sigText:
                            'Dissolve 1 tablet under tongue at least 15 min before sexual activity (maximum of 1 troche per day).',
                        internalSigText:
                            'Dissolve 1 tablet under tongue at least 15 min before sexual activity (maximum of 1 troche per day).',
                        quantity: 8,
                        daysSupply: 30,
                    },
                ],
            },

            10: {
                //x-melts-10
                selectDisplayName:
                    '[Quarterly] X-Melts ( Sildenafil + Oxytocin: 100iu/5mg - 8 ct )',
                array: [
                    {
                        catalogItemCode: 'X-MELTS',
                        sigText:
                            'Dissolve 1 tablet under tongue at least 15 min before sexual activity (maximum of 1 troche per day).',
                        internalSigText:
                            'Dissolve 1 tablet under tongue at least 15 min before sexual activity (maximum of 1 troche per day).',
                        quantity: 24,
                        daysSupply: 90,
                    },
                ],
            },

            11: {
                //x-melts-11
                selectDisplayName:
                    '[Biannually] X-Melts ( Sildenafil + Oxytocin: 100iu/5mg - 8 ct )',
                array: [
                    {
                        catalogItemCode: 'X-MELTS',
                        sigText:
                            'Dissolve 1 tablet under tongue at least 15 min before sexual activity (maximum of 1 troche per day).',
                        internalSigText:
                            'Dissolve 1 tablet under tongue at least 15 min before sexual activity (maximum of 1 troche per day).',
                        quantity: 48,
                        daysSupply: 180,
                    },
                ],
            },

            12: {
                //x-melts-12
                selectDisplayName:
                    '[Monthly] X-Melts ( Sildenafil + Oxytocin: 100iu/5mg - 10 ct )',
                array: [
                    {
                        catalogItemCode: 'X-MELTS',
                        sigText:
                            'Dissolve 1 tablet under tongue at least 15 min before sexual activity (maximum of 1 troche per day).',
                        internalSigText:
                            'Dissolve 1 tablet under tongue at least 15 min before sexual activity (maximum of 1 troche per day).',
                        quantity: 10,
                        daysSupply: 30,
                    },
                ],
            },

            13: {
                //x-melts-13
                selectDisplayName:
                    '[Quarterly] X-Melts ( Sildenafil + Oxytocin: 100iu/5mg - 10 ct )',
                array: [
                    {
                        catalogItemCode: 'X-MELTS',
                        sigText:
                            'Dissolve 1 tablet under tongue at least 15 min before sexual activity (maximum of 1 troche per day).',
                        internalSigText:
                            'Dissolve 1 tablet under tongue at least 15 min before sexual activity (maximum of 1 troche per day).',
                        quantity: 30,
                        daysSupply: 90,
                    },
                ],
            },

            14: {
                //x-melts-14
                selectDisplayName:
                    '[Biannually] X-Melts ( Sildenafil + Oxytocin: 100iu/5mg - 10 ct )',
                array: [
                    {
                        catalogItemCode: 'X-MELTS',
                        sigText:
                            'Dissolve 1 tablet under tongue at least 15 min before sexual activity (maximum of 1 troche per day).',
                        internalSigText:
                            'Dissolve 1 tablet under tongue at least 15 min before sexual activity (maximum of 1 troche per day).',
                        quantity: 90,
                        daysSupply: 180,
                    },
                ],
            },

            15: {
                //x-melts-15
                selectDisplayName:
                    '[Monthly] X-Melts ( Sildenafil + Oxytocin: 100iu/5mg - 12 ct )',
                array: [
                    {
                        catalogItemCode: 'X-MELTS',
                        sigText:
                            'Dissolve 1 tablet under tongue at least 15 min before sexual activity (maximum of 1 troche per day).',
                        internalSigText:
                            'Dissolve 1 tablet under tongue at least 15 min before sexual activity (maximum of 1 troche per day).',
                        quantity: 12,
                        daysSupply: 30,
                    },
                ],
            },

            16: {
                //x-melts-16
                selectDisplayName:
                    '[Quarterly] X-Melts ( Sildenafil + Oxytocin: 100iu/5mg - 12 ct )',
                array: [
                    {
                        catalogItemCode: 'X-MELTS',
                        sigText:
                            'Dissolve 1 tablet under tongue at least 15 min before sexual activity (maximum of 1 troche per day).',
                        internalSigText:
                            'Dissolve 1 tablet under tongue at least 15 min before sexual activity (maximum of 1 troche per day).',
                        quantity: 36,
                        daysSupply: 90,
                    },
                ],
            },

            17: {
                //x-melts-17
                selectDisplayName:
                    '[Biannually] X-Melts ( Sildenafil + Oxytocin: 100iu/5mg - 12 ct )',
                array: [
                    {
                        catalogItemCode: 'X-MELTS',
                        sigText:
                            'Dissolve 1 tablet under tongue at least 15 min before sexual activity (maximum of 1 troche per day).',
                        internalSigText:
                            'Dissolve 1 tablet under tongue at least 15 min before sexual activity (maximum of 1 troche per day).',
                        quantity: 72,
                        daysSupply: 180,
                    },
                ],
            },

            18: {
                //x-melts-18
                selectDisplayName:
                    '[Monthly] X-Melts ( Sildenafil + Oxytocin: 100iu/5mg - 14 ct )',
                array: [
                    {
                        catalogItemCode: 'X-MELTS',
                        sigText:
                            'Dissolve 1 tablet under tongue at least 15 min before sexual activity (maximum of 1 troche per day).',
                        internalSigText:
                            'Dissolve 1 tablet under tongue at least 15 min before sexual activity (maximum of 1 troche per day).',
                        quantity: 14,
                        daysSupply: 30,
                    },
                ],
            },

            19: {
                //x-melts-19
                selectDisplayName:
                    '[Quarterly] X-Melts ( Sildenafil + Oxytocin: 100iu/5mg - 14 ct )',
                array: [
                    {
                        catalogItemCode: 'X-MELTS',
                        sigText:
                            'Dissolve 1 tablet under tongue at least 15 min before sexual activity (maximum of 1 troche per day).',
                        internalSigText:
                            'Dissolve 1 tablet under tongue at least 15 min before sexual activity (maximum of 1 troche per day).',
                        quantity: 42,
                        daysSupply: 90,
                    },
                ],
            },

            20: {
                //x-melts-20
                selectDisplayName:
                    '[Biannually] X-Melts ( Sildenafil + Oxytocin: 100iu/5mg - 14 ct )',
                array: [
                    {
                        catalogItemCode: 'X-MELTS',
                        sigText:
                            'Dissolve 1 tablet under tongue at least 15 min before sexual activity (maximum of 1 troche per day).',
                        internalSigText:
                            'Dissolve 1 tablet under tongue at least 15 min before sexual activity (maximum of 1 troche per day).',
                        quantity: 84,
                        daysSupply: 180,
                    },
                ],
            },

            21: {
                //x-melts-21
                selectDisplayName:
                    '[Monthly] X-Melts ( Sildenafil + Oxytocin: 100iu/5mg - 16 ct )',
                array: [
                    {
                        catalogItemCode: 'X-MELTS',
                        sigText:
                            'Dissolve 1 tablet under tongue at least 15 min before sexual activity (maximum of 1 troche per day).',
                        internalSigText:
                            'Dissolve 1 tablet under tongue at least 15 min before sexual activity (maximum of 1 troche per day).',
                        quantity: 16,
                        daysSupply: 30,
                    },
                ],
            },

            22: {
                //x-melts-22
                selectDisplayName:
                    '[Quarterly] X-Melts ( Sildenafil + Oxytocin: 100iu/5mg - 16 ct )',
                array: [
                    {
                        catalogItemCode: 'X-MELTS',
                        sigText:
                            'Dissolve 1 tablet under tongue at least 15 min before sexual activity (maximum of 1 troche per day).',
                        internalSigText:
                            'Dissolve 1 tablet under tongue at least 15 min before sexual activity (maximum of 1 troche per day).',
                        quantity: 48,
                        daysSupply: 90,
                    },
                ],
            },

            23: {
                //x-melts-23
                selectDisplayName:
                    '[Biannually] X-Melts ( Sildenafil + Oxytocin: 100iu/5mg - 16 ct )',
                array: [
                    {
                        catalogItemCode: 'X-MELTS',
                        sigText:
                            'Dissolve 1 tablet under tongue at least 15 min before sexual activity (maximum of 1 troche per day).',
                        internalSigText:
                            'Dissolve 1 tablet under tongue at least 15 min before sexual activity (maximum of 1 troche per day).',
                        quantity: 96,
                        daysSupply: 180,
                    },
                ],
            },
        },
    };
