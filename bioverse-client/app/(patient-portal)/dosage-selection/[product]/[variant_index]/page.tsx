'use server';

import React from 'react';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { redirect } from 'next/navigation';
import { getLatestRenewalOrderByCustomerAndProduct } from '@/app/utils/database/controller/renewal_orders/renewal_orders';
import { fetchOrderData } from '@/app/utils/database/controller/orders/orders-api';
import AlmostDoneScreen from '@/app/components/patient-portal/check-up-requested/almost-done/almost-done-screen';
import AlmostDoneScreenV2 from '@/app/components/patient-portal/check-up-requested/almost-done/almost-done-screen-v2';
import { getFullIntakeProfileData } from '@/app/utils/database/controller/profiles/profiles';
import { getSubscriptionRenewalDate } from '@/app/(administration)/admin/stripe-api/stripe-api-actions';
import { getPatientInformationById } from '@/app/utils/actions/provider/patient-overview';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { getPriceDataRecordWithVariant } from '@/app/utils/database/controller/product_variants/product_variants';

interface ConfirmSelectionPageProps {
    params: {
        variant_index: string;
        product: string;
    };
}

const ConfirmSelectionPage = async ({ params }: ConfirmSelectionPageProps) => {
    const { data: activeSession } = await readUserSession();
    const user_id = activeSession?.session?.user.id;
    //const user_id = '1f34f1eb-e148-41d5-9427-0114cc4c046e'
    if (!user_id) {
        return redirect('/login?originalRef=%2Fportal%2Forder-history');
    }

    const latestRenewalOrder = await getLatestRenewalOrderByCustomerAndProduct(
        user_id,
        params.product,
    );

    if (!latestRenewalOrder) {
        console.error('Could not get latest renewal order');
        return redirect('/collections');
    }

    const { type: orderType, data: orderData } = await fetchOrderData(
        latestRenewalOrder.renewal_order_id,
    );

    const priceData = await getPriceDataRecordWithVariant(
        params.product,
        params.variant_index,
    );

    const { data: profileData, error: profilesError } =
        await getFullIntakeProfileData(user_id);

    if (!priceData) {
        console.error(
            'Could not get price data for var index',
            params.variant_index,
        );
        return redirect('/collections');
    }

    if (!profileData) {
        console.error('Could not get profile for user');
        return redirect('/collections');
    }

    const subscriptionRenewalDate = await getSubscriptionRenewalDate(
        latestRenewalOrder.subscription_id,
    );

    const { data: patientData, error: patientDataError } =
        await getPatientInformationById(user_id);

    if (patientDataError || !patientData) {
        return (
            <>
                <div>
                    <BioType>
                        There was an error with fetching this order. Please try
                        again later.
                    </BioType>
                    <BioType>Error Message: {patientDataError.message}</BioType>
                </div>
            </>
        );
    }

    return (
        <div className="w-full bg-[#F7F8F8] flex justify-center min-h-screen">
            <AlmostDoneScreenV2
                priceData={priceData}
                profileData={profileData}
                renewalOrder={orderData}
                subscriptionRenewalDate={subscriptionRenewalDate}
                selectedVariantIndex={params.variant_index}
                patientData={patientData}
            />
        </div>
    );
};

export default ConfirmSelectionPage;
