import { getStripeSubscription } from '@/app/(administration)/admin/stripe-api/stripe-api-actions';
import { triggerEvent } from '@/app/services/customerio/customerioApiFactory';
import {
    CommStep,
    CommunicationType,
    ScheduledComm,
} from '@/app/types/comms-system/comms-types';
import { getPrescriptionSubscription } from '../../actions/subscriptions/subscription-actions';
import { getLatestRenewalOrderForOriginalOrderId } from '../../database/controller/renewal_orders/renewal_orders';
import { forwardOrderToEngineering } from '../../database/controller/patient-status-tags/patient-status-tags-api';

export const MONTHLY_COMMS_FINAL_STEP_ID = 1;
export const QUARTERLY_COMMS_FINAL_STEP_ID = 5;
export const BIANNUALLY_COMMS_FINAL_STEP_ID = 11;
export const ANNUALLY_COMMS_FINAL_STEP_ID = 23;

export abstract class CommsSchedule {
    protected steps: CommStep[];
    protected userId: string;
    protected startDate: Date;
    protected subscriptionId: number;
    protected currentStep: number; // Track the last completed step

    constructor(
        userId: string,
        startDate: Date,
        subscription_id: number,
        currentStep: number
    ) {
        this.userId = userId;
        this.startDate = startDate;
        this.currentStep = currentStep;
        this.subscriptionId = subscription_id;
        this.steps = this.defineSteps();
    }

    /** Subclasses define their own steps */
    protected abstract defineSteps(): CommStep[];

    /** Get the next step based on last completed step */
    public getNextStep(): ScheduledComm | null {
        const nextStep = this.steps.find(
            (step) => step.stepId > this.currentStep
        );

        if (!nextStep) return null; // No more steps

        const sendDate = new Date(this.startDate);
        sendDate.setDate(sendDate.getDate() + nextStep.delayDays);

        return {
            customerId: this.userId,
            sendDate,
            type: nextStep.type,
            currentStepId: nextStep.stepId,
        };
    }

    public async sendCommunication(): Promise<void> {
        const currentCommStep = this.defineSteps()[this.currentStep + 1];

        if (currentCommStep.type === CommunicationType.NO_TYPE) {
            console.log(`No comm being sent for step where current step is ${this.currentStep ?? 'no current step'} and user id is ${this.userId ?? 'no user id'}`);
            return;
        }

        switch (currentCommStep.type) {
            case CommunicationType.MonthlyCheckInComms: {

                console.log("handling the monthly time to checkin comms where current step is", this.currentStep ?? 'no current step', " and user id is", this.userId ?? 'no user id')

                const subscription = await getPrescriptionSubscription(
                    this.subscriptionId
                );

                if (!subscription) {
                    throw new Error(
                        'Failed to send check in comms, no subscription found'
                    );
                }

                const stribeSubscription = await getStripeSubscription(
                    subscription.stripe_subscription_id
                );

                const renewalDate = new Date(
                    stribeSubscription.current_period_end * 1000
                );

                const formattedRenewalDate = `${(renewalDate.getMonth() + 1)
                    .toString()
                    .padStart(2, '0')}/${renewalDate
                    .getDate()
                    .toString()
                    .padStart(2, '0')}/${renewalDate.getFullYear()}`;

                const latestRenewalOrder =
                    await getLatestRenewalOrderForOriginalOrderId(
                        String(subscription.order_id)
                    );

                const order_id =
                    latestRenewalOrder?.renewal_order_id ??
                    subscription.order_id;

                await triggerEvent( //it's not even making it to rudderstack!! the other events here are all making it to both!!!!
                    this.userId,
                    CommunicationType.MonthlyCheckInComms, //why is this not making it to customer.io? the wl-checkin event used to be for this
                    {
                        checkin_url: `https://app.gobioverse.com/check-up/${subscription.product_href}`,
                        order_date: formattedRenewalDate,
                        order_id,
                    }
                );
                break;
            }
            case CommunicationType.BundleCheckInComms: {
                const subscription = await getPrescriptionSubscription(
                    this.subscriptionId
                );

                if (!subscription) {
                    throw new Error(
                        'Failed to send check in comms, no subscription found'
                    );
                }

                const latestRenewalOrder =
                    await getLatestRenewalOrderForOriginalOrderId(
                        String(subscription.order_id)
                    );

                const order_id =
                    latestRenewalOrder?.renewal_order_id ??
                    subscription.order_id;

                await triggerEvent(
                    this.userId,
                    CommunicationType.BundleCheckInComms,
                    {
                        checkin_url: `https://app.gobioverse.com/check-up/${subscription.product_href}`,
                        order_id,
                    }
                );
                break;
            }
            case CommunicationType.PreCheckInReminder: {
                await triggerEvent(
                    this.userId,
                    CommunicationType.PreCheckInReminder
                );
                break;
            }
            case CommunicationType.MonthlyPreCheckInReminder: {
                await triggerEvent(
                    this.userId,
                    CommunicationType.MonthlyPreCheckInReminder
                );
                break;
            }
            default: {
                throw new Error(
                    `Unable to process check in job scheduler for subscription id: ${this.subscriptionId}`
                );
            }
        }
    }
}
