export interface PatientActionHistory {
    id: number;
    patient_id: string;
    created_at: string;
    task_name: PatientActionTask;
    notes: any;
}

export enum PatientActionTask {
    INTAKE_SUBMITTED = 'intake-submitted',
    CHECKIN_FORM_SUBMITTED = 'checkin-form-submitted',
    DOSAGE_SELECTION_REQUESTED = 'dosage-selection-requested',
    SHIPPING_ADDRESS_UPDATED = 'shipping-address-updated',
    PERSONAL_INFORMATION_UPDATED = 'personal-info-updated',
    REFILL_DATE_CHANGED = 'refill-date-changed',
    SUBSCRIPTION_CANCELED_REQUESTED = 'subscription-cancel-requested',
    SENT_MESSAGE = 'sent-message',
    CARD_UPDATED = 'credit-card-updated',
    SUBSCRIPTION_RESUMED = 'subscription-resumed',
    PAYMENT_FAILED = 'payment-failed',
    CHECKIN_FORM_SENT = 'checkin-form-sent',
    REFUNDED_SUBSCRIPTION = 'refunded-subscription',
    ORDER_VOIDED = 'order-voided',
    PAYMENT_SUCCESS = 'payment-success',
    MANUAL_ORDER_CREATED = 'manual-order-created',
    INTAKE_APPROVED = 'intake-approved',
    FIRST_TIME_DOSAGE_SELECTION_REQUESTED = 'first-time-dosage-selection-requested',
}

export const PatientHistoryTaskName: Record<PatientActionTask, string> = {
    [PatientActionTask.INTAKE_SUBMITTED]: 'PRESCRIPTION REQUESTED',
    [PatientActionTask.CHECKIN_FORM_SUBMITTED]: 'CHECK-IN FORM SUBMITTED',
    [PatientActionTask.DOSAGE_SELECTION_REQUESTED]:
        'DOSAGE SELECTION REQUESTED',
    [PatientActionTask.SHIPPING_ADDRESS_UPDATED]: 'SHIPPING ADDRESS UPDATED',
    [PatientActionTask.PERSONAL_INFORMATION_UPDATED]:
        'PERSONAL INFORMATION UPDATED',
    [PatientActionTask.REFILL_DATE_CHANGED]: 'REFILL DATE CHANGED',
    [PatientActionTask.SUBSCRIPTION_CANCELED_REQUESTED]:
        'SUBSCRIPTION CANCELED REQUESTED',
    [PatientActionTask.SENT_MESSAGE]: 'SENT MESSAGE',
    [PatientActionTask.CARD_UPDATED]: 'CREDIT CARD UPDATED',
    [PatientActionTask.SUBSCRIPTION_RESUMED]: 'SUBSCRIPTION RESUMED',
    [PatientActionTask.PAYMENT_FAILED]: 'PAYMENT FAILED',
    [PatientActionTask.CHECKIN_FORM_SENT]: 'CHECK-IN FORM SENT',
    [PatientActionTask.REFUNDED_SUBSCRIPTION]:
        'REFUNDED PAYMENT FOR SUBSCRIPTION',
    [PatientActionTask.ORDER_VOIDED]: 'ORDER VOIDED',
    [PatientActionTask.PAYMENT_SUCCESS]: 'PAYMENT SUCCESS',
    [PatientActionTask.MANUAL_ORDER_CREATED]: 'MANUAL ORDER CREATED',
    [PatientActionTask.INTAKE_APPROVED]: 'INTAKE APPROVED',
    [PatientActionTask.FIRST_TIME_DOSAGE_SELECTION_REQUESTED]:
        'FIRST TIME DOSAGE SELECTION',
};
