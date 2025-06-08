'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import LogoHorizontal from '../../navigation/components/logo-horizontal/logo-horizontal';
import { BV_AUTH_TYPE } from '@/app/types/auth/authorization-types';
import { useState, useEffect } from 'react';
import { endSessionAndSignOutUser } from '@/app/utils/functions/provider-portal/time-tracker/provider-time-tracker-functions';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import useSWR from 'swr';
import StartSessionButton from '../../provider-portal/nav-bar/start-session-button/start-session-button';
import RegisteredNurseResourcesButton from './registered-nurse-resources/registered-nurse-resources-button';
import RegisteredNurseTabs from './registered-nurse-tabs.tsx/registered-nurse-tabs';

interface Props {
    role: BV_AUTH_TYPE;
}

export default function RegisteredNurseNavbar({ role }: Props) {
    const router = useRouter();
    const fullPath = usePathname();

    const {
        data: swr_data,
        isLoading: swr_loading,
        isValidating: swr_validating,
    } = useSWR(`provider-session`, () => readUserSession());

    const isRN = role === BV_AUTH_TYPE.REGISTERED_NURSE;

    const [lastActivity, setLastActivity] = useState(Date.now());
    const [userId, setUserId] = useState<string | undefined>();

    useEffect(() => {
        if (!swr_validating && !swr_loading && swr_data) {
            if (swr_data.data.session === null) {
                setUserId(undefined);
                router.push(
                    `/registered-nurse-auth/login?originalRef=${encodeURIComponent(
                        fullPath
                    )}`
                );
            } else {
                setUserId(swr_data.data.session.user.id);
            }
        }
    }, [swr_data?.data.session]);

    useEffect(() => {
        if (!isRN) return;

        const resetTimer = () => {
            setLastActivity(Date.now());
        };

        const clearCookies = () => {
            localStorage.clear();
            document.cookie.split(';').forEach((c) => {
                document.cookie = c
                    .replace(/^ +/, '')
                    .replace(
                        /=.*/,
                        '=;expires=' + new Date().toUTCString() + ';path=/'
                    );
            });
        };

        // Set up event listeners for user activity
        window.addEventListener('mousemove', resetTimer);
        window.addEventListener('mousedown', resetTimer);
        window.addEventListener('keypress', resetTimer);
        window.addEventListener('DOMMouseScroll', resetTimer);
        window.addEventListener('mousewheel', resetTimer);
        window.addEventListener('touchmove', resetTimer);
        window.addEventListener('MSPointerMove', resetTimer);

        const timer = setInterval(() => {
            const currentTime = Date.now();
            const elapsedTime = Math.floor((currentTime - lastActivity) / 1000);
            const newRemainingTime = Math.max(10 * 60 - elapsedTime, 0);

            if (newRemainingTime === 0) {
                clearCookies();
                endSessionAndSignOutUser(userId!);
                resetTimer(); // Reset the timer after calling sampleFunction
            }
        }, 1000); // Update every second

        // Cleanup function
        return () => {
            clearInterval(timer);
            window.removeEventListener('mousemove', resetTimer);
            window.removeEventListener('mousedown', resetTimer);
            window.removeEventListener('keypress', resetTimer);
            window.removeEventListener('DOMMouseScroll', resetTimer);
            window.removeEventListener('mousewheel', resetTimer);
            window.removeEventListener('touchmove', resetTimer);
            window.removeEventListener('MSPointerMove', resetTimer);
        };
    }, [lastActivity]);

    return (
        <div
            className={`w-full h-[var(--nav-height)] bg-white top-0 flex shadow-navbar justify-between z-50 fixed`}
        >
            <div className='flex flex-row items-center ml-[0.83vw]'>
                <Link href={'/'} className='relative font-normal'>
                    <div>
                        <LogoHorizontal
                            breakpoint='desktop'
                            className='!flex-[0_0_auto]'
                            logoColor='/img/bioverse-logo.png'
                            status='visitor'
                        />
                    </div>
                </Link>
            </div>

            {userId && (
                <div className='flex flex-row items-center pr-10 gap-[1.5em]'>
                    <RegisteredNurseTabs userId={userId} role={role} />
                    <StartSessionButton userId={userId} role={role} />
                    <RegisteredNurseResourcesButton
                        userId={userId}
                        role={role}
                    />
                </div>
            )}
        </div>
    );
}
