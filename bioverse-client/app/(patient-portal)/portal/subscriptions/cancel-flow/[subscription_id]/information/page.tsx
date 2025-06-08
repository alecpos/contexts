'use server';
import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { redirect } from 'next/navigation';
import { getSubscriptionDetails } from '@/app/utils/actions/subscriptions/subscription-actions';
import { Status } from '@/app/types/global/global-enumerators';
import CancelInformation from '@/app/components/patient-portal/subscriptions/components/CancelInformation/CancelInformation';
import { retrieveStripeSubscription } from '@/app/services/stripe/subscriptions';
import { convertEpochToDate } from '@/app/utils/functions/dates';
import { getLatestRenewalOrderForSubscription } from '@/app/utils/database/controller/renewal_orders/renewal_orders';

interface CancelInformationPageProps {
    params: {
        subscription_id: number;
    };
}

const CancelInformationPage = async ({
    params,
}: CancelInformationPageProps) => {
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

    const nextDate = convertEpochToDate(
        stripeSubsriptionData.current_period_end
    );

    const renewalOrder = await getLatestRenewalOrderForSubscription(
        params.subscription_id
    );

    let orderId;
    if (renewalOrder) {
        orderId = renewalOrder.renewal_order_id;
    } else {
        orderId = String(subscriptionData.order_id);
    }

    return (
        <>
            <CssBaseline />
            <div className=''>
                <CancelInformation
                    subscription_id={params.subscription_id}
                    orderId={orderId}
                    nextDate={nextDate}
                />
            </div>
        </>
    );
};

export default CancelInformationPage;
