'use server';

import {
    ActionItemType,
    ActionType,
} from '@/app/types/action-items/action-items-types';
import { createSupabaseServiceClient } from '../../../clients/supabaseServerClient';
import { isEmpty, isUndefined } from 'lodash';
import ActionItemFactory from '@/app/components/patient-portal/action-items/utils/ActionItemFactory';
import { triggerEvent } from '@/app/services/customerio/customerioApiFactory';
import { NEW_BUG, OLIVIER_ID } from '@/app/services/customerio/event_names';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import { createQuestionnaireSessionForCheckup } from '../questionnaires/questionnaire_sessions';

export async function createActionItem(
    user_id: string,
    action_item_type: string,
    subscription_id: number
): Promise<ActionItemType | null> {
    const supabase = createSupabaseServiceClient();

    const actionItem = new ActionItemFactory(action_item_type);

    const { data: preCheckData, error: preCheckError } = await supabase
        .from('action_items')
        .select('*')
        .eq('type', action_item_type)
        .eq('patient_id', user_id)
        .maybeSingle();

    if (preCheckData && !preCheckError) {
        return preCheckData as ActionItemType;
    }

    // Get question set version
    const { data: productData, error: productError } = await supabase
        .from('products')
        .select('checkup_questionnaire_set_version')
        .eq('href', actionItem.product_href)
        .single();

    if (productError) {
        console.error(
            'ERROR: Unable to fetch question set version',
            user_id,
            subscription_id,
            action_item_type
        );
        await triggerEvent(OLIVIER_ID, NEW_BUG);
        return null;
    }

    if (isEmpty(productData) || !productData) {
        console.error(
            'Unable to fetch checkup question set version',
            user_id,
            subscription_id,
            action_item_type
        );
        await triggerEvent(OLIVIER_ID, NEW_BUG);
        return null;
    }

    const { data, error } = await supabase
        .from('action_items')
        .insert({
            type: action_item_type,
            patient_id: user_id,
            subscription_id,
            action_type: ActionType.CheckUp,
            product_href: actionItem.getProductHref(),
            iteration: actionItem.getIteration(),
            question_set_version: productData.checkup_questionnaire_set_version,
        })
        .select();

    if (error) {
        console.error('Unable to create action item', error, user_id);
        return null;
    }

    let action_item_data = data[0];

    const questionnaire_session_id = await createQuestionnaireSessionForCheckup(
        user_id,
        data[0].id
    );

    if (questionnaire_session_id) {
        action_item_data.questionnaire_session_id = questionnaire_session_id;
    }

    if (isEmpty(data)) {
        return null;
    }
    return action_item_data as ActionItemType;
}

export async function createDosageSelectionActionItem(
    user_id: string,
    product_href: PRODUCT_HREF,
    subscription_id: number
) {
    // type: dosage-selection
    // product_href
    // action_type: dosage-selection

    const supabase = createSupabaseServiceClient();

    const shouldCreateActionItem =
        await doesUserHaveActiveActionItemForDosageSelectionProduct(
            user_id,
            product_href
        );

    if (shouldCreateActionItem) {
        console.log('not creating');
        return;
    }
    console.log('creating');

    await supabase.from('action_items').insert({
        patient_id: user_id,
        active: true,
        subscription_id,
        product_href,
        action_type: ActionType.DosageSelection,
        iteration: 1,
        question_set_version: 1,
        type: `${product_href}-dosage_selection`, // I know, I know its terrible and redundant.
    });
}

export async function doesUserHaveActiveActionItemForDosageSelectionProduct(
    user_id: string,
    product_href: PRODUCT_HREF
) {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('action_items')
        .select('*')
        .eq('action_type', 'dosage_selection')
        .eq('active', true)
        .eq('product_href', product_href)
        .eq('patient_id', user_id);

    if (error) {
        console.error(
            'Error doesUserHaveActiveActionItemForDosageSelectionProduct',
            error
        );
        return false;
    }

    if (!data) {
        return false;
    }

    return data.length > 0;
}

export async function clearDosageSelectionActionItems(
    user_id: string,
    product_href: PRODUCT_HREF
) {
    const supabase = createSupabaseServiceClient();

    await supabase
        .from('action_items')
        .update({ active: false })
        .eq('patient_id', user_id)
        .eq('product_href', product_href)
        .eq('action_type', ActionType.DosageSelection);
}

export async function getActionItems(
    user_id: string | undefined
): Promise<ActionItemType[]> {
    const supabase = createSupabaseServiceClient();

    if (!user_id) {
        return [];
    }

    const { data, error } = await supabase
        .from('action_items')
        .select('*')
        .eq('patient_id', user_id)
        .eq('active', true);

    if (!data || error) {
        console.error(
            'Unable to retrieve action items for user',
            error,
            user_id
        );
        return [];
    }
    return data as ActionItemType[];
}

export async function getAllActionItems(
    user_id: string | undefined
): Promise<ActionItemType[]> {
    const supabase = createSupabaseServiceClient();

    if (!user_id) {
        return [];
    }

    const { data, error } = await supabase
        .from('action_items')
        .select('*')
        .eq('patient_id', user_id)
        .order('created_at');

    if (!data || error) {
        console.error(
            'Unable to retrieve action items for user',
            error,
            user_id
        );
        return [];
    }
    return data as ActionItemType[];
}

export async function getAllActionsItemsForPatientWithSession(
    patient_id: string
) {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('action_items')
        .select('*')
        .eq('patient_id', patient_id)
        .eq('active', false)
        .not('questionnaire_session_id', 'is', null);

    if (error) {
        console.error(
            'Unable to retrieve action items for patient',
            error,
            patient_id
        );
    }

    return data as ActionItemType[];
}

export async function getActionItem(
    action_item_id: number | undefined
): Promise<ActionItemType | null> {
    const supabase = createSupabaseServiceClient();

    if (isUndefined(action_item_id)) {
        return null;
    }

    const { data, error } = await supabase
        .from('action_items')
        .select('*')
        .eq('id', action_item_id)
        .maybeSingle();

    if (error) {
        console.error(
            'Unable to get action item for id',
            action_item_id,
            error
        );
        return null;
    }
    return data as ActionItemType;
}

export async function isUserEligible(
    user_id: string,
    questionnaire_name: string
) {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('action_items')
        .select('*')
        .eq('patient_id', user_id)
        .eq('type', questionnaire_name)
        .is('active', true)
        .maybeSingle();

    if (error) {
        console.error('Error checking if user is eligible', error);
    }

    if (isEmpty(data)) {
        return false;
    }
    return true;
}

export async function doesUserHaveSubscription(
    product_href: string,
    user_id: string
): Promise<boolean> {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('prescription_subscriptions')
        .select('id')
        .eq('product_href', product_href)
        .eq('patient_id', user_id)
        .eq('status', 'active');

    if (!error && data.length > 0) {
        return true;
    } else return false;
}

export async function updateActionItem(
    action_item_id: number | undefined,
    updatedPayload: Partial<ActionItemType>
) {
    const supabase = createSupabaseServiceClient();

    if (!action_item_id) {
        console.error('Unable to get action_item_id', updatedPayload);
        return;
    }

    const { data, error } = await supabase
        .from('action_items')
        .update(updatedPayload)
        .eq('id', action_item_id)
        .select();

    if (error) {
        console.error(
            'Error updating action item for payload',
            updatedPayload,
            action_item_id
        );
    }

    if (!data || isEmpty(data)) {
        return {};
    }
    return data[0];
}

export async function getActionItemByName(
    questionnaire_name: string,
    patient_id: string
): Promise<ActionItemType | null> {
    const supabase = createSupabaseServiceClient();

    if (isUndefined(questionnaire_name) || !questionnaire_name) {
        return null;
    }

    const { data, error } = await supabase
        .from('action_items')
        .select('*')
        .eq('type', questionnaire_name)
        .eq('patient_id', patient_id)
        .maybeSingle();

    if (error || !data) {
        console.error(
            'Unable to get action item for patient and questionnaire name',
            questionnaire_name,
            patient_id,
            error
        );
        return null;
    }
    return data as ActionItemType;
}

export async function getLastestActionItemForProduct(
    user_id: string,
    product_href: string
): Promise<ActionItemType | null> {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('action_items')
        .select('*')
        .eq('patient_id', user_id)
        .eq('action_type', 'check_up')
        .eq('product_href', product_href)
        .order('iteration', { ascending: false })
        .limit(1)
        .maybeSingle();

    if (error) {
        console.error(
            'Unable to get latest action item for user_id',
            user_id,
            error
        );
        return null;
    }
    return data as ActionItemType;
}

export async function doesUserHaveActiveActionItemForProduct(
    user_id: string,
    product_href: string
): Promise<boolean> {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('action_items')
        .select('*')
        .eq('patient_id', user_id)
        .eq('product_href', product_href)
        .eq('active', true)
        .eq('action_type', 'check_up')
        .order('created_at', { ascending: true });

    if (error) {
        console.error('Error checking action item for user', error, user_id);
        return false;
    }

    if (!data || data.length === 0) {
        return false;
    }

    if (data.length > 1) {
        const latestActionItem = data[data.length - 1];

        // Deactivate all but the latest action item
        const updatePromises = data
            .slice(0, -1)
            .map((item) =>
                supabase
                    .from('action_items')
                    .update({ active: false })
                    .eq('id', item.id)
            );

        const updateResults = await Promise.all(updatePromises);

        // Check if any updates failed
        const anyUpdateErrors = updateResults.some((result) => result.error);
        if (anyUpdateErrors) {
            console.error('Error updating action items for user', user_id);
            return false;
        }
    }

    return true;
}

export async function createActionItemForProduct(
    user_id: string,
    product_href: string,
    subscription_id: number
) {
    const supabase = createSupabaseServiceClient();

    const lastActionItem = await getLastestActionItemForProduct(
        user_id,
        product_href
    );

    if (!lastActionItem) {
        const base_action_type = `${product_href}-checkup-1`;
        await createActionItem(user_id, base_action_type, subscription_id);
        return;
    }

    const ActionItemInstance = new ActionItemFactory(lastActionItem?.type);
    let nextIteration = ActionItemInstance.getIteration() + 1;

    const nextActionItemType = `${product_href}-checkup-${nextIteration}`;

    await createActionItem(user_id, nextActionItemType, subscription_id);
}

export async function deactivateAllActionItemsForProduct(
    user_id: string,
    product_href: string
) {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('action_items')
        .select('*')
        .eq('patient_id', user_id)
        .eq('product_href', product_href)
        .eq('action_type', ActionType.CheckUp)
        .eq('active', true);

    if (error) {
        console.error(
            'Error deactivating action items for user',
            error,
            user_id
        );
        return false;
    }

    if (!data || data.length === 0) {
        return false;
    }

    const updatePromises = data.map((item) =>
        supabase
            .from('action_items')
            .update({ active: false })
            .eq('id', item.id)
    );

    const updateResults = await Promise.all(updatePromises);

    const anyUpdateErrors = updateResults.some((result) => result.error);

    if (anyUpdateErrors) {
        console.error('Error updating action items for user', user_id);
        return;
    }

    console.log('Successfully deactivated all action items for user', user_id);
}
