import { NextRequest, NextResponse } from 'next/server';
import { updateExistingOrderStatusAndExternalMetadataUsingId } from '@/app/utils/database/controller/orders/orders-api';
import { OrderStatus } from '@/app/types/orders/order-types';

/**
 * Finalizes an order for the global weight loss funnel.
 * Expects JSON payload with order details.
 */
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    if (!data || !data.order_id) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }
    await updateExistingOrderStatusAndExternalMetadataUsingId(
      Number(data.order_id),
      OrderStatus.ApprovedCardDownFinalized,
      {}
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('checkout POST error', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
