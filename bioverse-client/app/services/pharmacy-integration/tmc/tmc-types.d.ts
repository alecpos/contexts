interface TMCPrescriptionForm {
    prescriptions: {
        physician_npi: string;
        shipping_method: string;
        shipping_address: TMCShippingAddress;
        patient: TMCPatient;
        prescription_items: TMCPrescriptionItem[];
    }[];
}

interface TMCShippingAddress {
    shipping_city: string;
    shipping_postal_code: string;
    shipping_state: string;
    shipping_street?: string;
    shipping_address_line2?: string;
    shipping_country: string;
}

interface TMCPatient {
    first_name: string;
    last_name: string;
    dob: string;
    gender: string;
    email: string;
    phone: string;
    ssn?: string;
    allergies: string;
}

interface TMCPrescriptionItem {
    Id: string;
    Quantity: string;
    NoOfOriginalRefills: string;
    NoOfRefillRemaining: string;
    Sig: string;
    Reason_for_Compounding?: string;
}
