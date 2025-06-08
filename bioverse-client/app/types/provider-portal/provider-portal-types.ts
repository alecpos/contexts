export enum PillStatus {
    Incomplete = 'Incomplete',
    NeedsReview = 'Needs-Review',
    ActiveSubscription = 'Active-Subscription',
    ScheduledCancel = 'Scheduled-Cancellation',
    Canceled = 'Canceled',
    ActiveGLP1Subscription = 'active_glp1_subscription',
    PreviouslyCanceledSubscription = 'previously_canceled_subscription',
    PreviouslyDeniedSubscription = 'previously_denied_subscription',
    Autoshipped = 'autoshipped',
    NoCheckInHold = 'no_check_in_hold',
}

export enum MacroCategory {
    Shipping = 'Shipping',
    Billing = 'Billing',
    Prescription = 'Prescription',
    Orders = 'Orders',
    Subscription = 'Subscriptions',
    FirstPrescription = 'First-prescription',
    Pricing = 'Pricing',
    Refill = 'Refill',
    Bug = 'Bug',
    Escalation = 'Escalation',
    Clinical = 'Clinical',
}

export const MacroCategoryArray: string[] = [
    'Shipping',
    'Billing',
    'Prescription',
    'Orders',
    'Subscription',
    'First-prescription',
    'Pricing',
    'Refill',
    'Bug',
    'Escalation',
    'Clinical',
];
