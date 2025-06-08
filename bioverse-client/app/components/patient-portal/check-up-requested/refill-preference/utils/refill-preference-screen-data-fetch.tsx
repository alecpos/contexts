'use server';

import { DosageSelectionVariantIndexToDosage } from '@/app/components/provider-portal/intake-view/v2/components/intake-response-column/approve-and-prescribe-confirmation-details/dosage-change/dosage-change-quarterly-final-review';
import { GLP1_STRIPE_PRICE_ID_LIST } from '@/app/services/pharmacy-integration/variant-swap/glp1-stripe-price-id';
import { USStates } from '@/app/types/enums/master-enums';
import {
    RenewalOrder,
    SubscriptionCadency,
} from '@/app/types/renewal-orders/renewal-orders-types';
import {
    getPriceDataRecordWithVariant,
    ProductVariantRecord,
} from '@/app/utils/database/controller/product_variants/product_variants';

// Variant Indexes ordered as:
// [Lower Monthly, Lower Bundle, Higher Monthly, Higher Bundle]
export type DoubleDosageSelectionType = {
    lower_dosages: { dosage: number; dosage_list: DoubleDosageType };
    higher_dosages: { dosage: number; dosage_list: DoubleDosageType };
};

export type DoubleDosageType = Partial<ProductVariantRecord>[];

type CadencyType =
    | SubscriptionCadency.Biannually
    | SubscriptionCadency.Quarterly
    | SubscriptionCadency.Monthly
    | SubscriptionCadency.Annually;

const cadencyPriority: Record<CadencyType, number> = {
    [SubscriptionCadency.Annually]: 1,
    [SubscriptionCadency.Biannually]: 2,
    [SubscriptionCadency.Quarterly]: 3,
    [SubscriptionCadency.Monthly]: 4,
};

// Function to sort dosages based on cadency
const sortByCadency =
    (product_href: string) =>
    (
        a: Partial<ProductVariantRecord>,
        b: Partial<ProductVariantRecord>
    ): number => {
        const aCadency =
            GLP1_STRIPE_PRICE_ID_LIST[product_href][a.variant_index!]?.cadency;
        const bCadency =
            GLP1_STRIPE_PRICE_ID_LIST[product_href][b.variant_index!]?.cadency;

        return (
            (cadencyPriority[aCadency as CadencyType] ?? 5) -
            (cadencyPriority[bCadency as CadencyType] ?? 5)
        );
    };

export async function refillPreferenceScreenDoubleDosageDataFetch(
    renewalOrder: RenewalOrder
): Promise<DoubleDosageSelectionType> {
    const { product_href, dosage_suggestion_variant_indexes } = renewalOrder;

    const priceDataRecords = await Promise.all(
        dosage_suggestion_variant_indexes.map(async (variantIndex) => {
            const priceDataRecord = await getPriceDataRecordWithVariant(
                product_href,
                variantIndex
            );
            return priceDataRecord;
        })
    );

    // Initialize the buckets for lower and higher dosages
    var lower_dosages: Partial<ProductVariantRecord>[] = [];
    var higher_dosages: Partial<ProductVariantRecord>[] = [];

    // Determine the lower and higher dosage values based on the enums
    const dosages = dosage_suggestion_variant_indexes.map((index) => {
        return DosageSelectionVariantIndexToDosage[product_href][index];
    });

    // Assuming there are two distinct dosages
    const uniqueDosages = Array.from(new Set(dosages)).sort((a, b) => a - b);

    console.log('uniqueDosages: ', uniqueDosages);

    if (uniqueDosages.length === 2) {
        const [lowerDosage, higherDosage] = uniqueDosages;

        // Distribute the records into the respective buckets
        priceDataRecords.forEach((record, index) => {
            if (record) {
                const dosage =
                    DosageSelectionVariantIndexToDosage[product_href][
                        dosage_suggestion_variant_indexes[index]
                    ];
                if (dosage === lowerDosage) {
                    lower_dosages.push(record);
                } else if (dosage === higherDosage) {
                    higher_dosages.push(record);
                }
            }
        });
    }

    const lowerDosage =
        DosageSelectionVariantIndexToDosage[product_href][
            lower_dosages[0].variant_index!
        ];
    const higherDosage =
        DosageSelectionVariantIndexToDosage[product_href][
            higher_dosages[0].variant_index!
        ];

    lower_dosages.sort(sortByCadency(product_href));
    higher_dosages.sort(sortByCadency(product_href));

    // Don't show michigan states 6 month options at the moment
    if (
        renewalOrder.state === USStates.Michigan ||
        renewalOrder.state === USStates.California
    ) {
        lower_dosages = lower_dosages.filter(
            (price) =>
                price.cadence !== SubscriptionCadency.Biannually &&
                price.cadence !== SubscriptionCadency.Annually
        );

        higher_dosages = higher_dosages.filter(
            (price) =>
                price.cadence !== SubscriptionCadency.Biannually &&
                price.cadence !== SubscriptionCadency.Annually
        );
    }

    return {
        lower_dosages: { dosage: lowerDosage, dosage_list: lower_dosages },
        higher_dosages: { dosage: higherDosage, dosage_list: higher_dosages },
    };
}

export async function refillPreferenceScreenSingleDosageDataFetch(
    renewalOrder: RenewalOrder
): Promise<(Partial<ProductVariantRecord> | null)[]> {
    const { product_href, dosage_suggestion_variant_indexes } = renewalOrder;

    const priceDataRecords = await Promise.all(
        dosage_suggestion_variant_indexes.map((variantIndex) =>
            getPriceDataRecordWithVariant(product_href, variantIndex)
        )
    );

    if (
        renewalOrder.state === USStates.Michigan ||
        renewalOrder.state === USStates.California
    ) {
        return priceDataRecords.filter(
            (price) => price?.cadence !== SubscriptionCadency.Biannually
        );
    }

    return priceDataRecords;
}
