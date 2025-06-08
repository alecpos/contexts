export enum CommunicationType {
    PreCheckInReminder = 'wl-checkin-pre-reminder', //event trigger for customer.io campaign
    MonthlyPreCheckInReminder = 'wl-checkin-pre-reminder-monthly', //event trigger for customer.io campaign
    BundleCheckInComms = 'bundle-checkin-comms', //event trigger for customer.io campaign
    MonthlyCheckInComms = 'monthly-checkin-comms', //there is a customer.io event but it's never running! does it get to customio.io?
    NO_TYPE = 'no-type',
    // WLCheckInMonthly = 'wl-checkin', //this used to be used
}

export interface CommStep {
    stepId: number; // Unique identifier for tracking
    delayDays: number; // Days after startDate to send
    type: CommunicationType;
}

export interface ScheduledComm {
    customerId: string;
    sendDate: Date;
    type: CommunicationType;
    currentStepId: number;
}
