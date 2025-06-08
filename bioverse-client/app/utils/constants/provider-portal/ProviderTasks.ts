/*
 *
 * The following enum is used to determine the task name for the provider task.
 * These task names are also used to determine which buttons to show in the review-approval-buttons.tsx component.
 *
 */
export enum ProviderTaskNames {
    SubscriptionReactivation = 'Subscription Reactivation – Approve, if Medically Appropriate & Send Dosing Instructions', //1.
    ManuallyCreatedOrder = 'Manually Created Order – Approve, if medically appropriate & send dosing instructions', //2.
    NewPatientPrescribe = 'New Patient: Approve Request, if Medically Appropriate & Send Dosing Instructions', //3.
    WLMonthlyCheckin = 'WL Monthly Check-in', //4.
    AdditionalVialsRequest = 'Additional Vials Request – Approve, if Medically Appropriate & Send Dosing Instructions', //5.
    CustomDosageRequest = 'Patient-Specific Order – Approve, if Medically Appropriate & Send Dosing Instructions', //6.
    ProviderMessage = 'Provider Message Needed - No Approval Required', //7.
    NonRefillCheckin = 'Action Needed: Review the Check in. Send Dosing Instructions. No Approval Required', //8.
    RefillRequest = 'Refill request: Approve, if Medically Appropriate & Send Dosing Instructions', //9.
    //fallback task names for unrecognized order-states:
    WLCheckinReview = 'WL Check-in Review', //<-- this should theoretically never be used
    WLQuarterlyCheckin = 'WL Quarterly Check-in', //<-- this should theoretically never be used
}
