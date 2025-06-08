'use server';
import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { redirect } from 'next/navigation';
import { getAccountProfileData } from '@/app/utils/database/controller/profiles/profiles';
import { getSubscriptionDetails } from '@/app/utils/actions/subscriptions/subscription-actions';
import { Status } from '@/app/types/global/global-enumerators';
import ManageSubscription from '@/app/components/patient-portal/subscriptions/components/ManageSubscription/ManageSubscription';
import ResumeSubscription from '@/app/components/patient-portal/subscriptions/components/ResumeSubscription/ResumeSubscription';

interface ResumeSubscriptionProps {
    params: {
        subscription_id: number;
    };
}

const ResumeSubscriptionPage = async ({ params }: ResumeSubscriptionProps) => {
    const { data: activeSession } = await readUserSession();
    if (!activeSession.session) {
        return redirect('/login?originalRef=%2Fportal%2Forder-history');
    }

    // const userId = activeSession.session.user.id;

    const { status, data: subscriptionData } = await getSubscriptionDetails(
        params.subscription_id
    );

    if (status === Status.Failure) {
        return <div>Error</div>;
    }

    return (
        <>
            <CssBaseline />
            <div className='px-4'>
                <ResumeSubscription subscription_id={params.subscription_id} />
            </div>
        </>
    );
};

export default ResumeSubscriptionPage;
