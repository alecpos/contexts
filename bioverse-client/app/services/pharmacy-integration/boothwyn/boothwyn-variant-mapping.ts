import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';

interface BoothwynVariantMapProps {
    [key: string]: {
        [key: number]: {
            mod?: number;
            sku: string | number;
            amount: number;
            unit: string;
            daysSupply: number;
            notes: string;
            instructions: string;
        }[];
    };
}

interface BoothwynSKUNameMap {
    [key: string]: string;
}

interface BoothwynAllowedMap {
    [key: string]: number[];
}

interface BootwynQuarterlyProgramMap {
    [key: string]: number[];
}

export const boothwynProviderObject = {
    fullName: 'Dr. Bobby Desai',
    licenses: [
        {
            type: 'npi',
            value: '1013986835',
        },
    ],
};

export const BOOTHWYN_ALLOWED_PRODUCT_MAP: BoothwynAllowedMap = {
    semaglutide: [
        22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 45, 46, 47, 48, 49, 50, 51, 52,
        53, 54, 60, 61, 62, 63,
    ],
    tirzepatide: [
        30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 42, 43, 44, 45, 46, 52, 53, 54,
        55, 56,
    ],
    'b12-injection': [],
    zofran: [],
    'nad-injection': [],
    'nad-nasal-spray': [],
    sermorelin: [0, 1, 2, 3],
};

export const BOOTHWYN_QUARTERLY_PROGRAM_VARIANTS: BootwynQuarterlyProgramMap = {
    semaglutide: [26, 27, 28, 29, 30, 31, 49, 50, 51, 52, 53, 54],
    tirzepatide: [35, 36, 37, 38, 39],
    'b12-injction': [],
    zofran: [],
    'nad-injection': [],
    'nad-nasal-spray': [],
    sermorelin: [2, 3],
};

export const BOOTHWYN_SKU_NAME_MAP: BoothwynSKUNameMap = {
    //SEMAGLUTIDE
    12299: 'Semaglutide 2.5 mg/mL (0.4 mL)',
    12300: 'Semaglutide 2.5 mg/mL (0.8 mL)',
    11715: 'Semaglutide 2.5 mg/mL (2 mL)',
    11717: 'Semaglutide 2.5 mg/mL (4 mL)', // don't use any more 
    11437: 'Semaglutide 5 mg/mL (2 mL)',

    //TIRZEPATIDE
    11909: 'Tirzepatide 10mg/mL (1 mL)',
    11908: 'Tirzepatide 10mg/mL (2 mL)',
    11910: 'Tirzepatide 10mg/mL (3 mL)',
    12298: 'Tirzepatide 10mg/mL (4 mL)',
    12401: 'Tirzepatide 10mg/mL (5 mL)',
    12402: 'Tirzepatide 10mg/mL (6 mL)',

    //NON-WEIGHT LOSS
    124333: 'Glutathione 200 mg/mL (10 mL)',
    11301: 'Methylcobalamin 5 mg/mL (30 mL)',
    12272: 'Ondansetron 4 mg Tablets (30)',
    12204: 'Sermorelin 2 mg/mL (5 mL) Inj Solution',
    12422: 'NAD+ 100 mg/mL (5 mL)  Inj Solution',
    12449: 'NAD+ Nasal Spray 300 mg/mL (15 mL) ',

    12564: 'Semaglutide 2.5 mg/mL / Glycine 5 mg/mL / Methylcobalamin 5 mg/mL (0.4 mL) Inj Solution w Admin Kit',
    12565: 'Semaglutide 2.5 mg/mL / Glycine 5 mg/mL / Methylcobalamin 5 mg/mL (0.8 mL) Inj Solution w Admin Kit',
    12567: 'Semaglutide 2.5 mg/mL / Glycine 5 mg/mL / Methylcobalamin 5 mg/mL (3 mL) Inj Solution with Admin Kit',
    12568: 'Semaglutide 2.5 mg/mL / Glycine 5 mg/mL / Methylcobalamin 5 mg/mL (4 mL) Inj Solution with Admin Kit', //use this instead of 11717

    12850: 'TIRZEPATIDE 17 mg/mL / GLYCINE 5 mg/mL / METHYLCOBALAMIN 5 mg/mL (1 ML) INJ SOLUTION WITH ADMIN KIT',
    12851: 'TIRZEPATIDE 17 mg/mL / GLYCINE 5 mg/mL / METHYLCOBALAMIN 5 mg/mL (1.5 ML) INJ SOLUTION WITH ADMIN KIT',
    12852: 'TIRZEPATIDE 17 mg/mL / GLYCINE 5 mg/mL / METHYLCOBALAMIN 5 mg/mL (2 ML) INJ SOLUTION WITH ADMIN KIT',
    12853: 'TIRZEPATIDE 17 mg/mL / GLYCINE 5 mg/mL / METHYLCOBALAMIN 5 mg/mL (3 ML) INJ SOLUTION WITH ADMIN KIT',

    12874: 'Semaglutide 2.5 mg/mL / NAD 50 mg/mL/ Methylcobalamin 5 mg/mL (0.4 mL) Inj Solution w Admin Kit',
    12875: 'Semaglutide 2.5 mg/mL / NAD 50 mg/mL / Methylcobalamin 5 mg/mL (0.8 mL) Inj Solution w Admin Kit',
    12876: 'Semaglutide 2.5 mg/mL / NAD 50 mg/mL/ Methylcobalamin 5 mg/mL (1.6 mL) Inj Solution w Admin Kit',
    12877: 'Semaglutide 2.5 mg/mL / NAD 50 mg/mL/ Methylcobalamin 5 mg/mL (3 mL) Inj Solution with Admin Kit',
    12878: 'Semaglutide 2.5 mg/mL / NAD 50 mg/mL/ Methylcobalamin 5 mg/mL (4 mL) Inj Solution with Admin Kit',

    12856: 'TIRZEPATIDE 17 mg/mL / NAD 50 mg/mL / METHYLCOBALAMIN 5 mg/mL (1 ML) INJ SOLUTION WITH ADMIN KIT',
    12857: 'TIRZEPATIDE 17 mg/mL / NAD 50 mg/mL / METHYLCOBALAMIN 5 mg/mL (1.5 ML) INJ SOLUTION WITH ADMIN KIT',
    12858: 'TIRZEPATIDE 17 mg/mL / NAD 50 mg/mL / METHYLCOBALAMIN 5 mg/mL (2 ML) INJ SOLUTION WITH ADMIN KIT',
    12859: 'TIRZEPATIDE 17 mg/mL / NAD 50 mg/mL / METHYLCOBALAMIN 5 mg/mL (3 ML) INJ SOLUTION WITH ADMIN KIT',
};


export const BOOTHWYN_UNITS_PER_MG_MAP = {
    [PRODUCT_HREF.SEMAGLUTIDE as PRODUCT_HREF]: {
        '12299': 40,
        '12300': 40,
        '11715': 20,
        '11717': 20,
        '12567': 40,
        '12568': 40,
        '12564': 40,
        '12565': 40,
        '12874': 40,
        '12875': 40,
        '12876': 40,
        '12878': 40,
    },
    [PRODUCT_HREF.TIRZEPATIDE as PRODUCT_HREF]: {
        '11909': 10,
        '11908': 10,
        '11910': 10,
        '12298': 10,
        '12401': 10,
        '12850': 6,
        '12851': 6,
        '12852': 5.9,
        '12853': 5.9,
        '12856': 6,
        '12857': 5.8,
        '12858': 5.9,
        '12859': 5.9,
    },
}


export const BOOTHWYN_VARIANT_MAP: BoothwynVariantMapProps = {
    semaglutide: {
        22: [
            {
                sku: '12299', //BVSEMA1
                amount: 1,
                unit: 'each',
                daysSupply: 30,
                notes: '',
                instructions:
                    'Inject 10 units (0.25mg) subcutaneously once weekly (Discard unused medication 28 days after first use)',
            },
        ],
        23: [
            {
                sku: '12300', //BVSEMA2
                amount: 1,
                unit: 'each',
                daysSupply: 30,
                notes: '',
                instructions:
                    'Inject 20 units (0.5mg) subcutaneously once weekly (Discard unused medication 28 days after first use)',
            },
        ],
        24: [
            {
                sku: '11715', //BVSEMA3
                amount: 1,
                unit: 'each',
                daysSupply: 30,
                notes: '',
                instructions:
                    'Inject 50 units (1.25mg) subcutaneously once weekly (Discard unused medication 28 days after first use)',
            },
        ],
        25: [
            {
                sku: '11717', //BVSEMA5
                amount: 1,
                unit: 'each',
                daysSupply: 30,
                notes: '',
                instructions:
                    'Inject  100 units (2.5 mg) subcutaneously once weekly (Discard unused medication 28 days after first use)',
            },
        ],
        26: [
            {
                mod: 1,
                sku: '12299', //BVSEMA1
                amount: 1,
                unit: 'each',
                daysSupply: 30,
                notes: '',
                instructions:
                    'Month 1 Inject 10 units (0.25mg) subcutaneously once weekly (Discard unused medication 28 days after first use)',
            },
            {
                mod: 2,
                sku: '12300', //BVSEMA2
                amount: 1,
                unit: 'each',
                daysSupply: 30,
                notes: '',
                instructions:
                    'Month 2 Inject 20 units (0.5mg) subcutaneously once weekly (Discard unused medication 28 days after first use)',
            },
            {
                mod: 3,
                sku: '11715', //BVSEMA3
                amount: 1,
                unit: 'each',
                daysSupply: 30,
                notes: '',
                instructions:
                    'Month 3 Inject 50 units (1.25mg) subcutaneously once weekly (Discard unused medication 28 days after first use)',
            },
        ],
        27: [
            {
                mod: 1,
                sku: '11715', //BVSEMA3
                amount: 3,
                unit: 'each',
                daysSupply: 90,
                notes: '',
                instructions:
                    'Month 1-3 Inject 50 units (1.25mg) subcutaneously once weekly (Discard unused medication 28 days after first use)',
            },
        ],
        28: [
            {
                mod: 1,
                sku: '12300', //BVSEMA2
                amount: 1,
                unit: 'each',
                daysSupply: 30,
                notes: '',
                instructions:
                    'Month 1 Inject 20 units (0.5mg) subcutaneously once weekly (Discard unused medication 28 days after first use)',
            },
            {
                mod: 2,
                sku: '11715',
                amount: 1,
                unit: 'each',
                daysSupply: 30,
                notes: '',
                instructions:
                    'Month 2 Inject 50 units (1.25mg) subcutaneously once weekly (Discard unused medication 28 days after first use)',
            },
            {
                mod: 3,
                sku: '11717',
                amount: 1,
                unit: 'each',
                daysSupply: 30,
                notes: '',
                instructions:
                    'Month 3 Inject  100 units (2.5 mg) subcutaneously once weekly (Discard unused medication 28 days after first use)',
            },
        ],

        29: [
            {
                mod: 1,
                sku: '11715',
                amount: 1,
                unit: 'each',
                daysSupply: 30,
                notes: '',
                instructions:
                    'Month 1  Inject 50 units (1.25mg) subcutaneously once weekly (Discard unused medication 28 days after first use)',
            },
            {
                mod: 2,
                sku: '11717',
                amount: 2,
                unit: 'each',
                daysSupply: 60,
                notes: '',
                instructions:
                    'Month 2-3 Inject  100 units (2.5 mg) subcutaneously once weekly (Discard unused medication 28 days after first use)',
            },
        ],
        30: [
            {
                mod: 1,
                sku: '11717',
                amount: 3,
                unit: 'each',
                daysSupply: 90,
                notes: '',
                instructions:
                    'Month 1-3 Inject  100 units (2.5 mg) subcutaneously once weekly (Discard unused medication 28 days after first use)',
            },
        ],
        31: [
            {
                mod: 1,
                sku: '11715',
                amount: 2,
                unit: 'each',
                daysSupply: 60,
                notes: '',
                instructions:
                    'Month 1-2  Inject 50 units (1.25mg) subcutaneously once weekly (Discard unused medication 28 days after first use)',
            },
            {
                mod: 2,
                sku: '11717',
                amount: 1,
                unit: 'each',
                daysSupply: 30,
                notes: '',
                instructions:
                    'Month 3 Inject  100 units (2.5 mg) subcutaneously once weekly (Discard unused medication 28 days after first use)',
            },
        ],

        45: [
            {
                sku: '12564',
                amount: 1,
                unit: 'each',
                daysSupply: 30,
                notes: '',
                instructions:
                    'Inject 10 units (0.25 mg) subcutaneously once a week for 4 weeks',
            },
        ],

        46: [
            {
                sku: '12565',
                amount: 1,
                unit: 'each',
                daysSupply: 30,
                notes: '',
                instructions:
                    'Inject 20 units (0.5 mg) subcutaneously once a week for 4 weeks',
            },
        ],

        47: [
            {
                sku: '12567',
                amount: 1,
                unit: 'each',
                daysSupply: 30,
                notes: '',
                instructions:
                    'Inject 50 units (1.25 mg) subcutaneously once a week for 4 weeks ',
            },
        ],

        48: [
            {
                sku: '12568',
                amount: 1,
                unit: 'each',
                daysSupply: 30,
                notes: '',
                instructions:
                    'Inject 100 units (2.5 mg) subcutaneously once a week for 4 weeks',
            },
        ],

        49: [
            {
                mod: 1,
                sku: '12564',
                amount: 1,
                unit: 'each',
                daysSupply: 90,
                notes: '',
                instructions:
                    'Month 1 Inject 10 units (0.25mg) subcutaneously once weekly (Discard unused medication 28 days after first use)',
            },
            {
                mod: 2,
                sku: '12565',
                amount: 1,
                unit: 'each',
                daysSupply: 90,
                notes: '',
                instructions:
                    'Month 2 Inject 20 units (0.5mg) subcutaneously once weekly (Discard unused medication 28 days after first use)',
            },
            {
                mod: 3,
                sku: '12567',
                amount: 1,
                unit: 'each',
                daysSupply: 90,
                notes: '',
                instructions:
                    'Month 3 Inject 50 units (1.25mg) subcutaneously once weekly (Discard unused medication 28 days after first use)',
            },
        ],

        50: [
            {
                mod: 1,
                sku: '12567',
                amount: 3,
                unit: 'each',
                daysSupply: 90,
                notes: '',
                instructions:
                    'Month 1-3 Inject 50 units (1.25mg) subcutaneously once weekly (Discard unused medication 28 days after first use)',
            },
        ],

        51: [
            {
                mod: 1,
                sku: '12567',
                amount: 2,
                unit: 'each',
                daysSupply: 90,
                notes: '',
                instructions:
                    'Month 1-2  Inject 50 units (1.25mg) subcutaneously once weekly (Discard unused medication 28 days after first use)',
            },
            {
                mod: 2,
                sku: '12568',
                amount: 1,
                unit: 'each',
                daysSupply: 90,
                notes: '',
                instructions:
                    'Month 3 Inject  100 units (2.5 mg) subcutaneously once weekly (Discard unused medication 28 days after first use)',
            },
        ],

        52: [
            {
                mod: 1,
                sku: '12565',
                amount: 1,
                unit: 'each',
                daysSupply: 90,
                notes: '',
                instructions:
                    'Month 1 Inject 20 units (0.5mg) subcutaneously once weekly (Discard unused medication 28 days after first use)',
            },
            {
                mod: 2,
                sku: '12567',
                amount: 1,
                unit: 'each',
                daysSupply: 90,
                notes: '',
                instructions:
                    'Month 2 Inject 50 units (1.25mg) subcutaneously once weekly (Discard unused medication 28 days after first use)',
            },
            {
                mod: 3,
                sku: '12568',
                amount: 1,
                unit: 'each',
                daysSupply: 90,
                notes: '',
                instructions:
                    'Month 3 Inject 100 units (2.5mg) subcutaneously once weekly (Discard unused medication 28 days after first use)',
            },
        ],

        53: [
            {
                mod: 1,
                sku: '12567',
                amount: 1,
                unit: 'each',
                daysSupply: 90,
                notes: '',
                instructions:
                    'Month 1  Inject 50 units (1.25mg) subcutaneously once weekly (Discard unused medication 28 days after first use)',
            },
            {
                mod: 2,
                sku: '12568',
                amount: 2,
                unit: 'each',
                daysSupply: 90,
                notes: '',
                instructions:
                    'Month 2-3 Inject  100 units (2.5 mg) subcutaneously once weekly (Discard unused medication 28 days after first use)',
            },
        ],

        54: [
            {
                mod: 1,
                sku: '12568',
                amount: 3,
                unit: 'each',
                daysSupply: 90,
                notes: '',
                instructions:
                    'Month 1-3 Inject 100 units (2.5mg) subcutaneously once weekly (Discard unused medication 28 days after first use)',
            },
        ],

        60: [
            {
                sku: '12874',
                amount: 1,
                unit: 'each',
                daysSupply: 30,
                notes: '',
                instructions:
                    'Inject 10 units (0.25 mg) subcutaneously once a week for 4 weeks',
            },
        ],

        61: [
            {
                sku: '12875',
                amount: 1,
                unit: 'each',
                daysSupply: 30,
                notes: '',
                instructions:
                    'Inject 20 units (0.5 mg) subcutaneously once a week for 4 weeks',
            },
        ],

        62: [
            {
                sku: '12877',
                amount: 1,
                unit: 'each',
                daysSupply: 30,
                notes: '',
                instructions:
                    'Inject 50 units (1.25 mg) subcutaneously once a week for 4 weeks',
            },
        ],

        63: [
            {
                sku: '12878',
                amount: 1,
                unit: 'each',
                daysSupply: 30,
                notes: '',
                instructions:
                    'Inject 100 units (2.5 mg) subcutaneously once a week for 4 weeks',
            },
        ],
    },

    tirzepatide: {
        30: [
            {
                sku: '11909', // BVTIRZ1
                amount: 1,
                unit: 'each',
                daysSupply: 30,
                notes: '',
                instructions:
                    'Inject 25 units (2.5mg) subcutaneously once weekly (Discard unused medication 28 days after first use)',
            },
        ],
        31: [
            {
                sku: '11908', //BVTIRZ2
                amount: 1,
                unit: 'each',
                daysSupply: 30,
                notes: '',
                instructions:
                    'Inject 50 units (5mg) subcutaneously once weekly (Discard unused medication 28 days after first use)',
            },
        ],
        32: [
            {
                sku: '11910', //BVTIRZ3
                amount: 1,
                unit: 'each',
                daysSupply: 30,
                notes: '',
                instructions:
                    'Inject 75 units (7.5mg) subcutaneously once weekly (Discard unused medication 28 days after first use)',
            },
        ],
        33: [
            {
                sku: '12298', //BVTIRZ4
                amount: 1,
                unit: 'each',
                daysSupply: 30,
                notes: '',
                instructions:
                    'Inject 100 units (10mg) subcutaneoulsy once weekly (Discard unused medication 28 days after first use)',
            },
        ],
        34: [
            {
                sku: '12401', //BVTIRZ5
                amount: 1,
                unit: 'each',
                daysSupply: 30,
                notes: '',
                instructions:
                    'Inject 125 units (12.5mg) subcutaneously once weekly (Discard unused medication 28 days after first use)',
            },
        ],
        35: [
            {
                mod: 1,
                sku: '11909', // BVTIRZ1
                amount: 1,
                unit: 'each',
                daysSupply: 30,
                notes: '',
                instructions:
                    'Month 1: Inject 25 units (2.5mg) weekly x 4 weeks',
            },
            {
                mod: 2,
                sku: '11908', //BVTIRZ2
                amount: 2,
                unit: 'each',
                daysSupply: 60,
                notes: '',
                instructions:
                    'Month 2 and 3: Inject 50 units (5 mg) weekly x 4 weeks',
            },
        ],
        36: [
            {
                mod: 1,
                sku: '11908', //BVTIRZ2
                amount: 1,
                unit: 'each',
                daysSupply: 30,
                notes: '',
                instructions:
                    'Month 1: Inject 50 units (5 mg) weekly x 4 weeks',
            },
            {
                mod: 2,
                sku: '11910', //BVTIRZ3
                amount: 2,
                unit: 'each',
                daysSupply: 60,
                notes: '',
                instructions:
                    'Month 2 and 3: Inject 75 units (7.5mg) weekly x 4 weeks',
            },
        ],
        37: [
            {
                mod: 1,
                sku: '11910', //BVTIRZ3
                amount: 3,
                unit: 'each',
                daysSupply: 90,
                notes: '',
                instructions:
                    'Months 1 - 3: Inject 75 units (7.5mg) weekly x 4 weeks',
            },
        ],
        38: [
            {
                mod: 1,
                sku: '12298', //BVTIRZ4
                amount: 3,
                unit: 'each',
                daysSupply: 90,
                notes: '',
                instructions:
                    'Months 1 - 3: Inject 100 units (10mg) weekly x 4 weeks',
            },
        ],
        39: [
            {
                mod: 1,
                sku: '12401', //BVTIRZ5
                amount: 3,
                unit: 'each',
                daysSupply: 90,
                notes: '',
                instructions:
                    'Months 1 - 3: Inject 125 units (12.5mg) weekly x 4 weeks',
            },
        ],

        42: [
            {
                sku: '12850',
                amount: 1,
                unit: 'each',
                daysSupply: 30,
                notes: '',
                instructions:
                    'Inject 15 units (2.5 mg) subcutaneously once a week for 4 weeks',
            },
        ],

        43: [
            {
                sku: '12851',
                amount: 1,
                unit: 'each',
                daysSupply: 30,
                notes: '',
                instructions:
                    'Inject 30 units (5mg) subcutaneously once a week for 4 weeks',
            },
        ],

        44: [
            {
                sku: '12852',
                amount: 1,
                unit: 'each',
                daysSupply: 30,
                notes: '',
                instructions:
                    'Inject 44 units (7.5mg) subcutaneously once a week for 4 weeks ',
            },
        ],

        45: [
            {
                sku: '12853',
                amount: 1,
                unit: 'each',
                daysSupply: 30,
                notes: '',
                instructions:
                    'Inject 59 units (10mg) subcutaneously once a week for 4 weeks',
            },
        ],

        46: [
            {
                sku: '12853',
                amount: 1,
                unit: 'each',
                daysSupply: 30,
                notes: '',
                instructions:
                    'Inject 74 units (12.5mg) subcutaneously once a week for 4 weeks',
            },
        ],

        52: [
            {
                sku: '12856',
                amount: 1,
                unit: 'each',
                daysSupply: 30,
                notes: '',
                instructions:
                    'Inject 15 units (2.5mg) subcutaneously once every week',
            },
        ],

        53: [
            {
                sku: '12857',
                amount: 1,
                unit: 'each',
                daysSupply: 30,
                notes: '',
                instructions:
                    'Inject 29 units (5mg) subcutaneously once every week',
            },
        ],

        54: [
            {
                sku: '12858',
                amount: 1,
                unit: 'each',
                daysSupply: 30,
                notes: '',
                instructions:
                    'Inject 44 units (7.5mg) subcutaneously once every week',
            },
        ],

        55: [
            {
                sku: '12859',
                amount: 1,
                unit: 'each',
                daysSupply: 30,
                notes: '',
                instructions:
                    'Inject 59 units (10mg) subcutaneously once every week',
            },
        ],

        56: [
            {
                sku: '12859',
                amount: 1,
                unit: 'each',
                daysSupply: 30,
                notes: '',
                instructions:
                    'Inject 74 units (12.5mg) subcutaneously once every week',
            },
        ],
    },
    sermorelin: {
        0: [
            {
                sku: '12204',
                amount: 1,
                unit: 'each',
                daysSupply: 30,
                notes: '',
                instructions: 'Inject as directed (monthly, 1 vial)',
            },
        ],
        1: [
            {
                sku: '12204',
                amount: 1,
                unit: 'each',
                daysSupply: 30,
                notes: '',
                instructions: 'Inject as directed (monthly, 1 vial)',
            },
        ],
        2: [
            {
                sku: '12204',
                amount: 3,
                unit: 'each',
                daysSupply: 90,
                notes: '',
                instructions: 'Inject as directed (quarterly, 3 vials)',
            },
        ],
        3: [
            {
                sku: '12204',
                amount: 6,
                unit: 'each',
                daysSupply: 180,
                notes: '',
                instructions: 'Inject as directed (biannual, 6 vials)',
            },
        ],
    },
};

interface BoothwynVariantProductDescriptorMap {
    [key: string]: {
        [key: number]: string;
    };
}

export const BOOTHWYN_VARIANT_PRODUCT_DESCRIPTOR_MAP: BoothwynVariantProductDescriptorMap =
    {
        semaglutide: {
            22: '[monthly] Semaglutide 0.25 mg dose',
            23: '[monthly] Semaglutide 0.5 mg dose',
            24: '[monthly] Semaglutide 1.25 mg dose',
            25: '[monthly] Semaglutide 2.5 mg dose',
            26: '[quarterly] Semaglutide (0.25 mg, 0.5 mg, 1.25 mg) dose',
            27: '[quarterly] Semaglutide (1.25 mg, 1.25  mg, 1.25 mg) dose',
            28: '[quarterly] Semaglutide (0.5 mg, 1.25 mg, 2.5 mg) dose',
            29: '[quarterly] Semaglutide (1.25 mg, 2.5 mg, 2.5 mg) dose',
            30: '[quarterly] Semaglutide (2.5 mg, 2.5 mg, 2.5 mg) dose',
            31: '[quarterly] Semaglutide (1.25mg, 1.25mg, 2.5mg) dose',
            45: '[monthly] Semaglutide 0.25 mg dose with Glycine/B12',
            46: '[monthly] Semaglutide 0.5 mg dose with Glycine/B12',
            47: '[monthly] Semaglutide 1.0 mg dose with Glycine/B12',
            48: '[monthly] Semaglutide 2.5 mg dose with Glycine/B12',
            49: '[quarterly] Semaglutide (0.25 mg, 0.5 mg, 1.25 mg) dose with Glycine/B12',
            50: '[quarterly] Semaglutide (1.25 mg, 1.25 mg, 1.25 mg) dose with Glycine/B12',
            51: '[quarterly] Semaglutide (0.5 mg, 1.25 mg, 2.5 mg) dose with Glycine/B12',
            52: '[quarterly] Semaglutide (1.25 mg, 2.5 mg, 2.5 mg) dose with Glycine/B12',
            53: '[quarterly] Semaglutide (1.25 mg, 2.5 mg, 2.5 mg) dose with Glycine/B12',
            54: '[quarterly] Semaglutide (2.5 mg, 2.5 mg, 2.5 mg) dose with Glycine/B12',
            60: '[monthly] Semaglutide 0.25 mg dose with NAD/B12',
            61: '[monthly] Semaglutide 0.5 mg dose with NAD/B12',
            62: '[monthly] Semaglutide 1.25 mg dose with NAD/B12',
            63: '[monthly] Semaglutide 2.5 mg dose with NAD/B12',
        },
        tirzepatide: {
            30: '[monthly] Tirzepatide 2.5 mg dose',
            31: '[monthly] Tirzepatide 5 mg dose',
            32: '[monthly] Tirzepatide 7.5 mg dose',
            33: '[monthly] Tirzepatide 10 mg dose',
            34: '[monthly] Tirzepatide 12.5 mg dose',
            35: '[quarterly] Tirzepatide (2.5 mg, 5 mg, 5 mg) dose',
            36: '[quarterly] Tirzepatide (5 mg, 7.5 mg, 7.5 mg) dose',
            37: '[quarterly] Tirzepatide (7.5 mg, 7.5 mg, 7.5 mg) dose',
            38: '[quarterly] Tirzepatide (10 mg, 10 mg, 10 mg) dose',
            39: '[quarterly] Tirzepatide (12.5 mg, 12.5 mg, 12.5 mg) dose',
            42: '[monthly] Tirzepatide 2.5 mg dose with Glycine/B12',
            43: '[monthly] Tirzepatide 5 mg dose with Glycine/B12',
            44: '[monthly] Tirzepatide 7.5 mg dose with Glycine/B12',
            45: '[monthly] Tirzepatide 10 mg dose with Glycine/B12',
            46: '[monthly] Tirzepatide 12.5 mg dose with Glycine/B12',
            52: '[monthly] Tirzepatide 2.5 mg dose with NAD/B12',
            53: '[monthly] Tirzepatide 5 mg dose with NAD/B12',
            54: '[monthly] Tirzepatide 7.5 mg dose with NAD/B12',
            55: '[monthly] Tirzepatide 10 mg dose with NAD/B12',
            56: '[monthly] Tirzepatide 12.5 mg dose with NAD/B12',
        },
    };
