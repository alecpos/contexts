// /**
//  * File is deprecated
//  */

// import { CheckupQuestionData } from '@/app/types/check-up/check-up-types';
// import { createCurrentPatientWeightAudit } from '@/app/utils/database/controller/patient_weight_audit/patient-weight-audit-api';
// import { getSubscriptionByProduct } from '@/app/utils/database/controller/prescription_subscriptions/prescription_subscriptions';
// import ActionItemFactory from '../../action-items/utils/ActionItemFactory';
// import { getCheckupQuestionData } from './checkup-quesiton-swr-script';
// import { updateSessionCompletion } from '@/app/utils/database/controller/questionnaires/questionnaire_sessions';

// /**
//  * Consumes answer data + question data and returns the route string to push the user to.
//  */
// export async function determineCheckUpQuestionNextQuestion(
//     checkupQuestionData: CheckupQuestionData,
//     answerData: Answer,
//     questionnaireName: string,
//     userId: string,
//     questionnaireSessionId?: number
// ): Promise<string> {
//     /**
//      * This is a specific check for whether the question is the last question in the set.
//      * If this proves true, we can push the user to the success screen.
//      */
//     if (checkupQuestionData.next_question.question_id === -2) {
//         // await handleCheckupCompletion(questionnaireName, userId);
//         if (questionnaireSessionId) {
//             await updateSessionCompletion(questionnaireSessionId);
//         }
//         return `/check-up/${questionnaireName}/success`;
//     }

//     const nextQuestionData = await getCheckupQuestionData(
//         userId,
//         questionnaireName,
//         checkupQuestionData.next_question.question_id
//     );

//     const nextQuestionText =
//         nextQuestionData?.question[0].question.type === 'logic'
//             ? nextQuestionData.question[0].question.steps[0].question
//             : nextQuestionData?.question[0].question;

//     /**
//      * Pre check to see if question is valid for the user based on logic
//      */
//     switch (nextQuestionText) {
//         case checkUpLogicQuestion.HAPPY_WITH_DOSAGE:
//             /**
//              * need to check here if the user cadence and do conditional skips. 2 skips if the user is not monthly.
//              */
//             const cadence = await getUserCadenceFromUserIdAndQuestionnaireName(
//                 userId,
//                 questionnaireName
//             );

//             if (cadence != 'monthly') {
//                 return `/check-up/${questionnaireName}/question/${
//                     checkupQuestionData.next_question.question_id + 2
//                 }`;
//             }
//     }

//     console.log(
//         'question question: ',
//         checkupQuestionData.question[0].question.question
//     );

//     /**
//      * Post answer Switch to determine the next question set.
//      */
//     switch (checkupQuestionData.question[0].question.question) {
//         case checkUpLogicQuestion.CURRENT_WEIGHT:
//             await createCurrentPatientWeightAudit(
//                 parseFloat(answerData.formData[0]),
//                 'check-in'
//             );
//             break;

//         case checkUpLogicQuestion.ARE_YOU_TAKING_NEW_MEDICATIONS:
//             if (answerData.answer.includes('No')) {
//                 // await handleCheckupCompletion(questionnaireName, userId);
//                 return `/check-up/${questionnaireName}/success`;
//             }
//             break;

//         case checkUpLogicQuestion.CHANGES_IN_MEDICAL_HISTORY:
//             if (answerData.answer.includes('No')) {
//                 return `/check-up/${questionnaireName}/question/${
//                     checkupQuestionData.next_question.question_id + 1
//                 }`;
//             }
//             break;
//         case checkUpLogicQuestion.CONFIRM_MEDICATION:
//             return `/check-up/${questionnaireName}/question/${
//                 checkupQuestionData.next_question.question_id + 1
//             }`;
//         case checkUpLogicQuestion.HOW_MANY_WEEKS:
//             console.log('how many weeks return hit');
//             return `/check-up/${questionnaireName}/question/${checkupQuestionData.next_question.question_id}`;
//     }
//     return `/check-up/${questionnaireName}/question/${checkupQuestionData.next_question.question_id}`;
// }

// enum checkUpLogicQuestion {
//     CURRENT_WEIGHT = 'What is your current weight?',
//     ARE_YOU_TAKING_NEW_MEDICATIONS = 'Since the last time you reported your medical information, are you taking any new medications?',
//     CHANGES_IN_MEDICAL_HISTORY = 'Since the last time you reported your medical information, has there been any change in your medical history?',
//     CONFIRM_MEDICATION = `Please confirm which medication you're taking`,
//     HAPPY_WITH_DOSAGE = 'Are you happy with your current dosage?',
//     HOW_MANY_WEEKS = 'How many weeks have you been taking this dose?',
// }

// /**
//  *
//  * @param userId
//  * @param questionnaireName
//  * @returns
//  */
// async function getUserCadenceFromUserIdAndQuestionnaireName(
//     userId: string,
//     questionnaireName: string
// ): Promise<string | undefined> {
//     const currentActionItem = new ActionItemFactory(questionnaireName);
//     const product_href = currentActionItem.getProductHref();

//     const data = await getSubscriptionByProduct(userId, product_href);

//     const cadence = data?.subscription_type;

//     return cadence;
// }
