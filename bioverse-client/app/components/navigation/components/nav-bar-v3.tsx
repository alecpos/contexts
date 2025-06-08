'use client';
import Link from 'next/link';
import NavbarAuthComponent from './client-side-navigation/navbar-auth';
import Image from 'next/image';
import StickyBanner from './sticky-banner/sticky-banner';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import useSWR from 'swr';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { useEffect, useState } from 'react';
import { BV_AUTH_TYPE } from '@/app/types/auth/authorization-types';

interface Props {
    className: string;
    hideLinks?: boolean;
    role: BV_AUTH_TYPE | null;
}

const DynamicMobileNavBar = dynamic(() => import('./mobile/nav-bar-mobile'));

export default function NavBarV3({
    className,
    hideLinks = false,
    role,
}: Props) {
    const {
        data: swr_data,
        error: swr_error,
        isLoading: swr_loading,
        mutate: revalidate_session,
    } = useSWR(`session`, () => readUserSession());

    const [loginDrawerOpen, setLoginDrawerOpen] = useState<boolean>(false);
    const [accessType, setAccessType] = useState<BV_AUTH_TYPE>(
        BV_AUTH_TYPE.DEFAULT,
    );
    const [sessionId, setSessionId] = useState<string>();

    const pathname = usePathname();
    const isPrescriptionsPage =
        pathname.startsWith('/prescriptions/') &&
        pathname.length > '/prescriptions/'.length;

    const href = pathname.split('/')[2];

    const hasMultiVariant =
        href == 'acarbose' ||
        href == 'tadalafil-as-needed' ||
        href == 'tadalafil-daily';

    useEffect(() => {
        if (swr_data) {
            setSessionId(swr_data.data.session?.user.id);
        }
    }, [swr_data]);

    useEffect(() => {
        revalidate_session();
    }, []);

    return (
        <>
            <div
                className={`hidden flex-col md:flex w-full ${
                    isPrescriptionsPage
                        ? 'h-[var(--nav-height) + 50]'
                        : 'h-[var(--nav-height)]'
                } bg-white top-0 justify-between z-50 fixed ${className}`}
            >
                {isPrescriptionsPage && <StickyBanner product_href={href} />}
                <div className="flex flex-row items-center justify-between mt-2 px-[16px]">
                    <div className="flex flex-row items-center">
                        <Link href={'/'} className="relative font-normal">
                            <Image
                                src={'/img/bioverse-logo-v3.svg'}
                                alt={'bioverse-logo-v3'}
                                width={160}
                                height={50}
                                unoptimized
                                style={{
                                    objectFit: 'contain',
                                    marginLeft: '-12px',
                                }}
                            />
                        </Link>
                    </div>
                    {/* {!swr_loading ? (
                        swr_data && ( */}
                    <NavbarAuthComponent
                        userId={sessionId}
                        className={'flex justify-end'}
                        loggedIn={false}
                        hideLinks={hideLinks}
                        role={role}
                        revalidate_session={revalidate_session}
                    />
                    {/* )
                    ) : (
                        <></>
                    )} */}
                </div>
            </div>
            {isPrescriptionsPage && (
                <div className="flex md:hidden w-full h-[50px] bg-primary top-0 flex-row shadow-navbar z-50 fixed">
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
                } bg-white flex-row z-50 fixed justify-between`}
            >
                {!swr_loading && swr_data && (
                    <DynamicMobileNavBar
                        loggedIn={swr_data.data.session ? true : false}
                        role={role}
                    />
                )}
            </div>{' '}
        </>
    );
}
