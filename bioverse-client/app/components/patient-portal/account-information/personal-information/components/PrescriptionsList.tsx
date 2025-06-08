'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import {
    SubscriptionListItem,
    formatSubscriptionType,
} from '@/app/utils/functions/patient-portal/patient-portal-utils';
import { Button, Paper } from '@mui/material';
import { isEmpty } from 'lodash';
import Image from 'next/image';
import Link from 'next/link';

interface PrescriptionsListProps {
    activeSubscriptions: SubscriptionListItem[];
}
export default function PrescriptionsList({
    activeSubscriptions,
}: PrescriptionsListProps) {
    const renderPrescriptions = () => {
        return activeSubscriptions.map((prescription, index) => {
            return (
                <div className='flex flex-col space-y-4' key={index}>
                    <div className='flex'>
                        <Image
                            src={`${process.env.NEXT_PUBLIC_PDP_MAIN_IMAGE_KEY}${prescription.image_ref[0]}`}
                            alt={prescription.name}
                            width={72}
                            height={72}
                            className='mr-4 rounded-lg'
                            sizes='(max-width:  68px)  100vw,  68px'
                            unoptimized
                        />
                        <div className='flex flex-col space-y-2 sm:space-y-0 w-full'>
                            <div className='flex justify-between w-full'>
                                <BioType className='body1 text-black text-[16px]'>
                                    {prescription.name}
                                </BioType>
                                <Link
                                    className='hidden sm:block'
                                    href={`/portal/subscriptions/${prescription.id}`}
                                >
                                    <Button
                                        variant='outlined'
                                        sx={{ height: 30 }}
                                    >
                                        <BioType className='body1 text-[13px] text-[#286BA2]'>
                                            VIEW DETAILS
                                        </BioType>
                                    </Button>
                                </Link>
                            </div>
                            <BioType className='body1 text-[#00000099] text-[16px]'>
                                {prescription.variant_text
                                    ? `${prescription.variant_text} x `
                                    : ''}
                                {formatSubscriptionType(
                                    prescription.subscription_type
                                )}
                            </BioType>
                        </div>
                    </div>
                    <Link
                        className='sm:hidden'
                        href={`/portal/subscriptions/${prescription.id}`}
                    >
                        <Button
                            variant='outlined'
                            sx={{ height: 52, width: '100%' }}
                        >
                            <BioType className='body1 text-[13px] text-[#286BA2]'>
                                VIEW DETAILS
                            </BioType>
                        </Button>
                    </Link>
                    {index !== activeSubscriptions.length - 1 && (
                        <div className='w-full h-[1px] bg-[#1B1B1B1F]'></div>
                    )}
                </div>
            );
        });
    };

    if (isEmpty(activeSubscriptions)) {
        return null;
    }

    return (
        <div className='flex flex-col space-y-4'>
            <BioType className='h6 text-[24px] text-[#00000099]'>
                Prescriptions
            </BioType>
            <Paper className='flex flex-col space-y-4 px-7 py-6'>
                {renderPrescriptions()}
            </Paper>
        </div>
    );
}
