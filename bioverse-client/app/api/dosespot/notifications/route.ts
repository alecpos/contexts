'use server';
import { NextRequest, NextResponse } from 'next/server';
import { handlePrescriptionResult } from '../_event-type-cases/handlePrescriptionResult';
import { handlePrescriberNotificationCounts } from '../_event-type-cases/handlePrescriberNotificationCounts';

const SECRET_KEY = process.env.DOSE_SPOT_PUSH_SECRET_KEY;

export async function POST(req: NextRequest) {
    // Check for the secret key in the headers
    const authHeader = req.headers.get('authorization');

    if (!authHeader || authHeader !== `Secret ${SECRET_KEY}`) {
        console.log('Dose Spot notification SECRET KEY error.');
        return new NextResponse(
            JSON.stringify({
                error: 'Unauthorized access: Invalid or missing secret key.',
            }),
            {
                status: 401, // Unauthorized
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
    }

    try {
        // Parse the JSON data from the request body
        const jsonData = await req.json();
        console.log(
            'Received JSON data from Dose Spot notification:',
            jsonData
        );

        switch (jsonData.EventType) {
            case 'PrescriptionResult':
                return await handlePrescriptionResult(jsonData);
            case 'PrescriberNotificationCounts':
                return await handlePrescriberNotificationCounts(jsonData);
            default:
                // Handle unsupported event types
                return new NextResponse(
                    JSON.stringify({ error: 'Unsupported EventType' }),
                    {
                        status: 400, // Bad Request
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );
        }
    } catch (error) {
        // Log the error and return an internal server error response
        console.error(
            'An error occurred while processing the DoseSpot notification:',
            error
        );
        return new NextResponse(
            JSON.stringify({
                error: 'Internal server error: Failed to process the notification.',
            }),
            {
                status: 500, // Internal Server Error
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
    }
}
