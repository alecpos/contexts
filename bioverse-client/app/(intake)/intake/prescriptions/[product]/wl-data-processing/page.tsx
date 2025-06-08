'use server';

import PatientMatch from '@/app/components/intake-v3/pages/patient-match-v3';
import WLDataProcessing from '@/app/components/intake-v3/pages/wl-data-processing';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { getQuestionAnswersForBMI } from '@/app/utils/database/controller/clinical_notes/clinical_notes_v2';

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

export default async function WLDataProcessingPage({
    params,
    searchParams,
}: Props) {
    //Immediately check user session presence
    const user_id = (await readUserSession()).data.session?.user.id!;

    const bmi_data = await getQuestionAnswersForBMI(user_id);
    console.log('BMI DATA', bmi_data);
    return (
        <>
            <WLDataProcessing bmi_data={bmi_data} />
        </>
    );
}
