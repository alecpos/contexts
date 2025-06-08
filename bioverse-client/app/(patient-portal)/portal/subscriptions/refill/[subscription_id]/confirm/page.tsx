import {
    getStaticRefillDate,
    getStripeSubscription,
} from '@/app/(administration)/admin/stripe-api/stripe-api-actions';
import ConfirmRefillData from '@/app/components/patient-portal/subscriptions/components/ChangeRefillDate/confirm/ConfirmRefillData';
import {
    getStripeSubscriptionFromSubscription,
    retrieveStripeSubscription,
} from '@/app/services/stripe/subscriptions';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { getSubscriptionDetails } from '@/app/utils/actions/subscriptions/subscription-actions';
import { getProductVariant } from '@/app/utils/database/controller/products/products';
import {
    createFirstTimeRenewalOrder,
    createUpcomingRenewalOrder,
} from '@/app/utils/database/controller/renewal_orders/renewal_orders';
import { convertEpochToDate } from '@/app/utils/functions/dates';
import { CssBaseline } from '@mui/material';
import { redirect, useSearchParams } from 'next/navigation';
import React from 'react';

interface ConfirmRefillPageProps {
    params: {
        subscription_id: number;
    };
}
const ConfirmRefillPage = async ({ params }: ConfirmRefillPageProps) => {
    const subscription_id = params.subscription_id;
    const { status, data: subscriptionData } = await getSubscriptionDetails(
        subscription_id,
    );
    const stripe_subscription_id = subscriptionData.stripe_subscription_id;

    const oldRefillDate = await getStaticRefillDate(stripe_subscription_id);

    const product_href = subscriptionData.href;

    const productVariant = await (
        await getProductVariant(product_href)
    ).variant[0];

    const sessionData = (await readUserSession()).data.session;

    if (!sessionData) {
        return redirect('/');
    }

    const userId = sessionData.user.id!;

    const imageURL = `${process.env.NEXT_PUBLIC_PDP_MAIN_IMAGE_KEY}${subscriptionData.image_ref[0]}`;

    return (
        <>
            <CssBaseline />
            <div className="">
                <ConfirmRefillData
                    stripe_subscription_id={stripe_subscription_id}
                    subscription_id={subscription_id}
                    imageUrl={imageURL}
                    oldRefillDate={oldRefillDate}
                    subscriptionData={subscriptionData}
                    productVariant={productVariant}
                    userId={userId}
                />
            </div>
        </>
    );
};

export default ConfirmRefillPage;
