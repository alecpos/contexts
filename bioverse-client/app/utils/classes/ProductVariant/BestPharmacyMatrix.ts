import { USStates } from '@/app/types/enums/master-enums';
import { EquivalenceCodes } from './ProductVarianceMap';
import { PHARMACY } from '@/app/types/pharmacy-integrations/pharmacy-types';

export interface BestPharmacyMatrixMap {
    //Equivalence Code
    [key: string]: MatrixStateSearch[];
}

export interface MatrixStateSearch {
    allowedStates: USStates[];
    variantPharmacy: {
        variantIndex: number;
        pharmacy: string;
    };
}

interface PharmacySearchResult {
    variantIndex: number;
    pharmacy: string;
    found: boolean;
}

export function findVariantPharmacyByState(
    matrixMap: BestPharmacyMatrixMap,
    equivalenceCode: string,
    state: USStates
): PharmacySearchResult {
    // Default return value if no match is found
    const defaultResult: PharmacySearchResult = {
        variantIndex: -1,
        pharmacy: '',
        found: false,
    };

    // Check if equivalence code exists in matrix map
    const stateSearches = matrixMap[equivalenceCode];
    if (!stateSearches) {
        return defaultResult;
    }

    // Find the first matching state entry
    const matchingStateSearch = stateSearches.find(
        (search: MatrixStateSearch) => search.allowedStates.includes(state)
    );

    if (!matchingStateSearch) {
        return defaultResult;
    }

    // Return the found pharmacy information
    return {
        variantIndex: matchingStateSearch.variantPharmacy.variantIndex,
        pharmacy: matchingStateSearch.variantPharmacy.pharmacy,
        found: true,
    };
}

export const BEST_PHARMACY_MATRIX_MAP: BestPharmacyMatrixMap = {
    /**
     * SEMAGLUTIDE EQUIVALENCE MAPPINGS:
     */

    [EquivalenceCodes.SEMA1MO_0_25_MG]: [
        {
            allowedStates: [
                USStates.California,
                USStates.Colorado,
                USStates.Florida,
                USStates.Illinois,
                USStates.Indiana,
                USStates.Michigan,
                USStates.NewJersey,
                USStates.NorthCarolina,
                USStates.Ohio,
                USStates.Pennsylvania,
                USStates.Texas,
                USStates.Virginia,
                USStates.Washington,
            ],
            variantPharmacy: {
                variantIndex: 45,
                pharmacy: 'boothwyn',
            },
        },
    ],

    [EquivalenceCodes.SEMA2MO_0_5_MG]: [
        {
            allowedStates: [],
            variantPharmacy: {
                variantIndex: 55,
                pharmacy: 'revive',
            },
        },
        {
            allowedStates: [USStates.California],
            variantPharmacy: {
                variantIndex: 46,
                pharmacy: 'boothwyn',
            },
        },
        {
            allowedStates: [
                USStates.Colorado,
                USStates.Florida,
                USStates.Illinois,
                USStates.Indiana,
                USStates.NewJersey,
                USStates.NorthCarolina,
                USStates.Ohio,
                USStates.Pennsylvania,
                USStates.Texas,
                USStates.Virginia,
                USStates.Washington,
                USStates.Michigan,
            ],
            variantPharmacy: {
                variantIndex: 3,
                pharmacy: 'empower',
            },
        },
    ],

    [EquivalenceCodes.SEMA3MO_1_25_MG]: [
        //1.25 mg semaglutide
        {
            allowedStates: [
                USStates.California,
                USStates.Colorado,
                USStates.Florida,
                USStates.Illinois,
                USStates.Indiana,
                USStates.Michigan,
                USStates.NewJersey,
                USStates.NorthCarolina,
                USStates.Ohio,
                USStates.Pennsylvania,
                USStates.Texas,
                USStates.Virginia,
                USStates.Washington,
            ],
            variantPharmacy: {
                variantIndex: 47,
                pharmacy: 'boothwyn',
            },
        },
    ],

    [EquivalenceCodes.SEMA4MO_2_5_MG]: [
        {
            allowedStates: [
                USStates.California,
                USStates.Colorado,
                USStates.Florida,
                USStates.Illinois,
                USStates.Indiana,
                USStates.Michigan,
                USStates.NewJersey,
                USStates.NorthCarolina,
                USStates.Ohio,
                USStates.Pennsylvania,
                USStates.Texas,
                USStates.Virginia,
                USStates.Washington,
            ],
            variantPharmacy: {
                variantIndex: 48,
                pharmacy: 'boothwyn',
            },
        },
    ],

    [EquivalenceCodes.SEMA5QU]: [
        //.25 .5 1.25
        {
            allowedStates: [USStates.California],
            variantPharmacy: {
                variantIndex: 49,
                pharmacy: 'boothwyn',
            },
        },
        {
            allowedStates: [
                USStates.Colorado,
                USStates.Florida,
                USStates.Illinois,
                USStates.Indiana,
                USStates.NewJersey,
                USStates.NorthCarolina,
                USStates.Ohio,
                USStates.Pennsylvania,
                USStates.Texas,
                USStates.Virginia,
                USStates.Washington,
                USStates.Michigan,
            ],
            variantPharmacy: {
                variantIndex: 56,
                pharmacy: PHARMACY.REVIVE,
            },
        },
        {
            allowedStates: [],
            variantPharmacy: {
                variantIndex: 6,
                pharmacy: PHARMACY.EMPOWER,
            },
        },
    ],

    [EquivalenceCodes.SEMA6QU]: [
        //1.25 1.25 1.25
        {
            allowedStates: [USStates.California],
            variantPharmacy: {
                variantIndex: 51,
                pharmacy: PHARMACY.BOOTHWYN,
            },
        },
        {
            allowedStates: [
                USStates.Colorado,
                USStates.Florida,
                USStates.Illinois,
                USStates.Indiana,
                USStates.Michigan,
                USStates.NewJersey,
                USStates.NorthCarolina,
                USStates.Ohio,
                USStates.Pennsylvania,
                USStates.Texas,
                USStates.Virginia,
                USStates.Washington,
            ],
            variantPharmacy: {
                variantIndex: 57,
                pharmacy: PHARMACY.REVIVE,
            },
        },
    ],

    [EquivalenceCodes.SEMA7QU]: [
        //.5 1.25 2.5
        {
            allowedStates: [USStates.California],
            variantPharmacy: {
                variantIndex: 52,
                pharmacy: PHARMACY.BOOTHWYN,
            },
        },
        {
            allowedStates: [
                USStates.Colorado,
                USStates.Florida,
                USStates.Illinois,
                USStates.Indiana,
                USStates.Michigan,
                USStates.NewJersey,
                USStates.NorthCarolina,
                USStates.Ohio,
                USStates.Pennsylvania,
                USStates.Texas,
                USStates.Virginia,
                USStates.Washington,
            ],
            variantPharmacy: {
                variantIndex: 59,
                pharmacy: PHARMACY.REVIVE,
            },
        },
    ],

    [EquivalenceCodes.SEMA8QU]: [
        //.5 .5 .5
        {
            allowedStates: [],
            variantPharmacy: {
                variantIndex: 12,
                pharmacy: PHARMACY.HALLANDALE,
            },
        },
    ],

    [EquivalenceCodes.SEMA9QU]: [
        //1.25 1.25 2.5
        {
            allowedStates: [USStates.California],
            variantPharmacy: {
                variantIndex: 51,
                pharmacy: PHARMACY.BOOTHWYN,
            },
        },
        {
            allowedStates: [],
            variantPharmacy: {
                variantIndex: 43,
                pharmacy: PHARMACY.HALLANDALE,
            },
        },
        {
            allowedStates: [],
            variantPharmacy: {
                variantIndex: 58,
                pharmacy: PHARMACY.REVIVE,
            },
        },
        {
            allowedStates: [
                USStates.Colorado,
                USStates.Florida,
                USStates.Illinois,
                USStates.Indiana,
                USStates.Michigan,
                USStates.NewJersey,
                USStates.NorthCarolina,
                USStates.Ohio,
                USStates.Pennsylvania,
                USStates.Texas,
                USStates.Virginia,
                USStates.Washington,
                USStates.Michigan,
            ],
            variantPharmacy: {
                variantIndex: 21,
                pharmacy: PHARMACY.EMPOWER,
            },
        },
    ],

    [EquivalenceCodes.SEMA10QU]: [
        //1.25 2.5 2.5
        // {
        //     allowedStates: [USStates.California, USStates.Michigan],
        //     variantPharmacy: {
        //         variantIndex: 53,
        //         pharmacy: PHARMACY.BOOTHWYN,
        //     },
        // },
        // {
        //     allowedStates: [
        //         USStates.Colorado,
        //         USStates.Florida,
        //         USStates.Illinois,
        //         USStates.Indiana,
        //         USStates.NewJersey,
        //         USStates.NorthCarolina,
        //         USStates.Ohio,
        //         USStates.Pennsylvania,
        //         USStates.Texas,
        //         USStates.Virginia,
        //         USStates.Washington,
        //     ],
        //     variantPharmacy: {
        //         variantIndex: 44,
        //         pharmacy: PHARMACY.HALLANDALE,
        //     },
        // },
        {
            allowedStates: [
                USStates.Colorado,
                USStates.Florida,
                USStates.Illinois,
                USStates.Indiana,
                USStates.NewJersey,
                USStates.NorthCarolina,
                USStates.Ohio,
                USStates.Pennsylvania,
                USStates.Texas,
                USStates.Virginia,
                USStates.Washington,
                USStates.Michigan,
            ],
            variantPharmacy: {
                variantIndex: 9,
                pharmacy: PHARMACY.EMPOWER,
            },
        },
    ],

    [EquivalenceCodes.SEMA11QU]: [
        //2.5 2.5 2.5
        {
            allowedStates: [],
            variantPharmacy: {
                variantIndex: 54,
                pharmacy: 'boothwyn',
            },
        },
        {
            allowedStates: [
                USStates.Colorado,
                USStates.Florida,
                USStates.Illinois,
                USStates.Indiana,
                USStates.Michigan,
                USStates.NewJersey,
                USStates.NorthCarolina,
                USStates.Ohio,
                USStates.Pennsylvania,
                USStates.Texas,
                USStates.Virginia,
                USStates.Washington,
            ],
            variantPharmacy: {
                variantIndex: 10,
                pharmacy: PHARMACY.EMPOWER,
            },
        },
    ],

    [EquivalenceCodes.SEMA12BIAN]: [
        //2.5 x 6 bian
        {
            allowedStates: [
                // USStates.Colorado,
                // USStates.Florida,
                // USStates.Illinois,
                // USStates.Indiana,
                // USStates.NewJersey,
                // USStates.NorthCarolina,
                // USStates.Ohio,
                // USStates.Pennsylvania,
                // USStates.Texas,
                // USStates.Virginia,
                // USStates.Washington,
            ],
            variantPharmacy: {
                variantIndex: 15,
                pharmacy: 'hallandale',
            },
        },
        {
            allowedStates: [
                USStates.Colorado,
                USStates.Florida,
                USStates.Illinois,
                USStates.Indiana,
                USStates.NewJersey,
                USStates.NorthCarolina,
                USStates.Ohio,
                USStates.Pennsylvania,
                USStates.Texas,
                USStates.Virginia,
                USStates.Washington,
                USStates.Michigan,
            ],
            variantPharmacy: {
                variantIndex: 64,
                pharmacy: PHARMACY.REVIVE,
            },
        },
    ],

    [EquivalenceCodes.SEMA13BIAN]: [
        {
            allowedStates: [
                // USStates.Colorado,
                // USStates.Florida,
                // USStates.Illinois,
                // USStates.Indiana,
                // USStates.NewJersey,
                // USStates.NorthCarolina,
                // USStates.Ohio,
                // USStates.Pennsylvania,
                // USStates.Texas,
                // USStates.Virginia,
                // USStates.Washington,
            ],
            variantPharmacy: {
                variantIndex: 16,
                pharmacy: 'hallandale',
            },
        },
        {
            allowedStates: [
                USStates.Colorado,
                USStates.Florida,
                USStates.Illinois,
                USStates.Indiana,
                USStates.NewJersey,
                USStates.NorthCarolina,
                USStates.Ohio,
                USStates.Pennsylvania,
                USStates.Texas,
                USStates.Virginia,
                USStates.Washington,
                USStates.Michigan,
            ],
            variantPharmacy: {
                variantIndex: 66,
                pharmacy: PHARMACY.REVIVE,
            },
        },
    ],

    [EquivalenceCodes.SEMA14BIAN]: [
        {
            allowedStates: [
                USStates.Colorado,
                USStates.Florida,
                USStates.Illinois,
                USStates.Indiana,
                USStates.NewJersey,
                USStates.NorthCarolina,
                USStates.Ohio,
                USStates.Pennsylvania,
                USStates.Texas,
                USStates.Virginia,
                USStates.Washington,
            ],
            variantPharmacy: {
                variantIndex: 17,
                pharmacy: 'hallandale',
            },
        },
    ],

    [EquivalenceCodes.SEMA15BIAN]: [
        {
            allowedStates: [
                // USStates.Colorado,
                // USStates.Florida,
                // USStates.Illinois,
                // USStates.Indiana,
                // USStates.NewJersey,
                // USStates.NorthCarolina,
                // USStates.Ohio,
                // USStates.Pennsylvania,
                // USStates.Texas,
                // USStates.Virginia,
                // USStates.Washington,
            ],
            variantPharmacy: {
                variantIndex: 18,
                pharmacy: 'hallandale',
            },
        },
        {
            allowedStates: [
                USStates.Colorado,
                USStates.Florida,
                USStates.Illinois,
                USStates.Indiana,
                USStates.NewJersey,
                USStates.NorthCarolina,
                USStates.Ohio,
                USStates.Pennsylvania,
                USStates.Texas,
                USStates.Virginia,
                USStates.Washington,
                USStates.Michigan,
            ],
            variantPharmacy: {
                variantIndex: 68,
                pharmacy: PHARMACY.REVIVE,
            },
        },
    ],

    [EquivalenceCodes.SEMA16BIAN]: [
        {
            allowedStates: [
                // USStates.Colorado,
                // USStates.Florida,
                // USStates.Illinois,
                // USStates.Indiana,
                // USStates.NewJersey,
                // USStates.NorthCarolina,
                // USStates.Ohio,
                // USStates.Pennsylvania,
                // USStates.Texas,
                // USStates.Virginia,
                // USStates.Washington,
            ],
            variantPharmacy: {
                variantIndex: 19,
                pharmacy: 'hallandale',
            },
        },
        {
            allowedStates: [
                USStates.Colorado,
                USStates.Florida,
                USStates.Illinois,
                USStates.Indiana,
                USStates.NewJersey,
                USStates.NorthCarolina,
                USStates.Ohio,
                USStates.Pennsylvania,
                USStates.Texas,
                USStates.Virginia,
                USStates.Washington,
                USStates.Michigan,
            ],
            variantPharmacy: {
                variantIndex: 70,
                pharmacy: PHARMACY.REVIVE,
            },
        },
    ],

    [EquivalenceCodes.SEMA17BIAN]: [
        {
            allowedStates: [
                USStates.Colorado,
                USStates.Florida,
                USStates.Illinois,
                USStates.Indiana,
                USStates.NewJersey,
                USStates.NorthCarolina,
                USStates.Ohio,
                USStates.Pennsylvania,
                USStates.Texas,
                USStates.Virginia,
                USStates.Washington,
                USStates.Michigan,
            ],
            variantPharmacy: {
                variantIndex: 72,
                pharmacy: PHARMACY.REVIVE,
            },
        },
    ],

    [EquivalenceCodes.SEMA18BIAN]: [
        {
            allowedStates: [
                USStates.Colorado,
                USStates.Florida,
                USStates.Illinois,
                USStates.Indiana,
                USStates.NewJersey,
                USStates.NorthCarolina,
                USStates.Ohio,
                USStates.Pennsylvania,
                USStates.Texas,
                USStates.Virginia,
                USStates.Washington,
                USStates.Michigan,
            ],
            variantPharmacy: {
                variantIndex: 74,
                pharmacy: PHARMACY.REVIVE,
            },
        },
    ],

    [EquivalenceCodes.SEMA18ANN]: [
        {
            allowedStates: [
                USStates.Colorado,
                USStates.Florida,
                USStates.Illinois,
                USStates.Indiana,
                USStates.NewJersey,
                USStates.NorthCarolina,
                USStates.Ohio,
                USStates.Pennsylvania,
                USStates.Texas,
                USStates.Virginia,
                USStates.Washington,
            ],
            variantPharmacy: {
                variantIndex: 37,
                pharmacy: 'hallandale',
            },
        },
    ],

    [EquivalenceCodes.SEMA19ANN]: [
        {
            allowedStates: [
                USStates.Colorado,
                USStates.Florida,
                USStates.Illinois,
                USStates.Indiana,
                USStates.NewJersey,
                USStates.NorthCarolina,
                USStates.Ohio,
                USStates.Pennsylvania,
                USStates.Texas,
                USStates.Virginia,
                USStates.Washington,
            ],
            variantPharmacy: {
                variantIndex: 39,
                pharmacy: 'hallandale',
            },
        },
    ],

    [EquivalenceCodes.SEMA20ANN]: [
        {
            allowedStates: [
                USStates.Colorado,
                USStates.Florida,
                USStates.Illinois,
                USStates.Indiana,
                USStates.NewJersey,
                USStates.NorthCarolina,
                USStates.Ohio,
                USStates.Pennsylvania,
                USStates.Texas,
                USStates.Virginia,
                USStates.Washington,
            ],
            variantPharmacy: {
                variantIndex: 41,
                pharmacy: 'hallandale',
            },
        },
    ],

    /**
     * Tirzepatide
     */
    [EquivalenceCodes.TIRZ1MO]: [
        //2.5 mg
        {
            allowedStates: [
                USStates.California,
                USStates.Colorado,
                USStates.Florida,
                USStates.Illinois,
                USStates.Indiana,
                USStates.Michigan,
                USStates.NewJersey,
                USStates.NorthCarolina,
                USStates.Ohio,
                USStates.Pennsylvania,
                USStates.Texas,
                USStates.Virginia,
                USStates.Washington,
            ],
            variantPharmacy: {
                variantIndex: 42,
                pharmacy: 'boothwyn',
            },
        },
    ],

    [EquivalenceCodes.TIRZ2MO]: [
        //5 mg
        {
            allowedStates: [
                USStates.California,
                USStates.Colorado,
                USStates.Florida,
                USStates.Illinois,
                USStates.Indiana,
                USStates.Michigan,
                USStates.NewJersey,
                USStates.NorthCarolina,
                USStates.Ohio,
                USStates.Pennsylvania,
                USStates.Texas,
                USStates.Virginia,
                USStates.Washington,
            ],
            variantPharmacy: {
                variantIndex: 43,
                pharmacy: 'boothwyn',
            },
        },
    ],

    [EquivalenceCodes.TIRZ3MO]: [
        //7.5 mg
        {
            allowedStates: [USStates.California],
            variantPharmacy: {
                variantIndex: 44,
                pharmacy: PHARMACY.BOOTHWYN,
            },
        },
        {
            allowedStates: [
                USStates.Colorado,
                USStates.Florida,
                USStates.Illinois,
                USStates.Indiana,
                USStates.Michigan,
                USStates.NewJersey,
                USStates.NorthCarolina,
                USStates.Ohio,
                USStates.Pennsylvania,
                USStates.Texas,
                USStates.Virginia,
                USStates.Washington,
            ],
            variantPharmacy: {
                variantIndex: 5,
                pharmacy: PHARMACY.EMPOWER,
            },
        },
    ],

    [EquivalenceCodes.TIRZ4MO]: [
        //10 mg
        {
            allowedStates: [
                USStates.California,
                USStates.Colorado,
                USStates.Florida,
                USStates.Illinois,
                USStates.Indiana,
                USStates.Michigan,
                USStates.NewJersey,
                USStates.NorthCarolina,
                USStates.Ohio,
                USStates.Pennsylvania,
                USStates.Texas,
                USStates.Virginia,
                USStates.Washington,
            ],
            variantPharmacy: {
                variantIndex: 45,
                pharmacy: 'boothwyn',
            },
        },
    ],

    [EquivalenceCodes.TIRZ5MO]: [
        //12.5 mg
        {
            allowedStates: [
                USStates.California,
                USStates.Colorado,
                USStates.Florida,
                USStates.Illinois,
                USStates.Indiana,
                USStates.Michigan,
                USStates.NewJersey,
                USStates.NorthCarolina,
                USStates.Ohio,
                USStates.Pennsylvania,
                USStates.Texas,
                USStates.Virginia,
                USStates.Washington,
            ],
            variantPharmacy: {
                variantIndex: 46,
                pharmacy: PHARMACY.BOOTHWYN,
            },
        },
    ],

    [EquivalenceCodes.TIRZ6QU]: [
        //(2.5, 5, 5) MG Dosing Quarterly
        {
            allowedStates: [],
            variantPharmacy: {
                variantIndex: 35,
                pharmacy: 'boothwyn',
            },
        },
        {
            allowedStates: [
                USStates.Colorado,
                USStates.Florida,
                USStates.Illinois,
                USStates.Indiana,
                USStates.Michigan,
                USStates.NewJersey,
                USStates.NorthCarolina,
                USStates.Ohio,
                USStates.Pennsylvania,
                USStates.Texas,
                USStates.Virginia,
                USStates.Washington,
            ],
            variantPharmacy: {
                variantIndex: 6,
                pharmacy: PHARMACY.EMPOWER,
            },
        },
    ],

    /**
     * Q 5-5-5 may be deprecated and not offered on site anymore.
     */
    [EquivalenceCodes.TIRZ7QU]: [
        //(5, 5, 5) MG Dosing Quarterly
        {
            allowedStates: [],
            variantPharmacy: {
                variantIndex: 17,
                pharmacy: 'hallandale',
            },
        },
    ],

    /**
     * Q 5-5-7.5 may be deprecated and not offered on site anymore.
     */
    [EquivalenceCodes.TIRZ8QU]: [
        //(5, 5, 7.5) MG Dosing Quarterly
        {
            allowedStates: [],
            variantPharmacy: {
                variantIndex: 19,
                pharmacy: 'hallandale',
            },
        },
    ],

    [EquivalenceCodes.TIRZ9QU]: [
        //(5, 7.5, 7.5) MG Dosing Quarterly
        {
            allowedStates: [],
            variantPharmacy: {
                variantIndex: 36,
                pharmacy: PHARMACY.BOOTHWYN,
            },
        },
        {
            allowedStates: [
                USStates.Colorado,
                USStates.Florida,
                USStates.Illinois,
                USStates.Indiana,
                USStates.Michigan,
                USStates.NewJersey,
                USStates.NorthCarolina,
                USStates.Ohio,
                USStates.Pennsylvania,
                USStates.Texas,
                USStates.Virginia,
                USStates.Washington,
            ],
            variantPharmacy: {
                variantIndex: 8,
                pharmacy: PHARMACY.EMPOWER,
            },
        },
    ],

    [EquivalenceCodes.TIRZ10QU]: [
        //(7.5, 7.5, 7.5) MG Dosing Quarterly
        {
            allowedStates: [],
            variantPharmacy: {
                variantIndex: 37,
                pharmacy: PHARMACY.BOOTHWYN,
            },
        },
        {
            allowedStates: [
                USStates.Colorado,
                USStates.Florida,
                USStates.Illinois,
                USStates.Indiana,
                USStates.Michigan,
                USStates.NewJersey,
                USStates.NorthCarolina,
                USStates.Ohio,
                USStates.Pennsylvania,
                USStates.Texas,
                USStates.Virginia,
                USStates.Washington,
            ],
            variantPharmacy: {
                variantIndex: 9,
                pharmacy: PHARMACY.EMPOWER,
            },
        },
    ],

    [EquivalenceCodes.TIRZ11QU]: [
        //(10, 10, 10) MG Dosing Quarterly
        {
            allowedStates: [],
            variantPharmacy: {
                variantIndex: 38,
                pharmacy: PHARMACY.BOOTHWYN,
            },
        },
        {
            allowedStates: [
                USStates.California,
                USStates.Colorado,
                USStates.Florida,
                USStates.Illinois,
                USStates.Indiana,
                USStates.Michigan,
                USStates.NewJersey,
                USStates.NorthCarolina,
                USStates.Ohio,
                USStates.Pennsylvania,
                USStates.Texas,
                USStates.Virginia,
                USStates.Washington,
            ],
            variantPharmacy: {
                variantIndex: 28,
                pharmacy: PHARMACY.EMPOWER,
            },
        },
    ],

    [EquivalenceCodes.TIRZ12QU]: [
        //(12.5, 12.5, 12.5) MG Dosing Quarterly
        {
            allowedStates: [],
            variantPharmacy: {
                variantIndex: 39,
                pharmacy: PHARMACY.BOOTHWYN,
            },
        },
        {
            allowedStates: [
                USStates.Colorado,
                USStates.Florida,
                USStates.Illinois,
                USStates.Indiana,
                USStates.Michigan,
                USStates.NewJersey,
                USStates.NorthCarolina,
                USStates.Ohio,
                USStates.Pennsylvania,
                USStates.Texas,
                USStates.Virginia,
                USStates.Washington,
            ],
            variantPharmacy: {
                variantIndex: 29,
                pharmacy: PHARMACY.EMPOWER,
            },
        },
    ],

    [EquivalenceCodes.TIRZ13BIAN]: [
        {
            allowedStates: [
                // USStates.Colorado,
                // USStates.Florida,
                // USStates.Illinois,
                // USStates.Indiana,
                // USStates.NewJersey,
                // USStates.NorthCarolina,
                // USStates.Ohio,
                // USStates.Pennsylvania,
                // USStates.Texas,
                // USStates.Virginia,
                // USStates.Washington,
            ],
            variantPharmacy: {
                variantIndex: 24,
                pharmacy: 'hallandale',
            },
        },
        {
            allowedStates: [
                USStates.Colorado,
                USStates.Florida,
                USStates.Illinois,
                USStates.Indiana,
                USStates.NewJersey,
                USStates.NorthCarolina,
                USStates.Ohio,
                USStates.Pennsylvania,
                USStates.Texas,
                USStates.Virginia,
                USStates.Washington,
                USStates.Michigan,
            ],
            variantPharmacy: {
                variantIndex: 57,
                pharmacy: PHARMACY.REVIVE,
            },
        },
    ],

    [EquivalenceCodes.TIRZ14BIAN]: [
        {
            allowedStates: [
                USStates.Colorado,
                USStates.Florida,
                USStates.Illinois,
                USStates.Indiana,
                USStates.NewJersey,
                USStates.NorthCarolina,
                USStates.Ohio,
                USStates.Pennsylvania,
                USStates.Texas,
                USStates.Virginia,
                USStates.Washington,
            ],
            variantPharmacy: {
                variantIndex: 25,
                pharmacy: 'hallandale',
            },
        },
    ],

    [EquivalenceCodes.TIRZ15BIAN]: [
        {
            allowedStates: [
                // USStates.Colorado,
                // USStates.Florida,
                // USStates.Illinois,
                // USStates.Indiana,
                // USStates.NewJersey,
                // USStates.NorthCarolina,
                // USStates.Ohio,
                // USStates.Pennsylvania,
                // USStates.Texas,
                // USStates.Virginia,
                // USStates.Washington,
            ],
            variantPharmacy: {
                variantIndex: 27,
                pharmacy: 'hallandale',
            },
        },
        {
            allowedStates: [
                USStates.Colorado,
                USStates.Florida,
                USStates.Illinois,
                USStates.Indiana,
                USStates.NewJersey,
                USStates.NorthCarolina,
                USStates.Ohio,
                USStates.Pennsylvania,
                USStates.Texas,
                USStates.Virginia,
                USStates.Washington,
                USStates.Michigan,
            ],
            variantPharmacy: {
                variantIndex: 59,
                pharmacy: PHARMACY.REVIVE,
            },
        },
    ],

    [EquivalenceCodes.TIRZ16ANN]: [
        {
            allowedStates: [
                USStates.Colorado,
                USStates.Florida,
                USStates.Illinois,
                USStates.Indiana,
                USStates.NewJersey,
                USStates.NorthCarolina,
                USStates.Ohio,
                USStates.Pennsylvania,
                USStates.Texas,
                USStates.Virginia,
                USStates.Washington,
            ],
            variantPharmacy: {
                variantIndex: 40,
                pharmacy: 'hallandale',
            },
        },
    ],
};
