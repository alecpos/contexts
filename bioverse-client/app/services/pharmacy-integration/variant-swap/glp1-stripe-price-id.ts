import { HALLANDALE_EMPOWER_CONVERSION_MAP } from '@/app/components/provider-portal/intake-view/v2/components/containers/utils/pharmacy-variant-index-conversion/empower-hallandale-variant-converter';
import { GLP1_NAMES_TO_INDEX } from '@/app/components/provider-portal/intake-view/v2/components/intake-response-column/adjust-dosing-dialog/dosing-mappings';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import { SubscriptionCadency } from '@/app/types/renewal-orders/renewal-orders-types';
import { StripePriceList } from '@/app/types/stripe/stripe-types';

export const GLP1_STRIPE_PRICE_ID_LIST: StripePriceList = {
    semaglutide: {
        '-1': {
            dev: 'none',
            prod: 'none',
            cadency: SubscriptionCadency.Monthly,
        },
        2: {
            dev: 'price_1PMFqeDyFtOu3ZuT8l4sss4d',
            prod: 'price_1PMHqhDyFtOu3ZuTJHNsxB2v',
            cadency: SubscriptionCadency.Monthly,
        },
        3: {
            dev: 'price_1PMFr3DyFtOu3ZuTVCaMqJWy',
            prod: 'price_1PMHr4DyFtOu3ZuTwLzYF221', //same as variant index 13 here and in product_variants
            cadency: SubscriptionCadency.Monthly,
        },
        4: {
            dev: 'price_1PMFrPDyFtOu3ZuTKx8Lethb',
            prod: 'price_1PMHrXDyFtOu3ZuTWRmzJ5XW',
            cadency: SubscriptionCadency.Monthly,
        },
        5: {
            dev: 'price_1PMFrxDyFtOu3ZuTDeP55DRM',
            prod: 'price_1Phu0tDyFtOu3ZuTiQTyy9kT', //shared between variant indexes 1 and 5 in product_variants table
            cadency: SubscriptionCadency.Monthly,
        },
        6: {
            dev: 'price_1PMBndDyFtOu3ZuTq1vN6YaN',
            prod: 'price_1PNiJrDyFtOu3ZuTJuqwK59p',
            cadency: SubscriptionCadency.Quarterly,
        },
        7: {
            dev: 'price_1PMBxYDyFtOu3ZuT8rwJPbqO',
            prod: 'price_1PMC7mDyFtOu3ZuTcn5Gf9NG',
            cadency: SubscriptionCadency.Quarterly,
        },
        8: {
            dev: 'price_1PMBs1DyFtOu3ZuTRZkd0AkG',
            prod: 'price_1PMC5EDyFtOu3ZuTP79lw9h9',
            cadency: SubscriptionCadency.Quarterly,
        },
        9: {
            dev: 'price_1PMBwkDyFtOu3ZuTRRyNAh2S',
            prod: 'price_1PMC5YDyFtOu3ZuTQiZPJCKd',
            cadency: SubscriptionCadency.Quarterly,
        },
        10: {
            dev: 'price_1PMBy1DyFtOu3ZuT1iQ8HTXn',
            prod: 'price_1PMC5pDyFtOu3ZuTZy4YXlwu',
            cadency: SubscriptionCadency.Quarterly,
        },
        11: {
            dev: 'price_1PpfWfDyFtOu3ZuTx9cK3ZkS',
            prod: 'price_1PiIgFDyFtOu3ZuTBekneIDz',
            cadency: SubscriptionCadency.Quarterly,
        },
        12: {
            dev: 'price_1PnPx0DyFtOu3ZuTrMk2CFVm',
            prod: 'price_1PnQrmDyFtOu3ZuTAWkJMIXu',
            cadency: SubscriptionCadency.Quarterly,
        },
        13: {
            dev: 'price_1PiIQtDyFtOu3ZuTiBcN6Zl1',
            prod: 'price_1PMHr4DyFtOu3ZuTwLzYF221', //same as variant index 3 here and in product_variants
            cadency: SubscriptionCadency.Monthly,
        },
        14: {
            dev: 'price_1PiIR8DyFtOu3ZuTmSSa86Sg',
            prod: 'price_1PiIcVDyFtOu3ZuT98j4bwgj',
            cadency: SubscriptionCadency.Monthly,
        },
        15: {
            dev: 'price_1QYPnODyFtOu3ZuTJDUO0Xoi',
            prod: 'price_1QYPryDyFtOu3ZuTM7ODsRoa',  //unique here...in product_variants, this is same as 17
            cadency: SubscriptionCadency.Biannually,
        },
        16: {
            dev: 'price_1QYPo9DyFtOu3ZuTxR6rXN7o',
            prod: 'price_1QYPs4DyFtOu3ZuTlxzxTfMI',
            cadency: SubscriptionCadency.Biannually,
        },
        17: {
            dev: 'price_1QYPomDyFtOu3ZuTBRNwVtiK',
            prod: 'price_1QhfCUDyFtOu3ZuTYHXHhYjV', //same as 18 here, in product_varints this is price_1QYPryDyFtOu3ZuTM7ODsRoa (same as 15)
            cadency: SubscriptionCadency.Biannually,
        },
        18: {
            dev: 'price_1QhfPVDyFtOu3ZuT3R4erGWH',
            prod: 'price_1QhfCUDyFtOu3ZuTYHXHhYjV', //same as variant index 17 here, in product_variants it's the same as it is here
            cadency: SubscriptionCadency.Biannually,
        },
        19: {
            dev: 'price_1QhfQRDyFtOu3ZuTjwmd37Lo',
            prod: 'price_1QhfAoDyFtOu3ZuTLq148ViG',
            cadency: SubscriptionCadency.Biannually,
        },
        20: {
            dev: 'price_1QhfQdDyFtOu3ZuTHUgP6Usi',
            prod: 'price_1QhfBPDyFtOu3ZuTvrEgshmg',
            cadency: SubscriptionCadency.Biannually,
        },
        21: {
            dev: 'price_1QfjHKDyFtOu3ZuTgGnVTTiL',
            prod: 'price_1QfjLPDyFtOu3ZuTxFbt5WHu',
            cadency: SubscriptionCadency.Quarterly,
        },

        22: {
            dev: 'price_1Qn7FlDyFtOu3ZuTPMxiwKzw',
            prod: 'price_1Qn7JKDyFtOu3ZuTA00VOM8B',
            cadency: SubscriptionCadency.Monthly,
        },

        23: {
            dev: 'price_1Qn7GIDyFtOu3ZuTq7cQoOyy',
            prod: 'price_1Qn7JKDyFtOu3ZuTrvj7aZj7',
            cadency: SubscriptionCadency.Monthly,
        },

        24: {
            dev: 'price_1Qn7GYDyFtOu3ZuTkZlIIJl5',
            prod: 'price_1Qn7JKDyFtOu3ZuT6bLDlHhB',
            cadency: SubscriptionCadency.Monthly,
        },

        25: {
            dev: 'price_1Qn7GqDyFtOu3ZuTyG7RIT12',
            prod: 'price_1Qn7JKDyFtOu3ZuT9rjf9rBy',
            cadency: SubscriptionCadency.Monthly,
        },

        26: {
            dev: 'price_1Qn7HgDyFtOu3ZuTQiDVtztI',
            prod: 'price_1Qn7JKDyFtOu3ZuTaicG7fDD',
            cadency: SubscriptionCadency.Quarterly,
        },

        27: {
            dev: 'price_1Qn7HgDyFtOu3ZuTQiDVtztI',
            prod: 'price_1Qn7JKDyFtOu3ZuTBPIEpWQt',
            cadency: SubscriptionCadency.Quarterly,
        },

        28: {
            dev: 'price_1Qn7HgDyFtOu3ZuTQiDVtztI',
            prod: 'price_1Qn7JKDyFtOu3ZuTIIIjCnWY',
            cadency: SubscriptionCadency.Quarterly,
        },

        29: {
            dev: 'price_1Qn7HgDyFtOu3ZuTQiDVtztI',
            prod: 'price_1Qn7JKDyFtOu3ZuTU1uvM8PU',
            cadency: SubscriptionCadency.Quarterly,
        },

        30: {
            dev: 'price_1Qn7HgDyFtOu3ZuTQiDVtztI',
            prod: 'price_1Qn7JJDyFtOu3ZuT4vQAdUc1',
            cadency: SubscriptionCadency.Quarterly,
        },

        31: {
            dev: 'price_1QoXx4DyFtOu3ZuTrxmKT0Y8',
            prod: 'price_1QoXyaDyFtOu3ZuTk6oJBd3q',
            cadency: SubscriptionCadency.Quarterly,
        },

        32: {
            dev: 'price_1QtusJDyFtOu3ZuT0K2UmHwE',
            prod: 'price_1QtuySDyFtOu3ZuT9ZlQOMG7',
            cadency: SubscriptionCadency.Monthly,
        },

        33: {
            dev: 'price_1QtuuODyFtOu3ZuTJOus4QPv',
            prod: 'price_1QtuySDyFtOu3ZuTZTNdBd1q',
            cadency: SubscriptionCadency.Quarterly,
        },

        34: {
            dev: 'price_1QtuufDyFtOu3ZuTnElRKXNK',
            prod: 'price_1QtuySDyFtOu3ZuT9pMG17VB',
            cadency: SubscriptionCadency.Quarterly,
        },

        35: {
            dev: 'price_1QtuuODyFtOu3ZuTJOus4QPv',
            prod: 'price_1QtuySDyFtOu3ZuTwIMKDxdw',
            cadency: SubscriptionCadency.Quarterly,
        },

        36: {
            dev: 'price_1QtuuODyFtOu3ZuTJOus4QPv',
            prod: 'price_1QtuySDyFtOu3ZuT4zj8doSf',
            cadency: SubscriptionCadency.Quarterly,
        },

        37: {
            dev: 'price_1QwqZgDyFtOu3ZuTMxXe1cQt',
            prod: 'price_1Qwqk1DyFtOu3ZuTEMZhfTNj',
            cadency: SubscriptionCadency.Annually,
        },

        39: {
            dev: 'price_1QwqZgDyFtOu3ZuTMxXe1cQt',
            prod: 'price_1QwqkeDyFtOu3ZuTXW8wNSsO',
            cadency: SubscriptionCadency.Annually,
        },

        41: {
            dev: 'price_1QwqZgDyFtOu3ZuTMxXe1cQt',
            prod: 'price_1Qwql3DyFtOu3ZuTZceD5Uq6',
            cadency: SubscriptionCadency.Annually,
        },

        43: {
            dev: 'price_1Qv14ODyFtOu3ZuTlj6dR6E2',
            prod: 'price_1Qv1yTDyFtOu3ZuTpNl5Ebbb',
            cadency: SubscriptionCadency.Quarterly,
        },

        44: {
            dev: 'price_1Qv15RDyFtOu3ZuTZ92diUuY',
            prod: 'price_1Qv1yTDyFtOu3ZuT3sGL55S8',
            cadency: SubscriptionCadency.Quarterly,
        }
    },
    tirzepatide: {
        '-1': {
            dev: 'none',
            prod: 'none',
            cadency: SubscriptionCadency.Monthly,
        },
        2: {
            dev: 'price_1PMFqeDyFtOu3ZuT8l4sss4d',
            prod: 'price_1PMHqhDyFtOu3ZuTJHNsxB2v',
            cadency: SubscriptionCadency.Monthly,
        },
        3: {
            dev: 'price_1PMFsRDyFtOu3ZuTlKGj4AsH',
            prod: 'price_1PMHV0DyFtOu3ZuTNZgiN5ih',
            cadency: SubscriptionCadency.Monthly,
        },
        4: {
            dev: 'price_1PMFsoDyFtOu3ZuT8ajgCmBa',
            prod: 'price_1PMHVNDyFtOu3ZuT2JN0VbKo',
            cadency: SubscriptionCadency.Monthly,
        },
        5: {
            dev: 'price_1PMFtDDyFtOu3ZuTZ9SkD5RQ',
            prod: 'price_1PMHVjDyFtOu3ZuTaL55p1D2',
            cadency: SubscriptionCadency.Monthly,
        },
        6: {
            dev: 'price_1PMBywDyFtOu3ZuTK8yvhEMP',
            prod: 'price_1PNiLxDyFtOu3ZuTRdmGYaho',
            cadency: SubscriptionCadency.Quarterly,
        },
        7: {
            dev: 'price_1PMDmODyFtOu3ZuTdkLGMRBe',
            prod: 'price_1PMDoKDyFtOu3ZuTLjpessnr',
            cadency: SubscriptionCadency.Quarterly,
        },
        8: {
            dev: 'price_1PMCAQDyFtOu3ZuTed7TWUBh',
            prod: 'price_1PMCAxDyFtOu3ZuTIv78gMCo',
            cadency: SubscriptionCadency.Quarterly,
        },
        9: {
            dev: 'price_1QhwmIDyFtOu3ZuTdSm9dJWt',
            prod: 'price_1QhwigDyFtOu3ZuTU04jMNgV', //unique here...price_1PMCBgDyFtOu3ZuTLIiJ8TiV in product_variants 
            cadency: SubscriptionCadency.Quarterly,
        },
        10: {
            dev: 'price_1PQZ03DyFtOu3ZuTay37ze9K',
            prod: 'price_1PQZ0ADyFtOu3ZuT7NkhTRxq',
            cadency: SubscriptionCadency.Monthly,
        },
        11: {
            dev: 'price_1PQZ0YDyFtOu3ZuTNgpxpCqA',
            prod: 'price_1PQZ3LDyFtOu3ZuTEIsSt2HI',
            cadency: SubscriptionCadency.Monthly,
        },
        12: {
            dev: 'price_1PQZ12DyFtOu3ZuT45gbvUkq',
            prod: 'price_1PQZ3JDyFtOu3ZuTATlJcMKk', //same as variant index 21 here and in product_variants
            cadency: SubscriptionCadency.Quarterly,
        },
        13: {
            dev: 'price_1PQZ3DDyFtOu3ZuTVLe9MUTx',
            prod: 'price_1PQZ3HDyFtOu3ZuTHYwJhmfD',
            cadency: SubscriptionCadency.Quarterly,
        },
        14: {
            dev: 'price_1PiIr6DyFtOu3ZuTNVoUM8iG',
            prod: 'price_1PiIrIDyFtOu3ZuTKl98onxN',
            cadency: SubscriptionCadency.Monthly,
        },
        15: {
            dev: 'price_1PiIqADyFtOu3ZuT8ptETEAh',
            prod: 'price_1PiIqKDyFtOu3ZuTJdilFfgl',
            cadency: SubscriptionCadency.Monthly,
        },
        16: {
            dev: 'price_1PprowDyFtOu3ZuTEbUFHWXt',
            prod: 'price_1PnQr0DyFtOu3ZuTnWBd5mVs',
            cadency: SubscriptionCadency.Quarterly,
        },
        17: {
            dev: 'price_1PiIWjDyFtOu3ZuTvLGnzPEY',
            prod: 'price_1PiItKDyFtOu3ZuTjmPAx4Lf',
            cadency: SubscriptionCadency.Quarterly,
        },
        18: {
            dev: 'price_1PiIWjDyFtOu3ZuTGaR3IQww',
            prod: 'price_1PiItKDyFtOu3ZuTCyyHko0C',
            cadency: SubscriptionCadency.Quarterly,
        },
        19: {
            dev: 'price_1PprpLDyFtOu3ZuTUglpi9sW',
            prod: 'price_1PnQqWDyFtOu3ZuTKXtMz6iu',
            cadency: SubscriptionCadency.Quarterly,
        },
        20: {
            dev: 'price_1PiIP7DyFtOu3ZuTQ3A5pj8O',
            prod: 'price_1PnQpoDyFtOu3ZuTvS5GceYU',
            cadency: SubscriptionCadency.Quarterly,
        },
        21: {
            dev: 'price_1PprojDyFtOu3ZuTEW4tIjH6',
            prod: 'price_1PQZ3JDyFtOu3ZuTATlJcMKk',  //same as variant index 12 here and in product_variants
            cadency: SubscriptionCadency.Quarterly,
        },
        22: {
            dev: 'price_1PpfqwDyFtOu3ZuTAND0ZK6e',
            prod: 'price_1PnQmbDyFtOu3ZuT84yH4RZW',
            cadency: SubscriptionCadency.Quarterly,
        },
        23: {
            dev: 'price_1PigvvDyFtOu3ZuTKaF8dbKu',
            prod: 'price_1PigwfDyFtOu3ZuTc4D88yRl',
            cadency: SubscriptionCadency.Monthly,
        },
        24: {
            dev: 'price_1QYPqfDyFtOu3ZuT9XtS4mDr',
            prod: 'price_1QYPsEDyFtOu3ZuTW3N50pBd',
            cadency: SubscriptionCadency.Biannually,
        },
        25: {
            dev: 'price_1QhfRODyFtOu3ZuT2eAEdqvr',
            prod: 'price_1QhfDRDyFtOu3ZuTGcwQF88h',
            cadency: SubscriptionCadency.Biannually,
        },
        26: {
            dev: 'price_1QYProDyFtOu3ZuTqrhy9F53',
            prod: 'price_1QYPsIDyFtOu3ZuTXsXzKSJ5',
            cadency: SubscriptionCadency.Biannually,
        },
        [GLP1_NAMES_TO_INDEX.TIRZEPATIDE_QUARTERLY_136_MG_EMPOWER]: {
            dev: 'price_1QhG0ZDyFtOu3ZuT3saZzuHn',
            prod: 'price_1QhFzTDyFtOu3ZuTDl1abUAO',
            cadency: SubscriptionCadency.Quarterly,
        },
        [GLP1_NAMES_TO_INDEX.TIRZEPATIDE_QUARTERLY_170_MG_EMPOWER]: {
            dev: 'price_1QhG0vDyFtOu3ZuTLNnL5i1Z',
            prod: 'price_1QhG05DyFtOu3ZuTf6Hc8KWI',
            cadency: SubscriptionCadency.Quarterly,
        },

        30: {
            dev: 'price_1QnRkVDyFtOu3ZuTFrRlmoYf',
            prod: 'price_1QnRqPDyFtOu3ZuTThzmfota',
            cadency: SubscriptionCadency.Monthly,
        },
        31: {
            dev: 'price_1QnRkVDyFtOu3ZuTFrRlmoYf',
            prod: 'price_1QnRqPDyFtOu3ZuTymBgHwRt',
            cadency: SubscriptionCadency.Monthly,
        },
        32: {
            dev: 'price_1QnRkVDyFtOu3ZuTFrRlmoYf',
            prod: 'price_1QnRqPDyFtOu3ZuTCR4INiPP',
            cadency: SubscriptionCadency.Monthly,
        },
        33: {
            dev: 'price_1QnRkVDyFtOu3ZuTFrRlmoYf',
            prod: 'price_1QnRqPDyFtOu3ZuTdXAMLB5s',
            cadency: SubscriptionCadency.Monthly,
        },
        34: {
            dev: 'price_1QnRkVDyFtOu3ZuTFrRlmoYf',
            prod: 'price_1QnRqPDyFtOu3ZuTuvMhQ03o',
            cadency: SubscriptionCadency.Monthly,
        },
        35: {
            dev: 'price_1QnRnpDyFtOu3ZuT9yA9k1sl',
            prod: 'price_1QnRqPDyFtOu3ZuTrHYq66CI',
            cadency: SubscriptionCadency.Quarterly,
        },
        36: {
            dev: 'price_1QnRnpDyFtOu3ZuT9yA9k1sl',
            prod: 'price_1QnRqPDyFtOu3ZuTbaXB6Hy2',
            cadency: SubscriptionCadency.Quarterly,
        },
        37: {
            dev: 'price_1QnRnpDyFtOu3ZuT9yA9k1sl',
            prod: 'price_1QnRqPDyFtOu3ZuTMrqxjIiY',
            cadency: SubscriptionCadency.Quarterly,
        },
        38: {
            dev: 'price_1QnRnpDyFtOu3ZuT9yA9k1sl',
            prod: 'price_1QnRqPDyFtOu3ZuTOq517cUI',
            cadency: SubscriptionCadency.Quarterly,
        },
        39: {
            dev: 'price_1QnRnpDyFtOu3ZuT9yA9k1sl',
            prod: 'price_1QnRqPDyFtOu3ZuTtQW5QlFm',
            cadency: SubscriptionCadency.Quarterly,
        },
        40: {
            dev: 'price_1QwqlcDyFtOu3ZuTETmB5SFy',
            prod: 'price_1QwqmLDyFtOu3ZuTvsFO2BM6',
            cadency: SubscriptionCadency.Annually,
        },
    },
};

type Environment = 'dev' | 'prod';


//Soon to be DEPRECATED
//-->  to be replaced by getVariantIndexByPriceIdV2 in /app/utils/database/controller/products/products.ts
export function getVariantIndexByPriceId(
    product_href: PRODUCT_HREF,
    priceId: string
): string {
    const plans = GLP1_STRIPE_PRICE_ID_LIST[product_href];
    const env = process.env.NEXT_PUBLIC_ENVIRONMENT as Environment; // Explicitly cast to 'dev' | 'prod'

    if (!env || !(env in plans[Object.keys(plans)[0]])) {
        return '-1';
    }

    if (priceId === 'price_1PiIgZDyFtOu3ZuTXCDQz6cc') {
        return '12';
    } else if (priceId === 'price_1PiIwIDyFtOu3ZuTrikuXSxx') {
        return '22';
    } else if (priceId === 'price_1PiIv3DyFtOu3ZuToyvkw3DV') {
        return '20';
    } else if (priceId === 'price_1PiIuHDyFtOu3ZuTEcDfelSZ') {
        return '19';
    } else if (priceId === 'price_1PiIsCDyFtOu3ZuTHkDM2s1J') {
        return '16';
    } else if (priceId === 'price_1OtxQlDyFtOu3ZuTWJBiJ7Bp') {
        return '2';
    } else if (priceId === 'price_1PMCBgDyFtOu3ZuTLIiJ8TiV') {
        // For correcting tirzep 1186.92 -> 1399 for 102mg
        return '9';
    }

    for (const planId in plans) {
        if (plans[planId][env] === priceId) {
            if (product_href === PRODUCT_HREF.TIRZEPATIDE) {
                const numericPlanId = Number(
                    planId
                ) as keyof (typeof HALLANDALE_EMPOWER_CONVERSION_MAP)['tirzepatide'];
                return String(
                    HALLANDALE_EMPOWER_CONVERSION_MAP['tirzepatide'][
                        numericPlanId
                    ] || -1
                );
            }
            return planId;
        }
    }
    return '-1';
}
export const incorrectPriceIds = [
    'price_1PiIgZDyFtOu3ZuTXCDQz6cc',
    'price_1PiIwIDyFtOu3ZuTrikuXSxx',
    'price_1PiIv3DyFtOu3ZuToyvkw3DV',
    'price_1PiIuHDyFtOu3ZuTEcDfelSZ',
    'price_1PiIsCDyFtOu3ZuTHkDM2s1J',
    'price_1OtxQlDyFtOu3ZuTWJBiJ7Bp',
];
