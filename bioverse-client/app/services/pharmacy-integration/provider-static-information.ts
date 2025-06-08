export const providerAddress: AddressData = {
    address_line1: '875 Washington Street',
    city: 'New York',
    state: 'NY',
    zip: '10014',
};

export const providerInfoGermanE: ProviderData = {
    uuid: '025668ab-3f9e-4839-a0c5-75790305cfe9', //TODO: FIX LATER: Provider logic This is NOT the right value. Change later.
    npi: '1689995771',
    first_name: 'German',
    last_name: 'Echeverry',
    dose_spot_id: '360482',
    name: 'Dr. German Echeverry',
    state_license_number: '279563',
    phone_number: '7476668167',
};

export const providerInfoMeylinC: ProviderData = {
    uuid: '24138d35-e26f-4113-bcd9-7f275c4f9a47',
    npi: '1780019117',
    first_name: 'Maylin',
    last_name: 'Chen',
    dose_spot_id: '362313',
    name: 'Maylin Chen',
    state_license_number: 'RN9467595',
    phone_number: '7476668167',
};

export const providerInfoAmandaL: ProviderData = {
    uuid: 'da5b213d-7676-4792-bc73-11151d0da4e6',
    npi: '1528448628',
    first_name: 'Amanda',
    last_name: 'Little',
    dose_spot_id: '380480',
    name: 'Amanda Little',
    state_license_number: 'APRN11029703',
    phone_number: '7476668167',
};

export const providerListByUUID = {
    'da5b213d-7676-4792-bc73-11151d0da4e6': providerInfoAmandaL,
    '24138d35-e26f-4113-bcd9-7f275c4f9a47': providerInfoMeylinC,
    '025668ab-3f9e-4839-a0c5-75790305cfe9': providerInfoGermanE,
};

export const AUTO_STATUS_CHANGER_UUID = 'ffabc905-5508-4d54-98fb-1e2ef2b9e99a';

interface AddressData {
    address_line1: string;
    city: string;
    state: string;
    zip: string;
}
