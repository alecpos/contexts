'use server';

import {
    ADDITIONAL_MEDICATIONS_QUESTION_SET,
    GENDER_IDENTITY_QUESTION_SET,
    INTAKE_REPRODUCTIVE_QUESTION_SET,
    SKINCARE_INTAKE_REPRODUCTIVE_QUESTION_SET,
    MENTAL_HEALTH_QUESTION_SET,
    WEIGHT_LOSS_DIETING_QUESTION_SET,
    WEIGHT_LOSS_GLP_1_QUESTION_SET,
    WL_INTAKE_REPRODUCTIVE_QUESTION_SET,
    GENERAL_INTAKE_REPRODUCTIVE_QUESTION_SET,
    WL_GOAL_QUESTION_SET,
    WL_FAMILY_STRUGGLE_QUESTION_SET,
    HERS_GENDER_QUESTION_SET,
    HERS_MENTAL_HEALTH_QUESTION_SET,
    HERS_SUICIDAL_QUESTION_SET,
    HERS_CONDITIONS_REQUIRING_EXTRA_LOGIC,
    HERS_PERSONAL_HISTORY_REQUIRING_EXTRA_LOGIC,
} from '../../constants/question-constants';
import { getQuestionAnswerWithQuestionID } from '@/app/utils/database/controller/questionnaires/questionnaire';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import {
    getCombinedOrderV2,
    getOrderForProduct,
} from '@/app/utils/database/controller/orders/orders-api';
import { getQuestionAnswersForBMI } from '@/app/utils/database/controller/clinical_notes/clinical_notes_v2';
import { AB_TESTS_IDS } from '../../types/intake-enumerators';
import { getCommonStringsSorted } from '@/app/utils/functions/client-utils';
import {
    getNextQuestionForHersLogic,
    getNextQuestionForHersLogicMaster,
    getNextQuestionForHersPersonalHistory,
    getNextQuestionForHersPersonalHistoryMaster,
} from '@/app/utils/actions/questionnaires/questionnaire-actions';
import { redirect } from 'next/navigation';

interface DeterminantPayload {
    next_question_id: string;
    skip_set: boolean;
    end_questions?: boolean;
}

export async function determineNextQuesitonIDForCustomPost(
    question_id: string,
    answer: Answer,
    product_href: string,
    user_id: string,
    payload: any,
    searchParams: string,
    vwo_test_ids?: string[]
): Promise<DeterminantPayload> {
    const urlParams = new URLSearchParams(searchParams);
    const test_id = urlParams.get('test_id');

    // console.log(
    //     'vwo_test_ids passed into determineNextQuesitonIDForCustomPost from client:',
    //     vwo_test_ids
    // );

    switch (question_id) {
        case '2304':
            if (answer.answer === 'Male') {
                return {
                    next_question_id:
                        HERS_GENDER_QUESTION_SET[
                            HERS_GENDER_QUESTION_SET.length - 1
                        ],
                    skip_set: true,
                };
            }
            return {
                next_question_id: '2305',
                skip_set: false,
            };
        case '2308':
            if (answer.answer === 'No') {
                return {
                    next_question_id:
                        HERS_MENTAL_HEALTH_QUESTION_SET[
                            HERS_MENTAL_HEALTH_QUESTION_SET.length - 1
                        ],
                    skip_set: true,
                };
            }
            return {
                next_question_id: '2309',
                skip_set: false,
            };
        case '2309':
            if (
                answer.formData.includes('Bipolar disease (manic depression)')
            ) {
                return {
                    next_question_id: '2311',
                    skip_set: false,
                };
            } else if (answer.formData.includes('Other')) {
                return {
                    next_question_id: '2310',
                    skip_set: false,
                };
            }
            return {
                next_question_id:
                    HERS_MENTAL_HEALTH_QUESTION_SET[
                        HERS_MENTAL_HEALTH_QUESTION_SET.length - 1
                    ],
                skip_set: true,
            };
        case '2310': {
            return {
                next_question_id: '2312',
                skip_set: false,
            };
        }
        case '2311': {
            const questionData = await getQuestionAnswerWithQuestionID(
                '2309',
                user_id
            );

            if (
                questionData &&
                questionData.answer &&
                questionData.answer.answer.formData.includes('Other')
            ) {
                return {
                    next_question_id: '2310',
                    skip_set: false,
                };
            }

            return {
                next_question_id: '2312',
                skip_set: false,
            };
        }
        case '2312': {
            if (answer.answer === 'No') {
                return {
                    next_question_id:
                        HERS_MENTAL_HEALTH_QUESTION_SET[
                            HERS_MENTAL_HEALTH_QUESTION_SET.length - 1
                        ],
                    skip_set: true,
                };
            }
            return {
                next_question_id: '2313',
                skip_set: false,
            };
        }
        case '2314': {
            if (answer.answer === 'No') {
                return {
                    next_question_id:
                        HERS_SUICIDAL_QUESTION_SET[
                            HERS_SUICIDAL_QUESTION_SET.length - 1
                        ],
                    skip_set: true,
                };
            }

            return {
                next_question_id: '2315',
                skip_set: false,
            };
        }
        case '2316': {
            if (answer.answer === 'No') {
                return {
                    next_question_id: '2331',
                    skip_set: false,
                };
            }
            return {
                next_question_id: '2317',
                skip_set: false,
            };
        }
        case '2317': {
            if (answer.formData.includes('No, none of these')) {
                return {
                    next_question_id: '2318',
                    skip_set: false,
                };
            }

            return {
                next_question_id: '2318',
                skip_set: false,
            };
        }
        case '2318': {
            const needsMoreLogic = getCommonStringsSorted(
                answer.formData,
                HERS_CONDITIONS_REQUIRING_EXTRA_LOGIC
            );

            if (
                needsMoreLogic.length === 0 ||
                answer.formData.includes('No, none of these apply to me')
            ) {
                // Push to other medical conditions
                return {
                    next_question_id: '2330',
                    skip_set: false,
                };
            } else {
                const nextQuestion = await getNextQuestionForHersLogic(
                    'base',
                    needsMoreLogic
                );
                return nextQuestion;
            }
        }
        case '2319': {
            if (answer.answer === 'Yes') {
                return {
                    next_question_id: '2320',
                    skip_set: false,
                };
            }

            const nextQuestion = await getNextQuestionForHersLogicMaster(
                user_id,
                'Hypertension (high blood pressure)'
            );

            return nextQuestion;
        }
        case '2320': {
            const nextQuestion = await getNextQuestionForHersLogicMaster(
                user_id,
                'Hypertension (high blood pressure)'
            );

            return nextQuestion;
        }
        case '2321': {
            const nextQuestion = await getNextQuestionForHersLogicMaster(
                user_id,
                'Heart attack'
            );

            return nextQuestion;
        }
        case '2322': {
            if (answer.formData.includes('Something else')) {
                return {
                    next_question_id: '2323',
                    skip_set: false,
                };
            }
            const nextQuestion = await getNextQuestionForHersLogicMaster(
                user_id,
                'Liver issues'
            );

            return nextQuestion;
        }
        case '2323': {
            const nextQuestion = await getNextQuestionForHersLogicMaster(
                user_id,
                'Liver issues'
            );

            return nextQuestion;
        }
        case '2324': {
            const nextQuestion = await getNextQuestionForHersLogicMaster(
                user_id,
                'Stroke, mini stroke, or TIA'
            );

            return nextQuestion;
        }
        case '2325': {
            return {
                next_question_id: '2326',
                skip_set: false,
            };
        }
        case '2326': {
            if (answer.answer === 'Yes') {
                return {
                    next_question_id: '2327',
                    skip_set: false,
                };
            }
            const nextQuestion = await getNextQuestionForHersLogicMaster(
                user_id,
                'Cancer'
            );

            return nextQuestion;
        }
        case '2327': {
            const nextQuestion = await getNextQuestionForHersLogicMaster(
                user_id,
                'Cancer'
            );

            return nextQuestion;
        }
        case '2328': {
            return {
                next_question_id: '2329',
                skip_set: false,
            };
        }
        case '2329': {
            const nextQuestion = await getNextQuestionForHersLogicMaster(
                user_id,
                'Glaucoma'
            );

            return nextQuestion;
        }
        case '2331': {
            const needsMoreLogic = getCommonStringsSorted(
                answer.formData,
                HERS_PERSONAL_HISTORY_REQUIRING_EXTRA_LOGIC
            );

            if (
                needsMoreLogic.length === 0 ||
                answer.formData.includes('No, none of the above')
            ) {
                // Push to other medical conditions
                return {
                    next_question_id: '2338',
                    skip_set: false,
                };
            } else {
                const nextQuestion =
                    await getNextQuestionForHersPersonalHistory(
                        'base',
                        needsMoreLogic
                    );
                return nextQuestion;
            }
        }
        case '2332': {
            const nextQuestion =
                await getNextQuestionForHersPersonalHistoryMaster(
                    user_id,
                    'Medullary thyroid cancer'
                );

            return nextQuestion;
        }
        case '2333': {
            const nextQuestion =
                await getNextQuestionForHersPersonalHistoryMaster(
                    user_id,
                    'Multiple endocrine neoplasia type-2'
                );

            return nextQuestion;
        }
        case '2334': {
            const nextQuestion =
                await getNextQuestionForHersPersonalHistoryMaster(
                    user_id,
                    'Pancreatitis'
                );

            return nextQuestion;
        }
        case '2335': {
            const nextQuestion =
                await getNextQuestionForHersPersonalHistoryMaster(
                    user_id,
                    'Gastroparesis (delayed stomach emptying)'
                );

            return nextQuestion;
        }
        case '2336': {
            const nextQuestion =
                await getNextQuestionForHersPersonalHistoryMaster(
                    user_id,
                    'Diabetes type 2'
                );

            return nextQuestion;
        }
        case '2337': {
            const nextQuestion =
                await getNextQuestionForHersPersonalHistoryMaster(
                    user_id,
                    'Long QT syndrome'
                );

            return nextQuestion;
        }
        case '2338': {
            if (answer.answer === 'Yes') {
                return {
                    next_question_id: '2339',
                    skip_set: false,
                };
            } else {
                return {
                    next_question_id: '2340',
                    skip_set: false,
                };
            }
        }
        case '2340': {
            if (answer.answer === 'Yes') {
                return {
                    next_question_id: '2341',
                    skip_set: false,
                };
            } else {
                return {
                    next_question_id: '2357',
                    skip_set: false,
                };
            }
        }
        case '2357': {
            if (answer.answer === 'I am currently taking a GLP-1 medication') {
                return {
                    next_question_id: '2358',
                    skip_set: false,
                };
            } else if (
                answer.answer ===
                "I have taken a GLP-1 medication in the past but I'm not currently"
            ) {
                return {
                    next_question_id: '2370',
                    skip_set: false,
                };
            } else {
                return {
                    next_question_id: '2343',
                    skip_set: false,
                };
            }
        }
        case '2370': {
            if (answer.answer === 'Injectable liraglutide (Victoza, Saxenda)') {
                return {
                    next_question_id: '2375',
                    skip_set: false,
                };
            } else if (
                answer.answer ===
                'Injectable tirzepatide (Mounjaro, Zepbound, or compounded)'
            ) {
                return {
                    next_question_id: '2373',
                    skip_set: false,
                };
            } else if (
                answer.answer ===
                'Injectable semaglutide (Ozempic, Wegovy, or compounded)'
            ) {
                return {
                    next_question_id: '2371',
                    skip_set: false,
                };
            } else {
                return {
                    next_question_id: '2376',
                    skip_set: false,
                };
            }
        }
        case '2376':
        case '2372':
        case '2374':
        case '2375': {
            return {
                next_question_id: '2343',
                skip_set: false,
            };
        }
        case '2358': {
            if (
                answer.answer ===
                'Injectable tirzepatide (Mounjaro, Zepbound, or compounded)'
            ) {
                return {
                    next_question_id: '2364',
                    skip_set: false,
                };
            } else if (
                answer.answer ===
                'Injectable semaglutide (Ozempic, Wegovy, or compounded)'
            ) {
                return {
                    next_question_id: '2359',
                    skip_set: false,
                };
            } else {
                return {
                    next_question_id: '2368',
                    skip_set: false,
                };
            }
        }
        case '2364': {
            return {
                next_question_id: '2365',
                skip_set: false,
            };
        }
        case '2365': {
            return {
                next_question_id: '2366',
                skip_set: false,
            };
        }
        case '2366': {
            return {
                next_question_id: '2367',
                skip_set: false,
            };
        }
        case '2367': {
            return {
                next_question_id: '2363',
                skip_set: false,
            };
        }
        case '2368': {
            const questionData = await getQuestionAnswerWithQuestionID(
                '2358',
                user_id
            );

            if (
                questionData.answer?.answer.formData.includes(
                    'Injectable liraglutide (Victoza, Saxenda)'
                )
            ) {
                return {
                    next_question_id: '2369',
                    skip_set: false,
                };
            }
            return {
                next_question_id: '2343',
                skip_set: false,
            };
        }
        case '2369': {
            return {
                next_question_id: '2343',
                skip_set: false,
            };
        }
        case '2359': {
            return {
                next_question_id: '2360',
                skip_set: false,
            };
        }
        case '2360': {
            return {
                next_question_id: '2361',
                skip_set: false,
            };
        }
        case '2361': {
            return {
                next_question_id: '2362',
                skip_set: false,
            };
        }
        case '2362': {
            return {
                next_question_id: '2363',
                skip_set: false,
            };
        }
        case '2363': {
            return {
                next_question_id: '2343',
                skip_set: false,
            };
        }
        case '2343': {
            if (answer.answer === 'Yes') {
                return {
                    next_question_id: '2344',
                    skip_set: false,
                };
            } else {
                return {
                    next_question_id: '2347',
                    skip_set: false,
                };
            }
        }
        case '2347': {
            if (answer.answer === 'Yes') {
                return {
                    next_question_id: '2348',
                    skip_set: false,
                };
            } else {
                return {
                    next_question_id: '2349',
                    skip_set: false,
                };
            }
        }
        case '2351': {
            if (answer.answer === 'Yes') {
                return {
                    next_question_id: '2352',
                    skip_set: false,
                };
            } else {
                return {
                    next_question_id: '2353',
                    skip_set: false,
                };
            }
        }
        case '275':
            if (
                vwo_test_ids &&
                vwo_test_ids.includes(AB_TESTS_IDS.ZEALTHY_BEST_PRACTICES)
            ) {
                //zbp = 'zealthy best practices'
                return {
                    next_question_id: '167', //skip over the gender identity question
                    skip_set: false,
                };
            }

            if (
                vwo_test_ids &&
                vwo_test_ids.includes(AB_TESTS_IDS.WL_RO_TEST)
            ) {
                return { next_question_id: '167', skip_set: false };
            }

            if (
                test_id === AB_TESTS_IDS.WL_FUNNEL_V3 ||
                test_id === AB_TESTS_IDS.WL_FUNNEL_W_TRANSITIONS ||
                product_href === 'semaglutide' ||
                product_href === 'tirzepatide' ||
                product_href === 'weight-loss'
            ) {
                return {
                    next_question_id: '276',
                    skip_set: false,
                };
            }

            if (product_href === PRODUCT_HREF.B12_INJECTION) {
                return {
                    next_question_id: '2623',
                    skip_set: false,
                };
            }
            return {
                next_question_id:
                    GENDER_IDENTITY_QUESTION_SET[
                        GENDER_IDENTITY_QUESTION_SET.length - 1
                    ],
                skip_set: true,
            };

        case '276':
            // console.log('answer !!', answer);

            if (answer.answer === 'Yes') {
                return {
                    next_question_id:
                        GENDER_IDENTITY_QUESTION_SET[
                            GENDER_IDENTITY_QUESTION_SET.length - 1
                        ],
                    skip_set: true,
                };
            } else {
                return { next_question_id: '277', skip_set: false };
            }

        case '278':
            if (
                test_id === AB_TESTS_IDS.WL_FUNNEL_V3 ||
                test_id === AB_TESTS_IDS.WL_FUNNEL_W_TRANSITIONS ||
                product_href === 'semaglutide' ||
                product_href === 'tirzepatide' ||
                product_href === 'weight-loss'
            ) {
                return {
                    next_question_id: '279',
                    skip_set: false,
                };
            }
            return {
                next_question_id:
                    WL_FAMILY_STRUGGLE_QUESTION_SET[
                        WL_FAMILY_STRUGGLE_QUESTION_SET.length - 1
                    ],
                skip_set: true,
            };
        case '164':
            if (
                vwo_test_ids &&
                vwo_test_ids.includes(AB_TESTS_IDS.ZEALTHY_BEST_PRACTICES) &&
                product_href === PRODUCT_HREF.WEIGHT_LOSS
            ) {
                return {
                    next_question_id: '801',
                    skip_set: false,
                };
            }

            if (!answer.formData.includes('Dieting')) {
                return {
                    next_question_id:
                        WEIGHT_LOSS_DIETING_QUESTION_SET[
                            WEIGHT_LOSS_DIETING_QUESTION_SET.length - 1
                        ],
                    skip_set: true,
                };
            } else {
                return { next_question_id: '172', skip_set: false };
            }
            case '166':
                if (product_href === PRODUCT_HREF.SERMORELIN) {
                    return { next_question_id: '2624', skip_set: false };
                }
                if (product_href === PRODUCT_HREF.WEIGHT_LOSS) {
                const order = await getOrderForProduct(
                    PRODUCT_HREF.WEIGHT_LOSS,
                    user_id
                );

                if (!order) {
                    return { next_question_id: '280', skip_set: false };
                }

                if (
                    order.metadata['selected_product'] ===
                        PRODUCT_HREF.METFORMIN ||
                    order.metadata['selected_product'] ===
                        PRODUCT_HREF.WL_CAPSULE
                ) {
                    return {
                        next_question_id: '6',
                        skip_set: false,
                    };
                }

                return { next_question_id: '280', skip_set: false };
            }
            if (vwo_test_ids?.includes(AB_TESTS_IDS.WL_HERS_FUNNEL)) {
                return { next_question_id: '2302', skip_set: false };
            }
            return { next_question_id: '164', skip_set: false };
        case '167':
            if (
                test_id === AB_TESTS_IDS.WL_FUNNEL_V3 ||
                test_id === AB_TESTS_IDS.WL_FUNNEL_W_TRANSITIONS ||
                product_href === 'semaglutide' ||
                product_href === 'tirzepatide' ||
                product_href === 'weight-loss'
            ) {
                return { next_question_id: '174', skip_set: false };
            }
            return {
                next_question_id:
                    WL_GOAL_QUESTION_SET[WL_GOAL_QUESTION_SET.length - 1],
                skip_set: true,
            };
        case '44':
            if (product_href === PRODUCT_HREF.WEIGHT_LOSS) {
                const weightData = await getQuestionAnswersForBMI(user_id);
                if (weightData.bmi < 27) {
                    return {
                        next_question_id: 'unavailable_bmi_v2',
                        skip_set: false,
                    };
                }
            }

            //for the 14-new-screens test, the new screens start here. They are actually just a different question set so there could be a way to get rid of this check
            //if we simplified the pre/post routing check on this question and on question 288 which is where the new screens in the test end
            if (vwo_test_ids?.includes(AB_TESTS_IDS.WL_NEW_SCREEN_TEST)) {
                return {
                    next_question_id: '2460',
                    skip_set: false,
                };
            }

            const { next_question_id, skip_set, end_questions } =
                await determineSkippingQuestionForCustomPre(
                    '288',
                    payload,
                    searchParams
                );

            return {
                next_question_id: next_question_id,
                skip_set,
            };

        case '280':
            if (!answer.formData.includes('Yes')) {
                if (product_href === PRODUCT_HREF.WEIGHT_LOSS) {
                    return {
                        next_question_id: '6',
                        skip_set: false,
                    };
                }
                const bmiData = await getQuestionAnswersForBMI(user_id);

                if (bmiData.bmi < 27) {
                    return {
                        next_question_id: 'unavailable-bmi',
                        skip_set: false,
                    };
                }
                return {
                    next_question_id:
                        WEIGHT_LOSS_GLP_1_QUESTION_SET[
                            WEIGHT_LOSS_GLP_1_QUESTION_SET.length - 1
                        ],
                    skip_set: true,
                };
            } else {
                return { next_question_id: '281', skip_set: false };
            }

        case '281':
            return { next_question_id: '282', skip_set: false };

        // return {
        //     next_question_id:
        //         WEIGHT_LOSS_GLP_1_QUESTION_SET[
        //             WEIGHT_LOSS_GLP_1_QUESTION_SET.length - 1
        //         ],
        //     skip_set: true,
        // };

        case '282':
            if (answer.formData.includes('I do not remember')) {
                return {
                    next_question_id:
                        WEIGHT_LOSS_GLP_1_QUESTION_SET[
                            WEIGHT_LOSS_GLP_1_QUESTION_SET.length - 1
                        ],
                    skip_set: true,
                };
            } else {
                return { next_question_id: '284', skip_set: false };
            }

        case '285':
            return { next_question_id: '506', skip_set: false };
        case '808':
            if (answer.formData.includes('No')) {
                return {
                    next_question_id:
                        MENTAL_HEALTH_QUESTION_SET[
                            MENTAL_HEALTH_QUESTION_SET.length - 1
                        ],
                    skip_set: true,
                };
            } else {
                return { next_question_id: '809', skip_set: false };
            }
        case '895':
            if (answer.formData.includes('No')) {
                return {
                    next_question_id:
                        ADDITIONAL_MEDICATIONS_QUESTION_SET[
                            ADDITIONAL_MEDICATIONS_QUESTION_SET.length - 1
                        ],
                    skip_set: true,
                };
            } else {
                return { next_question_id: '803', skip_set: false };
            }
        case '506':
            if (product_href === PRODUCT_HREF.WEIGHT_LOSS) {
                const order = await getCombinedOrderV2(user_id);
                if (
                    order?.metadata.selected_product ===
                        PRODUCT_HREF.WL_CAPSULE ||
                    order?.metadata.selected_product === PRODUCT_HREF.METFORMIN
                ) {
                    return { next_question_id: '6', skip_set: false };
                }
            }

            if (answer.formData.includes('More than 3 pounds')) {
                const questionDataForCase506 =
                    await getQuestionAnswerWithQuestionID(
                        '281',
                        payload.user_id
                    );

                const order = await getCombinedOrderV2(user_id);

                console.log('product_href', product_href);
                console.log(
                    'order?.metadata.selected_product',
                    order?.metadata.selected_product
                );
                console.log(
                    'questionDataForCase506.answer?.answer.formData',
                    questionDataForCase506.answer?.answer.formData
                );

                if (
                    questionDataForCase506.answer?.answer.formData.includes(
                        'Compounded Tirzepatide'
                    ) &&
                    (order?.metadata.selected_product ===
                        PRODUCT_HREF.TIRZEPATIDE ||
                        product_href === PRODUCT_HREF.TIRZEPATIDE)
                ) {
                    return { next_question_id: '505', skip_set: false };
                } else if (
                    questionDataForCase506.answer?.answer.formData.includes(
                        'Compounded Semaglutide'
                    ) &&
                    (order?.metadata.selected_product ===
                        PRODUCT_HREF.SEMAGLUTIDE ||
                        product_href === PRODUCT_HREF.SEMAGLUTIDE)
                ) {
                    return { next_question_id: '505', skip_set: false };
                } else {
                    if (product_href === PRODUCT_HREF.WEIGHT_LOSS) {
                        return { next_question_id: '6', skip_set: false };
                    }
                }
            }

            return { next_question_id: '286', skip_set: false };

        case '505':
            let href;

            if (
                product_href === PRODUCT_HREF.SEMAGLUTIDE ||
                product_href === PRODUCT_HREF.TIRZEPATIDE ||
                product_href === PRODUCT_HREF.WEIGHT_LOSS
            ) {
                return { next_question_id: '286', skip_set: false };
            }

            if (product_href === PRODUCT_HREF.WEIGHT_LOSS) {
                const order = await getOrderForProduct(
                    PRODUCT_HREF.WEIGHT_LOSS,
                    user_id
                );

                if (!order) {
                    return { next_question_id: '6', skip_set: false };
                }

                href = order.metadata['selected_product'];
            } else {
                href = product_href;
            }

            return { next_question_id: '286', skip_set: false };

        case '286':
            if (answer.formData.includes('No')) {
                return { next_question_id: '287', skip_set: false };
            }

            // if (product_href === PRODUCT_HREF.WEIGHT_LOSS) {
            //     return { next_question_id: '287', skip_set: false };
            // }
            return {
                next_question_id:
                    WEIGHT_LOSS_GLP_1_QUESTION_SET[
                        WEIGHT_LOSS_GLP_1_QUESTION_SET.length - 1
                    ],
                skip_set: true,
            };
        case '287':
            if (
                product_href === PRODUCT_HREF.SEMAGLUTIDE ||
                product_href === PRODUCT_HREF.TIRZEPATIDE
            ) {
                return { next_question_id: '895', skip_set: false };
            }

            if (product_href === PRODUCT_HREF.WEIGHT_LOSS) {
                return { next_question_id: '6', skip_set: false };
            }
            return {
                next_question_id:
                    WEIGHT_LOSS_GLP_1_QUESTION_SET[
                        WEIGHT_LOSS_GLP_1_QUESTION_SET.length - 1
                    ],
                skip_set: true,
            };
        case '539':
            if (
                answer.formData.includes(
                    'Prescription retinoid/retinoid-like (e.g. tretinoin, Retin-A, Retin-A Micro, Tazorac, Tazartene)'
                )
            ) {
                return { next_question_id: '542', skip_set: false };
            } else if (
                answer.formData.includes(
                    'Over-the-counter products (e.g. retinol)'
                )
            ) {
                return { next_question_id: '540', skip_set: false };
            } else {
                return { next_question_id: '548', skip_set: false };
            }
        case '540':
            return { next_question_id: '541', skip_set: false };
        case '541':
            return { next_question_id: '548', skip_set: false };
        case '542':
            return { next_question_id: '543', skip_set: false };
        case '544':
            //code here to fetch answer for 539:
            const answer539 = await getQuestionAnswerWithQuestionID(539);
            if (
                answer539.answer &&
                answer539.answer.answer.formData.includes(
                    'Over-the-counter products (e.g. retinol)'
                )
            ) {
                return { next_question_id: '540', skip_set: false };
            }
            return { next_question_id: '548', skip_set: false };
        case '546':
            return { next_question_id: '547', skip_set: false };
        case '1173':
            if (answer.formData.includes('To lose weight')) {
                return { next_question_id: '167', skip_set: false };
            }
            return { next_question_id: '2', skip_set: false };

        case '1943':
            if (answer.formData.includes('Type 2 diabetes')) {
                return { next_question_id: '1947', skip_set: false };
            }
            return { next_question_id: '1944', skip_set: false };

        case '15':
            if (
                ![
                    PRODUCT_HREF.SEMAGLUTIDE,
                    PRODUCT_HREF.TIRZEPATIDE,
                    PRODUCT_HREF.WEIGHT_LOSS,
                ].includes(product_href as PRODUCT_HREF)
            ) {
                return {
                    next_question_id: question_id,
                    skip_set: true,
                };
            }

            if (
                answer.formData.includes('Weight loss related surgeries') ||
                answer.formData.includes('Weight-related surgeries')
            ) {
                return { next_question_id: '1948', skip_set: false };
            }
            if (product_href === PRODUCT_HREF.WEIGHT_LOSS) {
                return { next_question_id: '44', skip_set: false };
            }
            return { next_question_id: '173', skip_set: false };

        case '1948':
            if (answer.formData.includes('More than 12 months ago')) {
                if (product_href === PRODUCT_HREF.WEIGHT_LOSS) {
                    return { next_question_id: '44', skip_set: false };
                } else {
                    return { next_question_id: '173', skip_set: false };
                }
            }
            return { next_question_id: '1949', skip_set: false };

        /**
         * ED flow: Treated with medication for ED.
         */
        case '1973':
            if (answer.formData.includes('Yes')) {
                return { next_question_id: '1974', skip_set: false };
            }
            return { next_question_id: '168', skip_set: false };

        /**
         * ED flow: Selecting previously used medications
         */
        case '1974':
            // const answer1973 = await getQuestionAnswerWithQuestionID(1974);
            if (answer.formData.some((item) => item.includes('Other'))) {
                return { next_question_id: '1975', skip_set: false };
            } else if (
                answer.formData.includes(
                    'Tadalafil (Cialis® or generic): every day'
                ) ||
                answer.formData.includes(
                    'Tadalafil (Cialis® or generic): only before sexual activity'
                )
            ) {
                return { next_question_id: '1977', skip_set: false };
            } else if (
                answer.formData.includes('Sildenafil (Viagra® or generic)')
            ) {
                return { next_question_id: '1981', skip_set: false };
            } else if (
                answer.formData.includes(
                    'Vardenafil (Levitra®, Staxyn®, or generic)'
                )
            ) {
                return { next_question_id: '1984', skip_set: false };
            } else if (answer.formData.includes('Avanafil (Stendra®)')) {
                return { next_question_id: '1987', skip_set: false };
            }
            return { next_question_id: '168', skip_set: false };

        case '1976':
            const answer1974_ = await getQuestionAnswerWithQuestionID(1974);
            if (
                answer1974_.answer &&
                answer1974_.answer.answer.formData.includes('Tadalafil')
            ) {
                return { next_question_id: '1977', skip_set: false };
            } else if (
                answer1974_.answer &&
                answer1974_.answer.answer.formData.includes(
                    'Sildenafil (Viagra® or generic)'
                )
            ) {
                return { next_question_id: '1981', skip_set: false };
            } else if (
                answer1974_.answer &&
                answer1974_.answer.answer.formData.includes(
                    'Vardenafil (Levitra®, Staxyn®, or generic)'
                )
            ) {
                return { next_question_id: '1984', skip_set: false };
            } else if (
                answer1974_.answer &&
                answer1974_.answer.answer.formData.includes(
                    'Avanafil (Stendra®)'
                )
            ) {
                return { next_question_id: '1987', skip_set: false };
            }

            return { next_question_id: '168', skip_set: false };

        /**
         * ED flow: Did Cialis work well for you?
         */
        // case '1979':
        //     if (
        //         answer.formData.includes(
        //             'No, I would prefer to try another medication',
        //         )
        //     ) {
        //         return { next_question_id: '1980', skip_set: false };
        //     } else {
        //         const answer1974 = await getQuestionAnswerWithQuestionID(1974);

        //         if (
        //             answer1974.answer &&
        //             answer1974.answer.answer.formData.includes(
        //                 'Sildenafil (Viagra® or generic)',
        //             )
        //         ) {
        //             return { next_question_id: '1981', skip_set: false };
        //         } else if (
        //             answer1974.answer &&
        //             answer1974.answer.answer.formData.includes(
        //                 'Vardenafil (Levitra®, Staxyn®, or generic)',
        //             )
        //         ) {
        //             return { next_question_id: '1984', skip_set: false };
        //         } else if (
        //             answer1974.answer &&
        //             answer1974.answer.answer.formData.includes(
        //                 'Avanafil (Stendra®)',
        //             )
        //         ) {
        //             return { next_question_id: '1987', skip_set: false };
        //         }
        //     }
        //     return { next_question_id: '168', skip_set: false };

        /**
         * ED Flow: Last question on Cialis
         */
        case '1980':
            const answer1974 = await getQuestionAnswerWithQuestionID(1974);
            if (
                answer1974.answer &&
                answer1974.answer.answer.formData.includes(
                    'Sildenafil (Viagra® or generic)'
                )
            ) {
                return { next_question_id: '1981', skip_set: false };
            } else if (
                answer1974.answer &&
                answer1974.answer.answer.formData.includes(
                    'Vardenafil (Levitra®, Staxyn®, or generic)'
                )
            ) {
                return { next_question_id: '1984', skip_set: false };
            } else if (
                answer1974.answer &&
                answer1974.answer.answer.formData.includes(
                    'Avanafil (Stendra®)'
                )
            ) {
                return { next_question_id: '1987', skip_set: false };
            }

            return { next_question_id: '168', skip_set: false };

        /**
         * ED Flow: did Viagra work for you well
         */
        // case '1982':
        //     if (
        //         answer.formData.includes(
        //             'No, I would prefer to try another medication',
        //         )
        //     ) {
        //         return { next_question_id: '1983', skip_set: false };
        //     } else {
        //         const answer1974 = await getQuestionAnswerWithQuestionID(1974);

        //         if (
        //             answer1974.answer &&
        //             answer1974.answer.answer.formData.includes(
        //                 'Vardenafil (Levitra®, Staxyn®, or generic)',
        //             )
        //         ) {
        //             return { next_question_id: '1984', skip_set: false };
        //         } else if (
        //             answer1974.answer &&
        //             answer1974.answer.answer.formData.includes(
        //                 'Avanafil (Stendra®)',
        //             )
        //         ) {
        //             return { next_question_id: '1987', skip_set: false };
        //         }
        //     }
        //     return { next_question_id: '168', skip_set: false };

        /**
         * ED Flow: final question of Viagra
         */
        case '1983':
            const answer1974for1980 = await getQuestionAnswerWithQuestionID(
                1974
            );
            if (
                answer1974for1980.answer &&
                answer1974for1980.answer.answer.formData.includes(
                    'Vardenafil (Levitra®, Staxyn®, or generic)'
                )
            ) {
                return { next_question_id: '1984', skip_set: false };
            } else if (
                answer1974for1980.answer &&
                answer1974for1980.answer.answer.formData.includes(
                    'Avanafil (Stendra®)'
                )
            ) {
                return { next_question_id: '1987', skip_set: false };
            }

            return { next_question_id: '168', skip_set: false };

        /**
         * ED Flow: did Vardenafil work for you well
         */
        // case '1985':
        //     if (
        //         answer.formData.includes(
        //             'No, I would prefer to try another medication',
        //         )
        //     ) {
        //         return { next_question_id: '1986', skip_set: false };
        //     } else {
        //         const answer1974 = await getQuestionAnswerWithQuestionID(1974);

        //         if (
        //             answer1974.answer &&
        //             answer1974.answer.answer.formData.includes(
        //                 'Avanafil (Stendra®)',
        //             )
        //         ) {
        //             return { next_question_id: '1987', skip_set: false };
        //         }
        //     }
        //     return { next_question_id: '168', skip_set: false };

        /**
         * ED Flow: final question of Vardenafil
         */
        case '1983':
            const answer1974for1983 = await getQuestionAnswerWithQuestionID(
                1974
            );
            if (
                answer1974for1983.answer &&
                answer1974for1983.answer.answer.formData.includes(
                    'Avanafil (Stendra®)'
                )
            ) {
                return { next_question_id: '1987', skip_set: false };
            }

            return { next_question_id: '168', skip_set: false };

        case '2409':
            if (answer.formData.includes('Yes')) {
                return { next_question_id: '15', skip_set: false };
            }
            return { next_question_id: '173', skip_set: false };

        /**
         * ED Flow: did Adenafil work for you well
         */
        // case '1988':
        //     if (
        //         answer.formData.includes(
        //             'No, I would prefer to try another medication'
        //         )
        //     ) {
        //         return { next_question_id: '1989', skip_set: false };
        //     } else {
        //         return { next_question_id: '168', skip_set: false };
        //     }

        case '800':
            //this will be the last question before the calculating screen for users in the 'zbp' test
            if (
                vwo_test_ids &&
                vwo_test_ids.includes(AB_TESTS_IDS.ZEALTHY_BEST_PRACTICES)
            ) {
                if (product_href === 'weight-loss') {
                    const wlOrder = await getCombinedOrderV2(user_id);
                    if (wlOrder?.metadata?.selected_product !== 'metformin') {
                        //non-metformin patient will see the calculating screen and hte graph
                        return redirect(
                            `/intake/prescriptions/${product_href}/wl-data-processing?${searchParams}`
                        );
                    } else {
                        //metformin users in global wl skip to wl-intro-3
                        return redirect(
                            `/intake/prescriptions/${product_href}/wl-intro-3-v3?${searchParams}`
                        );
                    }
                }
            }
            //if they are not in the 'zbp' test, just send them to the next question in the flow
            return { next_question_id: '801', skip_set: false };

        case '2615':
            const answer2615 = await getQuestionAnswerWithQuestionID(2615);
            if (answer2615.answer?.answer.formData.includes('Hims/Hers')) {
                return { next_question_id: '2614', skip_set: false };
            }
            if (answer2615.answer?.answer.formData.includes('Ro')) {
                return { next_question_id: '2616', skip_set: false };
            }
            if (answer2615.answer?.answer.formData.includes('Henry Meds')) {
                return { next_question_id: '2617', skip_set: false };
            }
            if (answer2615.answer?.answer.formData.includes('Found')) {
                return { next_question_id: '2618', skip_set: false };
            }
            if (answer2615.answer?.answer.formData.includes('Ivim Health')) {
                return { next_question_id: '2619', skip_set: false };
            }
            if (
                answer2615.answer?.answer.formData.includes(
                    'Weight Watchers Clinic'
                )
            ) {
                return { next_question_id: '2620', skip_set: false };
            }
            if (answer2615.answer?.answer.formData.includes('Noom')) {
                return { next_question_id: '2621', skip_set: false };
            }
            return { next_question_id: '2622', skip_set: false };
        case '2614':
            const answer2615Again = await getQuestionAnswerWithQuestionID(2615);
            if (answer2615Again.answer?.answer.formData.includes('Ro')) {
                return { next_question_id: '2616', skip_set: false };
            }
            if (
                answer2615Again.answer?.answer.formData.includes('Henry Meds')
            ) {
                return { next_question_id: '2617', skip_set: false };
            }
            if (answer2615Again.answer?.answer.formData.includes('Found')) {
                return { next_question_id: '2618', skip_set: false };
            }
            if (
                answer2615Again.answer?.answer.formData.includes('Ivim Health')
            ) {
                return { next_question_id: '2619', skip_set: false };
            }
            if (
                answer2615Again.answer?.answer.formData.includes(
                    'Weight Watchers Clinic'
                )
            ) {
                return { next_question_id: '2620', skip_set: false };
            }
            if (answer2615Again.answer?.answer.formData.includes('Noom')) {
                return { next_question_id: '2621', skip_set: false };
            }
            return { next_question_id: '6', skip_set: false };
        case '2616':
            const answer2615Again2 = await getQuestionAnswerWithQuestionID(
                2615
            );
            if (
                answer2615Again2.answer?.answer.formData.includes('Henry Meds')
            ) {
                return { next_question_id: '2617', skip_set: false };
            }
            if (answer2615Again2.answer?.answer.formData.includes('Found')) {
                return { next_question_id: '2618', skip_set: false };
            }
            if (
                answer2615Again2.answer?.answer.formData.includes('Ivim Health')
            ) {
                return { next_question_id: '2619', skip_set: false };
            }
            if (
                answer2615Again2.answer?.answer.formData.includes(
                    'Weight Watchers Clinic'
                )
            ) {
                return { next_question_id: '2620', skip_set: false };
            }
            if (answer2615Again2.answer?.answer.formData.includes('Noom')) {
                return { next_question_id: '2621', skip_set: false };
            }
            return { next_question_id: '6', skip_set: false };
        case '2617':
            const answer2615Again3 = await getQuestionAnswerWithQuestionID(
                2615
            );
            if (answer2615Again3.answer?.answer.formData.includes('Found')) {
                return { next_question_id: '2618', skip_set: false };
            }
            if (
                answer2615Again3.answer?.answer.formData.includes('Ivim Health')
            ) {
                return { next_question_id: '2619', skip_set: false };
            }
            if (
                answer2615Again3.answer?.answer.formData.includes(
                    'Weight Watchers Clinic'
                )
            ) {
                return { next_question_id: '2620', skip_set: false };
            }
            if (answer2615Again3.answer?.answer.formData.includes('Noom')) {
                return { next_question_id: '2621', skip_set: false };
            }
            return { next_question_id: '6', skip_set: false };
        case '2618':
            const answer2615Again4 = await getQuestionAnswerWithQuestionID(
                2615
            );
            if (
                answer2615Again4.answer?.answer.formData.includes('Ivim Health')
            ) {
                return { next_question_id: '2619', skip_set: false };
            }
            if (
                answer2615Again4.answer?.answer.formData.includes(
                    'Weight Watchers Clinic'
                )
            ) {
                return { next_question_id: '2620', skip_set: false };
            }
            if (answer2615Again4.answer?.answer.formData.includes('Noom')) {
                return { next_question_id: '2621', skip_set: false };
            }
            return { next_question_id: '6', skip_set: false };
        case '2619':
            const answer2615Again5 = await getQuestionAnswerWithQuestionID(
                2615
            );
            if (
                answer2615Again5.answer?.answer.formData.includes(
                    'Weight Watchers Clinic'
                )
            ) {
                return { next_question_id: '2620', skip_set: false };
            }
            if (answer2615Again5.answer?.answer.formData.includes('Noom')) {
                return { next_question_id: '2621', skip_set: false };
            }
            return { next_question_id: '6', skip_set: false };
        case '2620':
            const answer2615Again6 = await getQuestionAnswerWithQuestionID(
                2615
            );
            if (answer2615Again6.answer?.answer.formData.includes('Noom')) {
                return { next_question_id: '2621', skip_set: false };
            }
            return { next_question_id: '6', skip_set: false };
        case '2621':
            return { next_question_id: '6', skip_set: false };

        case '2638': {
            console.log('Question 2638 - Full answer data:', {
                answer,
                formData: answer.formData,
                question: answer.question
            });
            return getNextFor2638(answer);
        }



        case '2630': {

            if (answer.formData && answer.formData.includes('Type 2 diabetes')) {
                return { next_question_id: '2639', skip_set: false };
            }

            return { next_question_id: '2631', skip_set: false };
        }

        default:
            return {
                next_question_id: question_id,
                skip_set: true,
            };
    }
}

// Helper for 2638 skip logic
function getNextFor2638(answer: Answer) {
    // console.log('getNextFor2638 called with answer:', {
    //     formData: answer.formData,
    //     answer: answer.answer,
    //     question: answer.question
    // });

    // If "No" is selected, skip 2635 and go to 2630
    if (answer.formData && answer.formData.includes('No')) {
        return { 
            next_question_id: '2630', 
            skip_set: true,
            end_questions: false 
        };
    }

    // Otherwise, go to 2635
    return { 
        next_question_id: '2635', 
        skip_set: false,
        end_questions: false 
    };
}


export async function determineSkippingQuestionForCustomPre(
    question_id: string,
    payload: any,
    search: string,
    vwo_test_ids?: string[],
    product_href?: string
): Promise<DeterminantPayload> {
    switch (question_id) {
        case '23':
            if (payload.sex_at_birth === 'Male') {
                return {
                    next_question_id:
                        INTAKE_REPRODUCTIVE_QUESTION_SET[
                            INTAKE_REPRODUCTIVE_QUESTION_SET.length - 1
                        ],
                    skip_set: true,
                };
            } else {
                return { next_question_id: '23', skip_set: false };
            }

        case '277':
            const questionDataForCase277 =
                await getQuestionAnswerWithQuestionID('276', payload.user_id);

            // console.log(
            //     'questionDataForCase277',
            //     questionDataForCase277.answer?.answer.formData
            // );

            if (
                questionDataForCase277.answer?.answer.formData.includes('Yes')
            ) {
                return {
                    next_question_id: '277',
                    skip_set: true,
                };
            } else {
                return {
                    next_question_id: '277',
                    skip_set: false,
                };
            }

        case '288':
            console.log('payload.sex_at_birth for 288', payload.sex_at_birth);

            if (payload.sex_at_birth === 'Male') {
                return {
                    next_question_id:
                        WL_INTAKE_REPRODUCTIVE_QUESTION_SET[
                            WL_INTAKE_REPRODUCTIVE_QUESTION_SET.length - 1
                        ],
                    skip_set: true,
                };
            } else {
                return { next_question_id: '288', skip_set: false };
            }

        case '505':
            const questionDataForCase505 =
                await getQuestionAnswerWithQuestionID('281', payload.user_id);

            if (
                questionDataForCase505.answer?.answer.formData.includes(
                    'Compounded Tirzepatide'
                ) &&
                product_href === PRODUCT_HREF.TIRZEPATIDE
            ) {
                return { next_question_id: '286', skip_set: false };
            } else if (
                questionDataForCase505.answer?.answer.formData.includes(
                    'Compounded Semaglutide'
                ) &&
                product_href === PRODUCT_HREF.SEMAGLUTIDE
            ) {
                return { next_question_id: '286', skip_set: false };
            } else {
                if (product_href === PRODUCT_HREF.WEIGHT_LOSS) {
                    return { next_question_id: '6', skip_set: false };
                }
            }

            return { next_question_id: '895', skip_set: false };

        case '289':
            console.log('payload.sex_at_birth', payload.sex_at_birth);

            if (payload.sex_at_birth === 'Male') {
                return {
                    next_question_id:
                        WL_INTAKE_REPRODUCTIVE_QUESTION_SET[
                            WL_INTAKE_REPRODUCTIVE_QUESTION_SET.length - 1
                        ],
                    skip_set: true,
                };
            } else {
                return { next_question_id: '289', skip_set: false };
            }

        case '290':
            if (payload.state_of_residence === 'FL') {
                return { next_question_id: '290', skip_set: false };
            } else if (
                //in the zbp global wl flow, we bring the user from here to the product selection screen
                vwo_test_ids &&
                vwo_test_ids.includes(AB_TESTS_IDS.ZEALTHY_BEST_PRACTICES) &&
                product_href === PRODUCT_HREF.WEIGHT_LOSS
            ) {
                return {
                    next_question_id: '800',
                    skip_set: false,
                };
            } else {
                return {
                    next_question_id:
                        WL_INTAKE_REPRODUCTIVE_QUESTION_SET[
                            WL_INTAKE_REPRODUCTIVE_QUESTION_SET.length - 1
                        ],
                    skip_set: true,
                    end_questions: true,
                };
            }

        case '286':
            const questionData = await getQuestionAnswerWithQuestionID(
                '281',
                payload.user_id
            );

            if (
                questionData.answer?.answer.formData.includes(
                    'Compounded Tirzepatide'
                ) &&
                product_href === PRODUCT_HREF.TIRZEPATIDE
            ) {
                return { next_question_id: '286', skip_set: false };
            } else if (
                questionData.answer?.answer.formData.includes(
                    'Compounded Semaglutide'
                ) &&
                product_href === PRODUCT_HREF.SEMAGLUTIDE
            ) {
                return { next_question_id: '286', skip_set: false };
            } else {
                if (product_href === PRODUCT_HREF.WEIGHT_LOSS) {
                    return { next_question_id: '286', skip_set: false };
                }

                return { next_question_id: '895', skip_set: false };
            }

        case '287':
            const questionData287Pre = await getQuestionAnswerWithQuestionID(
                '281',
                payload.user_id
            );

            const question286AnswerFor287 =
                await getQuestionAnswerWithQuestionID('286', payload.user_id);

            if (
                question286AnswerFor287.answer?.answer?.formData.includes('No')
            ) {
                return { next_question_id: '287', skip_set: false };
            } else {
                if (product_href === PRODUCT_HREF.WEIGHT_LOSS) {
                    return { next_question_id: '6', skip_set: false };
                }

                return {
                    next_question_id: '895',
                    skip_set: false,
                };
            }

        case '554':
            if (payload.sex_at_birth === 'Male') {
                return {
                    next_question_id:
                        SKINCARE_INTAKE_REPRODUCTIVE_QUESTION_SET[
                            SKINCARE_INTAKE_REPRODUCTIVE_QUESTION_SET.length - 1
                        ],
                    skip_set: true,
                };
            } else {
                return { next_question_id: '554', skip_set: false };
            }
        case '555':
            if (payload.sex_at_birth === 'Male') {
                return {
                    next_question_id:
                        SKINCARE_INTAKE_REPRODUCTIVE_QUESTION_SET[
                            SKINCARE_INTAKE_REPRODUCTIVE_QUESTION_SET.length - 1
                        ],
                    skip_set: true,
                };
            } else {
                return { next_question_id: '555', skip_set: false };
            }
        case '1100':
            if (payload.sex_at_birth === 'Male') {
                return {
                    next_question_id:
                        GENERAL_INTAKE_REPRODUCTIVE_QUESTION_SET[
                            GENERAL_INTAKE_REPRODUCTIVE_QUESTION_SET.length - 1
                        ],
                    skip_set: true,
                };
            } else {
                return { next_question_id: '1100', skip_set: false };
            }
        case '1102':
            if (payload.sex_at_birth === 'Male') {
                return {
                    next_question_id:
                        GENERAL_INTAKE_REPRODUCTIVE_QUESTION_SET[
                            GENERAL_INTAKE_REPRODUCTIVE_QUESTION_SET.length - 1
                        ],
                    skip_set: true,
                };
            } else {
                return { next_question_id: '1102', skip_set: false };
            }
        case '166':
            if (
                vwo_test_ids &&
                vwo_test_ids.includes(AB_TESTS_IDS.WL_SHOW_GRAPH_FIRST)
            ) {
                return {
                    next_question_id: '164',
                    skip_set: false,
                };
            } else if (
                vwo_test_ids &&
                vwo_test_ids.includes(AB_TESTS_IDS.WL_RO_TEST)
            ) {
                return {
                    next_question_id: '280',
                    skip_set: false,
                };
            } else {
                return { next_question_id: '166', skip_set: false };
            }

        default:
            return { next_question_id: question_id, skip_set: true };
    }
}
