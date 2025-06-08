'use client';
import { useState } from 'react';
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

interface Props {}

export default function IntakeLoginV3Component({}: Props) {
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

    const userLoginPush = () => {
        router.push(
            `/intake/prescriptions/${product_href}/${nextRoute}?${search}`,
        );
    };

    return (
        <div className={`w-full animate-slideRight`}>
            <div className="w-full flex flex-row gap-24 justify-center">
                <div className="" style={{ animationDelay: '0.5s' }}>
                    <DynamicIntakeLogin
                        currentPath={encodedRedirectPath}
                        setIsOnSignUp={setIsOnSignUp}
                        isWeightLoss={WEIGHT_LOSS_PRODUCT_HREF.includes(
                            product_href,
                        )}
                        userLoginPush={userLoginPush}
                    />
                </div>
            </div>
        </div>
    );
}
