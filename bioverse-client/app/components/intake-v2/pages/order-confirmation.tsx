'use client';

import React, { useEffect } from 'react';
import { Button } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import { mapCodeToProduct } from '@/app/services/tracking/constants';
import Image from 'next/image';
import BioType from '../../global-components/bioverse-typography/bio-type/bio-type';
import NextStepsCard from '../order-confirmation-new/components/NextStepsCard';
import Link from 'next/link';
import PopularTreatments from '../../patient-portal/subscriptions/components/SubscriptionList/PopularTreatments';

function formatProductName(productName: any) {
    const words = productName.replace(/-/g, ' ').split(' ');

    const capitalizedWords = words.map(
        (word: any) => word.charAt(0).toUpperCase() + word.slice(1)
    );

    return capitalizedWords.join(' ');
}

export const OrderConfirmation = () => {
    const searchParams = useSearchParams();
    const product_name = mapCodeToProduct(searchParams.get('pn') ?? '');
    const router = useRouter();

    return (
        <div className='w-full bg-[#fafafa] flex justify-center overflow-x-hidden pb-24'>
            <div className='w-[90%] flex flex-col items-center'>
                <div className='sm:w-[460px] flex flex-col mt-8 sm:mt-20 items-center'>
                    <Link href='/collections'>
                        <Image
                            src={`${process.env.NEXT_PUBLIC_PDP_MAIN_IMAGE_KEY}brand/logo/bioverse-logo-new.png`}
                            width={222}
                            height={58}
                            alt={'logo'}
                            unoptimized
                        />
                    </Link>
                    <div className='w-full mt-8'>
                        <BioType className='h4 text-[#286BA2] text-[32px]'>
                            Your virtual consultation is now complete
                        </BioType>

                        <BioType className='body1 text-black text-[20px] mt-4 sm:mt-3 mb-4 sm:mb-4'>
                            The answers from your online visit have been sent to
                            your medical provider for review.
                        </BioType>
                        <BioType className='!font-twcmedium text-[28px] mt-5 -mb-1 sm:text-center sm:my-0 sm:text-[32px] text-black'>
                            What&apos;s next?
                        </BioType>
                    </div>
                    <div className='w-full flex flex-col space-y-[20px] mt-[20px]'>
                        <NextStepsCard
                            title='Your provider reviews your request'
                            duration='Avg. 2-3 business days'
                            description='Your provider may reach out via our secure chat in the patient portal if they have any additional questions for you.'
                            borderColor='#11487F'
                        />
                        <NextStepsCard
                            title='We’ll ship your treatment'
                            duration='Avg. 5-7 business days'
                            description='If approved, your treatment will be charged to the card you provided and  shipped to you discreetly.'
                            borderColor='#2E7599'
                        />
                    </div>
                    <BioType className='self-start sm:self-center text-black !font-twcmedium text-[32px] mt-3 sm:mt-5 mb-2 sm:mb-3'>
                        Popular Treatments
                    </BioType>
                </div>
                <div className='w-[90%]'>
                    <PopularTreatments filtered={[product_name]} />
                </div>
                <div className='sm:w-[460px] mt-8 flex flex-col space-y-4 items-center'>
                    <div className='h-[1px] w-full bg-[#1B1B1B1F] mt-4 mb-2'></div>
                    <BioType className='body1 text-black text-[18px] text-center'>
                        Any other questions? Contact the BIOVERSE Care Team at{' '}
                        <a
                            href='mailto:support@gobioverse.com'
                            className='text-[#286BA2]'
                        >
                            support@gobioverse.com
                        </a>
                    </BioType>
                    <div className='h-[1px] w-full bg-[#1B1B1B1F] my-4'></div>
                    <div className='space-y-24'>
                        <Button
                            variant='contained'
                            sx={{ height: 42, width: 237 }}
                            onClick={() => router.push('/portal/order-history')}
                        >
                            <BioType className='text-white text-[16px] body1'>
                                Go to my secure portal
                            </BioType>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
