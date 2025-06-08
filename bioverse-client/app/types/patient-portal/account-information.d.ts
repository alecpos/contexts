interface LicenseData {
    license: string | undefined;
    selfie: string | undefined;
}

interface AccountNameEmailPhoneData {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone_number?: string;
    date_of_birth?: string;
    address_line1?: string;
    address_line2?: string;
    state?: string;
    city?: string;
    zip?: string;
}

interface AccountProfileData {
    first_name: string;
    last_name: string;
    license_photo_url: string;
    selfie_photo_url: string;
    address_line1: string;
    address_line2: string;
    city: string;
    state: string;
    zip: string;
    phone_number: string;
    sex_at_birth: string;
}

interface SideProfileData {
    right_side_profile: string | undefined;
    left_side_profile: string | undefined;
}
