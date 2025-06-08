import { OrderConfirmation } from '@/app/components/intake-v2/pages/order-confirmation';
import React, { Suspense } from 'react';

interface Props {
    params: {
        orderId: any;
    };
}

export default function OrderCompletionPage({ params }: Props) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <OrderConfirmation />
        </Suspense>
    );
}
