'use server';

export default async function getGGMToken() {
    const url = process.env.GGM_TOKEN_URL!; // Replace with the actual URL
    const headers = new Headers({
        Authorization: 'Bearer no-token', // Replace 'YOUR_TOKEN' with the actual token
        'Content-Type': 'application/x-www-form-urlencoded',
    });

    const body = `grant_type=password&username=${process.env.GGM_TOKEN_USERNAME}&password=${process.env.GGM_TOKEN_PASSWORD}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: body,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return { token: data.access_token, error: null };
    } catch (error) {
        console.error('GGM Token generation error details:', error);
        return { token: null, error: error };
    }
}
