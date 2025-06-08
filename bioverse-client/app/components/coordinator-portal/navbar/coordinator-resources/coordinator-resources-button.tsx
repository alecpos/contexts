'use client';

import { signOutUser } from '@/app/utils/actions/auth/server-signIn-signOut';
import { Button, Drawer } from '@mui/material';
import { useState } from 'react';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { createEmployeeLogoutAudit } from '@/app/utils/database/controller/provider_activity_audit/provider_activity_audit-api';
import { useRouter } from 'next/navigation';
import React from 'react';
import { BV_AUTH_TYPE } from '@/app/types/auth/authorization-types';
import { determineAccessByRoleName } from '@/app/utils/functions/auth/authorization/authorizaiton-helper';

interface CoordinatorResourcesButtonProps {
    userId: string;
    role: BV_AUTH_TYPE;
}

export default function CoordinatorResourcesButton({
    userId,
    role,
}: CoordinatorResourcesButtonProps) {
    const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

    const router = useRouter();

    const onClick = () => {
        setDrawerOpen((prevDrawerOpen) => !prevDrawerOpen);
    };

    const onLogoutClick = async () => {
        await signOutUser();
        await createEmployeeLogoutAudit(
            userId,
            undefined,
            { source: 'provider-resources-logout-button' },
            role
        );
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
    };

    return (
        <>
            <div
                id='provider-more-resources-button'
                className='cursor-pointer hover:text-gray-500'
                onClick={onClick}
            >
                <MoreHorizIcon />
            </div>
            <Drawer
                id='provider-more-resources-drawer'
                anchor='right'
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                PaperProps={{
                    style: {
                        width: '620px',
                    },
                }}
            >
                <div className='flex w-full justify-center '>
                    <div className='flex flex-col mt-16 w-full px-16 gap-4'>
                        <p className='inter_h5_regular text-[30px] my-2'>
                            Coordinator Resources
                        </p>

                        <div className='flex flex-col items-center w-full'>
                            {
                                <>
                                    <Button
                                        onClick={() => {
                                            router.push(
                                                '/coordinator/track-hours'
                                            );
                                        }}
                                        sx={{
                                            borderRadius: '12px',
                                            backgroundColor: 'black',
                                            paddingX: '32px',
                                            paddingY: '14px',
                                            ':hover': {
                                                backgroundColor:
                                                    'darkslategray',
                                            },
                                        }}
                                        className='w-full'
                                    >
                                        <span className='normal-case provider-bottom-button-text  text-white'>
                                            Coordinator Time Tracker
                                        </span>
                                    </Button>
                                </>
                            }
                        </div>

                        {determineAccessByRoleName(
                            role,
                            BV_AUTH_TYPE.LEAD_COORDINATOR
                        ) && (
                            <>
                                <div className='flex flex-col items-center w-full'>
                                    {
                                        <>
                                            <Button
                                                onClick={() => {
                                                    router.push(
                                                        '/coordinator/upcoming-list'
                                                    );
                                                }}
                                                sx={{
                                                    borderRadius: '12px',
                                                    backgroundColor: 'black',
                                                    paddingX: '32px',
                                                    paddingY: '14px',
                                                    ':hover': {
                                                        backgroundColor:
                                                            'darkslategray',
                                                    },
                                                }}
                                                className='w-full'
                                            >
                                                <span className='normal-case provider-bottom-button-text  text-white'>
                                                    Upcoming Renewals
                                                </span>
                                            </Button>
                                        </>
                                    }
                                </div>

                                <div className='flex flex-col items-center w-full'>
                                    {
                                        <>
                                            <Button
                                                onClick={() => {
                                                    router.push(
                                                        '/coordinator/escalations'
                                                    );
                                                }}
                                                sx={{
                                                    borderRadius: '12px',
                                                    backgroundColor: 'black',
                                                    paddingX: '32px',
                                                    paddingY: '14px',
                                                    ':hover': {
                                                        backgroundColor:
                                                            'darkslategray',
                                                    },
                                                }}
                                                className='w-full'
                                            >
                                                <span className='normal-case provider-bottom-button-text  text-white'>
                                                    Escalations
                                                </span>
                                            </Button>
                                        </>
                                    }
                                </div>
                            </>
                        )}

                        <Button
                            sx={{
                                borderRadius: '12px',
                                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                                paddingX: '32px',
                                paddingY: '14px',
                                ':hover': {
                                    backgroundColor: 'darkslategray',
                                },
                            }}
                            onClick={onLogoutClick}
                        >
                            <span className='normal-case provider-bottom-button-text  text-white'>
                                Log Out
                            </span>
                        </Button>
                    </div>
                </div>
            </Drawer>
        </>
    );
}
