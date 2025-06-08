'use client';

import { analytics } from '@/app/components/analytics';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { signOutUser } from '@/app/utils/actions/auth/server-signIn-signOut';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Button,
    Drawer,
} from '@mui/material';
import { useState } from 'react';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useRouter } from 'next/navigation';
import React from 'react';
import { BV_AUTH_TYPE } from '@/app/types/auth/authorization-types';

interface RegisteredNurseResourcesButtonProps {
    userId: string;
    role: BV_AUTH_TYPE;
}

export default function RegisteredNurseResourcesButton({
    userId,
    role,
}: RegisteredNurseResourcesButtonProps) {
    const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

    const router = useRouter();

    const onClick = () => {
        setDrawerOpen((prevDrawerOpen) => !prevDrawerOpen);
    };

    const onLogoutClick = async () => {
        await signOutUser();
        analytics.reset();

        router.push('/login');
    };

    return (
        <>
            <div
                className='cursor-pointer hover:text-gray-500'
                onClick={onClick}
            >
                <MoreHorizIcon />
            </div>
            <Drawer
                id='registered-nurse-more-resources-drawer'
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
                    <div className='flex flex-col mt-16 w-full px-16'>
                        <Accordion sx={{ boxShadow: 'none' }}>
                            <AccordionSummary
                                expandIcon={<KeyboardArrowDownIcon />}
                                sx={{
                                    borderBottom: `1px solid #1B1B1B1F`,
                                    padding: 0,
                                }}
                            >
                                <BioType className='itd-h1'>
                                    Registered Nurse Resources
                                </BioType>
                            </AccordionSummary>
                        </Accordion>

                        <div className='flex flex-col items-center w-full'>
                            {role !== BV_AUTH_TYPE.COORDINATOR && (
                                <>
                                    <Button
                                        onClick={() => {
                                            router.push(
                                                '/registered-nurse/track-hours'
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
                                            RN Time Tracker
                                        </span>
                                    </Button>
                                </>
                            )}
                        </div>

                        <Button
                            variant='contained'
                            fullWidth
                            sx={{
                                backgroundColor: 'black',
                                marginTop: '50px',
                                '&:hover': {
                                    backgroundColor: 'black',
                                    opacity: '.8',
                                },
                            }}
                            onClick={onLogoutClick}
                        >
                            <BioType className='it-body text-white py-0.5'>
                                Log Out
                            </BioType>
                        </Button>
                    </div>
                </div>
            </Drawer>
        </>
    );
}
