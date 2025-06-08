import {
    CommStep,
    CommunicationType,
} from '@/app/types/comms-system/comms-types';
import { BIANNUALLY_COMMS_FINAL_STEP_ID, CommsSchedule } from './CommsSchedule';

export class AnnuallyCheckInComms extends CommsSchedule {
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
                delayDays: 21,
                type: CommunicationType.PreCheckInReminder,
            },
            {
                stepId: 5,
                delayDays: 7,
                type: CommunicationType.BundleCheckInComms,
            },
            {
                stepId: 6,
                delayDays: 21,
                type: CommunicationType.PreCheckInReminder,
            },
            {
                stepId: 7,
                delayDays: 7,
                type: CommunicationType.BundleCheckInComms,
            },
            {
                stepId: 8,
                delayDays: 21,
                type: CommunicationType.PreCheckInReminder,
            },
            {
                stepId: 9,
                delayDays: 7,
                type: CommunicationType.BundleCheckInComms,
            },
            {
                stepId: 10,
                delayDays: 21,
                type: CommunicationType.PreCheckInReminder,
            },
            {
                stepId: 11,
                delayDays: 7,
                type: CommunicationType.BundleCheckInComms,
            },
            {
                stepId: 12,
                delayDays: 21,
                type: CommunicationType.PreCheckInReminder,
            },
            {
                stepId: 13,
                delayDays: 7, // When a step gets processed, this is the amount of time to delay for this current step
                type: CommunicationType.BundleCheckInComms,
            },
            {
                stepId: 14,
                delayDays: 21,
                type: CommunicationType.PreCheckInReminder,
            },
            {
                stepId: 15,
                delayDays: 7,
                type: CommunicationType.BundleCheckInComms,
            },
            {
                stepId: 16,
                delayDays: 21,
                type: CommunicationType.PreCheckInReminder,
            },
            {
                stepId: 17,
                delayDays: 7,
                type: CommunicationType.BundleCheckInComms,
            },
            {
                stepId: 18,
                delayDays: 21,
                type: CommunicationType.PreCheckInReminder,
            },
            {
                stepId: 19,
                delayDays: 7,
                type: CommunicationType.BundleCheckInComms,
            },
            {
                stepId: 20,
                delayDays: 21,
                type: CommunicationType.PreCheckInReminder,
            },
            {
                stepId: 21,
                delayDays: 7,
                type: CommunicationType.BundleCheckInComms,
            },
            {
                stepId: 22,
                delayDays: 14,
                type: CommunicationType.PreCheckInReminder,
            },
            {
                stepId: BIANNUALLY_COMMS_FINAL_STEP_ID,
                delayDays: 7,
                type: CommunicationType.BundleCheckInComms,
            },
        ];
    }
}
