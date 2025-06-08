'use client';
import BioType from '../../global-components/bioverse-typography/bio-type/bio-type';
import CardLink from './components/CardLink';
import { useEffect, useState } from 'react';
import LoadingScreen from '../../global-components/loading-screen/loading-screen';
import { getAdminControlState } from '@/app/utils/database/controller/admin_controlled_items/admin-controlled-items';
import useSWR from 'swr';

interface ProviderWelcomeComponentProps {
    name: string;
    user_id: string;
}

export interface CardDataProps {
    name: string;
    url: string;
    icon: string;
}

export default function ProviderWelcomeComponent({
    name,
    user_id,
}: ProviderWelcomeComponentProps) {
    const [loading, setLoading] = useState<boolean>(false);

    const [dashboardActive, setDashboardActive] = useState<boolean>(false);
    const { data } = useSWR('dashboard-active-status', () =>
        getAdminControlState('provider_dashboard')
    );
    useEffect(() => {
        if (data) {
            setDashboardActive(data.active);
        }
    }, [data]);

    const cardData: CardDataProps[] = [
        {
            name: 'Provider Dashboard',
            url: '/provider/dashboard',
            icon: 'dashboard',
        },
        {
            name: 'Provider Task Queue',
            url: '/provider/tasks',
            icon: 'list-numbered',
        },
        {
            name: 'All Patients',
            url: '/provider/all-patients',
            icon: 'profile',
        },
        {
            name: 'History',
            url: '/provider/history',
            icon: 'clock',
        },
        {
            name: 'Messages',
            url: '/provider/messages',
            icon: 'message',
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
                    {/* <div className="flex flex-col w-[260px] space-y-1">
                        <Button
                            variant="contained"
                            fullWidth
                            sx={{
                                backgroundColor: '#000000',
                                minHeight: '42px',
                            }}
                        >
                            Start Your Session
                        </Button>
                        <BioType className="it-body text-textSecondary">
                            Starting your session will start counting your work
                            hours.
                        </BioType>
                    </div> */}
                </div>
                <div className='w-full h-[1px] bg-gray-300 mt-3 mb-[24px]'></div>
                <div className='flex w-full flex-wrap gap-[24px] justify-center'>
                    {cardData.map((data: CardDataProps, index: number) => {
                        if (
                            !dashboardActive &&
                            data.name === 'Provider Dashboard'
                        ) {
                            return null;
                        }

                        //LEGITSCRIPTCODETOREMOVE
                        if (
                            user_id ===
                                'bb22b7f2-cd8e-4b08-85c8-04f482d52cd5' &&
                            (data.name === 'Provider Task Queue' ||
                                data.name === 'Messages' ||
                                data.name === 'History' ||
                                data.name === 'All Patients')
                        ) {
                            return null;
                        }
                        //end legit script code.

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
