'use server';
import qs from 'qs';
import { getToken, getTokenWithClinicianId } from '../token/token';

export async function addPatient(
    providerDoseSpotId: string,
    {
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
    }: DoseSpotPatientDetails
) {
    try {
        const accessTokenData = await getToken(providerDoseSpotId);
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
        });

        const response = await fetch(
            `${process.env.DOSE_SPOT_URL}webapi/api/patients`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
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

export async function getAllDoseSpotPatients(userId: string) {
    const accessTokenData = await getToken(userId);

    const response = await fetch(
        `${process.env.DOSE_SPOT_URL}webapi/api/patients`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
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

export async function editPatient(
    userId: string,
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
    }: DoseSpotPatientDetails
) {
    try {
        const accessTokenData = await getToken(userId);
        const accessToken = accessTokenData; // Assuming createDoseSpotToken returns an object with access_token
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
            `${process.env.DOSE_SPOT_URL}webapi/api/patients/${patientId}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: `Bearer ${accessToken}`,
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
