interface PatientOrderProviderDetailsAdminOrderAPI {
    id: string;
    patientId: string;
    patientName: string;
    requestSubmissionTime: string;
    deliveryState: string;
    prescription: string;
    approvalStatus: string;
    licensePhotoUrl: string;
    selfiePhotoUrl: string;
    patientDOB: string;
    email: string;
    patientAddress: {
        line1: string;
        line2?: string;
        city: string;
        state: string;
        zip: string;
    };
    patientGender: string;
    patientPhone: string;
    stripeCustomerId: string;
    tracking_number: string;
}
