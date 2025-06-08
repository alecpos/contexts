interface BoothwynScriptJSON {
    caseId: string;
    orderType: number;
    shippingMethod: number;
    program?: string;
    patient: {
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber: string;
        dateOfBirth: string;
        gender: string;
        address: {
            address1: string;
            address2?: string;
            city: string;
            state: string;
            zipCode: string;
        };
    };
    clinician: {
        fullName: string;
        licenses: {
            type: string;
            value: string;
        }[];
    };
    prescriptions: {
        sku: string | number;
        amount: number;
        unit: string;
        daysSupply: number;
        notes: string;
        instructions: string;
    }[];
}

interface ScriptOverrideObject {
    product_href: string;
    variant_index: number;
}

interface BoothwynScriptPayload {
    script_json: BoothwynScriptJSON | null;
    error: string | null;
}

interface BoothwynOrderStatusPayload {
    caseId: string;
    meds: string;
    patientEmail: string;
    rxStatus: string;
    rxStatusDateTime: string;
    trackingNumber: string;
    rxNumbers: number[];
}
