'use server';

import { Status } from '@/app/types/global/global-enumerators';
import {
    CustomerIOCommsMetadata,
    JobScheduler,
    JobSchedulerStatus,
    JobSchedulerTypes,
    RenewalValidationMetadata,
} from '@/app/types/job-scheduler/job-scheduler-types';
import { createSupabaseServiceClient } from '@/app/utils/clients/supabaseServerClient';
import { JobSchedulerFactory } from '@/app/utils/functions/job-scheduler/JobSchedulerFactory';
import {
    forwardOrderToEngineering,
    getStatusTagForOrder,
    updateStatusTagToReview,
} from '../patient-status-tags/patient-status-tags-api';
import {
    EngineeringQueueNotes,
    StatusTag,
} from '@/app/types/status-tags/status-types';
import { ScheduledComm } from '@/app/types/comms-system/comms-types';
import { getBaseOrderById } from '../orders/orders-api';
import { OrderStatus } from '@/app/types/orders/order-types';

export async function handleJobSuccess(job: JobScheduler) {
    const supabase = createSupabaseServiceClient();

    await supabase
        .from('job_scheduler')
        .update({
            status: JobSchedulerStatus.Completed,
            last_run_at: new Date().toISOString(),
        })
        .eq('job_id', job.job_id);
}

export async function handleJobFailure(
    job: JobScheduler,
    newScheduleTime: Date,
    shouldRetry: boolean
) {
    const supabase = createSupabaseServiceClient();

    if (shouldRetry) {
        const exceededRetries = job.retry_count + 1 >= job.max_retries;

        await supabase
            .from('job_scheduler')
            .update({
                status: exceededRetries
                    ? JobSchedulerStatus.Expired
                    : job.status,
                last_run_at: new Date().toISOString(),
                retry_count: job.retry_count + 1,
                schedule_time: newScheduleTime.toISOString(),
            })
            .eq('job_id', job.job_id);

        if ('order_id' in job.metadata) {
            await forwardOrderToEngineering(
                job.metadata.order_id,
                null,
                EngineeringQueueNotes.RetryExpired
            );
        }
    } else {
        await supabase
            .from('job_scheduler')
            .update({
                status: JobSchedulerStatus.Expired,
                last_run_at: new Date().toISOString(),
                retry_count: job.retry_count + 1,
            })
            .eq('job_id', job.job_id);

        if ('order_id' in job.metadata) {
            const statusTag = await getStatusTagForOrder(job.metadata.order_id);
            if (!statusTag.data.status_tags?.includes(StatusTag.Engineer)) {
                await forwardOrderToEngineering(
                    job.metadata.order_id,
                    null,
                    EngineeringQueueNotes.RetryExpired
                );
            }
        }
    }
}

export async function auditJobScheduler(
    job: JobScheduler,
    status: Status,
    reason: string | null
) {
    const supabase = createSupabaseServiceClient();

    await supabase.from('job_scheduler_audit').insert({
        job_id: job.job_id,
        job_type: job.job_type,
        status,
        retry_count: job.retry_count,
        reason,
        metadata: job.metadata,
        environment: process.env.NEXT_PUBLIC_ENVIRONMENT,
    });
}

export async function processJob(jobData: JobScheduler) {
    const jobFactory = new JobSchedulerFactory(jobData);
    try {
        await jobFactory.executeJob();
        console.log('Job executed successfully.');
    } catch (error: any) {
        console.error(`Job execution failed: ${error.message}`);
    }
}

export async function createNewSendPrescriptionJob(order_id: string) {
    const supabase = createSupabaseServiceClient();

    await supabase.from('job_scheduler').insert({
        job_type: JobSchedulerTypes.SendPrescription,
        schedule_time: new Date().toISOString(),
        status: JobSchedulerStatus.Active,
        metadata: { order_id },
        environment: process.env.NEXT_PUBLIC_ENVIRONMENT,
    });
}

export async function createNewStripeInvoicePaidJob(
    order_id: string,
    invoice_id: string,
    stripe_subscription_id: string
) {
    const supabase = createSupabaseServiceClient();

    await supabase.from('job_scheduler').insert({
        job_type: JobSchedulerTypes.StripeInvoicePaid,
        schedule_time: new Date().toISOString(),
        status: JobSchedulerStatus.Active,
        metadata: { order_id, invoice_id, stripe_subscription_id },
        environment: process.env.NEXT_PUBLIC_ENVIRONMENT,
    });
    console.log('stripe invoice job created');
}

export async function createNewAutoRenewalJob(patient_id: string) {
    const supabase = createSupabaseServiceClient();

    await supabase.from('job_scheduler').insert({
        job_type: JobSchedulerTypes.RenewalAutoship,
        schedule_time: new Date().toISOString(),
        status: JobSchedulerStatus.Active,
        metadata: { patient_id },
        environment: process.env.NEXT_PUBLIC_ENVIRONMENT,
    });
}

export async function createNewIDAndSelfieCheckPostCheckoutJob(
    patient_id: string,
    order_id: string,
    product_href: string
) {
    const supabase = createSupabaseServiceClient();

    const tenMinutesFromNow = new Date(
        Date.now() + 10 * 60 * 1000
    ).toISOString();

    await supabase.from('job_scheduler').insert({
        job_type: JobSchedulerTypes.IDAndSelfieCheck,
        schedule_time: tenMinutesFromNow,
        status: JobSchedulerStatus.Active,
        metadata: { patient_id, order_id, product_href },
        environment: process.env.NEXT_PUBLIC_ENVIRONMENT,
    });
}

export async function markIDAndSelfieCheckJobCompleted(patient_id: string) {
    const supabase = createSupabaseServiceClient();

    const { data } = await supabase
        .from('job_scheduler')
        .update({ status: JobSchedulerStatus.Completed })
        .eq('job_type', JobSchedulerTypes.IDAndSelfieCheck)
        .eq('metadata->>patient_id', patient_id)
        .select();

    if (data && data[0]) {
        const order_id = data[0].metadata.order_id;

        if (order_id) {
            const order = await getBaseOrderById(order_id);

            if (order) {
                if (order.order_status === OrderStatus.UnapprovedCardDown) {
                    await updateStatusTagToReview(patient_id, String(order.id));
                }
            }
        }
    }
}

export async function createNewCommsJob(
    jobType: JobSchedulerTypes,
    nextStep: ScheduledComm,
    metadata: CustomerIOCommsMetadata
) {
    const supabase = createSupabaseServiceClient();

    await supabase.from('job_scheduler').insert({
        job_type: jobType,
        schedule_time: nextStep.sendDate.toISOString(),
        status: JobSchedulerStatus.Active,
        metadata: metadata,
        environment: process.env.NEXT_PUBLIC_ENVIRONMENT,
    });
}

export async function createNewSpecificCommsJob(
    jobType: JobSchedulerTypes,
    endDate: string,
    metadata: any
) {
    const supabase = createSupabaseServiceClient();

    await supabase.from('job_scheduler').insert({
        job_type: jobType,
        schedule_time: endDate,
        status: JobSchedulerStatus.Active,
        metadata: metadata,
        environment: process.env.NEXT_PUBLIC_ENVIRONMENT,
    });
}

export async function createNewFirstTimeCommJob(
    jobType: JobSchedulerTypes,
    user_id: string,
    subscription_id: number
) {
    const supabase = createSupabaseServiceClient();

    const metadata: CustomerIOCommsMetadata = {
        user_id,
        subscription_id,
        current_step: -1,
    };

    await supabase.from('job_scheduler').insert({
        job_type: jobType,
        schedule_time: new Date().toISOString(),
        status: JobSchedulerStatus.Active,
        metadata: metadata,
        environment: process.env.NEXT_PUBLIC_ENVIRONMENT,
    });
}

export async function getCommJobForSubscription(
    subscription_id: number
): Promise<JobScheduler> {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('job_scheduler')
        .select('*')
        .eq('metadata ->> subscription_id', subscription_id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

    if (error) {
        throw new Error(
            `Failed to getCommJobForSubscription: ${subscription_id}`
        );
    }

    return data as JobScheduler;
}

export async function createNewRenewalValidationJob(subscription_id: number) {
    const supabase = createSupabaseServiceClient();

    const metadata: RenewalValidationMetadata = {
        subscription_id,
    };

    await supabase.from('job_scheduler').insert({
        job_type: JobSchedulerTypes.RenewalValidation,
        schedule_time: new Date().toISOString(),
        status: JobSchedulerStatus.Active,
        metadata: metadata,
        environment: process.env.NEXT_PUBLIC_ENVIRONMENT,
    });
}


//used in ben-dev page once, might be useful later:

// export async function getMonthlyCheckinJobsForResend() {
//     const supabase = createSupabaseServiceClient();

//     const { data, error } = await supabase
//         .from('job_scheduler')
//         .select('metadata, schedule_time')
//         .eq('job_type', 'monthly_checkin_customerio')
//         .eq('status', 'completed')
//         .gte('schedule_time', new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString())
//         .lte('schedule_time', new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString())
//         .order('schedule_time', { ascending: true })
//         .neq('metadata->>user_id', '51e844bf-0efb-4313-8243-222951e90c93')
//         .eq('metadata->>current_step', '1')

//     if (error) {
//         throw new Error(
//             `Failed to getMonthlyCheckinJobs: ${error.message}`
//         );
//     }

//     return data;
// }