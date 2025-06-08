export enum JobSchedulerTypes {
    SendPrescription = 'send_prescription_script',
    RenewalAutoship = 'send_renewal_autoship',
    StripeInvoicePaid = 'stripe_invoice_paid',
    IDAndSelfieCheck = 'id_selfie_check_post_checkout',
    MonthlyCheckInCustomerIO = 'monthly_checkin_customerio',
    QuarterlyCheckInCustomerIO = 'quarterly_checkin_customerio',
    BiannuallyCheckInCustomerIO = 'biannually_checkin_customerio',
    AnnuallyCheckInCustomerIO = 'annually_checkin_customerio',
    RenewalValidation = 'renewal_validation',
}

// Metadata interfaces declared here
export interface SendPrescriptionMetadata {
    order_id: string;
}

export interface RenewalAutoshipMetadata {
    patient_id: string;
}

export interface StripeInvoicePaidMetadata {
    order_id: string;
    invoice_id: string;
    stripe_subscription_id: string;
}

export interface IDAndSelfieCheckMetadata {
    patient_id: string;
    product_href: string;
    order_id: string;
}

export interface CustomerIOCommsMetadata {
    user_id: string;
    subscription_id: number;
    current_step: number;
}

export interface RenewalValidationMetadata {
    subscription_id: number;
}

type JobTypeMetadataMap = {
    [JobSchedulerTypes.SendPrescription]: SendPrescriptionMetadata;
    [JobSchedulerTypes.RenewalAutoship]: RenewalAutoshipMetadata;
    [JobSchedulerTypes.StripeInvoicePaid]: StripeInvoicePaidMetadata;
    [JobSchedulerTypes.IDAndSelfieCheck]: IDAndSelfieCheckMetadata;
    [JobSchedulerTypes.MonthlyCheckInCustomerIO]: CustomerIOCommsMetadata;
    [JobSchedulerTypes.QuarterlyCheckInCustomerIO]: CustomerIOCommsMetadata;
    [JobSchedulerTypes.BiannuallyCheckInCustomerIO]: CustomerIOCommsMetadata;
    [JobSchedulerTypes.AnnuallyCheckInCustomerIO]: CustomerIOCommsMetadata;
    [JobSchedulerTypes.RenewalValidation]: RenewalValidationMetadata;
};

export enum JobSchedulerStatus {
    Active = 'active',
    Paused = 'paused',
    Expired = 'expired',
    Completed = 'completed',
}

type MetadataForJobType<T extends JobSchedulerTypes> = JobTypeMetadataMap[T];

interface JobSchedulerBase {
    job_id: number;
    created_at: string;
    last_updated_at: string;
    schedule_time: string;
    status: JobSchedulerStatus;
    last_run_at: string;
    retry_count: number;
    max_retries: number;
}

export interface JobScheduler<T extends JobSchedulerTypes = JobSchedulerTypes>
    extends JobSchedulerBase {
    job_type: T;
    metadata: MetadataForJobType<T>;
}

// job-handler-interface.ts

export interface IJobHandler {
    execute(): Promise<void>;
}
