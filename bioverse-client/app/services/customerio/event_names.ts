export const ACCOUNT_CREATED = 'account-created';
export const ADDRESS_VERIFIED = 'address-verified';
export const COMPLETE_PROFILE_SCREEN = 'complete-profile-screen';
export const ORDER_RECEIVED = 'order-received';
export const PURCHASE_SUCCESS = 'purchase-success';
export const NEW_MESSAGE = 'new-message';
export const PAYMENT_FAILED = 'failed-payment';
export const PAYMENT_SUCCESS = 'payment-success';
export const PRESCRIPTION_DELIVERED = 'prescription-delivered'; //triggered in the easypost webhook
export const PRESCRIPTION_PROCESSED = 'prescription-processed';
export const PRESCRIPTION_APPROVED = 'prescription-approved';
export const PRESCRIPTION_SHIPPED = 'prescription-shipped';
export const ISSUE_WITH_DELIVERY = 'issue-with-delivery';
export const PASSWORD_UPDATED = 'password-updated';
export const ID_VERIFICATION_SKIPPED = 'id-skipped';
export const SELFIE_SKIPPED = 'selfie-skipped';
export const SELFIE_UPLOADED = 'selfie-uploaded';
export const ID_VERIFICATION_UPLOADED = 'id-uploaded';
export const CHECKIN_NEEDED = 'checkin-needed';
export const WL_CHECKIN = 'wl-checkin';
export const WL_CHECKIN_COMPLETE = 'wl-checkin-complete';
export const WL_CHECKIN_INCOMPLETE = 'wl-checkin-incomplete';
export const WL_CHECKIN_ELSE_PAUSED = 'wl-checkin-else-paused';
export const WL_CHECKIN_DELAY = 'wl-checkin-delay';
export const WL_CHECKIN_DELAY_COMPLETE = 'wl-checkin-delay-complete';
export const WL_MULTI_MONTH_CHECKIN = 'wl-multi-month-check-in'; //unused in codebase
export const WL_CHECKIN_RESEND = 'wl-checkin-resend';
export const SUBSCRIPTION_CANCELED = 'subscription-canceled';
export const WL_CHECKIN_UNPAID = 'wl-checkin-unpaid';
export const WL_NEED_CHECKIN_UNPAID = 'wl-need-checkin-unpaid';
export const WL_PAID = 'wl-paid';
export const WL_UNPAID = 'wl-unpaid';
export const ORDER_CONFIRMED = 'order-confirmed';
export const ORDER_CANCELED = 'order-canceled';
export const RENEWAL_ORDER_RECEIVED = 'renewal-order-received';
export const PRESCRIPTION_RENEWAL_SHIPPED = 'prescription-renewal-shipped';
export const CHECKOUT_REACHED_GENERAL = 'checkout-reached';
export const NEW_NONPHI_MESSAGE = 'new-nonphi-message';
export const NEW_BUG = 'new-bug';
export const REQUIRES_ID_VERIFICATION = 'requires-id-verification';
export const ID_VERIFICATION_COMPLETE = 'id-verification-complete';
export const MESSAGE_UNREAD = 'message-unread';
export const MESSAGE_REPLIED = 'message-replied';
export const CONFIRM_TREATMENT = 'confirm-treatment';
export const CONFIRM_TREATMENT_QUARTERLY = 'confirm-treatment-quarterly';
export const TREATMENT_CONFIRMED = 'treatment-confirmed';
export const NON_WL_CHECKIN = 'non-wl-checkin';
export const NON_WL_CHECKIN_COMPLETE = 'non-wl-checkin-complete';
export const NON_WL_CHECKIN_INCOMPLETE = 'non-wl-checkin-incomplete';
export const NON_WL_CHECKIN_ELSE_PAUSED = 'non-wl-checkin-else-paused';
export const NON_WL_CHECKIN_DELAY = 'non-wl-checkin-delay';
export const NON_WL_CHECKIN_DELAY_COMPLETE = 'non-wl-checkin-delay-complete';
export const NON_WL_MULTI_MONTH_CHECKIN = 'non-wl-multi-month-check-in';
export const NON_WL_CHECKIN_RESEND = 'non-wl-checkin-resend';
export const NON_WL_CHECKIN_UNPAID = 'non-wl-checkin-unpaid';
export const NON_WL_NEED_CHECKIN_UNPAID = 'non-wl-need-checkin-unpaid';
export const NON_WL_UNPAID = 'non-wl-unpaid';
export const NON_WL_PAID = 'non-wl-paid';
export const WL_BIANNUAL_CHECKIN = 'wl-biannual-checkin';
export const FIRST_TIME_DOSAGE_SELECTION_REMINDER =
    'first-time-dosage-selection-reminder';
export const WEIGHT_LOSS_SWAP_PRODUCT = 'weight-loss-swap-product';
export const SUBSCRIPTION_CANCELED_ANNUAL = 'subscription-canceled-annual';

export const ID_VERIFICATION_FOLLOWUP = 'id-verification-followup';
export const ID_VERIFICATION_FOLLOWUP_COMPLETE =
    'id-verification-followup-complete';
export const SUPER_SATISFIED_CUSTOMER = 'super-satisfied-customer';
export const FIRST_TIME_DOSAGE_SELECTION_COMPLETE =
    'first-time-dosage-selection-complete';

export const OLIVIER_ID = '1313a649-2299-4bd2-b584-eab040ce872f';

// events triggered by the job handler:
// in this file: bioverse-client/app/types/comms-system/comms-types.ts
// export enum CommunicationType {
//     PreCheckInReminder = 'wl-checkin-pre-reminder',
//     MonthlyPreCheckInReminder = 'wl-checkin-pre-reminder-monthly',
//     BundleCheckInComms = 'bundle-checkin-comms',
//     MonthlyCheckInComms = 'monthly-checkin-comms',
//     NO_TYPE = 'no-type',
// }

//CHECKIN CUSTOMER.IO CAMPAIGNS:
// All checkin event triggering happens in the job scheduler, the job is created by the easypost webhook once the prescription is delivered.
// Job is processed with the /app/utils/functions/job-scheduler/jobs/BaseCommJobHandler.ts
// which then creates the correct comms schedule and triggers the comms
// there are the ThreeMonthCheckInComms, MonthlyCheckInComms, QuarterlyCheckInComms, BiannuallyCheckInComms, AnnuallyCheckInComms classes
// all these classes extend the base CommsSchedule class and define the defineSteps() method
// this method is used in the CommSchedule's sendCommunication method() to trigger whatever events are in the sub-class's defineSteps() method
// for example, the ThreeMonthCheckInComms class has the following defineSteps() method:
// protected defineSteps(): CommStep[] {
//     return [
//         {
//             stepId: -1,
//             delayDays: 0,
//             type: CommunicationType.NO_TYPE,
//         },
//         {
//             stepId: 0,
//             delayDays: 14,
//             type: CommunicationType.PreCheckInReminder, //wl-checkin-pre-reminder
//         },
//         {
//             stepId: 1,
//             delayDays: 7, // When a step gets processed, this is the amount of time to delay for this current step
//             type: CommunicationType.BundleCheckInComms, //bundle-checkin-comms
//         },
//         {
//             stepId: 2,
//             delayDays: 21,
//             type: CommunicationType.PreCheckInReminder, //wl-checkin-pre-reminder
//         },
//         {
//             stepId: 3,
//             delayDays: 7,
//             type: CommunicationType.BundleCheckInComms, //bundle-checkin-comms
//         },
//         {
//             stepId: 4,
//             delayDays: 14,
//             type: CommunicationType.PreCheckInReminder, //wl-checkin-pre-reminder
//         },
//         {
//             stepId: QUARTERLY_COMMS_FINAL_STEP_ID,
//             delayDays: 7,
//             type: CommunicationType.BundleCheckInComms, //bundle-checkin-comms
//         },
//     ];

//bundle-checkin-comms event --> sends an email/text ("It's time to check in...") then triggers the wl-checkin-reminder event
//wl-checkin-pre-reminder event --> sends an email/text ("Reminder: Check-in next week...")

// wl-checkin-reminder event --> waits one day then sends email/text ("This is a friendly reminder to check in...") - repeats a few times every 2 days

//Inside the checkin code - once they finish all the question, the handleCheckupCompletion function is called
//this function triggers the wl-checkin-complete event - this event is the 'goal' of the other campaigns, so when it's reached, they exit the campaigns
