// send-prescription-job-handler.ts

import { RenewalAutoshipMetadata } from '@/app/types/job-scheduler/job-scheduler-types';
import { BaseJobSchedulerHandler } from '../BaseJobSchedulerHandler';

export class RenewalAutoshipJobHandler extends BaseJobSchedulerHandler {
    protected async processJob(): Promise<void> {
        const metadata = this.jobScheduler.metadata as RenewalAutoshipMetadata;

        const res = await fetch(
            'https://app.gobioverse.com/api/renewal/autoship',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    patient_id: metadata.patient_id,
                }),
            }
        );

        if (res.status !== 200) {
            throw new Error('Failed to send prescription.');
        }
    }

    protected getNextRetryTime(): Date {
        // Custom retry interval for SendPrescriptionJob (e.g., 3 hours)
        return new Date(Date.now() + 3 * 60 * 60 * 1000);
    }
}
