'use server';
// Import Axios and other required modules
import axios from 'axios';
import qs from 'qs';
import getEncryptedValuesDoseSpot from '../encryption/encrypted-string-generator';

/**
 *
 * @param providerDoseSpotId
 * @returns string containing access token value
 */
export async function getToken(providerDoseSpotId: string) {
    const {
        encryptedClinicId,
        encryptedClinicIdEncoded,
        encryptedUserId,
        encryptedUserIdEncoded,
    } = await getEncryptedValuesDoseSpot(providerDoseSpotId);

    const credentials = btoa(
        `${process.env.DOSE_SPOT_CLINIC_ID}:${encryptedClinicId}`
    );
    const basicAuthHeader = `Basic ${credentials}`;

    const data = qs.stringify({
        grant_type: 'password',
        Username: providerDoseSpotId,
        Password: encryptedUserId,
    });

    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: basicAuthHeader,
    };

    try {
        const response = await axios.post<TokenResponse>(
            `${process.env.DOSE_SPOT_URL}webapi/token`,
            data,
            { headers }
        );

        return response.data.access_token;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            console.error('Dose Spot Token Error', error.response.data);
        } else {
            console.error(
                'Token.ts line 43: An unexpected error occurred:',
                error
            );
        }
        return null;
    }
}

export async function getTokenWithClinicianId(clinicianId: string) {
    const { encryptedUserId, encryptedClinicId } =
        await getEncryptedValuesDoseSpot(clinicianId);

    const credentials = btoa(
        `${process.env.DOSE_SPOT_CLINIC_ID}:${encryptedClinicId}`
    );
    const basicAuthHeader = `Basic ${credentials}`;

    const data = qs.stringify({
        grant_type: 'password',
        Username: clinicianId,
        Password: encryptedUserId,
    });

    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: basicAuthHeader,
    };

    try {
        const response = await axios.post<TokenResponse>(
            `${process.env.DOSE_SPOT_URL}webapi/token`,
            data,
            { headers }
        );

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            console.error(error.response.data);
        } else {
            console.error(
                'Token.ts line 43: An unexpected error occurred:',
                error
            );
        }
        return null;
    }
}
