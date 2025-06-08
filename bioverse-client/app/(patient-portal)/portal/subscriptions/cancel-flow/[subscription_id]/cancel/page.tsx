'use server';
import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import CancelSubscription from '@/app/components/patient-portal/subscriptions/components/CancelSubscription/CancelSubscription';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { redirect } from 'next/navigation';
import { getSubscriptionDetails } from '@/app/utils/actions/subscriptions/subscription-actions';
import { Status } from '@/app/types/global/global-enumerators';

interface CancelSubscriptionPageProps {
    params: {
        subscription_id: number;
    };
}

const CancelSubscriptionPage = async ({
    params,
}: CancelSubscriptionPageProps) => {
    const { data: activeSession } = await readUserSession();
    if (!activeSession.session) {
        return redirect('/login?originalRef=%2Fportal%2Forder-history');
    }

    const { status, data: subscriptionData } = await getSubscriptionDetails(
        params.subscription_id
    );

    if (status === Status.Failure) {
        return <div>Error</div>;
    }

    return (
        <>
            <CssBaseline />
            <div className=''>
                <CancelSubscription
                    subscription_id={params.subscription_id}
                    subscription={subscriptionData}
                />
            </div>
        </>
    );
};

export default CancelSubscriptionPage;
