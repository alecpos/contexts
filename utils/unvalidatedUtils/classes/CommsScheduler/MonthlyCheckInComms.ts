import {
    CommStep,
    CommunicationType,
} from '@/app/types/comms-system/comms-types';
import { CommsSchedule, MONTHLY_COMMS_FINAL_STEP_ID } from './CommsSchedule';
import { getPrescriptionSubscription } from '../../actions/subscriptions/subscription-actions';
import { triggerEvent } from '@/app/services/customerio/customerioApiFactory';
import { getLatestRenewalOrderForOriginalOrderId } from '../../database/controller/renewal_orders/renewal_orders';
import { getStripeSubscription } from '@/app/(administration)/admin/stripe-api/stripe-api-actions';

export class MonthlyCheckInComms extends CommsSchedule {
    protected defineSteps(): CommStep[] {
        return [
            {
                stepId: -1,
                delayDays: 0,
                type: CommunicationType.NO_TYPE,
            },
            {
                stepId: 0,
                delayDays: 8,
                type: CommunicationType.MonthlyPreCheckInReminder,
            },
            {
                stepId: MONTHLY_COMMS_FINAL_STEP_ID,
                delayDays: 7, // When a step gets processed, this is the amount of time to delay to process this current step
                type: CommunicationType.MonthlyCheckInComms,
            },
        ];
    }
}
