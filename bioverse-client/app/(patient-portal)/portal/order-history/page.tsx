'use server';
import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import OrdersPage from '../../../components/patient-portal/order-history/orderPage';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { redirect } from 'next/navigation';
import { getRenewalOrdersForPatient } from '@/app/utils/database/controller/renewal_orders/renewal_orders';
import { getOrdersForCustomer } from '@/app/utils/database/controller/orders/orders-api';
import {
    categorizeOrders,
    mergeOrders,
} from '@/app/utils/functions/patient-portal/patient-portal-utils';
import { getAccountProfileData } from '@/app/utils/database/controller/profiles/profiles';

const OrderHistoryPage: React.FC = async () => {
    const { data: activeSession } = await readUserSession();
    if (!activeSession.session) {
        return redirect('/login?originalRef=%2Fportal%2Forder-history');
    }

    const user_id = activeSession.session.user.id;

    // Get orders from orders table
    const orders = await getOrdersForCustomer(user_id);
    // Get orders from renewal_orders table
    const renewalOrders = await getRenewalOrdersForPatient(user_id);

    const mergedOrders = await mergeOrders(orders, renewalOrders);
    // console.log('merged', mergedOrders);
    const categorizedOrders = categorizeOrders(mergedOrders);
    // console.log(categorizedOrders);

    const accountProfileData = await getAccountProfileData(user_id);
    if (!accountProfileData) {
        throw new Error('Account profile data not found');
    }

    const personalData: AccountNameEmailPhoneData = {
        first_name: accountProfileData.first_name,
        last_name: accountProfileData.last_name,
        email: activeSession.session.user.email!, // Email from session data
    };
    return (
        <>
            <CssBaseline />
            <div className=" min-h-screen pb-20 pt-8">
                <OrdersPage
                    orderData={categorizedOrders}
                    personalData={personalData}
                />
            </div>
        </>
    );
};

export default OrderHistoryPage;
