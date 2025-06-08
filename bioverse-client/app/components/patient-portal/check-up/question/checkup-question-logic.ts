'use server';

import { createNewCheckUpClinicalBmiNote } from '@/app/utils/database/controller/clinical_notes/clinical_notes_v2';
import { getSubscriptionByProduct } from '@/app/utils/database/controller/prescription_subscriptions/prescription_subscriptions';
import { updateSessionCompletion } from '@/app/utils/database/controller/questionnaires/questionnaire_sessions';

type NextQuestionInstruction =
    | {
          type: 'next_question';
      }
    | {
          type: 'skip_questions';
          skip_count: number;
      }
    | {
          type: 'specific_question';
          next_question_id: number;
      };

export async function getNextCheckupQuestion(
    current_question_id: number,
    product_href: string,
    userId: string,
    sessionId: number,
    question_junction: QUESTIONNAIRE_JUNCTION_TYPE[],
    questionnaire_id: number,
    answer: Answer
) {
    let next_question_id = -1;

    const current_index = question_junction.findIndex(
        (junction) => junction.question_id == current_question_id
    );

    if (current_index === question_junction.length - 1) {
        // await handleCheckupCompletion(action_item_type, userId);
        if (sessionId) {
            await updateSessionCompletion(sessionId);
        }
        return -2;
    }

    const logicFunction = QUESTION_JUNCITON_LOGIC_MAP[questionnaire_id];

    let next_question_instruction: NextQuestionInstruction;

    if (!logicFunction) {
        // If no specific logic exists, use default next question behavior
        next_question_instruction = {
            type: 'next_question',
        } as NextQuestionInstruction;
    } else {
        next_question_instruction = await logicFunction(
            current_question_id,
            userId,
            sessionId,
            product_href,
            answer
        );
    }

    switch (next_question_instruction.type) {
        case 'specific_question':
            next_question_id = next_question_instruction.next_question_id;
            break;
        case 'skip_questions':
            next_question_id =
                question_junction[
                    current_index + 1 + next_question_instruction.skip_count
                ].question_id ?? -1;
            break;
        case 'next_question':
        default:
            next_question_id =
                question_junction[current_index + 1].question_id ?? -1;
            break;
    }

    return next_question_id;
}

interface QuestionJunctionLogicMap {
    [key: number]: (
        current_question_id: number,
        userId: string,
        sessionId: number,
        product_href: string,
        answer: Answer
    ) => Promise<NextQuestionInstruction>;
}

const QUESTION_JUNCITON_LOGIC_MAP: QuestionJunctionLogicMap = {
    304: async (
        current_question_id: number,
        userId: string,
        sessionId: number,
        product_href: string,
        answer: Answer
    ): Promise<NextQuestionInstruction> => {
        switch (current_question_id) {
            case 2485:
                await createNewCheckUpClinicalBmiNote(userId, answer);
                break;

            case 2487:
                const subscription = await getSubscriptionByProduct(
                    product_href,
                    userId
                );

                if (subscription?.subscription_type != 'monthly') {
                    return {
                        type: 'skip_questions',
                        skip_count: 1,
                    };
                }
                break;

            case 2490:
                if (answer.answer == 'No') {
                    return {
                        type: 'skip_questions',
                        skip_count: 1,
                    };
                }
                break;
        }

        return {
            type: 'next_question',
        };
    },
    321: async (
        current_question_id: number,
        userId: string,
        sessionId: number,
        product_href: string,
        answer: Answer
    ): Promise<NextQuestionInstruction> => {
        switch (current_question_id) {
            case 2485:
                await createNewCheckUpClinicalBmiNote(userId, answer);
                break;

            case 2487:
                const subscription = await getSubscriptionByProduct(
                    product_href,
                    userId
                );

                if (subscription?.subscription_type != 'monthly') {
                    return {
                        type: 'skip_questions',
                        skip_count: 1,
                    };
                }
                break;

            case 2490:
                if (answer.answer == 'No') {
                    return {
                        type: 'skip_questions',
                        skip_count: 2,
                    };
                }
                break;
        }

        return {
            type: 'next_question',
        };
    },
};
