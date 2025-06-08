'use client';

import AccountMenu from './account-menu/account-menu';
import { Button } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import PortraitOutlined from '@mui/icons-material/PortraitOutlined';
import DropdownMenu from '../dropdown-menu/dropdownMenu';
import { BV_AUTH_TYPE } from '@/app/types/auth/authorization-types';
import LoginDrawerContainer from '@/app/components/login/login-drawer/login-drawer-container';
import { useState } from 'react';
import { KeyedMutator } from 'swr';

interface Props {
    className: string;
    loggedIn: boolean;
    hideLinks?: boolean;
    role: BV_AUTH_TYPE | null;
    revalidate_session: KeyedMutator<any>;
    userId: string | undefined; //LEGITSCRIPTCODETOREMOVE
}

export default function NavbarAuthComponent({
    className,
    loggedIn,
    hideLinks = false,
    role,
    revalidate_session,
    userId,
}: Props) {
    const [loginDrawerOpen, setLoginDrawerOpen] = useState<boolean>(false);

    const router = useRouter();
    const path = usePathname();

    const handleGetStartedClick = () => {
        const encodedPathname = encodeURIComponent(path);
        router.push(`/signup?originalRef=${encodedPathname}`);
    };

    const handleGetStartedLoggedInClick = () => {
        router.push('/collections');
    };

    return (
        <div className={`flex ${className}`}>
            <DropdownMenu hideLinks={hideLinks} />

            {!loggedIn ? (
                <div className='inline-flex items-center gap-[.83vw] mr-[0.83vw]'>
                    {!hideLinks && (
                        <Button
                            onClick={handleGetStartedClick}
                            variant='contained'
                            className='!flex-[0_0_auto] mr-2'
                        >
                            Get Started
                        </Button>
                    )}
                    <div className='inline-flex items-center gap-1 hover:cursor-pointer'>
                        <PortraitOutlined
                            sx={{ strokeWidth: 1, stroke: '#ffffff' }}
                            fontSize='large'
                            onClick={() => {
                                setLoginDrawerOpen(true);
                            }}
                        />
                        <LoginDrawerContainer
                            open={loginDrawerOpen}
                            onClose={() => {
                                setLoginDrawerOpen(false);
                            }}
                            revalidate_session={revalidate_session}
                        />
                    </div>
                </div>
            ) : (
                <div className='inline-flex items-center gap-[.83vw] mr-[0.83vw]'>
                    <Button
                        onClick={handleGetStartedLoggedInClick}
                        variant='contained'
                        className='!flex-[0_0_auto] mr-2'
                    >
                        Get Started
                    </Button>
                    <AccountMenu
                        loggedIn={loggedIn}
                        role={role}
                        revalidate_session={revalidate_session}
                        userId={userId}
                    />
                </div>
            )}
        </div>
    );
}
