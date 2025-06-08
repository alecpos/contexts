'use server';

import { isEmpty } from 'lodash';
import { createSupabaseServiceClient } from '../../clients/supabaseServerClient';
import {
    Question,
    constructCheckupJunction,
    constructNonWeightlossCheckupQuestions,
    constructWeightlossCheckupQuestions,
} from './questionnaire-question-constants';
import { NON_WL_PRODUCT_HREFS } from '@/app/services/tracking/constants';
import { getQuestionAnswerWithQuestionID } from '../../database/controller/questionnaires/questionnaire';
import {
    HERS_CONDITIONS_REQUIRING_EXTRA_LOGIC,
    HERS_PERSONAL_HISTORY_REQUIRING_EXTRA_LOGIC,
} from '@/app/components/intake-v2/constants/question-constants';
import { getCommonStringsSorted } from '../../functions/client-utils';

interface Questionnaire {
    id: number;
}

export async function getNextQuestionForHersPersonalHistory(
    currentScreen: string,
    conditions: string[]
): Promise<{ next_question_id: string; skip_set: boolean }> {
    type ConditionType = keyof typeof CONDITIONS_TO_QUESTION_ID;
    const CONDITIONS_TO_QUESTION_ID = {
        'Medullary thyroid cancer': '2332',
        'Multiple endocrine neoplasia type-2': '2333',
        Pancreatitis: '2334',
        'Gastroparesis (delayed stomach emptying)': '2335',
        'Diabetes type 2': '2336',
        'Long QT syndrome': '2337',
    };
    var nextCondition: ConditionType;
    if (currentScreen === 'base') {
        nextCondition = conditions[0] as ConditionType;
    } else {
        const currentScreenIndex = conditions.indexOf(currentScreen) + 1;
        if (
            currentScreenIndex >= conditions.length ||
            currentScreenIndex === 0
        ) {
            // Send to other medical conditions
            return {
                next_question_id: '2338',
                skip_set: false,
            };
        } else {
            nextCondition = conditions[currentScreenIndex] as ConditionType;
        }
    }
    const next_question_id = CONDITIONS_TO_QUESTION_ID[nextCondition];

    return {
        next_question_id,
        skip_set: false,
    };
}

export async function getNextQuestionForHersPersonalHistoryMaster(
    user_id: string,
    currentScreen: string
) {
    const questionData = await getQuestionAnswerWithQuestionID('2331', user_id);

    if (questionData && questionData.answer) {
        const needsMoreLogic = getCommonStringsSorted(
            questionData.answer.answer.formData,
            HERS_PERSONAL_HISTORY_REQUIRING_EXTRA_LOGIC
        );

        const nextQuestion = await getNextQuestionForHersPersonalHistory(
            currentScreen,
            needsMoreLogic
        );

        return nextQuestion;
    }

    // Push to other medical conditions
    return {
        next_question_id: '2338',
        skip_set: false,
    };
}

export async function getNextQuestionForHersLogic(
    currentScreen: string,
    conditions: string[]
): Promise<{ next_question_id: string; skip_set: boolean }> {
    type ConditionType = keyof typeof CONDITIONS_TO_QUESTION_ID;
    const CONDITIONS_TO_QUESTION_ID = {
        'Hypertension (high blood pressure)': '2319',
        'Heart attack': '2321',
        'Heart disease (coronary artery disease)': '2321',
        'Liver issues': '2322',
        'Stroke, mini stroke, or TIA': '2324',
        Cancer: '2325',
        Glaucoma: '2328',
    };
    var nextCondition: ConditionType;
    if (currentScreen === 'base') {
        nextCondition = conditions[0] as ConditionType;
    } else {
        const currentScreenIndex = conditions.indexOf(currentScreen) + 1;
        if (
            currentScreenIndex >= conditions.length ||
            currentScreenIndex === 0
        ) {
            // Send to other medical conditions
            return {
                next_question_id: '2330',
                skip_set: false,
            };
        } else {
            nextCondition = conditions[currentScreenIndex] as ConditionType;
        }
    }
    const next_question_id = CONDITIONS_TO_QUESTION_ID[nextCondition];

    return {
        next_question_id,
        skip_set: false,
    };
}

// For question what she's been diagnosed with
export async function getNextQuestionForHersLogicMaster(
    user_id: string,
    currentScreen: string
) {
    const questionData = await getQuestionAnswerWithQuestionID('2318', user_id);

    if (questionData && questionData.answer) {
        const needsMoreLogic = getCommonStringsSorted(
            questionData.answer.answer.formData,
            HERS_CONDITIONS_REQUIRING_EXTRA_LOGIC
        );

        const nextQuestion = await getNextQuestionForHersLogic(
            currentScreen,
            needsMoreLogic
        );

        return nextQuestion;
    }

    // Push to other medical conditions
    return {
        next_question_id: '2330',
        skip_set: false,
    };
}

export async function getQuestionnaireVersion(
    product_href: string
): Promise<number> {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('products')
        .select('current_question_set_version')
        .eq('href', product_href)
        .single();

    if (error) {
        return 1;
    }

    if (data && data.current_question_set_version) {
        return data.current_question_set_version;
    }

    return 1;
}

// Check if checkup questionnaire exists. If not, create it
export async function shouldCreateCheckupQuestionnaire(
    product_href: string,
    version_number: number
) {
    try {
        const supabase = createSupabaseServiceClient();

        const questionnaire_name = `${product_href}-checkup-${version_number}`;

        const { data: version_data, error: version_error } = await supabase
            .from('products')
            .select('checkup_questionnaire_set_version')
            .eq('href', product_href)
            .single();

        if (version_error) {
            console.error(version_error, version_error.message);
            return null;
        }

        console.log(version_data);

        const { data, error } = await supabase
            .from('questionnaire_questionnaires')
            .select('*')
            .eq('product_name', questionnaire_name)
            .eq(
                'question_set_version',
                version_data.checkup_questionnaire_set_version
            )
            .maybeSingle();

        console.log('DATA', data);

        if (error) {
            console.error(
                'Error fetching questionnaire for name',
                questionnaire_name
            );
            return;
        }

        if (isEmpty(data) || !data) {
            // Get questionnaire version

            // Fetch highest id
            const { data: idData, error } = await supabase
                .from('questionnaire_questionnaires')
                .select('id')
                .order('id', { ascending: false })
                .limit(1)
                .single();

            // Create questionnaire
            const { data: createData, error: createError } = (await supabase
                .from('questionnaire_questionnaires')
                .insert({
                    product_name: questionnaire_name,
                    type: 'check_up',
                    id: idData?.id + 1,
                    question_set_version:
                        version_data.checkup_questionnaire_set_version,
                })
                .select()
                .single()) as {
                data: Questionnaire | null;
                error: Error | null;
            };

            if (createError || !createData || !createData.id) {
                console.error(
                    'Error creating questionnaire',
                    error,
                    createError,
                    createData
                );
                return;
            }

            // Fetch highest id
            const { data: questionIdData, error: questionIdError } =
                await supabase
                    .from('questionnaire_questions')
                    .select('id')
                    .order('id', { ascending: false })
                    .limit(1)
                    .single();

            // Check whether the current medication is WL or non-WL

            const isNonWL = NON_WL_PRODUCT_HREFS.includes(product_href);

            // Create questions
            let questions;
            if (isNonWL) {
                questions = await constructNonWeightlossCheckupQuestions(
                    questionIdData?.id
                );
            } else {
                questions = await constructWeightlossCheckupQuestions(
                    questionIdData?.id
                );
            }

            const { data: questionData, error: questionError } = await supabase
                .from('questionnaire_questions')
                .insert(questions)
                .select();

            if (questionError || !questionData) {
                console.error('Error inserting questions', questionError);
            }

            // Create questionnaire junctions
            const questionnaire_id = createData?.id;

            const {
                data: questionJunctionIdData,
                error: questionIdJunctionError,
            } = await supabase
                .from('questionnaire_junction')
                .select('id')
                .order('id', { ascending: false })
                .limit(1)
                .single();

            if (error || !questionJunctionIdData) {
                console.error(
                    'Error with questionnaire junction',
                    questionJunctionIdData
                );
            }

            const junctionData = await constructCheckupJunction(
                questionData as Question[],
                questionnaire_id,
                questionJunctionIdData?.id + 1
            );

            const {
                data: questionnaireJunctionData,
                error: questionnaireJunctionError,
            } = await supabase
                .from('questionnaire_junction')
                .insert(junctionData);

            if (questionnaireJunctionError) {
                console.error(
                    'Error adding junction to table',
                    questionnaireJunctionError
                );
            }
            console.log('created questionnaire successfully');
        } else {
            console.log('Did not create questionnaire');
        }
    } catch (error) {
        console.error(
            'Error in shouldCreateCheckupQuestionnaire',
            error,
            product_href,
            version_number
        );
    }
    return true;
}
