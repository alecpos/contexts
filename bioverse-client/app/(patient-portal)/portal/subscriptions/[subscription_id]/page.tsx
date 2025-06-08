'use server';
import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { redirect } from 'next/navigation';
import {
    getAccountProfileData,
    getCustomerStripeId,
} from '@/app/utils/database/controller/profiles/profiles';
import { getSubscriptionDetails } from '@/app/utils/actions/subscriptions/subscription-actions';
import SubscriptionDetailsComponent from '@/app/components/patient-portal/subscriptions/components/SubscriptionDetails/SubscriptionDetails';
import { Status } from '@/app/types/global/global-enumerators';
import { fetchCardDigitsForSubscription } from '@/app/services/stripe/subscriptions';

interface SubscriptionDetailsProps {
    params: {
        subscription_id: number;
    };
}

const SubscriptionDetailsPage = async ({
    params,
}: SubscriptionDetailsProps) => {
    const { data: activeSession } = await readUserSession();
    if (!activeSession.session) {
        return redirect('/login?originalRef=%2Fportal%2Forder-history');
    }

    const userId = activeSession.session.user.id;

    const { status, data: subscriptionData } = await getSubscriptionDetails(
        params.subscription_id,
    );

    const { data: stripeCustomerData, error } = await getCustomerStripeId(
        userId,
    );

    var digits;
    //LEGITSCRIPTCODETOREMOVE
    digits = await fetchCardDigitsForSubscription(
        subscriptionData.stripe_subscription_id,
    );

    if (status === Status.Failure) {
        return <div>Error</div>;
    }

    return (
        <SubscriptionDetailsComponent
            subscription={subscriptionData}
            subscription_id={params.subscription_id}
            stripeCustomerId={stripeCustomerData?.stripe_customer_id}
            cardDigits={digits || ''}
            userId={userId}
        />
    );
};

export default SubscriptionDetailsPage;
