'use server';

import { assignEasyPostTrackingToTMCOrder } from '@/app/services/pharmacy-integration/tmc/update-order';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        // Get the JSON data from the request body
        const jsonData = await req.json();

        // Process the received data
        console.log('The length of the data for checking: ', jsonData.length);

        console.log('The exact format of the JSON: ', JSON.stringify(jsonData));

        // Perform any necessary operations with the data
        // For example, you can save it to a database or trigger other actions

        for (let i = 0; i < jsonData.length; i++) {
            await assignEasyPostTrackingToTMCOrder(jsonData[i]);
        }

        // Return a success response
        return new NextResponse(
            JSON.stringify({ message: 'Data received successfully' }),
            {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    } catch (error) {
        console.error('Error processing webhook:', error);

        // Return an error response
        return new NextResponse(
            JSON.stringify({ error: 'Internal Server Error' }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }
}
