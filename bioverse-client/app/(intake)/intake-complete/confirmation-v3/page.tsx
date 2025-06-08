import { OrderConfirmationV3 } from '@/app/components/intake-v3/pages/order-confirmation-v3';
import React, { Suspense } from 'react';

interface Props {
    params: {
        orderId: any;
    };
}

export default function OrderCompletionPage({ params }: Props) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <OrderConfirmationV3 />
        </Suspense>
    );
}
