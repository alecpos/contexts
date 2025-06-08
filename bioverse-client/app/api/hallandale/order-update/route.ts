import { updateShippingStatusAudit } from '@/app/utils/database/controller/shipping_status_audit/shipping_status_audit';
import { updateEmpowerOrderWithOrderData } from '@/app/services/pharmacy-integration/empower/update-order';
import { NextRequest, NextResponse } from 'next/server';
import { EASYPOST_PHARMACIES } from '@/app/services/easypost/constants';
import { updateHallandaleOrderWithOrderData } from '@/app/services/pharmacy-integration/hallandale/update-order';

export async function POST(req: NextRequest) {
    const HALLANDALE_USER_NAME = process.env.HALLANDALE_BV_API_USER_NAME;
    const HALLANDALE_PASSWORD = process.env.HALLANDALE__BV_API_USER_PASSWORD;

    // Check for the secret key in the headers
    const authHeader = req.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Basic ')) {
        console.error('HALLANDALE notification Basic Auth error.');
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
    if (username !== HALLANDALE_USER_NAME || password !== HALLANDALE_PASSWORD) {
        console.error('HALLANDALE notification Basic Auth credentials error.');
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

    const jsonData = await req.json();
    console.log('Hallandale Route Handling Shipment Order Updates: ', jsonData);

    await updateShippingStatusAudit(jsonData, EASYPOST_PHARMACIES.HALLANDALE);

    try {
        const { result: updateResult } =
            await updateHallandaleOrderWithOrderData(jsonData);

        if (updateResult === 'success') {
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
        } else if (updateResult === 'failure') {
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

    return new NextResponse(
        JSON.stringify({
            message: 'Received',
        }),
        {
            status: 200, //
            headers: {
                'Content-Type': 'application/json',
            },
        }
    );
}
