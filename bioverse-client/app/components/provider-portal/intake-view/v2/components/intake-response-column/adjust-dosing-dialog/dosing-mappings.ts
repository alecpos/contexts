import {
    PRODUCT_NAME,
    PRODUCT_HREF,
} from '@/app/types/global/product-enumerator';

export enum SEMAGLUTIDE_DOSAGE {
    MINIMUM = 0.25,
    _0_25 = 0.25,
    _0_5 = 0.5,
    _1 = 1,
    _1_25 = 1.25,
    _2_5 = 2.5,
    MAXIMUM = 2.5,
}

export enum TIRZEPATIDE_DOSAGE {
    MINIMUM = 2.5,
    _2_5 = 2.5,
    _5 = 5,
    _7_5 = 7.5,
    _10 = 10,
    _12_5 = 12.5,
    MAXIMUM = 12.5,
}

export enum METFORMIN_DOSAGE {
    MINIMUM = 1000,
}

export enum WEIGHTLOSS_CAPSULE_DOSAGE {
    MINIMUM = 1,
}

export const DosageRanges = {
    [PRODUCT_HREF.SEMAGLUTIDE]: {
        minimum: SEMAGLUTIDE_DOSAGE.MINIMUM,
        maximum: SEMAGLUTIDE_DOSAGE.MAXIMUM,
    },
    [PRODUCT_HREF.TIRZEPATIDE]: {
        minimum: TIRZEPATIDE_DOSAGE.MINIMUM,
        maximum: TIRZEPATIDE_DOSAGE.MAXIMUM,
    },
};

// Specific types for SEMAGLUTIDE and TIRZEPATIDE mappings
// type SemaglutideMapping = DosageMapping<SEMAGLUTIDE_DOSAGE>;
// type TirzepatideMapping = DosageMapping<TIRZEPATIDE_DOSAGE>;

// Type for variantIndexToDosageMappings
// export type VariantIndexToDosageMappings = {
//     [PRODUCT_HREF.SEMAGLUTIDE]: SemaglutideMapping;
//     [PRODUCT_HREF.TIRZEPATIDE]: TirzepatideMapping;
// };

// Maps variant_index ->
// export const variantIndexToDosageMappings: VariantIndexToDosageMappings = {
//     [PRODUCT_HREF.SEMAGLUTIDE]: {
//         0: SEMAGLUTIDE_DOSAGE._0_25,
//         1: SEMAGLUTIDE_DOSAGE._2_5,
//         2: SEMAGLUTIDE_DOSAGE._0_25,
//         3: SEMAGLUTIDE_DOSAGE._0_5,
//         4: SEMAGLUTIDE_DOSAGE._1_25,
//         5: SEMAGLUTIDE_DOSAGE._2_5,
//         6: SEMAGLUTIDE_DOSAGE._0_25, // 8.5mg bundle
//         7: SEMAGLUTIDE_DOSAGE._1_25, // 15mg bundle
//         8: SEMAGLUTIDE_DOSAGE._0_5, // 20mg bundle
//         9: SEMAGLUTIDE_DOSAGE._1_25, // 30mg bundle
//         10: SEMAGLUTIDE_DOSAGE._2_5, // 37.5mg bundle
//         11: SEMAGLUTIDE_DOSAGE._0_5, // 7.5mg bundle
//         12: SEMAGLUTIDE_DOSAGE._0_25, // 10mg bundle
//         13: SEMAGLUTIDE_DOSAGE._0_5,
//         14: SEMAGLUTIDE_DOSAGE._1_25,
//     },
//     [PRODUCT_HREF.TIRZEPATIDE]: {
//         0: TIRZEPATIDE_DOSAGE._2_5,
//         1: TIRZEPATIDE_DOSAGE._2_5,
//         2: TIRZEPATIDE_DOSAGE._2_5,
//         3: TIRZEPATIDE_DOSAGE._2_5,
//         4: TIRZEPATIDE_DOSAGE._5,
//         5: TIRZEPATIDE_DOSAGE._7_5,
//         6: TIRZEPATIDE_DOSAGE._2_5, // 60mg regular
//         7: TIRZEPATIDE_DOSAGE._5, // 60mg maintain
//         8: TIRZEPATIDE_DOSAGE._5, // 88mg bundle?
//         9: TIRZEPATIDE_DOSAGE._7_5, // 102mg bundle?
//         10: TIRZEPATIDE_DOSAGE._10,
//         11: TIRZEPATIDE_DOSAGE._12_5,
//         13: TIRZEPATIDE_DOSAGE._12_5, // 150mg bundle empower
//         14: TIRZEPATIDE_DOSAGE._2_5,
//         15: TIRZEPATIDE_DOSAGE._10,
//         16: TIRZEPATIDE_DOSAGE._2_5, // 50mg bundle
//         17: TIRZEPATIDE_DOSAGE._5, // 60mg regular
//         18: TIRZEPATIDE_DOSAGE._5, // 60 mg maintain
//         19: TIRZEPATIDE_DOSAGE._5, // 70mg
//         20: TIRZEPATIDE_DOSAGE._7_5, // 90mg
//         21: TIRZEPATIDE_DOSAGE._10, //120mg
//         22: TIRZEPATIDE_DOSAGE._12_5, // 150mg hallandale
//         23: TIRZEPATIDE_DOSAGE._12_5,
//     },
// };

// type Sig = {
//     header: string;
//     description: string;
// };

// export type DosageInfoMap = {
//     sigs: Sig[];
//     dosage: SEMAGLUTIDE_DOSAGE | TIRZEPATIDE_DOSAGE; // Union of dosages
// };

// type DosageToSigMappings = {
//     [PRODUCT_HREF.SEMAGLUTIDE]: {
//         [key in SEMAGLUTIDE_DOSAGE]: DosageInfoMap;
//     };
//     [PRODUCT_HREF.TIRZEPATIDE]: {
//         [key in TIRZEPATIDE_DOSAGE]: DosageInfoMap;
//     };
// };

export enum DOSING_TYPE {
    DECREASE = 'decrease',
    MAINTAIN = 'maintain',
    INCREASE = 'increase',
}

export type SigDetails = {
    sig: string;
    dosage: SEMAGLUTIDE_DOSAGE | TIRZEPATIDE_DOSAGE;
    enabled: boolean;
};

/**
 * What this is:
 * Type to let us index these particular variants inside the data structure they are used
 */
export type EnabledSemaglutideVariantIndexes =
    | 6
    | 7
    | 8
    | 9
    | 10
    | 12
    | 28
    | 29;
export type EnabledTirzepatideVariantIndexes =
    | 6
    | 7
    | 8
    | 9
    | 12
    | 13
    | 28
    | 29;

export type DosageMapping = {
    [key in DOSING_TYPE]?: SigDetails;
};

export type SigGeneralType = {
    [variantIndex: number]: {
        [month: number]: DosageMapping;
    };
};

export type GLP1_MAPPINGS = {
    [productHref: string]: SigGeneralType;
};

export enum GLP1_NAMES_TO_INDEX {
    // Semaglutide
    // Monthly
    SEMAGLUTIDE_MONTHLY_0_25_MG_EMPOWER_DEPRECATED = 0,
    SEMAGLUTIDE_MONTHLY_0_25_MG_EMPOWER = 2,
    SEMAGLUTIDE_MONTHLY_0_5_MG_EMPOWER = 3,
    SEMAGLUTIDE_MONTHLY_1_25_MG_EMPOWER = 4,
    SEMAGLUTIDE_MONTHLY_2_5_MG_EMPOWER = 5,
    SEMAGLUTIDE_MONTHLY_0_5_MG_HALLANDALE = 13,
    SEMAGLUTIDE_MONTHLY_1_25_MG_HALLANDALE = 14,
    SEMAGLUTIDE_MONTHLY_0_25_MG_BOOTHWYN = 22,
    SEMAGLUTIDE_MONTHLY_0_5_MG_BOOTHWYN = 23,
    SEMAGLUTIDE_MONTHLY_1_25_MG_BOOTHWYN = 24,
    SEMAGLUTIDE_MONTHLY_2_5_MG_BOOTHWYN_GLYCINE_B12 = 48,
    SEMAGLUTIDE_MONTHLY_1_25_MG_BOOTHWYN_GLYCINE_B12 = 47,
    SEMAGLUTIDE_MONTHLY_0_5_MG_BOOTHWYN_GLYCINE_B12 = 46,
    SEMAGLUTIDE_MONTHLY_0_25_MG_BOOTHWYN_GLYCINE_B12 = 45,
    SEMAGLUTIDE_MONTHLY_2_5_MG_BOOTHWYN = 25,
    SEMAGLUTIDE_MONTHLY_2_5_MG_REVIVE = 32,
    // Quarterly
    SEMAGLUTIDE_QUARTERLY_8_5_MG_EMPOWER = 6,
    SEMAGLUTIDE_QUARTERLY_15_MG_EMPOWER = 7,
    SEMAGLUTIDE_QUARTERLY_20_MG_EMPOWER = 8,
    SEMAGLUTIDE_QUARTERLY_30_MG_EMPOWER = 9,
    SEMAGLUTIDE_QUARTERLY_37_5_MG_EMPOWER = 10,
    SEMAGLUTIDE_QUARTERLY_7_5_MG_HALLANDALE = 11,
    SEMAGLUTIDE_QUARTERLY_10_MG_HALLANDALE = 12,
    SEMAGLUTIDE_QUARTERLY_22_5_MG_EMPOWER = 21,
    SEMAGLUTIDE_QUARTERLY_8_MG_BOOTHWYN = 26,
    SEMAGLUTIDE_QUARTERLY_15_MG_BOOTHWYN = 27,
    SEMAGLUTIDE_QUARTERLY_17_MG_BOOTHWYN = 28,
    SEMAGLUTIDE_QUARTERLY_25_MG_BOOTHWYN = 29,
    SEMAGLUTIDE_QUARTERLY_30_MG_BOOTHWYN = 30,
    SEMAGLUTIDE_QUARTERLY_20_MG_BOOTHWYN = 31,
    SEMAGLUTIDE_QUARTERLY_10_MG_REVIVE = 33,
    SEMAGLUTIDE_QUARTERLY_15_MG_REVIVE = 34,
    SEMAGLUTIDE_QUARTERLY_20_MG_REVIVE = 35,
    SEMAGLUTIDE_QUARTERLY_20_MG_0_5_STARTING_REVIVE = 36,
    SEMAGLUTIDE_QUARTERLY_20_MG_HALLANDALE = 43,
    SEMAGLUTIDE_QUARTERLY_25_MG_HALLANDALE = 44,
    // Biannually
    SEMAGLUTIDE_BIANNUALLY_7_5_MG_HALLANDALE_0_25_DOSING = 15,
    SEMAGLUTIDE_BIANNUALLY_15_MG_HALLANDALE = 16,
    SEMAGLUTIDE_BIANNUALLY_7_5_MG_HALLANDALE_1_25_DOSING = 17, // DEPRECATED
    SEMAGLUTIDE_BIANNUALLY_17_5_MG_HALLANDALE = 18,
    SEMAGLUTIDE_BIANNUALLY_37_5_MG_HALLANDALE = 19,
    SEMAGLUTIDE_BIANNUALLY_50_MG_HALLANDALE = 20,
    // Annually
    SEMAGLUTIDE_ANNUALLY_50_MG_HALLANDALE = 37,
    SEMAGLUTIDE_ANNUALLY_55_MG_HALLANDALE = 39,
    SEMAGLUTIDE_ANNUALLY_60_MG_HALLANDALE = 41,
    // Tirzepatide
    // Monthly
    TIRZEPATIDE_MONTHLY_2_5_MG_EMPOWER = 3,
    TIRZEPATIDE_MONTHLY_5_MG_EMPOWER = 4,
    TIRZEPATIDE_MONTHLY_7_5_MG_EMPOWER = 5,
    TIRZEPATIDE_MONTHLY_10_MG_EMPOWER = 10,
    TIRZEPATIDE_MONTHLY_12_5_MG_EMPOWER = 11,
    TIRZEPATIDE_MONTHLY_2_5_MG_HALLANDALE = 14,
    TIRZEPATIDE_MONTHLY_10_MG_HALLANDALE = 15,
    TIRZEPATIDE_MONTHLY_12_5_MG_HALLANDALE = 23,
    TIRZEPATIDE_MONTHLY_2_5_MG_BOOTHWYN = 30,
    TIRZEPATIDE_MONTHLY_5_MG_BOOTHWYN = 31,
    TIRZEPATIDE_MONTHLY_7_5_MG_BOOTHWYN = 32,
    TIRZEPATIDE_MONTHLY_10_MG_BOOTHWYN = 33,
    TIRZEPATIDE_MONTHLY_12_5_MG_BOOTHWYN = 34,
    // Quarterly
    TIRZEPATIDE_QUARTERLY_60_MG_EMPOWER = 6,
    TIRZEPATIDE_QUARTERLY_60_MG_CHECK_IN_EMPOWER = 7,
    TIRZEPATIDE_QUARTERLY_88_MG_EMPOWER = 8,
    TIRZEPATIDE_QUARTERLY_102_MG_EMPOWER = 9,
    TIRZEPATIDE_QUARTERLY_120_MG_EMPOWER = 12, // DEPRECATED
    TIRZEPATIDE_QUARTERLY_150_MG_EMPOWER = 13, // DEPRECATED
    TIRZEPATIDE_QUARTERLY_136_MG_EMPOWER = 28,
    TIRZEPATIDE_QUARTERLY_170_MG_EMPOWER = 29,
    TIRZEPATIDE_QUARTERLY_50_MG_HALLANDALE = 16,
    TIRZEPATIDE_QUARTERLY_60_MG_HALLANDALE = 17,
    TIRZEPATIDE_QUARTERLY_60_MG_MAINTENANCE_HALLANDALE = 18,
    TIRZEPATIDE_QUARTERLY_70_MG_HALLANDALE = 19,
    TIRZEPATIDE_QUARTERLY_90_MG_HALLANDALE = 20,
    TIRZEPATIDE_QUARTERLY_120_MG_HALLANDALE = 21, // DEPRECATED
    TIRZEPATIDE_QUARTERLY_150_MG_HALLANDALE = 22, // DEPRECATED
    TIRZEPATIDE_QUARTERLY_50_MG_BOOTHWYN = 35,
    TIRZEPATIDE_QUARTERLY_80_MG_BOOTHWYN = 36,
    TIRZEPATIDE_QUARTERLY_90_MG_BOOTHWYN = 37,
    TIRZEPATIDE_QUARTERLY_120_MG_BOOTHWYN = 38,
    TIRZEPATIDE_QUARTERLY_150_MG_BOOTHWYN = 39,
    // Biannually
    TIRZEPATIDE_BIANNUALLY_60_MG_HALLANDALE = 24,
    TIRZEPATIDE_BIANNUALLY_240_MG_HALLANDALE = 25,
    TIRZEPATIDE_BIANNUALLY_140_MG_HALLANDALE = 26, // DEPRECATED
    TIRZEPATIDE_BIANNUALLY_90_MG_HALLANDALE = 27,

    // Annually
    TIRZEPATIDE_ANNUALLY_180_MG_HALLANDALE = 40,

    TIRZEPATIDE_BOOTHWYN_NEW_,


    // tirzep 17?
    // sem 11?
    // tirzep 18?
    // tirzep 19?
    // tirzep 20?
   // tirzep 21?
   // tirzep 22?
   // tirzep 27?
   // sem 35?
   //sem 37?
   //sem 49-59

}

// Grouping monthly variant indexes together under the same dosage
/**
 * This could be refactored and combined with DosageSelectionVariantIndexToDosage in:
 * app/components/provider-portal/intake-view/v2/components/intake-response-column/approve-and-prescribe-confirmation-details/dosage-change/dosage-change-quarterly-final-review.ts
 * ...in order to have a single source of truth for the monthly dosages
 **/
export const GLP1_MONTHLY_VARIANTS_BY_PRODUCT_AND_DOSAGE = {
    [PRODUCT_HREF.SEMAGLUTIDE]: {
        [SEMAGLUTIDE_DOSAGE._0_25]: [
            GLP1_NAMES_TO_INDEX.SEMAGLUTIDE_MONTHLY_0_25_MG_EMPOWER,
            GLP1_NAMES_TO_INDEX.SEMAGLUTIDE_MONTHLY_0_25_MG_EMPOWER_DEPRECATED,
            GLP1_NAMES_TO_INDEX.SEMAGLUTIDE_MONTHLY_0_25_MG_BOOTHWYN,
            GLP1_NAMES_TO_INDEX.SEMAGLUTIDE_MONTHLY_0_25_MG_BOOTHWYN_GLYCINE_B12,
        ],
        [SEMAGLUTIDE_DOSAGE._0_5]: [
            GLP1_NAMES_TO_INDEX.SEMAGLUTIDE_MONTHLY_0_5_MG_EMPOWER,
            GLP1_NAMES_TO_INDEX.SEMAGLUTIDE_MONTHLY_0_5_MG_HALLANDALE,
            GLP1_NAMES_TO_INDEX.SEMAGLUTIDE_MONTHLY_2_5_MG_REVIVE, //this is named incorrectly because 2.5 is the total MGs not the dosage
            GLP1_NAMES_TO_INDEX.SEMAGLUTIDE_MONTHLY_0_5_MG_BOOTHWYN,
            GLP1_NAMES_TO_INDEX.SEMAGLUTIDE_MONTHLY_0_5_MG_BOOTHWYN_GLYCINE_B12,
        ],
        [SEMAGLUTIDE_DOSAGE._1_25]: [
            GLP1_NAMES_TO_INDEX.SEMAGLUTIDE_MONTHLY_1_25_MG_EMPOWER,
            GLP1_NAMES_TO_INDEX.SEMAGLUTIDE_MONTHLY_1_25_MG_HALLANDALE,
            GLP1_NAMES_TO_INDEX.SEMAGLUTIDE_MONTHLY_1_25_MG_BOOTHWYN,
            GLP1_NAMES_TO_INDEX.SEMAGLUTIDE_MONTHLY_1_25_MG_BOOTHWYN_GLYCINE_B12,
        ],
        [SEMAGLUTIDE_DOSAGE._2_5]: [
            GLP1_NAMES_TO_INDEX.SEMAGLUTIDE_MONTHLY_2_5_MG_EMPOWER,
            GLP1_NAMES_TO_INDEX.SEMAGLUTIDE_MONTHLY_2_5_MG_BOOTHWYN,
            GLP1_NAMES_TO_INDEX.SEMAGLUTIDE_MONTHLY_2_5_MG_BOOTHWYN_GLYCINE_B12,
        ],
    },
    [PRODUCT_HREF.TIRZEPATIDE]: {
        [TIRZEPATIDE_DOSAGE._2_5]: [
            GLP1_NAMES_TO_INDEX.TIRZEPATIDE_MONTHLY_2_5_MG_EMPOWER,
            GLP1_NAMES_TO_INDEX.TIRZEPATIDE_MONTHLY_2_5_MG_HALLANDALE,
            GLP1_NAMES_TO_INDEX.TIRZEPATIDE_MONTHLY_2_5_MG_BOOTHWYN,
        ],
        [TIRZEPATIDE_DOSAGE._5]: [
            GLP1_NAMES_TO_INDEX.TIRZEPATIDE_MONTHLY_5_MG_EMPOWER,
        ],
        [TIRZEPATIDE_DOSAGE._7_5]: [
            GLP1_NAMES_TO_INDEX.TIRZEPATIDE_MONTHLY_7_5_MG_EMPOWER,
            GLP1_NAMES_TO_INDEX.TIRZEPATIDE_MONTHLY_7_5_MG_BOOTHWYN,
        ],
        [TIRZEPATIDE_DOSAGE._10]: [
            GLP1_NAMES_TO_INDEX.TIRZEPATIDE_MONTHLY_10_MG_EMPOWER,
            GLP1_NAMES_TO_INDEX.TIRZEPATIDE_MONTHLY_10_MG_HALLANDALE,
            GLP1_NAMES_TO_INDEX.TIRZEPATIDE_MONTHLY_10_MG_BOOTHWYN,
        ],
        [TIRZEPATIDE_DOSAGE._12_5]: [
            GLP1_NAMES_TO_INDEX.TIRZEPATIDE_MONTHLY_12_5_MG_EMPOWER,
            GLP1_NAMES_TO_INDEX.TIRZEPATIDE_MONTHLY_12_5_MG_HALLANDALE,
            GLP1_NAMES_TO_INDEX.TIRZEPATIDE_MONTHLY_12_5_MG_BOOTHWYN,
        ],
    },
};

export const getMonthlyGlp1Dosage = (
    product_href: PRODUCT_HREF.SEMAGLUTIDE | PRODUCT_HREF.TIRZEPATIDE,
    variant_index: number
): number | undefined => {
    const productDosages =
        GLP1_MONTHLY_VARIANTS_BY_PRODUCT_AND_DOSAGE[product_href];
    if (!productDosages) return undefined;

    // Iterate through each dosage key and check if the variant_index is included
    for (const [dosage, indexes] of Object.entries(productDosages)) {
        if (indexes.includes(variant_index)) {
            return Number(dosage);
        }
    }

    return undefined;
};

//month 1 and 2 will always be the same in ADJUST_DOSING_GLP1_MAPPINGS
export const ADJUST_DOSING_GLP1_MAPPINGS: GLP1_MAPPINGS = {
    [PRODUCT_HREF.SEMAGLUTIDE]: {
        [GLP1_NAMES_TO_INDEX.SEMAGLUTIDE_QUARTERLY_8_5_MG_EMPOWER]: {
            // "dosage_adjustment_sigs": {
            //     "month_1" : {
            //         "decrease": "Inject 10 units (0.25 mg of semaglutide) subcutaneously once per week for weeks 5-8 from the Semaglutide 2 mL 2.5 mg/mL vial",
            //         "maintain": "Inject 10 units (0.25 mg of semaglutide) subcutaneously once per week for weeks 5-8 from the Semaglutide 2 mL 2.5 mg/mL vial",
            //         "increase": "Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for weeks 8-12 from the Semaglutide 2 mL 2.5 mg/mL vial"
            //     },
            //     "month_2" : {
            //         "decrease": "Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for weeks 9-12 from the Semaglutide 2 mL 2.5 mg/mL vial",
            //         "maintain": "Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for weeks 9-12 from the Semaglutide 2 mL 2.5 mg/mL vial",
            //         "increase": "Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for weeks 9-12 from the Semaglutide 2 mL 2.5 mg/mL vial"
            //     },
            //     "month_3" : {
            //         "decrease": "Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for weeks 9-12 from the Semaglutide 2 mL 2.5 mg/mL vial",
            //         "maintain": "Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for weeks 9-12 from the Semaglutide 2 mL 2.5 mg/mL vial",
            //         "increase": "Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for weeks 9-12 from the Semaglutide 2 mL 2.5 mg/mL vial"
            //     }
            // },
            1: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 10 units (0.25 mg of semaglutide) subcutaneously once per week for weeks 5-8 from the Semaglutide 2 mL 2.5 mg/mL vial',
                    dosage: SEMAGLUTIDE_DOSAGE._0_25,
                    enabled: true,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 10 units (0.25 mg of semaglutide) subcutaneously once per week for weeks 5-8 from the Semaglutide 2 mL 2.5 mg/mL vial',
                    dosage: SEMAGLUTIDE_DOSAGE._0_25,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for weeks 8-12 from the Semaglutide 2 mL 2.5 mg/mL vial',
                    dosage: SEMAGLUTIDE_DOSAGE._0_5,
                    enabled: true,
                },
            },
            2: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for weeks 9-12 from the Semaglutide 2 mL 2.5 mg/mL vial',
                    dosage: SEMAGLUTIDE_DOSAGE._0_5,
                    enabled: true,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for weeks 9-12 from the Semaglutide 2 mL 2.5 mg/mL vial',
                    dosage: SEMAGLUTIDE_DOSAGE._0_5,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for weeks 9-12 from the Semaglutide 2 mL 2.5 mg/mL vial',
                    dosage: SEMAGLUTIDE_DOSAGE._1_25,
                    enabled: true,
                },
            },
            3: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for weeks 9-12 from the Semaglutide 2 mL 2.5 mg/mL vial',
                    dosage: SEMAGLUTIDE_DOSAGE._0_5,
                    enabled: true,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for weeks 9-12 from the Semaglutide 2 mL 2.5 mg/mL vial',
                    dosage: SEMAGLUTIDE_DOSAGE._0_5,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for weeks 9-12 from the Semaglutide 2 mL 2.5 mg/mL vial',
                    dosage: SEMAGLUTIDE_DOSAGE._1_25,
                    enabled: true,
                },
            },
        },
        [GLP1_NAMES_TO_INDEX.SEMAGLUTIDE_QUARTERLY_10_MG_HALLANDALE]: {
            // Months

            // "dosage_adjustment_sigs": {
            //     "month_1" : {
            //         "decrease": "Inject 10 units (0.25 mg of semaglutide) subcutaneously once per week for weeks 5-8 from the Semaglutide 2 mL 2.5 mg/mL vial",
            //         "maintain": "Inject 10 units (0.25 mg of semaglutide) subcutaneously once per week for weeks 5-8 from the Semaglutide 2 mL 2.5 mg/mL vial",
            //         "increase": "Inject 25 units (1.25 mg of semaglutide) subcutaneously once per week for weeks 5-8 from the Semaglutide/cyanocobalamin 5/0.5 MG/ML (1 ML)"
            //     },
            //     "month_2" : {
            //         "decrease": "Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for weeks 9-12 from the Semaglutide 2 mL 2.5 mg/mL vial",
            //         "maintain": "Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for weeks 9-12 from the Semaglutide 2 mL 2.5 mg/mL vial",
            //         "increase": "Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for weeks 9-12 from the Semaglutide 2 mL 2.5 mg/mL vial"
            //     },
            //     "month_3" : {
            //         "decrease": "Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for weeks 9-12 from the Semaglutide 2 mL 2.5 mg/mL vial",
            //         "maintain": "Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for weeks 9-12 from the Semaglutide 2 mL 2.5 mg/mL vial",
            //         "increase": "Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for weeks 9-12 from the Semaglutide 2 mL 2.5 mg/mL vial"
            //     }
            // },
            
            1: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 10 units (0.25 mg of semaglutide) subcutaneously once per week for weeks 5-8 from the Semaglutide 2 mL 2.5 mg/mL vial',
                    dosage: SEMAGLUTIDE_DOSAGE._0_25,
                    enabled: true,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 10 units (0.25 mg of semaglutide) subcutaneously once per week for weeks 5-8 from the Semaglutide 2 mL 2.5 mg/mL vial',
                    dosage: SEMAGLUTIDE_DOSAGE._0_25,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for weeks 8-12 from the Semaglutide 2 mL 2.5 mg/mL vial',
                    dosage: SEMAGLUTIDE_DOSAGE._0_5,
                    enabled: true,
                },
            },
            2: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for weeks 9-12 from the Semaglutide 2 mL 2.5 mg/mL vial',
                    dosage: SEMAGLUTIDE_DOSAGE._0_5,
                    enabled: true,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for weeks 9-12 from the Semaglutide 2 mL 2.5 mg/mL vial',
                    dosage: SEMAGLUTIDE_DOSAGE._0_5,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for weeks 9-12 from the Semaglutide 2 mL 2.5 mg/mL vial',
                    dosage: SEMAGLUTIDE_DOSAGE._1_25,
                    enabled: true,
                },
            },
            3: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for weeks 9-12 from the Semaglutide 2 mL 2.5 mg/mL vial',
                    dosage: SEMAGLUTIDE_DOSAGE._0_5,
                    enabled: true,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for weeks 9-12 from the Semaglutide 2 mL 2.5 mg/mL vial',
                    dosage: SEMAGLUTIDE_DOSAGE._0_5,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for weeks 9-12 from the Semaglutide 2 mL 2.5 mg/mL vial',
                    dosage: SEMAGLUTIDE_DOSAGE._1_25,
                    enabled: true,
                },
            },
        },
        [GLP1_NAMES_TO_INDEX.SEMAGLUTIDE_QUARTERLY_20_MG_EMPOWER]: {
            // "dosage_adjustment_sigs": {
            //     "month_1" : {
            //         "decrease": "Inject 10 units (0.5 mg of semaglutide) subcutaneously once per week for weeks 5-8 from the Semaglutide/cyanocobalamin 5/0.5 MG/ML",
            //         "maintain": "Inject 10 units (0.5 mg of semaglutide) subcutaneously once per week for weeks 5-8 from the Semaglutide/cyanocobalamin 5/0.5 MG/ML (1 ML)",
            //         "increase": "Inject 25 units (1.25 mg of semaglutide) subcutaneously once per week for weeks 5-8 from the Semaglutide/cyanocobalamin 5/0.5 MG/ML (1 ML)"
            //     },
            //     "month_2" : {
            //         "decrease": "Inject 25 units (1.25 mg of semaglutide) subcutaneously once per week for weeks 9-12 from the Semaglutide/cyanocobalmin 5/0.5 MG/ML (2.5 ML)",
            //         "maintain": "Inject 25 units (1.25 mg of semaglutide) subcutaneously once per week for weeks 9-12 from the Semaglutide/cyanocobalmin 5/0.5 MG/ML (2.5 ML)",
            //         "increase": "Inject 50 units (2.5 mg of semaglutide) subcutaneously once per week for weeks 9-12 from the Semaglutide/cyanocobalmin 5/0.5 MG/ML (2.5 ML)"
            //     },
            //     "month_3" : {
            //         "decrease": "Inject 25 units (1.25 mg of semaglutide) subcutaneously once per week for weeks 9-12 from the Semaglutide/cyanocobalmin 5/0.5 MG/ML (2.5 ML)",
            //         "maintain": "Inject 25 units (1.25 mg of semaglutide) subcutaneously once per week for weeks 9-12 from the Semaglutide/cyanocobalmin 5/0.5 MG/ML (2.5 ML)",
            //         "increase": "Inject 50 units (2.5 mg of semaglutide) subcutaneously once per week for weeks 9-12 from the Semaglutide/cyanocobalmin 5/0.5 MG/ML (2.5 ML)"
            //     }
            // },
            1: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 10 units (0.5 mg of semaglutide) subcutaneously once per week for weeks 5-8 from the Semaglutide/cyanocobalamin 5/0.5 MG/ML',
                    dosage: SEMAGLUTIDE_DOSAGE._0_5,
                    enabled: true,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 10 units (0.5 mg of semaglutide) subcutaneously once per week for weeks 5-8 from the Semaglutide/cyanocobalamin 5/0.5 MG/ML (1 ML)',
                    dosage: SEMAGLUTIDE_DOSAGE._0_5,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject 25 units (1.25 mg of semaglutide) subcutaneously once per week for weeks 5-8 from the Semaglutide/cyanocobalamin 5/0.5 MG/ML (1 ML)',
                    dosage: SEMAGLUTIDE_DOSAGE._1_25,
                    enabled: true,
                },
            },
            2: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 25 units (1.25 mg of semaglutide) subcutaneously once per week for weeks 9-12 from the Semaglutide/cyanocobalmin 5/0.5 MG/ML (2.5 ML)',
                    dosage: SEMAGLUTIDE_DOSAGE._1_25,
                    enabled: true,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 25 units (1.25 mg of semaglutide) subcutaneously once per week for weeks 9-12 from the Semaglutide/cyanocobalmin 5/0.5 MG/ML (2.5 ML)',
                    dosage: SEMAGLUTIDE_DOSAGE._1_25,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject 50 units (2.5 mg of semaglutide) subcutaneously once per week for weeks 9-12 from the Semaglutide/cyanocobalmin 5/0.5 MG/ML (2.5 ML)',
                    dosage: SEMAGLUTIDE_DOSAGE._2_5,
                    enabled: true,
                },
            },
            3: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 25 units (1.25 mg of semaglutide) subcutaneously once per week for weeks 9-12 from the Semaglutide/cyanocobalmin 5/0.5 MG/ML (2.5 ML)',
                    dosage: SEMAGLUTIDE_DOSAGE._1_25,
                    enabled: true,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 25 units (1.25 mg of semaglutide) subcutaneously once per week for weeks 9-12 from the Semaglutide/cyanocobalmin 5/0.5 MG/ML (2.5 ML)',
                    dosage: SEMAGLUTIDE_DOSAGE._1_25,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject 50 units (2.5 mg of semaglutide) subcutaneously once per week for weeks 9-12 from the Semaglutide/cyanocobalmin 5/0.5 MG/ML (2.5 ML)',
                    dosage: SEMAGLUTIDE_DOSAGE._2_5,
                    enabled: true,
                },
            },
        },
        [GLP1_NAMES_TO_INDEX.SEMAGLUTIDE_QUARTERLY_30_MG_EMPOWER]: {
            // "dosage_adjustment_sigs": {
            //     "month_1" : {
            //         "decrease": "Inject 25 units (1.25 mg of semaglutide) subcutaneously once per week for weeks 5-12 from the Semaglutide/cyanocobalmin 5/0.5 MG/ML (2.5 ML)",
            //         "maintain": "Inject 25 units (1.25 mg of semaglutide) subcutaneously once per week for weeks 5-12 from the Semaglutide/cyanocobalmin 5/0.5 MG/ML (2.5 ML)",
            //         "increase": "Inject 50 units (2.5 mg of semaglutide) subcutaneously once per week for weeks 5-12 from the Semaglutide/cyanocobalmin 5/0.5 MG/ML (2.5 ML)"
            //     },
            //     "month_2" : {
            //         "decrease": "Inject 25 units (1.25 mg of semaglutide) subcutaneously once per week for weeks 5-8 from the Semaglutide/cyanocobalmin 5/0.5 MG/ML (2.5 ML)",
            //         "maintain": "Inject 25 units (1.25 mg of semaglutide) subcutaneously once per week for weeks 5-8 from the Semaglutide/cyanocobalmin 5/0.5 MG/ML (2.5 ML)",
            //         "increase": "Inject 50 units (2.5 mg of semaglutide) subcutaneously once per week for weeks 5-8 from the Semaglutide/cyanocobalmin 5/0.5 MG/ML (2.5 ML)"
            //     },
            //     "month_3" : {
            //         "decrease": "Inject 25 units (1.25 mg of semaglutide) subcutaneously once per week for weeks 9-12 from the Semaglutide/cyanocobalmin 5/0.5 MG/ML (2.5 ML)",
            //         "maintain": "Inject 25 units (1.25 mg of semaglutide) subcutaneously once per week for weeks 9-12 from the Semaglutide/cyanocobalmin 5/0.5 MG/ML (2.5 ML)",
            //         "increase": "Inject 50 units (2.5 mg of semaglutide) subcutaneously once per week for weeks 9-12 from the Semaglutide/cyanocobalmin 5/0.5 MG/ML (2.5 ML)"
            //     }
            // },
            1: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 25 units (1.25 mg of semaglutide) subcutaneously once per week for weeks 5-12 from the Semaglutide/cyanocobalmin 5/0.5 MG/ML (2.5 ML)',
                    dosage: SEMAGLUTIDE_DOSAGE._1_25,
                    enabled: true,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 25 units (1.25 mg of semaglutide) subcutaneously once per week for weeks 5-12 from the Semaglutide/cyanocobalmin 5/0.5 MG/ML (2.5 ML)',
                    dosage: SEMAGLUTIDE_DOSAGE._1_25,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject 50 units (2.5 mg of semaglutide) subcutaneously once per week for weeks 5-12 from the Semaglutide/cyanocobalmin 5/0.5 MG/ML (2.5 ML)',
                    dosage: SEMAGLUTIDE_DOSAGE._2_5,
                    enabled: true,
                },
            },
            2: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 25 units (1.25 mg of semaglutide) subcutaneously once per week for weeks 5-12 from the Semaglutide/cyanocobalmin 5/0.5 MG/ML (2.5 ML)',
                    dosage: SEMAGLUTIDE_DOSAGE._1_25,
                    enabled: true,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 25 units (1.25 mg of semaglutide) subcutaneously once per week for weeks 5-12 from the Semaglutide/cyanocobalmin 5/0.5 MG/ML (2.5 ML)',
                    dosage: SEMAGLUTIDE_DOSAGE._1_25,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject 50 units (2.5 mg of semaglutide) subcutaneously once per week for weeks 5-12 from the Semaglutide/cyanocobalmin 5/0.5 MG/ML (2.5 ML)',
                    dosage: SEMAGLUTIDE_DOSAGE._2_5,
                    enabled: true,
                },
            },
            3: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 25 units (1.25 mg of semaglutide) subcutaneously once per week for weeks 5-12 from the Semaglutide/cyanocobalmin 5/0.5 MG/ML (2.5 ML)',
                    dosage: SEMAGLUTIDE_DOSAGE._1_25,
                    enabled: true,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 25 units (1.25 mg of semaglutide) subcutaneously once per week for weeks 5-12 from the Semaglutide/cyanocobalmin 5/0.5 MG/ML (2.5 ML)',
                    dosage: SEMAGLUTIDE_DOSAGE._1_25,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject 50 units (2.5 mg of semaglutide) subcutaneously once per week for weeks 5-12 from the Semaglutide/cyanocobalmin 5/0.5 MG/ML (2.5 ML)',
                    dosage: SEMAGLUTIDE_DOSAGE._2_5,
                    enabled: true,
                },
            },
        },
        [GLP1_NAMES_TO_INDEX.SEMAGLUTIDE_QUARTERLY_15_MG_EMPOWER]: {
            // "dosage_adjustment_sigs": {
            //     "month_1" : {
            //         "decrease": "Inject 10 units (0.5 mg of semaglutide) subcutaneously once per week for weeks 5-8 from the Semaglutide/cyanocobalamin 5/0.5 MG/ML.",
            //         "maintain": "Inject 25 units (1.25 mg of semaglutide) subcutaneously once per week for weeks 5-12 from the Semaglutide/cyanocobalmin 5/0.5 MG/ML (2.5 ML)",
            //         "increase": "Inject 50 units (2.5 mg of semaglutide) subcutaneously once per week for weeks 5-12 from the Semaglutide/cyanocobalmin 5/0.5 MG/ML (2.5 ML)"
            //     },
            //     "month_2" : {
            //         "decrease": "Inject 10 units (0.5 mg of semaglutide) subcutaneously once per week for weeks 5-8 from the Semaglutide/cyanocobalamin 5/0.5 MG/ML",
            //         "maintain": "Inject 25 units (1.25 mg of semaglutide) subcutaneously once per week for weeks 5-12 from the Semaglutide/cyanocobalmin 5/0.5 MG/ML (2.5 ML)",
            //         "increase": "Inject 50 units (2.5 mg of semaglutide) subcutaneously once per week for weeks 5-12 from the Semaglutide/cyanocobalmin 5/0.5 MG/ML (2.5 ML)"
            //     },
            //     "month_3" : {
            //         "decrease": "Inject 10 units (0.5 mg of semaglutide) subcutaneously once per week for weeks 5-8 from the Semaglutide/cyanocobalamin 5/0.5 MG/ML",
            //         "maintain": "Inject 25 units (1.25 mg of semaglutide) subcutaneously once per week for weeks 5-12 from the Semaglutide/cyanocobalmin 5/0.5 MG/ML (2.5 ML)",
            //         "increase": "Inject 50 units (2.5 mg of semaglutide) subcutaneously once per week for weeks 5-12 from the Semaglutide/cyanocobalmin 5/0.5 MG/ML (2.5 ML)"
            //     }
            // },
            1: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 10 units (0.5 mg of semaglutide) subcutaneously once per week for weeks 5-8 from the Semaglutide/cyanocobalamin 5/0.5 MG/ML.',
                    dosage: SEMAGLUTIDE_DOSAGE._0_5,
                    enabled: true,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 25 units (1.25 mg of semaglutide) subcutaneously once per week for weeks 5-12 from the Semaglutide/cyanocobalmin 5/0.5 MG/ML (2.5 ML)',
                    dosage: SEMAGLUTIDE_DOSAGE._1_25,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject 50 units (2.5 mg of semaglutide) subcutaneously once per week for weeks 5-12 from the Semaglutide/cyanocobalmin 5/0.5 MG/ML (2.5 ML).',
                    dosage: SEMAGLUTIDE_DOSAGE._2_5,
                    enabled: true,
                },
            },
            2: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 10 units (0.5 mg of semaglutide) subcutaneously once per week for weeks 5-8 from the Semaglutide/cyanocobalamin 5/0.5 MG/ML.',
                    dosage: SEMAGLUTIDE_DOSAGE._0_5,
                    enabled: true,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 25 units (1.25 mg of semaglutide) subcutaneously once per week for weeks 5-12 from the Semaglutide/cyanocobalmin 5/0.5 MG/ML (2.5 ML)',
                    dosage: SEMAGLUTIDE_DOSAGE._1_25,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject 50 units (2.5 mg of semaglutide) subcutaneously once per week for weeks 5-12 from the Semaglutide/cyanocobalmin 5/0.5 MG/ML (2.5 ML).',
                    dosage: SEMAGLUTIDE_DOSAGE._2_5,
                    enabled: true,
                },
            },
            3: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 10 units (0.5 mg of semaglutide) subcutaneously once per week for weeks 5-8 from the Semaglutide/cyanocobalamin 5/0.5 MG/ML.',
                    dosage: SEMAGLUTIDE_DOSAGE._0_5,
                    enabled: true,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 25 units (1.25 mg of semaglutide) subcutaneously once per week for weeks 5-12 from the Semaglutide/cyanocobalmin 5/0.5 MG/ML (2.5 ML)',
                    dosage: SEMAGLUTIDE_DOSAGE._1_25,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject 50 units (2.5 mg of semaglutide) subcutaneously once per week for weeks 5-12 from the Semaglutide/cyanocobalmin 5/0.5 MG/ML (2.5 ML).',
                    dosage: SEMAGLUTIDE_DOSAGE._2_5,
                    enabled: true,
                },
            },
        },
        [GLP1_NAMES_TO_INDEX.SEMAGLUTIDE_QUARTERLY_37_5_MG_EMPOWER]: {
            // "dosage_adjustment_sigs": {
            //     "month_1" : {
            //         "decrease": "Inject 25 units (1.25 mg of semaglutide) subcutaneously once per week for weeks 5-12 from the Semaglutide/cyanocobalmin 5/0.5 MG/ML (2.5 ML)",
            //         "maintain": "Inject 50 units (2.5 mg of semaglutide) subcutaneously once per week for weeks 5-12 from the Semaglutide/cyanocobalmin 5/0.5 MG/ML (2.5 ML)",
            //         "increase": "N/A"
            //     },
            //     "month_2" : {
            //         "decrease": "Inject 25 units (1.25 mg of semaglutide) subcutaneously once per week for weeks 5-8 from the Semaglutide/cyanocobalmin 5/0.5 MG/ML (2.5 ML)",
            //         "maintain": "Inject 50 units (2.5 mg of semaglutide) subcutaneously once per week for weeks 5-8 from the Semaglutide/cyanocobalmin 5/0.5 MG/ML (2.5 ML)",
            //         "increase": "N/A"
            //     },
            //     "month_3" : {
            //         "decrease": "Inject 25 units (1.25 mg of semaglutide) subcutaneously once per week for weeks 9-12 from the Semaglutide/cyanocobalmin 5/0.5 MG/ML (2.5 ML)",
            //         "maintain": "Inject 50 units (2.5 mg of semaglutide) subcutaneously once per week for weeks 9-12 from the Semaglutide/cyanocobalmin 5/0.5 MG/ML (2.5 ML)",
            //         "increase": "N/A"
            //     }
            // },
            1: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 25 units (1.25 mg of semaglutide) subcutaneously once per week for weeks 5-12 from the Semaglutide/cyanocobalmin 5/0.5 MG/ML (2.5 ML)',
                    dosage: SEMAGLUTIDE_DOSAGE._1_25,
                    enabled: true,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 50 units (2.5 mg of semaglutide) subcutaneously once per week for weeks 5-12 from the Semaglutide/cyanocobalmin 5/0.5 MG/ML (2.5 ML)',
                    dosage: SEMAGLUTIDE_DOSAGE._2_5,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'N/A',
                    dosage: SEMAGLUTIDE_DOSAGE._2_5,
                    enabled: true,
                },
            },
            2: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 25 units (1.25 mg of semaglutide) subcutaneously once per week for weeks 5-12 from the Semaglutide/cyanocobalmin 5/0.5 MG/ML (2.5 ML)',
                    dosage: SEMAGLUTIDE_DOSAGE._1_25,
                    enabled: true,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 50 units (2.5 mg of semaglutide) subcutaneously once per week for weeks 5-12 from the Semaglutide/cyanocobalmin 5/0.5 MG/ML (2.5 ML)',
                    dosage: SEMAGLUTIDE_DOSAGE._2_5,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'N/A',
                    dosage: SEMAGLUTIDE_DOSAGE._2_5,
                    enabled: false,
                },
            },
            3: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 25 units (1.25 mg of semaglutide) subcutaneously once per week for weeks 5-12 from the Semaglutide/cyanocobalmin 5/0.5 MG/ML (2.5 ML)',
                    dosage: SEMAGLUTIDE_DOSAGE._1_25,
                    enabled: true,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 50 units (2.5 mg of semaglutide) subcutaneously once per week for weeks 5-12 from the Semaglutide/cyanocobalmin 5/0.5 MG/ML (2.5 ML)',
                    dosage: SEMAGLUTIDE_DOSAGE._2_5,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'N/A',
                    dosage: SEMAGLUTIDE_DOSAGE._2_5,
                    enabled: false,
                },
            },
        },
        [GLP1_NAMES_TO_INDEX.SEMAGLUTIDE_QUARTERLY_22_5_MG_EMPOWER]: {
            // "dosage_adjustment_sigs": {
            //     "month_1" : {
            //         "decrease": "Inject 10 units (0.5 mg of semaglutide) subcutaneously once per week for weeks 5-8 from the Semaglutide/cyanocobalamin 5/0.5 MG/ML",
            //         "maintain": "Inject 25 units (1.25 mg of semaglutide) subcutaneously once per week for weeks 5-8 from the Semaglutide/cyanocobalmin 5/0.5 MG/ML (2.5 ML)",
            //         "increase": "Inject 50 units (2.5 mg of semaglutide) subcutaneously once per week for weeks 5-8 from the Semaglutide/cyanocobalmin 5/0.5 MG/ML (2.5 ML)"
            //     },
            //     "month_2" : {
            //         "decrease": "Inject 10 units (0.5 mg of semaglutide) subcutaneously once per week for weeks 5-8 from the Semaglutide/cyanocobalamin 5/0.5 MG/ML",
            //         "maintain": "Inject 25 units (1.25 mg of semaglutide) subcutaneously once per week for weeks 5-8 from the Semaglutide/cyanocobalmin 5/0.5 MG/ML (2.5 ML)",
            //         "increase": "Inject 50 units (2.5 mg of semaglutide) subcutaneously once per week for weeks 5-8 from the Semaglutide/cyanocobalmin 5/0.5 MG/ML (2.5 ML)"
            //     },
            //     "month_3" : {
            //         "decrease": "Inject 25 units (1.25 mg of semaglutide) subcutaneously once per week for weeks 9-12 from the Semaglutide/cyanocobalmin 5/0.5 MG/ML (2.5 ML)",
            //         "maintain": "Inject 50 units (2.5 mg of semaglutide) subcutaneously once per week for weeks 5-12 from the Semaglutide/cyanocobalmin 5/0.5 MG/ML (2.5 ML)",
            //         "increase": "Inject 50 units (2.5 mg of semaglutide) subcutaneously once per week for weeks 9-12 from the Semaglutide/cyanocobalmin 5/0.5 MG/ML (2.5 ML)"
            //     }
            // },
            1: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 10 units (0.5 mg of semaglutide) subcutaneously once per week for weeks 5-8 from the Semaglutide/cyanocobalamin 5/0.5 MG/ML',
                    dosage: SEMAGLUTIDE_DOSAGE._0_5,
                    enabled: true,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 25 units (1.25 mg of semaglutide) subcutaneously once per week for weeks 5-8 from the Semaglutide/cyanocobalmin 5/0.5 MG/ML (2.5 ML)',
                    dosage: SEMAGLUTIDE_DOSAGE._1_25,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject 50 units (2.5 mg of semaglutide) subcutaneously once per week for weeks 5-8 from the Semaglutide/cyanocobalmin 5/0.5 MG/ML (2.5 ML)',
                    dosage: SEMAGLUTIDE_DOSAGE._2_5,
                    enabled: true,
                },
            },
            2: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 10 units (0.5 mg of semaglutide) subcutaneously once per week for weeks 5-8 from the Semaglutide/cyanocobalamin 5/0.5 MG/ML',
                    dosage: SEMAGLUTIDE_DOSAGE._0_5,
                    enabled: true,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 25 units (1.25 mg of semaglutide) subcutaneously once per week for weeks 5-8 from the Semaglutide/cyanocobalmin 5/0.5 MG/ML (2.5 ML)',
                    dosage: SEMAGLUTIDE_DOSAGE._1_25,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject 50 units (2.5 mg of semaglutide) subcutaneously once per week for weeks 5-8 from the Semaglutide/cyanocobalmin 5/0.5 MG/ML (2.5 ML)',
                    dosage: SEMAGLUTIDE_DOSAGE._2_5,
                    enabled: true,
                },
            },
            3: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 25 units (1.25 mg of semaglutide) subcutaneously once per week for weeks 9-12 from the Semaglutide/cyanocobalmin 5/0.5 MG/ML (2.5 ML)',
                    dosage: SEMAGLUTIDE_DOSAGE._1_25,
                    enabled: true,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 50 units (2.5 mg of semaglutide) subcutaneously once per week for weeks 5-12 from the Semaglutide/cyanocobalmin 5/0.5 MG/ML (2.5 ML)',
                    dosage: SEMAGLUTIDE_DOSAGE._2_5,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject 50 units (2.5 mg of semaglutide) subcutaneously once per week for weeks 9-12 from the Semaglutide/cyanocobalmin 5/0.5 MG/ML (2.5 ML)',
                    dosage: SEMAGLUTIDE_DOSAGE._2_5,
                    enabled: true,
                },
            },
        },

        [GLP1_NAMES_TO_INDEX.SEMAGLUTIDE_QUARTERLY_8_MG_BOOTHWYN]: {
            // "dosage_adjustment_sigs" : {
            //     "month_1" : {
            //         "decrease" : "Inject 5 units (0.25 mg) weekly x 4 weeks",
            //         "maintain" : "Inject 10 units (0.50 mg) weekly x 4 weeks",
            //         "increase" : "Inject 10 units (0.50 mg) weekly x 4 weeks"
            //     },
            //     "month_2" : {
            //         "decrease" : "Inject 5 units (0.25 mg) weekly x 4 weeks",
            //         "maintain" : "Inject 10 units (0.50 mg) weekly x 4 weeks",
            //         "increase" : "Inject 10 units (0.50 mg) weekly x 4 weeks"
            //     },
            //     "month_3" : {
            //         "decrease" : "Inject 10 units (0.50 mg) weekly x 4 weeks",
            //         "maintain" : "Inject 25 units (1.25 mg) weekly x 4 weeks",
            //         "increase" : "Inject 25 units (1.25 mg) weekly x 4 weeks"
            //     }
            // }
            1: {
                [DOSING_TYPE.DECREASE]: {
                    sig: ' Inject 5 units (0.25 mg) weekly x 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._0_25,
                    enabled: true,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 10 units (0.50 mg) weekly x 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._0_5,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject 10 units (0.50 mg) weekly x 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._0_5,
                    enabled: true,
                },
            },
            2: {
                [DOSING_TYPE.DECREASE]: {
                    sig: ' Inject 5 units (0.25 mg) weekly x 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._0_25,
                    enabled: true,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 10 units (0.50 mg) weekly x 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._0_5,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject 10 units (0.50 mg) weekly x 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._0_5,
                    enabled: true,
                },
            },
            3: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 10 units (0.50 mg) weekly x 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._0_5,
                    enabled: true,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 25 units (1.25 mg) weekly x 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._1_25,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject 25 units (1.25 mg) weekly x 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._1_25,
                    enabled: true,
                },
            },
        },

        [GLP1_NAMES_TO_INDEX.SEMAGLUTIDE_QUARTERLY_15_MG_BOOTHWYN]: {
            // "dosage_adjustment_sigs" : {
            //     "month_1" : {
            //         "decrease" : "Inject 10 units (0.50 mg) weekly x 4 weeks",
            //         "maintain" : "Inject 25 units (1.25 mg) weekly x 4 weeks",
            //         "increase" : "Inject 25 units (1.25 mg) weekly x 4 weeks"
            //     },
            //     "month_2" : {
            //         "decrease" : "Inject 10 units (0.50 mg) weekly x 4 weeks",
            //         "maintain" : "Inject 25 units (1.25 mg) weekly x 4 weeks",
            //         "increase" : "Inject 25 units (1.25 mg) weekly x 4 weeks"
            //     },
            //     "month_3" : {
            //         "decrease" : "Inject 10 units (0.50 mg) weekly x 4 weeks",
            //         "maintain" : "Inject 25 units (1.25 mg) weekly x 4 weeks",
            //         "increase" : "Inject 25 units (1.25 mg) weekly x 4 weeks"
            //     }
            // }
            1: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 10 units (0.50 mg) weekly x 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._0_5,
                    enabled: true,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 25 units (1.25 mg) weekly x 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._1_25,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject 25 units (1.25 mg) weekly x 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._1_25,
                    enabled: true,
                },
            },
            2: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 10 units (0.50 mg) weekly x 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._0_5,
                    enabled: true,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 25 units (1.25 mg) weekly x 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._1_25,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject 25 units (1.25 mg) weekly x 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._1_25,
                    enabled: true,
                },
            },
            3: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 10 units (0.50 mg) weekly x 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._0_5,
                    enabled: true,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 25 units (1.25 mg) weekly x 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._1_25,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject 25 units (1.25 mg) weekly x 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._1_25,
                    enabled: true,
                },
            },
        },

        [GLP1_NAMES_TO_INDEX.SEMAGLUTIDE_QUARTERLY_20_MG_BOOTHWYN]: {
            // "dosage_adjustment_sigs" : {
            //     "month_1" : {
            //         "decrease" : "Inject 10 units (0.50 mg) weekly x 4 weeks",
            //         "maintain" : "Inject 25 units (1.25 mg) weekly x 4 weeks",
            //         "increase" : "Inject 25 units (1.25 mg) weekly x 4 weeks"
            //     },
            //     "month_2" : {
            //         "decrease" : "Inject 10 units (0.50 mg) weekly x 4 weeks",
            //         "maintain" : "Inject 25 units (1.25 mg) weekly x 4 weeks",
            //         "increase" : "Inject 25 units (1.25 mg) weekly x 4 weeks"
            //     },
            //     "month_3" : {
            //         "decrease" : "Inject 25 units (1.25 mg) weekly x 4 weeks",
            //         "maintain" : "Inject 50 units (2.5 mg) weekly x 4 weeks",
            //         "increase" : "Inject 50 units (2.5 mg) weekly x 4 weeks"
            //     }
            // }
            1: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 10 units (0.50 mg) weekly x 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._0_5,
                    enabled: true,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 25 units (1.25 mg) weekly x 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._1_25,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject 25 units (1.25 mg) weekly x 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._1_25,
                    enabled: true,
                },
            },
            2: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 10 units (0.50 mg) weekly x 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._0_5,
                    enabled: true,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 25 units (1.25 mg) weekly x 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._1_25,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject 25 units (1.25 mg) weekly x 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._1_25,
                    enabled: true,
                },
            },
            3: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 25 units (1.25 mg) weekly x 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._1_25,
                    enabled: true,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 50 units (2.5 mg) weekly x 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._2_5,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject 50 units (2.5 mg) weekly x 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._2_5,
                    enabled: true,
                },
            },
        },

        [GLP1_NAMES_TO_INDEX.SEMAGLUTIDE_QUARTERLY_17_MG_BOOTHWYN]: {
            // "dosage_adjustment_sigs" : {
            //     "month_1" : {
            //         "decrease" : "Inject 10 units (0.50 mg) weekly x 4 weeks",
            //         "maintain" : "Inject 25 units (1.25 mg) weekly x 4 weeks",
            //         "increase" : "Inject 25 units (1.25 mg) weekly x 4 weeks"
            //     },
            //     "month_2" : {
            //         "decrease" : "Inject 10 units (0.50 mg) weekly x 4 weeks",
            //         "maintain" : "Inject 25 units (1.25 mg) weekly x 4 weeks",
            //         "increase" : "Inject 25 units (1.25 mg) weekly x 4 weeks"
            //     },
            //     "month_3" : {
            //         "decrease" : "Inject 25 units (1.25 mg) weekly x 4 weeks",
            //         "maintain" : "Inject 50 units (2.5 mg) weekly x 4 weeks",
            //         "increase" : "Inject 50 units (2.5 mg) weekly x 4 weeks"
            //     }
            // }
            1: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 10 units (0.50 mg) weekly x 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._0_5,
                    enabled: true,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 25 units (1.25 mg) weekly x 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._1_25,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject 25 units (1.25 mg) weekly x 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._1_25,
                    enabled: true,
                },
            },
            2: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 10 units (0.50 mg) weekly x 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._0_5,
                    enabled: true,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 25 units (1.25 mg) weekly x 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._1_25,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject 25 units (1.25 mg) weekly x 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._1_25,
                    enabled: true,
                },
            },
            3: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 25 units (1.25 mg) weekly x 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._1_25,
                    enabled: true,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 50 units (2.5 mg) weekly x 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._2_5,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject 50 units (2.5 mg) weekly x 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._2_5,
                    enabled: true,
                },
            },
        },

        [GLP1_NAMES_TO_INDEX.SEMAGLUTIDE_QUARTERLY_25_MG_BOOTHWYN]: {
            // "dosage_adjustment_sigs" : {
            //     "month_1" : {
            //         "decrease" : "Inject 10 units (0.50 mg) weekly x 4 weeks",
            //         "maintain" : "Inject 25 units (1.25 mg) weekly x 4 weeks",
            //         "increase" : "Inject 50 units (2.5 mg) weekly x 4 weeks"
            //     },
            //     "month_2" : {
            //         "decrease" : "Inject 10 units (0.50 mg) weekly x 4 weeks",
            //         "maintain" : "Inject 25 units (1.25 mg) weekly x 4 weeks",
            //         "increase" : "Inject 50 units (2.5 mg) weekly x 4 weeks"
            //     },
            //     "month_3" : {
            //         "decrease" : "Inject 25 units (1.25 mg) weekly x 4 weeks",
            //         "maintain" : "Inject 50 units (2.5 mg) weekly x 4 weeks",
            //         "increase" : "Inject 50 units (2.5 mg) weekly x 4 weeks"
            //     }
            // }
            1: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 10 units (0.50 mg) weekly x 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._0_5,
                    enabled: true,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 25 units (1.25 mg) weekly x 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._1_25,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject 50 units (2.5 mg) weekly x 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._2_5,
                    enabled: true,
                },
            },
            2: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 10 units (0.50 mg) weekly x 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._0_5,
                    enabled: true,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 25 units (1.25 mg) weekly x 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._1_25,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject 50 units (2.5 mg) weekly x 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._2_5,
                    enabled: true,
                },
            },
            3: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 25 units (1.25 mg) weekly x 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._1_25,
                    enabled: true,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 50 units (2.5 mg) weekly x 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._2_5,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject 50 units (2.5 mg) weekly x 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._2_5,
                    enabled: true,
                },
            },
        },

        [GLP1_NAMES_TO_INDEX.SEMAGLUTIDE_QUARTERLY_30_MG_BOOTHWYN]: {
            // "dosage_adjustment_sigs" : {
            //     "month_1" : {
            //         "decrease" : "Inject 25 units (1.25 mg) weekly x 4 weeks",
            //         "maintain" : "Inject 50 units (2.5 mg) weekly x 4 weeks",
            //         "increase" : "Inject 50 units (2.5 mg) weekly x 4 weeks"
            //     },
            //     "month_2" : {
            //         "decrease" : "Inject 25 units (1.25 mg) weekly x 4 weeks",
            //         "maintain" : "Inject 50 units (2.5 mg) weekly x 4 weeks",
            //         "increase" : "N/A"
            //     },
            //     "month_3" : {
            //         "decrease" : "Inject 25 units (1.25 mg) weekly x 4 weeks",
            //         "maintain" : "Inject 50 units (2.5 mg) weekly x 4 weeks",
            //         "increase" : "Inject 50 units (2.5 mg) weekly x 4 weeks"
            //     }
            // }
            1: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 25 units (1.25 mg) weekly x 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._1_25,
                    enabled: true,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 50 units (2.5 mg) weekly x 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._2_5,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject 50 units (2.5 mg) weekly x 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._2_5,
                    enabled: true,
                },
            },
            2: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 25 units (1.25 mg) weekly x 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._1_25,
                    enabled: true,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 50 units (2.5 mg) weekly x 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._2_5,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject 50 units (2.5 mg) weekly x 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._2_5,
                    enabled: true,
                },
            },
            3: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 25 units (1.25 mg) weekly x 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._1_25,
                    enabled: true,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 50 units (2.5 mg) weekly x 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._2_5,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject 50 units (2.5 mg) weekly x 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._2_5,
                    enabled: true,
                },
            },
        },

        [GLP1_NAMES_TO_INDEX.SEMAGLUTIDE_QUARTERLY_10_MG_REVIVE]: {
            // "dosage_adjustment_sigs" : {
            //     "month_1" : {
            //         "decrease" : "Inject 0.05 ml (5 units) (0.25 mg) subcutaneously every week.",
            //         "maintain" : "Inject 0.10 ml (10 units) (0.5 mg) subcutaneously every week.",
            //         "increase" : "Inject 0.25 ml (25 units) (1.25 mg) subcutaneously every week."
            //     },
            //     "month_2" : {
            //         "decrease" : "Inject 0.05 ml (5 units) (0.25 mg) subcutaneously every week.",
            //         "maintain" : "Inject 0.10 ml (10 units) (0.5 mg) subcutaneously every week.",
            //         "increase" : "Inject 0.25 ml (25 units) (1.25 mg) subcutaneously every week."
            //     },
            //     "month_3" : {
            //         "decrease" : "Inject 0.10 ml (10 units) (0.5 mg) subcutaneously every week.",
            //         "maintain" : "Inject 0.25 ml (25 units) (1.25 mg) subcutaneously every week.",
            //         "increase" : "Inject 0.25 ml (25 units) (1.25 mg) subcutaneously every week."
            //     }
            // }
            1: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 0.05 ml (5 units) (0.25 mg) subcutaneously every week.',
                    dosage: SEMAGLUTIDE_DOSAGE._0_25,
                    enabled: true,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 0.10 ml (10 units) (0.5 mg) subcutaneously every week.',
                    dosage: SEMAGLUTIDE_DOSAGE._0_5,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject inject 0.25 ml (25 units) (1.25 mg) subcutaneously every week.',
                    dosage: SEMAGLUTIDE_DOSAGE._1_25,
                    enabled: true,
                },
            },
            2: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 0.05 ml (5 units) (0.25 mg) subcutaneously every week.',
                    dosage: SEMAGLUTIDE_DOSAGE._0_25,
                    enabled: true,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 0.10 ml (10 units) (0.5 mg) subcutaneously every week.',
                    dosage: SEMAGLUTIDE_DOSAGE._0_5,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject inject 0.25 ml (25 units) (1.25 mg) subcutaneously every week.',
                    dosage: SEMAGLUTIDE_DOSAGE._1_25,
                    enabled: true,
                },
            },
            3: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 0.10 ml (10 units) (0.5 mg) subcutaneously every week.',
                    dosage: SEMAGLUTIDE_DOSAGE._0_5,
                    enabled: true,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject inject 0.25 ml (25 units) (1.25 mg) subcutaneously every week.',
                    dosage: SEMAGLUTIDE_DOSAGE._1_25,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject inject 0.25 ml (25 units) (1.25 mg) subcutaneously every week.',
                    dosage: SEMAGLUTIDE_DOSAGE._1_25,
                    enabled: true,
                },
            },
        },

        [GLP1_NAMES_TO_INDEX.SEMAGLUTIDE_QUARTERLY_15_MG_REVIVE]: {
            // "dosage_adjustment_sigs" : {
            //     "month_1" : {
            //         "decrease" : "Inject 0.10 ml (10 units) (0.5 mg) subcutaneously every week.",
            //         "maintain" : "Inject 0.25 ml (25 units) (1.25 mg) subcutaneously every week.",
            //         "increase" : "Inject 0.25 ml (25 units) (1.25 mg) subcutaneously every week."
            //     },
            //     "month_2" : {
            //         "decrease" : "Inject 0.10 ml (10 units) (0.5 mg) subcutaneously every week.",
            //         "maintain" : "Inject 0.25 ml (25 units) (1.25 mg) subcutaneously every week.",
            //         "increase" : "Inject 0.25 ml (25 units) (1.25 mg) subcutaneously every week."
            //     },
            //     "month_3" : {
            //         "decrease" : "Inject 0.10 ml (10 units) (0.5 mg) subcutaneously every week.",
            //         "maintain" : "Inject 0.25 ml (25 units) (1.25 mg) subcutaneously every week.",
            //         "increase" : "Inject 0.25 ml (25 units) (1.25 mg) subcutaneously every week."
            //     }
            // }
            1: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 0.10 ml (10 units) (0.5 mg) subcutaneously every week.',
                    dosage: SEMAGLUTIDE_DOSAGE._0_5,
                    enabled: true,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject inject 0.25 ml (25 units) (1.25 mg) subcutaneously every week.',
                    dosage: SEMAGLUTIDE_DOSAGE._1_25,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject inject 0.25 ml (25 units) (1.25 mg) subcutaneously every week.',
                    dosage: SEMAGLUTIDE_DOSAGE._1_25,
                    enabled: true,
                },
            },
            2: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 0.10 ml (10 units) (0.5 mg) subcutaneously every week.',
                    dosage: SEMAGLUTIDE_DOSAGE._0_5,
                    enabled: true,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject inject 0.25 ml (25 units) (1.25 mg) subcutaneously every week.',
                    dosage: SEMAGLUTIDE_DOSAGE._1_25,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject inject 0.25 ml (25 units) (1.25 mg) subcutaneously every week.',
                    dosage: SEMAGLUTIDE_DOSAGE._1_25,
                    enabled: true,
                },
            },
            3: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 0.10 ml (10 units) (0.5 mg) subcutaneously every week.',
                    dosage: SEMAGLUTIDE_DOSAGE._0_5,
                    enabled: true,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject inject 0.25 ml (25 units) (1.25 mg) subcutaneously every week.',
                    dosage: SEMAGLUTIDE_DOSAGE._1_25,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject inject 0.25 ml (25 units) (1.25 mg) subcutaneously every week.',
                    dosage: SEMAGLUTIDE_DOSAGE._1_25,
                    enabled: true,
                },
            },
        },

        [GLP1_NAMES_TO_INDEX.SEMAGLUTIDE_QUARTERLY_20_MG_0_5_STARTING_REVIVE]: {

            // "dosage_adjustment_sigs" : {
            //     "month_1" : {
            //         "decrease" : "Inject 0.10 ml (10 units) (0.5 mg) subcutaneously every week.",
            //         "maintain" : "Inject 0.25 ml (25 units) (1.25 mg) subcutaneously every week.",
            //         "increase" : "Inject 0.5 ml (50 units) (2.5 mg) subcutaneously every week."
            //     },
            //     "month_2" : {
            //         "decrease" : "Inject 0.10 ml (10 units) (0.5 mg) subcutaneously every week.",
            //         "maintain" : "Inject 0.25 ml (25 units) (1.25 mg) subcutaneously every week.",
            //         "increase" : "Inject 0.5 ml (50 units) (2.5 mg) subcutaneously every week."
            //     },
            //     "month_3" : {
            //         "decrease" : "Inject 0.25 ml (25 units) (1.25 mg) subcutaneously every week.",
            //         "maintain" : "Inject 0.5 ml (50 units) (2.5 mg) subcutaneously every week.",
            //         "increase" : "Inject 0.5 ml (50 units) (2.5 mg) subcutaneously every week."
            //     }
            // }

            1: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 0.10 ml (10 units) (0.5 mg) subcutaneously every week.',
                    dosage: SEMAGLUTIDE_DOSAGE._0_5,
                    enabled: true,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject inject 0.25 ml (25 units) (1.25 mg) subcutaneously every week.',
                    dosage: SEMAGLUTIDE_DOSAGE._1_25,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject 0.5 ml (50 units) (2.5 mg) subcutaneously every week.',
                    dosage: SEMAGLUTIDE_DOSAGE._2_5,
                    enabled: true,
                },
            },
            2: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 0.10 ml (10 units) (0.5 mg) subcutaneously every week.',
                    dosage: SEMAGLUTIDE_DOSAGE._0_5,
                    enabled: true,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject inject 0.25 ml (25 units) (1.25 mg) subcutaneously every week.',
                    dosage: SEMAGLUTIDE_DOSAGE._1_25,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject 0.5 ml (50 units) (2.5 mg) subcutaneously every week.',
                    dosage: SEMAGLUTIDE_DOSAGE._2_5,
                    enabled: true,
                },
            },
            3: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 0.25 ml (25 units) (1.25 mg) subcutaneously every week.',
                    dosage: SEMAGLUTIDE_DOSAGE._1_25,
                    enabled: true,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 0.5 ml (50 units) (2.5 mg) subcutaneously every week.',
                    dosage: SEMAGLUTIDE_DOSAGE._2_5,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject 0.5 ml (50 units) (2.5 mg) subcutaneously every week.',
                    dosage: SEMAGLUTIDE_DOSAGE._2_5,
                    enabled: true,
                },
            },
        },
        [GLP1_NAMES_TO_INDEX.SEMAGLUTIDE_QUARTERLY_20_MG_HALLANDALE]: {

            // "dosage_adjustment_sigs" : {
            //     "month_1" : {
            //         "decrease" : "Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for 4 weeks",
            //         "maintain" : "Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for 4 weeks",
            //         "increase" : "Inject 25 units (2.5 mg of semaglutide) subcutaneously once per week for 4 weeks"
            //     },
            //     "month_2" : {
            //         "decrease" : "Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for 4 weeks",
            //         "maintain" : "Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for 4 weeks",
            //         "increase" : "Inject 25 units (2.5 mg of semaglutide) subcutaneously once per week for 4 weeks"
            //     },
            //     "month_3" : {
            //         "decrease" : "Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for 4 weeks",
            //         "maintain" : "Inject 25 units (2.5 mg of semaglutide) subcutaneously once per week for 4 weeks",
            //         "increase" : "Inject 25 units (2.5 mg of semaglutide) subcutaneously once per week for 4 weeks"
            //     }
            // }

            1: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._0_5,
                    enabled: true,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._1_25,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject 25 units (2.5 mg of semaglutide) subcutaneously once per week for 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._2_5,
                    enabled: true,
                },
            },
            2: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._0_5,
                    enabled: true,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._1_25,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject 25 units (2.5 mg of Tirzepatide) subcutaneously once per week for 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._2_5,
                    enabled: true,
                },
            },
            3: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._1_25,
                    enabled: true,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 25 units (2.5 mg of semaglutide) subcutaneously once per week for 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._2_5,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject 25 units (2.5 mg of Tirzepatide) subcutaneously once per week for 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._2_5,
                    enabled: true,
                },
            },
        },
        [GLP1_NAMES_TO_INDEX.SEMAGLUTIDE_QUARTERLY_25_MG_HALLANDALE]: {
            // "dosage_adjustment_sigs" : {
            //     "month_1" : {
            //         "decrease" : "Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for 4 weeks",
            //         "maintain" : "Inject 25 units (2.5 mg of semaglutide) subcutaneously once per week for 4 weeks",
            //         "increase" : "Inject 25 units (2.5 mg of semaglutide) subcutaneously once per week for 4 weeks"
            //     },
            //     "month_2" : {
            //         "decrease" : "Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for 4 weeks",
            //         "maintain" : "Inject 25 units (2.5 mg of semaglutide) subcutaneously once per week for 4 weeks",
            //         "increase" : "Inject 25 units (2.5 mg of semaglutide) subcutaneously once per week for 4 weeks"
            //     },
            //     "month_3" : {
            //         "decrease" : "Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for 4 weeks",
            //         "maintain" : "Inject 25 units (2.5 mg of semaglutide) subcutaneously once per week for 4 weeks",
            //         "increase" : "Inject 25 units (2.5 mg of semaglutide) subcutaneously once per week for 4 weeks"
            //     }
            // }
            
            1: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._1_25,
                    enabled: true,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 25 units (2.5 mg of Tirzepatide) subcutaneously once per week for 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._2_5,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject 25 units (2.5 mg of Tirzepatide) subcutaneously once per week for 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._2_5,
                    enabled: true,
                },
            },
            2: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._1_25,
                    enabled: true,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 25 units (2.5 mg of Tirzepatide) subcutaneously once per week for 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._2_5,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject 25 units (2.5 mg of Tirzepatide) subcutaneously once per week for 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._2_5,
                    enabled: true,
                },
            },
            3: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._1_25,
                    enabled: true,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 25 units (2.5 mg of Tirzepatide) subcutaneously once per week for 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._2_5,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject 25 units (2.5 mg of Tirzepatide) subcutaneously once per week for 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._2_5,
                    enabled: true,
                },
            },
        },

        [GLP1_NAMES_TO_INDEX.SEMAGLUTIDE_BIANNUALLY_7_5_MG_HALLANDALE_0_25_DOSING]:
            // "dosage_adjustment_sigs" : {
            //     "month_1" : {
            //         "decrease" : "N/A",
            //         "maintain" : "Inject 10 units (0.25 mg of semaglutide) subcutaneously once per week for 4 weeks",
            //         "increase" : "Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for 4 weeks"
            //     },
            //     "month_2" : {
            //         "decrease" : "N/A",
            //         "maintain" : "Inject 10 units (0.25 mg of semaglutide) subcutaneously once per week for 4 weeks",
            //         "increase" : "Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for 4 weeks"
            //     },
            //     "month_3" : {
            //         "decrease" : "N/A",
            //         "maintain" : "Inject 10 units (0.25 mg of semaglutide) subcutaneously once per week for 4 weeks",
            //         "increase" : "Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for 4 weeks"
            //     },
            //     "month_4" : {
            //         "decrease" : "N/A",
            //         "maintain" : "Inject 10 units (0.25 mg of semaglutide) subcutaneously once per week for 4 weeks",
            //         "increase" : "Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for 4 weeks"
            //     },
            //     "month_5" : {
            //         "decrease" : "N/A",
            //         "maintain" : "Inject 10 units (0.25 mg of semaglutide) subcutaneously once per week for 4 weeks",
            //         "increase" : "Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for 4 weeks"
            //     },
            //     "month_6" : {
            //         "decrease" : "N/A",
            //         "maintain" : "Inject 10 units (0.25 mg of semaglutide) subcutaneously once per week for 4 weeks",
            //         "increase" : "Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for 4 weeks"
            //     }
            // }

            {
                1: {
                    [DOSING_TYPE.DECREASE]: {
                        sig: 'N/A',
                        dosage: SEMAGLUTIDE_DOSAGE._0_25,
                        enabled: false,
                    },
                    [DOSING_TYPE.MAINTAIN]: {
                        sig: 'Inject 10 units (0.25 mg of semaglutide) subcutaneously once per week for 4 weeks',
                        dosage: SEMAGLUTIDE_DOSAGE._0_25,
                        enabled: true,
                    },
                    [DOSING_TYPE.INCREASE]: {
                        sig: 'Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for 4 weeks',
                        dosage: SEMAGLUTIDE_DOSAGE._0_5,
                        enabled: true,
                    },
                },
                2: {
                    [DOSING_TYPE.DECREASE]: {
                        sig: 'N/A',
                        dosage: SEMAGLUTIDE_DOSAGE._0_25,
                        enabled: false,
                    },
                    [DOSING_TYPE.MAINTAIN]: {
                        sig: 'Inject 10 units (0.25 mg of semaglutide) subcutaneously once per week for 4 weeks',
                        dosage: SEMAGLUTIDE_DOSAGE._0_25,
                        enabled: true,
                    },
                    [DOSING_TYPE.INCREASE]: {
                        sig: 'Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for 4 weeks',
                        dosage: SEMAGLUTIDE_DOSAGE._0_5,
                        enabled: true,
                    },
                },
                3: {
                    [DOSING_TYPE.DECREASE]: {
                        sig: 'N/A',
                        dosage: SEMAGLUTIDE_DOSAGE._0_25,
                        enabled: false,
                    },
                    [DOSING_TYPE.MAINTAIN]: {
                        sig: 'Inject 10 units (0.25 mg of semaglutide) subcutaneously once per week for 4 weeks',
                        dosage: SEMAGLUTIDE_DOSAGE._0_25,
                        enabled: true,
                    },
                    [DOSING_TYPE.INCREASE]: {
                        sig: 'Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for 4 weeks',
                        dosage: SEMAGLUTIDE_DOSAGE._0_5,
                        enabled: true,
                    },
                },
                4: {
                    [DOSING_TYPE.DECREASE]: {
                        sig: 'N/A',
                        dosage: SEMAGLUTIDE_DOSAGE._0_25,
                        enabled: false,
                    },
                    [DOSING_TYPE.MAINTAIN]: {
                        sig: 'Inject 10 units (0.25 mg of semaglutide) subcutaneously once per week for 4 weeks',
                        dosage: SEMAGLUTIDE_DOSAGE._0_25,
                        enabled: true,
                    },
                    [DOSING_TYPE.INCREASE]: {
                        sig: 'Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for 4 weeks',
                        dosage: SEMAGLUTIDE_DOSAGE._0_5,
                        enabled: true,
                    },
                },
                5: {
                    [DOSING_TYPE.DECREASE]: {
                        sig: 'N/A',
                        dosage: SEMAGLUTIDE_DOSAGE._0_25,
                        enabled: false,
                    },
                    [DOSING_TYPE.MAINTAIN]: {
                        sig: 'Inject 10 units (0.25 mg of semaglutide) subcutaneously once per week for 4 weeks',
                        dosage: SEMAGLUTIDE_DOSAGE._0_25,
                        enabled: true,
                    },
                    [DOSING_TYPE.INCREASE]: {
                        sig: 'Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for 4 weeks',
                        dosage: SEMAGLUTIDE_DOSAGE._0_5,
                        enabled: true,
                    },
                },
                6: {
                    [DOSING_TYPE.DECREASE]: {
                        sig: 'N/A',
                        dosage: SEMAGLUTIDE_DOSAGE._0_25,
                        enabled: false,
                    },
                    [DOSING_TYPE.MAINTAIN]: {
                        sig: 'Inject 10 units (0.25 mg of semaglutide) subcutaneously once per week for 4 weeks',
                        dosage: SEMAGLUTIDE_DOSAGE._0_25,
                        enabled: true,
                    },
                    [DOSING_TYPE.INCREASE]: {
                        sig: 'Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for 4 weeks',
                        dosage: SEMAGLUTIDE_DOSAGE._0_5,
                        enabled: true,
                    },
                },
            },
        [GLP1_NAMES_TO_INDEX.SEMAGLUTIDE_BIANNUALLY_15_MG_HALLANDALE]: {
            // "dosage_adjustment_sigs" : {
            //     "month_1" : {
            //         "decrease" : "Inject 10 units (0.25 mg of semaglutide) subcutaneously once per week for 4 weeks",
            //         "maintain" : "Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for 4 weeks",
            //         "increase" : "Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for 4 weeks"
            //     },
            //     "month_2" : {
            //         "decrease" : "Inject 10 units (0.25 mg of semaglutide) subcutaneously once per week for 4 weeks",
            //         "maintain" : "Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for 4 weeks",
            //         "increase" : "Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for 4 weeks"
            //     },
            //     "month_3" : {
            //         "decrease" : "Inject 10 units (0.25 mg of semaglutide) subcutaneously once per week for 4 weeks",
            //         "maintain" : "Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for 4 weeks",
            //         "increase" : "Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for 4 weeks"
            //     },
            //     "month_4" : {
            //         "decrease" : "Inject 10 units (0.25 mg of semaglutide) subcutaneously once per week for 4 weeks",
            //         "maintain" : "Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for 4 weeks",
            //         "increase" : "Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for 4 weeks"
            //     },
            //     "month_5" : {
            //         "decrease" : "Inject 10 units (0.25 mg of semaglutide) subcutaneously once per week for 4 weeks",
            //         "maintain" : "Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for 4 weeks",
            //         "increase" : "Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for 4 weeks"
            //     },
            //     "month_6" : {
            //         "decrease" : "Inject 10 units (0.25 mg of semaglutide) subcutaneously once per week for 4 weeks",
            //         "maintain" : "Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for 4 weeks",
            //         "increase" : "Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for 4 weeks"
            //     }
            // }
            1: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 10 units (0.25 mg of semaglutide) subcutaneously once per week for 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._0_25,
                    enabled: true,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._0_5,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._1_25,
                    enabled: true,
                },
            },
            2: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 10 units (0.25 mg of semaglutide) subcutaneously once per week for 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._0_25,
                    enabled: true,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._0_5,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._1_25,
                    enabled: true,
                },
            },
            3: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 10 units (0.25 mg of semaglutide) subcutaneously once per week for 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._0_25,
                    enabled: true,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._0_5,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._1_25,
                    enabled: true,
                },
            },
            4: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 10 units (0.25 mg of semaglutide) subcutaneously once per week for 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._0_25,
                    enabled: true,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._0_5,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._1_25,
                    enabled: true,
                },
            },
            5: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 10 units (0.25 mg of semaglutide) subcutaneously once per week for 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._0_25,
                    enabled: true,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._0_5,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._1_25,
                    enabled: true,
                },
            },
            6: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 10 units (0.25 mg of semaglutide) subcutaneously once per week for 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._0_25,
                    enabled: true,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._0_5,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._1_25,
                    enabled: true,
                },
            },
        },
        [GLP1_NAMES_TO_INDEX.SEMAGLUTIDE_BIANNUALLY_7_5_MG_HALLANDALE_1_25_DOSING]:
            // "dosage_adjustment_sigs" : {
            //     "month_1" : {
            //         "decrease" : "Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for 4 weeks",
            //         "maintain" : "Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for 4 weeks",
            //         "increase" : "Inject 100 units (2.5 mg of semaglutide) subcutaneously once per week for 4 weeks"
            //     },
            //     "month_2" : {
            //         "decrease" : "Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for 4 weeks",
            //         "maintain" : "Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for 4 weeks",
            //         "increase" : "Inject 100 units (2.5 mg of semaglutide) subcutaneously once per week for 4 weeks"
            //     },
            //     "month_3" : {
            //         "decrease" : "Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for 4 weeks",
            //         "maintain" : "Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for 4 weeks",
            //         "increase" : "Inject 100 units (2.5 mg of semaglutide) subcutaneously once per week for 4 weeks"
            //     },
            //     "month_4" : {
            //         "decrease" : "Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for 4 weeks",
            //         "maintain" : "Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for 4 weeks",
            //         "increase" : "Inject 100 units (2.5 mg of semaglutide) subcutaneously once per week for 4 weeks"
            //     },
            //     "month_5" : {
            //         "decrease" : "Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for 4 weeks",
            //         "maintain" : "Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for 4 weeks",
            //         "increase" : "Inject 100 units (2.5 mg of semaglutide) subcutaneously once per week for 4 weeks"
            //     },
            //     "month_6" : {
            //         "decrease" : "Inject 10 units (0.25 mg of semaglutide) subcutaneously once per week for 4 weeks",
            //         "maintain" : "Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for 4 weeks",
            //         "increase" : "Inject 100 units (2.5 mg of semaglutide) subcutaneously once per week for 4 weeks"
            //     }
            // }
            {
                1: {
                    [DOSING_TYPE.DECREASE]: {
                        sig: 'Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for 4 weeks',
                        dosage: SEMAGLUTIDE_DOSAGE._0_5,
                        enabled: true,
                    },
                    [DOSING_TYPE.MAINTAIN]: {
                        sig: 'Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for 4 weeks',
                        dosage: SEMAGLUTIDE_DOSAGE._1_25,
                        enabled: true,
                    },
                    [DOSING_TYPE.INCREASE]: {
                        sig: 'Inject 100 units (2.5 mg of semaglutide) subcutaneously once per week for 4 weeks',
                        dosage: SEMAGLUTIDE_DOSAGE._2_5,
                        enabled: true,
                    },
                },
                2: {
                    [DOSING_TYPE.DECREASE]: {
                        sig: 'Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for 4 weeks',
                        dosage: SEMAGLUTIDE_DOSAGE._0_5,
                        enabled: true,
                    },
                    [DOSING_TYPE.MAINTAIN]: {
                        sig: 'Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for 4 weeks',
                        dosage: SEMAGLUTIDE_DOSAGE._1_25,
                        enabled: true,
                    },
                    [DOSING_TYPE.INCREASE]: {
                        sig: 'Inject 100 units (2.5 mg of semaglutide) subcutaneously once per week for 4 weeks',
                        dosage: SEMAGLUTIDE_DOSAGE._2_5,
                        enabled: true,
                    },
                },
                3: {
                    [DOSING_TYPE.DECREASE]: {
                        sig: 'Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for 4 weeks',
                        dosage: SEMAGLUTIDE_DOSAGE._0_5,
                        enabled: true,
                    },
                    [DOSING_TYPE.MAINTAIN]: {
                        sig: 'Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for 4 weeks',
                        dosage: SEMAGLUTIDE_DOSAGE._1_25,
                        enabled: true,
                    },
                    [DOSING_TYPE.INCREASE]: {
                        sig: 'Inject 100 units (2.5 mg of semaglutide) subcutaneously once per week for 4 weeks',
                        dosage: SEMAGLUTIDE_DOSAGE._2_5,
                        enabled: true,
                    },
                },
                4: {
                    [DOSING_TYPE.DECREASE]: {
                        sig: 'Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for 4 weeks',
                        dosage: SEMAGLUTIDE_DOSAGE._0_5,
                        enabled: true,
                    },
                    [DOSING_TYPE.MAINTAIN]: {
                        sig: 'Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for 4 weeks',
                        dosage: SEMAGLUTIDE_DOSAGE._1_25,
                        enabled: true,
                    },
                    [DOSING_TYPE.INCREASE]: {
                        sig: 'Inject 100 units (2.5 mg of semaglutide) subcutaneously once per week for 4 weeks',
                        dosage: SEMAGLUTIDE_DOSAGE._2_5,
                        enabled: true,
                    },
                },
                5: {
                    [DOSING_TYPE.DECREASE]: {
                        sig: 'Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for 4 weeks',
                        dosage: SEMAGLUTIDE_DOSAGE._0_5,
                        enabled: true,
                    },
                    [DOSING_TYPE.MAINTAIN]: {
                        sig: 'Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for 4 weeks',
                        dosage: SEMAGLUTIDE_DOSAGE._1_25,
                        enabled: true,
                    },
                    [DOSING_TYPE.INCREASE]: {
                        sig: 'Inject 100 units (2.5 mg of semaglutide) subcutaneously once per week for 4 weeks',
                        dosage: SEMAGLUTIDE_DOSAGE._2_5,
                        enabled: true,
                    },
                },
                6: {
                    [DOSING_TYPE.DECREASE]: {
                        sig: 'Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for 4 weeks',
                        dosage: SEMAGLUTIDE_DOSAGE._0_5,
                        enabled: true,
                    },
                    [DOSING_TYPE.MAINTAIN]: {
                        sig: 'Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for 4 weeks',
                        dosage: SEMAGLUTIDE_DOSAGE._1_25,
                        enabled: true,
                    },
                    [DOSING_TYPE.INCREASE]: {
                        sig: 'Inject 100 units (2.5 mg of semaglutide) subcutaneously once per week for 4 weeks',
                        dosage: SEMAGLUTIDE_DOSAGE._2_5,
                        enabled: true,
                    },
                },
            },
        [GLP1_NAMES_TO_INDEX.SEMAGLUTIDE_BIANNUALLY_17_5_MG_HALLANDALE]: {
            // "dosage_adjustment_sigs" : {
            //     "month_1" : {
            //         "decrease" : "Inject 10 units (0.25 mg of semaglutide) subcutaneously once per week for 4 weeks",
            //         "maintain" : "Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for 4 weeks",
            //         "increase" : "Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for 4 weeks"
            //     },
            //     "month_2" : {
            //         "decrease" : "Inject 10 units (0.25 mg of semaglutide) subcutaneously once per week for 4 weeks",
            //         "maintain" : "Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for 4 weeks",
            //         "increase" : "Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for 4 weeks"
            //     },
            //     "month_3" : {
            //         "decrease" : "Inject 10 units (0.25 mg of semaglutide) subcutaneously once per week for 4 weeks",
            //         "maintain" : "Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for 4 weeks",
            //         "increase" : "Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for 4 weeks"
            //     },
            //     "month_4" : {
            //         "decrease" : "Inject 10 units (0.25 mg of semaglutide) subcutaneously once per week for 4 weeks",
            //         "maintain" : "Inject 40 units (1 mg of semaglutide) subcutaneously once per week for 4 weeks",
            //         "increase" : "Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for 4 weeks"
            //     },
            //     "month_5" : {
            //         "decrease" : "Inject 10 units (0.25 mg of semaglutide) subcutaneously once per week for 4 weeks",
            //         "maintain" : "Inject 40 units (1 mg of semaglutide) subcutaneously once per week for 4 weeks",
            //         "increase" : "Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for 4 weeks"
            //     },
            //     "month_6" : {
            //         "decrease" : "Inject 10 units (0.25 mg of semaglutide) subcutaneously once per week for 4 weeks",
            //         "maintain" : "Inject 40 units (1 mg of semaglutide) subcutaneously once per week for 4 weeks",
            //         "increase" : "Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for 4 weeks"
            //     }
            // }
            1: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 10 units (0.25 mg of semaglutide) subcutaneously once per week for 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._0_25,
                    enabled: true,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._0_5,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._1_25,
                    enabled: true,
                },
            },
            2: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 10 units (0.25 mg of semaglutide) subcutaneously once per week for 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._0_25,
                    enabled: true,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._0_5,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._1_25,
                    enabled: true,
                },
            },
            3: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 10 units (0.25 mg of semaglutide) subcutaneously once per week for 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._0_25,
                    enabled: true,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._0_5,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._1_25,
                    enabled: true,
                },
            },
            4: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 10 units (0.25 mg of semaglutide) subcutaneously once per week for 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._0_25,
                    enabled: true,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 40 units (1 mg of semaglutide) subcutaneously once per week for 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._1,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._1_25,
                    enabled: true,
                },
            },
            5: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 10 units (0.25 mg of semaglutide) subcutaneously once per week for 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._0_25,
                    enabled: true,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 40 units (1 mg of semaglutide) subcutaneously once per week for 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._1,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._1_25,
                    enabled: true,
                },
            },
            6: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 10 units (0.25 mg of semaglutide) subcutaneously once per week for 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._0_25,
                    enabled: true,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 40 units (1 mg of semaglutide) subcutaneously once per week for 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._1,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._1_25,
                    enabled: true,
                },
            },
        },
        [GLP1_NAMES_TO_INDEX.SEMAGLUTIDE_BIANNUALLY_37_5_MG_HALLANDALE]: {
            // "dosage_adjustment_sigs" : {
            //     "month_1" : {
            //         "decrease" : "Inject 10 units (0.25 mg of semaglutide) subcutaneously once per week for 4 weeks",
            //         "maintain" : "Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for 4 weeks",
            //         "increase" : "Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for 4 weeks"
            //     },
            //     "month_2" : {
            //         "decrease" : "Inject 10 units (0.25 mg of semaglutide) subcutaneously once per week for 4 weeks",
            //         "maintain" : "Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for 4 weeks",
            //         "increase" : "Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for 4 weeks"
            //     },
            //     "month_3" : {
            //         "decrease" : "Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for 4 weeks",
            //         "maintain" : "Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for 4 weeks",
            //         "increase" : "Inject 100 units (2.5 mg of semaglutide) subcutaneously once per week for 4 weeks"
            //     },
            //     "month_4" : {
            //         "decrease" : "Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for 4 weeks",
            //         "maintain" : "Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for 4 weeks",
            //         "increase" : "Inject 100 units (2.5 mg of semaglutide) subcutaneously once per week for 4 weeks"
            //     },
            //     "month_5" : {
            //         "decrease" : "Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for 4 weeks",
            //         "maintain" : "Inject 100 units (2.5 mg of semaglutide) subcutaneously once per week for 4 weeks",
            //         "increase" : "N/A"
            //     },
            //     "month_6" : {
            //         "decrease" : "Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for 4 weeks",
            //         "maintain" : "Inject 100 units (2.5 mg of semaglutide) subcutaneously once per week for 4 weeks",
            //         "increase" : "N/A"
            //     }
            // }
            1: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 10 units (0.25 mg of semaglutide) subcutaneously once per week for 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._0_25,
                    enabled: true,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._0_5,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._1_25,
                    enabled: true,
                },
            },
            2: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 10 units (0.25 mg of semaglutide) subcutaneously once per week for 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._0_25,
                    enabled: true,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._0_5,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._1_25,
                    enabled: true,
                },
            },
            3: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._0_5,
                    enabled: true,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._1_25,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject 100 units (2.5 mg of semaglutide) subcutaneously once per week for 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._2_5,
                    enabled: true,
                },
            },
            4: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._0_5,
                    enabled: true,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._1_25,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject 100 units (2.5 mg of semaglutide) subcutaneously once per week for 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._2_5,
                    enabled: true,
                },
            },
            5: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._1_25,
                    enabled: true,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 100 units (2.5 mg of semaglutide) subcutaneously once per week for 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._2_5,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'N/A',
                    dosage: SEMAGLUTIDE_DOSAGE._2_5,
                    enabled: false,
                },
            },
            6: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._1_25,
                    enabled: true,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 100 units (2.5 mg of semaglutide) subcutaneously once per week for 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._2_5,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'N/A',
                    dosage: SEMAGLUTIDE_DOSAGE._2_5,
                    enabled: false,
                },
            },
        },
        [GLP1_NAMES_TO_INDEX.SEMAGLUTIDE_BIANNUALLY_50_MG_HALLANDALE]: {
            // "dosage_adjustment_sigs" : {
            //     "month_1" : {
            //         "decrease" : "Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for 4 weeks",
            //         "maintain" : "Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for 4 weeks",
            //         "increase" : "Inject 100 units (2.5 mg of semaglutide) subcutaneously once per week for 4 weeks"
            //     },
            //     "month_2" : {
            //         "decrease" : "Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for 4 weeks",
            //         "maintain" : "Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for 4 weeks",
            //         "increase" : "Inject 100 units (2.5 mg of semaglutide) subcutaneously once per week for 4 weeks"
            //     },
            //     "month_3" : {
            //         "decrease" : "Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for 4 weeks",
            //         "maintain" : "Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for 4 weeks",
            //         "increase" : "Inject 100 units (2.5 mg of semaglutide) subcutaneously once per week for 4 weeks"
            //     },
            //     "month_4" : {
            //         "decrease" : "Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for 4 weeks",
            //         "maintain" : "Inject 100 units (2.5 mg of semaglutide) subcutaneously once per week for 4 weeks",
            //         "increase" : "N/A"
            //     },
            //     "month_5" : {
            //         "decrease" : "Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for 4 weeks",
            //         "maintain" : "Inject 100 units (2.5 mg of semaglutide) subcutaneously once per week for 4 weeks",
            //         "increase" : "N/A"
            //     },
            //     "month_6" : {
            //         "decrease" : "Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for 4 weeks",
            //         "maintain" : "Inject 100 units (2.5 mg of semaglutide) subcutaneously once per week for 4 weeks",
            //         "increase" : "N/A"
            //     }
            // }
            1: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._0_5,
                    enabled: true,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._1_25,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject 100 units (2.5 mg of semaglutide) subcutaneously once per week for 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._2_5,
                    enabled: true,
                },
            },
            2: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._0_5,
                    enabled: true,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._1_25,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject 100 units (2.5 mg of semaglutide) subcutaneously once per week for 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._2_5,
                    enabled: true,
                },
            },
            3: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._0_5,
                    enabled: true,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._1_25,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject 100 units (2.5 mg of semaglutide) subcutaneously once per week for 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._2_5,
                    enabled: true,
                },
            },
            4: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._1_25,
                    enabled: true,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 100 units (2.5 mg of semaglutide) subcutaneously once per week for 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._2_5,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'N/A',
                    dosage: SEMAGLUTIDE_DOSAGE._2_5,
                    enabled: false,
                },
            },
            5: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._1_25,
                    enabled: true,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 100 units (2.5 mg of semaglutide) subcutaneously once per week for 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._2_5,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'N/A',
                    dosage: SEMAGLUTIDE_DOSAGE._2_5,
                    enabled: false,
                },
            },
            6: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._1_25,
                    enabled: true,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 100 units (2.5 mg of semaglutide) subcutaneously once per week for 4 weeks',
                    dosage: SEMAGLUTIDE_DOSAGE._2_5,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'N/A',
                    dosage: SEMAGLUTIDE_DOSAGE._2_5,
                    enabled: false,
                },
            },
        },
    },
    [PRODUCT_HREF.TIRZEPATIDE]: {
        [GLP1_NAMES_TO_INDEX.TIRZEPATIDE_QUARTERLY_60_MG_EMPOWER]: {  
            // "dosage_adjustment_sigs" : {
            //     "month_1" : {
            //         "decrease" : "Inject 31 units (2.5 mg of tirzepatide) subcutaneously once per week for weeks 1-4 from the Tirzepatide/niacinamide 8/2 MG/ML (2.5 ML)",
            //         "maintain" : "Inject 31 units (2.5 mg of tirzepatide) subcutaneously once per week for weeks 1-4 from the Tirzepatide/niacinamide 8/2 MG/ML (2.5 ML)",
            //         "increase" : "Inject 63 units (5 mg of tirzepatide) subcutaneously once per week for weeks 1-4 from the Tirzepatide/niacinamide 8/2 MG/ML (2.5 ML)"
            //     },
            //     "month_2" : {
            //         "decrease" : "Inject 31 units (2.5 mg of tirzepatide) subcutaneously once per week for weeks 1-4 from the Tirzepatide/niacinamide 8/2 MG/ML (2.5 ML)",
            //         "maintain" : "Inject 31 units (2.5 mg of tirzepatide) subcutaneously once per week for weeks 1-4 from the Tirzepatide/niacinamide 8/2 MG/ML (2.5 ML)",
            //         "increase" : "Inject 63 units (5 mg of tirzepatide) subcutaneously once per week for weeks 1-4 from the Tirzepatide/niacinamide 8/2 MG/ML (2.5 ML)"
            //     },
            //     "month_3" : {
            //         "decrease" : "Inject 31 units (2.5 mg of tirzepatide) subcutaneously once per week for weeks 1-4 from the Tirzepatide/niacinamide 8/2 MG/ML (2.5 ML)",
            //         "maintain" : "Inject 31 units (2.5 mg of tirzepatide) subcutaneously once per week for weeks 1-4 from the Tirzepatide/niacinamide 8/2 MG/ML (2.5 ML)",
            //         "increase" : "Inject 63 units (5 mg of tirzepatide) subcutaneously once per week for weeks 1-4 from the Tirzepatide/niacinamide 8/2 MG/ML (2.5 ML)"
            //     }
            // }  
            1: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 30 units (2.5 mg of tirzepatide) subcutaneously once per week for weeks 1-4 from the Tirzepatide/niacinamide 8/2 MG/ML (2.5 ML)',
                    dosage: TIRZEPATIDE_DOSAGE._2_5,
                    enabled: true,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 30 units (2.5 mg of tirzepatide) subcutaneously once per week for weeks 1-4 from the Tirzepatide/niacinamide 8/2 MG/ML (2.5 ML)',
                    dosage: TIRZEPATIDE_DOSAGE._2_5,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject 63 units (5mg of tirzepatide) subcutaneously once per week for weeks 5-8 from the Tirzepatide/niacinamide 8/2 MG/ML (2.5 ML)',
                    dosage: TIRZEPATIDE_DOSAGE._5,
                    enabled: true,
                },
            },
            2: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 30 units (2.5 mg of tirzepatide) subcutaneously once per week for weeks 1-4 from the Tirzepatide/niacinamide 8/2 MG/ML (2.5 ML)',
                    dosage: TIRZEPATIDE_DOSAGE._2_5,
                    enabled: true,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 30 units (2.5 mg of tirzepatide) subcutaneously once per week for weeks 1-4 from the Tirzepatide/niacinamide 8/2 MG/ML (2.5 ML)',
                    dosage: TIRZEPATIDE_DOSAGE._2_5,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject 63 units (5mg of tirzepatide) subcutaneously once per week for weeks 9-12 from the Tirzepatide/niacinamide 8/2 MG/ML (2.5 ML)',
                    dosage: TIRZEPATIDE_DOSAGE._5,
                    enabled: true,
                },
            },
            3: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 30 units (2.5 mg of tirzepatide) subcutaneously once per week for weeks 1-4 from the Tirzepatide/niacinamide 8/2 MG/ML (2.5 ML)',
                    dosage: TIRZEPATIDE_DOSAGE._2_5,
                    enabled: true,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 30 units (2.5 mg of tirzepatide) subcutaneously once per week for weeks 1-4 from the Tirzepatide/niacinamide 8/2 MG/ML (2.5 ML)',
                    dosage: TIRZEPATIDE_DOSAGE._2_5,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject 63 units (5mg of tirzepatide) subcutaneously once per week for weeks 9-12 from the Tirzepatide/niacinamide 8/2 MG/ML (2.5 ML)',
                    dosage: TIRZEPATIDE_DOSAGE._5,
                    enabled: true,
                },
            },
        },
        [GLP1_NAMES_TO_INDEX.TIRZEPATIDE_QUARTERLY_60_MG_CHECK_IN_EMPOWER]: {
            // "dosage_adjustment_sigs" : {
            //     "month_1" : {
            //         "decrease" : "Inject 31 units (2.5 mg of tirzepatide) subcutaneously once per week for weeks 1-4 from the Tirzepatide/niacinamide 8/2 MG/ML (2.5 ML)",
            //         "maintain" : "Inject 31 units (2.5 mg of tirzepatide) subcutaneously once per week for weeks 1-4 from the Tirzepatide/niacinamide 8/2 MG/ML (2.5 ML)",
            //         "increase" : "Inject 63 units (5 mg of tirzepatide) subcutaneously once per week for weeks 1-4 from the Tirzepatide/niacinamide 8/2 MG/ML (2.5 ML)"
            //     },
            //     "month_2" : {
            //         "decrease" : "Inject 31 units (2.5 mg of tirzepatide) subcutaneously once per week for weeks 1-4 from the Tirzepatide/niacinamide 8/2 MG/ML (2.5 ML)",
            //         "maintain" : "Inject 31 units (2.5 mg of tirzepatide) subcutaneously once per week for weeks 1-4 from the Tirzepatide/niacinamide 8/2 MG/ML (2.5 ML)",
            //         "increase" : "Inject 63 units (5 mg of tirzepatide) subcutaneously once per week for weeks 1-4 from the Tirzepatide/niacinamide 8/2 MG/ML (2.5 ML)"
            //     },
            //     "month_3" : {
            //         "decrease" : "Inject 31 units (2.5 mg of tirzepatide) subcutaneously once per week for weeks 1-4 from the Tirzepatide/niacinamide 8/2 MG/ML (2.5 ML)",
            //         "maintain" : "Inject 31 units (2.5 mg of tirzepatide) subcutaneously once per week for weeks 1-4 from the Tirzepatide/niacinamide 8/2 MG/ML (2.5 ML)",
            //         "increase" : "Inject 63 units (5 mg of tirzepatide) subcutaneously once per week for weeks 1-4 from the Tirzepatide/niacinamide 8/2 MG/ML (2.5 ML)"
            //     }
            // }  
            1: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 30 units (2.5 mg of tirzepatide) subcutaneously once per week for weeks 1-4 from the Tirzepatide/niacinamide 8/2 MG/ML (2.5 ML)',
                    dosage: TIRZEPATIDE_DOSAGE._2_5,
                    enabled: true,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 30 units (2.5 mg of tirzepatide) subcutaneously once per week for weeks 1-4 from the Tirzepatide/niacinamide 8/2 MG/ML (2.5 ML)',
                    dosage: TIRZEPATIDE_DOSAGE._2_5,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject 63 units (5mg of tirzepatide) subcutaneously once per week for weeks 5-8 from the Tirzepatide/niacinamide 8/2 MG/ML (2.5 ML)',
                    dosage: TIRZEPATIDE_DOSAGE._5,
                    enabled: true,
                },
            },
            2: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 30 units (2.5 mg of tirzepatide) subcutaneously once per week for weeks 1-4 from the Tirzepatide/niacinamide 8/2 MG/ML (2.5 ML)',
                    dosage: TIRZEPATIDE_DOSAGE._2_5,
                    enabled: true,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 30 units (2.5 mg of tirzepatide) subcutaneously once per week for weeks 1-4 from the Tirzepatide/niacinamide 8/2 MG/ML (2.5 ML)',
                    dosage: TIRZEPATIDE_DOSAGE._2_5,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject 63 units (5mg of tirzepatide) subcutaneously once per week for weeks 9-12 from the Tirzepatide/niacinamide 8/2 MG/ML (2.5 ML)',
                    dosage: TIRZEPATIDE_DOSAGE._5,
                    enabled: true,
                },
            },
            3: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 30 units (2.5 mg of tirzepatide) subcutaneously once per week for weeks 1-4 from the Tirzepatide/niacinamide 8/2 MG/ML (2.5 ML)',
                    dosage: TIRZEPATIDE_DOSAGE._2_5,
                    enabled: true,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 30 units (2.5 mg of tirzepatide) subcutaneously once per week for weeks 1-4 from the Tirzepatide/niacinamide 8/2 MG/ML (2.5 ML)',
                    dosage: TIRZEPATIDE_DOSAGE._2_5,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject 63 units (5mg of tirzepatide) subcutaneously once per week for weeks 9-12 from the Tirzepatide/niacinamide 8/2 MG/ML (2.5 ML)',
                    dosage: TIRZEPATIDE_DOSAGE._5,
                    enabled: true,
                },
            },
        },
        [GLP1_NAMES_TO_INDEX.TIRZEPATIDE_QUARTERLY_88_MG_EMPOWER]: {
            // "dosage_adjustment_sigs" : {
            //     "month_1" : {
            //         "decrease" : "Inject 63 units (5 mg of tirzepatide) subcutaneously once per week for weeks 1-4 from the Tirzepatide/niacinamide 8/2 MG/ML (2.5 ML)",
            //         "maintain" : "Inject 63 units (5 mg of tirzepatide) subcutaneously once per week for weeks 1-4 from the Tirzepatide/niacinamide 8/2 MG/ML (2.5 ML)",
            //         "increase" : "Inject 63 units (5 mg of tirzepatide) subcutaneously once per week for weeks 1-4 from the Tirzepatide/niacinamide 8/2 MG/ML (2.5 ML)"
            //     },
            //     "month_2" : {
            //         "decrease" : "Inject 29 units (5 mg of tirzepatide) subcutaneously once per week for weeks 5-8 from the Tirzepatide/niacinamide 17/2 MG/ML (2 ML)",
            //         "maintain" : "Inject 29 units (5 mg of tirzepatide) subcutaneously once per week for weeks 5-8 from the Tirzepatide/niacinamide 17/2 MG/ML (2 ML)",
            //         "increase" : "Inject 44 units (7.5 mg of tirzepatide) subcutaneously once per week for weeks 5-8 from the Tirzepatide/niacinamide 17/2 MG/ML (2 ML)"
            //     },
            //     "month_3" : {
            //         "decrease" : "Inject 29 units (5 mg of tirzepatide) subcutaneously once per week for weeks 9-12 from the Tirzepatide/niacinamide 17/2 MG/ML (2 ML)",
            //         "maintain" : "Inject 29 units (5 mg of tirzepatide) subcutaneously once per week for weeks 9-12 from the Tirzepatide/niacinamide 17/2 MG/ML (2 ML)",
            //         "increase" : "Inject 44 units (7.5 mg of tirzepatide) subcutaneously once per week for weeks 9-12 from the Tirzepatide/niacinamide 17/2 MG/ML (2 ML)"
            //     }
            // }  
            1: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 63 units (5 mg of tirzepatide) subcutaneously once per week for weeks 1-4 from the Tirzepatide/niacinamide 8/2 MG/ML (2.5 ML)',
                    dosage: TIRZEPATIDE_DOSAGE._5,
                    enabled: true,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 63 units (5 mg of tirzepatide) subcutaneously once per week for weeks 1-4 from the Tirzepatide/niacinamide 8/2 MG/ML (2.5 ML)',
                    dosage: TIRZEPATIDE_DOSAGE._5,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject 63 units (5 mg of tirzepatide) subcutaneously once per week for weeks 1-4 from the Tirzepatide/niacinamide 8/2 MG/ML (2.5 ML)',
                    dosage: TIRZEPATIDE_DOSAGE._5,
                    enabled: true,
                },
            },
            2: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 29 units (5 mg of tirzepatide) subcutaneously once per week for weeks 1-12 from the Tirzepatide/niacinamide 17/2 MG/ML (2 ML)',
                    dosage: TIRZEPATIDE_DOSAGE._5,
                    enabled: true,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 29 units (5 mg of tirzepatide) subcutaneously once per week for weeks 1-12 from the Tirzepatide/niacinamide 17/2 MG/ML (2 ML)',
                    dosage: TIRZEPATIDE_DOSAGE._5,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject 44 units (7.5 mg of tirzepatide) subcutaneously once per week for weeks 1-12 from the Tirzepatide/niacinamide 17/2 MG/ML (2 ML)',
                    dosage: TIRZEPATIDE_DOSAGE._7_5,
                    enabled: true,
                },
            },
            3: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 29 units (5 mg of tirzepatide) subcutaneously once per week for weeks 1-12 from the Tirzepatide/niacinamide 17/2 MG/ML (2 ML)',
                    dosage: TIRZEPATIDE_DOSAGE._5,
                    enabled: true,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 29 units (5 mg of tirzepatide) subcutaneously once per week for weeks 1-12 from the Tirzepatide/niacinamide 17/2 MG/ML (2 ML)',
                    dosage: TIRZEPATIDE_DOSAGE._5,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject 44 units (7.5 mg of tirzepatide) subcutaneously once per week for weeks 1-12 from the Tirzepatide/niacinamide 17/2 MG/ML (2 ML)',
                    dosage: TIRZEPATIDE_DOSAGE._7_5,
                    enabled: true,
                },
            },
        },
        [GLP1_NAMES_TO_INDEX.TIRZEPATIDE_QUARTERLY_102_MG_EMPOWER]: {
            // "dosage_adjustment_sigs" : {
            //     "month_1" : {
            //         "decrease" : "Inject 29 units (5 mg of tirzepatide) subcutaneously once per week for weeks 1-12 from the Tirzepatide/niacinamide 17/2 MG/ML (2 ML).",
            //         "maintain" : "Inject 44 units (7.5 mg of tirzepatide) subcutaneously once per week for weeks 1-12 from the Tirzepatide/niacinamide 17/2 MG/ML (2 ML)",
            //         "increase" : "Inject 44 units (7.5 mg of tirzepatide) subcutaneously once per week for weeks 1-12 from the Tirzepatide/niacinamide 17/2 MG/ML (2 ML)."
            //     },
            //     "month_2" : {
            //         "decrease" : "Inject 29 units (5 mg of tirzepatide) subcutaneously once per week for weeks 5-8 from the Tirzepatide/niacinamide 17/2 MG/ML (2 ML).",
            //         "maintain" : "Inject 44 units (7.5 mg of tirzepatide) subcutaneously once per week for weeks 5-8 from the Tirzepatide/niacinamide 17/2 MG/ML (2 ML)",
            //         "increase" : "N/A"
            //     },
            //     "month_3" : {
            //         "decrease" : "Inject 29 units (5 mg of tirzepatide) subcutaneously once per week for weeks 9-12 from the Tirzepatide/niacinamide 17/2 MG/ML (2 ML).",
            //         "maintain" : "Inject 44 units (7.5 mg of tirzepatide) subcutaneously once per week for weeks 9-12 from the Tirzepatide/niacinamide 17/2 MG/ML (2 ML)",
            //         "increase" : "N/A"
            //     }
            // }
            1: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 29 units (5 mg of tirzepatide) subcutaneously once per week for weeks 1-12 from the Tirzepatide/niacinamide 17/2 MG/ML (2 ML).',
                    dosage: TIRZEPATIDE_DOSAGE._5,
                    enabled: true,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 44 units (7.5 mg of tirzepatide) subcutaneously once per week for weeks 1-12 from the Tirzepatide/niacinamide 17/2 MG/ML (2 ML)',
                    dosage: TIRZEPATIDE_DOSAGE._7_5,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject 44 units (7.5 mg of tirzepatide) subcutaneously once per week for weeks 1-12 from the Tirzepatide/niacinamide 17/2 MG/ML (2 ML).',
                    dosage: TIRZEPATIDE_DOSAGE._7_5,
                    enabled: true,
                },
            },
            2: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 29 units (5 mg of tirzepatide) subcutaneously once per week for weeks 1-12 from the Tirzepatide/niacinamide 17/2 MG/ML (2 ML).',
                    dosage: TIRZEPATIDE_DOSAGE._5,
                    enabled: true,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 44 units (7.5 mg of tirzepatide) subcutaneously once per week for weeks 1-12 from the Tirzepatide/niacinamide 17/2 MG/ML (2 ML)',
                    dosage: TIRZEPATIDE_DOSAGE._7_5,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'N/A',
                    dosage: TIRZEPATIDE_DOSAGE._7_5,
                    enabled: false,
                },
            },
            3: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 29 units (5 mg of tirzepatide) subcutaneously once per week for weeks 1-12 from the Tirzepatide/niacinamide 17/2 MG/ML (2 ML).',
                    dosage: TIRZEPATIDE_DOSAGE._5,
                    enabled: true,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 44 units (7.5 mg of tirzepatide) subcutaneously once per week for weeks 1-12 from the Tirzepatide/niacinamide 17/2 MG/ML (2 ML)',
                    dosage: TIRZEPATIDE_DOSAGE._7_5,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'N/A',
                    dosage: TIRZEPATIDE_DOSAGE._7_5,
                    enabled: false,
                },
            },
        },
        [GLP1_NAMES_TO_INDEX.TIRZEPATIDE_QUARTERLY_120_MG_EMPOWER]: {
            // "dosage_adjustment_sigs" : {
            //     "month_1" : {
            //         "decrease" : "N/A",
            //         "maintain" : "Inject 59 units (10 mg of tirzepatide) subcutaneously once per week for weeks 1-12",
            //         "increase" : "N/A"
            //     },
            //     "month_2" : {
            //         "decrease" : "N/A",
            //         "maintain" : "Inject 59 units (10 mg of tirzepatide) subcutaneously once per week for weeks 1-12",
            //         "increase" : "N/A"
            //     },
            //     "month_3" : {
            //         "decrease" : "N/A",
            //         "maintain" : "Inject 59 units (10 mg of tirzepatide) subcutaneously once per week for weeks 1-12",
            //         "increase" : "N/A"
            //     }
            // }
            1: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'N/A',
                    dosage: TIRZEPATIDE_DOSAGE._10,
                    enabled: false,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 59 units (10 mg of tirzepatide) subcutaneously once per week for weeks 1-12',
                    dosage: TIRZEPATIDE_DOSAGE._10,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'N/A',
                    dosage: TIRZEPATIDE_DOSAGE._10,
                    enabled: false,
                },
            },
            2: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'N/A',
                    dosage: TIRZEPATIDE_DOSAGE._10,
                    enabled: false,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 59 units (10 mg of tirzepatide) subcutaneously once per week for weeks 1-12',
                    dosage: TIRZEPATIDE_DOSAGE._10,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'N/A',
                    dosage: TIRZEPATIDE_DOSAGE._10,
                    enabled: false,
                },
            },
            3: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'N/A',
                    dosage: TIRZEPATIDE_DOSAGE._10,
                    enabled: false,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 59 units (10 mg of tirzepatide) subcutaneously once per week for weeks 1-12',
                    dosage: TIRZEPATIDE_DOSAGE._10,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'N/A',
                    dosage: TIRZEPATIDE_DOSAGE._10,
                    enabled: false,
                },
            },
        },
        [GLP1_NAMES_TO_INDEX.TIRZEPATIDE_QUARTERLY_150_MG_EMPOWER]: {

            // "dosage_adjustment_sigs": {
            //     "month_1" : {
            //         "decrease" : "N/A",
            //         "maintain" : "Inject 74 units (12.5 mg of tirzepatide) subcutaneously once per week for weeks 5-8.",
            //         "increase" : "N/A"
            //     },
            //     "month_2" : {
            //         "decrease" : "N/A",
            //         "maintain" : "Inject 74 units (12.5 mg of tirzepatide) subcutaneously once per week for weeks 5-8.",
            //         "increase" : "N/A"
            //     },
            //     "month_3" : {
            //         "decrease" : "N/A",
            //         "maintain" : "Inject 74 units (12.5 mg of tirzepatide) subcutaneously once per week for weeks 5-8.",
            //         "increase" : "N/A"
            //     }
            // }
            1: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'N/A',
                    dosage: TIRZEPATIDE_DOSAGE._12_5,
                    enabled: false,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 74 units (12.5 mg of tirzepatide) subcutaneously once per week for weeks 5-8.',
                    dosage: TIRZEPATIDE_DOSAGE._12_5,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'N/A',
                    dosage: TIRZEPATIDE_DOSAGE._12_5,
                    enabled: false,
                },
            },
            2: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'N/A',
                    dosage: TIRZEPATIDE_DOSAGE._12_5,
                    enabled: false,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 74 units (12.5 mg of tirzepatide) subcutaneously once per week for weeks 5-8.',
                    dosage: TIRZEPATIDE_DOSAGE._12_5,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'N/A',
                    dosage: TIRZEPATIDE_DOSAGE._12_5,
                    enabled: false,
                },
            },
            3: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'N/A',
                    dosage: TIRZEPATIDE_DOSAGE._12_5,
                    enabled: false,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 74 units (12.5 mg of tirzepatide) subcutaneously once per week for weeks 5-8.',
                    dosage: TIRZEPATIDE_DOSAGE._12_5,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'N/A',
                    dosage: TIRZEPATIDE_DOSAGE._12_5,
                    enabled: false,
                },
            },
        },
        [GLP1_NAMES_TO_INDEX.TIRZEPATIDE_QUARTERLY_136_MG_EMPOWER]: {

            // "dosage_adjustment_sigs" : {
            //     "month_1" : {
            //         "decrease" : "N/A",
            //         "maintain" : "Inject 59 units (10 mg of tirzepatide) subcutaneously once per week for weeks 1-12",
            //         "increase" : "N/A",
            //     },
            //     "month_2" : {
            //         "decrease" : "N/A",
            //         "maintain" : "Inject 59 units (10 mg of tirzepatide) subcutaneously once per week for weeks 1-12",
            //         "increase" : "N/A"
            //     },
            //     "month_3" : {
            //         "decrease" : "N/A",
            //         "maintain" : "Inject 59 units (10 mg of tirzepatide) subcutaneously once per week for weeks 1-12",
            //         "increase" : "N/A"
            //     }
            // }

            1: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'N/A',
                    dosage: TIRZEPATIDE_DOSAGE._10,
                    enabled: false,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 59 units (10 mg of tirzepatide) subcutaneously once per week for weeks 1-12',
                    dosage: TIRZEPATIDE_DOSAGE._10,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'N/A',
                    dosage: TIRZEPATIDE_DOSAGE._10,
                    enabled: false,
                },
            },
            2: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'N/A',
                    dosage: TIRZEPATIDE_DOSAGE._10,
                    enabled: false,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 59 units (10 mg of tirzepatide) subcutaneously once per week for weeks 1-12',
                    dosage: TIRZEPATIDE_DOSAGE._10,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'N/A',
                    dosage: TIRZEPATIDE_DOSAGE._10,
                    enabled: false,
                },
            },
            3: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'N/A',
                    dosage: TIRZEPATIDE_DOSAGE._10,
                    enabled: false,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 59 units (10 mg of tirzepatide) subcutaneously once per week for weeks 1-12',
                    dosage: TIRZEPATIDE_DOSAGE._10,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'N/A',
                    dosage: TIRZEPATIDE_DOSAGE._10,
                    enabled: false,
                },
            },
        },
        [GLP1_NAMES_TO_INDEX.TIRZEPATIDE_QUARTERLY_170_MG_EMPOWER]: {
            // "dosage_adjustment_sigs": {
            //     "month_1" : {
            //         "decrease" : "N/A",
            //         "maintain" : "Inject 74 units (12.5 mg of tirzepatide) subcutaneously once per week for weeks 5-8.",
            //         "increase" : "N/A"
            //     },
            //     "month_2" : {
            //         "decrease" : "N/A",
            //         "maintain" : "Inject 74 units (12.5 mg of tirzepatide) subcutaneously once per week for weeks 5-8.",
            //         "increase" : "N/A"
            //     },
            //     "month_3" : {
            //         "decrease" : "N/A",
            //         "maintain" : "Inject 74 units (12.5 mg of tirzepatide) subcutaneously once per week for weeks 5-8.",
            //         "increase" : "N/A"
            //     }
            // }
            1: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'N/A',
                    dosage: TIRZEPATIDE_DOSAGE._12_5,
                    enabled: false,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 74 units (12.5 mg of tirzepatide) subcutaneously once per week for weeks 5-8.',
                    dosage: TIRZEPATIDE_DOSAGE._12_5,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'N/A',
                    dosage: TIRZEPATIDE_DOSAGE._12_5,
                    enabled: false,
                },
            },
            2: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'N/A',
                    dosage: TIRZEPATIDE_DOSAGE._12_5,
                    enabled: false,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 74 units (12.5 mg of tirzepatide) subcutaneously once per week for weeks 5-8.',
                    dosage: TIRZEPATIDE_DOSAGE._12_5,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'N/A',
                    dosage: TIRZEPATIDE_DOSAGE._12_5,
                    enabled: false,
                },
            },
            3: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'N/A',
                    dosage: TIRZEPATIDE_DOSAGE._12_5,
                    enabled: false,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 74 units (12.5 mg of tirzepatide) subcutaneously once per week for weeks 5-8.',
                    dosage: TIRZEPATIDE_DOSAGE._12_5,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'N/A',
                    dosage: TIRZEPATIDE_DOSAGE._12_5,
                    enabled: false,
                },
            },
        },

        [GLP1_NAMES_TO_INDEX.TIRZEPATIDE_QUARTERLY_50_MG_BOOTHWYN]: {
            // "dosage_adjustment_sigs" : {
            //     "month_1" : {
            //         "decrease" : "Inject 25 units (2.5mg) weekly x 4 weeks",
            //         "maintain" : "Inject 50 units (5 mg) weekly x 4 weeks",
            //         "increase" : "Inject 50 units (5 mg) weekly x 4 weeks",
            //     },
            //     "month_2" : {
            //         "decrease" : "Inject 25 units (2.5mg) weekly x 4 weeks",
            //         "maintain" : "Inject 50 units (5 mg) weekly x 4 weeks",
            //         "increase" : "Inject 50 units (5 mg) weekly x 4 weeks",
            //     },
            //     "month_3" : {
            //         "decrease" : "Inject 25 units (2.5mg) weekly x 4 weeks",
            //         "maintain" : "Inject 50 units (5 mg) weekly x 4 weeks",
            //         "increase" : "Inject 50 units (5 mg) weekly x 4 weeks",
            //     }
            // }
            1: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 25 units (2.5mg) weekly x 4 weeks',
                    dosage: TIRZEPATIDE_DOSAGE._2_5,
                    enabled: false,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 50 units (5 mg) weekly x 4 weeks',
                    dosage: TIRZEPATIDE_DOSAGE._5,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject 50 units (5 mg) weekly x 4 weeks',
                    dosage: TIRZEPATIDE_DOSAGE._5,
                    enabled: false,
                },
            },
            2: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 25 units (2.5mg) weekly x 4 weeks',
                    dosage: TIRZEPATIDE_DOSAGE._2_5,
                    enabled: false,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 50 units (5 mg) weekly x 4 weeks',
                    dosage: TIRZEPATIDE_DOSAGE._5,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject 50 units (5 mg) weekly x 4 weeks',
                    dosage: TIRZEPATIDE_DOSAGE._5,
                    enabled: false,
                },
            },
            3: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 25 units (2.5mg) weekly x 4 weeks',
                    dosage: TIRZEPATIDE_DOSAGE._2_5,
                    enabled: false,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 50 units (5 mg) weekly x 4 weeks',
                    dosage: TIRZEPATIDE_DOSAGE._5,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject 50 units (5 mg) weekly x 4 weeks',
                    dosage: TIRZEPATIDE_DOSAGE._5,
                    enabled: false,
                },
            },
        },

        [GLP1_NAMES_TO_INDEX.TIRZEPATIDE_QUARTERLY_50_MG_HALLANDALE]: {
            // "dosage_adjustment_sigs" : {
            //     "month_1" : {
            //         "decrease" : "Inject 25 units (2.5 mg of tirzepatide) subcutaneously once per week for weeks 1-4",
            //         "maintain" : "Inject 50 units (5 mg of tirzepatide) subcutaneously once per week for weeks 1-4",
            //         "increase" : "Inject 50 units (5 mg of tirzepatide) subcutaneously once per week for weeks 1-4",
            //     },
            //     "month_2" : {
            //         "decrease" : "Inject 25 units (2.5 mg of tirzepatide) subcutaneously once per week for weeks 5-8",
            //         "maintain" : "Inject 50 units (5 mg of tirzepatide) subcutaneously once per week for weeks 5-8",
            //         "increase" : "Inject 50 units (5 mg of tirzepatide) subcutaneously once per week for weeks 5-8",
            //     },
            //     "month_3" : {
            //         "decrease" : "Inject 25 units (2.5 mg of tirzepatide) subcutaneously once per week for weeks 9-12",
            //         "maintain" : "Inject 50 units (5 mg of tirzepatide) subcutaneously once per week for weeks 9-12",
            //         "increase" : "Inject 50 units (5 mg of tirzepatide) subcutaneously once per week for weeks 9-12",
            //     }
            // }
            1: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 25 units (2.5 mg of tirzepatide) subcutaneously once per week for weeks 1-4',
                    dosage: TIRZEPATIDE_DOSAGE._2_5,
                    enabled: false,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 50 units (5 mg of tirzepatide) subcutaneously once per week for weeks 5-8',
                    dosage: TIRZEPATIDE_DOSAGE._5,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject 50 units (5 mg of tirzepatide) subcutaneously once per week for weeks 5-8',
                    dosage: TIRZEPATIDE_DOSAGE._5,
                    enabled: false,
                },
            },
            2: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 25 units (2.5 mg of tirzepatide) subcutaneously once per week for weeks 1-4',
                    dosage: TIRZEPATIDE_DOSAGE._2_5,
                    enabled: false,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 50 units (5 mg of tirzepatide) subcutaneously once per week for weeks 5-8',
                    dosage: TIRZEPATIDE_DOSAGE._5,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject 50 units (5 mg of tirzepatide) subcutaneously once per week for weeks 5-8',
                    dosage: TIRZEPATIDE_DOSAGE._5,
                    enabled: false,
                },
            },
            3: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 25 units (2.5 mg of tirzepatide) subcutaneously once per week for weeks 1-4',
                    dosage: TIRZEPATIDE_DOSAGE._2_5,
                    enabled: false,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 50 units (5 mg of tirzepatide) subcutaneously once per week for weeks 5-8',
                    dosage: TIRZEPATIDE_DOSAGE._5,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject 50 units (5 mg of tirzepatide) subcutaneously once per week for weeks 5-8',
                    dosage: TIRZEPATIDE_DOSAGE._5,
                    enabled: false,
                },
            },
        },

        [GLP1_NAMES_TO_INDEX.TIRZEPATIDE_QUARTERLY_80_MG_BOOTHWYN]: {
            // "dosage_adjustment_sigs" : {
            //     "month_1" : {
            //         "decrease" : "Inject 50 units (5 mg) weekly x 4 weeks",
            //         "maintain" : "Inject 75 units (7.5 mg) weekly x 4 weeks",
            //         "increase" : "Inject 75 units (7.5 mg) weekly x 4 weeks"
            //     },
            //     "month_2" : {
            //         "decrease" : "Inject 50 units (5 mg) weekly x 4 weeks",
            //         "maintain" : "Inject 75 units (7.5 mg) weekly x 4 weeks",
            //         "increase" : "Inject 75 units (7.5 mg) weekly x 4 weeks"
            //     },
            //     "month_3" : {
            //         "decrease" : "Inject 50 units (5 mg) weekly x 4 weeks",
            //         "maintain" : "Inject 75 units (7.5 mg) weekly x 4 weeks",
            //         "increase" : "Inject 75 units (7.5 mg) weekly x 4 weeks"
            //     }
            // }
            1: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 50 units (5 mg) weekly x 4 weeks',
                    dosage: TIRZEPATIDE_DOSAGE._5,
                    enabled: false,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 75 units (7.5mg) weekly x 4 weeks',
                    dosage: TIRZEPATIDE_DOSAGE._7_5,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject 75 units (7.5mg) weekly x 4 weeks',
                    dosage: TIRZEPATIDE_DOSAGE._7_5,
                    enabled: false,
                },
            },
            2: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 50 units (5 mg) weekly x 4 weeks',
                    dosage: TIRZEPATIDE_DOSAGE._5,
                    enabled: false,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 75 units (7.5mg) weekly x 4 weeks',
                    dosage: TIRZEPATIDE_DOSAGE._7_5,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject 75 units (7.5mg) weekly x 4 weeks',
                    dosage: TIRZEPATIDE_DOSAGE._7_5,
                    enabled: false,
                },
            },
            3: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 50 units (5 mg) weekly x 4 weeks',
                    dosage: TIRZEPATIDE_DOSAGE._5,
                    enabled: false,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 75 units (7.5mg) weekly x 4 weeks',
                    dosage: TIRZEPATIDE_DOSAGE._7_5,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject 75 units (7.5mg) weekly x 4 weeks',
                    dosage: TIRZEPATIDE_DOSAGE._7_5,
                    enabled: false,
                },
            },
        },
        [GLP1_NAMES_TO_INDEX.TIRZEPATIDE_QUARTERLY_90_MG_BOOTHWYN]: {
            // "dosage_adjustment_sigs" : {
            //     "month_1" : {
            //         "decrease" : "Inject 75 units (7.5 mg) weekly x 4 weeks",
            //         "maintain" : "Inject 100 units (10 mg) weekly x 4 weeks",
            //         "increase" : "Inject 100 units (10 mg) weekly x 4 weeks"
            //     },
            //     "month_2" : {
            //         "decrease" : "Inject 75 units (7.5 mg) weekly x 4 weeks",
            //         "maintain" : "Inject 100 units (10 mg) weekly x 4 weeks",
            //         "increase" : "Inject 100 units (10 mg) weekly x 4 weeks"
            //     },
            //     "month_3" : {
            //         "decrease" : "Inject 75 units (7.5 mg) weekly x 4 weeks",
            //         "maintain" : "Inject 100 units (10 mg) weekly x 4 weeks",
            //         "increase" : "Inject 100 units (10 mg) weekly x 4 weeks"
            //     }
            // }
            1: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 75 units (7.5mg) weekly x 4 weeks',
                    dosage: TIRZEPATIDE_DOSAGE._7_5,
                    enabled: false,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 100 units (10mg) weekly x 4 weeks',
                    dosage: TIRZEPATIDE_DOSAGE._10,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject 100 units (10mg) weekly x 4 weeks',
                    dosage: TIRZEPATIDE_DOSAGE._10,
                    enabled: false,
                },
            },
            2: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 75 units (7.5mg) weekly x 4 weeks',
                    dosage: TIRZEPATIDE_DOSAGE._7_5,
                    enabled: false,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 100 units (10mg) weekly x 4 weeks',
                    dosage: TIRZEPATIDE_DOSAGE._10,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject 100 units (10mg) weekly x 4 weeks',
                    dosage: TIRZEPATIDE_DOSAGE._10,
                    enabled: false,
                },
            },
            3: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 75 units (7.5mg) weekly x 4 weeks',
                    dosage: TIRZEPATIDE_DOSAGE._7_5,
                    enabled: false,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 100 units (10mg) weekly x 4 weeks',
                    dosage: TIRZEPATIDE_DOSAGE._10,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject 100 units (10mg) weekly x 4 weeks',
                    dosage: TIRZEPATIDE_DOSAGE._10,
                    enabled: false,
                },
            },
        },

        [GLP1_NAMES_TO_INDEX.TIRZEPATIDE_QUARTERLY_120_MG_BOOTHWYN]: {
            // "dosage_adjustment_sigs" : {
            //     "month_1" : {
            //         "decrease" : "Inject 100 units (10 mg) weekly x 4 weeks",
            //         "maintain" : "Inject 125 units (12.5 mg) weekly x 4 weeks",
            //         "increase" : "Inject 125 units (12.5 mg) weekly x 4 weeks"
            //     },
            //     "month_2" : {
            //         "decrease" : "Inject 100 units (10 mg) weekly x 4 weeks",
            //         "maintain" : "Inject 125 units (12.5 mg) weekly x 4 weeks",
            //         "increase" : "Inject 125 units (12.5 mg) weekly x 4 weeks"
            //     },
            //     "month_3" : {
            //         "decrease" : "Inject 100 units (10 mg) weekly x 4 weeks",
            //         "maintain" : "Inject 125 units (12.5 mg) weekly x 4 weeks",
            //         "increase" : "Inject 125 units (12.5 mg) weekly x 4 weeks"
            //     }
            // }
            1: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 100 units (10mg) weekly x 4 weeks',
                    dosage: TIRZEPATIDE_DOSAGE._10,
                    enabled: false,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 125 units (12.5mg) weekly x 4 weeks',
                    dosage: TIRZEPATIDE_DOSAGE._12_5,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject 125 units (12.5mg) weekly x 4 weeks',
                    dosage: TIRZEPATIDE_DOSAGE._12_5,
                    enabled: false,
                },
            },
            2: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 100 units (10mg) weekly x 4 weeks',
                    dosage: TIRZEPATIDE_DOSAGE._10,
                    enabled: false,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 125 units (12.5mg) weekly x 4 weeks',
                    dosage: TIRZEPATIDE_DOSAGE._12_5,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject 125 units (12.5mg) weekly x 4 weeks',
                    dosage: TIRZEPATIDE_DOSAGE._12_5,
                    enabled: false,
                },
            },
            3: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 100 units (10mg) weekly x 4 weeks',
                    dosage: TIRZEPATIDE_DOSAGE._10,
                    enabled: false,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 125 units (12.5mg) weekly x 4 weeks',
                    dosage: TIRZEPATIDE_DOSAGE._12_5,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject 125 units (12.5mg) weekly x 4 weeks',
                    dosage: TIRZEPATIDE_DOSAGE._12_5,
                    enabled: false,
                },
            },
        },

        [GLP1_NAMES_TO_INDEX.TIRZEPATIDE_QUARTERLY_150_MG_BOOTHWYN]: {
            // "dosage_adjustment_sigs" : {
            //     "month_1" : {
            //         "decrease" : "Inject 100 units (10mg) weekly x 4 weeks",
            //         "maintain" : "Inject 125 units (12.5mg) weekly x 4 weeks",
            //         "increase" : "Inject 125 units (12.5mg) weekly x 4 weeks"
            //     },
            //     "month_2" : {
            //         "decrease" : "Inject 100 units (10mg) weekly x 4 weeks",
            //         "maintain" : "Inject 125 units (12.5mg) weekly x 4 weeks",
            //         "increase" : "Inject 125 units (12.5mg) weekly x 4 weeks"
            //     },
            //     "month_3" : {
            //         "decrease" : "Inject 100 units (10mg) weekly x 4 weeks",
            //         "maintain" : "Inject 125 units (12.5mg) weekly x 4 weeks",
            //         "increase" : "Inject 125 units (12.5mg) weekly x 4 weeks"
            //     }
            // }
            1: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 100 units (10mg) weekly x 4 weeks',
                    dosage: TIRZEPATIDE_DOSAGE._10,
                    enabled: false,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 125 units (12.5mg) weekly x 4 weeks',
                    dosage: TIRZEPATIDE_DOSAGE._12_5,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject 125 units (12.5mg) weekly x 4 weeks',
                    dosage: TIRZEPATIDE_DOSAGE._12_5,
                    enabled: false,
                },
            },
            2: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 100 units (10mg) weekly x 4 weeks',
                    dosage: TIRZEPATIDE_DOSAGE._10,
                    enabled: false,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 125 units (12.5mg) weekly x 4 weeks',
                    dosage: TIRZEPATIDE_DOSAGE._12_5,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject 125 units (12.5mg) weekly x 4 weeks',
                    dosage: TIRZEPATIDE_DOSAGE._12_5,
                    enabled: false,
                },
            },
            3: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 100 units (10mg) weekly x 4 weeks',
                    dosage: TIRZEPATIDE_DOSAGE._10,
                    enabled: false,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 125 units (12.5mg) weekly x 4 weeks',
                    dosage: TIRZEPATIDE_DOSAGE._12_5,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject 125 units (12.5mg) weekly x 4 weeks',
                    dosage: TIRZEPATIDE_DOSAGE._12_5,
                    enabled: false,
                },
            },
        },

        [GLP1_NAMES_TO_INDEX.TIRZEPATIDE_BIANNUALLY_60_MG_HALLANDALE]: {
            // "dosage_adjustment_sigs" : {
            //     "month_1" : {
            //         "decrease" : "N/A",
            //         "maintain" : "Inject 25 units (2.5 mg of Tirzepatide) subcutaneously once per week for 4 weeks",
            //         "increase" : "Inject 50 units (5 mg of Tirzepatide) subcutaneously once per week for 4 weeks"
            //     },
            //     "month_2" : {
            //         "decrease" : "N/A",
            //         "maintain" : "Inject 25 units (2.5 mg of Tirzepatide) subcutaneously once per week for 4 weeks",
            //         "increase" : "Inject 50 units (5 mg of Tirzepatide) subcutaneously once per week for 4 weeks"
            //     },
            //     "month_3" : {
            //         "decrease" : "N/A",
            //         "maintain" : "Inject 25 units (2.5 mg of Tirzepatide) subcutaneously once per week for 4 weeks",
            //         "increase" : "Inject 50 units (5 mg of Tirzepatide) subcutaneously once per week for 4 weeks"
            //     },
            //     "month_4" : {
            //         "decrease" : "N/A",
            //         "maintain" : "Inject 25 units (2.5 mg of Tirzepatide) subcutaneously once per week for 4 weeks",
            //         "increase" : "Inject 50 units (5 mg of Tirzepatide) subcutaneously once per week for 4 weeks"
            //     },
            //     "month_5" : {
            //         "decrease" : "N/A",
            //         "maintain" : "Inject 25 units (2.5 mg of Tirzepatide) subcutaneously once per week for 4 weeks",
            //         "increase" : "Inject 50 units (5 mg of Tirzepatide) subcutaneously once per week for 4 weeks"
            //     },
            //     "month_6" : {
            //         "decrease" : "N/A",
            //         "maintain" : "Inject 25 units (2.5 mg of Tirzepatide) subcutaneously once per week for 4 weeks",
            //         "increase" : "Inject 50 units (5 mg of Tirzepatide) subcutaneously once per week for 4 weeks"
            //     }
            // }
            1: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'N/A',
                    dosage: TIRZEPATIDE_DOSAGE._2_5,
                    enabled: false,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 25 units (2.5 mg of Tirzepatide) subcutaneously once per week for 4 weeks',
                    dosage: TIRZEPATIDE_DOSAGE._2_5,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject 50 units (5 mg of Tirzepatide) subcutaneously once per week for 4 weeks',
                    dosage: TIRZEPATIDE_DOSAGE._5,
                    enabled: true,
                },
            },
            2: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'N/A',
                    dosage: TIRZEPATIDE_DOSAGE._2_5,
                    enabled: false,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 25 units (2.5 mg of Tirzepatide) subcutaneously once per week for 4 weeks',
                    dosage: TIRZEPATIDE_DOSAGE._2_5,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject 50 units (5 mg of Tirzepatide) subcutaneously once per week for 4 weeks',
                    dosage: TIRZEPATIDE_DOSAGE._5,
                    enabled: true,
                },
            },
            3: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'N/A',
                    dosage: TIRZEPATIDE_DOSAGE._2_5,
                    enabled: false,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 25 units (2.5 mg of Tirzepatide) subcutaneously once per week for 4 weeks',
                    dosage: TIRZEPATIDE_DOSAGE._2_5,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject 50 units (5 mg of Tirzepatide) subcutaneously once per week for 4 weeks',
                    dosage: TIRZEPATIDE_DOSAGE._5,
                    enabled: true,
                },
            },
            4: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'N/A',
                    dosage: TIRZEPATIDE_DOSAGE._2_5,
                    enabled: false,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 25 units (2.5 mg of Tirzepatide) subcutaneously once per week for 4 weeks',
                    dosage: TIRZEPATIDE_DOSAGE._2_5,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject 50 units (5 mg of Tirzepatide) subcutaneously once per week for 4 weeks',
                    dosage: TIRZEPATIDE_DOSAGE._5,
                    enabled: true,
                },
            },
            5: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'N/A',
                    dosage: TIRZEPATIDE_DOSAGE._2_5,
                    enabled: false,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 25 units (2.5 mg of Tirzepatide) subcutaneously once per week for 4 weeks',
                    dosage: TIRZEPATIDE_DOSAGE._2_5,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject 50 units (5 mg of Tirzepatide) subcutaneously once per week for 4 weeks',
                    dosage: TIRZEPATIDE_DOSAGE._5,
                    enabled: true,
                },
            },
            6: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'N/A',
                    dosage: TIRZEPATIDE_DOSAGE._2_5,
                    enabled: false,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 25 units (2.5 mg of Tirzepatide) subcutaneously once per week for 4 weeks',
                    dosage: TIRZEPATIDE_DOSAGE._2_5,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject 50 units (5 mg of Tirzepatide) subcutaneously once per week for 4 weeks',
                    dosage: TIRZEPATIDE_DOSAGE._5,
                    enabled: true,
                },
            },
        },
        [GLP1_NAMES_TO_INDEX.TIRZEPATIDE_BIANNUALLY_240_MG_HALLANDALE]: {
            // "dosage_adjustment_sigs" : {
            //     "month_1" : {
            //         "decrease" : "Inject 75 units (7.5 mg of Tirzepatide) subcutaneously once per week for 4 weeks",
            //         "maintain" : "Inject 100 units (10 mg of Tirzepatide)subcutaneously once per week for 4 weeks",
            //         "increase" : "N/A"
            //     },
            //     "month_2" : {
            //         "decrease" : "Inject 75 units (7.5 mg of Tirzepatide) subcutaneously once per week for 4 weeks",
            //         "maintain" : "Inject 100 units (10 mg of Tirzepatide)subcutaneously once per week for 4 weeks",
            //         "increase" : "N/A"
            //     },
            //     "month_3" : {
            //         "decrease" : "Inject 75 units (7.5 mg of Tirzepatide) subcutaneously once per week for 4 weeks",
            //         "maintain" : "Inject 100 units (10 mg of Tirzepatide)subcutaneously once per week for 4 weeks",
            //         "increase" : "N/A"
            //     },
            //     "month_4" : {
            //         "decrease" : "Inject 75 units (7.5 mg of Tirzepatide) subcutaneously once per week for 4 weeks",
            //         "maintain" : "Inject 100 units (10 mg of Tirzepatide)subcutaneously once per week for 4 weeks",
            //         "increase" : "N/A"
            //     },
            //     "month_5" : {
            //         "decrease" : "Inject 75 units (7.5 mg of Tirzepatide) subcutaneously once per week for 4 weeks",
            //         "maintain" : "Inject 100 units (10 mg of Tirzepatide)subcutaneously once per week for 4 weeks",
            //         "increase" : "N/A"
            //     },
            //     "month_6" : {
            //         "decrease" : "Inject 75 units (7.5 mg of Tirzepatide) subcutaneously once per week for 4 weeks",
            //         "maintain" : "Inject 100 units (10 mg of Tirzepatide)subcutaneously once per week for 4 weeks",
            //         "increase" : "N/A"
            //     }
            // }
            1: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 75 units (7.5 mg of Tirzepatide) subcutaneously once per week for 4 weeks',
                    dosage: TIRZEPATIDE_DOSAGE._7_5,
                    enabled: true,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 100 units (10 mg of Tirzepatide)subcutaneously once per week for 4 weeks',
                    dosage: TIRZEPATIDE_DOSAGE._10,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'N/A',
                    dosage: TIRZEPATIDE_DOSAGE._10,
                    enabled: false,
                },
            },
            2: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 75 units (7.5 mg of Tirzepatide) subcutaneously once per week for 4 weeks',
                    dosage: TIRZEPATIDE_DOSAGE._7_5,
                    enabled: true,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 100 units (10 mg of Tirzepatide)subcutaneously once per week for 4 weeks',
                    dosage: TIRZEPATIDE_DOSAGE._10,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'N/A',
                    dosage: TIRZEPATIDE_DOSAGE._10,
                    enabled: false,
                },
            },
            3: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 75 units (7.5 mg of Tirzepatide) subcutaneously once per week for 4 weeks',
                    dosage: TIRZEPATIDE_DOSAGE._7_5,
                    enabled: true,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 100 units (10 mg of Tirzepatide)subcutaneously once per week for 4 weeks',
                    dosage: TIRZEPATIDE_DOSAGE._10,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'N/A',
                    dosage: TIRZEPATIDE_DOSAGE._10,
                    enabled: false,
                },
            },
            4: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 75 units (7.5 mg of Tirzepatide) subcutaneously once per week for 4 weeks',
                    dosage: TIRZEPATIDE_DOSAGE._7_5,
                    enabled: true,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 100 units (10 mg of Tirzepatide)subcutaneously once per week for 4 weeks',
                    dosage: TIRZEPATIDE_DOSAGE._10,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'N/A',
                    dosage: TIRZEPATIDE_DOSAGE._10,
                    enabled: false,
                },
            },
            5: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 75 units (7.5 mg of Tirzepatide) subcutaneously once per week for 4 weeks',
                    dosage: TIRZEPATIDE_DOSAGE._7_5,
                    enabled: true,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 100 units (10 mg of Tirzepatide)subcutaneously once per week for 4 weeks',
                    dosage: TIRZEPATIDE_DOSAGE._10,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'N/A',
                    dosage: TIRZEPATIDE_DOSAGE._10,
                    enabled: false,
                },
            },
            6: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 75 units (7.5 mg of Tirzepatide) subcutaneously once per week for 4 weeks',
                    dosage: TIRZEPATIDE_DOSAGE._7_5,
                    enabled: true,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 100 units (10 mg of Tirzepatide)subcutaneously once per week for 4 weeks',
                    dosage: TIRZEPATIDE_DOSAGE._10,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'N/A',
                    dosage: TIRZEPATIDE_DOSAGE._10,
                    enabled: false,
                },
            },
        },
        [GLP1_NAMES_TO_INDEX.TIRZEPATIDE_BIANNUALLY_140_MG_HALLANDALE]: {
            // "dosage_adjustment_sigs": {
            //     "month_1" : {
            //         "decrease" : "Inject 25 units (2.5 mg of Tirzepatide) subcutaneously once per week for 4 weeks",
            //         "maintain" : "Inject 50 units (5 mg of Tirzepatide)subcutaneously once per week for 4 weeks",
            //         "increase" : "Inject 75 units (7.5 mg of Tirzepatide) subcutaneously once per week for 4 weeks"
            //     },
            //     "month_2" : {
            //         "decrease" : "Inject 25 units (2.5 mg of Tirzepatide) subcutaneously once per week for 4 weeks",
            //         "maintain" : "Inject 50 units (5 mg of Tirzepatide)subcutaneously once per week for 4 weeks",
            //         "increase" : "Inject 75 units (7.5 mg of Tirzepatide) subcutaneously once per week for 4 weeks"
            //     },
            //     "month_3" : {
            //         "decrease" : "Inject 25 units (2.5 mg of Tirzepatide) subcutaneously once per week for 4 weeks",
            //         "maintain" : "Inject 50 units (5 mg of Tirzepatide)subcutaneously once per week for 4 weeks",
            //         "increase" : "Inject 75 units (7.5 mg of Tirzepatide) subcutaneously once per week for 4 weeks"
            //     },
            //     "month_4" : {
            //         "decrease" : "Inject 50 units (5 mg of Tirzepatide) subcutaneously once per week for 4 weeks",
            //         "maintain" : "Inject 75 units (7.5 mg of Tirzepatide)subcutaneously once per week for 4 weeks",
            //         "increase" : "Inject 100 units (10 mg of Tirzepatide)subcutaneously once per week for 4 weeks"
            //     },
            //     "month_5" : {
            //         "decrease" : "Inject 50 units (5 mg of Tirzepatide) subcutaneously once per week for 4 weeks",
            //         "maintain" : "Inject 75 units (7.5 mg of Tirzepatide)subcutaneously once per week for 4 weeks",
            //         "increase" : "Inject 100 units (10 mg of Tirzepatide)subcutaneously once per week for 4 weeks"
            //     },
            //     "month_6" : {
            //         "decrease" : "Inject 50 units (5 mg of Tirzepatide) subcutaneously once per week for 4 weeks",
            //         "maintain" : "Inject 75 units (7.5 mg of Tirzepatide)subcutaneously once per week for 4 weeks",
            //         "increase" : "Inject 100 units (10 mg of Tirzepatide)subcutaneously once per week for 4 weeks"
            //     }
            // }
            1: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 25 units (2.5 mg of Tirzepatide) subcutaneously once per week for 4 weeks',
                    dosage: TIRZEPATIDE_DOSAGE._2_5,
                    enabled: true,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 50 units (5 mg of Tirzepatide) subcutaneously once per week for 4 weeks',
                    dosage: TIRZEPATIDE_DOSAGE._5,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject 75 units (7.5 mg of Tirzepatide) subcutaneously once per week for 4 weeks',
                    dosage: TIRZEPATIDE_DOSAGE._7_5,
                    enabled: true,
                },
            },
            2: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 25 units (2.5 mg of Tirzepatide) subcutaneously once per week for 4 weeks',
                    dosage: TIRZEPATIDE_DOSAGE._2_5,
                    enabled: true,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 50 units (5 mg of Tirzepatide) subcutaneously once per week for 4 weeks',
                    dosage: TIRZEPATIDE_DOSAGE._5,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject 75 units (7.5 mg of Tirzepatide) subcutaneously once per week for 4 weeks',
                    dosage: TIRZEPATIDE_DOSAGE._7_5,
                    enabled: true,
                },
            },
            3: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 25 units (2.5 mg of Tirzepatide) subcutaneously once per week for 4 weeks',
                    dosage: TIRZEPATIDE_DOSAGE._2_5,
                    enabled: true,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 50 units (5 mg of Tirzepatide) subcutaneously once per week for 4 weeks',
                    dosage: TIRZEPATIDE_DOSAGE._5,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject 75 units (7.5 mg of Tirzepatide) subcutaneously once per week for 4 weeks',
                    dosage: TIRZEPATIDE_DOSAGE._7_5,
                    enabled: true,
                },
            },
            4: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 50 units (5 mg of Tirzepatide) subcutaneously once per week for 4 weeks',
                    dosage: TIRZEPATIDE_DOSAGE._5,
                    enabled: true,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 75 units (7.5 mg of Tirzepatide) subcutaneously once per week for 4 weeks',
                    dosage: TIRZEPATIDE_DOSAGE._7_5,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject 100 units (10 mg of Tirzepatide)subcutaneously once per week for 4 weeks',
                    dosage: TIRZEPATIDE_DOSAGE._10,
                    enabled: true,
                },
            },
            5: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 50 units (5 mg of Tirzepatide) subcutaneously once per week for 4 weeks',
                    dosage: TIRZEPATIDE_DOSAGE._5,
                    enabled: true,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 75 units (7.5 mg of Tirzepatide) subcutaneously once per week for 4 weeks',
                    dosage: TIRZEPATIDE_DOSAGE._7_5,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject 100 units (10 mg of Tirzepatide)subcutaneously once per week for 4 weeks',
                    dosage: TIRZEPATIDE_DOSAGE._10,
                    enabled: true,
                },
            },
            6: {
                [DOSING_TYPE.DECREASE]: {
                    sig: 'Inject 50 units (5 mg of Tirzepatide) subcutaneously once per week for 4 weeks',
                    dosage: TIRZEPATIDE_DOSAGE._5,
                    enabled: true,
                },
                [DOSING_TYPE.MAINTAIN]: {
                    sig: 'Inject 75 units (7.5 mg of Tirzepatide) subcutaneously once per week for 4 weeks',
                    dosage: TIRZEPATIDE_DOSAGE._7_5,
                    enabled: true,
                },
                [DOSING_TYPE.INCREASE]: {
                    sig: 'Inject 100 units (10 mg of Tirzepatide)subcutaneously once per week for 4 weeks',
                    dosage: TIRZEPATIDE_DOSAGE._10,
                    enabled: true,
                },
            },
        },
    },
};

// export const ADJUST_DOSING_GLP1_MAPPINGS: GLP1_MAPPINGS = {
//     [PRODUCT_HREF.SEMAGLUTIDE]: {
//         [SEMAGLUTIDE_DOSAGE._0_25]: {
//             // Months
//             1: {
//                 [DOSING_TYPE.DECREASE]:
//                     'Inject 10 units (0.25 mg of semaglutide) subcutaneously once per week for weeks 5-8 from the Semaglutide 2 mL 2.5 mg/mL vial',
//                 [DOSING_TYPE.MAINTAIN]:
//                     'Inject 10 units (0.25 mg of semaglutide) subcutaneously once per week for weeks 5-8 from the Semaglutide 2 mL 2.5 mg/mL vial',
//                 [DOSING_TYPE.INCREASE]:
//                     'Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for weeks 8-12 from the Semaglutide 2 mL 2.5 mg/mL vial',
//             },
//             2: {
//                 [DOSING_TYPE.DECREASE]:
//                     'Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for weeks 9-12 from the Semaglutide 2 mL 2.5 mg/mL vial',
//                 [DOSING_TYPE.MAINTAIN]:
//                     'Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for weeks 9-12 from the Semaglutide 2 mL 2.5 mg/mL vial',
//                 [DOSING_TYPE.INCREASE]:
//                     'Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for weeks 9-12 from the Semaglutide 2 mL 2.5 mg/mL vial',
//             },
//             3: {
//                 [DOSING_TYPE.DECREASE]:
//                     'Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for weeks 9-12 from the Semaglutide 2 mL 2.5 mg/mL vial',
//                 [DOSING_TYPE.MAINTAIN]:
//                     'Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for weeks 9-12 from the Semaglutide 2 mL 2.5 mg/mL vial',
//                 [DOSING_TYPE.INCREASE]:
//                     'Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for weeks 9-12 from the Semaglutide 2 mL 2.5 mg/mL vial',
//             },
//         },
//         [SEMAGLUTIDE_DOSAGE._0_5]: {
//             1: {
//                 [DOSING_TYPE.DECREASE]:
//                     'Inject 10 units (0.5 mg of semaglutide) subcutaneously once per week for weeks 5-8 from the Semaglutide/cyanocobalamin 5/0.5 MG/ML',
//                 [DOSING_TYPE.MAINTAIN]:
//                     'Inject 10 units (0.5 mg of semaglutide) subcutaneously once per week for weeks 5-8 from the Semaglutide/cyanocobalamin 5/0.5 MG/ML (1 ML)',
//                 [DOSING_TYPE.INCREASE]:
//                     'Inject 25 units (1.25 mg of semaglutide) subcutaneously once per week for weeks 5-8 from the Semaglutide/cyanocobalamin 5/0.5 MG/ML (1 ML)',
//             },
//             2: {
//                 [DOSING_TYPE.DECREASE]:
//                     'Inject 25 units (1.25 mg of semaglutide) subcutaneously once per week for weeks 9-12 from the Semaglutide/cyanocobalmin 5/0.5 MG/ML (2.5 ML)',
//                 [DOSING_TYPE.MAINTAIN]:
//                     'Inject 25 units (1.25 mg of semaglutide) subcutaneously once per week for weeks 9-12 from the Semaglutide/cyanocobalmin 5/0.5 MG/ML (2.5 ML)',
//                 [DOSING_TYPE.INCREASE]:
//                     'Inject 50 units (2.5 mg of semaglutide) subcutaneously once per week for weeks 9-12 from the Semaglutide/cyanocobalmin 5/0.5 MG/ML (2.5 ML)',
//             },
//             3: {
//                 [DOSING_TYPE.DECREASE]:
//                     'Inject 25 units (1.25 mg of semaglutide) subcutaneously once per week for weeks 9-12 from the Semaglutide/cyanocobalmin 5/0.5 MG/ML (2.5 ML)',
//                 [DOSING_TYPE.MAINTAIN]:
//                     'Inject 25 units (1.25 mg of semaglutide) subcutaneously once per week for weeks 9-12 from the Semaglutide/cyanocobalmin 5/0.5 MG/ML (2.5 ML)',
//                 [DOSING_TYPE.INCREASE]:
//                     'Inject 50 units (2.5 mg of semaglutide) subcutaneously once per week for weeks 9-12 from the Semaglutide/cyanocobalmin 5/0.5 MG/ML (2.5 ML)',
//             },
//         },
//         [SEMAGLUTIDE_DOSAGE._1_25]: {
//             1: {
//                 [DOSING_TYPE.DECREASE]:
//                     'Inject 25 units (1.25 mg of semaglutide) subcutaneously once per week for weeks 5-12 from the Semaglutide/cyanocobalmin 5/0.5 MG/ML (2.5 ML)',
//                 [DOSING_TYPE.MAINTAIN]:
//                     'Inject 25 units (1.25 mg of semaglutide) subcutaneously once per week for weeks 5-12 from the Semaglutide/cyanocobalmin 5/0.5 MG/ML (2.5 ML)',
//                 [DOSING_TYPE.INCREASE]:
//                     'Inject 50 units (2.5 mg of semaglutide) subcutaneously once per week for weeks 5-12 from the Semaglutide/cyanocobalmin 5/0.5 MG/ML (2.5 ML)',
//             },
//             2: {
//                 [DOSING_TYPE.DECREASE]:
//                     'Inject 25 units (1.25 mg of semaglutide) subcutaneously once per week for weeks 5-12 from the Semaglutide/cyanocobalmin 5/0.5 MG/ML (2.5 ML)',
//                 [DOSING_TYPE.MAINTAIN]:
//                     'Inject 25 units (1.25 mg of semaglutide) subcutaneously once per week for weeks 5-12 from the Semaglutide/cyanocobalmin 5/0.5 MG/ML (2.5 ML)',
//                 [DOSING_TYPE.INCREASE]:
//                     'Inject 50 units (2.5 mg of semaglutide) subcutaneously once per week for weeks 5-12 from the Semaglutide/cyanocobalmin 5/0.5 MG/ML (2.5 ML)',
//             },
//             3: {
//                 [DOSING_TYPE.DECREASE]:
//                     'Inject 25 units (1.25 mg of semaglutide) subcutaneously once per week for weeks 5-12 from the Semaglutide/cyanocobalmin 5/0.5 MG/ML (2.5 ML)',
//                 [DOSING_TYPE.MAINTAIN]:
//                     'Inject 25 units (1.25 mg of semaglutide) subcutaneously once per week for weeks 5-12 from the Semaglutide/cyanocobalmin 5/0.5 MG/ML (2.5 ML)',
//                 [DOSING_TYPE.INCREASE]:
//                     'Inject 50 units (2.5 mg of semaglutide) subcutaneously once per week for weeks 5-12 from the Semaglutide/cyanocobalmin 5/0.5 MG/ML (2.5 ML)',
//             },
//         },
//         [SEMAGLUTIDE_DOSAGE._2_5]: {
//             1: {
//                 [DOSING_TYPE.DECREASE]: 'N/A',
//                 [DOSING_TYPE.MAINTAIN]: 'N/A',
//                 [DOSING_TYPE.INCREASE]: 'N/A',
//             },
//             2: {
//                 [DOSING_TYPE.DECREASE]: 'N/A',
//                 [DOSING_TYPE.MAINTAIN]: 'N/A',
//                 [DOSING_TYPE.INCREASE]: 'N/A',
//             },
//             3: {
//                 [DOSING_TYPE.DECREASE]: 'N/A',
//                 [DOSING_TYPE.MAINTAIN]: 'N/A',
//                 [DOSING_TYPE.INCREASE]: 'N/A',
//             },
//         },
//     },
//     [PRODUCT_HREF.TIRZEPATIDE]: {
//         [TIRZEPATIDE_DOSAGE._2_5]: {
//             1: {
//                 [DOSING_TYPE.DECREASE]:
//                     'Inject 30 units (2.5 mg of tirzepatide) subcutaneously once per week for weeks 1-4 from the Tirzepatide/niacinamide 8/2 MG/ML (2.5 ML)',
//                 [DOSING_TYPE.MAINTAIN]:
//                     'Inject 30 units (2.5 mg of tirzepatide) subcutaneously once per week for weeks 1-4 from the Tirzepatide/niacinamide 8/2 MG/ML (2.5 ML)',
//                 [DOSING_TYPE.INCREASE]:
//                     'Inject 63 units (5mg of tirzepatide) subcutaneously once per week for weeks 5-8 from the Tirzepatide/niacinamide 8/2 MG/ML (2.5 ML)',
//             },
//             2: {
//                 [DOSING_TYPE.DECREASE]:
//                     'Inject 30 units (2.5 mg of tirzepatide) subcutaneously once per week for weeks 1-4 from the Tirzepatide/niacinamide 8/2 MG/ML (2.5 ML)',
//                 [DOSING_TYPE.MAINTAIN]:
//                     'Inject 30 units (2.5 mg of tirzepatide) subcutaneously once per week for weeks 1-4 from the Tirzepatide/niacinamide 8/2 MG/ML (2.5 ML)',
//                 [DOSING_TYPE.INCREASE]:
//                     'Inject 63 units (5mg of tirzepatide) subcutaneously once per week for weeks 9-12 from the Tirzepatide/niacinamide 8/2 MG/ML (2.5 ML)',
//             },
//             3: {
//                 [DOSING_TYPE.DECREASE]:
//                     'Inject 30 units (2.5 mg of tirzepatide) subcutaneously once per week for weeks 1-4 from the Tirzepatide/niacinamide 8/2 MG/ML (2.5 ML)',
//                 [DOSING_TYPE.MAINTAIN]:
//                     'Inject 30 units (2.5 mg of tirzepatide) subcutaneously once per week for weeks 1-4 from the Tirzepatide/niacinamide 8/2 MG/ML (2.5 ML)',
//                 [DOSING_TYPE.INCREASE]:
//                     'Inject 63 units (5mg of tirzepatide) subcutaneously once per week for weeks 9-12 from the Tirzepatide/niacinamide 8/2 MG/ML (2.5 ML)',
//             },
//         },
//         [TIRZEPATIDE_DOSAGE._5]: {
//             1: {
//                 [DOSING_TYPE.DECREASE]:
//                     'Inject 63 units (5 mg of tirzepatide) subcutaneously once per week for weeks 1-4 from the Tirzepatide/niacinamide 8/2 MG/ML (2.5 ML)',
//                 [DOSING_TYPE.MAINTAIN]:
//                     'Inject 63 units (5 mg of tirzepatide) subcutaneously once per week for weeks 1-4 from the Tirzepatide/niacinamide 8/2 MG/ML (2.5 ML)',
//                 [DOSING_TYPE.INCREASE]:
//                     'Inject 63 units (5 mg of tirzepatide) subcutaneously once per week for weeks 1-4 from the Tirzepatide/niacinamide 8/2 MG/ML (2.5 ML)',
//             },
//             2: {
//                 [DOSING_TYPE.DECREASE]:
//                     'Inject 29 units (5 mg of tirzepatide) subcutaneously once per week for weeks 1-12 from the Tirzepatide/niacinamide 17/2 MG/ML (2 ML)',
//                 [DOSING_TYPE.MAINTAIN]:
//                     'Inject 29 units (5 mg of tirzepatide) subcutaneously once per week for weeks 1-12 from the Tirzepatide/niacinamide 17/2 MG/ML (2 ML)',
//                 [DOSING_TYPE.INCREASE]:
//                     'Inject 44 units (7.5 mg of tirzepatide) subcutaneously once per week for weeks 1-12 from the Tirzepatide/niacinamide 17/2 MG/ML (2 ML)',
//             },
//             3: {
//                 [DOSING_TYPE.DECREASE]:
//                     'Inject 29 units (5 mg of tirzepatide) subcutaneously once per week for weeks 1-12 from the Tirzepatide/niacinamide 17/2 MG/ML (2 ML)',
//                 [DOSING_TYPE.MAINTAIN]:
//                     'Inject 29 units (5 mg of tirzepatide) subcutaneously once per week for weeks 1-12 from the Tirzepatide/niacinamide 17/2 MG/ML (2 ML)',
//                 [DOSING_TYPE.INCREASE]:
//                     'Inject 44 units (7.5 mg of tirzepatide) subcutaneously once per week for weeks 1-12 from the Tirzepatide/niacinamide 17/2 MG/ML (2 ML)',
//             },
//         },
//         [TIRZEPATIDE_DOSAGE._7_5]: {
//             1: {
//                 [DOSING_TYPE.DECREASE]: 'N/A',
//                 [DOSING_TYPE.MAINTAIN]: 'N/A',
//                 [DOSING_TYPE.INCREASE]: 'N/A',
//             },
//             2: {
//                 [DOSING_TYPE.DECREASE]: 'N/A',
//                 [DOSING_TYPE.MAINTAIN]: 'N/A',
//                 [DOSING_TYPE.INCREASE]: 'N/A',
//             },
//             3: {
//                 [DOSING_TYPE.DECREASE]: 'N/A',
//                 [DOSING_TYPE.MAINTAIN]: 'N/A',
//                 [DOSING_TYPE.INCREASE]: 'N/A',
//             },
//         },
//         [TIRZEPATIDE_DOSAGE._10]: {
//             1: {
//                 [DOSING_TYPE.DECREASE]: 'N/A',
//                 [DOSING_TYPE.MAINTAIN]: 'N/A',
//                 [DOSING_TYPE.INCREASE]: 'N/A',
//             },
//             2: {
//                 [DOSING_TYPE.DECREASE]: 'N/A',
//                 [DOSING_TYPE.MAINTAIN]: 'N/A',
//                 [DOSING_TYPE.INCREASE]: 'N/A',
//             },
//             3: {
//                 [DOSING_TYPE.DECREASE]: 'N/A',
//                 [DOSING_TYPE.MAINTAIN]: 'N/A',
//                 [DOSING_TYPE.INCREASE]: 'N/A',
//             },
//         },
//         [TIRZEPATIDE_DOSAGE._12_5]: {
//             1: {
//                 [DOSING_TYPE.DECREASE]: 'N/A',
//                 [DOSING_TYPE.MAINTAIN]: 'N/A',
//                 [DOSING_TYPE.INCREASE]: 'N/A',
//             },
//             2: {
//                 [DOSING_TYPE.DECREASE]: 'N/A',
//                 [DOSING_TYPE.MAINTAIN]: 'N/A',
//                 [DOSING_TYPE.INCREASE]: 'N/A',
//             },
//             3: {
//                 [DOSING_TYPE.DECREASE]: 'N/A',
//                 [DOSING_TYPE.MAINTAIN]: 'N/A',
//                 [DOSING_TYPE.INCREASE]: 'N/A',
//             },
//         },
//     },
// };

// DEPRECATED
// export const dosageToSigMappings: DosageToSigMappings = {
//     [PRODUCT_HREF.SEMAGLUTIDE]: {
//         [SEMAGLUTIDE_DOSAGE._0_25]: {
//             sigs: [
//                 {
//                     header: 'Weeks 1-4',
//                     description:
//                         'Inject 10 units (0.25 mg of semaglutide) subcutaneously once per week for weeks 1-4 from the Semaglutide 2 mL 2.5 mg/mL vial',
//                 },
//                 {
//                     header: 'Weeks 5-8',
//                     description:
//                         'Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for weeks 5-8 from the Semaglutide 2 mL 2.5 mg/mL vial',
//                 },
//                 {
//                     header: 'Weeks 9-12',
//                     description:
//                         'Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for weeks 9-12" from the Semaglutide 2 mL 2.5 mg/mL vial',
//                 },
//             ],
//             dosage: SEMAGLUTIDE_DOSAGE._0_25,
//         },
//         [SEMAGLUTIDE_DOSAGE._0_5]: {
//             sigs: [
//                 {
//                     header: 'Weeks 1-4',
//                     description:
//                         'Inject 50 units (0.5 mg of semaglutide) subcutaneously once per week for weeks 1-4 from the Semaglutide/cyanocobalmin 1/0.5 MG/ML (2.5 ML)',
//                 },
//                 {
//                     header: 'Weeks 5-8',
//                     description:
//                         'Inject 25 units (1.25 mg of semaglutide) subcutaneously once per week for weeks 5-8 from the Semaglutide/cyanocobalamin 5/0.5 MG/ML (1 ML)',
//                 },
//                 {
//                     header: 'Weeks 9-12',
//                     description:
//                         'Inject 50 units (2.5 mg of semaglutide) subcutaneously once per week for weeks 9-12 from the Semaglutide/cyanocobalmin 5/0.5 MG/ML (2.5 ML)',
//                 },
//             ],
//             dosage: SEMAGLUTIDE_DOSAGE._0_5,
//         },
//         [SEMAGLUTIDE_DOSAGE._1_25]: {
//             sigs: [
//                 {
//                     header: 'Weeks 1-4',
//                     description:
//                         'Inject 25 units (1.25 mg of semaglutide) subcutaneously once per week for weeks 1-4 from the Semaglutide/cyanocobalamin 5/0.5 MG/ML (1 ML)',
//                 },
//                 {
//                     header: 'Weeks 5-12',
//                     description:
//                         'Inject 50 units (2.5 mg of semaglutide) subcutaneously once per week for weeks 5-12 from the Semaglutide/cyanocobalmin 5/0.5 MG/ML (2.5 ML)',
//                 },
//             ],
//             dosage: SEMAGLUTIDE_DOSAGE._1_25,
//         },
//         [SEMAGLUTIDE_DOSAGE._2_5]: {
//             sigs: [
//                 {
//                     header: 'Weeks 1-12',
//                     description:
//                         'Inject 50 units (2.5 mg) per week or as directed by your provider from the Semaglutide/cyanocobalmin 5/0.5 MG/ML (2.5 ML)',
//                 },
//             ],
//             dosage: SEMAGLUTIDE_DOSAGE._2_5,
//         },
//     },
//     [PRODUCT_HREF.TIRZEPATIDE]: {
//         [TIRZEPATIDE_DOSAGE._2_5]: {
//             sigs: [
//                 {
//                     header: 'Weeks 1-4',
//                     description:
//                         'Inject 25 units (2.5 mg of tirzepatide) subcutaneously once per week for weeks 1-4 from the Tirzepatide 5 mL 5mg/0.5mL vial',
//                 },
//                 {
//                     header: 'Weeks 5-8',
//                     description:
//                         'Inject 50 units (5 mg of tirzepatide) subcutaneously once per week for weeks 5-8 from the Tirzepatide 5 mL 5mg/0.5mL vial',
//                 },
//                 {
//                     header: 'Weeks 9-12',
//                     description:
//                         'Inject 50 units (5 mg of tirzepatide) subcutaneously once per week for weeks 9-12 from the Tirzepatide 5 mL 5mg/0.5mL vial',
//                 },
//             ],
//             dosage: TIRZEPATIDE_DOSAGE._2_5,
//         },
//         [TIRZEPATIDE_DOSAGE._5]: {
//             sigs: [
//                 {
//                     header: 'Weeks 1-4',
//                     description:
//                         'Inject 50 units (5 mg of tirzepatide) subcutaneously once per week for weeks 1-4 from the Tirzepatide 2 mL 5mg/0.5mL vial',
//                 },
//                 {
//                     header: 'Weeks 5-8',
//                     description:
//                         'Inject 50 units (5 mg of tirzepatide) subcutaneously once per week for weeks 5-8 from the Tirzepatide 2 mL 5mg/0.5mL vial',
//                 },
//                 {
//                     header: 'Weeks 9-12',
//                     description:
//                         'Inject 75 units (7.5 mg of tirzepatide) subcutaneously once per week for weeks 9-12 from the Tirzepatide 2 mL 5mg/0.5mL vial',
//                 },
//             ],
//             dosage: TIRZEPATIDE_DOSAGE._5,
//         },
//         [TIRZEPATIDE_DOSAGE._7_5]: {
//             sigs: [
//                 {
//                     header: 'Weeks 1-4',
//                     description:
//                         'Inject 75 units (7.5 mg of tirzepatide) subcutaneously once per week for weeks 1-4 from the Tirzepatide 2 mL 5mg/0.5mL vial',
//                 },
//                 {
//                     header: 'Weeks 5-8',
//                     description:
//                         'Inject 75 units (7.5 mg of tirzepatide) subcutaneously once per week for weeks 5-8  from the Tirzepatide 2 mL 5mg/0.5mL vial',
//                 },
//                 {
//                     header: 'Weeks 9-12',
//                     description:
//                         'Inject 75 units (7.5 mg of tirzepatide) subcutaneously once per week for weeks 9-12  from the Tirzepatide 2 mL 5mg/0.5mL vial',
//                 },
//             ],
//             dosage: TIRZEPATIDE_DOSAGE._7_5,
//         },
//         [TIRZEPATIDE_DOSAGE._10]: {
//             sigs: [
//                 {
//                     header: 'Weeks 1-4',
//                     description:
//                         'Inject 100 units (10 mg of tirzepatide) subcutaneously once per week for weeks 1-4 from the Tirzepatide 3 mL 5mg/0.5mL vial',
//                 },
//                 {
//                     header: 'Weeks 5-8',
//                     description:
//                         'Inject 100 units (10 mg of tirzepatide) subcutaneously once per week for weeks 5-8  from the Tirzepatide 3 mL 5mg/0.5mL vial',
//                 },
//                 {
//                     header: 'Weeks 9-12',
//                     description:
//                         'Inject 100 units (10 mg of tirzepatide) subcutaneously once per week for weeks 9-12  from the Tirzepatide 3 mL 5mg/0.5mL vial',
//                 },
//             ],
//             dosage: TIRZEPATIDE_DOSAGE._10,
//         },
//         [TIRZEPATIDE_DOSAGE._12_5]: {
//             sigs: [
//                 {
//                     header: 'Weeks 1-4',
//                     description:
//                         'Inject 125 units (12.5 mg of tirzepatide) subcutaneously once per week for weeks 1-4 from the Tirzepatide 5 mL 5mg/0.5mL vial',
//                 },
//                 {
//                     header: 'Weeks 5-8',
//                     description:
//                         'Inject 125 units (12.5 mg of tirzepatide) subcutaneously once per week for weeks 5-8 from the Tirzepatide 5 mL 5mg/0.5mL vial',
//                 },
//                 {
//                     header: 'Weeks 9-12',
//                     description:
//                         'Inject 125 units (12.5 mg of tirzepatide) subcutaneously once per week for weeks 9-12 from the Tirzepatide 5 mL 5mg/0.5mL vial',
//                 },
//             ],
//             dosage: TIRZEPATIDE_DOSAGE._12_5,
//         },
//     },
// };
