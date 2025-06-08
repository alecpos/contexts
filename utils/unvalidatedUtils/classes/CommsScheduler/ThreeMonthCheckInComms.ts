import {
    CommStep,
    CommunicationType,
} from '@/app/types/comms-system/comms-types';
import { CommsSchedule, QUARTERLY_COMMS_FINAL_STEP_ID } from './CommsSchedule';
import { getPrescriptionSubscription } from '../../actions/subscriptions/subscription-actions';
import { triggerEvent } from '@/app/services/customerio/customerioApiFactory';
import { getLatestRenewalOrderForOriginalOrderId } from '../../database/controller/renewal_orders/renewal_orders';

export class ThreeMonthCheckInComms extends CommsSchedule {
    protected defineSteps(): CommStep[] {
        return [
            {
                stepId: -1,
                delayDays: 0,
                type: CommunicationType.NO_TYPE,
            },
            {
                stepId: 0,
                delayDays: 14,
                type: CommunicationType.PreCheckInReminder,
            },
            {
                stepId: 1,
                delayDays: 7, // When a step gets processed, this is the amount of time to delay for this current step
                type: CommunicationType.BundleCheckInComms,
            },
            {
                stepId: 2,
                delayDays: 21,
                type: CommunicationType.PreCheckInReminder,
            },
            {
                stepId: 3,
                delayDays: 7,
                type: CommunicationType.BundleCheckInComms,
            },
            {
                stepId: 4,
                delayDays: 14,
                type: CommunicationType.PreCheckInReminder,
            },
            {
                stepId: QUARTERLY_COMMS_FINAL_STEP_ID,
                delayDays: 7,
                type: CommunicationType.BundleCheckInComms,
            },
        ];
    }
}
