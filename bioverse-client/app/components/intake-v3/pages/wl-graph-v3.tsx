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
import LoadingScreen from '../../global-components/loading-screen/loading-screen';
import { BaseOrder } from '@/app/types/orders/order-types';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import { useMediaQuery } from '@mui/material';

interface WLChecklistProps {
    user_body_weight: number;
    first_name: string;
    product_name: string;
    orderData: BaseOrder;
    product_href: string;
}

export default function WLGraphContainer({
    user_body_weight,
    first_name,
    product_name,
    orderData,
    product_href,
}: WLChecklistProps) {
    const isNotMobile = useMediaQuery('(min-width:640px)');
    const router = useRouter();
    const url = useParams();
    const searchParams = useSearchParams();
    const search = searchParams.toString();
    const fullPath = usePathname();
    // console.log('PRODUCTHREF HERE', product_href);
    const { product_href: productParam } = getIntakeURLParams(
        url,
        searchParams
    );
    const [isVerifyEmailDialogOpen, setIsVerifyEmailDialogOpen] =
        useState(false);
    const [isVerifyLoginDialogOpen, setIsVerifyLoginDialogOpen] =
        useState(false);

    useEffect(() => {
        if (searchParams.get('verifyEmail') === 'true') {
            setIsVerifyEmailDialogOpen(true);
        }
        if (searchParams.get('verifyLogin') === 'true') {
            setIsVerifyLoginDialogOpen(true);
        }
    }, [searchParams]);

    const handleCloseVerifyEmailDialog = () => {
        setIsVerifyEmailDialogOpen(false);
    };

    const handleCloseVerifyLoginDialog = () => {
        setIsVerifyLoginDialogOpen(false);
    };

    const pushToNextRoute = () => {
        const nextRoute = getNextIntakeRoute(fullPath, productParam, search);
        router.push(
            `/intake/prescriptions/${productParam}/${nextRoute}?${search}`
        );
    };

    useEffect(() => {
        if (user_body_weight === -1) {
            pushToNextRoute();
        }
    }, []);

    if (user_body_weight === -1) {
        return <LoadingScreen />;
    }

    const getCompoundType = (href: string) => {
        if (SEMAGLUTIDE_PRODUCTS.includes(href as PRODUCT_HREF)) {
            return 1; //1 is semaglutide
        } else if (TIRZEPATIDE_PRODUCTS.includes(href as PRODUCT_HREF)) {
            return 2; //2 is tirzepatide
        }

        return 0; //0 means something went wrong
    };

    return (
        <>
            <div
                className={`justify-center items-start flex animate-slideRight mt-[1.25rem] md:mt-[48px]`}
                style={{
                    filter:
                        isVerifyEmailDialogOpen || isVerifyLoginDialogOpen
                            ? 'blur(8px)'
                            : 'none',
                    transition: 'filter 0.3s ease',
                    zIndex:
                        isVerifyEmailDialogOpen || isVerifyLoginDialogOpen
                            ? 10
                            : 1,
                }}
            >
                <div className='flex flex-row gap-8'>
                    <div className='flex flex-col gap-3'>
                        <BioType className={`inter-h5-question-header `}>
                            Break the cycle, reach your goals!
                        </BioType>

                        <div className='mt-2 md:mt-4'>
                            <WLPaper
                                user_body_weight={user_body_weight}
                                product_href={product_href}
                            />
                        </div>

                        <div className='w-[100%]'>
                            <WeightLossGraph
                                user_body_weight={user_body_weight}
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
        </>
    );
}
