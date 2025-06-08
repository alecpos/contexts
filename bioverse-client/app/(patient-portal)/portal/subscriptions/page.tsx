import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { redirect } from 'next/navigation';
import { getSubscriptionHistory } from '@/app/utils/actions/membership/order-history-actions';
import { categorizeSubscriptions } from '@/app/utils/functions/patient-portal/patient-portal-utils';
import SubscriptionsPage from '@/app/components/patient-portal/subscriptions/SubscriptionsPage';
import { getAccountProfileData } from '@/app/utils/database/controller/profiles/profiles';

const OrderHistoryPage: React.FC = async () => {
    const { data: activeSession } = await readUserSession();
    if (!activeSession.session) {
        return redirect('/login?originalRef=%2Fportal%2Forder-history');
    }

    const userId = activeSession.session.user.id;
    const accountProfileData: AccountProfileData | undefined =
        await getAccountProfileData(userId);

    const subscriptionData = await getSubscriptionHistory(userId);

    const formattedOrderData = categorizeSubscriptions(subscriptionData);

    return (
        <>
            <CssBaseline />
            <div className="min-h-screen pb-20 pt-8">
                <SubscriptionsPage
                    subscriptionPurchaseOrderData={formattedOrderData}
                    accountProfileData={accountProfileData}
                />
            </div>
        </>
    );
};

export default OrderHistoryPage;
