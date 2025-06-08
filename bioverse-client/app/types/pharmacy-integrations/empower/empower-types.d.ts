// const sample = {
//     clientOrderId: '1234',
//     poNumber: '1234',
//     deliveryService: 'UPS Priority 2-Day',
//     allowOverrideDeliveryService: true,
//     allowOverrideEssentialCopyGuidance: false,
//     prescriptionImageBase64: null,
//     prescriptionPdfBase64: null,
//     lfPracticeId: 971952,
//     newRxs: [
//         {
//             patient: {
//                 clientPatientId: null,
//                 lastName: 'Tran',
//                 firstName: 'Joe',
//                 gender: 0,
//                 dateOfBirth: '1989-04-15T00:00:00',
//                 address: {
//                     addressLine1: '5687 Peachtree',
//                     addressLine2: null,
//                     city: 'UPPER MARLBORO',
//                     stateProvince: 'MD',
//                     postalCode: '20772',
//                     countryCode: 'US',
//                 },
//                 phoneNumber: '7036266126',
//                 email: null,
//             },
//             prescriber: {
//                 npi: '1689995771',
//                 stateLicenseNumber: '279563',
//                 deaNumber: null,
//                 lastName: 'Echeverry',
//                 firstName: 'German',
//                 address: {
//                     addressLine1: '550 West 54th Street',
//                     addressLine2: null,
//                     city: 'New York',
//                     stateProvince: 'NY',
//                     postalCode: '10019',
//                     countryCode: 'US',
//                 },
//                 phoneNumber: '1234567890',
//             },
//             medication: {
//                 itemDesignatorId: 'CFD8712D2EF9495087967973E5CCDEE9',
//                 clientPrescriptionId: null,
//                 essentialCopy: null,
//                 drugDescription:
//                     'SEMAGLUTIDE / CYANOCOBALAMIN INJECTION (2.5 ML)',
//                 quantity: '1',
//                 refills: '0',
//                 daysSupply: '3',
//                 writtenDate: '2024-02-19T00:00:00',
//                 diagnosis: {
//                     clinicalInformationQualifier: 0,
//                     primary: {
//                         code: 'Sample',
//                         qualifier: 0,
//                         description: 'Sample description.',
//                         dateOfLastOfficeVisit: {
//                             date: null,
//                             dateTime: '2024-02-19T00:00:00',
//                         },
//                     },
//                 },
//                 note: 'Sample for note value.',
//                 sigText: 'Sample for sigtext value.',
//             },
//         },
//         {
//             patient: {
//                 clientPatientId: null,
//                 lastName: 'Tran',
//                 firstName: 'Joe',
//                 gender: 0,
//                 dateOfBirth: '1989-04-15T00:00:00',
//                 address: {
//                     addressLine1: '5687 Peachtree',
//                     addressLine2: null,
//                     city: 'UPPER MARLBORO',
//                     stateProvince: 'MD',
//                     postalCode: '20772',
//                     countryCode: 'US',
//                 },
//                 phoneNumber: '7036266126',
//                 email: null,
//             },
//             prescriber: {
//                 npi: '1689995771',
//                 stateLicenseNumber: '279563',
//                 deaNumber: null,
//                 lastName: 'Echeverry',
//                 firstName: 'German',
//                 address: {
//                     addressLine1: '550 West 54th Street',
//                     addressLine2: null,
//                     city: 'New York',
//                     stateProvince: 'NY',
//                     postalCode: '10019',
//                     countryCode: 'US',
//                 },
//                 phoneNumber: '1234567890',
//             },
//             medication: {
//                 itemDesignatorId: 'D47C68C8F762F8DA97DEF2FFB11933D2',
//                 clientPrescriptionId: null,
//                 essentialCopy: null,
//                 drugDescription: 'SYRINGE 30G 1/2" 0.5CC (EASY TOUCH)',
//                 quantity: '30',
//                 refills: '0',
//                 daysSupply: '3',
//                 writtenDate: '2024-02-19T00:00:00',
//                 diagnosis: {
//                     clinicalInformationQualifier: 0,
//                     primary: {
//                         code: 'Sample',
//                         qualifier: 0,
//                         description: 'Sample description.',
//                         dateOfLastOfficeVisit: {
//                             date: null,
//                             dateTime: '2024-02-19T00:00:00',
//                         },
//                     },
//                 },
//                 note: 'Sample for note value.',
//                 sigText: 'Sample for sigtext value.',
//             },
//         },
//     ],
//     referenceFields: null,
// };

interface EmpowerPrescriptionOrder {
    clientOrderId: string;
    poNumber: string;
    deliveryService: string;
    allowOverrideDeliveryService: boolean;
    allowOverrideEssentialCopyGuidance: boolean;
    prescriptionImageBase64?: string;
    prescriptionPdfBase64?: string;
    lfPracticeId: number;
    newRxs: EmpowerNewRx[];
    referenceFields?: any; // Adjust the type according to what referenceFields can contain
}

interface EmpowerGeneratedScript {
    script: EmpowerPrescriptionOrder;
    sigs: string[];
    displayName: string;
}

interface EmpowerNewRx {
    patient: EmpowerPatient;
    prescriber: EmpowerPrescriber;
    medication: EmpowerMedication;
}

interface EmpowerPatient {
    clientPatientId?: string;
    lastName: string;
    firstName: string;
    gender: number | string;
    dateOfBirth: string;
    address: EmpowerAddress;
    phoneNumber: string;
    email?: string;
}

interface EmpowerPrescriber {
    npi: string;
    stateLicenseNumber: string;
    deaNumber?: string;
    lastName: string;
    firstName: string;
    address: EmpowerAddress;
    phoneNumber: string;
}

interface EmpowerMedication {
    itemDesignatorId: string;
    clientPrescriptionId?: string;
    essentialCopy?: any; // Adjust the type according to what essentialCopy can contain
    drugDescription: string;
    quantity: string;
    refills: string;
    daysSupply: string;
    writtenDate: string;
    diagnosis: EmpowerDiagnosis;
    note: string;
    sigText: string;
}

interface EmpowerAddress {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    stateProvince: string;
    postalCode: string;
    countryCode: string;
}

interface EmpowerDiagnosis {
    clinicalInformationQualifier: number;
    primary: {
        code: string;
        qualifier: number;
        description: string;
    };
}

interface EmpowerStatusPayload {
    salesForceClinicAccountId: string;
    lifeFile_Practice_ID__c: number;
    lfProviderId: null | string; // Assuming it can be a string or null
    eipOrderId: string;
    lfOrderId: null | string; // Assuming it can be a string or null
    lfReferenceId: null | string; // Assuming it can be a string or null
    clientOrderId: string;
    clientPatientId: null | string; // Assuming it can be a string or null
    messageId: string;
    canonicalOrderId: number;
    salesForceOrderId: null | string; // Assuming it can be a string or null
    reference1: null | string; // Assuming it can be a string or null
    reference2: null | string; // Assuming it can be a string or null
    reference3: null | string; // Assuming it can be a string or null
    reference4: null | string; // Assuming it can be a string or null
    reference5: null | string; // Assuming it can be a string or null
    orderStatus: 'Received' | 'Processing' | 'Complete';
    error: null | string; // Assuming it can be a string or null
    prescriptionPdfBase64: null | string; // Assuming it can be a string or null
    orderStatusLastUpdatedTime: null | string; // Assuming it can be a string or null
    orderLines: any[]; // Assuming it can be an array of any type
    shipmentLines: ShipmentLine[];
}

interface ShipmentLine {
    shipmentStatus: string;
    shipmentStatusLastUpdatedTime: string;
    shipmentTrackingNumber: null | string; // Assuming it can be a string or null
    shipmentTrackingUrl: null | string; // Assuming it can be a string or null
    shipmentProvider: null | string; // Assuming it can be a string or null
}

interface ScriptInstruction {
    catalogItemCode: string;
    sigText: string;
    internalSigText: string;
    quantity: number;
    daysSupply: number;
}

interface EmpowerVariantSigData {
    selectDisplayName: string;
    array: ScriptInstruction[];
}

interface EmpowerItemCatalogCodes {
    [key: string]: {
        itemDesignatorId: string;
        drugDescription: string;
    };
}
