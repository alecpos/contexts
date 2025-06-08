import ChangeRefillDate from '@/app/components/patient-portal/subscriptions/components/ChangeRefillDate/ChangeRefillDate';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { getSubscriptionDetails } from '@/app/utils/actions/subscriptions/subscription-actions';
import { CssBaseline } from '@mui/material';
import { Status } from '@/app/types/global/global-enumerators';
import { redirect } from 'next/navigation';
import React from 'react';
import { retrieveStripeSubscription } from '@/app/services/stripe/subscriptions';
import { convertEpochToDate } from '@/app/utils/functions/dates';
import {
    getStaticRefillDate,
    getStripeSubscription,
} from '@/app/(administration)/admin/stripe-api/stripe-api-actions';

interface RefillPageProps {
    params: {
        subscription_id: number;
    };
}
const RefillPrescriptionPage = async ({ params }: RefillPageProps) => {
    const { data: activeSession } = await readUserSession();
    if (!activeSession.session) {
        return redirect('/login?originalRef=%2Fportal%2Forder-history');
    }

    const { status, data: subscriptionData } = await getSubscriptionDetails(
        params.subscription_id,
    );
    if (status === Status.Failure) {
        return <div>Error</div>;
    }
    const stripe_subscription_id = subscriptionData.stripe_subscription_id;

    const subscription = await getStripeSubscription(
        subscriptionData.stripe_subscription_id,
    );

    const staticRefillDate = await getStaticRefillDate(stripe_subscription_id);
    const refillDate = convertEpochToDate(subscription.current_period_end);

    return (
        <>
            <CssBaseline />
            <div className="px-4 ">
                <ChangeRefillDate
                    staticRefillDate={staticRefillDate}
                    subscription_id={params.subscription_id}
                    refillDate={refillDate}
                />
            </div>
        </>
    );
};

export default RefillPrescriptionPage;
