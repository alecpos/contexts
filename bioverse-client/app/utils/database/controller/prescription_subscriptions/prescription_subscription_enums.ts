/**
 * 
 * 
 * @purpose Status flags are used to label patients who do not complete checkins or do not complete the dosage-selection form.
 * 
 * @important Completing the renewal dosage-selection form wipes all status flags. 
 * 
 * 
 */
export enum SubscriptionStatusFlags {
    /* 
    * NO_CHECK_IN_HOLD
    * A patient gets this flag in the RenewalValidationJob if they have not completed a checkin form in the the duration of their subscription period.
    * A patient has this flag removed when they complete a checkin form.
    * 
    * */
    NO_CHECK_IN_HOLD = 'no_check_in_hold',


    /*
    * CONVERTED_MONTHLY
    * A patient gets this flag in the RenewalValidationJob if they have not completed a checkin form during their current billing cycle.
    * A patient has this flag removed when all flags are wiped after they complete the dosage-selection form
    * 
    * */
    CONVERTED_MONTHLY = 'converted_monthly',


    /*
    * NO_CHECK_IN_HOLD_CHARGED 
    * A patient gets this flag in the StripeInvoicePaidJobHandler if they are charged while they have the NO_CHECK_IN_HOLD flag.
    * A patient has this flag removed when they complete a checkin form.
    * 
    * */
    NO_CHECK_IN_HOLD_CHARGED = 'no_check_in_hold_charged', 


    /*
    * NO_CHECK_IN_HOLD_PENDING_DS
    * A patient gets this flag if they complete a checkin when their current flag is NO_CHECK_IN_HOLD_CHARGED
    * A patient has this flag removed when they complete the dosage-selection form
    * 
    * If the patient completes the dosage-selection form with this, then the hasPaid prop will be true and they will be refunded+charged immediately+script sent immediately.
    * 
    * */
    NO_CHECK_IN_HOLD_PENDING_DS = 'no_check_in_hold_pending_ds', 

}
