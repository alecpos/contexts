import CancelSubscriptionConfirm from '@/app/components/patient-portal/subscriptions/components/CancelSubscription/CancelSubscriptionConfirm';
import ChangeRefillOffer from '@/app/components/patient-portal/subscriptions/components/CancelSubscription/refill/ChangeRefillOffer';
import { retrieveStripeSubscription } from '@/app/services/stripe/subscriptions';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { getSubscriptionDetails } from '@/app/utils/actions/subscriptions/subscription-actions';
import { convertEpochToDate } from '@/app/utils/functions/dates';
import { Status } from '@/app/types/global/global-enumerators';
import { CssBaseline } from '@mui/material';
import { redirect } from 'next/navigation';
import React from 'react';

interface CancelSubscriptionConfirmPageProps {
    params: {
        subscription_id: number;
    };
}
const ChangeRefillOfferPage = async ({
    params,
}: CancelSubscriptionConfirmPageProps) => {
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
    const stripe_subscription_id = subscriptionData.stripe_subscription_id;

    const stripeSubsriptionData = JSON.parse(
        await retrieveStripeSubscription(stripe_subscription_id)
    );

    const refillDate = convertEpochToDate(
        stripeSubsriptionData.current_period_end
    );

    return (
        <>
            <CssBaseline />
            <div className=''>
                <ChangeRefillOffer
                    subscription_id={params.subscription_id}
                    subscription={subscriptionData}
                    date={refillDate}
                />
            </div>
        </>
    );
};

export default ChangeRefillOfferPage;
