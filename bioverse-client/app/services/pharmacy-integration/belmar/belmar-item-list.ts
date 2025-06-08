export const BELMAR_ITEM_LIST: BelmarItemListObject[] = [
    {
        product_code: 7965910,
        product_form: 'INJECTABLE',
        product_strength: '1/1 MG/ML',
        product_name: 'CYANOCOBALAMIN/SEMAGLUTIDE (1 ML)',
        bioverse_product_name: 'CYANOCOBALAMIN/SEMAGLUTIDE (1 ML)',
        units: 'VIAL',
    },
    {
        product_code: 7965913,
        product_form: 'INJECTABLE',
        product_strength: '1/1 MG/ML',
        product_name: 'CYANOCOBALAMIN/SEMAGLUTIDE (5 ML)',
        bioverse_product_name: 'CYANOCOBALAMIN/SEMAGLUTIDE (5 ML)',
        units: 'VIAL',
    },
    {
        product_code: 7966945,
        product_form: 'INJECTABLE',
        product_strength: '10 MG/ML',
        product_name: 'TIRZEPATIDE (1 ML)',
        bioverse_product_name: 'TIRZEPATIDE (1 ML)',
        units: 'VIAL',
    },
    {
        product_code: 7966947,
        product_form: 'INJECTABLE',
        product_strength: '10 MG/ML',
        product_name: 'TIRZEPATIDE (4 ML)',
        bioverse_product_name: 'TIRZEPATIDE (4 ML)',
        units: 'VIAL',
    },
    {
        product_code: 7996489,
        product_form: 'SUPPLIES',
        product_strength: '30G 5/16 1ML',
        product_name: 'INSULIN SYRINGE W/NEEDLE (GLOBAL) (10 SYRINGES)',
        bioverse_product_name:
            'INSULIN SYRINGE W/NEEDLE (GLOBAL) (10 SYRINGES)',
        units: 'PACK',
    },
];

export const BELMAR_ITEM_SET_MAPPING: BelmarItemSetMap[] = [
    {
        displayName: '[monthly] Semaglutide 1 mg',
        productArray: [
            {
                product: BELMAR_ITEM_LIST[0],
                quantity: 1,
                sig: 'Inject 25 units (0.25 mg) weekly x 4 weeks',
            },
            {
                product: BELMAR_ITEM_LIST[4],
                quantity: 1,
                sig: 'Use as directed',
            },
        ],
    },
    {
        displayName: '[monthly] Semaglutide 2 mg',
        productArray: [
            {
                product: BELMAR_ITEM_LIST[0],
                quantity: 2,
                sig: 'Inject 50 units (0.5mg) weekly x 4 weeks',
            },
            {
                product: BELMAR_ITEM_LIST[4],
                quantity: 1,
                sig: 'Use as directed',
            },
        ],
    },
    {
        displayName: '[monthly] Semaglutide 5 mg',
        productArray: [
            {
                product: BELMAR_ITEM_LIST[1],
                quantity: 1,
                sig: 'Inject 125 units (1.25 mg) weekly x 4 weeks',
            },
            {
                product: BELMAR_ITEM_LIST[4],
                quantity: 1,
                sig: 'Use as directed',
            },
        ],
    },
    {
        displayName: '[monthly] Semaglutide 10 mg',
        productArray: [
            {
                product: BELMAR_ITEM_LIST[1],
                quantity: 2,
                sig: 'Inject 150 units (2.5 mg) weekly x 4 weeks',
            },
            {
                product: BELMAR_ITEM_LIST[4],
                quantity: 1,
                sig: 'Use as directed',
            },
        ],
    },
    // {
    //     displayName: '[monthly] Semaglutide 15 mg',
    //     productArray: [{ product: '', quantity: 1, sig: '' }],
    // },
    {
        displayName: '[bundle] Semaglutide 8 mg',
        productArray: [
            {
                product: BELMAR_ITEM_LIST[0],
                quantity: 1,
                sig: 'Month 1 (weeks 1-4) : Inject 25 units (0.25 mg) weekly x 4 weeks',
            },
            {
                product: BELMAR_ITEM_LIST[0],
                quantity: 2,
                sig: 'Month 2 (weeks 5-8) : Inject 50 units (0.5mg) weekly x 4 weeks',
            },
            {
                product: BELMAR_ITEM_LIST[1],
                quantity: 1,
                sig: 'Month 3 (weeks 9+): Inject 125 units (1.25 mg) weekly x 4 weeks',
            },
            {
                product: BELMAR_ITEM_LIST[4],
                quantity: 2,
                sig: 'Use as directed',
            },
        ],
    },
    {
        displayName: '[bundle] Semaglutide 17 mg',
        productArray: [
            {
                product: BELMAR_ITEM_LIST[0],
                quantity: 2,
                sig: 'Month 1 (weeks 1-4) : Inject 50 units (0.5mg) weekly x 4 weeks',
            },
            {
                product: BELMAR_ITEM_LIST[1],
                quantity: 1,
                sig: 'Month 2 (weeks 5-8) : Inject 125 units (1.25 mg) weekly x 4 weeks',
            },
            {
                product: BELMAR_ITEM_LIST[1],
                quantity: 2,
                sig: 'Month 3 (weeks 9+): Inject 150 units (2.5 mg) weekly x 4 weeks',
            },
            {
                product: BELMAR_ITEM_LIST[4],
                quantity: 2,
                sig: 'Use as directed',
            },
        ],
    },
    {
        displayName: '[bundle] Semaglutide 25 mg',
        productArray: [
            {
                product: BELMAR_ITEM_LIST[1],
                quantity: 1,
                sig: 'Month 1 (weeks 1-4) : Inject 125 units (1.25 mg) weekly x 4 weeks',
            },
            {
                product: BELMAR_ITEM_LIST[1],
                quantity: 2,
                sig: 'Month 2 (weeks 5-8) : Inject 150 units (2.5 mg) weekly x 4 weeks',
            },
            {
                product: BELMAR_ITEM_LIST[1],
                quantity: 2,
                sig: 'Month 3 (weeks 9+): Inject 150 units (2.5 mg) weekly x 4 weeks',
            },
            {
                product: BELMAR_ITEM_LIST[4],
                quantity: 2,
                sig: 'Use as directed',
            },
        ],
    },
    {
        displayName: '[bundle] Semaglutide 30 mg',
        productArray: [
            {
                product: BELMAR_ITEM_LIST[1],
                quantity: 2,
                sig: 'Month 1 (weeks 1-4) : Inject 150 units (2.5 mg) weekly x 4 weeks',
            },
            {
                product: BELMAR_ITEM_LIST[1],
                quantity: 2,
                sig: 'Month 2 (weeks 5-8) : Inject 150 units (2.5 mg) weekly x 4 weeks',
            },
            {
                product: BELMAR_ITEM_LIST[1],
                quantity: 2,
                sig: 'Month 3 (weeks 9+): Inject 150 units (2.5 mg) weekly x 4 weeks',
            },
            {
                product: BELMAR_ITEM_LIST[4],
                quantity: 2,
                sig: 'Use as directed',
            },
        ],
    },
];

// Utility function to find an item by displayName in BELMAR_ITEM_SET_MAPPING
export function findBelmarItemByDisplayName(
    displayName: string
): BelmarItemSetMap | undefined {
    return BELMAR_ITEM_SET_MAPPING.find(
        (item) => item.displayName === displayName
    );
}
