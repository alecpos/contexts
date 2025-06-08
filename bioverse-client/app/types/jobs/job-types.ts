export enum JobTypes {
    // Determining if should be Review or ReviewNoPrescribe
    IsReviewNoPrescribe = 'is-review-noprescribe',
    // Converting Overdue -> OverdueNoPrescribe if necessary
    CheckOverdueNoPrescribe = 'check-overdue-no-prescribe',
    CheckShouldVerifyID = 'check_should_verify_id',
    ExitMessageUnreadCampaign = 'exit-message-unread-campaign',
    ExitIDFollowupMessageCampaign = 'exit-id-followup-message-campaign',
    VerifyMixpanelEvent = 'verify-mixpanel-event',
    ProviderAwaitingResponsePatientMessageStatusTagUpdate = 'provider-awaiting-response-patient-message-statustag-update',
}

export interface JobsPayload {
    type: JobTypes;
    order_id?: string;
    customer_id?: string;
    mixpanel_payload?: any;
    id?: number;
}
