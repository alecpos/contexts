'use client';
import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import { SubscriptionStatusCategories } from '@/app/utils/functions/patient-portal/patient-portal-utils';
import { Paper } from '@mui/material';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import PaperButton from './components/PaperButton';
import { SubscriptionDetails } from '../../types/subscription-types';

// Inside OrderItemProps definition

interface Props {
    subscription_id: number;
    cancelRoute: string;
    subscription: SubscriptionDetails;
}

export default function ManageSubscription({
    subscription_id,
    cancelRoute,
    subscription,
}: Props) {
    return (
        <div
            id='main-order-page-component'
            className='w-full  mb-[300px] flex justify-center'
        >
            <div className='mt-8 md:mt-36'>
                <BioType className='h6 mb-[14px] text-[24px] sm:text-[28px] text-[#286BA2]'>
                    Manage your subscription
                </BioType>
                <BioType className='body1 text-[16px] text-black'>
                    Update your subscription to better suit your needs and
                    goals.
                </BioType>
                <div className='mt-3'>
                    <PaperButton
                        title='Take a break'
                        subtext='Change your next processing date'
                        route={`/portal/subscriptions/refill/${subscription_id}`}
                    />
                </div>
                <div className='mt-3'>
                    <PaperButton
                        title='Cancel plan'
                        subtext='End subscription'
                        route={cancelRoute}
                    />
                </div>
            </div>
        </div>
    );
}
