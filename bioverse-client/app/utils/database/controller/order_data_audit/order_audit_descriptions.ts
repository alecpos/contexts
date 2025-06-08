export enum OrderDataAuditDescription {
    QuarterlyConversion = 'Converting Quarterly Subscription to Monthly Subscription upon renewal.',
    BundleConversion = 'Converting Quarterly Subscription to Monthly Subscription upon renewal.',
    DosageSelection = 'Patient Dosage Selection Completed - Changing Stripe Data.',
    CoordinatorDosageSelection = 'Patient Dosage Selection manually completed by coordinator.',
    CoordinatorManualCreateOrder = 'Manual order created by coordinator.',
    PrescriptionSent = 'Prescription was sent to pharmacy.',
    DuplicateScriptBlocked = 'Duplicate script to pharmacy prevented.',
}

export enum OrderDataAuditActions {
    QuarterlyConversion = 'quarterly_conversion_renewal',
    BundleConversion = 'bundle_conversion_renewal',
    DosageSelection = 'dosage_selection',
    CoordinatorDosageSelection = 'coordinator_dosage_selection',
    CoordinatorManualCreateOrder = 'coordinator_manual_create_order',
    PrescriptionSent = 'prescription_sent',
    DuplicateScriptBlocked = 'duplicate_script_blocked',
    SecondAnnualShipmentSent = 'second_annual_shipment_sent',
    ResendPrescription = 'resend_prescription',
    RenewalValidation = 'renewal_validation',
    SecondSplitShipmentScriptSent = 'second_split_shipment_script_sent',
}
