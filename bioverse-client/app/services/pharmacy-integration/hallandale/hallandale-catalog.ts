import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';

export const HALANDALE_ITEM_CATALOG_CODES: HallandaleItemCatalogCodes = {
    'S-1': {
        product_code: 7926550,
        product_name: 'Semaglutide 1mL',
        product_strength: '2.5 mg/mL',
        product_form: 'Injectable',
        bioverseProductName: 'Semaglutide 1 mL, 2.5 mg/mL',
    },
    'S-2': {
        product_code: 7926554,
        product_form: 'Injectable',
        product_strength: '2.5 mg/mL',
        product_name: 'Semaglutide 2mL',
        bioverseProductName: 'Semaglutide 2 mL, 2.5 mg/mL',
    },
    'S-3': {
        product_code: 7926139,
        product_form: 'Injectable',
        product_strength: '2.5 mg/mL',
        product_name: 'Semaglutide 3mL',
        bioverseProductName: 'Semaglutide 3 mL, 2.5 mg/mL ',
    },
    'S-5': {
        product_code: 7924814,
        product_form: 'Injectable',
        product_strength: '2.5 mg/mL',
        product_name: 'Semaglutide 5mL',
        bioverseProductName: 'Semaglutide 5 mL, 2.5 mg/mL ',
    },
    'T-1': {
        product_code: 7877605,
        product_form: 'Injectable',
        product_strength: '5 mg/ 0.5mL',
        product_name: 'Tirzepatide 1mL',
        bioverseProductName: 'Tirzepatide 1 mL, 5 mg/ 0.5mL ',
    },
    'T-2': {
        product_code: 7952069,
        product_form: 'Injectable',
        product_strength: '5 mg/ 0.5mL',
        product_name: 'Tirzepatide 2mL',
        bioverseProductName: 'Tirzepatide 2 mL, 5 mg/ 0.5mL ',
    },
    'T-3': {
        product_code: 7952074,
        product_form: 'Injectable',
        product_strength: '5 mg/ 0.5mL',
        product_name: 'Tirzepatide 3mL',
        bioverseProductName: 'Tirzepatide 3 mL, 5 mg/ 0.5mL ',
    },
    'T-4': {
        product_code: 8250447,
        product_form: 'Injectable',
        product_strength: '5 mg/ 0.5mL',
        product_name: 'Tirzepatide 4mL',
        bioverseProductName: 'Tirzepatide 4 mL, 5 mg/ 0.5mL ',
    },
    'T-5': {
        product_code: 7952390,
        product_form: 'Injectable',
        product_strength: '5 mg/ 0.5mL',
        product_name: 'Tirzepatide 5mL',
        bioverseProductName: 'Tirzepatide 5 mL, 5 mg/ 0.5mL ',
    },
    'GLP-INJECTION-KIT': {
        product_code: 7963303,
        product_form: 'Supplies',
        product_strength:
            'Insulin Syringe 30G 5/16" 1 mL (#10), Alcohol Pads (#30)',
        product_name: 'GLP-1 Inj Kit',
        bioverseProductName:
            'GLP-1 Injection Kit, 30G X 5/16", 10 Syringes, 30 Alcohol Pads',
    },
    'X-CHEWS': {
        product_code: 8017133,
        product_form: 'RTD',
        product_strength: '100 IU/5 mg',
        product_name: 'Oxytocin / Tadalafil',
        bioverseProductName: 'X-Chews (Oxytocin/Tadalafil) 100 IU/5 mg',
    },
    'X-MELTS': {
        product_code: 8248373,
        product_form: 'Troche',
        product_strength: '100 IU/5 mg',
        product_name: 'Oxytocin / Sildenafil',
        bioverseProductName: 'X-Melts (Oxytocin/Sildenafil) 100 IU/5 mg',
    },
};

export const searchHallandaleItemCatalogByCode = (
    code: string,
): {
    product_code: number;
    product_name: string;
    product_strength: string;
    product_form: string;
    bioverseProductName: string;
} => {
    return HALANDALE_ITEM_CATALOG_CODES[code];
};

/**
 * This below - is deprecated. 12/11/24 - Nathan
 */
export const HALLANDALE_VARIANT_SCRIPT_DATA: HallandaleVariantSigData[] = [
    {
        //index 0
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
    {
        //index 1
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
    {
        //index 2
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

    {
        // index 3
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

    {
        // index 4
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

    {
        //index 5
        selectDisplayName:
            '[3-month] Semaglutide 7.5 mg (0.5 mg dosing) [$477.15]',
        array: [
            {
                catalogItemCode: 'S-3',
                sigText:
                    'Month 1 Inject 10 units (0.5 mg of semaglutide) subcutaneously once per week for weeks 1-4' +
                    'Month 2 Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for weeks 5-8' +
                    'Month 3 Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for weeks 9-12',
                internalSigText:
                    'Month 1 Inject 10 units (0.5 mg of semaglutide) subcutaneously once per week for weeks 1-4' +
                    'Month 2 Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for weeks 5-8' +
                    'Month 3 Inject 20 units (0.5 mg of semaglutide) subcutaneously once per week for weeks 9-12',
                internalDisplaySigText: [
                    'Month 1 Inject 10 units (0.5 mg of semaglutide) subcutaneously once per week for weeks 1-4',
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
                quantity: 2,
                daysSupply: 90,
            },
        ],
    },

    {
        //index 6
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
    {
        //index 7
        selectDisplayName: '[Bundle] Tirzepatide 60 mg (Maintenance) [$777]',
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

    {
        //index 8
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

    {
        //index 9
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

    {
        // index 10
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

    {
        //index 11
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
    {
        //index 12
        selectDisplayName: '[Bundle] Tirzepatide 60 mg [$777]',
        array: [
            {
                catalogItemCode: 'T-3',
                sigText:
                    'Month 1 Inject 25 units (2.5 mg of tirzepatide) subcutaneously once per week for weeks 1-4 ' +
                    'Month 2 Inject 50 units (5 mg of tirzepatide) subcutaneously once per week for weeks 5-8 ' +
                    'Month 3 Inject 75 units (7.5 mg of tirzepatide) subcutaneously once per week for weeks 9-12',
                internalSigText:
                    'Month 1 Inject 25 units (2.5 mg of tirzepatide) subcutaneously once per week for weeks 1-4 ' +
                    'Month 2 Inject 50 units (5 mg of tirzepatide) subcutaneously once per week for weeks 5-8 ' +
                    'Month 3 Inject 75 units (7.5 mg of tirzepatide) subcutaneously once per week for weeks 9-12',
                internalDisplaySigText: [
                    'Month 1 Inject 25 units (2.5 mg of tirzepatide) subcutaneously once per week for weeks 1-4',
                    'Month 2 Inject 50 units (5 mg of tirzepatide) subcutaneously once per week for weeks 5-8',
                    'Month 3 Inject 75 units (7.5 mg of tirzepatide) subcutaneously once per week for weeks 9-12',
                ],
                quantity: 2,
                daysSupply: 90,
            },
            {
                catalogItemCode: 'GLP-INJECTION-KIT',
                sigText:
                    'Month 1 Inject 25 units (2.5 mg of tirzepatide) subcutaneously once per week for weeks 1-4 ' +
                    'Month 2 Inject 50 units (5 mg of tirzepatide) subcutaneously once per week for weeks 5-8 ' +
                    'Month 3 Inject 75 units (7.5 mg of tirzepatide) subcutaneously once per week for weeks 9-12',
                internalSigText:
                    'Month 1 Inject 25 units (2.5 mg of tirzepatide) subcutaneously once per week for weeks 1-4 ' +
                    'Month 2 Inject 50 units (5 mg of tirzepatide) subcutaneously once per week for weeks 5-8 ' +
                    'Month 3 Inject 75 units (7.5 mg of tirzepatide) subcutaneously once per week for weeks 9-12',
                internalDisplaySigText: [
                    'Month 1 Inject 25 units (2.5 mg of tirzepatide) subcutaneously once per week for weeks 1-4',
                    'Month 2 Inject 50 units (5 mg of tirzepatide) subcutaneously once per week for weeks 5-8',
                    'Month 3 Inject 75 units (7.5 mg of tirzepatide) subcutaneously once per week for weeks 9-12',
                ],
                quantity: 2,
                daysSupply: 90,
            },
        ],
    },

    {
        //index 13
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

    {
        //index 14
        selectDisplayName:
            '[Monthly] X-Chews (Tadalafil/Oxytocin) Daily 30 ct.',
        array: [
            {
                catalogItemCode: 'X-CHEWS',
                sigText: 'TOBEADDED',
                internalSigText: 'TOBEADDED',
                quantity: 30,
                daysSupply: 30,
            },
        ],
    },

    {
        //index 15
        selectDisplayName:
            '[Quarterly] X-Chews (Tadalafil/Oxytocin) Daily 30 ct.',
        array: [
            {
                catalogItemCode: 'X-CHEWS',
                sigText: 'TOBEADDED',
                internalSigText: 'TOBEADDED',
                quantity: 90,
                daysSupply: 90,
            },
        ],
    },

    {
        //index 16
        selectDisplayName:
            '[Biannually] X-Chews (Tadalafil/Oxytocin) Daily 30 ct.',
        array: [
            {
                catalogItemCode: 'X-CHEWS',
                sigText: 'TOBEADDED',
                internalSigText: 'TOBEADDED',
                quantity: 180,
                daysSupply: 180,
            },
        ],
    },

    {
        //index 17
        selectDisplayName:
            '[Quarterly] X-Chews (Tadalafil/Oxytocin) Daily 6 ct.',
        array: [],
    },

    {
        //index 18
        selectDisplayName:
            '[Biannually] X-Chews (Tadalafil/Oxytocin) Daily 6 ct.',
        array: [],
    },

    {
        //index 19
        selectDisplayName: '[Monthly] X-Chews (Tadalafil/Oxytocin) Daily 8 ct.',
        array: [],
    },

    {
        //index 20
        selectDisplayName:
            '[Quarterly] X-Chews (Tadalafil/Oxytocin) Daily 8 ct.',
        array: [],
    },

    {
        //index 21
        selectDisplayName:
            '[Biannually] X-Chews (Tadalafil/Oxytocin) Daily 8 ct.',
        array: [],
    },

    {
        //index 22
        selectDisplayName:
            '[Monthly] X-Chews (Tadalafil/Oxytocin) Daily 10 ct.',
        array: [],
    },

    {
        //index 23
        selectDisplayName:
            '[Quarterly] X-Chews (Tadalafil/Oxytocin) Daily 10 ct.',
        array: [],
    },

    {
        //index 24
        selectDisplayName:
            '[Biannually] X-Chews (Tadalafil/Oxytocin) Daily 10 ct.',
        array: [],
    },

    {
        //index 25
        selectDisplayName:
            '[Monthly] X-Chews (Tadalafil/Oxytocin) Daily 12 ct.',
        array: [],
    },

    {
        //index 26
        selectDisplayName:
            '[Quarterly] X-Chews (Tadalafil/Oxytocin) Daily 12 ct.',
        array: [],
    },

    {
        //index 27
        selectDisplayName:
            '[Biannually] X-Chews (Tadalafil/Oxytocin) Daily 12 ct.',
        array: [],
    },

    {
        //index 28
        selectDisplayName:
            '[Monthly] X-Chews (Tadalafil/Oxytocin) Daily 14 ct.',
        array: [],
    },

    {
        //index 29
        selectDisplayName:
            '[Quarterly] X-Chews (Tadalafil/Oxytocin) Daily 14 ct.',
        array: [],
    },

    {
        //index 30
        selectDisplayName:
            '[Biannually] X-Chews (Tadalafil/Oxytocin) Daily 14 ct.',
        array: [],
    },

    {
        //index 31
        selectDisplayName:
            '[Monthly] X-Chews (Tadalafil/Oxytocin) Daily 16 ct.',
        array: [],
    },

    {
        //index 32
        selectDisplayName:
            '[Quarterly] X-Chews (Tadalafil/Oxytocin) Daily 16 ct.',
        array: [],
    },

    {
        //index 33
        selectDisplayName:
            '[Biannually] X-Chews (Tadalafil/Oxytocin) Daily 16 ct.',
        array: [],
    },
];

export const searchHallandaleVariantScriptDataByDisplayName = (
    displayName: string,
): HallandaleVariantSigData | undefined => {
    return HALLANDALE_VARIANT_SCRIPT_DATA.find(
        (variant) => variant.selectDisplayName === displayName,
    );
};

// interface VariantIndexProductCatalogMapHallandale {
//     [key: string]: {
//         [key: number]: any;
//     };
// }

// const VARIANT_INDEX_PRODUCT_TO_CATALOG_MAPPING: VariantIndexProductCatalogMapHallandale =
//     {
//         semaglutide: {
//             11: HALLANDALE_VARIANT_SCRIPT_DATA[5], // quarterlty 7.5
//             12: HALLANDALE_VARIANT_SCRIPT_DATA[4], // quarterly 10
//             13: HALLANDALE_VARIANT_SCRIPT_DATA[0], // monthly 0.5 dose injections (2.5)
//             14: HALLANDALE_VARIANT_SCRIPT_DATA[1], // monthly 1.25 dose injections
//         },
//         tirzepatide: {
//             14: HALLANDALE_VARIANT_SCRIPT_DATA[2], // monthly 2.5 mg
//             15: HALLANDALE_VARIANT_SCRIPT_DATA[2], // monthly 10 mg
//             16: HALLANDALE_VARIANT_SCRIPT_DATA[6], // quarterly 50 mg
//             17: HALLANDALE_VARIANT_SCRIPT_DATA[12], // quarterly 60 mg
//             18: HALLANDALE_VARIANT_SCRIPT_DATA[7], // quarterly 60 mg maintenance
//             19: HALLANDALE_VARIANT_SCRIPT_DATA[8], // quarterly 70 mg dose
//             20: HALLANDALE_VARIANT_SCRIPT_DATA[9], // quarterly 90 mg dose
//             21: HALLANDALE_VARIANT_SCRIPT_DATA[10], // quarterly 120 mg dose
//             22: HALLANDALE_VARIANT_SCRIPT_DATA[11], // quarterly 150 mg dose
//             23: HALLANDALE_VARIANT_SCRIPT_DATA[13], // monthly 12.5 mg
//         },
//         'x-chews': {
//             0: HALLANDALE_VARIANT_SCRIPT_DATA[14],
//             1: HALLANDALE_VARIANT_SCRIPT_DATA[15],
//             2: HALLANDALE_VARIANT_SCRIPT_DATA[16],
//             3: HALLANDALE_VARIANT_SCRIPT_DATA[17],
//             4: HALLANDALE_VARIANT_SCRIPT_DATA[18],
//             5: HALLANDALE_VARIANT_SCRIPT_DATA[19],
//             6: HALLANDALE_VARIANT_SCRIPT_DATA[20],
//             7: HALLANDALE_VARIANT_SCRIPT_DATA[21],
//             8: HALLANDALE_VARIANT_SCRIPT_DATA[22],
//             9: HALLANDALE_VARIANT_SCRIPT_DATA[23],
//             10: HALLANDALE_VARIANT_SCRIPT_DATA[24],
//             11: HALLANDALE_VARIANT_SCRIPT_DATA[25],
//             12: HALLANDALE_VARIANT_SCRIPT_DATA[26],
//             13: HALLANDALE_VARIANT_SCRIPT_DATA[27],
//             14: HALLANDALE_VARIANT_SCRIPT_DATA[28],
//             15: HALLANDALE_VARIANT_SCRIPT_DATA[29],
//             16: HALLANDALE_VARIANT_SCRIPT_DATA[30],
//             17: HALLANDALE_VARIANT_SCRIPT_DATA[31],
//             18: HALLANDALE_VARIANT_SCRIPT_DATA[32],
//             19: HALLANDALE_VARIANT_SCRIPT_DATA[33],
//         },
//         'x-melts': {
//             1: {},
//             2: {},
//             3: {},
//             4: {},
//             5: {},
//             6: {},
//             7: {},
//             8: {},
//             9: {},
//             10: {},
//             11: {},
//             12: {},
//             13: {},
//             14: {},
//             15: {},
//             16: {},
//             17: {},
//             18: {},
//             19: {},
//             20: {},
//             21: {},
//             22: {},
//             23: {},
//         },
//     };

// export const searchHallandaleVariantScriptDataByProductAndVariantIndex = (
//     product_href: string,
//     variant_index: number
// ): HallandaleVariantSigData | undefined => {
//     const HALLANDALE_MAPPED_PRODUCTS = [
//         PRODUCT_HREF.SEMAGLUTIDE,
//         PRODUCT_HREF.TIRZEPATIDE,
//         PRODUCT_HREF.X_CHEWS,
//         PRODUCT_HREF.X_MELTS,
//     ];

//     if (!HALLANDALE_MAPPED_PRODUCTS.includes(product_href as PRODUCT_HREF)) {
//         return undefined;
//     }

//     const productMapping =
//         VARIANT_INDEX_PRODUCT_TO_CATALOG_MAPPING[product_href];
//     if (productMapping) {
//         return productMapping[variant_index as keyof typeof productMapping];
//     }
//     return undefined;
// };
