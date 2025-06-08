// base-job-handler.ts

import {
    IJobHandler,
    JobScheduler,
} from '@/app/types/job-scheduler/job-scheduler-types';
import { Status } from '@/app/types/global/global-enumerators';
import {
    handleJobSuccess,
    handleJobFailure,
    auditJobScheduler,
} from '../../database/controller/job-scheduler/job-scheduler-actions';

export const DONT_RETRY_ERROR_MESSAGE = 'dont_process';

export abstract class BaseJobSchedulerHandler implements IJobHandler {
    protected jobScheduler: JobScheduler;

    constructor(jobScheduler: JobScheduler) {
        this.jobScheduler = jobScheduler;
    }

    // Execute method is the same for all job types
    async execute(): Promise<void> {
        try {
            await this.processJob();
            await this.finalizeJob(Status.Success); //this will mark the job as completed or expired
            await this.auditJob(Status.Success, null);
        } catch (error: any) {
            if (error.message === DONT_RETRY_ERROR_MESSAGE) {
                await this.finalizeJob(Status.Failure, false);
            } else {
                await this.finalizeJob(Status.Failure, true);
            }

            await this.auditJob(Status.Failure, error.message);
            throw error;
        }
    }

    // Each job type will implement its own processJob logic
    protected abstract processJob(): Promise<void>;

    // Common finalize logic
    protected async finalizeJob(
        status: Status,
        shouldRetry: boolean = true
    ): Promise<void> {
        if (status === Status.Success) {
            await handleJobSuccess(this.jobScheduler);
        } else {
            const nextRetryTime = this.getNextRetryTime();
            await handleJobFailure(
                this.jobScheduler,
                nextRetryTime,
                shouldRetry
            );
        }
    }

    // Auditing for both success and failure
    protected async auditJob(
        status: Status,
        reason: string | null
    ): Promise<void> {
        await auditJobScheduler(this.jobScheduler, status, reason);
    }

    // Each job type can have its own retry interval
    protected abstract getNextRetryTime(): Date;
}
