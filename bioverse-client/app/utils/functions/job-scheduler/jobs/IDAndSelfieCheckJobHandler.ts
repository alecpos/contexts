// send-prescription-job-handler.ts

import { Status } from '@/app/types/global/global-enumerators';
import {
    IDAndSelfieCheckMetadata,
    RenewalAutoshipMetadata,
    SendPrescriptionMetadata,
} from '@/app/types/job-scheduler/job-scheduler-types';
import { OrderType, ScriptSource } from '@/app/types/orders/order-types';
import { getPrescriptionSubscription } from '@/app/utils/actions/subscriptions/subscription-actions';
import { ScriptHandlerFactory } from '@/app/utils/classes/Scripts/ScriptHandlerFactory';
import { getRenewalOrder } from '@/app/utils/database/controller/renewal_orders/renewal_orders';
import { getOrderTypeFromOrderId } from '../../client-utils';
import { BaseJobSchedulerHandler } from '../BaseJobSchedulerHandler';
import { shouldSendIDVerification } from '@/app/services/customerio/customerioApiFactory';
import {
    StatusTag,
    StatusTagAction,
} from '@/app/types/status-tags/status-types';
import { getBaseOrderById } from '@/app/utils/database/controller/orders/orders-api';
import { createUserStatusTagWAction } from '@/app/utils/database/controller/patient-status-tags/patient-status-tags-api';
import { getIDVerificationData } from '@/app/utils/database/controller/profiles/profiles';

export class IDAndSelfieCheckJobHandler extends BaseJobSchedulerHandler {
    protected async processJob(): Promise<void> {
        try {
            const metadata = this.jobScheduler
                .metadata as IDAndSelfieCheckMetadata;

            const { license, selfie, name, gender } =
                await getIDVerificationData(metadata.patient_id);

            if (!license || !selfie) {
                await createUserStatusTagWAction(
                    StatusTag.IDDocs,
                    metadata.order_id,
                    StatusTagAction.INSERT,
                    metadata.patient_id,
                    'Patient submitted an order without verifying their id',
                    'ffabc905-5508-4d54-98fb-1e2ef2b9e99a',
                    [StatusTag.IDDocs],
                );
            } else {
                const orderData = await getBaseOrderById(
                    Number(metadata.order_id),
                );

                if (!orderData) {
                    console.error('No Order to assign to ');
                    return;
                }

                if (
                    orderData.metadata &&
                    orderData.metadata.doctorLetterRequired === true
                ) {
                    await createUserStatusTagWAction(
                        StatusTag.DoctorLetterRequired,
                        metadata.order_id,
                        StatusTagAction.INSERT,
                        metadata.patient_id,
                        'New Order, requires doctor letter for GLP-1',
                        'ffabc905-5508-4d54-98fb-1e2ef2b9e99a',
                        [StatusTag.DoctorLetterRequired],
                    );
                } else {
                    await createUserStatusTagWAction(
                        StatusTag.Review,
                        metadata.order_id,
                        StatusTagAction.INSERT,
                        metadata.patient_id,
                        'New Order to review',
                        'ffabc905-5508-4d54-98fb-1e2ef2b9e99a',
                        [StatusTag.Review],
                    );
                }
            }
            await shouldSendIDVerification(metadata.patient_id);
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    protected getNextRetryTime(): Date {
        // 1 hour
        return new Date(Date.now() + 1 * 60 * 60 * 1000);
    }
}
