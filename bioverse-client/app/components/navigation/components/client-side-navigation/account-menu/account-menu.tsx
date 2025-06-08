'use client';
import { Menu, MenuItem, useMediaQuery } from '@mui/material';
import { useState } from 'react';
import PortraitIcon from '@mui/icons-material/PortraitOutlined';
import { usePathname, useRouter } from 'next/navigation';
import { analytics } from '@/app/components/analytics';
import { KeyedMutator, mutate } from 'swr';
import { determineAccessByRoleName } from '@/app/utils/functions/auth/authorization/authorizaiton-helper';
import { BV_AUTH_TYPE } from '@/app/types/auth/authorization-types';
import LoginDrawerContainer from '@/app/components/login/login-drawer/login-drawer-container';
import React from 'react';
import { createSupabaseBrowserClient } from '@/app/utils/clients/supabaseBrowserClient';

/*
ACCOUNT MENU (ICON) FOR NAV BARS

02/02/2024 - @Olivier
 - Changed Icon
 - Changed onclick behavior depending on state of user & screen
*/

interface Props {
    loggedIn: boolean;
    closeMobileDrawer?: () => void;
    role: BV_AUTH_TYPE | null;
    revalidate_session?: KeyedMutator<any>;
    userId?: string | undefined; //LEGITSCRIPTCODETOREMOVE
}

export default function AccountMenu({
    loggedIn,
    role,
    closeMobileDrawer = () => {},
    revalidate_session = async () => undefined,
    userId,
}: Props) {
    const [loginDrawerOpen, setLoginDrawerOpen] = useState<boolean>(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const router = useRouter();
    const path = usePathname();
    const encodedPathname = encodeURIComponent(path);
    const isNotMobile = useMediaQuery('(min-width:640px)');
    const open = Boolean(anchorEl);

    const handleClick = (event: any) => {
        if (!loggedIn) {
            // router.push(`/login?originalRef=${encodedPathname}`);
            // return;
            setLoginDrawerOpen(true);
            return;
        }

        if (isNotMobile) {
            setAnchorEl(event.currentTarget);
            return;
        }
        closeMobileDrawer();
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSignOut = async () => {
        analytics.reset();

        const supabase = createSupabaseBrowserClient();
        const { error } = await supabase.auth.signOut();

        localStorage.clear();
        document.cookie.split(';').forEach((c) => {
            document.cookie = c
                .replace(/^ +/, '')
                .replace(
                    /=.*/,
                    '=;expires=' + new Date().toUTCString() + ';path=/'
                );
        });

        revalidate_session;
        mutate('session');
    };

    const handlePatientPortal = () => {
        router.push('/portal/account-information');
        return;
    };

    const handleProviderPortal = () => {
        // if (role === BV_AUTH_TYPE.PROVIDER) {
        //     router.push('/provider/tasks');
        //     return;
        // }
        router.push('/provider');
        return;
    };

    const handleRegisteredNursePortal = () => {
        router.push('/registered-nurse');
    };

    const handleCoordinatorPortal = () => {
        router.push('/coordinator');
        return;
    };
    const handleAdminPortal = () => {
        router.push('/admin');
        return;
    };

    const handleEngineerPortal = () => {
        router.push('/engineer');
        return;
    };

    return (
        <div className='inline-flex items-center text-center self-center overflow-auto'>
            <div
                className='inline-flex items-center gap-1 hover:cursor-pointer'
                onClick={handleClick}
            >
                <PortraitIcon
                    sx={{ strokeWidth: 1, stroke: '#ffffff' }}
                    fontSize='large'
                />
            </div>
            {!loggedIn && (
                <>
                    <LoginDrawerContainer
                        open={loginDrawerOpen}
                        onClose={() => setLoginDrawerOpen(false)}
                        revalidate_session={revalidate_session}
                    />
                </>
            )}
            <Menu
                disableScrollLock={true}
                id='basic-menu'
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem onClick={handlePatientPortal}>
                    Patient Portal
                </MenuItem>
                {determineAccessByRoleName(
                    role,
                    BV_AUTH_TYPE.REGISTERED_NURSE
                ) &&
                    userId &&
                    userId !== 'bb22b7f2-cd8e-4b08-85c8-04f482d52cd5' && ( //LEGITSCRIPTCODETOREMOVE
                        <div>
                            <MenuItem onClick={handleRegisteredNursePortal}>
                                Registered Nurse Portal
                            </MenuItem>
                        </div>
                    )}
                {determineAccessByRoleName(role, BV_AUTH_TYPE.PROVIDER) && (
                    <div>
                        <MenuItem onClick={handleProviderPortal}>
                            Provider Portal
                        </MenuItem>
                    </div>
                )}
                {role === BV_AUTH_TYPE.LEAD_COORDINATOR ||
                determineAccessByRoleName(role, BV_AUTH_TYPE.DEVELOPER) ? (
                    <div>
                        <MenuItem onClick={handleEngineerPortal}>
                            Engineer Portal
                        </MenuItem>
                    </div>
                ) : null}
                {determineAccessByRoleName(role, BV_AUTH_TYPE.COORDINATOR) && //LEGITSCRIPTCODETOREMOVE
                    userId &&
                    userId !== 'bb22b7f2-cd8e-4b08-85c8-04f482d52cd5' && (
                        <div>
                            <MenuItem onClick={handleCoordinatorPortal}>
                                Coordinator Portal
                            </MenuItem>
                        </div>
                    )}
                {determineAccessByRoleName(role, BV_AUTH_TYPE.ADMIN) && (
                    <div>
                        <MenuItem onClick={handleAdminPortal}>
                            Admin Portal
                        </MenuItem>
                    </div>
                )}
                <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
            </Menu>
        </div>
    );
}
