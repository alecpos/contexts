import { JobTypes, JobsPayload } from '@/app/types/jobs/job-types';
import {
    getMonthsIntoRenewalOrderSubscription,
    getRenewalOrder,
    isRenewalOrder,
} from '../../database/controller/renewal_orders/renewal_orders';
import {
    StatusTag,
    StatusTagAction,
    StatusTagNotes,
} from '@/app/types/status-tags/status-types';
import { getReviewStatusTagForRenewalOrder } from './jobs';
import {
    createUserStatusTagWAction,
    createUserStatusTagWNote,
} from '../../database/controller/patient-status-tags/patient-status-tags-api';
import { Status } from '@/app/types/global/global-enumerators';
import {
    shouldSendIDVerification,
    triggerEvent,
} from '@/app/services/customerio/customerioApiFactory';
import {
    ID_VERIFICATION_FOLLOWUP_COMPLETE,
    MESSAGE_REPLIED,
    NEW_BUG,
    OLIVIER_ID,
} from '@/app/services/customerio/event_names';
import { retryVerifyMixpanelEvent } from '@/app/services/mixpanel/mixpanel-utils';
import { isGLP1Product } from '../pricing';
import { SubscriptionCadency } from '@/app/types/renewal-orders/renewal-orders-types';

export class JobFactory {
    type: JobTypes;
    payload: JobsPayload;

    constructor(payload: JobsPayload) {
        this.type = payload.type;
        this.payload = payload;
    }

    // Function to return the final data
    async processRequest() {
        const res = await this.executeJob();

        return res;
    }

    async executeJob() {
        switch (this.type) {
            case JobTypes.IsReviewNoPrescribe:
                return await this.handleCheckIsReviewNoPrescribe(
                    this.payload.order_id
                );
            case JobTypes.CheckOverdueNoPrescribe:
                return await this.convertOverdueToOverdueNoPrescribe();
            case JobTypes.CheckShouldVerifyID:
                return await this.checkShouldSendIDVerificationToUser();
            case JobTypes.ExitMessageUnreadCampaign:
                return await this.exitMessageUnreadCampaign();
            case JobTypes.ExitIDFollowupMessageCampaign:
                return await this.exitIDMessageCampaign();
            case JobTypes.VerifyMixpanelEvent:
                return await this.verifyMixpanelEvent();
            case JobTypes.ProviderAwaitingResponsePatientMessageStatusTagUpdate:
                return await this.providerAwaitingResponsePatientMessageStatusTagUpdate();
            default:
                console.error(
                    'Unknown type in jobs factory',
                    this.type,
                    this.payload
                );
                return Status.Success;
        }
    }

    async handleCheckIsReviewNoPrescribe(
        order_id: string | undefined
    ): Promise<{ status_tag: StatusTag }> {
        if (!order_id) {
            return { status_tag: StatusTag.Review };
        }

        const isRenewal = await isRenewalOrder(order_id, 'any');

        var statusTag = StatusTag.Review;
        if (isRenewal) {
            statusTag = await getReviewStatusTagForRenewalOrder(order_id);
        }

        return { status_tag: statusTag };
    }

    async convertOverdueToOverdueNoPrescribe() {
        const res = await this.handleCheckIsReviewNoPrescribe(
            this.payload.order_id
        );

        if (res.status_tag === StatusTag.ReviewNoPrescribe) {
            if (!this.payload.order_id) {
                console.error(
                    'Could not get order_id for OverdueNoPrescribe',
                    this.payload
                );
                return { status: Status.Failure };
            }
            const renewalOrder = await getRenewalOrder(this.payload.order_id);

            if (!renewalOrder) {
                console.error(
                    'Could not get renewal order for OverdueNoPrescribe',
                    this.payload
                );
                return { status: Status.Failure };
            }

            await createUserStatusTagWAction(
                StatusTag.OverdueNoPrescribe,
                this.payload.order_id,
                StatusTagAction.INSERT,
                renewalOrder.customer_uuid,
                StatusTagNotes.OverdueNoPrescribe,
                'ffabc905-5508-4d54-98fb-1e2ef2b9e99a',
                [StatusTag.OverdueNoPrescribe]
            );
        }
        return { status: Status.Success };
    }

    async checkShouldSendIDVerificationToUser() {
        const user_id = this.payload.customer_id;

        if (!user_id) {
            return { status: Status.Failure };
        }

        await shouldSendIDVerification(user_id);

        return { status: Status.Success };
    }

    async exitMessageUnreadCampaign() {
        if (!this.payload.customer_id) {
            await triggerEvent(OLIVIER_ID, NEW_BUG);
            console.error('Error tag read patient message', this.payload);
            return { status: Status.Failure };
        }

        await triggerEvent(this.payload.customer_id, MESSAGE_REPLIED);
        return { status: Status.Success };
    }

    async exitIDMessageCampaign() {
        if (!this.payload.customer_id) {
            await triggerEvent(OLIVIER_ID, NEW_BUG);
            console.error('Error tag read patient message', this.payload);
            return { status: Status.Failure };
        }

        await triggerEvent(
            this.payload.customer_id,
            ID_VERIFICATION_FOLLOWUP_COMPLETE
        );
        return { status: Status.Success };
    }

    async verifyMixpanelEvent() {
        console.log('verifying mixpanel event...', this.payload);
        const mixpanelPayload = this.payload.mixpanel_payload;
        const id = this.payload.id;

        if (mixpanelPayload && id) {
            await retryVerifyMixpanelEvent(id, mixpanelPayload);
            return { status: Status.Success };
        }
        console.error('returning failure');
        return { status: Status.Failure };
    }

    // When a patient sends a message from an order that's originally ProviderAwaitingResponse, set it to a new status tag if its bundle after 2 months
    async providerAwaitingResponsePatientMessageStatusTagUpdate() {
        // console.log('PROCESSING JOB FACTORY', this.payload, this.type);
        const orderId = this.payload.order_id;
        if (!orderId) {
            return Status.Success;
        }
        const renewalOrder = await getRenewalOrder(orderId);

        if (!renewalOrder) {
            return Status.Success;
        }

        if (
            (isGLP1Product(renewalOrder.product_href) &&
                renewalOrder.subscription_type ===
                    SubscriptionCadency.Quarterly) ||
            renewalOrder.subscription_type === SubscriptionCadency.Biannually ||
            renewalOrder.subscription_type === SubscriptionCadency.Annually
        ) {
            const month = await getMonthsIntoRenewalOrderSubscription(
                renewalOrder.renewal_order_id
            );

            if (month === 3) {
                await createUserStatusTagWAction(
                    StatusTag.ProviderMessage,
                    renewalOrder.renewal_order_id,
                    StatusTagAction.REPLACE,
                    renewalOrder.customer_uuid,
                    StatusTagNotes.ProviderMessage,
                    'ffabc905-5508-4d54-98fb-1e2ef2b9e99a',
                    [StatusTag.ProviderMessage]
                );
            } else {
                await createUserStatusTagWAction(
                    StatusTag.ReviewNoPrescribe,
                    renewalOrder.renewal_order_id,
                    StatusTagAction.REPLACE,
                    renewalOrder.customer_uuid,
                    StatusTagNotes.ReviewNoPrescribe,
                    'ffabc905-5508-4d54-98fb-1e2ef2b9e99a',
                    [StatusTag.ProviderMessage]
                );
            }
        } else {
            await createUserStatusTagWAction(
                StatusTag.ProviderMessage,
                renewalOrder.renewal_order_id,
                StatusTagAction.REPLACE,
                renewalOrder.customer_uuid,
                StatusTagNotes.ProviderMessage,
                'ffabc905-5508-4d54-98fb-1e2ef2b9e99a',
                [StatusTag.ProviderMessage]
            );
        }
        return Status.Success;
    }
}
