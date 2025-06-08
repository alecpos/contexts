/**
 * Array relating variant indices of glp-1 medications to their display names.
 */

interface VariantMappingArray {
    [key: number]: string;
}

interface DualVariantMappingArray {
    [key: string]: {
        [key: number]: string;
    };
}

export const SEMAGLUTIDE_VARIANT_DISPLAY_ARRAY: VariantMappingArray = {
    0: 'not-implemented',
    1: 'not-implemented',
    2: '[1-month] Semaglutide 1 mg total (0.25 mg dosing) [$289]',
    3: '[1-month] Semaglutide 2.5 mg total (0.5 mg dosing) [$289]',
    4: '[1-month] Semaglutide 5 mg total (1.25 mg dosing) [$289]',
    5: '[1-month] Semaglutide 12.5 mg total (2.5 mg dosing) [$449]',
    6: '[3-month] Semaglutide 8.5 mg total (0.25mg, 0.5mg, 1.25mg dosing) [$477.15]',
    7: '[3-month] Semaglutide 15 mg total (1.25mg, 1.25mg, 1.25mg dosing) [$603.72]',
    8: '[3-month] Semaglutide 20 mg total (0.5mg, 1.25mg, 2.5mg dosing) [$808.92]',
    9: '[3-month] Semaglutide 30 mg total (1.25mg, 2.5mg, 2.5mg dosing) [$916.92]',
    10: '[3-month] Semaglutide 37.5 mg total (2.5mg dosing or as directed by your provider) [$1024.92]',
    11: '[3-month] Semaglutide 7.5 mg total (0.5mg, 0.5mg, 0.5mg dosing) [$477.15]',
    12: '[3-month] Semaglutide 10 mg total ((0.25 mg, 0.5 mg, 1.25 mg dosing) [$477.15]',
    13: 'DO NOT USE [1-month] Semaglutide Hallandale (0.5 mg) [$289]',
    14: 'DO NOT USE [1-month] Semaglutide Hallandale (1.25 mg) [$289]',
    15: '[6-month] Semaglutide 7.5 mg total (0.25 mg x 6 dosing) [$834]',
    16: '[6-month] Semaglutide 15 mg total (0.5 mg x 6 dosing) [$894]',
    18: '[6-month] Semaglutide 17.5 mg total (0.25 mg, 0.5 mg, 0.5 mg, 1 mg x 3 dosing) [$774]',
    19: '[6-month] Semaglutide 37.5 mg total (12.5 mg x 3 dosing) [$1494]',
    20: '[6-month] Semaglutide 50 mg total (1.25 mg x 3, 2.5 mg x 3 dosing) [$1674]',
};
export const TIRZEPATIDE_VARIANT_DISPLAY_ARRAY: VariantMappingArray = {
    0: 'not-implemented',
    1: 'not-implemented',
    2: 'not-implemented',
    3: '[1-month] Tirzepartide 20 mg total (2.5 mg dosing) [$449]',
    4: '[1-month] Tirzepartide 20 mg total (5 mg dosing) [$449]',
    5: '[1-month] Tirzepartide 34 mg total (7.5 mg dosing) [$529]',
    6: '[Bundle] Tirzepatide 60 mg total (2.5mg, 5mg dosing) [$702]',
    7: '[Bundle] Tirzepatide 60 mg total (2.5mg dosing and check in for further instructions) [$702]',
    8: '[Bundle] Tirzepatide 88 mg total (5mg dosing and check in for further instructions) [$1186.92]',
    9: '[Bundle] Tirzepatide 102 mg total (7.5mg, 7.5mg, 7.5mg dosing) [$1399.00]',
    10: '[1-month] Trizepatide 54 mg total (10 mg dosing) [$799]',
    11: '[1-month] Trizepatide 54 mg total (12.5 mg dosing) [$799]',
    12: '[Bundle] Trizepatide 120 mg total (10 mg dosing) [$1599]',
    13: '[Bundle] Trizepatide 150 mg total (12.5 mg dosing) [$2299]',
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
};

export const SEMAGLUTIDE_TIRZEPATIDE_COMBINED_DISPLAY_ARRAY: DualVariantMappingArray =
    {
        semaglutide: {
            1: 'not-implemented',
            2: 'not-implemented',
            3: '[1-month] Semaglutide 1 mg total (0.25 mg dosing) [$289]',
            4: '[1-month] Semaglutide 2.5 mg total (0.5 mg dosing) [$289]',
            5: '[1-month] Semaglutide 5 mg total (1.25 mg dosing) [$289]',
            6: '[1-month] Semaglutide 12.5 mg total (2.5 mg dosing) [$449]',
            7: '[Bundle] Semaglutide 8.5 mg total (0.25mg, 0.5mg, 1.25mg dosing) [$477.15]',
            8: '[Bundle] Semaglutide 15 mg total (1.25mg dosing or as directed by provider) [$603.72]',
            9: '[Bundle] Semaglutide 20 mg total (0.5mg, 1.25mg, 2.5mg dosing) [$808.92]',
            10: '[Bundle] Semaglutide 30 mg total (1.25mg, 2.5mg, 2.5mg dosing) [$916.92]',
            11: '[Bundle] Semaglutide 37.5 mg total (2.5mg dosing or as directed by your provider) [$1024.92]',
        },
        tirzepatide: {
            1: 'not-implemented',
            2: 'not-implemented',
            3: '[1-month] Tirzepartide 20 mg total (2.5 mg dosing) [$449]',
            4: '[1-month] Tirzepartide 20 mg total (5 mg dosing) [$449]',
            5: '[1-month] Tirzepartide 34 mg total (7.5 mg dosing) [$529]',
            6: '[Bundle] Tirzepatide 60 mg total (2.5mg, 5mg dosing) [$702]',
            7: '[Bundle] Tirzepatide 60 mg total (2.5mg dosing and check in for further instructions) [$702]',
            8: '[Bundle] Tirzepatide 88 mg total (5mg dosing and check in for further instructions) [$1186.92]',
            9: '[Bundle] Tirzepatide 102 mg total (7.5mg, 7.5mg, 7.5mg dosing) [$1399.00]',
            10: '[1-month] Trizepatide 54 mg total (10 mg dosing) [$799]',
            11: '[1-month] Trizepatide 54 mg total (12.5 mg dosing) [$799]',
            12: '[Bundle] Trizepatide 120 mg total (10 mg dosing) [$1599]',
            13: '[Bundle] Trizepatide 150 mg total (12.5 mg dosing) [$2299]',
        },
    };
