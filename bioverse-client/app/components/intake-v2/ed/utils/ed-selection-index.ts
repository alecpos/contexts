interface SingleDosageProductMapInterface {
    [key: string]: {
        [key: string]: string;
    };
}
export const SINGLE_DOSE_PRODUCT_MAP: SingleDosageProductMapInterface = {
    'peak-chews': {
        daily: '8.5 mg',
    },
    'x-chews': {
        daily: '100iu/5mg',
        'as-needed': '100iu/5mg',
    },
    'x-melts': {
        daily: '100iu/5mg',
        'as-needed': '100iu/5mg',
    },
    'rush-chews': {
        daily: '36 mg',
    },
    'rush-melts': {
        'as-needed': '81mg/12mg',
    },
};

interface DosageSelectionMapED {
    [key: string]: {
        [key: string]: {
            dosage: string;
            cost: number;
            recommended: boolean;
        }[];
    };
}

export const DOSAGE_SELECTION_MAP: DosageSelectionMapED = {
    'peak-chews': {
        'as-needed': [
            {
                dosage: '8.5 mg',
                cost: 4.97,
                recommended: true,
            },
            // {
            //     dosage: '20mg',
            //     cost: 4.99,
            //     recommended: false,
            // },
        ],
    },
    'rush-chews': {
        daily: [
            {
                dosage: '36 mg',
                cost: 2.05,
                recommended: true,
            },
            // {
            //     dosage: '60mg',
            //     cost: 2.11,
            //     recommended: false,
            // },
        ],
        'as-needed': [
            {
                dosage: '36 mg',
                cost: 2.91,
                recommended: true,
            },
            {
                dosage: '60 mg',
                cost: 3.22,
                recommended: false,
            },
            // {
            //     dosage: '50mg',
            //     cost: 4.58,
            //     recommended: false,
            // },
            // {
            //     dosage: '100mg',
            //     cost: 8.71,
            //     recommended: false,
            // },
        ],
    },
    tadalafil: {
        daily: [
            {
                dosage: '5mg',
                cost: 1.05,
                recommended: false,
            },
            {
                dosage: '10mg',
                cost: 1.08,
                recommended: true,
            },
            // {
            //     dosage: '20mg',
            //     cost: 1.11,
            //     recommended: false,
            // },
        ],
        'as-needed': [
            {
                dosage: '10mg',
                cost: 4.53,
                recommended: true,
            },
            {
                dosage: '5mg',
                cost: 3.98,
                recommended: false,
            },
            {
                dosage: '20mg',
                cost: 7.18,
                recommended: false,
            },
        ],
    },
    sildenafil: {
        'as-needed': [
            {
                dosage: '25mg',
                cost: 7.33,
                recommended: true,
            },
            {
                dosage: '50mg',
                cost: 7.47,
                recommended: false,
            },
            {
                dosage: '100mg',
                cost: 7.62,
                recommended: false,
            },
        ],
    },
    viagra: {
        'as-needed': [
            {
                dosage: '50mg',
                cost: 163.55,
                recommended: true,
            },
            {
                dosage: '100mg',
                cost: 163.55,
                recommended: false,
            },
        ],
    },
    cialis: {
        'as-needed': [
            {
                dosage: '10 mg',
                cost: 84.84,
                recommended: true,
            },
            {
                dosage: '5 mg',
                cost: 84.84,
                recommended: false,
            },
            {
                dosage: '20 mg',
                cost: 84.84,
                recommended: false,
            },
        ],
    },
};

interface QuantitySelectionMapED {
    [key: string]: {
        [key: string]: {
            quantity: number;
            cost: string;
            mostPopular: boolean;
        }[];
    };
}

/**
 * Quantity selection does not have a frequency because all dailies will have 30 pills no matter what.
 */
export const QUANTITY_SELECTION_MAP: QuantitySelectionMapED = {
    'rush-melts': {
        '81mg/12mg': [
            { quantity: 10, cost: '4.82', mostPopular: true },
            { quantity: 8, cost: '4.94', mostPopular: true },
            { quantity: 6, cost: '4.97', mostPopular: true },
            { quantity: 4, cost: '6.21', mostPopular: true },
            { quantity: 16, cost: '4.26', mostPopular: false },
            { quantity: 14, cost: '4.27', mostPopular: false },
            { quantity: 12, cost: '4.26', mostPopular: false },
        ],
    },
    'x-chews': {
        '100iu/5mg': [
            { quantity: 10, cost: '6.15', mostPopular: true },
            { quantity: 8, cost: '6.23', mostPopular: true },
            { quantity: 6, cost: '7.47', mostPopular: true },
            // { quantity: 4, cost: '2.50', mostPopular: true },
            { quantity: 16, cost: '5.93', mostPopular: false },
            { quantity: 14, cost: '6.06', mostPopular: false },
            { quantity: 12, cost: '6.10', mostPopular: false },
        ],
    },
    'x-melts': {
        '100iu/5mg': [
            { quantity: 10, cost: '5.32', mostPopular: true },
            { quantity: 8, cost: '5.60', mostPopular: true },
            { quantity: 6, cost: '7.19', mostPopular: true },
            { quantity: 4, cost: '7.54', mostPopular: true },
            { quantity: 16, cost: '4.78', mostPopular: false },
            { quantity: 14, cost: '4.83', mostPopular: false },
            { quantity: 12, cost: '5.13', mostPopular: false },
        ],
    },
    tadalafil: {
        '5mg': [
            { quantity: 10, cost: '3.98', mostPopular: true },
            { quantity: 8, cost: '5.19', mostPopular: true },
            { quantity: 6, cost: '5.53', mostPopular: true },
            { quantity: 4, cost: '6.21', mostPopular: true },
            // { quantity: 16, cost: '0.08', mostPopular: false },
            { quantity: 14, cost: '4.62', mostPopular: false },
            { quantity: 12, cost: '4.85', mostPopular: false },
        ],
        '10mg': [
            { quantity: 10, cost: '4.82', mostPopular: true },
            { quantity: 8, cost: '5.81', mostPopular: true },
            { quantity: 6, cost: '5.53', mostPopular: true },
            { quantity: 4, cost: '7.04', mostPopular: true },
            { quantity: 16, cost: '4.53', mostPopular: false },
            { quantity: 14, cost: '5.11', mostPopular: false },
            { quantity: 12, cost: '4.53', mostPopular: false },
        ],
        '20mg': [
            // { quantity: 10, cost: '0.08', mostPopular: true },
            // { quantity: 8, cost: '0.08', mostPopular: true },
            // { quantity: 6, cost: '0.08', mostPopular: true },
            { quantity: 4, cost: '7.18', mostPopular: true },
            // { quantity: 16, cost: '0.08', mostPopular: false },
            // { quantity: 14, cost: '0.08', mostPopular: false },
            // { quantity: 12, cost: '0.08', mostPopular: false },
        ],
    },
    sildenafil: {
        '25mg': [{ quantity: 4, cost: '7.33', mostPopular: true }],
        '50mg': [{ quantity: 4, cost: '7.47', mostPopular: true }],
        '100mg': [{ quantity: 4, cost: '7.62', mostPopular: true }],
    },
    viagra: {
        '50mg': [
            { quantity: 10, cost: '166.22', mostPopular: true },
            { quantity: 8, cost: '165.78', mostPopular: true },
            { quantity: 6, cost: '165.03', mostPopular: true },
            { quantity: 4, cost: '163.55', mostPopular: true },
            { quantity: 16, cost: '166.89', mostPopular: false },
            { quantity: 14, cost: '166.73', mostPopular: false },
            { quantity: 12, cost: '166.52', mostPopular: false },
        ],
        '100mg': [
            { quantity: 10, cost: '166.22', mostPopular: true },
            { quantity: 8, cost: '165.78', mostPopular: true },
            { quantity: 6, cost: '165.03', mostPopular: true },
            { quantity: 4, cost: '165.55', mostPopular: true },
            { quantity: 16, cost: '166.89', mostPopular: false },
            { quantity: 14, cost: '166.73', mostPopular: false },
            { quantity: 12, cost: '166.52', mostPopular: false },
        ],
    },
    cialis: {
        '5 mg': [
            { quantity: 10, cost: '87.01', mostPopular: true },
            { quantity: 8, cost: '86.42', mostPopular: true },
            { quantity: 6, cost: '86.35', mostPopular: true },
            { quantity: 4, cost: '86.84', mostPopular: true },
            { quantity: 16, cost: '87.21', mostPopular: false },
            { quantity: 14, cost: '87.10', mostPopular: false },
            { quantity: 12, cost: '87.18', mostPopular: false },
        ],
        '10 mg': [
            { quantity: 10, cost: '87.01', mostPopular: true },
            { quantity: 8, cost: '86.42', mostPopular: true },
            { quantity: 6, cost: '86.35', mostPopular: true },
            { quantity: 4, cost: '86.84', mostPopular: true },
            { quantity: 16, cost: '87.21', mostPopular: false },
            { quantity: 14, cost: '87.10', mostPopular: false },
            { quantity: 12, cost: '87.18', mostPopular: false },
        ],
        '20 mg': [
            { quantity: 10, cost: '87.01', mostPopular: true },
            { quantity: 8, cost: '86.42', mostPopular: true },
            { quantity: 6, cost: '86.35', mostPopular: true },
            { quantity: 4, cost: '86.84', mostPopular: true },
            { quantity: 16, cost: '87.21', mostPopular: false },
            { quantity: 14, cost: '87.10', mostPopular: false },
            { quantity: 12, cost: '87.18', mostPopular: false },
        ],
    },
    'peak-chews': {
        '8.5 mg': [
            { quantity: 10, cost: '4.98', mostPopular: true },
            { quantity: 8, cost: '4.98', mostPopular: true },
            { quantity: 6, cost: '4.97', mostPopular: true },
            { quantity: 4, cost: '6.25', mostPopular: true },
            { quantity: 16, cost: '4.99', mostPopular: false },
            { quantity: 14, cost: '4.99', mostPopular: false },
            { quantity: 12, cost: '4.99', mostPopular: false },
        ],
        // '20mg': [
        //     { quantity: 10, cost: '5.15', mostPopular: true },
        //     { quantity: 8, cost: '5.19', mostPopular: true },
        //     { quantity: 6, cost: '5.25', mostPopular: true },
        //     { quantity: 4, cost: '6.25', mostPopular: true },
        //     { quantity: 16, cost: '4.99', mostPopular: false },
        //     { quantity: 14, cost: '5.11', mostPopular: false },
        //     { quantity: 12, cost: '5.13', mostPopular: false },
        // ],
    },
    'rush-chews': {
        '36 mg': [
            { quantity: 6, cost: '4.58', mostPopular: true },
            { quantity: 8, cost: '4.15', mostPopular: true },
            { quantity: 10, cost: '3.67', mostPopular: true },
            { quantity: 12, cost: '3.32', mostPopular: false },
            { quantity: 14, cost: '2.92', mostPopular: false },
            { quantity: 16, cost: '2.91', mostPopular: false },
        ],
        '60 mg': [
            { quantity: 4, cost: '7.46', mostPopular: true },
            { quantity: 6, cost: '6.08', mostPopular: true },
            { quantity: 8, cost: '5.10', mostPopular: true },
            { quantity: 10, cost: '4.32', mostPopular: true },
            { quantity: 12, cost: '3.88', mostPopular: false },
            { quantity: 14, cost: '3.44', mostPopular: false },
            { quantity: 16, cost: '3.22', mostPopular: false },
        ],
        // '50mg': [
        //     { quantity: 6, cost: '4.58', mostPopular: true },
        //     { quantity: 8, cost: '4.58', mostPopular: true },
        // ],
        // '100mg': [
        //     { quantity: 6, cost: '10.03', mostPopular: true },
        //     { quantity: 8, cost: '8.71', mostPopular: true },
        // ],
    },
};

interface EDImageMap {
    [key: string]: string;
}

export const ED_PRODUCT_IMAGE_RED_MAP: EDImageMap = {
    'peak-chews': '/img/product-images/prescriptions/peak-chews.png',
    'x-chews': '/img/product-images/prescriptions/x-chews.png',
    'x-melts': '/img/product-images/prescriptions/x-melts.png',
    tadalafil: '/img/product-images/prescriptions/tadalafil.png',
    'rush-chews': '/img/product-images/prescriptions/rush-chews.png',
    sildenafil: '/img/product-images/prescriptions/sildenafil.png',
    'rush-melts': '/img/product-images/prescriptions/rush-melts.png',
    viagra: '/img/product-images/prescriptions/viagra.png',
    cialis: '/img/product-images/prescriptions/cialis.png',
};

interface EDNameMap {
    [key: string]: string;
}
export const ED_HREF_NAME_MAP: EDNameMap = {
    'peak-chews': 'Peak Chews',
    'x-chews': 'X Chews',
    'x-melts': 'X Melts',
    tadalafil: 'Tadalafil',
    'rush-chews': 'Rush Chews',
    sildenafil: 'Sildenafil (Generic Viagra®)',
    'rush-melts': 'Rush Melts',
    viagra: 'Viagra®',
    cilais: 'Cialis®',
};

export interface EDCadenceData {
    variant: any;
    price_data: any;
    variant_index: any;
    cadence: any;
    stripe_price_ids: {
        [key: string]: string;
    };
    product_href: any;
}

export interface EDSelectionMetadata {
    dosage: string;
    quantity: number;
    frequency: string;
    productHref: string;
    treatmentType: string;
}
