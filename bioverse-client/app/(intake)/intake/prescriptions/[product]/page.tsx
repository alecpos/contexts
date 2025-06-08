'use server';

import IntakePreScreen from '@/app/components/intake-v2/pages/pre-screen';

interface PageProps {
    params: {
        product: string;
    };
    searchParams: {
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

export default async function IntakePreScreenPage({ searchParams }: PageProps) {
    const discountable: boolean = searchParams.sd === '23c';

    return (
        <>
            <IntakePreScreen />
        </>
    );
}
