'use server';
import qs from 'qs';
import { getTokenV2 } from '../token/dose-spot-token-v2';

export async function addPatientV2({
    firstName,
    lastName,
    DOB,
    gender,
    email,
    address,
    addressLine2,
    city,
    state,
    zip,
    phone,
    phoneType,
    active,
}: DoseSpotPatientDetailsV2) {
    try {
        const accessTokenData = await getTokenV2(
            process.env.DOSE_SPOT_V2_USER_NAME!
        );
        // const accessTokenData = await getToken('362313');

        const data = qs.stringify({
            FirstName: firstName,
            LastName: lastName,
            DateOfBirth: DOB,
            Gender: gender,
            Email: email,
            Address1: address,
            Address2: addressLine2,
            City: city,
            State: state,
            ZipCode: zip,
            PrimaryPhone: phone,
            PrimaryPhoneType: phoneType,
            Active: active,
            // Height: 62, //THESE 4 FIELDS ARE REQUIRED FOR PATIENTS UNDER 19 (18 YEAR OLDS)
            // Weight: 150,
            // HeightMetric: 1, // 1 = inches, 2 = centimeters
            // WeightMetric: 1, // 1 = pounds, 2 = kilograms
        });

        const response = await fetch(
            `${process.env.DOSE_SPOT_V2_URL}api/patients`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Subscription-Key':
                        process.env.DOSE_SPOT_V2_SUBSCRIPTION_KEY!,
                    Authorization: `Bearer ${accessTokenData}`,
                },
                body: data,
            }
        );

        if (response.ok) {
            const responseData = await response.json();

            console.log('Dose Spot Patient Creation ResponseL: ', responseData);

            return responseData;
        } else {
            // Handle HTTP errors
            console.error(
                'Patient-Actions.ts Error creating DoseSpot Patient. Details: ',
                response,
                await response.json()
            );
            return null;
        }
    } catch (error) {
        // Assuming `error` is of type `any` to bypass TypeScript's strict type checking
        if (error instanceof Error) {
            console.error('Error adding patient:', error);
        } else {
            console.error('Unknown error adding patient:', error);
        }

        return null;
    }
}

export async function getAllDoseSpotPatientsV2(userId: string) {
    const accessTokenData = await getTokenV2(userId);

    const response = await fetch(
        `${process.env.DOSE_SPOT_V2_URL}api/patients`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Subscription-Key': process.env.DOSE_SPOT_V2_SUBSCRIPTION_KEY!,
                Authorization: `Bearer ${accessTokenData}`,
            },
        }
    );

    console.log('getAllDoseSpotPatients', await response.json());

    if (response.ok) {
        const responseData = await response.json();
        console.log(responseData.Id);
    } else {
        // Handle HTTP errors
        console.error('Failed to add patient:', response);
        console.error('Failed to add patient message: ', response.statusText);
    }
}

export async function editPatientV2(
    patientId: string,
    {
        firstName,
        lastName,
        DOB,
        gender,
        address,
        addressLine2,
        city,
        state,
        zip,
        phone,
        phoneType,
        active,
    }: DoseSpotPatientDetailsV2
) {
    const userId = process.env.DOSE_SPOT_V2_USER_NAME!;

    try {
        const accessTokenData = await getTokenV2(userId);
        const data = qs.stringify({
            FirstName: firstName,
            LastName: lastName,
            DateOfBirth: DOB,
            Gender: gender,
            Address1: address,
            Address2: addressLine2,
            City: city,
            State: state,
            ZipCode: zip,
            PrimaryPhone: phone,
            PrimaryPhoneType: phoneType,
            Active: active,
        });

        const response = await fetch(
            `${process.env.DOSE_SPOT_V2_URL}api/patients/${patientId}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Subscription-Key':
                        process.env.DOSE_SPOT_V2_SUBSCRIPTION_KEY!,
                    Authorization: `Bearer ${accessTokenData}`,
                },
                body: data,
            }
        );

        if (response.ok) {
            const responseData = await response.json();
            console.log(responseData.Id);

            return responseData;
        } else {
            // Handle HTTP errors
            console.error('Failed to add patient:', response);
            console.error(
                'Failed to add patient message: ',
                response.statusText
            );
            return null;
        }
    } catch (error) {
        // Assuming `error` is of type `any` to bypass TypeScript's strict type checking
        if (error instanceof Error) {
            console.error('Error adding patient:', error);
        } else {
            console.error('Unknown error adding patient:', error);
        }

        return null;
    }
}
