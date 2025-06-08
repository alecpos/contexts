interface GGMOrder {
    AffiliateOrderNumber: string; //Our Primary Key ID for the order number
    Payment: GGMPayment;
    Customer: GGMCustomer;
    Drugs: GGMDrugs[];
}

interface GGMPayment {
    BillAffiliate: boolean;
}

interface GGMCustomer {
    AffiliateCustomerNumber: string; //Our uid for the customer
    FirstName: string;
    LastName: string;
    DOB: string; //MM/DD/YYYY
    Gender: string; //1 character of M, F, U, or P
    IsPregnant: boolean; //required if gender is F
    PhoneNumber: string;
    HasAllergies: boolean;
    AllergyText?: string;
    HasMedicalConditions: boolean;
    MedicalConditionText?: string;
    HasCurrentMedications: boolean;
    CurrentMedications?: string;
    Address: GGMAddress;
}

interface GGMDrugs {
    NDC: string;
    Quantity: number;
    PrescriptionSourceId: number;
    Prescriber: GGMPrescriber;
}

interface GGMAddress {
    Line1: string;
    Line2?: string;
    City: string;
    State: string;
    Zip: string;
}

interface GGMPrescriber {
    FirstName: string;
    LastName: string;
    NPI: string;
    Address: GGMAddress;
}
