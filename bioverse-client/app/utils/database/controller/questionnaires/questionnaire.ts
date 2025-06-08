'use server';
import { createSupabaseServiceClient } from '../../../clients/supabaseServerClient';
import { readUserSession } from '../../../actions/auth/session-reader';
import {
    CheckupQuestionnaire,
    CheckupResponse,
    CheckupResponseReturn,
    GroupedResponses,
    IntakeQuestionnaire,
    QuestionInformation,
    QuestionnaireAnswer,
    TaskViewQuestionData,
    TaskViewQuestionResponse,
} from '@/app/types/questionnaires/questionnaire-types';
import { SubmissionTimes } from '@/app/types/renewal-orders/renewal-orders-types';
import ActionItemFactory from '@/app/components/patient-portal/action-items/utils/ActionItemFactory';
import {
    getAllGLP1OrdersForProduct,
    getAllGLP1RenewalOrdersForProduct,
} from '../orders/orders-api';
import { getAllGLP1SubscriptionsForProduct } from '../../../actions/prescription-subscriptions/prescription-subscriptions-actions';
import { SubscriptionStatus } from '@/app/types/enums/master-enums';
import { isGLP1Product } from '../../../functions/pricing';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import { AB_TESTS_IDS } from '@/app/components/intake-v2/types/intake-enumerators';
import { VWO_TEST_QUESTIONNAIRES_VERSION_MAPPINGS } from '@/app/components/intake-v2/constants/route-constants';
import { getAllActionsItemsForPatientWithSession } from '../action-items/action-items-actions';

/**
 *
 *  @author Nathan Cho
 * Please use the functions that are at the top that involve session ID.
 *
 * The intent of the question system is to use sessions to find the patient's answers quickly.
 *
 */

export async function getQADataByQuestionIdAndSessionId(
    question_id: number,
    session_id: number
): Promise<{
    question: QUESTIONNAIRE_QUESTIONS_TYPE;
    answer: QUESTIONNAIRE_ANSWERS_TYPE | undefined;
} | null> {
    const supabase = await createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('questionnaire_questions')
        .select('*')
        .eq('id', question_id)
        .single();

    if (error) {
        console.error('Error getting question data', error);
        return null;
    }

    const { data: answer_data, error: answer_error } = await supabase
        .from('questionnaire_answers')
        .select('*')
        .eq('question_id', question_id)
        .eq('session_id', session_id)
        .maybeSingle();

    if (answer_error) {
        console.error('Error getting answer data', answer_error);
    }

    return { question: data, answer: answer_data ?? undefined };
}

export async function getQuestionnaireJunctionByQuestionnaireId(
    questionnaire_id: number
): Promise<QUESTIONNAIRE_JUNCTION_TYPE[] | null> {
    const supabase = await createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('questionnaire_junction')
        .select('*')
        .eq('questionnaire_id', questionnaire_id)
        .order('priority', { ascending: true });

    if (error) {
        console.error('Error getting questionnaire data', error);
        return null;
    }

    return data as QUESTIONNAIRE_JUNCTION_TYPE[];
}

//////////

/////
// returns all question_ids for a particular product
export async function getQuestionsForProduct(product_href: string) {
    const supabase = await createSupabaseServiceClient();

    const { data, error } = await supabase.rpc('get_questions_for_product', {
        name: product_href,
    });

    if (error) {
        console.error(error, error.message);
        return null;
    }

    return data;
}
// GET QUESTIONS FOR PRODUCT WITH TYPE?
export async function getQuestionsForProduct_with_type(
    product_href: string,
    type: any
) {
    const supabase = await createSupabaseServiceClient();
    const { data, error } = await supabase.rpc(
        'get_questions_for_product_with_type',
        {
            name_: product_href,
            type_: type,
        }
    );

    if (error) {
        console.error(error, error.message);
        return null;
    }

    return data;
}

export async function getQuestionsForProduct_with_Version(
    product_href: string,
    overrideVersion: number
) {
    const supabase = createSupabaseServiceClient();

    if (overrideVersion === 0) {
        // Fetch the current question set version
        const { data: version_data, error: version_error } = await supabase
            .from('products')
            .select('current_question_set_version')
            .eq('href', product_href)
            .single();

        if (version_error || !version_data) {
            console.error(
                'Error fetching version data:',
                version_error || 'No data returned',
                'Product Href:',
                product_href
            );
            throw new Error('Failed to fetch version data');
        }

        overrideVersion = version_data.current_question_set_version;
    }

    if (!overrideVersion) {
        console.error('Version is undefined or null', overrideVersion);
        throw new Error('Invalid version number');
    }

    console.log('OVERRIDE VERSION', overrideVersion);

    // Fetch the questions using the version
    const { data, error } = await supabase.rpc(
        'get_questions_for_product_with_version',
        {
            name_: product_href,
            version_: overrideVersion,
        }
    );

    console.log(data);

    if (error || !data) {
        console.error('Error fetching questions:', error || 'No data returned');
        throw new Error('Failed to fetch questions');
    }

    console.dir(data);
    return data;
}
// returns [question_id, question (jsonb), answer (jsonb or null)] for a particular question
export async function getQuestionInformation(
    user_id: string,
    product_href: string,
    question_id: number
) {
    const supabase = await createSupabaseServiceClient();

    const { data, error } = await supabase.rpc('get_question_information', {
        user_id_: user_id,
        product_name_: product_href,
        question_id_: question_id,
    });
    console.log('data', data);
    if (error) {
        console.error(error, error.message);
        return null;
    }

    return data;
}

export async function getAllPreQuestions(
    product_href: PRODUCT_HREF,
    vwo_test_id: AB_TESTS_IDS
) {
    const supabase = createSupabaseServiceClient();

    const version =
        VWO_TEST_QUESTIONNAIRES_VERSION_MAPPINGS[product_href]?.[vwo_test_id];

    if (!version) {
        return null;
    }

    const { data, error } = await supabase.rpc(
        'get_pre_questions_for_product_with_version',
        {
            name_: product_href,
            version_: version,
        }
    );

    if (error || !data) {
        console.error(
            'Error fetching pre questions:',
            error || 'No data returned'
        );
        throw new Error('Failed to fetch pre questions');
    }
    return data;
}

export async function getPreQuestionsForProduct_with_Version(
    product_href: PRODUCT_HREF,
    vwo_test_id: AB_TESTS_IDS
) {
    const supabase = createSupabaseServiceClient();

    const version =
        VWO_TEST_QUESTIONNAIRES_VERSION_MAPPINGS[product_href]?.[vwo_test_id];

    if (!version) {
        return null;
    }

    // Fetch the questions using the version
    const { data, error } = await supabase.rpc(
        'get_questions_for_product_with_version',
        {
            name_: product_href,
            version_: version,
        }
    );

    if (error || !data) {
        console.error('Error fetching questions:', error || 'No data returned');
        throw new Error('Failed to fetch questions');
    }
    return data;
}

// Returns the last answer recorded for a question, regardless of version
export async function getLatestAnswerForQuestion(
    user_id: string,
    question_id: string
): Promise<QuestionnaireAnswer | null> {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase.rpc(
        'get_latest_answer_for_question'
    );

    if (error) {
        console.error(
            'Error getting latest answer for question',
            user_id,
            question_id
        );
        return null;
    }

    if (!data || data.length !== 1) {
        console.error(
            'Error occurred while getting the latest answer for question',
            user_id,
            question_id
        );
        return null;
    }

    return data[0] as QuestionnaireAnswer;
}

export async function getPreQuestionInformationWithVersion(
    product_href: PRODUCT_HREF,
    question_id: number,
    vwo_test_id: AB_TESTS_IDS
) {
    const version =
        VWO_TEST_QUESTIONNAIRES_VERSION_MAPPINGS[product_href]?.[vwo_test_id];

    if (!version) {
        return null;
    }

    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase.rpc(
        'get_pre_question_information_with_version',
        {
            product_name_: product_href,
            question_id_: question_id,
            version_: version,
        }
    );

    if (error) {
        console.error('Error pulling question', error);
        return null;
    }

    return { data, version };
}

// returns [question_id, question (jsonb), answer (jsonb or null)] for a particular question
export async function getQuestionInformation_with_version(
    user_id: string,
    product_name: string, // for checkup: questionnaire_name | for intake: product_href
    question_id: number,
    versionOverride: number,
    isCheckup: boolean = false
) {
    try {
        const supabase = createSupabaseServiceClient();

        let product_href;

        if (isCheckup) {
            const actionItemInstance = new ActionItemFactory(product_name);
            product_href = actionItemInstance.getProductHref();
        } else {
            product_href = product_name;
        }

        const { data: version_data, error: version_error } = await supabase
            .from('products')
            .select(
                isCheckup
                    ? 'checkup_questionnaire_set_version'
                    : 'current_question_set_version'
            )
            .eq('href', product_href)
            .single();

        if (version_error) {
            console.error(version_error, version_error.message);
            return null;
        }

        if (versionOverride === 0) {
            versionOverride = isCheckup
                ? (version_data as { checkup_questionnaire_set_version: any })
                      .checkup_questionnaire_set_version
                : (version_data as { current_question_set_version: any })
                      .current_question_set_version;
        }

        //**Mock of version 3 for testing new questionnaire */
        // version = 3;
        // Ensure version_data is of the expected type

        const { data, error } = await supabase.rpc(
            'get_question_information_with_version',
            {
                user_id_: user_id,
                product_name_: product_name,
                question_id_: question_id,
                version_: versionOverride,
            }
        );

        if (error) {
            console.error(error, error.message);
            return null;
        }

        return { data, version: versionOverride };
    } catch (error) {
        console.error('Error in QUESTION ID', error);
        throw error;
    }
}

export async function getQuestionInformation_with_type(
    user_id: string,
    product_href: string,
    question_id: number,
    type: any
) {
    const supabase = await createSupabaseServiceClient();

    const { data, error } = await supabase.rpc(
        'get_question_information_with_type',
        {
            user_id_: user_id,
            product_name_: product_href,
            question_id_: question_id,
            type_: type,
        }
    );

    if (error) {
        console.error(error, error.message);
        return null;
    }

    return data;
}

// Upsert questionnaire answer
export async function writeQuestionnaireAnswer(
    user_id: string,
    question_id: number,
    answer: any,
    version: number,
    session_id?: number
) {
    const supabase = await createSupabaseServiceClient();
    const { data, error } = await supabase
        .from('questionnaire_answers')
        .upsert(
            {
                user_id,
                question_id,
                answer,
                answer_set_version: version,
                session_id: session_id && session_id > 0 ? session_id : null,
            },
            // onConflict specifies which columns form a unique constraint
            // If a record already exists with matching user_id, question_id, and session_id
            // the existing record will be updated instead of creating a duplicate
            {
                onConflict: 'user_id, question_id, session_id',
            }
        )
        .select();

    if (data && data.length === 0) {
        console.error(
            'Error writing answer',
            user_id,
            question_id,
            answer,
            version,
            error
        );
    }

    if (error) {
        console.error(error, error.message);
        return null;
    }
    // console.log('questionnaire answer', data);

    return data;
}

export async function getCheckupQuestionnaireResponse(
    user_id: string
): Promise<CheckupQuestionnaire[]> {
    const supabase = await createSupabaseServiceClient();

    const { data, error } = await supabase.rpc(
        'get_checkup_questionnaire_answers_for_provider',
        { user_id_: user_id, product_name_: '' }
    );

    if (error) {
        console.error(
            'getCheckupQuestionnaireResponse error',
            error,
            error.message
        );
        return [];
    }
    return data;
}

export async function writeQuestionnaireAnswerWithVersion(
    user_id: string,
    question_id: number,
    answer: any,
    answer_set_version: string
) {
    const supabase = await createSupabaseServiceClient();
    const { data, error } = await supabase.from('questionnaire_answers').upsert(
        {
            user_id,
            question_id,
            answer,
            answer_set_version,
        },
        { onConflict: 'user_id, question_id,answer_set_version' }
    );

    if (error) {
        console.error(error, error.message);
        return null;
    }
    return data;
}

export async function writeMultipleQuestionnaireAnswersWithVersion(
    answers: any[]
) {
    const supabase = createSupabaseServiceClient();

    await supabase.from('questionnaire_answers').upsert(answers, {
        onConflict: 'user_id, question_id,answer_set_version',
    });
}

export async function getQuestionnaireResponseForProduct(
    user_id: string,
    product: string,
    orderId: string
) {
    const supabase = createSupabaseServiceClient();

    if (orderId === '1714' || orderId === '1746') {
        // For the users who completed the questionnaire during the transition period
        const { data, error } = await supabase.rpc(
            'get_questionnaire_answers_for_provider',
            { user_id_: user_id, product_name_: 'semaglutide-deprecated' }
        );
        if (error) {
            console.error(
                'getQuestionnaireResponseForProduct error',
                error,
                error.message
            );
            return null;
        }
        return data;
    }

    if (orderId === '1870') {
        // For the user who did the weightloss flow for metformin, just give them a weightloss questionnaire
        const { data, error } = await supabase.rpc(
            'get_questionnaire_answers_for_provider',
            { user_id_: user_id, product_name_: 'semaglutide' }
        );
        if (error) {
            console.error(
                'getQuestionnaireResponseForProduct error',
                error,
                error.message
            );
            return null;
        }
        return data;
    }

    const { data, error } = await supabase.rpc(
        'get_questionnaire_answers_for_provider',
        { user_id_: user_id, product_name_: product }
    );
    if (error) {
        console.error(
            'getQuestionnaireResponseForProduct error',
            error,
            error.message
        );
        return null;
    }
    return data;
}

export async function getQuestionnaireResponseForProduct_with_version(
    user_id: string,
    product: string,
    version: number
): Promise<IntakeQuestionnaire[]> {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase.rpc(
        'get_questionnaire_answers_for_provider_with_version',
        {
            user_id_: user_id,
            product_name_: product as string,
            version_: version as number,
        }
    );

    if (error) {
        console.log(
            'getQuestionnaireResponseForProduct error',
            error,
            error.message
        );
        return [];
    }

    let hasTooManyNullAnswers =
        data.filter((answer: any) => answer.answer === null).length > 24;
    // tech debt ^ need to refactor - WRITTEN IN SOP
    if (product === PRODUCT_HREF.SEMAGLUTIDE && version === 7) {
        hasTooManyNullAnswers = false; //tech debt <-- need to delete
    }

    if (hasTooManyNullAnswers) {
        if (product === PRODUCT_HREF.SEMAGLUTIDE) {
            const responses = await handleWrongQuestionSetVersionInOrder(
                user_id,
                product,
                6
            ); //check new semaglutide question set
            const stillHasTooManyNullAnswers =
                responses.filter((answer: any) => answer.answer === null)
                    .length > 24;
            if (stillHasTooManyNullAnswers) {
                const responses = await handleWrongQuestionSetVersionInOrder(
                    user_id,
                    product,
                    3
                ); //check global wl question set
                return responses;
            }
            return responses;
        }

        if (product === PRODUCT_HREF.TIRZEPATIDE) {
            const responses = await handleWrongQuestionSetVersionInOrder(
                user_id,
                product,
                5
            ); //check new tirz question set
            const stillHasTooManyNullAnswers =
                responses.filter((answer: any) => answer.answer === null)
                    .length > 24;
            if (stillHasTooManyNullAnswers) {
                const responses = await handleWrongQuestionSetVersionInOrder(
                    user_id,
                    product,
                    3
                ); //check global wl question set
                return responses;
            }
            return responses;
        }

        if (product === PRODUCT_HREF.METFORMIN) {
            const responses = await handleWrongQuestionSetVersionInOrder(
                user_id,
                product,
                3
            ); //check new global wl question set
            return responses;
        }

        if (product === PRODUCT_HREF.WEIGHT_LOSS) {
            const responses = await handleWrongQuestionSetVersionInOrder(
                user_id,
                product,
                3 //if the default version of 2 yields no answers, check the newer global wl question set
            );
            return responses;
        }
        return [];
    }

    return data;
}

export async function handleWrongQuestionSetVersionInOrder(
    user_id: string,
    product: string,
    version: number
): Promise<IntakeQuestionnaire[]> {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase.rpc(
        'get_questionnaire_answers_for_provider_with_version',
        {
            user_id_: user_id,
            product_name_: product as string,
            version_: version as number,
        }
    );
    if (error) {
        console.log(
            'getQuestionnaireResponseForProduct error',
            error,
            error.message
        );
        return [];
    }

    return data;
}

export async function getRenewalQuestionAnswerForProductWithVersion(
    user_id: string,
    product: string,
    version: number
) {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase.rpc(
        'get_check_in_questionnaire_answers_for_provider_with_version',
        {
            user_id_: user_id,
            product_name_: product,
            version_: version,
        }
    );
    if (error) {
        console.error(
            'getQuestionnaireResponseForProduct error',
            error,
            error.message
        );
        return [];
    }

    return data;
}

/**
 *
 * @param user_id user id
 * @param question_id question id
 * @returns a string representing the answer.
 */
export async function getQuestionAnswerWithQuestionID(
    /**
     * @Edit UserID is now an optional parameter, and if it is undefined, I will redefine it to be the current user.
     * Changed user_id inside of call to questionnaire_answers to use user_id_to_fetch from : which is conditionally the current user.
     */
    question_id: string | number,
    user_id?: string
) {
    const supabase = createSupabaseServiceClient();

    const user_id_to_fetch_from = user_id
        ? user_id
        : (await readUserSession()).data.session?.user.id;

    if (!user_id_to_fetch_from) {
        console.log('no user_id');
    }

    const { data: answer, error } = await supabase
        .from('questionnaire_answers')
        .select('answer')
        .eq('user_id', user_id_to_fetch_from)
        .eq('question_id', question_id)
        .limit(1)
        .maybeSingle();

    if (error) {
        console.error(error, error?.message);
        return { answer: null, error: error };
    }

    if (!answer) {
        console.log('No answer');
        return { answer: null, error: null };
    }

    return { answer: answer, error: null };
}

export async function getQuestionAnswerVersionWithQuestionID(
    /**
     * @Edit UserID is now an optional parameter, and if it is undefined, I will redefine it to be the current user.
     * Changed user_id inside of call to questionnaire_answers to use user_id_to_fetch from : which is conditionally the current user.
     */
    question_id: string,
    user_id?: string
): Promise<number | null> {
    const supabase = createSupabaseServiceClient();

    const user_id_to_fetch_from = user_id
        ? user_id
        : (await readUserSession()).data.session?.user.id;

    const { data, error } = await supabase
        .from('questionnaire_answers')
        .select('answer_set_version')
        .eq('user_id', user_id_to_fetch_from)
        .eq('question_id', question_id)
        .order('answer_set_version', { ascending: false })
        .limit(1)
        .maybeSingle();

    if (error) {
        console.error(error, error?.message);
        return null;
    }

    return data?.answer_set_version;
}

/**
 * This function exists solely to fetch the answer to the weight loss goal question.
 * Used for rendering the screen which shows the weight loss goal transition.
 * @param user_id
 */
export async function getWLGoalAnswer(user_id: string, product_name: string) {
    const supabase = createSupabaseServiceClient();

    const data = await getQuestionInformation_with_version(
        user_id,
        product_name,
        167,
        0
    );

    if (!data || !data.data || !data.data[0]) {
        console.error('Error pulling WLGoalAnswer', user_id, product_name);
        return { answer: { answer: 'no-answer' }, error: null };
    }

    return { answer: data.data[0], error: null };
}

export async function getCheckupResponses(
    user_id: string,
    product_href: string
): Promise<CheckupResponse[]> {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase.rpc(
        'get_checkup_response_for_product_v2',
        { user_id_: user_id, product_name_: product_href }
    );

    if (error) {
        console.error('Error getting checkup responses', error);
        return [];
    }

    return data;
}

export async function getCheckupResponsesWithoutSession(
    user_id: string,
    product_href: string
): Promise<CheckupResponse[]> {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase.rpc(
        'get_product_checkup_response_without_session',
        { user_id_: user_id, product_name_: product_href }
    );

    if (error) {
        console.error('Error getting checkup responses', error);
        return [];
    }

    return data;
}

/**
 * @author Nathan Cho
 * Consumes a user Id for a patient, searches all action items for non-active check ups
 * From each check up with a session ID, it will search for all questions for those checkups and fetch answer/question data
 * The system then sorts the questions into a format consumable by the intake view and returns.
 *
 * The function is currently in O(n) linear time.
 * I would caution editing this function directly, but rather what I would do is if you need more information, modify the rpc function to select more.
 */
export async function getAllCheckupResponsesWithSession(user_id: string) {
    const supabase = createSupabaseServiceClient();
    const action_items = await getAllActionsItemsForPatientWithSession(user_id);

    const session_ids = action_items.map(
        (item) => item.questionnaire_session_id!
    );

    if (session_ids.length === 0) {
        return [];
    }

    const { data: rpcData, error } = await supabase.rpc(
        'get_task_view_question_response_from_session_array',
        { sessions: session_ids }
    );

    const sessionToRpcDataMap = new Map();
    rpcData.forEach((item: any) => {
        if (!sessionToRpcDataMap.has(item.session_id)) {
            sessionToRpcDataMap.set(item.session_id, []);
        }
        sessionToRpcDataMap.get(item.session_id).push(item);
    });

    if (error) {
        console.error('Error getting checkup responses', error);
        return [];
    }

    function mapRpcDataToResponses(rpcDataItems: any[], actionItem: any) {
        return rpcDataItems.map((item) => ({
            question_id: item.question_id,
            question: {
                question: item.question.question,
                options: item.question.options,
                noneBox: item.question.noneBox,
                other: item.question.other,
            },
            answer: {
                answer: item.answer.answer,
                question: item.answer.question,
                formData: item.answer.formData,
            },
        }));
    }

    const taskViewQuestionDataArray = action_items.map((action_item) => {
        // Get the RPC data for this action item's session
        const responses = action_item.questionnaire_session_id
            ? mapRpcDataToResponses(
                  sessionToRpcDataMap.get(
                      action_item.questionnaire_session_id
                  ) || [],
                  action_item
              )
            : [];

        const convertActionItemType = (type: string) => {
            const productName = type.split('-')[0];
            const iteration = type.split('-')[2];
            return `${
                productName.charAt(0).toUpperCase() + productName.slice(1)
            } Check-in #${iteration}`;
        };

        // Create the TaskViewQuestionData object
        return {
            product_name: convertActionItemType(action_item.type),
            submission_time: action_item.submission_time,
            responses: responses,
        };
    });

    return taskViewQuestionDataArray as TaskViewQuestionData[];
}

// active_glp1_subscription: if they have at least one active glp1 subscription
// previously_denied_subscription: If a pt has ever been denied for glp1
// previously_canceled_subscription: If a pt has previous canceled their subscription and is coming back

export async function getGLP1Statuses(user_id: string) {
    const supabase = createSupabaseServiceClient();

    const orders = await getAllGLP1OrdersForProduct(user_id);
    const renewalOrders = await getAllGLP1RenewalOrdersForProduct(user_id);
    const subscriptions = await getAllGLP1SubscriptionsForProduct(user_id);

    if (!orders || !renewalOrders || !subscriptions) {
        return {
            active_glp1_subscription: false,
            previously_denied_subscription: false,
            previously_canceled_subscription: false,
        };
    }

    const active_glp1_subscription = subscriptions.some(
        (subscription) =>
            subscription.status === SubscriptionStatus.Active ||
            subscription.status === SubscriptionStatus.Scheduled_Cancel
    );

    const previously_denied_subscription = [...orders, ...renewalOrders].some(
        (order) =>
            [
                'Denied-Paid',
                'Denied-Unpaid',
                'Denied-NoCard',
                'Denied-CardDown',
            ].includes(order.order_status)
    );

    // This function returns true under the following conditions:
    // 1. If there is only 1 GLP1 subscription found and it has the status of 'canceled'
    // 2. If multiple GLP1 subscriptions are found, and at least one subscription has a status of 'canceled'
    const previously_canceled_subscription =
        (subscriptions.length === 1 &&
            subscriptions[0].status === SubscriptionStatus.Canceled &&
            isGLP1Product(subscriptions[0].product_href)) ||
        (subscriptions.length > 1 &&
            subscriptions.some(
                (subscription) =>
                    isGLP1Product(subscription.product_href) &&
                    subscription.status === 'canceled'
            ));

    return {
        active_glp1_subscription,
        previously_denied_subscription,
        previously_canceled_subscription,
    };
}

export async function filterCheckupResponses(
    checkupResponses: CheckupResponse[]
): Promise<CheckupResponse[]> {
    // Group responses by product_name
    const groupedResponses: { [key: string]: CheckupResponse[] } = {};

    checkupResponses.forEach((response) => {
        if (!groupedResponses[response.product_name]) {
            groupedResponses[response.product_name] = [];
        }
        groupedResponses[response.product_name].push(response);
    });

    // Filter out groups where all answers are null
    const filteredResponses: CheckupResponse[] = [];
    for (const product_name in groupedResponses) {
        const responses = groupedResponses[product_name];
        const allAnswersNull = responses.every(
            (response) => response.answer === null || !response.answer
        );
        if (!allAnswersNull) {
            filteredResponses.push(...responses);
        }
    }

    return filteredResponses;
}

export async function categorizeCheckupResponse(
    checkupResponses: CheckupResponse[],
    baseName: string,
    renewalSubmissionTimes: SubmissionTimes
): Promise<CheckupResponseReturn[]> {
    const grouped: GroupedResponses = {};

    // product_name is semaglutide-checkup-0 here
    checkupResponses.forEach((response) => {
        if (!grouped[response.product_name]) {
            grouped[response.product_name] = [];
        }
        grouped[response.product_name].push(response);
    });

    const submittedTimes: any = {};

    // forms submittedTimes object that maps [semaglutide-checkup-0] to submission time
    for (const [key, value] of Object.entries(renewalSubmissionTimes)) {
        if (value) {
            if (!key.includes('-')) {
                continue;
            }

            submittedTimes[key] = value;
        }
    }

    // Convert the grouped object into an array of objects
    return Object.keys(grouped).map((product_name: any, index: number) => ({
        checkup_name: product_name,
        product_name: renderSelectTitle(baseName, index + 1),
        responses: grouped[product_name],
        submission_time: submittedTimes[product_name],
        index: Number(product_name.charAt(product_name.length - 1)) + 1,
    }));
}

const renderSelectTitle = (baseName: string, index: number): string => {
    if (index === 0) {
        return `${baseName} Intake`;
    } else {
        return `${baseName} Check-in #${index}`;
    }
};

export async function getMultipleQuestionInformationWithVersion(
    user_id: string,
    product_href: string,
    question_ids: number[]
): Promise<QuestionInformation[]> {
    const supabase = createSupabaseServiceClient();

    const { data: version_data, error: version_error } = await supabase
        .from('products')
        .select('current_question_set_version')
        .eq('href', product_href)
        .single();

    const version = version_data?.current_question_set_version;

    const { data, error } = await supabase.rpc(
        'get_multiple_question_information_with_version',
        {
            user_id_: user_id,
            product_name_: product_href,
            question_ids_: question_ids,
            version_: version,
        }
    );

    if (error) {
        console.error(
            'Error getting multiple questions',
            user_id,
            question_ids,
            product_href
        );
        return [];
    }

    return data;
}

// Gets the first question after finalPreQuestion = true
export async function getFirstQuestionAfterPreQuestions(
    product_href: PRODUCT_HREF,
    version: number
) {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase.rpc(
        'get_first_question_after_pre_questions',
        {
            name_: product_href,
            version_: version,
        }
    );

    if (error || !data) {
        console.error(error);
        return null;
    }

    return data[0].question_id as number;
}
