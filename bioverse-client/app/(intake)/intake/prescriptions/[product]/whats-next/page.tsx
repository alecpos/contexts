import Error from '@/app/(intake)/error';
import BMISummaryComponent from '@/app/components/intake-v2/pages/bmi-summary';
import WhatsNextComponent from '@/app/components/intake-v3/pages/wl-whats-next';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { getQuestionAnswerWithQuestionID } from '@/app/utils/database/controller/questionnaires/questionnaire';
import {
    getQuestionAnswersForBMI,
    getQuestionAnswersForGoalBMI,
} from '@/app/utils/database/controller/clinical_notes/clinical_notes_v2';
import { getOrderForProduct } from '@/app/utils/database/controller/orders/orders-api';
import { redirect } from 'next/navigation';

interface BMIProps {
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

export default async function WhatsNextPage({
    searchParams,
    params,
}: BMIProps) {
    const { data: session, error } = await readUserSession();

    if (!session) {
        return redirect(
            `/intake/prescriptions/${params.product}/registration?pvn=${searchParams.pvn}&st=${searchParams.st}&sd=${searchParams.sd}`
        );
    }

    return <WhatsNextComponent />;
}
