'use client';
import UpNextHealthHistoryTransition from '@/app/components/intake-v3/pages/up-next-health-v3-ap';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';

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

export default function UpNextHealthPage({ params, searchParams }: Props) {
    const router = useRouter();
    const urlSearchParams = useSearchParams();
    const [isButtonLoading, setIsButtonLoading] = useState<boolean>(false);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const getUserId = async () => {
            const session = await readUserSession();
            if (session.data.session?.user.id) {
                setUserId(session.data.session.user.id);
            }
        };
        getUserId();
    }, []);

    const handleContinueButton = async () => {
        setIsButtonLoading(true);
        
        try {
            console.log('DEBUG - Before setting question_set_version:', {
                product: params.product,
                currentVersion: localStorage.getItem('question_set_version'),
                isNadInjection: params.product === PRODUCT_HREF.NAD_INJECTION
            });

            // Set question set version for NAD Injection
            if (params.product === PRODUCT_HREF.NAD_INJECTION) {
                localStorage.setItem('question_set_version', '3'); //delete this since we've made the new question set the default
                console.log('DEBUG - After setting question_set_version:', {
                    newVersion: localStorage.getItem('question_set_version')
                });
            }
            
            // Build the query string from existing search params
            const queryString = urlSearchParams.toString();
            
            console.log('DEBUG - Navigation:', {
                queryString,
                nextRoute: `/intake/prescriptions/${params.product}/questions-v3?${queryString}`,
                questionSetVersion: localStorage.getItem('question_set_version')
            });
            
            // Navigate to the next page in the flow
            const nextRoute = `/intake/prescriptions/${params.product}/questions-v3?${queryString}`;
            router.push(nextRoute);
        } catch (error) {
            console.error('Navigation error:', error);
            setIsButtonLoading(false);
        }
    };

    return (
        <>
            {userId && (
                <UpNextHealthHistoryTransition />
            )}
        </>
    );
}