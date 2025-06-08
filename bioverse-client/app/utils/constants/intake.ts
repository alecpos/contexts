import { GLP1_NAMES_TO_INDEX } from '@/app/components/provider-portal/intake-view/v2/components/intake-response-column/adjust-dosing-dialog/dosing-mappings';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import { MedicationDictionary } from '@/app/types/questionnaires/questionnaire-types';

export const MEDICATION_DICTIONARY: MedicationDictionary = {
    semaglutide: {
        lowest_dosage: {
            dosage: 0.25,
            monthly_variant_index: 2,
            bundle_variant_index: 12,
        },
        '0.25': {
            dosage: 0.25,
            monthly_variant_index: 2,
            bundle_variant_index: 12,
        },
        '0.5': {
            dosage: 0.5,
            monthly_variant_index: 13,
            bundle_variant_index: 8,
        },
        '1': {
            dosage: 1,
            monthly_variant_index: 14,
            bundle_variant_index: 9,
        },
        '1.25': {
            dosage: 1.25,
            monthly_variant_index: 14,
            bundle_variant_index: 7,
        },
        '1.75': {
            dosage: 1.75,
            monthly_variant_index: 5,
            bundle_variant_index: 10,
        },
        '2.5': {
            dosage: 2.5,
            monthly_variant_index: 5,
            bundle_variant_index: 10,
        },
    },
    tirzepatide: {
        lowest_dosage: {
            dosage: 2.5,
            monthly_variant_index: 3,
            bundle_variant_index: 6,
        },
        '2.5': {
            dosage: 2.5,
            monthly_variant_index: 3,
            bundle_variant_index: 6,
        },
        '5': {
            dosage: 5,
            monthly_variant_index: 4,
            bundle_variant_index: 8,
        },
        '7.5': {
            dosage: 7.5,
            monthly_variant_index: 5,
            bundle_variant_index: 9,
        },
        '10': {
            dosage: 10,
            monthly_variant_index: 15,
            bundle_variant_index: 12,
        },
        '12.5': {
            dosage: 12.5,
            monthly_variant_index: 11,
            bundle_variant_index: 13,
        },
    },
};

//DosageInfoV3 should eventually be combined with DosageInfo once all intake constants are consolidated
export type DosageInfoV3 = {
    dosage: number;
    monthly_variant_index: number;
    bundle_variant_index: number;
    biannual_variant_index?: number;
    annual_variant_index?: number;
};

//Should also be combined with MedicationDictionary
export type MedicationDictionaryV3 = {
    [PRODUCT_HREF.SEMAGLUTIDE]: {
        [key: string]: DosageInfoV3;
    };
    [PRODUCT_HREF.TIRZEPATIDE]: {
        [key: string]: DosageInfoV3;
    };
    [PRODUCT_HREF.METFORMIN]: {
        [key: string]: DosageInfoV3;
    };
    [PRODUCT_HREF.WL_CAPSULE]: {
        [key: string]: DosageInfoV3;
    };
};

export const MEDICATION_DICTIONARY_V3: MedicationDictionaryV3 = {
    semaglutide: {
        lowest_dosage: {
            dosage: 0.25,
            monthly_variant_index: 2,
            bundle_variant_index: 6,
            biannual_variant_index: 68,
            annual_variant_index: 37,
        },
        '0.25': {
            dosage: 0.25,
            monthly_variant_index: 2,
            bundle_variant_index: 6,
            biannual_variant_index: 68,
            annual_variant_index: 37,
        },
        '0.5': {
            dosage: 0.5,
            monthly_variant_index: 13,
            bundle_variant_index: 8,
            biannual_variant_index: 70,
            annual_variant_index: 39,
        },
        '1': {
            dosage: 1,
            monthly_variant_index: 14,
            bundle_variant_index: 21,
            biannual_variant_index: 72,
        },
        '1.25': {
            dosage: 1.25,
            monthly_variant_index: 14,
            bundle_variant_index: 21,
            biannual_variant_index: 72,
            annual_variant_index: 41,
        },
        '1.75': {
            dosage: 1.75,
            monthly_variant_index: 5,
            bundle_variant_index: 10,
        },
        '2.5': {
            dosage: 2.5,
            monthly_variant_index: 5,
            bundle_variant_index: 10,
        },
    },
    tirzepatide: {
        lowest_dosage: {
            dosage: 2.5,
            monthly_variant_index: 3,
            bundle_variant_index: 6,
            biannual_variant_index: 59,
            //annual_variant_index: 40,
        },
        '2.5': {
            dosage: 2.5,
            monthly_variant_index: 3,
            bundle_variant_index: 6,
            biannual_variant_index: 59,
            //annual_variant_index: 40,
        },
        '5': {
            dosage: 5,
            monthly_variant_index: 4,
            bundle_variant_index: 8,
        },
        '7.5': {
            dosage: 7.5,
            monthly_variant_index: 5,
            bundle_variant_index: 9,
        },
        '10': {
            dosage: 10,
            monthly_variant_index: 10,
            bundle_variant_index:
                GLP1_NAMES_TO_INDEX.TIRZEPATIDE_QUARTERLY_136_MG_EMPOWER,
            //biannual_variant_index: 25, //hallandale no longer offers tirzep
        },
        '12.5': {
            dosage: 12.5,
            monthly_variant_index: 11,
            bundle_variant_index:
                GLP1_NAMES_TO_INDEX.TIRZEPATIDE_QUARTERLY_170_MG_EMPOWER,
        },
    },
    metformin: {
        lowest_dosage: {
            dosage: 1000,
            monthly_variant_index: -1,
            bundle_variant_index: 0,
        },
    },
    [PRODUCT_HREF.WL_CAPSULE]: {
        lowest_dosage: {
            dosage: 10,
            monthly_variant_index: 0,
            bundle_variant_index: 1,
        },
    },
};

interface MedicationDictionaryV3CrossMap {
    [key: string]: {
        [key: string]: {
            dosage: number;
            monthly_variant_index: number;
            bundle_variant_index: number;
            biannual_variant_index?: number;
            annual_variant_index?: number;
        };
    };
}

/**
 * For the keys, the first key is the medication they are requesting.
 * The second key of the string is the dosage they got for the OPPOSITE medication.
 */
export const MEDICATION_DICTIONARY_V3_CROSS_MAP: MedicationDictionaryV3CrossMap =
    {
        [PRODUCT_HREF.SEMAGLUTIDE]: {
            '2.5': {
                //2.5 mg tirzepatide = 0.5 mg semaglutide
                dosage: 0.5,
                monthly_variant_index: 13,
                bundle_variant_index: 8,
                biannual_variant_index: 19,
                annual_variant_index: 39,
            },
            '5': {
                //5 mg tirzepatide = 1.25 mg semaglutide
                dosage: 1.25,
                monthly_variant_index: 14,
                bundle_variant_index: 21,
                biannual_variant_index: 20,
                annual_variant_index: 41,
            },
            '7.5': {
                //7.5 mg tirzepatide = 1.25 mg semaglutide
                dosage: 1.25,
                monthly_variant_index: 14,
                bundle_variant_index: 21,
                biannual_variant_index: 20,
                annual_variant_index: 41,
            },
            '10': {
                //10 mg tirzepatide = 2.5 mg semaglutide
                dosage: 2.5,
                monthly_variant_index: 5,
                bundle_variant_index: 10,
            },
            '12.5': {
                //12.5 mg tirzepatide = 2.5 mg semaglutide
                dosage: 2.5,
                monthly_variant_index: 5,
                bundle_variant_index: 10,
            },
        },
        [PRODUCT_HREF.TIRZEPATIDE]: {
            '0.25': {
                //0.25 mg semaglutide = 2.5 mg tirzepatide
                dosage: 2.5,
                monthly_variant_index: 3,
                bundle_variant_index: 6,
                //biannual_variant_index: 27,
                //annual_variant_index: 40,
            },
            '0.5': {
                //0.5 mg semaglutide = 5 mg tirzepatide
                dosage: 5,
                monthly_variant_index: 4,
                bundle_variant_index: 8,
            },
            '0.75': {
                //0.75 mg semaglutide = 5 mg tirzepatide
                dosage: 5,
                monthly_variant_index: 4,
                bundle_variant_index: 8,
            },
            '1': {
                //1 mg semaglutide = 7.5 mg tirzepatide
                dosage: 7.5,
                monthly_variant_index: 5,
                bundle_variant_index: 9,
            },
            '1.25': {
                //1.25 mg semaglutide = 7.5 mg tirzepatide
                dosage: 7.5,
                monthly_variant_index: 5,
                bundle_variant_index: 9,
            },
            '1.75': {
                //1.75 mg semaglutide = 7.5 mg tirzepatide
                dosage: 7.5,
                monthly_variant_index: 5,
                bundle_variant_index: 9,
            },
            '2.5': {
                //2.5 mg semaglutide = 10 mg tirzepatide
                dosage: 10,
                monthly_variant_index: 10,
                bundle_variant_index:
                    GLP1_NAMES_TO_INDEX.TIRZEPATIDE_QUARTERLY_136_MG_EMPOWER,
                //biannual_variant_index: 25,
            },
        },
    };
