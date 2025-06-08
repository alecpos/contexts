'use server';

export async function sendManualHallandaleScript(
    body_json: HallandaleScriptJSON
) {
    try {
        const url = process.env.HALLANDALE_API_URL!;
        const username = process.env.HALLANDALE_API_USERNAME!;
        const password = process.env.HALLANDALE_API_PASSWORD!;
        const headers = new Headers({
            'Content-Type': 'application/json',
            Authorization: 'Basic ' + btoa(`${username}:${password}`),
            'X-Vendor-ID': process.env.HALLANDALE_X_VENDOR_ID!,
            'X-Location-ID': process.env.HALLANDALE_X_LOCATION_ID!,
            'X-API-Network-ID': process.env.HALLANDALE_X_API_NETWORK_ID!,
        });
        console.log(body_json.order);

        body_json.order.practice.id = 1196822;

        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body_json),
        });

        const responseContent = await response.json();

        if (response.status != 200) {
            return { status: 'failure', response_content: responseContent };
        } else {
            return { status: 'success', response_content: responseContent };
        }
    } catch (error: any) {
        return { status: 'error', response_content: error.toString() };
    }
}
