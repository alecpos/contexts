import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import { DosageChangeEquivalenceCodes } from '@/app/utils/classes/DosingChangeController/DosageChangeEquivalenceMap';

export const DOSING_SWAP_EQUIVALENCE_CONSTANTS: DosingChangeEquivalenceOptionMetadata[] =
    [
        {
            dosingEquivalence: DosageChangeEquivalenceCodes.SEMAGLUTIDE_0_25,
            dosing: '0.25 mg weekly Semaglutide',
            product_href: PRODUCT_HREF.SEMAGLUTIDE,
            product_description: {
                monthly: 'Semaglutide 0.25 mg dosing',
                quarterly: 'Semaglutide 0.25mg, 0.5mg, 1.25mg dosing',
                biannually: 'Semaglutide 0.25 mg x6 dosing',
            },
            sigs: {
                monthly: [
                    'Inject 50 units (0.25 mg of semaglutide)  subcutaneously once a week for four weeks',
                ],
                quarterly: [
                    'Month 1 Inject 25 units (0.25 mg of semaglutide) subcutaneously once per week for weeks 1-4',
                    'Month 2 Inject 50 units (0.5 mg of semaglutide) subcutaneously once per week for weeks 5-8',
                    'Month 3 Inject 25 units (1.25 mg of semaglutide) subcutaneously once per week for weeks 9-12',
                ],
                biannually: [
                    'Month 1-6: Inject 10 units (0.25 mg of semaglutide) subcutaneously once per week',
                ],
            },
        },
        {
            dosingEquivalence: DosageChangeEquivalenceCodes.SEMAGLUTIDE_0_5,
            dosing: '0.5 mg weekly Semaglutide',
            product_href: PRODUCT_HREF.SEMAGLUTIDE,
            product_description: {
                monthly: 'Semaglutide 0.5 mg dosing',
                quarterly: 'Semaglutide 0.5mg, 1.25mg, 2.5mg dosing',
                biannually: 'Semaglutide 0.5 mg x6 dosing',
            },
            sigs: {
                monthly: [
                    'Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for 4 weeks',
                ],
                quarterly: [
                    'Month 1 Inject 10 units (0.5 mg of semaglutide) subcutaneously once per week for weeks 1-4',
                    'Month 2 Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for weeks 5-8',
                    'Month 3 Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for weeks 9-12',
                ],
                biannually: [
                    'Month 1-6:  Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week',
                ],
            },
        },
        {
            dosingEquivalence: DosageChangeEquivalenceCodes.SEMAGLUTIDE_1_25,
            dosing: '1.25 mg weekly Semaglutide',
            product_href: PRODUCT_HREF.SEMAGLUTIDE,
            product_description: {
                monthly: 'Semaglutide 1.25 mg dosing',
                quarterly: 'Semaglutide 1.25 mg x3 dosing',
                biannually:
                    'Semaglutide 1.25 mg, 1.25 mg, 1.25 mg, 2.5 mg, 2.5 mg, 2.5 mg dosing',
            },
            sigs: {
                monthly: [
                    'Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for 4 weeks',
                ],
                quarterly: [
                    'Months 1-3 Inject 25 units (1.25 mg of semaglutide) subcutaneously once per week for weeks 1-12 or as directed by your provider',
                ],
                biannually: [
                    'Month 1-3: Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week, ',
                    'Month 3-6: Inject 100 units (2.5 mg of semaglutide) subcutaneously once per week for 12 weeks',
                ],
            },
        },
        {
            dosingEquivalence: DosageChangeEquivalenceCodes.SEMAGLUTIDE_2_5,
            dosing: '2.5 mg weekly Semaglutide',
            product_href: PRODUCT_HREF.SEMAGLUTIDE,
            product_description: {
                monthly: 'Semaglutide 2.5 mg dosing',
                quarterly: 'Semaglutide 2.5mg x3 dosing',
            },
            sigs: {
                monthly: [
                    'Inject 50 units (2.5 mg of semaglutide)  subcutaneously once a week for four weeks',
                ],
                quarterly: [
                    'Months 1-3 Inject 50 units (2.5 mg of semaglutide) subcutaneously once per week for weeks 1-12 or as directed by your provider',
                ],
            },
        },
        {
            dosing: '2.5 mg weekly Tirzepatide',
            dosingEquivalence: DosageChangeEquivalenceCodes.TIRZEPATIDE_2_5,
            product_href: PRODUCT_HREF.TIRZEPATIDE,
            product_description: {
                monthly: 'Tirzepatide 2.5 mg dosing',
                quarterly: 'Tirzepatide 2.5 mg, 5 mg, 5 mg dosing',
                biannually: 'Tirzepatide 2.5 mg x6 dosing',
            },

            sigs: {
                monthly: [
                    'Inject 31 units (2.5 mg of tirzepatide) subcutaneously once a week for four weeks',
                ],
                quarterly: [
                    'Month 1 Inject 31 units (2.5 mg of tirzepatide) subcutaneously once per week for weeks 1-4 ',
                    'Months 2 Inject 31 units ( 2.5 mg of tirzepatide) subcutaneously once per week for weeks 5-12 or check-in with your provider for further instructions',
                    'Months 3 Inject 31 units ( 2.5 mg of tirzepatide) subcutaneously once per week for weeks 5-12 or check-in with your provider for further instructions',
                ],
                biannually: [
                    'Month 1-6: Inject 25 units (2.5 mg of Tirzepatide) subcutaneously once per week',
                ],
            },
        },
        {
            dosing: '5 mg weekly Tirzepatide',
            dosingEquivalence: DosageChangeEquivalenceCodes.TIRZEPATIDE_5,
            product_href: PRODUCT_HREF.TIRZEPATIDE,
            product_description: {
                monthly: 'Tirzepatide 5 mg dosing',
                quarterly: 'Tirzepatide 5 mg x3 dosing',
            },

            sigs: {
                monthly: [
                    'Inject 62 units (5 mg of tirzepatide) subcutaneously once a week for four weeks',
                ],
                quarterly: [
                    'Month 1 Inject 50 units (5 mg of tirzepatide) subcutaneously once per week for weeks 1-4 ',
                    'Month 2 Inject 50 units (5 mg of tirzepatide) subcutaneously once per week for weeks 5-8 ',
                    'Month 3 Inject 50 units (5 mg of tirzepatide) subcutaneously once per week for weeks 9-12',
                ],
            },
        },
        {
            dosing: '7.5 mg weekly Tirzepatide',
            dosingEquivalence: DosageChangeEquivalenceCodes.TIRZEPATIDE_7_5,
            product_href: PRODUCT_HREF.TIRZEPATIDE,
            product_description: {
                monthly: 'Tirzepatide 7.5 mg dosing',
                quarterly: 'Tirzepatide 7.5 x3 mg dosing',
            },
            sigs: {
                monthly: [
                    'Inject 44 units (7.5 mg of tirzepatide) subcutaneously once a week for four weeks',
                ],
                quarterly: [
                    'Month 1 Inject 75 units (7.5 mg of tirzepatide) subcutaneously once per week for weeks 1-4 ',
                    'Month 2 Inject 75 units (7.5 mg of tirzepatide) subcutaneously once per week for weeks 5-8 ',
                    'Month 3 Inject 75 units (7.5 mg of tirzepatide) subcutaneously once per week for weeks 9-12',
                ],
            },
        },
        {
            dosing: '10 mg weekly Tirzepatide',
            dosingEquivalence: DosageChangeEquivalenceCodes.TIRZEPATIDE_10,
            product_href: PRODUCT_HREF.TIRZEPATIDE,
            product_description: {
                monthly: 'Tirzepatide 10 mg dosing',
                quarterly: 'Tirzepatide 10 mg x3 dosing',
                biannually: 'Tirzepatide 10 mg x6 dosing',
            },
            sigs: {
                monthly: [
                    'Inject 100 units (10 mg of Tirzepatide) subcutaneously once per week for 4 weeks',
                ],
                quarterly: [
                    'Month 1 Inject 100 units (10 mg of tirzepatide) subcutaneously once per week for weeks 1-4 ',
                    'Month 2 Inject 100 units (10 mg of tirzepatide) subcutaneously once per week for weeks 5-8 ',
                    'Month 3 Inject 100 units (10 mg of tirzepatide) subcutaneously once per week for weeks 9-12',
                ],
                biannually: [
                    'Month 1-6: Inject 100 units (10 mg of Tirzepatide) subcutaneously once per week',
                ],
            },
        },
        {
            dosing: '12.5 mg weekly Tirzepatide',
            dosingEquivalence: DosageChangeEquivalenceCodes.TIRZEPATIDE_12_5,
            product_href: PRODUCT_HREF.TIRZEPATIDE,
            product_description: {
                monthly: 'Tirzepatide 12.5 mg dosing',
                quarterly: 'Tirzepatide 12.5 mg x3 dosing',
            },
            sigs: {
                monthly: [
                    'Inject 156 units (12.5 mg of tirzepatide) subcutaneously once a week for one week (week 1)',
                ],
                quarterly: [
                    'Month 1 Inject 125 units (12.5 mg of tirzepatide) subcutaneously once per week for weeks 1-4 ',
                    'Month 2 Inject 125 units (12.5 mg of tirzepatide) subcutaneously once per week for weeks 5-8 ',
                    'Month 3 Inject 125 units (12.5 mg of tirzepatide) subcutaneously once per week for weeks 9-12',
                ],
            },
        },
    ];

export interface DosingChangeEquivalenceOptionMetadata {
    dosing: string;
    dosingEquivalence: DosageChangeEquivalenceCodes;
    product_href: PRODUCT_HREF;
    product_description: {
        [key: string]: string;
    };
    sigs: {
        [key: string]: string[];
    };
}

export function getDosingOptionByDosageChangeEquivalenceCode(
    dosing: DosageChangeEquivalenceCodes
): DosingChangeEquivalenceOptionMetadata | undefined {
    return DOSING_SWAP_EQUIVALENCE_CONSTANTS.find(
        (option) => option.dosingEquivalence === dosing
    );
}

interface DosageChangeMacroReplacementMap {
    [key: string]: string;
}

export const dosageChangeMacroReplacementTextMap: DosageChangeMacroReplacementMap =
    {
        [DosageChangeEquivalenceCodes.SEMAGLUTIDE_0_25]:
            'I recommend to change your dose to semaglutide 0.25 mg. The price for a 1 month supply is $289 and for a 3 month supply including 0.25mg, 0.5mg, 1.25mg is $477.15. Finally the price for a 6 month supply is $834.00 including 0.25 mg dosing.',
        [DosageChangeEquivalenceCodes.SEMAGLUTIDE_0_5]:
            'I recommend to change your dose to semaglutide 0.5 mg. The price for a 1 month supply is $289 and for a 3 month supply including 0.5mg, 1.25mg and 2.5mg is $808.92. Finally the price for a 6 month supply is $1,494.00 including 0.5mg, 0.5mg, 1.25mg, 1.25mg, 2.5mg, 2.5mg dosing.',
        [DosageChangeEquivalenceCodes.SEMAGLUTIDE_1_25]:
            'I recommend to change your dose to semaglutide 1.25 mg. The price for a 1 month supply is $289 and for a 3 month supply including 1.25mg, 1.25mg, 1.25mg is $603.92. Finally the price for a 6 month supply is $1,674.00 including 1.25mg, 1.25mg, 1.25mg, 2.5mg, 2.5mg, 2.5mg dosing.',
        [DosageChangeEquivalenceCodes.SEMAGLUTIDE_2_5]:
            'I recommend to change your dose to semaglutide 2.5 mg. The price for a 1 month supply is $449 and for a 3 month supply including 2.5mg, 2.5mg, 2.5mg is $1024.92.',
        [DosageChangeEquivalenceCodes.TIRZEPATIDE_2_5]:
            'I recommend to change your dose to tirzepatide 2.5mg as part of your treatment plan. The price for a 1 month supply vial is $449 and for a 3 month supply including 2.5mg, 5mg and 5mg the price is $702.92. Finally the price for a 6 month supply is $1314 including 2.5 mg dosing.',
        [DosageChangeEquivalenceCodes.TIRZEPATIDE_5]:
            'I recommend to change your dose to tirzepatide 5mg as part of your treatment plan. The price for a 1 month supply vial is $449 and for a 3 month supply including 5mg, 7.5mg and 7.5mg the price is $1186.92.',
        [DosageChangeEquivalenceCodes.TIRZEPATIDE_7_5]:
            'I recommend to change your dose to tirzepatide 7.5mg as part of your treatment plan. The price for a 1 month supply is $529 and for a 3 month supply including 7.5mg, 7.5mg, 7.5mg the price is $1399.',
        [DosageChangeEquivalenceCodes.TIRZEPATIDE_10]:
            'I recommend to change your dose to tirzepatide 10mg as part of your treatment plan. The price for a 1 month supply is $799 and for a 3 month supply including 10mg, 10mg and 10mg the price is $1599. Finally the price for a 6 month supply is $3174 including 10 mg dosing.',
        [DosageChangeEquivalenceCodes.TIRZEPATIDE_12_5]:
            'I  recommend to change your dose to tirzepatide 12.5mg as part of your treatment plan. The price for a 1 month supply is $799 and for a 3 month supply including 12.5mg, 12.5mg and 12.5mg the price is $1999.',
    };
