'use server';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import { SubscriptionCadency } from '@/app/types/renewal-orders/renewal-orders-types';
import { getPreloadManualCreateOrderInformation } from '@/app/utils/database/controller/orders/create-manual-order';
import { NextRequest, NextResponse } from 'next/server';

interface OrderInformation {
    profile_data: APProfileData;
    product_href: PRODUCT_HREF;
    variant_index: number;
    hasPaid: boolean;
    cadence: SubscriptionCadency;
    needsProviderReview: boolean;
    selectedPaymentMethod: string;
    metadata: any;
}

export async function POST(req: NextRequest) {
    try {
        const requestJson = (await req.json()) as OrderInformation;
        console.log('REQUEST JOSN', requestJson);

        const res = await getPreloadManualCreateOrderInformation(requestJson);

        return new NextResponse(JSON.stringify(res), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error getting order information', error);
        return new NextResponse(
            JSON.stringify({ error: (error as Error).message }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }
}
