'use client';
import { usePathname, useRouter } from 'next/navigation';

import { Tab, Tabs } from '@mui/material';
import { useEffect, useState } from 'react';

export default function PortalNavTopMenu() {
    const router = useRouter();
    const pathname = usePathname();

    const currentPath = pathname.split('/')[2];

    const paths = [
        'subscriptions',
        'order-history',
        'message',
        'account-information',
    ];

    const isCurrentPathInPaths = paths.includes(currentPath);

    // Initialize tabSelected state based on whether currentPath is in paths
    const [tabSelected, setTabSelected] = useState<string | boolean>(
        isCurrentPathInPaths ? currentPath : false,
    );

    return (
        <div className=" bg-white shadow-navbar w-screen ">
            <Tabs
                value={tabSelected}
                variant="scrollable"
                scrollButtons="auto"
                textColor="primary"
                indicatorColor="primary"
                aria-label="secondary tabs example"
                // onChange={handleTabChange}
            >
                <Tab
                    sx={{
                        paddingBottom: '0px',
                        fontSize: '14px',
                    }}
                    value="subscriptions"
                    label="SUBSCRIPTIONS"
                    onClick={() => {
                        setTabSelected('subscriptions');
                        router.push('/portal/subscriptions');
                    }}
                    className="text-[14px]"
                />
                <Tab
                    sx={{
                        paddingBottom: '0px',

                        fontSize: '14px',
                    }}
                    value="order-history"
                    label="ORDERS"
                    onClick={() => {
                        setTabSelected('order-history');
                        router.push('/portal/order-history');
                    }}
                    className="text-[14px]"
                />
                <Tab
                    sx={{
                        paddingBottom: '0px',

                        fontSize: '14px',
                    }}
                    value="message"
                    label="MESSAGES"
                    onClick={() => {
                        setTabSelected('message');
                        router.push('/portal/message');
                    }}
                    className="text-[14px]"
                />
                <Tab
                    sx={{ paddingBottom: '0px' }}
                    value="labs"
                    label="LABS"
                    onClick={() => {
                        setTabSelected('labs');
                        router.push('/portal/labs');
                    }}
                    className="text-[14px]"
                />
                <Tab
                    sx={{
                        paddingBottom: '0px',

                        fontSize: '14px',
                    }}
                    value="account-information"
                    label="ACCOUNT"
                    onClick={() => {
                        setTabSelected('account-information');
                        router.push('/portal/account-information');
                    }}
                />
            </Tabs>
        </div>
    );
}
