'use server';
import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { redirect } from 'next/navigation';
import { getAccountProfileData } from '@/app/utils/database/controller/profiles/profiles';
import { Status } from '@/app/types/global/global-enumerators';
import ManageSubscription from '@/app/components/patient-portal/subscriptions/components/ManageSubscription/ManageSubscription';
import {
    getScriptDetails,
    getSubscriptionDetails,
} from '@/app/utils/actions/subscriptions/subscription-actions';
import {
    checkIsRenewalOrder,
    getOrderDetailsById,
} from '@/app/utils/database/controller/orders/orders-api';
import { OrderStatus } from '@/app/types/orders/order-types';

interface SubscriptionDetailsProps {
    params: {
        subscription_id: number;
    };
}

const ManageSubscriptionPage = async ({ params }: SubscriptionDetailsProps) => {
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

    const order_id = subscriptionData.order_id;

    const { data: isRenewalOrder, error: renewOrderError } =
        await checkIsRenewalOrder(order_id);

    let cancelRoute;
    if (isRenewalOrder) {
        //Is Renewal Order
        const willBeCharged = await getScriptDetails(params.subscription_id);

        if (willBeCharged) {
            cancelRoute = `/portal/subscriptions/cancel-flow/${params.subscription_id}/information`;
        } else {
            cancelRoute = `/portal/subscriptions/cancel-flow/${params.subscription_id}/cancel`;
        }
    } else {
        //Is regular first order
        const { data, error } = await getOrderDetailsById(order_id);

        const orderStatus = data.order_status;

        if (
            orderStatus == OrderStatus.ApprovedCardDown ||
            orderStatus == OrderStatus.ApprovedCardDownFinalized ||
            orderStatus == OrderStatus.PaymentCompleted
        ) {
            cancelRoute = `/portal/subscriptions/cancel-flow/${params.subscription_id}/information`;
        } else {
            cancelRoute = `/portal/subscriptions/cancel-flow/${params.subscription_id}/cancel`;
        }
    }

    return (
        <>
            <div className='px-4'>
                <ManageSubscription
                    subscription_id={params.subscription_id}
                    cancelRoute={cancelRoute}
                    subscription={subscriptionData}
                />
            </div>
        </>
    );
};

export default ManageSubscriptionPage;
