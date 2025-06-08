'use server';

interface GetTokenResponse {
    token: string;
    tokenCreatedTime: Date;
    tokenExpirationTime: Date;
}

export async function getEmpowerTokenAsync(): Promise<GetTokenResponse> {
    const url = process.env.EMPOWER_API_URL_TOKEN!;

    console.log(
        'empower token url',
        url,
        process.env.EMPOWER_API_KEY,
        process.env.EMPOWER_API_SECRET
    );

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                APIKey: process.env.EMPOWER_API_KEY!,
                APISecret: process.env.EMPOWER_API_SECRET!,
            },
        });

        // console.log('response of token fetch', response);

        if (!response.ok) {
            const content = await response.text();
            const jsonContext = await response.json();
            throw new Error(
                `EIP responded with status code ${response.status}. Content: ${content}, URL used: ${url}, jsonContext: ${jsonContext}`
            );
        }

        // console.log('empower token response', response);

        const data: GetTokenResponse = await response.json();
        // Assuming the API returns dates in a format that can be directly converted to Date objects.
        // If not, you might need to manually parse and convert the dates.
        return {
            ...data,
            tokenCreatedTime: new Date(data.tokenCreatedTime),
            tokenExpirationTime: new Date(data.tokenExpirationTime),
        };
    } catch (error) {
        throw new Error(
            `Failed to get token: ${
                error instanceof Error ? error.message : String(error)
            }`
        );
    }
}
