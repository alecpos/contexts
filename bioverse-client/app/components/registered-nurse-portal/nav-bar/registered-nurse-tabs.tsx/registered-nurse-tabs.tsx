'use client';
import { useRouter } from 'next/navigation';
import { Tabs, Tab, Badge } from '@mui/material';
import { useEffect, useState } from 'react';
import styles from '../styles.module.scss';
import { usePathname } from 'next/navigation';
import { getNumberUnreadProviderMessages } from '@/app/utils/actions/message/message-actions';
import useSWR from 'swr';
import { BV_AUTH_TYPE } from '@/app/types/auth/authorization-types';
import { getAdminControlState } from '@/app/utils/database/controller/admin_controlled_items/admin-controlled-items';

interface Props {
    userId: string;
    role: BV_AUTH_TYPE;
}

export default function RegisteredNurseTabs({ userId, role }: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const [lastSegment, setLastSegment] = useState('dashboard');

    const [dashboardActive, setDashboardActive] = useState<boolean>(false);
    const { data } = useSWR('dashboard-active-status', () =>
        getAdminControlState('registered_nurse_dashboard')
    );
    useEffect(() => {
        if (data) {
            setDashboardActive(data.active);
        }
    }, [data]);

    const {
        data: unread_count,
        error: unread_count_error,
        isLoading: unread_count_Loading,
    } = useSWR(`${userId}-unread_count`, () =>
        getNumberUnreadProviderMessages(userId)
    );

    useEffect(() => {
        const segments = pathname.split('/');

        if (segments.includes('dashboard')) {
            setLastSegment('dashboard');
            return;
        } else if (segments.includes('tasks')) {
            setLastSegment('tasks');
            return;
        } else {
            setLastSegment('none');
        }
        // if (segments.includes('all-patients')) {
        //     setLastSegment('all-patients');
        //     return;
        // }
        // if (segments.includes('history')) {
        //     setLastSegment('history');
        //     return;
        // }
    }, [pathname]);

    const handleTabChange = (newValue: string) => {
        router.push(`/registered-nurse/${newValue}`);
    };

    return (
        <Tabs
            className={styles.tabs}
            value={lastSegment === 'none' ? false : lastSegment}
        >
            {[
                (dashboardActive ||
                    role === BV_AUTH_TYPE.ADMIN ||
                    role === BV_AUTH_TYPE.LEAD_PROVIDER) && (
                    <Tab
                        key={'dashboard'}
                        label={
                            <span className='provider-tabs-subtitle-weak'>
                                DASHBOARD
                            </span>
                        }
                        value={'dashboard'}
                        onClick={() => {
                            handleTabChange('dashboard');
                        }}
                    />
                ),
                userId !== 'bb22b7f2-cd8e-4b08-85c8-04f482d52cd5' && (
                    <Tab
                        key={'tasks'}
                        label={
                            <span className='provider-tabs-subtitle'>
                                TASK QUEUE
                            </span>
                        }
                        value={'tasks'}
                        onClick={() => {
                            handleTabChange('tasks');
                        }}
                    />
                ),
            ].filter(Boolean)}
        </Tabs>
    );
}
