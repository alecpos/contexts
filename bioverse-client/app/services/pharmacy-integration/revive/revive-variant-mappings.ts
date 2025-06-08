import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';

interface ReviveItemIdentifierMap {
    [key: string]: string;
}

const REVIVE_ITEM_IDENTIFIER_MAP: ReviveItemIdentifierMap = {

    //deprecated below:
    S_2_5MG_1ML: '5e25c9fc-ecea-483e-a5db-66282244e503', // Semaglutide 2.5 mg/ml Sterile Solution for Injection - 1 mL
    S_2_5MG_2ML: 'a60737d7-76a2-49fd-a9cd-e80546d1bc64', // Semaglutide 2.5 mg/ml Sterile Solution for Injection - 2 mL
    S_2_5MG_3ML: 'eb49dfc3-acfb-4a6f-ad96-f5935d2847f0', 
    S_2_5_MG_4ML: '2761c6ac-3bb3-4add-95ab-a3c997f4b1de',
    S_5MG_2ML: '605f6bdf-80cf-490f-a3c0-23178c6b133d',   // Semaglutide 5 mg/ml Sterile Solution for Injection - 2 mL
    S_5MG_4ML: '5021113b-2b97-4437-9274-d0d984637fc5',   // Semaglutide 5 mg/ml Sterile Solution for Injection - 4 mL
    S_31G_SYRINGE: '4142f6c4-fa70-4d74-b787-c3152f397260',
    S_1MG_B6_7ML: '93534247-a7cc-40ba-ae56-7a81a9a966c7',
    //deprecated above^^

    //use these ones from now on:
    
    //Semaglutide
    S_2_5MG_B6_1ML: '563f8dfe-5a0f-4087-9c7c-8e83fa1ef811', // Semaglutide 2.5 mg/ml / Pyridoxine HCl 2 mg/ml Sterile Solution for Injection - 1 ml
    S_2_5MG_B6_2ML: '932e883d-74e8-4037-a739-a8ab85db243b', // Semaglutide 2.5 mg/ml / Pyridoxine HCl 2 mg/ml Sterile Solution for Injection - 2 ml
    S_2_5MG_B6_3ML: 'c03df36b-1a4b-40ca-b423-660244a004bd',
    S_2_5MG_B6_4ML: '11abb4a2-f855-404f-b502-19e4e4eb5da9',
    S_5MG_B6_2ML: '11eaf925-22ab-4034-b39d-3e8f51d0f8a5',   // 'Semaglutide 5 mg/ml / Pyridoxine HCl 2 mg/ml Sterile Solution for Injection - 2 ml

    //Tirzepatide
    T_10MG_B6_2ML: '56166ef6-10b1-4039-8dbc-16dcd7fc5e99',
    T_10MG_B6_3ML: 'bc178994-47c1-403a-aa30-3e33a0d9f840',
    T_5MG_B6_1ML: '9169322e-ef2a-40db-bbdb-c2c3052c8cf1',
    T_5MG_B6_2ML: '36c4605b-069d-40e4-8d1e-c76881dde9d4',
};


export const REVIVE_UNITS_PER_MG_MAP = {
    [PRODUCT_HREF.SEMAGLUTIDE as PRODUCT_HREF]: {
        '563f8dfe-5a0f-4087-9c7c-8e83fa1ef811': 40,
        '932e883d-74e8-4037-a739-a8ab85db243b': 40,
        '11eaf925-22ab-4034-b39d-3e8f51d0f8a5': 20
    },
    [PRODUCT_HREF.TIRZEPATIDE as PRODUCT_HREF]: {
        '56166ef6-10b1-4039-8dbc-16dcd7fc5e99': 5,
        'bc178994-47c1-403a-aa30-3e33a0d9f840': 5,
        '9169322e-ef2a-40db-bbdb-c2c3052c8cf1': 10,
        '36c4605b-069d-40e4-8d1e-c76881dde9d4': 10,
    },
}





interface ReviveAllowedMap {
    [key: string]: number[];
}

export const REVIVE_ALLOWED_PRODUCT_MAP: ReviveAllowedMap = {
    [PRODUCT_HREF.SEMAGLUTIDE]: [
        32, 33, 34, 35, 36, 55, 56, 57, 58, 59, 64, 65, 66, 67, 68, 69, 70, 71,
        72, 73, 74, 75
    ],
    [PRODUCT_HREF.TIRZEPATIDE]: [47, 48, 49, 50, 51, 57, 58, 59, 60],
    [PRODUCT_HREF.B12_INJECTION]: [0, 1, 2],
};

interface ReviveVariantMapping {
    [key: string]: {
        [key: number]: ReviveMedicationObject[];
    };
}

/**
 *
 * REMEMBER: THE 'QUANTITY' IS THE NUMBER OF MILLILITERS, not the number of vials to send.
 * So if you are sending three 10mg vials of 2ml each, you put one object in there with quantity 6.
 *
 **/
export const REVIVE_PRODUCT_VARIANT_MAP: ReviveVariantMapping = {
    [PRODUCT_HREF.SEMAGLUTIDE]: {
        32: [
            {
                control_level: 0,
                days_supply: 28,
                dose: '2.5 mg/ml',
                medication:
                    'Semaglutide 2.5 mg/ml Sterile Solution for Injection - 1 mL',
                medication_description:
                    'Semaglutide 2.5 mg/ml Sterile Solution for Injection - 1 mL',
                medication_order_entry_identifier: '',
                product_identification: {
                    product_identifier:
                        REVIVE_ITEM_IDENTIFIER_MAP['S_2_5MG_1ML'],
                },
                reason_for_compounding: {
                    code: '6',
                    description: 'Concentration Adjustment Necessary',
                    context: 'Strength/dose customization',
                },
                quantity: 1,
                quantity_authorized: 1,
                substitutions: 0,
                sig: 'Inject 0.20 ml (20 units) (0.5 mg) subcutaneously every week.',
                unit_of_measure: 'C28254',
                date_issued: '',
                note: '',
                refills_authorized: '0',
            },
        ],

        33: [
            {
                control_level: 0,
                days_supply: 84,
                dose: '5 mg/ml',
                medication:
                    'Semaglutide 5 mg/ml Sterile Solution for Injection - 2 mL',
                medication_description:
                    'Semaglutide 5 mg/ml Sterile Solution for Injection - 2 mL',
                medication_order_entry_identifier: '',
                product_identification: {
                    product_identifier: REVIVE_ITEM_IDENTIFIER_MAP['S_5MG_2ML'],
                },
                reason_for_compounding: {
                    code: '6',
                    description: 'Concentration Adjustment Necessary',
                    context: 'Strength/dose customization',
                },
                quantity: 2,
                quantity_authorized: 2,
                substitutions: 0,
                sig:
                    'Month 1: Inject 0.05 ml (5 units) (0.25 mg) subcutaneously every week. ' +
                    'Month 2: Inject 0.10 ml (10 units) (0.5 mg) subcutaneously every week. ' +
                    'Month 3: Inject inject 0.25 ml (25 units) (1.25 mg) subcutaneously every week.',
                unit_of_measure: 'C28254',
                date_issued: '',
                note: '',
                refills_authorized: '0',
            },
        ],

        34: [
            {
                control_level: 0,
                days_supply: 84,
                dose: '2.5 mg/ml',
                medication:
                    'Semaglutide 2.5 mg/ml Sterile Solution for Injection - 2 mL',
                medication_description:
                    'Semaglutide 2.5 mg/ml Sterile Solution for Injection - 2 mL',
                medication_order_entry_identifier: '',
                product_identification: {
                    product_identifier:
                        REVIVE_ITEM_IDENTIFIER_MAP['S_2_5MG_2ML'],
                },
                reason_for_compounding: {
                    code: '6',
                    description: 'Concentration Adjustment Necessary',
                    context: 'Strength/dose customization',
                },
                quantity: 2,
                quantity_authorized: 2,
                substitutions: 0,
                sig: 'Month 1: Inject 0.5 ml (50 units) (1.25 mg) subcutaneously every week.',
                unit_of_measure: 'C28254',
                date_issued: '',
                note: '',
                refills_authorized: '0',
            },
            {
                control_level: 0,
                days_supply: 84,
                dose: '5 mg/ml',
                medication:
                    'Semaglutide 5 mg/ml Sterile Solution for Injection - 2 mL',
                medication_description:
                    'Semaglutide 5 mg/ml Sterile Solution for Injection - 2 mL',
                medication_order_entry_identifier: '',
                product_identification: {
                    product_identifier: REVIVE_ITEM_IDENTIFIER_MAP['S_5MG_2ML'],
                },
                reason_for_compounding: {
                    code: '6',
                    description: 'Concentration Adjustment Necessary',
                    context: 'Strength/dose customization',
                },
                quantity: 2,
                quantity_authorized: 2,
                substitutions: 0,
                sig: 'Month 2-3: Inject 0.25 ml (25 units) (1.25 mg) subcutaneously every week.',
                unit_of_measure: 'C28254',
                date_issued: '',
                note: '',
                refills_authorized: '0',
            },
        ],

        35: [
            {
                control_level: 0,
                days_supply: 84,
                dose: '5 mg/ml',
                medication:
                    'Semaglutide 5 mg/ml Sterile Solution for Injection - 4 mL',
                medication_description:
                    'Semaglutide 5 mg/ml Sterile Solution for Injection - 4 mL',
                medication_order_entry_identifier: '',
                product_identification: {
                    product_identifier: REVIVE_ITEM_IDENTIFIER_MAP['S_5MG_4ML'],
                },
                reason_for_compounding: {
                    code: '6',
                    description: 'Concentration Adjustment Necessary',
                    context: 'Strength/dose customization',
                },
                quantity: 4,
                quantity_authorized: 4,
                substitutions: 0,
                sig:
                    'Month 1-2: Inject 0.25 ml (25 units) (1.25 mg) subcutaneously every week. ' +
                    'Month 3: Inject 0.5 ml (50 units) (2.5 mg) subcutaneously every week.',
                unit_of_measure: 'C28254',
                date_issued: '',
                note: '',
                refills_authorized: '0',
            },
        ],

        36: [
            {
                control_level: 0,
                days_supply: 84,
                dose: '5 mg/ml',
                medication:
                    'Semaglutide 5 mg/ml Sterile Solution for Injection - 4 mL',
                medication_description:
                    'Semaglutide 5 mg/ml Sterile Solution for Injection - 4 mL',
                medication_order_entry_identifier: '',
                product_identification: {
                    product_identifier: REVIVE_ITEM_IDENTIFIER_MAP['S_5MG_4ML'],
                },
                reason_for_compounding: {
                    code: '6',
                    description: 'Concentration Adjustment Necessary',
                    context: 'Strength/dose customization',
                },
                quantity: 4,
                quantity_authorized: 4,
                substitutions: 0,
                sig:
                    'Month 1: Inject 0.1 ml (10 units) (0.5 mg) subcutaneously every week. ' +
                    'Month 2: Inject 0.25 ml (25 units) (1.25 mg) subcutaneously every week. ' +
                    'Month 3: Inject 0.5 ml (50 units) (2.5 mg) subcutaneously every week.',
                unit_of_measure: 'C28254',
                date_issued: '',
                note: '',
                refills_authorized: '0',
            },
        ],

        55: [
            {
                control_level: 0,
                days_supply: 28,
                dose: '2.5 mg/ml Semaglutide / Pyridoxine HCl 2 mg/ml',
                medication:
                    'Semaglutide 2.5 mg/ml / Pyridoxine HCl 2 mg/ml Sterile Solution for Injection - 1 ml',
                medication_description:
                    'Semaglutide 2.5 mg/ml / Pyridoxine HCl 2 mg/ml Sterile Solution for Injection - 1 ml',
                medication_order_entry_identifier: '',
                product_identification: {
                    product_identifier:
                        REVIVE_ITEM_IDENTIFIER_MAP['S_2_5MG_B6_1ML'],
                },
                reason_for_compounding: {
                    code: '6',
                    description: 'Concentration Adjustment Necessary',
                    context: 'Strength/dose customization',
                },
                quantity: 1,
                quantity_authorized: 1,
                substitutions: 0,
                sig: 'Inject 0.20 ml (20 units) (0.5 mg) subcutaneously every week.',
                unit_of_measure: 'C28254',
                date_issued: '',
                note: '',
                refills_authorized: '0',
            },
        ],

        56: [
            {
                control_level: 0,
                days_supply: 84,
                dose: '5 mg/ml Semaglutide / Pyridoxine HCl 2 mg/ml',
                medication:
                    'Semaglutide 5 mg/ml / Pyridoxine HCl 2 mg/ml Sterile Solution for Injection - 2 ml',
                medication_description:
                    'Semaglutide 5 mg/ml / Pyridoxine HCl 2 mg/ml Sterile Solution for Injection - 2 ml',
                medication_order_entry_identifier: '',
                product_identification: {
                    product_identifier:
                        REVIVE_ITEM_IDENTIFIER_MAP['S_5MG_B6_2ML'],
                },
                reason_for_compounding: {
                    code: '6',
                    description: 'Concentration Adjustment Necessary',
                    context: 'Strength/dose customization',
                },
                quantity: 2,
                quantity_authorized: 2,
                substitutions: 0,
                sig:
                    'Month 1: Inject 0.05 ml (5 units) (0.25 mg) subcutaneously every week. ' +
                    'Month 2: Inject 0.10 ml (10 units) (0.5 mg) subcutaneously every week. ' +
                    'Month 3: Inject inject 0.25 ml (25 units) (1.25 mg) subcutaneously every week.',
                unit_of_measure: 'C28254',
                date_issued: '',
                note: '',
                refills_authorized: '0',
            },
        ],

        57: [
            {
                control_level: 0,
                days_supply: 84,
                dose: '2.5 mg/ml Semaglutide / Pyridoxine HCl 2 mg/ml',
                medication:
                    'Semaglutide 2.5 mg/ml / Pyridoxine HCl 2 mg/ml Sterile Solution for Injection - 2 ml',
                medication_description:
                    'Semaglutide 2.5 mg/ml / Pyridoxine HCl 2 mg/ml Sterile Solution for Injection - 2 ml',
                medication_order_entry_identifier: '',
                product_identification: {
                    product_identifier:
                        REVIVE_ITEM_IDENTIFIER_MAP['S_2_5MG_B6_2ML'],
                },
                reason_for_compounding: {
                    code: '6',
                    description: 'Concentration Adjustment Necessary',
                    context: 'Strength/dose customization',
                },
                quantity: 2,
                quantity_authorized: 2,
                substitutions: 0,
                sig: 'Month 1: Inject 0.5 ml (50 units) (1.25 mg) subcutaneously every week.',
                unit_of_measure: 'C28254',
                date_issued: '',
                note: '',
                refills_authorized: '0',
            },
            {
                control_level: 0,
                days_supply: 84,
                dose: '5 mg/ml Semaglutide / Pyridoxine HCl 2 mg/ml',
                medication:
                    'Semaglutide 5 mg/ml Sterile Solution for Injection - 2 mL',
                medication_description:
                    'Semaglutide 5 mg/ml Sterile Solution for Injection - 2 mL',
                medication_order_entry_identifier: '',
                product_identification: {
                    product_identifier:
                        REVIVE_ITEM_IDENTIFIER_MAP['S_5MG_B6_2ML'],
                },
                reason_for_compounding: {
                    code: '6',
                    description: 'Concentration Adjustment Necessary',
                    context: 'Strength/dose customization',
                },
                quantity: 2,
                quantity_authorized: 2,
                substitutions: 0,
                sig: 'Month 2-3: Inject 0.25 ml (25 units) (1.25 mg) subcutaneously every week.',
                unit_of_measure: 'C28254',
                date_issued: '',
                note: '',
                refills_authorized: '0',
            },
        ],

        58: [
            {
                control_level: 0,
                days_supply: 84,
                dose: '5 mg/ml Semaglutide / Pyridoxine HCl 2 mg/ml',
                medication:
                    'Semaglutide 5 mg/ml / Pyridoxine HCl 2 mg/ml Sterile Solution for Injection - 2 ml',
                medication_description:
                    'Semaglutide 5 mg/ml / Pyridoxine HCl 2 mg/ml Sterile Solution for Injection - 2 ml',
                medication_order_entry_identifier: '',
                product_identification: {
                    product_identifier:
                        REVIVE_ITEM_IDENTIFIER_MAP['S_5MG_B6_2ML'],
                },
                reason_for_compounding: {
                    code: '6',
                    description: 'Concentration Adjustment Necessary',
                    context: 'Strength/dose customization',
                },
                quantity: 4,
                quantity_authorized: 4,
                substitutions: 0,
                sig:
                    'Month 1-2: Inject 0.25 ml (25 units) (1.25 mg) subcutaneously every week. ' +
                    'Month 3: Inject 0.5 ml (50 units) (2.5 mg) subcutaneously every week.',
                unit_of_measure: 'C28254',
                date_issued: '',
                note: '',
                refills_authorized: '0',
            },
        ],

        59: [
            {
                control_level: 0,
                days_supply: 84,
                dose: '5 mg/ml Semaglutide / Pyridoxine HCl 2 mg/ml',
                medication:
                    'Semaglutide 5 mg/ml / Pyridoxine HCl 2 mg/ml Sterile Solution for Injection - 2 ml',
                medication_description:
                    'Semaglutide 5 mg/ml / Pyridoxine HCl 2 mg/ml Sterile Solution for Injection - 2 ml',
                medication_order_entry_identifier: '',
                product_identification: {
                    product_identifier:
                        REVIVE_ITEM_IDENTIFIER_MAP['S_5MG_B6_2ML'],
                },
                reason_for_compounding: {
                    code: '6',
                    description: 'Concentration Adjustment Necessary',
                    context: 'Strength/dose customization',
                },
                quantity: 4,
                quantity_authorized: 4,
                substitutions: 0,
                sig:
                    'Month 1: Inject 0.1 ml (10 units) (0.5 mg) subcutaneously every week. ' +
                    'Month 2: Inject 0.25 ml (25 units) (1.25 mg) subcutaneously every week. ' +
                    'Month 3: Inject 0.5 ml (50 units) (2.5 mg) subcutaneously every week.',
                unit_of_measure: 'C28254',
                date_issued: '',
                note: '',
                refills_authorized: '0',
            },
        ],

        64: [
            //6-month variant  (0.25mg x 6) - shipment 1 of 2 (one vial - 5mg)
            {
                control_level: 0,
                days_supply: 84,
                dose: '2.5 mg/ml Semaglutide / Pyridoxine HCl 2 mg/ml',
                medication:
                    'Semaglutide 2.5 mg/ml / Pyridoxine HCl 2 mg/ml Sterile Solution for Injection - 2 ml',
                medication_description:
                    'Semaglutide 2.5 mg/ml / Pyridoxine HCl 2 mg/ml Sterile Solution for Injection - 2 ml',
                medication_order_entry_identifier: '',
                product_identification: {
                    product_identifier:
                        REVIVE_ITEM_IDENTIFIER_MAP['S_2_5MG_B6_2ML'],
                },
                reason_for_compounding: {
                    code: '6',
                    description: 'Concentration Adjustment Necessary',
                    context: 'Strength/dose customization',
                },
                quantity: 2,
                quantity_authorized: 2,
                substitutions: 0,
                sig: 'Month 1-3: Inject 10 units (0.25mg) subcutaneously once every week for four weeks (Discard the vial after 90 days)',
                unit_of_measure: 'C28254',
                date_issued: '',
                note: '',
                refills_authorized: '0',
            },
        ],
        65: [
            //6-month variant (0.25mg x 6) - shipment 2 of 2 (one vial - 5mg)
            {
                control_level: 0,
                days_supply: 84,
                dose: '2.5 mg/ml Semaglutide / Pyridoxine HCl 2 mg/ml',
                medication:
                    'Semaglutide 2.5 mg/ml / Pyridoxine HCl 2 mg/ml Sterile Solution for Injection - 2 ml',
                medication_description:
                    'Semaglutide 2.5 mg/ml / Pyridoxine HCl 2 mg/ml Sterile Solution for Injection - 2 ml',
                medication_order_entry_identifier: '',
                product_identification: {
                    product_identifier:
                        REVIVE_ITEM_IDENTIFIER_MAP['S_2_5MG_B6_2ML'],
                },
                reason_for_compounding: {
                    code: '6',
                    description: 'Concentration Adjustment Necessary',
                    context: 'Strength/dose customization',
                },
                quantity: 2,
                quantity_authorized: 2,
                substitutions: 0,
                sig: '"Month 3-6: Inject 10 units (0.25mg) subcutaneously once every week for four weeks (Discard the vial after 90 days)',
                unit_of_measure: 'C28254',
                date_issued: '',
                note: '',
                refills_authorized: '0',
            },
        ],

        66: [
            //6-month variant  (0.5mg x 6) - shipment 1 of 2 (one vial - 10mg)
            {
                control_level: 0,
                days_supply: 84,
                dose: '5 mg/ml Semaglutide / Pyridoxine HCl 2 mg/ml',
                medication:
                    'Semaglutide 5 mg/ml Sterile Solution for Injection - 2 mL',
                medication_description:
                    'Semaglutide 5 mg/ml Sterile Solution for Injection - 2 mL',
                medication_order_entry_identifier: '',
                product_identification: {
                    product_identifier:
                        REVIVE_ITEM_IDENTIFIER_MAP['S_5MG_B6_2ML'],
                },
                reason_for_compounding: {
                    code: '6',
                    description: 'Concentration Adjustment Necessary',
                    context: 'Strength/dose customization',
                },
                quantity: 2,
                quantity_authorized: 2,
                substitutions: 0,
                sig: 'Month 1–3: Inject 10 units (0.5mg) subcutaneously once every week for four weeks (Discard the vial after 90 days)',
                unit_of_measure: 'C28254',
                date_issued: '',
                note: '',
                refills_authorized: '0',
            },
        ],
        67: [
            //6-month variant (0.5mg x 6) - shipment 2 of 2 (one vial - 10mg)
            {
                control_level: 0,
                days_supply: 84,
                dose: '5 mg/ml Semaglutide / Pyridoxine HCl 2 mg/ml',
                medication:
                    'Semaglutide 5 mg/ml Sterile Solution for Injection - 2 mL',
                medication_description:
                    'Semaglutide 5 mg/ml Sterile Solution for Injection - 2 mL',
                medication_order_entry_identifier: '',
                product_identification: {
                    product_identifier:
                        REVIVE_ITEM_IDENTIFIER_MAP['S_5MG_B6_2ML'],
                },
                reason_for_compounding: {
                    code: '6',
                    description: 'Concentration Adjustment Necessary',
                    context: 'Strength/dose customization',
                },
                quantity: 2,
                quantity_authorized: 2,
                substitutions: 0,
                sig: 'Month 3-6: Inject 10 units (0.5mg) subcutaneously once every week for four weeks (Discard the vial after 90 days)',
                unit_of_measure: 'C28254',
                date_issued: '',
                note: '',
                refills_authorized: '0',
            },
        ],

        68: [
            //6-month variant (0.25mg, 0.5mg, 0.5mg, 1mg, 1mg, 1mg) - shipment 1 of 2 (one vial - 5mg)
            {
                control_level: 0,
                days_supply: 84,
                dose: '2.5 mg/ml Semaglutide / Pyridoxine HCl 2 mg/ml',
                medication:
                    'Semaglutide 2.5 mg/ml / Pyridoxine HCl 2 mg/ml Sterile Solution for Injection - 2 ml',
                medication_description:
                    'Semaglutide 2.5 mg/ml / Pyridoxine HCl 2 mg/ml Sterile Solution for Injection - 2 ml',
                medication_order_entry_identifier: '',
                product_identification: {
                    product_identifier:
                        REVIVE_ITEM_IDENTIFIER_MAP['S_2_5MG_B6_2ML'],
                },
                reason_for_compounding: {
                    code: '6',
                    description: 'Concentration Adjustment Necessary',
                    context: 'Strength/dose customization',
                },
                quantity: 2,
                quantity_authorized: 2,
                substitutions: 0,
                sig:
                    '"Month 1: Inject 10 units (0.25mg) subcutaneously once every week for four weeks ' +
                    'Month 2: Inject 20 units (0.5mg) subcutaneously once every week for four weeks ' +
                    'Month 3: Inject 20 units (0.5mg) subcutaneously once every week for four weeks ' +
                    '(Discard the vial after 90 days)"',
                unit_of_measure: 'C28254',
                date_issued: '',
                note: '',
                refills_authorized: '0',
            },
        ],
        69: [
            //6-month variant (0.25mg, 0.5mg, 0.5mg, 1mg, 1mg, 1mg) - shipment 2 of 2 (two vials - 5mg and 10mg)
            {
                control_level: 0,
                days_supply: 84,
                dose: '5 mg/ml Semaglutide / Pyridoxine HCl 2 mg/ml',
                medication:
                    'Semaglutide 5 mg/ml Sterile Solution for Injection - 2 mL',
                medication_description:
                    'Semaglutide 5 mg/ml Sterile Solution for Injection - 2 mL',
                medication_order_entry_identifier: '',
                product_identification: {
                    product_identifier:
                        REVIVE_ITEM_IDENTIFIER_MAP['S_5MG_B6_2ML'], //is this correct?
                },
                reason_for_compounding: {
                    code: '6',
                    description: 'Concentration Adjustment Necessary',
                    context: 'Strength/dose customization',
                },
                quantity: 2,
                quantity_authorized: 2,
                substitutions: 0,
                sig:
                    'Month 4: Inject 40 units (1mg) subcutaneously once every week for four weeks ' +
                    'Month 5: Inject 20 units (1mg) subcutaneously once every week for four weeks ' +
                    'Month 6: Inject 20 units (1mg) subcutaneously once every week for four weeks ' +
                    '(Discard the vial after 90 days)',
                unit_of_measure: 'C28254',
                date_issued: '',
                note: '',
                refills_authorized: '0',
            },
            {
                control_level: 0,
                days_supply: 84,
                dose: '2.5 mg/ml Semaglutide / Pyridoxine HCl 2 mg/ml',
                medication:
                    'Semaglutide 2.5 mg/ml / Pyridoxine HCl 2 mg/ml Sterile Solution for Injection - 2 ml',
                medication_description:
                    'Semaglutide 2.5 mg/ml / Pyridoxine HCl 2 mg/ml Sterile Solution for Injection - 2 ml',
                medication_order_entry_identifier: '',
                product_identification: {
                    product_identifier:
                        REVIVE_ITEM_IDENTIFIER_MAP['S_2_5MG_B6_2ML'],
                },
                reason_for_compounding: {
                    code: '6',
                    description: 'Concentration Adjustment Necessary',
                    context: 'Strength/dose customization',
                },
                quantity: 2,
                quantity_authorized: 2,
                substitutions: 0,
                sig:
                    'Month 4: Inject 40 units (1mg) subcutaneously once every week for four weeks ' +
                    'Month 5: Inject 20 units (1mg) subcutaneously once every week for four weeks ' +
                    'Month 6: Inject 20 units (1mg) subcutaneously once every week for four weeks ' +
                    '(Discard the vial after 90 days)"',
                unit_of_measure: 'C28254',
                date_issued: '',
                note: '',
                refills_authorized: '0',
            },
        ],

        70: [
            //6-month variant (0.5mg, 0.5mg, 1.25mg, 1.25mg, 2.5mg, 2.5mg) - shipment 1 of 2 (one vial - 10mg)
            {
                control_level: 0,
                days_supply: 84,
                dose: '5 mg/ml Semaglutide / Pyridoxine HCl 2 mg/ml',
                medication:
                    'Semaglutide 5 mg/ml Sterile Solution for Injection - 2 mL',
                medication_description:
                    'Semaglutide 5 mg/ml Sterile Solution for Injection - 2 mL',
                medication_order_entry_identifier: '',
                product_identification: {
                    product_identifier:
                        REVIVE_ITEM_IDENTIFIER_MAP['S_5MG_B6_2ML'],
                },
                reason_for_compounding: {
                    code: '6',
                    description: 'Concentration Adjustment Necessary',
                    context: 'Strength/dose customization',
                },
                quantity: 2,
                quantity_authorized: 2,
                substitutions: 0,
                sig:
                    'Month 1: Inject 10 units (0.5mg) subcutaneously once every week for four weeks ' +
                    'Month 2: Inject 10 units (0.5mg) subcutaneously once every week for four weeks ' +
                    'Month 3: Inject 25 units (1.25mg) subcutaneously once every week for four weeks ' +
                    '(Discard the vial after 90 days)',
                unit_of_measure: 'C28254',
                date_issued: '',
                note: '',
                refills_authorized: '0',
            },
        ],
        71: [
            //6-month variant (0.5mg, 0.5mg, 1.25mg, 1.25mg, 2.5mg, 2.5mg) - shipment 2 of 2 (three vials - 5mg, 10mg, 10mg)
            {
                control_level: 0,
                days_supply: 84,
                dose: '5 mg/ml Semaglutide / Pyridoxine HCl 2 mg/ml',
                medication:
                    'Semaglutide 5 mg/ml Sterile Solution for Injection - 2 mL',
                medication_description:
                    'Semaglutide 5 mg/ml Sterile Solution for Injection - 2 mL',
                medication_order_entry_identifier: '',
                product_identification: {
                    product_identifier:
                        REVIVE_ITEM_IDENTIFIER_MAP['S_5MG_B6_2ML'],
                },
                reason_for_compounding: {
                    code: '6',
                    description: 'Concentration Adjustment Necessary',
                    context: 'Strength/dose customization',
                },
                quantity: 4,
                quantity_authorized: 4, //it's 4 because we're sending 4 milliliters total of this medication (2 2ml vials)
                substitutions: 0,
                sig:
                    'Month 4: Inject 50 units (1.25mg) subcutaneously once every week for four weeks ' +
                    'Month 5: Inject 50 units (2.5mg) subcutaneously once every week for four weeks ' +
                    'Month 6: Inject 50 units (2.5mg) subcutaneously once every week for four weeks ' +
                    '(Discard the vial after 90 days)',
                unit_of_measure: 'C28254',
                date_issued: '',
                note: '',
                refills_authorized: '0',
            },
            {
                control_level: 0,
                days_supply: 84,
                dose: '2.5 mg/ml Semaglutide / Pyridoxine HCl 2 mg/ml',
                medication:
                    'Semaglutide 2.5 mg/ml / Pyridoxine HCl 2 mg/ml Sterile Solution for Injection - 2 ml',
                medication_description:
                    'Semaglutide 2.5 mg/ml / Pyridoxine HCl 2 mg/ml Sterile Solution for Injection - 2 ml',
                medication_order_entry_identifier: '',
                product_identification: {
                    product_identifier:
                        REVIVE_ITEM_IDENTIFIER_MAP['S_2_5MG_B6_2ML'], //is this correct?
                },
                reason_for_compounding: {
                    code: '6',
                    description: 'Concentration Adjustment Necessary',
                    context: 'Strength/dose customization',
                },
                quantity: 2,
                quantity_authorized: 2,
                substitutions: 0,
                sig:
                    'Month 4: Inject 50 units (1.25mg) subcutaneously once every week for four weeks ' +
                    'Month 5: Inject 50 units (2.5mg) subcutaneously once every week for four weeks ' +
                    'Month 6: Inject 50 units (2.5mg) subcutaneously once every week for four weeks ' +
                    '(Discard the vial after 90 days)',
                unit_of_measure: 'C28254',
                date_issued: '',
                note: '',
                refills_authorized: '0',
            },
        ],

        72: [
            //6-month variant (1.25mg, 1.25mg, 1.25mg, 2.5mg, 2.5mg, 2.5mg) - shipment 1 of 2 (two vials - 10mg, 5mg)
            {
                control_level: 0,
                days_supply: 84,
                dose: '2.5 mg/ml Semaglutide / Pyridoxine HCl 2 mg/ml',
                medication:
                    'Semaglutide 2.5 mg/ml / Pyridoxine HCl 2 mg/ml Sterile Solution for Injection - 2 ml',
                medication_description:
                    'Semaglutide 2.5 mg/ml / Pyridoxine HCl 2 mg/ml Sterile Solution for Injection - 2 ml',
                medication_order_entry_identifier: '',
                product_identification: {
                    product_identifier:
                        REVIVE_ITEM_IDENTIFIER_MAP['S_2_5MG_B6_2ML'], //is this correct?
                },
                reason_for_compounding: {
                    code: '6',
                    description: 'Concentration Adjustment Necessary',
                    context: 'Strength/dose customization',
                },
                quantity: 2,
                quantity_authorized: 2,
                substitutions: 0,
                sig:
                    'Month 1: Inject 50 units (1.25mg) subcutaneously once every week for four weeks ' +
                    'Month 2: Inject 25 units (1.25mg) subcutaneously once every week for four weeks ' +
                    'Month 3: Inject 25 units (1.25mg) subcutaneously once every week for four weeks ' +
                    '(Discard the vial after 90 days)',
                unit_of_measure: 'C28254',
                date_issued: '',
                note: '',
                refills_authorized: '0',
            },
            {
                control_level: 0,
                days_supply: 84,
                dose: '5 mg/ml Semaglutide / Pyridoxine HCl 2 mg/ml',
                medication:
                    'Semaglutide 5 mg/ml Sterile Solution for Injection - 2 mL',
                medication_description:
                    'Semaglutide 5 mg/ml Sterile Solution for Injection - 2 mL',
                medication_order_entry_identifier: '',
                product_identification: {
                    product_identifier:
                        REVIVE_ITEM_IDENTIFIER_MAP['S_5MG_B6_2ML'],
                },
                reason_for_compounding: {
                    code: '6',
                    description: 'Concentration Adjustment Necessary',
                    context: 'Strength/dose customization',
                },
                quantity: 2,
                quantity_authorized: 2,
                substitutions: 0,
                sig:
                    'Month 1: Inject 50 units (1.25mg) subcutaneously once every week for four weeks ' +
                    'Month 2: Inject 25 units (1.25mg) subcutaneously once every week for four weeks ' +
                    'Month 3: Inject 25 units (1.25mg) subcutaneously once every week for four weeks ' +
                    '(Discard the vial after 90 days)',
                unit_of_measure: 'C28254',
                date_issued: '',
                note: '',
                refills_authorized: '0',
            },
        ],
        73: [
            //6-month variant (1.25mg, 1.25mg, 1.25mg, 2.5mg, 2.5mg, 2.5mg) - shipment 2 of 2 (three vials - 10mg, 10mg, 10mg)
            {
                control_level: 0,
                days_supply: 84,
                dose: '5 mg/ml Semaglutide / Pyridoxine HCl 2 mg/ml',
                medication:
                    'Semaglutide 5 mg/ml Sterile Solution for Injection - 2 mL',
                medication_description:
                    'Semaglutide 5 mg/ml Sterile Solution for Injection - 2 mL',
                medication_order_entry_identifier: '',
                product_identification: {
                    product_identifier:
                        REVIVE_ITEM_IDENTIFIER_MAP['S_5MG_B6_2ML'],
                },
                reason_for_compounding: {
                    code: '6',
                    description: 'Concentration Adjustment Necessary',
                    context: 'Strength/dose customization',
                },
                quantity: 6,
                quantity_authorized: 6, //it's 6 because we're sending 6 milliliters total of this medication (3 2ml vials)
                substitutions: 0,
                sig:
                    'Month 4: Inject 50 units (2.5mg) subcutaneously once every week for four weeks ' +
                    'Month 5: Inject 50 units (2.5mg) subcutaneously once every week for four weeks ' +
                    'Month 6: Inject 50 units (2.5mg) subcutaneously once every week for four weeks ' +
                    '(Discard the vial after 90 days)',
                unit_of_measure: 'C28254',
                date_issued: '',
                note: '',
                refills_authorized: '0',
            },
        ],
        74: [
            // 6-month variant (0.25mg, 0.5mg, 1mg, 1.25mg, 1.25mg, 1.25mg) - shipment 1 of 2 
            {
              control_level: 0,
              days_supply: 84,
              dose: '5 mg/ml Semaglutide / Pyridoxine HCl 2 mg/ml',
              medication:
                'Semaglutide 5 mg/ml / Pyridoxine HCl 2 mg/ml Sterile Solution for Injection - 2 mL',
              medication_description:
                'Semaglutide 5 mg/ml / Pyridoxine HCl 2 mg/ml Sterile Solution for Injection - 2 mL',
              medication_order_entry_identifier: '',
              product_identification: {
                product_identifier: REVIVE_ITEM_IDENTIFIER_MAP['S_5MG_B6_2ML'],
              },
              reason_for_compounding: {
                code: '6',
                description: 'Concentration Adjustment Necessary',
                context: 'Strength/dose customization',
              },
              quantity: 2,
              quantity_authorized: 2,
              substitutions: 0,
              sig:
                'Month 1: Inject 5 units (0.25mg) subcutaneously once every week for four weeks. ' +
                'Month 2: Inject 10 units (0.5mg) subcutaneously once every week for four weeks. ' +
                'Month 3: Inject 20 units (1mg) subcutaneously once every week for four weeks. ' +
                '(Discard the vial after 90 days)',
              unit_of_measure: 'C28254',
              date_issued: '',
              note: '',
              refills_authorized: '0',
            },
          ],

          75: [
            // 6-month variant (0.25mg, 0.5mg, 1mg, 1.25mg, 1.25mg, 1.25mg) - shipment 2 of 2
            {
              control_level: 0,
              days_supply: 84,
              dose: '2.5 mg/ml Semaglutide / Pyridoxine HCl 2 mg/ml',
              medication:
                'Semaglutide 2.5 mg/ml / Pyridoxine HCl 2 mg/ml Sterile Solution for Injection - 2 mL',
              medication_description:
                'Semaglutide 2.5 mg/ml / Pyridoxine HCl 2 mg/ml Sterile Solution for Injection - 2 mL',
              medication_order_entry_identifier: '',
              product_identification: {
                product_identifier: REVIVE_ITEM_IDENTIFIER_MAP['S_2_5MG_B6_2ML'],
              },
              reason_for_compounding: {
                code: '6',
                description: 'Concentration Adjustment Necessary',
                context: 'Strength/dose customization',
              },
              quantity: 2,
              quantity_authorized: 2,
              substitutions: 0,
              sig:
                'Month 4: Inject 50 units (1.25mg) from the Semaglutide 2.5 mg/mL vial subcutaneously once every week for four weeks. ' +
                '(Discard each vial 90 days after first puncture)',
              unit_of_measure: 'C28254',
              date_issued: '',
              note: '',
              refills_authorized: '0',
            },
            {
              control_level: 0,
              days_supply: 84,
              dose: '5 mg/ml Semaglutide / Pyridoxine HCl 2 mg/ml',
              medication:
                'Semaglutide 5 mg/ml / Pyridoxine HCl 2 mg/ml Sterile Solution for Injection - 2 mL',
              medication_description:
                'Semaglutide 5 mg/ml / Pyridoxine HCl 2 mg/ml Sterile Solution for Injection - 2 mL',
              medication_order_entry_identifier: '',
              product_identification: {
                product_identifier: REVIVE_ITEM_IDENTIFIER_MAP['S_5MG_B6_2ML'],
              },
              reason_for_compounding: {
                code: '6',
                description: 'Concentration Adjustment Necessary',
                context: 'Strength/dose customization',
              },
              quantity: 2,
              quantity_authorized: 2,
              substitutions: 0,
              sig:
                'Month 5: Inject 25 units (1.25mg) from the Semaglutide 5 mg/mL vial subcutaneously once every week for four weeks. ' +
                'Month 6: Inject 25 units (1.25mg) from the Semaglutide 5 mg/mL vial subcutaneously once every week for four weeks. ' +
                '(Discard each vial 90 days after first puncture)',
              unit_of_measure: 'C28254',
              date_issued: '',
              note: '',
              refills_authorized: '0',
            },
          ],
        },

    [PRODUCT_HREF.TIRZEPATIDE]: {
        47: [
            {
                control_level: 0,
                days_supply: 28,
                dose: '5 mg/0.5ml Tirzepatide / Pyridoxine HCl 2 mg/ml',
                medication:
                    'Tirzepatide 5 mg/0.5ml / Pyridoxine HCL 1mg/0.5ml - 1 mL',
                medication_description:
                    'Tirzepatide 5 mg/0.5ml / Pyridoxine HCL 1mg/0.5ml - 1 mL',
                medication_order_entry_identifier: '',
                product_identification: {
                    product_identifier:
                        REVIVE_ITEM_IDENTIFIER_MAP['T_5MG_B6_1ML'],
                },
                reason_for_compounding: {
                    code: '6',
                    description: 'Concentration Adjustment Necessary',
                    context: 'Strength/dose customization',
                },
                quantity: 1,
                quantity_authorized: 1,
                substitutions: 0,
                sig: 'Inject 25 units (2.5mg) subcutaneously once every week',
                unit_of_measure: 'C28254',
                date_issued: '',
                note: '',
                refills_authorized: '0',
            },
        ],

        48: [
            {
                control_level: 0,
                days_supply: 28,
                dose: '5 mg/0.5ml Tirzepatide / Pyridoxine HCl 2 mg/ml',
                medication:
                    'Tirzepatide 5 mg/0.5ml / Pyridoxine HCL 1mg/0.5ml - 2 mL',
                medication_description:
                    'Tirzepatide 5 mg/0.5ml / Pyridoxine HCL 1mg/0.5ml - 2 mL',
                medication_order_entry_identifier: '',
                product_identification: {
                    product_identifier:
                        REVIVE_ITEM_IDENTIFIER_MAP['T_5MG_B6_2ML'],
                },
                reason_for_compounding: {
                    code: '6',
                    description: 'Concentration Adjustment Necessary',
                    context: 'Strength/dose customization',
                },
                quantity: 2,
                quantity_authorized: 2,
                substitutions: 0,
                sig: 'Inject 50 units (5mg) subcutaneously once every week',
                unit_of_measure: 'C28254',
                date_issued: '',
                note: '',
                refills_authorized: '0',
            },
        ],

        49: [
            {
                control_level: 0,
                days_supply: 28,
                dose: '10 mg/0.5ml Tirzepatide / Pyridoxine HCl 2 mg/ml',
                medication:
                    'Tirzepatide 10 mg/0.5ml / Pyridoxine HCL 1mg/0.5ml - 2 mL',
                medication_description:
                    'Tirzepatide 10 mg/0.5ml / Pyridoxine HCL 1mg/0.5ml - 2 mL',
                medication_order_entry_identifier: '',
                product_identification: {
                    product_identifier:
                        REVIVE_ITEM_IDENTIFIER_MAP['T_10MG_B6_2ML'],
                },
                reason_for_compounding: {
                    code: '6',
                    description: 'Concentration Adjustment Necessary',
                    context: 'Strength/dose customization',
                },
                quantity: 2,
                quantity_authorized: 2,
                substitutions: 0,
                sig: 'Inject 38 units (7.5mg) subcutaneously once every week',
                unit_of_measure: 'C28254',
                date_issued: '',
                note: '',
                refills_authorized: '0',
            },
        ],

        50: [
            {
                control_level: 0,
                days_supply: 28,
                dose: '10 mg/0.5ml Tirzepatide / Pyridoxine HCl 3 mg/ml',
                medication:
                    'Tirzepatide 10 mg/0.5ml / Pyridoxine HCL 1mg/0.5ml - 3 mL',
                medication_description:
                    'Tirzepatide 10 mg/0.5ml / Pyridoxine HCL 1mg/0.5ml - 3 mL',
                medication_order_entry_identifier: '',
                product_identification: {
                    product_identifier:
                        REVIVE_ITEM_IDENTIFIER_MAP['T_10MG_B6_3ML'],
                },
                reason_for_compounding: {
                    code: '6',
                    description: 'Concentration Adjustment Necessary',
                    context: 'Strength/dose customization',
                },
                quantity: 3,
                quantity_authorized: 3,
                substitutions: 0,
                sig: 'Inject 50 units (10mg) subcutaneously once every week',
                unit_of_measure: 'C28254',
                date_issued: '',
                note: '',
                refills_authorized: '0',
            },
        ],

        51: [
            {
                control_level: 0,
                days_supply: 28,
                dose: '10 mg/0.5ml Tirzepatide / Pyridoxine HCl 3 mg/ml',
                medication:
                    'Tirzepatide 10 mg/0.5ml / Pyridoxine HCL 1mg/0.5ml - 3 mL',
                medication_description:
                    'Tirzepatide 10 mg/0.5ml / Pyridoxine HCL 1mg/0.5ml - 3 mL',
                medication_order_entry_identifier: '',
                product_identification: {
                    product_identifier:
                        REVIVE_ITEM_IDENTIFIER_MAP['T_10MG_B6_3ML'],
                },
                reason_for_compounding: {
                    code: '6',
                    description: 'Concentration Adjustment Necessary',
                    context: 'Strength/dose customization',
                },
                quantity: 3,
                quantity_authorized: 3,
                substitutions: 0,
                sig: 'Inject 63 units (12.5mg) subcutaneously once every week',
                unit_of_measure: 'C28254',
                date_issued: '',
                note: '',
                refills_authorized: '0',
            },
        ],

        57: [
            //6-month variant (2.5mg x 6) - shipment 1 of 2 (two vials - 10mg, 20mg)
            {
                control_level: 0,
                days_supply: 84,
                dose: '5 mg/0.5ml Tirzepatide / Pyridoxine HCl 2 mg/ml',
                medication:
                    'Tirzepatide 5 mg/0.5ml / Pyridoxine HCL 1mg/0.5ml - 1 mL',
                medication_description:
                    'Tirzepatide 5 mg/0.5ml / Pyridoxine HCL 1mg/0.5ml - 1 mL',
                medication_order_entry_identifier: '',
                product_identification: {
                    product_identifier:
                        REVIVE_ITEM_IDENTIFIER_MAP['T_5MG_B6_1ML'],
                },
                reason_for_compounding: {
                    code: '6',
                    description: 'Concentration Adjustment Necessary',
                    context: 'Strength/dose customization',
                },
                quantity: 1,
                quantity_authorized: 1,
                substitutions: 0,
                sig:
                    'Month 1: Inject 25 units (2.5mg) subcutaneously once every week for four weeks ' +
                    'Month 2: Inject 25 units (2.5mg) subcutaneously once every week for four weeks ' +
                    'Month 3: Inject 25 units (2.5mg) subcutaneously once every week for four weeks ' +
                    '(Discard the vial after 90 days)',
                unit_of_measure: 'C28254',
                date_issued: '',
                note: '',
                refills_authorized: '0',
            },
            {
                control_level: 0,
                days_supply: 84,
                dose: '5 mg/0.5ml Tirzepatide / Pyridoxine HCl 2 mg/ml',
                medication:
                    'Tirzepatide 5 mg/0.5ml / Pyridoxine HCL 1mg/0.5ml - 2 mL',
                medication_description:
                    'Tirzepatide 5 mg/0.5ml / Pyridoxine HCL 1mg/0.5ml - 2 mL',
                medication_order_entry_identifier: '',
                product_identification: {
                    product_identifier:
                        REVIVE_ITEM_IDENTIFIER_MAP['T_5MG_B6_2ML'],
                },
                reason_for_compounding: {
                    code: '6',
                    description: 'Concentration Adjustment Necessary',
                    context: 'Strength/dose customization',
                },
                quantity: 2,
                quantity_authorized: 2,
                substitutions: 0,
                sig:
                    'Month 1: Inject 25 units (2.5mg) subcutaneously once every week for four weeks ' +
                    'Month 2: Inject 25 units (2.5mg) subcutaneously once every week for four weeks ' +
                    'Month 3: Inject 25 units (2.5mg) subcutaneously once every week for four weeks ' +
                    '(Discard the vial after 90 days)',
                unit_of_measure: 'C28254',
                date_issued: '',
                note: '',
                refills_authorized: '0',
            },
        ],

        58: [
            //6-month variant (2.5mg x 6) - shipment 2 of 2 (two vials - 10mg, 20mg)
            {
                control_level: 0,
                days_supply: 84,
                dose: '5 mg/0.5ml Tirzepatide / Pyridoxine HCl 2 mg/ml',
                medication:
                    'Tirzepatide 5 mg/0.5ml / Pyridoxine HCL 1mg/0.5ml - 1 mL',
                medication_description:
                    'Tirzepatide 5 mg/0.5ml / Pyridoxine HCL 1mg/0.5ml - 1 mL',
                medication_order_entry_identifier: '',
                product_identification: {
                    product_identifier:
                        REVIVE_ITEM_IDENTIFIER_MAP['T_5MG_B6_1ML'],
                },
                reason_for_compounding: {
                    code: '6',
                    description: 'Concentration Adjustment Necessary',
                    context: 'Strength/dose customization',
                },
                quantity: 1,
                quantity_authorized: 1,
                substitutions: 0,
                sig:
                    'Month 4: Inject 25 units (2.5mg) subcutaneously once every week for four weeks ' +
                    'Month 5: Inject 25 units (2.5mg) subcutaneously once every week for four weeks ' +
                    'Month 6: Inject 25 units (2.5mg) subcutaneously once every week for four weeks ' +
                    '(Discard the vial after 90 days)',
                unit_of_measure: 'C28254',
                date_issued: '',
                note: '',
                refills_authorized: '0',
            },
            {
                control_level: 0,
                days_supply: 84,
                dose: '5 mg/0.5ml Tirzepatide / Pyridoxine HCl 2 mg/ml',
                medication:
                    'Tirzepatide 5 mg/0.5ml / Pyridoxine HCL 1mg/0.5ml - 2 mL',
                medication_description:
                    'Tirzepatide 5 mg/0.5ml / Pyridoxine HCL 1mg/0.5ml - 2 mL',
                medication_order_entry_identifier: '',
                product_identification: {
                    product_identifier:
                        REVIVE_ITEM_IDENTIFIER_MAP['T_5MG_B6_2ML'],
                },
                reason_for_compounding: {
                    code: '6',
                    description: 'Concentration Adjustment Necessary',
                    context: 'Strength/dose customization',
                },
                quantity: 2,
                quantity_authorized: 2,
                substitutions: 0,
                sig:
                    'Month 4: Inject 25 units (2.5mg) subcutaneously once every week for four weeks ' +
                    'Month 5: Inject 25 units (2.5mg) subcutaneously once every week for four weeks ' +
                    'Month 6: Inject 25 units (2.5mg) subcutaneously once every week for four weeks ' +
                    '(Discard the vial after 90 days)',
                unit_of_measure: 'C28254',
                date_issued: '',
                note: '',
                refills_authorized: '0',
            },
        ],

        59: [
            //6-month variant (2.5mg, 2.5mg, 2.5mg, 5mg, 5mg, 5mg) - shipment 1 of 2 (one vial)
            {
                control_level: 0,
                days_supply: 84,
                dose: '10 mg/0.5ml Tirzepatide / Pyridoxine HCl 2 mg/ml',
                medication:
                    'Tirzepatide 10 mg/0.5ml / Pyridoxine HCL 1mg/0.5ml - 2 mL',
                medication_description:
                    'Tirzepatide 10 mg/0.5ml / Pyridoxine HCL 1mg/0.5ml - 2 mL',
                medication_order_entry_identifier: '',
                product_identification: {
                    product_identifier:
                        REVIVE_ITEM_IDENTIFIER_MAP['T_10MG_B6_2ML'],
                },
                reason_for_compounding: {
                    code: '6',
                    description: 'Concentration Adjustment Necessary',
                    context: 'Strength/dose customization',
                },
                quantity: 2,
                quantity_authorized: 2,
                substitutions: 0,
                sig:
                    'Month 1: Inject 12.5 units (2.5mg) subcutaneously once every week for four weeks ' +
                    'Month 2: Inject 12.5 units (2.5mg) subcutaneously once every week for four weeks ' +
                    'Month 3: Inject 12.5 units (2.5mg) subcutaneously once every week for four weeks ' +
                    '(Discard the vial after 90 days)',
                unit_of_measure: 'C28254',
                date_issued: '',
                note: '',
                refills_authorized: '0',
            },
        ],

        60: [
            //6-month variant (2.5mg x 6) - shipment 2 of 2 (one vial)
            {
                control_level: 0,
                days_supply: 84,
                dose: '10 mg/0.5ml Tirzepatide / Pyridoxine HCl 3 mg/ml',
                medication:
                    'Tirzepatide 10 mg/0.5ml / Pyridoxine HCL 1mg/0.5ml - 3 mL',
                medication_description:
                    'Tirzepatide 10 mg/0.5ml / Pyridoxine HCL 1mg/0.5ml - 3 mL',
                medication_order_entry_identifier: '',
                product_identification: {
                    product_identifier:
                        REVIVE_ITEM_IDENTIFIER_MAP['T_10MG_B6_3ML'],
                },
                reason_for_compounding: {
                    code: '6',
                    description: 'Concentration Adjustment Necessary',
                    context: 'Strength/dose customization',
                },
                quantity: 3,
                quantity_authorized: 3,
                substitutions: 0,
                sig:
                    'Month 4: Inject 25 units (5mg) subcutaneously once every week for four weeks ' +
                    'Month 5: Inject 25 units (5mg) subcutaneously once every week for four weeks ' +
                    'Month 6: Inject 25 units (5mg) subcutaneously once every week for four weeks ' +
                    '(Discard the vial after 90 days)',
                unit_of_measure: 'C28254',
                date_issued: '',
                note: '',
                refills_authorized: '0',
            },
        ],
    },
    [PRODUCT_HREF.B12_INJECTION]: {
        0: [
            {
                control_level: 0,
                days_supply: 28,
                dose: '1mg/1mL',
                medication: 'B12 Injection 1mg/1mL',
                medication_description: 'B12 Injection 1mg/1mL',
                medication_order_entry_identifier: '',
                product_identification: {
                    product_identifier: 'a5f4f279-26b8-4fab-9896-3b4d2b8a75e6',
                },
                reason_for_compounding: {
                    code: '6',
                    description: 'Concentration Adjustment Necessary',
                    context: 'Strength/dose customization',
                },
                quantity: 10,
                quantity_authorized: 10,
                substitutions: 0,
                sig: 'Inject 1 ml (100 units) subcutaneously once to twice weekly.  If desired, you can slowly increase up to 2 ml (200 units) once to twice weekly or as prescribed.  Contact our team to adjust dose for your ongoing RX.',
                unit_of_measure: 'C28254',
                date_issued: '',
                note: '',
                refills_authorized: '0',
            },
        ],
        1: [
            {
                control_level: 0,
                days_supply: 84,
                dose: '1mg/1mL',
                medication: 'B12 Injection 1mg/1mL',
                medication_description: 'B12 Injection 1mg/1mL',
                medication_order_entry_identifier: '',
                product_identification: {
                    product_identifier: 'a5f4f279-26b8-4fab-9896-3b4d2b8a75e6',
                },
                reason_for_compounding: {
                    code: '6',
                    description: 'Concentration Adjustment Necessary',
                    context: 'Strength/dose customization',
                },
                quantity: 30,
                quantity_authorized: 30,
                substitutions: 0,
                sig: 'Inject 1 ml (100 units) subcutaneously once to twice weekly.  If desired, you can slowly increase up to 2 ml (200 units) once to twice weekly or as prescribed.  Contact our team to adjust dose for your ongoing RX.',
                unit_of_measure: 'C28254',
                date_issued: '',
                note: '',
                refills_authorized: '0',
            },
        ],
        2: [
            {
                control_level: 0,
                days_supply: 84,
                dose: '1mg/1mL',
                medication: 'B12 Injection 1mg/1mL',
                medication_description: 'B12 Injection 1mg/1mL',
                medication_order_entry_identifier: '',
                product_identification: {
                    product_identifier: 'a5f4f279-26b8-4fab-9896-3b4d2b8a75e6',
                },
                reason_for_compounding: {
                    code: '6',
                    description: 'Concentration Adjustment Necessary',
                    context: 'Strength/dose customization',
                },
                quantity: 30,
                quantity_authorized: 30,
                substitutions: 0,
                sig: 'Inject 1 ml (100 units) subcutaneously once to twice weekly.  If desired, you can slowly increase up to 2 ml (200 units) once to twice weekly or as prescribed.  Contact our team to adjust dose for your ongoing RX.',
                unit_of_measure: 'C28254',
                date_issued: '',
                note: '',
                refills_authorized: '0',
            },
        ],
    },
};

interface ReviveProductDescriptorMap {
    [key: string]: {
        [key: number]: string;
    };
}

export const REVIVE_PRODUCT_DESCRIPTOR_MAP: ReviveProductDescriptorMap = {
    [PRODUCT_HREF.SEMAGLUTIDE]: {
        32: '[monthly] Semaglutide 0.5 mg dose',
        33: '[quarterly] Semaglutide (0.25mg, 0.5mg, 1.25mg) dose',
        34: '[quarterly] Semaglutide (1.25mg, 1.25mg, 1.25mg) dose',
        35: '[quarterly] Semaglutide (1.25mg, 1.25mg, 2.5mg) dose',
        36: '[quarterly] Semaglutide (0.5mg, 1.25mg, 2.5mg) dose',
        55: '[monthly] Semaglutide 0.5 mg dose with B6',
        56: '[quarterly] Semaglutide (0.25mg, 0.5mg, 1.25mg) dose with B6',
        57: '[quarterly] Semaglutide (1.25mg, 1.25mg, 1.25mg) dose with B6',
        58: '[quarterly] Semaglutide (1.25mg, 1.25mg, 2.5mg) dose with B6',
        59: '[quarterly] Semaglutide (0.5mg, 1.25mg, 2.5mg) dose with B6',
        64: '[biannually] Semaglutide (0.25mg, 0.25mg, 0.25mg, 0.25mg, 0.25mg, 0.25mg)',
        66: '[biannually] Semaglutide (0.5mg, 0.5mg, 0.5mg, 0.5mg, 0.5mg, 0.5mg)',
        68: '[biannually] Semaglutide (0.25mg, 0.5mg, 0.5mg, 1mg, 1mg, 1mg)',
        70: '[biannually] Semaglutide (0.5mg, 0.5mg, 1.25mg, 1.25mg, 2.5mg, 2.5mg)',
        72: '[biannually] Semaglutide (1.25mg, 1.25mg, 1.25mg, 2.5mg, 2.5mg, 2.5mg)',
        74: '[biannually] Semaglutide (0.25mg, 0.5mg, 0.1mg, 1.25mg, 1.25mg, 1.25mg)',
    },
    [PRODUCT_HREF.TIRZEPATIDE]: {
        47: '[monthly] Tirzepatide 2.5mg dose with B6',
        48: '[monthly] Tirzepatide 5mg dose with B6',
        49: '[monthly] Tirzepatide 7.5mg dose with B6',
        50: '[monthly] Tirzepatide 10mg dose with B6',
        51: '[monthly] Tirzepatide 12.5mg dose with B6',
        57: '[biannually] Tirzepatide (2.5 mg, 2.5 mg, 2.5 mg, 2.5 mg, 2.5 mg, 2.5 mg)',
        59: '[biannually] Tirzepatide (2.5 mg, 2.5 mg, 2.5 mg, 5 mg, 5 mg, 5 mg)',
    },
};
