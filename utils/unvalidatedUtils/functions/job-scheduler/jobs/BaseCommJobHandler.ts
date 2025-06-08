import { ThreeMonthCheckInComms } from '@/app/utils/classes/CommsScheduler/ThreeMonthCheckInComms';
import { BaseJobSchedulerHandler } from '../BaseJobSchedulerHandler';
import {
    CustomerIOCommsMetadata,
    JobSchedulerTypes,
} from '@/app/types/job-scheduler/job-scheduler-types';
import { ScheduledComm } from '@/app/types/comms-system/comms-types';
import { createNewCommsJob } from '@/app/utils/database/controller/job-scheduler/job-scheduler-actions';
import { MonthlyCheckInComms } from '@/app/utils/classes/CommsScheduler/MonthlyCheckInComms';
import { BiannuallyCheckInComms } from '@/app/utils/classes/CommsScheduler/BiannuallyCheckInComms';
import { AnnuallyCheckInComms } from '../../../classes/CommsScheduler/AnnuallyCheckInComms';

export class BaseCommJobHandler extends BaseJobSchedulerHandler {
    protected async processJob(): Promise<void> {
        const metadata = this.jobScheduler.metadata as CustomerIOCommsMetadata;

        const { user_id, subscription_id, current_step } = metadata;

        // Determine the communication schedule type dynamically
        const commsSchedule = this.createCommsSchedule(
            this.jobScheduler.job_type,
            user_id,
            subscription_id,
            current_step
        );

        if (!commsSchedule) {
            console.error(
                `Invalid communication job type: ${this.jobScheduler.job_type}`
            );
            return;
        }

        // Send the communication (email or text)
        await commsSchedule.sendCommunication();

        // Get the next step in the schedule
        const nextStep = commsSchedule.getNextStep();

        if (!nextStep) {
            console.log(
                `No more steps left for job ${this.jobScheduler.job_id}. Marking as completed.`
            );
            return;
        }


        // Update metadata with the last completed step
        const updatedMetadata: CustomerIOCommsMetadata = {
            ...metadata,
            current_step: nextStep.currentStepId,
        };

        // Schedule the next step if available
        await this.scheduleNextStep(nextStep, updatedMetadata);
    }

    /** Dynamically creates the correct communication schedule */
    protected createCommsSchedule(
        jobType: JobSchedulerTypes,
        customerId: string,
        subscriptionId: number,
        currentStep: number
    ) {
        switch (jobType) {
            case JobSchedulerTypes.QuarterlyCheckInCustomerIO:
                return new ThreeMonthCheckInComms(
                    customerId,
                    new Date(),
                    subscriptionId,
                    currentStep
                );
            case JobSchedulerTypes.MonthlyCheckInCustomerIO:
                return new MonthlyCheckInComms(
                    customerId,
                    new Date(),
                    subscriptionId,
                    currentStep
                );
            case JobSchedulerTypes.BiannuallyCheckInCustomerIO:
                return new BiannuallyCheckInComms(
                    customerId,
                    new Date(),
                    subscriptionId,
                    currentStep
                );
            case JobSchedulerTypes.AnnuallyCheckInCustomerIO:
                return new AnnuallyCheckInComms(
                    customerId,
                    new Date(),
                    subscriptionId,
                    currentStep
                );
            default:
                throw new Error('Unknown Check-in Job Schedule Type');
        }
    }

    protected getNextRetryTime(): Date {
        //  30 minutes
        return new Date(Date.now() + 30 * 60 * 1000);
    }

    /** Schedule the next step as a new job */
    private async scheduleNextStep(
        nextStep: ScheduledComm,
        updatedMetadata: CustomerIOCommsMetadata
    ): Promise<void> {
        await createNewCommsJob(
            this.jobScheduler.job_type,
            nextStep,
            updatedMetadata
        );
    }
}
