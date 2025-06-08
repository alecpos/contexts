'use server';

import { Status } from '@/app/types/global/global-enumerators';
import { createSupabaseServiceClient } from '../../../clients/supabaseServerClient';
import { updateOrder } from '../orders/orders-api';
import { updateActionItem } from '../action-items/action-items-actions';

export interface QuestionnaireSession {
    id: number;
    created_at: Date;
    user_id: string;
    completion_time: Date;
    metadata: any;
}

/**
 * Questionnaire Sessions were created to track 'sessions' that users are going through.
 *
 * Once an order or check up is initiated, a session is created to store the answers to using a foreign key to index.
 * Sessions work on a create if not present - basis.
 */

/**
 * Creates a questionnaire session for a user and binds that session to the order.
 * @param user_id profiles table uuid
 * @param order_id orders table integer id
 * @returns questionnaire_sessions table uuid
 */
export async function createQuestionnaireSessionForOrder(
    user_id: string,
    order_id: number
) {
    console.log('creating questionnaire session for order', order_id);

    try {
        const supabase = createSupabaseServiceClient();

        const { data, error } = await supabase
            .from('questionnaire_sessions')
            .insert({
                user_id,
                metadata: {
                    source: 'order',
                    order_id,
                },
            })
            .select('id')
            .single();

        if (error) {
            throw error;
        }

        const update_order_status = await updateOrder(order_id, {
            questionnaire_session_id: data.id,
        });

        if (update_order_status === Status.Failure) {
            throw new Error('Error updating order');
        }

        return data.id;
    } catch (error) {
        console.error('Error creating questionnaire session', error);
        return null;
    }
}

export async function createQuestionnaireSessionForCheckup(
    user_id: string,
    action_item_id: number
) {
    try {
        const supabase = createSupabaseServiceClient();

        const { data, error } = await supabase
            .from('questionnaire_sessions')
            .insert({
                user_id,
                metadata: {
                    source: 'checkup',
                    action_item_id,
                },
            })
            .select('id')
            .single();

        if (error) {
            throw error;
        }

        const update_order_status = await updateActionItem(action_item_id, {
            questionnaire_session_id: data.id,
        });

        if (update_order_status === Status.Failure) {
            throw new Error('Error updating order');
        }

        return data.id;
    } catch (error) {
        console.error('Error creating questionnaire session', error);
        return null;
    }
}

export async function updateSessionCompletion(session_id: number) {
    try {
        const supabase = createSupabaseServiceClient();

        const { error } = await supabase
            .from('questionnaire_sessions')
            .update({ completion_time: new Date().toISOString() })
            .eq('id', session_id);

        if (error) {
            throw error;
        }
    } catch (error) {
        console.error('Error updating session completion', error);
        return;
    }
}
