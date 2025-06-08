import RefillFeedback from '@/app/components/patient-portal/subscriptions/components/ChangeRefillDate/feedback/RefillFeedback';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { getQuestionsForProduct_with_type } from '@/app/utils/database/controller/questionnaires/questionnaire';
import { getSubscriptionDetails } from '@/app/utils/actions/subscriptions/subscription-actions';
import { Status } from '@/app/types/global/global-enumerators';
import { CssBaseline } from '@mui/material';
import { redirect } from 'next/navigation';

import React from 'react';

interface RefillFeedbackPageProps {
    params: {
        subscription_id: number;
    };
}
const RefillFeedbackPage = async ({ params }: RefillFeedbackPageProps) => {
    const { data: activeSession } = await readUserSession();
    if (!activeSession.session) {
        return redirect('/login?originalRef=%2Fportal%2Forder-history');
    }
    const userId = activeSession.session.user.id;

    const { status, data: subscriptionData } = await getSubscriptionDetails(
        params.subscription_id
    );
    if (status === Status.Failure) {
        return <div>Error</div>;
    }

    const product_href = subscriptionData.href;

    const questions_array = await getQuestionsForProduct_with_type(
        product_href,
        'refill'
    );

    return (
        <>
            <CssBaseline />
            <div className='px-4 '>
                <RefillFeedback
                    subscription_id={params.subscription_id}
                    subscription={subscriptionData}
                    user_id={userId}
                    product_href={product_href}
                    question_id={questions_array[0].question_id}
                />
            </div>
        </>
    );
};

export default RefillFeedbackPage;
