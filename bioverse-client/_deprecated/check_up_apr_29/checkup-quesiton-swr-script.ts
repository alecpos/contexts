// 'use server';

// import {
//     CheckupQuestionData,
//     Question,
// } from '@/app/types/check-up/check-up-types';
// import { getNextQuestion } from '@/app/utils/actions/check-up/check-up-actions';
// import { getQuestionInformation_with_version } from '@/app/utils/database/controller/questionnaires/questionnaire';
// import { createSupabaseServiceClient } from '@/app/utils/clients/supabaseServerClient';
// import ActionItemFactory from '../../action-items/utils/ActionItemFactory';

// export async function getCheckupQuestionData(
//     userId: string,
//     questionnaire_name: string,
//     question_id: number
// ): Promise<CheckupQuestionData | null> {
//     // Fetch the first question to navigate the user to

//     const actionItemInstance = new ActionItemFactory(questionnaire_name);

//     const questionData = await getQuestionInformation_with_version(
//         userId,
//         questionnaire_name,
//         question_id,
//         0,
//         true
//     );

//     if (!questionData) {
//         console.error('No question data returned');
//         return null;
//     }

//     const { data: question, version } = questionData;

//     const nextQuestion = await getNextQuestion(questionnaire_name, question_id);

//     const supabase = createSupabaseServiceClient();

//     const { data: version_data, error: version_error } = await supabase
//         .from('products')
//         .select('checkup_questionnaire_set_version')
//         .eq('href', actionItemInstance.getProductHref())
//         .single();

//     if (version_error) {
//         console.error(
//             'Error trying to get checkup version',
//             userId,
//             version_error,
//             version_error.message
//         );
//         return null;
//     }

//     return {
//         question: question as Question[], // Ensure that 'question' is of type 'Question[]'
//         next_question: nextQuestion,
//         version: 3,
//     };
// }

// export async function getCheckupQuestionnaire_with_version(
//     user_id: string,
//     product_href: string,
//     question_id: number
// ) {
//     const supabase = createSupabaseServiceClient();

//     const { data: version_data, error: version_error } = await supabase
//         .from('products')
//         .select('current_question_set_version')
//         .eq('href', product_href)
//         .single();

//     const version = version_data?.current_question_set_version;

//     const { data, error } = await supabase.rpc(
//         'get_question_information_with_version',
//         {
//             user_id_: user_id,
//             product_name_: product_href,
//             question_id_: question_id,
//             version_: version,
//         }
//     );

//     if (error) {
//         console.error(error, error.message);
//         return null;
//     }

//     return { data, version: version_data?.current_question_set_version };
// }
