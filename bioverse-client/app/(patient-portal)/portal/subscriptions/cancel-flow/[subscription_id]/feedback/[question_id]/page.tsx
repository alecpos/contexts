import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { redirect } from 'next/navigation';
import {
    getScriptDetails,
    getSubscriptionDetails,
} from '@/app/utils/actions/subscriptions/subscription-actions';
import CancelFeedback from '@/app/components/patient-portal/subscriptions/components/CancelFeedback/CancelFeedback';
import { getAccountProfileData } from '@/app/utils/database/controller/profiles/profiles';
import CancelFeedbackQuestion from '@/app/components/patient-portal/subscriptions/components/CancelSubscription/feedback/CancelFeedbackQuestion';
import { Status } from '@/app/types/global/global-enumerators';

interface CancelFeedbackPageProps {
    params: {
        subscription_id: number;
        question_id: number;
    };
}

const CancelFeedbackPage = async ({ params }: CancelFeedbackPageProps) => {
    const { data: activeSession } = await readUserSession();
    if (!activeSession.session) {
        return redirect('/login?originalRef=%2Fportal%2Forder-history');
    }

    const user_id = (await readUserSession()).data.session?.user.id;

    const current_question = params.question_id;

    const { status, data: subscriptionData } = await getSubscriptionDetails(
        params.subscription_id
    );
    if (status === Status.Failure) {
        return <div>Error</div>;
    }

    const product_href = subscriptionData.href;

    return (
        <>
            <CssBaseline />
            <div className=''>
                <CancelFeedbackQuestion
                    subscription_id={params.subscription_id}
                    subscription={subscriptionData}
                    product_href={product_href}
                    current_question={current_question}
                    user_id={user_id!}
                />
            </div>
        </>
    );
};

export default CancelFeedbackPage;
