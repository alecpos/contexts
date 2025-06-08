export function trimEnds(toTrim: string): string {
    if (toTrim) {
        return toTrim.trim();
    } else return toTrim;
}

// Modified to use orderData's address now - uses patient data as fail safe
export function validatePatientData(
    patientData: any,
    orderData: any
): DoseSpotPatientDetails {
    const modifiedString: DoseSpotPatientDetails = {
        firstName: trimEnds(patientData.first_name),
        lastName: trimEnds(patientData.last_name),
        DOB: convertDateFormat(patientData.date_of_birth),
        gender: String(getGenderCode(patientData.sex_at_birth)),
        email: trimEnds(patientData.email),
        address:
            trimEnds(orderData.address_line1) ||
            trimEnds(patientData.address_line1),
        addressLine2: orderData.address_line2
            ? trimEnds(orderData.address_line2)
            : patientData.address_line2
            ? trimEnds(patientData.address_line2)
            : undefined,
        city: trimEnds(orderData.city) || trimEnds(patientData.city),
        state: trimEnds(orderData.state) || trimEnds(patientData.state),
        zip: orderData.zip ? String(orderData.zip) : String(patientData.zip),
        phone: formatPhoneNumber(patientData.phone_number),
        phoneType: '2',
        active: 'true',
    };

    return modifiedString;
}

function formatPhoneNumber(phoneNumber: string) {
    // Remove all non-digit characters except '+'
    const cleaned = ('' + phoneNumber).replace(/\D+/g, '');
    // Return the first  10 digits if available
    return cleaned.substring(0, 10);
}

function getGenderCode(genderString: string): number {
    const lowerCaseGender = genderString.toLowerCase();

    switch (lowerCaseGender) {
        case 'male':
            return 1;
        case 'female':
            return 2;
        default:
            throw new Error(`Invalid gender string: ${genderString}`);
    }
}

function convertDateFormat(dateString: string): string {
    // Check if the input string matches the expected format
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) {
        throw new Error('Invalid date format. Expected "YYYY-MM-DD".');
    }

    // Split the date string into its components
    const [year, month, day] = dateString.split('-');

    // Construct the new date format
    return `${month}/${day}/${year}`;
}

/**
 * 
 * const [formData, setFormData] = useState<DoseSpotPatientDetails>({
    firstName: "Nathan",
    lastName: "Cho",
    DOB: "10/09/1989",
    gender: "1",
    address: "123 street street",
    city: "Brooklyn",
    state: "New York",
    zip: "11213",
    phone: "7818898998",
    phoneType: "2",
    active: "true",
  });

  const patientData: {
    first_name: any;
    last_name: any;
    date_of_birth: any;
    sex_at_birth: any;
    address_line1: any;
    address_line2: any;
    city: any;
    state: any;
    zip: any;
    phone_number;
    dose_spot_id: any;
    license_photo_url: any;
    selfie_photo_url: any;
    subscriptions: {
        ...;
    }[];
} | null

 */
