'use client';

import React, { useEffect, useState } from 'react';
import { Drawer, Box, IconButton } from '@mui/material';
import { readUserSessionCheckForMFARequirement } from '@/app/utils/actions/auth/session-reader';
import { createSupabaseBrowserClient } from '@/app/utils/clients/supabaseBrowserClient';
import { useRouter } from 'next/navigation';
import useSWR, { KeyedMutator } from 'swr';
import LoginFormDrawer from './drawer-specific-forms/login-form-drawer';
import SignUpFormDrawer from './drawer-specific-forms/sign-up-form-drawer';
import CloseIcon from '@mui/icons-material/Close';
import { getEmployeeRecordById } from '@/app/utils/database/controller/employees/employees-api';

interface LoginDrawerProps {
    open: boolean;
    onClose: () => void;
    revalidate_session: KeyedMutator<any>;
}

export default function LoginDrawerContainer({
    open,
    onClose,
    revalidate_session,
}: LoginDrawerProps) {
    const {
        data: session_mfa_data,
        error: swr_error,
        isLoading: swr_loading,
        mutate,
    } = useSWR(`session-with-mfa`, () =>
        readUserSessionCheckForMFARequirement()
    );
    const router = useRouter();
    const [mode, setMode] = useState<'login' | 'signup'>('login');

    function getFullPathAfterDomain(): string {
        // Get the pathname, search, and hash from the window location object
        const path = window.location.pathname;
        const search = window.location.search;
        const hash = window.location.hash;

        // Concatenate them to form the full path
        const fullPath = `${path}${search}${hash}`;

        // Return the full path
        return fullPath;
    }

    const url = getFullPathAfterDomain();

    // useEffect(() => {
    //     if (session_mfa_data && session_mfa_data.user_id) {
    //         if (
    //             session_mfa_data.mfa_required === false ||
    //             session_mfa_data.user_id ===
    //                 '1ab3a397-c0c6-40da-bad9-ba078e3da9b2'
    //         ) {
    //         } else {
    //             if (
    //                 session_mfa_data.assurance_level.data?.currentLevel ===
    //                 'aal1'
    //             ) {
    //                 if (
    //                     session_mfa_data.assurance_level.data.nextLevel ===
    //                     'aal1'
    //                 ) {
    //                     router.push(
    //                         `/login/mfa-enroll?originalRef=${encodeURI(url)}`
    //                     );
    //                 }
    //                 if (
    //                     session_mfa_data.assurance_level.data.nextLevel ===
    //                     'aal2'
    //                 ) {
    //                     router.push(
    //                         `/login/mfa-verify?originalRef=${encodeURI(url)}`
    //                     );
    //                 }
    //             } else if (
    //                 session_mfa_data.assurance_level.data?.currentLevel ===
    //                 'aal2'
    //             ) {
    //                 router.push(`/`);
    //             }
    //         }
    //     }
    // }, [session_mfa_data, router, url]);

    const determineRedirect = async (user_id: string) => {
        const supabase = createSupabaseBrowserClient();

        const assurance_level =
            await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

        const employee_record = await getEmployeeRecordById(user_id);

        if (employee_record) {
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
            }
        } else revalidate_session();
    };

    if (swr_loading) {
        return <></>;
    }

    return (
        <div className='md:max-w-[62.5vw]'>
            <Drawer anchor='right' open={open} onClose={onClose}>
                <Box sx={{ marginTop: '24px' }} role='presentation'>
                    <div className='absolute top-4 right-4'>
                        <IconButton
                            sx={{
                                backgroundColor: 'white',
                                boxShadow: 3, // This is a shorthand for a medium shadow
                                borderRadius: '50%', // Makes the background circular
                                '&:hover': {
                                    backgroundColor: 'white', // Ensures the background stays white on hover
                                    boxShadow: 6, // Increases the shadow on hover for a more interactive feel
                                },
                            }}
                            onClick={onClose}
                        >
                            <CloseIcon />
                        </IconButton>
                    </div>
                    <div className='flex md:mx-40 md:max-w-[50vw] w-[90vw] md:w-full px-[5vw] md:px-0'>
                        {mode === 'login' ? (
                            <div className=''>
                                <LoginFormDrawer
                                    determineRedirect={determineRedirect}
                                    setMode={setMode}
                                    revalidate_session={revalidate_session}
                                />
                            </div>
                        ) : (
                            <div>
                                <SignUpFormDrawer setMode={setMode} />
                            </div>
                        )}
                    </div>

                    {/* Add your login form or other content here */}
                </Box>
            </Drawer>
        </div>
    );
}
