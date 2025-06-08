'use server';

import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { getOrderForProduct } from '@/app/utils/database/controller/orders/orders-api';
import { getQuestionsForProduct_with_Version } from '@/app/utils/database/controller/questionnaires/questionnaire';
import { createQuestionnaireSessionForOrder } from '@/app/utils/database/controller/questionnaires/questionnaire_sessions';
import { redirect } from 'next/navigation';

/**
 * @author Nathan Cho
 * Goal of page:
 *  Make a call to supabase to fetch array list of questions to send user to.
 *  Be a transition screen that holds pre-screen information prior to going into questions.
 *
 */

interface QuestionsProps {
    params: {
        product: string;
    };
    searchParams: {
        pvn: any; //variant index
        st: any; //subscription cadence text
        pvt: any; //prescription variant text
        sd: any; //sd is important << as it is the discountable code.
        ub: any; // if coming from unbounce, this will be set to the landing page they're coming from
        /**
         * @Nathan > I wanted to make a simple, but not obvious indicator for the discounts:
         * Therefore 23c == 'Yes, do discount' and anything else is 'No, do not discount'
         */
    };
}
export default async function IntakeQuestionsPage({
    params,
    searchParams,
}: QuestionsProps) {
    const session = await readUserSession();
    const user_id = session?.data?.session?.user?.id;

    if (!user_id) {
        // Handle case where there is no user session
        return redirect(
            `/login?originalRef=%2Fintake%2Fprescription%2F${params.product}`
        );
    }

    const order = await getOrderForProduct(params.product, user_id);

    if (order && !order.questionnaire_session_id) {
        await createQuestionnaireSessionForOrder(user_id, order.id);
    }

    /**
     * Make async call to fetch data.
     */
    const questionArr = await getQuestionsForProduct_with_Version(
        params.product,
        0
    );
    return redirect(
        `/intake/prescriptions/${params.product}/questions-v3/${questionArr[0].question_id}?pvn=${searchParams.pvn}&st=${searchParams.st}&sd=${searchParams.sd}`
    );
}
