export enum FlowType {
    PRESCRIPTIONS = 'prescriptions',
    SUPPLEMENTS = 'supplements',
    TEST_KITS = 'test-kits',
    CONSULTING = 'consulting',
}

export enum ProductType {
    CONSULTATION = 'consultation',
    CREAM = 'cream',
    INJECTION = 'injection',
    PATCH = 'patch',
    PILL = 'pill',
    POWDER = 'powder',
    SPRAY = 'spray',
    TEST_KIT = 'test-kit',
}

export enum Roles {
    CUSTOMER = 'customer',
    DEVELOPER = 'developer',
    ADMINISTRATOR = 'administrator',
    PROVIDER = 'provider',
    CUSTOMER_SERVICE = 'customer_service',
    COORDINATOR = 'coordinator',
    REGISTERED_NURSE = 'registered_nurse',
}

export enum IntakeState {
    NOT_STARTED = 'not_started',
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed',
}

export enum OrderStatus {
    UNAPPROVED_NO_CARD = 'Unapproved-NoCard',
    UNAPPROVED_CARD_DOWN = 'Unapproved-CardDown',
    APPROVED_NO_CARD = 'Approved-NoCard',
    APPROVED_CARD_DOWN = 'Approved-CardDown',
    PAYMENT_COMPLETED = 'Payment-Completed',
    PAYMENT_DECLINED = 'Payment-Declined',
    DENIED_NO_CARD = 'Denied-NoCard',
    DENIED_CARD_DOWN = 'Denied-CardDown',
    CANCELED = 'Canceled',
    INCOMPLETE = 'Incomplete',
    PENDING_CUSTOMER_RESPONSE = 'Pending-Customer-Response',
    APPROVED_NO_CARD_FINALIZED = 'Approved-NoCard-Finalized',
    APPROVED_CARD_DOWN_FINALIZED = 'Approved-CardDown-Finalized',
    ORDER_PROCESSING = 'Order-Processing',
    ADMINISTRATIVE_CANCEL = 'Administrative-Cancel',
    ERROR_IN_SEND = 'Error-In-Send',
    R_CARD_DOWN_INCOMPLETE = 'R-CardDown-Incomplete',
    R_UNAPPROVED_CARD_DOWN = 'R-Unapproved-CardDown',
    R_APPROVED_CARD_DOWN = 'R-Approved-CardDown',
    R_CHECKUP_COMPLETE_PENDING_CANCELATION = 'R-CheckupComplete-Pending-Cancelation',
    ALTERNATIVE_CONFIRMED = 'Alternative-Confirmed',
    PENDING_GLP1_CONFIRMATION = 'Pending-GLP1-Confirmation',
    VOIDED = 'Voided',
}

export enum SubscriptionCadency {
    ONE_TIME = 'one_time',
    MONTHLY = 'monthly',
    QUARTERLY = 'quarterly',
    BIMONTHLY = 'bimonthly',
    PENTAMONTHLY = 'pentamonthly',
    BIANNUALLY = 'biannually',
    ANNUALLY = 'annually',
}

export enum Environment {
    DEV = 'dev',
    PROD = 'prod',
}

export enum SubscriptionActionItems {
    DOSAGE_UPDATE = 'dosage_update',
    RENEWAL = 'renewal',
}

export enum QuestionnaireType {
    INTAKE = 'intake',
    CHECK_UP = 'check_up',
    CANCEL = 'cancel',
    REFILL = 'refill',
    REACTIVATION = 'reactivation',
}

export enum RenewalOrderStatus {
    INCOMPLETE = 'Incomplete',
    CHECKUP_COMPLETE_PROVIDER_UNAPPROVED_UNPAID = 'CheckupComplete-ProviderUnapproved-Unpaid',
    CHECKUP_COMPLETE_PROVIDER_APPROVED_UNPAID = 'CheckupComplete-ProviderApproved-Unpaid',
    PHARMACY_PROCESSING = 'PharmacyProcessing',
    CHECKUP_INCOMPLETE_PROVIDER_UNAPPROVED_PAID = 'CheckupIncomplete-ProviderUnapproved-Paid',
    CHECKUP_COMPLETE_PROVIDER_APPROVED_UNPAID_1 = 'CheckupComplete-ProviderApproved-Unpaid-1',
    CHECKUP_COMPLETE_PROVIDER_UNAPPROVED_UNPAID_1 = 'CheckupComplete-ProviderUnapproved-Unpaid-1',
    CHECKUP_INCOMPLETE_PROVIDER_UNAPPROVED_PAID_1 = 'CheckupIncomplete-ProviderUnapproved-Paid-1',
    CHECKUP_INCOMPLETE_PROVIDER_UNAPPROVED_PAID_2 = 'CheckupIncomplete-ProviderUnapproved-Paid-2',
    CHECKUP_COMPLETE_PROVIDER_APPROVED_UNPAID_2 = 'CheckupComplete-ProviderApproved-Unpaid-2',
    CHECKUP_COMPLETE_PROVIDER_UNAPPROVED_UNPAID_2 = 'CheckupComplete-ProviderUnapproved-Unpaid-2',
    CHECKUP_INCOMPLETE_PROVIDER_UNAPPROVED_UNPAID = 'CheckupIncomplete-ProviderUnapproved-Unpaid',
    CHECKUP_INCOMPLETE_PROVIDER_UNAPPROVED_UNPAID_1 = 'CheckupIncomplete-ProviderUnapproved-Unpaid-1',
    CANCELED = 'Canceled',
    CHECKUP_INCOMPLETE_PROVIDER_UNAPPROVED_UNPAID_2 = 'CheckupIncomplete-ProviderUnapproved-Unpaid-2',
    CHECKUP_COMPLETE_PROVIDER_APPROVED_PAID = 'CheckupComplete-ProviderApproved-Paid',
    CHECKUP_WAIVED_PROVIDER_UNAPPROVED_PAID = 'CheckupWaived-ProviderUnapproved-Paid',
    CHECKUP_WAIVED_PROVIDER_UNAPPROVED_UNPAID = 'CheckupWaived-ProviderUnapproved-Unpaid',
    CHECKUP_WAIVED_PROVIDER_APPROVED_UNPAID = 'CheckupWaived-ProviderApproved-Unpaid',
    CHECKUP_COMPLETE_PROVIDER_UNAPPROVED_PAID = 'CheckupComplete-ProviderUnapproved-Paid',
    CHECKUP_COMPLETE_PROVIDER_APPROVED_PRESCRIBED_UNPAID = 'CheckupComplete-ProviderApproved-Prescribed-Unpaid',
    CHECKUP_COMPLETE_PROVIDER_APPROVED_UNPRESCRIBED_UNPAID = 'CheckupComplete-ProviderApproved-Unprescribed-Unpaid',
    CHECKUP_COMPLETE_PROVIDER_APPROVED_UNPRESCRIBED_PAID = 'CheckupComplete-ProviderApproved-Unprescribed-Paid',
    CHECKUP_COMPLETE_PROVIDER_APPROVED_PRESCRIBED_UNPAID_1 = 'CheckupComplete-ProviderApproved-Prescribed-Unpaid-1',
    CHECKUP_COMPLETE_PROVIDER_APPROVED_PRESCRIBED_UNPAID_2 = 'CheckupComplete-ProviderApproved-Prescribed-Unpaid-2',
    CHECKUP_COMPLETE_PROVIDER_APPROVED_UNPRESCRIBED_UNPAID_1 = 'CheckupComplete-ProviderApproved-Unprescribed-Unpaid-1',
    UNKNOWN = 'Unknown',
    DENIED_UNPAID = 'Denied-Unpaid',
    DENIED_PAID = 'Denied-Paid',
    CHECKUP_COMPLETE_PROVIDER_APPROVED_PRESCRIBED_PAID = 'CheckupComplete-ProviderApproved-Prescribed-Paid',
    CHECKUP_COMPLETE_PROVIDER_APPROVED_UNPRESCRIBED_UNPAID_2 = 'CheckupComplete-ProviderApproved-Unprescribed-Unpaid-2',
    ADMINISTRATIVE_CANCELED = 'Administrative-Canceled',
    SCHEDULED_CANCEL = 'Scheduled-Cancel',
    SCHEDULED_ADMIN_CANCEL = 'Scheduled-Admin-Cancel',
    VOIDED = 'Voided',
    R_CARD_DOWN_INCOMPLETE = 'R-CardDown-Incomplete',
    R_UNAPPROVED_CARD_DOWN = 'R-Unapproved-CardDown',
    R_APPROVED_CARD_DOWN = 'R-Approved-CardDown',
    R_CHECKUP_COMPLETE_PENDING_CANCELATION = 'R-CheckupComplete-Pending-Cancelation',
    CHECKUP_COMPLETE_UNPRESCRIBED_UNPAID = 'CheckupComplete-Unprescribed-Unpaid',
    CHECKUP_COMPLETE_UNPRESCRIBED_PAID = 'CheckupComplete-Unprescribed-Paid',
    CHECKUP_COMPLETE_PRESCRIBED_UNPAID = 'CheckupComplete-Prescribed-Unpaid',
    CHECKUP_COMPLETE_PRESCRIBED_UNPAID_1 = 'CheckupComplete-Prescribed-Unpaid-1',
    CHECKUP_COMPLETE_PRESCRIBED_UNPAID_2 = 'CheckupComplete-Prescribed-Unpaid-2',
    CHECKUP_COMPLETE_UNPRESCRIBED_UNPAID_1 = 'CheckupComplete-Unprescribed-Unpaid-1',
    CHECKUP_COMPLETE_UNPRESCRIBED_UNPAID_2 = 'CheckupComplete-Unprescribed-Unpaid-2',
    CHECKUP_INCOMPLETE_UNPRESCRIBED_PAID = 'CheckupIncomplete-Unprescribed-Paid',
    CHECKUP_INCOMPLETE_UNPRESCRIBED_PAID_1 = 'CheckupIncomplete-Unprescribed-Paid-1',
    CHECKUP_WAIVED_UNPRESCRIBED_UNPAID = 'CheckupWaived-Unprescribed-Unpaid',
    CHECKUP_WAIVED_UNPRESCRIBED_PAID = 'CheckupWaived-Unprescribed-Paid',
    CHECKUP_INCOMPLETE_UNPRESCRIBED_UNPAID = 'CheckupIncomplete-Unprescribed-Unpaid',
    CHECKUP_INCOMPLETE_UNPRESCRIBED_UNPAID_1 = 'CheckupIncomplete-Unprescribed-Unpaid-1',
    CHECKUP_INCOMPLETE_UNPRESCRIBED_PAID_2 = 'CheckupIncomplete-Unprescribed-Paid-2',
    CHECKUP_COMPLETE_PRESCRIBED_PAID = 'CheckupComplete-Prescribed-Paid',
}

export enum StripeAuditCategories {
    REFUND = 'refund',
    RECHARGE = 'recharge',
}

export enum ClinicalNoteType {
    NOTE = 'note',
    PATIENT_DATA = 'patient_data',
}

export enum MacroCategory {
    SHIPPING = 'Shipping',
    BILLING = 'Billing',
    PRESCRIPTION = 'Prescription',
    ORDERS = 'Orders',
    SUBSCRIPTION = 'Subscription',
    FIRST_PRESCRIPTION = 'First-prescription',
    PRICING = 'Pricing',
    REFILL = 'Refill',
    BUG = 'Bug',
    ESCALATION = 'Escalation',
    CLINICAL = 'Clinical',
    MISSING_ID = 'Missing-ID',
    CHECK_IN = 'Check-In',
}

export enum ThreadEscalationState {
    NORMAL = 'normal',
    COORDINATOR_REQUIRED = 'coordinator-required',
    PROVIDER_REQUIRED = 'provider-required',
    ADMIN_REQUIRED = 'admin-required',
}

export enum StaffRoles {
    COORDINATOR = 'coordinator',
    PROVIDER = 'provider',
    DEVELOPER = 'developer',
    LEAD_COORDINATOR = 'lead-coordinator',
    ADMIN = 'admin',
    TEST = 'test',
    LEAD_PROVIDER = 'lead-provider',
    REGISTERED_NURSE = 'registered-nurse',
}

export enum ClinicalNotePatientDataType {
    ALLERGY = 'allergy',
    MEDICATION = 'medication',
    BMI = 'bmi',
    TEMPLATE = 'template',
}

export enum MixpanelEventType {
    LEAD = 'Lead',
    SIGNUP_VIEWED = 'signup-viewed',
    PROFILE_INTAKE_COMPLETED = 'profile-intake-completed',
    INTAKE_COMPLETED = 'intake-completed',
    ID_VERIFICATION_REACHED = 'id-verification-reached',
    ID_VERIFICATION_COMPLETED = 'id-verification-completed',
    ID_SKIPPED = 'id-skipped',
    SELFIE_REACHED = 'selfie-reached',
    SELFIE_COMPLETED = 'selfie-completed',
    SELFIE_SKIPPED = 'selfie-skipped',
    CHECKOUT_REACHED = 'checkout-reached',
    CHECKOUT_COMPLETED = 'checkout-completed',
    BUNDLE_SCREEN_VIEWED = 'bundle-screen-viewed',
    ALIAS_CREATED = 'alias-created',
    IDENTITY_CREATED = 'identity-created',
}

export enum ProfileStatusTag {
    REVIEW = 'Review',
    OVERDUE = 'Overdue',
    PROVIDER_AWAITING_RESPONSE = 'ProviderAwaitingResponse',
    AWAITING_RESPONSE = 'AwaitingResponse',
    ENGINEER = 'Engineer',
    ID_DOCS = 'ID/Docs',
    COORDINATOR = 'Coordinator',
    COORDINATOR_AWAITING_RESPONSE = 'CoordinatorAwaitingResponse',
    READ_PATIENT_MESSAGE = 'ReadPatientMessage',
    CUSTOMER_IO_FOLLOW_UP = 'CustomerIOFollowUp',
    CANCEL_ORDER_OR_SUBSCRIPTION = 'CancelOrderOrSubscription',
    N_E = 'N/E',
    FOLLOW_UP = 'FollowUp',
    RESOLVED = 'Resolved',
    FINAL_REVIEW = 'FinalReview',
    NONE = 'None',
    REVIEW_NO_PRESCRIBE = 'ReviewNoPrescribe',
    LEAD_PROVIDER = 'LeadProvider',
    OVERDUE_NO_PRESCRIBE = 'OverdueNoPrescribe',
    LEAD_COORDINATOR = 'LeadCoordinator',
    ID_VERIFICATION_CUSTOMER_IO_FOLLOW_UP = 'IDVerificationCustomerIOFollowUp',
    PROVIDER_MESSAGE = 'ProviderMessage',
    COORDINATOR_CREATE_ORDER = 'CoordinatorCreateOrder',
    PATIENT_MEDICAL_QUESTION = 'PatientMedicalQuestion',
    DOCTOR_LETTER_REQUIRED = 'DoctorLetterRequired',
    REGISTERED_NURSE_MESSAGE = 'RegisteredNurseMessage',
    RN_AWAITING_RESPONSE = 'RNAwaitingResponse',
    LEAD_PROVIDER_AWAITING_RESPONSE = 'LeadProviderAwaitingResponse',
    URGENT_REQUIRES_PROVIDER = 'UrgentRequiresProvider',
    CUSTOM_DOSAGE_REQUEST = 'CustomDosageRequest',
    SUPPLEMENTARY_VIAL_REQUEST = 'SupplementaryVialRequest',
}

export enum PaymentFailureStatus {
    RETRYING = 'retrying',
    EXPIRED = 'expired',
    RESOLVED = 'resolved',
}

export enum OrderSource {
    INTAKE = 'intake',
    ADMIN = 'admin',
    CHECK_IN = 'check-in',
    REFILL = 'refill',
    REACTIVATION_TO_BUNDLE = 'reactivation-to-bundle',
    ALTERNATIVE = 'alternative',
    MANUAL_CREATE = 'manual_create',
}

export enum ProviderAuditActions {
    VIEW_INTAKE = 'view_intake',
    APPROVE_INTAKE = 'approve_intake',
    DENY_INTAKE = 'deny_intake',
    PRESCRIBE_INTAKE = 'prescribe_intake',
    MESSAGE_INTAKE = 'message_intake',
    TAG_INTAKE = 'tag_intake',
    START_SESSION = 'start_session',
    END_SESSION = 'end_session',
    LOGGED_IN = 'logged_in',
    LOGGED_OUT = 'logged_out',
    FIRST_TIME_DOSAGE_RECOMMENDATION = 'first_time_dosage_recommendation',
}

export enum DocumentType {
    BLOODWORK = 'Bloodwork',
    OTHER = 'Other',
}

export enum UsStates {
    ALABAMA = 'Alabama',
    ALASKA = 'Alaska',
    ARIZONA = 'Arizona',
    ARKANSAS = 'Arkansas',
    CALIFORNIA = 'California',
    COLORADO = 'Colorado',
    CONNECTICUT = 'Connecticut',
    DELAWARE = 'Delaware',
    FLORIDA = 'Florida',
    GEORGIA = 'Georgia',
    HAWAII = 'Hawaii',
    IDAHO = 'Idaho',
    ILLINOIS = 'Illinois',
    INDIANA = 'Indiana',
    IOWA = 'Iowa',
    KANSAS = 'Kansas',
    KENTUCKY = 'Kentucky',
    LOUISIANA = 'Louisiana',
    MAINE = 'Maine',
    MARYLAND = 'Maryland',
    MASSACHUSETTS = 'Massachusetts',
    MICHIGAN = 'Michigan',
    MINNESOTA = 'Minnesota',
    MISSISSIPPI = 'Mississippi',
    MISSOURI = 'Missouri',
    MONTANA = 'Montana',
    NEBRASKA = 'Nebraska',
    NEVADA = 'Nevada',
    NEW_HAMPSHIRE = 'New Hampshire',
    NEW_JERSEY = 'New Jersey',
    NEW_MEXICO = 'New Mexico',
    NEW_YORK = 'New York',
    NORTH_CAROLINA = 'North Carolina',
    NORTH_DAKOTA = 'North Dakota',
    OHIO = 'Ohio',
    OKLAHOMA = 'Oklahoma',
    OREGON = 'Oregon',
    PENNSYLVANIA = 'Pennsylvania',
    RHODE_ISLAND = 'Rhode Island',
    SOUTH_CAROLINA = 'South Carolina',
    SOUTH_DAKOTA = 'South Dakota',
    TENNESSEE = 'Tennessee',
    TEXAS = 'Texas',
    UTAH = 'Utah',
    VERMONT = 'Vermont',
    VIRGINIA = 'Virginia',
    WASHINGTON = 'Washington',
    WEST_VIRGINIA = 'West Virginia',
    WISCONSIN = 'Wisconsin',
    WYOMING = 'Wyoming',
}

export enum UsStatesTwoLetterCode {
    AL = 'AL',
    AK = 'AK',
    AZ = 'AZ',
    AR = 'AR',
    CA = 'CA',
    CO = 'CO',
    CT = 'CT',
    DE = 'DE',
    FL = 'FL',
    GA = 'GA',
    HI = 'HI',
    ID = 'ID',
    IL = 'IL',
    IN = 'IN',
    IA = 'IA',
    KS = 'KS',
    KY = 'KY',
    LA = 'LA',
    ME = 'ME',
    MD = 'MD',
    MA = 'MA',
    MI = 'MI',
    MN = 'MN',
    MS = 'MS',
    MO = 'MO',
    MT = 'MT',
    NE = 'NE',
    NV = 'NV',
    NH = 'NH',
    NJ = 'NJ',
    NM = 'NM',
    NY = 'NY',
    NC = 'NC',
    ND = 'ND',
    OH = 'OH',
    OK = 'OK',
    OR = 'OR',
    PA = 'PA',
    RI = 'RI',
    SC = 'SC',
    SD = 'SD',
    TN = 'TN',
    TX = 'TX',
    UT = 'UT',
    VT = 'VT',
    VA = 'VA',
    WA = 'WA',
    WV = 'WV',
    WI = 'WI',
    WY = 'WY',
}

export enum ActionType {
    CHECK_UP = 'check_up',
    DOSAGE_SELECTION = 'dosage_selection',
}

export enum EscalationType {
    CANCEL = 'cancel',
    ESCALATE = 'escalate',
    NEW_RX = 'new_rx',
    LATE_SHIPMENT = 'late_shipment',
}

export enum EscalationStatus {
    PENDING = 'pending',
    RESOLVED = 'resolved',
}

export enum ProviderTask {
    INTAKE = 'intake',
    MESSAGE = 'message',
    RENEWAL = 'renewal',
}

export enum Pharmacy {
    HALLANDALE = 'hallandale',
    EMPOWER = 'empower',
    TMC = 'tmc',
    CUREXA = 'curexa',
    GGM = 'ggm',
    BOOTHWYN = 'boothwyn',
    REVIVE = 'revive',
}

export enum LabWorkType {
    BLOODWORK = 'bloodwork',
    DOCTOR_LETTER = 'doctor_letter',
}

export enum AdminControlVariable {
    PROVIDER_DASHBOARD = 'provider_dashboard',
}

export enum JobTypes {
    SEND_PRESCRIPTION_SCRIPT = 'send_prescription_script',
    SEND_RENEWAL_AUTOSHIP = 'send_renewal_autoship',
    STRIPE_INVOICE_PAID = 'stripe_invoice_paid',
    ID_SELFIE_CHECK_POST_CHECKOUT = 'id_selfie_check_post_checkout',
    MONTHLY_CHECKIN_CUSTOMERIO = 'monthly_checkin_customerio',
    QUARTERLY_CHECKIN_CUSTOMERIO = 'quarterly_checkin_customerio',
    BIANNUALLY_CHECKIN_CUSTOMERIO = 'biannually_checkin_customerio',
    ANNUALLY_CHECKIN_CUSTOMERIO = 'annually_checkin_customerio',
    RENEWAL_VALIDATION = 'renewal_validation',
}

export enum JobsStatus {
    ACTIVE = 'active',
    EXPIRED = 'expired',
    PAUSED = 'paused',
    COMPLETED = 'completed',
}

export enum Status {
    SUCCESS = 'success',
    FAILURE = 'failure',
}

export enum CoordinatorAuditActions {
    VIEW_THREAD = 'view_thread',
    MESSAGE_THREAD = 'message_thread',
    TAG_ORDER = 'tag_order',
}

export enum RenewalOrderSource {
    AUTOMATIC = 'automatic',
    MANUAL = 'manual',
    MANUAL_CREATE = 'manual_create',
}

export enum SiteErrorIdentifier {
    INTAKE_MESSAGE_FAILURE = 'INTAKE_MESSAGE_FAILURE',
    UPDATE_STRIPE_PRODUCT_FAILURE = 'UPDATE_STRIPE_PRODUCT_FAILURE',
}

export enum CustomOrderStatus {
    PHARMACY_PROCESSING = 'PharmacyProcessing',
    SHIPPED = 'Shipped',
    DELIVERED = 'Delivered',
}

export enum AnnualTrackingStatus {
    ACTIVE = 'active',
    CANCELED = 'canceled',
    ON_HOLD = 'on_hold',
    COMPLETE = 'complete',
}
