'use server';

import IntakeLoadingComponent from '@/app/components/intake-v2/loading/intake-loading';
import PreQuestionComponent from '@/app/components/intake-v3/pages/pre-question';
import {
    getPreQuestionsForProduct_with_Version,
    getQuestionsForProduct_with_Version,
} from '@/app/utils/database/controller/questionnaires/questionnaire';
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
    /**
     * Make async call to fetch data.
     */

    return <PreQuestionComponent product_href={params.product} />;
}
