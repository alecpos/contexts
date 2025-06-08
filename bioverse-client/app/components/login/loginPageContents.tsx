'use client';
import { readUserSessionCheckForMFARequirement } from '@/app/utils/actions/auth/session-reader';
import useSWR from 'swr';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoadingScreen from '../global-components/loading-screen/loading-screen';
import { createSupabaseBrowserClient } from '@/app/utils/clients/supabaseBrowserClient';
import LoginFormV2 from './forms/v2/login-form-v2';
import React from 'react';

interface Props {
    url: string;
    forProvider?: boolean;
}

export default function LoginPageContents({ url, forProvider }: Props) {
    const {
        data: session_mfa_data,
        error: swr_error,
        isLoading: swr_loading,
    } = useSWR(`session-with-mfa`, () =>
        readUserSessionCheckForMFARequirement()
    );
    const router = useRouter();

    useEffect(() => {
        if (session_mfa_data && session_mfa_data.user_id) {
            if (session_mfa_data.mfa_required === false) {
                if (url === 'undefined') {
                    router.push('/');
                    return;
                }
                router.push(url ?? `/`);
                return;
            } else {
                if (
                    session_mfa_data.assurance_level.data?.currentLevel ===
                    'aal1'
                ) {
                    if (
                        session_mfa_data.assurance_level.data.nextLevel ===
                        'aal1'
                    ) {
                        router.push(
                            `/login/mfa-enroll?originalRef=${encodeURI(url)}`
                        );
                        return;
                    }
                    if (
                        session_mfa_data.assurance_level.data.nextLevel ===
                        'aal2'
                    ) {
                        router.push(
                            `/login/mfa-verify?originalRef=${encodeURI(url)}`
                        );
                        return;
                    }
                } else if (
                    session_mfa_data.assurance_level.data?.currentLevel ===
                    'aal2'
                ) {
                    router.push(url ?? `/`);
                    return;
                }
            }
        }
    }, [session_mfa_data, router, url]);

    const determineRedirect = async () => {
        const supabase = createSupabaseBrowserClient();

        const assurance_level =
            await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

        if (session_mfa_data && session_mfa_data.user_id) {
            if (session_mfa_data.mfa_required === false) {
                router.push(url ?? `/`);
            } else {
                if (assurance_level.data?.currentLevel === 'aal1') {
                    if (assurance_level.data.nextLevel === 'aal1') {
                        router.push(
                            `/login/mfa-enroll?originalRef=${encodeURI(url)}`
                        );
                    }
                    if (assurance_level.data.nextLevel === 'aal2') {
                        router.push(
                            `/login/mfa-verify?originalRef=${encodeURI(url)}`
                        );
                    }
                } else if (assurance_level.data?.currentLevel === 'aal2') {
                    router.push(url ?? `/`);
                }
            }
        }
    };

    if (swr_loading) {
        return <LoadingScreen />;
    }

    return (
        <>
            <div className='w-full h-[100vh] flex flex-row'>
                <div className='flex w-[95%] md:w-[25%] min-w-[456px] items-center m-auto'>
                    <LoginFormV2
                        url={url}
                        forProvider={forProvider}
                        determineRedirect={determineRedirect}
                    />
                </div>
            </div>
        </>
    );
}
