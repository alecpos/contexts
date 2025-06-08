'use server';

import WLFemaleSafetyComponent from '@/app/components/intake-v3/pages/wl-female-safety';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { getOrderForProduct } from '@/app/utils/database/controller/orders/orders-api';
import { redirect } from 'next/navigation';

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

export default async function WLFemaleSafety({ params, searchParams }: Props) {
    const { data: session, error } = await readUserSession();

    if (!session) {
        return redirect(
            `/intake/prescriptions/${params.product}/registration?pvn=${searchParams.pvn}&st=${searchParams.st}&sd=${searchParams.sd}`
        );
    }

    const user_id = session.session?.user.id!;
    const orderData = await getOrderForProduct(params.product, user_id);

    if (!orderData) {
        return redirect(
            `/intake/prescriptions/${params.product}/registration?pvn=${searchParams.pvn}&st=${searchParams.st}&sd=${searchParams.sd}`
        );
    }
    return (
        <>
            <WLFemaleSafetyComponent orderData={orderData} />
        </>
    );
}
