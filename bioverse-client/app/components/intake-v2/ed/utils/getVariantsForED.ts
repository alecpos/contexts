'use server';

import { createSupabaseServiceClient } from '@/app/utils/clients/supabaseServerClient';

export async function getPriceVariantsForED(
    dosage: string,
    quantity: number,
    frequency: string,
    productHref: string
) {
    console.log(
        'phr: ',
        productHref,
        'fre ',
        frequency,
        'dos ',
        dosage,
        'qua ',
        quantity
    );

    const variantArray =
        ED_COMBINATORAL_CADENCE_MAP[productHref][frequency][dosage][quantity];

    console.log('=================', variantArray);

    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('product_variants')
        .select(
            'variant, price_data, variant_index, cadence, stripe_price_ids, product_href'
        )
        .in('variant_index', variantArray)
        .eq('product_href', productHref)
        .order('variant_index', { ascending: true });

    if (error) {
        console.error('getPriceVariantsForED error: ', error);
        return [];
    }

    return data;
}

interface EDCombinatoralCadenceMap {
    //productHRef
    //frequency
    //dosage
    //quantity
    //valid variant indices array

    [key: string]: {
        [key: string]: {
            [key: string]: {
                [key: number]: number[];
            };
        };
    };
}

const ED_COMBINATORAL_CADENCE_MAP: EDCombinatoralCadenceMap = {
    'peak-chews': {
        daily: {
            '8.5 mg': {
                30: [0, 1, 2],
            },
            '8.5mg': {
                30: [0, 1, 2],
            },
        },
        'as-needed': {
            '8.5 mg': {
                4: [37, 38],
                6: [3, 4],
                8: [5, 6],
                10: [7, 8, 9],
                12: [10, 11, 12],
                14: [13, 14, 15],
                16: [16, 17, 18],
            },
            '8.5mg': {
                4: [37, 38],
                6: [3, 4],
                8: [5, 6],
                10: [7, 8, 9],
                12: [10, 11, 12],
                14: [13, 14, 15],
                16: [16, 17, 18],
            },
            // '20mg': {
            //     4: [19, 20],
            //     6: [21, 22],
            //     8: [23, 24],
            //     10: [25, 26, 27],
            //     12: [28, 29, 30],
            //     14: [31, 32, 33],
            //     16: [34, 35, 36],
            // },
        },
    },
    'x-chews': {
        daily: {
            '100iu/5mg': {
                30: [0, 1, 2],
            },
        },
        'as-needed': {
            '100iu/5mg': {
                6: [3, 4],
                8: [5, 6, 7],
                10: [8, 9, 10],
                12: [11, 12, 13],
                14: [14, 15, 16],
                16: [17, 18, 19],
            },
        },
    },
    'x-melts': {
        daily: {
            '100iu/5mg': {
                30: [0, 1, 2],
            },
        },
        'as-needed': {
            '100iu/5mg': {
                4: [3, 4, 5],
                6: [6, 7, 8],
                8: [9, 10, 11],
                10: [12, 13, 14],
                12: [15, 16, 17],
                14: [18, 19, 20],
                16: [21, 22, 23],
            },
        },
    },
    tadalafil: {
        daily: {
            '5mg': {
                30: [0, 1, 2],
            },
            '10mg': {
                30: [3, 4, 5],
            },
            '20mg': {
                30: [6, 7, 8],
            },
        },
        'as-needed': {
            '5mg': {
                4: [9, 10, 11],
                6: [12, 13, 14],
                8: [15, 16, 17],
                10: [18, 19, 20],
                12: [21, 22, 23],
                14: [24, 25, 26],
            },
            '10mg': {
                4: [27, 28],
                6: [29, 30, 31],
                8: [32, 33, 34],
                10: [35, 36, 37],
                12: [38, 39, 40],
                14: [41, 42, 43],
                16: [44, 45, 46],
            },
            '20mg': { 4: [47, 48] },
        },
    },
    'rush-chews': {
        daily: {
            '36 mg': {
                30: [0, 1, 2],
            },
            // '60mg': {
            //     30: [3, 4, 5],
            // },
        },
        'as-needed': {
            '36 mg': {
                6: [6, 7],
                8: [8, 9],
                10: [10, 11],
                12: [12, 13],
                14: [14, 15],
                16: [16, 17],
            },
            '60 mg': {
                4: [18, 19],
                6: [20, 21],
                8: [22, 23],
                10: [24, 25],
                12: [26, 27],
                14: [28, 29],
                16: [30, 31],
            },
            // '50mg': { 6: [12, 13], 8: [14, 15] },
            // '100mg': { 6: [16, 17], 8: [18, 19] },
        },
    },
    sildenafil: {
        'as-needed': {
            '25mg': {
                4: [0, 1],
            },
            '50mg': {
                4: [2, 3],
            },
            '100mg': {
                4: [4, 5],
            },
        },
    },
    'rush-melts': {
        'as-needed': {
            '81mg/12mg': {
                4: [0, 1],
                6: [2, 3, 4],
                8: [5, 6, 7],
                10: [8, 9, 10],
                12: [11, 12, 13],
                14: [14, 15, 16],
                16: [17, 18, 19],
            },
        },
    },
    viagra: {
        'as-needed': {
            '50mg': {
                4: [0, 1, 2],
                6: [3, 4, 5],
                8: [6, 7, 8],
                10: [9, 10, 11],
                12: [12, 13, 14],
                14: [15, 16, 17],
                16: [18, 19, 20],
            },
            '100mg': {
                4: [21, 22, 23],
                6: [24, 25, 26],
                8: [27, 28, 29],
                10: [30, 31, 32],
                12: [33, 34, 35],
                14: [36, 37, 38],
                16: [39, 40, 41],
            },
        },
    },
    cialis: {
        'as-needed': {
            '5 mg': {
                4: [0, 1, 2],
                6: [3, 4, 5],
                8: [6, 7, 8],
                10: [9, 10, 11],
                12: [12, 13, 14],
                14: [15, 16, 17],
                16: [18, 19, 20],
            },
            '10 mg': {
                4: [21, 22, 23],
                6: [24, 25, 26],
                8: [27, 28, 29],
                10: [30, 31, 32],
                12: [33, 34, 35],
                14: [36, 37, 38],
                16: [39, 40, 41],
            },
            '20 mg': {
                4: [42, 43, 44],
                6: [45, 46, 47],
                8: [48, 49, 50],
                10: [51, 52, 53],
                12: [54, 55, 56],
                14: [57, 58, 59],
                16: [60, 61, 62],
            },
        },
    },
};
