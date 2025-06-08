import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import { DosageChangeEquivalenceCodes } from '@/app/utils/classes/DosingChangeController/DosageChangeEquivalenceMap';

export const dosingSwapOptionsAndSigs: DosingChangeOption[] = [
    {
        index: -1,
        dosingEquivalence: DosageChangeEquivalenceCodes.SEMAGLUTIDE_0_25,
        dosing: '0.25 mg weekly Semaglutide',
        product_href: PRODUCT_HREF.SEMAGLUTIDE,
        product_description: {
            monthly: 'TBD',
            bundle: 'TBD',
        },
        sigs: {
            monthly: 'TBD',
            bundle: 'TBD',
        },
    },
    {
        index: 0,
        dosingEquivalence: DosageChangeEquivalenceCodes.SEMAGLUTIDE_0_5,
        dosing: '0.5 mg weekly Semaglutide',
        product_href: PRODUCT_HREF.SEMAGLUTIDE,
        product_description: {
            monthly: 'Semaglutide 2 mL, 2.5 mg/mL',
            bundle: 'Semaglutide 3 mL, 2.5 mg/mL',
        },
        sigs: {
            monthly:
                'Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for 4 weeks',
            bundle:
                'Month 1 Inject 10 units (0.5 mg of semaglutide) subcutaneously once per week for weeks 1-4' +
                'Month 2 Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for weeks 5-8' +
                'Month 3 Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for weeks 9-12',
        },
    },
    {
        index: 2,
        dosingEquivalence: DosageChangeEquivalenceCodes.SEMAGLUTIDE_1_25,
        dosing: '1.25 mg weekly Semaglutide',
        product_href: PRODUCT_HREF.SEMAGLUTIDE,
        product_description: {
            monthly: 'Semaglutide 1 mL, 5 mg/mL',
            bundle: 'Semaglutide 1 mL, 5 mg/mL (x3)',
        },
        sigs: {
            monthly:
                'Inject 50 units (1.25 mg of semaglutide) subcutaneously once per week for 4 weeks',
            bundle: 'Months 1-3 Inject 25 units (1.25 mg of semaglutide) subcutaneously once per week for weeks 1-12 or as directed by your provider',
        },
    },
    {
        index: 3,
        dosingEquivalence: DosageChangeEquivalenceCodes.SEMAGLUTIDE_2_5,
        dosing: '2.5 mg weekly Semaglutide',
        product_href: PRODUCT_HREF.SEMAGLUTIDE,
        product_description: {
            monthly: 'Semaglutide 2.5 mL, 5 mg/mL',
            bundle: 'Semaglutide 2.5 mL, 5 mg/mL (x3)',
        },
        sigs: {
            monthly:
                'Inject 50 units (2.5 mg of semaglutide)  subcutaneously once a week for four weeks',
            bundle: 'Months 1-3 Inject 50 units (2.5 mg of semaglutide) subcutaneously once per week for weeks 1-12 or as directed by your provider',
        },
    },
    {
        index: 4,
        dosing: '2.5 mg weekly Tirzepatide',
        dosingEquivalence: DosageChangeEquivalenceCodes.TIRZEPATIDE_2_5,
        product_href: PRODUCT_HREF.TIRZEPATIDE,
        product_description: {
            monthly: 'Tirzepatide 2.5 mL, 8 mg/mL',
            bundle: 'Tirzepatide 2.5 mL, 8 mg/mL (x3)',
        },

        sigs: {
            monthly:
                'Inject 31 units (2.5 mg of tirzepatide) subcutaneously once a week for four weeks',
            bundle:
                'Month 1 Inject 31 units (2.5 mg of tirzepatide) subcutaneously once per week for weeks 1-4 ' +
                'Months 2 Inject 31 units ( 2.5 mg of tirzepatide) subcutaneously once per week for weeks 5-12 or check-in with your provider for further instructions' +
                'Months 3 Inject 31 units ( 2.5 mg of tirzepatide) subcutaneously once per week for weeks 5-12 or check-in with your provider for further instructions',
        },
    },
    {
        index: 5,
        dosing: '5 mg weekly Tirzepatide',
        dosingEquivalence: DosageChangeEquivalenceCodes.TIRZEPATIDE_5,
        product_href: PRODUCT_HREF.TIRZEPATIDE,
        product_description: {
            monthly: 'Tirzepatide 2.5 mL, 8 mg/mL',
            bundle: 'Tirzepatide 6 mL, 5 mg/ 0.5mL',
        },

        sigs: {
            monthly:
                'Inject 62 units (5 mg of tirzepatide) subcutaneously once a week for four weeks',
            bundle:
                'Month 1 Inject 50 units (5 mg of tirzepatide) subcutaneously once per week for weeks 1-4 ' +
                'Month 2 Inject 50 units (5 mg of tirzepatide) subcutaneously once per week for weeks 5-8 ' +
                'Month 3 Inject 50 units (5 mg of tirzepatide) subcutaneously once per week for weeks 9-12',
        },
    },
    {
        index: 6,
        dosing: '7.5 mg weekly Tirzepatide',
        dosingEquivalence: DosageChangeEquivalenceCodes.TIRZEPATIDE_7_5,
        product_href: PRODUCT_HREF.TIRZEPATIDE,
        product_description: {
            monthly: 'Tirzepatide 4 mL, 17 mg/mL',
            bundle: 'Tirzepatide 7 mL, 5 mg/ 0.5mL',
        },
        sigs: {
            monthly:
                'Inject 44 units (7.5 mg of tirzepatide) subcutaneously once a week for four weeks',
            bundle:
                'Month 1 Inject 75 units (7.5 mg of tirzepatide) subcutaneously once per week for weeks 1-4 ' +
                'Month 2 Inject 75 units (7.5 mg of tirzepatide) subcutaneously once per week for weeks 5-8 ' +
                'Month 3 Inject 75 units (7.5 mg of tirzepatide) subcutaneously once per week for weeks 9-12',
        },
    },
    {
        index: 7,
        dosing: '10 mg weekly Tirzepatide',
        dosingEquivalence: DosageChangeEquivalenceCodes.TIRZEPATIDE_10,
        product_href: PRODUCT_HREF.TIRZEPATIDE,
        product_description: {
            monthly: 'Tirzepatide 4 mL, 5 mg/ 0.5mL',
            bundle: 'Tirzepatide 12 mL, 5 mg/ 0.5mL',
        },
        sigs: {
            monthly:
                'Inject 100 units (10 mg of Tirzepatide) subcutaneously once per week for 4 weeks',
            bundle:
                'Month 1 Inject 100 units (10 mg of tirzepatide) subcutaneously once per week for weeks 1-4 ' +
                'Month 2 Inject 100 units (10 mg of tirzepatide) subcutaneously once per week for weeks 5-8 ' +
                'Month 3 Inject 100 units (10 mg of tirzepatide) subcutaneously once per week for weeks 9-12',
        },
    },
    {
        index: 8,
        dosing: '12.5 mg weekly Tirzepatide',
        dosingEquivalence: DosageChangeEquivalenceCodes.TIRZEPATIDE_12_5,
        product_href: PRODUCT_HREF.TIRZEPATIDE,
        product_description: {
            monthly: 'Tirzepatide 2.5 mL, 8 mg/mL + Tirzepatide 2 mL, 17 mg/mL',
            bundle: 'Tirzepatide 15 mL, 5 mg/ 0.5mL',
        },
        sigs: {
            monthly:
                'Inject 156 units (12.5 mg of tirzepatide) subcutaneously once a week for one week (week 1)',
            bundle:
                'Month 1 Inject 125 units (12.5 mg of tirzepatide) subcutaneously once per week for weeks 1-4 ' +
                'Month 2 Inject 125 units (12.5 mg of tirzepatide) subcutaneously once per week for weeks 5-8 ' +
                'Month 3 Inject 125 units (12.5 mg of tirzepatide) subcutaneously once per week for weeks 9-12',
        },
    },
];

export interface DosingChangeOption {
    dosing: string;
    dosingEquivalence: DosageChangeEquivalenceCodes;
    index: number;
    product_href: PRODUCT_HREF;
    product_description: {
        monthly: string;
        bundle: string;
    };
    sigs: {
        monthly: string;
        bundle: string;
    };
}

export function getDosingOptionByDosing(
    dosing: string,
): DosingChangeOption | undefined {
    return dosingSwapOptionsAndSigs.find(
        (option) => option.dosingEquivalence === dosing,
    );
}
