import CancelSubscriptionConfirm from '@/app/components/patient-portal/subscriptions/components/CancelSubscription/CancelSubscriptionConfirm';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { getSubscriptionDetails } from '@/app/utils/actions/subscriptions/subscription-actions';
import { getCustomerFirstNameById } from '@/app/utils/database/controller/profiles/profiles';
import { Status } from '@/app/types/global/global-enumerators';
import { isWeightlossProduct } from '@/app/utils/functions/pricing';
import { CssBaseline } from '@mui/material';
import { redirect } from 'next/navigation';
import React from 'react';

interface CancelSubscriptionConfirmPageProps {
    params: {
        subscription_id: number;
    };
}
const ConfirmCancelPage = async ({
    params,
}: CancelSubscriptionConfirmPageProps) => {
    const { data: activeSession } = await readUserSession();
    if (!activeSession.session) {
        return redirect('/login?originalRef=%2Fportal%2Forder-history');
    }

    const { status, data: subscriptionData } = await getSubscriptionDetails(
        params.subscription_id
    );
    const userId = activeSession.session.user.id;

    const { first_name } = await getCustomerFirstNameById(userId);

    if (status === Status.Failure) {
        return <div>Error</div>;
    }
    const isWeightlossProd = isWeightlossProduct(subscriptionData.href);

    return (
        <>
            <CssBaseline />
            <div className=''>
                <CancelSubscriptionConfirm
                    name={first_name}
                    subscription_id={params.subscription_id}
                    subscription={subscriptionData}
                    isWeightlossProduct={isWeightlossProd}
                />
            </div>
        </>
    );
};
export default ConfirmCancelPage;
