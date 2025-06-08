'use client';
import React, { useEffect, useState } from 'react';
import { Button, Paper } from '@mui/material';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { useRouter } from 'next/navigation';

// Inside OrderItemProps definition

interface Props {
    subscription_id: number;
    orderId: string;
    nextDate: Date;
}

export default function CancelInformation({
    subscription_id,
    orderId,
    nextDate,
}: Props) {
    const router = useRouter();

    return (
        <div className='container mx-auto w-full mt-[var(--nav-height)] max-w-[456px] min-h-[90vh]'>
            <div className='w-full mt-9 md:mt-[160px]'>
                <BioType className='h6 text-[24px] md:text-[28px] text-black mb-9'>
                    What to expect after canceling your subscription.
                </BioType>
                <div className='flex flex-col gap-[14px] text-black'>
                    <div className='flex flex-col gap-4'>
                        <BioType className='body1 text-black'>
                            If you continue, your subscription is scheduled to
                            be canceled on the last day of your subscription
                            period: {nextDate.toLocaleDateString()}.
                        </BioType>
                        <BioType className='body1 text-black'>
                            We are sad to see you go.
                        </BioType>
                        <BioType className='body1 text-black'>
                            After your subcription ends, you&apos;ll lose perks
                            like unlimited provider messaging, unlimited
                            adjustments, and curated BIOVERSE content.
                        </BioType>
                        <div>
                            <BioType className='body1bold text-black'>
                                What happens to my current order?
                            </BioType>
                            <div className='flex flex-col space-y-4'>
                                <BioType className='body1 text-black'>
                                    At this time, your order #{orderId} cannot
                                    be canceled or refunded.
                                </BioType>
                                <BioType className='body1 text-black'>
                                    Medication orders can only be canceled 48
                                    hours before they are renewed.
                                    Unfortunately, once an order is processed,
                                    we can&apos;t cancel or refund it. This is
                                    because the pharmacy has already begun the
                                    process of preparing your medication to be
                                    shipped to you. This is to protect the
                                    integrity of the medication and the health
                                    of the patient, as well as to comply with
                                    applicable laws.
                                </BioType>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='mt-8 flex justify-center items-center mx-auto w-full'>
                    <Button
                        variant='contained'
                        className='w-full md:w-auto'
                        sx={{
                            height: '52px',
                        }}
                        onClick={() => {
                            router.push(
                                `/portal/subscriptions/cancel-flow/${subscription_id}/cancel`
                            );
                        }}
                    >
                        <BioType className=''>Continue</BioType>
                    </Button>
                </div>
            </div>
        </div>
    );
}
