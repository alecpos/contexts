'use server';
import { EASYPOST_PHARMACIES } from '@/app/services/easypost/constants';
import { updateReviveOrderWithOrderData } from '@/app/services/pharmacy-integration/revive/update-order';
import { Status } from '@/app/types/global/global-enumerators';
import { updateShippingStatusAudit } from '@/app/utils/database/controller/shipping_status_audit/shipping_status_audit';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    // Check for the secret key in the headers
    const authHeader = req.headers.get('bv-revive-key');
    const REVIVE_OR_KEY = process.env.REVIVE_ORDER_RECEIVED_KEY!;

    if (!authHeader || authHeader !== REVIVE_OR_KEY) {
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
    console.log('Revive Route Handling Shipment Order Updates ', jsonData);

    await updateShippingStatusAudit(jsonData, EASYPOST_PHARMACIES.REVIVE);

    try {
        const { result: updateResult } = await updateReviveOrderWithOrderData(
            jsonData.event_data as ReviveOrderStatusPayload
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
