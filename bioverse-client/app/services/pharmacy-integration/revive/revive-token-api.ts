'use server';

export async function getReviveToken() {
    const BASE_URL = process.env.REVIVE_API_TOKEN_URL!;

    // Replace these with your actual credentials
    const username = 'nchobioverse';
    const password = 'oldclam50';

    // Create Basic Auth token
    const basicAuth = Buffer.from(`${username}:${password}`).toString('base64');

    try {
        const response = await fetch(BASE_URL, {
            method: 'GET',
            headers: {
                Authorization: `Basic ${basicAuth}`,
                'x-pmk-system': 'practitioner_portal',
                Accept: 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.data.api_key;
    } catch (error) {
        console.error('Error fetching Revive token:', error);
        throw error;
    }
}
