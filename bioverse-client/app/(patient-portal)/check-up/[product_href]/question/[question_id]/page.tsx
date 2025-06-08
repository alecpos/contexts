'use server';

import React, { Suspense } from 'react';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { redirect } from 'next/navigation';
import {
    getLastestActionItemForProduct,
    isUserEligible,
} from '@/app/utils/database/controller/action-items/action-items-actions';
import CheckupQuestion from '@/app/components/patient-portal/check-up/question/CheckupQuestion';
import {
    getQADataByQuestionIdAndSessionId,
    getQuestionnaireJunctionByQuestionnaireId,
} from '@/app/utils/database/controller/questionnaires/questionnaire';
import CheckupProgressBar from '@/app/components/patient-portal/check-up/question/CheckupProgressBar';
import {
    getCheckupQuestionnaireIdForProduct,
    getQuestionnaireVersionsForProduct,
} from '@/app/utils/database/controller/products/products';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';

interface CheckUpQuestionPageProps {
    params: {
        product_href: string;
        question_id: number;
    };
}

const CheckUpQuestionPage = async ({ params }: CheckUpQuestionPageProps) => {
    const { data: activeSession } = await readUserSession();
    if (!activeSession.session) {
        return redirect('/login?originalRef=%2Fportal%2Forder-history');
    }

    const userId = activeSession.session.user.id;
    const product_href = getProductHref(params.product_href);

    const lastActionItem = await getLastestActionItemForProduct(
        userId,
        product_href
    );

    if (!lastActionItem) {
        redirect('/portal/account-information');
    }

    const questionnaire_session_id = lastActionItem?.questionnaire_session_id;

    if (lastActionItem && !lastActionItem.questionnaire_session_id) {
        return redirect(`/check-up/${product_href}`);
    }

    const checkupQuestionData = await getQADataByQuestionIdAndSessionId(
        params.question_id,
        questionnaire_session_id!
    );

    if (!checkupQuestionData) {
        console.log('No checkup question data found');
        return redirect('/portal/account-information');
    }

    const questionnaire_id = await getCheckupQuestionnaireIdForProduct(
        product_href as PRODUCT_HREF
    );

    if (!questionnaire_id) {
        console.log('No questionnaire id found');
        return redirect('/portal/account-information');
    }

    const questionnaire_junction =
        await getQuestionnaireJunctionByQuestionnaireId(questionnaire_id);

    if (!questionnaire_junction) {
        console.log('No questionnaire junction found');
        return redirect('/portal/account-information');
    }

    return (
        <Suspense>
            <div className='w-full bg-[#F7F8F8] flex flex-col items-center justify-center  flex-grow'>
                <CheckupProgressBar
                    quesionnaire_junction={questionnaire_junction}
                    current_question_id={params.question_id}
                />
                <CheckupQuestion
                    product_href={product_href}
                    CheckUpQuestionData={
                        {
                            question_record: checkupQuestionData.question,
                            answer_record: checkupQuestionData.answer,
                        } as CheckupQuestionDataSSR
                    }
                    userId={userId}
                    sessionId={questionnaire_session_id!}
                    question_junction={questionnaire_junction}
                    questionnaire_id={questionnaire_id}
                    last_action_item={lastActionItem}
                    subscription_id={lastActionItem.subscription_id}
                />
            </div>
        </Suspense>
    );
};

export default CheckUpQuestionPage;

const getProductHref = (questionnaire_name: string) => {
    if (questionnaire_name.includes('-checkup-')) {
        return questionnaire_name.split('-')[0];
    }
    return questionnaire_name;
};
