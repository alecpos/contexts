'use client';
import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import { SubscriptionStatusCategories } from '@/app/utils/functions/patient-portal/patient-portal-utils';
import { Paper } from '@mui/material';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { useRouter } from 'next/navigation';
import SubscriptionButton from '../SubscriptionButton';

// Inside OrderItemProps definition

interface Props {
    subscription_id: number;
}

export default function ResumeSubscription({ subscription_id }: Props) {
    const router = useRouter();

    const cancelSubscription = () => {
        console.log('hi');
    };

    return (
        <div
            id='main-order-page-component'
            className='container mx-auto w-full mt-[var(--nav-height)] max-w-[456px]'
        >
            <div className='w-full mt-9 md:mt-[160px]'>
                <div className='flex flex-col space-y-[14px]'>
                    <BioType className='h6 text-[24px] md:text-[28px] text-black'>
                        Would you like to reactive your [] prescription?
                    </BioType>
                    <BioType className='body1 text-[16px] text-black'>
                        If you continue with canceling your order you will no
                        longer receive new shipments of your prescription. You
                        can reactive your subscription at any time through your
                        Orders tab.
                    </BioType>
                </div>
                <div className='flex flex-col space-y-3 mt-3'>
                    <SubscriptionButton
                        text='No, I still want my subscription'
                        onClick={() => {
                            router.push(
                                `/portal/subscriptions/${subscription_id}`
                            );
                        }}
                    />
                    <SubscriptionButton
                        text='Yes, I would like to cancel'
                        onClick={cancelSubscription}
                    />
                </div>
            </div>
        </div>
    );
}
