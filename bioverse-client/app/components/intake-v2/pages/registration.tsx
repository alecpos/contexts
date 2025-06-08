'use client';
import { useState } from 'react';
import { usePathname, useRouter, useParams } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { getIntakeURLParams } from '../intake-functions';
import { getNextIntakeRoute } from '@/app/utils/functions/intake-route-controller';
import dynamic from 'next/dynamic';
import { WEIGHT_LOSS_PRODUCT_HREF } from '../constants/constants';
import LoadingScreen from '../../global-components/loading-screen/loading-screen';

const DynamicIntakeLogin = dynamic(
    () => import('../registration/intake-login-form/intake-login-form'),
    {
        loading: () => <LoadingScreen />,
    }
);

const DynamicIntakeSignup = dynamic(
    () => import('../registration/intake-signup-form/intake-signup-form'),
    {
        loading: () => <LoadingScreen />,
    }
);

interface Props {
    session_data: any;
    search_param_data: {
        variant_index: any;
        subscription_cadence: any;
        discountable: boolean;
    };
}

export default function IntakeRegistrationV2({ session_data }: Props) {
    const [isOnSignUp, setIsOnSignUp] = useState<boolean>(true); //determines whether to render sign up or login component

    const router = useRouter();
    const url = useParams();
    const searchParams = useSearchParams();
    const search = searchParams.toString();
    const { product_href } = getIntakeURLParams(url, searchParams);

    const fullPath = usePathname();
    const nextRoute = getNextIntakeRoute(fullPath, product_href, search);
    // useEffect(() => {
    //     if (currentSession) {
    //         router.push(
    //             `/intake/prescriptions/${product_href}/${nextRoute}?${search}`
    //         );
    //     }
    // }, [currentSession]);

    const redirectPath = `/intake/prescriptions/${product_href}/${nextRoute}?${search}`;

    const encodedRedirectPath = encodeURIComponent(redirectPath);

    const userSignUpPush = () => {
        router.push(
            `/intake/prescriptions/${product_href}/${nextRoute}?${search}&nu=30b`
        );
    };

    const userLoginPush = () => {
        router.push(
            `/intake/prescriptions/${product_href}/${nextRoute}?${search}`
        );
    };

    return (
        <div className={`w-full animate-slideRight`}>
            <div className='w-full flex flex-row gap-24 justify-center'>
                <div className='' style={{ animationDelay: '0.5s' }}>
                    {isOnSignUp ? (
                        <DynamicIntakeSignup
                            currentPath={encodedRedirectPath}
                            setIsOnSignUp={setIsOnSignUp}
                            product_href={product_href}
                            userSignUpPush={userSignUpPush}
                        />
                    ) : (
                        <DynamicIntakeLogin
                            currentPath={encodedRedirectPath}
                            setIsOnSignUp={setIsOnSignUp}
                            isWeightLoss={[...WEIGHT_LOSS_PRODUCT_HREF, 'weight-loss'].includes(
                                product_href
                            )}
                            userLoginPush={userLoginPush}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
