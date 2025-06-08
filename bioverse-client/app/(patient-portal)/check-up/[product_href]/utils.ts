'use server';

import { ActionItemType } from '@/app/types/action-items/action-items-types';
import {
    getActionItem,
    getActionItemByName,
} from '@/app/utils/database/controller/action-items/action-items-actions';
import { createSupabaseServiceClient } from '@/app/utils/clients/supabaseServerClient';
import { getSubscriptionByProduct } from '@/app/utils/database/controller/prescription_subscriptions/prescription_subscriptions';
import {
    getLatestRenewalOrderForSubscription,
    updateRenewalOrder,
} from '@/app/utils/database/controller/renewal_orders/renewal_orders';

// Issue: Action items created are not being tied to renewal orders, which causes intakes to not appear
// (as having an action item id is dependent on that)
export async function selfHealNathanRenewalBug(actionItem: ActionItemType) {
    const splitted = actionItem.type.split('-');

    if (splitted.length !== 3) {
        console.error('Error self healing', actionItem);
        return;
    }

    const product_href = splitted[0];
    const iteration = splitted[2];

    const subscription = await getSubscriptionByProduct(
        product_href,
        actionItem.patient_id
    );

    if (!subscription) {
        console.error('Error self healing - subscription', actionItem);
        return;
    }

    const latestRenewalOrder = await getLatestRenewalOrderForSubscription(
        subscription.id
    );

    if (!latestRenewalOrder) {
        console.error('Error self healing - renewal order', actionItem);
        return;
    }

    await updateRenewalOrder(latestRenewalOrder.id, {
        checkup_action_item_id: actionItem.id,
    });
    console.log('Self-healed renewal order', latestRenewalOrder);
}

export async function selfHealRenewalOrdersWithActionItemAlreadyCreated(
    questionnaire_name: string,
    patient_id: string
) {
    const supabase = createSupabaseServiceClient();
    const actionItem = await getActionItemByName(
        questionnaire_name,
        patient_id
    );

    if (!actionItem) {
        return null;
    }

    const { data, error } = await supabase
        .from('renewal_orders')
        .select('id, subscription_id')
        .eq('checkup_action_item_id', actionItem.id)
        .maybeSingle();

    if (error) {
        console.error('Error self healing - alr created', error);
        return;
    }

    if (data?.id || data?.subscription_id) {
        return;
    }

    const splitted = questionnaire_name.split('-');

    const product_href = splitted[0];

    const subscription = await getSubscriptionByProduct(
        product_href,
        patient_id
    );

    if (!subscription) {
        console.error('Error self healing - subscription', actionItem);
        return;
    }

    const latestRenewalOrder = await getLatestRenewalOrderForSubscription(
        subscription.id
    );

    if (!latestRenewalOrder) {
        console.error('Error self healing - renewal order', actionItem);
        return;
    }

    await updateRenewalOrder(latestRenewalOrder.id, {
        checkup_action_item_id: actionItem.id,
    });

    console.log('Successfully healed');
}
