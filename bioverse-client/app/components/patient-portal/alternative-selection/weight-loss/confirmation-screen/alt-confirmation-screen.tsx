'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { Button } from '@mui/material';
import Link from 'next/link';
import router from 'next/router';
import Image from 'next/image';
import AltNextStepsCard from './components/alt-next-steps-card';
import AltPopularTreatments from './components/alt-popular-treatments';

interface ConfirmationScreenProps {}

export default function AltConfirmationScreenComponents({}: ConfirmationScreenProps) {
    return (
        <div className='w-full bg-[#fafafa] flex flex-col items-center justify-center overflow-x-hidden pb-24'>
            <div className='w-[90vw] md:max-w-[520px] flex flex-col items-center'>
                <div className='sm:w-[460px] flex flex-col mt-28 sm:mt-10 items-center'>
                    <Link href='/collections'>
                        <Image
                            src={`${process.env.NEXT_PUBLIC_PDP_MAIN_IMAGE_KEY}brand/logo/bioverse-logo-new.png`}
                            width={222}
                            height={58}
                            alt={'logo'}
                            unoptimized
                        />
                    </Link>
                    <div className='w-full gap-4 flex flex-col'>
                        <BioType className='text-[1.5rem] md:text-[2.25rem] font-twcmedium text-primary my-1'>
                            Your virtual consultation is now complete!
                        </BioType>

                        <BioType className='!font-twcsemimedium text-[28px] sm:text-start sm:my-0 sm:text-[32px] text-black'>
                            What&apos;s next?
                        </BioType>
                    </div>
                    <div className='w-full flex flex-col space-y-[20px] mt-[20px]'>
                        <AltNextStepsCard
                            title='After provider review & approval, we will ship your medication.'
                            duration='7-10 business days'
                            description='If approved, your treatment will be charged to the card you provided and  shipped to you discreetly.'
                            borderColor='#3B8DC5'
                        />
                    </div>
                    <BioType className='self-start sm:self-center text-black !font-twcsemimedium text-[32px] mt-3 sm:mt-5 mb-2 sm:mb-3'>
                        Popular Treatments
                    </BioType>
                </div>
            </div>
            <div className='w-full flex flex-col items-center'>
                <div className='w-[90vw] md:max-w-[1000px] items-center flex'>
                    <AltPopularTreatments
                        filtered={['semaglutide', 'tirzepatide']}
                    />
                </div>
            </div>
            <div className='w-[90vw] md:max-w-[520px] flex flex-col items-center'>
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
}
