'use server';
import { updateShippingStatusAudit } from '@/app/utils/database/controller/shipping_status_audit/shipping_status_audit';
import { NextRequest, NextResponse } from 'next/server';
import { updateBelmarOrderWithOrderData } from '@/app/services/pharmacy-integration/belmar/update-order';
import { EASYPOST_PHARMACIES } from '@/app/services/easypost/constants';

export async function POST(req: NextRequest) {
    // Check for the secret key in the headers

    const BELMAR_BV_API_USER_NAME = process.env.BELMAR_BV_API_USER_NAME;
    const BELMAR_BV_API_USER_PASSWORD = process.env.BELMAR_BV_API_USER_PASSWORD;

    // Check for the secret key in the headers
    const authHeader = req.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Basic ')) {
        console.error('BELMAR notification Basic Auth error.');
        return new NextResponse(
            JSON.stringify({
                error: 'Unauthorized access: Invalid or missing authorization header.',
            }),
            {
                status: 401, // Unauthorized
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
    }

    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString(
        'ascii'
    );
    const [username, password] = credentials.split(':');

    // Check if the username and password match
    if (
        username !== BELMAR_BV_API_USER_NAME ||
        password !== BELMAR_BV_API_USER_PASSWORD
    ) {
        console.error('BELMAR notification Basic Auth credentials error.');
        return new NextResponse(
            JSON.stringify({
                error: 'Unauthorized access: Invalid username or password.',
            }),
            {
                status: 401, // Unauthorized
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
    }

    const jsonArray = await req.json();
    const jsonData = jsonArray[0];

    updateShippingStatusAudit(jsonData, EASYPOST_PHARMACIES.BELMAR);

    try {
        const { result: updateResult } = await updateBelmarOrderWithOrderData(
            jsonData
        );

        if (updateResult == 'success') {
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
        }
        if (updateResult == 'failure') {
            return new NextResponse(
                JSON.stringify({
                    message: 'There was an error in processing the update.',
                }),
                {
                    status: 400, //
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
        }
    } catch (error) {
        return new NextResponse(
            JSON.stringify({
                message: 'Internal Server Error with Processing',
            }),
            {
                status: 500, //
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
    }
}
