export function formatE164(phoneNumber: string): string {
    // Define the country code, in this case for the United States
    const countryCode = '+1';

    // Remove all non-numeric characters from the phone number
    const cleanedNumber = phoneNumber.replace(/\D/g, '');

    // Concatenate the country code with the cleaned number
    const e164Number = countryCode + cleanedNumber;

    return e164Number;
}
