'use server';

import React from 'react';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { redirect } from 'next/navigation';
import ErrorMessage from '@/app/components/patient-portal/dosage-selection-first-time/components/ErrorMessage';
import { getBaseOrderById } from '@/app/utils/database/controller/orders/orders-api';
import { getPriceDataRecordWithVariant } from '@/app/utils/database/controller/product_variants/product_variants';
import FirstTimeAlmostDoneScreen from '@/app/components/patient-portal/dosage-selection-first-time/components/FirstTimeAlmostDone';
import { getPatientInformationById } from '@/app/utils/actions/provider/patient-overview';

interface FirstTimeRequestCheckoutPageProps {
    params: {
        variant_index: string;
        order_id: string;
    };
}

const FirstTimeRequestCheckoutPage = async ({
    params,
}: FirstTimeRequestCheckoutPageProps) => {
    const { data: activeSession } = await readUserSession();
    const user_id = activeSession?.session?.user.id;
    if (!user_id) {
        return redirect('/login?originalRef=%2Fportal%2Forder-history');
    }

    const order_id = Number(params.order_id);
    if (!order_id) return <ErrorMessage message='Invalid Order ID' />;

    const order = await getBaseOrderById(order_id);

    if (!order)
        return <ErrorMessage message='Could not fetch order for order ID' />;

    const priceData = await getPriceDataRecordWithVariant(
        order.product_href,
        params.variant_index
    );

    if (!priceData) {
        return (
            <ErrorMessage message='Error Code 11: Please try again or contact support' />
        );
    }

    const { data: patientData, error: patientError } =
        await getPatientInformationById(order.customer_uid);

    if (!patientData) {
        return (
            <ErrorMessage message='Error Code 12: Please try again or contact support' />
        );
    }

    return (
        <div className='w-full bg-[#F7F8F8] flex justify-center min-h-screen'>
            <FirstTimeAlmostDoneScreen
                order={order}
                priceData={priceData}
                product_href={order.product_href}
                patientData={patientData}
            />
        </div>
    );
};

export default FirstTimeRequestCheckoutPage;
