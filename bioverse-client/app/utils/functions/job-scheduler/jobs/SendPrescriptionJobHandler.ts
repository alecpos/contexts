// send-prescription-job-handler.ts

import { Status } from '@/app/types/global/global-enumerators';
import { SendPrescriptionMetadata } from '@/app/types/job-scheduler/job-scheduler-types';
import { OrderType, ScriptSource } from '@/app/types/orders/order-types';
import { getPrescriptionSubscription } from '@/app/utils/actions/subscriptions/subscription-actions';
import { ScriptHandlerFactory } from '@/app/utils/classes/Scripts/ScriptHandlerFactory';
import { getRenewalOrder } from '@/app/utils/database/controller/renewal_orders/renewal_orders';
import { getOrderTypeFromOrderId } from '../../client-utils';
import { BaseJobSchedulerHandler } from '../BaseJobSchedulerHandler';

export class SendPrescriptionJobHandler extends BaseJobSchedulerHandler {
    protected async processJob(): Promise<void> {
        const metadata = this.jobScheduler.metadata as SendPrescriptionMetadata;

        const orderType = getOrderTypeFromOrderId(metadata.order_id);

        if (orderType !== OrderType.RenewalOrder) {
            throw new Error(
                `Invalid order type for SendPrescriptionJob: ${orderType}`
            );
        }

        const renewalOrder = await getRenewalOrder(metadata.order_id);

        if (!renewalOrder) {
            throw new Error(
                'Could not find renewal order for SendPrescriptionJob.'
            );
        }

        const subscription = await getPrescriptionSubscription(
            renewalOrder.subscription_id
        );

        if (!subscription) {
            throw new Error(
                'Could not find subscription for SendPrescriptionJob.'
            );
        }

        const scriptHandler = ScriptHandlerFactory.createHandler(
            renewalOrder,
            subscription,
            ScriptSource.JobScheduler
        );

        let result: Status;

        if (!renewalOrder.prescription_json) {
            result = await scriptHandler.regenerateAndSendScript();
        } else {
            result = await scriptHandler.regenerateAndSendScript();
        }

        if (result !== Status.Success) {
            throw new Error('Failed to send prescription.');
        }
    }

    protected getNextRetryTime(): Date {
        // Custom retry interval for SendPrescriptionJob (e.g., 3 hours)
        return new Date(Date.now() + 3 * 60 * 60 * 1000);
    }
}
