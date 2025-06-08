'use client';

import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import SignOutButton from './components/sign-out-button';
import CoordinatorNavBarTabs from './components/coordinator-portal-tabs';
import LogoHorizontal from '../../navigation/components/logo-horizontal/logo-horizontal';
import { BV_AUTH_TYPE } from '@/app/types/auth/authorization-types';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { useState, useEffect } from 'react';
import useSWR from 'swr';
import StartSessionButton from './start-session-button/start-session-button';
import CoordinatorResourcesButton from './coordinator-resources/coordinator-resources-button';

interface CoordinatorNavBarProps {
    user_role: BV_AUTH_TYPE;
}

export default function CoordinatorNavBar({
    user_role,
}: CoordinatorNavBarProps) {
    const router = useRouter();
    const fullPath = usePathname();

    const {
        data: swr_data,
        isLoading: swr_loading,
        isValidating: swr_validating,
    } = useSWR(`coordinator-session`, () => readUserSession());

    const [userId, setUserId] = useState<string | undefined>();

    useEffect(() => {
        if (!swr_validating && !swr_loading && swr_data) {
            if (swr_data.data.session === null) {
                setUserId(undefined);
                router.push(
                    `/login?originalRef=${encodeURIComponent(fullPath)}`
                );
            } else {
                setUserId(swr_data.data.session.user.id);
            }
        }
    }, [swr_data]);

    return (
        <div
            className={`w-full h-[var(--nav-height)] bg-white top-0 flex shadow-navbar justify-between z-50 fixed`}
        >
            <div className='flex flex-row items-center ml-[0.83vw]'>
                <div
                    className='relative font-normal hover:cursor-pointer'
                    onClick={() => {
                        router.push('/');
                    }}
                >
                    <div>
                        <LogoHorizontal
                            breakpoint='desktop'
                            className='!flex-[0_0_auto]'
                            logoColor='/img/bioverse-logo.png'
                            status='visitor'
                        />
                    </div>
                </div>
            </div>

            {userId && (
                <div className='flex flex-row justify-center items-center pr-10 gap-[1.5em] h-full'>
                    <CoordinatorNavBarTabs
                        userId={userId}
                        user_role={user_role}
                    />
                    <StartSessionButton userId={userId} role={user_role} />
                    <CoordinatorResourcesButton
                        userId={userId}
                        role={user_role}
                    />
                </div>
            )}
        </div>
    );
}
