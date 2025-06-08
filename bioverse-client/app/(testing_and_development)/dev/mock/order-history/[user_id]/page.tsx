'use server';
import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { redirect } from 'next/navigation';
import { getRenewalOrdersForPatient } from '@/app/utils/database/controller/renewal_orders/renewal_orders';
import { getOrdersForCustomer } from '@/app/utils/database/controller/orders/orders-api';
import {
    categorizeOrders,
    mergeOrders,
} from '@/app/utils/functions/patient-portal/patient-portal-utils';
import { getAccountProfileData } from '@/app/utils/database/controller/profiles/profiles';
import OrderPage from '@/app/components/patient-portal/order-history/orderPage';

interface OrderHistoryMockPageProps {
    params: {
        user_id: string;
    };
}

const OrderHistoryMockPage = async ({
    params,
}: OrderHistoryMockPageProps): Promise<JSX.Element> => {
    const { data: activeSession } = await readUserSession();
    if (!activeSession.session) {
        return redirect('/login?originalRef=%2Fportal%2Forder-history');
    }

    const user_id = params.user_id;

    // Get orders from orders table
    const orders = await getOrdersForCustomer(user_id);
    // Get orders from renewal_orders table
    const renewalOrders = await getRenewalOrdersForPatient(user_id);

    const mergedOrders = await mergeOrders(orders, renewalOrders);
    const categorizedOrders = categorizeOrders(mergedOrders);

    const accountProfileData = await getAccountProfileData(user_id);
    if (!accountProfileData) {
        throw new Error('Account profile data not found');
    }

    const personalData: AccountNameEmailPhoneData = {
        first_name: accountProfileData.first_name,
        last_name: accountProfileData.last_name,
        email: `${accountProfileData.first_name}@test.com`, // Email from session data
    };

    return (
        <>
            <CssBaseline />
            <div className="min-h-screen pb-20 pt-8">
                <OrderPage
                    orderData={categorizedOrders}
                    personalData={personalData}
                />
            </div>
        </>
    );
};

export default OrderHistoryMockPage;
