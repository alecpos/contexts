'use server';
import {
    determineAddressValidationLevel,
    determineIsPoBox,
} from '@/app/utils/functions/address-verification';
import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    const params = await request.json();
    const { addressLineOne, addressLineTwo, stateAddress, zip, city } = params;

    const GMAPS_BASE_URL = `https://addressvalidation.googleapis.com/v1:validateAddress?key=${process.env.GMAPS_API_KEY}`;

    const addressPayload = {
        address: {
            regionCode: 'US',
            addressLines: [
                addressLineOne,
                addressLineTwo,
                `${city}, ${stateAddress}, ${zip}`,
            ],
        },
        ...(params.previousResponseId && {
            previousResponseId: params.previousResponseId,
        }),
    };

    const response: AddressVerificationRequest = await axios.post(
        GMAPS_BASE_URL,
        addressPayload,
    );

    // 1. Determine if address requires correction or can be confirmed with user
    // and determine if address is a PO Box
    const validationLevel = determineAddressValidationLevel(
        response.data.result.verdict,
    );

    const isPoBox = determineIsPoBox(response.data.result.metadata);

    // 2. Check if address needs to be fixed and inform user
    // if (validationLevel === 0) {
    //     const responseData = { success: false, data: {} };
    //     return NextResponse.json(responseData);
    // }

    // 3. Get standardized address and return back to user
    const uspsData: USPSData = response.data.result.uspsData;
    const standardizedAddress: StandardizedAddress =
        uspsData.standardizedAddress;

    if (!uspsData.standardizedAddress) {
        const responseData = { success: false, data: {} };
        return NextResponse.json(responseData);
    }

    // 4. Construct response payload
    const responsePayload: ResponsePayload = {
        standardizedAddress,
        responseId: response.data.responseId,
        isPoBox: isPoBox,
    };

    const responseData: AddressValidationResponse = {
        success: true,
        data: responsePayload,
    };

    // Return a NextResponse with JSON data
    return NextResponse.json(responseData);
}
