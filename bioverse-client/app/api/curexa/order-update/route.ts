import { updateShippingStatusAudit } from '@/app/utils/database/controller/shipping_status_audit/shipping_status_audit';
import { updateCurexaOrderWithOrderData } from '@/app/services/pharmacy-integration/curexa/update-order';
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
            }
        );
    }

    try {
        // Parse the JSON data from the request body
        const jsonData = await req.json();

        updateShippingStatusAudit(jsonData, 'curexa');
        console.log('Received JSON data from Curexa notification:', jsonData);

        const { result } = await updateCurexaOrderWithOrderData(jsonData);

        if (result == 'success') {
            return new NextResponse(
                JSON.stringify({
                    message: 'Request processed succsessfully',
                }),
                {
                    status: 200, //success
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
        } else {
            return new NextResponse(
                JSON.stringify({
                    message: 'Request processed succsessfully',
                }),
                {
                    status: 400, //success
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
        }
    } catch (error) {
        // Log the error and return an internal server error response
        console.error(
            'An error occurred while processing the Curexa notification:',
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
