'use server';

import WLReviewsComponent from '@/app/components/intake-v3/pages/wl-reviews-v3';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
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

export default async function WLReviews({ params, searchParams }: Props) {
    //Immediately check user session presence
    const user_id = (await readUserSession()).data.session?.user.id!;

    return (
        <>
            <WLReviewsComponent
                user_id={user_id}
                product_href={params.product as PRODUCT_HREF}
            />
        </>
    );
}
