interface HallandaleScriptJSON {
    message?: HallandaleMessageObject;
    order: HallandaleOrderObject;
}

interface HallandaleMessageObject {
    id: number;
    sentTime?: string;
}

interface HallandaleOrderObject {
    general?: {
        memo?: string;
        referenceId?: string;
        statusId?: string;
    };
    document?: {
        pdfBase64: string;
    };
    prescriber: {
        npi: string;
        licenseState?: string;
        licenseNumber?: string;
        dea?: string;
        lastName: string;
        firstName?: string;
        middleName?: string;
        address1?: string;
        address2?: string;
        city?: string;
        state?: string;
        zip?: string;
        phone?: string;
        fax?: string;
        email?: string;
    };
    practice: {
        id: number;
    };
    patient: {
        lastName: string;
        firstName: string;
        middleName?: string;
        gender: 'm' | 'f' | 'a' | 'u';
        dateOfBirth: string;
        address1?: string;
        address2?: string;
        address3?: string;
        city?: string;
        state?: string;
        zip?: string;
        country?: string;
        phoneHome?: string;
        phoneWork?: string;
        email?: string;
    };
    shipping: {
        recipientType?: 'clinic' | 'patient';
        recipientLastName?: string;
        recipientFirstName?: string;
        recipientPhone?: string;
        recipientEmail?: string;
        addressLine1?: string;
        addressLine2?: string;
        addressLine3?: string;
        city?: string;
        state?: string;
        zipCode?: string;
        country?: string;
        service?: number;
    };
    billing?: {
        payorType: 'pat' | 'doc';
    };
    rxs: HallandaleNewRxObject[];
}

interface HallandaleNewRxObject {
    rxType?: string;
    rxNumber?: number;
    drugName: string;
    drugStrength?: string;
    drugForm?: string;
    lfProductID?: number;
    foreignPmsId?: number;
    foreignRxNumber?: string;
    quantity?: number;
    quantityUnits?: number;
    directions?: string;
    refills?: number;
    dateWritten?: string; //yyyy-mm-dd
    daysSupply?: number;
    scheduleCode?: '2' | '3' | '4' | '5' | 'L' | '0';
    internalSigDisplay?: string[];
}

interface HallandaleItemListObject {
    product_form: string;
    product_strength: string;
    product_name: string;
    product_code: number;
    bioverse_product_name: string;
    sig: string;
    quantity: number;
}

interface HallandaleStatusPayload {
    pharmacyLocation: string;
    fillId: string;
    rxNumber: string;
    foreignRxNumber: string;
    orderId: string;
    referenceId: string;
    practiceId: string;
    providerId: string;
    patientId: string;
    lfdrugId: string;
    rxStatus: string;
    rxStatusDateTime: string;
    deliveryService: string;
    service: string;
    carrier: string;
    trackingNumber: string | null;
    shipAddressLine1: string;
    shipAddressLine2: string | null;
    shipAddressLine3: string | null;
    shipCity: string;
    shipState: string;
    shipZip: string;
    shipCountry: string;
}

interface HallandaleItemCatalogCodes {
    [key: string]: {
        product_code: number;
        product_name: string;
        product_strength: string;
        product_form: string;
        bioverseProductName: string;
    };
}

interface HallandaleScriptInstruction {
    catalogItemCode: string;
    sigText: string;
    internalSigText: string;
    internalDisplaySigText?: string[];
    quantity: number;
    daysSupply: number;
}

interface HallandaleVariantSigData {
    selectDisplayName: string;
    array: HallandaleScriptInstruction[];
}
