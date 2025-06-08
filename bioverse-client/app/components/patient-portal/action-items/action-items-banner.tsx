'use client';

import { Drawer, useMediaQuery } from '@mui/material';
import BioType from '../../global-components/bioverse-typography/bio-type/bio-type';
import CloseIcon from '@mui/icons-material/Close';
import { useState, useEffect } from 'react';
import {
    ActionItemType,
    ActionType,
} from '@/app/types/action-items/action-items-types';
import ActionItem from './components/ActionItem';
import { usePathname } from 'next/navigation';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

interface ActionItemsBannerProps {
    actionItems: ActionItemType[];
}

export default function ActionItemsBanner({
    actionItems,
}: ActionItemsBannerProps) {
    const [openDrawer, setOpenDrawer] = useState<boolean>(false);
    const pathname = usePathname();

    const isMobile = useMediaQuery('(max-width:575px)');
    const isTablet = useMediaQuery('(min-width:576px) and (max-width:1023px)');
    const isDesktop = useMediaQuery('(min-width:1024px)');

    const getDrawerWidth = () => {
        if (isMobile) return '100%';
        if (isTablet) return '360px';
        if (isDesktop) return '500px';
        return '360px';
    };

    const drawerWidth = getDrawerWidth();

    useEffect(() => {
        // Open drawer immediately
        setOpenDrawer(true);

        // Set up 5-minute timer
        const timer = setInterval(() => {
            setOpenDrawer(true);
        }, 5 * 60 * 1000); // 5 minutes in milliseconds

        // Cleanup interval on component unmount
        return () => clearInterval(timer);
    }, []);

    if (pathname.includes('check-up')) {
        return null;
    }

    function formatType(actionItem: ActionItemType) {
        if (actionItem.action_type === ActionType.CheckUp) {
            return actionItem.type;
        }
        if (actionItem.action_type === ActionType.DosageSelection) {
            return actionItem.action_type;
        }
        if (actionItem.action_type === ActionType.IDVerification) {
            return actionItem.action_type;
        }

        return 'Unknown';
    }

    return (
        <>
            <div
                onClick={() => setOpenDrawer(true)}
                className='w-full  cursor-pointer h-[52px] bg-[#F6CFAE] flex justify-center items-center space-x-2 z-100 sm:mt-0'
            >
                <ErrorOutlineIcon sx={{ color: '#EF6C00', fontSize: 30 }} />
                <BioType className='text-[#663C00]  text-[16px] itd-subtitle'>
                    Complete your action items
                </BioType>
            </div>
            <Drawer
                open={openDrawer}
                onClose={() => setOpenDrawer(false)}
                anchor='right'
                PaperProps={{
                    style: {
                        width: drawerWidth,
                        minWidth: isMobile ? '100%' : '360px',
                        maxWidth: isMobile ? '100%' : '500px',
                    },
                }}
            >
                <div className='overflow-x-hidden'>
                    <div
                        className='flex justify-end items-center w-full h-[50px]'
                        onClick={() => setOpenDrawer(false)}
                    >
                        <BioType className='body1 text-[14px] cursor-pointer'>
                            CLOSE
                        </BioType>
                        <CloseIcon
                            sx={{
                                fontSize: 24,
                                color: '#1B1B1B8F',
                                cursor: 'pointer',
                            }}
                        />
                    </div>
                    <div className='w-full h-[1px] bg-[#1B1B1B1F]'></div>
                    <div className='flex justify-center w-full'>
                        <div className='flex flex-col mt-6 px-7'>
                            <BioType className='inter-h6 text-[24px]'>
                                Action Items
                            </BioType>
                            <div className='w-full mx-auto flex flex-col space-y-6 mt-6'>
                                {actionItems.map(
                                    (item: ActionItemType, index: number) => {
                                        return (
                                            <ActionItem
                                                key={index}
                                                type={formatType(item)}
                                                product_href={item.product_href}
                                            />
                                        );
                                    }
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </Drawer>
        </>
    );
}
