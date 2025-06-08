/**
 * There are only 4 products for semaglutide and 3 for tirzepatide in empower.
 * I have named them by labeling them with S- or T- and then the first number is the concentration. The second number is vial size.
 */
export const EMPOWER_ITEM_CATALOG_CODES: EmpowerItemCatalogCodes = {
    'S-1-1': {
        itemDesignatorId: 'A25CCAF5A59AE9D9764A59DA9BCEB5EE',
        drugDescription: 'SEMAGLUTIDE / CYANOCOBALAMIN INJECTION (1 ML)',
    },
    'S-1-2.5': {
        itemDesignatorId: 'CFD8712D2EF9495087967973E5CCDEE9',
        drugDescription: 'SEMAGLUTIDE / CYANOCOBALAMIN INJECTION (2.5 ML)',
    },
    'S-5-1': {
        itemDesignatorId: '2E856CB5BEF400773849E2576305CF02',
        drugDescription: 'SEMAGLUTIDE / CYANOCOBALAMIN INJECTION (1 ML)',
    },
    'S-5-2.5': {
        itemDesignatorId: '6F743FC0E60CFDC817A1912351824286',
        drugDescription: 'SEMAGLUTIDE / CYANOCOBALAMIN INJECTION (2.5 ML)',
    },
    'T-17-2': {
        itemDesignatorId: 'B1961EA2BDFA7A1AF0168EBC969E4A99',
        drugDescription: 'TIRZEPATIDE / NIACINAMIDE INJECTION 2 ML',
    },
    'T-8-2.5': {
        itemDesignatorId: 'C33D31DFC3AEBBAC2B127876340292F7',
        drugDescription: 'TIRZEPATIDE / NIACINAMIDE INJECTION 2.5 ML',
    },
    'T-17-4': {
        itemDesignatorId: '23D232DD1FDDD6CB9B146292B620711C',
        drugDescription: 'TIRZEPATIDE / NIACINAMIDE INJECTION 4 ML',
    },
    'BELLA-5': {
        itemDesignatorId: '0E3EB99C94713D77ABBCA13CEAAD9EDF',
        drugDescription:
            'BIOVERSE WEIGHT LOSS CAPSULE BUPROPION HCL/NALTREXONE HCL/TOPIRAMATE 65 mg / 8 mg / 15 mg ',
    },
    'syringe-swab': {
        itemDesignatorId: 'C0F34D98BC3218F057D4572CF106E66A',
        drugDescription:
            'SYRINGE KIT 31G  5/16" 1CC (EASY TOUCH), ALCOHOL SWABS',
    },
    'nad-nasal-spray': {
        itemDesignatorId: '1C671C3C2027523571CB9889BE8914B3',
        drugDescription: 'NAD+ Nasal Spray',
    },
    'tadalafil-odt-8.5': {
        itemDesignatorId: 'A9A0B1B8DA63BB210E4B3D856A2F0CE4',
        drugDescription: 'Tadalafil ODT 8.5 mg',
    },
    'tadalafil-generic-10': {
        itemDesignatorId: '9EA1757A1177DD415F03990305A4E1BA',
        drugDescription: 'Tadalafil (Generic) Tablet 10 mg',
    },
    'tadalafil-generic-20': {
        itemDesignatorId: '916400D81012A80606CE984CB0D4AF90',
        drugDescription: 'Tadalafil (Generic) Tablet 20 mg',
    },
    'sildenafil-odt-36': {
        itemDesignatorId: '0FFF02CB43E21176E07B7F70C1D109AF',
        drugDescription: 'Sildenafil ODT 36 mg',
    },
    'sildenafil-odt-60': {
        itemDesignatorId: '7B382A263B6C41AF50D0ABA112299FF2',
        drugDescription: 'Sildenafil ODT 60 mg',
    },
    'sildenafil-generic-20': {
        itemDesignatorId: 'A3680BE4CC3B04B7278C96FC5215D102',
        drugDescription: 'Sildenafil (Generic) 20 mg',
    },
    'sildenafil-generic-25': {
        itemDesignatorId: '1EE624BF9B296DD27B63BBF7C694EA21',
        drugDescription: 'Sildenafil (Generic) 25 mg',
    },
    'sildenafil-generic-50': {
        itemDesignatorId: 'A3DF7A0F14776A08EEC80151AF042E5A',
        drugDescription: 'Sildenafil (Generic) 50 mg',
    },
    'sildenafil-generic-100': {
        itemDesignatorId: '57CD76625AE1769023E0033F55C98A55',
        drugDescription: 'Sildenafil (Generic) 100 mg',
    },
};

export const searchEmpowerItemCatalogByCode = (
    code: string
): { itemDesignatorId: string; drugDescription: string } => {
    return EMPOWER_ITEM_CATALOG_CODES[code];
};


//DEPRECATED BELOW
//DEPRECATED 
//DEPRECATED
/// GO HERE --> /app/services/pharmacy-integration/empower/empower-variant-product-script-data.ts
//DEPRECATED
//DEPRECATED
//DEPRECATED
export const EMPOWER_VARIANT_SCRIPT_DATA: EmpowerVariantSigData[] = [
    // semaglutide var 0, index 0
    {
        selectDisplayName:
            '[1-month] Semaglutide 1 mg total (0.25 mg dosing) [$289]',
        array: [
            {
                catalogItemCode: 'S-1-1',
                sigText:
                    'Inject 25 units (0.25 mg of semaglutide) subcutaneously once a week for four weeks',
                internalSigText:
                    'Inject 25 units (0.25 mg of semaglutide) subcutaneously once a week for four weeks',
                quantity: 1,
                daysSupply: 28,
            },
            {
                catalogItemCode: 'syringe-swab',
                sigText: 'Use as Directed',
                internalSigText: 'Use as Directed',
                quantity: 10,
                daysSupply: 28,
            },
        ],
    },
    // semaglutide var 0, index 1
    {
        selectDisplayName:
            '[1-month] Semaglutide 2.5 mg total (0.5 mg dosing) [$289]',
        array: [
            {
                catalogItemCode: 'S-1-2.5',
                sigText:
                    'Inject 50 units (0.5 mg of semaglutide) subcutaneously once a week for four weeks',
                internalSigText:
                    'Inject 50 units (0.5 mg of semaglutide) subcutaneously once a week for four weeks',
                quantity: 1,
                daysSupply: 28,
            },
            {
                catalogItemCode: 'syringe-swab',
                sigText: 'Use as Directed',
                internalSigText: 'Use as Directed',
                quantity: 10,
                daysSupply: 28,
            },
        ],
    },
    // semaglutide var 0, index 2
    {
        selectDisplayName:
            '[1-month] Semaglutide 5 mg total (1.25 mg dosing) [$289]',
        array: [
            {
                catalogItemCode: 'S-5-1',
                sigText:
                    'Inject 25 units (1.25 mg of semaglutide) subcutaneously once a week for four weeks',
                internalSigText:
                    'Inject 25 units (1.25 mg of semaglutide) subcutaneously once a week for four weeks',
                quantity: 1,
                daysSupply: 28,
            },
            {
                catalogItemCode: 'syringe-swab',
                sigText: 'Use as Directed',
                internalSigText: 'Use as Directed',
                quantity: 10,
                daysSupply: 28,
            },
        ],
    },
    // semaglutide var 1, index 3
    {
        selectDisplayName:
            '[1-month] Semaglutide 12.5 mg total (2.5 mg dosing) [$449]',
        array: [
            {
                catalogItemCode: 'S-5-2.5',
                sigText:
                    'Inject 50 units (2.5 mg of semaglutide)  subcutaneously once a week for four weeks',
                internalSigText:
                    'Inject 50 units (2.5 mg of semaglutide)  subcutaneously once a week for four weeks',
                quantity: 1,
                daysSupply: 28,
            },
            {
                catalogItemCode: 'syringe-swab',
                sigText: 'Use as Directed',
                internalSigText: 'Use as Directed',
                quantity: 10,
                daysSupply: 28,
            },
        ],
    },
    // tirzepatide var 0, index 4
    {
        selectDisplayName:
            '[1-month] Tirzepartide 20 mg total (2.5 mg dosing) [$449]',
        array: [
            {
                catalogItemCode: 'T-8-2.5',
                sigText:
                    'Inject 31 units (2.5 mg of tirzepatide) subcutaneously once a week for four weeks',
                internalSigText:
                    'Inject 31 units (2.5 mg of tirzepatide) subcutaneously once a week for four weeks',
                quantity: 1,
                daysSupply: 28,
            },
            {
                catalogItemCode: 'syringe-swab',
                sigText: 'Use as Directed',
                internalSigText: 'Use as Directed',
                quantity: 10,
                daysSupply: 28,
            },
        ],
    },
    // tirzepatide var 0, index 5
    {
        selectDisplayName:
            '[1-month] Tirzepartide 20 mg total (5 mg dosing) [$449]',
        array: [
            {
                catalogItemCode: 'T-8-2.5',
                sigText:
                    'Inject 62 units (5 mg of tirzepatide) subcutaneously once a week for four weeks',
                internalSigText:
                    'Inject 62 units (5 mg of tirzepatide) subcutaneously once a week for four weeks',
                quantity: 1,
                daysSupply: 28,
            },
            {
                catalogItemCode: 'syringe-swab',
                sigText: 'Use as Directed',
                internalSigText: 'Use as Directed',
                quantity: 10,
                daysSupply: 28,
            },
        ],
    },
    // tirzepatide var 1, index 6
    {
        selectDisplayName:
            '[1-month] Tirzepartide 34 mg total (7.5 mg dosing) [$449]',
        array: [
            {
                catalogItemCode: 'T-17-2',
                sigText:
                    'Inject 44 units (7.5 mg of tirzepatide) subcutaneously once a week for four weeks',
                internalSigText:
                    'Inject 44 units (7.5 mg of tirzepatide) subcutaneously once a week for four weeks',
                quantity: 1,
                daysSupply: 28,
            },
            {
                catalogItemCode: 'syringe-swab',
                internalSigText: 'Use as Directed',
                sigText: 'Use as Directed',
                quantity: 10,
                daysSupply: 28,
            },
        ],
    },
    // tirzepatide var 10, index 7
    {
        selectDisplayName:
            '[1-month] Trizepatide 54 mg total (10 mg dosing) [$799]',
        array: [
            {
                catalogItemCode: 'T-8-2.5',
                sigText:
                    'Inject 125 units (10 mg of tirzepatide) subcutaneously once a week for weeks 1-2',
                internalSigText:
                    'Inject 125 units (10 mg of tirzepatide) subcutaneously once a week for weeks 1-2',
                quantity: 1,
                daysSupply: 14,
            },
            {
                catalogItemCode: 'T-17-2',
                sigText:
                    'Inject 59 units (10 mg of tirzepatide) subcutaneously once a week for weeks 3-4',
                internalSigText:
                    'Inject 59 units (10 mg of tirzepatide) subcutaneously once a week for weeks 3-4',
                quantity: 1,
                daysSupply: 14,
            },
            {
                catalogItemCode: 'syringe-swab',
                internalSigText: 'Use as Directed',
                sigText: 'Use as Directed',
                quantity: 10,
                daysSupply: 28,
            },
        ],
    },
    {
        // tirzepatide var 11, index 8
        selectDisplayName:
            '[1-month] Trizepatide 54 mg total (12.5 mg dosing) [$799]',
        array: [
            {
                catalogItemCode: 'T-8-2.5',
                sigText:
                    'Inject 156 units (12.5 mg of tirzepatide) subcutaneously once a week for one week (week 1)',
                internalSigText:
                    'Inject 156 units (12.5 mg of tirzepatide) subcutaneously once a week for one week (week 1)',
                quantity: 1,
                daysSupply: 14,
            },
            {
                catalogItemCode: 'T-17-2',
                sigText:
                    'Inject 74 units (12.5 mg of tirzepatide) subcutaneously once a week for weeks  2-4',
                internalSigText:
                    'Inject 74 units (12.5 mg of tirzepatide) subcutaneously once a week for weeks  2-4',
                quantity: 1,
                daysSupply: 14,
            },
            {
                catalogItemCode: 'syringe-swab',
                internalSigText: 'Use as Directed',
                sigText: 'Use as Directed',
                quantity: 10,
                daysSupply: 28,
            },
        ],
    },
    // semaglutide var 6, index 9
    {
        selectDisplayName:
            '[Bundle] Semaglutide 8.5 mg total (0.25mg, 0.5mg, 1.25mg dosing) [$477.15]',
        array: [
            {
                catalogItemCode: 'S-1-1',
                sigText:
                    'Month 1 Inject 25 units (0.25 mg of semaglutide) subcutaneously once per week for weeks 1-4',
                internalSigText:
                    'Month 1 Inject 25 units (0.25 mg of semaglutide) subcutaneously once per week for weeks 1-4',
                quantity: 1,
                daysSupply: 28,
            },
            {
                catalogItemCode: 'S-1-2.5',
                sigText:
                    'Month 2 Inject 50 units (0.5 mg of semaglutide) subcutaneously once per week for weeks 5-8',
                internalSigText:
                    'Month 2 Inject 50 units (0.5 mg of semaglutide) subcutaneously once per week for weeks 5-8',
                quantity: 1,
                daysSupply: 28,
            },
            {
                catalogItemCode: 'S-5-1',
                sigText:
                    'Month 3 Inject 25 units (1.25 mg of semaglutide) subcutaneously once per week for weeks 9-12',
                internalSigText:
                    'Month 3 Inject 25 units (1.25 mg of semaglutide) subcutaneously once per week for weeks 9-12',
                quantity: 1,
                daysSupply: 28,
            },
            {
                catalogItemCode: 'syringe-swab',
                sigText: 'Use as Directed',
                internalSigText: 'Use as Directed',
                quantity: 20,
                daysSupply: 84,
            },
        ],
    },
    // semaglutide var 7, index 10
    {
        selectDisplayName:
            '[Bundle] Semaglutide 15 mg total (1.25mg dosing or as directed by provider) [$603.72]',
        array: [
            {
                catalogItemCode: 'S-5-1',
                sigText:
                    'Months 1-3 Inject 25 units (1.25 mg of semaglutide) subcutaneously once per week for weeks 1-12 or as directed by your provider',
                internalSigText:
                    'Months 1-3 Inject 25 units (1.25 mg of semaglutide) subcutaneously once per week for weeks 1-12 or as directed by your provider',
                quantity: 3,
                daysSupply: 84,
            },
            {
                catalogItemCode: 'syringe-swab',
                sigText: 'Use as Directed',
                internalSigText: 'Use as Directed',
                quantity: 20,
                daysSupply: 84,
            },
        ],
    },
    // semaglutide var 8, index 11
    {
        selectDisplayName:
            '[Bundle] Semaglutide 20 mg total (0.5mg, 1.25mg, 2.5mg dosing) [$808.92]',
        array: [
            {
                catalogItemCode: 'S-1-2.5',
                sigText:
                    'Month 1 Inject 50 units (0.5 mg of semaglutide) subcutaneously once per week for weeks 1-4',
                internalSigText:
                    'Month 1 Inject 50 units (0.5 mg of semaglutide) subcutaneously once per week for weeks 1-4',
                quantity: 1,
                daysSupply: 28,
            },
            {
                catalogItemCode: 'S-5-1',
                sigText:
                    'Month 2 Inject 25 units (1.25 mg of semaglutide) subcutaneously once per week for weeks 5-8',
                internalSigText:
                    'Month 2 Inject 25 units (1.25 mg of semaglutide) subcutaneously once per week for weeks 5-8',
                quantity: 1,
                daysSupply: 28,
            },
            {
                catalogItemCode: 'S-5-2.5',
                sigText:
                    'Month 3 Inject 50 units (2.5 mg of semaglutide) subcutaneously once per week for weeks 9-12',
                internalSigText:
                    'Month 3 Inject 50 units (2.5 mg of semaglutide) subcutaneously once per week for weeks 9-12',
                quantity: 1,
                daysSupply: 28,
            },
            {
                catalogItemCode: 'syringe-swab',
                sigText: 'Use as Directed',
                internalSigText: 'Use as Directed',
                quantity: 20,
                daysSupply: 84,
            },
        ],
    },
    // semaglutide var 9, index 12
    {
        selectDisplayName:
            '[Bundle] Semaglutide 30 mg total (1.25mg, 2.5mg, 2.5mg dosing) [$916.92]',
        array: [
            {
                catalogItemCode: 'S-5-1',
                sigText:
                    'Month 1 Inject 25 units (1.25 mg of semaglutide) subcutaneously once per week for weeks 1-4',
                internalSigText:
                    'Month 1 Inject 25 units (1.25 mg of semaglutide) subcutaneously once per week for weeks 1-4',
                quantity: 1,
                daysSupply: 28,
            },
            {
                catalogItemCode: 'S-5-2.5',
                sigText:
                    'Months 2-3 Inject 50 units (2.5 mg of semaglutide) subcutaneously once per week for weeks 5-12',
                internalSigText:
                    'Months 2-3 Inject 50 units (2.5 mg of semaglutide) subcutaneously once per week for weeks 5-12',
                quantity: 1,
                daysSupply: 28,
            },
            {
                catalogItemCode: 'S-5-2.5',
                sigText:
                    'Months 2-3 Inject 50 units (2.5 mg of semaglutide) subcutaneously once per week for weeks 5-12',
                internalSigText:
                    'Months 2-3 Inject 50 units (2.5 mg of semaglutide) subcutaneously once per week for weeks 5-12',
                quantity: 1,
                daysSupply: 28,
            },
            {
                catalogItemCode: 'syringe-swab',
                sigText: 'Use as Directed',
                internalSigText: 'Use as Directed',
                quantity: 20,
                daysSupply: 84,
            },
        ],
    },
    // semaglutide var 10, index 13
    {
        selectDisplayName:
            '[Bundle] Semaglutide 37.5 mg total (2.5mg dosing or as directed by your provider) [$1024.92]',
        array: [
            {
                catalogItemCode: 'S-5-2.5',
                sigText:
                    'Months 1-3 Inject 50 units (2.5 mg of semaglutide) subcutaneously once per week for weeks 1-12 or as directed by your provider',
                internalSigText:
                    'Months 1-3 Inject 50 units (2.5 mg of semaglutide) subcutaneously once per week for weeks 1-12 or as directed by your provider',
                quantity: 3,
                daysSupply: 84,
            },
            {
                catalogItemCode: 'syringe-swab',
                sigText: 'Use as Directed',
                internalSigText: 'Use as Directed',
                quantity: 20,
                daysSupply: 84,
            },
        ],
    },
    // tirzepatide var 6, index 14
    {
        selectDisplayName:
            '[Bundle] Tirzepatide 60 mg total (2.5mg, 5mg dosing) [$702]',
        array: [
            {
                catalogItemCode: 'T-8-2.5',
                sigText:
                    'Month 1 Inject 31 units (2.5 mg of tirzepatide) subcutaneously once per week for weeks 1-4',
                internalSigText:
                    'Month 1 Inject 31 units (2.5 mg of tirzepatide) subcutaneously once per week for weeks 1-4',
                quantity: 1,
                daysSupply: 28,
            },
            {
                catalogItemCode: 'T-8-2.5',
                sigText:
                    'Month 2-3 Inject 63 units (5mg of tirzepatide) subcutaneously once per week for weeks 5-12',
                internalSigText:
                    'Month 2-3 Inject 63 units (5mg of tirzepatide) subcutaneously once per week for weeks 5-12',
                quantity: 2,
                daysSupply: 56,
            },
            {
                catalogItemCode: 'syringe-swab',
                sigText: 'Use as Directed',
                internalSigText: 'Use as Directed',
                quantity: 20,
                daysSupply: 84,
            },
        ],
    },
    // tirzepatide var 7, index 15
    {
        selectDisplayName:
            '[Bundle] Tirzepatide 60 mg total (2.5mg dosing and check in for further instructions) [$702]',
        array: [
            {
                catalogItemCode: 'T-8-2.5',
                sigText:
                    'Month 1 Inject 31 units (2.5 mg of tirzepatide) subcutaneously once per week for weeks 1-4',
                internalSigText:
                    'Month 1 Inject 31 units (2.5 mg of tirzepatide) subcutaneously once per week for weeks 1-4',
                quantity: 1,
                daysSupply: 28,
            },
            {
                catalogItemCode: 'T-8-2.5',
                sigText:
                    'Months 2-3 Inject 31 units ( 2.5 mg of tirzepatide) subcutaneously once per week for weeks 5-12 or check-in with your provider for further instructions',
                internalSigText:
                    'Months 2-3 Inject 31 units ( 2.5 mg of tirzepatide) subcutaneously once per week for weeks 5-12 or check-in with your provider for further instructions',
                quantity: 2,
                daysSupply: 56,
            },
            {
                catalogItemCode: 'syringe-swab',
                sigText: 'Use as Directed',
                internalSigText: 'Use as Directed',
                quantity: 20,
                daysSupply: 84,
            },
        ],
    },
    // tirzepatide var 8, index 16
    {
        selectDisplayName:
            '[Bundle] Tirzepatide 88 mg total (5mg dosing and check in for further instructions) [$1186.92]',
        array: [
            {
                catalogItemCode: 'T-8-2.5',
                sigText:
                    'Month 1 (Weeks 1-4) Inject 60 units (5 mg) subcutaneously once per week for 4 weeks ' +
                    'Month 2 (Weeks 5-8) Inject 44 units (7.5 mg) subcutaneously once per week for 4 weeks ' +
                    'Month 3 (Weeks 9-12) Inject 44 units (7.5 mg) subcutaneously once per week for 4 weeks',
                internalSigText:
                    'Month 1 (Weeks 1-4) Inject 60 units (5 mg) subcutaneously once per week for 4 weeks ' +
                    'Month 2 (Weeks 5-8) Inject 44 units (7.5 mg) subcutaneously once per week for 4 weeks ' +
                    'Month 3 (Weeks 9-12) Inject 44 units (7.5 mg) subcutaneously once per week for 4 weeks',
                quantity: 1,
                daysSupply: 28,
            },
            {
                catalogItemCode: 'T-17-2',
                sigText:
                    'Month 1 (Weeks 1-4) Inject 60 units (5 mg) subcutaneously once per week for 4 weeks ' +
                    'Month 2 (Weeks 5-8) Inject 44 units (7.5 mg) subcutaneously once per week for 4 weeks ' +
                    'Month 3 (Weeks 9-12) Inject 44 units (7.5 mg) subcutaneously once per week for 4 weeks',
                internalSigText:
                    'Month 1 (Weeks 1-4) Inject 60 units (5 mg) subcutaneously once per week for 4 weeks ' +
                    'Month 2 (Weeks 5-8) Inject 44 units (7.5 mg) subcutaneously once per week for 4 weeks ' +
                    'Month 3 (Weeks 9-12) Inject 44 units (7.5 mg) subcutaneously once per week for 4 weeks',
                quantity: 2,
                daysSupply: 56,
            },
            {
                catalogItemCode: 'syringe-swab',
                sigText: 'Use as Directed',
                internalSigText: 'Use as Directed',
                quantity: 20,
                daysSupply: 84,
            },
        ],
    },
    // tirzepatide var 9, index 17
    {
        selectDisplayName:
            '[Bundle] Tirzepatide 102 mg total (7.5mg, 7.5mg, 7.5mg dosing) [$1399.00]',
        array: [
            {
                catalogItemCode: 'T-17-2',
                sigText:
                    'Months 1-3 Inject 44 units (7.5 mg of tirzepatide) subcutaneously once per week for weeks 1-12',
                internalSigText:
                    'Months 1-3 Inject 44 units (7.5 mg of tirzepatide) subcutaneously once per week for weeks 1-12',
                quantity: 3,
                daysSupply: 84,
            },
            {
                catalogItemCode: 'syringe-swab',
                sigText: 'Use as Directed',
                internalSigText: 'Use as Directed',
                quantity: 20,
                daysSupply: 84,
            },
        ],
    },
    // tirzepatide var 12, index 18
    {
        selectDisplayName:
            '[Bundle] Trizepatide 120 mg total (10 mg dosing) [$1599.00]',
        array: [
            {
                catalogItemCode: 'T-17-4',
                sigText:
                    'Inject 59 units or 0.59 ML (10 mg) subcutaneously once per week for 12 weeks',
                internalSigText:
                    'Inject 59 units or 0.59 ML (10 mg) subcutaneously once per week for 12 weeks',
                quantity: 2,
                daysSupply: 84,
            },
            {
                catalogItemCode: 'syringe-swab',
                sigText: 'Use as Directed',
                internalSigText: 'Use as Directed',
                quantity: 20,
                daysSupply: 84,
            },
        ],
    },
    // tirzepatide var 13, index 19
    {
        selectDisplayName:
            '[Bundle] Trizepatide 150 mg total (12.5 mg dosing) [$2299]',
        array: [
            {
                catalogItemCode: 'T-17-2',
                sigText:
                    'Inject 74 units or 0.74 ML (12.5 mg) subcutaneously once per week for 12 weeks',

                internalSigText:
                    'Inject 74 units or 0.74 ML (12.5 mg) subcutaneously once per week for 12 weeks',
                quantity: 1,
                daysSupply: 28,
            },
            {
                catalogItemCode: 'T-17-4',
                sigText:
                    'Inject 74 units or 0.74 ML (12.5 mg) subcutaneously once per week for 12 weeks',

                internalSigText:
                    'Inject 74 units or 0.74 ML (12.5 mg) subcutaneously once per week for 12 weeks',
                quantity: 2,
                daysSupply: 56,
            },
            {
                catalogItemCode: 'syringe-swab',
                sigText: 'Use as Directed',
                internalSigText: 'Use as Directed',
                quantity: 20,
                daysSupply: 84,
            },
        ],
    },
    //Bella 5 Oral Weight-Loss, var 0 index 20
    {
        selectDisplayName:
            'BIOVERSE Weight Loss Capsules (Burproprion HCL / Naltrexone HCL / Topiramate) [$75.00]',
        array: [
            {
                catalogItemCode: 'BELLA-5',
                sigText: 'Take 1 capsule by mouth daily',
                internalSigText: 'Take 1 capsule by mouth daily',
                quantity: 30,
                daysSupply: 30,
            },
        ],
    },
    //Oral Weight-Loss, var 1 index 21
    {
        selectDisplayName:
            'BIOVERSE Weight Loss Capsules (Burproprion HCL / Naltrexone HCL / Topiramate) [$199.00]',
        array: [
            {
                catalogItemCode: 'BELLA-5',
                sigText: 'Take 1 capsule by mouth daily',
                internalSigText: 'Take 1 capsule by mouth daily',
                quantity: 90,
                daysSupply: 90,
            },
        ],
    },
    // NAD Nasal Spray Var 0 Index 22
    {
        selectDisplayName: 'NAD+ Nasal Spray 300 mg/mL (15 mL)',
        array: [
            {
                catalogItemCode: 'nad-nasal-spray',
                sigText:
                    'Administer 1-2 sprays in each nostril once or twice daily.',
                internalSigText:
                    'Administer 1-2 sprays in each nostril once or twice daily.',
                quantity: 1,
                daysSupply: 28,
            },
        ],
    },
];
