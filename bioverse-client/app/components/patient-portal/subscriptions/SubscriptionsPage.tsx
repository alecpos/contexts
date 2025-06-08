'use client';
import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import BioType from '../../global-components/bioverse-typography/bio-type/bio-type';
import { getTMCOrderInformation } from '@/app/services/pharmacy-integration/tmc/tmc-actions';
import { SubscriptionStatusCategories } from '@/app/utils/functions/patient-portal/patient-portal-utils';
import { Paper } from '@mui/material';
import SubscriptionsList from './components/SubscriptionsList';
import PopularTreatments from './components/SubscriptionList/PopularTreatments';

// Inside OrderItemProps definition

interface Props {
    subscriptionPurchaseOrderData: SubscriptionStatusCategories;
    accountProfileData: AccountProfileData | undefined;
}

export default function SubscriptionsPage({
    subscriptionPurchaseOrderData,
    accountProfileData,
}: Props) {
    return (
        <div className='w-full overflow-x-hidden'>
            <div
                id='main-order-page-component'
                className='mx-auto w-full px-4  max-w-[650px]'
            >
                <div className='w-full sm:mt-12'>
                    <BioType className='h6 mb-3 sm:mb-6 sm:text-[36px] text-black'>
                        Your Subscriptions
                    </BioType>

                    <SubscriptionsList
                        subscriptionsData={subscriptionPurchaseOrderData}
                    />
                </div>
            </div>
        </div>
    );
}
