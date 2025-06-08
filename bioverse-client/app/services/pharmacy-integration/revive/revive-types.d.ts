interface ReviveScriptJSON {
    medication_requests: ReviveMedicationObject[];
    patient: RevivePatientObject;
    clinic_identifier: string;
    practitioner_identifier: string;
    medication_order_identifier: string;
}

interface ReviveMedicationObject {
    control_level: number;
    date_issued: string; // ISO 8601 format
    dose: string;
    medication: string;
    medication_description: string;
    medication_order_entry_identifier: string;
    note: string;
    quantity: number;
    quantity_authorized: number;
    days_supply: number;
    reason_for_compounding?: {
        code: string; // Changed to string type
        description: string;
        context: string;
    };
    product_identification: {
        product_identifier: string;
    };
    refills_authorized: string; // Changed to string type
    sig: string;
    substitutions: number;
    unit_of_measure: string; // NCPDP unit of measure
}

interface RevivePatientObject {
    identification: {
        patient_id: number;
    };
    name: {
        last_name: string;
        first_name: string;
        Suffix: string | null;
    };
    gender: 'M' | 'F'; // Using union type for better type safety
    DOB: string; // Format: "YYYY-MM-DD"
    species: 'human';
    address: {
        line_1: string;
        line_2: string | null;
        city: string;
        state: string;
        postal_code: string;
    };
    email: string;
    phone_primary: number;
}

interface ScriptOverrideObject {
    product_href: string;
    variant_index: number;
}

interface ReviveOrderStatusPayload {
    clinic_identifier: string;
    drug_description: string;
    electronic_prescription_message_id: string;
    electronic_prescription_order_number: string;
    electronic_prescription_prescriber_order_number: string;
    event: string;
    event_data: {
        address: string;
        address_id: number;
        address_line_2: string;
        api_version: string;
        carrier: string;
        city: string;
        contents: any[];
        cost: string;
        country: string;
        date_carrier_received: string;
        date_shipped: string;
        id: number;
        identifier: string;
        in_care_of: string;
        name: string;
        patient_id: number;
        postal_code: string;
        scan_id: number;
        scan_original: string;
        service_type: string;
        shipment_id: number;
        shipment_transaction_id: number;
        shipping_system_id: string;
        state: string;
        status: string;
        tracking_id: string;
        voided: number;
    };
    event_log: any[];
    medication_order_status: {
        description: string;
        workflow_status: string;
    };
    medication_order_workflow_status: string;
    order_bill_to_organization: null;
    order_id: null;
    order_organization_identifier: null;
    patient_id: number;
    practitioner_identifier: string;
    prescriber_id: number;
    prescription_entry_identifier: string;
    product_id: number;
    rx_number: number;
    tracking_id: string;
    transaction_id: null;
}
