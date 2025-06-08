'use client';
import { useEffect, useState } from 'react';
import { usePathname, useRouter, useParams } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { getNextIntakeRoute } from '@/app/utils/functions/intake-route-controller';
import dynamic from 'next/dynamic';
import LoadingScreen from '../../global-components/loading-screen/loading-screen';
import { WEIGHT_LOSS_PRODUCT_HREF } from '../../intake-v2/constants/constants';
import { getIntakeURLParams } from '../../intake-v2/intake-functions';

const DynamicIntakeLogin = dynamic(
    () => import('../registration/intake-login-form/intake-login-form-v3'),
    {
        loading: () => <LoadingScreen />,
    },
);

const DynamicIntakeSignup = dynamic(
    () => import('../registration/intake-signup-form/intake-signup-form-v3'),
    {
        loading: () => <LoadingScreen />,
    },
);

interface Props {
    session_data: any;
    search_param_data: {
        variant_index: any;
        subscription_cadence: any;
        discountable: boolean;
        is_login: string;
    };
}

export default function IntakeRegistrationV3({
    session_data,
    search_param_data,
}: Props) {
    const [isOnSignUp, setIsOnSignUp] = useState<boolean>(
        search_param_data.is_login === 'true' ? false : true,
    ); //determines whether to render sign up or login component

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
    // console.log('SESSION DATA', session_data);
    useEffect(() => {
        if (session_data) {
            const newNextRoute = getNextIntakeRoute(
                fullPath,
                product_href,
                search,
            );

            console.log(newNextRoute);

            router.push(
                `/intake/prescriptions/${product_href}/${newNextRoute}?${search}`,
            );
        }
    });

    const userSignUpPush = () => {
        if (search_param_data.is_login === 'true') {
            router.push(
                `/intake/prescriptions/${product_href}/wl-graph-pre-signup?${search}&nu=30b`,
            );
        } else {
            router.push(
                `/intake/prescriptions/${product_href}/${nextRoute}?${search}&nu=30b`,
            );
        }
    };

    const userLoginPush = () => {
        if (search_param_data.is_login === 'true') {
            router.push(
                `/intake/prescriptions/${product_href}/wl-graph-pre-signup?${search}&nu=30b`,
            );
        } else {
            router.push(
                `/intake/prescriptions/${product_href}/${nextRoute}?${search}&nu=30b`,
            );
        }
    };

    return (
        <div className={`w-full animate-slideRight`}>
            <div className="w-full flex flex-row gap-24 justify-center">
                <div className="" style={{ animationDelay: '0.5s' }}>
                    {isOnSignUp ? (
                        <DynamicIntakeSignup
                            currentPath={encodedRedirectPath}
                            setIsOnSignUp={setIsOnSignUp}
                            isWeightLoss={WEIGHT_LOSS_PRODUCT_HREF.includes(
                                product_href,
                            )}
                            product_href={product_href}
                            userSignUpPush={userSignUpPush}
                        />
                    ) : (
                        <DynamicIntakeLogin
                            currentPath={encodedRedirectPath}
                            setIsOnSignUp={setIsOnSignUp}
                            isWeightLoss={[
                                ...WEIGHT_LOSS_PRODUCT_HREF,
                                'weight-loss',
                            ].includes(product_href)}
                            userLoginPush={userLoginPush}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
