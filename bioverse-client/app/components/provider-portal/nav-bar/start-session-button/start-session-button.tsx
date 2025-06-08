'use client';

import { BV_AUTH_TYPE } from '@/app/types/auth/authorization-types';
import { Button } from '@mui/material';
import React from 'react';
import { createEmployeeLogoutAudit } from '@/app/utils/database/controller/provider_activity_audit/provider_activity_audit-api';
import { signOutUser } from '@/app/utils/actions/auth/server-signIn-signOut';
import { useRouter } from 'next/navigation';

interface StartSessionButtonProps {
    userId: string;
    role: BV_AUTH_TYPE;
}

/**
 * This button used to be used to start/end sessions for providers.
 * Now it's just a logout button.
 */
export default function StartSessionButton({
    userId,
    role,
}: StartSessionButtonProps) {
    const isProvider =
        role === BV_AUTH_TYPE.PROVIDER ||
        role === BV_AUTH_TYPE.LEAD_PROVIDER ||
        role === BV_AUTH_TYPE.REGISTERED_NURSE ||
        role === BV_AUTH_TYPE.ADMIN;

    const router = useRouter();

    const onClick = async () => {
        await createEmployeeLogoutAudit(
            userId,
            undefined,
            { source: 'end-session-button' },
            role
        );
        await signOutUser();
        localStorage.clear();
        document.cookie.split(';').forEach((c) => {
            document.cookie = c
                .replace(/^ +/, '')
                .replace(
                    /=.*/,
                    '=;expires=' + new Date().toUTCString() + ';path=/'
                );
        });
        router.push('/login');
        return;
    };

    return (
        <>
            <Button
                variant='outlined'
                onClick={onClick}
                sx={{
                    minWidth: '200px',
                    borderColor: `black`,
                    color: `black`,
                    '&:hover': {
                        backgroundColor: '#f0f0f0', // change this to your preferred hover background color
                        borderColor: `black`, // change this to your preferred hover border color
                    },
                    borderRadius: '12px',
                }}
                disabled={!isProvider}
            >
                End Session
            </Button>
        </>
    );
}
