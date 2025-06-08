'use client';

import BioType from '../../global-components/bioverse-typography/bio-type/bio-type';
import CardLink from '../../provider-portal/welcome/components/CardLink';
import { useEffect, useState } from 'react';
import LoadingScreen from '../../global-components/loading-screen/loading-screen';
import { getAdminControlState } from '@/app/utils/database/controller/admin_controlled_items/admin-controlled-items';
import useSWR from 'swr';
import { BV_AUTH_TYPE } from '@/app/types/auth/authorization-types';

interface RegisteredNurseWelcomeComponentProps {
    name: string;
    role: BV_AUTH_TYPE;
}

export interface CardDataProps {
    name: string;
    url: string;
    icon: string;
}

export default function RegisteredNurseWelcomeComponent({
    name,
}: RegisteredNurseWelcomeComponentProps) {
    const [loading, setLoading] = useState<boolean>(false);

    const [dashboardActive, setDashboardActive] = useState<boolean>(false);
    const { data } = useSWR('dashboard-active-status', () =>
        getAdminControlState('registered_nurse_dashboard')
    );
    useEffect(() => {
        if (data) {
            setDashboardActive(data.active);
        }
    }, [data]);

    const cardData: CardDataProps[] = [
        {
            name: 'RN Dashboard',
            url: '/registered-nurse/dashboard',
            icon: 'dashboard',
        },
        {
            name: 'Registered Nurse Task Queue',
            url: '/registered-nurse/tasks',
            icon: 'list-numbered',
        },
        {
            name: 'All Orders',
            url: '/coordinator/all-orders',
            icon: 'list-numbered',
        },
    ];

    if (loading) {
        return (
            <div
                style={{
                    background:
                        'linear-gradient(180deg, #DDEAEE 15.71%, #FFF 63.04%)',
                }}
                className='w-full min-h-screen -mt-[var(--nav-height)] flex justify-center animate-appear'
            >
                <LoadingScreen />
            </div>
        );
    }

    return (
        <div
            style={{
                background:
                    'linear-gradient(180deg, #DDEAEE 15.71%, #FFF 63.04%)',
            }}
            className='w-full min-h-screen -mt-[var(--nav-height)] flex justify-center animate-appear'
        >
            <div className='flex flex-col w-[70%] mt-24'>
                <div className='flex w-full mt-[64px] justify-between items-center'>
                    <BioType className={`itd-h1 text-primary`}>
                        Welcome, <span className='text-black'>{name}</span>
                    </BioType>
                </div>
                <div className='w-full h-[1px] bg-gray-300 mt-3 mb-[24px]'></div>
                <div className='flex w-full flex-wrap gap-[24px] justify-center'>
                    {cardData.map((data: CardDataProps, index: number) => {
                        if (!dashboardActive && data.name === 'RN Dashboard') {
                            return null;
                        }
                        return (
                            <CardLink
                                name={data.name}
                                url={data.url}
                                icon={data.icon}
                                key={index}
                                setLoading={setLoading}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
