'use server';
import { Status } from '@/app/types/global/global-enumerators';
import { ScriptSource } from '@/app/types/orders/order-types';
import { getPrescriptionSubscription } from '@/app/utils/actions/subscriptions/subscription-actions';
import { ScriptHandlerFactory } from '@/app/utils/classes/Scripts/ScriptHandlerFactory';
import { getRenewalOrder } from '@/app/utils/database/controller/renewal_orders/renewal_orders';

export const generateAndSendScriptforRenewalOrder = async (
    renewal_order_id: string,
) => {
    const renewalOrder = await getRenewalOrder(renewal_order_id);
    if (!renewalOrder) {
        throw new Error(`Could not find renewal order ${renewal_order_id}`);
    }

    const subscription = await getPrescriptionSubscription(
        renewalOrder.subscription_id,
    );

    if (!subscription) {
        throw new Error(
            `Could not find subscription for id ${renewalOrder.subscription_id}`,
        );
    }
    const handler = ScriptHandlerFactory.createHandler(
        renewalOrder,
        subscription,
        ScriptSource.Engineer,
    );

    const status = await handler.regenerateAndSendScript();

    if (status === Status.Failure) {
        throw new Error('Error sending script');
    }
};
