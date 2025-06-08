'use client';

import { Button } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import { signOutUser } from '@/app/utils/actions/auth/server-signIn-signOut';
import { analytics } from '@/app/components/analytics';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import Link from 'next/link';

/*
NAV LAYOUT FOR PATIENT PORTAL

02/02/2024 - @Olivier
 - Added dropdown menu for clicking on My Account

*/

interface Props {}

export default function PatientPortalNavBarButtons({}: Props) {
    const pathname = usePathname();
    const currentPath = pathname.split('/')[2];
    const router = useRouter();

    const navElements = [
        {
            name: 'SUBSCRIPTIONS',
            path: 'subscriptions',
        },
        {
            name: 'ORDERS',
            path: 'order-history',
        },
        {
            name: 'MESSAGES',
            path: 'message',
        },
        {
            name: 'LABS',
            path: 'labs',
        },
        {
            name: 'ACCOUNT',
            path: 'account-information',
        },
    ];

    const renderNavElements = () => {
        return navElements.map((navElement, index) => {
            return (
                <div
                    className='h-full no-underline group'
                    onClick={() => router.push(`/portal/${navElement.path}`)}
                    key={index}
                >
                    <div
                        className={`flex flex-col px-3 justify-center ${
                            currentPath === 'subscriptions' ||
                            currentPath === 'order-history'
                                ? 'h-full'
                                : 'h-[98%]'
                        } ${
                            currentPath === navElement.path &&
                            'border-b-2 border-[#286BA2] border-solid border-t-0 border-l-0 border-r-0'
                        } hover:border-b-2 hover:border-[#286BA2] hover:border-solid cursor-pointer hover:border-t-0 hover:border-l-0 hover:border-r-0`}
                        key={index}
                    >
                        <BioType
                            className={`body1 text-[15px] ${
                                currentPath === navElement.path
                                    ? 'text-[#286BA2]'
                                    : 'text-[#1B1B1B99]'
                            } group-hover:text-[#286BA2]`}
                        >
                            {navElement.name}
                        </BioType>
                    </div>
                </div>
            );
        });
    };

    return (
        <div className={`flex justify-end`}>
            <div className='flex items-center h-full mr-[0.83vw]'>
                {renderNavElements()}
                <Link href='/collections' className='mr-6 ml-8'>
                    <Button variant='contained' sx={{ height: 42 }}>
                        <BioType className='body1 text-white text-[16px]'>
                            SHOP
                        </BioType>
                    </Button>
                </Link>
                <div className='mr-4'>
                    <BioType
                        onClick={() => {
                            analytics.reset();
                            signOutUser();
                        }}
                        className='hover:text-[#286BA2] cursor-pointer body1 text-[16px] text-[#1B1B1B99]'
                    >
                        LOG OUT
                    </BioType>
                </div>
            </div>
        </div>
    );
}
