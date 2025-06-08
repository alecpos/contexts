'use client';
import { useEffect, type PropsWithChildren } from 'react';
import IntakeTopNavV2 from '@/app/components/intake-v2/topnav/topnav';
import IntakeBannerV2 from '@/app/components/intake-v2/topnav/banner';
import IntakeBannerV3 from '@/app/components/intake-v3/topnav/banner';
import { UNBLURRED_ROUTES } from '@/app/components/intake-v2/constants/route-constants';
import { usePathname, useSearchParams } from 'next/navigation';
import {
    intakeThemeOptions,
    intakeThemeOptionsV3,
} from '@/app/styles/intake/mui-intake-theme';
import ThemeClient from '@/app/styles/mui-theme-provider';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import useSWR from 'swr';
import {
    AB_TESTS_IDS,
    INTAKE_ROUTE,
} from '@/app/components/intake-v2/types/intake-enumerators';
import NewIntakeTopNav from '@/app/components/intake-v2/topnav/topnav-v2';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';

const isBrowser = () => typeof window !== 'undefined';

const safeLocalStorage = {
    getItem: (key: string) => {
        if (typeof window !== 'undefined') {
            try {
                return window.localStorage.getItem(key);
            } catch (e) {
                console.error('Error reading from localStorage', e);
                return null;
            }
        }
        return null;
    },
    setItem: (key: string, value: string) => {
        if (typeof window !== 'undefined') {
            try {
                window.localStorage.setItem(key, value);
            } catch (e) {
                console.error('Error writing to localStorage', e);
            }
        }
    },
};

export default function Layout({ children }: PropsWithChildren<unknown>) {
    const path = usePathname();
    const searchParams = useSearchParams();
    const {
        data: swr_data,
        error: swr_error,
        isLoading: swr_loading,
    } = useSWR(`session`, () => readUserSession());

    const vwo_test_param = searchParams.get('vwo_test_param');

    useEffect(() => {
        // Only run this effect in the browser
        if (!isBrowser() || !vwo_test_param) return;

        try {
            const existing_vwo_ids = safeLocalStorage.getItem('vwo_ids');
            if (!existing_vwo_ids) {
                safeLocalStorage.setItem(
                    'vwo_ids',
                    JSON.stringify([vwo_test_param])
                );
            } else {
                const current_ids: string[] = JSON.parse(existing_vwo_ids);
                if (!current_ids.includes(vwo_test_param)) {
                    current_ids.push(vwo_test_param);
                    safeLocalStorage.setItem(
                        'vwo_ids',
                        JSON.stringify(current_ids)
                    );
                }
            }
        } catch (error) {
            console.error('Error handling localStorage:', error);
            if (isBrowser()) {
                safeLocalStorage.setItem(
                    'vwo_ids',
                    JSON.stringify([vwo_test_param])
                );
            }
        }
    }, [vwo_test_param]);

    /**
     * @Author Nathan Cho
     * There are some pages that need to not be blurred because the continue button will not be at the bottom of the page.
     */
    const should_not_blur = UNBLURRED_ROUTES.includes(
        path.split('/')[path.split('/').length - 1] as INTAKE_ROUTE
    );

    const isV3IntakeFunnel =
        path.includes('weight-loss') ||
        path.includes('semaglutide') ||
        path.includes('tirzepatide') ||
        path.includes('b12-injection') ||
        path.includes('nad-injection') ||
        path.includes('sermorelin');

    /**
     * @Author Ben Hebert
     * isSpecialIntakePage - for any intake page that doesn't want to deal with the max-width limit in topnav-v2
     */
    const isSpecialIntakePage = (): boolean => {
        const isSpecial =
            path.startsWith('/intake/prescriptions/') &&
            (path.includes('/order-summary-v3') ||
                path.includes('/questions-v3/800'));

        return isSpecial;
    };

    let use_new_topnav = false;
    if (
        path.includes('metformin') ||
        path.includes('nad-nasal-spray') ||
        path.includes('tretinoin') ||
        path.includes('ed-global') ||
        path.includes('semaglutide') ||
        path.includes('tirzepatide') ||
        path.includes('x-chews') ||
        path.includes('x-melts') ||
        path.includes('peak-chews') ||
        path.includes(PRODUCT_HREF.RUSH_MELTS) ||
        path.includes('weight-loss') ||
        path.includes('b12-injection') ||
        path.includes('nad-injection') ||
        path.includes('sermorelin')
    ) {
        use_new_topnav = true;
    }
    let applyGradient = false;
    if (path.includes('general-order-summary')) {
        applyGradient = true;
    }

    const vwo_test_ids: string[] =
        typeof window !== 'undefined'
            ? JSON.parse(localStorage.getItem('vwo_ids') || '[]')
            : [];

    return (
        <>
            {/* This head tag was breaking react */}
            {/* <head></head> */}
            <main
                className={`flex flex-col min-h-screen relative items-center ${
                    isV3IntakeFunnel ? 'bg-[#FAFAFA]' : 'bg-white'
                }`}
            >
                {!path.includes('semaglutide') &&
                    !path.includes('tirzepatide') &&
                    !path.includes('weight-loss') &&
                    !path.includes('b12-injection') &&
                    !path.includes('nad-injection') &&
                    !path.includes('sermorelin') && (
                        <IntakeBannerV2
                            logged_in={
                                swr_loading
                                    ? false
                                    : swr_data?.data.session !== null ||
                                      swr_data.data.session !== undefined
                            }
                            user_id={
                                swr_loading
                                    ? false
                                    : swr_data?.data.session?.user.id
                            }
                        />
                )}

        

                {!use_new_topnav && (
                    <IntakeTopNavV2
                        logged_in={
                            swr_loading
                                ? false
                                : swr_data?.data.session !== null ||
                                  swr_data.data.session !== undefined
                        }
                    />
                )}

                {use_new_topnav && (
                    <NewIntakeTopNav
                        logged_in={
                            swr_loading
                                ? false
                                : swr_data?.data.session !== null ||
                                  swr_data.data.session !== undefined
                        }
                    />
                )}
                        {(() => {
                            const isSemaglutidePath = path.includes('semaglutide');
                            const isWeightLossPath = path.includes('weight-loss');
                            // const isWeightLossPath = path.includes('weight-loss');
                            // const hasZealthyBestPractices = vwo_test_ids?.includes(
                            //     AB_TESTS_IDS.ZEALTHY_BEST_PRACTICES
                            // );
                            // const hasSemFunnelBanner =
                            //     searchParams.get('banner_id') ===
                            //     AB_TESTS_IDS.SEM_FUNNEL_SBSB;

                            const hasSemSpringSale = 
                                searchParams.get('banner_id') ===
                                    AB_TESTS_IDS.SEM_SL;

                            const shouldShowBanner =
                                // (isSemaglutidePath && hasSemFunnelBanner) ||
                                // (isSemaglutidePath && hasZealthyBestPractices) ||
                                // (isWeightLossPath && hasZealthyBestPractices) ||
                                (isSemaglutidePath && hasSemSpringSale) ||
                                (isWeightLossPath && hasSemSpringSale);

                            if (!shouldShowBanner) return null;

                            return (
                                <IntakeBannerV3
                                    logged_in={
                                        swr_loading
                                            ? false
                                            : swr_data?.data.session !== null ||
                                            swr_data.data.session !== undefined
                                    }
                                    user_id={
                                        swr_loading
                                            ? false
                                            : swr_data?.data.session?.user.id
                                    }
                                />
                            );
                        })()}
                <div
                    className={`flex flex-grow h-full w-full justify-center 
                        ${
                            isV3IntakeFunnel
                                ? isSpecialIntakePage()
                                    ? 'w-full md:w-screen'
                                    : 'md:max-w-[492px]'
                                : 'md:max-w-[521px]'
                        }
                    `}
                >
                    <div
                        className={`flex mx-5 md:mx-0 w-full justify-center 
                            ${isV3IntakeFunnel ? 'mb-6' : ''}`}
                    >
                        <ThemeClient
                            themeOption={
                                isV3IntakeFunnel
                                    ? intakeThemeOptionsV3
                                    : intakeThemeOptions
                            }
                        >
                            {children}
                        </ThemeClient>
                    </div>
                </div>
                {/* Blur Div */}
                {!should_not_blur && (
                    <div className='md:hidden fixed bottom-0 z-15 w-full h-[100px] mx-6 bg-gradient-to-b from-[rgba(249,249,249,0)] via-[rgba(249,249,249,0.6)] to-[rgba(249,249,249,0.4)]'>
                        <div className='absolute inset-0 bg-gradient-to-b from-[rgba(249,249,249,0.2)] via-transparent to-[rgba(249,249,249,1)]'></div>
                    </div>
                )}
            </main>
        </>
    );
}
