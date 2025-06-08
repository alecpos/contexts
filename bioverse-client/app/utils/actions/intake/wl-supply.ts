'use server';

import {
    GLP1Questions,
    MedicationDictionary,
    QuestionInformation,
} from '@/app/types/questionnaires/questionnaire-types';
import {
    MEDICATION_DICTIONARY_V3,
    MEDICATION_DICTIONARY_V3_CROSS_MAP,
} from '../../constants/intake';
import {
    DosageDurationAnswers,
    IntakeProductNames,
    ProductMappings,
} from '@/app/types/intake/intake-flow-types';
import { dosageDurationMap } from '@/app/components/intake-v2/constants/constants';
import {
    SEMAGLUTIDE_PRODUCT_HREF,
    TIRZEPATIDE_PRODUCT_HREF,
} from '@/app/services/tracking/constants';
import {
    mounjaroMappings,
    ozempicMappings,
    rybelsusMappings,
    saxendaMappings,
    semaglutideMappings,
    tirzepatideMappings,
    trulicityMappings,
    victozaMappings,
    wegovyMappings,
    zepboundMappings,
} from '@/app/components/intake-v2/constants/dosage-mapping-constants';
import { Status } from '@/app/types/global/global-enumerators';
import {
    getPriceDataRecordWithVariant,
    ProductVariantRecord,
} from '../../database/controller/product_variants/product_variants';

class RetailDosageRecommender {
    // If they are past this threshold, then move the user to a higher dosage
    static getThreshold(product_href: string) {
        switch (product_href) {
            case IntakeProductNames.Wegovy: // Need this
                return DosageDurationAnswers.ThreeWeeks;
            case IntakeProductNames.Ozempic:
                return DosageDurationAnswers.ThreeWeeks;
            case IntakeProductNames.Rybelsus:
                return DosageDurationAnswers.OneMonth;
            case IntakeProductNames.Mounjaro:
                return DosageDurationAnswers.ThreeWeeks;
            case IntakeProductNames.Zepbound:
                return DosageDurationAnswers.ThreeWeeks;
            case IntakeProductNames.Saxenda:
                return DosageDurationAnswers.OneMonth;
            case IntakeProductNames.Trulicity:
                return DosageDurationAnswers.ThreeWeeks;
            case IntakeProductNames.Victoza:
                return DosageDurationAnswers.OneWeek;
            case IntakeProductNames.Semaglutide:
                return DosageDurationAnswers.ThreeWeeks;
            case IntakeProductNames.Tirzepatide:
                return DosageDurationAnswers.ThreeWeeks;
            default:
                console.error('Unknown product for recommender', product_href);
                return DosageDurationAnswers.OneWeek;
        }
    }

    // Returns the dosage we are recommending to the user based on their past product and duration
    static async getDosage(
        intake_product_href: string,
        questionDict: { [key: number]: QuestionInformation }
    ) {
        const previousGLPProduct =
            questionDict[GLP1Questions.WhichGLP1].answer?.answer;

        const previousDosage = await extractFirstNumber(
            questionDict[GLP1Questions.RecentWeeklyDosage].answer?.answer
        );

        const previousDuration =
            questionDict[GLP1Questions.DosageDuration].answer?.answer;

        const threshold = this.getThreshold(previousGLPProduct);
        // Determine if past threshold (whether they qualify for higher dosage based on usage)
        const previousDurationValue = dosageDurationMap.get(previousDuration);
        const thresholdValue = dosageDurationMap.get(threshold);
        const pastThreshold =
            previousDurationValue !== undefined && thresholdValue !== undefined
                ? previousDurationValue >= thresholdValue
                : false;

        switch (previousGLPProduct) {
            case IntakeProductNames.Wegovy:
                return this.getDosageForProduct(
                    wegovyMappings,
                    intake_product_href,
                    previousDosage,
                    pastThreshold
                );
            case IntakeProductNames.Ozempic:
                return this.getDosageForProduct(
                    ozempicMappings,
                    intake_product_href,
                    previousDosage,
                    pastThreshold
                );
            case IntakeProductNames.Rybelsus:
                return this.getDosageForProduct(
                    rybelsusMappings,
                    intake_product_href,
                    previousDosage,
                    pastThreshold
                );
            case IntakeProductNames.Mounjaro:
                return this.getDosageForProduct(
                    mounjaroMappings,
                    intake_product_href,
                    previousDosage,
                    pastThreshold
                );
            case IntakeProductNames.Zepbound:
                return this.getDosageForProduct(
                    zepboundMappings,
                    intake_product_href,
                    previousDosage,
                    pastThreshold
                );
            case IntakeProductNames.Saxenda:
                return this.getDosageForProduct(
                    saxendaMappings,
                    intake_product_href,
                    previousDosage,
                    pastThreshold
                );
            case IntakeProductNames.Trulicity:
                return this.getDosageForProduct(
                    trulicityMappings,
                    intake_product_href,
                    previousDosage,
                    pastThreshold
                );
            case IntakeProductNames.Victoza:
                return this.getDosageForProduct(
                    victozaMappings,
                    intake_product_href,
                    previousDosage,
                    pastThreshold
                );
            case IntakeProductNames.Tirzepatide:
                return this.getDosageForProduct(
                    tirzepatideMappings,
                    intake_product_href,
                    previousDosage,
                    pastThreshold
                );
            case IntakeProductNames.Semaglutide:
                return this.getDosageForProduct(
                    semaglutideMappings,
                    intake_product_href,
                    previousDosage,
                    pastThreshold
                );
            default:
                console.error(
                    'Unknown product for recommender',
                    previousGLPProduct,
                    threshold
                );
                return -1;
        }
    }

    static getDosageForProduct(
        mappings: ProductMappings,
        intake_product_href: string,
        previousDosage: number,
        pastThreshold: boolean
    ) {
        const recommendedDosage =
            mappings[intake_product_href][previousDosage][
                pastThreshold ? 'higher_dosage' : 'regular_dosage'
            ];

        if (recommendedDosage) {
            return recommendedDosage;
        }

        return -1;
    }
}

export async function getRecommendedDosage(
    intake_product_href: string,
    questionInformation: QuestionInformation[]
) {
    const questionDict = await constructQuestionObject(questionInformation);
    const hasTakenGLP =
        questionDict[GLP1Questions.TakenGLP1].answer?.answer === 'Yes';

    const previousGLPProduct =
        questionDict[GLP1Questions.WhichGLP1].answer?.answer;

    const lowestDosage =
        MEDICATION_DICTIONARY_V3[
            intake_product_href as keyof MedicationDictionary
        ]['lowest_dosage'].dosage;

    if (!lowestDosage) {
        return Status.Failure;
    }

    console.log(
        'hasTakenGLP',
        questionDict[GLP1Questions.TakenGLP1].answer?.answer
    );

    if (hasTakenGLP) {
        console.log('hasTakenGLP triggered');

        const sameSemaglutide =
            intake_product_href === SEMAGLUTIDE_PRODUCT_HREF &&
            previousGLPProduct === IntakeProductNames.Semaglutide;
        const sameTirzepatide =
            intake_product_href === TIRZEPATIDE_PRODUCT_HREF &&
            previousGLPProduct === IntakeProductNames.Tirzepatide;
        // If the GLP1 medication they've taken recently is the same as what they're requesting (semaglutide or tirzepatide)
        if (sameTirzepatide || sameSemaglutide) {
            const useDifferentDosage =
                questionDict[GLP1Questions.ContinueSameDosage].answer?.answer;

            const recentlyWeeklyDosage =
                questionDict[GLP1Questions.RecentWeeklyDosage].answer?.answer;

            if (
                recentlyWeeklyDosage === 'I do not remember' ||
                recentlyWeeklyDosage.includes('Other')
            ) {
                return lowestDosage;
            }
            // If they want to use a different dosage, use the answer asked in the following question

            if (useDifferentDosage === 'No') {
                const newDosage =
                    questionDict[GLP1Questions.NewRequestedDosage].answer
                        ?.answer;
                return await extractNumberFromDosage(newDosage);
            } else if (useDifferentDosage === 'Yes') {
                // Otherwise just recommend their last used dosage
                return await extractNumberFromDosage(recentlyWeeklyDosage);
            } else {
                const retailDosageRecommender =
                    await RetailDosageRecommender.getDosage(
                        intake_product_href,
                        questionDict
                    );
                if (retailDosageRecommender === -1) {
                    return lowestDosage;
                }
                return retailDosageRecommender;
            }
        } else {
            // const sameSemaglutide =
            //     intake_product_href === SEMAGLUTIDE_PRODUCT_HREF &&
            //     previousGLPProduct === IntakeProductNames.Semaglutide;
            // const sameTirzepatide =
            //     intake_product_href === TIRZEPATIDE_PRODUCT_HREF &&
            //     previousGLPProduct === IntakeProductNames.Tirzepatide;

            // if (sameSemaglutide || sameTirzepatide) {
            //     return lowestDosage;
            // }

            const needsDifferentialCrossMap =
                (intake_product_href === SEMAGLUTIDE_PRODUCT_HREF &&
                    previousGLPProduct === IntakeProductNames.Tirzepatide) ||
                (intake_product_href === TIRZEPATIDE_PRODUCT_HREF &&
                    previousGLPProduct === IntakeProductNames.Semaglutide);

            if (needsDifferentialCrossMap) {
                const recentlyWeeklyDosage = await extractNumberFromDosage(
                    questionDict[GLP1Questions.RecentWeeklyDosage].answer
                        ?.answer
                );

                const foundDosage =
                    MEDICATION_DICTIONARY_V3_CROSS_MAP[intake_product_href][
                        recentlyWeeklyDosage
                    ];

                if (foundDosage) {
                    return foundDosage.dosage;
                }
            }

            console.log(
                'needsDifferentialCrossMap',
                needsDifferentialCrossMap,
                questionDict[GLP1Questions.RecentWeeklyDosage].answer?.answer
            );

            const retailDosageRecommender =
                await RetailDosageRecommender.getDosage(
                    intake_product_href,
                    questionDict
                );
            if (retailDosageRecommender === -1) {
                return lowestDosage;
            }
            return retailDosageRecommender;
        }
    }

    return lowestDosage;
}

export async function getRecommendedPrices(
    dosage: string | number,
    product_href: string
): Promise<{
    bundlePrice: Partial<ProductVariantRecord> | null;
    monthlyPrice: Partial<ProductVariantRecord> | null;
    biannualPrice: Partial<ProductVariantRecord> | null;
    annualPrice: Partial<ProductVariantRecord> | null;
}> {
    const recommendation = MEDICATION_DICTIONARY_V3[
        product_href as keyof MedicationDictionary
    ][dosage]
        ? MEDICATION_DICTIONARY_V3[product_href as keyof MedicationDictionary][
              dosage
          ]
        : MEDICATION_DICTIONARY_V3[product_href as keyof MedicationDictionary][
              'lowest_dosage'
          ];

    const bundlePrice = await getPriceDataRecordWithVariant(
        product_href,
        recommendation.bundle_variant_index
    );
    const monthlyPrice = await getPriceDataRecordWithVariant(
        product_href,
        recommendation.monthly_variant_index
    );

    let biannualPrice = null;
    if (recommendation.biannual_variant_index) {
        biannualPrice = await getPriceDataRecordWithVariant(
            product_href,
            recommendation.biannual_variant_index
        );
    }

    let annualPrice = null;
    if (recommendation.annual_variant_index) {
        annualPrice = await getPriceDataRecordWithVariant(
            product_href,
            recommendation.annual_variant_index
        );
    }

    return { bundlePrice, monthlyPrice, biannualPrice, annualPrice };
}

export async function fetchData(
    intake_product_href: string,
    questionInformation: QuestionInformation[],
    pvn?: string
): Promise<{
    bundlePrice: Partial<ProductVariantRecord> | null;
    monthlyPrice: Partial<ProductVariantRecord> | null;
    biannualPrice: Partial<ProductVariantRecord> | null;
    annualPrice: Partial<ProductVariantRecord> | null;
    semaglutideV74PriceData?: {
        bundlePrice: Partial<ProductVariantRecord> | null;
        monthlyPrice: Partial<ProductVariantRecord> | null;
        biannualPrice: Partial<ProductVariantRecord> | null;
        annualPrice: Partial<ProductVariantRecord> | null;
    };

} | null> {
    const recommendedDosage = await getRecommendedDosage(
        intake_product_href,
        questionInformation
    );

    if (recommendedDosage === Status.Failure) {
        return null;
    }
    let recommendedPrices: {
        bundlePrice: Partial<ProductVariantRecord> | null;
        monthlyPrice: Partial<ProductVariantRecord> | null;
        biannualPrice: Partial<ProductVariantRecord> | null;
        annualPrice: Partial<ProductVariantRecord> | null;
    };

    if (!recommendedDosage || (pvn && pvn !== '0')) { //the pvn may be changed from zero if the user goes to 'Modify my plan' and comes back
        recommendedPrices = await getRecommendedPrices(
            pvn ? pvn : 0,
            intake_product_href
        );
    } else {
        recommendedPrices = await getRecommendedPrices(
            recommendedDosage,
            intake_product_href
        );
    }

    // Extra: Always fetch variant 74 for semaglutide
    if (intake_product_href === SEMAGLUTIDE_PRODUCT_HREF) {
        const variant = 74;

        const [bundlePrice, monthlyPrice, biannualPrice, annualPrice] =
            await Promise.all([
                getPriceDataRecordWithVariant(intake_product_href, variant),
                getPriceDataRecordWithVariant(intake_product_href, variant),
                getPriceDataRecordWithVariant(intake_product_href, variant),
                getPriceDataRecordWithVariant(intake_product_href, variant),
            ]);

        return {
            ...recommendedPrices,
            semaglutideV74PriceData: {
                bundlePrice,
                monthlyPrice,
                biannualPrice,
                annualPrice,
            },
        };
    }

    return recommendedPrices;
}
async function extractNumberFromDosage(dosage: string): Promise<string> {
    const numberPart = dosage.split(' ')[0];
    return numberPart;
}

export async function constructQuestionObject(
    questionInformation: QuestionInformation[]
): Promise<{ [key: number]: QuestionInformation }> {
    const result = questionInformation.reduce(
        (
            acc: { [key: number]: QuestionInformation },
            item: QuestionInformation
        ) => {
            acc[item.question_id] = item;
            return acc;
        },
        {}
    );

    return result;
}

async function extractFirstNumber(inputString: string): Promise<number> {
    const match = inputString.match(/\d+(\.\d+)?/);
    return match ? parseFloat(match[0]) : -1;
}
