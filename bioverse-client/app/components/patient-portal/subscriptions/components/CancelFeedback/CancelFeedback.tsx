'use client';
import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import { SubscriptionStatusCategories } from '@/app/utils/functions/patient-portal/patient-portal-utils';
import { Button, Paper } from '@mui/material';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { useRouter } from 'next/navigation';
import SubscriptionButton from '../SubscriptionButton';
import MultiSelectItem from '@/app/components/intake-v2/questions/question-types/multi-select/multi-select-item';
import Link from 'next/link';

// Inside OrderItemProps definition

interface Props {}

export default function CancelFeedback({}: Props) {
    return (
        <div
            id='main-order-page-component'
            className='container mx-auto w-full mt-[var(--nav-height)] max-w-[456px] mb-[300px] sm:mb-[400px]'
        >
            <div className='w-full mt-9 md:mt-[160px]'>
                <BioType className='h6 text-center text-[#286BA2] text-[24px] md:text-[28px] '>
                    We&apos;ve canceled your subscription.
                </BioType>
                <div className='mt-8 flex flex-col items-center space-y-4'>
                    <Link href={`/portal/subscriptions/`}>
                        <Button variant='contained' className=''>
                            <BioType className='body1 text-white'>
                                Go to subscriptions
                            </BioType>
                        </Button>
                    </Link>
                    <Link href={`/`}>
                        <Button variant='contained' className=''>
                            <BioType className='body1 text-white'>
                                Go home
                            </BioType>
                        </Button>
                    </Link>
                    {/* <SubscriptionButton
                        text="No, I still want my subscription"
                        onClick={() => {
                            
                        }}
                    />
                    <SubscriptionButton
                        text="Yes, I would like to cancel"
                        onClick={cancelSubscription}
                    /> */}
                </div>
            </div>
        </div>
    );
}
