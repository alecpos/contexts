'use server';
import { EASYPOST_PHARMACIES } from '@/app/services/easypost/constants';
import { updateBoothwynOrderWithOrderData } from '@/app/services/pharmacy-integration/boothwyn/update-order-boothwyn';
import { Status } from '@/app/types/global/global-enumerators';
import { updateShippingStatusAudit } from '@/app/utils/database/controller/shipping_status_audit/shipping_status_audit';
import { NextRequest, NextResponse } from 'next/server';

const SECRET_KEY = process.env.PHARMACY_AUTHORIZATION_SECRET_KEY;

export async function POST(req: NextRequest) {
    // Check for the secret key in the headers
    const authHeader = req.headers.get('bv-boothwyn-key');
    const BOOTHWYN_KEY = process.env.BOOTHWYN_ORDER_RECIEVED_KEY!;

    if (!authHeader || authHeader !== BOOTHWYN_KEY) {
        console.log('Boothwyn notification key error.');
        return new NextResponse(
            JSON.stringify({
                error: 'Unauthorized access: Invalid or missing Boothwyn key.',
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
    console.log('Boothwyn Route Handling Shipment Order Updates ', jsonData);

    await updateShippingStatusAudit(jsonData, EASYPOST_PHARMACIES.BOOTHWYN);

    try {
        const { result: updateResult } = await updateBoothwynOrderWithOrderData(
            jsonData
        );

        if (updateResult == Status.Success) {
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
        if (updateResult == Status.Failure) {
            return new NextResponse(
                JSON.stringify({
                    message: 'There was an error in processing the update.',
                }),
                {
                    status: 500, //
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
