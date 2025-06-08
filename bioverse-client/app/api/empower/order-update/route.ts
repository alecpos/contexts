'use server';
import { updateShippingStatusAudit } from '@/app/utils/database/controller/shipping_status_audit/shipping_status_audit';
import { updateEmpowerOrderWithOrderData } from '@/app/services/pharmacy-integration/empower/update-order';
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

    const jsonData = await req.json();
    console.log('Empower Route Handling Shipment Order Updates: ', jsonData);

    updateShippingStatusAudit(jsonData, 'empower');

    try {
        const { result: updateResult } = await updateEmpowerOrderWithOrderData(
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
                    status: 400,
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
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
    }
}
