'use client';

import { signOutUser } from '@/app/utils/actions/auth/server-signIn-signOut';
import { Button, Drawer } from '@mui/material';
import { useState } from 'react';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { createEmployeeLogoutAudit } from '@/app/utils/database/controller/provider_activity_audit/provider_activity_audit-api';
import { useRouter } from 'next/navigation';
import React from 'react';
import { BV_AUTH_TYPE } from '@/app/types/auth/authorization-types';

interface ProviderResourcesButtonProps {
    userId: string;
    role: BV_AUTH_TYPE;
}

export default function ProviderResourcesButton({
    userId,
    role,
}: ProviderResourcesButtonProps) {
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
                            Provider Resources
                        </p>

                        <div className='flex flex-col items-center w-full'>
                            {role !== BV_AUTH_TYPE.COORDINATOR && (
                                <>
                                    <Button
                                        onClick={() => {
                                            router.push(
                                                '/provider/track-hours'
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
                                            Provider Session Tracker
                                        </span>
                                    </Button>
                                </>
                            )}
                        </div>

                        <div className='flex flex-col items-center w-full'>
                            {role === BV_AUTH_TYPE.ADMIN && (
                                <>
                                    <Button
                                        onClick={() => {
                                            router.push(
                                                '/provider/active-renewal-options'
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
                                            Active Renewal Options
                                        </span>
                                    </Button>
                                </>
                            )}
                        </div>

                        <div className='flex flex-col items-center w-full'>
                            {(role === BV_AUTH_TYPE.ADMIN ||
                                userId ==
                                    '6b9465fe-442d-4c71-bd9e-2a515c8e1d59') && (
                                //|| userId = '' //Add Dr. Greene User Id here.
                                <>
                                    <Button
                                        onClick={() => {
                                            router.push(
                                                '/provider/tx-patient-list'
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
                                            Download Texas Patient List
                                        </span>
                                    </Button>
                                </>
                            )}
                        </div>

                        <Button
                            sx={{
                                borderRadius: '12px',
                                backgroundColor: 'black',
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
