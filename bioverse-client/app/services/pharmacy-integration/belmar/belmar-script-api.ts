'use server';

export async function sendBelmarScript(
    body_json: BelmarRequestBody,
    orderId: string,
    providerId: string
) {
    const url = process.env.BELMAR_API_URL! + '/order';
    const username = process.env.BELMAR_API_USERNAME!;
    const password = process.env.BELMAR_API_PASSWORD!;
    const headers = new Headers({
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + btoa(`${username}:${password}`),
        'X-Vendor-ID': process.env.BELMAR_X_VENDOR_ID!,
        'X-Location-ID': process.env.BELMAR_X_LOCATION_ID!,
        'X-API-Network-ID': process.env.BELMAR_X_API_NETWORK_ID!,
    });

    const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body_json),
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
}
