import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import {
    GLP1_NAMES_TO_INDEX,
    METFORMIN_DOSAGE,
    SEMAGLUTIDE_DOSAGE,
    TIRZEPATIDE_DOSAGE,
    WEIGHTLOSS_CAPSULE_DOSAGE,
} from '../../adjust-dosing-dialog/dosing-mappings';

export const doubleDosageDosingSwapOptionsAndSigs: DosingChangeQuarterlyReviewOption[] =
    [
        {
            dosing: '0.25 mg weekly Semaglutide',
            index: 0,
            header: {
                monthly:
                    '[Monthly] Semaglutide 1 mg total (0.25 mg dosing) [$289]',
                bundle: '[Quarterly] Semaglutide 10 mg (0.25 mg, 0.5 mg, 1.25 mg dosing) [$477.15]',
                biannual_1:
                    '[Biannually] Semaglutide 7.5 mg (0.25mg dosing) [$834]',
                biannual_2:
                    '[Biannually] Semaglutide 17.5 mg (0.25mg, 0.5mg, 0.5mg, 1mg, 1mg, 1mg dosing) [$834]',
                annual: '[Annual] Semaglutide 50 mg (0.25, 0.5, 1, 1, 1, 1.25x7 mg dosing) [$1980]',
            },
            variant_indexes: [2, 12, 15, 18, 37],
            product_href: PRODUCT_HREF.SEMAGLUTIDE,
            product_description: {
                monthly: 'Semaglutide 1 mL, 1 mg/mL',
                bundle: 'Semaglutide 2 mL, 2.5 mg/mL (x2)',
                biannual_1:
                    'Semaglutide 1 mL, 2.5 mg/mL + Semaglutide 2 mL, 2.5 mg/mL',
                biannual_2:
                    'Semaglutide 2 mL, 2.5 mg/mL + Semaglutide 5 mL, 2.5 mg/mL',
                annual: 'Semaglutide 5 mL, 2.5 mg/mL (x4)',
            },
            sigs: {
                monthly:
                    'Inject 25 units (0.25 mg of semaglutide) subcutaneously once a week for four weeks',
                bundle: [
                    'Month 1 Inject 10 units (0.25 mg of semaglutide) subcutaneously once per week for weeks 1-4',
                    'Month 2 Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for weeks 5-8',
                    'Month 3 Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for weeks 9-12',
                ],
                biannual_1: [
                    'Months 1-6 Inject 10 units (0.25 mg of semaglutide) subcutaneously once per week for 24 weeks',
                ],
                biannual_2: [
                    'Inject 10 units (0.25 mg of semaglutide) subcutaneously once per week for 8 weeks',
                    'Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for 8 weeks',
                    'Inject 40 units (1 mg of semaglutide) subcutaneously once per week for 12 weeks',
                ],
                annual: [
                    'Month 1: Inject 10 units (0.25 mg of semaglutide) subcutaneously once per week',
                    'Month 2: Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week',
                    'Month 3: Inject 40 units (1 mg of semaglutide) subcutaneously once per week',
                    'Month 4: Inject 40 units (1 mg of semaglutide) subcutaneously once per week',
                    'Month 5: Inject 40 units (1 mg of semaglutide) subcutaneously once per week',
                    'Month 6: Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week',
                    'Month 7: Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week',
                    'Month 8: Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week',
                    'Month 9: Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week',
                    'Month 10: Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week',
                    'Month 11: Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week',
                    'Month 12: Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week',
                ],
            },
            macro_id: 274,
            contains_maintenance: false,
            active_recs: {
                maintenance: false,
                biannual_1: true,
                biannual_2: true,
                annual: true,
            },
        },
        {
            dosing: '0.5 mg weekly Semaglutide',
            index: 1,
            header: {
                monthly: '[Monthly] Semaglutide 2.5 mg (0.5 mg dosing) [$289]',
                bundle: '[Quarterly] Semaglutide 20 mg total (0.5mg, 1.25mg, 2.5mg dosing) [$808.92]',
                biannual_1:
                    '[Biannually] Semaglutide 15 mg total (0.5mg x 6 dosing) [$894]',
                biannual_2:
                    '[Biannually] Semaglutide 25 mg total (0.5mg, 0.5mg, 1.25mg, 1.25mg, 2.5mg, 2.5mg dosing) [$1494]',
                annual: '[Annual] Semaglutide 55 mg (0.5, 0.5, 1.25x10 mg dosing) [$1980]',
            },
            variant_indexes: [13, 8, 16, 19, 39],
            product_href: PRODUCT_HREF.SEMAGLUTIDE,
            product_description: {
                monthly: 'Semaglutide 1 mL, 2.5 mg/mL',
                bundle: 'Semaglutide 2.5 mL, 1 mg/mL + Semaglutide 1 mL, 5mg/mL + Semaglutide 2.5 mL, 5 mg/mL',
                biannual_1: 'Semaglutide 2 mL, 2.5 mg/mL (x3)',
                biannual_2: 'Semaglutide 5 mL, 2.5 mg/mL (x2)',
                annual: 'Semaglutide 5 mL, 2.5 mg/mL (x2) + Semaglutide 2 mL, 2.5 mg/mL',
            },
            sigs: {
                monthly:
                    'Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for 4 weeks',
                bundle: [
                    'Month 1 Inject 50 units (0.5 mg of semaglutide) subcutaneously once per week for weeks 1-4',
                    'Month 2 Inject 25 units (1.25 mg of semaglutide) subcutaneously once per week for weeks 5-8',
                    'Month 3 Inject 50 units (2.5 mg of semaglutide) subcutaneously once per week for weeks 9-12',
                ],
                biannual_1: [
                    'Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for 24 weeks',
                ],
                biannual_2: [
                    'Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for 8 weeks',
                    'Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for 8 weeks',
                    'Inject 100 units (2.5 mg of semaglutide) subcutaneously once per week for 8 weeks',
                ],
                annual: [
                    'Month 1: Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week',
                    'Month 2: Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week',
                    'Month 3:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week',
                    'Month 4:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week',
                    'Month 5:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week',
                    'Month 6:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week',
                    'Month 7:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week',
                    'Month 8:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week',
                    'Month 9:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week',
                    'Month 10: Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week',
                    'Month 11: Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week',
                    'Month 12: Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week',
                ],
            },
            macro_id: 274,
            contains_maintenance: false,
            active_recs: {
                maintenance: false,
                biannual_1: true,
                biannual_2: true,
                annual: true,
            },
        },
        {
            dosing: '1.25 mg weekly Semaglutide',
            index: 2,
            header: {
                monthly: '[Monthly] Semaglutide 5 mg (1.25 mg dosing) [$289]',
                bundle: '[Quarterly] Semaglutide 30 mg total (1.25mg, 2.5mg, 2.5mg dosing) [$916.92]',
                maintenance:
                    '[Quarterly] Semaglutide 15 mg total (1.25mg, 1.25mg, 1.25mg dosing) [$603.72]',
                biannual_1:
                    '[Biannually] Semaglutide 50 mg total (1.25mg, 1.25mg, 1.25mg, 2.5mg, 2.5mg, 2.5mg) [$1674]',
                annual: '[Annual] Semaglutide 60 mg (1.25 mg x12 dosing) [$2148]',
            },
            variant_indexes: [4, 9, 20, 41, 34],
            product_href: PRODUCT_HREF.SEMAGLUTIDE,
            product_description: {
                monthly: 'Semaglutide/cyanocobalamin 5/0.5 mg/ml (1mL)',
                bundle: 'Semaglutide/cyanocobalamin 5/0.5 mg/mL (1mL) (x3)',
                maintenance: 'Semaglutide/cyanocobalamin 5/0.5 mg/ml (x3)',
                biannual_1:
                    'Semaglutide 1 mL, 2.5 mg/mL + Semaglutide 2 mL, 2.5 mg/mL',
                annual: 'Semaglutide 5 mL, 2.5 mg/mL (x5)',
            },
            sigs: {
                monthly:
                    'Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for 4 weeks',
                bundle: [
                    'Month 1 Inject 25 units (1.25 mg of semaglutide) subcutaneously once per week for weeks 1-4',
                    'Months 2-3 Inject 50 units (2.5 mg of semaglutide) subcutaneously once per week for weeks 5-12',
                ],
                maintenance: [
                    'Months 1-3 Inject 20 units (1.25 mg) subcutaneously once per week for weeks 1-12',
                ],
                biannual_1: [
                    'Month 1-3: Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week, ' +
                        'Month 3-6: Inject 100 units (2.5 mg of semaglutide) subcutaneously once per week for 12 weeks',
                ],
                annual: [
                    'Month 1:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week',
                    'Month 2:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week',
                    'Month 3:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week',
                    'Month 4:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week',
                    'Month 5:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week',
                    'Month 6: Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week',
                    'Month 7:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week',
                    'Month 8:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week',
                    'Month 9:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week',
                    'Month 10:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week',
                    'Month 11:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week',
                    'Month 12: Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week',
                ],
            },
            macro_id: 275,
            contains_maintenance: false,
            active_recs: {
                maintenance: true,
                biannual_1: true,
                biannual_2: false,
                annual: true,
            },
        },
        {
            dosing: '2.5 mg weekly Semaglutide',
            index: 3,
            product_href: PRODUCT_HREF.SEMAGLUTIDE,
            header: {
                monthly:
                    '[Monthly] Semaglutide 12.5 mg total (2.5 mg dosing) [$449]',
                bundle: '[Quarterly] Semaglutide 37.5 mg total (2.5 mg dosing or as directed by your provider) [$1024.92]',
                // maintenance:
                //     '[Quarterly] Semaglutide 15 mg total (1.25mg Maintenance Dosing) [$603.72]',
                // biannual_1:
                //     '[Biannually] Semaglutide 27.5 mg total (1.25mg, 1.25mg, 1.25mg, 2.5mg, 2.5mg, 2.5mg dosing) [$1794]',
            },
            variant_indexes: [5, 10],
            product_description: {
                monthly: 'Semaglutide/cyanocobalamin 5/0.5 mg/mL (2.5mL)',
                bundle: 'Semaglutide/cyanocobalamin 5/0.5 mg/mL (2.5mL) (x3)',
                // maintenance: 'Semaglutide/cyanocobalamin 5/0.5 mg/mL (1 ML)',
                // biannual_1:
                //     'Semaglutide 1 mL, 2.5 mg/mL + Semaglutide 5 mL, 2.5 mg/mL (x2)',
            },
            sigs: {
                monthly:
                    'Inject 50 units (2.5 mg of semaglutide) subcutaneously once a week for four weeks',
                bundle: [
                    'Months 1-3 Inject 50 units (2.5 mg of semaglutide) subcutaneously once per week for weeks 1-12 or as directed by your provider',
                ],
                // maintenance: [
                //     'Months 1-3 25 units (1.25 mg of semaglutide) subcutaneously once per week for weeks 1-12 or as directed by your provider',
                // ],
                // biannual_1: [
                //     'Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for 12 weeks',
                //     'Inject 100 units (2.5 mg of semaglutide) subcutaneously once per week for 12 weeks',
                // ],
            },
            macro_id: 276,
            contains_maintenance: true,
            active_recs: {
                maintenance: false,
                biannual_1: false,
                biannual_2: false,
            },
        },
        {
            dosing: '2.5 mg weekly Tirzepatide',
            index: 4,
            header: {
                monthly: '[Monthly] Tirzepatide 20 mg (2.5 mg dosing) [$449]',
                bundle: '[Quarterly] Tirzepatide 60 mg (2.5 mg, 5 mg, 5 mg dosing) [$702]',
                biannual_1:
                    '[Biannually] Tirzepatide 60 mg (2.5mg x6 dosing) [$1314]',
                biannual_2:
                    '[Biannually] Tirzepatide 90 mg (2.5mg, 2.5mg, 2.5mg, 5mg, 5mg, 5mg dosing) [$1374]',
                annual: '[Annual] Tirzepatide 180 mg (2.5mgx6, 5mgx6 dosing) [$2628]',
            },
            variant_indexes: [3, 6, 24, 27, 40],
            product_href: PRODUCT_HREF.TIRZEPATIDE,
            product_description: {
                monthly: 'Tirzepatide/niacinamide 8/2 mg/ml (2.5 ml)',
                bundle: 'Tirzepatide/niacinamide 8/2 mg/ml (2.5 ml) x 3',
                biannual_1: 'Tirzepatide 5/0.5 mg/ml (3 ml) x 2',
                biannual_2:
                    'Tirzepatide 5/0.5 mg/ml (4 ml) + Tirzepatide 5/0.5 mg/ml (5 ml)',
                annual: 'Tirzepatide/niacinamide 5mg / 0.5mL (5 ml) x 3 + Tirzepatide/niacinamide 5mg/ 0.5mL (3 ml)',
            },
            sigs: {
                monthly:
                    'Inject 30 units (2.5 mg of tirzepatide) subcutaneously once per week for 4 weeks',
                bundle: [
                    'Month 1 Inject 30 units (2.5 mg of tirzepatide) subcutaneously once per week for weeks 1-4',
                    'Month 2 Inject 63 units (5 mg of tirzepatide) subcutaneously once per week for weeks 5-8',
                    'Month 3 Inject 63 units (5 mg of tirzepatide) subcutaneously once per week for weeks 9-12',
                ],
                biannual_1: [
                    'Inject 25 units (2.5 mg of Tirzepatide) subcutaneously once per week for 24 weeks',
                ],
                biannual_2: [
                    'Inject 25 units (2.5 mg of Tirzepatide) subcutaneously once per week for 12 weeks',
                    'Inject 50 units (5 mg of Tirzepatide) subcutaneously once per week for 12 weeks',
                ],
                annual: [
                    'Month 1: Inject 25 units (2.5 mg of Tirzepatide) subcutaneously once per week',
                    'Month 2: Inject 25 units (2.5 mg of Tirzepatide) subcutaneously once per week',
                    'Month 3: Inject 25 units (2.5 mg of Tirzepatide) subcutaneously once per week',
                    'Month 4: Inject 25 units (2.5 mg of Tirzepatide) subcutaneously once per week',
                    'Month 5: Inject 25 units (2.5 mg of Tirzepatide) subcutaneously once per week',
                    'Month 6: Inject 25 units (2.5 mg of Tirzepatide) subcutaneously once per week',
                    'Month 7: Inject 50 units (5 mg of Tirzepatide) subcutaneously once per week',
                    'Month 8: Inject 50 units (5 mg of Tirzepatide) subcutaneously once per week',
                    'Month 9: Inject 50 units (5 mg of Tirzepatide) subcutaneously once per week',
                    'Month 10: Inject 50 units (5 mg of Tirzepatide) subcutaneously once per week',
                    'Month 11: Inject 50 units (5 mg of Tirzepatide) subcutaneously once per week',
                    'Month 12: Inject 50 units (5 mg of Tirzepatide) subcutaneously once per week',
                ],
            },
            macro_id: 277,
            contains_maintenance: false,
            active_recs: {
                maintenance: false,
                biannual_1: true,
                biannual_2: true,
                annual: true,
            },
        },
        {
            dosing: '5 mg weekly Tirzepatide',
            index: 5,
            header: {
                monthly: '[Monthly] Tirzepartide 20 mg (5 mg dosing) [$449]',
                bundle: '[Quarterly] Tirzepatide 88 mg (5 mg, 7.5 mg, 7.5 mg dosing) [$1186.92]',
            },
            variant_indexes: [4, 8],
            product_href: PRODUCT_HREF.TIRZEPATIDE,
            product_description: {
                monthly: 'Tirzepatide/niacinamide 8/2 mg/ml (2.5 ml)',
                bundle: 'Tirzepatide/niacinamide 17/2 mg/ml (2 ml) x 2',
                biannual_1: '',
            },

            sigs: {
                monthly:
                    'Inject 63 units (5 mg of tirzepatide) subcutaneously once a week for four weeks',
                bundle: [
                    'Month 1 (Weeks 1-4) Inject 60 units (5 mg) subcutaneously once per week for 4 weeks',
                    'Month 2 (Weeks 5-8) Inject 44 units (7.5 mg) subcutaneously once per week for 4 weeks',
                    'Month 3 (Weeks 9-12) Inject 44 units (7.5 mg) subcutaneously once per week for 4 weeks',
                ],
            },
            macro_id: 277,
            contains_maintenance: false,
            active_recs: {
                maintenance: false,
                biannual_1: true,
                biannual_2: false,
            },
        },
        {
            dosing: '7.5 mg weekly Tirzepatide',
            index: 6,
            header: {
                monthly: '[Monthly] Tirzepartide 34 mg (7.5 mg dosing) [$449]',
                bundle: '[Quarterly] Tirzepatide 102 mg (7.5 mg, 7.5 mg, 7.5 mg dosing) [$1399]',
            },
            variant_indexes: [5, 9],
            product_href: PRODUCT_HREF.TIRZEPATIDE,
            product_description: {
                monthly: 'Tirzepatide 2 mL, 17 mg/mL',
                bundle: 'Tirzepatide/niacinamide 17/2 mg/ml (2 ml) x 3',
            },
            sigs: {
                monthly:
                    'Inject 44 units (7.5 mg of tirzepatide) subcutaneously once a week for four weeks',
                bundle: [
                    'Month 1 Inject 44 units (7.5 mg of tirzepatide) subcutaneously once per week for weeks 1-4',
                    'Month 2 Inject 44 units (7.5 mg of tirzepatide) subcutaneously once per week for weeks 5-8',
                    'Month 3 Inject 44 units (7.5 mg of tirzepatide) subcutaneously once per week for weeks 9-12',
                ],
            },
            macro_id: 278,
            contains_maintenance: false,
            active_recs: {
                maintenance: false,
                biannual_1: false,
                biannual_2: false,
            },
        },
        {
            dosing: '10 mg weekly Tirzepatide',
            index: 7,
            header: {
                monthly: '[Monthly] Tirzepatide 54 mg (10 mg dosing) [$729]',
                bundle: '[Quarterly] Tirzepatide 136 mg (10 mg, 10 mg, 10 mg dosing) [$1599]',
                biannual_1:
                    '[Biannually] Tirzepatide 240 mg (10 mg x6 dosing) [$3774]',
            },
            variant_indexes: [
                10,
                GLP1_NAMES_TO_INDEX.TIRZEPATIDE_QUARTERLY_136_MG_EMPOWER,
                25,
            ],
            product_href: PRODUCT_HREF.TIRZEPATIDE,
            product_description: {
                monthly:
                    'Tirzepatide/niacinamide 8/2 mg/ml (2.5 ml) + Tirzepatide/niacinamide 17/2 mg/ml (2 ml)',
                bundle: 'Tirzepatide/niacinamide 17/2 MG/ML (4 ML) (x2)',
                biannual_1: '',
            },
            sigs: {
                monthly:
                    'Inject 125 units (10 mg) once per week for 2 weeks from the Tirzepatide/niacinamide 8/2 mg/ml (2.5 ml) vial. Inject 59 units (10 mg) once per week for 2 weeks from the Tirzepatide/niacinamide 17/2 mg/ml (2 ml) vial',
                bundle: [
                    'Inject 59 units (10 mg) subcutaneously once per week for 12 weeks',
                ],
                biannual_1: [
                    'Inject 100 units (100 mg of Tirzepatide) subcutaneously once per week for 24 weeks',
                ],
            },
            macro_id: 279,
            contains_maintenance: false,
            active_recs: {
                maintenance: false,
                biannual_1: true,
                biannual_2: false,
            },
        },
        {
            dosing: '12.5 mg weekly Tirzepatide',
            index: 8,
            header: {
                monthly: '[Monthly] Tirzepatide 54 mg (12.5 mg dosing) [$729]',
                bundle: '[Bundle] Tirzepatide 170 mg (12.5 mg, 12.5 mg, 12.5 mg dosing) [$1999]',
            },
            variant_indexes: [
                11,
                GLP1_NAMES_TO_INDEX.TIRZEPATIDE_QUARTERLY_170_MG_EMPOWER,
            ],
            product_href: PRODUCT_HREF.TIRZEPATIDE,
            product_description: {
                monthly:
                    'Tirzepatide/niacinamide 8/2 mg/ml (2.5 ml) + Tirzepatide/niacinamide 17/2 mg/ml (2 ml)',
                bundle: 'Tirzepatide/niacinamide 17/2 MG/ML (4 ML) (x2) + Tirzepatide/niacinamide 17/2 MG/ML (2 ML)',
            },
            sigs: {
                monthly:
                    'Inject 156 units (12.5 mg of Tirzepatide) subcutaneously once per week for 2 weeks from the Tirzepatide/niacinamide 8/2 mg/ml (2.5 ml) vial. Inject 74 units (12.5 mg of Tirzepatide) subcutaneously once per week for 2 weeks from the Tirzepatide/niacinamide 17/2 mg/ml (2 ml) vial.',
                bundle: [
                    'Inject 74 units (12.5 mg) subcutaneously once per week for 12 weeks',
                ],
            },
            macro_id: 280,
            contains_maintenance: false,
            active_recs: {
                maintenance: false,
                biannual_1: false,
                biannual_2: false,
            },
        },
    ];

export const singleDosingSwapOptionsAndSigs: DosingChangeQuarterlyReviewOption[] =
    [
        {
            dosing: '0.25 mg weekly Semaglutide',
            index: 0,
            header: {
                monthly:
                    '[Monthly] Semaglutide 1 mg total (0.25 mg dosing) [$289]',
                bundle: '[Quarterly] Semaglutide 10 mg (0.25 mg, 0.5 mg, 1.25 mg dosing) [$477.15]',
                biannual_1:
                    '[Biannually] Semaglutide 7.5 mg (0.25mg dosing) [$834]',
                biannual_2:
                    '[Biannually] Semaglutide 17.5 mg (0.25mg, 0.5mg, 0.5mg, 1mg, 1mg, 1mg dosing) [$834]',
                annual: '[Annual] Semaglutide 50 mg (0.25, 0.5, 1, 1, 1, 1.25x7 mg dosing) [$1980]',
            },
            variant_indexes: [2, 12, 37, 15, 18],
            product_href: PRODUCT_HREF.SEMAGLUTIDE,
            product_description: {
                monthly: 'Semaglutide 1 mL, 1 mg/mL',
                bundle: 'Semaglutide 2 mL, 2.5 mg/mL (x2)',
                biannual_1:
                    'Semaglutide 1 mL, 2.5 mg/mL + Semaglutide 2 mL, 2.5 mg/mL',
                biannual_2:
                    'Semaglutide 2 mL, 2.5 mg/mL + Semaglutide 5 mL, 2.5 mg/mL',
                annual: 'Semaglutide 5 mL, 2.5 mg/mL (x4)',
            },
            sigs: {
                monthly:
                    'Inject 25 units (0.25 mg of semaglutide) subcutaneously once a week for four weeks',
                bundle: [
                    'Month 1 Inject 10 units (0.25 mg of semaglutide) subcutaneously once per week for weeks 1-4',
                    'Month 2 Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for weeks 5-8',
                    'Month 3 Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for weeks 9-12',
                ],
                biannual_1: [
                    'Months 1-6 Inject 10 units (0.25 mg of semaglutide) subcutaneously once per week for 24 weeks',
                ],
                biannual_2: [
                    'Inject 10 units (0.25 mg of semaglutide) subcutaneously once per week for 8 weeks',
                    'Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for 8 weeks',
                    'Inject 40 units (1 mg of semaglutide) subcutaneously once per week for 12 weeks',
                ],
                annual: [
                    'Month 1: Inject 10 units (0.25 mg of semaglutide) subcutaneously once per week',
                    'Month 2: Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week',
                    'Month 3: Inject 40 units (1 mg of semaglutide) subcutaneously once per week',
                    'Month 4: Inject 40 units (1 mg of semaglutide) subcutaneously once per week',
                    'Month 5: Inject 40 units (1 mg of semaglutide) subcutaneously once per week',
                    'Month 6: Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week',
                    'Month 7: Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week',
                    'Month 8: Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week',
                    'Month 9: Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week',
                    'Month 10: Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week',
                    'Month 11: Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week',
                    'Month 12: Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week',
                ],
            },
            macro_id: 256,
            contains_maintenance: false,
            active_recs: {
                maintenance: false,
                biannual_1: true,
                biannual_2: true,
                annual: true,
            },
        },
        {
            dosing: '0.5 mg weekly Semaglutide',
            index: 1,
            header: {
                monthly: '[Monthly] Semaglutide 2.5 mg (0.5 mg dosing) [$289]',
                bundle: '[Quarterly] Semaglutide 20 mg total (0.5mg, 1.25mg, 2.5mg dosing) [$808.92]',
                maintenance:
                    '[Quarterly] Semaglutide 7.5 mg total (0.5mg, 0.5mg, 0.5mg dosing) [$477.15]',
                annual: '[Annual] Semaglutide 55 mg (0.5, 0.5, 1.25x10 mg dosing) [$1980]',
            },
            variant_indexes: [13, 8, 11, 39],
            product_href: PRODUCT_HREF.SEMAGLUTIDE,
            product_description: {
                monthly: 'Semaglutide 1 mL, 2.5 mg/mL',
                bundle: 'Semaglutide 2.5 mL, 1 mg/mL + Semaglutide 1 mL, 5mg/mL + Semaglutide 2.5 mL, 5 mg/mL',
                maintenance: 'Semaglutide 3 mL 2.5 mg/mL',
                annual: 'Semaglutide 5 mL, 2.5 mg/mL (x2) + Semaglutide 2 mL, 2.5 mg/mL',
            },
            sigs: {
                monthly:
                    'Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for 4 weeks',
                bundle: [
                    'Month 1 Inject 50 units (0.5 mg of semaglutide) subcutaneously once per week for weeks 1-4',
                    'Month 2 Inject 25 units (1.25 mg of semaglutide) subcutaneously once per week for weeks 5-8',
                    'Month 3 Inject 50 units (2.5 mg of semaglutide) subcutaneously once per week for weeks 9-12',
                ],
                maintenance: [
                    'Months 1-3 Inject 20 units (0.5 mg) subcutaneously once per week for weeks 1-12',
                ],
                annual: [
                    'Month 1: Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week',
                    'Month 2: Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week',
                    'Month 3:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week',
                    'Month 4:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week',
                    'Month 5:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week',
                    'Month 6:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week',
                    'Month 7:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week',
                    'Month 8:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week',
                    'Month 9:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week',
                    'Month 10: Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week',
                    'Month 11: Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week',
                    'Month 12: Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week',
                ],
            },
            macro_id: 257,
            contains_maintenance: true,
            active_recs: {
                maintenance: true,
                biannual_1: false,
                biannual_2: false,
                annual: true,
            },
        },
        {
            dosing: '1.25 mg weekly Semaglutide',
            index: 2,
            header: {
                monthly: '[Monthly] Semaglutide 5 mg (1.25 mg dosing) [$289]',
                bundle: '[Quarterly] Semaglutide 30 mg total (1.25mg, 2.5mg, 2.5mg dosing) [$916.92]',
                maintenance:
                    '[Quarterly] Semaglutide 15 mg total (1.25mg, 1.25mg, 1.25mg dosing) [$603.72]',
                biannual_1:
                    '[Biannually] Semaglutide 50 mg total (1.25mg, 1.25mg, 1.25mg, 2.5mg, 2.5mg, 2.5mg) [$1674]',
                annual: '[Annual] Semaglutide 60 mg (1.25 mg x12 dosing) [$2148]',
            },
            variant_indexes: [4, 9, 34, 41, 20],
            product_href: PRODUCT_HREF.SEMAGLUTIDE,
            product_description: {
                monthly: 'Semaglutide/cyanocobalamin 5/0.5 mg/ml (1mL)',
                bundle: 'Semaglutide/cyanocobalamin 5/0.5 mg/mL (1mL) (x3)',
                maintenance: 'Semaglutide/cyanocobalamin 5/0.5 mg/ml (x3)',
                biannual_1:
                    'Semaglutide 1 mL, 2.5 mg/mL + Semaglutide 2 mL, 2.5 mg/mL',
                annual: 'Semaglutide 5 mL, 2.5 mg/mL (x5)',
            },
            sigs: {
                monthly:
                    'Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for 4 weeks',
                bundle: [
                    'Month 1 Inject 25 units (1.25 mg of semaglutide) subcutaneously once per week for weeks 1-4',
                    'Months 2-3 Inject 50 units (2.5 mg of semaglutide) subcutaneously once per week for weeks 5-12',
                ],
                maintenance: [
                    'Months 1-3 Inject 20 units (1.25 mg) subcutaneously once per week for weeks 1-12',
                ],
                biannual_1: [
                    'Month 1-3: Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week, ' +
                        'Month 3-6: Inject 100 units (2.5 mg of semaglutide) subcutaneously once per week for 12 weeks',
                ],
                annual: [
                    'Month 1:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week',
                    'Month 2:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week',
                    'Month 3:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week',
                    'Month 4:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week',
                    'Month 5:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week',
                    'Month 6: Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week',
                    'Month 7:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week',
                    'Month 8:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week',
                    'Month 9:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week',
                    'Month 10:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week',
                    'Month 11:  Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week',
                    'Month 12: Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week',
                ],
            },
            macro_id: 258,
            contains_maintenance: true,
            active_recs: {
                maintenance: true,
                biannual_1: true,
                biannual_2: false,
                annual: true,
            },
        },
        {
            dosing: '2.5 mg weekly Semaglutide',
            index: 3,
            product_href: PRODUCT_HREF.SEMAGLUTIDE,
            header: {
                monthly:
                    '[Monthly] Semaglutide 12.5 mg total (2.5 mg dosing) [$449]',
                bundle: '[Quarterly] Semaglutide 37.5 mg total (2.5 mg dosing or as directed by your provider) [$1024.92]',
            },
            variant_indexes: [5, 10],
            product_description: {
                monthly: 'Semaglutide/cyanocobalamin 5/0.5 mg/mL (2.5mL)',
                bundle: 'Semaglutide/cyanocobalamin 5/0.5 mg/mL (2.5mL) (x3)',
            },
            sigs: {
                monthly:
                    'Inject 50 units (2.5 mg of semaglutide) subcutaneously once a week for four weeks',
                bundle: [
                    'Months 1-3 Inject 50 units (2.5 mg of semaglutide) subcutaneously once per week for weeks 1-12 or as directed by your provider',
                ],
            },
            macro_id: 259,
            contains_maintenance: false,
            active_recs: {
                maintenance: false,
                biannual_1: false,
                biannual_2: false,
            },
        },
        {
            dosing: '2.5 mg weekly Tirzepatide',
            index: 4,
            header: {
                monthly: '[Monthly] Tirzepatide 20 mg (2.5 mg dosing) [$449]',
                bundle: '[Quarterly] Tirzepatide 60 mg (2.5 mg, 5 mg, 5 mg dosing) [$702]',
                annual: '[Annual] Tirzepatide 180 mg (2.5mgx6, 5mgx6 dosing) [$2628]',
            },
            variant_indexes: [3, 6, 40],
            product_href: PRODUCT_HREF.TIRZEPATIDE,
            product_description: {
                monthly: 'Tirzepatide/niacinamide 8/2 mg/ml (2.5 ml)',
                bundle: 'Tirzepatide/niacinamide 8/2 mg/ml (2.5 ml) x 3',
                annual: 'Tirzepatide/niacinamide 5mg / 0.5mL (5 ml) x 3 + Tirzepatide/niacinamide 5mg/ 0.5mL (3 ml)',
            },
            sigs: {
                monthly:
                    'Inject 30 units (2.5 mg of tirzepatide) subcutaneously once per week for 4 weeks',
                bundle: [
                    'Month 1 Inject 30 units (2.5 mg of tirzepatide) subcutaneously once per week for weeks 1-4',
                    'Month 2 Inject 63 units (5 mg of tirzepatide) subcutaneously once per week for weeks 5-8',
                    'Month 3 Inject 63 units (5 mg of tirzepatide) subcutaneously once per week for weeks 9-12',
                ],
                annual: [
                    'Month 1: Inject 25 units (2.5 mg of Tirzepatide) subcutaneously once per week',
                    'Month 2: Inject 25 units (2.5 mg of Tirzepatide) subcutaneously once per week',
                    'Month 3: Inject 25 units (2.5 mg of Tirzepatide) subcutaneously once per week',
                    'Month 4: Inject 25 units (2.5 mg of Tirzepatide) subcutaneously once per week',
                    'Month 5: Inject 25 units (2.5 mg of Tirzepatide) subcutaneously once per week',
                    'Month 6: Inject 25 units (2.5 mg of Tirzepatide) subcutaneously once per week',
                    'Month 7: Inject 50 units (5 mg of Tirzepatide) subcutaneously once per week',
                    'Month 8: Inject 50 units (5 mg of Tirzepatide) subcutaneously once per week',
                    'Month 9: Inject 50 units (5 mg of Tirzepatide) subcutaneously once per week',
                    'Month 10: Inject 50 units (5 mg of Tirzepatide) subcutaneously once per week',
                    'Month 11: Inject 50 units (5 mg of Tirzepatide) subcutaneously once per week',
                    'Month 12: Inject 50 units (5 mg of Tirzepatide) subcutaneously once per week',
                ],
            },
            macro_id: 260,
            contains_maintenance: false,
            active_recs: {
                maintenance: false,
                biannual_1: false,
                biannual_2: false,
                annual: true,
            },
        },
        {
            dosing: '5 mg weekly Tirzepatide',
            index: 5,
            header: {
                monthly: '[Monthly] Tirzepartide 20 mg (5 mg dosing) [$449]',
                bundle: '[Quarterly] Tirzepatide 88 mg (5 mg, 7.5 mg, 7.5 mg dosing) [$1186.92]',
            },
            variant_indexes: [4, 8],
            product_href: PRODUCT_HREF.TIRZEPATIDE,
            product_description: {
                monthly: 'Tirzepatide/niacinamide 8/2 mg/ml (2.5 ml)',
                bundle: 'Tirzepatide/niacinamide 17/2 mg/ml (2 ml) x 2',
            },

            sigs: {
                monthly:
                    'Inject 63 units (5 mg of tirzepatide) subcutaneously once a week for four weeks',
                bundle: [
                    'Month 1 (Weeks 1-4) Inject 60 units (5 mg) subcutaneously once per week for 4 weeks',
                    'Month 2 (Weeks 5-8) Inject 44 units (7.5 mg) subcutaneously once per week for 4 weeks',
                    'Month 3 (Weeks 9-12) Inject 44 units (7.5 mg) subcutaneously once per week for 4 weeks',
                ],
            },
            macro_id: 261,
            contains_maintenance: false,
            active_recs: {
                maintenance: false,
                biannual_1: false,
                biannual_2: false,
            },
        },
        {
            dosing: '7.5 mg weekly Tirzepatide',
            index: 6,
            header: {
                monthly: '[Monthly] Tirzepartide 34 mg (7.5 mg dosing) [$449]',
                bundle: '[Quarterly] Tirzepatide 102 mg (7.5 mg, 7.5 mg, 7.5 mg dosing) [$1399]',
            },
            variant_indexes: [5, 9],
            product_href: PRODUCT_HREF.TIRZEPATIDE,
            product_description: {
                monthly: 'Tirzepatide 2 mL, 17 mg/mL',
                bundle: 'Tirzepatide/niacinamide 17/2 mg/ml (2 ml) x 3',
            },
            sigs: {
                monthly:
                    'Inject 44 units (7.5 mg of tirzepatide) subcutaneously once a week for four weeks',
                bundle: [
                    'Month 1 Inject 44 units (7.5 mg of tirzepatide) subcutaneously once per week for weeks 1-4',
                    'Month 2 Inject 44 units (7.5 mg of tirzepatide) subcutaneously once per week for weeks 5-8',
                    'Month 3 Inject 44 units (7.5 mg of tirzepatide) subcutaneously once per week for weeks 9-12',
                ],
            },
            macro_id: 262,
            contains_maintenance: false,
            active_recs: {
                maintenance: false,
                biannual_1: false,
                biannual_2: false,
            },
        },
        {
            dosing: '10 mg weekly Tirzepatide',
            index: 7,
            header: {
                monthly: '[Monthly] Tirzepatide 54 mg (10 mg dosing) [$729]',
                bundle: '[Quarterly] Tirzepatide 136 mg (10 mg, 10 mg, 10 mg dosing) [$1599]',
            },
            variant_indexes: [
                10,
                GLP1_NAMES_TO_INDEX.TIRZEPATIDE_QUARTERLY_136_MG_EMPOWER,
            ],
            product_href: PRODUCT_HREF.TIRZEPATIDE,
            product_description: {
                monthly:
                    'Tirzepatide/niacinamide 8/2 mg/ml (2.5 ml) + Tirzepatide/niacinamide 17/2 mg/ml (2 ml)',
                bundle: 'Tirzepatide/niacinamide 17/2 MG/ML (4 ML) (x2)',
            },
            sigs: {
                monthly:
                    'Inject 125 units (10 mg) once per week for 2 weeks from the Tirzepatide/niacinamide 8/2 mg/ml (2.5 ml) vial. Inject 59 units (10 mg) once per week for 2 weeks from the Tirzepatide/niacinamide 17/2 mg/ml (2 ml) vial',
                bundle: [
                    'Inject 59 units (10 mg) subcutaneously once per week for 12 weeks',
                ],
            },
            macro_id: 263,
            contains_maintenance: false,
            active_recs: {
                maintenance: false,
                biannual_1: false,
                biannual_2: false,
            },
        },
        {
            dosing: '12.5 mg weekly Tirzepatide',
            index: 8,
            header: {
                monthly: '[Monthly] Tirzepatide 54 mg (12.5 mg dosing) [$729]',
                bundle: '[Bundle] Tirzepatide 170 mg (12.5 mg, 12.5 mg, 12.5 mg dosing) [$1999]',
            },
            variant_indexes: [
                11,
                GLP1_NAMES_TO_INDEX.TIRZEPATIDE_QUARTERLY_170_MG_EMPOWER,
            ],
            product_href: PRODUCT_HREF.TIRZEPATIDE,
            product_description: {
                monthly:
                    'Tirzepatide/niacinamide 8/2 mg/ml (2.5 ml) + Tirzepatide/niacinamide 17/2 mg/ml (2 ml)',
                bundle: 'Tirzepatide/niacinamide 17/2 MG/ML (4 ML) (x2) + Tirzepatide/niacinamide 17/2 MG/ML (2 ML)',
            },
            sigs: {
                monthly:
                    'Inject 156 units (12.5 mg of Tirzepatide) subcutaneously once per week for 2 weeks from the Tirzepatide/niacinamide 8/2 mg/ml (2.5 ml) vial. Inject 74 units (12.5 mg of Tirzepatide) subcutaneously once per week for 2 weeks from the Tirzepatide/niacinamide 17/2 mg/ml (2 ml) vial.',
                bundle: [
                    'Inject 74 units (12.5 mg) subcutaneously once per week for 12 weeks',
                ],
            },
            macro_id: 264,
            contains_maintenance: false,
            active_recs: {
                maintenance: false,
                biannual_1: false,
                biannual_2: false,
            },
        },
    ];

export interface DosingChangeQuarterlyReviewOption {
    dosing: string;
    index: number;
    product_href: PRODUCT_HREF;
    header: {
        monthly: string;
        bundle: string;
        maintenance?: string;
        biannual_1?: string;
        biannual_2?: string;
        annual?: string;
    };
    product_description: {
        monthly: string;
        bundle: string;
        maintenance?: string;
        biannual_1?: string;
        biannual_2?: string;
        annual?: string;
    };
    variant_indexes: number[];
    sigs: {
        monthly: string;
        bundle: string[];
        maintenance?: string[];
        biannual_1?: string[];
        biannual_2?: string[];
        annual?: string[];
    };
    macro_id: number;
    active_recs: {
        maintenance: boolean;
        biannual_1: boolean;
        biannual_2: boolean;
        annual?: boolean;
    };
    contains_maintenance: boolean;
}

export type DosageSelectionMappings = {
    [key: string]: {
        [key: number]:
            | SEMAGLUTIDE_DOSAGE
            | TIRZEPATIDE_DOSAGE
            | WEIGHTLOSS_CAPSULE_DOSAGE
            | METFORMIN_DOSAGE;
    };
};

export const DosageSelectionVariantIndexToDosage: DosageSelectionMappings = {
    [PRODUCT_HREF.SEMAGLUTIDE]: {
        [GLP1_NAMES_TO_INDEX.SEMAGLUTIDE_MONTHLY_0_25_MG_EMPOWER]:
            SEMAGLUTIDE_DOSAGE._0_25,
        [GLP1_NAMES_TO_INDEX.SEMAGLUTIDE_QUARTERLY_10_MG_HALLANDALE]:
            SEMAGLUTIDE_DOSAGE._0_25,
        [GLP1_NAMES_TO_INDEX.SEMAGLUTIDE_BIANNUALLY_7_5_MG_HALLANDALE_0_25_DOSING]:
            SEMAGLUTIDE_DOSAGE._0_25,
        [GLP1_NAMES_TO_INDEX.SEMAGLUTIDE_BIANNUALLY_17_5_MG_HALLANDALE]:
            SEMAGLUTIDE_DOSAGE._0_25,
        [GLP1_NAMES_TO_INDEX.SEMAGLUTIDE_MONTHLY_0_5_MG_HALLANDALE]:
            SEMAGLUTIDE_DOSAGE._0_5,
        [GLP1_NAMES_TO_INDEX.SEMAGLUTIDE_QUARTERLY_20_MG_EMPOWER]:
            SEMAGLUTIDE_DOSAGE._0_5,
        [GLP1_NAMES_TO_INDEX.SEMAGLUTIDE_BIANNUALLY_15_MG_HALLANDALE]:
            SEMAGLUTIDE_DOSAGE._0_5,
        [GLP1_NAMES_TO_INDEX.SEMAGLUTIDE_BIANNUALLY_37_5_MG_HALLANDALE]:
            SEMAGLUTIDE_DOSAGE._0_5,
        [GLP1_NAMES_TO_INDEX.SEMAGLUTIDE_QUARTERLY_7_5_MG_HALLANDALE]:
            SEMAGLUTIDE_DOSAGE._0_5,
        [GLP1_NAMES_TO_INDEX.SEMAGLUTIDE_MONTHLY_1_25_MG_HALLANDALE]:
            SEMAGLUTIDE_DOSAGE._1_25,
        [GLP1_NAMES_TO_INDEX.SEMAGLUTIDE_QUARTERLY_30_MG_EMPOWER]:
            SEMAGLUTIDE_DOSAGE._1_25,
        [GLP1_NAMES_TO_INDEX.SEMAGLUTIDE_BIANNUALLY_7_5_MG_HALLANDALE_1_25_DOSING]:
            SEMAGLUTIDE_DOSAGE._1_25,
        [GLP1_NAMES_TO_INDEX.SEMAGLUTIDE_MONTHLY_2_5_MG_EMPOWER]:
            SEMAGLUTIDE_DOSAGE._2_5,
        [GLP1_NAMES_TO_INDEX.SEMAGLUTIDE_QUARTERLY_37_5_MG_EMPOWER]:
            SEMAGLUTIDE_DOSAGE._2_5,
        [GLP1_NAMES_TO_INDEX.SEMAGLUTIDE_QUARTERLY_15_MG_EMPOWER]:
            SEMAGLUTIDE_DOSAGE._1_25,
        [GLP1_NAMES_TO_INDEX.SEMAGLUTIDE_BIANNUALLY_50_MG_HALLANDALE]:
            SEMAGLUTIDE_DOSAGE._1_25,
        [GLP1_NAMES_TO_INDEX.SEMAGLUTIDE_QUARTERLY_22_5_MG_EMPOWER]:
            SEMAGLUTIDE_DOSAGE._1_25,
        [GLP1_NAMES_TO_INDEX.SEMAGLUTIDE_MONTHLY_1_25_MG_EMPOWER]:
            SEMAGLUTIDE_DOSAGE._1_25,
        [GLP1_NAMES_TO_INDEX.SEMAGLUTIDE_ANNUALLY_50_MG_HALLANDALE]:
            SEMAGLUTIDE_DOSAGE._0_25,
        [GLP1_NAMES_TO_INDEX.SEMAGLUTIDE_ANNUALLY_55_MG_HALLANDALE]:
            SEMAGLUTIDE_DOSAGE._0_5,
        [GLP1_NAMES_TO_INDEX.SEMAGLUTIDE_ANNUALLY_60_MG_HALLANDALE]:
            SEMAGLUTIDE_DOSAGE._1_25,
        [GLP1_NAMES_TO_INDEX.SEMAGLUTIDE_QUARTERLY_15_MG_REVIVE]:
            SEMAGLUTIDE_DOSAGE._1_25,
    },
    [PRODUCT_HREF.TIRZEPATIDE]: {
        [GLP1_NAMES_TO_INDEX.TIRZEPATIDE_MONTHLY_2_5_MG_EMPOWER]:
            TIRZEPATIDE_DOSAGE._2_5,
        [GLP1_NAMES_TO_INDEX.TIRZEPATIDE_QUARTERLY_60_MG_EMPOWER]:
            TIRZEPATIDE_DOSAGE._2_5,
        [GLP1_NAMES_TO_INDEX.TIRZEPATIDE_BIANNUALLY_60_MG_HALLANDALE]:
            TIRZEPATIDE_DOSAGE._2_5,
        [GLP1_NAMES_TO_INDEX.TIRZEPATIDE_BIANNUALLY_90_MG_HALLANDALE]:
            TIRZEPATIDE_DOSAGE._2_5,
        [GLP1_NAMES_TO_INDEX.TIRZEPATIDE_MONTHLY_5_MG_EMPOWER]:
            TIRZEPATIDE_DOSAGE._5,
        [GLP1_NAMES_TO_INDEX.TIRZEPATIDE_QUARTERLY_88_MG_EMPOWER]:
            TIRZEPATIDE_DOSAGE._5,
        [GLP1_NAMES_TO_INDEX.TIRZEPATIDE_BIANNUALLY_140_MG_HALLANDALE]:
            TIRZEPATIDE_DOSAGE._5,
        [GLP1_NAMES_TO_INDEX.TIRZEPATIDE_MONTHLY_7_5_MG_EMPOWER]:
            TIRZEPATIDE_DOSAGE._7_5,
        [GLP1_NAMES_TO_INDEX.TIRZEPATIDE_QUARTERLY_102_MG_EMPOWER]:
            TIRZEPATIDE_DOSAGE._7_5,
        [GLP1_NAMES_TO_INDEX.TIRZEPATIDE_MONTHLY_10_MG_EMPOWER]:
            TIRZEPATIDE_DOSAGE._10,
        [GLP1_NAMES_TO_INDEX.TIRZEPATIDE_QUARTERLY_120_MG_EMPOWER]:
            TIRZEPATIDE_DOSAGE._10,
        [GLP1_NAMES_TO_INDEX.TIRZEPATIDE_BIANNUALLY_240_MG_HALLANDALE]:
            TIRZEPATIDE_DOSAGE._10,
        [GLP1_NAMES_TO_INDEX.TIRZEPATIDE_MONTHLY_12_5_MG_EMPOWER]:
            TIRZEPATIDE_DOSAGE._12_5,
        [GLP1_NAMES_TO_INDEX.TIRZEPATIDE_QUARTERLY_150_MG_EMPOWER]:
            TIRZEPATIDE_DOSAGE._12_5,
        [GLP1_NAMES_TO_INDEX.TIRZEPATIDE_QUARTERLY_136_MG_EMPOWER]:
            TIRZEPATIDE_DOSAGE._10,
        [GLP1_NAMES_TO_INDEX.TIRZEPATIDE_QUARTERLY_170_MG_EMPOWER]:
            TIRZEPATIDE_DOSAGE._12_5,
        [GLP1_NAMES_TO_INDEX.TIRZEPATIDE_ANNUALLY_180_MG_HALLANDALE]:
            TIRZEPATIDE_DOSAGE._2_5,
    },
    [PRODUCT_HREF.METFORMIN]: {
        0: METFORMIN_DOSAGE.MINIMUM,
    },
    [PRODUCT_HREF.WL_CAPSULE]: {
        0: WEIGHTLOSS_CAPSULE_DOSAGE.MINIMUM,
        1: WEIGHTLOSS_CAPSULE_DOSAGE.MINIMUM,
    },
};

export function getDoubleDosageDosingOptionByDosingQuarterlyReview(
    dosing: string,
): DosingChangeQuarterlyReviewOption | undefined {
    return doubleDosageDosingSwapOptionsAndSigs.find(
        (option) => option.dosing === dosing,
    );
}

export function getSingleDosageDosingOptionByDosingQuarterlyReview(
    dosing: string,
): DosingChangeQuarterlyReviewOption | undefined {
    return singleDosingSwapOptionsAndSigs.find(
        (option) => option.dosing === dosing,
    );
}

export function getSingleDosageDosingOptionByProductQuarterlyReview(
    product_href: PRODUCT_HREF,
) {
    return singleDosingSwapOptionsAndSigs.filter(
        (option) => option.product_href === product_href,
    );
}

export function getDoubleDosageDosingOptionByProductQuarterlyReview(
    product_href: PRODUCT_HREF,
) {
    return doubleDosageDosingSwapOptionsAndSigs.filter(
        (option) => option.product_href === product_href,
    );
}
