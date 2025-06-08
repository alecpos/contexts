'use server';
import axios from 'axios';

export const sendConvertEvent = async (
    event_type: string,
    event_id: string,
    payload: any,
    values: any = {},
    conversionPayload: any,
) => {
    const customData = {
        value: payload.value,
        currency: payload.currency,
    };

    try {
        const response = await axios.post(
            `https://graph.facebook.com/v19.0/${process.env.NEXT_PUBLIC_PIXEL_ID}/events?access_token=${process.env.FBACCESSKEY}`,
            {
                data: [
                    {
                        ...conversionPayload,
                        ...(event_type === 'Purchase' && {
                            custom_data: customData,
                        }),
                    },
                ],
                ...(process.env.NEXT_PUBLIC_ENVIRONMENT === 'dev' && {
                    test_event_code: process.env.NEXT_PUBLIC_CONVERSION_TEST_ID,
                }),
            },
        );
    } catch (error: any) {
        console.log('Error firing meta pixel convert event');
        console.log(conversionPayload);
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of  2xx
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
        } else if (error.request) {
            // The request was made but no response was received
            console.log(error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
        }
    }
};
