'use client';
import Link from 'next/link';
import NavbarAuthComponent from './client-side-navigation/navbar-auth';
import Image from 'next/image';
import StickyBanner from './sticky-banner/sticky-banner';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import useSWR, { mutate } from 'swr';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { useEffect, useMemo, useState } from 'react';
import { BV_AUTH_TYPE } from '@/app/types/auth/authorization-types';
import React from 'react';

interface Props {
    className: string;
    hideLinks?: boolean;
    role: BV_AUTH_TYPE | null;
}

const DynamicMobileNavBar = dynamic(() => import('./mobile/nav-bar-mobile'), {
    loading: () => <div className='h-[50px] bg-white' />,
    ssr: false, // Disable SSR for mobile navigation
});

export default function NavBar({ className, hideLinks = false, role }: Props) {
    const {
        data: swr_data,
        isLoading: swr_loading,
        mutate: revalidate_session,
    } = useSWR(`session`, () => readUserSession());

    const [sessionId, setSessionId] = useState<string | undefined>();
    const pathname = usePathname();

    const isPrescriptionsPage = useMemo(() => {
        return (
            pathname.startsWith('/prescriptions/') &&
            pathname.length > '/prescriptions/'.length
        );
    }, [pathname]);

    const href = useMemo(() => pathname.split('/')[2], [pathname]);

    const hasMultiVariant = useMemo(() => {
        return ['acarbose', 'tadalafil-as-needed', 'tadalafil-daily'].includes(
            href
        );
    }, [href]);

    useEffect(() => {
        if (swr_data?.data.session?.user.id) {
            setSessionId(swr_data.data.session.user.id);
            return;
        } else {
            setSessionId(undefined);
            return;
        }
    }, [swr_data?.data.session]);

    useEffect(() => {
        revalidate_session;
        mutate('session-with-mfa');
    });

    return (
        <>
            <div
                className={`hidden flex-col md:flex w-full ${
                    isPrescriptionsPage
                        ? 'h-[var(--nav-height) + 50]'
                        : 'h-[var(--nav-height)]'
                } bg-white top-0 shadow-navbar justify-between z-50 fixed ${className}`}
            >
                {isPrescriptionsPage && <StickyBanner product_href={href} />}
                <div className='flex flex-row items-center justify-between'>
                    <div className='flex flex-row items-center ml-[0.83vw] mt-1'>
                        <Link href={'/'} className='relative font-normal'>
                            <Image
                                src={'/img/bioverse-logo-full.png'}
                                alt={'bioverse-banners'}
                                width={200}
                                height={50}
                                unoptimized
                            />
                        </Link>
                    </div>
                    {!swr_loading ? (
                        swr_data && (
                            <NavbarAuthComponent
                                className={'flex justify-end'}
                                loggedIn={sessionId ? true : false}
                                hideLinks={hideLinks}
                                role={role}
                                revalidate_session={revalidate_session}
                                userId={sessionId} //LEGITSCRIPTCODETOREMOVE
                            />
                        )
                    ) : (
                        <></>
                    )}
                </div>
            </div>
            {isPrescriptionsPage && (
                <div className='flex md:hidden w-full h-[50px] bg-primary top-0 flex-row shadow-navbar z-50 fixed'>
                    <StickyBanner product_href={href} />
                </div>
            )}
            <div
                className={`flex md:hidden w-full h-[50px] ${
                    isPrescriptionsPage
                        ? hasMultiVariant
                            ? 'top-[70px]'
                            : 'top-[50px]'
                        : 'top-0'
                } bg-white flex-row shadow-navbar z-50 fixed justify-between`}
            >
                {!swr_loading && swr_data && (
                    <DynamicMobileNavBar
                        loggedIn={swr_data.data.session?.user.id ? true : false}
                        role={role}
                    />
                )}
            </div>{' '}
        </>
    );
}
