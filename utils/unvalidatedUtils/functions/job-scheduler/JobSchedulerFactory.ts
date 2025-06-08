// jobs-scheduler-factory.ts

import { JobHandlerRegistry } from '@/app/types/job-scheduler/job-scheduler-registry';
import {
    IJobHandler,
    JobScheduler,
} from '@/app/types/job-scheduler/job-scheduler-types';

export class JobSchedulerFactory {
    private jobScheduler: JobScheduler;

    constructor(payload: JobScheduler) {
        this.jobScheduler = payload;
    }

    async executeJob() {
        const jobHandler = this.createJobHandler();

        if (!jobHandler) {
            const errorMsg = `Job type ${this.jobScheduler.job_type} is not supported.`;
            // Optionally handle auditing and finalization here if desired
            throw new Error(errorMsg);
        }

        // console.log(`Executing [Job ID ${this.jobScheduler.job_id}]`);

        // Execute the job using the handler's execute method
        await jobHandler.execute();

        // console.log(`Finished Executing [Job ID ${this.jobScheduler.job_id}]`);
    }

    private createJobHandler(): IJobHandler | null {
        const HandlerClass = JobHandlerRegistry[this.jobScheduler.job_type];
        if (HandlerClass) {
            return new HandlerClass(this.jobScheduler);
        }
        return null;
    }
}
