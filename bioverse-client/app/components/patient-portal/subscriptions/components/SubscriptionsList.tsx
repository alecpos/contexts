'use client';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import {
    SubscriptionStatusCategories,
    getAllProductHrefs,
} from '@/app/utils/functions/patient-portal/patient-portal-utils';
import { useEffect, useState } from 'react';
import SubscriptionItem from './SubscriptionList/SubscriptionItem';
import { Paper } from '@mui/material';
import PopularTreatmentItem from './SubscriptionList/components/PopularTreatmentItem';
import PopularTreatments from './SubscriptionList/PopularTreatments';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';

interface Props {
    subscriptionsData: SubscriptionStatusCategories;
}

interface StatusBarProperty {
    name: string;
    bgColor: string;
}

interface StatusBarProperties {
    [key: string]: StatusBarProperty;
    active: StatusBarProperty;
    'pending-approval': StatusBarProperty;
    paused: StatusBarProperty;
    canceled: StatusBarProperty;
}

const defaultSubscriptionState = {
    canceled: [],
    active: [],
    paused: [],
    'pending-approval': [],
    unknown: [],
    'scheduled-cancel': [],
};

const statusBarProperties: StatusBarProperties = {
    active: { name: 'Active', bgColor: 'bg-[#2E7D324D]' },
    'pending-approval': { name: 'Pending Approval', bgColor: 'bg-[#286BA24D]' },
    paused: { name: 'Paused', bgColor: 'bg-[#EF6C004D]' },
    canceled: { name: 'Canceled', bgColor: 'bg-[#D32F2F4D]' },
    unknown: { name: 'Unknown', bgColor: 'bg-[#b1b1b1]' },
    'scheduled-cancel': {
        name: 'Scheduled Canceled',
        bgColor: 'bg-[#D32F2F4D]',
    },
};

export default function SubscriptionsList({ subscriptionsData }: Props) {
    const [subscriptions, setSubscriptions] =
        useState<SubscriptionStatusCategories>(defaultSubscriptionState);

    useEffect(() => {
        if (subscriptionsData) {
            setSubscriptions(subscriptionsData);
        }
    }, [subscriptionsData]);

    function areAllKeysEmpty(
        subscriptionStatusCategories: SubscriptionStatusCategories
    ): boolean {
        return Object.keys(subscriptionStatusCategories).every(
            (key) =>
                subscriptionStatusCategories[
                    key as keyof SubscriptionStatusCategories
                ].length === 0
        );
    }

    console.log(subscriptionsData);

    const getReactivationEligible = (product_href: PRODUCT_HREF) => {
        // Check if there are any active or scheduled-cancel subscriptions with the same product_href
        const hasActiveSubscription = subscriptionsData.active.some(
            (subscription) => subscription.product_href === product_href
        );
        const hasScheduledCancelSubscription = subscriptionsData[
            'scheduled-cancel'
        ].some((subscription) => subscription.product_href === product_href);

        // Return true if there are no active or scheduled-cancel subscriptions with the same product_href
        return !hasActiveSubscription && !hasScheduledCancelSubscription;
    };

    function renderNoSubscriptions() {
        return (
            <Paper elevation={2} className='py-3 px-5 w-full'>
                <div
                    className={`mb-8 bg-black flex justify-center items-center self-stretch h-6 rounded-[100px] p-4`}
                >
                    <BioType className='body1 text-[13px] text-white'>
                        You have no subscriptions.
                    </BioType>
                </div>
            </Paper>
        );
    }

    function renderPopulatedArrays(
        subscriptions: SubscriptionStatusCategories
    ) {
        const elements: any = [];

        Object.entries(subscriptions).forEach(([key, value], index) => {
            if (value.length > 0) {
                elements.push(
                    <Paper
                        elevation={2}
                        className='py-3 px-5 w-full'
                        key={index}
                    >
                        <div className='w-full' key={key}>
                            {/* Status Bar */}
                            <div
                                className={`${statusBarProperties[key]['bgColor']} flex justify-center items-center self-stretch h-6 rounded-[100px] p-4`}
                            >
                                <BioType className='body1 text-[13px]'>
                                    {statusBarProperties[key]['name']}
                                </BioType>
                            </div>
                            {/* Render Subscription Items */}
                            <div className='flex flex-col'>
                                {value.map((v, index) => (
                                    <SubscriptionItem
                                        subscription={v}
                                        key={index}
                                        status={key}
                                        final={index === value.length - 1}
                                        reactivation_eligible={getReactivationEligible(
                                            v.product_href as PRODUCT_HREF
                                        )}
                                    />
                                ))}
                            </div>
                        </div>
                    </Paper>
                );
            }
        });
        return elements;
    }

    return (
        <div className='flex flex-col space-y-4'>
            {areAllKeysEmpty(subscriptionsData) && renderNoSubscriptions()}
            {renderPopulatedArrays(subscriptionsData)}
            <BioType className='h6 sm:mb-4 mt-16 sm:text-[36px] text-black'>
                Popular Treatments
            </BioType>
            <PopularTreatments
                filtered={getAllProductHrefs(subscriptionsData)}
            />
        </div>
    );
}
