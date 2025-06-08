'use server';
import QuestionIDComponentV3 from '@/app/components/intake-v3/pages/question-id-v3';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { getOrderForProduct } from '@/app/utils/database/controller/orders/orders-api';
import { getAccountProfileData } from '@/app/utils/database/controller/profiles/profiles';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

interface QuestionNumberProps {
    params: {
        product: string;
        question_id: number;
    };
    searchParams: {
        [key: string]: string;
    };
}

export default async function IntakeQuestionsPage({
    params,
    searchParams,
}: QuestionNumberProps) {
    const session = await readUserSession();
    const user_id = session?.data?.session?.user?.id;
    const current_question = params.question_id;

    if (!user_id) {
        // Handle case where there is no user session
        return redirect(
            `/login?originalRef=%2Fintake%2Fprescription%2F${params.product}`
        );
    }

    const userProfileData = await getAccountProfileData(user_id);

    const order = await getOrderForProduct(params.product, user_id);
    const session_id = order?.questionnaire_session_id;

    if (order && !order.questionnaire_session_id) {
        return redirect(
            `/intake/prescriptions/${params.product}/questions-v3?pvn=${searchParams.pvn}&st=${searchParams.st}&sd=${searchParams.sd}`
        );
    }

    return (
        <Suspense>
            <QuestionIDComponentV3
                current_question={current_question}
                user_id={user_id}
                userProfileData={userProfileData}
                session_id={session_id}
            />
        </Suspense>
    );
}
