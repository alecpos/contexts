'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { getAllSubscriptionsForPatient } from '@/app/utils/database/controller/prescription_subscriptions/prescription_subscriptions';

import {
    TableContainer,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
} from '@mui/material';
import useSWR from 'swr';
import LoadingScreen from '@/app/components/global-components/loading-screen/loading-screen';
import dynamic from 'next/dynamic';
import { BV_AUTH_TYPE } from '@/app/types/auth/authorization-types';

interface SubscriptionTabProps {
    access_type: BV_AUTH_TYPE | null;
    profile_data: APProfileData;
}

const DynamicSubscriptionTabRow = dynamic(
    () => import('./components/subscription-accordion'),
    {
        loading: () => <LoadingScreen />,
    }
);

export default function SubscriptionTabContent({
    profile_data,
    access_type,
}: SubscriptionTabProps) {
    const {
        data: subscriptions,
        error,
        isLoading,
    } = useSWR(`subscriptions-${profile_data.id}`, () =>
        getAllSubscriptionsForPatient(profile_data.id)
    );

    const subscriptionList = subscriptions?.data;

    if (isLoading) {
        return <LoadingScreen />;
    }

    if (error) {
        return (
            <>
                <BioType>Error</BioType>
            </>
        );
    }

    return (
        <>
            <div className='flex flex-col w-full justify-center items-center gap-4 mt-4'>
                <div className='flex flex-col w-full justify-center items-center gap-4'>
                    <BioType className='h5'>Subscriptions</BioType>

                    <div className='flex flex-col items-start self-start w-full gap-2'>
                        <TableContainer component={Paper}>
                            <Table aria-label='collapsible table'>
                                <TableHead>
                                    <TableRow>
                                        <TableCell className='body1bold'>
                                            Order #
                                        </TableCell>
                                        <TableCell className='body1'>
                                            Start Date
                                        </TableCell>
                                        <TableCell className='body1'>
                                            Rx Name
                                        </TableCell>
                                        <TableCell className='body1'>
                                            Cadence
                                        </TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell />
                                    </TableRow>
                                    {subscriptionList &&
                                        subscriptionList.map((dataRow) => {
                                            return (
                                                <DynamicSubscriptionTabRow
                                                    subscription={dataRow}
                                                    key={dataRow.id}
                                                    access_type={access_type}
                                                />
                                            );
                                        })}
                                </TableHead>
                            </Table>
                        </TableContainer>
                    </div>
                </div>
            </div>
        </>
    );
}
