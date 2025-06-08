export enum StatusTag {
    // For Providers
    LeadProvider = 'LeadProvider',
    Review = 'Review',
    ReviewNoPrescribe = 'ReviewNoPrescribe',
    OverdueNoPrescribe = 'OverdueNoPrescribe',
    FinalReview = 'FinalReview',
    Overdue = 'Overdue',
    ProviderAwaitingResponse = 'ProviderAwaitingResponse',
    LeadProviderAwaitingResponse = 'LeadProviderAwaitingResponse',
    ProviderMessage = 'ProviderMessage',
    RegisteredNurseMessage = 'RegisteredNurseMessage',
    CoordinatorCreateOrder = 'CoordinatorCreateOrder',
    UrgentRequiresProvider = 'UrgentRequiresProvider',
    // Show up in the Coordinator queue
    // Multi status tags- Able to appear together in the array.
    ReadPatientMessage = 'ReadPatientMessage',
    Coordinator = 'Coordinator',
    IDDocs = 'ID/Docs',
    FollowUp = 'FollowUp',
    LeadCoordinator = 'LeadCoordinator',
    // PatientMedicalQuestion = 'PatientMedicalQuestion',

    DoctorLetterRequired = 'DoctorLetterRequired',
    CoordinatorAwaitingResponse = 'CoordinatorAwaitingResponse',
    CustomerIOFollowUp = 'CustomerIOFollowUp',
    IDVerificationCustomerIOFollowUp = 'IDVerificationCustomerIOFollowUp',
    CancelOrderOrSubscription = 'CancelOrderOrSubscription',

    AwaitingResponse = 'AwaitingResponse', // Not used anymore
    RNAwaitingResponse = 'RNAwaitingResponse',
    Engineer = 'Engineer',

    // Resolved Cases- no further action needed
    Resolved = 'Resolved',
    NE = 'N/E',
    None = 'None',
    SupplementaryVialRequest = 'SupplementaryVialRequest',
    CustomDosageRequest = 'CustomDosageRequest',
}

export enum AllStatusTagSelectLabel {
    LeadProvider = 'Lead Provider',
    Review = 'Review',
    Overdue = 'Overdue',
    ProviderAwaitingResponse = 'Provider Awaiting Response',
    LeadProviderAwaitingResponse = 'Lead Provider - Awaiting Response',
    ProviderMessage = 'Provider - Message Patient',
    RegisteredNurseMessage = 'Registered Nurse - Message Patient',
    FinalReview = 'Provider - Final Review GLP1',
    UrgentRequiresProvider = 'Urgent - Provider Must Message',
    // PatientMedicalQuestion = 'Provider - Check Patient Messages',
    Coordinator = 'Coordinator',
    CoordinatorCreateOrder = 'Coordinator - Create New Order',
    LeadCoordinator = 'LeadCoordinator',
    // AwaitingResponse = 'Awaiting Response',
    RNAwaitingResponse = 'Registered Nurse - Awaiting Response',
    CoordinatorAwaitingResponse = 'Coordinator Awaiting Response',
    FollowUp = 'Follow Up',
    IDDocs = 'ID/Docs',
    CustomerIOFollowUp = 'Customer IO FollowUp',
    IDVerificationCustomerIOFollowUp = 'ID Verification Customer IO FollowUp',

    Engineer = 'Engineer',
    NE = 'N/E',
    Resolved = 'Resolved',
    None = 'None',
    SupplementaryVialRequest = 'SupplementaryVialRequest',
    CustomDosageRequest = 'CustomDosageRequest',
}

export enum StatusTagSelectLabel {
    LeadProvider = 'Lead Provider',
    Review = 'Review',
    Overdue = 'Overdue',
    ProviderMessage = 'Provider - Message Patient',
    RegisteredNurseMessage = 'Registered Nurse - Message Patient',
    FinalReview = 'Provider - Final Review GLP1',
    CoordinatorAwaitingResponse = 'Coordinator Awaiting Response',
    UrgentRequiresProvider = 'Urgent - Provider Must Message',
    Coordinator = 'Coordinator',
    LeadCoordinator = 'LeadCoordinator',
    FollowUp = 'Follow Up',
    IDDocs = 'ID/Docs',
    // PatientMedicalQuestion = 'Provider - Check Patient Messages',
    CustomerIOFollowUp = 'Customer IO FollowUp',
    IDVerificationCustomerIOFollowUp = 'ID Verification Customer IO FollowUp',

    Engineer = 'Engineer',
    NE = 'N/E',
    Resolved = 'Resolved',
    None = 'None',
    SupplementaryVialRequest = 'SupplementaryVialRequest',
    CustomDosageRequest = 'CustomDosageRequest',
}

export enum StatusTagSelectLabelProvider {
    LeadProvider = 'Lead Provider',
    Review = 'Review',
    // ProviderMessage = 'Provider - Message Patient',
    RegisteredNurseMessage = 'Registered Nurse - Message Patient',
    // FinalReview = 'FinalReview',
    // ReviewNoPrescribe = 'Review No Prescribe',
    // AwaitingResponse = 'Awaiting Response',
    UrgentRequiresProvider = 'Urgent - Provider Must Message',
    ProviderAwaitingResponse = 'Provider Awaiting Response',
    Coordinator = 'Coordinator',
    CoordinatorCreateOrder = 'Coordinator - Create New Order',
    LeadCoordinator = 'LeadCoordinator',
    LeadProviderAwaitingResponse = 'Lead Provider - Awaiting Response',
    // FollowUp = 'Follow Up',
    IDDocs = 'ID/Docs',

    Engineer = 'Engineer',
    NE = 'N/E',
    Resolved = 'Resolved',
    FinalReview = 'FinalReview',
    SupplementaryVialRequest = 'SupplementaryVialRequest',
    CustomDosageRequest = 'CustomDosageRequest',
    // None = 'None',
}

/**
 * The status tags that will appear if accessing status dropdown from the registered nurse task view menu.
 */
export enum StatusTagSelectLabelRegisteredNurse {
    LeadProvider = 'Lead Provider',
    Review = 'Review',
    ProviderMessage = 'Provider - Message Patient',
    RNAwaitingResponse = 'Registered Nurse - Awaiting Response',
    UrgentRequiresProvider = 'Urgent - Provider Must Message',
    Coordinator = 'Coordinator',
    CoordinatorCreateOrder = 'Coordinator - Create New Order',
    LeadCoordinator = 'LeadCoordinator',
    FollowUp = 'Follow Up',
    Engineer = 'Engineer',
    Resolved = 'Resolved',
    SupplementaryVialRequest = 'SupplementaryVialRequest',
    CustomDosageRequest = 'CustomDosageRequest',
}

export enum StatusTagAction {
    INSERT = 'Insert',
    DELETE = 'Delete',
    REPLACE = 'Replace',
}

export enum StatusTagNotes {
    RenewalReview = 'New renewal order to review',
    FinalReview = 'Final review before subscription renews',
    ReviewNoPrescribe = 'Check-in review during quarterly subscription',
    RNAwaitingResponse = 'RN is awaiting response from patient',
    None = 'Something unexpected occured. Please contact engineering.',
    Prescribe = 'Needs to be prescribed post approval',
    OverdueNoPrescribe = 'System update from Overdue to OverdueNoPrescribe',
    CanceledResolved = 'Automatically set to resolved after cancelled subscription',
    Engineer = 'Something went wrong. Forwarding to engineering.',
    ProviderMessage = 'Patient has replied to the question by provider',
    RegisteredNurseMessage = 'Patient has replied to the question by registered nurse',
    StripeRefundError = 'There was an error issuing a refund to the customer',
    AutomaticSendScriptError = "There was an error automatically sending this order's script",
    SendScriptError = 'There was an error sending this script to the pharmacy',
    ResolvedAfterSendingDosageSuggestion = 'Resolved after sending dosage suggestion successfully.',
    LeadProviderAwaitingResponse = 'Lead Provider Awaiting Response from Patient',
    AutomaticResolved = 'Resolved automatically by system',
    ResolvedInvoicePaid = 'Resolved automatically by system after invoice paid event',
}

export enum EngineeringQueueNotes {
    SafeGuardMessage = '48 hour safeguard activated - did not process invoice paid event',
    InvalidLatestRenewalOrderState = 'Invalid latest renewal order state on invoice paid event',
    LastPriceIdNotFound = 'Last Price ID not found for subscription - invoice paid event',
    CurrentPriceIdNotFound = 'Current Price ID not found for subscription - invoice paid event',
    PriceDataNotFound = 'Price data not found - invoice paid event',
    PatientDataNotFound = 'Patient data not found - invoice paid event',
    InvalidMatch = 'Mismatch between what they paid for and what our system says the should receive - invoice paid event',
    QuarterlySubscriptionUnprescribed = 'Unknown case - quarterly subscription unprescribed - invoice paid',
    RetryExpired = 'Exceeded retry count - Job Scheduler',
    QuarterlyIncompleteCadencyMismatch = 'Error: User got re-billed for bundle product after not completing any check in forms',
}
