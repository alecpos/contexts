'use server';

import WLIntroOptionsClientComponent from '@/app/components/intake-v2/pages/wl-intro-options';
import WLIntroSpecialistsClientComponent from '@/app/components/intake-v2/pages/wl-intro-specialists';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
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

export default async function WLIntroOptionsPage({
    params,
    searchParams,
}: Props) {
    //Immediately check user session presence

    // Safely construct search params string, filtering out undefined/null values
    const validSearchParams = Object.entries(searchParams).reduce(
        (acc, [key, value]) => {
            if (value !== undefined && value !== null) {
                acc[key] = value;
            }
            return acc;
        },
        {} as Record<string, string>
    );

    const searchParamsString = new URLSearchParams(
        validSearchParams
    ).toString();
    const newPath = `/intake/prescriptions/${
        params.product
    }/wl-intro-options-v3${searchParamsString ? `?${searchParamsString}` : ''}`;

    return redirect(newPath);

    return (
        <>
            <WLIntroOptionsClientComponent />
        </>
    );
}
