'use server';
// Import Axios and other required modules
import axios from 'axios';
import qs from 'qs';

/**
 *
 * @param providerDoseSpotId
 * @returns string containing access token value
 */
export async function getTokenV2(providerDoseSpotId?: string) {
    const data = qs.stringify({
        grant_type: 'password',
        username: providerDoseSpotId ?? process.env.DOSE_SPOT_V2_USER_NAME!,
        client_id: process.env.DOSE_SPOT_V2_CLINIC_ID!,
        client_secret: process.env.DOSE_SPOT_V2_CLINIC_KEY!,
        password: process.env.DOSE_SPOT_V2_CLINIC_KEY!,
        scope: 'api',
    });

    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Subscription-Key': process.env.DOSE_SPOT_V2_SUBSCRIPTION_KEY!,
    };

    try {
        const response = await axios.post<TokenResponseV2>(
            `${process.env.DOSE_SPOT_V2_URL}connect/token`,
            data,
            { headers }
        );

        console.log('response: ', response);

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
