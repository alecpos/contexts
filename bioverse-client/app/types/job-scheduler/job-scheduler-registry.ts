import { SendPrescriptionJobHandler } from '@/app/utils/functions/job-scheduler/jobs/SendPrescriptionJobHandler';
import {
    JobSchedulerTypes,
    JobScheduler,
    IJobHandler,
} from './job-scheduler-types';
import { RenewalAutoshipJobHandler } from '@/app/utils/functions/job-scheduler/jobs/RenewalAutoshipJobHandler';
import { StripeInvoicePaidJobHandler } from '@/app/utils/functions/job-scheduler/jobs/StripeInvoicePaidJobHandler';
import { IDAndSelfieCheckJobHandler } from '@/app/utils/functions/job-scheduler/jobs/IDAndSelfieCheckJobHandler';
import { BaseCommJobHandler } from '@/app/utils/functions/job-scheduler/jobs/BaseCommJobHandler';
import { RenewalValidationJobHandler } from '@/app/utils/functions/job-scheduler/jobs/RenewalValidationJobHandler';

export const JobHandlerRegistry: Record<
    JobSchedulerTypes,
    new (jobScheduler: JobScheduler) => IJobHandler
> = {
    [JobSchedulerTypes.SendPrescription]: SendPrescriptionJobHandler,
    [JobSchedulerTypes.RenewalAutoship]: RenewalAutoshipJobHandler,
    [JobSchedulerTypes.StripeInvoicePaid]: StripeInvoicePaidJobHandler,
    [JobSchedulerTypes.IDAndSelfieCheck]: IDAndSelfieCheckJobHandler,
    [JobSchedulerTypes.MonthlyCheckInCustomerIO]: BaseCommJobHandler,
    [JobSchedulerTypes.QuarterlyCheckInCustomerIO]: BaseCommJobHandler,
    [JobSchedulerTypes.BiannuallyCheckInCustomerIO]: BaseCommJobHandler,
    [JobSchedulerTypes.AnnuallyCheckInCustomerIO]: BaseCommJobHandler,
    [JobSchedulerTypes.RenewalValidation]: RenewalValidationJobHandler,
    // Add other job handlers here
};
