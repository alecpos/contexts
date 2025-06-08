'use server';
import { listPaidInvoices } from '@/app/(administration)/admin/stripe-api/stripe-api-actions';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

interface GetInvoicesPayload {
    stripe_customer_id: string;
    threshold: number;
}

export interface GetInvoicesReturn {
    invoices: Stripe.Invoice[];
}

export async function POST(req: NextRequest) {
    try {
        const { stripe_customer_id, threshold } =
            (await req.json()) as GetInvoicesPayload;

        const res = await listPaidInvoices(stripe_customer_id, threshold);

        console.log('INVOICES', res);

        return new NextResponse(JSON.stringify({ invoices: res }), {
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
