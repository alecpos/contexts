'use client';


import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import LoadingScreen from '@/app/components/global-components/loading-screen/loading-screen';
import { triggerEvent } from '@/app/services/customerio/customerioApiFactory';

import {
    retrieveStripeSubscription,
} from '@/app/services/stripe/subscriptions';

import { getAllSubscriptionsForPatient } from '@/app/utils/database/controller/prescription_subscriptions/prescription_subscriptions';

import { useRouter } from 'next/navigation';
import { Fragment, useEffect, useState } from 'react';
import useSWR from 'swr';


interface SubscriptionTabProps {
    patient_data: DBPatientData;
    isOpenSubscriptions:boolean;
}

export default function SubscriptionTabContent({
    patient_data,
    isOpenSubscriptions
}: SubscriptionTabProps) {
    const {
        data: subscriptions,
        error,
        isLoading,
    } = useSWR(isOpenSubscriptions?`subscriptions-${patient_data.id}` : null , () =>
        getAllSubscriptionsForPatient(patient_data.id),
    );

    const subscriptionList = subscriptions?.data;

    if (isLoading) {
        return <LoadingScreen />;
    }

    if (error) {
        return (
            <>
                <BioType>Error</BioType>
            </>
        );
    }

    return (
        <>
            <div className="flex flex-col w-full justify-center items-center gap-4 ">
                <div className="flex flex-col w-full justify-center items-center gap-4">
                    <div className="flex flex-col items-start self-start w-full gap-2">

                        {subscriptionList && subscriptionList.length<1 && <BioType className='itd-input'>No subscriptions exist</BioType>}
                        {subscriptionList&& subscriptionList.length>0 && subscriptionList.map((dataRow) => {
                                return (
                                    <>
                                    <SubscriptionTabRow
                                        subscription={dataRow}
                                        key={dataRow.id}
                                        />
                                        </>
                                );
                            })}
                                
                    </div>
                </div>
            </div>
        </>
    );
}

interface SubscriptionTabRowProps {
    subscription: SubscriptionTableItem;
}

function SubscriptionTabRow({ subscription }: SubscriptionTabRowProps) {
    const [stripeData, setStripeData] = useState<any>();

    useEffect(() => {
        if (subscription.stripe_subscription_id) {
            (async () => {
                setStripeData(
                    JSON.parse(
                        await retrieveStripeSubscription(
                            subscription.stripe_subscription_id,
                        ),
                    ),
                );
            })();
        }
    }, [subscription]);

    const convertTimestamp = (timestamp: string) => {
        if (!timestamp) {
            return 'not tracked';
        }

        const date = new Date(timestamp);
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        };
        return new Intl.DateTimeFormat('en-US', options).format(date);
    };

    function convertEpochToReadableTimestamp(epoch: number): string {
        const date = new Date(epoch * 1000); // Convert epoch to milliseconds
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        };
        return new Intl.DateTimeFormat('en-US', options).format(date);
    }

    const redirectToOrderId = (order_id: string) => {
        const url = `/provider/intakes/${order_id}`;
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
        <>
            <Fragment>
            
                <div className="flex flex-col justify-start items-start py-6">
                    <div>

                        <div className="flex flex-col ">
                            <BioType className="itd-input">Subscription start Date</BioType>
                            <BioType className="itd-body">
                            {convertTimestamp(subscription.created_at)}
                            </BioType>
                        </div>
                    
                    </div>
                    <div className="flex flex-col justify-start items-start gap-2">
                    <div className="flex flex-col ">
                            <BioType className="itd-input">Subscription ID:</BioType>
                            <BioType className="itd-body">
                            {subscription.id}
                            </BioType>
                        </div>
                        
                        <div>
                            <BioType className="itd-input">
                                Stripe Data:
                            </BioType>

                            {stripeData && (
                                <div className="flex flex-col pl-2 body2">
                                    <BioType>
                                        Name:{' '}
                                        {subscription.product.name}
                                    </BioType>
                                    <BioType>
                                        Cadence:{' '}
                                        {
                                            subscription.subscription_type
                                        }
                                    </BioType>
                                    <BioType>
                                        Recurring price:{' '}
                                        {Number(
                                            stripeData.plan.amount,
                                        ) / 100}
                                    </BioType>
                                    <BioType className="flex flex-row gap-2">
                                        Discount applied ?:{' '}
                                        {subscription.order
                                            .discount_id ? (
                                            <BioType className="body2 text-primary">
                                                True
                                            </BioType>
                                        ) : (
                                            <BioType className="body2 text-red-500">
                                                False
                                            </BioType>
                                        )}
                                    </BioType>
                                    <BioType>
                                        Next renewal date:{' '}
                                        {stripeData &&
                                            stripeData.current_period_end &&
                                            convertEpochToReadableTimestamp(
                                                stripeData.current_period_end,
                                            )}
                                    </BioType>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            
            </Fragment>
        </>
    );
}

