'use client';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import {
    SubscriptionListItem,
    formatSubscriptionType,
} from '@/app/utils/functions/patient-portal/patient-portal-utils';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Button } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import {
    getSplitShipmentRecordsBySubscriptionId,
    getSubscriptionRewewalDate,
} from './utils/SubscriptionItem-functions';
import { convertEpochToDate } from '@/app/utils/functions/dates';
import { useState } from 'react';
import ReactivateSubscriptionDialog from './components/ReactivateSubscriptionDialog';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';

interface Props {
    subscription: SubscriptionListItem;
    status: string;
    reactivation_eligible: boolean;
    final: boolean;
}

export default function SubscriptionItem({
    subscription,
    status,
    final,
    reactivation_eligible,
}: Props) {
    const [isReactivating, setIsReactivating] = useState(false);

    const router = useRouter();

    const handleManageButtonClick = (event: any) => {
        event.preventDefault();
        router.push(`/portal/subscriptions/${subscription.id}`);
    };

    const handleReactivateButtonClick = (event: any) => {
        setIsReactivating(true);
    };

    const renderActionButton = (type: 'mobile' | 'desktop') => {
        switch (status) {
            case 'paused':
                return (
                    <Button
                        variant='outlined'
                        sx={{
                            width: type === 'mobile' ? '100%' : '160px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            height: '36px',
                            borderColor: '#286BA280',
                        }}
                        onClick={() =>
                            router.push(
                                `/portal/subscriptions/${subscription.id}`
                            )
                        }
                    >
                        <BioType className='body1 text-[#286BA2] text-[14px]'>
                            RESUME
                        </BioType>
                        <MoreVertIcon
                            sx={{ color: '#286BA2' }}
                            fontSize='small'
                        />
                    </Button>
                );
            case 'canceled':
                if (reactivation_eligible) {
                    return (
                        <>
                            <Button
                                variant='outlined'
                                // sx={{
                                //     width: '160px',
                                //     display: 'flex',
                                //     // justifyContent: 'space-between',
                                //     backgroundColor: '#000000',
                                //     '&:hover': {
                                //         backgroundColor: '#666666',
                                //     },
                                //     borderRadius: '12px',
                                //     textTransform: 'none',
                                // }}
                                sx={{
                                    width: type === 'mobile' ? '100%' : '160px',
                                    display: 'flex',
                                    height: '36px',
                                    borderColor: '#286BA280',
                                }}
                                onClick={handleReactivateButtonClick}
                            >
                                {/* <BioType className='inter_body_small_bold text-white text-[14px]'>
                            Reactivate
                        </BioType> */}
                                <BioType className='body1 text-[#286BA2] text-[14px]'>
                                    REACTIVATE
                                </BioType>
                            </Button>
                            <ReactivateSubscriptionDialog
                                open={isReactivating}
                                onClose={() => setIsReactivating(false)}
                                subscriptionId={subscription.id}
                                product_href={
                                    subscription.product_href as PRODUCT_HREF
                                }
                            />
                        </>
                    );
                } else {
                    return <></>;
                }

            default:
                return (
                    <Button
                        variant='outlined'
                        sx={{
                            width: type === 'mobile' ? '100%' : '160px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            height: '36px',
                            borderColor: '#286BA280',
                        }}
                        onClick={handleManageButtonClick}
                    >
                        <BioType className='body1 text-[#286BA2] text-[14px]'>
                            MANAGE
                        </BioType>
                        <MoreVertIcon
                            sx={{ color: '#286BA2' }}
                            fontSize='small'
                        />
                    </Button>
                );
        }
    };

    const { data: renewal_data } = useSWR(
        `${subscription.id}-renewal-data`,
        () => getSubscriptionRewewalDate(subscription.id)
    );

    const { data: split_shipment_data } = useSWR(
        `${subscription.id}-split-shipment-data`,
        () => getSplitShipmentRecordsBySubscriptionId(subscription.id)
    );

    return (
        <div className='w-full flex flex-col mt-4  space-y-4'>
            <div className='flex flex-row w-full'>
                <div className='flex w-full'>
                    <Image
                        src={`${process.env.NEXT_PUBLIC_PDP_MAIN_IMAGE_KEY}${
                            subscription?.image_ref?.[0] ?? ''
                        }`}
                        alt={subscription.name}
                        width={68}
                        height={68}
                        className='mr-4 rounded-lg'
                        sizes='(max-width:  68px)  100vw,  68px'
                        unoptimized
                    />
                    <div className='flex flex-col space-y-4'>
                        <BioType className='body1 text-black text-[16px]'>
                            {subscription.name}
                        </BioType>
                        <BioType className='body1 hidden: md:block text-[#00000099] text-[16px]'>
                            {subscription.variant_text
                                ? `${subscription.variant_text} x `
                                : ''}
                            {formatSubscriptionType(
                                subscription.subscription_type
                            )}
                        </BioType>

                        {split_shipment_data && (
                            <div>
                                <BioType className='body1 text-[#00000099] text-[16px]'>
                                    Second shipment date
                                </BioType>
                                <BioType className='body1 text-black text-[16px]'>
                                    {new Date(
                                        split_shipment_data.scheduled_second_supply_date
                                    ).toLocaleDateString()}
                                </BioType>
                            </div>
                        )}

                        {renewal_data && (
                            <div>
                                <BioType className='body1 text-[#00000099] text-[16px]'>
                                    {split_shipment_data
                                        ? 'Subscription renewal date'
                                        : 'Next refill date'}
                                </BioType>
                                <BioType className='body1 text-black text-[16px]'>
                                    {convertEpochToDate(
                                        renewal_data
                                    ).toLocaleDateString()}
                                </BioType>
                            </div>
                        )}
                    </div>
                </div>
                <div className='hidden md:flex flex-col space-y-2'>
                    {renderActionButton('desktop')}
                </div>
            </div>
            <div className='flex flex-col space-y-3 w-full md:hidden'>
                {renderActionButton('mobile')}
            </div>
            {!final && (
                <div className='mx-auto w-[100%] h-[1px] bg-[#1B1B1B1F] mt-4 mb-4'></div>
            )}
        </div>
    );
}
