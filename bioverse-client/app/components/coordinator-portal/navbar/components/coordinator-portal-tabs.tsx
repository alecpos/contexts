'use client';
import { useRouter } from 'next/navigation';
import { Tabs, Tab } from '@mui/material';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { getNumberUnreadMessages } from '@/app/utils/actions/message/message-actions';
import { BV_AUTH_TYPE } from '@/app/types/auth/authorization-types';
import { determineAccessByRoleName } from '@/app/utils/functions/auth/authorization/authorizaiton-helper';

interface Props {
    userId: string;
    user_role: BV_AUTH_TYPE;
}

export default function CoordinatorNavBarTabs({ userId, user_role }: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const [lastSegment, setLastSegment] = useState('dashboard');

    useEffect(() => {
        const segments = pathname.split('/');
        const segmentToCheck = [
            'messages',
            'all-patients',
            'all-orders',
            'tasks',
        ].find((segment) => segments.includes(segment));

        switch (segmentToCheck) {
            case 'messages':
                setLastSegment('messages');
                break;
            case 'all-patients':
                setLastSegment('all-patients');
                break;
            case 'tasks':
                setLastSegment('tasks');
                break;
            case 'all-orders':
                setLastSegment('all-orders');
                break;
            default:
                setLastSegment('dashboard');
        }
    }, [pathname]);

    const handleTabChange = (newValue: string) => {
        if (newValue == 'dashboard') {
            router.push(`/coordinator`);
            return;
        }

        router.push(`/coordinator/${newValue}`);
        return;
    };

    return (
        <>
            <Tabs
                value={lastSegment}
                sx={{
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignContent: 'center',
                    alignItems: 'center',
                    minHeight: '80px',
                }}
            >
                <Tab
                    key={'dashboard'}
                    label={'DASHBOARD'}
                    value={'dashboard'}
                    onClick={() => {
                        handleTabChange('dashboard');
                    }}
                    sx={{
                        display: 'flex',
                        height: '100%',
                        minHeight: '80px',
                    }}
                />
                <Tab
                    key={'messages'}
                    label={'MESSAGES'}
                    value={'messages'}
                    onClick={() => {
                        handleTabChange('messages');
                    }}
                    sx={{
                        display: 'flex',
                        height: '100%',
                        minHeight: '80px',
                    }}
                />
                <Tab
                    key={'tasks'}
                    label={'TASKS'}
                    value={'tasks'}
                    onClick={() => {
                        handleTabChange('tasks');
                    }}
                    sx={{
                        display: 'flex',
                        height: '100%',
                        minHeight: '80px',
                    }}
                />

                <Tab
                    key={'allpatients'}
                    label={'ALL PATIENTS'}
                    value={'all-patients'}
                    onClick={() => {
                        handleTabChange('all-patients');
                    }}
                    sx={{
                        display: 'flex',
                        height: '100%',
                        minHeight: '80px',
                    }}
                />
                {determineAccessByRoleName(
                    user_role,
                    BV_AUTH_TYPE.LEAD_COORDINATOR
                ) && (
                    <Tab
                        key={'allorders'}
                        label={'ALL ORDERS'}
                        value={'all-orders'}
                        onClick={() => {
                            handleTabChange('all-orders');
                        }}
                        sx={{
                            display: 'flex',
                            height: '100%',
                            minHeight: '80px',
                        }}
                    />
                )}
                {/* <Tab
                    key={'messages'}
                    label={
                        <div className='flex'>
                            MESSAGES
                            <Badge
                                sx={{ marginLeft: 2 }}
                                badgeContent={unreadCount}
                                color='primary'
                            ></Badge>
                        </div>
                    }
                    value={'messages'}
                    onClick={() => {
                        handleTabChange('messages');
                    }}
                    sx={{
                        display: 'flex',
                        height: '100%',
                        minHeight: '80px',
                    }}
                /> */}
            </Tabs>
        </>
    );
}
