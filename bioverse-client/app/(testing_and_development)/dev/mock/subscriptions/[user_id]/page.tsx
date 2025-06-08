import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { redirect } from 'next/navigation';
import { getSubscriptionHistory } from '@/app/utils/actions/membership/order-history-actions';
import { categorizeSubscriptions } from '@/app/utils/functions/patient-portal/patient-portal-utils';
import SubscriptionsPage from '@/app/components/patient-portal/subscriptions/SubscriptionsPage';
import { getAccountProfileData } from '@/app/utils/database/controller/profiles/profiles';

interface SubscriptionHistoryMockPageProps {
    params: {
        user_id: string;
    };
}

const SubscriptionHistoryMockPage = async ({
    params,
}: SubscriptionHistoryMockPageProps): Promise<JSX.Element> => {
    const { data: activeSession } = await readUserSession();
    if (!activeSession.session) {
        return redirect('/login?originalRef=%2Fportal%2Forder-history');
    }

    const user_id = params.user_id;

    const accountProfileData: AccountProfileData | undefined =
        await getAccountProfileData(user_id);

    const subscriptionData = await getSubscriptionHistory(user_id);

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

export default SubscriptionHistoryMockPage;
