'use server';

import WLIntroQuestion1Component from '@/app/components/intake-v2/pages/wl-intro-question-1';
import QuestionIDComponentPreSignupV3 from '@/app/components/intake-v3/pages/question-id-pre-signup';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';

interface Props {
    params: {
        product: string;
    };
    searchParams: {
        pvn: any;
        st: any;
        psn: any;
        sd: any; //sd is important << as it is the discountable code.
        ub: any; // if coming from unbounce, this will be set to the landing page they're coming from
        /**
         * @Nathan > I wanted to make a simple, but not obvious indicator for the discounts:
         * Therefore 23c == 'Yes, do discount' and anything else is 'No, do not discount'
         */
    };
}

export default async function WLBMI({ params, searchParams }: Props) {
    //Immediately check user session presence
    const question = {
        type: 'custom',
        question: 'What is your current height and weight?',
        skippable: false,
        custom_name: 'bmi',
    };
    return (
        <>
            <QuestionIDComponentPreSignupV3
                current_question={question}
                session_storage_key="wl-bmi"
                user_id=""
            />
        </>
    );
}
