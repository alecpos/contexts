interface CurexaOrder {
    order_id: string; // Required, Maximum length 100
    patient_id: string; // Required, Maximum length 100
    patient_first_name: string; // Required, Maximum Length 50
    patient_last_name: string; // Required, Maximum Length 50
    patient_dob: string; // Required, yyyymmdd format, Maximum Length 8
    patient_gender?: string; // Optional, male female, Maximum Length 10
    carrier?: string; // Optional, UPS USPS FEDEX, Maximum Length 50
    shipping_method?: string; // Optional, usps_priority usps_first usps_priority_express fedex_ground fedex_standard_overnight fedex_priority_overnight | Defaults to usps_first, Maximum Length 50
    insurance_provider?: string; // Optional, FEDEX UPS ONTRAC SHIPPO, Maximum Length 10
    insurance_amount?: number; // Required if insurance_provider populated
    insurance_contents?: string; // Required if insurance_provider populated, Maximum Length 50
    address_to_name: string; // Required, Maximum Length 255
    address_to_street1: string; // Required, Maximum Length 255
    address_to_street2?: string; // Optional, Maximum Length 255
    address_to_city: string; // Required, Maximum Length 255
    address_to_state: string; // Required, Maximum Length 2
    address_to_zip: string; // Required, Can contain +4, Maximum Length 20
    address_to_country: string; // Required, Maximum Length 2
    address_to_phone: string; // Required, Maximum Length 28
    patient_known_allergies: string; // Required, Each allergy comma delimited, Maximum Length 255
    patient_other_medications: string; // Required, Each medication comma delimited, Maximum Length 255
    pref_language?: string;
    rx_items?: CurexaRxItem[];
    otc_items?: CurexaOTCItem[];
}

interface CurexaRxItem {
    rx_id?: string; // Optional, Maximum length 200
    medication_name: string; // Required, Maximum length 255
    quantity_dispensed: number; // Required, number of pills requested
    days_supply: number; // Required
    prescribing_doctor: string; // Required, Maximum length 255
    medication_sig: string; // Required, Maximum length 255
    non_child_resistant_acknowledgment: string; // Required, true false
    is_refill?: string; // Optional, true false
    treatment_type?: string; // Optional, Maximum length 50
    compound_base?: string; // Optional, Maximum length 50
    pref_packaging?: string; // Optional, Maximum length 50
    is_replacement?: string; // Optional, true false
    replaced_order_id?: string; // Optional, Maximum length 100
    replacement_reason?: string; // Optional, Maximum length 255
    replacement_responsible_party?: number; // Optional, 1. Lost/Stolen – Equal, 2. Consistency Complaint – Curexa, 3. Damaged Pump – Curexa, 4. Wrong Address – Partner
}

interface CurexaOTCItem {
    name: string; // Required, Maximum length 255
    quantity: number; // Required
    is_replacement?: string; // Optional, true false
    replaced_order_id?: string; // Optional, Maximum length 50
    replacement_reason?: string; // Optional, Maximum length 255
    replacement_responsible_party?: number; // Optional, 1. Lost/Stolen – Equal, 2. Consistency Complaint – Curexa, 3. Damaged Pump – Curexa, 4. Wrong Address – Partner
    weight?: Weight[]; // Optional, Array of Weight objects
}

interface Weight {
    value: number;
    unit: string;
}

interface CurexaOrderResponse {
    order_id: string; // The order_id that was originally sent
    rx_item_count: number; // The number of rx_items received
    otc_item_count: number; // The number of otc_items received
    status: string; // Result of the request. success failure
    message: string; // A detailed message about the request
}
