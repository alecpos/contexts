import { updateShippingStatusAudit } from '@/app/utils/database/controller/shipping_status_audit/shipping_status_audit';
import { updateGGMOrderWithOrderData } from '@/app/services/pharmacy-integration/gogomeds/update-order';
import { NextRequest, NextResponse } from 'next/server';

const SECRET_KEY = process.env.PHARMACY_AUTHORIZATION_SECRET_KEY;

export async function POST(req: NextRequest) {
    // Check for the secret key in the headers
    const authHeader = req.headers.get('authorization');

    if (!authHeader || authHeader.split(' ')[1] !== SECRET_KEY) {
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
            },
        );
    }

    try {
        // Parse the JSON data from the request body
        const jsonData = await req.json();
        updateShippingStatusAudit(jsonData, 'ggm');
        console.log('Received JSON data from GGM notification:', jsonData);

        const { result } = await updateGGMOrderWithOrderData(jsonData);
    } catch (error) {
        // Log the error and return an internal server error response
        console.error(
            'An error occurred while processing the GGM notification:',
            error,
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
            },
        );
    }
}
