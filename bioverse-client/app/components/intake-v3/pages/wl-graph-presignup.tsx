'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams,
} from 'next/navigation';
import { getNextIntakeRoute } from '@/app/utils/functions/intake-route-controller';
import { getIntakeURLParams } from '../intake-functions';
import { IntakeButtonWithLoading } from '../buttons/loadable-button';
import WeightLossGraph from '../wl-graph/wl-graph-component-old';
import WLPaper from '../wl-graph/wl-graph-info-paper-old';
import {
    SEMAGLUTIDE_PRODUCTS,
    TIRZEPATIDE_PRODUCTS,
} from '../constants/constants';
import { useEffect, useState } from 'react';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import WLEmailVerificationDialog from '../wl-graph/wl-email-verification-dialog';
import useSessionStorage from '@/app/utils/hooks/session-storage/useSessionStorage';
import useSWR from 'swr';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import WLRegistrationPreGraphDialog from '../wl-graph/wl-registration-pre-graph-dialog';
import LoadingScreen from '../../global-components/loading-screen/loading-screen';

interface WLChecklistProps {
    product_href: string;
}

export default function WLGraphContainerPreSignup({
    product_href,
}: WLChecklistProps) {
    const router = useRouter();
    const url = useParams();
    const searchParams = useSearchParams();
    const search = searchParams.toString();
    const fullPath = usePathname();
    const { product_href: productParam } = getIntakeURLParams(
        url,
        searchParams
    );
    const [bmi, setBmi] = useSessionStorage('wl-bmi', {
        question: 'What is your current height and weight',
        answer: '',
        formData: ['', '', ''],
    });

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const { data, isLoading, error } = useSWR('user-session', () =>
        readUserSession()
    );

    useEffect(() => {
        if (data?.data.session?.user.id) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, [data]);

    if (isLoading) {
        return (
            <div>
                <LoadingScreen />
            </div>
        );
    }

    const handleCloseRegistrationDialog = () => {
        setIsLoggedIn(true);
    };

    const pushToNextRoute = async () => {
        const nextRoute = getNextIntakeRoute(fullPath, productParam, search);

        router.push(
            `/intake/prescriptions/${productParam}/${nextRoute}?${search}`
        );
    };

    const getCompoundType = (href: string) => {
        if (
            SEMAGLUTIDE_PRODUCTS.includes(product_href as PRODUCT_HREF) ||
            product_href === PRODUCT_HREF.WEIGHT_LOSS
        ) {
            return 1; //1 is semaglutide
        } else if (
            TIRZEPATIDE_PRODUCTS.includes(product_href as PRODUCT_HREF)
        ) {
            return 2; //2 is tirzepatide
        }
        return 0; //0 means something went wrong
    };

    return (
        <>
            <div
                key={isLoggedIn ? 'logged-in' : 'logged-out'}
                className={`justify-center items-start flex flex-col mt-[1.25rem] md:mt-[48px]`}
                style={{
                    filter: !isLoggedIn ? 'blur(19px)' : 'none',
                    // transition: 'filter 0.3s ease',
                    zIndex: !isLoggedIn ? 10 : 1,
                }}
            >
                <div className='flex flex-col gap-8 w-full'>
                    <div className='flex flex-col gap-3 w-full'>
                        <BioType className={`inter-h5-question-header `}>
                            Break the cycle, reach your goals!
                        </BioType>

                        <div className='mt-2 md:mt-4'>
                            <WLPaper
                                user_body_weight={Number(bmi.formData[2])}
                                product_href={product_href}
                            />
                        </div>

                        <div className='w-[100%] overflow-hidden'>
                            <WeightLossGraph
                                user_body_weight={Number(bmi.formData[2])}
                                product_href={product_href}
                            />
                        </div>

                        <div
                            className={`flex justify-center animate-slideRight `}
                        >
                            <div className='w-full'>
                                <IntakeButtonWithLoading
                                    fullWidth={true}
                                    button_text={'Continue'}
                                    custom_function={pushToNextRoute}
                                />
                            </div>
                        </div>

                        {getCompoundType(product_href) === 1 ? (
                            <div>
                                <BioType className='inter-tight !text-[16px] text-[#00000099]'>
                                    This estimate derives from a New England J
                                    double-blind trial which showed that
                                    individuals using semaglutide lost up to
                                    16.9% of their body weight over a 68 week
                                    period. Treatment was given in addition to
                                    diet and exercise.
                                </BioType>

                                <BioType className='inter-tight !text-[16px] text-[#00000099]'>
                                    Source: Once-Weekly Semaglutide in Adults
                                    with Overweight or Obesity. John P.H.
                                    Wilding, D.M., Rachel L. Batterham, M.B.,
                                    B.S., Ph.D. et al.
                                </BioType>
                            </div>
                        ) : (
                            <div>
                                <BioType className='inter-tight text-xs md:text-sm leading-none text-[#00000099]'>
                                    This estimate derives from Eli Lilly&apos;s
                                    SURMOUNT-4 clinical trial results which
                                    showed 20% average weight loss over 36 weeks
                                    among people utilized a maximum tolerated
                                    dose of 10 mg or 15 mg once-weekly. The
                                    starting dose of 2.5 mg tirzepatide was
                                    increased by 2.5 mg every four weeks until
                                    the maximum tolerated dose was achieved.
                                    Treatment was given in addition to diet and
                                    exercise.
                                </BioType>
                            </div>
                        )}

                        {/* )} */}
                    </div>
                </div>
            </div>
            {/* Only render the dialog when the user is not logged in */}
            {!isLoggedIn && (
                <WLEmailVerificationDialog
                    onClose={handleCloseRegistrationDialog}
                    open={true}
                >
                    <WLRegistrationPreGraphDialog product_href={product_href} />
                </WLEmailVerificationDialog>
            )}
        </>
    );
}
